import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { SITE } from '@/content/site';

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

/* The share image is the cropped machine render. The uncropped original and
   the showroom plate both print "Recalibre®" into their pixels, and the ® is
   a registration that does not exist — so neither is used anywhere, least of
   all in the card that gets pasted into other people's chat windows. */
export const metadata: Metadata = {
  metadataBase: new URL('https://recalibre.cloud'),
  title: {
    default: 'Recalibre — Strategy, design and technology',
    template: '%s · Recalibre',
  },
  description:
    'Recalibre modernizes how organizations operate, their customer experience and their infrastructure. Strategy, design, agentic AI, automation and engineering delivered as one integrated capability.',
  applicationName: SITE.name,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: 'Recalibre — Strategy, design and technology',
    description:
      'Strategy, design, agentic AI, automation and engineering delivered as one integrated capability — not as separate suppliers coordinating across a gap.',
    images: [{ url: '/img/hero-machine-tall.png', width: 1600, height: 1740 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recalibre — Strategy, design and technology',
    description: 'Strategy, design, agentic AI, automation and engineering as one integrated capability.',
    images: ['/img/hero-machine-tall.png'],
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
         an inline script for React to warn about. */
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
        <Nav />
        <main id="main" className="relative flex w-full flex-col items-stretch overflow-x-clip bg-ground">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
