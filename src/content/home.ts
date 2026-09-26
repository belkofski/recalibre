import type { ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   THE HOMEPAGE — eleven blocks, in the reference's own order. Three came
   out on 26 September 2026 on the owner's decision (the Statement, the
   Process and the Film; see app/page.tsx), and none was ever cut for being
   inconvenient. Where the reference holds proof Recalibre does not have, the
   block keeps its position, geometry, motion and rhythm, and its content is
   replaced with something true:

     a performance counter   -> a verified structural fact
     a price                 -> the engagement stage, scope defined later
     a testimonial           -> an operating principle, with no quote marks,
                                no name, no rating and no review label
     a client logo wall      -> the partners row: five marks, one word, no count
     an invented statistic   -> a fact read out of the product's own code

   WHERE THE FACTS COME FROM. Three sources and no others: the founder's
   company description of 19 September 2026, his build brief of 20-21
   September 2026, and the project records in _MASTER/03-CASE-STUDIES.

   WHAT IS NOT HERE. No testimonial, rating, revenue, adoption, efficiency
   or time-saved figure. No deployment claim. No founding date. No
   availability. No price. No delivery time. No certification. No case-study
   outcome. One client is named — ABP Continental: a mark on the partners
   row, which the record always allowed, and a card in the work grid on the
   owner's instruction of 23 September 2026 (see content/work.ts) — and its
   results are not published.
   ========================================================================= */

/* ---------------------------------------------------------------------- 01 */
export const HERO = {
  eyebrow: 'FIVE CAPABILITIES · ONE ACCOUNTABLE TEAM',
  /** Hand-broken to the 1380px shell. Below 810px the breaks dissolve.
   *
   *  CUT FROM THREE LINES TO TWO, 22 Sep 2026, because the picture asked for
   *  the room back. Three lines at 90px is 240px of type, and with the lede
   *  and the buttons under it the text block took 62% of the panel — the
   *  room only appeared below all of it. Two lines give 80px back.
   *
   *  WHY THIS WORDING AND NOT A RE-BREAK. A straight re-break does not fit:
   *  measured in the live font at 90px with -3.6px tracking, "Strengthen
   *  your digital foundation." sets 1297px against 1210px of column. So one
   *  thing had to go, and the choice was between the second verb and the
   *  word "digital". "Digital" stays — it is the technology half of a
   *  strategy, design and technology firm, and dropping it leaves "strengthen
   *  your foundation", which could be any consultancy. What goes is
   *  "Strengthen", and "modernize" carries both objects without it.
   *
   *  Nothing new was written. Every word here was already approved; two were
   *  removed and one conjunction joins what is left. Line one loses its full
   *  stop, so the lime marker is 'operations' and no longer 'operations.'.
   *
   *  WHAT THIS SAID BEFORE: "We modernize how organizations operate, run and
   *  are understood." Three verbs for one idea, and on a phone it ran to six
   *  lines before a reader reached anything they could act on. It also led
   *  with us. This leads with the reader's own operation. */
  headline: ['Modernize your operations', 'and your digital foundation.'],
  /** The lime marker. One phrase per heading, as the reference marks one. */
  mark: 'operations',
  /** WHO THE FIRM IS FOR, in the founder's own sentence (brief of 20
   *  September 2026, "Company positioning", its opening "We work with"
   *  trimmed to "For"), on his decision of 25 September
   *  2026 that the first screen names the reader and no sector. The block
   *  further down this page (ABOUT.bodyLead) already carried a version of it
   *  and keeps it.
   *
   *  WHAT THIS SAID BEFORE: "Strategy, design, agentic AI, automation and
   *  engineering, delivered by one team as a single program — so the people
   *  who agree what should change are the people who build it." It listed
   *  five disciplines that are not the five capabilities and named nobody
   *  the site is for; its point about one team is made on About. */
  lede: 'For organizations that have outgrown fragmented processes, disconnected tools, or an identity that no longer reflects their capabilities.',
  ctaPrimary: { label: 'Start a calibration', href: '/contact' },
  ctaSecondary: { label: 'SELECTED WORK', href: '/work' },
  /** The statement plate at the foot of the hero. The reference prints a
   *  named client quote here; this prints the firm's own description of
   *  itself, signed by the firm. */
  plateStamp: '/ / RECALIBRE',
  plateBody:
    'ONE PROGRAM ACROSS FIVE CAPABILITIES, CARRIED BY ONE TEAM FROM THE OPERATING MODEL THROUGH TO THE SYSTEM IN USE.',
  plateSign: 'THE FIRM',
  /** The reference seats a portrait of the person it quotes at the card's
   *  right edge. Recalibre quotes nobody, so the card keeps the firm's own
   *  words — and, since 22 Sep 2026, the founder's own face beside them.
   *
   *  THE ALT SAYS A ROLE AND NOT A NAME, on purpose. This site does not
   *  print the founder's name or title anywhere: per `about.ts`, neither has
   *  been approved, and a title invented for a founder is still invented.
   *  The alt text is held to the same rule as the visible copy. */
  plateMedia: '/img/plate-card-founder.jpg' as ImageSrc,
  plateMediaAlt:
    'The founder of Recalibre, photographed in black and white in a suit and tie, with an office out of focus behind him.',
  media: '/img/plate-hero-wall-c.jpg' as ImageSrc,
  mediaTall: '/img/plate-hero-wall-tall-c.jpg' as ImageSrc,
  /** A RENDERED ROOM, NOT A SHOWROOM. The picture is a computer render,
   *  approved by the owner in all four of its places on 25 September 2026.
   *  Every description of it used to open "The Recalibre showroom", which
   *  says a real room exists. No maker is named because none is recorded,
   *  and nothing is said about a sign or lettering, which the re-cut first
   *  screen leaves out of frame. The same words serve the phone crop. */
  mediaAlt:
    'A rendered room: a deep blue wall, a single chair and a wide screen, lit from the left.',
} as const;

