import { launch, Session } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const { proc, wsUrl } = await launch({ port: 9940, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});

const SAMPLER = `
window.__rows = [];
// select by ABSOLUTE document position, before scrolling, so we watch the right elements
window.__watchRange = (yMin, yMax, ms) => {
  window.__rows.length = 0;
  const els = [...document.querySelectorAll('span, img, h2, h3, p, a, li, div')].filter(e => {
    const b = e.getBoundingClientRect();
    const top = b.top + window.scrollY;
    return top >= yMin && top <= yMax && b.width > 0 && b.height > 0;
  }).slice(0, 80);
  const t0 = performance.now();
  const tick = () => {
    const now = performance.now();
    els.forEach((e, i) => {
      const c = getComputedStyle(e);
      window.__rows.push([+(now - t0).toFixed(1), i, e.tagName.toLowerCase(), c.opacity, c.transform, c.filter]);
    });
    if (now - t0 < ms) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return els.length;
};`;
await s.send('Page.addScriptToEvaluateOnNewDocument', { source: SAMPLER });
const loaded = new Promise(r => s.on('Page.loadEventFired', r));
await s.send('Page.navigate', { url: 'https://elytetemplate.framer.website/' });
await Promise.race([loaded, sleep(30000)]);
await sleep(3500);

const SECTIONS = [['Pillars',990,2112],['Services',2112,3148],['Cases',4067,5839],['Testimonials',6807,7741],['Footer',8659,9841]];
const out = {};
for (const [name, y0, y1] of SECTIONS) {
  // make sure we are far above it and it has never been on screen in this session
  await s.eval(`window.scrollTo(0, 0)`); await sleep(900);
  const n = await s.eval(`window.__watchRange(${y0}, ${y1}, 3000)`);
  await sleep(120);
  await s.eval(`window.scrollTo(0, ${y0 - 300})`);
  await sleep(3400);
  const rows = JSON.parse(await s.eval('JSON.stringify(window.__rows)'));
  out[name] = rows;
  const byEl = new Map();
  for (const r of rows) { if (!byEl.has(r[1])) byEl.set(r[1], []); byEl.get(r[1]).push(r); }
  const animated = [...byEl].filter(([, rs]) => new Set(rs.map(r => r[3]+r[4]+r[5])).size > 3);
  console.log(`\n${name} (watching ${n} els): ${animated.length} ANIMATE`);
  for (const [i, rs] of animated.slice(0, 2)) {
    const states = []; let prev = null;
    for (const r of rs) { const k = r[3]+'|'+r[4]+'|'+r[5]; if (k !== prev) { states.push(r); prev = k; } }
    const f = states[0], l = states[states.length-1];
    console.log(`  [${i}] ${f[2]}  ${states.length} states, ${(l[0]-f[0]).toFixed(0)}ms`);
    console.log(`      from  op:${f[3]}  tf:${f[4].slice(0,48)}  ${f[5].slice(0,20)}`);
    console.log(`      to    op:${l[3]}  tf:${l[4].slice(0,48)}  ${l[5].slice(0,20)}`);
  }
}
writeFileSync('raw/anim-scroll.json', JSON.stringify(out));
console.log('\nsaved');
s.close(); proc.kill('SIGKILL'); process.exit(0);
