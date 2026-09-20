/**
 * Generates the content filler by MEASURING the wrap, not estimating it.
 * For each slot we know, from the reference, the box width, the type role and
 * how many lines it runs. This binary-searches the filler length that produces
 * exactly that many lines in a real layout, then writes the strings out.
 */
import { launch, Session } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

// key, label, boxWidth, fontSize, lineHeight, fontWeight, letterSpacing, lines
const SLOTS = [
  ['heroHeadline', '[HEADLINE]', 764, 72, 79.2, 400, '-4.32px', 2],
  ['heroSub', '[SUB]', 540, 18, 25.2, 400, 'normal', 2],
  ['heroStrapL', '[STRAP L]', 575, 14, 19.6, 400, 'normal', 1],
  ['heroStrapR', '[STRAP R]', 575, 14, 19.6, 400, 'normal', 1],
  ['pillarsHeading', '[HEADING]', 560, 52, 57.2, 400, '-3.12px', 2],
  ['pillarsItemTitle', '[ITEM]', 560, 20, 24, 400, '-0.4px', 1],
  ['pillarsItemBody', '[BODY]', 560, 16, 24, 400, 'normal', 1],
  ['pillarsCardName', '[NAME]', 275.89, 20, 24, 400, '-0.4px', 1],
  ['pillarsCardRole', '[ROLE]', 275.89, 12, 16.8, 500, '0.72px', 1],
  ['servicesHeading', '[HEADING]', 696, 52, 57.2, 400, '-3.12px', 2],
  ['servicesCardTitle', '[CARD]', 332, 24, 28.8, 400, '-0.96px', 1],
  ['servicesCardBody', '[BODY]', 380, 16, 24, 400, 'normal', 2],
  ['frameworkHeading', '[HEADING]', 744, 52, 57.2, 400, '-3.12px', 2],
  ['frameworkStepTitle', '[STEP]', 346, 20, 24, 400, '-0.4px', 1],
  ['frameworkStepBody', '[BODY]', 346, 16, 24, 400, 'normal', 3],
  ['casesHeading', '[HEADING]', 744, 52, 57.2, 400, '-3.12px', 2],
  ['casesPlateTitle', '[PLATE]', 410, 24, 28.8, 400, '-0.96px', 1],
  ['casesPlateBody', '[BODY]', 410, 16, 24, 400, 'normal', 8],
  ['approachHeading', '[HEADING]', 550, 52, 57.2, 400, '-3.12px', 3],
  ['approachRowTitle', '[ROW]', 270, 24, 28.8, 400, '-0.96px', 1],
  ['approachRowBody', '[BODY]', 550, 16, 24, 400, 'normal', 5],
  ['approachCardCta', '[CARD CTA]', 212, 16, 22.4, 500, 'normal', 1],
  ['testimonialsHeading', '[HEADING]', 774, 52, 57.2, 400, '-3.12px', 2],
  ['testimonialQuote', '[QUOTE]', 316, 24, 28.8, 400, '-0.96px', 5],
  ['testimonialQuote3', '[QUOTE]', 316, 24, 28.8, 400, '-0.96px', 3],
  ['testimonialName', '[NAME]', 296, 20, 24, 400, '-0.4px', 1],
  ['testimonialRole', '[ROLE]', 296, 12, 16.8, 500, '0.72px', 1],
  ['videoLabel', '[PLAY]', 316, 16, 24, 600, 'normal', 1],
  ['videoMeta', '[LENGTH]', 316, 14, 19.6, 400, 'normal', 1],
  ['faqHeading', '[HEADING]', 494, 52, 57.2, 400, '-3.12px', 2],
  ['faqQ1', '[Q1]', 520, 20, 24, 400, '-0.4px', 2],
  ['faqQ2', '[Q2]', 520, 20, 24, 400, '-0.4px', 1],
  ['faqQ3', '[Q3]', 520, 20, 24, 400, '-0.4px', 2],
  ['faqQ4', '[Q4]', 520, 20, 24, 400, '-0.4px', 2],
  ['faqQ5', '[Q5]', 520, 20, 24, 400, '-0.4px', 1],
  ['faqAnswer', '[ANSWER]', 554, 16, 24, 400, 'normal', 6],
  ['faqCardTitle', '[CARD TITLE]', 454, 16, 22.4, 500, 'normal', 1],
  ['faqCardSub', '[CARD SUB]', 454, 14, 19.6, 400, 'normal', 1],
  ['footerHeading', '[HEADING]', 576, 52, 57.2, 400, '-3.12px', 2],
  ['footerLead', '[LEAD]', 480, 18, 25.2, 400, 'normal', 3],
  ['footerSignupLabel', '[SIGN UP]', 171.7, 20, 24, 400, '-0.4px', 1],
  ['footerConsent', '[CONSENT]', 678.3, 14, 19.6, 400, 'normal', 1, ' [PRIVACY POLICY]'],
  ['footerCardCta', '[CARD CTA]', 212, 16, 22.4, 500, 'normal', 1],
  ['footerAddress', '[ADDRESS]', 160, 14, 19.6, 400, 'normal', 3],
  ['footerCopyright', '[COPYRIGHT]', 521.48, 14, 19.6, 400, 'normal', 1],
  ['footerCredit', '[CREDIT]', 521.5, 14, 19.6, 400, 'normal', 1, ' [CREDIT]'],
  ['megaTitle', '[MEGA]', 666, 16, 24, 500, 'normal', 1],
  ['megaItemTitle', '[ITEM]', 606, 16, 17.6, 500, '-0.32px', 1],
  ['megaItemBody', '[ITEM BODY]', 606, 14, 19.6, 400, 'normal', 1],
  ['megaFeatureTitle', '[FEATURE]', 372, 24, 28.8, 400, '-0.96px', 1],
  ['megaFeatureBody', '[FEATURE BODY]', 372, 14, 19.6, 400, 'normal', 3],
];