/* ---------------------------------------------------------------------- 02 */
export const BAND = {
  /** ONE WORD OVER THE ROW, AND NOTHING ELSE. The owner named all five
   *  marks as partners on 25 September 2026, and that word is the whole
   *  claim. The reference sets a client-count line here; this row used
   *  to carry a right-hand label ("TWO ARE OURS"), a sentence ("Two of
   *  these are companies Recalibre owns and runs."), a note ("Those two
   *  carry the stamp.") and an OURS stamp under Belkofski and Saidis.
   *  All four came off the same day: neither company is owned by
   *  Recalibre, and the row says nothing about any of the five beyond
   *  that word. See the note over MARKS in content/site.ts. */
  label: 'PARTNERS',
} as const;

/* ---------------------------------------------------------------------- 03 */
export const ABOUT = {
  headline: ['A firm built', 'to carry the', 'whole program.'],
  mark: 'whole program.',
  /** THE COUNTERS. The reference animates "80+ systems in production" and
   *  "19 days to first launch". Both are performance claims. These two are
   *  structural facts, and both can be counted on this site. */
  figures: [
    { value: '05', label: 'CAPABILITIES, DELIVERED BY ONE TEAM' },
    { value: '03', label: 'STAGES IN THE ENGAGEMENT MODEL' },
  ],
  /** Two-tone: the first sentence lit, the rest at 60%. */
  bodyLead: 'We work with organizations that have outgrown fragmented processes, disconnected tools, or an identity that no longer reflects what they are capable of.',
  bodyRest: ' The work runs from the operating model down to the interface a technician would use in the field.',
  cta: { label: 'ABOUT RECALIBRE', href: '/about' },
} as const;

