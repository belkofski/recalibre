import type { MetadataRoute } from 'next';
import { ROUTES, SITE_URL } from '@/lib/seo';

/**
 * /sitemap.xml — it returned 404.
 *
 * Every address on the site, listed once each, read off the same lists that
 * make the initiative and article pages. The 404 page is not in it, and
 * neither is the API route: a sitemap is a statement about what is worth
 * indexing, not an inventory of what responds.
 *
 * THERE IS NO `lastModified`. It was the moment the build ran, on every
 * entry, so each deploy told a crawler that every page had changed that
 * minute — the one thing a modification date must not say, and a field that
 * says it on every visit is a field a crawler learns to ignore. Nothing on
 * the site records when a page's words last changed, and a date that is not
 * known is left out rather than guessed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === '/' ? 'monthly' : 'yearly',
    priority: path === '/' ? 1 : path.split('/').length > 2 ? 0.6 : 0.8,
  }));
}
