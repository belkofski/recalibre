import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { OrganizationLd } from '@/components/JsonLd';
import { MotionReady } from '@/lib/motion';
import { CURTAIN_JS } from '@/lib/curtain';
import { EnquiryOrigin } from '@/lib/origin';
import { SITE } from '@/content/site';
import { HOME_SHARE, SITE_URL } from '@/lib/seo';

/* Geist, one face for the whole site — the owner's decision of 27
   September 2026. The reference pairs it with Geist Mono for its small
   labels; those labels keep their capitals and tracking and are set in
   Geist too (`--font-mono` in globals.css points here). Nothing else is
   loaded. */
const geist = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-geist',
  display: 'swap',
});

/* THE DEFAULTS. Every route overrides the title, the description, the
   canonical address and the share card with its own — see lib/seo.ts. What
   is left here is what genuinely belongs to the whole site.

   The share image is the whole blue room, with OPS on the set and no
   painted mark on the wall (28 September 2026). Fadi stated on 24 September
   2026 that the mark is registered; the certificate is not yet on file. The
   ® is printed after the name in the site's text (see content/site.ts);
   the card's title and alt text do not add one, and the only ® in the
   picture is the one the render itself paints on the glass sign.

   `canonical: './'` resolves against metadataBase to whichever route is
   being rendered, so a page that sets nothing still declares the one address
   it lives at. There was no canonical anywhere on the site before. The
   share block's `url: './'` resolves the same way: the home page sets no
   metadata of its own, and without it the home link was the one address on
   the site that arrived in a chat window without saying where it lived. The
   block itself lives in lib/seo.ts, because the 404 page repeats it without
   the url (see the note there). */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: './' },
  title: {
    default: 'Recalibre · Strategy, design and technology',
    template: '%s · Recalibre',
  },
  description:
    'Recalibre designs and builds the systems, software and automation that replace fragmented ways of working.',
  applicationName: SITE.name,
  openGraph: { ...HOME_SHARE, url: './' },
  twitter: {
    card: 'summary_large_image',
    title: 'Recalibre · Strategy, design and technology',
    description: 'Strategy, design, agentic AI, automation and engineering as one integrated capability.',
    images: [
      {
        url: '/img/og-home-b.jpg',
        alt: 'A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left.',
      },
    ],
  },
  robots: { index: true, follow: true },
};

/* THE BROWSER BAR. Fadi's yes of 25 September 2026: phones are told the
   site is dark, so the bar a phone browser draws above the page takes the
   site's own ground colour (--color-ground in globals.css) instead of white.
   Only the colour is set; the page width and zoom keep Next's defaults.

   The tab icon, the phone home-screen icon and the home-screen file are not
   declared here. They are files in this folder — icon.svg, apple-icon.png
   and manifest.ts — and Next writes their tags from the files themselves.
   All three carry the firm's own '///' mark, copied into assets on his yes
   of the same day; the three squares that were the tab icon came off. */
export const viewport: Viewport = {
  themeColor: '#f2f0eb',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
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
        {/* EVERY HIDDEN STATE THE STYLESHEET GATES ON `.js` IS UNDONE HERE
            (6 October 2026: the word rise, the clip and scale tiers, the
            tick rule's draw, the flow line and its nodes, the footer's
            hairlines, the menu's items, and the three folds, which open).
            `.js` is in the server's markup, so without scripts this block
            is the only thing that lifts them. */}
        <noscript>
          <style>{
            '.in-view,.rise-line>span,.rise-word>span,.flow-line,.flow-node,.menu-item>*{opacity:1!important;transform:none!important}' +
            '.in-view-clip,.tick-draw .tick-rule,.footer-line::before{clip-path:none!important}' +
            '.settle,.hero-settle{scale:none!important}' +
            '.contact-fold,.stage-fold{grid-template-rows:1fr!important}' +
            /* The depth layer (7 October 2026): a stack is a plain column
               without the script that unpins a tall card; the panels'
               closed states are each section's own and gated the same way. */
            '.stack .stack-card{position:relative!important;scale:none!important;filter:none!important}'
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
        {/* A keyboard reader should not have to tab the whole menu to reach
            the page. The reference offers nothing here. */}
        <a
          href="#main"
          className="t-btn sr-only focus:not-sr-only focus:fixed focus:left-[20px] focus:top-[12px] focus:z-[60] focus:inline-flex focus:h-[44px] focus:items-center focus:rounded-full focus:border focus:border-rule focus:bg-raised focus:px-[18px] focus:text-ink"
        >
          Skip to content
        </a>
        <OrganizationLd />
        <Nav />
        <main id="main" className="relative flex w-full flex-col items-stretch overflow-x-clip bg-ground">
          {children}
        </main>
        <Footer />
        <MotionReady />
        <EnquiryOrigin />
      </body>
    </html>
  );
}
