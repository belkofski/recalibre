# Recalibre — Website Redesign Program: Master Plan

Repo: `belkofski/recalibre`.
Live: https://recalibre.cloud on Netlify site `recalibre-site` (id `5efa5c45-cb4d-44a3-aaee-fe084bbbc285`).

## Local findings — 3 November 2026 (Mac session)

Checked against the live site and the Netlify API from the owner's Mac. These correct the handoff below.

| Item | Found | Consequence |
|---|---|---|
| Node toolchain on this Mac | **Not installed.** No `node`, `npm`, `pnpm` or `bun` on PATH; no nvm, no Homebrew at `/opt/homebrew`. | Nothing builds locally until Node 22 is installed. First action of PR 0. The checklist line "✔ Node 22, npm 10" was written for the cloud sandbox, not this machine. |
| Production deploy | Commit `782c585`, deployed 3 Oct 2026 via API (CLI deploy), `deploy_source: api`, no Git CD connected. `/fr` returns 404 live. | Main (`83012d0`, 15 Oct) is 10 commits ahead of production. The partner hub and `/fr` are not live. |
| HSTS | Live response already carries `strict-transport-security: max-age=31536000`. Served by Netlify, not by `next.config.ts`. | The "no HSTS" item is wrong for the live site. Workstream 0 still adds it in `next.config.ts` so the header is in code, not only in the host. |
| CSP and other headers | Served live as written in `next.config.ts`. | Fine. |
| Contact API | `POST /api/contact` with an empty body returns 422 with a field-level message. | The route runs. Whether Resend env vars are set is still unverified (needs a real submission or the Netlify env list). |
| Netlify Forms | Not enabled. | Correct: the site uses its own API route. |
| `docs/` folder | Was empty; this plan was never committed from the cloud session. | Written now. |
| Owner's position on scope, 3 Nov | The owner rejected the plan's "major visual changes" as not requested, then confirmed the two Framer University references (card-shuffle scroll animation, inverted custom cursor) **and asked for more advanced, creative interactions of that kind** to raise the experience. | Section D (the three interactions) stands. Section G (the "ultra-modern layer") and the palette change in section C were written by the cloud session without a brief: they are **candidates to be approved one by one, not decisions**. The owner's own audit and the verified audit in `docs/AUDIT-2026-11-03.md` set the priorities: indexing, service and industry pages, a working form, the curtain, French, structured data. |

## Handoff — how to resume (written 3 Nov 2026)

The first (cloud) session could not load the live site or the three references: its egress allow-list was fixed at
session start. Work now continues locally on the owner's Mac, where the network is open. In this session:

1. Confirm the clone is `belkofski/recalibre` on `main`, install Node 22, then `npm ci`.
2. **Live review first**: curl the live headers, then Playwright-capture every route in `sitemap.xml` plus `/fr`
   at 390 / 810 / 1440 (full page, after scrolling so one-shot reveals fire). Send the owner a contact sheet. Note
   that production still runs commit `782c585` (3 Oct), so the partner hub and `/fr` are not live yet.
3. **Measure the references** (Playwright, print to stdout): card-shuff.learnframer.site transform-vs-scroll table
   at 12+ positions and two widths; the inverted-cursor page's element CSS, follow behaviour, hover growth, touch;
   n8n.io hero canvas (node/edge/animation CSS, class changes over 3 s) and template-card hover. Replace the
   INFERRED recipes in section D with MEASURED values.
4. Docs verification already done (Context7): two root layouts via route groups, catch-all 404 per locale instead
   of `experimental.globalNotFound`, `metadata.alternates.languages` + `openGraph.locale`, `redirects()` (308 by
   default), `motion` `useScroll`/`useTransform`/`useSpring`/`useInView`/`MotionConfig`, `@next/third-parties/google`
   with Next 16, `images.qualities` default. Still to confirm: Next 16 `experimental.viewTransition` status, and
   Google's current Consent Mode v2 parameter names and gtag CSP hosts.
5. Update the plan with what the live review shows, then execute PR 0 → PR 10 in order.

Decisions already taken by the owner are in the table below and are not to be re-asked.

## Context

The owner locked a redesign program: a premium corporate digital-studio site that looks alive, explains every
service, converts visitors into enquiries and quotation requests, and is discoverable by search engines and AI
systems. Today's site is a well-built Next.js 16 / React 19 / Tailwind v4 marketing site (10.8k lines, 3 runtime
dependencies, strict CSP, dark only, all copy in `src/content/*.ts`) that is **10 commits behind on production**
(live = CLI deploy of `782c585`, 3 Oct; main = `83012d0`, 15 Oct), has a dead contact form in production until
Resend env vars are set, two lockfiles, a stale package name, HSTS only at the host, one hard-coded French landing
page, and `pageMeta` that drops hreflang on every page.

