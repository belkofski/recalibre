import { SITE_URL } from '@/lib/seo';
import { SITE } from '@/content/site';

/* ============================================================================
   STRUCTURED DATA — and only what is on record.

   The rule this file is written under is the same one the rest of the site
   is written under: nothing is stated that cannot be checked. So the
   organization block carries the trading name, the address of the office,
   the two contact details the founder supplied and the one social profile
   that is the company's own, Instagram @recalibre.lab, and it carries NO:

     legalName        the legal pages name EURL Recalibre and its registered
                      address (content/legal.ts; the registration number is
                      not printed, the owner's decision of 25 September 2026).
                      Carrying the legal name here is a separate decision not
                      yet taken, so it is left out rather than guessed.
     foundingDate     open.
     numberOfEmployees, founder, employee
                      naming a person here names an employee.
     aggregateRating, review
                      there are none.
     sameAs of a client, award, or accreditation
                      there are none.
     sameAs of a person
                      the LinkedIn link the site shows is the founder's
                      personal profile, not the company's (see sameAs).
   ========================================================================= */

export function OrganizationLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE.name,
    url: SITE_URL,
    description: `${SITE.name} — ${SITE.descriptor.toLowerCase()}.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hassi Messaoud',
      addressCountry: 'DZ',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: SITE.email,
      telephone: SITE.phone,
      // The languages enquiries are answered in: English and French, on the
      // founder's word of 25 September 2026. Arabic came off the same day.
      availableLanguage: ['en', 'fr'],
    },
    // The company's own profiles only. The LinkedIn link in the menu, the
    // footer and the Contact and Insights pages is the founder's personal
    // profile, kept there by his choice of 25 September 2026; a person is
    // not the company, so it is left out here. Instagram @recalibre.lab is
    // Recalibre's own, on his word the same day. If a Recalibre company page
    // on LinkedIn takes the personal one's place, this filter comes off.
    sameAs: SITE.social.filter((s) => s.label !== 'LinkedIn').map((s) => s.href),
  };
  return <Script data={data} />;
}

export function ArticleLd({
  headline,
  description,
  path,
  image,
}: {
  headline: string;
  description: string;
  path: string;
  image: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    // No datePublished. The site has never been public, so no article has a
    // true publication date yet, and a date that is not known is left out
    // rather than guessed (the founder's decision, 24 September 2026).
    mainEntityOfPage: `${SITE_URL}${path}`,
    image: `${SITE_URL}${image}`,
    // The byline is the firm, on the page and here. Naming an author would
    // mean naming an employee.
    author: { '@id': `${SITE_URL}/#organization`, '@type': 'Organization', name: SITE.name },
    publisher: { '@id': `${SITE_URL}/#organization`, '@type': 'Organization', name: SITE.name },
  };
  return <Script data={data} />;
}

function Script({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Our own object, serialised here and nowhere else — no string from a
      // request, a form or a file reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
