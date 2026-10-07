/* ============================================================================
   THE CONTRAXIS SYSTEM DIAGRAM — the geometry, with no React in it.

   The owner's decision of 26 September 2026: the still schematic that stood
   in every Contraxis slot is replaced by a moving system diagram in the style
   of the Diagramflow reference (its NEURAL mode, dark theme), a paid Framer
   component. Only its style is rebuilt, from measurements taken off its
   live demo on 26 September 2026; no code, icon or picture of it is used.

   WHAT IT SHOWS is the same five steps the schematic showed, in the approved
   words and nothing else: three kinds of document are read, Contraxis in
   the middle, the three things it produces, and the step that is not
   automated. The flow runs left to right, or top to bottom where
   the slot is taller than it is wide: into Contraxis, out to the three
   outputs, and from the outputs to "A person decides". The reference's own
   dots all run INTO its centre; ours run through it, because that is the
   order of the five steps.

   ── WHY IT IS BUILT AS A SET OF FIXED LAYOUTS ─────────────────────────────

   The diagram must be complete in the server's HTML, lines and words
   included, so it cannot wait for a script to measure its box. Each layout
   below is computed once, here, for a nominal box, and drawn as one SVG
   whose viewBox is that box; the SVG then scales to the slot it lands in.
   A slot holds several layouts and CSS container queries show the one that
   fits (`.sd` in globals.css), so the words stay within about a fifth of
   their design size at every width, and nothing has to be re-laid-out once
   the page is running. The travelling dots are the only thing the script
   adds, and they move in the same viewBox units as the lines they ride.

   ── NOTHING IS CUT SHORT ──────────────────────────────────────────────────

   Every card is as wide as its own words, measured in Geist at the sizes
   below (the table in `W`), with a little slack. A layout that
   cannot hold its words at the gap it needs says why instead of squeezing
   them, so a bad combination fails the build, not a reader's screen. Where
   a slot is too small for words, the layout drops to icon tiles only
   (`bare`), never to "Contr…".
   ========================================================================= */

export type IconName = 'contract' | 'invoice' | 'report' | 'findings' | 'actions' | 'trace' | 'person';
export type Role = 'in' | 'core' | 'out' | 'end';
export type Pt = readonly [number, number];

/* ── THE WORDS ─────────────────────────────────────────────────────────────
   Every one of them is already approved Contraxis copy: the three inputs are
   the three kinds of document in "Read — contracts, invoices and reports
   taken as they arrive" (content/work.ts), the step words are the
   schematic's own labels, "Document intelligence" is the category on the
   meta line, and the description is the schematic's aria-label, verbatim.
   The steps' numbers ("01 · Document") came off on 28 September 2026: the
   lines already give the order, and a number that only counts is a
   counter. The words are unchanged. */
export const DIAGRAM_DESCRIPTION =
  'A schematic of Contraxis: a document is read, findings surfaced, actions proposed, every step recorded. A person decides.';
export const DIAGRAM_CAPTION = 'Schematic — not a screenshot';

type Spec = { key: string; role: Role; icon: IconName | null; lines: readonly string[]; sub: string };

const SPECS: readonly Spec[] = [
  { key: 'contracts', role: 'in', icon: 'contract', lines: ['Contracts'], sub: 'Document' },
  { key: 'invoices', role: 'in', icon: 'invoice', lines: ['Invoices'], sub: 'Document' },
  { key: 'reports', role: 'in', icon: 'report', lines: ['Reports'], sub: 'Document' },
  { key: 'core', role: 'core', icon: null, lines: ['Contraxis'], sub: 'Document intelligence' },
  { key: 'findings', role: 'out', icon: 'findings', lines: ['Findings'], sub: 'Surface' },
  { key: 'actions', role: 'out', icon: 'actions', lines: ['Actions'], sub: 'Propose' },
  { key: 'trace', role: 'out', icon: 'trace', lines: ['Traceability'], sub: 'Record' },
  { key: 'decide', role: 'end', icon: 'person', lines: ['A person decides'], sub: 'Decide' },
];

/* Advance widths per 1px of type, read in the browser off the site's own
   Geist (500; 600 for the centre title; 400 for its sub). The small sub
   line ("Document") is measured at 0.6em a character, the advance of
   the Geist Mono it was set in until 27 September 2026; it is set in Geist
   now (one face, the owner's decision), which is narrower, so that measure
   errs wide and nothing it sizes can be cut. SLACK covers hinting and the
   fallback face. */
