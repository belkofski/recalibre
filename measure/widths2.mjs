import { readFileSync } from 'node:fs';
/**
 * Layout-box width comparison. Excludes text leaves (whose width is set by how
 * long the copy is) and Framer's per-word animation spans. What is left is the
 * column/grid system: plates, images, cards, grid items, scrims.
 */
const W = [1440, 1024, 768, 390];
const isLayout = n =>
  !['script','style','link','span','p','h1','h2','h3','h4','h5','h6','li','br','use','path','svg','input','form'].includes(n.tag) &&
  !n.text &&
  n.w > 40 && n.h > 8 &&
  (n.backgroundColor !== 'rgba(0, 0, 0, 0)' || n.backgroundImage !== 'none' || n.tag === 'img' ||
   n.gridTemplateColumns !== 'none' || (n.rowGap !== 'normal' && n.rowGap !== '0px') ||
   n.paddingTop !== '0px' || n.paddingLeft !== '0px' || n.position === 'absolute');
for (const w of W) {
  const R = JSON.parse(readFileSync(`raw/ref-${w}.json`,'utf8'));
  const M = JSON.parse(readFileSync(`raw/mine-${w}.json`,'utf8'));
  const chromeOf = t => {
    const roots = t.nodes.filter(n => (n.id||'').startsWith('__framer') || ['template-overlay','svg-templates','overlay'].includes(n.id||'')).map(n=>n.path+'/');
    return p => roots.some(r => p.startsWith(r));
  };
  const set = t => { const c = chromeOf(t); const m = new Map();
    t.nodes.filter(n => isLayout(n) && !c(n.path) && !(n.id||'').startsWith('__framer'))
      .forEach(n => { const k = n.w.toFixed(1); m.set(k, (m.get(k)||0)+1); }); return m; };
  const A = set(R), B = set(M);
  const keys = [...new Set([...A.keys(), ...B.keys()])].sort((a,b)=>+b-+a);
  const missing = keys.filter(k => A.has(k) && !B.has(k));
  const extra = keys.filter(k => B.has(k) && !A.has(k));
  const shared = keys.filter(k => A.has(k) && B.has(k));
  console.log(`\n@ ${w}px  layout-box widths: ref ${A.size} distinct, mine ${B.size}, shared ${shared.length}`);
  if (missing.length) console.log(`  in REF not MINE: ${missing.join(', ')}`);
  if (extra.length)   console.log(`  in MINE not REF: ${extra.join(', ')}`);
  if (!missing.length && !extra.length) console.log('  EXACT match');
}
