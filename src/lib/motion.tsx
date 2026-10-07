'use client';

import {
  Children,
  Fragment,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ElementType,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';

/* ============================================================================
   THE MOTION SYSTEM.

   Everything that moves on this site moves because the reader scrolled,
   hovered or pressed. Scrolling is the browser's own: no smoothing library,
   no cursor follower, no loops (one bounded exception: the status dot's
   ring, in globals.css, which stops under reduced motion). What enters,
   enters in one of five tiers:

     RISE     a heading: each line, or each word (`by="word"`), slides up
              from behind its own edge, 0.6s on --ease-rise (`Rise`)
     FADE-UP  text, labels and buttons: 0.9s on --ease-in-view, rising 24px
              (`InView`)
     PICTURE  a picture: a 0.6s fade with no travel, while the picture
              inside settles from 1.06 to 1 over 1.2s (`InView
              mode="picture"` and a `.settle` wrapper)
     CLIP     a large picture: revealed from its foot upward over 1.1s while
              it settles from 1.08 (`InView mode="clip"`) — 6 October 2026
     SCALE    a plate or panel: a fade from 0.96 (`InView mode="scale"`)

   And four ways a thing answers the reader after it has entered (6 October
   2026, the owner's audit): `Parallax` (a picture drifts with the scroll),
   `ScrollStory` (a pinned visual follows the chapter being read),
   `Magnetic` (a button leans toward the pointer and springs back) and
   `useScrollState` (the bar turns to glass and steps aside). Hover and
   press are the stylesheet's (THE HOVER LANGUAGE in globals.css).

   ONE EXCEPTION, BY THE OWNER'S DECISION OF 26 SEPTEMBER 2026: the Contraxis
   system diagram (components/SystemDiagram.tsx), whose dots run only under
   the pointer or keyboard focus, for under five seconds, and never loop.

   AND THE REFERENCE'S LOADER, BY THE OWNER'S REQUEST OF 27 SEPTEMBER 2026:
   the curtain (lib/curtain.ts). It runs before this file has arrived; what
   it asks of this file is that nothing reveals itself while it is up.
   useSeen below waits for it.

   ── ALL OF IT IS PROGRESSIVE ENHANCEMENT ─────────────────────────────────

   Every component renders its finished, readable state on the server. The
   movement is added after hydration. With JavaScript off, or before it
   runs, the page is complete — no text is hidden behind an observer that
   never fires. The hidden states are gated on `.js` in globals.css and
   covered by the 2.5s failsafe there.

   ── AND prefers-reduced-motion KEEPS THE FADES ONLY ───────────────────────

   The stylesheet drops every travel, clip and scale and keeps the opacity
   fades. A script loop cannot be stopped by a media query, so every script
   here reads the query itself (useReducedMotion) and stands down.
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
function useSeen<T extends HTMLElement>() {
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
    // caught exactly that on three headings.
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
 *  only a script can make work waits for it. */
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
 *
 * It also stamps `curtain-up` once the curtain has lifted (at once where
 * there was none), which is what lets the hero picture settle after the
 * curtain rather than under it (`.hero-settle`, globals.css).
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

    const up = () => root.classList.add('curtain-up');
    if (window.__curtainUp !== false) {
      up();
      return;
    }
    window.addEventListener('curtain:up', up, { once: true });
    return () => window.removeEventListener('curtain:up', up);
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
  /** Milliseconds between one line (or word) starting and the next.
   *  Reference: 60 a line; 28 a word. */
  stagger?: number;
  /** One substring to carry the blue marker, as the reference marks one
   *  phrase per heading and never two. Matched literally, first hit wins. */
  mark?: string;
  /** Let a line wrap instead of holding its hand-set break. Used where the
   *  text comes from the CMS and cannot be broken by hand — an article
   *  title, an initiative name — so a long one never runs off its column. */
  wrap?: boolean;
  /** `line` (the default): each authored line rides up out of its own clip
   *  box. `word` (6 October 2026): each word out of its own, 28ms apart,
   *  the lines still authored — the hero and the page openers. */
  by?: 'line' | 'word';
};

