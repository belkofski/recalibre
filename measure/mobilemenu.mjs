import { launch, Session } from './cdp.mjs';
import { setTimeout as sleep } from 'node:timers/promises';
const { proc, wsUrl } = await launch({ port: 9395, width: 390, height: 844 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride', { width:390, height:844, deviceScaleFactor:1, mobile:true, screenWidth:390, screenHeight:844 });
await s.send('Emulation.setTouchEmulationEnabled', { enabled:true, maxTouchPoints:5 }).catch(()=>{});
const loaded = new Promise(r=>s.on('Page.loadEventFired', r));
await s.send('Page.navigate', { url:'https://elytetemplate.framer.website/' });
await Promise.race([loaded, sleep(30000)]); await sleep(3500);
await s.eval('window.scrollTo(0,0)'); await sleep(1200);

// tap the burger: measured 44x44 box at x326 y12 -> centre (348, 34)
await s.send('Input.dispatchMouseEvent',{type:'mousePressed',x:348,y:34,button:'left',clickCount:1});
await s.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:348,y:34,button:'left',clickCount:1});
await sleep(1800);

console.log('=== MOBILE MENU, OPEN @ 390x844 ===');
console.log(await s.eval(`(()=>{
  const out=[];
  const walk=(el,d)=>{
    const c=getComputedStyle(el), b=el.getBoundingClientRect();
    if(b.width>0&&b.height>0&&c.visibility!=='hidden'&&c.opacity!=='0'){
      out.push('  '.repeat(d)+el.tagName.toLowerCase()+
        ' '+b.width.toFixed(2)+'x'+b.height.toFixed(2)+' y'+(b.top+scrollY).toFixed(2)+' x'+b.left.toFixed(2)+
        ' '+c.display+(c.display.includes('flex')?':'+c.flexDirection+' jc:'+c.justifyContent+' ai:'+c.alignItems:'')+
        (c.rowGap!=='normal'&&c.rowGap!=='0px'?' gap:'+c.rowGap+'/'+c.columnGap:'')+
        (c.paddingTop!=='0px'||c.paddingLeft!=='0px'?' pad:'+c.paddingTop+' '+c.paddingRight+' '+c.paddingBottom+' '+c.paddingLeft:'')+
        (c.backgroundColor!=='rgba(0, 0, 0, 0)'?' bg:'+c.backgroundColor:'')+
        (c.borderTopLeftRadius!=='0px'?' r:'+c.borderTopLeftRadius:'')+
        (c.boxShadow!=='none'?' shadow:'+c.boxShadow:'')+
        (c.position!=='static'?' '+c.position:'')+
        (c.overflow!=='visible'?' of:'+c.overflow:'')+
        (el.childNodes.length&&[...el.childNodes].some(n=>n.nodeType===3&&n.nodeValue.trim())?' TEXT('+c.fontSize+'/'+c.lineHeight+' w'+c.fontWeight+' '+c.color+')':''));
    }
    for(const k of el.children) walk(k,d+1);
  };
  const nav=document.querySelector('nav');
  walk(nav,0);
  return out.join('\\n');
})()`));
console.log('\n=== page scroll locked? body overflow ===');
console.log(await s.eval(`getComputedStyle(document.body).overflow + ' | html: ' + getComputedStyle(document.documentElement).overflow`));
s.close(); proc.kill('SIGKILL'); process.exit(0);
