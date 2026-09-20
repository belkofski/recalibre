import { launch, Session } from './cdp.mjs';
import { setTimeout as sleep } from 'node:timers/promises';
const URL=process.argv[2], LABEL=process.argv[3], PORT=+process.argv[4];
const { proc, wsUrl } = await launch({ port: PORT, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await s.send('Page.addScriptToEvaluateOnNewDocument', { source: `
window.__r=[];
window.__go=(ms)=>{const els=[...document.querySelectorAll('h1 span')].slice(0,1);
 const t0=performance.now();
 const tick=()=>{const now=performance.now();
   els.forEach(e=>{const c=getComputedStyle(e);
     window.__r.push([+(now-t0).toFixed(1), c.opacity, c.transform, c.filter])});
   if(now-t0<ms)requestAnimationFrame(tick)};
 requestAnimationFrame(tick); return els.length;};` });
const loaded=new Promise(r=>s.on('Page.loadEventFired',r));
await s.send('Page.navigate',{url:URL});
await Promise.race([loaded,sleep(30000)]);
await s.eval('window.__r.length=0; window.__go(2600); 1');
await sleep(3000);
const rows=JSON.parse(await s.eval('JSON.stringify(window.__r)'));
// normalise: find the first sample that leaves 0.001 and the first at 1
let t0=null,t1=null;
for(const r of rows){const op=parseFloat(r[1]);
  if(t0===null&&op>0.0015)t0=r[0];
  if(t0!==null&&t1===null&&op>=0.9995)t1=r[0];}
const D=t1-t0;
const out=[];
for(let k=0;k<=10;k++){
  const x=k/10;
  let best=null,bd=1e9;
  for(const r of rows){const p=(r[0]-t0)/D; if(Math.abs(p-x)<bd){bd=Math.abs(p-x);best=r;}}
  const m=best[2].match(/matrix\(([^)]+)\)/);
  const ty=m?parseFloat(m[1].split(",")[5]):0;
  const bl=(best[3].match(/blur\(([\d.]+)px\)/)||[0,0])[1];
  out.push([x, parseFloat(best[1]), ty, parseFloat(bl)]);
}
console.log(`\n${LABEL}   (duration ${D.toFixed(0)}ms)`);
console.log('  t/D    opacity   translateY   blur');
for(const [x,op,ty,bl] of out) console.log(`  ${x.toFixed(1)}   ${op.toFixed(4).padStart(7)}   ${ty.toFixed(2).padStart(7)}px   ${Number(bl).toFixed(3).padStart(6)}`);
s.close(); proc.kill('SIGKILL'); process.exit(0);