/* ---------------------------------------------------------------------- 04 */
export type Initiative = {
  slug: string;
  name: string;
  status: string;
  meta: string;
  /** "Demonstration data." under the meta line, on a card whose picture is
   *  a product screen. See WorkCard.tsx. */
  demo?: string;
  tags: readonly string[];
  summary: string;
  /** Null where the initiative has no honest photograph of its own. */
  src: ImageSrc | null;
  /** The phone crop, where a wide plate would be cut to its middle third. */
  srcTall?: ImageSrc;
  alt: string;
  /** What is drawn when there is no photograph. */
  figure?: 'contraxis';
  caption: string;
  /** How dark the art already is where the title sits. A light picture needs
   *  a deeper scrim under the title than a dark one; using the same scrim on
   *  both is what makes a set of cards look unconsidered. */
  art: 'light' | 'dark';
  /** True where the art is a composed plate rather than a photograph, so the
   *  card draws it whole instead of overscaling it. See WorkCard.tsx. */
  plate?: boolean;
  /** The mark the reference centres on every card. A mark file where one
   *  exists, otherwise the three-square glyph beside the thing's own name. */
  mark?: { src?: ImageSrc; word?: string };
  /** 'dark' where the picture is bright behind the centre. See WorkCard. */
  markTone?: 'light' | 'dark';
  /** 'owned' = finished, delivered work, a client's or a partner's — the
   *  name is older than that meaning, and no entry marked 'owned' belongs
   *  to Recalibre. 'dev' = still being built. It sets the colour of the
   *  one dot in the corner tag and nothing else. */
  tone: 'owned' | 'dev';
};

