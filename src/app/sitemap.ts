import type { MetadataRoute } from 'next';
import { execSync } from 'node:child_process';
import { absoluteUrl, languagesFor, routeEntries } from '@/lib/seo';
import type { Locale } from '@/lib/i18n';

/**
 * /sitemap.xml — it returned 404.
 *
 * Every address on the site, in every published language, listed once
 * each, read off the same lists that make the pages. The 404 page is not
 * in it, and neither is the API route: a sitemap is a statement about what
 * is worth indexing, not an inventory of what responds.
 *
 * `lastModified` IS A REAL DATE OR NOTHING (4 November 2026). It used to be
 * the moment the build ran, on every entry, which told a crawler that every
 * page had changed that minute — the one thing a modification date must
 * not say. Now it is read from the repository: the date of the last commit
 * that touched the content file the page is written from, merges excluded
 * (a merge touches everything and changes nothing). A French page takes the
 * later of its content file and the dictionary. Where the build has no
 * repository history to read (a shallow clone, a tarball), the field is
 * left out rather than guessed.
 *
 * Each entry carries the same hreflang set its page prints in its <head>,
 * from lib/seo.ts, so the sitemap and the pages tell a crawler one story.
 */

/** The content file a page's words come from. */
function sourceOf(path: string): string {
  if (path === '/') return 'src/content/home.ts';
  if (path === '/about') return 'src/content/about.ts';
  if (path.startsWith('/services')) return 'src/content/services.ts';
  if (path.startsWith('/projects')) return 'src/content/work.ts';
  if (path === '/industries') return 'src/content/industries.ts';
  if (path.startsWith('/insights')) return 'src/content/insights.ts';
  if (path === '/contact') return 'src/content/enquiry.ts';
  return 'src/content/legal.ts';
}

const dates = new Map<string, Date | null>();
function lastCommit(file: string): Date | null {
  if (dates.has(file)) return dates.get(file)!;
  let d: Date | null = null;
  try {
    const out = execSync(`git log -1 --no-merges --format=%cI -- ${file}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    if (out) d = new Date(out);
  } catch {
    d = null;
  }
  dates.set(file, d);
  return d;
}

function modified(path: string, locale: Locale): Date | undefined {
  const own = lastCommit(sourceOf(path));
  const dict = locale === 'fr' ? lastCommit('src/content/fr') : null;
  return [own, dict].filter((x): x is Date => x instanceof Date).sort((a, b) => b.getTime() - a.getTime())[0];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return routeEntries().map(({ path, locale }) => {
    const lastModified = modified(path, locale);
    return {
      url: absoluteUrl(path, locale),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: path === '/' ? 'monthly' : 'yearly',
      priority: path === '/' ? 1 : path.split('/').length > 2 ? 0.6 : 0.8,
      alternates: { languages: languagesFor(path) },
    };
  });
}