// key, label, targetWidthPx, fontSize, lineHeight, fontWeight, letterSpacing
// These are single-line labels whose measured WIDTH sets the width of the button,
// column or row around them. Fitting the text to the measured px width is what makes
// the surrounding boxes land on the reference's geometry.
const WIDTH_SLOTS = [
  ['heroPrimaryCta',   '[CTA]',      85.06, 16, 22.4, 500, 'normal'],
  ['heroSecondaryCta', '[CTA 2]',   139.22, 16, 22.4, 500, 'normal'],
  ['navLink1',         '[A]',        40.70, 15, 21, 500, '-0.3px'],
  ['navLink2',         '[B]',        58.47, 15, 21, 500, '-0.3px'],
  ['navLink3',         '[C]',        87.14, 15, 21, 500, '-0.3px'],
  ['navLink4',         '[D]',        53.50, 15, 21, 500, '-0.3px'],
  ['navSub1',          '[SUB 1]',   116.48, 14, 19.6, 400, 'normal'],
  ['navSub2',          '[SUB 2]',   119.94, 14, 19.6, 400, 'normal'],
  ['navSub3',          '[SUB 3]',   155.89, 14, 19.6, 400, 'normal'],
  ['navCta',           '[CTA]',      85.06, 16, 22.4, 500, 'normal'],
  ['pillarsCardCta',   '[LINK]',    106.11, 16, 22.4, 500, 'normal'],
  ['casesLink',        '[LINK]',    104.73, 16, 17.6, 500, 'normal'],
  ['footerSignupLabel2','[SIGN UP]',171.70, 20, 24, 400, '-0.4px'],
  ['footerLink1',      '[1]',        37.70, 14, 19.6, 400, 'normal'],
  ['footerLink2',      '[2]',        38.30, 14, 19.6, 400, 'normal'],
  ['footerLink3',      '[3]',        84.28, 14, 19.6, 400, 'normal'],
  ['footerLink4',      '[4]',        50.64, 14, 19.6, 400, 'normal'],
  ['footerLink5',      '[5]',        50.89, 14, 19.6, 400, 'normal'],
  ['footerLegal1',     '[LEGAL 1]',  88.64, 14, 19.6, 400, 'normal'],
  ['footerLegal2',     '[LEGAL 2]', 122.55, 14, 19.6, 400, 'normal'],
  ['footerLinksLabel', '[L]',        38.05, 12, 16.8, 600, '0.72px'],
  ['footerLegalLabel', '[LG]',       41.61, 12, 16.8, 600, '0.72px'],
  ['footerCreditLink', '[C]',        31.47, 14, 19.6, 400, 'normal'],
];

