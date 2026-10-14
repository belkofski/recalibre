'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useReducedMotion, useSeen } from '@/lib/motion';

/* ============================================================================
   THE HUB'S STAGE: the lines between the cards and the tile, the light that
   runs along them, and the entrance (sections/home/MarkRow.tsx sets the
   cards and the tile; globals.css, "THE PARTNER HUB", lays them out).

   THE LINES ARE MEASURED, NOT DRAWN TO A PICTURE. The cards and the tile are
   laid out by CSS at every width; once they are, this reads where each card
   and the tile sit and draws one line per card into an SVG over the stage.
   Side by side (810 and up), a line leaves the card's inner edge level and
   meets the tile's edge level, an S between them, the left three spread
   over the middle fifth of the tile's edge and the right two over its middle
   tenth, as the reference's do. Upright (under 810), each card's line turns
   up into one line that runs from the lowest card into the tile's foot.
   Without the scripts there are no lines; the cards and the tile are
   complete without them.

   THE LIGHT. Every few seconds a short bright stroke with a fainter tail
   leaves a card and runs along its line into the tile, each line on its own
   beat; pointing at a card, or focusing it, sends one at once and lights
   its line. It runs only while the stage is on screen, and never for a
   reader who has asked for less motion.

   THE ENTRANCE, once, when the stage first comes into view: the tile settles
   from 0.94, the cards come in from their own side (from below on a phone),
   and the lines draw from each card to the tile. Its resting state is the
   finished one; the hidden state waits for `motion-on` (lib/motion.tsx,
   MotionReady), so a page whose scripts never run shows everything.
   ========================================================================= */

type Line = { base: string; beam: string };
type Geometry = { w: number; h: number; lines: Line[]; trunk: string | null };

/** Where each side's lines meet the tile, as fractions of its height. */
const SPREAD_LEFT = [-0.1, 0, 0.1];
const SPREAD_RIGHT = [-0.05, 0.05];
/** The light: its head and tail in px, its speed in px/s, and the pause
 *  after each run on each line, so no two lines keep the same beat. */
const HEAD = 16;
const TAIL = 64;
const SPEED = 240;
const REST = [2600, 3400, 2900, 3800, 3100];
const FIRST = [900, 1500, 2100, 1200, 1800];

const r1 = (n: number) => Math.round(n * 10) / 10;

function measure(stage: HTMLElement): Geometry | null {
  const tileEl = stage.querySelector<HTMLElement>('[data-hub-tile]');
  const cardEls = [...stage.querySelectorAll<HTMLElement>('[data-hub-card] > .hub-card')];
  if (!tileEl || cardEls.length === 0) return null;
  const s = stage.getBoundingClientRect();
  const t = tileEl.getBoundingClientRect();
  const tx = t.left + t.width / 2 - s.left;
  const ty = t.top + t.height / 2 - s.top;
  const cards = cardEls.map((el) => {
    const c = el.getBoundingClientRect();
    return { l: c.left - s.left, r: c.right - s.left, t: c.top - s.top, cy: c.top + c.height / 2 - s.top, cx: c.left + c.width / 2 - s.left };
  });
  const upright = t.bottom - s.top <= Math.min(...cards.map((c) => c.t)) + 1;

  if (!upright) {
    let li = 0;
    let ri = 0;
    const lines = cards.map((c) => {
      const left = c.cx < tx;
      const x0 = left ? c.r : c.l;
      const x1 = left ? t.left - s.left + 2 : t.right - s.left - 2;
      const y1 = ty + (left ? SPREAD_LEFT[li++] ?? 0 : SPREAD_RIGHT[ri++] ?? 0) * t.height;
      const dx = (x1 - x0) / 2;
      const d = `M${r1(x0)} ${r1(c.cy)}C${r1(x0 + dx)} ${r1(c.cy)} ${r1(x1 - dx)} ${r1(y1)} ${r1(x1)} ${r1(y1)}`;
      return { base: d, beam: d };
    });
    return { w: s.width, h: s.height, lines, trunk: null };
  }

  const foot = t.bottom - s.top - 2;
  const turn = 12;
  const lines = cards.map((c) => {
    const left = c.cx < tx;
    const x0 = left ? c.r : c.l;
    const dir = left ? 1 : -1;
    const branch = `M${r1(x0)} ${r1(c.cy)}L${r1(tx - dir * turn)} ${r1(c.cy)}Q${r1(tx)} ${r1(c.cy)} ${r1(tx)} ${r1(c.cy - turn)}`;
    return { base: branch, beam: `${branch}L${r1(tx)} ${r1(foot)}` };
  });
  const lowest = Math.max(...cards.map((c) => c.cy)) - turn;
  return { w: s.width, h: s.height, lines, trunk: `M${r1(tx)} ${r1(foot)}L${r1(tx)} ${r1(lowest)}` };
}

