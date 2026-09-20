import { launch, Session } from './cdp.mjs';
import { setTimeout as sleep } from 'node:timers/promises';
const { proc, wsUrl } = await launch({ port: 9361, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
const loaded=new Promise(r=>s.on('Page.loadEventFired',r));
await s.send('Page.navigate',{url:'https://elytetemplate.framer.website/'});
await Promise.race([loaded,sleep(30000)]); await sleep(3500);
await s.eval('window.scrollTo(0,0)'); await sleep(1200);

// install a sampler on the hero button's absolute arrow square + bg
await s.eval(`window.__samples=[];window.__rec=()=>{
  const a=[...document.querySelectorAll('a')].find(x=>x.textContent.includes('Book a Call'));
  const sq=[...a.querySelectorAll('div')].filter(d=>getComputedStyle(d).aspectRatio==='1 / 1');
  const abs=sq.find(d=>getComputedStyle(d).position==='absolute');
  const c=getComputedStyle(abs), ac=getComputedStyle(a);
  window.__samples.push([performance.now(), c.top, c.left, ac.backgroundColor, getComputedStyle(a).getPropertyValue('transition-duration')]);
  if(window.__on) requestAnimationFrame(window.__rec);
};window.__on=true;window.__rec();1`);
await s.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:217,y:755,buttons:0});
await sleep(1500);
await s.eval('window.__on=false;1');
const raw = await s.eval('JSON.stringify(window.__samples)');
const S = JSON.parse(raw);
const t0 = S[0][0];
let prev=null, changes=[];
for (const [t,top,left,bg] of S) {
  const k = `${top}|${left}|${bg}`;
  if (k !== prev) { changes.push([+(t-t0).toFixed(1), top, left, bg]); prev = k; }
}
console.log('frames sampled:', S.length, ' distinct states:', changes.length);
console.log('\n t(ms)     top        left       button-bg');
changes.slice(0,40).forEach(c=>console.log(String(c[0]).padStart(7), String(c[1]).padStart(10), String(c[2]).padStart(10), '  '+c[3]));
if (changes.length>2) {
  const first=changes[1][0], last=changes[changes.length-1][0];
  console.log(`\nmotion window: ${first}ms → ${last}ms  = ${(last-first).toFixed(0)}ms`);
}
s.close(); proc.kill('SIGKILL'); process.exit(0);