export const WORK = {
  headline: ['Selected work.'],
  /* THE LEDE USED TO EXPLAIN THE LABELLING — "each labelled with what it
     is" — under three cards that each carry their own label. It describes
     the work now. */
  lede: 'Two products in development, an eyewear house that is a partner of Recalibre, and one client.',
  /** FOUR CARDS, WHICH IS THE REFERENCE'S OWN SHAPE. It runs six square
   *  CMS cards in two columns at 687px; this is the same square card at
   *  the same scale, two by two. The order alternates a bright plate with
   *  a dark one down both columns — OPS's white dashboard beside ABP's
   *  dusk, the Contraxis schematic beside Belkofski's blue — which is the
   *  only reason it is not simply chronological. Nothing is repeated to
   *  fill a slot; the grid in sections/home/Work.tsx reads this list's
   *  length and changes shape if it changes. */
  items: [    {
      slug: 'ops',
      name: 'OPS',
      status: 'PRODUCT IN DEVELOPMENT',
      /* THE STATE IS THE LAST TERM OF THE META LINE, which is where the
         reference prints it ("2026 · 3 week build · Live"). It used to sit
         in a pill floating over the top-left of the picture, which the
         reference does not have and which landed on the OPS interface's own
         logo. The words are unchanged and still on the card. */
      meta: '2026 · FIELD OPERATIONS · IN DEVELOPMENT',
      /* The screens are real screens from the build, on demonstration data
         (the owner, 25 September 2026), and the card prints it. */
      demo: 'Demonstration data.',
      tags: ['PRODUCT', 'ENGINEERING', 'DESIGN'],
      summary:
        'A field operations system for crews working sites: interventions, permits, teams and the daily report in one register, built to work where there is no signal.',
      src: '/img/card-ops-clean.jpg',
      alt: 'The OPS interventions screen filling the frame: the day\u2019s register under an orange header, with the seven-day activity chart and the permits falling due beside it.',
      caption: 'OPS · Interventions. Demonstration data.',
      art: 'light',
      /* A composed plate: the tablet was framed in the crop, so the card
         must not crop it a second time. */
      plate: true,
      /* No OPS logo file exists, so the mark is the three-square glyph
         beside the product's own name; nothing in it is invented. It prints
         in ink because the plate measures 238 of 255 behind the centre. */
      mark: { word: 'OPS' },
      markTone: 'dark',
      tone: 'dev',
    },    {
      slug: 'abp-continental',
      name: 'ABP Continental',
      status: 'CLIENT WORK, DELIVERED',
      meta: '2026 · INDUSTRIAL CONTRACTING · DELIVERED',
      tags: ['BRAND', 'DIGITAL', 'DESIGN'],
      summary:
        'An industrial contractor on the Algerian oil and gas fields. Brand, identity and a public website written for one reader: the procurement lead deciding whether the firm can be trusted with a scope of work.',
      /* THE SITE'S OWN PHOTOGRAPH, not a square of the whole page. The
         page's lower third is a yellow plate carrying black text and the
         card prints its title in white across that same corner. See the
         note in scripts/plates.py. */
      src: '/img/card-abp.jpg',
      alt: 'The lead image of the ABP Continental home page: steel erection at dusk, two riggers bolting a column, a crawler crane behind them, with map coordinates printed in the corner of the page.',
      caption: 'ABP Continental · the site we built for them.',
      art: 'dark',
      plate: true,
      /* The centre mark is ABP Continental's name in the site's own
         lettering, the same file as the partners row, until ABP's own logo
         file arrives. See content/work.ts. */
      mark: { src: '/img/partner-abp.svg' as ImageSrc },
      tone: 'owned',
    },
    {
      slug: 'contraxis',
      name: 'Contraxis',
      /* ONE STATUS PHRASE FOR BOTH PRODUCTS, 'in development', exactly as
         OPS prints it — the founder's rule (brief of 20 September 2026),
         confirmed 25 September 2026. This card used to say 'concept'. */
      status: 'PRODUCT IN DEVELOPMENT',
      meta: '2026 · DOCUMENT INTELLIGENCE · IN DEVELOPMENT',
      tags: ['PRODUCT', 'AGENTIC AI'],
      summary:
        'An agentic AI system for contract and document intelligence: read the document, surface what matters, propose the action, keep the trail, and leave the decision with a person.',
      /* NO PHOTOGRAPH. This card used to carry the 22.57.47 render, which
         is a Belkofski brand picture — a pair of orange-lensed frames is set
         into the face of the cube in it. On a card labelled "document
         intelligence" that read as evidence, and it was evidence of a
         different product. Contraxis has no interface to show, so the card
         carries the schematic of how it is meant to work. */
      src: null,
      figure: 'contraxis',
      alt: '',
      caption: 'Schematic of the intended workflow. Contraxis is in development.',
      art: 'dark',
      mark: { word: 'Contraxis' },
      tone: 'dev',
    },    {
      slug: 'belkofski',
      name: 'Belkofski',
      /* PARTNER. The status the owner confirmed on 25 September 2026.
         Belkofski is a partner of Recalibre, not a company it owns (the
         owner's word, 25 September 2026); this used to read
         "RECALIBRE-OWNED BRAND". */
      status: 'PARTNER',
      meta: '2025 · BRAND AND DIGITAL · PARTNER',
      tags: ['BRAND', 'DIGITAL', '3D'],
      summary:
        'An eyewear house that is a partner of Recalibre — brand, identity, digital and 3D taken end to end.',
      src: '/img/card-belkofski.jpg',
      /* The phone block is 4:3 and this square would lose its top and
         bottom to it, wordmark included. */
      srcTall: '/img/card-belkofski-tall.jpg',
      alt: 'A blue Belkofski paddle and a pair of clear frames on a court, cut by the white line, shot from above.',
      caption: 'Belkofski · a partner.',
      /* THE SHALLOW SCRIM, NOW THAT THE CARD IS A SQUARE. As a 2.93:1
         plate this was 'light', and rightly: the deep scrim covered 62% of
         a 470px card and the title sat on pale court. On a 687 square the
         same 62% is 426px of black, and it came with a second scrim over
         the top 30% — between them they buried the ball, the grip and most
         of the paddle. The square's own title band measures 89 of 255,
         which the shallow scrim carries. */
      art: 'dark',
      /* NO CENTRE MARK, AND THAT IS THE POINT. This photograph already
         carries one — BELKOFSKI is printed across the blue face of the
         paddle — and the square is cut so it lands dead centre, exactly
         where the reference puts a client's logo. Our own copy on top of
         it was the card printing the same word twice. */
      plate: true,
      tone: 'owned',
    },
  ] as readonly Initiative[],
} as const;

