/**
 * CONTENT SLOTS
 *
 * The layout geometry is measured from the reference. The words are not: none of
 * the reference's copy appears here, and none of its photographs are used —
 * every image is a locally generated neutral plate at the measured intrinsic
 * size (measure/genph.mjs).
 *
 * RECALIBRE's content book (_MASTER/03-VOICE.md) and FACTS (02-FACTS.md) forbid
 * invented claims, so no marketing sentence is written here either. Each slot is
 * a bracketed label plus neutral filler whose length was found by MEASURING the
 * wrap at the reference's box width and type role, so the slot occupies exactly
 * the number of lines the reference runs there (measure/gen-slots.mjs).
 *
 * Replace `text` with your copy. `box` is the measured constraint it has to fit.
 */

import { SLOT_TEXT as T } from './slots.generated';

export type Slot = { text: string; box: string };
const slot = (text: string, box: string): Slot => ({ text, box });

export const FACTS = {
  company: 'RECALIBRE',
  founder: 'Saidi Fadi Abdelhakim',
  founderRole: 'Founder and CEO',
  base: 'Hassi Messaoud, Algeria',
  email: 'a.hakim@recalibre.cloud',
  phone: '+213 655 770 259',
  /** Verbatim formula, charter rules 90 and 91. Do not paraphrase. */
  firmFormula:
    'Principal-led. Senior-only. The person who scopes your system is the person who builds it. No juniors, no handoffs.',
} as const;

export const NAV = {
  /**
   * REAL LABELS, REAL DESTINATIONS. Everything on this site is one page, so
   * every nav item is an in-page anchor. Nothing here points at a route that
   * does not exist.
   *
   * The reference's link widths were 40.7 / 58.47 / 87.14 / 53.5 at 15px. Real
   * words are not those widths, so the nav row is the one place on the page
   * where measured geometry gives way to content — deliberately, because a nav
   * that reads "[B] older" is not a nav.
   */
  links: [
    { label: 'About', href: '#about' },
    {
      label: 'Capabilities',
      href: '#capabilities',
      children: [
        { label: 'AI and automation', href: '#capabilities' },
        { label: 'Software and systems', href: '#capabilities' },
        { label: 'Design and brand', href: '#capabilities' },
      ],
    },
    { label: 'How we work', href: '#how' },
    { label: 'Products', href: '#products' },
  ],
  cta: { label: 'Get in touch', href: '#contact' },
  /**
   * The measured mega panel. It renders at opacity 0 in the reference and never
   * becomes visible in any state — reproduced for DOM fidelity only. Its words
   * and links are real anyway: invisible text is still indexed, and an
   * invisible link to a page that does not exist is still a broken link.
   */
  mega: {
    title: slot('What we do', '666×24 · 16/24 w500'),
    items: [
      { icon: '/img/icon-a.png', w: 35, h: 35,
        title: slot('AI and automation', '606×17.59 · 16/17.6 w500 ls-0.32'),
        body: slot('Agents that work inside your processes.', '606×19.59 · 14/19.6') },
      { icon: '/img/icon-b.png', w: 38, h: 38,
        title: slot('Software and systems', '606×17.59 · 16/17.6 w500 ls-0.32'),
        body: slot('Platforms built around how you operate.', '606×19.59 · 14/19.6') },
      { icon: '/img/icon-c.png', w: 34, h: 36,
        title: slot('Design and brand', '606×17.59 · 16/17.6 w500 ls-0.32'),
        body: slot('Experiences and identity that hold up.', '606×19.59 · 14/19.6') },
    ],
    feature: {
      title: slot('Start with a Calibration', '372×28.8 · 24/28.8 ls-0.96 white'),
      body: slot(
        'A short first engagement that maps how you operate today and defines the transformation opportunity.',
        '372×58.78 · 14/19.6 · 3 lines',
      ),
    },
  },
} as const;

