/**
 * BLOCK CONTENT
 *
 * Six of the nine cloned blocks now carry Recalibre's own words, fitted to the
 * measured ink width of the box each line sits in. Hard line breaks are
 * deliberate: those boxes are `whitespace-pre`, so the break is the layout.
 *
 * The three blocks still holding bracketed placeholders — keyValue's siblings
 * features, coreCapabilities, howItWorks and flow — are no longer on the
 * homepage. They stay here so /blocks keeps rendering for comparison.
 *
 * PENDING REAL DATA (see PENDING below): one client quote and one honest
 * number. Nothing is invented in the meantime — the slots say what they are
 * waiting for, in plain sight, so a placeholder can never ship unnoticed.
 *
 * Reference map:
 *   A  blue [N.xx/11] instrument panel   10.webp · 9.webp · 3.webp
 *   B  Covix                              5.webp ·  6.webp · 11.webp
 *   C  Greyola Finn                        4.webp
 *   D  AgenAI                              7.webp
 *   E  Oberon                              8.webp
 */

/** Slots that are waiting on a fact only the business can supply. */
export const PENDING = {
  quote: '[AWAITING CLIENT QUOTE]',
  name: '[CLIENT NAME]',
  role: '[ROLE, COMPANY]',
  stat: '[00]',
  statLabel: '[AWAITING FIGURE]',
} as const;

