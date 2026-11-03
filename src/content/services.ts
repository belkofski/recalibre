import type { ImageSrc } from '@/lib/images.generated';
import { CAPABILITIES, ENGAGEMENT } from '@/content/home';

/* ============================================================================
   THE SERVICES — five, in two families, each with a page of its own.

   DRAFT — owner review. Written 4 November 2026 for the service pages the
   site never had (the audit of 3 November 2026: five capabilities as a
   carousel, two sentences each, no address of their own, nothing to rank
   and nothing to link to from a proposal). Every title, every body line
   and every tag below is the founder's own from content/home.ts
   (CAPABILITIES), unchanged in substance; what is added is structure —
   what each service covers, how the three stages apply to it, what the
   buyer receives, what the work looks like in practice — written from the
   same three sources as the rest of the site and from nothing else.

   THE TWO FAMILIES are the owner's: Digital Presence (how the organization
   is seen and used) and Advanced Solutions (how it runs). The five
   capabilities keep their numbers (/01 to /05) so the home page and the
   service pages count the same things.

   WHAT IS NOT HERE, by the founder's rule in content/site.ts: no client
   beyond the ones already published, no result, no price, no delivery
   time, no certification, no team. The "patterns" on each page describe
   the shape of work this firm builds; none is presented as a deployment,
   and each page says so where it prints them.

   THE RELATED PROJECTS are the four initiatives already on the site, each
   linked from the services it actually drew on (content/work.ts, `scope`).
   ========================================================================= */

export type FamilySlug = 'digital-presence' | 'advanced-solutions';
export type ServiceSlug =
  | 'agentic-ai-and-automation'
  | 'custom-software-development'
  | 'enterprise-systems-and-integration'
  | 'product-and-experience-design'
  | 'brand-strategy-and-identity';

export type Stage = { title: string; body: string };
export type Pattern = { title: string; body: string };
export type Faq = { q: string; a: string };

export type Service = {
  slug: ServiceSlug;
  family: FamilySlug;
  /** The capability number the home page prints: '/01' … '/05'. */
  n: string;
  /** The service's name as a heading, hand-broken for the opener. */
  headline: readonly string[];
  /** The marked phrase in the headline: one per page. */
  mark: string;
  /** The home card's own one-line description. */
  short: string;
  tags: readonly string[];
  /** The opener's lede: who it is for and what it changes. */
  lede: string;
  /** What the service covers, as a list a buyer can check a brief against. */
  covers: readonly string[];
  /** The three stages, applied to this service. */
  stages: readonly [Stage, Stage, Stage];
  /** What the organization holds at the end. */
  receive: readonly string[];
  /** The shape of the work, in practice. Never a deployment claim. */
  patterns: readonly Pattern[];
  /** Related initiatives, by slug (content/work.ts). */
  projects: readonly string[];
  /** A related article, by slug (content/insights.ts), where one exists. */
  insight?: string;
  faq: readonly Faq[];
  meta: { title: string; description: string; image: ImageSrc; imageAlt: string };
};

export type Family = {
  slug: FamilySlug;
  name: string;
  headline: readonly string[];
  mark: string;
  lede: string;
  /** What this family changes for the organization, in one paragraph. */
  body: string;
  services: readonly ServiceSlug[];
  projects: readonly string[];
  faq: readonly Faq[];
  meta: { title: string; description: string; image: ImageSrc; imageAlt: string };
};

const C = CAPABILITIES.rows;
const cap = (n: string) => {
  const row = C.find((r) => r.n === n);
  if (!row) throw new Error(`no capability ${n}`);
  return row;
};

/* The three stages, as the home page names them; each service says what
   they mean for it. */
const STAGE_NAMES = ENGAGEMENT.cards.map((c) => c.title) as unknown as readonly [string, string, string];

const ROOM_ALT = 'A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left.';

