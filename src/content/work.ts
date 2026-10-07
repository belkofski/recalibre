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
   appears as a row in the partner register (its name, its logo and
   PARTNER) and nowhere else.
   ========================================================================= */

export type Shot = {
  src: ImageSrc;
  alt: string;
  /** No page prints a caption under a picture any more (the owner's third
   *  note: one honesty line per block, no caption under every capture);
   *  the older shots keep theirs as the record of what each one shows. */
  caption?: string;
  /** true = the shot runs the full width of the gallery */
  wide?: boolean;
  /** The phone's own cut of the shot (Phase C, 28 September 2026): below
   *  810 the gallery draws it in a box of its own shape instead of the
   *  whole screen shrunk to a third. See scripts/plates.py. */
  srcTall?: ImageSrc;
};

/* THE CHAPTERS OF A CASE STUDY (the owner's audit, 6 October 2026: "THE
   PROBLEM / THE SYSTEM / WHAT WE BUILT / RESULT"). Four of his five stand;
   the fifth is STATUS, not RESULT, because no initiative on this site has a
   measured result and the rule at the top of this file forbids inventing
   one. The labels are structural, the content under them is each entry's
   own. */
export const CASE_CHAPTERS = {
  problem: { id: 'problem', label: 'THE PROBLEM', heading: 'The problem.' },
  system: { id: 'system', label: 'THE SYSTEM', heading: 'The system.' },
  built: { id: 'built', label: 'WHAT WE BUILT' },
  pictures: { id: 'pictures', label: 'IMAGES' },
  status: { id: 'status', label: 'STATUS', heading: 'Where it stands.' },
} as const;

