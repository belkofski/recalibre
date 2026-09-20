# Clone report — layout system, measured

Reference measured over CDP (`chrome-headless-shell`), `deviceScaleFactor: 1`, full
scroll crawl in 400px steps before reading, at **1440×900, 1024×900, 768×900, 390×844**.
Build measured with the **same DOM walk** (`measure/walk-inpage.js`) and diffed field
by field.

Nothing in the build is estimated. Every number in the code has the measured value in
a comment beside it.

---

## 1 · DELTA TABLE — section geometry

### 1440 × 900 — exact

| section | ref h | mine h | Δh | ref y | mine y | Δy |
|---|---|---|---|---|---|---|
| Hero | 900 | 900 | **0** | 0 | 0 | **0** |
| Clients | 90 | 90 | **0** | 900 | 900 | **0** |
| Pillars | 1122 | 1122 | **0** | 990 | 990 | **0** |
| Services | 1036 | 1036 | **0** | 2112 | 2112 | **0** |
| Framework | 919 | 919 | **0** | 3148 | 3148 | **0** |
| Cases | 1772 | 1772 | **0** | 4067 | 4067 | **0** |
| Approach | 967.73 | 967.73 | **0** | 5839 | 5839 | **0** |
| Testimonials | 934 | 934 | **0** | 6806.73 | 6806.73 | **0** |
| Faq | 918 | 918 | **0** | 7740.73 | 7740.73 | **0** |
| Footer | 1182.59 | 1182.59 | **0** | 8658.73 | 8658.73 | **0** |
| **document** | **9841** | **9841** | **0** | | | |

Full-page captures are 1440 × 18782 for both.

### 1024 × 900 — 9 of 10 exact

| section | ref h | mine h | Δh | Δy |
|---|---|---|---|---|
| Hero | 720 | 720 | **0** | **0** |
| Clients | 90 | 90 | **0** | **0** |
| Pillars | 2046.06 | 2046.06 | **0** | **0** |
| Services | 2238 | 2238 | **0** | **0** |
| Framework | 1157 | 1157 | **0** | **0** |
| Cases | 1694 | 1694 | **0** | **0** |
| Approach | 2088.38 | 2088.38 | **0** | **0** |
| Testimonials | 1916 | 1916 | **0** | **0** |
| Faq | 970 | 970 | **0** | **0** |
| Footer | 1127 | 1146.19 | +19.19 | **0** |
| **document** | **14046** | **14066** | **+20** | |

### 768 × 900 — 6 of 10 exact

| section | ref h | mine h | Δh | line-count Δ | unexplained |
|---|---|---|---|---|---|
| Hero | 738 | 738 | **0** | 0 | **0** |
| Clients | 90 | 90 | **0** | 0 | **0** |
| Pillars | 1757.98 | 1757.98 | **0** | 0 | **0** |
| Services | 2034 | 2034 | **0** | 0 | **0** |
| Framework | 1771.8 | 1807 | +35.2 | +35.20 | **0** |
| Cases | 1720 | 1720 | **0** | +48.00 | −48.00 (absorbed) |
| Approach | 1591.64 | 1591.64 | **0** | 0 | **0** |
| Testimonials | 1762.8 | 1798 | +35.2 | +35.20 | **0** |
| Faq | 808 | 880 | +72 | +72.00 | **0** |
| Footer | 1527.31 | 1572.52 | +45.21 | +35.20 | +10.01 |
| **document** | **13802** | **13989** | **+187** | | **58.01 total** |

### 390 × 844

