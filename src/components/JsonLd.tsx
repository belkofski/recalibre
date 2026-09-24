import { SITE_URL } from '@/lib/seo';
import { SITE } from '@/content/site';

/* ============================================================================
   STRUCTURED DATA — and only what is on record.

   The rule this file is written under is the same one the rest of the site
   is written under: nothing is stated that cannot be checked. So the
   organization block carries the trading name, the address of the office,
   the two contact details the founder supplied and the two social profiles
   he published, and it carries NO:

     legalName        the legal pages name EURL Recalibre (content/legal.ts),
                      but its registration number and registered address are
                      still outstanding there. Carrying the name here is a
                      separate decision not yet taken, and putting a guess in
                      machine-readable form would be the worst possible place
                      to put it.
     foundingDate     open.
     numberOfEmployees, founder, employee
                      naming a person here names an employee.
     aggregateRating, review
                      there are none.
     sameAs of a client, award, or accreditation
                      there are none.
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
      availableLanguage: ['en', 'fr', 'ar'],
    },
    sameAs: SITE.social.map((s) => s.href),
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
