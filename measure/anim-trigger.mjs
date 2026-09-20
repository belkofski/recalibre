import { launch, Session } from './cdp.mjs';
import { setTimeout as sleep } from 'node:timers/promises';
const { proc, wsUrl } = await launch({ port: 9950, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
const loaded = new Promise(r => s.on('Page.loadEventFired', r));
await s.send('Page.navigate', { url: 'https://elytetemplate.framer.website/' });
await Promise.race([loaded, sleep(30000)]);
await sleep(3500);

// Creep down in 25px steps and record the scroll position at which the
// Testimonials heading spans leave their initial state.
await s.eval('window.scrollTo(0,0)'); await sleep(1200);
const TARGET = 6926;  // Testimonials eyebrow/heading top at 1440
let fired = null;
for (let y = 5200; y <= 7000 && fired === null; y += 25) {
  await s.eval(`window.scrollTo(0, ${y})`);
  await sleep(140);
  const r = await s.eval(`(() => {
    const el = [...document.querySelectorAll('h2 span')].find(e => {
      const t = e.getBoundingClientRect().top + window.scrollY;
      return t > ${TARGET - 80} && t < ${TARGET + 260};
    });
    if (!el) return 'none';
    const c = getComputedStyle(el);
    const b = el.getBoundingClientRect();
    return JSON.stringify({ op: c.opacity, top: +b.top.toFixed(1), docTop: +(b.top + window.scrollY).toFixed(1) });
  })()`);
  if (r === 'none') continue;
  const o = JSON.parse(r);
  if (parseFloat(o.op) > 0.0015) {
    fired = { scrollY: y, elTopInViewport: o.top, docTop: o.docTop };
  }
}
console.log('reveal trigger for the Testimonials heading:');
if (fired) {
  console.log(`  scrollY at trigger        ${fired.scrollY}`);
  console.log(`  element top in viewport   ${fired.elTopInViewport}px  (viewport height 900)`);
  console.log(`  => fires when the element top is ${(900 - fired.elTopInViewport).toFixed(0)}px above the viewport bottom`);
  console.log(`  => i.e. ${(fired.elTopInViewport / 900 * 100).toFixed(1)}% down the viewport`);
} else console.log('  not observed');
s.close(); proc.kill('SIGKILL'); process.exit(0);
