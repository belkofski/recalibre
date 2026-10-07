# The Recalibre design system

Written 6 October 2026, on the owner's audit of the same date. The audit's first
P0 was "create a real design system": one record of the colours, type, spacing,
grid, buttons, cards, inputs, tags, navigation, motion and breakpoints the site
is built from, so that nobody invents a spacing or a card by hand again. This is
that record. Every value here is the one in `src/app/globals.css`; where the two
disagree, the stylesheet is right and this file is wrong.

The visual reference remains tbd® (see `DESIGN-DECISIONS.md`); the content rule
remains the founder's ("never invent"). The system is dark only.

Revised 7 October 2026 for the direction change: the owner judged the live
site "plain words with zero design, cards with zero animation or interaction".
The answer is the depth layer (§13, `src/styles/depth.css`): surfaces with a
lit edge, ambient light, objects instead of lists, and cards that answer the
reader. Where an older section below disagrees with §13, §13 is right.

---

## 1. Colour

Tokens, in `@theme`. No section is white: the owner's "dark only" of 7
October 2026 retired the white panels. The `.theme-light` / `.theme-dark`
scopes stay defined and unused.

| Token | Dark | Role |
|---|---|---|
| `ground` | #050505 | the page, and the inner card |
| `raised` | #101010 | the seam plate behind a group of cards; the bar |
| `raised-2` | #1a1a1a | one step up from the plate (the first stage card) |
| `ink` / `ink-2` / `ink-3` | white 100 / 60 / 50% | text, three tints only |
| `rule` / `rule-soft` / `rule-strong` | 10 / 6 / 14% | hairline / soft fill / strong edge |
| `accent` | #2b4a9e | fills that carry white: the button's tip, the marker on white |
| `accent-bright` | #8aa4ec | marks on black: chevrons, small labels, the dot's hover fill |
| `signal` | #8aa4ec (deep blue on white) | a state: the focus ring, the lit tick rule, the development dot |

Long reading (`.t-read`) sits at 85%. No other tint exists.

The depth layer adds its light on the same two blues: `glow` #8aa4ec and
`glow-deep` #2b4a9e for the orbs and the spotlight, and four surface values
in `:root` (`--surface-top` #121212, `--surface-bottom` #0a0a0a, `--edge-lit`
16%, `--edge-dark` 4%). A section sheet writes an alpha of a token with
`color-mix()`; a hand-typed `rgb()` belongs in `depth.css` only.

## 2. Type

One face, Geist. The ladder, desktop / tablet / phone:

| Role | Size | Use — and only this use |
|---|---|---|
| `t-hero` | ≤90, fitted to its column | the Home hero's h1 |
| `t-display` | 64 / 48 / 36 | an inner page's h1; the OPS flagship headline |
| `t-display-lg` | 80 / 58 / 42 | the footer's call, nothing else |
| `t-section` | 48 / 40 / 32 | **every section h2 on every page** |
| `t-card` | 34 / 34 / 28 | card titles, chapter titles, stage titles, featured article titles |
| `t-lede` | 20→24 fluid | ledes and two-tone statements |
| `t-body` | 16→18 fluid | running text; the `body` default |
| `t-read` | 19 / 1.55 | an article's paragraphs |
| `t-article-h2` | 28 | an article's block headings |
| `t-question` | 18 | FAQ questions |
| `t-caption` | 12 | captions in sentence case |
| `t-mono-11` / `t-mono` / `t-tag` | 11 / 10 / 9, capitals | eyebrows and ordinals / labels and meta / tags |
| `t-fine` | 10, sentence case | consent, ©, legal links |
| `t-nav` | 12, capitals | the bar's links |
| `t-menu-lg` | 40→72 fluid | the full-screen menu's links |

The rule the audit set: when everything is huge nothing is. A page has one
loud voice (its h1); sections speak at `t-section`; cards at `t-card`. Digits
that line up take `tabular-nums`.

## 3. Spacing

Two kinds of token, both CSS custom properties, both switching at the
breakpoints.

**The rhythm** (desktop / tablet / phone), for the page:

| Token | Values | Meaning |
|---|---|---|
| `--space-section` | 120 / 104 / 80 | a section's top (`pad-top`); the black above a white panel |
| `--space-alone` | 96 / 96 / 40 | a heading alone in its row → its body |
| `--space-row` | 40 / 40 / 24 | a heading sharing its row → its body |
| `--space-label` | 40 / 40 / 24 | the label row → the heading |
| `--space-lede` | 32 / 32 / 24 | heading → lede |
| `--panel-pad` | 50 / 24 / 20 | inside a white panel |
| `--card-pad` | 32 / 24 / 20 | inside a card |
| `--gutter` | 30 / 24 / 20 | the page edge (`pad-x`) |
| `--bar` | 56 | the fixed bar |

**The scale**, for the inside of a component: `--space-1` 8 · `-2` 12 · `-3` 16 ·
`-4` 24 · `-5` 32 · `-6` 48 · `-7` 64 · `-8` 96 · `-9` 128 · `-10` 160. Written
as `gap-(--space-3)`, `pt-(--space-5)`. A bare pixel value is a defect.