export const BLOCKS = {
  /**
   * A1 — 10.webp · 3 cards on 388.8 tracks.
   * CARRIES: the three-stage engagement model. Exactly three cards, exactly
   * three stages — no geometry changed to fit the content.
   */
  keyValue: {
    eyebrow: 'HOW WE WORK',
    headline: { l1: 'One integrated program.', l2: 'Three controlled stages.' },
    cta: 'GET STARTED',
    cards: [
      {
        n: '// 001',
        title: 'Calibration',
        body: ['We assess your objectives, workflows,', 'systems, constraints and growth priorities.'],
        tag: 'THE CURRENT OPERATING ENVIRONMENT',
      },
      {
        n: '// 002',
        title: 'Build',
        body: ['Design, engineering, automation and', 'implementation run as one program.'],
        tag: 'DELIVERED IN CONTROLLED PHASES',
      },
      {
        n: '// 003',
        title: 'Partnership',
        body: ['We support the system, monitor performance', 'and adapt it as the organization evolves.'],
        tag: 'CONTINUITY AFTER LAUNCH',
      },
    ],
  },

  /** A2 — 9.webp · NOT ON THE HOMEPAGE. Second process block; content has one. */
  howItWorks: {
    eyebrow: '[N.00/11]  >  [SECTION LABEL]',
    headline: { l1: '[HEADLINE] copy.', l2: '[HEADLINE] to the box.' },
    cta: '[CTA]',
    cards: [
      { n: '// 001', fill: 1, title: '[TITLE] placeholder', body: ['[BODY] placeholder copy sized to the', 'measured box for verification.'] },
      { n: '// 002', fill: 0.22, title: '[TITLE] placeholder', body: ['[BODY] placeholder copy sized to the', 'measured box for verification.'] },
      { n: '// 003', fill: 0, title: '[TITLE] placeholder', body: [] },
      { n: '// 004', fill: 0, title: '[TITLE] placeholder', body: [] },
    ],
  },

  /** A3 — 3.webp · NOT ON THE HOMEPAGE. Third capabilities block. */
  coreCapabilities: {
    eyebrow: '[N.00/11]  >  [SECTION LABEL]',
    chips: ['[CHIP]', '[CHIP]'],
    items: [
      { n: '// 001', title: '[TITLE] placeholder copy', body: ['[BODY] placeholder copy sized to the measured box so', 'the layout can be verified.'] },
      { n: '// 002', title: '[TITLE] placeholder copy', body: [] },
      { n: '// 003', title: '[TITLE] placeholder copy', body: [] },
    ],
    headline: { l1: '[HEADLINE] plac.', l2: '[HEADLINE] to the box.' },
    diagram: {
      leftTitle: '[PANEL A]',
      leftRows: ['[ROW]', '[ROW]', '[ROW]', '[ROW]'],
      rightTitle: '[PANEL B]',
      rightRows: ['[ROW]', '[ROW]', '[ROW]', '[ROW]'],
      footTitle: '[PANEL C]',
    },
  },

  /**
   * B1 — 5.webp · two numbered image cards.
   * CARRIES: the two products. Two cards, two products.
   * IMAGES PENDING: real OPS and Contraxis screens. The neutral plates below
   * are stand-ins and must not ship.
   */
  work: {
    eyebrow: 'PRODUCTS',
    headline: { l1: 'Two systems we are', l2: 'building ourselves.' },
    /**
     * The card was a full-bleed 2.49:1 photo panel, which is the wrong shape
     * for a product screenshot — a 16:9 capture lost 28% off the top and
     * bottom. It is now a text column beside a 16:10 window, so a screenshot
     * goes in whole.
     *
     * `pending: true` draws a labelled empty frame instead of a grey plate, so
     * a missing screenshot can never be mistaken for a design choice. Set the
     * real file, write the alt, drop the flag.
     *
     * SEND: 16:10, at least 1400px wide (2800 for retina), PNG or WebP.
     */
    cards: [
      {
        n: '01',
        img: '/img/wide-1.png' as const,
        alt: 'The OPS dashboard, showing the day\'s jobs and crew assignments.',
        pending: true,
        title: 'OPS · Field operations management',
        body: 'Connects jobs, crews, permits and daily reporting, so the field and the office work from one shared picture.',
      },
      {
        n: '02',
        img: '/img/wide-2.png' as const,
        alt: 'Contraxis reviewing a contract, with clauses and dates picked out.',
        pending: true,
        title: 'Contraxis · Document intelligence',
        body: 'Reads complex documents for clauses, obligations, risks and critical dates, then turns them into tracked actions.',
      },
    ],
  },

  /**
   * B2 — 6.webp · photo, lead, two cards.
   * CARRIES: the Why Recalibre argument.
   * PHOTO PENDING. STAT PENDING.
   */
  whyChoose: {
    eyebrow: 'WHY RECALIBRE',
    headline: { l1: 'One partner, from the', l2: 'strategy to the system.' },
    photo: '/img/about-portrait.png',
    // The reference indents lines 3 and 4 by a leading space. Dropped: against
    // real copy it reads as a ragged left edge, not as a considered indent.
    lead: [
      'Strategy, design, AI, automation and',
      'software engineering in one team —',
      'so the people who define the operating',
      'model are the ones who build it.',
    ],
    metaTitle: 'Built for operational complexity,',
    metaSub: 'disconnected systems, manual process.',
    cardA: {
      title: ['Start with a', 'Calibration.'],
      body: ['A short engagement that maps', 'how you operate today.'],
      tools: ['Strategy', 'Design', 'AI', 'Automation', 'Software', 'Systems'],
      cta: 'Get in touch',
    },
    cardB: {
      label: 'Recalibre',
      counter: PENDING.stat,
      value: PENDING.stat,
      body: [PENDING.statLabel, 'Figure to be supplied.'],
      img: '/img/cta-portrait.png',
    },
  },

  /**
   * B3 — 11.webp · dark numbered accordion, grown from 2 rows to 5.
   * CARRIES: the five capabilities. The accordion is the only cloned block with
   * room for a title, its sub-disciplines and a sentence, which is the shape the
   * capability content actually has.
   */
  services: {
    eyebrow: 'CAPABILITIES',
    headline: { l1: 'Five capabilities.', l2: 'One accountable team.' },
    rows: [
      {
        n: '01.',
        title: 'Agentic AI and automation',
        tags: ['Document intelligence', 'Workflow automation', 'Decision support'],
        open: true,
        body: ['Agents that interpret information, coordinate', 'work, and escalate anything needing human', 'judgment.'],
        img: '/img/case-2.png',
        w: 5300,
        h: 3975,
        cta: 'Start a conversation',
      },
      {
        n: '02.',
        title: 'Custom software development',
        tags: ['Internal platforms', 'Client portals', 'Dashboards'],
        open: false,
        body: [],
        img: '',
        w: 0,
        h: 0,
        cta: '',
      },
      {
        n: '03.',
        title: 'Enterprise systems and integration',
        tags: ['Legacy modernization', 'Data consolidation', 'Connected workflows'],
        open: false,
        body: [],
        img: '',
        w: 0,
        h: 0,
        cta: '',
      },
      {
        n: '04.',
        title: 'Digital product and experience',
        tags: ['Product strategy', 'UI and UX', 'Design systems'],
        open: false,
        body: [],
        img: '',
        w: 0,
        h: 0,
        cta: '',
      },
      {
        n: '05.',
        title: 'Brand strategy and identity',
        tags: ['Positioning', 'Identity systems', 'Brand standards'],
        open: false,
        body: [],
        img: '',
        w: 0,
        h: 0,
        cta: '',
      },
    ],
  },

  /**
   * C — 4.webp · display statement, 01/02/03 rail, three columns.
   * CARRIES: the opening positioning and the three disciplines the firm is
   * built from — which is the first sentence of the company description.
   */
  intro: {
    headline: { l1: 'WE RECALIBRE HOW', l2: 'ORGANIZATIONS OPERATE.' },
    sub: [
      'Strategy, design, artificial intelligence, automation and software',
      'engineering, delivered as one integrated capability.',
    ],
    steps: ['01', '02', '03'],
    columns: [
      {
        title: 'STRATEGY',
        body: ['Positioning, operating models and the', 'direction that makes the rest cohere.'],
      },
      {
        title: 'DESIGN',
        body: ['Product strategy, architecture,', 'interfaces and design systems.'],
      },
      {
        title: 'TECHNOLOGY',
        body: ['Agentic AI, automation, software', 'and enterprise integration.'],
      },
    ],
  },

  /** D — 7.webp · NOT ON THE HOMEPAGE. Second capabilities block. */
  features: {
    headline: '[HEADLINE] placeholder',
    hub: '[HUB]',
    cards: [
      { title: '[TITLE] placeholder copy', body: ['[BODY] placeholder copy sized to the measured', 'box so the layout can be verified against the', 'reference without borrowing its words.'] },
      { title: '[TITLE] placeholder', body: ['[BODY] placeholder copy sized to the measured', 'box so the layout can be verified against the', 'reference without borrowing its words.'] },
      { title: '[TITLE] placeholder copy', body: ['[BODY] placeholder copy sized to the measured', 'box so the layout can be verified against the', 'reference without borrowing its words.'] },
      { title: '[TITLE] placeholder copy', body: ['[BODY] placeholder copy sized to the measured', 'box so the layout can be verified against the', 'reference without borrowing its words.'] },
      { title: '[TITLE] placeholder', body: ['[BODY] placeholder copy sized to the measured', 'box so the layout can be verified against the', 'reference without borrowing its words.'] },
      { title: '[TITLE] placeholder copy', body: ['[BODY] placeholder copy sized to the measured', 'box so the layout can be verified against the', 'reference without borrowing its words.'] },
    ],
  },

  /** E — 8.webp · NOT ON THE HOMEPAGE. Four columns, content has three stages. */
  flow: {
    heading: '[HEADING] placeholder',
    lead: ['[LEAD] PLACEHOLDER COPY SIZED TO', 'THE MEASURED BOX SO THE LAYOUT', 'CAN BE VERIFIED.'],
    steps: [
      { n: '.01', title: ['[TITLE] PLACEHOLDER', 'COPY'], rail: '[RAIL] >', body: ['[BODY] placeholder copy', 'sized to the measured', 'box so the layout can', 'be verified against the', 'reference without', 'borrowing its words.'] },
      { n: '.02', title: ['[TITLE] PLACEHOLDER', 'COPY SIZED'], rail: '[RAIL] >', body: ['[BODY] placeholder copy', 'sized to the measured', 'box so the layout can', 'be verified against the', 'reference.'] },
      { n: '.03', title: ['[TITLE] PLACEHOLDER', 'COPY SIZED'], rail: '[RAIL] >', body: ['[BODY] placeholder copy', 'sized to the measured', 'box so the layout can', 'be verified.'] },
      { n: '.04', title: ['[TITLE] PLACEHOLDER,', 'COPY SIZED'], rail: '[RAIL] >', body: ['[BODY] placeholder copy', 'sized to the measured', 'box so the layout can', 'be verified against it.'] },
    ],
    footIndex: '00',
    footLabel: '[FOOTER LABEL]',
  },
} as const;
