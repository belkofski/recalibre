import type { Metadata, Viewport } from 'next';
import RootShell from '@/components/RootShell';
import NotFoundView from '@/views/NotFoundView';
import { HOME_SHARE, ROOT_VIEWPORT, rootMetadata } from '@/lib/seo';
import { ui } from '@/content/ui';
import { nav, workflows } from '@/content';
import type { Locale } from '@/lib/i18n';

/* THE 404, ONE DOCUMENT FOR BOTH LANGUAGES (4 November 2026).

   The site has a root layout per language (app/(en), app/fr), and Next has
   no layout above both in which to render a not-found page: a group's own
   not-found.tsx came back inside the framework's bare error document, with
   no bar, no footer and no `lang`. This file is Next's answer for that case
   (`experimental.globalNotFound`): it renders the whole document itself,
   so it goes through the same shell as every other page.

   It is rendered once, without a request to read, so the server's copy is
   English; a reader who arrives at a wrong address under /fr has the French
   copy swapped in as soon as the page is alive (views/NotFoundView.tsx and
   the `detectLocale` switch in the shell). A 404 is never indexed, so the
   crawler's view of its language does not matter; the reader's does. */

export const metadata: Metadata = {
  ...rootMetadata('en'),
  title: ui('en').notFound.title,
  /* ONE ROBOTS TAG, AND NO ADDRESS. Next writes its own "noindex" into
     every 404 it serves; a robots line here added a second one, worded
     differently, and a canonical resolved to an address that is itself a
     404. Both are switched off. The share block is the home page's,
     without the url. */
  robots: null,
  alternates: null,
  openGraph: HOME_SHARE,
};
export const viewport: Viewport = ROOT_VIEWPORT;

const strings = (locale: Locale) => ({ nav: nav(locale).NAV, flow: workflows(locale).NOT_FOUND_FLOW });

export default function GlobalNotFound() {
  return (
    <RootShell locale="en" detectLocale>
      <NotFoundView variants={{ en: strings('en'), fr: strings('fr') }} />
    </RootShell>
  );
}
