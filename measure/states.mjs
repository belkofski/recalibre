import { launch, Session } from './cdp.mjs';
import { setTimeout as sleep } from 'node:timers/promises';
const URL = process.argv[2];
const LABEL = process.argv[3];
const { proc, wsUrl } = await launch({ port: +process.argv[4], width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
const loaded=new Promise(r=>s.on('Page.loadEventFired',r));
await s.send('Page.navigate',{url:URL});
await Promise.race([loaded,sleep(30000)]); await sleep(3000);
for(let y=0;y<10200;y+=400){ await s.eval(`window.scrollTo(0,${y})`); await sleep(80); }
await s.eval('window.scrollTo(0,0)'); await sleep(1500);

const arrowState = async (tag) => s.eval(`(()=>{
  const out=[];
  document.querySelectorAll('a,button').forEach(el=>{
    const sq=[...el.querySelectorAll('div')].filter(d=>{const c=getComputedStyle(d);return c.aspectRatio==='1 / 1'&&c.backgroundColor!=='rgba(0, 0, 0, 0)'&&Math.round(d.getBoundingClientRect().width)===20});
    if(sq.length!==2)return;
    const r=el.getBoundingClientRect(); if(r.top<-200||r.top>1400)return;
    const abs=sq.find(d=>getComputedStyle(d).position==='absolute');
    if(!abs)return;
    const c=getComputedStyle(abs);
    out.push('y'+Math.round(r.top+scrollY)+' t:'+c.top+' l:'+c.left+' bg:'+c.backgroundColor);
  });
  return out.slice(0,4).join('\\n');
})()`);

console.log(`\n######## ${LABEL} ########`);
console.log('--- hero arrows AT REST ---');
console.log(await arrowState());
// hover the hero primary button
await s.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:200,y:755,buttons:0});
await sleep(900);
console.log('--- hero primary button HOVERED ---');
console.log(await arrowState());
console.log('button background:', await s.eval(`(()=>{const a=[...document.querySelectorAll('a')].find(x=>{const r=x.getBoundingClientRect();return r.top>700&&r.top<780&&r.left<300&&r.width>100});return a?getComputedStyle(a).backgroundColor:'?'})()`));

// nav dropdown
await s.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:640,y:43,buttons:0});
await sleep(1100);
console.log('--- nav dropdown on hover ---');
console.log(await s.eval(`(()=>{
  const cands=[...document.querySelectorAll('nav div')].filter(d=>{const c=getComputedStyle(d);const b=d.getBoundingClientRect();
    return c.position==='absolute'&&b.width>100&&b.width<260&&b.height>60&&b.height<140});
  return cands.map(d=>{const b=d.getBoundingClientRect();const c=getComputedStyle(d);
    return Math.round(b.width*100)/100+'x'+Math.round(b.height*100)/100+' y'+(b.top+scrollY).toFixed(2)+' x'+b.left.toFixed(2)+' vis:'+c.visibility+' gap:'+c.rowGap}).join('\\n')||'none visible';
})()`));

// FAQ accordion: open row + closed row heights and icon rotation
await s.eval('window.scrollTo(0,7500)'); await sleep(1200);
console.log('--- FAQ rows + icon transforms ---');
console.log(await s.eval(`(()=>{
  const icons=[...document.querySelectorAll('div')].filter(d=>{const b=d.getBoundingClientRect();
    return Math.round(b.width)===24&&Math.round(b.height)===24&&getComputedStyle(d).overflow==='hidden'&&b.top+scrollY>7700});
  return icons.map(d=>{const b=d.getBoundingClientRect();return 'icon y'+(b.top+scrollY).toFixed(2)+' tf:'+getComputedStyle(d).transform}).join('\\n')||'none';
})()`));
s.close(); proc.kill('SIGKILL'); process.exit(0);
