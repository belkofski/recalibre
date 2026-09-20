import { readFileSync, writeFileSync } from 'node:fs';
const d = JSON.parse(readFileSync('raw/ref-1440.json','utf8'));
const scripts = d.nodes.filter(n=>n.tag==='script'&&n.text);
for (const s of scripts) {
  if (s.id === '__framer__appearAnimationsContent') writeFileSync('raw/appear-animations.json', s.text);
  if (s.id === '__framer__breakpoints') writeFileSync('raw/breakpoints.json', s.text);
}
const styles = d.nodes.filter(n=>n.tag==='style'&&n.text);
writeFileSync('raw/inline-styles.css', styles.map(s=>s.text).join('\n\n/* --- */\n\n'));
console.log('scripts with text:', scripts.map(s=>s.id||'(anon '+s.text.length+')').join(', '));
console.log('styles:', styles.length, 'total css chars', styles.reduce((a,s)=>a+s.text.length,0));
console.log('fonts:'); d.fonts.forEach(f=>console.log('  '+f));
