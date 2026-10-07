import { FIRM_MARK_PATH, GLYPH_PATHS, type GlyphName } from '@/components/ui';
import { ABOUT as A } from '@/content/about';

/* ============================================================================
   THE ORBIT — the five disciplines drawn as one system.

   The page used to list them on a hairline spine, five rows of words. Now
   they are five nodes around the firm's mark: a core card holding the
   '///', a faint dashed ring, and on it five cards each with its glyph,
   its title and its number, joined to the core by a cubic connector with
   a port dot at each end. It is drawn in the Contraxis system diagram's
   own language (components/SystemDiagram.tsx: the 4% card on a 12% edge,
   the icon tile, the cubic connector, the port), so the two drawings on
   the site read as one hand.

   Two layouts, one SVG each, both complete in the server's HTML: a 600
   square for the pinned card beside the chapters from 1200 up and for a
   tablet's head card, and a 360 x 480 portrait for a phone. Every node is
   as wide as its own title; one that needs more than the base width is
   widened, never cut.

   THE LIT NODE is the chapter being read: the SVG carries `data-active`
   (0 from the server, then whatever OrbitLive reads off the scroll story)
   and the stylesheet (styles/about.css) lifts that node's edge, tile,
   glyph and connector into the signal blue. With scripts off node 01 is
   lit and the drawing stands still.

   NOT A CLAIM. The words are the disciplines' own titles and numbers from
   content/about.ts; the drawing says they are one system, which is what
   the story's first paragraph says in prose.
   ========================================================================= */

type Pt = readonly [number, number];
export type OrbitLayout = 'square' | 'portrait';

/* The drawing's constants, retyped from the system diagram
   (components/SystemDiagram.tsx: INK, LINE, PORT, ACCENT), which cannot
   export them without the diagram becoming this drawing's dependency. The
   second tint is the glyph at rest; the lit node's glyph steps to ink. */
const INK = '#ffffff';
const INK_2 = 'rgba(255,255,255,0.6)';
const LINE = 'rgba(255,255,255,0.16)';
const PORT = 'rgba(255,255,255,0.85)';
const ACCENT = '#8aa4ec';
const EDGE = 'rgba(255,255,255,0.12)';

/** The glyph each node carries, by the discipline's number: structural
 *  pictures of the five titles (ui.tsx draws them), shared with the
 *  chapters beside the drawing so a tile and a node show the same mark. */
export const ORBIT_GLYPHS: Record<(typeof A.disciplines)[number]['n'], GlyphName> = {
  '01': 'strategy',
  '02': 'design',
  '03': 'agent',
  '04': 'automation',
  '05': 'engineering',
};

/** Advance width per 1px of type for each title, read in the browser off
 *  the site's own Geist at 500, the way the diagram's table was. SLACK
 *  covers hinting and the fallback face, so a node sized here can never
 *  cut its word. */
const W: Record<string, number> = { Strategy: 4.02, Design: 3.25, 'Agentic AI': 4.78, Automation: 5.41, Engineering: 5.57 };
const SLACK = 1.05;
const textW = (t: string, fs: number) => (W[t] ?? t.length * 0.56) * fs * SLACK;

/** A node's port is on its inner edge, the one facing the core; the
 *  core's port faces back from the opposite edge. */
type Side = 'top' | 'right' | 'bottom' | 'left';
const FACING: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

type Metrics = {
  /** The node card's base width, and its height. */
  w: number;
  h: number;
  tile: number;
  tileR: number;
  glyph: number;
  padX: number;
  gap: number;
  lead: number;
  fsT: number;
  fsS: number;
  r: number;
};

type Spec = {
  box: Pt;
  core: { c: Pt; w: number; h: number; mark: number; r: number };
  ring: { rx: number; ry: number };
  m: Metrics;
  nodes: readonly { c: Pt; port: Side }[];
};

