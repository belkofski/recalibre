import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { OrganizationLd } from '@/components/JsonLd';
import { MotionReady } from '@/lib/motion';
import { SITE } from '@/content/site';
import { HOME_SHARE, SITE_URL } from '@/lib/seo';

/* Geist and Geist Mono are the reference's own two faces, measured off the
   live template. Nothing else is loaded. */
const geist = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-geist',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-geist-mono',
  display: 'swap',
});

/* THE DEFAULTS. Every route overrides the title, the description, the
   canonical address and the share card with its own — see lib/seo.ts. What
   is left here is what genuinely belongs to the whole site.

   The share image is cut from the showroom render. Both that render and the
   machine original print "Recalibre®" into their pixels. Fadi stated on
   24 September 2026 that the mark is registered; the certificate is not yet
   on file. The crop stops short of the sign and does not change; the ® is
   printed after the name in the site's text (see content/site.ts), not in
   this card, its title or its alt text.

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
    default: 'Recalibre — Strategy, design and technology',
    template: '%s · Recalibre',
  },
  description:
    'Recalibre is a strategy, design and technology firm that helps organizations modernize their operations, customer experiences and digital infrastructure.',
  applicationName: SITE.name,
  openGraph: { ...HOME_SHARE, url: './' },
  twitter: {
    card: 'summary_large_image',
    title: 'Recalibre — Strategy, design and technology',
    description: 'Strategy, design, agentic AI, automation and engineering as one integrated capability.',
    images: [
      {
        url: '/img/og-home.jpg',
        alt: 'The Recalibre showroom: a deep blue wall, a single chair and a wide screen, lit from the left.',
      },
    ],
  },
  robots: { index: true, follow: true },
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
      className={`js ${geist.variable} ${geistMono.variable} scroll-smooth motion-reduce:scroll-auto`}
    >
      <head>
        <noscript>
          <style>{
            '.in-view{opacity:1!important;transform:none!important}.rise-line>span{opacity:1!important;transform:none!important}'
          }</style>
        </noscript>
      </head>
      <body>
        {/* A keyboard reader should not have to tab the whole menu to reach
            the page. The reference offers nothing here. */}
        <a
          href="#main"
          className="focus-ring t-btn sr-only focus:not-sr-only focus:fixed focus:left-[20px] focus:top-[12px] focus:z-[60] focus:inline-flex focus:h-[44px] focus:items-center focus:rounded-full focus:border focus:border-rule focus:bg-raised focus:px-[18px] focus:text-ink"
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
      </body>
    </html>
  );
}
