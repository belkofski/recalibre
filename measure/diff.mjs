import { readFileSync } from 'node:fs';

/**
 * Canonical-box diff. Both trees render the same layout, but the reference has
 * many wrapper divs whose box is identical to their parent's. Collapsing those
 * leaves the set of boxes that actually define the layout, which aligns.
 */
const FIELDS = [
  'w','h','x','y',
  'display','flexDirection','alignItems','justifyContent','rowGap','columnGap',
  'gridTemplateColumns','paddingTop','paddingRight','paddingBottom','paddingLeft',
  'fontSize','lineHeight','fontWeight','letterSpacing','color','textAlign','textTransform','whiteSpace',
  'backgroundColor','backgroundImage','radiusTL','radiusTR','radiusBR','radiusBL',
  'boxShadow','opacity','position','zIndex','overflow','objectFit','objectPosition',
  'aspectRatio','backdropFilter','filter','mixBlendMode','maxWidth',
];
const NUM = new Set(['w','h','x','y']);

function load(p) { return JSON.parse(readFileSync(p,'utf8')); }

function canon(tree, yMin, yMax) {
  // Framer's own chrome (the "made in Framer" badge, editor bar, svg template
  // defs) is not part of the template layout and is deliberately not cloned.
  const chromeRoots = tree.nodes
    .filter(n => (n.id || '').startsWith('__framer') || ['template-overlay','svg-templates','overlay'].includes(n.id || ''))
    .map(n => n.path + '/');
  const isChrome = p => chromeRoots.some(r => p.startsWith(r));
  const nodes = tree.nodes.filter(n =>
    !['script','style','link','iframe','noscript'].includes(n.tag) &&
    !n.path.includes('__framer') &&
    !(n.id && n.id.startsWith('__framer')) &&
    !(n.id === 'template-overlay' || n.id === 'svg-templates' || n.id === 'overlay') &&
    !isChrome(n.path) &&
    n.w > 0 && n.h > 0 &&
    n.y + n.h > yMin && n.y < yMax
  );
  const seen = new Map();
  for (const n of nodes) {
    const k = `${n.x.toFixed(1)},${n.y.toFixed(1)},${n.w.toFixed(1)},${n.h.toFixed(1)}`;
    // keep the deepest node at a given box: that is the one carrying real style
    const prev = seen.get(k);
    if (!prev || n.depth > prev.depth) seen.set(k, n);
  }
  return [...seen.values()].sort((a,b) => (a.y-b.y) || (a.x-b.x) || (b.w*b.h - a.w*a.h));
}

/** greedy nearest match on (y,x,w,h) within tolerance */
function align(A, B, tol = 24) {
  const used = new Set(); const pairs = []; const unmatched = [];
  for (const a of A) {
    let best = -1, bestD = Infinity;
    for (let j = 0; j < B.length; j++) {
      if (used.has(j)) continue;
      const b = B[j];
      const d = Math.abs(a.y-b.y)*1.0 + Math.abs(a.x-b.x)*1.0 + Math.abs(a.w-b.w)*0.6 + Math.abs(a.h-b.h)*0.6;
      if (d < bestD) { bestD = d; best = j; }
    }
    if (best >= 0 && bestD <= tol*4) { used.add(best); pairs.push([a, B[best], bestD]); }
    else unmatched.push(a);
  }
  const extra = B.filter((_,j)=>!used.has(j));
  return { pairs, unmatched, extra };
}

const ref = load(process.argv[2]);
const mine = load(process.argv[3]);
const yMin = +(process.argv[4] ?? 0);
const yMax = +(process.argv[5] ?? 1e9);
const yShift = +(process.argv[6] ?? 0);   // our y offset vs reference, if sections above differ
const label = process.argv[7] ?? '';

const A = canon(ref, yMin, yMax);
const B = canon(mine, yMin - yShift, yMax - yShift).map(n => ({ ...n, y: +(n.y + yShift).toFixed(2) }));
const { pairs, unmatched, extra } = align(A, B);

let rows = 0, bad = 0, eqCount = 0;
const out = [];
for (const [a, b] of pairs) {
  const deltas = []; const equiv = [];
  for (const f of FIELDS) {
    const av = a[f], bv = b[f];
    if (av === undefined) continue;
    if (NUM.has(f)) {
      const d = +(bv - av).toFixed(2);
      if (Math.abs(d) > 0.5) deltas.push([f, av, bv, (d>0?'+':'')+d]);
    } else if (String(av) !== String(bv)) {
      // render-equivalent pairs: computed spellings that paint identically
      const eq =
        ((f === 'rowGap' || f === 'columnGap') && new Set([String(av), String(bv)]).size === 2 &&
          [String(av), String(bv)].every(v => v === 'normal' || v === '0px')) ||
        (f === 'position' && new Set([String(av), String(bv)]).size === 2 &&
          [String(av), String(bv)].every(v => v === 'static' || v === 'relative')) ||
        (f === 'maxWidth' && new Set([String(av), String(bv)]).size === 2 &&
          [String(av), String(bv)].every(v => v === 'none' || v === '100%')) ||
        // 'start' and 'left' compute differently but paint identically in LTR
        (f === 'textAlign' && new Set([String(av), String(bv)]).size === 2 &&
          [String(av), String(bv)].every(v => v === 'start' || v === 'left')) ||
        (f === 'zIndex' && new Set([String(av), String(bv)]).size === 2 &&
          [String(av), String(bv)].every(v => v === 'auto' || v === '0'));
      if (eq) equiv.push([f, String(av), String(bv)]);
      else deltas.push([f, String(av).slice(0,54), String(bv).slice(0,54), '≠']);
    }
    rows++;
  }
  eqCount += equiv.length;
  if (deltas.length) {
    bad += deltas.length;
    out.push({ box: `${a.tag} y${a.y} x${a.x} ${a.w}×${a.h}`, deltas });
  }
}
console.log(`\n${'='.repeat(92)}\nDIFF ${label}   y ${yMin}..${yMax}   ref boxes ${A.length}  mine ${B.length}  matched ${pairs.length}`);
console.log(`fields compared ${rows}   REAL deltas ${bad}   render-equivalent ${eqCount}   unmatched(ref) ${unmatched.length}   extra(mine) ${extra.length}\n${'='.repeat(92)}`);
if (out.length) {
  console.log(`\n${'PROPERTY'.padEnd(20)}${'REFERENCE'.padEnd(30)}${'MINE'.padEnd(30)}DELTA`);
  for (const o of out) {
    console.log(`\n  ── ${o.box}`);
    for (const [f, av, bv, d] of o.deltas)
      console.log(`  ${f.padEnd(20)}${String(av).padEnd(30)}${String(bv).padEnd(30)}${d}`);
  }
}
if (unmatched.length) {
  console.log(`\nMISSING IN MINE (${unmatched.length}):`);
  unmatched.forEach(n=>console.log(`  ${n.tag.padEnd(6)} y${String(n.y).padEnd(9)} x${String(n.x).padEnd(8)} ${n.w}×${n.h}  ${n.text?'«'+n.text.slice(0,34)+'»':''} ${n.backgroundColor!=='rgba(0, 0, 0, 0)'?'bg:'+n.backgroundColor:''}`));
}
if (extra.length) {
  console.log(`\nEXTRA IN MINE (${extra.length}):`);
  extra.forEach(n=>console.log(`  ${n.tag.padEnd(6)} y${String(n.y).padEnd(9)} x${String(n.x).padEnd(8)} ${n.w}×${n.h}  ${n.text?'«'+n.text.slice(0,34)+'»':''}`));
}
