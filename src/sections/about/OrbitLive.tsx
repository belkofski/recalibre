'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useActiveStep, useReducedMotion } from '@/lib/motion';

/* ============================================================================
   THE ORBIT, LIVE — the one script the drawing takes.

   The orbit (Orbit.tsx) is the server's SVG, complete with node 01 lit.
   This leaf wraps it inside the disciplines' scroll story and reads the
   chapter the story is reporting (`useActiveStep`, one reading of where
   the reader is, shared with the OPS story's caption), then writes it on
   the SVG as `data-active`, which is all the stylesheet needs to light the
   node.

   And one small movement, so the change of chapter is seen as a change in
   the system rather than a swap of colours: when the lit node changes, one
   dot in the signal blue rides the newly lit connector from the core out
   to its node, 0.9s easing out, and is gone. Never on the first reading
   (the page arrives with its node already lit), never under reduced
   motion, and never a loop: one ride per change, and a change during a
   ride starts the new one in place of the old. The dot is made and moved
   by hand in the SVG's own units (`getPointAtLength`), as the diagram's
   dots are, so nothing is laid out again.
   ========================================================================= */

const SVG_NS = 'http://www.w3.org/2000/svg';
/** One ride, core to node. */
const RIDE_MS = 900;
/** Out fast, in slow: the dot leaves the core at speed and settles on the
 *  node, which is the direction the eye should take. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

export default function OrbitLive({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useActiveStep(ref);
  const reduced = useReducedMotion();
  /* The node the SVG shows now; null until the first write, so the page's
     own first chapter never earns a ride. */
  const shown = useRef<number | null>(null);

  useEffect(() => {
    const svg = ref.current?.querySelector<SVGSVGElement>('svg[data-orbit]');
    if (!svg) return;
    svg.setAttribute('data-active', String(active));
    const was = shown.current;
    shown.current = active;
    if (was === null || was === active || reduced) return;

    const path = svg.querySelector<SVGPathElement>(`.orbit-edge-${active}`);
    const layer = svg.querySelector<SVGGElement>('g[data-orbit-dot]');
    if (!path || !layer || typeof path.getTotalLength !== 'function') return;
    const length = path.getTotalLength();
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('r', '3');
    dot.setAttribute('class', 'orbit-dot');
    layer.replaceChildren(dot);

    let raf = 0;
    let t0 = -1;
    const frame = (now: number) => {
      if (t0 < 0) t0 = now;
      const t = Math.min(1, (now - t0) / RIDE_MS);
      const at = path.getPointAtLength(easeOut(t) * length);
      dot.setAttribute('cx', at.x.toFixed(2));
      dot.setAttribute('cy', at.y.toFixed(2));
      if (t < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        dot.remove();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      dot.remove();
    };
  }, [active, reduced]);

  /* A box that lays out nothing: the SVG keeps its place in the card. */
  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