/* ---------------------------------------------------------------------- 05 */
export const CAPABILITIES = {
  headline: ['Our capabilities.'],
  lede: 'Five capabilities, one team. You brief once and the same team carries it through to production.',
  cta: { label: 'Start a calibration', href: '/contact' },
  /** The founder's own descriptions, unchanged in substance.
   *
   *  `src` is the chapter still /about draws at 418px. `card` and
   *  `cardTall` are the same picture cut for Home's photo cards (26
   *  September 2026): the wide crop for the open card, the tall one for a
   *  phone and an upright tablet. See scripts/plates.py. */
  rows: [
    {
      n: '/01',
      title: 'Agentic AI and automation.',
      body: 'AI agents, document intelligence, workflow automation, approval processes and operational alerts — with human oversight where a decision carries weight.',
      tags: ['DOCUMENT INTELLIGENCE', 'WORKFLOW AUTOMATION', 'DECISION SUPPORT', 'HUMAN OVERSIGHT'],
      src: '/img/still-geometry.jpg' as ImageSrc,
      card: '/img/cap-geometry-wide.jpg' as ImageSrc,
      cardTall: '/img/cap-geometry-tall.jpg' as ImageSrc,
      alt: 'A monochrome render: wireframe polyhedra and solid white planes suspended against black.',
    },
    {
      n: '/02',
      title: 'Custom software development.',
      body: 'Internal platforms, executive dashboards, client portals, workflow applications, field tools and reporting systems, designed around how the organization actually operates.',
      tags: ['INTERNAL PLATFORMS', 'DASHBOARDS', 'FIELD TOOLS', 'REPORTING'],
      src: '/img/still-ops-overview.jpg' as ImageSrc,
      card: '/img/cap-ops-wide-clean.jpg' as ImageSrc,
      cardTall: '/img/cap-ops-tall-clean.jpg' as ImageSrc,
      /* The Home card shows this screen large, so it prints what data it
         carries, as the OPS work card does (the owner, 25 September 2026;
         see `demo` in WORK above). /about's chapters do not read it. */
      demo: 'Demonstration data.',
      /* A white interface, not a dark photograph: the Home card lays a dark
         ground behind its words (see WORK's `art` above). */
      art: 'light',
      alt: 'The OPS overview screen: interventions today, technicians in the field, active permits and a seven-day activity chart. Demonstration data.',
    },
    {
      n: '/03',
      title: 'Enterprise systems and integration.',
      body: 'Connected operational environments that integrate departments, consolidate information, modernize legacy workflows and establish one reliable source of operational data.',
      tags: ['LEGACY MODERNIZATION', 'DATA CONSOLIDATION', 'CONNECTED WORKFLOWS'],
      src: '/img/still-recalibre.jpg' as ImageSrc,
      card: '/img/cap-recalibre-wide.jpg' as ImageSrc,
      cardTall: '/img/cap-recalibre-tall.jpg' as ImageSrc,
      alt: 'A Recalibre render: a black cube held square on a perforated steel bed under a gantry head, lit in red.',
    },
    {
      n: '/04',
      title: 'Product and experience design.',
      body: 'Product strategy, information architecture, interface and experience design, prototyping, responsive layouts, accessibility and design systems that scale past the people who wrote them.',
      tags: ['PRODUCT STRATEGY', 'UI AND UX', 'ACCESSIBILITY', 'DESIGN SYSTEMS'],
      src: '/img/still-desk.jpg' as ImageSrc,
      card: '/img/cap-desk-wide.jpg' as ImageSrc,
      cardTall: '/img/cap-desk-tall.jpg' as ImageSrc,
      alt: 'A desk at night in black and white: a monitor showing a wireframe layout, a keyboard and wireframe sketches on paper.',
    },
    {
      n: '/05',
      title: 'Brand strategy and identity.',
      body: 'Positioning, identity systems, digital brand expression, campaign direction and the standards that hold an identity together across every customer and employee touchpoint.',
      tags: ['POSITIONING', 'IDENTITY SYSTEMS', 'BRAND STANDARDS'],
      src: '/img/still-belkofski.jpg' as ImageSrc,
      card: '/img/cap-belkofski-wide.jpg' as ImageSrc,
      cardTall: '/img/cap-belkofski-tall.jpg' as ImageSrc,
      /* THE FILE IS THE PADDLE, NOT THE FRAMES ON THE SHELF: plates.py cuts
         still-belkofski.jpg from the court photograph, and the description
         used to describe a different picture. The sentence is the one the
         Belkofski case study already uses for the same frame. */
      alt: 'A blue Belkofski paddle carrying the wordmark, lying across a court line with a white ball beside it and a pair of clear frames on its face, shot from above.',
    },
  ],
} as const;