export const HERO = {
  /**
   * REAL COPY, fitted to the measured boxes. Both the headline and the sub
   * WRAP NATURALLY inside their measured max widths (764 and 540) — SplitText
   * splits the headline on spaces, so a hard newline would land inside a word
   * span and break the per-word reveal. The copy is written to the box
   * instead: the headline turns after "operations," at 72px/-4.32, the sub
   * runs to two lines at 18px.
   *
   * The two button labels are the one place the hero drifts from the
   * reference: measured at 85.06 and 139.22, real labels are ~96 and ~131, so
   * the first pill grows ~11px. Buttons are padded, not fixed, so nothing
   * around them moves.
   */
  headline: slot('Complex operations, made coherent.', 'maxW 764 · h158.41 · 72/79.2 w400 ls-4.32 · 2 lines'),
  sub: slot(
    'Strategy, design, AI, automation and software engineering, delivered as one integrated capability.',
    'maxW 540 · h50.41 · 18/25.2 · 2 lines',
  ),
  primaryCta: slot('Get in touch', 'button 155.06×50.41 · label 85.06 · 16/22.4 w500'),
  secondaryCta: slot('See the products', 'button 179.22×50.41 · label 139.22 · 16/22.4 w500'),
  footLeft: slot(FACTS.base, '575×19.59 · 14/19.6 · 1 line'),
  footRight: slot('Strategy · Design · Technology', '575×19.59 · 14/19.6 · right · 1 line'),
} as const;

export const PILLARS = {
  eyebrow: slot('[EYEBROW]', '560×19.59 · 14/19.6 w600 ls0.84 uppercase'),
  heading: slot(T.pillarsHeading, 'maxW 560 · h114.41 · 52/57.2 · 2 lines'),
  /** FOUR items, 116px each, 50px apart (166 pitch). */
  items: (['I', 'II', 'III', 'IV'] as const).map((n) => ({
    n,
    title: slot(T.pillarsItemTitle, '560×24 · 20/24 ls-0.4 · 1 line'),
    body: slot(T.pillarsItemBody, '560×24 · 16/24 · 1 line'),
  })),
  card: {
    name: slot(T.pillarsCardName, '275.89×24 · 20/24 · 1 line'),
    role: slot(T.pillarsCardRole, '275.89×16.8 · 12/16.8 w500 ls0.72 uppercase'),
    cta: slot(T.pillarsCardCta, '106.11×22.41 · 16/22.4 w500'),
  },
} as const;

export const SERVICES = {
  eyebrow: slot('[EYEBROW]', '1160×19.59 · uppercase'),
  heading: slot(T.servicesHeading, 'maxW 696 · h114.41 · 52/57.2 · 2 lines'),
  /** THREE cards on FIXED 380px tracks. A fourth wraps — see REPORT.md Q1. */
  cards: [
    { img: '/img/case-1.png', w: 3598, h: 5325 },
    { img: '/img/case-2.png', w: 5300, h: 3975 },
    { img: '/img/case-3.png', w: 5418, h: 3612 },
  ].map((c) => ({
    ...c,
    title: slot(T.servicesCardTitle, '332×28.8 · 24/28.8 ls-0.96 · 1 line'),
    body: slot(T.servicesCardBody, '380×48 · 16/24 · 2 lines'),
  })),
} as const;

export const FRAMEWORK = {
  eyebrow: slot('[EYEBROW]', '1160×19.59 · uppercase'),
  heading: slot(T.frameworkHeading, 'maxW 744 · h114.41 · 52/57.2 · 2 lines'),
  /** SIX steps, 3×2 grid of fixed 348px tracks, row gap 80, column gap 58. */
  steps: Array.from({ length: 6 }, () => ({
    title: slot(T.frameworkStepTitle, '346×24 · 20/24 · 1 line'),
    body: slot(T.frameworkStepBody, '346×72 · 16/24 · 3 lines'),
  })),
} as const;

