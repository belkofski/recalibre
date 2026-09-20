// Minimal PNG writer (no deps). Flat neutral placeholder plates at exact
// measured natural dimensions so naturalWidth/naturalHeight diff to zero.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
const crcTable = (() => { const t=[]; for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;} return t; })();
const crc32 = buf => { let c=0xffffffff; for(const b of buf) c=crcTable[(c^b)&0xff]^(c>>>8); return (c^0xffffffff)>>>0; };
const chunk = (type, data) => {
  const len=Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td=Buffer.concat([Buffer.from(type,'ascii'), data]);
  const crc=Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
function png(w, h, rgb, stripe) {
  const ihdr=Buffer.alloc(13);
  ihdr.writeUInt32BE(w,0); ihdr.writeUInt32BE(h,4);
  ihdr[8]=8; ihdr[9]=2; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0; // 8-bit truecolour
  const row=Buffer.alloc(1+w*3);
  const raw=Buffer.alloc((1+w*3)*h);
  for (let y=0;y<h;y++){
    row.fill(0);
    for (let x=0;x<w;x++){
      // faint 1px diagonal hatch so a mis-sized plate is visible at a glance
      const on = stripe && ((x+y) % 96 === 0);
      const [r,g,b]= on ? rgb.map(v=>Math.min(255,v+14)) : rgb;
      row[1+x*3]=r; row[2+x*3]=g; row[3+x*3]=b;
    }
    row.copy(raw,(1+w*3)*y);
  }
  return Buffer.concat([
    Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw,{level:9})), chunk('IEND', Buffer.alloc(0)),
  ]);
}
// slot name -> [naturalW, naturalH, rgb, stripe]
const DARK=[26,34,39], MID=[58,66,72], LIGHT=[214,216,219], PLATE=[232,233,236];
const slots = {
  'logo-wordmark':      [304, 94,  LIGHT, false],
  'icon-a':             [35,  35,  MID,   false],
  'icon-b':             [38,  38,  MID,   false],
  'icon-c':             [34,  36,  MID,   false],
  'nav-feature':        [420, 556, MID,   true ],
  'hero':               [1440,919, DARK,  true ],
  'client-1':           [296, 72,  LIGHT, false],
  'client-2':           [248, 72,  LIGHT, false],
  'client-3':           [294, 72,  LIGHT, false],
  'client-4':           [272, 72,  LIGHT, false],
  'about-portrait':     [560, 564, MID,   true ],
  'avatar-round':       [59,  59,  LIGHT, false],
  'case-1':             [384, 568, MID,   true ],
  'case-2':             [383, 287, MID,   true ],
  'case-3':             [383, 255, MID,   true ],
  'wide-1':             [1160,671, DARK,  true ],
  'badge-wide':         [94,  24,  LIGHT, false],
  'wide-2':             [1160,773, DARK,  true ],
  'logo-strip-a':       [203, 48,  LIGHT, false],
  'team-portrait':      [380, 503, MID,   true ],
  'avatar-tall':        [60,  90,  LIGHT, false],
  'logo-strip-b':       [197, 48,  LIGHT, false],
  'footer-plate':       [1440,1174,DARK,  true ],
  'social-1':           [15,  14,  LIGHT, false],
  'social-2':           [15,  15,  LIGHT, false],
  'social-3':           [15,  15,  LIGHT, false],
  'cta-portrait':       [554, 646, MID,   true ],
};
mkdirSync('../public/img', { recursive: true });
let total=0;
for (const [name,[w,h,rgb,stripe]] of Object.entries(slots)) {
  const buf=png(w,h,rgb,stripe);
  writeFileSync(`../public/img/${name}.png`, buf);
  total+=buf.length;
  console.log(`${name.padEnd(18)} ${w}x${h}  ${(buf.length/1024).toFixed(1)}kB`);
}
console.log(`\n${Object.keys(slots).length} placeholders, ${(total/1024).toFixed(0)}kB total`);