const SPECS: Record<OrbitLayout, Spec> = {
  square: {
    box: [600, 600],
    core: { c: [300, 300], w: 120, h: 72, mark: 40, r: 14 },
    ring: { rx: 200, ry: 200 },
    m: { w: 148, h: 64, tile: 32, tileR: 9, glyph: 18, padX: 16, gap: 12, lead: 3, fsT: 13, fsS: 10, r: 14 },
    /* On the ring at -90, -18, 54, 126 and 198 degrees. */
    nodes: [
      { c: [300, 100], port: 'bottom' },
      { c: [490, 238], port: 'left' },
      { c: [418, 462], port: 'top' },
      { c: [182, 462], port: 'top' },
      { c: [110, 238], port: 'right' },
    ],
  },
  portrait: {
    box: [360, 480],
    core: { c: [180, 260], w: 104, h: 62, mark: 36, r: 12 },
    ring: { rx: 110, ry: 180 },
    m: { w: 116, h: 52, tile: 28, tileR: 8, glyph: 16, padX: 12, gap: 10, lead: 2, fsT: 12, fsS: 10, r: 12 },
    /* The same five angles on the ellipse, except the two foot nodes,
       which stand 5px further apart than the ellipse puts them: their
       cards widen past the base for their long titles and would touch
       where the ellipse crosses. The ring is a faint dash behind them;
       the shift does not show. */
    nodes: [
      { c: [180, 80], port: 'bottom' },
      { c: [285, 204], port: 'left' },
      { c: [250, 406], port: 'top' },
      { c: [110, 406], port: 'top' },
      { c: [75, 204], port: 'right' },
    ],
  },
};

const r1 = (n: number) => Math.round(n * 10) / 10;
const fmt = (p: Pt) => `${r1(p[0])} ${r1(p[1])}`;

type Box = { x: number; y: number; w: number; h: number };

/** The point on a card's edge where its connector lands: the middle of
 *  the edge that faces the other card. */
function portOf(b: Box, side: Side): Pt {
  const at: Record<Side, Pt> = {
    top: [b.x + b.w / 2, b.y],
    bottom: [b.x + b.w / 2, b.y + b.h],
    left: [b.x, b.y + b.h / 2],
    right: [b.x + b.w, b.y + b.h / 2],
  };
  return at[side];
}

/** The diagram's connector (lib/diagram.ts, `bez`): a cubic whose control
 *  points sit 0.45 of the gap from each end along the axis, never closer
 *  than 40, and on a short gap no further than 0.9 of it. Drawn from the
 *  core to the node, which is the way the riding dot travels. */
function connector(a: Pt, b: Pt, axis: 'x' | 'y'): string {
  const i = axis === 'x' ? 0 : 1;
  const gap = Math.abs(b[i] - a[i]);
  const dir = Math.sign(b[i] - a[i]) || 1;
  const c = dir * Math.max(0.45 * gap, Math.min(40, 0.9 * gap));
  const p1: Pt = axis === 'x' ? [a[0] + c, a[1]] : [a[0], a[1] + c];
  const p2: Pt = axis === 'x' ? [b[0] - c, b[1]] : [b[0], b[1] - c];
  return `M ${fmt(a)} C ${fmt(p1)}, ${fmt(p2)}, ${fmt(b)}`;
}

