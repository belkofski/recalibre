import { readFileSync } from 'node:fs';
const load = w => JSON.parse(readFileSync(`raw/ref-${w}.json`,'utf8'));
const W = [1440, 1024, 768, 390];
const trees = Object.fromEntries(W.map(w => [w, load(w)]));
const tops = t => {
  const c = t.nodes.filter(n => ['section','footer'].includes(n.tag) && n.h > 40 && !n.path.includes('__framer'));
  return c.filter(r => !c.some(o => o !== r && r.path.startsWith(o.path + '/'))).sort((a,b)=>a.y-b.y);
};
const NAMES = ['Hero','Clients','Pillars','Services','Framework','Cases','Approach','Testimonials','Faq','Footer'];
console.log('SECTION HEIGHT / SHELL X+W BY VIEWPORT (reference)\n');
console.log('SECTION'.padEnd(14) + W.map(w=>`${w}px`.padStart(20)).join(''));
console.log('-'.repeat(14 + 20*W.length));
const byW = Object.fromEntries(W.map(w=>[w,tops(trees[w])]));
for (let i = 0; i < NAMES.length; i++) {
  const cells = W.map(w => { const n = byW[w][i]; return n ? `${n.h} @x${n.x} w${n.w}` : '—'; });
  console.log(NAMES[i].padEnd(14) + cells.map(c=>c.padStart(20)).join(''));
}
console.log('-'.repeat(14 + 20*W.length));
console.log('doc height'.padEnd(14) + W.map(w=>String(trees[w].docHeight).padStart(20)).join(''));
console.log('node count'.padEnd(14) + W.map(w=>String(trees[w].count).padStart(20)).join(''));

console.log('\n\nKEY BOXES BY VIEWPORT');
const probes = [
  ['nav bar',            t => t.nodes.find(n=>n.tag==='nav')],
  ['hero section',       t => tops(t)[0]],
  ['services grid',      t => t.nodes.find(n=>n.gridTemplateColumns!=='none' && n.rowGap==='10px')],
  ['framework grid',     t => t.nodes.find(n=>n.gridTemplateColumns!=='none' && n.rowGap==='80px')],
  ['marquee ul',         t => t.nodes.find(n=>n.tag==='ul')],
  ['footer plate 308',   t => t.nodes.find(n=>n.cssHeight==='308px')],
];
for (const [label, pick] of probes) {
  const cells = W.map(w => { const n = pick(trees[w]); return n ? `${n.w}×${n.h}` : '—'; });
  console.log(label.padEnd(20) + cells.map(c=>c.padStart(16)).join(''));
}
console.log('\nGRID TRACKS BY VIEWPORT');
for (const w of W) {
  const g = trees[w].nodes.filter(n=>n.gridTemplateColumns!=='none');
  console.log(`  ${w}px: ` + (g.length ? g.map(n=>`[${n.gridTemplateColumns}] rows[${n.gridTemplateRows}] gap ${n.rowGap}/${n.columnGap}`).join('  |  ') : 'none'));
}
console.log('\nFLEX DIRECTION OF THE TWO-COLUMN SECTIONS');
for (const w of W) {
  const s = tops(trees[w]);
  console.log(`  ${w}px: ` + [2,6,8].map(i=>s[i]?`${NAMES[i]}:${s[i].flexDirection}`:'—').join('  '));
}
