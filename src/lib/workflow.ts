import { cubic, cubicPath, type Pt } from '@/lib/geometry';

/* ============================================================================
   THE WORKFLOW CANVAS — the geometry, with no React in it (4 November 2026).

   A generalization of the Contraxis system diagram (lib/diagram.ts): any
   small directed graph of steps laid on a grid of columns and rows, each
   node a tile with an icon and a label, each edge the diagrams' own S-curve
   from the right port of one tile to the left port of the next. The canvas
   (components/fx/WorkflowCanvas.tsx) draws the result and, when the reader
   can see it, plays an execution through it; the card
   (components/fx/WorkflowCard.tsx) draws the same spec small, as a chain.

   Everything is computed here once, for a nominal box, and drawn in
   percentages of that box, so the drawing is complete in the server's
   markup and scales to whatever slot it lands in.
   ========================================================================= */

export type WfIcon =
  | 'mail'
  | 'document'
  | 'agent'
  | 'table'
  | 'person'
  | 'alert'
  | 'database'
  | 'clock'
  | 'check'
  | 'offline'
  | 'route'
  | 'photo';

export type WfKind = 'trigger' | 'step' | 'ai' | 'end' | 'alert';

export type WfNode = {
  id: string;
  kind: WfKind;
  icon: WfIcon;
  label: string;
  sub?: string;
  /** Grid position, 0-based. Columns run left to right in execution order. */
  col: number;
  row: number;
};

export type WfEdge = { from: string; to: string; dashed?: boolean };

export type WorkflowSpec = {
  key: string;
  /** The pattern's name and its meta line, as the card prints them. */
  title: string;
  meta: string;
  /** What a screen reader hears for the whole drawing. */
  description: string;
  nodes: readonly WfNode[];
  edges: readonly WfEdge[];
};

export type LaidNode = WfNode & { x: number; y: number; w: number; h: number };
export type LaidEdge = { key: string; from: string; to: string; d: string; p: readonly [Pt, Pt, Pt, Pt]; dashed: boolean };
export type Layout = { w: number; h: number; nodes: readonly LaidNode[]; edges: readonly LaidEdge[] };

const NODE_W = 168;
const NODE_H = 56;
const GAP_X = 72;
const GAP_Y = 28;
const PAD = 16;

/** Lays the spec out on its grid. Rows in a column are centred on the
 *  column's height, so a single node sits level with the middle of three. */
export function layout(spec: WorkflowSpec): Layout {
  const cols = Math.max(...spec.nodes.map((n) => n.col)) + 1;
  const rowsIn = (c: number) => spec.nodes.filter((n) => n.col === c).length;
  const maxRows = Math.max(...Array.from({ length: cols }, (_, c) => rowsIn(c)));
  const w = PAD * 2 + cols * NODE_W + (cols - 1) * GAP_X;
  const h = PAD * 2 + maxRows * NODE_H + (maxRows - 1) * GAP_Y;
  const nodes: LaidNode[] = spec.nodes.map((n) => {
    const inCol = spec.nodes.filter((m) => m.col === n.col).sort((a, b) => a.row - b.row);
    const idx = inCol.findIndex((m) => m.id === n.id);
    const colH = inCol.length * NODE_H + (inCol.length - 1) * GAP_Y;
    const top = PAD + (h - PAD * 2 - colH) / 2;
    return {
      ...n,
      x: PAD + n.col * (NODE_W + GAP_X),
      y: top + idx * (NODE_H + GAP_Y),
      w: NODE_W,
      h: NODE_H,
    };
  });
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const edges: LaidEdge[] = spec.edges.map((e) => {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    if (!a || !b) throw new Error(`workflow ${spec.key}: edge ${e.from} → ${e.to} names a missing node`);
    const p = cubic([a.x + a.w, a.y + a.h / 2], [b.x, b.y + b.h / 2], 'x');
    return { key: `${e.from}-${e.to}`, from: e.from, to: e.to, d: cubicPath(p), p, dashed: Boolean(e.dashed) };
  });
  return { w, h, nodes, edges };
}

/** The order an execution visits the nodes: by column, then row. */
export function order(spec: WorkflowSpec): readonly string[] {
  return [...spec.nodes].sort((a, b) => a.col - b.col || a.row - b.row).map((n) => n.id);
}
