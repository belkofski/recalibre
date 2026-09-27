'use client';

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ElementType,
  type ReactNode,
} from 'react';

/* ============================================================================
   THE THREE MOTION DEVICES ON THE REFERENCE, AND NOTHING ELSE.

   tbd® ships no CSS keyframe loops at all — its stylesheet has none. With one
   exception, the marquee strip, everything that moves on it moves because the
   reader scrolled, hovered or pressed. Counted across the whole homepage there
   are exactly four transition timings and three devices:

     RISE    each line of a heading slides up from behind its own edge
     IN-VIEW a block fades and travels 24px as it enters
     DECODE  letters churn through random characters and settle

   Adding a fifth device would be adding a visual idea the template does not
   have, which the brief forbids. If something needs to move and none of these
   three fits, it does not move.

   ONE EXCEPTION, BY THE OWNER'S DECISION OF 26 SEPTEMBER 2026: the Contraxis
   system diagram (components/SystemDiagram.tsx), which replaced the still
   schematic in every Contraxis slot. Small dots ride its lines, in the
   manner of the Diagramflow reference it was rebuilt from. It keeps this
   file's rules all the same: the diagram is finished on the server without
   the dots, and they run only while it is on screen. On a card they run
   for under five seconds at a time, so under WCAG 2.2.2 a card needs no
   pause control. On /work/contraxis, by the owner's further decision of
   the same day, they loop for as long as the diagram is on screen, and
   each diagram there carries a PAUSE MOTION control built as the partner
   band's PAUSE LOGOS is. Everywhere they stay off for prefers-reduced-motion
   (read with useReducedMotion below, because a script loop is not stopped
   by the stylesheet's media query), and the control is not drawn.

   ── ALL THREE ARE PROGRESSIVE ENHANCEMENT ─────────────────────────────────

   Every one renders its finished, readable state on the server. The movement
   is added after hydration. With JavaScript off, or before it runs, the page
   is complete — no text is hidden behind an observer that never fires.

   ── AND ALL THREE STOP FOR prefers-reduced-motion ─────────────────────────

   Rise and In-view are switched off in CSS. Decode checks the query itself
   and never starts, because a JS effect cannot be stopped by a media query.
   ========================================================================= */

/**
 * Fires once, when the element first comes within a quarter of a viewport of
 * being seen. Once is deliberate: a block that re-animates every time it is
 * scrolled past is a block the reader has to wait for twice.
 */
function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
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

  return { ref, seen };
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

/**
 * The section reveal: 0.9s, opacity and 24px of travel. Wraps anything.
 *
 * `delay` staggers siblings — a row of three cards at 0 / 90 / 180 reads as
 * one gesture rather than three separate ones.
 */
export function InView({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const { ref, seen } = useSeen<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={`in-view ${seen ? 'is-in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------------ */
/* 3. DECODE                                                                 */
/* ------------------------------------------------------------------------ */

/** The glyph set the churn draws from. Letters and digits only — punctuation
 *  in the churn reads as corruption rather than as loading. */
const GLYPHS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * The reference's signature text effect: characters churn through random
 * glyphs and resolve left to right.
 *
 * ── WHAT A SCREEN READER GETS ─────────────────────────────────────────────
 *
 * The real sentence, once, in a visually hidden span. The churning copy is
 * aria-hidden. Without that split, assistive technology reads whatever
 * nonsense happened to be on screen at the moment it looked.
 *
 * ── WHY SPACES AND PUNCTUATION NEVER CHURN ────────────────────────────────
 *
 * They hold the shape of the sentence. Churning them makes the block look
 * like it is breaking rather than arriving, and it makes the width jitter.
 */
export function Decode({
  text,
  className = '',
  as: Tag = 'span',
  /** ms per character of resolve. Measured feel on the reference: ~14ms. */
  speed = 14,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  speed?: number;
}) {
  const { ref, seen } = useSeen<HTMLElement>();
  const [shown, setShown] = useState(text);

  useEffect(() => {
    // `shown` is initialised to the real text and the server rendered it, so
    // a reader who asked for less motion needs nothing done — the churn
    // simply never starts.
    if (!seen || prefersReducedMotion()) return;

    const chars = [...text];
    let settled = 0;
    let frame = 0;
    let raf = 0;
    // How many frames of churn before one more character locks. At 60fps and
    // speed 14 that is roughly one character per frame on a short line and a
    // little slower on a long one, which is how the reference reads.
    const every = Math.max(1, Math.round(speed / 16));

    const tick = () => {
      frame += 1;
      if (frame % every === 0) settled += 1;

      if (settled >= chars.length) {
        setShown(text);
        return;
      }

      setShown(
        chars
          .map((ch, i) => {
            if (i < settled) return ch;
            if (ch === ' ' || ch === '\n' || !/[a-z0-9]/i.test(ch)) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(''),
      );
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, text, speed]);

  return (
    <Tag ref={ref} className={`decode ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </Tag>
  );
}

/* ------------------------------------------------------------------------ */
/* THE MARQUEE                                                               */
/* ------------------------------------------------------------------------ */

/**
 * The continuous strip the reference runs under its proof band.
 *
 * It moves without being asked (as, since 26 September 2026, does the
 * Contraxis diagram — see the note at the top of this file), so it has to
 * stop when a reader asks for less motion. The
 * track is duplicated once and translated by exactly half its own width, so
 * the loop has no seam.
 *
 * Under prefers-reduced-motion the animation is switched off by the global
 * rule and the strip simply sits still, showing the first set. The duplicate
 * is aria-hidden so nothing is announced twice.
 */
export function Marquee({
  children,
  seconds = 38,
  className = '',
}: {
  children: ReactNode;
  seconds?: number;
  className?: string;
}) {
  return (
    <div className={`relative w-full overflow-clip ${className}`}>
      <div
        className="flex w-max items-center will-change-transform motion-reduce:animate-none"
        style={{ animation: `marquee ${seconds}s linear infinite` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
