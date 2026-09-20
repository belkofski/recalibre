import { launch, Session } from './cdp.mjs';
import { setTimeout as sleep } from 'node:timers/promises';
const { proc, wsUrl } = await launch({ port: 9340, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
await s.send('Emulation.setDeviceMetricsOverride', { width:1440, height:900, deviceScaleFactor:1, mobile:false });
const loaded = new Promise(r=>s.on('Page.loadEventFired', r));
await s.send('Page.navigate', { url:'https://elytetemplate.framer.website/' });
await Promise.race([loaded, sleep(30000)]); await sleep(3000);
// bring marquee into view
await s.eval('window.scrollTo(0,700)'); await sleep(2500);

console.log('--- MARQUEE: sample ul transform over 3s ---');
const samples = await s.eval(`(async()=>{
  const uls=[...document.querySelectorAll('ul')].filter(u=>getComputedStyle(u).transform!=='none');
  const out=[];
  for(let i=0;i<7;i++){
    out.push({t:performance.now(), tf:uls.map(u=>getComputedStyle(u).transform), w:uls.map(u=>u.getBoundingClientRect().width)});
    await new Promise(r=>setTimeout(r,500));
  }
  return JSON.stringify({n:uls.length, out});
})()`);
const p = JSON.parse(samples);
console.log('ul count with transform:', p.n);
const xs = p.out.map(o=>({t:o.t, x:o.tf.map(t=>+(t.match(/matrix\(1, 0, 0, 1, (-?[\d.]+)/)?.[1]??NaN))}));
for (let i=1;i<xs.length;i++){
  const dt=(xs[i].t-xs[i-1].t)/1000;
  console.log(`  dt=${dt.toFixed(3)}s  dx=${xs[i].x.map((v,j)=>(v-xs[i-1].x[j]).toFixed(2)).join(' , ')}  => px/s ${xs[i].x.map((v,j)=>((v-xs[i-1].x[j])/dt).toFixed(1)).join(' , ')}`);
}
console.log('  widths:', p.out[0].w.join(' , '));

console.log('\n--- MARQUEE structure: li count, unique srcs ---');
console.log(await s.eval(`(()=>{const uls=[...document.querySelectorAll('ul')].filter(u=>getComputedStyle(u).transform!=='none');
 return uls.map(u=>{const lis=[...u.children];return 'li='+lis.length+' srcs='+[...new Set(lis.map(l=>l.querySelector('img')?.getAttribute('src')?.split('/').pop().split('?')[0]))].length+' gap='+getComputedStyle(u).columnGap}).join(' | ')})()`));

console.log('\n--- HOVER: card arrow duplicate nodes (measure both offsets) ---');
console.log(await s.eval(`(()=>{
  const out=[];
  document.querySelectorAll('a').forEach(a=>{
    const sq=[...a.querySelectorAll('div')].filter(d=>{const c=getComputedStyle(d);return c.aspectRatio==='1 / 1'&&c.backgroundColor!=='rgba(0, 0, 0, 0)'});
    if(sq.length>=2){const r=a.getBoundingClientRect();
      out.push('a@'+Math.round(r.top+scrollY)+' squares:'+sq.map(d=>{const c=getComputedStyle(d),b=d.getBoundingClientRect();
      return Math.round(b.width)+'x'+Math.round(b.height)+' pos:'+c.position+' t'+c.top+' l'+c.left+' bg'+c.backgroundColor}).join(' ;; '));}
  });
  return out.slice(0,6).join('\\n');
})()`));

console.log('\n--- BACKDROP-FILTER elements ---');
console.log(await s.eval(`(()=>[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).backdropFilter!=='none').map(e=>{const c=getComputedStyle(e),b=e.getBoundingClientRect();return e.tagName+' '+Math.round(b.width)+'x'+Math.round(b.height)+' y'+Math.round(b.top+scrollY)+' bdf:'+c.backdropFilter+' bg:'+c.backgroundColor+' r:'+c.borderTopLeftRadius}).join('\\n'))()`));

console.log('\n--- FOCUS-VISIBLE ring ---');
console.log(await s.eval(`(()=>{const a=document.querySelector('a[href="./contact"]');if(!a)return 'no link';a.focus();const c=getComputedStyle(a);
 return 'outline:'+c.outline+' offset:'+c.outlineOffset+' color:'+c.outlineColor+' width:'+c.outlineWidth+' style:'+c.outlineStyle+' shadow:'+c.boxShadow})()`));
s.close(); proc.kill('SIGKILL'); process.exit(0);
