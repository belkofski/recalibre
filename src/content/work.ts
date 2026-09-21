import type { ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   THE THREE INITIATIVES, IN FULL.

   THE REFERENCE'S CASE-STUDY TEMPLATE has eleven fields. Seven of them can
   be filled honestly here. Four cannot, and are absent rather than faked:

     PROJECT TEAM      three named people with job titles. Recalibre has one
                       approved portrait and no employees to name.
     RESULTS           two animated figures, measured over ninety days. None
                       of these three has been measured over anything.
     CLIENT QUOTE      a name, a title and a five-star rating.
     LIVE WEBSITE      a link to the running product. Two of the three are in
                       development; the third is a brand, not a deployment.

   Each detail page states what is missing and why, in one line, rather than
   quietly closing the gap. A missing section is honest. A made-up figure is
   the one thing this site cannot survive.

   ABP CONTINENTAL AND DORWA PRODUCTION HAVE NO ENTRY HERE. ABP's written
   permission is not granted; Dorwa's relationship and scope are unconfirmed.
   Both appear as marks on the register and nowhere else.
   ========================================================================= */

export type Shot = {
  src: ImageSrc;
  alt: string;
  caption: string;
  /** true = the shot runs the full width of the gallery */
  wide?: boolean;
};

export type Initiative = {
  slug: string;
  name: string;
  status: string;
  /** The colour the status pill takes. 'dev' = in development. */
  tone: 'dev' | 'owned';
  year: string;
  category: string;
  scope: readonly string[];
  tags: readonly string[];
  /** The line under the title. */
  summary: string;
  /** The problem the work addresses. Never a client's problem unless the
   *  client has given permission — so for OPS it is the situation the
   *  product is designed for, stated generally. */
  problem: { label: string; body: string };
  /** Structural facts, read out of the record. Never results. */
  facts: readonly { value: string; unit: string; label: string }[];
  /** What is built or delivered, as a list. */
  built: readonly string[];
  shots: readonly Shot[];
  /** The line that says what is deliberately not on this page. */
  absent: string;
  /** Cover for the index grid. Empty string = the drawing is used. */
  cover: ImageSrc | '';
  coverAlt: string;
};

export const INITIATIVES: readonly Initiative[] = [
  {
    slug: 'ops',
    name: 'OPS',
    status: 'PRODUCT IN DEVELOPMENT',
    tone: 'dev',
    year: '2026',
    category: 'Field operations',
    scope: ['Product strategy', 'Interface design', 'Engineering', 'Offline architecture'],
    tags: ['PRODUCT', 'ENGINEERING', 'DESIGN'],
    summary:
      'A field operations system for crews working sites: interventions, permits, teams and the daily report in one register, built to work where there is no signal.',
    problem: {
      label: 'THE SITUATION IT IS DESIGNED FOR',
      body: 'Interventions raised on paper, permits tracked in a spreadsheet, day sheets chased by phone — and no signal on site to do any of it live. The office and the field end up reading two different versions of the same day, and neither can be sure which one is right.',
    },
    facts: [
      { value: '14', unit: 'pages', label: 'Across the operational modules' },
      { value: '09', unit: 'roles', label: 'Permissions modelled end to end' },
      { value: '03', unit: 'languages', label: 'Including right-to-left Arabic' },
    ],
    built: [
      'Interventions — every job with its reference, crew, zone, time and state',
      'Permits — held per zone, each with its issue and renewal date, in French and Arabic',
      'Teams — who is where, who is short-handed, which certifications are lapsing',
      'Daily reports — hours, weather, observations, site photographs, signature and countersignature',
      'Offline-first — the day is carried on the device and queues until coverage returns',
      'Self-hosted — one server, one database, held by the organization using it',
    ],
    shots: [
      {
        src: '/img/ops-overview.png',
        alt: 'The OPS overview: interventions today, technicians in the field, active permits, reports transmitted, a seven-day activity chart, and the day’s latest events by zone.',
        caption: 'Aperçu — the day at a glance. Demonstration data.',
        wide: true,
      },
      {
        src: '/img/ops-interventions.png',
        alt: 'The OPS interventions register: each job with its reference, description, crew, zone, time and status, beside the permits falling due.',
        caption: 'Interventions — the register. Demonstration data.',
      },
      {
        src: '/img/ops-teams.png',
        alt: 'The OPS teams screen: three crews with their zone, headcount and vacant posts, the load carried by each over seven days, and the certifications due for renewal.',
        caption: 'Équipes — crews, load and certifications. Demonstration data.',
      },
      {
        src: '/img/ops-permits-wide.png',
        alt: 'The OPS permit register: permits by zone with their next expiry, and one hot-work permit open in detail with its reference, issue date, renewal date and the HSE approval it needs.',
        caption: 'Permis — held, expiring, renewed. French and Arabic. Demonstration data.',
        wide: true,
      },
      {
        src: '/img/ops-daily-report.png',
        alt: 'The OPS daily report: hours worked, shift, weather, zone, crew, permits used and incidents, with the site lead’s observations, four field photographs, the signature and the HSE countersignature.',
        caption: 'Rapports — signed on site, sent to the office. Demonstration data.',
      },
      {
        src: '/img/ops-sync-queue.png',
        alt: 'The OPS synchronisation queue: items completed without a network, each with its origin and state, waiting to send when coverage returns.',
        caption: 'The queue — work done offline, waiting to send. Demonstration data.',
      },
      {
        src: '/img/ops-field-wide.png',
        alt: 'OPS working with no signal: the technician’s checklist for the day on a phone marked offline, beside what can still be done without a network and the queue of reports waiting to send.',
        caption: 'Hors ligne — the day continues without coverage. Demonstration data.',
        wide: true,
      },
    ],
    absent:
      'OPS is in development. It is not deployed with any organization, it has no users outside Recalibre, and every screen above carries demonstration data. There are no results on this page because there is nothing yet to measure.',
    cover: '/img/ops-teams-wide.png',
    coverAlt:
      'The OPS teams screen: three crews with their zone, headcount and vacant posts, and the certifications due for renewal.',
  },

  {
    slug: 'contraxis',
    name: 'Contraxis',
    status: 'PRODUCT CONCEPT IN DEVELOPMENT',
    tone: 'dev',
    year: '2026',
    category: 'Document intelligence',
    scope: ['Product concept', 'Agentic architecture', 'Oversight design'],
    tags: ['PRODUCT', 'AGENTIC AI'],
    summary:
      'An agentic AI system for contract and document intelligence: read the document, surface what matters, propose the action, keep the trail, and leave the decision with a person.',
    problem: {
      label: 'THE SITUATION IT IS DESIGNED FOR',
      body: 'Obligations, dates and liabilities live inside documents nobody has time to re-read. The information is not hidden — it is simply distributed across more pages than any one person can hold, and it surfaces when a deadline has already passed.',
    },
    facts: [
      { value: '05', unit: 'steps', label: 'From document to decision' },
      { value: '01', unit: 'decision', label: 'And it belongs to a person' },
    ],
    built: [
      'Read — contracts, invoices and reports taken as they arrive',
      'Surface — terms, dates and obligations extracted and located in the source',
      'Propose — an action put forward, never executed on its own authority',
      'Record — every step traceable back to the clause that produced it',
      'Decide — presented to a person with the working shown, and they decide',
    ],
    shots: [],
    absent:
      'There is no screenshot of Contraxis on this site, and there will not be one until the product is further along. The diagram above is a drawing of the concept and is labelled as one. No interface, no data, no adoption figure and no deployment is shown or claimed.',
    cover: '',
    coverAlt: '',
  },

  {
    slug: 'belkofski',
    name: 'Belkofski',
    status: 'RECALIBRE-OWNED BRAND',
    tone: 'owned',
    year: '2025',
    category: 'Brand and digital',
    scope: ['Brand strategy', 'Identity', '3D and campaign', 'Digital'],
    tags: ['BRAND', 'DIGITAL', '3D'],
    summary:
      'An eyewear house Recalibre owns and runs — brand, identity, digital and 3D taken end to end in-house.',
    problem: {
      label: 'WHY IT IS ON THIS SITE',
      body: 'The brand and identity capability is the only one of the five with no product behind it, so it had nothing to point at. Belkofski is a company Recalibre owns, which makes it usable without waiting on anyone: no client permission is owed, no agreement applies, and nothing about it has to be checked with a third party before it is published.',
    },
    facts: [
      { value: '01', unit: 'house', label: 'Owned and run by Recalibre' },
      { value: '04', unit: 'disciplines', label: 'Brand, identity, 3D, digital' },
    ],
    built: [
      'Brand strategy and positioning',
      'Identity system and brand standards',
      'Product renders and campaign direction',
      'Digital presence',
    ],
    shots: [
      {
        src: '/img/belkofski-lens.jpg',
        alt: 'A pair of Belkofski frames on black, the lenses in a deep orange gradient, the name set along the temple arm.',
        caption: 'Frames, orange lens.',
      },
      {
        src: '/img/belkofski-frames.jpg',
        alt: 'A pair of black Belkofski frames on black, lenses in a deep orange gradient, the name set along the temple arm and again inside the lens.',
        caption: 'The same pair, lit differently.',
      },
      {
        src: '/img/belkofski-cube.jpg',
        alt: 'A render: a machine head above a polished black cube, a molten dark mass spilling down its face, a pair of frames with orange lenses set into it, on a perforated steel bed.',
        caption: 'The cube.',
        wide: true,
      },
      {
        src: '/img/belkofski-shelf.jpg',
        alt: 'A pair of dark frames with red lenses resting on an orange steel shelf, between perforated black panels lit from behind.',
        caption: 'On the shelf.',
      },
      {
        src: '/img/belkofski-paddle.jpg',
        alt: 'A blue pickleball paddle carrying the Belkofski wordmark, lying on a court line with a white ball beside it and a pair of clear frames with green lenses on its face.',
        caption: 'Court, paddle, frames.',
      },
    ],
    absent:
      'Belkofski is a company Recalibre owns. It is not a client, it is never counted as one, and no sales, revenue or growth figure is published — a number a firm reports about itself is not one anyone can check. What Recalibre did for Belkofski, and when, is not recorded anywhere that can be verified, so it is described as scope rather than as a result.',
    cover: '/img/belkofski-lens.jpg',
    coverAlt:
      'A pair of Belkofski frames on black, the lenses in a deep orange gradient, the name set along the temple arm.',
  },
];

export const WORK_INDEX = {
  eyebrow: 'SELECTED INITIATIVES',
  headline: ['Selected work.'],
  lede: 'Three initiatives, each labelled with what it is. Two are products in development. One is a brand Recalibre owns.',
  /** The filter row the reference runs over its eight entries. */
  filters: ['ALL', 'PRODUCT', 'BRAND', 'ENGINEERING', 'DESIGN', 'AGENTIC AI', 'DIGITAL', '3D'] as const,
};

export function initiativeBySlug(slug: string) {
  return INITIATIVES.find((i) => i.slug === slug);
}
