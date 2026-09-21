import type { ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   THE HOMEPAGE — fifteen blocks, in the reference's own order and at its own
   dimensions. Every block of tbd® is kept and none is deleted for being
   inconvenient. Where the reference holds proof Recalibre does not have, the
   block keeps its position, geometry, motion and rhythm, and its content is
   replaced with something true:

     a performance counter   -> a verified structural fact
     a price                 -> the engagement stage, scope defined later
     a testimonial           -> an operating principle, with no quote marks,
                                no name, no rating and no review label
     a client logo wall      -> marks on the register, ownership stamped
     an invented statistic   -> a fact read out of the product's own code

   WHERE THE FACTS COME FROM. Three sources and no others: the founder's
   company description of 19 September 2026, his build brief of 20-21
   September 2026, and the project records in _MASTER/03-CASE-STUDIES.

   WHAT IS NOT HERE. No client name, testimonial, rating, revenue, adoption,
   efficiency or time-saved figure. No deployment claim. No founding date. No
   availability. No price. No delivery time. No certification. No case-study
   outcome. ABP Continental appears as a mark and nowhere else.
   ========================================================================= */

/* ---------------------------------------------------------------------- 01 */
export const HERO = {
  eyebrow: 'FIVE CAPABILITIES · ONE ACCOUNTABLE TEAM',
  /** Hand-broken to the 1380px shell. Below 810px the breaks dissolve. */
  headline: ['We modernize how', 'organizations operate,', 'run and are understood.'],
  /** The lime marker. One word per heading, as the reference marks one. */
  mark: 'operate,',
  lede: 'Strategy, design, agentic AI, automation and engineering delivered as one integrated capability — not as separate suppliers coordinating across a gap.',
  ctaPrimary: { label: 'Start a conversation', href: '/contact' },
  ctaSecondary: { label: 'SELECTED WORK', href: '/work' },
  railLabel: 'STATUS: OPERATING',
  /** The statement plate at the foot of the hero. The reference prints a
   *  named client quote here; this prints the firm's own description of
   *  itself, signed by the firm. */
  plateStamp: '/ / RECALIBRE',
  plateBody:
    'ONE PROGRAM ACROSS FIVE CAPABILITIES, CARRIED BY ONE TEAM FROM THE OPERATING MODEL THROUGH TO THE SYSTEM IN USE.',
  plateSign: 'THE FIRM',
  media: '/img/plate-hero-room.jpg' as ImageSrc,
  mediaTall: '/img/plate-hero-room-tall.jpg' as ImageSrc,
  mediaAlt:
    'The Recalibre showroom: a deep blue wall, a single chair, and a wide screen carrying a sculpted black relief, lit from the left.',
} as const;

/* ---------------------------------------------------------------------- 02 */
export const BAND = {
  label: 'ON THE REGISTER',
  right: 'MARKS ONLY',
  /** The reference sets a client-count line here. This sets what the marks
   *  below actually are. */
  statement: 'Marks appear as marks. Ownership is stamped where it applies.',
  stamp: 'OURS',
} as const;

/* ---------------------------------------------------------------------- 03 */
export const STATEMENT = {
  /** The reference's giant centred statement. Ours carries the three
   *  structural facts the founder named — all three countable on this site. */
  lines: ['Five capabilities.', 'Three stages.', 'One accountable team.'],
  body: 'An organization that buys strategy from one supplier, design from another and engineering from a third pays for the gaps between them. Recalibre is structured so there are none.',
  /** The lime marquee strip that runs across the media band. */
  strip: ['CALIBRATION', 'SYSTEM DESIGN', 'BUILD', 'VALIDATE', 'HANDOVER', 'PARTNERSHIP'],
  /** The mono paragraph set into the bottom right of the band. */
  note: 'One program across five capabilities: strategy, design, agentic AI and automation, enterprise integration, and software engineering. One team, one point of accountability, from the first assessment to the system in use.',
  media: '/img/plate-geometry-wide.jpg' as ImageSrc,
  mediaAlt:
    'A monochrome render: wireframe polyhedra and solid white planes suspended against black, lit along their edges.',
} as const;

/* ---------------------------------------------------------------------- 04 */
export const ABOUT = {
  headline: ['A firm built', 'to carry the', 'whole program.'],
  mark: 'whole program.',
  /** THE COUNTERS. The reference animates "80+ systems in production" and
   *  "19 days to first launch". Both are performance claims. These two are
   *  structural facts, and both can be counted on this site. */
  figures: [
    { value: '05', label: 'CAPABILITIES, DELIVERED BY ONE TEAM' },
    { value: '03', label: 'STAGES IN EVERY ENGAGEMENT' },
  ],
  /** Two-tone: the first sentence lit, the rest at 60%. */
  bodyLead: 'Recalibre works with organizations that have outgrown fragmented processes, disconnected tools, or an identity that no longer reflects what they are capable of.',
  bodyRest: ' The work runs from the operating model down to the interface a technician uses in the field.',
  cta: { label: 'ABOUT RECALIBRE', href: '/about' },
} as const;

/* ---------------------------------------------------------------------- 05 */
export type Initiative = {
  slug: string;
  name: string;
  status: string;
  meta: string;
  tags: readonly string[];
  summary: string;
  src: ImageSrc;
  alt: string;
  caption: string;
  /** How dark the art already is where the title sits. A light picture needs
   *  a deeper scrim under the title than a dark one; using the same scrim on
   *  both is what makes a set of cards look unconsidered. */
  art: 'light' | 'dark';
  /** 'owned' = finished work Recalibre owns. 'dev' = still being built.
   *  It sets the colour of the one dot in the corner tag and nothing else. */
  tone: 'owned' | 'dev';
};

export const WORK = {
  headline: ['Selected work.'],
  lede: 'Three initiatives, each labelled with what it is. Two are products in development. One is a brand Recalibre owns.',
  /** THREE CARDS. The reference runs six square CMS cards in two columns at
   *  687px. Recalibre has three things it may honestly show, so the grid
   *  runs the same square card at the same scale, three across, rather than
   *  repeating OPS to fill a slot. */
  items: [
    {
      slug: 'ops',
      name: 'OPS',
      status: 'PRODUCT IN DEVELOPMENT',
      meta: '2026 · FIELD OPERATIONS · IN DEVELOPMENT',
      tags: ['PRODUCT', 'ENGINEERING', 'DESIGN'],
      summary:
        'A field operations system for crews working sites: interventions, permits, teams and the daily report in one register, built to work where there is no signal.',
      src: '/img/card-ops.jpg',
      alt: 'The OPS interventions screen filling the frame: the day\u2019s register under an orange header, with the seven-day activity chart and the permits falling due beside it.',
      caption: 'OPS · Interventions. Demonstration data.',
      art: 'light',
      tone: 'dev',
    },
    {
      slug: 'contraxis',
      name: 'Contraxis',
      status: 'PRODUCT CONCEPT IN DEVELOPMENT',
      meta: '2026 · DOCUMENT INTELLIGENCE · CONCEPT',
      tags: ['PRODUCT', 'AGENTIC AI'],
      summary:
        'An agentic AI system for contract and document intelligence: read the document, surface what matters, propose the action, keep the trail, and leave the decision with a person.',
      src: '/img/card-contraxis.jpg',
      alt: 'A Recalibre render: a black mass held inside a mirrored cube on a perforated steel bed, under the head of a gantry.',
      caption: 'Recalibre render. Contraxis has no interface to show yet.',
      art: 'dark',
      tone: 'dev',
    },
    {
      slug: 'belkofski',
      name: 'Belkofski',
      status: 'RECALIBRE-OWNED BRAND',
      meta: '2025 · BRAND AND DIGITAL · OURS',
      tags: ['BRAND', 'DIGITAL', '3D'],
      summary:
        'An eyewear house Recalibre owns and runs — brand, identity, digital and 3D taken end to end in-house.',
      src: '/img/card-belkofski.jpg',
      alt: 'A blue Belkofski paddle and a pair of clear frames on a court, cut by the white line, shot from above.',
      caption: 'Belkofski · our own house.',
      art: 'dark',
      tone: 'owned',
    },
  ] as readonly Initiative[],
} as const;

/* ---------------------------------------------------------------------- 06 */
export const CAPABILITIES = {
  headline: ['Our capabilities.'],
  lede: 'Five capabilities, one team. You brief once and the same team carries it through to production.',
  cta: { label: 'Start a conversation', href: '/contact' },
  /** The founder's own descriptions, unchanged in substance. */
  rows: [
    {
      n: '/01',
      title: 'Agentic AI and automation.',
      body: 'AI agents, document intelligence, workflow automation, approval processes and operational alerts — with human oversight where a decision carries weight.',
      tags: ['DOCUMENT INTELLIGENCE', 'WORKFLOW AUTOMATION', 'DECISION SUPPORT', 'HUMAN OVERSIGHT'],
      src: '/img/still-geometry.jpg' as ImageSrc,
      alt: 'A monochrome render: wireframe polyhedra and solid white planes suspended against black.',
    },
    {
      n: '/02',
      title: 'Custom software development.',
      body: 'Internal platforms, executive dashboards, client portals, workflow applications, field tools and reporting systems, designed around how the organization actually operates.',
      tags: ['INTERNAL PLATFORMS', 'DASHBOARDS', 'FIELD TOOLS', 'REPORTING'],
      src: '/img/still-ops-overview.jpg' as ImageSrc,
      alt: 'The OPS overview screen: interventions today, technicians in the field, active permits and a seven-day activity chart. Demonstration data.',
    },
    {
      n: '/03',
      title: 'Enterprise systems and integration.',
      body: 'Connected operational environments that integrate departments, consolidate information, modernize legacy workflows and establish one reliable source of operational data.',
      tags: ['LEGACY MODERNIZATION', 'DATA CONSOLIDATION', 'CONNECTED WORKFLOWS'],
      src: '/img/still-ops-permits.jpg' as ImageSrc,
      alt: 'The OPS permit register: permits by zone with their next expiry, in French and Arabic. Demonstration data.',
    },
    {
      n: '/04',
      title: 'Product and experience design.',
      body: 'Product strategy, information architecture, interface and experience design, prototyping, responsive layouts, accessibility and design systems that scale past the people who wrote them.',
      tags: ['PRODUCT STRATEGY', 'UI AND UX', 'ACCESSIBILITY', 'DESIGN SYSTEMS'],
      src: '/img/still-desk.jpg' as ImageSrc,
      alt: 'A desk at night in black and white: a monitor showing a wireframe layout, a keyboard, and wireframe sketches on paper.',
    },
    {
      n: '/05',
      title: 'Brand strategy and identity.',
      body: 'Positioning, identity systems, digital brand expression, campaign direction and the standards that hold an identity together across every customer and employee touchpoint.',
      tags: ['POSITIONING', 'IDENTITY SYSTEMS', 'BRAND STANDARDS'],
      src: '/img/still-belkofski.jpg' as ImageSrc,
      alt: 'A pair of Belkofski frames lit from above on a perforated steel shelf, the lenses in a deep orange gradient.',
    },
  ],
} as const;

/* ---------------------------------------------------------------------- 07 */
export const PROCESS = {
  label: 'HOW WE WORK',
  headline: ['How we turn', 'fragmented into', 'accountable'],
  mark: 'accountable',
  cards: [
    {
      n: '01.',
      title: ['Calibrate', 'The Work.'],
      body: 'We assess your objectives, workflows, systems and constraints, and agree what is worth changing first.',
    },
    {
      n: '02.',
      title: ['Design', 'The System.'],
      body: 'We agree exactly what the system does, where it connects, and which decisions stay with a person.',
    },
    {
      n: '03.',
      title: ['Build', 'And Validate.'],
      body: 'Design, engineering and automation run as one program, in controlled phases, against your own data.',
    },
    {
      n: '04.',
      title: ['Hand Over', 'And Support.'],
      body: 'You get the system, the source and the documentation. We support it as the organization changes.',
    },
  ],
} as const;

/* ---------------------------------------------------------------------- 08 */
export const SPOTLIGHT = {
  eyebrow: 'IN DEVELOPMENT · FIELD OPERATIONS',
  title: 'OPS',
  meta: 'PRODUCT · FIELD OPERATIONS · IN DEVELOPMENT',
  challenge: {
    label: 'THE PROBLEM IT ADDRESSES',
    lead: 'Interventions raised on paper, permits tracked in a spreadsheet, day sheets chased by phone.',
    rest: ' And no signal on site to do any of it live, so the record is always written twice — once in the field and once again at a desk.',
  },
  /** WHAT REPLACES THE "62% OF TICKETS" COUNTER. The reference animates a
   *  result. Recalibre has none until the product is in use. What it has is
   *  the shape of the system, read out of its own code. */
  facts: {
    label: 'WHAT IS BUILT',
    figure: '14',
    unit: 'pages',
    caption: 'Across the operational modules, with nine roles modelled end to end.',
  },
  runsOn: {
    label: 'HOW IT IS DEPLOYED',
    note: 'Self-hosted. One server, one database, held by the organization that uses it.',
    chips: ['SELF-HOSTED', 'OFFLINE-FIRST', 'ONE DATABASE', 'FRENCH · ARABIC', 'RIGHT-TO-LEFT'],
  },
  /** WHAT REPLACES THE STAR RATING AND THE CLIENT QUOTE. A status stamp and
   *  the product's own design rule — no stars, no name, no review label. */
  status: {
    label: 'STATUS',
    value: 'IN DEVELOPMENT',
    lead: 'Every screen carries demonstration data.',
    rest: ' Nothing in OPS is deployed with an organization, and no result is claimed for it.',
    cta: { label: 'READ THE INITIATIVE', href: '/work/ops' },
  },
  media: '/img/plate-machine-tall.jpg' as ImageSrc,
  mediaAlt:
    'A dark render: a black cube on a perforated steel bed under a gantry, a machine head above it, lit from the right.',
} as const;

/* ---------------------------------------------------------------------- 09 */
export const PRINCIPLES = {
  label: 'HOW WE OPERATE',
  headline: ['What we hold to on', 'every engagement.'],
  mark: 'hold to',
  lede: 'Rules about how the work is done, applied from the first assessment onward.',
  /** WHAT REPLACES THE TWO BIG COUNTERS. The reference sets "70% manual
   *  steps removed" and "220+ hours returned per month" at figure size.
   *  Both are results. These two carry the non-negotiables at the same
   *  scale, so the block's rhythm is unchanged. */
  pillars: [
    { big: 'Human', small: 'OVERSIGHT WHERE A DECISION CARRIES WEIGHT.' },
    { big: 'Owned', small: 'THE SYSTEM, THE SOURCE AND THE DOCUMENTATION.' },
  ],
  /** WHAT REPLACES THE TESTIMONIAL CAROUSEL. Same card, same slider, same
   *  controls. No quotation marks, no name, no job title, no rating, no
   *  date and no "verified review" stamp. */
  items: [
    {
      n: '01',
      label: 'GOVERNANCE',
      lead: 'A person decides anything that carries weight.',
      rest: ' Automation drafts, routes, checks and proposes. Where an outcome is consequential — money, safety, a contractual commitment — it is presented to a person with the trail that produced it.',
    },
    {
      n: '02',
      label: 'DELIVERY',
      lead: 'Delivered work is stated separately from work in development.',
      rest: ' Completed work, active development, demonstrations and future capability are four different things, and they are labelled as four different things.',
    },
    {
      n: '03',
      label: 'OWNERSHIP',
      lead: 'You own what was built.',
      rest: ' The system, the source, the documentation and the operational knowledge transfer to the organization. Partnership is a service, not a dependency.',
    },
  ],
} as const;

/* ---------------------------------------------------------------------- 10 */
export const FILM = {
  badge: '00:20',
  headline: ['See OPS running,', 'as it is today'],
  body: 'Twenty seconds, silent: the overview counting the day’s interventions, technicians in the field and active permits.',
  src: '/video/ops-loop.mp4',
  poster: '/img/ops-loop-poster.jpg' as ImageSrc,
  width: 400,
  height: 522,
  caption: 'OPS · Aperçu, in motion. Demonstration data.',
  label:
    'A silent screen recording of the OPS overview: the cards counting the day’s interventions, technicians in the field and active permits, and the seven-day activity chart beneath them.',
  media: '/img/plate-optics-wide.jpg' as ImageSrc,
  mediaAlt: 'Two lens elements standing on a black reflective surface under a single shaft of light.',
} as const;

/* ---------------------------------------------------------------------- 11 */
export const ENGAGEMENT = {
  label: 'ENGAGEMENT MODEL',
  headline: ['Three ways', 'to start.'],
  /** NO PRICES. The three price slots keep their geometry and carry the
   *  scope statement in the same position. */
  scopeLine: 'Scope defined following calibration',
  cards: [
    {
      n: '01',
      timeline: 'STAGE ONE',
      title: 'Calibration.',
      note: 'Where the work actually is.',
      points: [
        'Assessment of objectives and constraints',
        'Workflow and systems review',
        'Priorities ranked by operational impact',
        'A written plan you keep',
      ],
      cta: 'Start with calibration',
      popular: false,
    },
    {
      n: '02',
      timeline: 'STAGE TWO',
      title: 'Build.',
      note: 'Designed, engineered, validated, handed over.',
      points: [
        'Everything in calibration',
        'Design, engineering and automation as one program',
        'Integration with the systems already running',
        'Validated against your own data',
      ],
      cta: 'Plan a build',
      popular: true,
    },
    {
      n: '03',
      timeline: 'STAGE THREE',
      title: 'Partnership.',
      note: 'Continuity after launch.',
      points: [
        'Support for the system in use',
        'Monitoring and correction',
        'Adaptation as the organization changes',
        'Ownership stays with you',
      ],
      cta: 'Talk about partnership',
      popular: false,
    },
  ],
  footnote:
    'Every engagement starts with a fixed scope, agreed in writing. Commercial terms are set against that scope, following calibration.',
} as const;

/* ---------------------------------------------------------------------- 12 */
export const INSIGHTS_BLOCK = {
  label: 'ARTICLES',
  headline: ['Insights.'],
  lede: 'Positions Recalibre holds and can defend from its own work.',
  cta: { label: 'Read all', href: '/insights' },
  media: '/img/plate-desk-tall.jpg' as ImageSrc,
  mediaAlt: 'A desk at night in black and white: a monitor showing a wireframe layout and sketches on paper.',
} as const;

/* ---------------------------------------------------------------------- 13 */
export const FAQ = {
  label: 'FAQ',
  headline: ['Before the first call.'],
  items: [
    {
      q: 'What does an engagement actually cover?',
      a: 'One program across five capabilities: strategy, design, agentic AI and automation, enterprise integration, and software engineering. You brief once. The same team carries it from the operating model through to the system in use, so there is no gap between the people who designed it and the people who built it.',
    },
    {
      q: 'How is delivery structured?',
      a: 'Calibration, then Build, then Partnership. Calibration establishes what is worth changing and produces a written plan you keep whether or not you continue. Build runs design, engineering, automation and implementation as one program in controlled phases, validated against your own data. Partnership is support and adaptation after launch.',
    },
    {
      q: 'Where does our data live, and who can reach it?',
      a: 'Deployment is designed to keep operational data inside the organization that owns it. OPS, the field operations product being developed in-house, is self-hosted: one server, one database, held by the organization using it. The same principle applies to client systems — data residency and access are agreed during calibration and written into the scope, not decided afterwards.',
    },
    {
      q: 'How much is automated, and what stays with us?',
      a: 'Automation drafts, routes, checks and proposes. Where a decision carries weight — money, safety, a contractual commitment — the system presents it to a person together with the trail that produced it, and that person decides. Which decisions those are is agreed explicitly in system design.',
    },
    {
      q: 'Will this work with the systems we already run?',
      a: 'Integration is one of the five capabilities rather than an afterthought. The work consolidates information across departments, modernizes legacy workflows and establishes one reliable source of operational data. What connects to what, and in which direction, is mapped during calibration before anything is built.',
    },
    {
      q: 'Who owns what you build, and what happens at the end?',
      a: 'You do. The system, the source, the documentation and the operational knowledge transfer to your organization. Partnership is a service we provide afterwards because organizations change, not a dependency engineered into the handover.',
    },
  ],
  tail: {
    headline: 'Want to skip the FAQ?',
    note: 'TALK TO AN ENGINEER DIRECTLY.',
    cta: { label: 'Ask a question', href: '/contact' },
  },
} as const;

/* ---------------------------------------------------------------------- 14 */
export const CLOSE = {
  headline: ['Show us the process', 'that keeps breaking.'],
  mark: 'breaking.',
  body: 'Describe the operational problem in your own words. We will tell you whether it is a strategy problem, a systems problem or a design problem — and what a calibration would cover.',
  cta: { label: 'START A CONVERSATION', href: '/contact' },
  you: 'YOU',
  media: '/img/plate-machine-tall.jpg' as ImageSrc,
  mediaAlt: 'A black cube on a perforated steel bed under a gantry, lit from the right.',
  tile: '/img/still-optics.jpg' as ImageSrc,
  tileAlt: 'Two lens elements under a single shaft of light.',
} as const;