export const SERVICES: readonly Service[] = [
  /* ------------------------------------------------------------------ /01 */
  {
    slug: 'agentic-ai-and-automation',
    family: 'advanced-solutions',
    n: '/01',
    headline: ['Agentic AI', 'and automation.'],
    mark: 'Agentic AI',
    short: cap('/01').body,
    tags: cap('/01').tags,
    lede: 'For operations where the work is repetitive, the documents are many and the decisions still have to be someone’s. We build systems that read, route, draft and propose, and that hand anything consequential to a person with the trail that produced it.',
    covers: [
      'AI agents that read documents, extract what matters and prepare the next step',
      'Document intelligence for contracts, tenders, permits, reports and correspondence',
      'Workflow automation across the tools already in use: email, spreadsheets, ERP, field devices',
      'Approval processes where a person decides and the system keeps the record',
      'Operational alerts raised from the organization’s own data, not from a dashboard someone has to watch',
      'Oversight design: which decisions an agent may take, which it may only propose, and what a person is shown',
    ],
    stages: [
      {
        title: STAGE_NAMES[0],
        body: 'We map where the hours go and where the mistakes come from, and we rank the candidate automations by operational impact and by how much judgement each one carries. The plan says which steps stay with a person, in writing.',
      },
      {
        title: STAGE_NAMES[1],
        body: 'The system is built in controlled pieces against your real documents and your real exceptions, integrated with what already runs, and tested with the people who will approve its proposals. Every automated step writes its own trail.',
      },
      {
        title: STAGE_NAMES[2],
        body: 'Agents drift as documents and rules change. We monitor what the system proposed against what people decided, correct it, and extend it as the operation changes.',
      },
    ],
    receive: [
      'The working system, deployed where your data is allowed to live',
      'Its source, its prompts, its rules and its documentation',
      'A written oversight model: what decides, what proposes, who approves',
      'The audit trail design, so every automated action can be explained afterwards',
    ],
    patterns: [
      {
        title: 'Contract and document review',
        body: 'A document arrives; the system reads it, surfaces the clauses, dates and obligations that matter, proposes the action, and a person decides. Contraxis, the product in development, is this pattern built as a product.',
      },
      {
        title: 'Approval routing',
        body: 'A request is checked against the rules, drafted into the right form, sent to the right person with everything they need to decide, and recorded with their decision.',
      },
      {
        title: 'Operational alerts',
        body: 'A permit about to lapse, a report not filed, a threshold crossed: raised from the data itself, to the person who can act, with the context attached.',
      },
    ],
    projects: ['contraxis', 'ops'],
    insight: 'human-oversight-is-a-design-decision',
    faq: [
      {
        q: 'How much is automated, and what stays with us?',
        a: 'Automation drafts, routes, checks and proposes. Where a decision carries weight — money, safety, a contractual commitment — the system presents it to a person together with the trail that produced it, and that person decides. Which decisions those are is agreed explicitly during system design and written into the scope.',
      },
      {
        q: 'Where does the data go?',
        a: 'Where you allow it to. Deployment is designed to keep operational data inside the organization that owns it; which models run where, and what leaves your environment, is agreed during Calibration and written into the scope, not decided afterwards.',
      },
      {
        q: 'What if the system is wrong?',
        a: 'It will be, sometimes, which is why anything consequential is a proposal to a person and why every proposal carries its evidence. Partnership exists to read what the system proposed against what people decided, and to correct it.',
      },
    ],
    meta: {
      title: 'Agentic AI and automation',
      description:
        'AI agents, document intelligence and workflow automation built with human oversight where a decision carries weight. One team, from the audit to the system in use.',
      image: '/img/og-contraxis.jpg',
      imageAlt: 'A black cube on a perforated steel bed under a gantry head, lit in red.',
    },
  },

  /* ------------------------------------------------------------------ /02 */
  {
    slug: 'custom-software-development',
    family: 'advanced-solutions',
    n: '/02',
    headline: ['Custom software', 'development.'],
    mark: 'Custom software',
    short: cap('/02').body,
    tags: cap('/02').tags,
    lede: 'For organizations whose work no longer fits the tools it runs on. We design and build the platforms, dashboards, portals and field tools an operation actually needs, around how it actually operates.',
    covers: [
      'Internal platforms that replace the spreadsheet everyone depends on and nobody trusts',
      'Executive dashboards read from the operation’s own data, not re-keyed into them',
      'Client and supplier portals: one place to submit, track and retrieve',
      'Workflow applications that carry a process from request to record',
      'Field tools built for the conditions in the field, offline included',
      'Reporting systems that produce the document the regulator, the client or the board actually asks for',
    ],
    stages: [
      {
        title: STAGE_NAMES[0],
        body: 'We review how the work is done today, which tools carry it and where it breaks, then rank what to build by operational impact. The plan names the system, its users, its data and what it must connect to.',
      },
      {
        title: STAGE_NAMES[1],
        body: 'Design and engineering run as one program: the interface is designed with the people who will use it, built in phases that each put something real into use, and integrated with the systems already running.',
      },
      {
        title: STAGE_NAMES[2],
        body: 'Support for the system in use, monitoring and correction, and the next phase when the organization is ready for it. The source and the documentation are yours throughout.',
      },
    ],
    receive: [
      'The working system, deployed on infrastructure you control',
      'Its source code, its database design and its deployment model',
      'The documentation and the operational handover: how to run it, how to change it',
      'A design system, so what is built next looks and behaves like what exists',
    ],
    patterns: [
      {
        title: 'The operations console',
        body: 'The day’s interventions, permits, teams and reports in one register, with the signature trail the paper used to carry. OPS, the field operations product in development, is this pattern built to work with no signal.',
      },
      {
        title: 'The client portal',
        body: 'A supplier or a client submits, tracks and retrieves in one place; the organization sees everything that is open and what is waiting on whom.',
      },
      {
        title: 'The reporting system',
        body: 'The daily, weekly and regulatory documents produced from the data as it is recorded, signed where a signature is required, and kept where they can be found.',
      },
    ],
    projects: ['ops', 'abp-continental'],
    insight: 'offline-first-is-an-admission',
    faq: [
      {
        q: 'Why custom, rather than a product off the shelf?',
        a: 'Often a product is the right answer, and Calibration says so when it is. Custom software is for the part of the operation that is the organization’s own — the process that makes it different from the next firm — where a product would make the operation fit the tool rather than the other way round.',
      },
      {
        q: 'Who owns the code?',
        a: 'You do. The system, the source, the documentation and the operational knowledge transfer to your organization. Partnership is a service we provide afterwards because organizations change, not a dependency engineered into the handover.',
      },
      {
        q: 'Can it work where there is no connection?',
        a: 'Yes, when it is designed for that from the start. A field tool that requires a network is desk software that has been carried outside; the offline case is an architecture decision, taken during Calibration, not a feature added later.',
      },
    ],
    meta: {
      title: 'Custom software development',
      description:
        'Internal platforms, dashboards, portals, workflow applications and field tools designed around how the organization actually operates. You own the source.',
      image: '/img/og-ops.jpg',
      imageAlt: 'The OPS overview screen on a wide display. Demonstration data.',
    },
  },

  /* ------------------------------------------------------------------ /03 */
  {
    slug: 'enterprise-systems-and-integration',
    family: 'advanced-solutions',
    n: '/03',
    headline: ['Enterprise systems', 'and integration.'],
    mark: 'integration',
    short: cap('/03').body,
    tags: cap('/03').tags,
    lede: 'For organizations whose departments each hold a piece of the truth. We connect the systems, consolidate the information and establish one reliable source of operational data that the rest of the work can stand on.',
    covers: [
      'Integration between the systems already running: ERP, accounting, HR, CRM, field and maintenance tools',
      'Data consolidation into one source of operational truth, with its owner and its rules',
      'Legacy modernization: replacing what has to go, wrapping what can stay',
      'Connected workflows that cross departmental lines without re-keying',
      'Migration planned and executed so that nothing is lost and nobody stops working',
      'The data foundation that any later automation or AI depends on',
    ],
    stages: [
      {
        title: STAGE_NAMES[0],
        body: 'We map what connects to what today, in which direction, and where the same fact is held twice. The plan names the systems, the source of truth for each kind of data, and the order in which the connections are built.',
      },
      {
        title: STAGE_NAMES[1],
        body: 'Connections are built one at a time and verified against the live data before the next, with the people who own each system. Legacy pieces are replaced or wrapped as the plan says, and the record of what moved is kept.',
      },
      {
        title: STAGE_NAMES[2],
        body: 'Integrations break when the systems at either end change. We monitor them, correct them and extend them as new systems arrive and old ones leave.',
      },
    ],
    receive: [
      'The integration layer, documented connection by connection',
      'A data model that names the source of truth for every kind of record',
      'Migration records: what moved, from where, and how it was verified',
      'The operational runbook for the people who will keep it running',
    ],
    patterns: [
      {
        title: 'One source of operational data',
        body: 'The register the field writes to becomes the source the office reads from, so the daily report, the permit count and the equipment status are one set of facts rather than three.',
      },
      {
        title: 'The connected approval',
        body: 'A request raised in one system is checked against data in a second and recorded in a third, without anyone copying a reference number between them.',
      },
      {
        title: 'The modernized core',
        body: 'The legacy system nobody can replace this year is wrapped behind a stable interface, so new tools can be built against it now and it can be replaced later without touching them.',
      },
    ],
    projects: ['ops', 'contraxis'],
    insight: 'right-to-left-is-architecture',
    faq: [
      {
        q: 'Will this work with the systems we already run?',
        a: 'Integration is one of the five capabilities rather than an afterthought. What connects to what, and in which direction, is mapped during Calibration before anything is built, and the plan says which systems stay, which are wrapped and which are replaced.',
      },
      {
        q: 'Do we have to stop working during a migration?',
        a: 'No. Migrations are planned in steps that each leave the operation running, with the old and the new reconciled before the old is switched off. The order of those steps is part of the written plan.',
      },
      {
        q: 'Is this a prerequisite for the AI work?',
        a: 'Usually, yes. An agent that reads bad data proposes bad actions. Where the data foundation is not there, Calibration says so and the first phase builds it.',
      },
    ],
    meta: {
      title: 'Enterprise systems and integration',
      description:
        'Connected operational environments: integrate departments, consolidate information, modernize legacy workflows and establish one reliable source of operational data.',
      image: '/img/og-right-to-left.jpg',
      imageAlt: 'An OPS screen in French and Arabic. Demonstration data.',
    },
  },

  /* ------------------------------------------------------------------ /04 */
  {
    slug: 'product-and-experience-design',
    family: 'digital-presence',
    n: '/04',
    headline: ['Product and', 'experience design.'],
    mark: 'experience',
    short: cap('/04').body,
    tags: cap('/04').tags,
    lede: 'For products, platforms and websites that have to be understood by the people who use them, inside the organization and outside it. We design from the strategy down to the interface a technician would use in the field.',
    covers: [
      'Product strategy: what the product is for, for whom, and what it will not do',
      'Information architecture: how the thing is organized so that it can be found and understood',
      'Interface and experience design, from the first flow to the last state',
      'Prototyping that puts something usable in front of the people it is for, early',
      'Responsive layouts and accessibility as design decisions, not a pass at the end',
      'Design systems that scale past the people who wrote them',
      'Public websites and digital platforms, designed and built as one piece of work',
    ],
    stages: [
      {
        title: STAGE_NAMES[0],
        body: 'We establish who the product is for, what they are trying to do and where the current one fails them, and we rank what to design by the difference it makes to that. The plan fixes the scope of the first release.',
      },
      {
        title: STAGE_NAMES[1],
        body: 'Architecture, flows, interface and prototype in that order, tested with real users, then built: the designers and the engineers are the same team, so what was designed is what ships.',
      },
      {
        title: STAGE_NAMES[2],
        body: 'A product in use teaches you what to change. We read how it is used, adapt it, and extend the design system so the next piece looks and behaves like the last.',
      },
    ],
    receive: [
      'The product strategy and the information architecture, written down',
      'The designs, the prototype and the design system, in files you own',
      'The built interface, accessible and responsive, with its source',
      'The standards that let your own people extend it',
    ],
    patterns: [
      {
        title: 'The public website written for one reader',
        body: 'A site built around the one person it has to convince — a procurement lead, a client, a candidate — and what they need to see to decide. The ABP Continental site is this pattern, delivered.',
      },
      {
        title: 'The field interface',
        body: 'Screens designed for a technician with gloves, bright sun and no signal: few taps, large targets, the state always visible. OPS is designed this way.',
      },
      {
        title: 'The design system',
        body: 'The tokens, components and rules that make the third screen as considered as the first, written so a team that was not in the room can follow them.',
      },
    ],
    projects: ['abp-continental', 'ops'],
    faq: [
      {
        q: 'Do you build what you design?',
        a: 'Yes. Design and engineering are the same team under one point of accountability, so there is no handover where the design is simplified to fit what the builders understood. The site you are reading was designed and built that way.',
      },
      {
        q: 'What about accessibility and mobile?',
        a: 'Both are design decisions taken at the start, not a pass at the end. Layouts are designed for a phone, a tablet and a desk at once, and every interface is built to be used with a keyboard and a screen reader.',
      },
      {
        q: 'Can you work with our existing brand?',
        a: 'Yes. Where an identity exists, the design system is built on it. Where it does not hold together yet, that is the brand strategy and identity service, and Calibration says which you need.',
      },
    ],
    meta: {
      title: 'Product and experience design',
      description:
        'Product strategy, information architecture, interface and experience design, prototyping, accessibility and design systems — designed and built by one team.',
      image: '/img/og-abp.jpg',
      imageAlt: 'Steel erection at dusk: the lead image of the ABP Continental home page.',
    },
  },

  /* ------------------------------------------------------------------ /05 */
  {
    slug: 'brand-strategy-and-identity',
    family: 'digital-presence',
    n: '/05',
    headline: ['Brand strategy', 'and identity.'],
    mark: 'identity',
    short: cap('/05').body,
    tags: cap('/05').tags,
    lede: 'For organizations whose identity no longer reflects what they are capable of. We set the position, build the identity system and write the standards that hold it together across every customer and employee touchpoint.',
    covers: [
      'Positioning: what the organization is, for whom, and why that is credible',
      'Identity systems: the mark, the type, the colour, the voice and the rules that bind them',
      'Digital brand expression: how the identity behaves on a screen, in motion and in an interface',
      'Campaign direction for the launches and announcements that follow',
      'Brand standards written for the people who will apply them without you in the room',
      'The brand as it reaches employees: documents, presentations, the systems they use every day',
    ],
    stages: [
      {
        title: STAGE_NAMES[0],
        body: 'We establish what the organization actually does, who has to be convinced of it, and where the current identity gets in the way. The plan fixes the position and the touchpoints the identity has to cover first.',
      },
      {
        title: STAGE_NAMES[1],
        body: 'The identity system is designed and tested on the real touchpoints — the proposal, the site, the vehicle, the report — not on a mood board, and the standards are written as it is built.',
      },
      {
        title: STAGE_NAMES[2],
        body: 'An identity lives or dies in its application. We direct the campaigns and the new touchpoints that follow, and we keep the standards current as the organization grows.',
      },
    ],
    receive: [
      'The positioning, written down and agreed',
      'The identity system: mark, type, colour, voice, in files you own',
      'The brand standards, written for application without us',
      'The digital expression: how the identity behaves on screen, with the assets to build from',
    ],
    patterns: [
      {
        title: 'The identity for a procurement reader',
        body: 'An industrial contractor positioned for the person deciding whether to trust it with a scope of work: the identity, the site and the photography direction as one piece. ABP Continental is this pattern, delivered.',
      },
      {
        title: 'The identity taken end to end',
        body: 'Brand, identity, digital and three-dimensional work carried together, so the product, the packaging and the screen are one voice. Belkofski, a partner, is this pattern.',
      },
      {
        title: 'The standards that survive handover',
        body: 'The document that lets a new agency, a printer or an internal team apply the identity correctly without a call: the rule, the reason and the example, for every case that will actually come up.',
      },
    ],
    projects: ['abp-continental', 'belkofski'],
    faq: [
      {
        q: 'Is this a logo?',
        a: 'A mark is one output of it. The work is the position the organization takes, the system that expresses it everywhere it appears, and the standards that keep it consistent after we leave. A logo without those is a picture.',
      },
      {
        q: 'How does this connect to the technology work?',
        a: 'The identity is applied to the interfaces, the dashboards and the documents the technology produces, by the same team. An operations console carries the brand as much as the website does, and it is designed to.',
      },
      {
        q: 'What do you need from us to start?',
        a: 'What you do, who you need to convince, and what exists today. Calibration does the rest: it is a fixed-scope assessment that produces a written plan you keep, whether or not you continue.',
      },
    ],
    meta: {
      title: 'Brand strategy and identity',
      description:
        'Positioning, identity systems, digital brand expression, campaign direction and the standards that hold an identity together across every touchpoint.',
      image: '/img/og-belkofski.jpg',
      imageAlt: 'A Belkofski brand render: a black cube with orange-lensed frames set into its face, lit in red.',
    },
  },
];