/** The words of one line, with the marked phrase kept as one piece. */
function tokens(line: string, mark: string | undefined): { text: string; marked: boolean }[] {
  const words = (s: string) => s.split(' ').filter(Boolean).map((text) => ({ text, marked: false }));
  if (!mark) return words(line);
  const at = line.indexOf(mark);
  if (at === -1) return words(line);
  return [...words(line.slice(0, at)), { text: mark, marked: true }, ...words(line.slice(at + mark.length))];
}

/**
 * A heading whose lines each slide up from behind their own edge.
 *
 * The line breaks are hand-set to fit the measured shell, so each line is its
 * own block with `white-space: pre-wrap`. Below 810px those blocks become
 * inline and the breaks dissolve into ordinary wrapping — a line measured for
 * 1380px would otherwise run off a 390px screen. See `.rise-line` in
 * globals.css. In word mode every word has a clip box of its own as well
 * (`.rise-word`), and keeps it on a phone.
 */
export function Rise({ lines, className = '', as: Tag = 'h2', id, stagger, mark, wrap, by = 'line' }: RiseProps) {
  const { ref, seen } = useSeen<HTMLElement>();
  const words = by === 'word';
  const step = stagger ?? (words ? 28 : 60);
  // The marked line is chosen before the map runs, so nothing is reassigned
  // during render — the first line containing the phrase wins.
  const markLine = mark ? lines.findIndex((l) => l.includes(mark)) : -1;
  let count = 0;
  return (
    <Tag ref={ref} id={id} className={`${className} ${seen ? 'rise-on' : ''} ${words ? 'rise-words' : ''}`}>
      {lines.map((line, i) => {
        const here = mark && i === markLine ? mark : undefined;
        let body: ReactNode = line;
        if (words) {
          body = tokens(line, here).map((t, j) => {
            const n = count++;
            return (
              <Fragment key={j}>
                {j > 0 ? ' ' : null}
                <span className="rise-word">
                  <span style={{ transitionDelay: `${n * step}ms` }}>
                    {t.marked ? <span className="mark-accent">{t.text}</span> : t.text}
                  </span>
                </span>
              </Fragment>
            );
          });
        } else if (here) {
          const at = line.indexOf(here);
          body = (
            <>
              {line.slice(0, at)}
              <span className="mark-accent">{here}</span>
              {line.slice(at + here.length)}
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
            <span className={`rise-line ${wrap || words ? 'rise-wrap' : ''}`}>
              {words ? body : <span style={{ transitionDelay: `${i * step}ms` }}>{body}</span>}
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

const MODE_CLASS = {
  fade: '',
  picture: 'in-view-picture',
  clip: 'in-view-clip',
  scale: 'in-view-scale',
} as const;

/**
 * The reveal. Wraps anything, or is the thing itself (`as`, `className`).
 *
 *   default          fade-up: opacity and 24px of travel, 0.9s
 *   mode="picture"   a picture: opacity only, 0.6s. A `.settle` element
 *                    inside it (the wrapper between the clip box and the
 *                    <img>) eases from 1.06 to 1 over 1.2s as it shows.
 *   mode="clip"      a large picture: revealed from the foot up over 1.1s,
 *                    the `.settle` inside it from 1.08 over 1.4s.
 *   mode="scale"     a plate or panel: a fade from 0.96, 0.9s.
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
 * own properties, so a hover or a press on the same element runs at once
 * instead of inheriting it. `.in-view` also carries the hover language's
 * colour transitions, so a card can BE its `InView` (a subgrid card or a
 * sticky row must) and keep its hover fade.
 */
export function InView({
  children,
  className = '',
  delay = 0,
  step = 0,
  mode = 'fade',
  as: Tag = 'div',
  id,
  style,
}: {
  children: ReactNode;
  className?: string;
  /** Milliseconds, added to the column stagger. */
  delay?: number;
  /** The card's column in its row: 0 / 1 / 2 / 3 → 0 / 90 / 180 / 270ms. */
  step?: number;
  mode?: keyof typeof MODE_CLASS;
  as?: ElementType;
  id?: string;
  /** Merged under the reveal's own `--in-delay`. */
  style?: CSSProperties;
}) {
  const { ref, seen } = useSeen<HTMLElement>();
  const wait = delay + Math.min(Math.max(0, Math.round(step)), LAST_STEP) * STEP_MS;
  const vars = wait ? ({ '--in-delay': `${wait}ms` } as CSSProperties) : undefined;
  return (
    <Tag
      ref={ref}
      id={id}
      className={`in-view ${MODE_CLASS[mode]} ${seen ? 'is-in' : ''} ${className}`}
      style={vars || style ? { ...style, ...vars } : undefined}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------------ */
/* 3. PARALLAX (6 October 2026)                                              */
/* ------------------------------------------------------------------------ */

/**
 * A picture that drifts with the scroll. It moves its own box by `transform`
 * alone, by `speed` of the distance between the clip box's centre and the
 * window's, so at the moment the box is centred on screen it is where the
 * server drew it. Measured off the PARENT (the clip box), never off itself,
 * so the reading is not shifted by the move it just made: make it the
 * direct child of the box that clips it, and give it more height than the
 * box (`-inset-y-[6%]`) so no edge shows.
 *
 * Desktop only (from 1200), on a pointer device's scroll; off under reduced
 * motion and on every narrower screen, where the transform is cleared.
 */
export function Parallax({
  children,
  speed = 0.1,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  /** The fraction of the scroll the box follows. 0.1 is quiet; 0.2 is a lot. */
  speed?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const wide = useMedia('(min-width: 1200px)');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || !wide) {
      el.style.transform = '';
      return;
    }
    let raf = 0;
    const tick = () => {
      raf = 0;
      const box = el.parentElement ?? el;
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      // Nothing to do while the box is off screen.
      if (r.bottom < -vh || r.top > vh * 2) return;
      const centre = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(centre * speed).toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [speed, reduced, wide]);

  return (
    <Tag ref={ref} className={`parallax ${className}`}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------------ */
/* 4. SCROLL STORY (6 October 2026)                                          */
/* ------------------------------------------------------------------------ */

/**
 * A pinned visual that follows the chapter being read.
 *
 * It owns no markup of its own beyond the root: the chapters are any
 * descendants marked `data-step` (in order), the visual's layers any
 * descendants marked `data-layer` (in the same order), and the visual's box
 * carries `.story-visual` with `.story-pin` to pin from 1200 up (globals.css,
 * THE SCROLL STORY). The active chapter is the one crossing the band at the
 * middle of the window; the root carries `data-active`, and the active step
 * and layer each carry `data-on`, which the stylesheet reads to crossfade
 * the layers and dim the other chapters. A server component composes the
 * story and marks the first step and layer `data-on` itself, so the page is
 * finished without a script.
 *
 * Read on the scroll, not through an observer alone: a flick of the wheel
 * can cross a chapter between two observer deliveries, and a story that
 * missed one would show the wrong screen until the next. One rect read per
 * step per frame while the story is on screen, and none when it is not.
 */
export function ScrollStory({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
    const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-layer]'));
    if (steps.length === 0) return;

    let active = -1;
    const apply = (i: number) => {
      if (i === active) return;
      active = i;
      root.dataset.active = String(i);
      steps.forEach((s, j) => (j === i ? s.setAttribute('data-on', '') : s.removeAttribute('data-on')));
      layers.forEach((l, j) => (j === i ? l.setAttribute('data-on', '') : l.removeAttribute('data-on')));
    };

    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rootRect = root.getBoundingClientRect();
      if (rootRect.bottom < 0 || rootRect.top > vh) return;
      const mid = vh * 0.5;
      // The step whose box holds the middle of the window; failing that,
      // the one nearest to it, so the story never has no chapter.
      let best = -1;
      let nearest = Infinity;
      steps.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          best = i;
          nearest = 0;
          return;
        }
        const d = r.top > mid ? r.top - mid : mid - r.bottom;
        if (d < nearest) {
          nearest = d;
          best = i;
        }
      });
      if (best >= 0) apply(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Tag ref={ref} className={`story ${className}`} data-active="0">
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------------ */
/* 5. MAGNETIC (6 October 2026)                                              */
/* ------------------------------------------------------------------------ */

/**
 * A button that leans toward the pointer. Within `radius` px of its EDGE
 * (not its centre: a wide button must not reach half its width further
 * than a narrow one) the child is moved by `strength` of the pointer's
 * offset from the centre, never more than `max` px either way (0.2 and 10:
 * a 40px offset moves it 8, a 200px offset still only 10); past the reach,
 * or when the pointer leaves, it springs back on --ease-spring. Pointer
 * devices only (`hover: hover` and `pointer: fine`), never under reduced
 * motion, and never on touch.
 *
 * The wrapper is the thing measured, so the reading is not shifted by the
 * move; the child is the thing moved. `transform` alone, so it never fights
 * the button's own `scale` press.
 */
export function Magnetic({
  children,
  strength = 0.2,
  radius = 48,
  max = 10,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  radius?: number;
  /** The furthest the child moves, in px, whatever the offset. */
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const pointer = useMedia('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    const el = ref.current;
    const target = el?.firstElementChild as HTMLElement | null;
    if (!el || !target || reduced || !pointer) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    let near = false;
    const rest = () => {
      if (!near) return;
      near = false;
      target.style.transition = 'transform 0.5s var(--ease-spring)';
      target.style.transform = '';
    };
    const clamp = (v: number) => Math.max(-max, Math.min(max, v));
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // How far the pointer is outside the box, 0 inside it.
      const ex = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const ey = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      if (Math.hypot(ex, ey) > radius) {
        rest();
        return;
      }
      near = true;
      x = clamp((e.clientX - (r.left + r.width / 2)) * strength);
      y = clamp((e.clientY - (r.top + r.height / 2)) * strength);
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          target.style.transition = 'transform 0.18s var(--ease-hover)';
          target.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        });
      }
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', rest);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', rest);
      if (raf) cancelAnimationFrame(raf);
      target.style.transition = '';
      target.style.transform = '';
    };
  }, [strength, radius, max, reduced, pointer]);

  return (
    <span ref={ref} className={`magnetic ${className}`}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* 6. THE SCROLL STATE (6 October 2026)                                      */
/* ------------------------------------------------------------------------ */

type ScrollState = {
  /** Past `threshold` px: the bar turns to glass. */
  scrolled: boolean;
  /** Which way the last scroll went. */
  direction: 'up' | 'down';
  /** Past the first screen (the window's height): the bar may step aside. */
  far: boolean;
};

const AT_TOP: ScrollState = { scrolled: false, direction: 'up', far: false };

/**
 * Where the page is, for the bar: read on the scroll, one frame at a time,
 * and only re-rendered when one of the three answers changes. On the server
 * and in the first client render the page is at the top.
 */
export function useScrollState(threshold = 8): ScrollState {
  const [state, setState] = useState<ScrollState>(AT_TOP);
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      // A 4px dead band, so a trackpad's settle does not flip the direction.
      const dir: ScrollState['direction'] | null = y > last + 4 ? 'down' : y < last - 4 ? 'up' : null;
      last = y;
      setState((s) => {
        const next: ScrollState = {
          scrolled: y > threshold,
          direction: dir ?? s.direction,
          far: y > window.innerHeight,
        };
        return next.scrolled === s.scrolled && next.direction === s.direction && next.far === s.far ? s : next;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [threshold]);
  return state;
}

/* ======================================================================== */
/* THE DEPTH LAYER (7 October 2026) — the scripts behind styles/depth.css.  */
/*                                                                          */
/* The owner's verdict on the site was "plain words with zero design, cards */
/* with zero animation or interaction". What follows are the five ways a   */
/* card or a row answers the reader now: the spotlight under the pointer    */
/* (and under the centre of a phone's screen), the tilt toward the pointer, */
/* the stack of cards sliding over one another, the snap rail, the ticker,  */
/* and the ordinal that rolls in. Every one of them is an enhancement over  */
/* markup that is complete without it: a wrapper that lays out nothing      */
/* (`display: contents`) and writes custom properties on its one child, or  */
/* a component whose server HTML is the finished state.                     */
/* ======================================================================== */

/** The one child a wrapper acts on: the first element that is not another
 *  wrapper (Spotlight around Tilt around a Card is three elements deep, and
 *  the two wrappers lay out nothing). */
function wrapped(el: HTMLElement | null): HTMLElement | null {
  let t = el?.firstElementChild as HTMLElement | null;
  while (t && t.hasAttribute('data-wrap')) t = t.firstElementChild as HTMLElement | null;
  return t;
}

const FINE_POINTER = '(hover: hover) and (pointer: fine)';

/* ------------------------------------------------------------------------ */
/* 7. SPOTLIGHT                                                              */
/* ------------------------------------------------------------------------ */

/**
 * The light under the pointer. On a pointer device it writes `--mx` / `--my`
 * (pixels inside the child) on every move, one frame at a time, and the
 * stylesheet (`.spot`, depth.css) draws the edge light and the surface light
 * there while the card is hovered. On a phone there is no pointer: the child
 * is marked `data-lit` while its centre crosses the middle band of the
 * screen (30% to 70% of the height), so a card lights as the reader scrolls
 * to it and goes out as they scroll on; the light sits at the card's centre.
 *
 * The wrapper lays out nothing. The child is whatever `Card spot` renders
 * (or a link card that carries `.spot` itself); `Spotlight` never adds the
 * class, it only writes the state.
 */
export function Spotlight({
  children,
  touch = true,
  className = '',
}: {
  children: ReactNode;
  /** `false` skips the touch lighting: a tile in a moving ticker must never
   *  flicker lit as it passes the centre. */
  touch?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pointer = useMedia(FINE_POINTER);

  useEffect(() => {
    const target = wrapped(ref.current);
    if (!target) return;
    let raf = 0;

    if (pointer) {
      let x = 0;
      let y = 0;
      const move = (e: PointerEvent) => {
        const r = target.getBoundingClientRect();
        x = e.clientX - r.left;
        y = e.clientY - r.top;
        if (!raf) {
          raf = requestAnimationFrame(() => {
            raf = 0;
            target.style.setProperty('--mx', `${x.toFixed(1)}px`);
            target.style.setProperty('--my', `${y.toFixed(1)}px`);
          });
        }
      };
      target.addEventListener('pointermove', move, { passive: true });
      return () => {
        target.removeEventListener('pointermove', move);
        if (raf) cancelAnimationFrame(raf);
        target.style.removeProperty('--mx');
        target.style.removeProperty('--my');
      };
    }

    if (!touch) return;

    // Touch: lit while centred — vertically in the middle band of the
    // screen and horizontally within it too, so one item of a rail lights
    // at a time rather than every item in the row. One rect read per frame
    // while the page scrolls, none while it rests.
    const tick = () => {
      raf = 0;
      const r = target.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const c = r.top + r.height / 2;
      const cx = r.left + r.width / 2;
      const tall = r.top < vh * 0.3 && r.bottom > vh * 0.7;
      const on = (tall || (c > vh * 0.3 && c < vh * 0.7)) && cx > vw * 0.15 && cx < vw * 0.85;
      if (on) target.setAttribute('data-lit', '');
      else target.removeAttribute('data-lit');
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      target.removeAttribute('data-lit');
    };
  }, [pointer, touch]);

  /* A div that lays out nothing (`contents`), so the card keeps its place
     in a grid or a flex row; a list item should wrap its own card rather
     than be wrapped, so the list stays a list to assistive technology. */
  return (
    <div ref={ref} data-wrap="" className={`contents ${className}`}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 8. TILT                                                                   */
/* ------------------------------------------------------------------------ */

/**
 * A picture card leans toward the pointer: up to `max` degrees on each axis
 * (`--rx`, `--ry` on the child, drawn by `.tilt` in depth.css with the
 * perspective on the child's own transform), and a `.tilt-layer` inside it
 * (the picture) moves the other way by up to `shift` pixels (`--tx`,
 * `--ty`). Leaving the card marks it `data-rest` for the spring back.
 * Pointer devices only; never under reduced motion; never on touch.
 *
 * The child must carry `.tilt` (`Card tilt` does); put `Tilt` INSIDE a
 * reveal, never around one: the reveal transforms its own element.
 */
export function Tilt({
  children,
  max = 5,
  shift = 8,
  className = '',
}: {
  children: ReactNode;
  /** Degrees, each way, at the card's edge. */
  max?: number;
  /** Pixels the inner layer moves the other way, each way. */
  shift?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const pointer = useMedia(FINE_POINTER);

  useEffect(() => {
    const target = wrapped(ref.current);
    if (!target || reduced || !pointer) return;
    let raf = 0;
    let rx = 0;
    let ry = 0;
    let tx = 0;
    let ty = 0;
    const write = () => {
      raf = 0;
      target.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      target.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
      target.style.setProperty('--tx', `${tx.toFixed(1)}px`);
      target.style.setProperty('--ty', `${ty.toFixed(1)}px`);
    };
    const move = (e: PointerEvent) => {
      const r = target.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      // −0.5 at the left/top edge, +0.5 at the right/bottom.
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry = px * max * 2;
      rx = -py * max * 2;
      tx = -px * shift * 2;
      ty = -py * shift * 2;
      target.removeAttribute('data-rest');
      if (!raf) raf = requestAnimationFrame(write);
    };
    const leave = () => {
      rx = ry = tx = ty = 0;
      target.setAttribute('data-rest', '');
      if (!raf) raf = requestAnimationFrame(write);
    };
    target.addEventListener('pointermove', move, { passive: true });
    target.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    return () => {
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
      if (raf) cancelAnimationFrame(raf);
      for (const p of ['--rx', '--ry', '--tx', '--ty']) target.style.removeProperty(p);
      target.removeAttribute('data-rest');
    };
  }, [max, shift, reduced, pointer]);

  return (
    <div ref={ref} data-wrap="" className={`contents ${className}`}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 9. STACK                                                                  */
/* ------------------------------------------------------------------------ */

/**
 * Cards that slide over one another. The cards are any descendants marked
 * `data-stack-card`, in order, each carrying `.stack-card` (sticky under the
 * bar, each one a step lower than the last: depth.css). This writes
 * `--stack-i` on each card once, and on the scroll `--stack-p` (0 → 1) on
 * every card being covered: how far the next card's top has climbed from the
 * card's foot to its head. The stylesheet shrinks and dims the covered card
 * by it. Sticky is CSS, so the stack is whole without this; with reduced
 * motion the properties are still written and the stylesheet ignores them.
 */
export function Stack({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-stack-card]'));
    if (cards.length === 0) return;
    cards.forEach((c, i) => c.style.setProperty('--stack-i', String(i)));

    // THE TALL CARD. A sticky card taller than the room under the bar pins
    // its head and its foot can never be read, so a card that does not fit
    // (the bar, the 16px gap, its step, and 24px of margin) is unpinned
    // and scrolls as a plain block; the next card still slides over it.
    // Measured on mount and whenever the stack's size changes.
    const bar = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar')) || 56;
    const measure = () => {
      const vh = window.innerHeight;
      const top0 = bar() + 16;
      cards.forEach((c, i) => {
        const top = top0 + i * 12;
        if (c.offsetHeight > vh - top - 24) {
          c.setAttribute('data-tall', '');
          c.style.setProperty('--stack-p', '0');
        } else {
          c.removeAttribute('data-tall');
        }
      });
    };

    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rr = root.getBoundingClientRect();
      if (rr.bottom < 0 || rr.top > vh) return;
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        if (!next || c.hasAttribute('data-tall')) {
          c.style.setProperty('--stack-p', '0');
          return;
        }
        const r = c.getBoundingClientRect();
        const n = next.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (r.bottom - n.top) / Math.max(1, r.height)));
        c.style.setProperty('--stack-p', p.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onResize);
    ro?.observe(root);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      cards.forEach((c) => {
        c.style.removeProperty('--stack-i');
        c.style.removeProperty('--stack-p');
        c.removeAttribute('data-tall');
      });
    };
  }, []);

  return (
    <Tag ref={ref} className={`stack ${className}`}>
      {children}
    </Tag>
  );
}

/**
 * The chapter a `ScrollStory` is reporting, read by anything inside it (the
 * progress rule, the caption under the pinned screen, the orbit's lit
 * node): the story's root carries `data-active`, and this watches that one
 * attribute through a MutationObserver rather than tracking the scroll a
 * second time, so there is one reading of where the reader is. 0 on the
 * server and until the first change, as the story marks its first chapter.
 */
export function useActiveStep(ref: RefObject<HTMLElement | null>): number {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const root = ref.current?.closest<HTMLElement>('.story');
    if (!root || typeof MutationObserver === 'undefined') return;
    const read = () => {
      const n = Number(root.dataset.active ?? 0);
      setActive(Number.isFinite(n) ? n : 0);
    };
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ['data-active'] });
    return () => mo.disconnect();
  }, [ref]);
  return active;
}

/* ------------------------------------------------------------------------ */
/* 10. RAIL                                                                  */
/* ------------------------------------------------------------------------ */

/** The chevron the rail's rings carry: the kit's 8 x 13 'ring' drawing
 *  (components/ui.tsx, `Chevron`), repeated here because this file is the
 *  kit's dependency and cannot import it back. */
const RING_CHEVRON = 'M0.67 0L4.67 0L7.33 6.5L4.67 13L0.67 13L3.33 6.5Z';

/**
 * A horizontal snap rail. The children are the items (each is wrapped in a
 * `.rail-item`; its width is `--rail-w`, 85vw unless the call site sets it
 * with a utility such as `[--rail-w:60vw]`). Under the track, a tick rule
 * lit to the scroll position and two 44px rings that scroll one item at a
 * time; they disable at the ends. The track itself is focusable and takes
 * the arrow keys. `bleed` carries the track to the window's edges by the
 * gutter (depth.css, `.rail-bleed`).
 *
 * Nothing here hides anything: the server renders the track scrolled to its
 * start and the rule at zero.
 */
export function Rail({
  children,
  ariaLabel,
  className = '',
  bleed = true,
  foot = true,
}: {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
  bleed?: boolean;
  /** The rule and the rings under the track. */
  foot?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ lit: 0, start: true, end: true });

  useEffect(() => {
    const t = track.current;
    if (!t) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const max = t.scrollWidth - t.clientWidth;
      const lit = max > 1 ? t.scrollLeft / max : 1;
      const next = { lit, start: t.scrollLeft < 2, end: t.scrollLeft > max - 2 };
      setPos((p) => (Math.abs(p.lit - next.lit) < 0.002 && p.start === next.start && p.end === next.end ? p : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    onScroll();
    t.addEventListener('scroll', onScroll, { passive: true });
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onScroll);
    ro?.observe(t);
    return () => {
      t.removeEventListener('scroll', onScroll);
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const t = track.current;
    if (!t) return;
    const item = t.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(t).columnGap || '0') || 0;
    const step = item ? item.getBoundingClientRect().width + gap : t.clientWidth * 0.8;
    t.scrollBy({ left: dir * step, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  const items = Children.toArray(children);
  const lit = { '--lit': String(Math.min(1, Math.max(0, pos.lit))) } as CSSProperties;

  return (
    <div className={`rail ${bleed ? 'rail-bleed' : ''} ${className}`}>
      <div ref={track} className="rail-track" tabIndex={0} role="group" aria-label={ariaLabel} onKeyDown={onKey}>
        {items.map((child, i) => (
          <div key={i} className="rail-item">
            {child}
          </div>
        ))}
      </div>
      {foot ? (
        <div className="rail-foot">
          {/* The tick rule, drawn as the kit draws it (`.tick-rule`,
              globals.css), lit to the scroll position. Decorative: the
              rings and the track are the controls. */}
          <span aria-hidden="true" className="tick-rule min-w-0 flex-1" style={lit}>
            <span className="tick-rule-lit" />
          </span>
          <span className="flex items-center gap-(--space-1)">
            <button type="button" className="rail-ring" onClick={() => go(-1)} disabled={pos.start} aria-label="Previous">
              <svg width="8" height="13" viewBox="0 0 8 13" fill="currentColor" aria-hidden="true" focusable="false" className="chev chev-13 chev-back">
                <path d={RING_CHEVRON} />
              </svg>
            </button>
            <button type="button" className="rail-ring" onClick={() => go(1)} disabled={pos.end} aria-label="Next">
              <svg width="8" height="13" viewBox="0 0 8 13" fill="currentColor" aria-hidden="true" focusable="false" className="chev chev-13">
                <path d={RING_CHEVRON} />
              </svg>
            </button>
          </span>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 11. TICKER                                                                */
/* ------------------------------------------------------------------------ */

/**
 * A marquee. The children are drawn twice, the second set `aria-hidden` and
 * `inert` (nothing in it is read or reached), and the track slides by one
 * set's width plus one gap (`--ticker-shift`) over a duration set from that
 * width (`--ticker-duration`, at `speed` px/s), so the loop is seamless and
 * every ticker on the site moves at the same pace. It pauses under the
 * pointer and while anything inside has focus (depth.css). Under reduced
 * motion the stylesheet stops it, hides the copy and lets the row scroll by
 * hand. Until the script has measured, the track moves by −50%, which is
 * one set's width less the gap: a small step at the loop's seam, and only
 * for the first moments of a page.
 */
export function Ticker({
  children,
  speed = 60,
  reverse = false,
  className = '',
  ariaLabel,
}: {
  children: ReactNode;
  /** Pixels per second. */
  speed?: number;
  reverse?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = track.current;
    const set = t?.firstElementChild as HTMLElement | null;
    if (!t || !set || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      const w = set.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(t).columnGap || '0') || 0;
      if (w === 0) return;
      t.style.setProperty('--ticker-shift', `-${(w + gap).toFixed(1)}px`);
      t.style.setProperty('--ticker-duration', `${Math.max(8, (w + gap) / speed).toFixed(1)}s`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(set);
    return () => ro.disconnect();
  }, [speed]);

  return (
    <div className={`ticker ${className}`} aria-label={ariaLabel}>
      <div ref={track} className="ticker-track" data-reverse={reverse || undefined}>
        <div className="ticker-set">{children}</div>
        <div className="ticker-set" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 12. ORDINAL                                                               */
/* ------------------------------------------------------------------------ */

/**
 * An ordinal ("01") whose digits roll up out of their own clip boxes when
 * it is first seen, 60ms apart, on the word rise's own mechanics
 * (`.rise-word`, globals.css: gated on `.js`, covered by the failsafe and
 * the noscript block). Tabular, so a column of them lines up.
 */
export function Ordinal({ n, className = '', as: Tag = 'span' }: { n: string; className?: string; as?: ElementType }) {
  const { ref, seen } = useSeen<HTMLElement>();
  return (
    <Tag ref={ref} className={`inline-flex tabular-nums ${seen ? 'rise-on' : ''} ${className}`}>
      {Array.from(n).map((ch, i) => (
        <span key={i} className="rise-word">
          <span style={{ transitionDelay: `${i * 60}ms` }}>{ch}</span>
        </span>
      ))}
    </Tag>
  );
}
