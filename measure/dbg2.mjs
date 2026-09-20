import { launch, Session } from './cdp.mjs';
import { setTimeout as sleep } from 'node:timers/promises';
const { proc, wsUrl } = await launch({ port: 9980, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
const loaded=new Promise(r=>s.on('Page.loadEventFired',r));
await s.send('Page.navigate',{url:'http://localhost:3111/'});
await Promise.race([loaded,sleep(20000)]); await sleep(3000);
console.log(await s.eval(`(()=>{
  const ws=[...document.querySelectorAll('h1 .reveal-word')];
  return ws.slice(0,4).map((e,i)=>{const c=getComputedStyle(e);
    return i+': --word-index='+c.getPropertyValue('--word-index')+' delay='+c.transitionDelay+' dur='+c.transitionDuration+' op='+c.opacity+' tf='+c.transform;
  }).join('\\n');
})()`));
console.log('\nwrapper span tag/display:', await s.eval(`(()=>{const w=document.querySelector('h1 [data-revealed]');return w?w.tagName+' display:'+getComputedStyle(w).display+' revealed:'+w.getAttribute('data-revealed'):'none'})()`));
console.log('h1 direct children tags:', await s.eval(`[...document.querySelector('h1').children].map(c=>c.tagName+'.'+c.className).slice(0,3).join(' | ')`));
s.close(); proc.kill('SIGKILL'); process.exit(0);
