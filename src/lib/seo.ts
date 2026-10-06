import type { Metadata } from 'next';
import { SITE } from '@/content/site';
import { IMAGE_SIZE, type ImageSrc } from '@/lib/images.generated';
import { INITIATIVES } from '@/content/work';
import { ARTICLES } from '@/content/insights';

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

   THE HOST. Everything here resolves against `metadataBase` in the root
   layout, which is the address the site is intended to serve from. Nothing
   here is relative to localhost.
   ========================================================================= */

export const SITE_URL = 'https://recalibre.cloud';

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

/** Every address on this site, in the order the navigation walks them. The
 *  initiatives and the articles are read off the same lists that make their
 *  pages, so a new one is in the sitemap the day its page exists. This used
 *  to be typed out by hand, which was complete on the day it was written and
 *  nothing after that. */
export const ROUTES: readonly string[] = [
  '/',
  '/about',
  '/work',
  ...INITIATIVES.map((i) => `/work/${i.slug}`),
  // The capabilities page (the owner's audit, 6 October 2026): a first-class
  // route, in the bar between Work and Insights, so it walks here too.
  '/capabilities',
  '/insights',
  ...ARTICLES.map((a) => `/insights/${a.slug}`),
  '/contact',
  '/privacy',
  '/terms',
];

type PageMeta = {
  /** The browser-tab title. The root layout appends "· Recalibre", unless
   *  the two together would not fit a search result — see below. */
  title: string;
  description: string;
  /** The path this page is canonically served at, leading slash included. */
  path: string;
  /** The share card. 1200 x 630, cut for this page. */
  image: ImageSrc;
  imageAlt: string;
  /** True on an article page: the Open Graph type is 'article' instead of
   *  'website'. No publication time goes with it — the site has never been
   *  public, so no article has a true publication date yet. */
  article?: boolean;
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
}: PageMeta): Metadata {
  const url = `${SITE_URL}${path}`;
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
    alternates: { canonical: url },
    openGraph: {
      type: article ? 'article' : 'website',
      url,
      // This block replaces the layout's whole share block, name included,
      // so the name is restated here or LinkedIn and Facebook print the
      // preview without one.
      siteName: SITE.name,
      title: `${title} · Recalibre`,
      description,
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
