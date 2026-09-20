import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600'], // the three faces the reference actually loads
  variable: '--font-geist',
  display: 'swap',
});

/* Geist Mono — the mono face the [N.xx/11] and Oberon references use for their
   section labels, step numbers and tags. Added for the /blocks builds only. */
const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://recalibre.com'),
  title: {
    default: 'Recalibre — Strategy, design and technology',
    template: '%s · Recalibre',
  },
  description:
    'Recalibre helps organizations modernize operations, customer experiences and digital infrastructure — strategy, design, agentic AI, automation and software engineering in one integrated capability.',
  applicationName: 'Recalibre',
  openGraph: {
    type: 'website',
    siteName: 'Recalibre',
    title: 'Recalibre — Strategy, design and technology',
    description:
      'For organizations that have outgrown fragmented processes, disconnected tools, or an identity that no longer reflects their capabilities.',
    images: [{ url: '/img/hero-showroom.webp', width: 3200, height: 1800 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recalibre — Strategy, design and technology',
    description:
      'Strategy, design, agentic AI, automation and software engineering, delivered as one integrated capability.',
    images: ['/img/hero-showroom.webp'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} scroll-smooth motion-reduce:scroll-auto`}>
      <body>{children}</body>
    </html>
  );
}
