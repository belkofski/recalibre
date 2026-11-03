/* ============================================================================
   LOCALES — the one place the site knows it speaks two languages.

   English lives at the root and French under /fr, each tree with its own
   root layout (app/(en) and app/fr; see components/RootShell.tsx). There is
   no middleware and no rewrite: a French address is a French file, and the
   path says the language. Arabic is reserved, not shipped: `dir()` already
   answers for it so the day it arrives nothing here has to be rethought.

   PUBLISHED_LOCALES is the gate. A locale that is built but not in this
   list is served (so it can be reviewed at its real address) but carries
   `noindex`, is left out of the sitemap, and is not named in any page's
   hreflang set — Google reads an alternate that points at a page it may not
   index as a mistake. French joins the list when its copy has been
   reviewed by the owner (the French work package), and nothing else needs
   to change for it to go live.
   ========================================================================= */

export const LOCALES = ['en', 'fr'] as const;
export type Locale = (typeof LOCALES)[number];

/** The locales search engines are told about. See the header. */
export const PUBLISHED_LOCALES: readonly Locale[] = ['en'];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export function isPublished(locale: Locale): boolean {
  return PUBLISHED_LOCALES.includes(locale);
}

/** The address of an English path in a locale: `/about` → `/fr/about`,
 *  `/` → `/fr`. English paths are returned as they are. */
export function localePath(locale: Locale, path: string): string {
  if (locale === 'en') return path;
  if (path === '/') return `/${locale}`;
  return `/${locale}${path}`;
}

/** Which locale an address belongs to, read off its first segment. */
export function localeFromPath(pathname: string): Locale {
  const first = pathname.split('/')[1];
  return isLocale(first) && first !== 'en' ? first : 'en';
}

/** The English path under a localized address: `/fr/about` → `/about`. */
export function stripLocale(pathname: string): string {
  const locale = localeFromPath(pathname);
  if (locale === 'en') return pathname || '/';
  const rest = pathname.slice(locale.length + 1);
  return rest === '' ? '/' : rest;
}

/** The same page in the other language, or null when that language is not
 *  published yet (the switch then renders nothing rather than a link to a
 *  page a reader may not be sent to). */
export function counterpart(pathname: string): { locale: Locale; href: string } | null {
  const here = localeFromPath(pathname);
  const other: Locale = here === 'en' ? 'fr' : 'en';
  if (!isPublished(other)) return null;
  return { locale: other, href: localePath(other, stripLocale(pathname)) };
}

/** Text direction. Both shipped languages read left to right; Arabic, when
 *  it comes, is the one that does not. */
export function dir(locale: Locale): 'ltr' | 'rtl' {
  return locale === ('ar' as string) ? 'rtl' : 'ltr';
}

/** The Open Graph locale tag for the page's `og:locale`. */
export function ogLocale(locale: Locale): string {
  return locale === 'fr' ? 'fr_FR' : 'en_US';
}

/** The BCP 47 tag printed on <html lang> and in `inLanguage`. */
export function langTag(locale: Locale): string {
  return locale;
}
