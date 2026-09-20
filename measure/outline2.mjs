import { readFileSync } from 'node:fs';
const d = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const maxDepth = +(process.argv[3] || 6);
const SKIP = new Set(['script','link','style','iframe','noscript','meta']);
let skipPrefix = null;
for (const n of d.nodes) {
  if (SKIP.has(n.tag)) continue;
  if (n.path.includes('__framer-badge') ) continue;
  if (skipPrefix && n.path.startsWith(skipPrefix)) continue; else skipPrefix = null;
  if (n.id === '__framer-badge-container' || n.id === 'svg-templates') { skipPrefix = n.path + '/'; continue; }
  if (n.depth > maxDepth) continue;
  const pad = '· '.repeat(n.depth);
  const t = n.text ? ' «' + n.text.slice(0, 40) + '»' : '';
  console.log(`${pad}${n.tag}${n.id?'#'+n.id:''} d${n.depth} y${n.y} h${n.h} x${n.x} w${n.w} | ${n.display}${n.display==='flex'?':'+n.flexDirection:''}${n.position!=='static'?' '+n.position:''}${t}`);
}
