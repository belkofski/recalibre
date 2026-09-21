/* ============================================================================
   ABOUT.

   THE REFERENCE'S ABOUT PAGE carries a founding year, seven animated
   figures, a track-record list of six named clients across three date
   ranges, and four team cards with names, photographs and job titles.

   Recalibre has none of those. What it has is a structure, and this page
   describes the structure.

   THE TEAM GRID. The instruction is that a team layout may "present
   leadership and the disciplines involved in delivery without inventing
   employees". So the grid runs the five disciplines that carry an
   engagement, not five people.

   WHY THERE IS NO PORTRAIT. The approved founder portrait lives in the
   master register, and the source folder for this build is `assets`, which
   holds no photograph of anybody. Nothing is published from outside that
   folder without explicit approval, so the leadership block carries a role
   and no face. The moment a portrait is placed in `assets`, it goes here.
   ========================================================================= */

export const ABOUT = {
  eyebrow: 'THE FIRM',
  headline: ['A firm built', 'to carry the', 'whole program.'],
  lede: 'Recalibre is a strategy, design and technology firm. It works with organizations modernizing their operations, their customer experience and their digital infrastructure.',

  story: {
    heading: ['Why it is', 'structured', 'this way.'],
    paragraphs: [
      'An organization that buys strategy from one supplier, design from another and engineering from a third is paying for three relationships and getting the gaps between them for free. The gaps are where the work goes wrong: a strategy nobody can build, a design nobody costed, a system that does what was specified rather than what was needed.',
      'Recalibre is structured so that those handovers do not exist. Strategy, design, agentic AI, automation and engineering are one capability carried by one team, and the same people who agree what should change are the people who build it.',
      'That structure is also why the firm builds its own products. OPS and Contraxis are not side projects — they are where the methods are tested at full scale, on real constraints, before they are applied to anyone else’s operation.',
    ],
  },

  /** Structural facts. Every one is countable from this site. */
  figures: [
    { value: '05', label: 'Capabilities, delivered by one team' },
    { value: '03', label: 'Stages in every engagement' },
    { value: '02', label: 'Products in development in-house' },
    { value: '01', label: 'Point of accountability' },
  ],

  leadership: {
    eyebrow: 'LEADERSHIP',
    heading: ['Founder-led,', 'and not as a', 'slogan.'],
    body: 'Engagements are led by the founder from first assessment to handover. You talk to the person making the decisions about your system, not to an account layer in front of them.',
    note: 'One point of accountability, named at the start of the engagement and unchanged through it.',
  },

  /** The disciplines that carry an engagement, in the team grid's geometry. */
  disciplines: [
    {
      n: '01',
      title: 'Strategy',
      body: 'What the organization is trying to change, what it is constrained by, and which of those constraints are real.',
    },
    {
      n: '02',
      title: 'Design',
      body: 'Product strategy, information architecture, interface and experience, and the standards that hold them together.',
    },
    {
      n: '03',
      title: 'Agentic AI',
      body: 'Where a system can decide, where it may only propose, and what a person is shown when they are asked to approve.',
    },
    {
      n: '04',
      title: 'Automation',
      body: 'The handoffs between systems, and the operational data that has to be right before any of it can run.',
    },
    {
      n: '05',
      title: 'Engineering',
      body: 'The platform, the integrations, the deployment model, and the documentation that lets you own it afterwards.',
    },
  ],

  /** The reference closes About with a pricing deck and a FAQ, and so does
   *  this page. Nothing sits here. */
} as const;
