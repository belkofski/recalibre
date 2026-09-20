import { readFileSync } from 'node:fs';
const W=[1440,1024,768,390];
const NAMES=['Hero','Clients','Pillars','Services','Framework','Cases','Approach','Testimonials','Faq','Footer'];
const tops=t=>{const c=t.nodes.filter(n=>['section','footer'].includes(n.tag)&&n.h>40&&!n.path.includes('__framer'));
 return c.filter(r=>!c.some(o=>o!==r&&r.path.startsWith(o.path+'/'))).sort((a,b)=>a.y-b.y);};
for(const w of W){
  const R=JSON.parse(readFileSync(`raw/ref-${w}.json`,'utf8'));
  const M=JSON.parse(readFileSync(`raw/mine-${w}.json`,'utf8'));
  const A=tops(R), B=tops(M);
  console.log(`\n${'='.repeat(74)}\n@ ${w}px   ref doc ${R.docHeight}   mine doc ${M.docHeight}   Δ ${M.docHeight-R.docHeight}\n${'='.repeat(74)}`);
  console.log(`${'SECTION'.padEnd(14)}${'REF h'.padStart(11)}${'MINE h'.padStart(11)}${'Δh'.padStart(10)}${'REF y'.padStart(11)}${'MINE y'.padStart(11)}${'Δy'.padStart(10)}`);
  for(let i=0;i<NAMES.length;i++){
    const a=A[i],b=B[i];
    if(!a||!b){console.log(`${NAMES[i].padEnd(14)}${(a?a.h:'—').toString().padStart(11)}${(b?b.h:'—').toString().padStart(11)}${'MISSING'.padStart(10)}`);continue;}
    const dh=+(b.h-a.h).toFixed(2), dy=+(b.y-a.y).toFixed(2);
    const f=v=>v===0?'0':(v>0?'+':'')+v;
    console.log(`${NAMES[i].padEnd(14)}${String(a.h).padStart(11)}${String(b.h).padStart(11)}${f(dh).padStart(10)}${String(a.y).padStart(11)}${String(b.y).padStart(11)}${f(dy).padStart(10)}`);
  }
}
