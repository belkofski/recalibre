import type { MetadataRoute } from 'next';
import { absoluteUrl, languagesFor, routeEntries } from '@/lib/seo';

/**
 * /sitemap.xml — it returned 404.
 *
 * Every address on the site, in every published language, listed once
 * each, read off the same lists that make the pages. The 404 page is not
 * in it, and neither is the API route: a sitemap is a statement about what
 * is worth indexing, not an inventory of what responds.
 *
 * THERE IS NO `lastModified`. It was the moment the build ran, on every
 * entry, so each deploy told a crawler that every page had changed that
 * minute — the one thing a modification date must not say, and a field that
 * says it on every visit is a field a crawler learns to ignore. Nothing on
 * the site records when a page's words last changed, and a date that is not
 * known is left out rather than guessed. (The structured-data work package
 * reads a real one out of the repository's history where that is honest.)
 *
 * Each entry carries the same hreflang set its page prints in its <head>,
 * from lib/seo.ts, so the sitemap and the pages tell a crawler one story.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return routeEntries().map(({ path, locale }) => ({
    url: absoluteUrl(path, locale),
    changeFrequency: path === '/' ? 'monthly' : 'yearly',
    priority: path === '/' ? 1 : path.split('/').length > 2 ? 0.6 : 0.8,
    alternates: { languages: languagesFor(path) },
  }));
}
