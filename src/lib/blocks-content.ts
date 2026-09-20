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
     * The card is a text column beside a 16:10 window, so a screenshot goes in
     * whole rather than being cropped by a full-bleed panel.
     *
     * OPS HAS ITS SCREEN NOW — 21 September 2026. It is the real interface:
     * the Interventions register, French with the Arabic permit names beside
     * them, carrying demonstration data (Equipe Atlas, Secteur 7, INT-4471).
     * It is one of ten clean captures that had been sitting in `assets/`, a
     * folder the site could never read from. Five OTHER captures in there
     * print `ops.recalibre.cloud` and a circular R mark that exists in no logo
     * file; none of those five is published, and none should be.
     *
     * CONTRAXIS HAS NO SCREEN AND ONE IS NOT FAKED. `assets/` holds a file
     * called `contraxis-shot-ref.png`. It is NOT Contraxis — it is a marketing
     * shot of another company's analytics product, kept as a visual
     * reference. Dropping it in here would put a competitor's software on the
     * page as ours. Contraxis keeps a labelled drawing until a capture of the
     * real thing exists.
     *
     * `status` renders on the card. Neither product is said to run anywhere.
     */
    cards: [
      {
        n: '01',
        img: '/img/ops-interventions.png' as const,
        alt: "The OPS interventions register: the day's jobs with their reference, crew, zone, time and status, a seven-day activity chart, and the permits falling due.",
        caption: 'Interventions — the register. Demonstration data.',
        pending: false,
        status: 'IN DEVELOPMENT',
        title: 'OPS \u00b7 Field operations management',
        body: 'Connects jobs, crews, permits and daily reporting, so the field and the office work from one shared picture.',
      },
      {
        n: '02',
        img: '/img/ops-interventions.png' as const,
        alt: '',
        caption: 'Illustration \u2014 not a screenshot.',
        pending: true,
        status: 'IN DEVELOPMENT',
        title: 'Contraxis \u00b7 Document intelligence',
        body: 'Reads complex documents for clauses, obligations, risks and critical dates, then turns them into tracked actions.',
      },
    ],
    /**
     * The Contraxis drawing, in place of the screenshot that does not exist.
     * Five steps, each one a verb from the product's own sentence above:
     * reads, identifies, converts, traces, escalates.
     */
    contraxisSteps: [
      { n: '01', label: 'Document', body: 'A contract, a tender or a set of terms goes in.' },
      { n: '02', label: 'Findings', body: 'Clauses, obligations, risks and critical dates are identified.' },
      { n: '03', label: 'Actions', body: 'Findings become tracked actions with owners and dates.' },
      { n: '04', label: 'Traceability', body: 'Every action keeps its link to the passage it came from.' },
      { n: '05', label: 'A person decides', body: 'Anything needing judgment is escalated, not resolved quietly.' },
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
    /**
     * WHAT CHANGED, 21 September 2026.
     *
     * Four of these five rows were empty: a title, three tags, and a + button
     * that did nothing. The one open row pointed at `/img/case-2.png`, a stock
     * photograph from the template this page was cloned from, behind an
     * "Image to come" frame.
     *
     * Each row now carries the founder's own description of that capability
     * and a picture of something that actually exists. The pairing is the
     * honest one, not the flattering one:
     *
     *   01  Agentic AI   -> Contraxis, which has NO screenshot. It gets the
     *                       labelled drawing, exactly as on the product card.
     *   02  Software     -> the OPS overview. A real interface.
     *   03  Enterprise   -> the OPS sync queue: work done with no signal,
     *                       sent when coverage returns.
     *   04  Product      -> OPS on a phone beside the desk view, same day.
     *   05  Brand        -> Belkofski, the eyewear house the founder owns and
     *                       branded himself. No permission is owed on it.
     *
     * Every picture is demonstration data or our own product. No client's
     * work appears here: ABP Continental's written permission is still owed,
     * so ABP is in the partner row by name and nowhere else.
     */
    rows: [
      {
        n: '01.',
        title: 'Agentic AI and intelligent automation',
        tags: ['Document intelligence', 'Workflow automation', 'Decision support'],
        body: ['AI agents, document intelligence, workflow automation,', 'approval processes, operational alerts, internal knowledge', 'systems and AI-assisted decision support \u2014 with human', 'oversight where a decision carries weight.'],
        img: '',
        alt: '',
        caption: 'Contraxis \u00b7 Illustration \u2014 not a screenshot.',
        drawing: true,
        cta: 'Start a conversation',
      },
      {
        n: '02.',
        title: 'Custom software development',
        tags: ['Internal platforms', 'Client portals', 'Dashboards'],
        body: ['Internal platforms, executive dashboards, client portals,', 'workflow applications, field tools, reporting systems and', 'mobile experiences \u2014 designed around how the organization', 'actually operates.'],
        img: '/img/ops-overview.png' as const,
        alt: "The OPS overview screen: interventions today, technicians in the field, active permits, reports sent, a seven-day activity chart and the latest events.",
        caption: 'OPS \u00b7 the overview. Demonstration data.',
        drawing: false,
        cta: 'Start a conversation',
      },
      {
        n: '03.',
        title: 'Enterprise systems and integration',
        tags: ['Legacy modernization', 'Data consolidation', 'Connected workflows'],
        body: ['Connected operational environments that integrate', 'departments, consolidate information, modernize legacy', 'workflows and establish one reliable source of', 'operational data.'],
        img: '/img/ops-sync-queue.png' as const,
        alt: 'The OPS synchronisation queue: reports and photographs waiting to send, each with the zone it came from, the time, and whether it has gone.',
        caption: 'OPS \u00b7 the sync queue. Demonstration data.',
        drawing: false,
        cta: 'Start a conversation',
      },
      {
        n: '04.',
        title: 'Digital product and experience design',
        tags: ['Product strategy', 'UI and UX', 'Design systems'],
        body: ['Product strategy, information architecture, interface and', 'experience design, prototyping, responsive layouts,', 'accessibility and design systems that scale past the', 'people who wrote them.'],
        img: '/img/ops-phone-and-desk.png' as const,
        alt: "The same working day on a phone and on a desktop: the technician's checklist on the left, the signed daily report on the right.",
        caption: 'OPS \u00b7 one day, two screens. Demonstration data.',
        drawing: false,
        cta: 'Start a conversation',
      },
      {
        n: '05.',
        title: 'Brand strategy and identity',
        tags: ['Positioning', 'Identity systems', 'Brand standards'],
        body: ['Positioning, identity systems, digital brand expression,', 'campaign direction and the standards that hold an identity', 'together across every customer and employee', 'touchpoint.'],
        img: '/img/belkofski-frames.jpg' as const,
        alt: 'A pair of Belkofski frames on black, the name set along the temple arm and again inside the lens.',
        caption: 'Belkofski \u00b7 our own eyewear house.',
        drawing: false,
        cta: 'Start a conversation',
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
