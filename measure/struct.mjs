import { readFileSync } from 'node:fs';
/**
 * Structural check: compares only the properties that CANNOT be moved by my
 * copy being a different length from theirs — section padding, gap, flex
 * direction, grid tracks, and the shell/column widths. Any delta here is a real
 * layout error; height deltas are reported separately.
 */
const W = [1440, 1024, 768, 390];
const NAMES = ['Hero','Clients','Pillars','Services','Framework','Cases','Approach','Testimonials','Faq','Footer'];
const tops = t => {
  const c = t.nodes.filter(n => ['section','footer'].includes(n.tag) && n.h > 40 && !n.path.includes('__framer'));
  return c.filter(r => !c.some(o => o !== r && r.path.startsWith(o.path+'/'))).sort((a,b)=>a.y-b.y);
};
const FIELDS = ['paddingTop','paddingRight','paddingBottom','paddingLeft','rowGap','columnGap','flexDirection','alignItems','justifyContent','maxWidth','w'];
let total = 0, bad = 0;
const rows = [];
for (const w of W) {
  const R = JSON.parse(readFileSync(`raw/ref-${w}.json`,'utf8'));
  const M = JSON.parse(readFileSync(`raw/mine-${w}.json`,'utf8'));
  const A = tops(R), B = tops(M);
  for (let i = 0; i < NAMES.length; i++) {
    const a = A[i], b = B[i]; if (!a || !b) continue;
    for (const f of FIELDS) {
      total++;
      const av = String(a[f]), bv = String(b[f]);
      const eq = av === bv
        || (['rowGap','columnGap'].includes(f) && [av,bv].every(v=>v==='normal'||v==='0px'))
        || (f==='maxWidth' && [av,bv].every(v=>v==='none'||v==='100%'))
        || (f==='alignItems' && [av,bv].every(v=>v==='normal'||v==='stretch'))
        || (f==='justifyContent' && [av,bv].every(v=>v==='normal'||v==='flex-start'));
      if (!eq) { bad++; rows.push([w, NAMES[i], f, av, bv]); }
    }
  }
  // grid tracks
  const gridsA = R.nodes.filter(n=>n.gridTemplateColumns!=='none'&&!n.path.includes('__framer'));
  const gridsB = M.nodes.filter(n=>n.gridTemplateColumns!=='none');
  for (let i = 0; i < Math.max(gridsA.length, gridsB.length); i++) {
    const a = gridsA[i], b = gridsB[i];
    total += 3;
    const label = `grid#${i}`;
    if (!a || !b) { bad++; rows.push([w, label, 'exists', a?'yes':'no', b?'yes':'no']); continue; }
    if (a.gridTemplateColumns !== b.gridTemplateColumns) { bad++; rows.push([w, label, 'cols', a.gridTemplateColumns, b.gridTemplateColumns]); }
    if (a.rowGap !== b.rowGap) { bad++; rows.push([w, label, 'rowGap', a.rowGap, b.rowGap]); }
    if (a.columnGap !== b.columnGap) { bad++; rows.push([w, label, 'colGap', a.columnGap, b.columnGap]); }
  }
  // nav
  const na = R.nodes.find(n=>n.tag==='nav'), nb = M.nodes.find(n=>n.tag==='nav');
  if (na && nb) for (const f of ['w','h','paddingTop','paddingBottom','paddingLeft','flexDirection']) {
    total++;
    if (String(na[f]) !== String(nb[f])) { bad++; rows.push([w, 'nav', f, String(na[f]), String(nb[f])]); }
  }
}
console.log(`STRUCTURAL CHECK — content-independent properties only\n${'='.repeat(88)}`);
console.log(`${total} comparisons across 4 viewports · ${bad} deltas\n`);
if (rows.length) {
  console.log(`${'VW'.padEnd(6)}${'SECTION'.padEnd(15)}${'PROPERTY'.padEnd(16)}${'REFERENCE'.padEnd(26)}MINE`);
  console.log('-'.repeat(88));
  for (const [w,s,f,a,b] of rows) console.log(`${String(w).padEnd(6)}${s.padEnd(15)}${f.padEnd(16)}${a.slice(0,25).padEnd(26)}${b.slice(0,30)}`);
} else console.log('no structural deltas');