## 4. Grid and breakpoints

The shell is 1380 wide, centred, inside the gutter. Three breakpoints, the
reference's, plus the 600 split:

| Variant | Range |
|---|---|
| (none) | ≥1200, desktop |
| `tablet:` | 810–1199.98 |
| `mobile:` | ≤809.98 |
| `phone:` / `mid:` | ≤599.98 / 600–809.98 |
| `narrow:` | ≤1199.98 (anything under desktop) |
| `short:` | height ≤679.98 |

Two columns at most under 1200; one under 600. Words never sit over a picture
on a phone: the card stacks them.

## 5. Radii and surfaces

Cards 30 (24 for a smaller group), 20 on a phone, automatic. Controls 8. Pills
and chips 100. A group of cards sits on a seam plate (`.seam` / `.seam-sm`):
the `raised` ground with 2px of padding and a 2px gap, so the seam between two
cards is a 2px line of the plate. No drop shadows anywhere.

Every card is a **surface** (§13): a vertical fill lit at the top, film grain,
a 1px inner highlight and a gradient edge. A card opts out only for a
photograph that fills it.

## 6. The kit (`src/components/ui.tsx`)

| Part | What it is |
|---|---|
| `FirmMark` | the `///`, in three sizes; beside the name, before a label, at a card's centre |
| `Chevron` | the one arrow, cut from the mark; a mirror for back, a turn only for a disclosure |
| `Btn` | the primary button: a 48px face and a blue tip; the blue wipes in from the left on hover; `magnetic` lets it lean toward the pointer |
| `MonoLink` | the secondary action: two mono words and a 24px dot that fills |
| `Pill` / `Chip` | a 28px control / a 24px tag; a tag never has a hover |
| `TickRule` | the one rule: 1px with ticks, `lit` to a fraction in the signal blue; it draws itself under a label row |
| `LabelRow` | the section label: mark, words, the rule; its own reveal |
| `SectionHead` | the one section opener: label row, h2 at `t-section`, the lede beside it |
| `Eyebrow` | a small label over a thing |
| `Card` / `cardClass` | the one card; `radius`, `pad`, `interactive`, and the depth flags: `surface` (on by default), `deep`, `spot`, `tilt` |
| `Status` | a 6px dot and a mono state; the development dot carries a soft ring |
| `Caption` | a mono label on a hairline under a picture |
| `Orbs` | one set of ambient lights behind a block: a preset (`hero`, `hero-left`, `section`, `card`, `foot`) or an explicit `orbs` list |
| `Glyph` / `GlyphTile` | the in-house icon set, drawn in the system diagram's stroke; a tile is the glyph on a small surface (48, or 40 with `sm`) |
| `Numeral` | the big outline ordinal behind a chapter, hidden from assistive technology |
| `Frame` | the device frame around a capture: bezel, window bar, screen; `bare` drops the bar (or `bare="mobile"` below 810). For captures only, never a photograph |