/* ---------------------------------------------------------------------- 06 */
export const SPOTLIGHT = {
  title: 'OPS',
  meta: 'OPS · FIELD OPERATIONS',
  challenge: {
    label: 'THE PROBLEM IT ADDRESSES',
    lead: 'Interventions raised on paper, permits tracked in a spreadsheet, day sheets chased by phone.',
    rest: ' And no signal on site to do any of it live, so the record is always written twice — once in the field and once again at a desk.',
  },
  /** WHAT REPLACES THE "62% OF TICKETS" COUNTER. The reference animates a
   *  result. Recalibre has none until the product is in use, and it prints
   *  no count here either: the owner's rule of 25 September 2026 keeps a
   *  number only where a visitor can check it on the same page, and nothing
   *  on this page counts OPS pages or roles. The figure slot carries a word
   *  instead, one of the product's own facts, and the unit slot is empty.
   *  "Offline" measures 226px at the 74px figure size. Beside the bars it
   *  fits the card at 74px from about 1400 wide up, on a tablet and on a
   *  phone. Between 1200 and 1400 the card is narrower, so the word is sized
   *  by the card there (`.t-figure-fit` in globals.css) and stays inside it. */
  facts: {
    label: 'WHAT IS BUILT',
    figure: 'Offline',
    unit: '',
    caption: 'The day is carried on the device and queues until coverage returns.',
  },
  runsOn: {
    label: 'DEPLOYMENT MODEL',
    note: 'Built to be self-hosted: one server, one database per organization.',
    chips: ['SELF-HOSTED', 'OFFLINE-FIRST', 'ONE DATABASE', 'FRENCH · ARABIC', 'RIGHT-TO-LEFT'],
  },
  /** WHAT REPLACES THE STAR RATING AND THE CLIENT QUOTE. A status stamp and
   *  the product's own design rule — no stars, no name, no review label. */
  status: {
    label: 'STATUS',
    value: 'IN DEVELOPMENT',
    lead: 'Every screen carries demonstration data.',
    rest: '',
    cta: { label: 'READ ABOUT OPS', href: '/work/ops' },
  },
  /* THIS WAS THE EYEWEAR RENDER TOO. The block is the OPS block; its media
     card carries OPS. */
  media: '/img/plate-ops-tall-clean.jpg' as ImageSrc,
  mediaAlt:
    'OPS on a tablet: the interventions screen with the day\u2019s counts across an orange header, the activity chart beneath it and the day\u2019s jobs listed by crew and zone. Demonstration data.',
} as const;

/* ---------------------------------------------------------------------- 07 */
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
      lead: 'You are told what stage everything is at.',
      rest: ' Completed work, active development and a demonstration are three different things, and you are never shown one and told it is another.',
    },
    {
      n: '03',
      label: 'OWNERSHIP',
      lead: 'You own what was built.',
      rest: ' The system, the source, the documentation and the operational knowledge transfer to the organization. Partnership is a service, not a dependency.',
    },
  ],
} as const;

