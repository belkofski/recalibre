import { launch, Session } from './cdp.mjs';
import { setTimeout as sleep } from 'node:timers/promises';
const { proc, wsUrl } = await launch({ port: 9530, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
const loaded=new Promise(r=>s.on('Page.loadEventFired',r));
await s.send('Page.navigate',{url:'https://elytetemplate.framer.website/'});
await Promise.race([loaded,sleep(30000)]); await sleep(3500);
await s.eval('window.scrollTo(0,0)'); await sleep(1200);

const panelState = async () => s.eval(`(()=>{
  const p=[...document.querySelectorAll('nav div')].find(d=>{const c=getComputedStyle(d);const b=d.getBoundingClientRect();
    return Math.abs(b.width-1160)<2 && Math.abs(b.height-360)<2 && c.position==='absolute'});
  if(!p) return 'panel-not-found';
  const c=getComputedStyle(p), b=p.getBoundingClientRect();
  return 'op:'+c.opacity+' tf:'+c.transform+' y:'+(b.top+scrollY).toFixed(2)+' vis:'+c.visibility+' pe:'+c.pointerEvents;
})()`);

console.log('at rest:                  ', await panelState());

// hover each nav item in turn
const items = await s.eval(`JSON.stringify([...document.querySelectorAll('nav p')].map(p=>{const b=p.getBoundingClientRect();
  return {t:p.textContent.trim().slice(0,20), x:Math.round(b.left+b.width/2), y:Math.round(b.top+b.height/2)}}).filter(o=>o.y<80))`);
for (const it of JSON.parse(items)) {
  await s.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:it.x,y:it.y,buttons:0});
  await sleep(1100);
  console.log(`hover "${it.t}"`.padEnd(26), await panelState());
  await s.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:700,y:600,buttons:0});
  await sleep(500);
}
// hover the logo and the whole nav bar band
for (const [label,x,y] of [['logo',188,43],['nav bar right',1237,43],['nav band mid',900,43]]) {
  await s.send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y,buttons:0});
  await sleep(1100);
  console.log(`hover ${label}`.padEnd(26), await panelState());
  await s.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:700,y:600,buttons:0}); await sleep(400);
}
// click the Services item
const svc = JSON.parse(items).find(o=>/Services/i.test(o.t));
if (svc) {
  await s.send('Input.dispatchMouseEvent',{type:'mousePressed',x:svc.x,y:svc.y,button:'left',clickCount:1});
  await s.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:svc.x,y:svc.y,button:'left',clickCount:1});
  await sleep(1400);
  console.log('click "Services"'.padEnd(26), await panelState());
}
console.log('\npanel pointer-events / parent chain visibility:');
console.log(await s.eval(`(()=>{
  const p=[...document.querySelectorAll('nav div')].find(d=>{const b=d.getBoundingClientRect();const c=getComputedStyle(d);
    return Math.abs(b.width-1160)<2&&Math.abs(b.height-360)<2&&c.position==='absolute'});
  if(!p)return 'none';
  let e=p,out=[];
  while(e&&e.tagName!=='BODY'){const c=getComputedStyle(e);out.push(e.tagName+'('+c.opacity+','+c.visibility+','+c.pointerEvents+','+c.overflow+')');e=e.parentElement}
  return out.join(' < ');
})()`));
s.close(); proc.kill('SIGKILL'); process.exit(0);
