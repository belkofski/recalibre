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

## Skeleton loaders

The default asks for skeletons on every page. This site has no page that
loads data: every route is static HTML with its content in the markup, and
the only network call a visitor makes is submitting the form, which shows a
button state rather than a skeleton. A skeleton here would be an animation
played over content that is already present.
