import type { Locale } from '@/lib/i18n';
import { DICTIONARY } from '@/content/fr/dictionary';
import * as HOME from '@/content/home';
import { ABOUT } from '@/content/about';
import { SERVICES, FAMILIES, SERVICES_PAGE, SERVICE_CTA } from '@/content/services';
import { SECTORS, INDUSTRIES_PAGE } from '@/content/industries';
import { INITIATIVES, WORK_INDEX } from '@/content/work';
import { ARTICLES, INSIGHTS_BLOCK } from '@/content/insights';
import { PRIVACY, TERMS } from '@/content/legal';
import { WORKFLOWS, CANVAS, NOT_FOUND_FLOW, WORKFLOW_CAPTION } from '@/content/workflows';
import { NAV, NAV_SUB, LEGAL, SITE } from '@/content/site';

/* ============================================================================
   THE CONTENT, IN THE PAGE'S LANGUAGE (4 November 2026).

   The site has one content tree — the English files in this folder, with
   every structural fact in them: slugs, pictures, states, tags, numbers —
   and one dictionary per other language, keyed by the English sentence
   (content/fr/dictionary.ts). `localize` walks a content object and
   replaces every string it finds in the dictionary with its translation,
   leaving everything else exactly as it is. A French page is therefore
   the English page's structure with the English words swapped, which is
   what a translation of a site is, and the two can never drift apart in
   anything but words.

   WHY NOT A SECOND SET OF FILES. A French home.ts would have to repeat
   every path, every slug, every alt-text decision and every `as const`
   shape, and the type system would have to be told the two agree; a
   string missed in one would be a page silently different in the other.
   Keyed by the sentence, a translation missing is a sentence left in
   English — visible, listed by `scripts/dump-strings.mjs --check`, and
   never a broken page.

   WHAT IS NEVER LOOKED UP: a string that starts with `/` or `http` (a
   path), and a string the dictionary simply does not have (a name, a
   number, a date). The same English sentence used in two places gets the
   same French in both, which is right everywhere it occurs on this site.

   The accessors below are what the views and sections read; each one is
   computed once per language and kept.
   ========================================================================= */

const DICTS: Partial<Record<Locale, Readonly<Record<string, string>>>> = { fr: DICTIONARY };

function translate(s: string, dict: Readonly<Record<string, string>>): string {
  if (!s || s.startsWith('/') || s.startsWith('http')) return s;
  return dict[s] ?? s;
}

const cache = new Map<string, unknown>();

/** The object with every translatable string in it swapped for the
 *  language's own. Returns the input itself for English. */
export function localize<T>(value: T, locale: Locale): T {
  const dict = DICTS[locale];
  if (!dict) return value;
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') return translate(v, dict);
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, x] of Object.entries(v as Record<string, unknown>)) out[k] = walk(x);
      return out;
    }
    return v;
  };
  return walk(value) as T;
}

/** One sentence, in the page's language: for the few words a component
 *  prints that are not part of a content file ("ALL PROJECTS", "YEAR"). */
export function tr(locale: Locale): (s: string) => string {
  const dict = DICTS[locale];
  return dict ? (s) => translate(s, dict) : (s) => s;
}

function memo<T>(key: string, locale: Locale, make: () => T): T {
  const k = `${locale}:${key}`;
  if (!cache.has(k)) cache.set(k, make());
  return cache.get(k) as T;
}

const HOME_BUNDLE = {
  HERO: HOME.HERO,
  BAND: HOME.BAND,
  ABOUT: HOME.ABOUT,
  WORK: HOME.WORK,
  CAPABILITIES: HOME.CAPABILITIES,
  SPOTLIGHT: HOME.SPOTLIGHT,
  PRINCIPLES: HOME.PRINCIPLES,
  ENGAGEMENT: HOME.ENGAGEMENT,
  INSIGHTS_BLOCK: HOME.INSIGHTS_BLOCK,
  FAQ: HOME.FAQ,
};

export const home = (locale: Locale) => memo('home', locale, () => localize(HOME_BUNDLE, locale));
export const about = (locale: Locale) => memo('about', locale, () => localize(ABOUT, locale));
export const services = (locale: Locale) =>
  memo('services', locale, () => localize({ SERVICES, FAMILIES, SERVICES_PAGE, SERVICE_CTA }, locale));
export const industries = (locale: Locale) =>
  memo('industries', locale, () => localize({ SECTORS, INDUSTRIES_PAGE }, locale));
export const work = (locale: Locale) => memo('work', locale, () => localize({ INITIATIVES, WORK_INDEX }, locale));
export const insights = (locale: Locale) =>
  memo('insights', locale, () => localize({ ARTICLES, INSIGHTS_BLOCK }, locale));
export const legal = (locale: Locale) => memo('legal', locale, () => localize({ PRIVACY, TERMS }, locale));
export const workflows = (locale: Locale) =>
  memo('workflows', locale, () => localize({ WORKFLOWS, CANVAS, NOT_FOUND_FLOW, WORKFLOW_CAPTION }, locale));
export const nav = (locale: Locale) => memo('nav', locale, () => localize({ NAV, NAV_SUB, LEGAL }, locale));
export const siteText = (locale: Locale) =>
  memo('site', locale, () => localize({ descriptor: SITE.descriptor, location: SITE.location }, locale));
