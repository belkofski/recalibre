import { readFileSync } from 'node:fs';
/**
 * Are the narrow-width section-height residuals caused by my copy wrapping to a
 * different number of lines than theirs, or by the layout being wrong?
 *
 * Test: for each section, pair the text elements in document order, sum
 *   (my line count - their line count) x line-height
 * and compare that predicted height difference against the MEASURED one.
 * If they agree, the residual is the copy and nothing else.
 */
const NAMES = ['Hero','Clients','Pillars','Services','Framework','Cases','Approach','Testimonials','Faq','Footer'];
const tops = t => {
  const c = t.nodes.filter(n => ['section','footer'].includes(n.tag) && n.h > 40 && !n.path.includes('__framer'));
  return c.filter(r => !c.some(o => o !== r && r.path.startsWith(o.path + '/'))).sort((a,b)=>a.y-b.y);
};
// Every text element, whether or not it owns its text: both trees split their
// display headings into per-word spans, so an h1/h2 has no own text but its
// height is still lines x line-height.
const textEls = (t, s) => t.nodes
  .filter(n => n.path.startsWith(s.path + '/') && ['p','h1','h2','h3','h4','li'].includes(n.tag) && n.h > 0
               && parseFloat(n.lineHeight) > 0)
  .sort((a,b) => a.y - b.y || a.x - b.x)
  .map(n => ({ lines: Math.round(n.h / parseFloat(n.lineHeight)), lh: parseFloat(n.lineHeight), fs: n.fontSize, w: n.w }));

for (const vw of [1024, 768, 390]) {
  const R = JSON.parse(readFileSync(`raw/ref-${vw}.json`,'utf8'));
  const M = JSON.parse(readFileSync(`raw/mine-${vw}.json`,'utf8'));
  const A = tops(R), B = tops(M);
  console.log(`\n${'='.repeat(84)}\n@ ${vw}px — is the residual explained by line counts?\n${'='.repeat(84)}`);
  console.log(`${'SECTION'.padEnd(14)}${'measured Δh'.padStart(13)}${'predicted Δh'.padStart(14)}${'unexplained'.padStart(13)}   line-count diffs`);
  let totMeasured = 0, totUnexplained = 0;
  for (let i = 0; i < NAMES.length; i++) {
    const a = A[i], b = B[i]; if (!a || !b) continue;
    const ra = textEls(R, a), rb = textEls(M, b);
    const n = Math.min(ra.length, rb.length);
    let predicted = 0; const diffs = [];
    for (let j = 0; j < n; j++) {
      const d = rb[j].lines - ra[j].lines;
      if (d !== 0) { predicted += d * ra[j].lh; diffs.push(`${d>0?'+':''}${d}@${ra[j].fs}`); }
    }
    const measured = +(b.h - a.h).toFixed(2);
    const unexplained = +(measured - predicted).toFixed(2);
    totMeasured += Math.abs(measured); totUnexplained += Math.abs(unexplained);
    const f = v => (v === 0 ? '0' : (v > 0 ? '+' : '') + v.toFixed(2));
    console.log(`${NAMES[i].padEnd(14)}${f(measured).padStart(13)}${f(predicted).padStart(14)}${f(unexplained).padStart(13)}   ${diffs.slice(0,6).join(' ')}${ra.length!==rb.length?`  [text els ${ra.length} vs ${rb.length}]`:''}`);
  }
  console.log('-'.repeat(84));
  console.log(`${'TOTAL |Δ|'.padEnd(14)}${totMeasured.toFixed(2).padStart(13)}${''.padStart(14)}${totUnexplained.toFixed(2).padStart(13)}`);
}