const W: Record<string, number> = {
  Contracts: 4.63,
  Invoices: 3.8572,
  Reports: 3.6894,
  Findings: 3.9826,
  Actions: 3.5374,
  Traceability: 5.4142,
  'A person decides': 8.0516,
  'A person': 4.145,
  decides: 3.6638,
  Contraxis: 4.6202,
  'Document intelligence': 10.255,
};
const SLACK = 1.05;
const sansW = (t: string, fs: number) => (W[t] ?? t.length * 0.6) * fs * SLACK;
const monoW = (t: string, fs: number) => t.length * 0.6 * fs * SLACK;

/* ── THE MEASURES ──────────────────────────────────────────────────────────
   FULL is the reference's card at 1:1 — 64 tall, a 32 tile at radius 9, an
   18 icon, radius 14, title 14/500, sub 12 — the sub in the label style.
   The centre card is its 168 x 130 card, cut to our words. COMPACT and TIGHT
   are the same card at the steps below, for slots a third and a half the
   size, and MICRO is the smallest step that still sets its words at 11. */
export type Metrics = {
  fsT: number;
  fsS: number;
  tile: number;
  tileR: number;
  icon: number;
  r: number;
  padX: number;
  padY: number;
  gap: number;
  lead: number;
  /** The port dot where a line meets a card, and the dot riding the line. */
  port: number;
  dot: number;
  core: { fsT: number; fsS: number; q: number; padX: number; padY: number; gap: number; r: number };
};

/** The gallery's panel is a square the width of the page; the reference's
 *  card at a quarter up again fills it the way the reference fills a
 *  window. */
export const XL: Metrics = {
  fsT: 17.5, fsS: 14, tile: 40, tileR: 11, icon: 22, r: 17, padX: 17, padY: 20, gap: 15, lead: 5, port: 4.25, dot: 2.4,
  core: { fsT: 19, fsS: 15, q: 13, padX: 28, padY: 30, gap: 17, r: 25 },
};
export const FULL: Metrics = {
  fsT: 14, fsS: 11.5, tile: 32, tileR: 9, icon: 18, r: 14, padX: 14, padY: 16, gap: 12, lead: 4, port: 3.5, dot: 2,
  core: { fsT: 15, fsS: 12, q: 10, padX: 22, padY: 24, gap: 14, r: 20 },
};
export const COMPACT: Metrics = {
  fsT: 13, fsS: 10.5, tile: 28, tileR: 8, icon: 16, r: 12, padX: 11, padY: 10, gap: 10, lead: 3, port: 3.25, dot: 2,
  core: { fsT: 14, fsS: 11, q: 8, padX: 18, padY: 18, gap: 11, r: 16 },
};
/* TIGHT's centre card sets "Document intelligence" at 11, not 10: the one
   TIGHT layout that prints it (the gallery's phone block) draws at 0.914 on
   a 360px phone, and at 10 it rendered 9.14px there. */
export const TIGHT: Metrics = {
  fsT: 12, fsS: 10, tile: 24, tileR: 7, icon: 14, r: 10, padX: 9, padY: 8, gap: 8, lead: 2, port: 3, dot: 1.8,
  core: { fsT: 13, fsS: 11, q: 7, padX: 14, padY: 14, gap: 9, r: 14 },
};
export const MICRO: Metrics = {
  fsT: 11, fsS: 9.5, tile: 20, tileR: 6, icon: 13, r: 9, padX: 7, padY: 6, gap: 6, lead: 2, port: 2.6, dot: 1.6,
  core: { fsT: 12, fsS: 9.5, q: 6, padX: 10, padY: 11, gap: 7, r: 12 },
};

/** How a card lays out its content. `row`: the tile left of the words, as the
 *  reference's cards. `stack`: the tile over the words, centred, for a column
 *  too narrow for both side by side. `bare`: the tile alone. */
export type NodeStyle = 'row' | 'stack' | 'bare';

