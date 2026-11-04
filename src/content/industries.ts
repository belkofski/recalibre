import type { ImageSrc } from '@/lib/images.generated';
import type { ServiceSlug } from '@/content/services';

/* ============================================================================
   THE INDUSTRIES — one sector today, built to take more.

   DRAFT — owner review. Written 4 November 2026 on the owner's decision of
   the same week: one sector for now, oil and gas and the industrial
   services around it — contractors, EPC, maintenance, supply and
   logistics, HSE, field operations — and only ABP Continental named. The
   audit of 3 November 2026 found the word "industries" nowhere on the
   site, and the only sector signal in the ABP case ("the Algerian oil and
   gas fields") and in OPS.

   WHAT THIS PAGE SAYS is what these organizations have to do and what the
   firm builds for it, in the same terms as the service pages. What it
   does not say, by the founder's rule in content/site.ts: no client other
   than ABP, no operator named, no result, no count of anything, no claim
   that any system is deployed. OPS is in development and is described as
   such; the ABP work is the brand, the identity and the website, which is
   what was delivered.

   THE VALUE CHAIN (components/art/ValueChain.tsx) is a generic description
   of the sector's structure — upstream, midstream, downstream and the
   services around all three — with the firm's own services mapped to each
   segment. It describes the sector, not any company in it.

   A second sector is a second entry in SECTORS; the page reads the list.
   ========================================================================= */

export type Segment = {
  key: string;
  title: string;
  /** What this segment of the sector does, in one line. */
  what: string;
  /** The operational facts of life there that the firm's work addresses. */
  realities: readonly string[];
  /** The firm's services that apply, with what each means here. */
  services: readonly { slug: ServiceSlug; how: string }[];
};

export type Audience = {
  title: string;
  /** Who they are, in one line. */
  who: string;
  /** What they are dealing with, and what the firm builds for it. */
  need: string;
  build: string;
  services: readonly ServiceSlug[];
};

export type Sector = {
  slug: string;
  name: string;
  headline: readonly string[];
  mark: string;
  lede: string;
  body: readonly string[];
  chainLabel: string;
  chainHeadline: readonly string[];
  chainNote: string;
  chain: readonly Segment[];
  audiencesLabel: string;
  audiencesHeadline: readonly string[];
  audiences: readonly Audience[];
  projects: readonly string[];
  faq: readonly { q: string; a: string }[];
  meta: { title: string; description: string; image: ImageSrc; imageAlt: string };
};

