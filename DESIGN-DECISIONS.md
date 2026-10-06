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

## Skeleton loaders

The default asks for skeletons on every page. This site has no page that
loads data: every route is static HTML with its content in the markup, and
the only network call a visitor makes is submitting the form, which shows a
button state rather than a skeleton. A skeleton here would be an animation
played over content that is already present.
