'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion, useSeen } from '@/lib/motion';

/* ============================================================================
   THE HUB'S STAGE: the lines between the cards and the centre card, their
   port dots, the dots that ride them, and the entrance
   (sections/home/MarkRow.tsx sets the cards; globals.css, "THE PARTNER
   HUB", lays them out). Drawn in the Contraxis diagram's language
   (components/SystemDiagram.tsx), with its numbers.

   THE LINES ARE MEASURED. The cards and the centre card are laid out by CSS
   at every width; once they are, this reads where each sits and draws one
   cubic line per card into an SVG under them. Side by side (810 and up),
   the two left lines run into the middle of the centre card's left edge
   and the three right lines leave the middle of its right edge, as the
   Contraxis lines meet its centre card at one point a side. Upright (under
   810) the same lines run down: from the two cards above into the centre
   card's top, and from its foot to the three below. A port dot sits where
   each line meets a card; none on the centre card, as in the diagram.
   Without the scripts there are no lines; the cards are complete without
   them.

   THE DOTS RUN ONLY UNDER THE POINTER, the diagram's rule (Phase C, 28
   September 2026: nothing moves unless a reader moves it, and nothing
   loops). Pointing at the panel or moving focus into it sends two dots
   along every line, half a loop apart, one loop in 2.86 seconds: they fade
   in, ride for about a loop and a half and fade out, 4.6 seconds in all
   (under WCAG 2.2.2's five). Never for a reader who has asked for less
   motion.

   THE ENTRANCE is the site's own reveal, once, as the stage comes into
   view: the centre card fades in, the cards rise 24px into place a column
   step apart, and the lines fade in with them. Its resting state is the
   finished one; the hidden state waits for `motion-on`.
   ========================================================================= */

type Line = { d: string };
type Geometry = { w: number; h: number; lines: Line[]; ports: [number, number][] };

/** The diagram's numbers (SystemDiagram.tsx and FULL in lib/diagram.ts). */
const LOOP_MS = 2860;
const RUN_MS = 4600;
const FADE_MS = 300;
const DOT_OPACITY = 0.7;
const PORT_R = 3.5;
const DOT_R = 2;

const r1 = (n: number) => Math.round(n * 10) / 10;

function measure(stage: HTMLElement): Geometry | null {
  const coreEl = stage.querySelector<HTMLElement>('[data-hub-core]');
  const cardEls = [...stage.querySelectorAll<HTMLElement>('[data-hub-card] > .hub-card')];
  if (!coreEl || cardEls.length === 0) return null;
  const s = stage.getBoundingClientRect();
  const k = coreEl.getBoundingClientRect();
  const core = { l: k.left - s.left, r: k.right - s.left, t: k.top - s.top, b: k.bottom - s.top };
  const cx = (core.l + core.r) / 2;
  const cy = (core.t + core.b) / 2;
  const cards = cardEls.map((el) => {
    const c = el.getBoundingClientRect();
    return { l: c.left - s.left, r: c.right - s.left, t: c.top - s.top, b: c.bottom - s.top };
  });
  // Side by side when every card stands clear of the centre card's width.
  const upright = !cards.every((c) => c.r <= core.l + 1 || c.l >= core.r - 1);

  const lines: Line[] = [];
  const ports: [number, number][] = [];
  for (const c of cards) {
    if (!upright) {
      // Left cards run in to the centre; right cards are run out to.
      const left = c.r <= core.l + 1;
      const yc = (c.t + c.b) / 2;
      const [x0, y0, x1, y1] = left ? [c.r, yc, core.l, cy] : [core.r, cy, c.l, yc];
      const dx = (x1 - x0) / 2;
      lines.push({ d: `M${r1(x0)} ${r1(y0)}C${r1(x0 + dx)} ${r1(y0)} ${r1(x1 - dx)} ${r1(y1)} ${r1(x1)} ${r1(y1)}` });
      ports.push(left ? [r1(c.r), r1(yc)] : [r1(c.l), r1(yc)]);
    } else {
      const above = c.b <= core.t + 1;
      const xc = (c.l + c.r) / 2;
      const [x0, y0, x1, y1] = above ? [xc, c.b, cx, core.t] : [cx, core.b, xc, c.t];
      const dy = (y1 - y0) / 2;
      lines.push({ d: `M${r1(x0)} ${r1(y0)}C${r1(x0)} ${r1(y0 + dy)} ${r1(x1)} ${r1(y1 - dy)} ${r1(x1)} ${r1(y1)}` });
      ports.push(above ? [r1(xc), r1(c.b)] : [r1(xc), r1(c.t)]);
    }
  }
  return { w: s.width, h: s.height, lines, ports };
}

