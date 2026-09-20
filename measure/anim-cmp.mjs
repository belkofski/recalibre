import { launch, Session } from './cdp.mjs';
import { setTimeout as sleep } from 'node:timers/promises';
const URL = process.argv[2], LABEL = process.argv[3], PORT = +process.argv[4];
const Y0 = +process.argv[5], Y1 = +process.argv[6];
const { proc, wsUrl } = await launch({ port: PORT, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await s.send('Page.addScriptToEvaluateOnNewDocument', { source: `
window.__rows=[];
window.__watchRange=(yMin,yMax,ms)=>{
  window.__rows.length=0;
  const els=[...document.querySelectorAll('h2 span')].filter(e=>{
    const b=e.getBoundingClientRect(); const top=b.top+window.scrollY;
    return top>=yMin && top<=yMax && b.width>0 && b.height>0;
  }).slice(0,8);
  const t0=performance.now();
  const tick=()=>{const now=performance.now();
    els.forEach((e,i)=>{const c=getComputedStyle(e);
      window.__rows.push([+(now-t0).toFixed(1),i,c.opacity,c.transform,c.filter])});
    if(now-t0<ms)requestAnimationFrame(tick)};
  requestAnimationFrame(tick); return els.length;
};` });
const loaded=new Promise(r=>s.on('Page.loadEventFired',r));
await s.send('Page.navigate',{url:URL});
await Promise.race([loaded,sleep(30000)]);
await sleep(3500);
await s.eval('window.scrollTo(0,0)'); await sleep(1000);
const n = await s.eval(`window.__watchRange(${Y0}, ${Y1}, 4000)`);
await sleep(120);
await s.eval(`window.scrollTo(0, ${Y0 - 300})`);
await sleep(4400);
const rows = JSON.parse(await s.eval('JSON.stringify(window.__rows)'));
const parse=tf=>{const m=tf.match(/matrix\(([^)]+)\)/);if(!m)return null;const p=m[1].split(",").map(Number);
 return {ty:p[5],rot:Math.atan2(p[1],p[0])*180/Math.PI}};
console.log(`\n#### ${LABEL} — reveal of the heading at y${Y0} (${n} spans watched) ####`);
const starts=[];
for(let i=0;i<6;i++){
  const el=rows.filter(r=>r[1]===i); if(!el.length)continue;
  let t0=null,t1=null,init=el[0];
  for(const r of el){const op=parseFloat(r[2]);
    if(t0===null&&op>0.0015)t0=r[0];
    if(t0!==null&&t1===null&&op>=0.999&&(r[3]==='none'||r[3]==='matrix(1, 0, 0, 1, 0, 0)'))t1=r[0];}
  if(i===0){const m=parse(init[3]);
    console.log(`  initial:  opacity ${init[2]}  rotate ${m?m.rot.toFixed(2):'-'}deg  translateY ${m?m.ty.toFixed(2):'-'}px  ${init[4]}`);}
  if(t0!==null){starts.push(t0);
    console.log(`  [${i}] start ${String(t0).padStart(7)}  settle ${t1!==null?String(t1).padStart(8):'       ?'}  duration ${t1!==null?String(Math.round(t1-t0)).padStart(5):'    ?'}ms`);}
}
if(starts.length>1) console.log(`  stagger: ${starts.slice(1).map((v,i)=>(v-starts[i]).toFixed(1)).join(', ')} ms`);
s.close(); proc.kill('SIGKILL'); process.exit(0);