export default function Orbit({ layout, className = '' }: { layout: OrbitLayout; className?: string }) {
  const S = SPECS[layout];
  const m = S.m;
  const core: Box = { x: S.core.c[0] - S.core.w / 2, y: S.core.c[1] - S.core.h / 2, w: S.core.w, h: S.core.h };
  /* The line boxes the words take, as the diagram sets them (lib/diagram.ts,
     `lh`), so the title and the number centre as one block in the card. */
  const lhT = r1(m.fsT * 1.22);
  const lhS = r1(m.fsS * 1.22);
  const block = lhT + m.lead + lhS;

  /* One node per discipline, on the spot the layout gives its index; a
     discipline past the five spots would draw nothing rather than throw. */
  const nodes = A.disciplines.flatMap((d, i) => {
    const spot = S.nodes[i];
    if (!spot) return [];
    /* 'Agentic AI.' prints as 'Agentic AI': the full stop closes a sentence
       and a node's title is a label, as the chips set it. */
    const title = d.title.replace(/\.$/, '');
    const w = Math.max(m.w, Math.ceil(m.padX + m.tile + m.gap + textW(title, m.fsT) + m.padX));
    const box: Box = { x: r1(spot.c[0] - w / 2), y: r1(spot.c[1] - m.h / 2), w, h: m.h };
    const port = portOf(box, spot.port);
    const corePort = portOf(core, FACING[spot.port]);
    const axis = spot.port === 'top' || spot.port === 'bottom' ? 'y' : 'x';
    return [{ n: d.n, title, glyph: ORBIT_GLYPHS[d.n], box, port, corePort, d: connector(corePort, port, axis) }];
  });

  return (
    <svg
      viewBox={`0 0 ${S.box[0]} ${S.box[1]}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="A schematic of the five disciplines around the firm's mark."
      data-orbit=""
      data-active="0"
      className={`orbit ${className}`}
    >
      {/* The ring the nodes stand on: dashed, faint, still. */}
      <ellipse
        cx={S.core.c[0]}
        cy={S.core.c[1]}
        rx={S.ring.rx}
        ry={S.ring.ry}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={1}
        strokeDasharray="2 6"
        vectorEffect="non-scaling-stroke"
      />

      {/* The connectors, under the cards; each carries its index for the
          lit state and for the dot that rides it. */}
      <g fill="none" stroke={LINE} strokeWidth={1.25}>
        {nodes.map((n, i) => (
          <path key={n.n} d={n.d} className={`orbit-edge orbit-edge-${i}`} vectorEffect="non-scaling-stroke" />
        ))}
      </g>

      {/* The core: the firm's mark alone, no words. The ground first, so
          the ring behind the card never shows through its 3% fill. */}
      <rect x={core.x} y={core.y} width={core.w} height={core.h} rx={S.core.r} style={{ fill: 'var(--color-ground)' }} />
      <rect
        x={core.x}
        y={core.y}
        width={core.w}
        height={core.h}
        rx={S.core.r}
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={FIRM_MARK_PATH}
        transform={`translate(${r1(S.core.c[0] - S.core.mark / 2)} ${r1(S.core.c[1] - S.core.mark / 4)}) scale(${r1(S.core.mark / 44)})`}
        fill={INK}
      />

      {nodes.map((n, i) => {
        const { box } = n;
        const tx = box.x + m.padX;
        const ty = r1(box.y + (box.h - m.tile) / 2);
        const x = tx + m.tile + m.gap;
        const top = box.y + (box.h - block) / 2;
        return (
          <g key={n.n} className={`orbit-node orbit-node-${i}`}>
            <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={m.r} style={{ fill: 'var(--color-ground)' }} />
            <rect
              className="orbit-card"
              x={box.x}
              y={box.y}
              width={box.w}
              height={box.h}
              rx={m.r}
              fill="rgba(255,255,255,0.04)"
              stroke={EDGE}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <rect className="orbit-tile" x={tx} y={ty} width={m.tile} height={m.tile} rx={m.tileR} fill="rgba(255,255,255,0.06)" />
            <path
              className="orbit-glyph"
              d={GLYPH_PATHS[n.glyph]}
              transform={`translate(${r1(tx + (m.tile - m.glyph) / 2)} ${r1(ty + (m.tile - m.glyph) / 2)}) scale(${r1(m.glyph / 16)})`}
              fill="none"
              stroke={INK_2}
              strokeWidth={1.1}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x={x} y={r1(top + lhT / 2)} dominantBaseline="central" fontSize={m.fsT} fontWeight={500} fill={INK}>
              {n.title}
            </text>
            <text
              x={x}
              y={r1(top + lhT + m.lead + lhS / 2)}
              dominantBaseline="central"
              fontSize={m.fsS}
              fontWeight={500}
              letterSpacing="0.06em"
              fill="rgba(255,255,255,0.5)"
            >
              {n.n}
            </text>
          </g>
        );
      })}

      {/* Ports last, so each sits on the edge of its card. */}
      <g fill={PORT}>
        {nodes.flatMap((n) =>
          [n.port, n.corePort].map((p) => <circle key={`${n.n}-${p[0]}-${p[1]}`} cx={p[0]} cy={p[1]} r={3} />),
        )}
      </g>

      {/* The riding dot's layer: empty as sent. OrbitLive puts one dot here
          for under a second when the lit node changes, and takes it away. */}
      <g data-orbit-dot="" fill={ACCENT} />
    </svg>
  );
}
