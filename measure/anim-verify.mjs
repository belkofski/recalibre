import { launch, Session } from './cdp.mjs';
import { setTimeout as sleep } from 'node:timers/promises';
const URL = process.argv[2], LABEL = process.argv[3], PORT = +process.argv[4];
const { proc, wsUrl } = await launch({ port: PORT, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await s.send('Page.addScriptToEvaluateOnNewDocument', { source: `
window.__rows=[];
window.__watch=(sel,ms)=>{const els=[...document.querySelectorAll(sel)].slice(0,8);const t0=performance.now();
 const tick=()=>{const now=performance.now();els.forEach((e,i)=>{const c=getComputedStyle(e);
   window.__rows.push([+(now-t0).toFixed(1),i,c.opacity,c.transform,c.filter])});
   if(now-t0<ms)requestAnimationFrame(tick)};requestAnimationFrame(tick);return els.length};` });
const loaded=new Promise(r=>s.on('Page.loadEventFired',r));
await s.send('Page.navigate',{url:URL});
await Promise.race([loaded,sleep(30000)]);
await s.eval(`window.__rows.length=0; window.__watch('h1 span', 3000); 1`);
await sleep(3600);
const rows=JSON.parse(await s.eval('JSON.stringify(window.__rows)'));
const parse=tf=>{const m=tf.match(/matrix\(([^)]+)\)/);if(!m)return null;const p=m[1].split(",").map(Number);
 return {ty:p[5],rot:Math.atan2(p[1],p[0])*180/Math.PI}};
console.log(`\n#### ${LABEL} — h1 word spans ####`);
const starts=[];
for(let i=0;i<6;i++){
  const el=rows.filter(r=>r[1]===i); if(!el.length)continue;
  let t0=null,t1=null,initial=null;
  for(const r of el){const op=parseFloat(r[2]);
    if(initial===null)initial=r;
    if(t0===null&&op>0.0015)t0=r[0];
    if(t1===null&&op>=0.999&&(r[3]==='none'||r[3]==='matrix(1, 0, 0, 1, 0, 0)'))t1=r[0];}
  const m=parse(initial[3]);
  if(i===0) console.log(`  initial state: opacity ${initial[2]}  rotate ${m?m.rot.toFixed(2):'-'}deg  translateY ${m?m.ty.toFixed(2):'-'}px  ${initial[4]}`);
  if(t0!==null){starts.push(t0);
    console.log(`  [${i}] start ${String(t0).padStart(7)}ms  settle ${t1!==null?String(t1).padStart(8):'       ?'}ms  duration ${t1!==null?(t1-t0).toFixed(0):'?'}ms`);}
}
console.log(`  stagger: ${starts.slice(1).map((v,i)=>(v-starts[i]).toFixed(1)).join(', ')} ms`);
s.close(); proc.kill('SIGKILL'); process.exit(0);
