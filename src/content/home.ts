import type { ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   THE HOMEPAGE — fourteen blocks, in the reference's own order.

   Every block of tbd® is kept. Not one is deleted for being inconvenient.
   Where the reference holds proof Recalibre does not have, the block keeps
   its position, dimensions, motion and rhythm, and its content is replaced
   with something true:

     a performance counter   -> a verified structural fact
     a price                 -> the engagement stage, scope defined later
     a testimonial           -> an operating principle, no quote marks,
                                no name, no rating, no review label
     a team grid             -> leadership and the disciplines involved,
                                with no invented employees
     an invented statistic   -> a fact read out of the product's own code

   WHERE THE FACTS COME FROM. Three sources and no others:
     1. the founder's company description, 19 September 2026
     2. the founder's build brief, 20-21 September 2026
     3. _MASTER/03-CASE-STUDIES — the project records, including the ones
        that say a project may NOT be published

   WHAT IS NOT HERE. No client name. No testimonial. No rating. No revenue,
   adoption, efficiency or time-saved figure. No deployment claim. No
   founding year. No availability. No price. No delivery time. No
   certification. No case-study outcome. ABP Continental appears as a mark
   and nowhere else, because written permission has not been granted.
   ========================================================================= */

/* ---------------------------------------------------------------------- 01 */
export const HERO = {
  /** The rail. The reference prints "Now booking for Q3 · Est. 2023" here.
   *  Both are facts Recalibre does not have, so the rail carries the one it
   *  does: where the firm is, and what time it is there. */
  railLabel: 'HASSI MESSAOUD',
  /** Hand-broken to the 1380px shell. Below 810px the breaks dissolve. */
  headline: [
    'We modernize how',
    'organizations operate,',
    'their customer experience',
    'and their infrastructure.',
  ],
  /** The decode sentence. The founder's own positioning, verbatim in
   *  substance: strategy, design and technology as one capability. */
  lede: 'Strategy, design, agentic AI, automation and engineering are delivered as one integrated capability — not as separate suppliers coordinating across a gap.',
  ctaPrimary: { label: 'Start a conversation', href: '/contact' },
  ctaSecondary: { label: 'See selected work', href: '/work' },
  /** The media. hero.png from the assets folder, cropped: the original
   *  prints "Recalibre®" into its bottom-left corner and the ® is a
   *  registration that does not exist. The crop removes it with 150px to
   *  spare — see scripts and the commit that added the file. */
  media: '/img/hero-machine-tall.png' as ImageSrc,
  mediaAlt:
    'A dark render: a machine head on a gantry above a black cube resting on a perforated steel bed, lit from the right in deep red, with fine measurement lines laid over it.',
  /** The reference pins a caption plate to its hero media. */
  mediaCaption: 'RECALIBRE — STRATEGY, DESIGN, TECHNOLOGY',
} as const;

/* ---------------------------------------------------------------------- 03 */
export const STATEMENT = {
  /** The reference's giant statement reads "4 sprints / 8 check ins / 3
   *  stages". Ours carries the three structural facts the founder named:
   *  five capabilities, three stages, two products. All three are countable
   *  from this site itself. */
  lines: ['Five capabilities.', 'Three stages.', 'One accountable team.'],
  body: 'An organization that buys strategy from one supplier, design from another and engineering from a third pays for the gaps between them. Recalibre is structured so there are none: one program, one team, one point of accountability from the first assessment to the system in use.',
  /** The chip strip under the statement. The reference runs its five
   *  delivery verbs here; ours runs the five capabilities. */
  chips: ['STRATEGY', 'DESIGN', 'AGENTIC AI', 'AUTOMATION', 'ENGINEERING'],
} as const;

/* ---------------------------------------------------------------------- 04 */
export const POSITIONING = {
  eyebrow: 'THE FIRM',
  headline: ['A firm built to', 'carry one program', 'end to end.'],
  /** THE COUNTERS. The reference animates "80+ systems in production" and
   *  "19 days to first launch" here. Both are performance claims. These
   *  three are structural facts — they describe the shape of the firm and
   *  its work, and every one of them can be counted on this site. */
  figures: [
    { value: '05', unit: '', label: 'Capabilities, delivered by one team' },
    { value: '03', unit: '', label: 'Stages in every engagement' },
    { value: '02', unit: '', label: 'Products in development in-house' },
  ],
  body: 'Recalibre works with organizations that have outgrown fragmented processes, disconnected tools, or an identity that no longer reflects what they are capable of. The work runs from the operating model down to the interface a technician uses in the field.',
  cta: { label: 'About Recalibre', href: '/about' },
  media: '/img/bearing-macro.jpg' as ImageSrc,
  mediaAlt:
    'A single bearing standing on a black reflective surface, lit by one shaft of light from the upper left, its reflection beneath it.',
} as const;

/* ---------------------------------------------------------------------- 05 */
export type Initiative = {
  slug: string;
  name: string;
  /** Printed on the card. The status system is from the project records. */
  status: string;
  year: string;
  category: string;
  tags: readonly string[];
  summary: string;
  src: ImageSrc | '';
  alt: string;
  caption: string;
  /** True when no photograph or capture may be published and the card
   *  carries a drawing instead. */
  drawing?: boolean;
};

export const WORK = {
  eyebrow: 'SELECTED INITIATIVES',
  headline: ['Selected work.'],
  lede: 'Three initiatives, each labelled with what it actually is. Two are products in development. One is a brand Recalibre owns.',
  /** THREE CARDS, NOT SIX AND NOT FOUR.
   *
   *  The reference runs a six-card CMS grid. Recalibre has three things it
   *  may honestly show. Rather than repeat OPS to fill the grid — which was
   *  explicitly ruled out — the grid runs three columns at desktop against
   *  the reference's two rows of three, keeping the card dimensions, the
   *  hover border, the image behaviour and the tag pills exactly.
   *
   *  A fourth card is reserved and stays empty until either ABP Continental
   *  grants written permission or Dorwa Production's relationship and scope
   *  are written down. */
  items: [
    {
      slug: 'ops',
      name: 'OPS',
      status: 'PRODUCT IN DEVELOPMENT',
      year: '2026',
      category: 'Field operations',
      tags: ['PRODUCT', 'ENGINEERING', 'DESIGN'],
      summary:
        'A field operations system for crews working sites: interventions, permits, teams and the daily report in one register, built to work where there is no signal.',
      src: '/img/ops-teams-wide.png',
      alt: 'The OPS teams screen: three crews with their zone, headcount and vacant posts, the load carried by each over seven days, and the certifications due for renewal.',
      caption: 'OPS · Équipes. Demonstration data.',
    },
    {
      slug: 'contraxis',
      name: 'Contraxis',
      status: 'PRODUCT CONCEPT IN DEVELOPMENT',
      year: '2026',
      category: 'Document intelligence',
      tags: ['PRODUCT', 'AGENTIC AI'],
      summary:
        'An agentic AI system for contract and document intelligence: read the document, surface what matters, propose the action, keep the trail, and leave the decision with a person.',
      src: '',
      alt: '',
      caption: 'Illustration — not a screenshot.',
      drawing: true,
    },
    {
      slug: 'belkofski',
      name: 'Belkofski',
      status: 'RECALIBRE-OWNED BRAND',
      year: '2025',
      category: 'Brand and digital',
      tags: ['BRAND', 'DIGITAL', '3D'],
      summary:
        'An eyewear house Recalibre owns and runs — brand, identity, digital and 3D taken end to end in-house. It is on this page because it is finished and because no permission is owed on it.',
      src: '/img/belkofski-lens.jpg',
      alt: 'A pair of Belkofski frames on black, the lenses in a deep orange gradient, the name set along the temple arm.',
      caption: 'Belkofski · our own house.',
    },
  ] as readonly Initiative[],
  /** The empty fourth slot, stated rather than hidden. */
  reserved: {
    label: 'FOURTH SLOT — RESERVED',
    note: 'A client engagement is added here when its scope is documented and its written permission is on file. Nothing is placed in this slot before both.',
  },
} as const;

/* ---------------------------------------------------------------------- 06 */
export const CAPABILITIES = {
  eyebrow: 'CAPABILITIES',
  headline: ['Five capabilities,', 'one accountable team.'],
  lede: 'You brief once. The same team carries it from the operating model through to the system in use.',
  /** The founder's own descriptions, unchanged. */
  rows: [
    {
      n: '01',
      title: 'Agentic AI and intelligent automation',
      body: 'AI agents, document intelligence, workflow automation, approval processes, operational alerts, internal knowledge systems and AI-assisted decision support — with human oversight where a decision carries weight.',
      tags: ['DOCUMENT INTELLIGENCE', 'WORKFLOW AUTOMATION', 'DECISION SUPPORT', 'HUMAN OVERSIGHT'],
      src: '/img/render-geometry.jpg' as ImageSrc,
      alt: 'A monochrome render: wireframe polyhedra and solid white planes suspended against black, lit along their edges.',
      caption: 'Illustration.',
    },
    {
      n: '02',
      title: 'Custom software development',
      body: 'Internal platforms, executive dashboards, client portals, workflow applications, field tools, reporting systems and mobile experiences — designed around how the organization actually operates.',
      tags: ['INTERNAL PLATFORMS', 'DASHBOARDS', 'FIELD TOOLS', 'REPORTING'],
      src: '/img/ops-overview.png' as ImageSrc,
      alt: 'The OPS overview screen: interventions today, technicians in the field, active permits, reports transmitted, and a seven-day activity chart.',
      caption: 'OPS · Aperçu. Demonstration data.',
    },
    {
      n: '03',
      title: 'Enterprise systems and integration',
      body: 'Connected operational environments that integrate departments, consolidate information, modernize legacy workflows and establish one reliable source of operational data.',
      tags: ['LEGACY MODERNIZATION', 'DATA CONSOLIDATION', 'CONNECTED WORKFLOWS'],
      src: '/img/ops-permits-wide.png' as ImageSrc,
      alt: 'The OPS permit register: permits by zone with their next expiry, and one hot-work permit open in detail in French and Arabic with the approval it needs.',
      caption: 'OPS · Permis, French and Arabic. Demonstration data.',
    },
    {
      n: '04',
      title: 'Digital product and experience design',
      body: 'Product strategy, information architecture, interface and experience design, prototyping, responsive layouts, accessibility and design systems that scale past the people who wrote them.',
      tags: ['PRODUCT STRATEGY', 'UI AND UX', 'ACCESSIBILITY', 'DESIGN SYSTEMS'],
      src: '/img/studio-desk.jpg' as ImageSrc,
      alt: 'A desk at night in black and white: a monitor showing a wireframe layout, a mechanical keyboard, and hand-drawn wireframe sketches on paper beside it.',
      caption: 'Illustration.',
    },
    {
      n: '05',
      title: 'Brand strategy and identity',
      body: 'Positioning, identity systems, digital brand expression, campaign direction and the standards that hold an identity together across every customer and employee touchpoint.',
      tags: ['POSITIONING', 'IDENTITY SYSTEMS', 'BRAND STANDARDS'],
      src: '/img/belkofski-frames.jpg' as ImageSrc,
      alt: 'A pair of black Belkofski frames on black, lenses in a deep orange gradient, the name set along the temple arm and again inside the lens.',
      caption: 'Belkofski · our own house.',
    },
  ],
} as const;

/* ---------------------------------------------------------------------- 07 */
export const PROCESS = {
  eyebrow: 'HOW WE WORK',
  headline: ['How an engagement', 'actually runs.'],
  /** Four cards, as the reference has and as the brief specifies. The
   *  three-stage commercial model in block 11 is the same program stated at
   *  a coarser grain — Calibration, then Build (which contains System
   *  Design and Build-and-Validate), then Partnership. */
  cards: [
    {
      n: '01.',
      title: 'Calibration',
      body: 'We assess your objectives, workflows, systems, constraints and growth priorities, and agree what is actually worth changing first.',
      tag: 'THE CURRENT OPERATING ENVIRONMENT',
    },
    {
      n: '02.',
      title: 'System Design',
      body: 'We agree exactly what the system does, where it connects, and which decisions stay with a person rather than being automated away.',
      tag: 'SCOPE, ARCHITECTURE, OVERSIGHT',
    },
    {
      n: '03.',
      title: 'Build and Validate',
      body: 'Design, engineering, automation and implementation run as one program, delivered in controlled phases and validated against your own data.',
      tag: 'DELIVERED IN CONTROLLED PHASES',
    },
    {
      n: '04.',
      title: 'Partnership',
      body: 'We support the system, monitor how it performs and adapt it as the organization evolves. You own what was built.',
      tag: 'CONTINUITY AFTER LAUNCH',
    },
  ],
} as const;

/* ---------------------------------------------------------------------- 08 */
export const SPOTLIGHT = {
  eyebrow: 'IN DEVELOPMENT · FIELD OPERATIONS',
  /** The reference's spotlight is a client case study with a result. Ours is
   *  the product Recalibre is building, labelled as such in three places. */
  status: 'IN DEVELOPMENT',
  headline: ['OPS — one working day,', 'end to end.'],
  challenge: {
    label: 'THE PROBLEM IT ADDRESSES',
    body: 'Interventions raised on paper, permits tracked in a spreadsheet, day sheets chased by phone — and no signal on site to do any of it live.',
  },
  /** WHAT REPLACES THE "IMPACT 0%" COUNTER.
   *
   *  The reference animates a percentage of tickets resolved. Recalibre has
   *  no such figure and will not have one until the product is in use. What
   *  it does have is the shape of the system, read out of its own code and
   *  recorded in _MASTER/03-CASE-STUDIES/ops.md. Those are structural
   *  facts about the software, not claims about its results. */
  facts: {
    label: 'WHAT IS BUILT',
    items: [
      { value: '14', unit: 'pages', label: 'Across the operational modules' },
      { value: '09', unit: 'roles', label: 'Permissions modelled end to end' },
      { value: '03', unit: 'languages', label: 'Including right-to-left Arabic' },
    ],
  },
  /** The reference's "WHAT IT RUNS ON" chip row lists a client's SaaS stack.
   *  Ours states how the product is deployed, which is on record. */
  runsOn: {
    label: 'HOW IT IS DEPLOYED',
    note: 'Self-hosted. One server, one database, held by the organization that uses it.',
    chips: ['SELF-HOSTED', 'OFFLINE-FIRST', 'ONE DATABASE', 'FRENCH · ARABIC', 'RIGHT-TO-LEFT'],
  },
  note: 'OPS is in development. Every screen on this page carries demonstration data, and no part of it is deployed with a client.',
  cta: { label: 'Read the full initiative', href: '/work/ops' },
} as const;

/* ---------------------------------------------------------------------- 09 */
export const PRINCIPLES = {
  eyebrow: 'HOW WE OPERATE',
  headline: ['What we hold to,', 'on every engagement.'],
  lede: 'Not promises about outcomes. Rules about how the work is done, which apply from the first assessment onward.',
  /** WHAT REPLACES THE TWO BIG COUNTERS.
   *
   *  The reference sets "70% manual steps removed" and "220,000+ hours
   *  returned per month" at figure size here. Both are results Recalibre
   *  cannot evidence. The two slots keep their scale and their position and
   *  carry the two non-negotiables instead — set as words at the same size,
   *  so the block's rhythm is unchanged. */
  pillars: [
    { big: 'Human', small: 'oversight', label: 'WHERE A DECISION CARRIES WEIGHT' },
    { big: 'Your data,', small: 'your server', label: 'DEPLOYMENT STAYS WITH THE ORGANIZATION' },
  ],
  /** WHAT REPLACES THE TESTIMONIALS.
   *
   *  Same card geometry, same stacking, same reveal. No quotation marks, no
   *  name, no job title, no rating, no date, no "verified review" stamp —
   *  because there is no client to attribute any of it to. */
  items: [
    {
      n: '01',
      title: 'A person decides anything that carries weight.',
      body: 'Automation drafts, routes, checks and proposes. Where an outcome is consequential — money, safety, a contractual commitment — it is presented to a person with the trail that produced it, and that person decides.',
    },
    {
      n: '02',
      title: 'What is delivered is stated separately from what is in development.',
      body: 'Completed work, active development, demonstrations and future capability are four different things. They are labelled as four different things, on this site and in every document that leaves the firm.',
    },
    {
      n: '03',
      title: 'You own what was built.',
      body: 'The system, the source, the documentation and the operational knowledge transfer to the organization. Partnership is a service we provide, not a dependency we engineer.',
    },
  ],
} as const;

/* ---------------------------------------------------------------------- 10 */
export const FILM = {
  eyebrow: 'IN MOTION',
  headline: ['The overview, moving.'],
  body: 'Twenty seconds, silent, held at the size it was recorded rather than blown up to fill a panel. It is the only footage of OPS that exists.',
  /** The reference badges its video 02:14. Ours says what ours is. */
  badge: '00:20',
  src: '/video/ops-loop.mp4',
  poster: '/img/ops-loop-poster.jpg' as ImageSrc,
  width: 400,
  height: 522,
  caption: 'OPS · Aperçu, in motion. Demonstration data.',
  label:
    'A silent screen recording of the OPS overview: the cards counting the day’s interventions, technicians in the field and active permits, and the seven-day activity chart beneath them.',
} as const;

/* ---------------------------------------------------------------------- 11 */
export const ENGAGEMENT = {
  eyebrow: 'ENGAGEMENT MODEL',
  headline: ['Three ways', 'to start.'],
  lede: 'The same program at three commitments. Every engagement begins with a fixed, written scope that you approve before any work begins.',
  /** NO PRICES. The three price counters are removed by instruction; the
   *  slot they occupied carries the scope statement at the same position. */
  scopeLine: 'Scope defined following calibration',
  cards: [
    {
      n: '01',
      title: 'Calibration',
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
      title: 'Build',
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
      title: 'Partnership',
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

/* ---------------------------------------------------------------------- 13 */
export const FAQ = {
  eyebrow: 'FAQ',
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
      a: 'Deployment is designed to keep operational data inside the organization that owns it. OPS, the field operations product being developed in-house, is self-hosted: one server, one database, held by the organization using it. The same principle is applied to client systems — data residency and access are agreed during calibration and written into the scope, not decided afterwards.',
    },
    {
      q: 'How much is automated, and what stays with us?',
      a: 'Automation drafts, routes, checks and proposes. Where a decision carries weight — money, safety, a contractual commitment — the system presents it to a person together with the trail that produced it, and that person decides. Which decisions those are is agreed explicitly in system design, not inferred later.',
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
} as const;

/* ---------------------------------------------------------------------- 14 */
export const CLOSE = {
  eyebrow: 'START HERE',
  headline: ['Tell us what is', 'not working yet.'],
  body: 'Describe the operational problem in your own words. We will tell you whether it is a strategy problem, a systems problem or a design problem — and what a calibration would cover.',
  cta: { label: 'Start a conversation', href: '/contact' },
  media: '/img/ops-field-wide.png' as ImageSrc,
  mediaAlt:
    'OPS working with no signal: a technician’s checklist for the day on a phone marked offline, beside what can still be done without a network and the queue of reports waiting to send.',
} as const;
