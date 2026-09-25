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

   WHY THERE IS NO PORTRAIT HERE. The founder portrait has been in `assets`
   since 22 September 2026 (`founder-portrait.webp`) and is published on the
   homepage, at the edge of the hero's statement plate — see `plateMedia` in
   home.ts. This page still carries a role and no face: placing the portrait
   here changes the page's composition, and that is the owner's decision.
   Until he takes it, the leadership block stays as it is.
   ========================================================================= */

export const ABOUT = {
  eyebrow: 'THE FIRM',
  headline: ['A firm built', 'to carry the', 'whole program.'],
  lede: 'Recalibre is a strategy, design and technology firm. We work with organizations modernizing their operations, their customer experience and their digital infrastructure — and we deliver all five capabilities with one team and one point of accountability.',

  /* THE OPENING USED TO SPEND A FULL PARAGRAPH on what is wrong with buying
     from three suppliers before it said anything about Recalibre, and the
     third paragraph claimed the in-house products were "where the methods
     are tested at full scale". Neither product has been run at any scale:
     OPS is in development and Contraxis has no build at all. */
  story: {
    heading: ['Why it is', 'structured', 'this way.'],
    paragraphs: [
      'Strategy, design, agentic AI, automation and engineering are one integrated capability, carried by one team. The people who agree what should change are the people who build it, so there is no handover between the thinking and the work, and one person is accountable for both.',
      'The alternative is three suppliers and the gaps between them: a strategy nobody can build, a design nobody costed, a system that does what was specified rather than what was needed. Those gaps are not a service anybody sells, and they are not free.',
      'It is also why we build our own products. OPS and Contraxis are where the methods are worked out on real constraints before they are applied to anyone else’s operation. Both are in development.',
    ],
  },

  /** Structural facts. Every one is countable from this site. */
  figures: [
    { value: '05', label: 'Capabilities, delivered by one team' },
    { value: '03', label: 'Stages in the engagement model' },
    { value: '02', label: 'Products in development in-house' },
    { value: '01', label: 'Point of accountability' },
  ],

  /* WHAT IS STILL MISSING HERE is the principal's name and title. The audit
     is right that a page claiming one point of accountability should say
     whose. It is an owner input: the name and the role to print have not
     been approved, and a title invented for a founder is still an invented
     title. Until then the block says what the accountability actually
     consists of, which is checkable, rather than repeating that it exists. */
  leadership: {
    eyebrow: 'ACCOUNTABILITY',
    heading: ['One person', 'answers for', 'the engagement.'],
    body: 'The founder runs every engagement from the first assessment to the handover. The person who scopes the work is the person who reports on it, and the person you raise a problem with is the person who can change what happens next.',
    note: 'Named to you in writing at the start of the engagement, and unchanged through it.',
  },

  /** The disciplines that carry an engagement, in the team grid's geometry. */
  disciplines: [
    {
      n: '01',
      title: 'Strategy.',
      body: 'What the organization is trying to change, what it is constrained by, and which of those constraints are real.',
    },
    {
      n: '02',
      title: 'Design.',
      body: 'Product strategy, information architecture, interface and experience, and the standards that hold them together.',
    },
    {
      n: '03',
      title: 'Agentic AI.',
      body: 'Where a system can decide, where it may only propose, and what a person is shown when they are asked to approve.',
    },
    {
      n: '04',
      title: 'Automation.',
      body: 'The handoffs between systems, and the operational data that has to be right before any of it can run.',
    },
    {
      n: '05',
      title: 'Engineering.',
      body: 'The platform, the integrations, the deployment model and the documentation that lets you own it afterwards.',
    },
  ],

  /** The reference closes About with a pricing deck and a FAQ, and so does
   *  this page. Nothing sits here. */
} as const;