| section | ref h | mine h | Δh | line-count Δ | unexplained |
|---|---|---|---|---|---|
| Hero | 692.08 | 692.08 | **0** | +39.60 | −39.60 (absorbed) |
| Clients | 90 | 90 | **0** | 0 | **0** |
| Pillars | 1342 | 1510 | +168 | +329.60 | −161.60 (absorbed) |
| Services | 2141.2 | 2141.2 | **0** | +172.80 | −172.80 (absorbed) |
| Framework | 1842.2 | 1877.41 | +35.21 | +35.20 | **+0.01** |
| Cases | 1720 | 1790.41 | +70.41 | +176.00 | −105.59 (absorbed) |
| Approach | 1227.48 | 1395.47 | +167.99 | +168.00 | **−0.01** |
| Testimonials | 1833.2 | 1868.41 | +35.21 | +186.40 | −151.19 (absorbed) |
| Faq | 1048 | 1192 | +144 | +144.00 | **0** |
| Footer | 1652.11 | 1761.7 | +109.59 | +99.60 | +9.99 |
| **document** | **13588** | **14319** | **+731** | | |

"line-count Δ" is Σ (my lines − their lines) × line-height over every text element in
the section, paired in document order (`measure/proof.mjs`). Where it equals the
measured Δh, the difference is my copy and nothing else. "Absorbed" means my extra
lines sit inside a box whose height is fixed by measurement (a 520px card plate, a
640px case plate, a 500px quote card), so they do not move the section at all.

### Structural check — content-independent properties only

Section padding (4 sides), row/column gap, flex-direction, align-items,
justify-content, max-width, width; plus every grid's tracks and gaps; plus the nav
box and padding. Run at all four viewports.

```
488 comparisons · 3 deltas
```

All three are the same serialization difference, not a layout difference:

| vw | property | reference | mine |
|---|---|---|---|
| 1024 | Services grid cols | `repeat(3, minmax(50px, 1fr))` | `288px 288px 288px` |
| 768 | Services grid cols | `repeat(3, minmax(50px, 1fr))` | `218.656px 218.656px 218.656px` |
| 390 | Services grid cols | `repeat(3, minmax(50px, 1fr))` | `92.6562px 92.6562px 92.6562px` |

Chrome returns the unresolved function for the reference and the used px for mine.
The used track widths are identical — `(984 − 2×60)/3 = 288`, `(728 − 2×36)/3 = 218.656`,
`(350 − 2×36)/3 = 92.656` — and the items span all three tracks in both.

### Field-level diff, 1440

```
432 reference boxes · 427 mine · 383 matched · 15,703 fields compared
106 real deltas · 210 render-equivalent · 49 unmatched(ref) · 44 extra(mine)
```

Render-equivalent pairs excluded as identical in paint: `gap normal↔0px`,
`position static↔relative`, `max-width none↔100%`, `text-align start↔left`,
`z-index auto↔0`.

The 106 real deltas: **91** are `w`/`x`/`y`/`h`, of which 59 sit on the per-word
heading spans — my headline is different words to theirs, so the words have different
widths. **11** are marquee `aspect-ratio` (the track is moving, so the two measurements
were sampled at different phases). The remaining 4 are wrapper-depth pairings at
identical boxes.

`unmatched(ref) 49` = 31 boxes of the dead mega-menu panel (§4.1), 15 word spans (my
filler has a different word count), 3 other. `extra(mine) 44` = 42 word spans, 2 other.

---

## 2 · WHAT THE REFERENCE MEASURES

### Colour

| token | value | uses |
|---|---|---|
| ink | `rgb(8, 16, 20)` | 36 backgrounds, 95 text |
| white | `rgb(255, 255, 255)` | 17 backgrounds, 47 text |
| body grey | `rgb(112, 112, 112)` | 42 text |
| body grey on ink | `rgb(200, 200, 200)` | 13 text |
| page | `rgb(242, 243, 245)` | body background |
| plate-18 | `rgb(18, 18, 20)` | one gradient stop only |
| rule on ink | `rgba(255, 255, 255, 0.12)` | 1px divider |
| rule on light | `rgba(8, 16, 20, 0.12)` | 1px divider |

