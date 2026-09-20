import { launch, Session } from './cdp.mjs';
import { setTimeout as sleep } from 'node:timers/promises';
const { proc, wsUrl } = await launch({ port: 9320, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await s.send('Page.addScriptToEvaluateOnNewDocument', { source: `
window.__rows=[];
window.__w=(ms)=>{
  const els=[...document.querySelectorAll('h2 .reveal-word')].slice(0,4);
  const t0=performance.now();
  const tick=()=>{const now=performance.now();
    els.forEach((e,i)=>{const c=getComputedStyle(e);
      window.__rows.push([+(now-t0).toFixed(1),i,c.opacity,c.transitionDelay+'|'+c.transitionDuration.split(',')[0]])});
    if(now-t0<2200)requestAnimationFrame(tick)};
  requestAnimationFrame(tick); return els.length;};` });
const loaded=new Promise(r=>s.on('Page.loadEventFired',r));
await s.send('Page.navigate',{url:'http://localhost:3111/'});
await Promise.race([loaded,sleep(20000)]); await sleep(3000);
await s.eval('window.scrollTo(0,0)'); await sleep(900);
const n=await s.eval('window.__w(2200)');
await sleep(80);
for (let y = 0; y <= 900; y += 60) { await s.eval(`window.scrollTo(0, ${y})`); await sleep(30); }
await sleep(2600);
const rows=JSON.parse(await s.eval('JSON.stringify(window.__rows)'));
console.log('watched', n, 'reveal-words; raw opacity by time:\n');
console.log('  t(ms)   w0        w1        w2        w3      (delay on w1 =', (rows.find(r=>r[1]===1)||[])[3], ')');
const times=[...new Set(rows.map(r=>r[0]))].filter((_,i)=>i%3===0).slice(8,30);
for(const t of times){
  const g=i=>{const r=rows.find(x=>x[0]===t&&x[1]===i);return r?parseFloat(r[2]).toFixed(4):'   -  '};
  console.log(`  ${String(t).padStart(6)}  ${g(0).padStart(8)}  ${g(1).padStart(8)}  ${g(2).padStart(8)}  ${g(3).padStart(8)}`);
}
s.close(); proc.kill('SIGKILL'); process.exit(0);
