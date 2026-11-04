'use client';

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';

/* ============================================================================
   THREE TIERS OF ENTRANCE — AND, SINCE 4 NOVEMBER 2026, WHAT ELSE MOVES.

   Everything that enters, enters in one of three tiers:

     RISE     a heading: each line slides up from behind its own edge,
              0.6s on --ease-rise, 60ms between lines (`Rise`); the page's
              one marked phrase draws its marker in as the line lands
     FADE-UP  text, labels and buttons: 0.9s on --ease-in-view, rising 24px
              (`InView`)
     PICTURE  a picture: a 0.6s fade with no travel, while the picture
              inside settles from 1.06 to 1 over 1.2s (`InView
              mode="picture"` and a `.settle` wrapper, globals.css)

   The reference's letter churn and its marquee are gone (Phase C, 28
   September 2026) and stay gone. Hover and press are the stylesheet's
   (THE HOVER LANGUAGE in globals.css), joined on 4 November 2026 by the
   spotlight ring (`.spot`), the magnetic primary button (fx/Magnetic.tsx)
   and the project cards' own loops on hover (fx/HoverVideo.tsx).

   WHAT THE OWNER OPENED ON 4 NOVEMBER 2026, having confirmed the two
   Framer University interactions on 3 November (DESIGN-DECISIONS.md):

     THE DECK    the services on Home are a card-shuffle stack driven by
                 the reader's scroll (fx/CardShuffle.tsx, on `motion`).
                 Scrolling is still the browser's own: no smoothing.
     THE CURSOR  an inverted cursor follows a mouse or a pen on a short
                 spring (fx/InvertedCursor.tsx), loaded only on a fine
                 pointer after its first move, never on touch.
     THE CANVAS  the workflow canvas (fx/WorkflowCanvas.tsx) is the one
                 thing on the site that loops: an execution played through
                 a drawn system while it is in view, resting 1.5s between
                 runs, with a visible 44px PAUSE control (WCAG 2.2.2), and
                 fully static under prefers-reduced-motion.

   `motion` is imported inside components/fx/* only; nothing in the shell,
   the bar or the footer carries it.

   THE ONE EXCEPTION THAT PREDATES ALL OF THIS, BY THE OWNER'S DECISION OF
   26 SEPTEMBER 2026: the Contraxis system diagram (components/
   SystemDiagram.tsx). Small dots ride its lines when the reader points at
   it or tabs into it, for under five seconds at a time, and never loop.
   Its rule is unchanged.

   AND THE REFERENCE'S LOADER, BY THE OWNER'S REQUEST OF 27 SEPTEMBER 2026:
   the curtain (lib/curtain.ts), cut to a first-arrival beat on 4 November
   2026. What it asks of this file is one thing: nothing reveals itself
   while it is up. useSeen below waits for it.

   ── ALL OF IT IS PROGRESSIVE ENHANCEMENT ──────────────────────────────────

   Every one renders its finished, readable state on the server. The
   movement is added after hydration. With JavaScript off, or before it
   runs, the page is complete — no text is hidden behind an observer that
   never fires, the deck is a stack in flow, the canvas is a finished
   drawing, and there is no cursor but the reader's own.

   ── AND prefers-reduced-motion KEEPS THE FADES ONLY ───────────────────────

   The stylesheet drops every travel and every scale and keeps the opacity
   fades. A script loop cannot be stopped by a media query, so the canvas,
   the deck, the cursor and the diagram read the query themselves
   (useReducedMotion below).
   ========================================================================= */

/**
 * Whether the curtain (lib/curtain.ts) has begun to lift. True when there
 * was never one. False on the server and in the first client render, which
 * is harmless: nothing is seen before the first effect runs anyway.
 */
function subscribeCurtain(onChange: () => void) {
  window.addEventListener('curtain:up', onChange);
  return () => window.removeEventListener('curtain:up', onChange);
}
export function useCurtainUp(): boolean {
  return useSyncExternalStore(
    subscribeCurtain,
    () => window.__curtainUp !== false,
    () => false,
  );
}

/**
 * Fires once, when the element first comes within a quarter of a viewport of
 * being seen. Once is deliberate: a block that re-animates every time it is
 * scrolled past is a block the reader has to wait for twice.
 */
