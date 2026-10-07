import type { ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   INSIGHTS.

   THE INSTRUCTION THIS FILE IS WRITTEN UNDER:

     "Insights can contain substantive corporate articles based on
      Recalibre's actual expertise. Do not invent client results or external
      evidence."

   So these three are method pieces. Each one argues a position Recalibre
   holds, written from the design of OPS and Contraxis. Not one of them
   contains:

     a client, named or unnamed          a percentage
     a result, before or after           a benchmark
     an industry statistic               a citation to research
     a survey finding                    a named third party

   Where an article refers to something concrete, the something is OPS — the
   field operations product Recalibre is building in-house — and it is
   described as what it is: in development, demonstration data, not deployed.
   The facts used about it (three languages including right-to-left Arabic,
   offline-first) are read out of the product's own code, and the one event
   the articles tell (the first crew to use a prototype lost signal) is on
   record; both are in _MASTER/03-CASE-STUDIES/ops.md. No page or role count
   is printed anywhere on the site (the founder's decision, 25 September
   2026).

   NOTHING IS CLAIMED AS EXPERIENCE. The three used to say "we have seen",
   "in our own field work" and "in our experience", and to carry exact
   numbers (forty minutes, four hours, eleven places, within an hour) that
   read as things counted. The record holds no field or client experience
   behind them, so they came out and the arguments stayed (the founder's
   decision, 25 September 2026). Each was rewritten as reasoning or as a
   design principle, and the words that only report how often something
   happens (usually, most, often, frequently, far fewer) came out with
   them. The one event on record is the only thing stated as having
   happened.

   THE BYLINE IS THE FIRM, NOT A PERSON. Naming an author means naming an
   employee, and the founder has not asked to be bylined. "Recalibre" is
   accurate and invents nobody.

   THERE IS NO DATE ON AN ARTICLE. The three used to carry 5, 12 and 18
   September 2026, on the page, on a badge in every list, and in the data
   sent to Google. The site has never been public, so no article has a true
   publication date yet, and a date that is not known is left out rather
   than guessed (the founder's decision, 24 September 2026). The order below
   is the order every list prints; nothing sorts it.
   ========================================================================= */

export type Article = {
  slug: string;
  title: string;
  dek: string;
  subject: string;
  /** The standing disclosure under this article, if it needs one. The
   *  template used to print "OPS is in development and is not deployed with
   *  any organization" under every article, including the one that never
   *  mentions OPS. A disclosure attached to the wrong subject is noise, and
   *  noise is how a real disclosure stops being read. */
  note?: string;
  src?: ImageSrc;
  /** The phone's own cut of that picture (Phase C, 28 September 2026):
   *  below 810 the cover draws a 4:3 frame of the screen instead of the
   *  whole capture shrunk into it. See scripts/plates.py. */
  srcTall?: ImageSrc;
  /** Where an article has no honest picture of its own, the page draws the
   *  Contraxis system diagram (components/SystemDiagram.tsx) in the
   *  picture's place. The pages branch on `src` being absent; this names
   *  which figure stands in, for the day a second one exists. */
  figure?: 'contraxis';
  alt: string;
  /** The 1200 x 630 card this article shows when its link is pasted
   *  somewhere: the same picture as `src` where there is one, at the size
   *  every platform crops to. The articles used to send `src` itself — a tall portrait for one, a
   *  2200-wide capture for the others — and each platform cropped it its
   *  own way. */
  share: ImageSrc;
  /** The standfirst, set at lede size above the body. */
  standfirst: string;
  body: readonly { heading?: string; paragraphs: readonly string[] }[];
};

export const ARTICLES: readonly Article[] = [
  {
    slug: 'human-oversight-is-a-design-decision',
    title: 'Human oversight is a design decision',
    dek: 'A person in the loop is easy to promise. Design says which loop, at which step.',
    subject: 'Agentic AI',
    /* THE BORROWED GEOMETRY RENDER CAME OFF on 28 September 2026 (the
       owner's brief, section 29). The article draws the Contraxis diagram,
       the system it is about; the share card is the room's seats before
       the set, cut low with the floor's light (the bare wall it had first
       was a card with no subject). */
    figure: 'contraxis',
    share: '/img/og-human-oversight-b.jpg',
    alt: 'A rendered room: a chair and an ottoman on a concrete floor before a wide screen, against a deep blue wall.',
    note: 'Contraxis is in development.',
    standfirst:
      'Oversight written into a governance document is a statement of intent. Oversight written into a system is a constraint. The two are not the same thing, and only one of them survives contact with a busy Tuesday.',
    body: [
      {
        paragraphs: [
          'An organization can arrive at an automation conversation already holding a principle: a human being will remain accountable for anything that matters. It is a good principle. Stated that way, it is also unimplementable — because it does not say which decisions matter, at what point the person is brought in, or what they are shown when they are.',
          'Those three questions are architecture. They are settled in system design, before anything is built, and the answers become structure in the software rather than guidance in a handbook. If they are left to a policy document, what follows is that the system does whatever is easiest to build, and the policy describes it afterwards.',
        ],
      },
      {
        heading: 'Three places a decision can sit',
        paragraphs: [
          'There are only three, and being explicit about which one applies to each decision takes the ambiguity out of an automation program.',
          'The system acts, and tells nobody. Correct for reversible, low-consequence, high-volume work: moving a record between states, attaching a document to the right file, sending an internal reminder. If a person had to approve each one, the automation would not be worth commissioning.',
          'The system acts, and tells someone. Correct where the action is right nearly always and the cost of the rare error is an apology rather than a loss. The notification is not decoration; it is the mechanism by which the organization discovers the system is drifting.',
          'The system prepares, and a person commits. Correct wherever money moves, a commitment is made to a third party, or a safety judgment is involved. The work — the reading, the extraction, the cross-checking, the drafting — is still done by the system. What is not done by the system is the last click.',
        ],
      },
      {
        heading: 'The trail is the point, not the audit',
        paragraphs: [
          'A regulator or an auditor may want traceability. That is a reason, but it is not the important one. The important one is that a person cannot meaningfully approve something they cannot inspect.',
          'A decision presented as a recommendation with no working shown puts the reviewer in an impossible position: either rubber-stamp it, or redo the analysis themselves. The first makes the oversight theater. The second makes the automation pointless. So the trail — which source document, which clause, which rule, which previous decision — is not a compliance artifact bolted on at the end. It is what makes the approval step real.',
          'This is the shape Contraxis is being designed around, and it is why it is described as five steps rather than one: the document is read, the findings are surfaced, the actions are proposed, every step is recorded, and a person decides. The fifth step exists because the first four are worth nothing without it.',
        ],
      },
      {
        heading: 'What this costs, and why it is worth it',
        paragraphs: [
          'Designing oversight in is slower than not doing it. It requires an argument, early, about which decisions are consequential — and that argument surfaces disagreements inside the organization that were comfortable while they stayed implicit. Two directors who both believe a person stays in the loop can turn out to mean different people, at different points, with different authority.',
          'Having that argument during system design costs a few sessions in a room. Having it after something has gone out under the organization’s name costs considerably more. It is one of the few places in a delivery program where front-loading the difficulty is unambiguously the cheaper path.',
        ],
      },
    ],
  },

  {
    slug: 'offline-first-is-an-admission',
    title: 'Offline-first is an admission, not a feature',
    dek: 'Field software that needs signal is desk software, carried outside.',
    subject: 'Operations',
    src: '/img/ops-field.png',
    srcTall: '/img/ops-queue-phone-a.jpg',
    share: '/img/og-offline-first.jpg',
    alt: 'OPS working with no signal: a technician’s checklist for the day on a phone marked offline, beside the queue of reports waiting to send. Demonstration data.',
    note: 'OPS is in development. Every screen shown carries demonstration data.',
    standfirst:
      'The connectivity assumption is easy to make in an office, by people who have never lost signal while holding a clipboard in one hand.',
    body: [
      {
        paragraphs: [
          'An operational system is judged by its worst moment, not its best. The worst moment for field software is not a complicated workflow or an awkward form. It is a technician standing at a wellhead, far from the nearest signal, holding a device that has decided it cannot help.',
          'What happens next is predictable: the technician writes on paper, intending to enter it later. Later is the end of a long shift. Some of it gets entered. Some of it gets entered wrong. Some of it does not get entered at all. Before long the organization has an expensive system and a parallel paper process, and nobody can say with confidence which of the two is authoritative.',
        ],
      },
      {
        heading: 'Offline-first is not a synchronization strategy',
        paragraphs: [
          'The phrase is easy to hear as a technical detail — something about caching, or a queue, or a retry policy. It is not. It is a decision about where the authoritative copy of the day lives.',
          'In a connected-first system the server holds the truth and the device holds a view of it. In an offline-first system the device holds the day and the server receives it. Everything else follows from that choice: what identifiers look like, how conflicts are resolved, what a partially completed report means, whether a permit can be consumed without confirmation, and what the technician is allowed to do when the last known state is hours old.',
          'These are not questions that can be retrofitted. A system built connected-first and later given a cache produces something worse than either: an application that appears to work offline and silently loses a subset of the work. That failure mode is harder to detect than an outright refusal, and considerably more damaging, because it erodes trust in the data rather than in the software.',
        ],
      },
      {
        heading: 'What we learned building it',
        paragraphs: [
          'OPS, the field operations product we are developing in-house, is offline-first — and not because it was specified that way at the outset. It was specified that way after the first crew to use a prototype lost signal, and the design assumption that had felt reasonable in an office stopped being reasonable.',
          'The version now in development carries the day on the device. A technician receives their route, works the interventions, attaches photographs taken on site, and signs the daily report where the work happened. Nothing waits for coverage. The queue drains when the network returns, and the screens make the state of that queue visible rather than hiding it, because a person who cannot see whether their work has been sent will send it again.',
          'OPS is in development. The screens shown across this site carry demonstration data. What is transferable is not the product — it is the sequence: the connectivity assumption should be tested against the worst place the work happens, and it should be tested before the architecture is fixed rather than after.',
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
    title: 'Right-to-left is an architecture decision',
    dek: 'Adding Arabic late is not adding a language. It exposes the assumptions baked into the layout.',
    subject: 'Enterprise systems',
    src: '/img/ops-permits.png',
    srcTall: '/img/ops-register-phone-a.jpg',
    share: '/img/og-right-to-left.jpg',
    alt: 'The OPS permit register: permits by zone, and one hot-work permit open in detail, its title in French with the Arabic beneath it. Demonstration data.',
    note: 'OPS is in development. Every screen shown carries demonstration data.',
    standfirst:
      'Multilingual is easy to scope as a content problem and cost as one. In operational software serving a region where the paperwork is bilingual, it is a structural problem, and the cost of discovering that late is not linear.',
    body: [
      {
        paragraphs: [
          'Enterprise software can arrive in a market with a language file and an assurance that localization is supported. Supported can mean no more than the substitution of strings, leaving out the direction those strings run in, the shape of the numerals beside them, the side of the screen a label belongs on, the way a table sorts, and the fact that a single document may contain both scripts at once and must remain legible in both.',
          'For an organization operating where the regulatory paperwork is in one language and the working language of the crew is another, that gap is not cosmetic. It determines whether a permit register can be read at all.',
        ],
      },
      {
        heading: 'What actually breaks',
        paragraphs: [
          'Layout mirroring is the visible part and the easiest. Padding, iconography, progress direction, the position of a back control, the order of columns in a table — all of these flip, and a system that has hard-coded left and right rather than start and end has to be revisited everywhere at once.',
          'The harder part is mixed content. A permit reference, an equipment tag and a date can be Latin characters and Western numerals inside an otherwise right-to-left sentence. Getting that to render correctly and unambiguously — so that a reference number is never read backwards and never reflows into the wrong side of a cell — is not a styling exercise. It reaches into how the data is stored and how each field is typed.',
          'Then there is everything that is neither layout nor text: sort order, search behavior, text input that has to accept either script in the same field, exports that have to survive being opened in a spreadsheet on somebody’s laptop, and printed output that may be the artifact the organization actually relies on.',
        ],
      },
      {
        heading: 'The cost curve',
        paragraphs: [
          'Designed in from the start, bidirectional support is a constraint on how components are written. It is a discipline rather than an expense: use logical properties, type the fields, never assume a numeral system, and test both directions from the first screen.',
          'Retrofitted, it is a rewrite of the presentation layer conducted under deadline, and the failure mode is worse than the effort — the product ships with the second language supported everywhere except the places nobody thought to check, and those places are found by the users who most need them to work.',
          'OPS carries three languages, including full right-to-left Arabic. That structure is the reason the permit screens can hold a hot-work permit with its reference and dates in one script and its title in another, in the same row, without either becoming ambiguous.',
        ],
      },
      {
        heading: 'For anyone specifying a system',
        paragraphs: [
          'Put the second language in the first release of the specification, not the second phase of the roadmap. Ask for a screenshot of the most data-dense screen in both directions before signing anything. A supplier whose architecture already supports it can show you one; a supplier whose answer is a conversation about timelines is telling you it does not.',
        ],
      },
    ],
  },
];

/**
 * The reading time, counted from the article that is actually published.
 *
 * The three were hand-set to 6, 5 and 6 minutes and the copy had since been
 * cut roughly in half, so every badge on the site overstated its article by
 * about double. Reading at 200 words a minute is the common convention and
 * the only figure here that is not read straight out of the text.
 */
export function readingMinutes(article: Article): number {
  const words = [
    article.standfirst,
    ...article.body.flatMap((b) => [b.heading ?? '', ...b.paragraphs]),
  ]
    .join(' ')
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export const INSIGHTS_BLOCK = {
  eyebrow: 'INSIGHTS',
  headline: ['Notes on method.'],
  /** The index page's own line under "Insights." — the owner's words from
   *  his audit of 6 October 2026. */
  pageHeadline: 'Notes from the work.',
  featuredLabel: 'FEATURED',
  lede: 'Method pieces on the decisions that shape an operational system — where oversight sits, which copy of the day’s records counts, and what a second language costs when it arrives late. Written from the design of OPS and Contraxis.',
  cta: { label: 'Read all', href: '/insights' },
  byline: 'Recalibre',
} as const;