const { proc, wsUrl } = await launch({ port: 9380, width: 1440, height: 900 });
const s = await Session.connect(wsUrl);
await s.attachToPage(); await s.send('Page.enable'); await s.send('Runtime.enable');
const loaded = new Promise(r => s.on('Page.loadEventFired', r));
await s.send('Page.navigate', { url: 'http://localhost:3111/' });
await Promise.race([loaded, sleep(20000)]);
await sleep(2500);
await s.eval('document.fonts.ready.then(()=>1)');

const json = await s.eval(`(() => {
  const FILLER = 'placeholder copy sized to the measured box so the layout can be verified against the reference without borrowing its words and it keeps running for as long as the box needs ';
  const build = (label, n) => {
    let t = label;
    while (t.length < n) t += ' ' + FILLER.slice(0, Math.min(FILLER.length, n - t.length));
    return t.slice(0, n).replace(/\\s\\S*$/, '').trimEnd() || label;
  };
  const box = document.createElement('div');
  box.style.position = 'absolute'; box.style.visibility = 'hidden'; box.style.left = '-9999px';
  box.style.whiteSpace = 'pre-wrap';
  box.style.fontFamily = getComputedStyle(document.querySelector('h1')).fontFamily;
  document.body.appendChild(box);
  const SLOTS = ${JSON.stringify(SLOTS)};
  const out = {};
  for (const [key, label, w, fs, lh, fw, ls, lines, suffix] of SLOTS) {
    box.style.width = w + 'px';
    box.style.fontSize = fs + 'px';
    box.style.lineHeight = lh + 'px';
    box.style.fontWeight = String(fw);
    box.style.letterSpacing = ls;
    const tail = suffix || '';
    const linesOf = (txt) => { box.textContent = txt + tail; return Math.round(box.getBoundingClientRect().height / lh); };
    // grow until we exceed, then step back to the longest string still at target
    let lo = label.length, hi = label.length;
    while (linesOf(build(label, hi)) <= lines && hi < 4000) hi = Math.ceil(hi * 1.6) + 8;
    // binary search the largest n with linesOf === lines
    let best = null;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const t = build(label, mid);
      if (linesOf(t) <= lines) { best = t; lo = mid + 1; } else { hi = mid - 1; }
    }
    const final = best ?? label;
    out[key] = { text: final, lines: linesOf(final), target: lines, w, fs };
  }
  // width-fitted single-line labels: grow/shrink until the inline width is as
  // close as possible to the measured target without exceeding it
  const probe = document.createElement('span');
  probe.style.position='absolute'; probe.style.visibility='hidden'; probe.style.left='-9999px';
  probe.style.whiteSpace='pre';
  probe.style.fontFamily = getComputedStyle(document.querySelector('h1')).fontFamily;
  document.body.appendChild(probe);
  const WSLOTS = ${JSON.stringify(WIDTH_SLOTS)};
  for (const [key, label, targetW, fs, lh, fw, ls] of WSLOTS) {
    probe.style.fontSize = fs + 'px'; probe.style.lineHeight = lh + 'px';
    probe.style.fontWeight = String(fw); probe.style.letterSpacing = ls;
    const widthOf = (txt) => { probe.textContent = txt; return probe.getBoundingClientRect().width; };
    // candidates: the bare label, then the label padded with filler, char by char
    // Fit the text to the measured pixel width. Padding with whole characters can
    // only land within about half a character of the target, so the search also
    // varies WHICH characters are used: every start offset into the filler gives a
    // different mix of narrow and wide glyphs at the same length. That gets the
    // rendered width to well under a pixel of the reference's.
    let best = label, bestErr = Math.abs(widthOf(label) - targetW);
    const consider = (t) => {
      const err = Math.abs(widthOf(t) - targetW);
      if (err < bestErr) { bestErr = err; best = t; }
    };
    // A trailing space has no advance width, so candidates must end on a glyph.
    // NARROW gives fine steps (i, l, . are ~3px at 12px) where the filler's
    // letters would overshoot the target.
    const NARROW = 'il.,';
    for (let n = 3; n <= label.length + 120; n++) {
      for (let k = 0; k < 40; k++) {
        let t = label + ' ';
        let i = k;
        while (t.length < n) { t += FILLER[i % FILLER.length]; i++; }
        consider(t.slice(0, n).replace(/\s+$/, ''));
      }
    }
    // fine tune: label + a short run of narrow glyphs
    for (const ch of NARROW) {
      // with and without a separating space: a space costs an advance of its own,
      // which can already overshoot a small target
      let a = label + ' ', b = label;
      for (let r = 0; r < 8; r++) { a += ch; b += ch; consider(a); consider(b); }
    }
    out[key] = { text: best, width: +widthOf(best).toFixed(2), target: targetW, w: targetW, fs, lines: 1, target_lines: 1 };
  }
  probe.remove();
  box.remove();
  return JSON.stringify(out);
})()`);