export default function PartnerStage({ children }: { children: ReactNode }) {
  const { ref, seen } = useSeen<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [geo, setGeo] = useState<Geometry | null>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const dotLayer = useRef<SVGGElement | null>(null);

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
    document.fonts?.ready.then(update).catch(() => {});
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref]);

  // The dots: one run of 4.6 seconds each time the reader points at the
  // panel or moves focus into it, never while one is running.
  useEffect(() => {
    const stage = ref.current;
    const panel = stage?.closest<HTMLElement>('.hub-panel') ?? stage;
    if (!stage || !panel || !geo || reduced) return;
    let raf = 0;
    let start = 0;
    const lens = geo.lines.map((_, i) => paths.current[i]?.getTotalLength() ?? 0);

    const frame = (now: number) => {
      const t = now - start;
      const layer = dotLayer.current;
      if (!layer || t >= RUN_MS) {
        layer?.setAttribute('opacity', '0');
        raf = 0;
        return;
      }
      const fade = Math.min(1, t / FADE_MS, (RUN_MS - t) / FADE_MS);
      layer.setAttribute('opacity', (fade * DOT_OPACITY).toFixed(3));
      const phase = (t % LOOP_MS) / LOOP_MS;
      const dots = layer.querySelectorAll('circle');
      geo.lines.forEach((_, i) => {
        const path = paths.current[i];
        const len = lens[i] ?? 0;
        if (!path || !len) return;
        for (let j = 0; j < 2; j++) {
          const c = dots[i * 2 + j];
          if (!c) continue;
          const p = path.getPointAtLength(len * ((phase + j * 0.5) % 1));
          c.setAttribute('cx', p.x.toFixed(2));
          c.setAttribute('cy', p.y.toFixed(2));
        }
      });
      raf = requestAnimationFrame(frame);
    };
    const run = () => {
      if (raf) return;
      start = performance.now();
      raf = requestAnimationFrame(frame);
    };
    panel.addEventListener('pointerenter', run);
    panel.addEventListener('focusin', run);
    const layer = dotLayer.current;
    return () => {
      panel.removeEventListener('pointerenter', run);
      panel.removeEventListener('focusin', run);
      if (raf) cancelAnimationFrame(raf);
      layer?.setAttribute('opacity', '0');
    };
  }, [geo, reduced, ref]);

  return (
    <div ref={ref} className={`hub-stage ${seen ? 'is-in' : ''}`}>
      {geo ? (
        <svg className="hub-lines" width={geo.w} height={geo.h} viewBox={`0 0 ${r1(geo.w)} ${r1(geo.h)}`} aria-hidden="true" focusable="false">
          <g className="hub-line">
            {geo.lines.map((l, i) => (
              <path key={`l${i}`} ref={(el) => { paths.current[i] = el; }} d={l.d} />
            ))}
          </g>
          {reduced ? null : (
            <g ref={dotLayer} className="hub-dots" opacity={0}>
              {geo.lines.flatMap((_, i) => [0, 1].map((j) => <circle key={`d${i}-${j}`} r={DOT_R} cx={-10} cy={-10} />))}
            </g>
          )}
        </svg>
      ) : null}
      {children}
      {geo ? (
        <svg className="hub-ports" width={geo.w} height={geo.h} viewBox={`0 0 ${r1(geo.w)} ${r1(geo.h)}`} aria-hidden="true" focusable="false">
          {geo.ports.map(([x, y], i) => (
            <circle key={`p${i}`} cx={x} cy={y} r={PORT_R} />
          ))}
        </svg>
      ) : null}
    </div>
  );
}