export default function PartnerStage({ children }: { children: ReactNode }) {
  const { ref, seen } = useSeen<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const heads = useRef<(SVGPathElement | null)[]>([]);
  const tails = useRef<(SVGPathElement | null)[]>([]);
  const runs = useRef<{ anims: Animation[]; delay: number; travel: number; period: number }[]>([]);
  const glowId = `hub-glow-${useId().replace(/:/g, '')}`;

  // Measure once the layout has settled, and again whenever it changes.
  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setGeo(measure(stage)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(stage);
    const tile = stage.querySelector('[data-hub-tile]');
    if (tile) ro.observe(tile);
    document.fonts?.ready.then(update).catch(() => {});
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref]);

  // Which card is under the pointer or holds the focus.
  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    const at = (e: Event) => {
      const slot = (e.target as Element | null)?.closest?.('[data-hub-card]');
      return slot ? Number(slot.getAttribute('data-hub-card')) : null;
    };
    const over = (e: Event) => setActive(at(e));
    const out = () => setActive(null);
    stage.addEventListener('pointerover', over);
    stage.addEventListener('pointerleave', out);
    stage.addEventListener('focusin', over);
    stage.addEventListener('focusout', out);
    return () => {
      stage.removeEventListener('pointerover', over);
      stage.removeEventListener('pointerleave', out);
      stage.removeEventListener('focusin', over);
      stage.removeEventListener('focusout', out);
    };
  }, [ref]);

  // The light, once the stage has been seen, for as long as the geometry
  // holds; paused whenever the stage is off screen.
  useEffect(() => {
    const stage = ref.current;
    if (!stage || !geo || !seen || reduced) return;
    if (typeof Element.prototype.animate !== 'function') return;
    const all: Animation[] = [];
    runs.current = geo.lines.map((_, i) => {
      const head = heads.current[i];
      const tail = tails.current[i];
      if (!head || !tail) return { anims: [], delay: 0, travel: 0, period: 0 };
      const len = head.getTotalLength();
      const travel = (len + TAIL) / SPEED * 1000;
      const period = travel + (REST[i % REST.length] ?? 3000);
      const delay = FIRST[i % FIRST.length] ?? 1200;
      // `backwards`: while it waits, the stroke sits before the line's start.
      const timing: KeyframeAnimationOptions = { duration: period, iterations: Infinity, delay, fill: 'backwards' };
      const at = travel / period;
      const go = 'cubic-bezier(0.45, 0, 0.35, 1)';
      head.style.strokeDasharray = `${HEAD} ${len + TAIL + HEAD}`;
      tail.style.strokeDasharray = `${TAIL} ${len + TAIL + HEAD}`;
      const a = head.animate(
        [{ strokeDashoffset: HEAD, offset: 0, easing: go }, { strokeDashoffset: HEAD - len - TAIL, offset: at }, { strokeDashoffset: HEAD - len - TAIL, offset: 1 }],
        timing,
      );
      const b = tail.animate(
        [{ strokeDashoffset: TAIL, offset: 0, easing: go }, { strokeDashoffset: -len, offset: at }, { strokeDashoffset: -len, offset: 1 }],
        timing,
      );
      all.push(a, b);
      return { anims: [a, b], delay, travel, period };
    });
    const io = new IntersectionObserver((entries) => {
      const on = entries.some((e) => e.isIntersecting);
      all.forEach((a) => (on ? a.play() : a.pause()));
    });
    io.observe(stage);
    return () => {
      io.disconnect();
      all.forEach((a) => a.cancel());
      runs.current = [];
    };
  }, [geo, seen, reduced, ref]);

  // A card under the pointer sends its light at once, unless it is on its way.
  useEffect(() => {
    if (active === null) return;
    const run = runs.current[active];
    if (!run || run.anims.length === 0) return;
    const t = Number(run.anims[0]?.currentTime) || 0;
    if (t >= run.delay && (t - run.delay) % run.period < run.travel) return;
    run.anims.forEach((a) => (a.currentTime = run.delay));
  }, [active]);

  return (
    <div ref={ref} className={`hub-stage ${seen ? 'is-in' : ''}`}>
      {geo ? (
        <svg className="hub-lines" width={geo.w} height={geo.h} viewBox={`0 0 ${r1(geo.w)} ${r1(geo.h)}`} aria-hidden="true" focusable="false">
          <defs>
            <filter id={glowId} filterUnits="userSpaceOnUse" x="0" y="0" width={geo.w} height={geo.h}>
              <feGaussianBlur stdDeviation="2.4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {geo.trunk ? <path className="hub-line" d={geo.trunk} pathLength={1} style={{ '--d': '350ms' } as CSSProperties} /> : null}
          {geo.lines.map((l, i) => (
            <path
              key={`l${i}`}
              className="hub-line"
              d={l.base}
              pathLength={1}
              data-on={active === i ? '' : undefined}
              style={{ '--d': `${(geo.trunk ? 650 : 450) + i * 90}ms` } as CSSProperties}
            />
          ))}
          {reduced
            ? null
            : geo.lines.map((l, i) => (
                <g key={`b${i}`} className="hub-beam">
                  <path ref={(el) => { tails.current[i] = el; }} className="hub-beam-tail" d={l.beam} />
                  <path ref={(el) => { heads.current[i] = el; }} className="hub-beam-head" d={l.beam} filter={`url(#${glowId})`} />
                </g>
              ))}
        </svg>
      ) : null}
      {children}
    </div>
  );
}
