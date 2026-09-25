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

  /** THE REGISTERED ADDRESS, as the legal pages print it. Fadi's record of
   *  it is a map pin (25 September 2026) with no street name, so the pages
   *  print the place, the pin's coordinates and a link to the pin — his
   *  choice of the three — and nothing invented in between. */
  address: {
    place: 'Hassi Messaoud, Algeria',
    coordinates: '31.687119, 6.069212',
    map: 'https://maps.app.goo.gl/CabS48t5zrrBhfUB8',
  },

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

   Five marks under the one word PARTNERS. The owner named all five as
   partners on 25 September 2026 — 'belkofski and saidis and hostinger and
   dorwa and abp are our partners' — and that word is the whole claim. The
   row says nothing about what any of them is beyond it:

     ABP Continental   a partner, and the client whose work is shown: its
                       case study is at /work/abp-continental, on the
                       owner's own instruction of 23 September 2026 — see
                       content/work.ts. The written permission is still
                       to be sent.
     Dorwa Production  a partner. Scope, date and live state are not on
                       file; permission still to be sent. Logo only.
     Hostino           a partner (the owner wrote 'hostinger'; the mark
                       and the name stay Hostino unless he corrects it).
                       Permission still to be sent. Logo only.
     Belkofski         a partner, not a company Recalibre owns. Its case
                       study is at /work/belkofski.
     Saidis            a partner. Logo only; nothing is said about it.

   There is no count under this row, and no mark carries a stamp. The OURS
   stamp that sat under Belkofski and Saidis, and the `ours` flag that
   placed it, came off on 25 September 2026 with the owner's word that
   neither is owned by Recalibre. The eyebrow and the heading that once
   lived here as MARK_ROW are gone too; the row's one word is BAND.label
   in content/home.ts.
   -------------------------------------------------------------------------- */
export const MARKS = [
  { name: 'ABP Continental', src: '/img/partner-abp.svg' },
  { name: 'Dorwa Production', src: '/img/partner-dorwa.png' },
  { name: 'Hostino', src: '/img/partner-hostino.png' },
  { name: 'Belkofski', src: '/img/partner-belkofski.svg' },
  { name: 'Saidis', src: '/img/partner-saidis.svg' },
] as const;