export const SECTORS: readonly Sector[] = [
  {
    slug: 'oil-and-gas',
    name: 'Oil and gas, and industrial services',
    headline: ['Oil and gas, and the', 'industrial services', 'around it.'],
    mark: 'industrial services',
    lede: 'For the contractors, engineering firms, maintenance companies, suppliers and field operations that keep production running: organizations whose work is audited before it is awarded, recorded on paper, and done where there is no signal.',
    body: [
      'The sector runs on documents and on trust. An operator qualifies a supplier before it hires one, and the qualification starts with whatever the supplier has published. A permit, a certification, a daily report and an HSE record each have to exist, be current and be findable when an auditor asks. Most of that is still carried on paper and in spreadsheets, re-keyed at a desk at the end of the day, by people who were in the field when it happened.',
      'That is the ground Recalibre works on. Brand and identity for the firm that has to be trusted with a scope of work; the field systems that carry the day without a network; the integration that makes the office and the site read one version of it; and the automation that takes the repetition out of the documents while leaving every decision that carries weight — safety, money, a contractual commitment — with a person.',
    ],
    chainLabel: 'THE VALUE CHAIN',
    chainHeadline: ['Where the work', 'sits.'],
    chainNote:
      'The sector’s structure, not any company in it. Point at a segment, or move to it with the keyboard, to see which of the firm’s services apply there.',
    chain: [
      {
        key: 'upstream',
        title: 'Upstream',
        what: 'Exploration, drilling and production: the fields, the wells and the facilities on them.',
        realities: [
          'Work is done on remote sites, in shifts, often without a network connection',
          'Permits to work are issued per zone and lapse on a date',
          'Every intervention has a crew, a time, a state and a report that someone has to sign',
        ],
        services: [
          { slug: 'custom-software-development', how: 'Field systems that carry the day on the device and queue until coverage returns' },
          { slug: 'enterprise-systems-and-integration', how: 'One register the field writes to and the office reads from' },
          { slug: 'agentic-ai-and-automation', how: 'Alerts raised from the data: a permit about to lapse, a report not filed' },
        ],
      },
      {
        key: 'midstream',
        title: 'Midstream',
        what: 'Pipelines, storage and transport: moving what is produced to where it is processed.',
        realities: [
          'Long assets with many contractors working on them at once',
          'Inspection, maintenance and shutdown work planned months ahead and executed in days',
          'Records that have to reconcile across the operator, the contractor and the regulator',
        ],
        services: [
          { slug: 'enterprise-systems-and-integration', how: 'Integration across the systems the operator, the contractor and the regulator each keep' },
          { slug: 'custom-software-development', how: 'Shutdown and maintenance registers with the trail an audit asks for' },
          { slug: 'agentic-ai-and-automation', how: 'Document intelligence for the inspection reports and the contracts behind them' },
        ],
      },
      {
        key: 'downstream',
        title: 'Downstream',
        what: 'Refining, processing and distribution: plants, terminals and the supply chains out of them.',
        realities: [
          'Plant operations with many systems that each hold a piece of the truth',
          'Procurement that runs on tenders, qualifications and supplier documentation',
          'Reporting to the board, the regulator and the client in formats that do not match',
        ],
        services: [
          { slug: 'enterprise-systems-and-integration', how: 'A source of operational data the plant’s systems agree on' },
          { slug: 'agentic-ai-and-automation', how: 'Tender and supplier documents read, checked and routed, with a person deciding' },
          { slug: 'custom-software-development', how: 'Reporting systems that produce the document each reader actually asks for' },
        ],
      },
      {
        key: 'services',
        title: 'Industrial services',
        what: 'The contractors, EPC firms, maintenance companies, suppliers and logistics operators that work for all three.',
        realities: [
          'Qualified by procurement before any work is awarded, on what they have published',
          'Crews on client sites, under the client’s permits and the client’s HSE rules',
          'Certifications, equipment records and daily reports that must be current and findable',
        ],
        services: [
          { slug: 'brand-strategy-and-identity', how: 'An identity written for the procurement reader deciding whether to trust the firm' },
          { slug: 'product-and-experience-design', how: 'A public website built for tender qualification, and the field interfaces crews actually use' },
          { slug: 'custom-software-development', how: 'The crew, equipment and certification registers that a contractor runs on' },
        ],
      },
    ],
    audiencesLabel: 'WHO IT IS FOR',
    audiencesHeadline: ['Six kinds of', 'organization.'],
    audiences: [
      {
        title: 'Contractors',
        who: 'Firms working pipeline, steel erection, civil works and shutdowns on operators’ sites.',
        need: 'Qualified on paper before being hired, then measured on how the work is recorded as much as how it is done.',
        build: 'An identity and a website written for the procurement reader; a field register for the crews, the permits and the daily report.',
        services: ['brand-strategy-and-identity', 'product-and-experience-design', 'custom-software-development'],
      },
      {
        title: 'EPC firms',
        who: 'Engineering, procurement and construction companies carrying a project from design to handover.',
        need: 'Documents from many parties that have to agree, and a handover package the client can actually use.',
        build: 'Document intelligence across the contract set; integration between the project’s systems; the reporting the client requires.',
        services: ['agentic-ai-and-automation', 'enterprise-systems-and-integration', 'custom-software-development'],
      },
      {
        title: 'Maintenance companies',
        who: 'Planned and corrective maintenance, inspection and shutdown work on producing assets.',
        need: 'Work orders, permits and inspection records that have to exist before the work and reconcile after it.',
        build: 'A maintenance register with its permits and its trail; alerts raised from the data when something lapses.',
        services: ['custom-software-development', 'agentic-ai-and-automation'],
      },
      {
        title: 'Supply and logistics',
        who: 'Suppliers, transport and base operators feeding the sites.',
        need: 'Orders, deliveries and certifications moving between the supplier’s systems and the client’s.',
        build: 'Integration between the two sides; a portal where a client submits, tracks and retrieves in one place.',
        services: ['enterprise-systems-and-integration', 'custom-software-development'],
      },
      {
        title: 'HSE',
        who: 'The health, safety and environment functions on both the operator’s and the contractor’s side.',
        need: 'Records that have to be current, signed and findable when an auditor asks, produced by people in the field.',
        build: 'The signed daily report with its countersignature; certifications tracked to their lapse date; the trail behind every automated step.',
        services: ['custom-software-development', 'agentic-ai-and-automation'],
      },
      {
        title: 'Field operations',
        who: 'The crews, supervisors and site leads doing the work where there is no signal.',
        need: 'A day recorded once, in the field, in the languages the crew actually reads, that the office can trust.',
        build: 'An offline-first field system in French and Arabic — OPS, the product in development, is designed for exactly this.',
        services: ['custom-software-development', 'product-and-experience-design'],
      },
    ],
    projects: ['abp-continental', 'ops'],
    faq: [
      {
        q: 'Do you work for operators or for their contractors?',
        a: 'Both kinds of organization have the same problem from different sides: a day’s work that has to be recorded, permitted, reported and audited. The work published on this site is for an industrial contractor and for the field crews a product is designed around; the systems apply on either side of the contract.',
      },
      {
        q: 'Can a system work on a site with no network?',
        a: 'Yes, when it is designed for that from the start. OPS, the field operations product in development, carries the day on the device and queues it until coverage returns. The offline case is an architecture decision taken during Calibration, not a feature added later.',
      },
      {
        q: 'Where does the data live?',
        a: 'Inside the organization that owns it, by design: one server, one database per organization, on infrastructure you control. Data residency and access are agreed during Calibration and written into the scope.',
      },
      {
        q: 'Do you cover other sectors?',
        a: 'The five services apply wherever an operation runs on documents, field work and systems that do not talk to each other. Oil and gas and its industrial services is the sector the published work comes from, and the one this page describes; the engagement itself starts the same way everywhere, with a Calibration.',
      },
    ],
    meta: {
      title: 'Oil and gas and industrial services',
      description:
        'Brand, field systems, integration and automation for contractors, EPC, maintenance, supply and logistics, HSE and field operations in oil and gas. Built to work where there is no signal.',
      image: '/img/og-abp.jpg',
      imageAlt: 'Steel erection at dusk: the lead image of the ABP Continental home page.',
    },
  },
];

export const INDUSTRIES_PAGE = {
  headline: ['Industries.'],
  lede: 'One sector today, described in the terms the people in it use. More are added as the published work allows.',
  projectsLabel: 'RELATED WORK',
  faqLabel: 'FAQ',
  faqHeadline: ['Questions about', 'the sector.'],
  servicesLabel: 'THE SERVICES THAT APPLY',
  meta: {
    title: 'Industries — oil and gas and industrial services',
    description:
      'Who Recalibre works for: contractors, EPC, maintenance, supply and logistics, HSE and field operations in oil and gas and the industrial services around it.',
    image: '/img/og-abp.jpg' as ImageSrc,
    imageAlt: 'Steel erection at dusk: the lead image of the ABP Continental home page.',
  },
} as const;

export function sectorBySlug(slug: string): Sector | undefined {
  return SECTORS.find((s) => s.slug === slug);
}
