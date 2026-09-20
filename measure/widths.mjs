import { readFileSync } from 'node:fs';
/**
 * Width multiset comparison. In this layout widths are set by the grid/column
 * system and are almost entirely independent of how long my copy is (heights
 * are not). So comparing the multiset of distinct box widths is a clean check
 * on whether the responsive column system matches.
 */
const W = [1440, 1024, 768, 390];
for (const w of W) {
  const R = JSON.parse(readFileSync(`raw/ref-${w}.json`,'utf8'));
  const M = JSON.parse(readFileSync(`raw/mine-${w}.json`,'utf8'));
  const chrome = t => {
    const roots = t.nodes.filter(n => (n.id||'').startsWith('__framer') || ['template-overlay','svg-templates','overlay'].includes(n.id||'')).map(n=>n.path+'/');
    return p => roots.some(r => p.startsWith(r));
  };
  const widths = t => {
    const isChrome = chrome(t);
    const m = new Map();
    t.nodes.filter(n => n.w > 30 && n.h > 4 && !['script','style','link'].includes(n.tag) && !isChrome(n.path) && !(n.id||'').startsWith('__framer'))
      .forEach(n => { const k = n.w.toFixed(1); m.set(k, (m.get(k)||0)+1); });
    return m;
  };
  const A = widths(R), B = widths(M);
  const keys = [...new Set([...A.keys(), ...B.keys()])].sort((a,b)=>+b-+a);
  const missing = keys.filter(k => (A.get(k)||0) > 0 && (B.get(k)||0) === 0);
  const extra   = keys.filter(k => (B.get(k)||0) > 0 && (A.get(k)||0) === 0);
  const shared  = keys.filter(k => (A.get(k)||0) > 0 && (B.get(k)||0) > 0);
  console.log(`\n@ ${w}px — distinct box widths: ref ${A.size}, mine ${B.size}, shared ${shared.length}`);
  if (missing.length) console.log(`  widths in REF not in MINE (${missing.length}): ${missing.slice(0,18).join(', ')}${missing.length>18?' …':''}`);
  if (extra.length)   console.log(`  widths in MINE not in REF (${extra.length}): ${extra.slice(0,18).join(', ')}${extra.length>18?' …':''}`);
  if (!missing.length && !extra.length) console.log('  exact match on the width multiset');
}
