import type { Metadata, Viewport } from 'next';
import { SITE } from '@/content/site';
import { IMAGE_SIZE, type ImageSrc } from '@/lib/images.generated';
import { INITIATIVES } from '@/content/work';
import { ARTICLES } from '@/content/insights';
import { SERVICE_ROUTES } from '@/content/services';
import {
  DEFAULT_LOCALE,
  PUBLISHED_LOCALES,
  isPublished,
  localePath,
  ogLocale,
  type Locale,
} from '@/lib/i18n';

/* ============================================================================
   SEARCH AND SHARING METADATA, IN ONE PLACE.

   THREE THINGS WERE MISSING and every route was affected by all three.

   NO CANONICAL. Not one page declared which address it lives at, so any
   duplicate — a trailing slash, a tracking parameter appended by whoever
   pasted the link, the site reachable at more than one host during a
   deployment — was a separate page as far as a crawler was concerned.

   ONE SHARE CARD FOR THIRTEEN PAGES. Every route inherited the same title
   and the same tall machine render, so a link to an article, a link to a
   product and a link to the contact page all previewed identically. A
   preview that does not distinguish the page is worse than no preview: the
   reader concludes the link is the home page and does not follow it.

   NO SITEMAP AND NO robots.txt. Both returned 404. Neither is required for
   a site to be indexed, and neither is an excuse for not having one.

   TWO LANGUAGES, ONE DECLARATION (4 November 2026). Every page states its
   own address in each published language and `x-default` pointing at
   English, from the one map in lib/i18n.ts, so the pages, the sitemap and
   the language switch tell a crawler one story. A locale that is built but
   not yet published (PUBLISHED_LOCALES) is served `noindex` and named
   nowhere.

   THE HOST. Everything here resolves against `metadataBase`, which is the
   address the site is intended to serve from. Nothing here is relative to
   localhost.
   ========================================================================= */

export const SITE_URL = 'https://recalibre.cloud';

/** Absolute address of an English path in a locale. */
export function absoluteUrl(path: string, locale: Locale = DEFAULT_LOCALE): string {
  const p = localePath(locale, path);
  return `${SITE_URL}${p === '/' ? '' : p}`;
}

/** THE SHARE BLOCK TWO ROUTES HOLD IN COMMON. The root layout carries it for
 *  the home page and adds `url: './'`, which resolves to the address being
 *  rendered. The 404 page carries the same block WITHOUT the url: it is the
 *  only other route with no share block of its own, and its own address,
 *  /_not-found, is a page nobody should be sent to — a 404 that names it was
 *  the one address this site still gave out. Next replaces a nested
 *  `openGraph` wholesale rather than merging it, which is why the block is
 *  spelled out once here and spread in both places. */
export const HOME_SHARE = {
  type: 'website',
  siteName: SITE.name,
  title: 'Recalibre — Strategy, design and technology',
  description:
    'Strategy, design, agentic AI, automation and engineering delivered as one integrated capability — not as separate suppliers coordinating across a gap.',
  images: [
    {
      url: '/img/og-home-b.jpg',
      width: 1200,
      height: 630,
      alt: 'A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left.',
    },
  ],
} satisfies NonNullable<Metadata['openGraph']>;

/** Every English address on this site, in the order the navigation walks
 *  them. The initiatives and the articles are read off the same lists that
 *  make their pages, so a new one is in the sitemap the day its page exists.
 *  The French addresses are these with `/fr` in front (lib/i18n.ts), so they
 *  are not listed twice. */
export const ROUTES: readonly string[] = [
  '/',
  '/about',
  ...SERVICE_ROUTES,
  '/projects',
  ...INITIATIVES.map((i) => `/projects/${i.slug}`),
  '/insights',
  ...ARTICLES.map((a) => `/insights/${a.slug}`),
  '/contact',
  '/privacy',
  '/terms',
];

/** Every address in every published language: what the sitemap lists and
 *  what the route check walks. */
export function routeEntries(): { path: string; locale: Locale }[] {
  return PUBLISHED_LOCALES.flatMap((locale) => ROUTES.map((path) => ({ path, locale })));
}

/** The hreflang set for one page, keyed by the English path: each published
 *  language's address, and `x-default` pointing at English, which is the
 *  version a reader in any other language is sent to. Absolute addresses,
 *  because a relative one would resolve against the page it is printed on
 *  and the French page would then point at /fr/fr. Google treats a set
 *  without a return link as a mistake, so every language's page gets the
 *  same set. */
export function languagesFor(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of PUBLISHED_LOCALES) languages[locale] = absoluteUrl(path, locale);
  languages['x-default'] = absoluteUrl(path, DEFAULT_LOCALE);
  return languages;
}

/* --------------------------------------------------------------------------
   THE ROOT DEFAULTS, one set per root layout. Next does not share metadata
   between sibling root layouts (app/(en) and app/fr), so each declares the
   whole set; it is written once here so the two cannot drift.
   -------------------------------------------------------------------------- */