export const CASES = {
  /** The ONLY centred head on the page. */
  eyebrow: slot('[EYEBROW]', '1160×19.59 · centred'),
  heading: slot(T.casesHeading, 'maxW 744 · h114.41 · 52/57.2 · centred · 2 lines'),
  plates: [
    { img: '/img/wide-1.png', w: 2400, h: 1390 },
    { img: '/img/wide-2.png', w: 8140, h: 5427 },
  ].map((p) => ({
    ...p,
    title: slot(T.casesPlateTitle, '410×28.8 · 24/28.8 · 1 line'),
    body: slot(T.casesPlateBody, '410×192 · 16/24 · 8 lines'),
    link: slot(T.casesLink, '104.73×21 · 16/17.6 w500'),
  })),
  /**
   * A third child of the body, measured ONLY below 1200px: a full-width 130-tall
   * white card (padding 12px, align-items end, justify space-between) carrying
   * the 20x20 arrow pair and a 16/22.4 w500 label. Absent at 1200px+.
   */
  narrowCard: slot('[SEE ALL]', '<col>x130 · label 704x22.41 · 16/22.4 w500'),
} as const;

export const APPROACH = {
  eyebrow: slot('[EYEBROW]', '550×19.59 · uppercase'),
  heading: slot(T.approachHeading, 'box 550 (maxW 594) · h171.61 · 52/57.2 · 3 lines'),
  /** THREE rows; row 1 open. Open 184.8, closed 52.8. */
  rows: (['1', '2', '3'] as const).map((n) => ({
    n,
    title: slot(T.approachRowTitle, '270×28.8 · 24/28.8 · 1 line'),
    body: slot(T.approachRowBody, '550×120 · 16/24 · 5 lines'),
  })),
  cardCta: slot(T.approachCardCta, '212×22.41 · 16/22.4 w500 · 1 line'),
} as const;

export const TESTIMONIALS = {
  eyebrow: slot('[EYEBROW]', '1160×19.59 · uppercase'),
  heading: slot(T.testimonialsHeading, 'maxW 774 · h114.41 · 52/57.2 · 2 lines'),
  quote1: {
    quote: slot(T.testimonialQuote, '316×143.98 · 24/28.8 · 5 lines'),
    name: slot(T.testimonialName, '296×24 · 20/24 · 1 line'),
    role: slot(T.testimonialRole, '296×16.8 · 12/16.8 uppercase'),
  },
  video: {
    label: slot(T.videoLabel, '316×24 · 16/24 w600 · centred'),
    meta: slot(T.videoMeta, '316×19.59 · 14/19.6 · centred'),
    name: slot(T.testimonialName, '296×24 · 20/24 · 1 line'),
    role: slot(T.testimonialRole, '296×16.8 · 12/16.8 uppercase'),
  },
  quote2: {
    /** Measured 316x86.39 — the second quote runs THREE lines, not five. */
    quote: slot(T.testimonialQuote3, '316×86.39 · 24/28.8 · 3 lines'),
    name: slot(T.testimonialName, '296×24 · 20/24 · 1 line'),
    role: slot(T.testimonialRole, '296×16.8 · 12/16.8 uppercase'),
  },
} as const;

export const FAQ = {
  eyebrow: slot('[EYEBROW]', '494×19.59 · uppercase'),
  heading: slot(T.faqHeading, 'maxW 494 · h114.41 · 52/57.2 · 2 lines'),
  card: {
    title: slot(T.faqCardTitle, '454×22.41 · 16/22.4 w500 · 1 line'),
    sub: slot(T.faqCardSub, '454×19.59 · 14/19.6 · 1 line'),
  },
  /** FIVE rows. Question line counts drive the closed heights: 2, 1, 2, 2, 1. */
  rows: [
    { q: slot(T.faqQ1, '520×48 · 20/24 · 2 lines'), a: slot(T.faqAnswer, '554×144 · 16/24 · 6 lines') },
    { q: slot(T.faqQ2, '520×24 · 20/24 · 1 line'), a: slot(T.faqAnswer, '554×144 · 16/24 · 6 lines') },
    { q: slot(T.faqQ3, '520×48 · 20/24 · 2 lines'), a: slot(T.faqAnswer, '554×144 · 16/24 · 6 lines') },
    { q: slot(T.faqQ4, '520×48 · 20/24 · 2 lines'), a: slot(T.faqAnswer, '554×144 · 16/24 · 6 lines') },
    { q: slot(T.faqQ5, '520×24 · 20/24 · 1 line'), a: slot(T.faqAnswer, '554×144 · 16/24 · 6 lines') },
  ],
} as const;

