/* ============================================================================
   RECALIBRE — IDENTITY, NAVIGATION, CONTACT.

   THE RULE THIS FILE IS WRITTEN UNDER, in the founder's own words:

     "Never invent: clients, employees, testimonials, ratings, revenue,
      performance results, deployment claims, founding dates, availability,
      prices, delivery times, certifications, case-study outcomes."

   Every string below is either the founder's own description of his company,
   a contact detail he supplied, or a structural fact about the site itself.
   Nothing is inferred, rounded up, or filled in to make a slot look complete.

   THE ®: Fadi stated on 24 September 2026 that the mark is registered; the
   certificate is not yet on file. On his word the ® is printed straight
   after the name wherever the name is set as a mark — every `t-mark`
   setting: the header, the footer and the signature blocks — and nowhere
   else. Not in running prose, not in the © line, not in titles, meta tags,
   JSON-LD or the share image. The reference template prints its own ®
   inline in its wordmark; so does ours.

   WHAT IS DELIBERATELY ABSENT, AND WHY:

     a founding year  Open. It appears nowhere.
     an availability status  Open. The reference's "Booking for Q3 · 2 build
                    slots open" rail carries location instead.
     a reply time   Open. The form promises that a person reads it, and
                    nothing about how fast.
   ========================================================================= */

export const SITE = {
  name: 'Recalibre',

  /** The founder's own descriptor, 19 September 2026. Not "studio", not
   *  "agency", not "creative technology studio" — all three are dead. */
  descriptor: 'Strategy, design and technology',

  /** The registration symbol, printed straight after the name in every
   *  `t-mark` setting and nowhere else, as a small raised glyph (`.t-mark-r`
   *  in globals.css). See the header. */
  mark: '®',

  email: 'a.hakim@recalibre.cloud',
  phone: '+213 655 770 259',
  phoneHref: '+213655770259',
  location: 'Hassi Messaoud, Algeria',

  /** The year after the ©, in the menu and in the footer. next.config.ts
   *  sets it once at build time; it is not read from the visitor's clock,
   *  which put a different year in the menu from the one the server had
   *  printed every 1 January, and made the browser report the mismatch.
   *  The clock after the ?? only runs if a build did not write the value. */
  year: process.env.BUILD_YEAR ?? String(new Date().getFullYear()),

  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/fadi-abdelhakim-saidi-069b83226' },
    { label: 'Instagram', href: 'https://www.instagram.com/recalibre.lab' },
  ],
} as const;

/* --------------------------------------------------------------------------
   NAVIGATION

   Five links, as instructed. The reference's sixth — Sign Up — is removed
   along with its four routes (sign-in, one-time code, account). It fronts a
   client portal promising live system status, the current sprint and shared
   files. That is a product, not a page, and nothing behind it exists.
   -------------------------------------------------------------------------- */
export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
] as const;

export const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
] as const;

/* --------------------------------------------------------------------------
   THE MARK ROW

   Five marks. The label above them makes NO relationship claim, because two
   of the five relationships are not on file:

     ABP Continental   carried as a client, with its case study at
                       /work/abp-continental, on the owner's own instruction
                       of 23 September 2026 — see content/work.ts. The
                       written permission that instruction confirms is not
                       yet on file; the record still lists it as open.
     Dorwa Production  relationship and scope unconfirmed. Logo only, by
                       instruction. Not a client, not a partner, not a case.
     Hostino           carried from the register, same treatment.
     Belkofski         Recalibre's own. Stamped.
     Saidis            Recalibre's own. Stamped.

   There is no count under this row and there never will be until the two
   open relationships are written down. A number that includes companies you
   own does not survive a check.
   -------------------------------------------------------------------------- */
export const MARKS = [
  { name: 'ABP Continental', src: '/img/partner-abp.svg', ours: false },
  { name: 'Dorwa Production', src: '/img/partner-dorwa.png', ours: false },
  { name: 'Hostino', src: '/img/partner-hostino.png', ours: false },
  { name: 'Belkofski', src: '/img/partner-belkofski.svg', ours: true },
  { name: 'Saidis', src: '/img/partner-saidis.svg', ours: true },
] as const;

/* Only `stamp` is rendered — it is the word under the two wells Recalibre
   owns. The eyebrow and the heading that used to live here were a second
   copy of BAND's, in content/home.ts, and they drifted: the band was
   rewritten to name the relationships and this was left saying "Marks
   appear as marks", which is a note about labelling rather than a fact
   about a company. There is one copy now. */
export const MARK_ROW = {
  stamp: 'OURS',
} as const;
