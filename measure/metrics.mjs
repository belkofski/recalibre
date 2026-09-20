import { launch, Session } from './cdp.mjs';
import { setTimeout as sleep } from 'node:timers/promises';
const { proc, wsUrl } = await launch({ port: 9370, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
const loaded = new Promise(r=>s.on('Page.loadEventFired', r));
await s.send('Page.navigate',{url:'http://localhost:3111/'});
await Promise.race([loaded, sleep(20000)]); await sleep(2500);
await s.eval('document.fonts.ready.then(()=>1)');
// Measure advance width of a neutral filler word set at each measured type role.
const out = await s.eval(`(()=>{
  const roles = [
    ['h1',   '72px','79.2px','400','-4.32px'],
    ['h2',   '52px','57.2px','400','-3.12px'],
    ['h3-24','24px','28.8px','400','-0.96px'],
    ['h4-20','20px','24px',  '400','-0.4px'],
    ['lead', '18px','25.2px','400','normal'],
    ['body', '16px','24px',  '400','normal'],
    ['small','14px','19.6px','400','normal'],
  ];
  const probe = document.createElement('span');
  probe.style.position='absolute'; probe.style.visibility='hidden'; probe.style.whiteSpace='nowrap';
  probe.style.fontFamily=getComputedStyle(document.querySelector('h1')).fontFamily;
  document.body.appendChild(probe);
  const WORD='Placeholder content sized to the measured box ';
  const res = {};
  for (const [name,fs,lh,fw,ls] of roles) {
    probe.style.fontSize=fs; probe.style.lineHeight=lh; probe.style.fontWeight=fw; probe.style.letterSpacing=ls;
    probe.textContent = WORD.repeat(4);
    const w = probe.getBoundingClientRect().width;
    res[name] = { perChar: +(w / (WORD.length*4)).toFixed(3), fs, ls };
  }
  probe.remove();
  return JSON.stringify(res);
})()`);
const m = JSON.parse(out);
console.log('Geist advance width per char, for the neutral filler string:');
for (const [k,v] of Object.entries(m)) console.log(`  ${k.padEnd(7)} ${String(v.fs).padStart(5)} ls ${String(v.ls).padStart(8)}  ${v.perChar} px/char`);
console.log('\nchars per line for the measured wrap widths:');
const boxes = [
  ['hero h1 764', 764, 'h1'], ['pillars h2 560', 560, 'h2'], ['services h2 696', 696, 'h2'],
  ['framework h2 744', 744, 'h2'], ['cases h2 744', 744, 'h2'], ['approach h2 594', 594, 'h2'],
  ['testimonials h2 774', 774, 'h2'], ['faq h2 494', 494, 'h2'], ['footer h2 576', 576, 'h2'],
  ['hero sub 540', 540, 'lead'], ['footer lead 480', 480, 'lead'], ['approach num 270', 270, 'lead'],
  ['card body 380', 380, 'body'], ['step body 346', 346, 'body'], ['plate body 410', 410, 'body'],
  ['faq body 554', 554, 'body'], ['approach body 550', 550, 'body'], ['pillars body 560', 560, 'body'],
  ['quote 316 (24px)', 316, 'h3-24'], ['faq q 520 (20px)', 520, 'h4-20'],
  ['address 160', 160, 'small'], ['strap 575', 575, 'small'], ['consent 678', 678, 'small'],
];
for (const [label, w, role] of boxes)
  console.log(`  ${label.padEnd(20)} ${String(Math.floor(w / m[role].perChar)).padStart(4)} chars/line`);
s.close(); proc.kill('SIGKILL'); process.exit(0);
