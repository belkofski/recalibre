import type { ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   INSIGHTS.

   THE INSTRUCTION THIS FILE IS WRITTEN UNDER:

     "Insights can contain substantive corporate articles based on
      Recalibre's actual expertise. Do not invent client results or external
      evidence."

   So these three are method pieces. Each one argues a position Recalibre
   holds and can defend from its own work. Not one of them contains:

     a client, named or unnamed          a percentage
     a result, before or after           a benchmark
     an industry statistic               a citation to research
     a survey finding                    a named third party

   Where an article refers to something concrete, the something is OPS — the
   field operations product Recalibre is building in-house — and it is
   described as what it is: in development, demonstration data, not deployed.
   The facts used about it (fourteen pages, nine roles, three languages
   including right-to-left Arabic, offline-first, self-hosted) are read out
   of the product's own code and recorded in _MASTER/03-CASE-STUDIES/ops.md.

   THE BYLINE IS THE FIRM, NOT A PERSON. Naming an author means naming an
   employee, and the founder has not asked to be bylined. "Recalibre" is
   accurate and invents nobody.
   ========================================================================= */

export type Article = {
  slug: string;
  title: string;
  dek: string;
  subject: string;
  /** ISO. Used for <time> and for ordering. */
  date: string;
  /** Printed on the date badge. */
  day: string;
  month: string;
  year: string;
  minutes: number;
  src: ImageSrc;
  alt: string;
  /** The standfirst, set at lede size above the body. */
  standfirst: string;
  body: readonly { heading?: string; paragraphs: readonly string[] }[];
};

export const ARTICLES: readonly Article[] = [
  {
    slug: 'human-oversight-is-a-design-decision',
    title: 'Human oversight is a design decision, not a policy',
    dek: 'Every organization says a person stays in the loop. Far fewer can say which loop, at which step, holding what information.',
    subject: 'Agentic AI',
    date: '2026-09-18',
    day: '18',
    month: 'SEP',
    year: '2026',
    minutes: 6,
    src: '/img/render-geometry.jpg',
    alt: 'A monochrome render: wireframe polyhedra and solid white planes suspended against black, lit along their edges.',
    standfirst:
      'Oversight written into a governance document is a statement of intent. Oversight written into a system is a constraint. The two are not the same thing, and only one of them survives contact with a busy Tuesday.',
    body: [
      {
        paragraphs: [
          'Most organizations arrive at an automation conversation already holding a principle: a human being will remain accountable for anything that matters. It is a good principle. It is also, in almost every case we have seen it written down, unimplementable as stated — because it does not say which decisions matter, at what point the person is brought in, or what they are shown when they are.',
          'Those three questions are architecture. They are settled in system design, before anything is built, and the answers become structure in the software rather than guidance in a handbook. If they are left to a policy document, what actually happens is that the system does whatever is easiest to build, and the policy describes it afterwards.',
        ],
      },
      {
        heading: 'Three places a decision can sit',
        paragraphs: [
          'In practice there are only three, and being explicit about which one applies to each decision removes most of the ambiguity from an automation programme.',
          'The system acts, and tells nobody. Correct for reversible, low-consequence, high-volume work: moving a record between states, attaching a document to the right file, sending an internal reminder. If a person had to approve each one, the automation would not be worth commissioning.',
          'The system acts, and tells someone. Correct where the action is right nearly always and the cost of the rare error is an apology rather than a loss. The notification is not decoration; it is the mechanism by which the organization discovers the system is drifting.',
          'The system prepares, and a person commits. Correct wherever money moves, a commitment is made to a third party, or a safety judgement is involved. The work — the reading, the extraction, the cross-checking, the drafting — is still done by the system. What is not done by the system is the last click.',
        ],
      },
      {
        heading: 'The trail is the point, not the audit',
        paragraphs: [
          'Organizations often ask for traceability because a regulator or an auditor wants it. That is a reason, but it is not the important one. The important one is that a person cannot meaningfully approve something they cannot inspect.',
          'A decision presented as a recommendation with no working shown puts the reviewer in an impossible position: either rubber-stamp it, or redo the analysis themselves. The first makes the oversight theatre. The second makes the automation pointless. So the trail — which source document, which clause, which rule, which previous decision — is not a compliance artefact bolted on at the end. It is what makes the approval step real.',
          'This is the shape Contraxis is being designed around, and it is why its concept is described as five steps rather than one: the document is read, the findings are surfaced, the actions are proposed, every step is recorded, and a person decides. The fifth step exists because the first four are worth nothing without it.',
        ],
      },
      {
        heading: 'What this costs, and why it is worth it',
        paragraphs: [
          'Designing oversight in is slower than not doing it. It requires an argument, early, about which decisions are consequential — and that argument surfaces disagreements inside the organization that were comfortable while they stayed implicit. Two directors who both believe a person stays in the loop frequently turn out to mean different people, at different points, with different authority.',
          'Having that argument during system design costs a week. Having it after something has gone out under the organization’s name costs considerably more. It is one of the few places in a delivery programme where front-loading the difficulty is unambiguously the cheaper path.',
        ],
      },
    ],
  },

  {
    slug: 'offline-first-is-an-admission',
    title: 'Offline-first is an admission, not a feature',
    dek: 'Field software that requires a network is desk software that has been carried outside.',
    subject: 'Operations',
    date: '2026-09-12',
    day: '12',
    month: 'SEP',
    year: '2026',
    minutes: 5,
    src: '/img/ops-field-wide.png',
    alt: 'OPS working with no signal: a technician’s checklist for the day on a phone marked offline, beside the queue of reports waiting to send.',
    standfirst:
      'The connectivity assumption is usually made in an office, by people who have never lost signal while holding a clipboard in one hand. It is the single most common reason operational software is quietly abandoned by the people it was bought for.',
    body: [
      {
        paragraphs: [
          'An operational system is judged by its worst moment, not its best. The worst moment for field software is not a complicated workflow or an awkward form. It is a technician standing at a wellhead, forty minutes from the nearest signal, holding a device that has decided it cannot help.',
          'What happens next is predictable and almost universal: the technician writes on paper, intending to enter it later. Later is the end of a twelve-hour shift. Some of it gets entered. Some of it gets entered wrong. Some of it does not get entered at all. Within a quarter, the organization has an expensive system and a parallel paper process, and nobody can say with confidence which of the two is authoritative.',
        ],
      },
      {
        heading: 'Offline-first is not a synchronisation strategy',
        paragraphs: [
          'The phrase is often heard as a technical detail — something about caching, or a queue, or a retry policy. It is not. It is a decision about where the authoritative copy of the day lives.',
          'In a connected-first system the server holds the truth and the device holds a view of it. In an offline-first system the device holds the day and the server receives it. Everything else follows from that choice: what identifiers look like, how conflicts are resolved, what a partially completed report means, whether a permit can be consumed without confirmation, and what the technician is allowed to do when the last known state is four hours old.',
          'These are not questions that can be retrofitted. A system built connected-first and later given a cache produces something worse than either: an application that appears to work offline and silently loses a subset of the work. That failure mode is harder to detect than an outright refusal, and considerably more damaging, because it erodes trust in the data rather than in the software.',
        ],
      },
      {
        heading: 'What we learned building it',
        paragraphs: [
          'OPS, the field operations product we are developing in-house, is offline-first — and not because it was specified that way at the outset. It was specified that way after the first crew to use a prototype lost signal, and the design assumption that had felt reasonable in an office stopped being reasonable within an hour.',
          'The version now in development carries the day on the device. A technician receives their route, works the interventions, attaches photographs taken on site, and signs the daily report where the work happened. Nothing waits for coverage. The queue drains when the network returns, and the screens make the state of that queue visible rather than hiding it, because a person who cannot see whether their work has been sent will send it again.',
          'OPS is in development and is not deployed with any organization. The screens shown across this site carry demonstration data. What is transferable is not the product — it is the sequence: the connectivity assumption should be tested against the worst place the work happens, and it should be tested before the architecture is fixed rather than after.',
        ],
      },
      {
        heading: 'A question worth asking before procurement',
        paragraphs: [
          'When evaluating any operational system, ask the supplier to describe precisely what a user can and cannot do with no network, and what happens to work completed in that state. Ask what the user is shown. Ask how a conflict is resolved when two people edited the same record from two different dead zones.',
          'The answers separate systems designed for the field from systems designed for a desk and then carried outside. There is no shame in the second — plenty of good software is meant for a desk. The failure is buying one and deploying it as the other.',
        ],
      },
    ],
  },

  {
    slug: 'right-to-left-is-architecture',
    title: 'Right-to-left is an architecture decision, not a translation task',
    dek: 'Adding Arabic to a finished product is not adding a language. It is discovering how many assumptions were baked into the layout.',
    subject: 'Enterprise systems',
    date: '2026-09-05',
    day: '05',
    month: 'SEP',
    year: '2026',
    minutes: 6,
    src: '/img/ops-permits-wide.png',
    alt: 'The OPS permit register: permits by zone, and one hot-work permit open in detail with its reference in French and its title in Arabic.',
    standfirst:
      'Multilingual is usually scoped as a content problem and costed as one. In operational software serving a region where the paperwork is bilingual, it is a structural problem, and the cost of discovering that late is not linear.',
    body: [
      {
        paragraphs: [
          'A great deal of enterprise software arrives in a market with a language file and an assurance that localisation is supported. What is usually supported is the substitution of strings. What is usually not supported is the direction those strings run in, the shape of the numerals beside them, the side of the screen a label belongs on, the way a table sorts, or the fact that a single document may contain both scripts at once and must remain legible in both.',
          'For an organization operating where the regulatory paperwork is in one language and the working language of the crew is another, that gap is not cosmetic. It determines whether a permit register can be read at all.',
        ],
      },
      {
        heading: 'What actually breaks',
        paragraphs: [
          'Layout mirroring is the visible part and the easiest. Padding, iconography, progress direction, the position of a back control, the order of columns in a table — all of these flip, and a system that has hard-coded left and right rather than start and end has to be revisited everywhere at once.',
          'The harder part is mixed content. A permit reference, an equipment tag and a date are frequently Latin characters and Western numerals inside an otherwise right-to-left sentence. Getting that to render correctly and unambiguously — so that a reference number is never read backwards and never reflows into the wrong side of a cell — is not a styling exercise. It reaches into how the data is stored and how each field is typed.',
          'Then there is everything that is neither layout nor text: sort order, search behaviour, text input that has to accept either script in the same field, exports that have to survive being opened in a spreadsheet on somebody’s laptop, and printed output that is often the artefact the organization actually relies on.',
        ],
      },
      {
        heading: 'The cost curve',
        paragraphs: [
          'Designed in from the start, bidirectional support is a constraint on how components are written. It is a discipline rather than an expense: use logical properties, type the fields, never assume a numeral system, and test both directions from the first screen.',
          'Retrofitted, it is a rewrite of the presentation layer conducted under deadline, and the failure mode is worse than the effort — the product ships with the second language supported everywhere except the eleven places nobody thought to check, and those places are found by the users who most need them to work.',
          'OPS carries three languages, including full right-to-left Arabic, across fourteen pages and nine roles. That is a structural fact about the product rather than a claim about its performance — it is in development and deployed with nobody. But it is the reason the permit screens can hold a hot-work permit with its reference and dates in one script and its title in another, in the same row, without either becoming ambiguous.',
        ],
      },
      {
        heading: 'For anyone specifying a system',
        paragraphs: [
          'Put the second language in the first release of the specification, not the second phase of the roadmap. Ask for a screenshot of the most data-dense screen in both directions before signing anything. If the supplier can produce one in a week, the architecture supports it. If the question produces a conversation about timelines, it does not.',
        ],
      },
    ],
  },
];

export const INSIGHTS_BLOCK = {
  eyebrow: 'INSIGHTS',
  headline: ['Notes on method.'],
  lede: 'Positions we hold and can defend from our own work. No client results, no borrowed statistics.',
  cta: { label: 'Read all', href: '/insights' },
  byline: 'Recalibre',
} as const;
