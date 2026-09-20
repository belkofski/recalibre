import { launch, Session } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

/**
 * Captures the reference's animations by sampling every frame.
 * Pass 1: page load (entrance animations).
 * Pass 2: scroll each section into view and sample as it reveals.
 */
const { proc, wsUrl } = await launch({ port: 9920, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});

// install the sampler BEFORE navigation so we catch frame 0
const SAMPLER = `
window.__cap = { t0: performance.now(), rows: [] };
window.__startCapture = (sel, ms) => {
  const t0 = performance.now();
  const tick = () => {
    const now = performance.now();
    document.querySelectorAll(sel).forEach((el, i) => {
      const c = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      window.__cap.rows.push([
        +(now - t0).toFixed(1), i, el.tagName.toLowerCase(),
        c.opacity, c.transform, c.filter, c.clipPath,
        +(b.top + window.scrollY).toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2),
      ]);
    });
    if (now - t0 < ms) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
`;
await s.send('Page.addScriptToEvaluateOnNewDocument', { source: SAMPLER });

const loaded = new Promise(r => s.on('Page.loadEventFired', r));
await s.send('Page.navigate', { url: 'https://elytetemplate.framer.website/' });
await Promise.race([loaded, sleep(30000)]);

// Pass 1 — entrance: sample everything in the hero for 3.5s from load
await s.eval(`window.__cap.rows.length = 0; window.__startCapture('section:first-of-type img, section:first-of-type h1 span, section:first-of-type p, section:first-of-type a', 3500); 1`);
await sleep(4200);
const entrance = JSON.parse(await s.eval('JSON.stringify(window.__cap.rows)'));
writeFileSync('raw/anim-entrance.json', JSON.stringify(entrance));
console.log('entrance samples:', entrance.length);

// summarise: for each element index, first and last distinct state
const summarise = (rows, label) => {
  const byEl = new Map();
  for (const r of rows) { if (!byEl.has(r[1])) byEl.set(r[1], []); byEl.get(r[1]).push(r); }
  console.log(`\n=== ${label} ===`);
  for (const [i, rs] of [...byEl].slice(0, 14)) {
    const states = [];
    let prev = null;
    for (const r of rs) {
      const k = `${r[3]}|${r[4]}|${r[5]}`;
      if (k !== prev) { states.push(r); prev = k; }
    }
    if (states.length <= 1) continue;
    const f = states[0], l = states[states.length - 1];
    console.log(`  [${i}] ${f[2]}  ${states.length} states over ${(l[0]-f[0]).toFixed(0)}ms`);
    console.log(`       t=${f[0]}  op:${f[3]}  tf:${f[4].slice(0,52)}  filter:${f[5].slice(0,28)}`);
    console.log(`       t=${l[0]}  op:${l[3]}  tf:${l[4].slice(0,52)}  filter:${l[5].slice(0,28)}`);
  }
};
summarise(entrance, 'ENTRANCE (hero, from load)');
s.close(); proc.kill('SIGKILL'); process.exit(0);