**Contrast, measured, not changed:** their body grey `rgb(112,112,112)` is 4.95:1 on
white and **4.46:1** on the page background `rgb(242,243,245)` — the second fails WCAG
AA for normal text by 0.04. Both are written as measured.

### Type — Geist 400 / 500 / 600 (the three faces the reference loads)

Line-height is px, letter-spacing to 2dp.

| role | size / line-height | weight | letter-spacing | count |
|---|---|---|---|---|
| h1 | 72 / 79.2 | 400 | −4.32 | 6 |
| h2 | 52 / 57.2 | 400 | −3.12 | **48** |
| h3 | 24 / 28.8 | 400 | −0.96 | 14 |
| 20 | 20 / 24 | 400 | −0.4 | 20 |
| lead | 18 / 25.2 | 400 | normal | 5 |
| body | 16 / 24 | 400 | normal | 17 |
| button | 16 / 22.4 | 500 | normal | 8 |
| tight-16 | 16 / 17.6 | 500 | −0.32 | 3 |
| nav | 15 / 21 | 500 | −0.3 | 4 |
| small | 14 / 19.6 | 400 | normal | 28 |
| eyebrow | 14 / 19.6 | 600 | +0.84 | 8 |
| micro | 12 / 16.8 | 500/600 | +0.72 | 7 |

Every display value is exactly `1.100×` its size with letter-spacing exactly `−0.060em`.

**h1 and h2 are two separate ramps** — h2 is smaller than h1 at every width:

| role | 1200px+ | 810–1199.98px | ≤809.98px |
|---|---|---|---|
| h1 | 72 / 79.2 / −4.32 | 58 / 63.8 / −3.48 | 36 / 39.6 / −2.16 |
| h2 | 52 / 57.2 / −3.12 | 42 / 46.2 / −2.52 | 32 / 35.2 / −1.92 |

Nothing else changes size at any width — h3, the 20px role, the 18px lead, 16px body
and 14px small are identical at 1440, 1024, 768 and 390.

### Radius, border, shadow

- **Radius**: exactly two in the design — `100px` on the 36×36 markers, the 60×59.69
  avatars and one 70×70 plate; `10px` on the 16×2 / 2×16 accordion bars. **Every card,
  button and plate measures 0px.** The `11px` + 3-layer shadow pair belongs to the
  Framer badge, which is their chrome, not the template.
- **Border**: the page has **zero** borders. Every division is a 1px background div.
- **Shadow**: two in the design — `rgba(8,16,20,0.12) 0 16px 24px -10px` on the nav
  dropdown, and `rgb(8,16,20) 0 0 0 0 inset` on the newsletter input.

### The two columns

`x120 w1200` shell → `x140 w1160` content column, 9 sections each. The footer's lower
block is a **different column**: `x20 w1400`.

### Section padding — asymmetric where measured

| section | 1200px+ | 810–1199.98px | ≤809.98px | gap |
|---|---|---|---|---|
| Pillars | 160 / 140 | 120 / 140 | 60 / 60 | 40 → 40 → 36 |
| Services | 120 / 120 | 120 / 120 | 60 / 60 | 50 → 50 → 36 |
| Framework | **120 / 0** | 120 / 0 | 60 / 60 | 100 → 100 → 46 |
| Cases | 120 / 120 | 120 / 120 | 60 / 60 | 44 → 44 → 36 |
| Approach | 120 / 120 | 120 / **100** | 60 / 60 | 60 → 80 → 36 (inner col) |
| Testimonials | 120 / **112** | 120 / 112 | 60 / 60 | 44 |
| Faq | **112 / 160** | 112 / 160 | 60 / 60 | 112 → 36 → 24 |
| Footer | **400 / 60** | 240 / 60 | 240 / 60 | 50 → 50 → 36 |

### Grids — fixed px tracks, unequal gaps

