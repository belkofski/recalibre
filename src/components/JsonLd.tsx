import { SITE_URL, absoluteUrl } from '@/lib/seo';
import { SITE } from '@/content/site';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n';

/* ============================================================================
   STRUCTURED DATA — and only what is on record.

   The rule this file is written under is the same one the rest of the site
   is written under: nothing is stated that cannot be checked. So the
   organization block carries the trading name, the address of the office,
   the two contact details the founder supplied, the coordinates he gave
   for the registered address (content/site.ts), the firm's own mark as its
   logo, and the one social profile that is the company's own, Instagram
   @recalibre.lab — and it carries NO:

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
     datePublished on an article
                      the site has never been public with the articles on
                      it; the date is set at launch, never a commit date
                      (DESIGN-DECISIONS.md, 4 November 2026).

   WHAT WAS ADDED ON 4 NOVEMBER 2026 (the audit found Organization alone,
   without a logo, and Articles without a language): the logo and the
   coordinates; ProfessionalService beside Organization, which is what a
   local search reads for a firm that serves a place; WebSite; a
   BreadcrumbList on every nested page (there is no visible trail, by the
   recorded decision — the list is for the crawler); Service on each
   service page; FAQPage wherever a page prints its own questions; and
   CreativeWork on each project. Every block says which language it is in.
   ========================================================================= */

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

const ORG_REF = { '@id': ORG_ID, '@type': 'Organization', name: SITE.name } as const;

export function OrganizationLd() {
  const [lat, lng] = SITE.address.coordinates.split(',').map((s) => Number(s.trim()));
  const data = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    image: `${SITE_URL}/img/og-home-b.jpg`,
    description: `${SITE.name} — ${SITE.descriptor.toLowerCase()}.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hassi Messaoud',
      addressCountry: 'DZ',
    },
    geo: { '@type': 'GeoCoordinates', latitude: lat, longitude: lng },
    hasMap: SITE.address.map,
    areaServed: { '@type': 'Country', name: 'Algeria' },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: SITE.email,
      telephone: SITE.phone,
      // The languages enquiries are answered in: English and French, on the
      // founder's word of 25 September 2026. Arabic came off the same day.
      availableLanguage: ['en', 'fr'],
    },
    knowsLanguage: ['en', 'fr'],
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

export function WebSiteLd({ locale = DEFAULT_LOCALE, name, description }: { locale?: Locale; name: string; description: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE_URL,
    name,
    description,
    inLanguage: locale,
    publisher: ORG_REF,
  };
  return <Script data={data} />;
}

/** The page's place in the site, for the crawler. Items are [name, English
 *  path]; the locale puts /fr in front. No visible trail (DESIGN-DECISIONS). */
export function BreadcrumbLd({ items, locale = DEFAULT_LOCALE }: { items: readonly (readonly [string, string])[]; locale?: Locale }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: absoluteUrl(path, locale),
    })),
  };
  return <Script data={data} />;
}

export function ServiceLd({
  name,
  description,
  path,
  locale = DEFAULT_LOCALE,
  category,
}: {
  name: string;
  description: string;
  path: string;
  locale?: Locale;
  category?: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(path, locale),
    inLanguage: locale,
    serviceType: category ?? name,
    provider: ORG_REF,
    areaServed: { '@type': 'Country', name: 'Algeria' },
  };
  return <Script data={data} />;
}

export function FaqLd({ items, locale = DEFAULT_LOCALE }: { items: readonly { q: string; a: string }[]; locale?: Locale }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return <Script data={data} />;
}

export function ArticleLd({
  headline,
  description,
  path,
  image,
  locale = DEFAULT_LOCALE,
}: {
  headline: string;
  description: string;
  path: string;
  image: string;
  locale?: Locale;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    inLanguage: locale,
    // No datePublished. See the header.
    mainEntityOfPage: absoluteUrl(path, locale),
    image: `${SITE_URL}${image}`,
    // The byline is the firm, on the page and here. Naming an author would
    // mean naming an employee.
    author: ORG_REF,
    publisher: ORG_REF,
  };
  return <Script data={data} />;
}

/** A project page. `creator` is the firm; the owner of the work, where it
 *  is a client's or a partner's, is named as `sourceOrganization` only when
 *  the entry names one. No dates and no results, as on the page. */
export function CreativeWorkLd({
  name,
  description,
  path,
  image,
  locale = DEFAULT_LOCALE,
  owner,
  keywords,
}: {
  name: string;
  description: string;
  path: string;
  image: string;
  locale?: Locale;
  owner?: string;
  keywords?: readonly string[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    inLanguage: locale,
    url: absoluteUrl(path, locale),
    image: `${SITE_URL}${image}`,
    creator: ORG_REF,
    ...(owner ? { sourceOrganization: { '@type': 'Organization', name: owner } } : {}),
    ...(keywords?.length ? { keywords: keywords.join(', ') } : {}),
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