const res = JSON.parse(json);
let ok = 0, bad = 0;
const lines = [];
let wOk = 0, wErr = 0;
for (const [k, v] of Object.entries(res)) {
  if (v.width !== undefined) {
    const err = Math.abs(v.width - v.target);
    wOk++; wErr = Math.max(wErr, err);
    if (err > 1.0) console.log(`  WIDTH ${k}: ${v.width} vs ${v.target} (Δ ${err.toFixed(2)}px)`);
  } else {
    const hit = v.lines === v.target;
    hit ? ok++ : bad++;
    if (!hit) console.log(`  MISS ${k}: got ${v.lines} want ${v.target} (box ${v.w} @ ${v.fs}px)`);
  }
  lines.push(`  ${k}: ${JSON.stringify(v.text)},`);
}
console.log(`line-count slots: ${ok} on target, ${bad} missed`);
console.log(`width-fitted slots: ${wOk}, worst width error ${wErr.toFixed(2)}px`);

writeFileSync('../src/lib/slots.generated.ts',
`/* GENERATED by measure/gen-slots.mjs — do not hand-edit.
 *
 * Neutral filler, sized by MEASURING the wrap in a real layout at the
 * reference's box width and type role, so each slot occupies exactly the
 * number of lines the reference measures there. None of the reference's words
 * are used; replace these strings with your own copy.
 *
 * slot: box width x line count @ type role
${Object.entries(res).map(([k,v])=>v.width!==undefined
  ? ` *   ${k.padEnd(20)} fitted to ${String(v.target).padStart(7)}px wide  (got ${v.width}) @ ${v.fs}px`
  : ` *   ${k.padEnd(20)} ${String(v.w).padStart(7)}px x ${v.target} line(s) @ ${v.fs}px`).join('\n')}
 */
export const SLOT_TEXT = {
${lines.join('\n')}
} as const;

export type SlotKey = keyof typeof SLOT_TEXT;
`);
console.log('wrote src/lib/slots.generated.ts');
s.close(); proc.kill('SIGKILL'); process.exit(0);