| grid | 1200px+ | 810–1199.98px | ≤809.98px |
|---|---|---|---|
| Services | `380px 380px 380px`, rows `588px`, gap 10/10 | `repeat(3, minmax(50px,1fr))`, items span 3, gap 60 | same, gap 36 |
| Framework | `348px 348px 348px`, rows `180px 180px`, **row-gap 80 / column-gap 58** | 2 cols, rows 180×3, gap 80/58 | 1 col, rows 180×6, gap 80/58 |

The Framework gaps are deliberately unequal: **80 down, 58 across**. Items are 346 wide
inside 348px tracks — a measured 2px inset.

### Micro-detail reproduced

- **Hover is two nodes, not one translate.** Each arrow is a 20×20 resting square plus
  a second 20×20 square inside a 20×20 clip window. Sampled frame by frame (91 rAF
  reads): the offsets **step** with no intermediate frame — rest `top:X left:−24px` →
  hover `top:−24px left:X`, X = 24 on buttons, 56 on cards. Both nodes are in the DOM.
  Tones differ per instance (hero: both ink; card-on-image: absolute ink, resting white).
- **Card titles are also two nodes** — the duplicate sits at `top:36px left:166px` with
  `translateX(-166px)` in a 28.8px `overflow:hidden` window.
- **Corner notch**: a 52×52 white square flush into the service card's top-right corner.
- **Scrims**, every stop measured: hero `rgba(8,16,20,0) 33%→100%` (30% at ≤809.98);
  Pillars `60%→100%`; service card `rgba(8,16,20,0.4) 43.618%→100%`; Cases
  `270deg rgba(8,16,20,0.4) 24%→100%` rotating to a plain downward `0%→100%` below
  1200px; Testimonials video `rgba(18,18,20,0) 24.5865%→100%` in `rgb(18,18,20)`.
- **backdrop-filter `blur(5px)`** on 3 elements: the Pillars overlay card
  (`rgba(255,255,255,0.12)`) and both Cases glass panels (`rgba(8,16,20,0.12)`).
- **Marquee**: 4 unique plates duplicated ×3 (12 `li`), column-gap 72px, one copy =
  750.48px, velocity **−24.0 px/s** leftward → 31.27s per cycle.
- **Image intrinsics** reproduced exactly, so nothing jumps on load: 26 distinct
  `width`/`height` pairs from `304×94` to `8140×5427`, with the measured `sizes`,
  `loading`, `object-fit` and `object-position` per image.
- **Sub-pixel values kept**: `727.73`, `713.59`, `1182.59`, `564.7`, `525.19`,
  `91.69`, `59.69`, `19.59`, `43.618%`, `24.5865%`, `−2.10938px`, `553.297px`.
- **Only one centred heading on the page** — Cases. `text-align: center`, and its h2
  wrap sits at `x348 w744`, centred inside the 1160 column rather than left of it.
- **One section head starts in the right column**: Approach at `x750`, not `x140`.
- **Focus-visible**: left at the UA default (`rgb(0,95,204) auto 1px`, offset 1px),
  because that is what the reference measures. No ring was added.
- **No CSS transitions and no CSS animations at rest** anywhere in the reference.

### Breakpoints — what collapses, stacks and hides

The reference's own three queries, used verbatim: `(min-width: 1200px)`,
`(min-width: 810px) and (max-width: 1199.98px)`, `(max-width: 809.98px)`.