/* ---------------------------------------------------------------------- 08 */
export const ENGAGEMENT = {
  label: 'ENGAGEMENT MODEL',
  headline: ['Three stages.'],
  /** ONE WAY IN. Calibration is the only door (the offer sheet: "every
   *  engagement starts here. There is no other way in"), so all three
   *  cards carry the same button, "Start a calibration": Build and
   *  Partnership are reached through a calibration, not beside it. The
   *  heading was "Three ways to start." until 25 Sep 2026; it said the
   *  opposite.
   *
   *  NO PRICES. The three slots keep the reference's geometry and carry,
   *  in the position a price would take, the two things a buyer of an
   *  unpriced engagement actually needs: what they receive at the end of
   *  this stage, and when its scope is fixed.
   *
   *  THE SCOPE LINE USED TO BE ONE LINE FOR ALL THREE — "Scope defined
   *  following calibration" — which is circular under Calibration itself.
   *  Each stage states when its own scope is agreed.
   *
   *  AND THERE IS NO "POPULAR" STAMP. It was inherited from the reference's
   *  pricing deck, where it means most-bought. Recalibre publishes no sales
   *  figures, so it was a popularity claim with nothing behind it.
   *
   *  AND NO "VALIDATION AGAINST YOUR OWN DATA" LINE UNDER BUILD. It was a
   *  promise that appears in none of the founder's texts, and he took it
   *  off on 25 September 2026. The eight promises he confirmed the same
   *  day stay word for word. */
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
      ],
      output: 'A written plan you keep, whether or not you continue',
      scope: 'Fixed scope, agreed before it starts',
      cta: 'Start a calibration',
    },
    {
      n: '02',
      timeline: 'STAGE TWO',
      title: 'Build.',
      note: 'Design, engineering and automation as one program.',
      points: [
        'System design: what it does, and which decisions stay with a person',
        'Integration with the systems already running',
        'Handover of the source and the documentation',
      ],
      output: 'The working system, its source and its documentation',
      scope: 'Scope and terms set by the Calibration',
      cta: 'Start a calibration',
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
      ],
      output: 'A supported system that stays yours',
      scope: 'Agreed at handover',
      cta: 'Start a calibration',
    },
  ],
  footnote:
    'Design, validation and handover sit inside Build rather than beside it. Every engagement starts with a fixed scope agreed in writing, and commercial terms are set against that scope.',
} as const;

/* ---------------------------------------------------------------------- 09 */
export const INSIGHTS_BLOCK = {
  label: 'INSIGHTS',
  headline: ['Insights.'],
  lede: 'Positions Recalibre holds.',
  cta: { label: 'All insights', href: '/insights' },
} as const;

/* ---------------------------------------------------------------------- 10 */
export const FAQ = {
  label: 'FAQ',
  headline: ['Before the first call.'],
  items: [
    {
      q: 'What does an engagement actually cover?',
      a: 'One program across five capabilities: agentic AI and intelligent automation, custom software development, enterprise systems and integration, digital product and experience design, and brand strategy and identity. You brief once. The same team carries it from the operating model through to the system in use, so there is no gap between the people who designed it and the people who built it.',
    },
    {
      q: 'How is delivery structured?',
      a: 'Calibration, then Build, then Partnership. Calibration establishes what is worth changing and produces a written plan you keep whether or not you continue. Build runs design, engineering, automation and implementation as one program in controlled phases. Partnership is support and adaptation after launch.',
    },
    {
      q: 'Where does our data live, and who can reach it?',
      a: 'Deployment is designed to keep operational data inside the organization that owns it. OPS, the field operations product being developed in-house, is built to be self-hosted: one server, one database per organization. The same principle applies to client systems — data residency and access are agreed during Calibration and written into the scope, not decided afterwards.',
    },
    {
      q: 'How much is automated, and what stays with us?',
      a: 'Automation drafts, routes, checks and proposes. Where a decision carries weight — money, safety, a contractual commitment — the system presents it to a person together with the trail that produced it, and that person decides. Which decisions those are is agreed explicitly in system design.',
    },
    {
      q: 'Will this work with the systems we already run?',
      a: 'Integration is one of the five capabilities rather than an afterthought. The work consolidates information across departments, modernizes legacy workflows and establishes one reliable source of operational data. What connects to what, and in which direction, is mapped during Calibration before anything is built.',
    },
    {
      q: 'Who owns what you build, and what happens at the end?',
      a: 'You do. The system, the source, the documentation and the operational knowledge transfer to your organization. Partnership is a service we provide afterwards because organizations change, not a dependency engineered into the handover.',
    },
  ],
  tail: {
    headline: 'Still have a question?',
    note: 'ASK IT THROUGH THE FORM.',
    cta: { label: 'Start a calibration', href: '/contact' },
  },
} as const;
