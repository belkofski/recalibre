import { readFileSync, writeFileSync } from 'node:fs';
const d = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const tag = process.argv[3] || '1440';
const byPath = new Map(d.nodes.map(n => [n.path, n]));

// Roots: the layout-bearing top-level blocks, in document order, excluding framer chrome.
const roots = [];
for (const n of d.nodes) {
  if (n.depth !== 4 && n.depth !== 3) continue;
  if (!['section','nav','footer','div'].includes(n.tag)) continue;
  if (n.id === 'overlay' || n.id === 'template-overlay' || n.id === 'svg-templates') continue;
  if (n.path.includes('__framer')) continue;
  if (n.h < 40) continue;
  if (n.depth === 3 && n.display === 'contents') continue;
  // depth-3 div that wraps footer, and depth-4 sections
  roots.push(n);
}
// dedupe: drop a root that is an ancestor of another root
const keep = roots.filter(r => !roots.some(o => o !== r && r.path.startsWith(o.path + '/')));
const names = [];
keep.sort((a,b)=>a.y-b.y);
keep.forEach((r, i) => {
  const kids = d.nodes.filter(n => n.path === r.path || n.path.startsWith(r.path + '/'));
  const nm = String(i).padStart(2,'0') + '-' + r.tag + '-y' + Math.round(r.y);
  writeFileSync(`specs/${tag}-${nm}.json`, JSON.stringify({
    name: nm, viewport: d.viewport.w, root: r.path,
    box: { x:r.x, y:r.y, w:r.w, h:r.h }, count: kids.length, nodes: kids
  }, null, 0));
  names.push(`${nm}  y=${r.y} h=${r.h} x=${r.x} w=${r.w} nodes=${kids.length}`);
});
console.log(names.join('\n'));
