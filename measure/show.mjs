import { readFileSync } from 'node:fs';
const d = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const only = process.argv[3] || '';
const f = n => {
  const p = [];
  const pad = [n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft];
  const mar = [n.marginTop,n.marginRight,n.marginBottom,n.marginLeft];
  p.push(`${n.display}${n.display.includes('flex')?':'+n.flexDirection+(n.flexWrap!=='nowrap'?'/'+n.flexWrap:''):''}`);
  if (n.display.includes('flex')||n.display.includes('grid')) p.push(`ai:${n.alignItems} jc:${n.justifyContent}`);
  if (n.rowGap!=='normal'&&n.rowGap!=='0px') p.push(`rowGap:${n.rowGap}`);
  if (n.columnGap!=='normal'&&n.columnGap!=='0px') p.push(`colGap:${n.columnGap}`);
  if (n.gridTemplateColumns!=='none') p.push(`cols:[${n.gridTemplateColumns}]`);
  if (n.gridTemplateRows!=='none') p.push(`rows:[${n.gridTemplateRows}]`);
  if (pad.some(v=>v!=='0px')) p.push(`pad:${pad.join(' ')}`);
  if (mar.some(v=>v!=='0px')) p.push(`mar:${mar.join(' ')}`);
  if (n.position!=='static') p.push(`${n.position} t:${n.top} r:${n.right} b:${n.bottom} l:${n.left} z:${n.zIndex}`);
  if (n.maxWidth!=='none') p.push(`maxW:${n.maxWidth}`);
  if (n.flex!=='0 1 auto') p.push(`flex:${n.flex}`);
  if (n.text || n.tag==='p'||n.tag==='h1'||n.tag==='h2'||n.tag==='h3'||n.tag==='h4'||n.tag==='h5'||n.tag==='h6'||n.tag==='span'||n.tag==='a'||n.tag==='li')
    p.push(`FONT ${n.fontFamily.split(',')[0]} ${n.fontSize}/${n.lineHeight} w${n.fontWeight} ls:${n.letterSpacing} ${n.color} ta:${n.textAlign}${n.textTransform!=='none'?' tt:'+n.textTransform:''}${n.whiteSpace!=='normal'?' ws:'+n.whiteSpace:''}${n.fontVariationSettings!=='normal'?' fvs:'+n.fontVariationSettings:''}`);
  if (n.backgroundColor!=='rgba(0, 0, 0, 0)') p.push(`bg:${n.backgroundColor}`);
  if (n.backgroundImage!=='none') p.push(`bgImg:${n.backgroundImage.slice(0,200)}${n.backgroundImage.length>200?'…':''} size:${n.backgroundSize} pos:${n.backgroundPosition}`);
  const rr=[n.radiusTL,n.radiusTR,n.radiusBR,n.radiusBL];
  if (rr.some(v=>v!=='0px')) p.push(`radius:${rr.join(' ')}`);
  for (const [k,side] of [['bt',n.borderTop],['br',n.borderRight],['bb',n.borderBottom],['bl',n.borderLeft]])
    if (!side.startsWith('0px')) p.push(`${k}:${side}`);
  if (n.boxShadow!=='none') p.push(`shadow:${n.boxShadow}`);
  if (n.opacity!=='1') p.push(`op:${n.opacity}`);
  if (n.overflow!=='visible visible') p.push(`of:${n.overflow}`);
  if (n.objectFit!=='fill') p.push(`objFit:${n.objectFit} objPos:${n.objectPosition}`);
  if (n.aspectRatio!=='auto') p.push(`ar:${n.aspectRatio}`);
  if (n.transform!=='none') p.push(`tf:${n.transform} org:${n.transformOrigin}`);
  if (n.transitionDuration!=='0s') p.push(`trans:${n.transitionProperty} ${n.transitionDuration} ${n.transitionTimingFunction} ${n.transitionDelay}`);
  if (n.animationName!=='none') p.push(`anim:${n.animationName} ${n.animationDuration} ${n.animationTimingFunction} x${n.animationIterationCount} ${n.animationDirection}`);
  if (n.backdropFilter!=='none') p.push(`bdf:${n.backdropFilter}`);
  if (n.filter!=='none') p.push(`filter:${n.filter}`);
  if (n.mixBlendMode!=='normal') p.push(`blend:${n.mixBlendMode}`);
  if (n.visibility!=='visible') p.push(`vis:${n.visibility}`);
  if (n.img) p.push(`IMG nat:${n.img.naturalWidth}x${n.img.naturalHeight} loading:${n.img.loading||'-'} sizes:${n.img.sizes||'-'} attr:${n.img.attrW||'-'}x${n.img.attrH||'-'} src:${n.img.currentSrc.slice(0,110)}`);
  if (n.svgAttrs) { const a=n.svgAttrs; p.push(`SVG ${Object.entries(a).filter(([k])=>!['class','style'].includes(k)).map(([k,v])=>k+'='+String(v).slice(0,150)).join(' ')}`); }
  if (n.href) p.push(`href:${n.href}`);
  return p.join('  ');
};
for (const n of d.nodes) {
  if (only && !n.path.startsWith(only)) continue;
  if (n.tag==='script'||n.tag==='style'||n.tag==='link') continue;
  const rel = n.path.slice(d.root.length);
  console.log(`${'·'.repeat(n.depth)}${n.tag} [${rel||'ROOT'}] y${n.y} x${n.x} ${n.w}×${n.h}`);
  const props = f(n); if (props) console.log(`   ${props}`);
  if (n.text) console.log(`   TEXT «${n.text}»`);
}
