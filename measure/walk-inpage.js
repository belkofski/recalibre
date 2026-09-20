(() => {
  const out = [];
  const sy = window.scrollY, sx = window.scrollX;
  function ownText(el) {
    let t = '';
    for (const n of el.childNodes) if (n.nodeType === 3) t += n.nodeValue;
    return t.replace(/\s+/g, ' ').trim();
  }
  function walk(el, depth, path) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const tag = el.tagName.toLowerCase();
    const rec = {
      path, tag, depth,
      id: el.id || '',
      cls: (typeof el.className === 'string' ? el.className : '') || '',
      x: +(r.left + sx).toFixed(2), y: +(r.top + sy).toFixed(2),
      w: +r.width.toFixed(2), h: +r.height.toFixed(2),
      display: cs.display, flexDirection: cs.flexDirection, flexWrap: cs.flexWrap,
      alignItems: cs.alignItems, justifyContent: cs.justifyContent, flex: cs.flex,
      gap: cs.gap, rowGap: cs.rowGap, columnGap: cs.columnGap,
      gridTemplateColumns: cs.gridTemplateColumns, gridTemplateRows: cs.gridTemplateRows,
      gridAutoFlow: cs.gridAutoFlow, gridColumn: cs.gridColumn, gridRow: cs.gridRow,
      paddingTop: cs.paddingTop, paddingRight: cs.paddingRight, paddingBottom: cs.paddingBottom, paddingLeft: cs.paddingLeft,
      marginTop: cs.marginTop, marginRight: cs.marginRight, marginBottom: cs.marginBottom, marginLeft: cs.marginLeft,
      cssWidth: cs.width, cssHeight: cs.height, minWidth: cs.minWidth, maxWidth: cs.maxWidth,
      minHeight: cs.minHeight, maxHeight: cs.maxHeight,
      fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight,
      fontStyle: cs.fontStyle, letterSpacing: cs.letterSpacing, lineHeight: cs.lineHeight,
      textTransform: cs.textTransform, textAlign: cs.textAlign, textDecorationLine: cs.textDecorationLine,
      color: cs.color, fontVariationSettings: cs.fontVariationSettings, whiteSpace: cs.whiteSpace,
      backgroundColor: cs.backgroundColor, backgroundImage: cs.backgroundImage,
      backgroundSize: cs.backgroundSize, backgroundPosition: cs.backgroundPosition, backgroundRepeat: cs.backgroundRepeat,
      radiusTL: cs.borderTopLeftRadius, radiusTR: cs.borderTopRightRadius,
      radiusBR: cs.borderBottomRightRadius, radiusBL: cs.borderBottomLeftRadius,
      borderTop: cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor,
      borderRight: cs.borderRightWidth + ' ' + cs.borderRightStyle + ' ' + cs.borderRightColor,
      borderBottom: cs.borderBottomWidth + ' ' + cs.borderBottomStyle + ' ' + cs.borderBottomColor,
      borderLeft: cs.borderLeftWidth + ' ' + cs.borderLeftStyle + ' ' + cs.borderLeftColor,
      boxShadow: cs.boxShadow, opacity: cs.opacity,
      position: cs.position, top: cs.top, right: cs.right, bottom: cs.bottom, left: cs.left,
      zIndex: cs.zIndex, overflow: cs.overflowX + ' ' + cs.overflowY,
      objectFit: cs.objectFit, objectPosition: cs.objectPosition, aspectRatio: cs.aspectRatio,
      transform: cs.transform, transformOrigin: cs.transformOrigin, willChange: cs.willChange,
      transitionProperty: cs.transitionProperty, transitionDuration: cs.transitionDuration,
      transitionTimingFunction: cs.transitionTimingFunction, transitionDelay: cs.transitionDelay,
      animationName: cs.animationName, animationDuration: cs.animationDuration,
      animationTimingFunction: cs.animationTimingFunction, animationIterationCount: cs.animationIterationCount,
      animationDirection: cs.animationDirection,
      backdropFilter: cs.backdropFilter, filter: cs.filter, mixBlendMode: cs.mixBlendMode,
      cursor: cs.cursor, visibility: cs.visibility,
      text: ownText(el)
    };
    if (tag === 'img') {
      rec.img = {
        currentSrc: el.currentSrc, src: el.getAttribute('src') || '',
        srcset: el.getAttribute('srcset') || '', sizes: el.getAttribute('sizes') || '',
        alt: el.getAttribute('alt') || '', loading: el.getAttribute('loading') || '',
        naturalWidth: el.naturalWidth, naturalHeight: el.naturalHeight,
        attrW: el.getAttribute('width') || '', attrH: el.getAttribute('height') || ''
      };
    }
    if (tag === 'a') rec.href = el.getAttribute('href') || '';
    if (['svg','path','use','circle','rect','line','polyline','polygon','g','defs','clippath','lineargradient','stop'].includes(tag)) {
      rec.svgAttrs = {};
      for (const a of el.attributes) rec.svgAttrs[a.name] = a.value;
    }
    out.push(rec);
    // CRITICAL: recurse regardless of zero size (display:contents, collapsed wrappers)
    let i = 0;
    for (const c of el.children) walk(c, depth + 1, path + '/' + c.tagName.toLowerCase() + '[' + (i++) + ']');
  }
  walk(document.body, 0, 'body');
  const fonts = [];
  try { document.fonts.forEach(f => fonts.push(f.family + '|' + f.weight + '|' + f.style + '|' + f.status)); } catch (e) {}
  return JSON.stringify({
    url: location.href,
    viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio },
    docHeight: document.documentElement.scrollHeight,
    htmlBg: getComputedStyle(document.documentElement).backgroundColor,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    fonts: [...new Set(fonts)],
    count: out.length,
    nodes: out
  });
})()