export const FAMILIES: readonly Family[] = [
  {
    slug: 'digital-presence',
    name: 'Digital Presence',
    headline: ['Digital', 'Presence.'],
    mark: 'Presence',
    lede: 'How the organization is seen and used: its position, its identity, its website and the products its customers and employees touch.',
    body: 'Two of the five capabilities belong here. Brand strategy and identity sets what the organization is and how it is recognized; product and experience design makes the website, the platform and the product usable by the people they are for. The two are delivered by the same team, so the identity is applied to every screen as it is built rather than handed over to be interpreted.',
    services: ['brand-strategy-and-identity', 'product-and-experience-design'],
    projects: ['abp-continental', 'belkofski'],
    faq: [
      {
        q: 'Do you only do websites?',
        a: 'No. A website is often the first touchpoint that has to be right, and it is designed and built here. The same team carries the identity, the product design and the platforms behind the site, so a website is a piece of a digital presence rather than the whole of it.',
      },
      {
        q: 'Can you start from what we have?',
        a: 'Yes. Calibration assesses the identity, the site and the products as they stand and says what to keep, what to fix and what to rebuild, ranked by the difference it makes to the people you need to convince.',
      },
      {
        q: 'Who owns the result?',
        a: 'You do: the files, the source, the standards and the design system. Partnership afterwards is a service, not a dependency.',
      },
    ],
    meta: {
      title: 'Digital Presence — brand, design and the web',
      description:
        'Brand strategy and identity, product and experience design, websites and platforms, delivered as one piece of work by one team.',
      image: '/img/og-abp.jpg',
      imageAlt: 'Steel erection at dusk: the lead image of the ABP Continental home page.',
    },
  },
  {
    slug: 'advanced-solutions',
    name: 'Advanced Solutions',
    headline: ['Advanced', 'Solutions.'],
    mark: 'Solutions',
    lede: 'How the organization runs: the systems that carry the work, the data they share and the automation that takes the repetition out of it.',
    body: 'Three of the five capabilities belong here. Enterprise systems and integration establishes one reliable source of operational data; custom software development builds the platforms and field tools the operation needs around how it actually works; agentic AI and automation takes the repetitive work off people while leaving every consequential decision with a person. They are delivered in that order when the foundation is missing, and together when it is there.',
    services: ['agentic-ai-and-automation', 'custom-software-development', 'enterprise-systems-and-integration'],
    projects: ['ops', 'contraxis'],
    faq: [
      {
        q: 'Where do we start?',
        a: 'With a Calibration: a fixed-scope assessment of the operation, its systems and its data, which produces a written plan ranked by operational impact. It says whether the first phase is integration, a system or automation, and why.',
      },
      {
        q: 'Where does our data live?',
        a: 'Inside the organization that owns it, by design. OPS, the field operations product in development, is built to be self-hosted — one server, one database per organization — and the same principle governs client systems. Data residency and access are written into the scope.',
      },
      {
        q: 'What happens after launch?',
        a: 'Partnership: support for the system in use, monitoring and correction, and adaptation as the organization changes. The source, the documentation and the operational knowledge are yours from the handover.',
      },
    ],
    meta: {
      title: 'Advanced Solutions — AI, software and integration',
      description:
        'Agentic AI and automation, custom software development and enterprise integration, built with human oversight and handed over with the source.',
      image: '/img/og-ops.jpg',
      imageAlt: 'The OPS overview screen on a wide display. Demonstration data.',
    },
  },
];

