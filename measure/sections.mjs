import { readFileSync } from 'node:fs';
const ref = JSON.parse(readFileSync('raw/ref-1440.json','utf8'));
const mine = JSON.parse(readFileSync('raw/mine-1440.json','utf8'));
const tops = t => {
  // top-level layout blocks: sections / footer at the shallowest depth that has them
  const c = t.nodes.filter(n => ['section','footer'].includes(n.tag) && n.h > 60 && !n.path.includes('__framer'));
  const keep = c.filter(r => !c.some(o => o !== r && r.path.startsWith(o.path + '/')));
  return keep.sort((a,b)=>a.y-b.y);
};
const A = tops(ref), B = tops(mine);
const NAMES = ['Hero','Clients','Pillars','Services','Framework','Cases','Approach','Testimonials','Faq','Footer'];
console.log(`${'SECTION'.padEnd(14)}${'REF y'.padStart(10)}${'REF h'.padStart(10)}${'MINE y'.padStart(10)}${'MINE h'.padStart(10)}${'Δy'.padStart(9)}${'Δh'.padStart(9)}`);
console.log('-'.repeat(72));
const n = Math.max(A.length, B.length);
for (let i = 0; i < n; i++) {
  const a = A[i], b = B[i];
  const nm = NAMES[i] ?? `#${i}`;
  if (!a) { console.log(`${nm.padEnd(14)}${'—'.padStart(10)}${'—'.padStart(10)}${String(b.y).padStart(10)}${String(b.h).padStart(10)}${'EXTRA'.padStart(9)}`); continue; }
  if (!b) { console.log(`${nm.padEnd(14)}${String(a.y).padStart(10)}${String(a.h).padStart(10)}${'—'.padStart(10)}${'—'.padStart(10)}${'MISSING'.padStart(9)}`); continue; }
  const dy = +(b.y - a.y).toFixed(2), dh = +(b.h - a.h).toFixed(2);
  const f = v => (v === 0 ? '0' : (v > 0 ? '+' : '') + v);
  console.log(`${nm.padEnd(14)}${String(a.y).padStart(10)}${String(a.h).padStart(10)}${String(b.y).padStart(10)}${String(b.h).padStart(10)}${f(dy).padStart(9)}${f(dh).padStart(9)}`);
}
console.log('-'.repeat(72));
console.log(`${'DOC HEIGHT'.padEnd(14)}${String(ref.docHeight).padStart(10)}${''.padStart(10)}${String(mine.docHeight).padStart(10)}${''.padStart(10)}${('' + (mine.docHeight-ref.docHeight)).padStart(18)}`);