export type Initiative = {
  slug: string;
  name: string;
  status: string;
  /** One line under the name on the flagship panels: the owner's own, set
   *  on OPS alone ("The operating system for field work.", his audit of 6
   *  October 2026). No other initiative has one. */
  tagline?: string;
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
   *  appends the site name. `blurb` is the line under it, and the text of
   *  the page's share preview. It is set where the summary runs past the
   *  ~155 characters a result shows (the same sentences, cut shorter), and
   *  on the two products in development, whose preview opens with their
   *  status (the owner's decision of 25 September 2026): a pasted link says
   *  what the product is at before it says what it does. With the status in
   *  front, both of those run past 155, so a search result may cut their
   *  last words. */
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
  /** `coverTall` is a phone's own cut, drawn only below 810 on the index;
   *  from 810 to 1199 the index card draws `cover` (28 September 2026). */
  coverTallMobileOnly?: boolean;
  /** The cover with the card's foot laid into the file (Phase C, 28
   *  September 2026), for the index card's layout whose words sit over
   *  the picture; the page lays no scrim over it. `cover` stays for the
   *  layout whose words sit under it. Set on the two photographs; the OPS
   *  screen is a capture, published clean, and keeps the card's veil. The
   *  index prints the summary over the picture, so its words stand to
   *  about half the card: the deeper foot (CARD_FOOT_TALL). */
  coverCard?: ImageSrc;
  /** The same for a detail page's "More work" card: the cover cut to that
   *  card's 1.6:1 with its foot in the file, and to the 4:3 the card takes
   *  on a tablet beside the diagram (cut from the top where `coverFrom`
   *  says so). See scripts/plates.py. */
  coverMore?: ImageSrc;
  coverMoreTall?: ImageSrc;
  coverAlt: string;
  figure?: 'contraxis';
  /** The detail page's own cover, cut for a 1380 x 640 panel rather than a
   *  687px square. Blowing the card crop across the cover is what put a
   *  magnified corner of a dashboard behind the OPS title. */
  hero: ImageSrc | null;
  /** The phone's own cut of that cover (Phase C, 28 September 2026). */
  heroTall?: ImageSrc;
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
  /** 'top' where the cover prints marks along its top edge, so a card
   *  shorter than the picture crops it from the top down rather than from
   *  the middle, which would cut through them. Read by a detail page's
   *  "More work" pair, whose cards stand 4:3 on a tablet (work/[slug]/
   *  page.tsx); the 1.6:1 card elsewhere cuts them off whole. */
  coverFrom?: 'top';
  /** The mark the reference centres on every card. See WorkCard.tsx. */
  mark?: { src?: ImageSrc; word?: string };
  /** 'dark' where the picture is bright behind the centre. */
  markTone?: 'light' | 'dark';
  /** The state, printed as the last term of the meta line under the title,
   *  which is where the reference prints it. Shorter than `status`, which
   *  the detail page still uses in full. */
  state: string;
  /** "Demonstration data." under the meta line on the index card, where the
   *  cover is a product screen. See WorkCard.tsx. */
  demo?: string;
};

export const INITIATIVES: readonly Initiative[] = [
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
    summary: 'An industrial contractor on Algeria\u2019s oil and gas fields. Brand, identity and website, written for procurement.',
    tab: 'ABP Continental — brand, identity and website',
    blurb: 'Brand, identity and website for an industrial contractor on Algeria\u2019s oil and gas fields. Written for procurement.',
    problem: {
      label: 'WHAT WAS DELIVERED',
      body: 'Smaller on paper than on site. The job: fix that.',
    },
    /* STRUCTURAL FACTS ONLY, as everywhere else on this site: things that
       can be counted off the record rather than measured off the client's
       business. ABP's own results are theirs and are not published here. */
    /* NO COUNTERS (the owner's Phase A brief, 27 September 2026). "01
       client" and "04 disciplines" stood here; both counted the site's own
       content, and the first said the smallest number on the site at 64px
       on the client's own page. The three delivered lines below are the
       facts. */
    facts: [],
    builtHeading: 'What was delivered.',
    built: [
      'Mark, palette and type system',
      'Document and vehicle applications',
      'Public website, written for tender qualification',
    ],
    shots: [
      {
        src: '/img/abp-site-home-clean.jpg',
        alt: 'The ABP Continental home page: its lead image of steel erection at dusk, two riggers bolting a column with a crawler crane behind them, map coordinates printed in the corner, the headline “Building the infrastructure energy runs on.” across the lower left, and a yellow update plate beside a work-with-us panel.',
        caption: 'The home page, shown whole.',
        wide: true,
      },
    ],
    absent: 'ABP Continental is an external client. The scope delivered is published; the client\u2019s own commercial results are not.',
    cover: '/img/card-abp.jpg',
    coverCard: '/img/card-abp-foot-deep-a.jpg',
    coverMore: '/img/card-abp-more-a.jpg',
    coverMoreTall: '/img/card-abp-more-tall-a.jpg',
    /* A composed crop of the site\u2019s own photograph, so the card draws it
       whole. See the note in scripts/plates.py. */
    plate: true,
    /* The site's menu icon (2-4% down) and its field coordinates (11-16%)
       are printed across the top of this plate. The taller tablet card
       (360px then, 4:3 now) cut from the middle took the coordinates in half at 1000 wide and
       the icon in half at 810; from the top, both stay whole, as on the
       square index card. */
    coverFrom: 'top',
    /* THE CENTRE MARK IS ABP CONTINENTAL'S NAME, NOT ITS LOGO. The
       reference puts a client logo there; ABP's own file has not arrived.
       Until it does, the name is set in the site's own lettering, re-set on
       Fadi's yes of 25 September 2026 (see the note over MARKS in
       content/site.ts). The partner register no longer shows it (it prints
       the name itself; 28 September 2026), so this card and Home's ABP
       card are the file's only readers; the real logo, when it comes,
       replaces it in both at once. */
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
    slug: 'ops',
    name: 'OPS',
    status: 'PRODUCT IN DEVELOPMENT',
    tagline: 'The operating system for field work.',
    tone: 'dev',
    year: '2026',
    category: 'Field operations',
    scope: ['Product strategy', 'Interface design', 'Engineering', 'Offline architecture'],
    tags: ['PRODUCT', 'ENGINEERING', 'DESIGN'],
    summary:
      'A field operations system for crews working sites: interventions, permits, teams and the daily report in one register, built to work where there is no signal.',
    tab: 'OPS — field operations, in development',
    blurb: 'In development. Demonstration data shown. Jobs, permits, crews and daily reports in one register, built to work with no signal.',
    problem: {
      label: 'WHAT A SITE GETS',
      body: 'Paper, spreadsheets, no signal. Two versions of the same day.',
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
      'Permits per zone, with renewal dates, in French and Arabic',
      'Who is where, who is short-handed, which certifications lapse',
      'The daily report, signed on site: hours, weather, observations, site photographs, signature and countersignature',
      'The day goes on with no signal: it is carried on the device and queues until coverage returns',
      'Your own install, self-hosted: one server, one database for the organization',
    ],
    /* TWO PICTURES, NEITHER SHOWN ELSEWHERE ON THIS PAGE (the owner's third
       note: one picture, one place). The overview is the cover; the
       permits, field, register and queue screens belong to Home, the
       articles and Insights. Here: the daily report, a wide capture, and
       the day sheet on a phone with the network off. The row is uneven on
       purpose, a wide screen beside a tall one. */
    shots: [
      {
        src: '/img/still-ops-report.jpg',
        srcTall: '/img/still-ops-report-phone-a.jpg',
        alt: 'The OPS daily report: hours, shift, weather and crew for the day, the observations, the report\u2019s trail and the site lead\u2019s signature with the HSE countersignature. Demonstration data.',
      },
      {
        src: '/img/plate-ops-offline.jpg',
        srcTall: '/img/plate-ops-offline-phone-b.jpg',
        alt: 'The OPS day sheet on a phone, offline: the technician\u2019s interventions for the day in Secteur 7, under an offline chip. Demonstration data.',
      },
    ],
    absent: 'Status: in development. Every screen on this page runs on demonstration data.',
    /* The permits screen, flat — the same square as Home's (content/home.ts,
       27 September 2026). */
    cover: '/img/card-ops-permits.jpg',
    /* The phone's own cut (Phase C, 28 September 2026): the register with
       the Arabic line, as on Home. */
    coverTall: '/img/ops-register-phone-a.jpg',
    /* A 780 x 585 phone cut: from 810 to 1199 the index draws the 1200
       square above, as before the cut existed (28 September 2026). */
    coverTallMobileOnly: true,
    /* A flat screen, drawn whole: the card must not crop it a second time. */
    plate: true,
    mark: { word: 'OPS' },
    markTone: 'dark',
    state: 'IN DEVELOPMENT',
    demo: 'Demonstration data.',
    art: 'light',
    coverAlt:
      'The OPS permits screen: active permits counted by zone with their renewal dates, a hot-work permit card in French and Arabic, and the head of the permits register beneath. Demonstration data.',
    hero: '/img/hero-ops-clean.jpg',
    heroTall: '/img/hero-ops-phone-a.jpg',
    heroAlt:
      'The OPS overview at a readable scale: interventions today, technicians in the field, active permits and reports transmitted, with the activity chart and the zone list beneath them. Demonstration data.',
    share: '/img/og-ops.jpg',
    shareAlt: 'The OPS overview: the day\u2019s interventions, technicians in the field and active permits. Demonstration data.',
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
    summary: 'An eyewear house and partner of Recalibre. Brand, identity, digital and 3D, end to end.',
    tab: 'Belkofski — eyewear, end to end',
    problem: {
      label: 'WHAT WAS DELIVERED',
      body: 'Brand has to be shown, not described.',
    },
    /* ONE FACT, NOT TWO. "01 house — Owned and run by Recalibre" came off
       on 25 September 2026: Belkofski is not owned by Recalibre, and a
       count stays only where a visitor can check it on the page (B-21).
       The four disciplines are the four scope chips above. */
    /* NO COUNTER (27 September 2026, as on the ABP page): "04 disciplines"
       counted the four scope chips above. */
    facts: [],
    builtHeading: 'What was delivered.',
    built: [
      'Brand strategy and positioning',
      'Identity system and brand standards',
      'Product renders and campaign direction',
      'Digital presence',
    ],
    /* THE COURT SHOT AND THE CUBE, UNDER THE COVER'S FRAMES: three
       different pictures on one page. The court shot is published as shot,
       with no grade and no grain (B-31). */
    shots: [
      {
        src: '/img/belkofski-court-clean.jpg',
        alt: 'A blue Belkofski paddle carrying the wordmark, lying across a court line with a white ball beside it and a pair of clear frames on its face, shot from above.',
        caption: 'Court, paddle, frames.',
        wide: true,
      },
      {
        src: '/img/still-belkofski-cube.jpg',
        alt: 'A Belkofski brand render: a black cube on a perforated steel bed under a gantry head, a pair of orange-lensed frames set into its face, lit in red.',
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
       the fix. The wordmark file is still used in the partner register's
       mark cell. */
    state: 'PARTNER',
    /* A composed square, cut around the printed wordmark, so the card must
       not crop it again. */
    plate: true,
    coverTall: '/img/card-belkofski-tall.jpg',
    coverCard: '/img/card-belkofski-foot-deep-a.jpg',
    coverMore: '/img/card-belkofski-more-a.jpg',
    coverMoreTall: '/img/card-belkofski-more-tall-a.jpg',
    /* The shallow scrim: the square's title band measures 89 of 255, and
       the deep one covered 426px of a 687 card. See home.ts. */
    art: 'dark',
    coverAlt: 'A blue Belkofski paddle and a pair of clear frames on a court, cut by the white line, shot from above.',
    /* The card keeps the court and its blue — it is the one colour on the
       homepage. The cover leads with the product, because a paddle was
       reading as the subject of an eyewear house. */
    hero: '/img/hero-belkofski.jpg',
    heroAlt:
      'A pair of Belkofski frames on black, the lenses in a deep orange gradient, the name set inside the lens and along the temple arm.',
    share: '/img/og-belkofski.jpg',
    shareAlt: 'A pair of Belkofski frames on black, the lenses in a deep orange gradient.',
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
    summary: 'Agentic AI for contract and document intelligence. Designed to read, surface and propose. A person decides.',
    tab: 'Contraxis — document intelligence, in development',
    blurb: 'In development. Agentic AI for contracts and documents, designed to read, surface and propose. A person decides.',
    problem: {
      label: 'WHAT IT IS MEANT TO DO',
      body: 'Obligations sit in documents nobody re-reads. They surface too late.',
    },
    /* ONE CELL. "01 decision — And it belongs to a person" came off on 25
       September 2026: it counted nothing a visitor can check. The five
       steps are on the drawing and in the five lines below. */
    /* NO COUNTER (27 September 2026, as on the ABP page): "05 steps" counted
       the five lines below. */
    facts: [],
    builtHeading: 'What it is meant to do.',
    built: [
      'Read — contracts, invoices and reports, as they arrive',
      'Surface — terms, dates and obligations, located in the source',
      'Propose — an action, never executed on its own',
      'Record — every step traced to its clause',
      'Decide — a person sees the working, and decides',
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
];

export const WORK_INDEX = {
  headline: ['Selected work.'],
  /* Names the fields, counts nothing: Home's WORK lede (content/home.ts)
     set as a rhythm, one field per sentence. */
  lede: 'Field operations. Document intelligence. Industrial contracting. Eyewear.',
  /** The flagship's picture on the index: OPS on a screen in the blue room,
   *  a picture no other page shows (the owner's third note). The square
   *  plate from 1200 up, its wide cut below. The disciplines row that stood
   *  beside the heading came off with the label rows. */
  featured: {
    src: '/img/plate-insights-set-a.jpg' as ImageSrc,
    srcTall: '/img/plate-insights-set-tablet-a.jpg' as ImageSrc,
    alt: 'A rendered room: a wide screen on a stand showing the OPS overview, against a deep blue wall.',
  },
};

export function initiativeBySlug(slug: string) {
  return INITIATIVES.find((i) => i.slug === slug);
}