Three things in the brief contradict recorded owner decisions and are now **revised by the owner**:
`src/lib/motion.tsx` header ("no cursor follower, nothing loops"), `DESIGN-DECISIONS.md` ("3 dependencies, no
library"), and `src/content/legal.ts` ("no analytics, no cookie banner"). Each revision gets written into the
record, not silently overridden.

## Coverage audit — what was explored before planning

| Area | Explored | How |
|---|---|---|
| Routes | 16/16 route files, both dynamic routes, api route, robots/sitemap/manifest/not-found | read in full |
| Components & sections | 37/37 tsx (ui primitives, Nav, Footer, WorkCard, PageHead, LegalPage, JsonLd, SystemDiagram, EnquiryForm, 13 home sections) | read in full |
| Content | 7/7 content files, every string and rule comment | read in full |
| Lib | motion, curtain, diagram, Img, images manifest, origin, seo | read in full |
| Styles | globals.css 3161 lines: tokens, variants, type ladder, themes, hover language, reduced motion, container queries, `@starting-style`, `color-mix` | read |
| Config & tooling | next.config, netlify.toml, env, gitignore, eslint, tsconfig, postcss, scripts (plates.py 1602 lines, manifest, check) | read |
| Assets | 49 masters (dimensions measured) + 68 published plates; viewed the share cards and OPS screens | inventoried |
| History & deploy | 36 commits, tags (none), Netlify site + current deploy record, env-var status | queried |
| Rendered site | **not seen** in the cloud session (network blocked); first task locally | — |
| Reference sites | **not seen** in the cloud session; recipes inferred, to be measured locally | — |

Mitigation, first deliverable of Phase 1: run the dev server and capture every route (18 EN pages) at
390 / 810 / 1440 with Playwright, plus a Lighthouse baseline, into a dated audit folder sent to the owner. Nothing
visual is changed before that baseline exists.

## Decisions taken (owner) and working assumptions

| Topic | Decision |
|---|---|
| Animation engine | **Add `motion` (framer-motion)**; record as revised design decision |
| Insights | **Keep** as secondary section (nav sub-item + footer), URLs unchanged |
| Analytics | **GA4** via Consent Mode v2, minimal consent banner, CSP opened for Google hosts only |
| Visuals | **Code-built** (SVG/canvas hero, SVG illustrations, HTML dashboard mock-ups, CSS/SVG motion) **+ AI abstract textures** generated with Higgsfield, no people/offices/stock, **owner approves each before it ships**. Note: the connected Higgsfield workspace has **0 credits (free plan)**, so AI plates are blocked until credits are added; procedural textures (SVG noise, canvas gradients, dot grids) ship first and AI plates slot in later with no code change |
| Palette | Deep navy / electric cobalt / black & white / cool neutral grey; **dark-only stays**; keep deep-blue-for-fills vs light-blue-for-marks contrast split |
| Hero direction | **n8n-style workflow card only**: the opening visual is a single large workflow card (framed canvas, Recalibre nodes, execution loop with cobalt pulses) beside the headline; no dashboard mock-up and no deck in the hero. The card-shuffle deck moves to the Services band below the fold |
| Industries | **One sector for now: Oil & gas and industrial services** (contractors, EPC, maintenance, supply and logistics, HSE, field operations). Only ABP Continental may be named (already published). Page built so sectors can be appended |
| Quotation request | **Scope + timeline + optional budget range** (bands DRAFT for owner to set; blank allowed). Reverses the earlier "no budget field" decision; recorded in `EnquiryForm.tsx` header and DESIGN-DECISIONS.md |
| Structure (assumption) | `/services` parent with `/services/digital-presence` and `/services/advanced-solutions`; `/work` → `/projects` with 301s; `/industries` new; `/fr/*` mirror of every page |
| Copy (assumption) | Claude drafts Services / Digital Presence / Advanced Solutions / Industries copy and all French copy from the brief + existing content, **marked DRAFT in content files for owner approval**; no facts invented (no clients, dates, prices, results, team) |
| Workflow | Tag `v1.0-launch` on current main, branch `redesign`, PRs in order below, Netlify branch deploy for review, merge when Definition of Done is met. The e-commerce client deadline is a separate repo and priority; nothing here touches it |

## Requirements & task register (extracted from the brief)

Status key: ☐ todo · ◐ needs owner input · ✔ exists already

### 1. Design & interaction

- ☐ R1.1 Animation 01: card-shuffle scroll stack (Framer University "Card Shuffle Scroll Animation", demo card-shuff.learnframer.site)
- ☐ R1.2 Animation 02: inverted custom cursor (Framer University "Inverted Custom Cursor")
- ☐ R1.3 Scrolling effect / workflow cards: n8n.io-style animated workflow canvas + template cards
- ◐ R1.4 Calibrate all three against live references
- ☐ R1.5 Adapt to Recalibre identity (tokens, radii 30/24/20, Geist, seam cards)
- ☐ R1.6 60fps on desktop and mobile; reduced-motion fallbacks; WCAG 2.2.2 pause for loops
- ☐ R1.7 No new animation elsewhere (keep Rise / InView / picture tiers only)

### 2. Visual content

- ☐ R2.1 Hero visual (code-built technical composition in navy/cobalt; AI texture plate optional, approval-gated)
- ☐ R2.2 Service visuals: one per service category (SVG illustrations)
- ☐ R2.3 Technology visuals: interfaces, dashboards, workflows (HTML-built mock-ups + workflow canvas)
- ✔/☐ R2.4 Project visuals: real screenshots exist for OPS, Contraxis, Belkofski, ABP (`public/img`); re-plate for new palette
- ☐ R2.5 Process visuals: 3-stage engagement diagram (reuse `lib/diagram.ts` bezier/port patterns)
- ◐ R2.6 Team/office photographs: only if the owner supplies them; never generated
- ☐ R2.7 Motion content: CSS/SVG demonstrations (workflow execution loop, dashboard live states)
- ☐ R2.8 Background elements: dot grid, hairline textures, AI abstract plates (approval-gated)
- ☐ R2.9 No generic AI business stock imagery (enforced in approval gate)

### 3. Structure (EN + FR; AR later)

- ☐ R3.1 Home · ☐ R3.2 About · ☐ R3.3 Services · ☐ R3.4 Digital Presence · ☐ R3.5 Advanced Solutions
- ☐ R3.6 Projects (from Work, 301s) · ◐ R3.7 Industries (sector list needs owner) · ☐ R3.8 Contact + quotation request
- ☐ R3.9 Insights kept secondary · ☐ R3.10 Full French mirror `/fr/*` with switcher that maps the current page
- ☐ R3.11 Arabic-ready: `<html dir>`, logical CSS properties where cheap; not shipped now

### 4. Technical & discoverability

- ☐ R4.1 SEO titles/descriptions per page per locale · ☐ R4.2 Semantic HTML audit (one h1, landmarks, lists)
- ☐ R4.3 sitemap.xml with hreflang alternates incl. `/fr/*` · ☐ R4.4 robots.txt (allow GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.)
- ◐ R4.5 Google Search Console: `metadata.verification.google` hook; owner supplies token and submits sitemap
- ☐ R4.6 Schema.org: Organization (+logo, sameAs), WebSite, WebPage + BreadcrumbList, Service, FAQPage, Article (+dates), CreativeWork for projects
- ☐ R4.7 NAP / organization consistency (one source: `content/site.ts`) · ☐ R4.8 Internal linking (services ↔ projects ↔ industries ↔ insights)
- ☐ R4.9 Mobile responsiveness at 390 / 810 / 1440 (+ `short:` heights) · ☐ R4.10 Core Web Vitals budgets (LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms)
- ☐ R4.11 Image optimization (AVIF/WebP via next/image, sizes audited) · ◐ R4.12 GA4 + conversion events (`enquiry_submit`, `quotation_request`); owner supplies Measurement ID
- ☐ R4.13 AI-search discoverability: `/llms.txt`, clean text, FAQ schema, descriptive meta · ☐ R4.14 Indexing/crawlability (canonicals per locale, x-default, no noindex leaks)

### 5. Claude as development engine (rules)

- Analyze before modifying ✔ (done); never replace approved designs/branding/functionality arbitrarily; preserve working version (tag) before major changes; GitHub PRs for every change.

### 6. Preparation checklist

- A. Existing assets: ✔ source code · ✔ images (`assets/`, `public/img`) · ✔ service descriptions (`home.ts` CAPABILITIES, `about.ts`) · ✔ project screenshots · ◐ logo SVG (only `///` mark in `app/icon.svg`; wordmark SVG needed from owner) · ◐ brand identity PDF · ◐ previous proposals/company docs
- B. New assets: ☐ three references measured · ☐ hero visual · ☐ service illustrations · ☐ dashboard mock-ups · ☐ project presentation images · ◐ company photography
- C. Dev setup: ✔ Claude · ✔ local clone with push · **☐ Node 22, npm 10 (not installed on the Mac as of 3 Nov)** · ✔ Netlify access · ◐ Domain/DNS (owner) · ◐ GSC + GA4 access (owner)

### 7–8. Execution order and Definition of Done → see "PR sequence" and "Verification" below.

## Workstream 0 — Ship main now (hygiene + deploy)

Branch `chore/hygiene` → PR → merge → deploy. Files:

- Install Node 22 on the Mac (nvm or Homebrew), `npm ci`, confirm `typecheck`, `lint`, `check:images`, `build` pass on `main` before touching anything.
- `pnpm-lock.yaml` delete; `package.json`: name `recalibre-site`, add `"packageManager": "npm@10"`, add `"engines": {"node": ">=20.9"}`
- `next.config.ts`: add `Strict-Transport-Security` staged: `max-age=604800` now, raised to `max-age=63072000; includeSubDomains` in the launch PR once the apex has served HTTPS without incident (no `preload`); update header comment. Netlify already serves `max-age=31536000` at the edge; the code header makes it portable.
- `src/app/fr/page.tsx`: remove the bogus empty `generateStaticParams`; `src/app/globals.css` ~1322: fix mojibake comment
- `src/lib/seo.ts`: `pageMeta` must emit `alternates.languages` (en/fr/x-default) and add `/fr` to `ROUTES`; `sitemap.ts` picks it up
- Netlify: verify `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` exist (names only; never echo values); if missing → owner action list
- Deploy: owner connects Git CD in Netlify UI (preferred, 2 min) **or** `netlify deploy --prod --build` from the Mac (warn: manual deploys are replaced by the next Git push once CD is connected)
- Tag `v1.0-launch` on the merged commit; create `redesign` branch from it

## Architecture

### A. Bilingual routing (EN at root, FR under `/fr`, AR-ready) — no middleware, no rewrites

- **Two root layouts sharing one shell** (verified approach): `app/(en)/layout.tsx` and `app/fr/layout.tsx` each
  render `<html lang=… dir=…>` server-side and call a shared `src/components/RootShell.tsx` (fonts, curtain, Nav,
  Footer, MotionConfig, consent, cursor, JSON-LD). English routes live in `app/(en)/**` (URLs unchanged), French in a
  thin tree `app/fr/**` whose page files only pick a locale:
  `app/fr/about/page.tsx` = `export const metadata = aboutMeta('fr'); export default () => <AboutView locale="fr"/>`.
  Page bodies move into `src/views/*View.tsx` (HomeView, AboutView, ServicesView, DigitalPresenceView,
  AdvancedSolutionsView, ProjectsView, ProjectView, IndustriesView, ContactView, InsightsView, ArticleView, LegalView),
  each taking `locale`. Dynamic routes share `generateStaticParams` from the content lists. A language switch is a
  full document load (acceptable; the curtain is suppressed for same-site referrers). 404: a `[...rest]` catch-all per
  group renders the branded not-found in its own language (`experimental.globalNotFound` avoided).
  A `scripts/check-routes.mjs` guard fails the build if the two trees diverge.
- `PUBLISHED_LOCALES` gate: FR routes build from day one but carry `robots: noindex` and are left out of the sitemap
  until the owner's French review flips `PUBLISHED_LOCALES` to `['en','fr']`.
- Draft gate: content blocks drafted by Claude carry `draft: true`, render a visible `DraftBadge` on previews, and
  `scripts/check-drafts.mjs` fails a production build while any remain.
- `src/lib/i18n.ts`: `type Locale = 'en' | 'fr'` (`'ar'` reserved), `localePath(locale, path)`, `counterpart(pathname)`,
  `localeFromPath(pathname)`, `dir(locale)`, `ogLocale(locale)`.
- **Content**: existing files keep the types and the EN objects; add `src/content/fr/*.ts` mirrors typed against shared
  interfaces (`satisfies HomeContent` etc.), and `src/content/index.ts` → `getContent(locale)`. New `content/ui.ts`
  holds every string currently hard-coded in components (Nav, Footer, EnquiryForm, api route sentences, contact page,
  not-found, project/article labels, LegalPage, Engagement, MarkRow, diagram captions). Slugs stay identical across
  locales (French slugs are a later enhancement).
- **Locale plumbing**: each root layout passes `locale` into `RootShell`; a `LocaleProvider` context serves client
  components (Nav, Footer, EnquiryForm, cursor labels); server views receive `locale` as a prop.
- **Switcher**: EN/FR links go to `counterpart(pathname)`; `lib/origin.tsx` compares against `localePath(locale,'/contact')`.
- **API**: `api/contact` accepts `locale` ('en'|'fr', validated) to pick error sentences and the no-JS page language.
- Arabic later: add `'ar'`, `dir='rtl'`, Geist Arabic subset or a second face, logical CSS properties pass.

### B. Page architecture & redirects (EN shown; every route mirrored under `/fr`)

| Route | Built from | New content |
|---|---|---|
| `/` | Hero (headline + **large n8n-style WorkflowCard**), MarkRow/PartnerStage, Positioning, **Services band = CardShuffle deck** (5 service cards → `/services/*`), Projects grid, Spotlight OPS, Principles, Engagement, Insights, FAQ | hero copy refresh |
| `/about` | existing About + `ProcessDiagram` (3 stages) | — |
| `/services` | new: two families (Digital Presence, Advanced Solutions) mapping the five existing capabilities; `ServiceIllustration` per service; quotation CTA | `content/services.ts` (DRAFT) |
| `/services/digital-presence` | websites & platforms, business digitalization, brand & digital identity, product/experience design; links Belkofski, ABP | DRAFT |
| `/services/advanced-solutions` | agentic AI & automation, enterprise integration, custom systems; `WorkflowCanvas` demo + 3–4 `WorkflowCard` "example workflow patterns" (never presented as deployments); links OPS, Contraxis | `content/workflows.ts` (node specs) |
| `/projects`, `/projects/[slug]` | `/work*` renamed; `CreativeWork` JSON-LD | — |
| `/industries` | one sector: Oil & gas and industrial services (contractors, EPC, maintenance, supply & logistics, HSE, field operations); ABP + OPS links | `content/industries.ts` (DRAFT) |
| `/contact` | `EnquiryForm` with mode toggle Enquiry / **Request a quotation** (`?type=quotation` deep link); quotation adds service select, scope, timeline (existing), optional budget-range select (bands DRAFT) | `enquiry.ts` + API + email + privacy |
| `/insights`, `/insights/[slug]` | kept; `inLanguage` added; no invented dates | — |
| `/privacy`, `/terms` | updated for GA4, consent, quotation fields; REVIEWED = change date | — |
| `/llms.txt`, `robots.txt`, `sitemap.xml`, `manifest` | route handlers | — |

- `next.config.ts` `redirects()`: `/work` → `/projects`, `/work/:slug` → `/projects/:slug`, and `/fr/work*` likewise (308/301 permanent).
- Nav: Home · About · Services (mobile menu lists the two sub-pages) · Projects · Industries · Insights (secondary weight) · pill "START A CALIBRATION"; hero and service pages carry "REQUEST A QUOTATION". Footer adds Services sub-links and "Cookie settings".
- Internal-link rule: every service page links ≥ 2 projects + the industry page; every project links its services; every insight links one service.

### C. Design tokens (navy / cobalt / grey)

Verified with a WCAG contrast script (ratios measured, not estimated). Targets: ≥ 4.5:1 text, ≥ 3:1 UI.

| Token | Current | New | Measured |
|---|---|---|---|
| `--color-ground` | `#050505` | `#06080f` cool near-black | — |
| `--color-raised` | `#101010` | `#0b1020` deep navy | — |
| `--color-raised-2` | `#1a1a1a` | `#121a33` navy | — |
| `--color-accent` (fill under white text) | `#2b4a9e` | `#1e3fae` deep cobalt | white on it 8.83:1 |
| `--color-accent-bright` (marks/links on dark) | `#8aa4ec` | `#4f7cff` electric cobalt | 5.39 on ground, 5.10 on raised, 4.63 on raised-2; 3.71 on white (UI only) |
| `--color-signal` | `#8aa4ec` | `#4f7cff` dark; `.theme-light` → `#1e3fae` | 7.89 on `#f2f2f2` |
| `--color-ink-2` | white α .6 | `#9aa3b5` cool grey | 7.89 on ground (was 7.33) |
| `--color-ink-3` | white α .5 | `#7b8396` | 5.27 on ground (was 5.30) |
| `.theme-light` ink-2 / ink-3 | black α .6 / .5 | `#4b5365` / `#5a6276` | 7.71 / 6.10 on white |
| `--color-rule*` | white α .10/.06/.14 | `rgba(170,185,220,.12/.07/.18)` cool-tinted hairlines | n/a (decorative) |
| `--color-flare` | `#ff4500` | keep (errors only) | — |
| `themeColor` / manifest | `#050505` | `#06080f` | — |

Rule kept from the current system: light blue never carries small text on white panels; `.theme-light` swaps `signal` to the deep cobalt.
Hard-coded colour sites to migrate to tokens: `SystemDiagram.tsx` constants, `.hub-*` block, `.cap-*` veils, `.t-read`, `EnquiryForm` error borders, curtain glow, select chevron data-URI, `manifest.ts`/`layout.tsx` themeColor, `text-white` ×5.

### D. The three interactions (with `motion`)

Install `motion` (12.x). Root layout gets a client `<MotionProvider>` = `<MotionConfig reducedMotion="user">`.
Reuse: `useReducedMotion`, `useMedia`, `useHydrated`, `useCurtainUp` from `src/lib/motion.tsx`; `bez`/`pointAt` from `src/lib/diagram.ts`; `Img`/`ArtImg`; `Btn`/`MonoLink`/`Chip`/`LabelRow`.

1. **`src/components/fx/CardShuffle.tsx`** (client) — props `{cards: {title, body, href, art}[], vhPerCard=90}`.
   Section `relative` with height `max(300vh, N×90vh)` (250vh on `mobile:`), sticky `100svh` stage.
   `useScroll({target, offset:['start start','end end']})` → per card `useTransform` of progress into y / rotate /
   scale / zIndex with shuffle-to-back maths (progress×N → step + t; front card lifts −120 % and rotates −12°, drops
   behind at t = 0.5; others advance one depth slot: y −16 px·d, scale 1 − 0.05·d, alternate ±2°·d). Server renders the
   static stack (front card on top) so there is no CLS; `will-change: transform` on the moving cards only.
   Reduced motion → static fanned stack, cards still linkable. Placement: Home services band.
2. **`src/components/fx/InvertedCursor.tsx`** (client) — mounted as the **last direct child of `<body>`** (outside
   `<main>`, so no isolating ancestor). 32 px white disc, `mix-blend-mode: difference`, `position: fixed`,
   `pointer-events: none`, `z-index: 9999`. `useMotionValue` x/y → `useSpring({stiffness: 400, damping: 30, mass: 0.5})`;
   scale 2.5 over `a, button, [role=button], [data-cursor=grow]`, 0.8 on pointerdown; hidden until first `pointermove`,
   while the curtain is up, over `input/textarea/select` (native text cursor kept), on `(hover: none)`/`(pointer: coarse)`,
   and under reduced motion. `html.cursor-on` (added only when active) sets `cursor: none` on fine pointers, so no-JS
   and touch keep the native cursor. Adds nothing to layout; zero CLS.
3. **`src/lib/workflow.ts`** (pure) generalises `lib/diagram.ts`: `WorkflowSpec {nodes: {id, kind:'trigger'|'step'|'ai'|'end', icon, label, sub?, col, row}[], edges: {from, to, dashed?}[]}` → absolute layout + bezier paths + ports.
   **`src/components/fx/WorkflowCanvas.tsx`** — server-rendered static SVG edges + HTML node tiles (rounded 12 px,
   trigger nodes pill-left, icon tile + label), dot-grid canvas, then a client `WorkflowRunner` that plays a
   sequential execution (node `running` ring → `done` check; cobalt pulse along the edge via `motion.circle`
   `offsetDistance 0→100 %`). Runs only while `useInView` is true, loops with a 1.5 s rest, has a visible 44 px
   **Pause motion** button (`aria-pressed`) per WCAG 2.2.2, and is fully static (all nodes `done`, no pulses) under
   reduced motion. **`src/components/fx/WorkflowCard.tsx`** — template card: chain of icon tiles joined by short
   connectors, title, meta, `whileHover={{y:-3}}` + border brighten; `size="hero"` variant embeds a `WorkflowCanvas`.
   Placement: hero (card only), Home services band, `/services/advanced-solutions`.

- Record the revisions: new dated section in `DESIGN-DECISIONS.md` (library added; cursor follower and in-view loops
  allowed under the constraints above; GA4; budget range) and an appended note in `motion.tsx`'s header.
- Budgets: Home mobile LCP ≤ 2.5 s (hero card is DOM/SVG, no image), CLS ≤ 0.1, INP ≤ 200 ms; `motion` imported
  only in `fx/*` client islands; no scroll listeners outside `useScroll`.

### E. Visual content pipeline

- `src/components/art/`: `ServiceIllustration.tsx` (one SVG per service id, 1.5 px strokes, cobalt accents, dot grid),
  `DashboardMock.tsx` (HTML/CSS operations console built from tokens; static markup, optional live counters),
  `ProcessDiagram.tsx` (Calibration → Build → Partnership, reusing `bez`), `Texture.tsx` (procedural `feTurbulence`
  noise / grid backgrounds as build-time data URIs). All token-driven, so a palette change re-skins everything.
- Project visuals: existing plates in `public/img` stay; `scripts/plates.py` gets a cool-grade pass and new `og-*`
  cards for Services, Digital Presence, Advanced Solutions, Industries; `npm run images` regenerates the manifest.
- AI plates (when Higgsfield credits exist): `generate_image` with abstract technical prompts in navy/cobalt →
  `assets/ai/` → `plates.py` recipe (grade + grain) → `public/img/tex-*.jpg`. Gate: each candidate is sent to the
  owner for approval before any reference lands in code; `check:images` keeps the manifest honest.
- `next.config.ts` `images.formats = ['image/avif', 'image/webp']`; `sizes` audit on every `Img`/`ArtImg`. Next 16 caveat: `images.qualities` defaults to `[75]`, so any caller passing `quality={86}` must have that value listed or the build fails.
- Shared geometry: extract `bez`/`pointAt` from `lib/diagram.ts` into `src/lib/geometry.ts`, used by SystemDiagram, PartnerStage and the new WorkflowCanvas, with a `PROVENANCE.md` entry (source, approval date) for every AI plate.

### F. SEO / structured data / analytics

- `src/lib/seo.ts`: `pageMeta({…, locale})` → canonical per locale, `alternates.languages` {en, fr, x-default→en},
  `openGraph.locale` + `alternateLocale`; `ROUTE_ENTRIES` for both locales feed `sitemap.ts` (with
  `alternates.languages`) and the hreflang check script.
- `robots.ts`: allow `/`, disallow `/api/`; explicit `Allow` for GPTBot, ChatGPT-User, ClaudeBot, anthropic-ai,
  PerplexityBot, Google-Extended, Applebot-Extended, CCBot. `app/llms.txt/route.ts`: company, services, projects,
  contact, EN/FR links.
- `src/components/JsonLd.tsx` additions: `OrganizationLd` + `logo` (`/icon-512.png`), `WebSiteLd` (`inLanguage`),
  `BreadcrumbListLd` on nested pages, `ServiceLd` per service page (provider → Organization `@id`, `areaServed: DZ`),
  `FAQPageLd` where a FAQ renders, `ArticleLd` + `inLanguage` (dates only if the owner supplies them),
  `CreativeWorkLd` per project. LinkedIn stays out of `sameAs` unless the owner says otherwise.
- Search Console: `metadata.verification.google = process.env.GOOGLE_SITE_VERIFICATION` (server-side env, all Netlify contexts; owner pastes the token). `NEXT_PUBLIC_GA_ID` is set for the production context only, so previews never report into the live property.
- Re-verify Google's current Consent Mode v2 parameter names and gtag CSP hosts against Google's docs before the analytics PR ships.
- GA4 (basic consent mode: nothing loads before consent): `src/components/Consent.tsx` banner (Accept / Decline,
  44 px targets, `localStorage['recalibre.consent']`, footer "Cookie settings" reopens it); on accept render
  `<GoogleAnalytics gaId={NEXT_PUBLIC_GA_ID}/>` from `@next/third-parties/google` with
  `gtag('consent','default',{analytics_storage:'granted', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'})`.
  Events via `sendGAEvent`: `enquiry_submit {form, type}` and `quotation_request`. CSP (only when the ID is set):
  `script-src` + `https://www.googletagmanager.com`; `connect-src` + `https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com`;
  `img-src` + `https://*.google-analytics.com https://*.googletagmanager.com`.
- `content/legal.ts`: privacy text for GA4, consent, retention, quotation fields; `REVIEWED` set to the change date.

### G. Ultra-modern layer — what moves the site from "clean" to "final level"

The current site is restrained and editorial: one hero photo, flat white panels, three entrance fades. A 2026 premium
studio site (tbd®, Linear, Vercel, n8n) adds depth, responsiveness to the pointer, continuity between pages, and a
sense that the system is live. Every item below is **hover, press, scroll or navigation feedback, or ambient at
≤ 2 % CPU and paused under reduced motion**, which keeps the owner's rule "avoid unnecessary animations elsewhere".

Global

1. **Page transitions**: React View Transitions (`experimental.viewTransition` in Next 16): 250 ms crossfade between
   routes, shared-element morph from a project card cover to the project page hero. Instant under reduced motion.
2. **Navigation**: nav condenses into a floating glass pill on scroll (`backdrop-filter` + `color-mix` tint),
   Services opens a mega-panel with the two families and live mini workflow chains, and a **⌘K / Ctrl-K command
   palette** searches pages, services, projects and insights in EN/FR from a static index (keyboard-first, 44 px rows).
3. **Surfaces**: bento compositions for Services overview and About facts; glass panels on navy; hairline cool
   rules; **spotlight hover** (pointer-tracked radial highlight on card borders); ≤ 4° tilt on project cards;
   **magnetic primary CTA**; status dots that say exactly what is true ("in development", "delivered").
4. **Ambient field**: procedural gradient mesh + grain (CSS `@property` animated angles, GPU-only), dot grid, a slow
   light sweep across the hero card. One `prefers-reduced-motion` switch stops all of it.
5. **Typography**: Geist stays; **Geist Mono reinstated for technical labels and metadata** (owner choice, the
   reference's own pairing; flagged for approval); oversized display with `text-wrap: balance`; the existing masked
   line reveals.
6. **Live facts**: local time and place readout ("Hassi Messaoud · 14:32 GMT+1") in nav and footer; build year;
   current deploy status chip in footer ("v2 · built 3 Nov 2026") from `BUILD_YEAR`-style env at build.
7. **Loader**: curtain kept, recoloured, capped at 900 ms. **404**: a workflow card whose last node reads "route not found".

Per page

- **Home**: locked n8n hero card on the ambient field; services shuffle deck; projects as a bento with hover-preview
  media; OPS spotlight with live-state mock (counters tick only on hover); partner hub kept.
- **Services**: bento overview of the two families; each service row pairs an SVG illustration with a micro-demo on hover.
- **Digital Presence**: device-frame showcase (laptop + phone) of the ABP and Belkofski sites with scroll parallax;
  "what you receive" list; process strip.
- **Advanced Solutions**: full-width WorkflowCanvas; integration categories as chips (ERP, CRM, email, spreadsheets,
  SMS, field devices) without naming vendors as clients; Contraxis document-intelligence simulation (typed extraction →
  proposed action → "a person decides").
- **Projects**: filterable grid by discipline (existing `WORK_INDEX`), case pages as scrollytelling (media pinned,
  text scrolls), mobile horizontal scroll-snap gallery, only published facts.
- **Industries**: interactive oil & gas value-chain diagram (upstream, midstream, downstream, support services) where
  hovering a segment shows which Recalibre systems apply; one sector, built to append more.
- **About**: accountability block kept, principles, process diagram, "how we are organized" bento; no founding date.
- **Contact**: two-step quotation configurator with a live summary panel and deep links from every CTA; coordinates
  card kept (no third-party map embed).
- **Insights**: reading progress, table of contents, related service links.

Modern-standards benchmark (part of the Definition of Done)

| Metric | Target |
|---|---|
| Lighthouse mobile, Home | Performance ≥ 95; Accessibility, SEO, Best Practices = 100 |
| Core Web Vitals (lab, 4× CPU throttle) | LCP ≤ 2.0 s, CLS ≤ 0.05, INP ≤ 200 ms with cursor and canvas active |
| First-load JS per route | ≤ 180 KB gzip (motion only in `fx/*` islands) |
| Images | AVIF/WebP, correct `sizes`, no image > 200 KB above the fold |
| Accessibility | WCAG 2.2 AA; keyboard path through palette, menu, deck, form; pause control on loops |
| SEO | Rich Results valid for Organization, WebSite, Breadcrumb, Service, FAQ, Article; complete hreflang pairs + x-default; zero noindex leaks |
| Resilience | every page readable with JS off; form posts without JS; strict CSP still enforced |
| Ops | GitHub Actions CI (typecheck, lint, check:images, build, Playwright smoke) on every PR; Netlify preview per PR; production from main |

## PR sequence (mapped to the owner's 10 phases)

| # | Branch / PR | Owner phase | Contents |
|---|---|---|---|
| 0 | `chore/hygiene` | 1 | Workstream 0 above; visual + Lighthouse baseline audit of every route; GitHub Actions CI; deploy main; tag `v1.0-launch` |
| 1 | `redesign/foundation` | 2 | `motion` dependency, i18n scaffolding, locale-aware `seo.ts`, redirects `/work→/projects`, nav/footer structure, DESIGN-DECISIONS.md revisions, GA4 + consent (behind env `NEXT_PUBLIC_GA_ID`) |
| 2 | `redesign/tokens` | 4 | Palette tokens, hard-coded colour migration, Geist Mono labels (if approved), ambient field, re-plated images, hero direction |
| 3 | `redesign/interactions` | 5 | CardShuffle, InvertedCursor, WorkflowCanvas + WorkflowCard components, reduced-motion, pause control |
| 3b | `redesign/modern-layer` | 5 | View Transitions, glass nav pill + mega-panel, command palette, spotlight hover, magnetic CTA, live time readout, 404 card |
| 4 | `redesign/home` | 4–6 | New Home composition using the three interactions, hero visual, projects bento |
| 5 | `redesign/services` | 7 | Services, Digital Presence, Advanced Solutions pages + content (DRAFT) + service illustrations + dashboard mock-ups |
| 6 | `redesign/projects-industries` | 7 | Projects (from Work), Industries (DRAFT), About refresh, process diagram |
| 7 | `redesign/contact-quote` | 7 | Quotation request path in form + API + email + privacy text; GA4 events |
| 8 | `redesign/french` | 7 | Full FR content files, switcher, FR metadata, sitemap alternates |
| 9 | `redesign/seo-ai` | 9 | JSON-LD set, llms.txt, robots AI crawlers, GSC hook, OG images, internal-link pass |
| 10 | `redesign/qa` | 8–10 | Responsive pass, CWV, a11y, no-JS, Lighthouse, final merge to main, deploy |

## Verification (every PR)

```bash
npm ci && npm run typecheck && npm run lint && npm run check:images && npm run build
```

- Playwright screenshots at 390 / 810 / 1440 (and 1440×640 `short:`), light and dark panels, FR and EN
- `prefers-reduced-motion: reduce` run: no travel, loops static, cursor hidden
- JS disabled: every page readable, form posts to `/api/contact`
- hreflang/canonical check on every route (script over `sitemap.xml`), Schema validation (Google Rich Results test or `schema-dts` typing), Lighthouse against the benchmark table in section G (Performance ≥ 95 mobile Home; 100 on the other three)
- Bundle check per route (`next build` output ≤ 180 KB gzip first load), 4× CPU-throttled scroll trace with cursor and canvas active (INP ≤ 200 ms, no long tasks > 50 ms during the shuffle)
- GA4 DebugView: `page_view` only after consent, `enquiry_submit`, `quotation_request`
- Final: Netlify deploy preview reviewed by owner → merge → production deploy → Search Console sitemap submit (owner)

## Owner inputs needed (do not block; DRAFT placeholders until supplied)

1. Final service catalogue and Industries list (Claude drafts; owner approves)
2. French review of drafted copy
3. GA4 Measurement ID; Search Console verification token
4. Resend: verify `recalibre.cloud` domain and set the three env vars in Netlify (or confirm they exist)
5. Wordmark SVG + brand identity PDF; any photography
6. Approval of each AI-generated texture plate before it ships
7. **Node 22 on the Mac** (Claude can install it via nvm on request; needs no password)
8. **Netlify Git CD** connected to `belkofski/recalibre` `main` (Netlify UI, owner's account) so production follows main