export const FOOTER = {
  /**
   * REBUILT. The old footer was the Elyte reference's, carried over whole: a
   * section-sized headline, a lead paragraph, a newsletter bar and a CTA card.
   *
   * All four went, because #contact now sits directly above the footer and
   * does every one of those jobs properly. The page was running two sections
   * in a row both labelled CONTACT, each with its own display headline and its
   * own way to reach the same inbox. A footer that competes with the section
   * above it is not a footer.
   *
   * What is left is what a footer is for: who you are, where to go, how to
   * reach you, and the fine print.
   *
   * The tagline is HERO.footRight, not a second copy of it — the hero foot and
   * the footer say the same three words because they are the same three words.
   */
  tagline: HERO.footRight.text,

  contactLabel: 'CONTACT',
  linksLabel: 'EXPLORE',
  links: ['About', 'Capabilities', 'How we work', 'Products', 'Contact'],
  /** Anchors matching `links`, index for index. */
  linkHrefs: ['#about', '#capabilities', '#how', '#products', '#contact'],

  /**
   * OPEN: /legal/privacy and /legal/terms still do not exist. These render as
   * plain fine print, not links — a footer link to a 404 is worse than a line
   * of text. They move to real links the day the pages do.
   */
  legal: ['Privacy', 'Terms of use'],

  copyright: '© 2026 Recalibre. All rights reserved.',
} as const;

/**
 * ABOUT — measured off the supplied COVIX screenshot (2000×1244), normalised to
 * the project's 1440 reference width (scale 0.72). Every number in About.tsx
 * carries its source measurement in image pixels beside it.
 *
 * The screenshot's own words and photographs are NOT reproduced: its quote,
 * its "50+ Happy Clients" stat and its two portraits are demo filler carrying
 * fabricated names and a fabricated metric. Slots below follow the same rule as
 * every other section — a bracketed label plus neutral filler sized to the
 * measured box.
 */
export const ABOUT = {
  /**
   * REAL COPY. The headline is the second paragraph of the company
   * description.
   *
   * SIZE OVERRIDDEN, deliberately. The reference sets this at 36px/w400, which
   * made it the smallest headline on the page, sitting between a 64px and five
   * 48px section heads — a visible dip in the scale. Re-solved against Geist
   * for the same 702.72px box: 40px/w500 carries the same sentence in the same
   * four lines, longest line 702. The reference's leading-space indent on lines
   * 3 and 4 goes with it — it was a quirk of the reference's own break points,
   * and these are no longer those break points.
   *
   * The quote and the stat are NOT written. They are the two facts on this page
   * that only a real client can supply, so they read as what they are until
   * they are supplied. See PENDING in blocks-content.ts.
   */
  eyebrow: slot('ABOUT RECALIBRE', 'ink 108 · 16/19.59 w500 uppercase · black'),
  headline: {
    l1: slot('We work with organizations that have', '702 measured in Geist 40/w500 — at the box edge'),
    l2: slot('outgrown fragmented processes,', '617'),
    l3: slot('disconnected tools, or an identity', '621'),
    l4: slot('that no longer reflects them.', '531'),
  },
  cta: slot('Get in touch', 'button 120.24×46.08 · radius 8 · 16/22.4 w500'),
  quote: {
    stars: 5,
    body: [
      slot('[AWAITING CLIENT QUOTE]', '16/26 — re-solved for the 230px box'),
      slot('A real client, in their own', '180'),
      slot('words. Nothing invented goes', '216'),
      slot('in this card.', '84'),
    ],
    avatar: '/img/avatar-round.png',
    name: slot('[CLIENT NAME]', 'ink 109.4 · 16/24 w600 · black'),
    role: slot('[ROLE, COMPANY]', 'ink 149 · 14.5/22.4 · rgb(55,55,55)'),
  },
  stat: {
    value: slot('[00]', 'ink 61.9 · 33/44 w600 · black'),
    label: slot('[AWAITING FIGURE]', 'ink 102.2 · 16/24 · rgb(55,55,55)'),
    portrait: '/img/about-portrait.png',
    name: slot(FACTS.founder, 'ink 109.4 · 16/24 w600 · black'),
    role: slot(FACTS.founderRole, 'ink 149 · 14.5/22.4 · rgb(55,55,55)'),
  },
} as const;
