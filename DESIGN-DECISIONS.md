# Design decisions on record

Written 21 September 2026, against the completion audit of the same date.

The audit's finding 15 asks for one thing this repository did not have: an
explicit record of which house rules this site is allowed to depart from, and
why. Without it every future pass re-argues the same points, and a reviewer
comparing the site to the global defaults reads a series of departures as a
series of mistakes.

The global defaults are in `~/.claude/CLAUDE.md`. Everything below is either
"this site follows it" or "this site departs, and here is the decision".

---

## Departures, approved

These follow from one instruction that overrides the defaults for this
project: the site is built to the **tbd®** template at `tbdstudio.framer.ai`,
measured live, as the licensed visual reference.

| Default | This site | Why |
|---|---|---|
| **shadcn/ui components only** | Custom components, no UI library | shadcn is a React + Radix + Tailwind system with its own radii, spacing and focus language. The reference's card seam, its 2px gutters, its 31/30 radii and its split button do not exist in it, and rebuilding them as shadcn overrides would be more code than writing them once. The site ships **three** dependencies — `next`, `react`, `react-dom` — and no UI library at all. The reusability rule is met the way the defaults intend it: `components/ui.tsx` holds nine primitives, `WorkCard`, `EnquiryForm`, `PageHead` and `LegalPage` are each defined once, and the card that had drifted into two copies is now one. |
| **Dark and light mode from the start** | Dark only | The reference is a single dark visual world — near-black grounds, a lime accent, photography graded to sit on black. A light mode is not a token swap here; it is a second set of photographic plates and a second set of scrims. It is a real piece of work and it is not in this scope. Recorded as a departure, not an omission. |
| **Border radius 12 / 8 / 16** | 31 / 30 / 25 / 24 / 20 | Measured off the reference. The 2px seam between cards only reads at those radii; at 12px the plate behind a card group disappears. Buttons and inputs do keep 8px. |
| **4px / 8px spacing grid** | Measured values (30 / 41 / 50 / 70 / 150 …) | Every number in `globals.css` was read out of `getComputedStyle` on the reference at 1440, 1000 and 390. Rounding them to a 4px grid is what makes a clone look approximate. Most land on the grid anyway; the ones that do not are deliberate. |
| **Lucide icons** | No icon set | The reference uses exactly one glyph — three squares — plus a chevron and a check. All three are drawn inline. Adding an icon library for three shapes would ship a dependency to save nothing. |
| **Breadcrumbs on pages deeper than the main view** | A single "ALL WORK" / "ALL INSIGHTS" return link | These are marketing routes two levels deep, not an application. The default calls breadcrumbs unnecessary on landing pages, and every page on this site is one. |

## Defaults this site follows, without exception

- **TypeScript strict, no `any`.** Both hold. `npm run typecheck` is clean.
- **Mobile first, 44px touch targets.** Every interactive element clears 44px,
  including the menu's legal, phone and social rows and the principle
  carousel's dots and arrows, all of which failed it before this pass.
- **Form validation on blur.** On blur and only on blur — the enquiry form
  used to re-validate on every keystroke once a field had failed, and does
  not now.
- **Every action gets feedback.** Submit disables and says "Sending…",
  success replaces the form, failure keeps every answer and says what
  happened.
- **Loading, error and empty states.** The form has all three. There is no
  list on this site that can be empty: three initiatives and three articles
  are static content, not a query.
- **API errors show a message, not a stack trace.** Every branch of
  `api/contact` returns a sentence a person can act on.
- **Subtle shadows, one accent, semantic status colour.** No drop shadows at
  all; lime is the single accent; lime and orange carry owned-versus-in-
  development on the initiative cards.

## Typography

Geist and Geist Mono, which are the reference's own two faces. The audit
suggests comparing a distinctive alternative such as IBM Plex Sans before
changing anything. **Nothing was changed**: the whole type scale — eighteen
steps at three breakpoints — is measured to Geist's metrics, and swapping the
family re-measures all of it. If the family is ever reconsidered it should be
its own piece of work, with both cut at the measured sizes and compared
rendered, not chosen from a specimen.

## The decisions of 6 October 2026 — the owner's audit

The owner audited the live site and found the direction right and the system
unfinished: "beautiful agency concept, partially finished production website".
The rebuild that followed is a UI-system cleanup, an information-architecture
cleanup, a responsive pass and a case-study upgrade, with premium motion. Not a
rebrand. `DESIGN-SYSTEM.md` is the record of the system; these are the
departures from what stood before, and why.

