import { launch, Session } from './cdp.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
const WALK = readFileSync('./walk-inpage.js','utf8');
const { proc, wsUrl } = await launch({ port: 9360, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable'); await s.send('Input.enable').catch(()=>{});
await s.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
const loaded=new Promise(r=>s.on('Page.loadEventFired',r));
await s.send('Page.navigate',{url:'https://elytetemplate.framer.website/'});
await Promise.race([loaded,sleep(30000)]); await sleep(3000);
// full crawl so everything mounts
for(let y=0;y<10200;y+=400){ await s.eval(`window.scrollTo(0,${y})`); await sleep(90); }
await s.eval('window.scrollTo(0,0)'); await sleep(1800);

async function hoverAt(x,y){
  await s.send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y,buttons:0});
  await sleep(1400);
}
// 1) mega-menu: hover the "Services" nav item (measured centre x ~640, y ~43)
await hoverAt(640, 43);
const megaOpen = await s.eval(`(()=>{
  const ps=[...document.querySelectorAll('nav p')].filter(p=>p.textContent.trim()==='Services');
  const panel = ps.map(p=>p.closest('div[class]')).map(d=>d&&d.parentElement).filter(Boolean);
  const all=[...document.querySelectorAll('nav div')].filter(d=>{const c=getComputedStyle(d);const b=d.getBoundingClientRect();
    return b.width>140 && b.height>60 && c.position==='absolute';});
  return all.map(d=>{const c=getComputedStyle(d),b=d.getBoundingClientRect();
    return \`\${Math.round(b.width)}x\${Math.round(b.height)} y\${(b.top+scrollY).toFixed(2)} x\${b.left.toFixed(2)} op:\${c.opacity} tf:\${c.transform} bg:\${c.backgroundColor} pad:\${c.paddingTop} \${c.paddingRight} \${c.paddingBottom} \${c.paddingLeft} gap:\${c.rowGap}/\${c.columnGap} shadow:\${c.boxShadow} r:\${c.borderTopLeftRadius} of:\${c.overflow}\`;}).join('\\n');
})()`);
console.log('=== NAV: absolute panels while hovering Services ===');
console.log(megaOpen);
console.log('\n=== NAV: dropdown link rows (open) ===');
console.log(await s.eval(`(()=>[...document.querySelectorAll('nav a')].map(a=>{const b=a.getBoundingClientRect(),c=getComputedStyle(a);
 return \`\${a.textContent.trim().slice(0,26).padEnd(28)} \${b.width.toFixed(2)}x\${b.height.toFixed(2)} y\${(b.top+scrollY).toFixed(2)} x\${b.left.toFixed(2)} op:\${c.opacity} gap:\${c.columnGap} pad:\${c.paddingTop} \${c.paddingLeft}\`}).join('\\n'))()`));

// 2) hero primary button hover — capture BOTH arrow squares' offsets
await hoverAt(217, 755);
console.log('\n=== HERO primary button, HOVERED: both arrow nodes ===');
console.log(await s.eval(`(()=>{const a=[...document.querySelectorAll('a')].find(x=>x.textContent.includes('Book a Call'));
 if(!a) return 'not found';
 const sq=[...a.querySelectorAll('div')].filter(d=>getComputedStyle(d).aspectRatio==='1 / 1');
 const r=a.getBoundingClientRect();
 return 'button '+r.width.toFixed(2)+'x'+r.height.toFixed(2)+' bg:'+getComputedStyle(a).backgroundColor+'\\n'+
  sq.map(d=>{const c=getComputedStyle(d),b=d.getBoundingClientRect();
  return '  sq '+b.width.toFixed(1)+'x'+b.height.toFixed(1)+' pos:'+c.position+' t'+c.top+' l'+c.left+' tf:'+c.transform+' bg:'+c.backgroundColor+' rel@'+(b.left-r.left).toFixed(2)+','+(b.top-r.top).toFixed(2)}).join('\\n');})()`));

// 3) card hover in the grid section (y~2440) — the two-arrow slide
await s.eval('window.scrollTo(0,2100)'); await sleep(1200);
await hoverAt(320, 500);
console.log('\n=== GRID CARD, HOVERED ===');
console.log(await s.eval(`(()=>{const out=[];
 document.querySelectorAll('a').forEach(a=>{const r=a.getBoundingClientRect();
  if(r.top<0||r.top>900||r.width<200)return;
  const sq=[...a.querySelectorAll('div')].filter(d=>getComputedStyle(d).aspectRatio==='1 / 1');
  if(!sq.length)return;
  out.push('a '+r.width.toFixed(1)+'x'+r.height.toFixed(1)+' y'+(r.top+scrollY).toFixed(1)+'\\n'+sq.map(d=>{const c=getComputedStyle(d),b=d.getBoundingClientRect();
   return '  sq pos:'+c.position+' t'+c.top+' l'+c.left+' tf:'+c.transform+' bg:'+c.backgroundColor+' rel@'+(b.left-r.left).toFixed(2)+','+(b.top-r.top).toFixed(2)}).join('\\n'));});
 return out.slice(0,3).join('\\n');})()`));
s.close(); proc.kill('SIGKILL'); process.exit(0);