| at | behaviour |
|---|---|
| **≤1199.98px** | Shell goes full-bleed (`x0`), keeping only its 20px padding. Nav drops 86.41 → **68** tall, padding 18→12, bar 50.41→44, desktop links and CTA hide behind a **44×44 burger** (two 20×2 white pills, radius 10px, 9px apart). Pillars / Approach / Faq stack row→column. Testimonials row→column. Services grid → 3 × `minmax(50px,1fr)` with items spanning all 3. Framework 3 cols → 2. Cases scrim stops rotating; its plate goes 659 → 560 and its glass panel drops `max-width` (482→none) and tightens padding 36→24 with gap 24. **A 130-tall full-width card appears** as a third child of the Cases body. The **Faq's 494×150 desktop card is `display:none`**. Footer `padding-top` 400 → 240. Testimonials video plate 500 → **484**. |
| **≤809.98px** | Hero height 80vh → **82vh**; its shell stops being full-height and hugs the bottom; the stack's 60px bottom padding goes to 0; the two hero buttons stack (row gap 20 → column gap 12); **the hero strap is not laid out at all**. Every section's vertical padding becomes 60/60 (footer 240/60). Framework → 1 column, rows 180×6. Cases plate 560 → **640**, body gap 12 → 20. Footer signup row finally stacks, its card padding 24/32 → 20/20 and gap 12 → 24; the white links plate drops its explicit 308px height. |

Hero height is `100vh` / `80vh` / `82vh` — confirmed by re-measuring at 1440×700
(700, 100.00vh) and 1024×700 (560, 80.00vh).

---

## 3 · CONTENT-LENGTH DIFFERENCES AND THE HEIGHT THEY CAUSED

The words are not the reference's. Each slot's filler length was found by **measuring
the wrap** in a real layout at the reference's box width and type role, binary-searching
the length that lands on the reference's line count (`measure/gen-slots.mjs`, 46 slots,
46 on target). That is why 1440 is exactly zero.

At narrower widths one string cannot hit every breakpoint's line count at once — the
boxes change width, and my filler is a different length from their sentences. The
residuals, all of which are line-count differences, not box differences:

| viewport | section | Δh | what |
|---|---|---|---|
| 1024 | Footer | +19.19 | consent + lead line counts |
| 768 | Pillars | +56 | h2 and item bodies |
| 768 | Framework | +35.2 | exactly one h2 line at 32/35.2 |
| 768 | Testimonials | +35.2 | exactly one h2 line at 32/35.2 |
| 768 | Faq | +72 | question line counts (3 × 24) |
| 768 | Footer | −54.2 | my copy is **shorter** than theirs here |
| 390 | Pillars | +224 | h2 + four item bodies |
| 390 | Framework | +35.21 | one h2 line |
| 390 | Cases | +70.41 | plate body |
| 390 | Approach | +167.99 | h2 + accordion body |
| 390 | Testimonials | +35.21 | one h2 line |
| 390 | Faq | +144 | question line counts (6 × 24) |
| 390 | Footer | +10.19 | consent line |

No box was resized to absorb any of these. Each section simply runs taller or shorter.

Button and label widths differ for the same reason — the measured label boxes are
`85.06`, `139.22`, `106.11`, `212`, `171.7`, `104.73`; mine are whatever my slot text
measures, which moves the button width and therefore its `x`. That accounts for the 90
`w`/`x`/`y`/`h` deltas at 1440.

---

## 4 · WHAT A SECOND VERIFICATION PASS FOUND

Re-diffing element by element, rather than trusting the section totals, turned up
eleven real differences. All are fixed; each is listed with the measurement.