| Before | Now | Why |
|---|---|---|
| **Five links in the bar: Home, About, Work, Insights, Contact** | About, Work, Capabilities, Insights; Home is the wordmark; Contact is the one pill | The audit: the header read as an editorial site, and the five capabilities had no page. `PAGES` keeps all six for the footer and the 404. |
| **A 500px menu panel dropping from the bar** | A full-screen menu under the bar, the pages rising in sequence, the one button, the direct line | A box floating over a phone's page is not a navigation; the audit asked for a proper full-screen one. |
| **Ten blocks on Home** | Seven: hero, partners, what we do, selected work (OPS as a story, then three cards), why, how, the footer's call | "The homepage tries to explain everything." About a third shorter; every sentence moved to its page rather than cut: the FAQ to Contact, Insights to its page, the capability deck to /capabilities. |
| **`t-display` on every h2** | `t-section` (48/40/32) on every h2; `t-display` for a page's h1 and the OPS flagship only; the 64px stage titles gone | "When everything is huge nothing feels huge." A page has one loud voice. |
| **Spacing by measured value, section by section** | The rhythm tokens stay; a ten-step numeric scale (`--space-1` to `-10`) for the inside of a component | "Stop manually inventing spacing." The measured rhythm was right; the ad-hoc interior spacing was the drift. |
| **Cards styled per section** | One `Card` with one hover; one `SectionHead`; one `Eyebrow` | The audit's "different sections feel like different design experiments". |
| **"Start a calibration" on six blocks** | The bar, the hero, the first stage card, the footer. Secondary `MonoLink`s everywhere else | Repetition made the one action ordinary. |
| **The capability carousel on Home; the sticky deck on About** | A numbered index with one open row and a pinned visual on Home; a first-class /capabilities page with anchors and a sticky index; the deck retired | "Visitors don't have a clean place to explore them individually." |
| **OPS as a block of four cards** | OPS as the flagship: a scroll story whose pinned screen follows the chapter being read, on Home and at the head of /work | "OPS should probably be your hero case study … then show the actual product UI." |
| **A case page as cover, meta, facts, list, gallery** | Chapters with anchors: THE PROBLEM, THE SYSTEM, WHAT WE BUILT, the pictures, STATUS | The audit's "THE PROBLEM / THE SYSTEM / WHAT WE BUILT / RESULT". RESULT is STATUS here: no initiative has a measured result and the content rule forbids inventing one. |
| **Three entrance tiers; nothing else moves** | Five tiers (clip reveal and scale added), the word rise, parallax, the scroll story, the magnetic button, the bar's glass and step-aside, the tick rule drawing, the button's wipe | The owner asked for top-tier interaction. The rule holds: nothing moves without the reader's scroll, hover or press, and reduced motion keeps the fades. |
| **No ambient movement at all** | One: the development status dot carries a soft 2.6s ring | A product in development is alive, and a 1px ring is the smallest way to say so. It stops under reduced motion. Recorded as the one exception. |
| **The contact page as a contact form** | A conversion page: the h1 says what the form is for, the two Calibration promises stand under it, the three optional questions fold behind one line | "You're selling a diagnostic process, not an email conversation." |
| **Insights as a plate and rows** | A featured article and two editorial cards | "Don't make it look like a huge publication." |

Nothing in the content rule changed. Every new sentence on the site is the
owner's own, from the audit — the hero's subline, the proof line, the OPS
tagline and register, the contact page's question, the Insights line — or a
sentence the site already printed, moved.

## The decisions of 7 October 2026 — the direction change

The owner reviewed the live site on his phone and judged it "plain words with
zero design, cards with zero animation or interaction, super old". The audit
of the day before had fixed the system; it had not given the site depth. This
pass keeps every page, every sentence and the information architecture, and
changes how each block is drawn and how it answers. The system is recorded in
`DESIGN-SYSTEM.md` §13.

| Before | Now | Why |
|---|---|---|
| **Flat #050505 cards on a #101010 seam** | Every card a surface: a vertical fill lit at the top, grain, an inner highlight, a gradient edge; a spotlight under the pointer; picture cards tilt | "Cards with zero animation or interaction." A card now reads as an object and answers the reader. |
| **A black page** | One set of drifting orbs behind each major block, in the site's two blues | The difference between a black page and a lit room. |
| **Rows on hairlines, lists of names, a deck of chapters** | Tiles with glyphs, outline numerals, a partner ticker, expanding panels (a snap rail on a phone), sticky stacks of chapters, rails of framed captures | "Plain words with zero design." Each list became an object a reader can see and touch. |
| **Paragraph walls** | A lead sentence large at full ink, the rest at body in ink-2, each block paired with an object | The page reads object, caption, object, never text, text. |
| **Two white panels (the capability index, the principles)** | Dark only | The owner's reversal of the same day. The theme scopes stay defined, unused. |
| **One ambient movement (the status ring)** | Four: the status ring, the orbs' drift, the pulse on a flow line, the partner ticker | A lit room has to breathe. All four are slow, and all four stop under reduced motion; the ticker becomes a still row the reader scrolls. Nothing else moves without the reader. |
| **On a phone, no answer at all** | The card under the screen's centre line lights; rails snap; stacks slide | The owner reviews on a phone first. One card lights at a time, the topmost under the line. |

Three calls made on the way, recorded so they are not re-argued:

- **The two partner context sentences** (ABP Continental's and Belkofski's
  first summary sentences) no longer print on Home: the partner register
  became a ticker of marks, and a mark tile has no room for a sentence. Both
  still print on /work and on their case pages, so they were moved, not cut.
- **Tag rows hold two lines from 360 up.** Below 390 and again below 360 the
  chips lose padding and tracking, and Home's capability rail tightens them a
  step further so the next card still peeks. At 320 a few rows of long tags
  (the first and third capabilities' tags, the Contraxis scope) take three,
  because no two of their tags fit one line without cutting the words.
- **ABP Continental and Saidis have no logo file**, so their tiles in the
  ticker print their names in the site's own lettering at full ink, and never
  a drawn stand-in for a logo.
- **Large visual cards lean, whatever they carry.** A picture card tilts and
  its picture leans the other way; the capabilities chapters' drawings and
  the featured article's card lean as whole cards, with nothing moving inside
  them. The Contraxis case cover and the article covers stay still.

Nothing in the content rule changed. No sentence was added and none was cut;
every sentence on a page still comes from `src/content/*.ts`. The one new
line in a component is the About orbit diagram's description for a screen
reader, kept beside its drawing as the system diagram's is in
`lib/diagram.ts`. It describes the drawing and claims nothing.

## Skeleton loaders

The default asks for skeletons on every page. This site has no page that
loads data: every route is static HTML with its content in the markup, and
the only network call a visitor makes is submitting the form, which shows a
button state rather than a skeleton. A skeleton here would be an animation
played over content that is already present.