const ROOT_TITLE: Record<Locale, string> = {
  en: 'Recalibre — Strategy, design and technology',
  fr: 'Recalibre — Stratégie, design et technologie',
};
const ROOT_DESCRIPTION: Record<Locale, string> = {
  en: 'Recalibre is a strategy, design and technology firm that helps organizations modernize their operations, customer experiences and digital infrastructure.',
  fr: 'Recalibre est un cabinet de stratégie, de design et de technologie qui aide les organisations à moderniser leurs opérations, leurs expériences client et leur infrastructure numérique.',
};
const ROOT_TWITTER: Record<Locale, string> = {
  en: 'Strategy, design, agentic AI, automation and engineering as one integrated capability.',
  fr: 'Stratégie, design, IA agentique, automatisation et ingénierie en une seule capacité intégrée.',
};

/* THE DEFAULTS. Every route overrides the title, the description, the
   canonical address and the share card with its own — see pageMeta below.
   What is left here is what genuinely belongs to the whole site.

   The share image is the whole blue room, with OPS on the set and no
   painted mark on the wall (28 September 2026). Fadi stated on 24 September
   2026 that the mark is registered; the certificate is not yet on file. The
   ® is printed after the name in the site's text (see content/site.ts);
   the card's title and alt text do not add one, and the only ® in the
   picture is the one the render itself paints on the glass sign.

   `canonical: './'` resolves against metadataBase to whichever route is
   being rendered, so a page that sets nothing still declares the one
   address it lives at. The share block's `url: './'` resolves the same way:
   the home page sets no metadata of its own, and without it the home link
   was the one address on the site that arrived in a chat window without
   saying where it lived. */
export function rootMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: './', languages: languagesFor('/') },
    title: {
      default: ROOT_TITLE[locale],
      template: '%s · Recalibre',
    },
    description: ROOT_DESCRIPTION[locale],
    applicationName: SITE.name,
    openGraph: {
      ...HOME_SHARE,
      title: ROOT_TITLE[locale],
      url: './',
      locale: ogLocale(locale),
      alternateLocale: PUBLISHED_LOCALES.filter((l) => l !== locale).map(ogLocale),
    },
    twitter: {
      card: 'summary_large_image',
      title: ROOT_TITLE[locale],
      description: ROOT_TWITTER[locale],
      images: [
        {
          url: '/img/og-home-b.jpg',
          alt: 'A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left.',
        },
      ],
    },
    robots: isPublished(locale) ? { index: true, follow: true } : { index: false, follow: false },
    // Search Console reads this tag once the owner pastes the token into
    // the host's environment; until then nothing is printed.
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

/* THE BROWSER BAR. Fadi's yes of 25 September 2026: phones are told the
   site is dark, so the bar a phone browser draws above the page takes the
   site's own ground colour (--color-ground in globals.css) instead of white.
   Only the colour is set; the page width and zoom keep Next's defaults. */
export const ROOT_VIEWPORT: Viewport = {
  themeColor: '#050505',
};

type PageMeta = {
  /** The browser-tab title. The root layout appends "· Recalibre", unless
   *  the two together would not fit a search result — see below. */
  title: string;
  description: string;
  /** The ENGLISH path this page is canonically served at, leading slash
   *  included. The locale puts `/fr` in front where it applies. */
  path: string;
  /** The share card. 1200 x 630, cut for this page. */
  image: ImageSrc;
  imageAlt: string;
  /** True on an article page: the Open Graph type is 'article' instead of
   *  'website'. No publication time goes with it — the site has never been
   *  public, so no article has a true publication date yet. */
  article?: boolean;
  locale?: Locale;
};

/**
 * One page's metadata: the canonical address, the browser title, and a share
 * card that belongs to this page rather than to the home page.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
  imageAlt,
  article,
  locale = DEFAULT_LOCALE,
}: PageMeta): Metadata {
  const url = absoluteUrl(path, locale);
  // The declared size is the file's real size, read from the manifest. A
  // share card whose dimensions do not match gets cropped by the platform
  // in a way nobody chose.
  const { w, h } = IMAGE_SIZE[image];
  return {
    // The layout appends " · Recalibre" to the tab title, and a search
    // result shows about sixty characters of it. Where a headline plus the
    // site name would run past that, the headline stands alone rather than
    // being cut off mid-word. Two of the three article titles used to; they
    // were shortened on 25 September 2026 and all three now fit.
    title: `${title} · Recalibre`.length > 60 ? { absolute: title } : title,
    description,
    // Next replaces a nested `alternates` wholesale rather than merging it,
    // so the hreflang set has to be restated here or the root layout's is
    // lost on every page that calls this. Measured on the live site, 3
    // November 2026: zero hreflang on thirteen of fourteen pages.
    alternates: { canonical: url, languages: languagesFor(path) },
    robots: isPublished(locale) ? undefined : { index: false, follow: false },
    openGraph: {
      type: article ? 'article' : 'website',
      url,
      // This block replaces the layout's whole share block, name included,
      // so the name is restated here or LinkedIn and Facebook print the
      // preview without one.
      siteName: SITE.name,
      title: `${title} · Recalibre`,
      description,
      locale: ogLocale(locale),
      alternateLocale: PUBLISHED_LOCALES.filter((l) => l !== locale).map(ogLocale),
      images: [{ url: image, width: w, height: h, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · Recalibre`,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
  };
}
