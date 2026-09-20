import { launch, Session } from './cdp.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const WALK = readFileSync(new URL('./walk-inpage.js', import.meta.url), 'utf8');

const url   = process.argv[2];
const width = +(process.argv[3] || 1440);
const height= +(process.argv[4] || 900);
const out   = process.argv[5];
const port  = +(process.argv[6] || 9333);
const shot  = process.argv[7] || '';

const { proc, wsUrl } = await launch({ port, width, height });
const s = await Session.connect(wsUrl);
await s.attachToPage();
await s.send('Page.enable');
await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride', {
  width, height, deviceScaleFactor: 1, mobile: width < 768,
  screenWidth: width, screenHeight: height
});

const loaded = new Promise(res => s.on('Page.loadEventFired', res));
await s.send('Page.navigate', { url });
await Promise.race([loaded, sleep(30000)]);
await sleep(2500);

// Framer lazy-mounts: crawl the full height in 400px steps, pausing at each.
const docH = await s.eval('document.documentElement.scrollHeight');
let y = 0;
const maxY = Math.max(docH, 20000);
for (let pass = 0; pass < 2; pass++) {
  for (y = 0; y < maxY; y += 400) {
    await s.eval(`window.scrollTo(0,${y})`);
    await sleep(110);
    const h = await s.eval('document.documentElement.scrollHeight');
    if (y > h) break;
  }
  await s.eval('window.scrollTo(0, document.documentElement.scrollHeight)');
  await sleep(700);
}
await s.eval('window.scrollTo(0,0)');
await sleep(2200);
// kill anything still animating so measurements are stable
await s.eval(`(()=>{document.getAnimations?.().forEach(a=>{try{a.finish()}catch(e){try{a.cancel()}catch(e2){}}});return 1})()`);
await sleep(600);
await s.eval('window.scrollTo(0,0)');
await sleep(400);

const json = await s.eval(WALK);
writeFileSync(out, json);
const parsed = JSON.parse(json);
console.log(`${out}  vw=${width}  nodes=${parsed.count}  docHeight=${parsed.docHeight}  fonts=${parsed.fonts.length}`);

if (shot) {
  await s.send('Emulation.setDeviceMetricsOverride', {
    width, height: Math.min(parsed.docHeight, 30000), deviceScaleFactor: 1, mobile: width < 768
  });
  await sleep(1200);
  const { data } = await s.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  writeFileSync(shot, Buffer.from(data, 'base64'));
  console.log('shot ->', shot);
}
s.close();
proc.kill('SIGKILL');
process.exit(0);