export type DNode = {
  key: string;
  role: Role;
  icon: IconName | null;
  style: NodeStyle | 'core';
  lines: readonly string[];
  sub: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type DEdge = {
  key: string;
  p: readonly [Pt, Pt, Pt, Pt];
  d: string;
  /** A port dot where the line meets a card; none on the centre card. */
  ports: readonly Pt[];
};

export type Layout = { w: number; h: number; m: Metrics; nodes: readonly DNode[]; edges: readonly DEdge[] };

type Opts = {
  style: NodeStyle;
  subs: boolean;
  coreTitle: boolean;
  coreSub: boolean;
  /** The last card's words on two lines ("A person" / "decides"). */
  endTwoLines?: boolean;
  mx: number;
  my: number;
};

/** The line box a line of type takes, shared with the renderer so the
 *  words land where the card was sized for them. */
export const lh = (fs: number) => Math.round(fs * 1.22 * 10) / 10;

function linesOf(s: Spec, o: Opts): readonly string[] {
  if (o.style === 'bare') return [];
  if (s.role === 'core') return o.coreTitle ? s.lines : [];
  if (s.role === 'end' && o.endTwoLines) return ['A person', 'decides'];
  return s.lines;
}

/** The size a card needs for its own words. */
function measure(s: Spec, m: Metrics, o: Opts): { w: number; h: number; lines: readonly string[]; sub: string | null } {
  const lines = linesOf(s, o);
  if (s.role === 'core') {
    const c = m.core;
    const sub = o.coreSub && o.style !== 'bare' ? s.sub : null;
    // The centre mark is the '///', twice as wide as it is tall (it was
    // the three squares, a square; 28 September 2026).
    const glyph = 2 * c.q + Math.round(c.q * 0.25);
    const tw = Math.max(0, ...lines.map((t) => sansW(t, c.fsT)));
    const sw = sub ? sansW(sub, c.fsS) : 0;
    const block = lines.length * lh(c.fsT) + (sub ? 2 + lh(c.fsS) : 0);
    if (!block) {
      return { w: Math.ceil(2 * glyph + 2 * c.padY), h: Math.ceil(glyph + 2 * c.padY), lines, sub };
    }
    const w = Math.max(tw, sw, 2 * glyph) + 2 * c.padX;
    const h = c.padY + glyph + c.gap + block + c.padY;
    return { w: Math.ceil(w), h: Math.ceil(h), lines, sub };
  }
  const sub = o.subs && o.style !== 'bare' ? s.sub : null;
  const tw = Math.max(0, ...lines.map((t) => sansW(t, m.fsT)));
  const sw = sub ? monoW(sub, m.fsS) : 0;
  const block = lines.length * lh(m.fsT) + (sub ? m.lead + lh(m.fsS) : 0);
  if (o.style === 'bare') {
    const side = m.tile + 2 * Math.round(m.padY * 0.6);
    return { w: side, h: side, lines, sub };
  }
  if (o.style === 'row') {
    const w = m.padX + m.tile + m.gap + Math.max(tw, sw) + m.padX;
    const h = Math.max(m.tile, block) + 2 * m.padY;
    return { w: Math.ceil(w), h: Math.ceil(h), lines, sub };
  }
  const w = Math.max(m.tile, tw, sw) + 2 * m.padX;
  const h = m.padY + m.tile + m.gap + block + m.padY;
  return { w: Math.ceil(w), h: Math.ceil(h), lines, sub };
}

const r1 = (n: number) => Math.round(n * 10) / 10;
const fmt = (p: Pt) => `${r1(p[0])} ${r1(p[1])}`;

/** The reference's connector: a cubic whose control points sit 0.45 of the
 *  gap from each end, never closer than 40 — along x for a left-to-right
 *  line, along y for a top-to-bottom one. On a short gap the 40 gives way
 *  to 0.9 of the gap, in both directions: a control point further out than
 *  the gap itself bends the curve back on itself in the middle, and the
 *  dots riding it would run backwards for a moment. */
function bez(a: Pt, b: Pt, axis: 'x' | 'y', key: string, ports: readonly Pt[]): DEdge {
  const gap = axis === 'x' ? b[0] - a[0] : b[1] - a[1];
  const c = Math.max(0.45 * gap, Math.min(40, 0.9 * gap));
  const p1: Pt = axis === 'x' ? [a[0] + c, a[1]] : [a[0], a[1] + c];
  const p2: Pt = axis === 'x' ? [b[0] - c, b[1]] : [b[0], b[1] - c];
  return { key, p: [a, p1, p2, b], d: `M ${fmt(a)} C ${fmt(p1)}, ${fmt(p2)}, ${fmt(b)}`, ports };
}

export function pointAt(p: readonly [Pt, Pt, Pt, Pt], t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0],
    a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1],
  ];
}

function sized(m: Metrics, o: Opts) {
  const all = SPECS.map((s) => ({ s, ...measure(s, m, o) }));
  const of = (role: Role) => all.filter((n) => n.s.role === role);
  const ins = of('in');
  const outs = of('out');
  const core = of('core')[0];
  const end = of('end')[0];
  if (!core || !end) throw new Error('diagram: missing node');
  return { ins, outs, core, end };
}

