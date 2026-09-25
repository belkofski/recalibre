import type { ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   THE FOUR INITIATIVES, IN FULL.

   THE REFERENCE'S CASE-STUDY TEMPLATE has eleven fields. Seven of them can
   be filled honestly here. Four cannot, and are absent rather than faked:

     PROJECT TEAM      three named people with job titles. Recalibre has one
                       approved portrait and no employees to name.
     RESULTS           two animated figures, measured over ninety days. None
                       of these four has been measured over anything, and
                       ABP's own results belong to ABP.
     CLIENT QUOTE      a name, a title and a five-star rating.
     LIVE WEBSITE      a link to the running product. Two of the four are in
                       development, one is a brand rather than a deployment,
                       and ABP's site is live but its address is not on the
                       record. Add it to the entry and the link appears.

   Each entry records what is deliberately off its page, and why, in one
   line — the `absent` field below. No page prints it: the site states a
   status and stops, and does not explain an absence. The field stays as the
   record of what was left out. A missing section is honest. A made-up
   figure is the one thing this site cannot survive.

   ABP CONTINENTAL IS HERE ON THE OWNER'S OWN INSTRUCTION, 23 September
   2026, which is also his confirmation that permission to publish the
   name, the mark and the screens has been given. That permission is the
   only thing that was ever holding this entry back; get it on file.

   ONE CLAIM IN THE RECORD IS NOT REPEATED HERE. The case-study note says
   ABP "runs the complete OPS build inside its own operation today". The
   facts file says flatly that ABP does not run Recalibre software, and the
   platform's own ship-readiness document says no paying customer has been
   signed. One of the two is wrong, only the owner can say which, and until
   he does, the deployment is not on this page. What IS on this page —
   brand, identity, the website and photography direction — is uncontested
   in both records.

   DORWA PRODUCTION STILL HAS NO ENTRY. Its scope, its dates and its
   permission are all unrecorded — three open questions, not one. It
   appears as a mark on the partners row and nowhere else.
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
  /** The OWNER row. A client's work belongs to the client and a partner's
   *  to the partner, whatever colour its status pill takes; the two
   *  products in development leave it out and print "In-house product". */
  owner?: string;
  year: string;
  category: string;
  scope: readonly string[];
  tags: readonly string[];
  /** The line under the title. */
  summary: string;
  /** What a search result prints. `tab` is the browser-tab title: the name
   *  alone — "OPS" — told a result nothing, so it is the name plus the
   *  summary's own words, under about sixty characters once the layout
   *  appends the site name. `blurb` is the line under it, set only where the
   *  summary runs past the ~155 characters a result shows: the same
   *  sentences, cut shorter. */
  tab: string;
  blurb?: string;
  /** The problem the work addresses. Never a client's problem unless the
   *  client has given permission — so for OPS it is the situation the
   *  product is designed for, stated generally.
   *
   *  THE LABEL DOES NOT SIT OVER THIS PARAGRAPH. The detail page prints it
   *  over the built list, above `builtHeading`, so it names that section in
   *  that heading's own words. It used to name the paragraph — "THE
   *  SITUATION IT WAS BUILT FOR" over "What was delivered." — and read as a
   *  label on the wrong block. */
  problem: { label: string; body: string };
  /** Structural facts, read out of the record. Never results. */
  facts: readonly { value: string; unit: string; label: string }[];
  /** The heading over that list, per initiative. A shared "What is built."
   *  told a reader that a concept with no code had been built. */
  builtHeading: string;
  /** What is built, planned or delivered, as a list. */
  built: readonly string[];
  shots: readonly Shot[];
  /** What is deliberately not on this page, and why. A record; not printed. */
  absent: string;
  /** Cover for the index grid — the same picture the homepage card carries,
   *  so the two grids show one initiative one way. Null where the
   *  initiative has no honest photograph; `figure` then says what is drawn. */
  cover: ImageSrc | null;
  /** The phone crop of that cover, where it is a wide plate. */
  coverTall?: ImageSrc;
  coverAlt: string;
  figure?: 'contraxis';
  /** The detail page's own cover, cut for a 1380 x 640 panel rather than a
   *  687px square. Blowing the card crop across the cover is what put a
   *  magnified corner of a dashboard behind the OPS title. */
  hero: ImageSrc | null;
  heroAlt: string;
  /** The 1200 x 630 card this initiative shows when its link is pasted
   *  somewhere. Every route used to share the same one. */
  share: ImageSrc;
  shareAlt: string;
  /** How dark the cover already is where the title sits, which sets the
   *  depth of the scrim under it. */
  art: 'light' | 'dark';
  /** True where the cover is a composed plate rather than a photograph, so
   *  the card draws it whole instead of overscaling it. See WorkCard.tsx. */
  plate?: boolean;
  /** The mark the reference centres on every card. See WorkCard.tsx. */
  mark?: { src?: ImageSrc; word?: string };
  /** 'dark' where the picture is bright behind the centre. */
  markTone?: 'light' | 'dark';
  /** The state, printed as the last term of the meta line under the title,
   *  which is where the reference prints it. Shorter than `status`, which
   *  the detail page still uses in full. */
  state: string;
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
    tab: 'OPS — a field operations system, in development',
    problem: {
      label: 'WHAT A SITE GETS',
      body: 'Interventions raised on paper, permits tracked in a spreadsheet, day sheets chased by phone — and no signal on site to do any of it live. The office and the field end up reading two different versions of the same day, and neither can be sure which one is right.',
    },
    /* NO COUNT ON THIS PAGE. The row used to print 14 pages, 09 roles and
       03 languages. The owner's rule of 25 September 2026 keeps a number
       only where a visitor can check it on the same page, and gives OPS no
       count at all: this page sells what a site gets, not how many pages
       were built. The three cells carry a strength in a word, each one a
       fact the record already states; the unit slot is empty, and the page
       draws a unit only where one is set. */
    facts: [
      { value: 'Offline', unit: '', label: 'The day is carried on the device' },
      { value: 'Self-hosted', unit: '', label: 'One server, one database' },
      { value: 'FR · AR', unit: '', label: 'Permits in French and Arabic' },
    ],
    /* THE SAME SIX FACTS, SAID FROM THE BUYER'S SIDE as what a site gets
       (owner's pick, 25 September 2026). No new claim in any line, and no
       long dash. The label over the list reads WHAT A SITE GETS, the
       heading's own words, as on the other three pages. */
    builtHeading: 'What a site gets.',
    built: [
      'Every job in one register: its reference, crew, zone, time and state',
      'Permits held per zone, each with its issue and renewal date, in French and Arabic',
      'Who is where, who is short-handed and which certifications are lapsing',
      'The daily report signed on site: hours, weather, observations, site photographs, signature and countersignature',
      'The day goes on with no signal: it is carried on the device and queues until coverage returns',
      'Your own install, self-hosted: one server, one database for the organization',
    ],
    /* FOUR SCREENS, NOT SEVEN. The interventions, teams and sync-queue
       shots came off the page on 25 September 2026: the page sells OPS on
       the overview, the permits, the day without signal and the daily
       report. The three files stay in public/img; nothing references them.
       All four run full width: three are wide screens, and the daily report
       has no partner of its shape left on the page, so it runs full width
       too rather than leave half a row empty (the rule the owner chose for
       the Belkofski gallery, 25 September 2026). The four captions share
       one plain shape, a full stop where the long dash was (C-11). */
    shots: [
      {
        src: '/img/ops-overview.png',
        alt: 'The OPS overview: interventions today, technicians in the field, active permits, reports transmitted, a seven-day activity chart and the day’s latest events by zone.',
        caption: 'Aperçu. The day at a glance. Demonstration data.',
        wide: true,
      },
      {
        src: '/img/ops-permits-wide.png',
        alt: 'The OPS permit register: permits by zone with their next expiry, and one hot-work permit open in detail with its reference, issue date, renewal date and the HSE approval it needs.',
        caption: 'Permis. Held, expiring, renewed. French and Arabic. Demonstration data.',
        wide: true,
      },
      {
        src: '/img/ops-field-wide.png',
        alt: 'OPS working with no signal: the technician’s checklist for the day on a phone marked offline, beside what can still be done without a network and the queue of reports waiting to send.',
        caption: 'Hors ligne. The day continues without coverage. Demonstration data.',
        wide: true,
      },
      {
        src: '/img/ops-daily-report.png',
        alt: 'The OPS daily report: hours worked, shift, weather, zone, crew, permits used and incidents, with the site lead’s observations, four field photographs, the signature and the HSE countersignature.',
        caption: 'Rapports. Signed on site, sent to the office. Demonstration data.',
        wide: true,
      },
    ],
    absent:
      'Status: in development. Every screen on this page runs on demonstration data.',
    cover: '/img/card-ops.jpg',
    /* A composed plate: the tablet was framed in the crop, so the card must
       not crop it a second time. */
    plate: true,
    mark: { word: 'OPS' },
    markTone: 'dark',
    state: 'IN DEVELOPMENT',
    art: 'light',
    coverAlt:
      'The OPS interventions screen filling the frame: the day\u2019s register under an orange header, with the seven-day activity chart and the permits falling due beside it.',
    hero: '/img/hero-ops.jpg',
    heroAlt:
      'The OPS overview at a readable scale: interventions today, technicians in the field, active permits and reports transmitted, with the activity chart and the zone list beneath them. Demonstration data.',
    share: '/img/og-ops.jpg',
    shareAlt: 'The OPS overview: the day\u2019s interventions, technicians in the field and active permits. Demonstration data.',
  },

  {
    slug: 'abp-continental',
    name: 'ABP Continental',
    status: 'CLIENT WORK, DELIVERED',
    tone: 'owned',
    owner: 'ABP Continental',
    year: '2026',
    category: 'Industrial contracting',
    scope: ['Brand strategy', 'Identity', 'Website', 'Photography direction'],
    tags: ['BRAND', 'DIGITAL', 'DESIGN'],
    summary:
      'An industrial contractor working pipeline, steel erection and shutdowns on the Algerian oil and gas fields. Brand, identity and a public website written for one reader: the procurement lead deciding whether the firm can be trusted with a scope of work.',
    tab: 'ABP Continental — brand, identity and website',
    blurb:
      'An industrial contractor on the Algerian oil and gas fields. Brand, identity and a public website written for one reader: the procurement lead.',
    problem: {
      label: 'WHAT WAS DELIVERED',
      body: 'The firm read smaller on paper than it does on site. Operators audit a supplier before they hire one, and the audit starts with whatever the supplier has published. The job was to make the company look the way it works — not louder, more precise.',
    },
    /* STRUCTURAL FACTS ONLY, as everywhere else on this site: things that
       can be counted off the record rather than measured off the client's
       business. ABP's own results are theirs and are not published here. */
    facts: [
      { value: '01', unit: 'client', label: 'Client work, delivered' },
      { value: '04', unit: 'disciplines', label: 'Brand, identity, website, photography' },
    ],
    builtHeading: 'What was delivered.',
    built: [
      'Mark, palette and typographic system',
      'Document and vehicle application set',
      'Public website, written for tender qualification',
    ],
    shots: [
      {
        src: '/img/abp-site-home.jpg',
        alt: 'The ABP Continental home page: its lead image of steel erection at dusk, two riggers bolting a column with a crawler crane behind them, map coordinates printed in the corner, the headline “Building the infrastructure energy runs on.” across the lower left, and a yellow update plate beside a work-with-us panel.',
        caption: 'The home page, shown whole.',
        wide: true,
      },
    ],
    absent:
      'ABP Continental is an external client. The scope delivered is published; the client\u2019s own commercial results are not.',
    cover: '/img/card-abp.jpg',
    /* A composed crop of the site\u2019s own photograph, so the card draws it
       whole. See the note in scripts/plates.py. */
    plate: true,
    /* THE ONE CARD WHOSE CENTRE MARK IS A REAL CLIENT LOGO, which is what
       the reference puts there on every card it has. The file was already
       on the site, on the partners row. */
    mark: { src: '/img/partner-abp.svg' as ImageSrc },
    state: 'DELIVERED',
    art: 'dark',
    coverAlt:
      'The lead image of the ABP Continental home page: steel erection at dusk, two riggers bolting a column, a crawler crane behind them, with map coordinates printed in the corner of the page.',
    hero: '/img/hero-abp.jpg',
    heroAlt:
      'Steel erection at dusk on the ABP Continental home page: riggers bolting a column against a crawler crane, map coordinates printed in the corner.',
    share: '/img/og-abp.jpg',
    shareAlt: 'Steel erection at dusk: the lead image of the ABP Continental home page.',
  },

  {
    slug: 'contraxis',
    name: 'Contraxis',
    /* ONE STATUS PHRASE FOR BOTH PRODUCTS, 'in development', exactly as OPS
       prints it — the founder's rule (brief of 20 September 2026), confirmed
       25 September 2026. This entry used to say 'concept'. */
    status: 'PRODUCT IN DEVELOPMENT',
    tone: 'dev',
    year: '2026',
    category: 'Document intelligence',
    scope: ['Product concept', 'Agentic architecture', 'Oversight design'],
    tags: ['PRODUCT', 'AGENTIC AI'],
    summary:
      'An agentic AI system for contract and document intelligence: read the document, surface what matters, propose the action, keep the trail, and leave the decision with a person.',
    tab: 'Contraxis — contract and document intelligence',
    blurb:
      'An agentic AI system for contract and document intelligence: read the document, surface what matters, propose the action, and leave the decision with a person.',
    problem: {
      label: 'WHAT IT IS MEANT TO DO',
      body: 'Obligations, dates and liabilities live inside documents nobody has time to re-read. The information is not hidden — it is simply distributed across more pages than any one person can hold, and it surfaces when a deadline has already passed.',
    },
    /* ONE CELL. "01 decision — And it belongs to a person" came off on 25
       September 2026: it counted nothing a visitor can check. The five
       steps are on the drawing and in the five lines below. */
    facts: [{ value: '05', unit: 'steps', label: 'From document to decision' }],
    builtHeading: 'What it is meant to do.',
    built: [
      'Read — contracts, invoices and reports taken as they arrive',
      'Surface — terms, dates and obligations extracted and located in the source',
      'Propose — an action put forward, never executed on its own authority',
      'Record — every step traceable back to the clause that produced it',
      'Decide — presented to a person with the working shown, and they decide',
    ],
    shots: [],
    absent:
      'Status: in development. The diagram above is a schematic of the intended architecture, not an interface. Screens will be published when the product reaches a working build.',
    /* NO PHOTOGRAPH, DELIBERATELY. The cover used to be the 22.57.47
       render — a Belkofski brand picture with a pair of orange-lensed frames
       set into the face of the cube. Contraxis has no interface, so both the
       card and the cover carry the schematic instead. */
    cover: null,
    mark: { word: 'Contraxis' },
    state: 'IN DEVELOPMENT',
    figure: 'contraxis',
    art: 'dark',
    coverAlt: '',
    hero: null,
    heroAlt: '',
    share: '/img/og-contraxis.jpg',
    shareAlt: 'A Recalibre render: a black cube on a perforated steel bed under a gantry, lit in red.',
  },

  {
    slug: 'belkofski',
    name: 'Belkofski',
    /* PARTNER. The status the owner confirmed on 25 September 2026.
       Belkofski is a partner of Recalibre, not a company it owns (the
       owner's word, 25 September 2026); this used to read "RECALIBRE-OWNED
       BRAND" and the OWNER row printed Recalibre. The tone stays 'owned'
       because that is the colour of finished work, not a claim about who
       owns it. */
    status: 'PARTNER',
    tone: 'owned',
    owner: 'Belkofski',
    year: '2025',
    category: 'Brand and digital',
    scope: ['Brand strategy', 'Identity', '3D and campaign', 'Digital'],
    tags: ['BRAND', 'DIGITAL', '3D'],
    summary:
      'An eyewear house that is a partner of Recalibre — brand, identity, digital and 3D taken end to end.',
    tab: 'Belkofski — eyewear, taken end to end',
    problem: {
      label: 'WHAT WAS DELIVERED',
      body:
        'Brand and identity is a capability that has to be shown rather than described. Belkofski is an eyewear house that is a partner of Recalibre, and the brand, the identity system, the digital presence and the 3D work were taken end to end.',
    },
    /* ONE FACT, NOT TWO. "01 house — Owned and run by Recalibre" came off
       on 25 September 2026: Belkofski is not owned by Recalibre, and a
       count stays only where a visitor can check it on the page (B-21).
       The four disciplines are the four scope chips above. */
    facts: [
      { value: '04', unit: 'disciplines', label: 'Brand, identity, 3D, digital' },
    ],
    builtHeading: 'What was delivered.',
    built: [
      'Brand strategy and positioning',
      'Identity system and brand standards',
      'Product renders and campaign direction',
      'Digital presence',
    ],
    /* FIVE PHOTOGRAPHS, AND THEY ARE FIVE. Three of these used to be crops
       of the same shelf, and two of the three carried a caption written for
       a picture they were not: `belkofski-lens` was described as frames on
       black and was the shelf again, `belkofski-cube` was described as a
       machine head over a cube and was also the shelf. Each plate now comes
       from the source its description was written for. */
    shots: [
      {
        src: '/img/belkofski-cube.jpg',
        alt: 'A render: a machine head on a gantry above a polished cube, a molten dark mass spilling down its face with a pair of frames and their orange lenses set into it, on a perforated steel bed.',
        caption: 'The campaign render.',
        wide: true,
      },
      {
        src: '/img/belkofski-lens.jpg',
        alt: 'A pair of Belkofski frames on black, the lenses in a deep orange gradient, the name set inside the lens and along the temple arm.',
        caption: 'Frames, orange lens.',
      },
      {
        src: '/img/belkofski-shelf.jpg',
        alt: 'A pair of dark frames with red lenses resting on an orange steel shelf, between perforated black panels lit from behind.',
        caption: 'On the shelf.',
      },
      {
        src: '/img/belkofski-court.jpg',
        alt: 'A blue Belkofski paddle carrying the wordmark, lying across a court line with a white ball beside it and a pair of clear frames on its face, shot from above.',
        caption: 'Court, paddle, frames.',
      },
      {
        src: '/img/belkofski-paddle.jpg',
        alt: 'The same paddle closer: the wordmark across the blue face and the clear frames resting on it, the grip running off the bottom of the frame.',
        caption: 'The paddle, closer.',
      },
    ],
    absent:
      'Belkofski is a partner of Recalibre and is recorded as partner work rather than as a client engagement. The page describes scope delivered; commercial performance is not published.',
    cover: '/img/card-belkofski.jpg',
    /* NO CENTRE MARK, AND THAT IS THE POINT. The reference centres a
       client's logo on every card because its photographs do not carry
       one. This one does: BELKOFSKI is printed across the blue face of the
       paddle, and the square is cut so it lands dead centre, where the
       reference puts a mark. A second copy laid over it was the card
       saying the same word twice — the flaw raised on 23 Sep and this is
       the fix. The wordmark file is still used on the partners row. */
    state: 'PARTNER',
    /* A composed square, cut around the printed wordmark, so the card must
       not crop it again. */
    plate: true,
    coverTall: '/img/card-belkofski-tall.jpg',
    /* The shallow scrim: the square's title band measures 89 of 255, and
       the deep one covered 426px of a 687 card. See home.ts. */
    art: 'dark',
    coverAlt:
      'A blue Belkofski paddle and a pair of clear frames on a court, cut by the white line, shot from above.',
    /* The card keeps the court and its blue — it is the one colour on the
       homepage. The cover leads with the product, because a paddle was
       reading as the subject of an eyewear house. */
    hero: '/img/hero-belkofski.jpg',
    heroAlt:
      'A pair of Belkofski frames on black, the lenses in a deep orange gradient, the name set inside the lens and along the temple arm.',
    share: '/img/og-belkofski.jpg',
    shareAlt: 'A pair of Belkofski frames on black, the lenses in a deep orange gradient.',
  },
];

export const WORK_INDEX = {
  eyebrow: 'SELECTED WORK',
  headline: ['Selected work.'],
  lede: 'Two products in development, an eyewear house that is a partner of Recalibre, and one client.',
  /** The reference runs a filter row over eight entries. Four entries do
   *  not need filtering, and a control that does nothing is worse than no
   *  control, so this is a labelled list of what the four cover. */
  disciplines: ['PRODUCT', 'BRAND', 'ENGINEERING', 'DESIGN', 'AGENTIC AI', 'DIGITAL', '3D'] as const,
};

export function initiativeBySlug(slug: string) {
  return INITIATIVES.find((i) => i.slug === slug);
}
