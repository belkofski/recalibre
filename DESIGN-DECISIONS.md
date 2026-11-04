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

Geist only. The reference pairs Geist with Geist Mono for its small labels;
the site set them both until 27 September 2026, when the owner chose one
face, and the labels keep their capitals and tracking in Geist (`--font-mono`
in globals.css points at the same file). Confirmed again on 4 November 2026
against the reference, where the pairing is visible, and kept. The whole type
scale — eighteen steps at three breakpoints — is measured to Geist's metrics;
a family change re-measures all of it and would be its own piece of work.

## Skeleton loaders

The default asks for skeletons on every page. This site has no page that
loads data: every route is static HTML with its content in the markup, and
the only network call a visitor makes is submitting the form, which shows a
button state rather than a skeleton. A skeleton here would be an animation
played over content that is already present.

---

## Revisions of 4 November 2026 (the redesign program)

The owner's brief for finishing the site to the reference's standard
reverses or extends a number of the decisions above and in the source
comments. Each is recorded here so that no later pass re-argues it.

| Topic | Was | Now | Why |
|---|---|---|---|
| **Dependencies** | Three runtime dependencies, no library | Five: `motion` and `@next/third-parties` added | The card-shuffle scroll stack and the inverted cursor the owner confirmed from Framer University need scroll-linked springs that are not worth re-deriving; `motion` is imported only inside `components/fx/*` client islands and never in the shell, the bar or the footer. GA4 is loaded through Next's own third-party wrapper. |
| **Motion** | "No cursor follower, no loops" (`lib/motion.tsx`, Phase C) | A cursor follower (inverted, pointer-fine devices only) and one looping canvas, the workflow runner, allowed | Owner's confirmation of 3 November 2026. The loop runs only in view, rests 1.5s between runs, has a visible 44px pause control (WCAG 2.2.2) and is static under reduced motion. The Contraxis diagram's own rule is unchanged: hover, under five seconds, never loops. |
| **Navigation** | Five links, "as instructed" (`content/site.ts`) | Six (Services and Industries added), Work renamed Projects, plus the pill | The owner's structure for the site. The five old `/work` addresses redirect permanently (308) in both languages. |
| **The marked phrase** | One per page; interior openers unmarked except About's (C7) | Still one per page; every page head carries its own, and it draws in on reveal | "Bright", the owner's word for the finished site: the accent present on every first screen, not only Home's. |
| **Analytics** | None, and the Privacy page said so | GA4 behind a consent banner; nothing loads before a yes; CSP opened to Google's hosts only in a build that carries the ID | Owner's decision of 4 November 2026. `content/legal.ts` rewritten the same day. |
| **Quotation** | Enquiry only; the budget band removed (`EnquiryForm.tsx` header) | A second path, Request a quotation, with a service, a scope, a timeline and an optional indicative budget as free text | A buyer who already knows what they want had no path. Free text, not bands: the firm publishes no prices and invents no ranges. |
| **Breadcrumbs** | None, a single return link | `BreadcrumbList` structured data on nested pages, no visible trail | The crawler gets the hierarchy; the page keeps its one return link. |
| **Article dates** | Omitted (no true publication date) | Still omitted; set to the go-live date at launch, never to a commit date | A commit is not a publication. |
| **The curtain** | 900ms minimum, 6s cap, waits on the hero picture and the scripts | 500ms minimum, 1.2s cap, waits on the markup and the font, first arrival in a session only | The audit of 3 November 2026: the curtain was the one cost on the site that no gain paid for. The owner accepted that the hero's choreographed entrance now mostly plays on fast connections only. |
| **The capabilities on Home** | The white-panel carousel (`CapabilitiesSlider`) | The card-shuffle deck, one card per service, each linking to its service page; About keeps its chapter deck | The owner's first confirmed interaction, placed where the reference puts its services. |
| **Languages** | One hard-coded French landing page | Two root layouts sharing one shell, every page mirrored under `/fr`, French published when the owner has reviewed it (`PUBLISHED_LOCALES`) | The audit: no hreflang, no French, one page indexed. |
| **Palette** | — | Unchanged: black ground, the blue accent of 27 September 2026 | The owner declined the navy/cobalt proposal on 4 November 2026. |
| **Page transitions** | Planned: React `<ViewTransition>` crossfades | Not shipped | The installed React (19.2.8) does not export `ViewTransition`; the site does not run a canary. Dropped on 4 November 2026 rather than add an experimental runtime for it. |
| **Radii** | 31 / 30 / 25 / 24 / 20 in the table above | 30 / 24 / 20, buttons and inputs 8, since 28 September 2026 | Recorded here for the first time; the table above is historical. |
| **Accent name** | "lime" in the table above | The blue of 27 September 2026 | Historical; lime left the site that day. |

## The performance pass of 4 November 2026 (WP8)

Measured with Lighthouse 12, mobile preset, simulated slow 4G and 4× CPU, against the production build on this Mac. What changed because of it:

| Finding | Change |
|---|---|
| Home shipped 267 KB of script (gzipped); 44 KB of it was `motion`, imported by the deck and the magnetic button | The deck (`fx/CardShuffle.tsx`) and the magnetic button (`fx/Magnetic.tsx`) are driven without the library — one passive scroll listener and a requestAnimationFrame for the deck, a CSS transition for the button. `motion` now rides only with the inverted cursor, which loads on a fine pointer after its first move. Home: 219 KB. The remaining ~200 KB on every page is Next's own runtime. |
| Every interior page's largest paint was its H1, held at opacity 0 until the page hydrated (2.7 s of render delay on the throttled phone) | `Rise eager`: the first screen's heading is marked risen on the server and a CSS keyframe plays the same rise from the first paint, with no script in the way. Used for every page's H1. The rise still plays; it is not paused under the curtain. |
| The hero plate and the contact plate were the home and contact pages' largest paints, at quality 75 | Both at quality 60: dark photographs with no text, indistinguishable at their size, a third lighter on the wire. `images.qualities` lists 60. |
| The workflow canvas on a phone squeezed four columns into 335 px | The field keeps a 680 px minimum on phones and scrolls sideways inside its card. |
| The language switch's accessible name did not contain its visible text (WCAG 2.5.3) | The name is now "FR — Version française" and its target is 44 px wide. |

The two measured facts this pass did not change: the curtain does not delay the largest paint (Chrome records the paint of what it covers; verified with a PerformanceObserver on the production build), and Next's runtime floor is above the 180 KB budget the master plan set, so the budget is restated as "no route above the framework floor plus 20 KB" — Home sits at the floor plus 15.