export function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    // The curtain (lib/curtain.ts) waits for this: the first block inside
    // <main> to get here means the page itself is alive. Only inside <main>:
    // the footer's heading is a Rise too, and it belongs to the layout,
    // which comes alive first — it reported a second early on a slow phone.
    if (el?.closest('main')) window.__seenLive = true;
    if (!el || seen) return;

    // No IntersectionObserver (or a very old browser): show it and move on.
    // Scheduled rather than set inline — a setState in an effect body makes
    // React render twice before the browser has painted once.
    if (typeof IntersectionObserver === 'undefined') {
      const t = setTimeout(() => setSeen(true), 0);
      return () => clearTimeout(t);
    }

    let raf = 0;
    const show = () => {
      setSeen(true);
      io.disconnect();
      el.removeEventListener('focusin', show);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };

    // THE SAFETY NET, and it is not redundant.
    //
    // IntersectionObserver delivers its callbacks asynchronously and the
    // browser is free to coalesce them. A reader who flicks through the page
    // — or any fast programmatic scroll — can cross a block between two
    // deliveries, so the observer never reports a frame in which that block
    // was 8% visible and the callback simply never arrives again. The block
    // then sits at opacity 0 for the rest of the session. A rendered sweep
    // caught exactly that on three headings: "every engagement.", "See OPS
    // running," and "as it is today" were all still invisible after the whole
    // page had been scrolled through.
    //
    // A passive scroll listener cannot miss, because it reads the geometry
    // at the moment it runs rather than being told about a moment that has
    // passed. It costs one rect read per frame per unseen block and detaches
    // itself the instant the block is shown.
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el2 = ref.current;
        if (!el2) return;
        const r = el2.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) show();
        else if (r.bottom <= 0) show();
      });
    };

    const io = new IntersectionObserver((entries) => {
      // Seen if it is in view — OR if it is already above the fold, which is
      // the case for a reader who reloads half-way down a page.
      if (entries.some((e) => e.isIntersecting || e.boundingClientRect.bottom <= 0)) show();
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    io.observe(el);
    // The other half of `.in-view:focus-within` in globals.css. The
    // stylesheet shows a block the instant something in it takes focus;
    // this makes that showing permanent, so the block does not fade out
    // again when focus moves on before the observer has reported it.
    el.addEventListener('focusin', show);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      io.disconnect();
      el.removeEventListener('focusin', show);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [seen]);

  // Seen under the curtain is not seen: the block waits for it to lift.
  const up = useCurtainUp();
  return { ref, seen: seen && up };
}

const REDUCED = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(REDUCED).matches
  );
}

/**
 * The reader's motion preference, read as what it actually is: an external
 * system this component subscribes to. useSyncExternalStore is the primitive
 * for exactly that, and it keeps the value correct through a server render
 * (where it is false, because there is no reader yet) without the extra
 * render an effect-plus-setState costs.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
      const q = window.matchMedia(REDUCED);
      q.addEventListener('change', onChange);
      return () => q.removeEventListener('change', onChange);
    },
    () => prefersReducedMotion(),
    () => false,
  );
}

/** Scripts are running and the page has hydrated. False on the server and
 *  in the first client render, so the two agree; true after. A control that
 *  only a script can make work (the capability cards' own states, the
 *  diagram's pause) waits for it. */
const noop = () => () => {};
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** A media query, read the way the motion preference is read above: false
 *  on the server and in the first client render, the real answer after. A
 *  block that folds its content on a phone (the engagement stages) uses it
 *  to hide a folded panel from assistive technology as well as from the eye,
 *  which CSS alone cannot do. */
export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
      const q = window.matchMedia(query);
      q.addEventListener('change', onChange);
      return () => q.removeEventListener('change', onChange);
    },
    () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * The other half of the failsafe in globals.css. It stamps `motion-on` on
 * <html> once the page's scripts are running, which is what lets a hidden
 * block stay hidden until it is scrolled to. Until the stamp lands, every
 * hidden block reveals itself at 2.5s on its own, so a page whose scripts
 * never run is still read in full.
 *
 * A device slow enough to get here after that has already shown the page
 * whole. It keeps it whole — dropping `js` — rather than hiding it again
 * just to animate it back in.
 */
export function MotionReady() {
  useEffect(() => {
    const root = document.documentElement;
    // ASK THE FAILSAFE, NOT THE CLOCK. Its 2.5s starts when the page is
    // first styled, not when the address was typed, so on a slow connection
    // the scripts can land after 2.4s of loading with the failsafe still a
    // second and a half short of firing. Timing it from the navigation threw
    // the motion away on exactly those loads. The block furthest along
    // decides; 2400 leaves a frame's margin before the first one shows. A
    // browser without getAnimations falls back to the navigation clock,
    // which can only err towards keeping the page whole.
    const failsafe =
      typeof document.getAnimations === 'function'
        ? document
            .getAnimations()
            .filter((a) => (a as CSSAnimation).animationName === 'motion-failsafe')
            .map((a) => (typeof a.currentTime === 'number' ? a.currentTime : 0))
        : null;
    const elapsed = failsafe ? Math.max(0, ...failsafe) : performance.now();
    if (elapsed < 2400) root.classList.add('motion-on');
    else root.classList.remove('js');
  }, []);
  return null;
}

/* ------------------------------------------------------------------------ */
/* 1. RISE                                                                   */
/* ------------------------------------------------------------------------ */