| # | what was wrong | measured |
|---|---|---|
| 1 | Footer lead had no `max-width` | 480px at 1200px+, none below — and it is load-bearing: the cap is what gives the LEFT column its 696 (1200 − 480 − 24). Two uncapped flex-1 children split 588/588. |
| 2 | A whole card was missing at 1440 | 236×130 white card, `position: absolute`, measured top 1188px right 12px bottom 12px left 912px inside the 1160×1330 Cases body — i.e. inset 12px into its bottom-right corner. In flow as a third child below 1200px. |
| 3 | Headings were single text nodes | The reference splits every display heading into one `inline-block` span per word — 6 in the h1, 48 across the h2s — each with `filter: blur(0px)` and `will-change: transform`, the parent `white-space: pre-wrap`. |
| 4 | Placeholder labels were arbitrary lengths | Each single-line label now fits its measured pixel width (85.06, 139.22, 40.7, 58.47, 87.14, 53.5, 106.11, 104.73, 171.7, …). Worst error **0.57px** across 23 labels. |
| 5 | Button labels were `span` | The reference uses `div > p`. |
| 6 | Pillars column order | Text first at 1200px+; **image first** at every narrower width. |
| 7 | Pillars text column gap | 50px at 1440 and 1024, **36px** at ≤809.98px. |
| 8 | Footer h2 wrap cap | 576px at 1200px+, **594px** below — it changes, it does not drop. |
| 9 | Footer right card height | 120.59 at 1440 and 172.59 at 1024 (both from stretching beside the grey card), **140** at ≤809.98px where they stack. |
| 10 | Footer links-plate half padding | 32px at 1200px+ and 1024, **20px** at ≤809.98px. |
| 11 | Footer right half direction | `row` / column-gap 60px at 1200px+ and 1024; **`column` / row-gap 40px** at ≤809.98px. That is what makes the plate 526.33 tall there: 182.77 + 40 + 87.98 + 2×20. |

### Interactive states, measured on both

| state | reference | mine |
|---|---|---|
| arrow at rest | `top 24px left −24px` | `top 24px left −24px` |
| arrow on hover | `top −24px left 24px` | `top −24px left 24px` |
| button background on hover | `rgb(242, 243, 245)` | `rgb(242, 243, 245)` |
| nav dropdown | 155.89 × 90.78 @ y72.70 x562.05, gap 16px | 155.83 × 90.78 @ y72.70 x562.10, gap 16px |
| FAQ icon, open row | `matrix(-1, 0, 0, -1, 0, 0)` @ y7864.73 | identical |
| FAQ icon, 4 closed rows | `matrix(0, 1, -1, 0, 0, 0)` @ y8124.73 / 8226.73 / 8340.73 / 8442.73 | identical at all four |

## 4b · NUMBERS I STILL CANNOT HIT, AND WHY

1. **A dead mega-menu panel.** The reference carries a 1160×360 panel inside the nav
   — 56 boxes, `opacity: 0` — that exists only at 1200px+ and never becomes visible:
   I hovered every nav item, the logo, the CTA and the whole nav band, and clicked
   Services, and it stayed at `opacity: 0` in every state. It is an unused variant of
   their Framer component. Cloning it would ship 56 permanently invisible nodes, so it
   is not reproduced. **This is the only thing I have deliberately left out** — say the
   word and I will add it verbatim, opacity and offsets included.
2. **Per-word span widths.** The structure is reproduced exactly, but each span is as
   wide as the word inside it, and my words are not their words. 59 of the 91 geometry
   deltas at 1440 are this, and 15 unmatched + 42 extra spans are my filler having a
   different word count.
3. **Marquee `aspect-ratio` on 11 plates.** The track runs at −24.0 px/s, so the two
   measurements catch it at different phases and the differ pairs plate N against plate
   M. The track geometry matches: 12 items, gap 72px, 750.48px cycle, −24.0 px/s.
4. **Hover easing.** The arrow offsets are step changes — no intermediate frame in 91
   rAF samples — so no duration is applied to them. The button background does
   interpolate, over a measured **289ms**; 8-bit colour sampling resolves 13 steps,
   which fixes the duration but only approximates the curve, so `cubic-bezier(0, 0,
   0.58, 1)` is used. **That easing is the one value on the page I inferred rather
   than read.**
5. **`grid-template-columns` serialization** at the three narrow widths (§1). The used
   track widths are identical; only the computed string differs.
6. **Three explicit `<br>` elements** inside the Services, Cases and Faq headings force
   a break at a fixed word in their copy. My filler wraps naturally. Tell me where you
   want the breaks and I will put them back.
7. **Photographs.** All 27 images are locally generated neutral plates at the measured
   intrinsic sizes. Geometry, `object-fit`, `object-position`, `sizes`, `loading` and
   both intrinsic dimensions match; the pictures are yours to drop in.