/* --------------------------------------------------------------------------
   THE SERVICES INDEX PAGE.
   -------------------------------------------------------------------------- */
export const SERVICES_PAGE = {
  headline: ['Five services,', 'one team.'],
  mark: 'one team',
  lede: 'You brief once and the same team carries it through to production. Two families, five capabilities, each with a page that says what it covers, how it is delivered and what you receive.',
  familiesLabel: 'TWO FAMILIES',
  deliveryLabel: 'HOW IT IS DELIVERED',
  deliveryHeadline: ['Three stages,', 'one way in.'],
  faqLabel: 'FAQ',
  faqHeadline: ['Before the', 'first call.'],
  faq: [
    {
      q: 'Which service do we need?',
      a: 'Often more than one, and the first job of a Calibration is to say which, in what order. The five are delivered by one team, so an engagement can start with the identity and end with the system that runs behind it without a handover between suppliers.',
    },
    {
      q: 'How is an engagement structured?',
      a: 'Calibration, then Build, then Partnership. Calibration is a fixed-scope assessment that produces a written plan you keep whether or not you continue; Build runs design, engineering and automation as one program in controlled phases; Partnership is support and adaptation after launch.',
    },
    {
      q: 'How is it priced?',
      a: 'Every engagement starts with a fixed scope agreed in writing, and commercial terms are set against that scope. A quotation request on the contact page is the fastest way to a figure: tell us the service, the scope and the timeline, and a person replies.',
    },
    {
      q: 'Who owns what you build?',
      a: 'You do. The system, the source, the documentation and the operational knowledge transfer to your organization at handover.',
    },
  ],
  meta: {
    title: 'Services — five capabilities, one team',
    description:
      'Brand and identity, product and experience design, agentic AI and automation, custom software, enterprise integration: five services, one accountable team, from brief to production.',
    image: '/img/og-home-b.jpg' as ImageSrc,
    imageAlt: ROOM_ALT,
  },
} as const;