type RiseProps = {
  /** One string per line. The breaks are the author's, measured to the shell. */
  lines: readonly string[];
  className?: string;
  as?: ElementType;
  id?: string;
  /** Milliseconds between one line starting and the next. Reference: 60. */
  stagger?: number;
  /** One substring to carry the blue marker, as the reference marks one
   *  phrase per heading and never two. Matched literally, first hit wins. */
  mark?: string;
  /** Let a line wrap instead of holding its hand-set break. Used where the
   *  text comes from the CMS and cannot be broken by hand — an article
   *  title, an initiative name — so a long one never runs off its column. */
  wrap?: boolean;
};

/**
 * A heading whose lines each slide up from behind their own edge.
 *
 * The line breaks are hand-set to fit the measured shell, so each line is its
 * own block with `white-space: pre`. Below 810px those blocks become inline
 * and the breaks dissolve into ordinary wrapping — a line measured for 1380px
 * would otherwise run off a 390px screen. See `.rise-line` in globals.css.
 */
export function Rise({ lines, className = '', as: Tag = 'h2', id, stagger = 60, mark, wrap }: RiseProps) {
  const { ref, seen } = useSeen<HTMLElement>();
  // The marked line is chosen before the map runs, so nothing is reassigned
  // during render — the first line containing the phrase wins.
  const markLine = mark ? lines.findIndex((l) => l.includes(mark)) : -1;
  return (
    <Tag ref={ref} id={id} className={`${className} ${seen ? 'rise-on' : ''}`}>
      {lines.map((line, i) => {
        let body: ReactNode = line;
        if (mark && i === markLine) {
          const at = line.indexOf(mark);
          body = (
            <>
              {line.slice(0, at)}
              <span className="mark-accent">{mark}</span>
              {line.slice(at + mark.length)}
            </>
          );
        }
        return (
          <Fragment key={i}>
            {/* A REAL SPACE BETWEEN THE LINES. Each line is its own block on
                desktop, and below 810px a `::before` in globals.css drew the
                gap between them — so the page read correctly and its text
                did not: copy the hero and it pasted "operationsand". A
                space between blocks is ignored, and inline it collapses
                with the drawn gap into one, so nothing on screen moves. */}
            {i > 0 ? ' ' : null}
            <span className={`rise-line ${wrap ? 'rise-wrap' : ''}`}>
              <span style={{ transitionDelay: `${i * stagger}ms` }}>{body}</span>
            </span>
          </Fragment>
        );
      })}
    </Tag>
  );
}

/* ------------------------------------------------------------------------ */
/* 2. IN-VIEW                                                                */
/* ------------------------------------------------------------------------ */

/** The stagger step between cards in a row, and the last step used. */
const STEP_MS = 90;
const LAST_STEP = 3;

/**
 * The reveal. Wraps anything, or is the thing itself (`as`, `className`).
 *
 *   default          fade-up: opacity and 24px of travel, 0.9s
 *   mode="picture"   a picture: opacity only, 0.6s. A `.settle` element
 *                    inside it (the wrapper between the clip box and the
 *                    <img>) eases from 1.06 to 1 over 1.2s as it shows.
 *
 * THE STAGGER RULE (28 September 2026): one `InView` per card, never one
 * round a grid, delayed by its COLUMN: `step` 0, 1, 2, 3 gives 0 / 90 / 180
 * / 270ms, and a fifth column or later waits 270 too, so no row takes longer
 * than a third of a second to start. A card in the first column, and every
 * card on a one-column layout, is step 0. `delay` (ms) is still taken for a
 * block that follows another (the hero's lede and button row); when both are
 * given they add.
 *
 * The delay is a custom property (`--in-delay`), read only by the reveal's
 * own opacity and transform, so a hover or a press on the same element runs
 * at once instead of inheriting it. `.in-view` also carries the hover
 * language's colour transitions, so a card can BE its `InView` (a subgrid
 * card or a sticky row must) and keep its hover fade.
 */
export function InView({
  children,
  className = '',
  delay = 0,
  step = 0,
  mode = 'fade',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  /** Milliseconds, added to the column stagger. */
  delay?: number;
  /** The card's column in its row: 0 / 1 / 2 / 3 → 0 / 90 / 180 / 270ms. */
  step?: number;
  mode?: 'fade' | 'picture';
  as?: ElementType;
}) {
  const { ref, seen } = useSeen<HTMLElement>();
  const wait = delay + Math.min(Math.max(0, Math.round(step)), LAST_STEP) * STEP_MS;
  return (
    <Tag
      ref={ref}
      className={`in-view ${mode === 'picture' ? 'in-view-picture' : ''} ${seen ? 'is-in' : ''} ${className}`}
      style={wait ? ({ '--in-delay': `${wait}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
