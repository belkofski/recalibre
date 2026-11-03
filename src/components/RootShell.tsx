import '@/app/globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Consent from '@/components/Consent';
import { OrganizationLd } from '@/components/JsonLd';
import { MotionReady } from '@/lib/motion';
import { CURTAIN_JS } from '@/lib/curtain';
import { EnquiryOrigin } from '@/lib/origin';
import { LocaleProvider } from '@/lib/locale';
import { geist } from '@/lib/fonts';
import { dir, langTag, type Locale } from '@/lib/i18n';
import { ui } from '@/content/ui';
import { localePath } from '@/lib/i18n';

/* ============================================================================
   THE SHELL — one document for two languages.

   Since 4 November 2026 the site has two root layouts, app/(en)/layout.tsx
   and app/fr/layout.tsx, because the language of a document is declared on
   its <html> and Next renders that element in a root layout. Both layouts
   are one line each: they call this, with their locale. Everything that
   used to live in app/layout.tsx lives here, in the same order, so the two
   trees cannot drift.

   THE ORDER OF <body> IS LOAD-BEARING.

     1. The curtain's inline script, first, so it runs at the first paint
        and prepends <rc-curtain> before Next's own first <div> (see
        lib/curtain.ts for why React tolerates it there).
     2. The skip link, the first thing a keyboard reaches.
     3. The Organization record, the bar, the page, the footer.
     4. MotionReady and EnquiryOrigin, which draw nothing.
     5. The consent banner, which draws nothing until an analytics ID exists.
     6. The cursor, mounted LAST and outside <main> so no ancestor isolates
        its blend mode (the interactions work package adds it here).
   ========================================================================= */

export default function RootShell({
  locale,
  detectLocale = false,
  children,
}: {
  locale: Locale;
  /** The 404 only: the one document with no root layout to tell it its
   *  language follows the address on the client (lib/locale.tsx). */
  detectLocale?: boolean;
  children: React.ReactNode;
}) {
  const t = ui(locale);
  return (
    <html
      lang={langTag(locale)}
      dir={dir(locale)}
      /* `js` is on the server's markup, so there is no class to add after
         hydration and no mismatch to suppress. The <noscript> block below
         is what handles the scripts-off case: it hands every animated block
         back its finished state, so the page is complete rather than blank.
         That is the same guarantee the inline stamp used to give, without
         an inline script for React to warn about. Scripts that are on but
         fail to run are the other case: MotionReady and the failsafe in
         globals.css reveal the page at 2.5s. */
      className={`js ${geist.variable} scroll-smooth motion-reduce:scroll-auto`}
    >
      <head>
        <noscript>
          <style>{
            '.in-view{opacity:1!important;transform:none!important}.rise-line>span{opacity:1!important;transform:none!important}'
          }</style>
        </noscript>
      </head>
      <body>
        {/* THE CURTAIN, the loader of 27 September 2026. It has to be up at
            the first paint, before any of the page's scripts arrive, so it
            is the one inline script on the site and it runs where it sits,
            at the top of <body>. It builds its own markup; see
            lib/curtain.ts. */}
        <script dangerouslySetInnerHTML={{ __html: CURTAIN_JS }} />
        <LocaleProvider locale={locale} detect={detectLocale}>
          {/* A keyboard reader should not have to tab the whole menu to reach
              the page. The reference offers nothing here. */}
          <a
            href="#main"
            className="t-btn sr-only focus:not-sr-only focus:fixed focus:left-[20px] focus:top-[12px] focus:z-[60] focus:inline-flex focus:h-[44px] focus:items-center focus:rounded-full focus:border focus:border-rule focus:bg-raised focus:px-[18px] focus:text-ink"
          >
            {t.skipToContent}
          </a>
          <OrganizationLd />
          <Nav />
          <main id="main" className="relative flex w-full flex-col items-stretch overflow-x-clip bg-ground">
            {children}
          </main>
          <Footer />
          <MotionReady />
          <EnquiryOrigin />
          <Consent privacyHref={localePath(locale, '/privacy')} />
        </LocaleProvider>
      </body>
    </html>
  );
}