/* The two calls to action every service page carries. */
export const SERVICE_CTA = {
  quote: { label: 'REQUEST A QUOTATION', lead: 'REQUEST' },
  calibrate: { label: 'Start a calibration' },
  coversLabel: 'WHAT IT COVERS',
  stagesLabel: 'HOW IT IS DELIVERED',
  receiveLabel: 'WHAT YOU RECEIVE',
  patternsLabel: 'WHAT IT LOOKS LIKE IN PRACTICE',
  patternsNote: 'The shape of the work this firm builds. Where a pattern names a project, that project is on this site with its own state; no other deployment is claimed.',
  projectsLabel: 'RELATED WORK',
  insightLabel: 'RELATED READING',
  faqLabel: 'FAQ',
  familyLabel: 'PART OF',
  allServices: 'ALL SERVICES',
  readMore: 'READ ABOUT THIS SERVICE',
  ctaHeadline: ['Tell us what is', 'not working yet.'],
  ctaBody: 'A quotation request takes a service, a scope and a timeline. A Calibration takes a conversation. Either way a person reads it.',
} as const;

export function serviceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
export function familyBySlug(slug: string): Family | undefined {
  return FAMILIES.find((f) => f.slug === slug);
}
/** Every address under /services/: the two families and the five services. */
export function serviceParams() {
  return [...FAMILIES.map((f) => ({ slug: f.slug })), ...SERVICES.map((s) => ({ slug: s.slug }))];
}
export const SERVICE_ROUTES: readonly string[] = ['/services', ...serviceParams().map((p) => `/services/${p.slug}`)];