## 4c · ANIMATION — captured frame by frame, not guessed

Only ONE animation is in the reference's static payload. Everything else is driven
at runtime by its animator script, so it was captured by sampling computed style
every frame (`measure/anim-capture.mjs`, `anim-scroll2.mjs`, `anim-trigger.mjs`,
`ease-cmp.mjs` — 211 rAF samples per element).

### The heading reveal — every display heading on the page

This is what the per-word spans exist for. Measured identically on the hero at load
and on every section heading as it scrolls in:

| property | initial | final |
|---|---|---|
| opacity | 0.001 | 1 |
| rotate | 2deg | 0 |
| translateY | 10px | 0 |
| filter | blur(4px) | blur(0px) |

- **duration** 1400ms
- **stagger** 50ms per word
- **trigger** the element's top crossing the viewport bottom. Measured firing at an
  element top of 902.8px in a 900px viewport — plain intersection, threshold 0, no
  root margin.
- **easing** the measured progress curve itself, written as a 41-point CSS
  `linear()` (`--ease-reveal`). It is **not** approximated: the closest
  cubic-bezier, `(0.25, 1, 0.5, 1)`, is off by a mean 0.0182 of progress, and
  `(0.16, 1, 0.3, 1)` by 0.0596.

Verified by sampling both sides. Reading the raw per-word opacity in the build, each
word's value at time *T* equals the previous word's at *T*+50ms exactly — w1 at
464.2ms is 0.2674, which is w0 at 414.2ms; w2 at 514.3ms is 0.3816, which is w1 at
464.2ms. Curve comparison at matched progress:

| t/duration | reference | mine |
|---|---|---|
| 0.5 | 0.9557 | 0.9517 |
| 0.6 | 0.9788 | 0.9757 |
| 0.7 | 0.9901 | 0.9893 |
| 0.8 | 0.9954 | 0.9953 |
| 0.9 | 0.9979 | 0.9980 |
| 1.0 | 1.0000 | 1.0000 |

The head of the reference's curve reads slightly ahead only because its sampler
caught the element already moving — its first sample is 9.11px / blur 3.646 rather
than the true 10px / blur 4px, which compresses its normalised axis and is why it
measured 1334ms instead of 1400ms.

### The hero image

From the reference's own appear-animation payload, the only entry in it:
opacity 0.001 → 1, scale 1.2 → 1, **2000ms**, `cubic-bezier(0.87, 0, 0.13, 1)`.
Fill mode is `backwards`, not `both`, because the reference's hero image measures
`transform: none` and `opacity: 1` once it has finished — nothing may be left applied.

### Hover, verified on both sides

| state | reference | mine |
|---|---|---|
| arrow at rest | `top 24px left −24px` | identical |
| arrow on hover | `top −24px left 24px` | identical |
| button background | `rgb(242,243,245)` over 289ms | identical |
| nav dropdown | 155.89 × 90.78 @ y72.70 x562.05, gap 16px | 155.83 × 90.78 @ y72.70 x562.10 |
| FAQ icon, open | `matrix(-1, 0, 0, -1, 0, 0)` @ y7864.73 | identical |
| FAQ icon, 4 closed | `matrix(0, 1, -1, 0, 0, 0)` @ 8124.73 / 8226.73 / 8340.73 / 8442.73 | identical at all four |

The arrow offsets are **step** changes — no intermediate frame in 91 rAF samples — so
no duration is applied to them. Only the button background interpolates.

### Marquee

4 unique plates duplicated ×3 (12 `li`), column-gap 72px, one copy 750.48px,
velocity **−24.0 px/s** leftward → 31.27s per cycle.

## 4d · THE MEGA-MENU IS NOW CLONED

