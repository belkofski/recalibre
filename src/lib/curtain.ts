import { SITE } from '@/content/site';

/* ============================================================================
   THE CURTAIN — the loader the owner asked for on 27 September 2026 ("the
   website starts without a loader, and it loads slow without a loader").

   It is the reference's own loader, in our colours. tbd® opens on a dark
   field with its name churning into place over a 1px line that fills from
   the left, a three-digit percentage at the line's right end and a faint
   glow riding the line's head; when the page is ready the field lifts away
   in five columns, left first, and the hero's own entrance plays as they
   clear. Measured frame by frame on tbdstudio.framer.ai, 27 Sep 2026. Ours
   keeps all of it but the churn: the name stands still (4 October 2026;
   see NO LETTER CHURN below), and the hero's words are already in place
   under the columns.

   ── WHY IT IS AN INLINE SCRIPT AND NOT A COMPONENT ────────────────────────

   What it covers is the wait for the page's scripts. Measured on the live
   site on a throttled phone (slow 4G, 4x CPU): the page is first painted at
   1.8s, but the scripts land at 2.5s and the hero picture at 2.8s, and in
   between the reader saw a black frame with no headline, then the picture,
   then the headline, then the lede churning. A React component would
   arrive with the scripts, which is to say after all of that. So this runs
   from the page's own HTML, at the first paint, and asks for nothing.

   It builds the curtain itself and puts it at the top of <body>, as an
   element of its own name, <rc-curtain>. React 19 steps over an element in
   <body> whose tag it did not render, so the curtain is invisible to
   hydration. It has to be a tag of its own: built as a <div>, React took
   it for Next's own first <div> in <body>, found the wrong children in it
   and threw the whole page away to draw it again (React error 418) — a
   one-second freeze on a throttled phone, measured, and the curtain
   deleted mid-lift.

   ── WHAT THE PERCENTAGE COUNTS ────────────────────────────────────────────

   Four real things, a quarter each: the page's markup parsed, its font
   ready, the first-screen picture (the one marked `fetchpriority=high`)
   decoded, and the page's scripts running. Between two of them the number
   creeps towards the next quarter without reaching it, so it is never
   still and never ahead of the truth.

   "Running" means the page's own blocks, not only the frame around them.
   MotionReady sits in the layout, and the layout comes alive before the
   page inside it: on a throttled phone its stamp landed a full second
   before the hero could move, and a curtain that lifted on the stamp
   showed an empty hero for that second. So the stamp is not enough on its
   own; the first animated block inside <main> to come alive also reports
   in (`__seenLive`, set in useSeen). A page with no animated block has
   nothing to wait for.

   ── WHEN IT LIFTS ─────────────────────────────────────────────────────────

   When all four are in and it has been up for at least MIN_MS, so a fast
   visit reads as a beat rather than a flicker. Never later than CAP_MS
   after it appeared: a reader on a very slow line is not held behind it.
   If it lifts at the cap before the scripts are running, it marks itself
   `data-late` and globals.css shows every hidden block at once, since the
   motion code that would have revealed them is not there yet.

   ── THE CASES WHERE IT NEVER APPEARS ──────────────────────────────────────

   Scripts off: it is never built. Moving between pages inside the site: the
   layout does not reload, so it never runs again. It appears on a page
   opened fresh — typed, linked from outside, or reloaded.

   Under prefers-reduced-motion the columns do not travel; the curtain
   simply goes.
   ========================================================================= */

declare global {
  interface Window {
    /** false while the curtain is up; true once it has begun to lift.
     *  Absent when there was never a curtain. Read by useCurtainUp. */
    __curtainUp?: boolean;
    /** Set by the first animated block inside <main> to come alive
     *  (useSeen). */
    __seenLive?: boolean;
  }
}

/** The shortest time it stays up, from the moment it appears. */
const MIN_MS = 900;
/** The longest, whatever is still loading. */
const CAP_MS = 6000;
/** From the start of the lift to the hero's entrance: the box has faded and
 *  the first column is clearing the headline. */
const HAND_OVER_MS = 320;
/** From the start of the lift to the last column being gone. */
const GONE_MS = 1150;

/* NO LETTER CHURN (4 October 2026, the owner's request: the typography must
   not move). The name used to settle letter by letter out of random
   characters, the reference's own gesture; the site's other churn went on
   28 September 2026, and this one followed. The name is written once and
   stands still while the line fills. */

/* The firm's '///' mark, as FirmMark draws it (components/ui.tsx). */
const MARK_PATH = 'M9 0h9L9 22H0zM22 0h9l-9 22h-9zM35 0h9l-9 22h-9z';

/* Serialised with toString() into the page, so it must be self-contained:
   nothing from outside its own body, only its arguments. */
