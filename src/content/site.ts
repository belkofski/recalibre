/* ============================================================================
   RECALIBRE — IDENTITY, NAVIGATION, CONTACT.

   THE RULE THIS FILE IS WRITTEN UNDER, in the founder's own words:

     "Never invent: clients, employees, testimonials, ratings, revenue,
      performance results, deployment claims, founding dates, availability,
      prices, delivery times, certifications, case-study outcomes."

   Every string below is either the founder's own description of his company,
   a contact detail he supplied, or a structural fact about the site itself.
   Nothing is inferred, rounded up, or filled in to make a slot look complete.

   WHAT IS DELIBERATELY ABSENT, AND WHY:

     the ®          Recalibre's mark is asserted but not registered. Printing
                    a registration symbol for a registration that does not
                    exist is false marking. It goes back the day the
                    certificate exists and not one day before. The reference
                    template prints its own ® in eight places; we print none.
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

  /** DELIBERATELY EMPTY. See the header. */
  mark: '',

  email: 'a.hakim@recalibre.cloud',
  phone: '+213 655 770 259',
  phoneHref: '+213655770259',
  location: 'Hassi Messaoud, Algeria',
  /** IANA zone, used only to print the reader a live local time in the rail —
   *  a fact about the clock, not a claim about the company. */
  timeZone: 'Africa/Algiers',

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
   of the five relationships are not settled:

     ABP Continental   written permission is not granted. It may appear as a
                       mark; it may not be described as a client, and no
                       photograph, scope, figure or case study of it appears
                       anywhere on this site.
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

export const MARK_ROW = {
  eyebrow: 'REGISTER',
  heading: 'Marks on the register.',
  note: 'Shown as marks only. Two of the five are companies Recalibre owns and are stamped as such. No relationship, scope or outcome is claimed here, and no count is published.',
  stamp: 'OURS',
} as const;