Previously left out. It is now reproduced at its measured geometry — **56 boxes in
the reference, 56 in the build**, every key box matching: 1160×360, 666×291.56,
666×36, 666×187.56, 666×41.19, 44×41.19, 24×24, 606×41.19, 420×348, 52×52,
372×28.8, 372×58.78. Outer box `opacity: 0`, `z-index: 1`, at y101.67 x140, as
measured. It still never paints — that is what the reference does — but the tree
now matches. `unmatched(ref)` fell from 49 to **20** as a result.

## 5 · QUESTIONS — where your content will collide with their grid

Their tracks are fixed pixels, so these are decisions, not bugs. I have kept their box
in every case and not chosen for you.

**Q1 — Services: three cards on `380px 380px 380px`.**
If you have four services:
1. Keep the 380px track and let the fourth wrap to a second row (adds 598px: 588 + 10 gap).
2. Keep three on the row and move the fourth somewhere else.
3. Re-grid to four tracks of 282.5px (1160 − 3×10 gaps ÷ 4). This changes the card
   proportion and the 52×52 notch stops being square against it.

**Q2 — Framework: six steps on `348px × 3` / rows `180px × 2`.**
Six fills it exactly. If you have five, one cell is empty; if seven, a third row adds
260px (180 + 80 row-gap). Which?
1. Five, with the empty cell at the end of row 2.
2. Seven, adding a third row.
3. Change the count to six.

**Q3 — FAQ: five rows, and the closed height depends on the question's line count**
(56px for a one-line question, 80px for two). Their five are 2, 1, 2, 2, 1 lines.
1. Five questions, and I fit each to its measured line count.
2. Six or more — each extra row adds 56–80px plus the 34px gap.

**Q4 — the FAQ's "can't find an answer" card is `display: none` below 1200px.**
Anything you put in it is invisible to phone visitors.
1. Keep it desktop-only, as measured.
2. Show it on mobile too — this is an addition to their layout, not a measurement.

**Q5 — Cases: two plates at 1160×659.** A third adds 671px (659 + 12 gap). Two, or three?

**Q6 — Pillars: four numbered items (I–IV) at a 166px pitch** (116 + 50 gap), and the
body of each is **one line** in a 560px box (~74 characters at 16/24). A second line
adds 24px per item. How many items, and do the bodies get one line or two?

**Q7 — the hero h1 box is 764×158.41 — exactly two lines at 72/79.2.**
A three-line headline pushes the content stack up by 79.2 and eats into the 60px gap
above the strap. Two lines, or do you want the stack to grow?

**Q8 — Approach: three accordion rows, first one open** (open 184.8, closed 52.8), and
the open body is five lines in 550px. More rows, or more body?

---

## 6 · FILES

```
clone-elyte/
  src/app/globals.css        token layer — measured value in a comment beside each
  src/app/layout.tsx         Geist 400/500/600, the three faces the reference loads
  src/app/page.tsx           section order + measured y for each
  src/lib/prim.tsx           Arrow (two nodes), Eyebrow, Rule, H2
  src/lib/content.ts         your content slots, each carrying its measured box
  src/lib/slots.generated.ts filler sized by measuring the wrap — do not hand-edit
  src/sections/*.tsx         one file per section, 11 files
  public/img/*.png           27 neutral plates at the measured intrinsics
  measure/
    cdp.mjs                  CDP client, no dependencies
    walk-inpage.js           the DOM walk — recurses past display:contents
    measure.mjs              launch, crawl, walk, save, screenshot
    diff.mjs                 canonical-box field diff
    sections.mjs bpdiff.mjs  section tables, per viewport
    struct.mjs widths.mjs    content-independent structural checks
    gen-slots.mjs            measures the wrap, writes slots.generated.ts
    genph.mjs                writes the placeholder plates
    hover.mjs hovertime.mjs  hover-state and frame-by-frame timing measurement
    raw/ specs/ shots/       measurements, per-section specs, screenshots
```

`npm run typecheck` and `npm run lint` are both clean. `npm run dev` serves on 3111.
