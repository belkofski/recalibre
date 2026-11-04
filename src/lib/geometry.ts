/* ============================================================================
   SHARED GEOMETRY (4 November 2026) — the Bézier the diagrams ride.

   The Contraxis system diagram (lib/diagram.ts), the partner hub's lines
   (sections/home/PartnerStage.tsx), the process diagram on About and the
   workflow canvas all draw the same S-curve between two ports and put dots
   on it. It was computed in diagram.ts alone; it lives here so every
   drawing bends the same way.
   ========================================================================= */

export type Pt = readonly [number, number];

const r1 = (n: number) => Math.round(n * 10) / 10;
const fmt = (p: Pt) => `${r1(p[0])} ${r1(p[1])}`;

/** The reference's connector: a cubic whose control points sit 0.45 of the
 *  gap from each end, never closer than 40 — along x for a left-to-right
 *  line, along y for a top-to-bottom one. On a short gap the 40 gives way
 *  to 0.9 of the gap, in both directions: a control point further out than
 *  the gap itself bends the curve back on itself in the middle, and the
 *  dots riding it would run backwards for a moment. */
export function cubic(a: Pt, b: Pt, axis: 'x' | 'y'): readonly [Pt, Pt, Pt, Pt] {
  const gap = axis === 'x' ? b[0] - a[0] : b[1] - a[1];
  const c = Math.max(0.45 * gap, Math.min(40, 0.9 * gap));
  const c1: Pt = axis === 'x' ? [a[0] + c, a[1]] : [a[0], a[1] + c];
  const c2: Pt = axis === 'x' ? [b[0] - c, b[1]] : [b[0], b[1] - c];
  return [a, c1, c2, b];
}

/** The SVG path of that curve. */
export function cubicPath(p: readonly [Pt, Pt, Pt, Pt]): string {
  return `M ${fmt(p[0])} C ${fmt(p[1])}, ${fmt(p[2])}, ${fmt(p[3])}`;
}

/** The point at `t` (0 to 1) along a cubic Bézier, for a dot that rides it. */
export function pointAt(p: readonly [Pt, Pt, Pt, Pt], t: number): Pt {
  const u = 1 - t;
  const x = u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0];
  const y = u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1];
  return [x, y];
}