const node = (
  n: { s: Spec; lines: readonly string[]; sub: string | null },
  style: NodeStyle,
  x: number,
  y: number,
  w: number,
  h: number,
): DNode => ({
  key: n.s.key,
  role: n.s.role,
  icon: n.s.icon,
  style: n.s.role === 'core' ? 'core' : style,
  lines: n.lines,
  sub: n.sub,
  x: r1(x),
  y: r1(y),
  w,
  h,
});

/**
 * LEFT TO RIGHT, the reference's own arrangement with one more column: the
 * three documents stacked on the left, Contraxis in the middle, the three
 * outputs stacked beside it and the decision on the far right. Every card in
 * a column is the column's width, as the reference's are. Returns the reason
 * instead of a layout where the gaps between the columns would fall under
 * `minGap`.
 */
export function layoutH(
  w: number,
  h: number,
  m: Metrics,
  o: Opts & { spread: number; minGap: number },
): Layout | string {
  const { ins, outs, core, end } = sized(m, o);
  const wIn = Math.max(...ins.map((n) => n.w));
  const wOut = Math.max(...outs.map((n) => n.w));
  const hRow = Math.max(...ins.map((n) => n.h), ...outs.map((n) => n.h));
  const g = (w - 2 * o.mx - wIn - core.w - wOut - end.w) / 3;
  if (g < o.minGap) return `column gap ${r1(g)} < ${o.minGap} (columns ${wIn}+${core.w}+${wOut}+${end.w})`;
  const cy = h / 2;
  const s = Math.min(o.spread, (h - 2 * o.my - hRow) / 2);
  if (s < hRow + 6) return `row pitch ${r1(s)} < card ${hRow} + 6`;

  const xIn = o.mx;
  const xCore = xIn + wIn + g;
  const xOut = xCore + core.w + g;
  const xEnd = xOut + wOut + g;
  const nodes: DNode[] = [];
  const edges: DEdge[] = [];
  const coreL: Pt = [r1(xCore), cy];
  const coreR: Pt = [r1(xCore + core.w), cy];
  const endL: Pt = [r1(xEnd), cy];

  ins.forEach((n, i) => {
    const y = cy + (i - 1) * s;
    nodes.push(node(n, o.style, xIn, y - hRow / 2, wIn, hRow));
    const a: Pt = [r1(xIn + wIn), r1(y)];
    edges.push(bez(a, coreL, 'x', `in-${n.s.key}`, [a]));
  });
  nodes.push(node(core, o.style, xCore, cy - core.h / 2, core.w, core.h));
  outs.forEach((n, i) => {
    const y = cy + (i - 1) * s;
    nodes.push(node(n, o.style, xOut, y - hRow / 2, wOut, hRow));
    const l: Pt = [r1(xOut), r1(y)];
    const rr: Pt = [r1(xOut + wOut), r1(y)];
    edges.push(bez(coreR, l, 'x', `out-${n.s.key}`, [l]));
    edges.push(bez(rr, endL, 'x', `end-${n.s.key}`, i === 1 ? [rr, endL] : [rr]));
  });
  nodes.push(node(end, o.style, xEnd, cy - end.h / 2, end.w, end.h));
  return { w, h, m, nodes, edges: order(edges) };
}

/**
 * TOP TO BOTTOM, for a slot taller than it is wide: the three documents in a
 * row, Contraxis under them, the three outputs in a row under that and the
 * decision at the foot. The two rows share one cell width, so the outputs
 * stand under the documents. Returns the reason instead of a layout where a
 * row will not fit across or the gaps between the rows would fall under
 * `minGap`.
 */