function curtain(
  name: string,
  mark: string,
  path: string,
  minMs: number,
  capMs: number,
  handOverMs: number,
  goneMs: number,
) {
  const d = document;
  const w = window;
  const root = d.documentElement;
  if (!d.body || d.getElementById('curtain')) return;
  const reduce = !!w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const c = d.createElement('rc-curtain');
  c.id = 'curtain';
  c.setAttribute('aria-hidden', 'true');
  c.innerHTML =
    '<div class="curtain-cols"><i></i><i></i><i></i><i></i><i></i></div>' +
    '<div class="curtain-box">' +
    '<div class="curtain-glow"></div>' +
    '<div class="curtain-row">' +
    '<span class="curtain-name"><svg viewBox="0 0 44 22" fill="currentColor"><path d="' + path + '"/></svg>' +
    '<span><b></b><sup>' + mark + '</sup></span></span>' +
    '<span class="curtain-pct t-mono tabular-nums">000%</span>' +
    '</div>' +
    '<div class="curtain-track"><i></i></div>' +
    '</div>';
  d.body.prepend(c);
  w.__curtainUp = false;

  (c.querySelector('b') as HTMLElement).textContent = name;
  const pctEl = c.querySelector('.curtain-pct') as HTMLElement;
  const fillEl = c.querySelector('.curtain-track > i') as HTMLElement;
  const glowEl = c.querySelector('.curtain-glow') as HTMLElement;

  const t0 = performance.now();
  let last = t0;
  const got = { dom: false, font: false, pic: false, app: false };
  const hit = (k: keyof typeof got) => {
    if (!got[k]) {
      got[k] = true;
      last = performance.now();
    }
  };

  // The page's scripts are running: MotionReady has dropped `js` because it
  // arrived too late to animate, or it has stamped `motion-on` and the
  // page's own blocks are alive too (see WHAT THE PERCENTAGE COUNTS).
  const appCheck = () => {
    const cl = root.classList;
    if (!cl.contains('js')) hit('app');
    else if (
      cl.contains('motion-on') &&
      (w.__seenLive || !d.querySelector('main .in-view'))
    )
      hit('app');
  };

  const onDom = () => {
    hit('dom');
    const img = d.querySelector<HTMLImageElement>('main img[fetchpriority="high"]');
    const decoded = () => {
      if (img && img.decode) img.decode().then(() => hit('pic'), () => hit('pic'));
      else hit('pic');
    };
    if (!img || img.complete) decoded();
    else {
      img.addEventListener('load', decoded, { once: true });
      img.addEventListener('error', () => hit('pic'), { once: true });
    }
    // One frame later, so the page has been laid out and its font requested;
    // asked any earlier, `fonts.ready` answers before the load has begun.
    requestAnimationFrame(() => {
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(() => hit('font'), () => hit('font'));
      else hit('font');
    });
  };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', onDom, { once: true });
  else onDom();

  let shown = 0;
  let full = 0;
  let lifted = false;

  const lift = (late: boolean) => {
    lifted = true;
    if (late) c.setAttribute('data-late', '');
    c.setAttribute('data-state', 'lift');
    setTimeout(
      () => {
        w.__curtainUp = true;
        w.dispatchEvent(new Event('curtain:up'));
      },
      reduce ? 0 : handOverMs,
    );
    setTimeout(() => c.setAttribute('data-state', 'gone'), reduce ? 0 : goneMs);
  };

  const tick = (now: number) => {
    if (lifted) return;
    if (!got.app) appCheck();
    const n = +got.dom + +got.font + +got.pic + +got.app;
    const all = n === 4;
    const goal = all ? 100 : Math.min(99, n * 25 + 22 * (1 - Math.exp(-(now - last) / 1400)));
    shown += (goal - shown) * (all ? 0.25 : 0.08);
    if (all && shown > 99.6) shown = 100;
    // The line and the glow move by transform only, which the browser does
    // without laying the page out again; the number is text, so it is
    // written only when it changes. Every frame of this runs while the page
    // underneath is still arriving, and on a slow phone that frame time is
    // the page's.
    fillEl.style.transform = 'scaleX(' + shown / 100 + ')';
    glowEl.style.transform = 'translateX(' + shown + '%)';
    const pct = String(Math.floor(shown)).padStart(3, '0') + '%';
    if (pct !== pctEl.textContent) pctEl.textContent = pct;

    const age = now - t0;
    if (shown === 100 && !full) full = now;
    if ((full && now - full >= 150 && age >= minMs) || age >= capMs) {
      lift(!got.app);
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export const CURTAIN_JS = `(${curtain.toString()})(${[
  JSON.stringify(SITE.name),
  JSON.stringify(SITE.mark),
  JSON.stringify(MARK_PATH),
  MIN_MS,
  CAP_MS,
  HAND_OVER_MS,
  GONE_MS,
].join(',')})`;