The card's vocabulary is fixed: meta `t-mono text-ink-3`, title `t-card
text-ink`, description `t-body text-ink-2`, tags `Chip`, action a MonoLink-shaped
foot. Its variants (work, capability, insight, principle, stage) are
compositions of these, never new CSS.

## 7. Buttons and links — the policy

The primary button says "Start a calibration" and appears at the bar (as the
pill), the hero, the first stage card and the footer. Nowhere else. Everything
else is a `MonoLink`: SEE OUR WORK, EXPLORE OPS, ALL CAPABILITIES, ABOUT
RECALIBRE, READ THE ARTICLE. A card never carries the calibration button.

## 8. Inputs

A field is a hairline under its words, no box: the label in `t-mono` with a
REQUIRED tag where it applies, the value at 18px, the hairline turning to the
light blue on focus and the label to full ink. Validation on blur and only on
blur; errors in the flare orange under the field; the select draws the firm's
chevron. Every outcome is visible: sending, sent, failed.

## 9. Navigation

The bar: 56px, fixed, the slab's ground at the top; glass over the page when
scrolled (16px blur at 84%, a hairline under it); aside on the way down past the
first screen, back on the first scroll up. A 1px progress line along the top
edge. From 1200: the wordmark, About · Work · Capabilities · Insights (a hairline
draws under a link on hover and stays under the current page), and the one
action as a pill. Under 1200: MENU opens the whole window under the bar, the
pages rising one after another, the button, the direct line, the fine print.

## 10. Motion

Five entrance tiers and four answers to the reader, all in
`src/lib/motion.tsx`, all progressive enhancement (the server renders the
finished state; the hidden states are gated on `.js` and covered by a 2.5s
failsafe):

| Primitive | What moves |
|---|---|
| `Rise` | a heading's lines, or its words, up out of their own clip boxes, 0.6s |
| `InView` | fade-up 24px / picture fade + settle 1.06→1 / **clip** reveal from the foot + settle 1.08→1 / scale from 0.96 |
| `Parallax` | a picture drifts with the scroll, by transform, desktop only |
| `ScrollStory` | a pinned visual follows the chapter being read |
| `Magnetic` | a button leans toward the pointer and springs back |
| `useScrollState` | the bar's scrolled / direction / far |
| `Spotlight` | a card's light follows the pointer; on touch, the card under the centre line of the screen lights |
| `Tilt` | a picture card leans toward the pointer, up to 5°, its `.tilt-layer` the other way; inside `InView`, never around it |
| `Stack` | chapters pin under the bar and slide over each other, the one beneath scaling and dimming; a card taller than the screen unpins |
| `Rail` | a snap row with a progress rule and two rings that disable at the ends |
| `Ticker` | the partner marks in a slow loop, paused under the pointer; its copy is `aria-hidden` and `inert` |
| `Ordinal` / `useActiveStep` | a small ordinal that rolls in on reveal / the chapter currently read |

Timings: rise 0.6s `--ease-rise`; reveal 0.9s, picture 0.6s, settle 1.2s
`--ease-in-view`; panels and folds 0.45s `--ease-panel`; hover 0.3s and press
0.12s `--ease-hover`; return 0.5s `--ease-spring`; clip 1.1s; story crossfade
0.6s. Hover: text 60→100%, surface +4%, edge 10→14%, chevron 2px forward, dot
fills, picture leans 4%. Press: 0.98 and one step darker.

Four things move on their own, all slowly and all stopped under reduced
motion: the development dot's ring, the orbs' drift (24–36s), the pulse along
a flow line, and the partner ticker. No cursor follower, no counter, no
smoothing library, no page transitions. Under `prefers-reduced-motion` every
travel, clip, scale and tilt goes and the fades stay; the orbs stand still,
lit; the ticker becomes a still row the reader scrolls.

## 11. Accessibility

Every control is 44px to the finger; one focus ring, 2px in the signal blue, 2px
clear, following the control's corners; one h1 per page and `t-section` h2s in
order; folded panels are `inert`; decorative copies are `aria-hidden`; text over
a picture reaches 4.5:1 through a shade in the file, a veil, or a tag's own
ground; Windows high-contrast mode keeps the marks.

## 12. Where things live

```
src/app/globals.css        tokens, type, base, the kit's CSS, the premium layer
src/styles/depth.css       the depth layer (§13), imported first of the sheets
src/styles/<route>.css     one plain-CSS file per route, imported once from globals
src/components/ui.tsx      the kit
src/lib/motion.tsx         the motion system
src/content/*.ts           every word on the site
src/sections/<route>/*     the sections of a route
```

## 13. The depth layer (7 October 2026)

`src/styles/depth.css`, with its scripts in `src/lib/motion.tsx` and its
parts in `src/components/ui.tsx`. Five moves:

1. **Surfaces with depth.** A card is a lit object, not a flat rectangle on a
   seam (§5).
2. **Ambient light.** Every major block carries one set of orbs behind its
   key object: large blurred glows in the two blues at 8–22%, drifting
   slowly. Never over a photograph's face; at most two sets in a phone's
   viewport.
3. **Objects, not lists.** Rows on hairlines became tiles with glyphs, outline
   numerals, rails, stacks and a ticker. A tag line is a row of chips.
4. **Words as captions.** A paragraph's lead sentence is set large at full
   ink, the rest at body in ink-2 beside or under it. A text block is paired
   with an object of equal weight.
5. **Everything answers**, by the vocabulary below. There is no sixth hover.

| Thing | Pointer | Touch and scroll |
|---|---|---|
| surface card | spotlight on the ground and the edge | lights while under the centre line |
| picture card | + tilt up to 5°, the picture leaning the other way | the picture settles on reveal |
| link card | + the dot fills, the chevron moves 2px | press 0.98 |
| MonoLink | the underline draws, the dot fills | press |
| chip | edge to strong, fill to 10% | none |
| button | wipe and magnetic lean | press |
| tabs and panels | the bar springs, the row lights, 90ms hover intent | tap |
| rail | wheel or trackpad, and the two rings | snap swipe with a progress rule |
| stack | none | pinned slide-over, scale and dim |
| ticker | pauses | runs |
| ordinal | rolls in on reveal | the same |
| flow line | nodes light in order, a pulse travels | the same |
| orbs | drift | drift |

**On a phone.** Nothing is wider than the screen; rails clip their own
overflow. Rail items are 85vw so the next one peeks. Tag rows hold two lines
from 360 up: chips lose padding and tracking below 390 and again below 360.
At 320 the two longest rows (the first capability's four tags, the Contraxis
scope) take three. Only one card lights at a time: the topmost card under the
screen's centre line, inside the middle 70% of its width. No card tilts on
touch.

**Without scripts** the surfaces, orbs, frames and numerals draw as they are,
the ticker runs on CSS, the stack is a plain column and the first panel is
open. Every hidden state is gated on `html.js`, and the layout's
`<noscript>` block hands each one its finished state.

**Contracts a section keeps.** `Tilt` sits inside `InView`, and its picture
is a `.tilt-layer` block. A stack card is a direct child of `Stack` and
carries no `relative` utility, which would beat the sticky rule. `Orbs` sit
inside a `relative isolate` block, on a card's ground and never behind an
opaque picture. `Spotlight` wraps exactly one card.