export function layoutV(
  w: number,
  h: number,
  m: Metrics,
  o: Opts & { gx: number; minGap: number; maxGap?: number },
): Layout | string {
  const { ins, outs, core, end } = sized(m, o);
  const cw = Math.max(...ins.map((n) => n.w), ...outs.map((n) => n.w));
  const hIn = Math.max(...ins.map((n) => n.h));
  const hOut = Math.max(...outs.map((n) => n.h));
  const gx = Math.min(o.gx, (w - 2 * o.mx - 3 * cw) / 2);
  if (gx < 6) return `cell gap ${r1(gx)} < 6 (cell ${cw})`;
  let gy = (h - 2 * o.my - hIn - core.h - hOut - end.h) / 3;
  if (gy < o.minGap) return `row gap ${r1(gy)} < ${o.minGap} (rows ${hIn}+${core.h}+${hOut}+${end.h})`;
  if (o.maxGap && gy > o.maxGap) gy = o.maxGap;
  const top = (h - (hIn + core.h + hOut + end.h + 3 * gy)) / 2;
  const cx = w / 2;
  const x0 = cx - (3 * cw + 2 * gx) / 2;
  const yIn = top;
  const yCore = yIn + hIn + gy;
  const yOut = yCore + core.h + gy;
  const yEnd = yOut + hOut + gy;
  const nodes: DNode[] = [];
  const edges: DEdge[] = [];
  const coreT: Pt = [cx, r1(yCore)];
  const coreB: Pt = [cx, r1(yCore + core.h)];
  const endT: Pt = [cx, r1(yEnd)];

  ins.forEach((n, i) => {
    const x = x0 + i * (cw + gx);
    nodes.push(node(n, o.style, x, yIn, cw, hIn));
    const a: Pt = [r1(x + cw / 2), r1(yIn + hIn)];
    edges.push(bez(a, coreT, 'y', `in-${n.s.key}`, [a]));
  });
  nodes.push(node(core, o.style, cx - core.w / 2, yCore, core.w, core.h));
  outs.forEach((n, i) => {
    const x = x0 + i * (cw + gx);
    nodes.push(node(n, o.style, x, yOut, cw, hOut));
    const t: Pt = [r1(x + cw / 2), r1(yOut)];
    const b: Pt = [r1(x + cw / 2), r1(yOut + hOut)];
    edges.push(bez(coreB, t, 'y', `out-${n.s.key}`, [t]));
    edges.push(bez(b, endT, 'y', `end-${n.s.key}`, i === 1 ? [b, endT] : [b]));
  });
  nodes.push(node(end, o.style, cx - end.w / 2, yEnd, end.w, end.h));
  return { w, h, m, nodes, edges: order(edges) };
}

/** Lines in the order the eye reads them: in, out, end. */
function order(edges: DEdge[]): DEdge[] {
  const rank = (k: string) => (k.startsWith('in-') ? 0 : k.startsWith('out-') ? 1 : 2);
  return [...edges].sort((a, b) => rank(a.key) - rank(b.key));
}

/* ── THE SLOTS ─────────────────────────────────────────────────────────────
   One entry per place the diagram is drawn; each holds the layouts that
   place can need, largest first. The CSS that picks between them is in
   globals.css under `.sd`, and it names these same keys — change a key or a
   box here and change it there. */
export type Variant = { key: string; layout: Layout };
export type Preset = 'card' | 'cover' | 'gallery' | 'more';

function must(l: Layout | string, what: string): Layout {
  if (typeof l === 'string') throw new Error(`diagram: the ${what} layout does not fit its box: ${l}`);
  return l;
}

const base = { subs: true, coreTitle: true, coreSub: true } as const;

