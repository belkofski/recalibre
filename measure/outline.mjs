import { readFileSync } from 'node:fs';
const d = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const maxDepth = +(process.argv[3] || 4);
console.log(`doc ${d.docHeight}px  vw ${d.viewport.w}  nodes ${d.count}  bodyBg ${d.bodyBg}`);
for (const n of d.nodes) {
  if (n.depth > maxDepth) continue;
  const pad = '  '.repeat(n.depth);
  const t = n.text ? ' «' + n.text.slice(0, 48) + '»' : '';
  console.log(`${pad}${n.tag}${n.id?'#'+n.id:''} d${n.depth} y=${n.y} h=${n.h} x=${n.x} w=${n.w} ${n.display}${n.position!=='static'?' '+n.position:''}${t}`);
}
