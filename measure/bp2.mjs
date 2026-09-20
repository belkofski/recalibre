import { readFileSync } from 'node:fs';
const W=[1440,1024,768,390];
const T=Object.fromEntries(W.map(w=>[w,JSON.parse(readFileSync(`raw/ref-${w}.json`,'utf8'))]));
const tops=t=>{const c=t.nodes.filter(n=>['section','footer'].includes(n.tag)&&n.h>40&&!n.path.includes('__framer'));
 return c.filter(r=>!c.some(o=>o!==r&&r.path.startsWith(o.path+'/'))).sort((a,b)=>a.y-b.y);};
const NAMES=['Hero','Clients','Pillars','Services','Framework','Cases','Approach','Testimonials','Faq','Footer'];
console.log('SECTION PADDING (top right bottom left) + gap + flexDirection BY VIEWPORT\n');
for(let i=0;i<NAMES.length;i++){
  console.log(NAMES[i]);
  for(const w of W){const n=tops(T[w])[i]; if(!n){console.log(`   ${w}: —`);continue;}
   console.log(`   ${String(w).padStart(5)}: pad ${[n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft].join(' ').padEnd(28)} gap ${n.rowGap}/${n.columnGap}  dir:${n.flexDirection}  ai:${n.alignItems}  maxW:${n.maxWidth}  h=${n.h}`);}
}
console.log('\n\nNAV BY VIEWPORT');
for(const w of W){const t=T[w];const nav=t.nodes.find(n=>n.tag==='nav');
 const bar=t.nodes.filter(n=>n.path.startsWith(nav.path+'/')&&n.h>20&&n.h<70&&n.w>200).sort((a,b)=>a.y-b.y)[0];
 const rule=t.nodes.find(n=>n.h<=1.2&&n.h>0&&n.w>200&&n.y<200);
 const burger=t.nodes.filter(n=>n.path.startsWith(nav.path+'/')&&n.w>=20&&n.w<=48&&n.h>=14&&n.h<=48);
 console.log(`  ${String(w).padStart(5)}: nav ${nav.w}×${nav.h} pad ${nav.paddingTop} ${nav.paddingRight} ${nav.paddingBottom} ${nav.paddingLeft}  bar ${bar?bar.w+'×'+bar.h+'@y'+bar.y:'—'}  rule ${rule?rule.w+'×'+rule.h+'@y'+rule.y:'—'}  small-boxes:${burger.length}`);}
console.log('\n\nSERVICES GRID ITEMS BY VIEWPORT (the 3-track grid)');
for(const w of W){const t=T[w];
 const g=t.nodes.filter(n=>n.gridTemplateColumns!=='none').find(n=>!n.gridTemplateColumns.includes('348')&&!n.gridTemplateColumns.includes('463')&&!n.gridTemplateColumns.includes('728')&&!n.gridTemplateColumns.includes('350'));
 if(!g){console.log(`  ${w}: —`);continue;}
 const kids=t.nodes.filter(n=>n.path.startsWith(g.path+'/')&&Math.abs(n.y-g.y)<2&&n.w>40&&n.h>40);
 console.log(`  ${String(w).padStart(5)}: grid ${g.w}×${g.h} cols[${g.gridTemplateColumns}] gap ${g.rowGap}/${g.columnGap}  items: ${[...new Set(kids.map(k=>k.w+'×'+k.h))].join(' , ')}`);}
console.log('\n\nHERO INNER BY VIEWPORT');
for(const w of W){const t=T[w];const s=tops(t)[0];
 const h1=t.nodes.find(n=>n.tag==='h1');
 const stack=t.nodes.filter(n=>n.path.startsWith(s.path+'/')&&n.paddingBottom==='60px')[0];
 const strap=t.nodes.filter(n=>n.path.startsWith(s.path+'/')&&n.justifyContent==='space-between'&&n.paddingTop==='20px')[0];
 console.log(`  ${String(w).padStart(5)}: section ${s.w}×${s.h}  h1 ${h1?h1.w+'×'+h1.h+' '+h1.fontSize+'/'+h1.lineHeight+' ls'+h1.letterSpacing:'—'}  stack ${stack?stack.w+'×'+stack.h+' gap'+stack.rowGap:'—'}  strap ${strap?strap.w+'×'+strap.h:'—'}`);}
console.log('\n\nTYPE SCALE BY VIEWPORT (h1 / h2 / lead / body)');
for(const w of W){const t=T[w];
 const pick=(pred)=>{const n=t.nodes.filter(pred);return n.length?`${n[0].fontSize}/${n[0].lineHeight} ls${n[0].letterSpacing}`:'—'};
 console.log(`  ${String(w).padStart(5)}: h1 ${pick(n=>n.tag==='h1')}   h2 ${pick(n=>n.tag==='h2'||(n.tag==='span'&&parseFloat(n.fontSize)>=36&&parseFloat(n.fontSize)<70))}   h3-24 ${pick(n=>n.tag==='h3'&&parseFloat(n.fontSize)>=22)}   lead ${pick(n=>n.tag==='p'&&n.fontSize==='18px')}`);}