export const PRESETS: Record<Preset, readonly Variant[]> = {
  /* The work card (Home and the work index). Landscape boxes above the
     words at desktop and tablet, so the flow runs left to right; a
     portrait block of its own on a phone, so it runs top to bottom there.

     The landscape box is 567-687 wide on a desktop and 378-573 on a
     tablet, and 186-501 tall. Four steps cover it, each shown only where
     it lands at a scale that keeps its smallest words at 10px or more
     (the thresholds in globals.css, `.sd`): 'l' with the step words at
     the full card size, 'ml' with them one step down, then 'm' and 's'
     without them; 'l' keeps the card's own 30px side margin, the line
     its caption and its title start on. The centre card drops "Document intelligence" in all
     four, so the lines have room to curve, and on the phone's portrait
     block, where it was the one line under 10px on a 360px phone. */
  card: [
    { key: 'l', layout: must(layoutH(687, 420, FULL, { ...base, coreSub: false, style: 'stack', endTwoLines: true, mx: 30, my: 16, spread: 132, minGap: 40 }), 'card l') },
    { key: 'ml', layout: must(layoutH(560, 330, COMPACT, { ...base, coreSub: false, style: 'stack', endTwoLines: true, mx: 16, my: 10, spread: 110, minGap: 34 }), 'card ml') },
    { key: 'm', layout: must(layoutH(473, 250, TIGHT, { ...base, subs: false, coreSub: false, style: 'stack', endTwoLines: true, mx: 14, my: 8, spread: 84, minGap: 34 }), 'card m') },
    { key: 's', layout: must(layoutH(378, 186, MICRO, { ...base, subs: false, coreSub: false, style: 'stack', endTwoLines: true, mx: 8, my: 5, spread: 64, minGap: 24 }), 'card s') },
    { key: 'p', layout: must(layoutV(346, 400, TIGHT, { ...base, subs: false, coreSub: false, style: 'stack', mx: 12, my: 10, gx: 8, minGap: 26, maxGap: 56 }), 'card p') },
    { key: 'pl', layout: must(layoutV(620, 820, FULL, { ...base, style: 'stack', mx: 20, my: 20, gx: 16, minGap: 40, maxGap: 90 }), 'card pl') },
  ],
  /* The cover panel on /work/contraxis. 'm' is drawn for a 672 x 440 box
     so that it lands at 0.95 or more of that size wherever it shows (654
     wide at 1200, 758 x 428 at 810) and its step words, 10.5 in the
     layout, stay at 10px or more; it was 720 x 470 and drew them at 9.5. */
  cover: [
    { key: 'l', layout: must(layoutH(894, 536, FULL, { ...base, style: 'stack', mx: 28, my: 20, spread: 150, minGap: 44 }), 'cover l') },
    { key: 'm', layout: must(layoutH(672, 440, COMPACT, { ...base, style: 'stack', mx: 20, my: 16, spread: 125, minGap: 40 }), 'cover m') },
    { key: 'p', layout: must(layoutV(346, 330, TIGHT, { ...base, subs: false, coreSub: false, style: 'stack', mx: 10, my: 6, gx: 8, minGap: 20, maxGap: 48 }), 'cover p') },
    { key: 'pl', layout: must(layoutV(620, 700, FULL, { ...base, style: 'stack', mx: 20, my: 20, gx: 16, minGap: 36, maxGap: 80 }), 'cover pl') },
  ],
  /* The gallery panel on /work/contraxis: a square at desktop and tablet.
     'm' is drawn for a 740 square (it was 820): the square is 655 wide at
     810, and at 820 the step words drew at 9.2px there; at 740 they draw
     at 10.2. */
  gallery: [
    { key: 'l', layout: must(layoutH(1187, 1187, XL, { ...base, style: 'row', mx: 40, my: 40, spread: 310, minGap: 60 }), 'gallery l') },
    { key: 'm', layout: must(layoutH(740, 740, FULL, { ...base, style: 'stack', mx: 24, my: 24, spread: 190, minGap: 40 }), 'gallery m') },
    { key: 'p', layout: must(layoutV(350, 457, TIGHT, { ...base, subs: false, style: 'stack', mx: 10, my: 14, gx: 8, minGap: 28, maxGap: 60 }), 'gallery p') },
    { key: 'pl', layout: must(layoutV(620, 810, FULL, { ...base, style: 'stack', mx: 20, my: 24, gx: 16, minGap: 40, maxGap: 90 }), 'gallery pl') },
  ],
  /* The 'More work' card on /work/ops and /work/abp-continental. 'l' and
     'm' are the desktop's. The owner's decision of 26 September 2026: at
     tablet and phone widths the card stands taller (the page, `min-h`) so
     the diagram prints its words there too, where it used to drop to icon
     tiles. 't' is the tablet's, left to right at the work card's own 's'
     size; 'p' the phone's, top to bottom at the cover's phone size. 's',
     the tiles alone, is left for a box too small for any of them. */
  more: [
    { key: 'l', layout: must(layoutH(687, 300, COMPACT, { ...base, subs: false, coreSub: false, style: 'row', endTwoLines: true, mx: 20, my: 10, spread: 56, minGap: 30 }), 'more l') },
    { key: 'm', layout: must(layoutH(567, 230, TIGHT, { ...base, subs: false, coreSub: false, style: 'row', endTwoLines: true, mx: 12, my: 8, spread: 48, minGap: 28 }), 'more m') },
    { key: 't', layout: must(layoutH(378, 186, MICRO, { ...base, subs: false, coreSub: false, style: 'stack', endTwoLines: true, mx: 8, my: 5, spread: 64, minGap: 24 }), 'more t') },
    { key: 'p', layout: must(layoutV(346, 330, TIGHT, { ...base, subs: false, coreSub: false, style: 'stack', mx: 10, my: 6, gx: 8, minGap: 20, maxGap: 48 }), 'more p') },
    { key: 's', layout: must(layoutH(400, 104, MICRO, { ...base, subs: false, coreTitle: false, coreSub: false, style: 'bare', mx: 30, my: 4, spread: 36, minGap: 40 }), 'more s') },
  ],
};
