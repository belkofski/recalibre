import type { ImageSrc } from './images.generated';

/* ==========================================================================
   OPS — A DAY IN THE FIELD

   WHERE EVERY WORD HERE COMES FROM.

   The five step names — Aperçu, Interventions, Équipes, Permis, Rapports —
   are not chosen here. They are the navigation of the product itself, legible
   in the left rail of every capture in this folder. The sixth step, working
   with no signal, is the "Mode hors ligne" state the same interface shows.

   The sentences describe what is visibly on the screen beside them and
   nothing else. None of them says the system is running anywhere, has users,
   has customers, or has shipped. It is in development, and the section says
   so at the top.

   EVERY CAPTURE CARRIES DEMONSTRATION DATA and every caption says so. The
   data in them — Équipe Atlas, Secteur 7, Pipeline nord, INT-4471, PTC-2231 —
   is demonstration data throughout. No real site, crew, permit or client
   appears in any of it.

   WHAT IS DELIBERATELY NOT HERE: a number of users, a number of jobs
   processed, a deployment, a client name, a launch date, or any claim about
   what the software has done for anyone. None of those facts exists yet.
   ========================================================================== */

export type OpsStep = {
  /** The module's own name, as it reads in the product's navigation. */
  id: string;
  n: string;
  label: string;
  /** What the screen beside it shows. Descriptive; claims nothing. */
  body: string;
  src: ImageSrc;
  alt: string;
  caption: string;
};

export const OPS_STEPS: readonly OpsStep[] = [
  {
    id: 'apercu',
    n: '01',
    label: 'Aperçu',
    body: 'The morning view. Jobs raised today, technicians on the ground, permits still valid, reports already sent — and the week behind it.',
    src: '/img/ops-overview.png',
    alt: "The OPS overview: interventions today, technicians in the field, active permits, reports transmitted, a seven-day activity chart, and the day's latest events by zone.",
    caption: 'Aperçu — the day at a glance. Demonstration data.',
  },
  {
    id: 'interventions',
    n: '02',
    label: 'Interventions',
    body: 'Every job with its reference, its crew, its zone and its state: closed, under way, or still to start.',
    src: '/img/ops-interventions.png',
    alt: 'The OPS interventions register: each job with its reference, description, crew, zone, time and status, beside the permits falling due.',
    caption: 'Interventions — the register. Demonstration data.',
  },
  {
    id: 'equipes',
    n: '03',
    label: 'Équipes',
    body: 'Who is where, who is short-handed, and which certifications are about to lapse before they stop a job.',
    src: '/img/ops-teams.png',
    alt: 'The OPS teams screen: three crews with their zone, headcount and vacant posts, the load carried by each over seven days, and the certifications due for renewal.',
    caption: 'Équipes — crews, load and certifications. Demonstration data.',
  },
  {
    id: 'permis',
    n: '04',
    label: 'Permis',
    body: 'Permits held per zone, each with its reference, the date it was issued and the date it must be renewed — in French and in Arabic, as the paperwork is.',
    src: '/img/ops-permits.png',
    alt: 'The OPS permit register: permits by zone with their next expiry, and one hot-work permit open in detail with its reference, issue date, renewal date and the HSE approval it needs.',
    caption: 'Permis — held, expiring, renewed. Demonstration data.',
  },
  {
    id: 'rapports',
    n: '05',
    label: 'Rapports',
    body: 'The day closed out: hours, weather, headcount, observations, the photographs taken on site, and the signature that ends it.',
    src: '/img/ops-daily-report.png',
    alt: "The OPS daily report: hours worked, shift, weather, zone, crew, permits used and incidents, with the site lead's observations, four field photographs, the signature and the HSE countersignature.",
    caption: 'Rapports — signed on site, sent to the office. Demonstration data.',
  },
  {
    id: 'hors-ligne',
    n: '06',
    label: 'Hors ligne',
    body: 'None of it needs a signal. The day is carried on the phone, the work is ticked off where it happens, and everything queues until coverage comes back.',
    src: '/img/ops-offline.png',
    alt: "OPS working with no signal: the technician's checklist for the day on a phone marked offline, beside what can still be done without a network and the queue of reports waiting to send.",
    caption: 'Hors ligne — the day continues without coverage. Demonstration data.',
  },
];

/** The twenty-second silent loop. The only footage that exists. */
export const OPS_LOOP = {
  src: '/video/ops-loop.mp4',
  poster: '/img/ops-loop-poster.jpg' as ImageSrc,
  width: 400,
  height: 522,
  caption: 'Aperçu, in motion. Demonstration data.',
} as const;

export const OPS_BLOCK = {
  eyebrow: 'OPS · FIELD OPERATIONS',
  headline: { l1: 'One working day,', l2: 'end to end.' },
  /** The status word, rendered. It is in development and the page says so. */
  status: 'IN DEVELOPMENT',
  lead: [
    'Jobs, crews, permits and the daily report in one register —',
    'so the office and the field are reading the same day.',
  ],
  /** The honesty line. It is the first thing under the headline. */
  note: 'OPS is in development. Every screen below carries demonstration data, and no part of it is deployed with a client.',
} as const;
