import { launch, Session } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const { proc, wsUrl } = await launch({ port: 9930, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});

const SAMPLER = `
window.__rows = [];
window.__watch = (ms) => {
  window.__rows.length = 0;
  const t0 = performance.now();
  // watch every element that Framer may reveal: spans, images, cards, plates
  const els = [...document.querySelectorAll('span, img, h2, h3, p, a, li')].filter(e => {
    const b = e.getBoundingClientRect();
    return b.top > -200 && b.top < 1200 && b.width > 0 && b.height > 0;
  }).slice(0, 60);
  els.forEach((e, i) => e.__idx = i);
  const tick = () => {
    const now = performance.now();
    els.forEach((e, i) => {
      const c = getComputedStyle(e);
      if (c.opacity === '1' && c.transform === 'none' && c.filter === 'none') return;
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
await sleep(4000);

// scroll to each section top so its reveal fires, sampling as it happens
const SECTIONS = [
  ['Pillars', 990], ['Services', 2112], ['Framework', 3148], ['Cases', 4067],
  ['Approach', 5839], ['Testimonials', 6807], ['Faq', 7741], ['Footer', 8659],
];
const out = {};
for (const [name, y] of SECTIONS) {
  await s.eval(`window.scrollTo(0, ${Math.max(0, y - 1500)})`);
  await sleep(1400);
  await s.eval(`window.__watch(2600)`);
  await s.eval(`window.scrollTo({top: ${y - 200}, behavior: 'instant'})`);
  await sleep(3000);
  const rows = JSON.parse(await s.eval('JSON.stringify(window.__rows)'));
  out[name] = rows;
  // summarise
  const byEl = new Map();
  for (const r of rows) { if (!byEl.has(r[1])) byEl.set(r[1], []); byEl.get(r[1]).push(r); }
  const animated = [...byEl].filter(([, rs]) => rs.length > 3);
  console.log(`\n${name}: ${animated.length} animating elements`);
  for (const [i, rs] of animated.slice(0, 3)) {
    const f = rs[0], l = rs[rs.length - 1];
    console.log(`  [${i}] ${f[2]} over ${(l[0]-f[0]).toFixed(0)}ms`);
    console.log(`      from op:${f[3]} tf:${f[4].slice(0,46)} filter:${f[5].slice(0,22)}`);
    console.log(`      to   op:${l[3]} tf:${l[4].slice(0,46)} filter:${l[5].slice(0,22)}`);
  }
}
writeFileSync('raw/anim-scroll.json', JSON.stringify(out));
console.log('\nsaved raw/anim-scroll.json');
s.close(); proc.kill('SIGKILL'); process.exit(0);
