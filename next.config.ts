import type { NextConfig } from 'next';

/* THE SECURITY HEADERS, set here so they travel with the site to any host
   that runs the Next server (a static export would drop them; this site has
   an API route, so it is served by the server).

   Nothing on this site is loaded from another domain: no analytics, no
   remote fonts (Geist is served from /_next/static), no frames, no
   third-party scripts. So the policy is the strict one — everything from
   this origin and nothing else — with two allowances the framework needs:
   inline scripts and styles, because every page here is rendered at build
   time and a build-time page cannot carry a per-request nonce; and data:
   pictures, which is how the image component draws its placeholders.

   In development the dev server also needs eval (React rebuilds error
   stacks with it) and a WebSocket back to itself for live reload. Neither
   is allowed in the built site.

   Strict-Transport-Security tells browsers to refuse plain HTTP for the
   domain for as long as max-age says. It was held back until recalibre.cloud
   was confirmed on HTTPS. On 3 November 2026 the live site was measured
   already sending it, at one year, added by Netlify at its edge; the value
   below is the same one year, so the two headers agree wherever both are
   sent, and the header travels with the site if it ever leaves Netlify.
   No `includeSubDomains` and no `preload`: neither has been decided, and
   preload is a submission to a browser list that is slow to undo. */
const dev = process.env.NODE_ENV === 'development';

/* GOOGLE ANALYTICS, ONLY WHEN IT EXISTS (4 November 2026). The site measures
   visits with GA4 after the reader consents (components/Consent.tsx). The
   policy is opened to Google's hosts only in a build that carries the
   measurement ID, which the host sets for production alone; a preview or a
   local build keeps the policy exactly as strict as before. */
const GA = Boolean(process.env.NEXT_PUBLIC_GA_ID);
const GA_SCRIPT = GA ? ' https://www.googletagmanager.com' : '';
const GA_CONNECT = GA
  ? ' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com'
  : '';
const GA_IMG = GA ? ' https://*.google-analytics.com https://*.googletagmanager.com' : '';

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}${GA_SCRIPT}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data:${GA_IMG}`,
  "font-src 'self'",
  "media-src 'self'",
  `connect-src 'self'${dev ? ' ws: wss:' : ''}${GA_CONNECT}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* ONE 404 FOR TWO ROOT LAYOUTS (4 November 2026). With a root layout per
     language there is no layout above both for a not-found page to render
     in: a group's own not-found.tsx was served inside Next's bare error
     document, with no bar, no footer and no `lang`. `global-not-found.tsx`
     is the file Next provides for exactly this case; it renders the whole
     document itself, through the same shell as every page. */
  experimental: { globalNotFound: true },
  // the site does not need to announce what it runs on
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
  /* THE OLD ADDRESSES (4 November 2026). "Work" became "Projects"; the five
     addresses under /work had been public since 3 October 2026 and are
     linked from outside, so each one is answered with a permanent redirect
     (308) to its new address, in both languages. `:path*` matches nothing as
     well as something, so two rules cover the index and every case page. */
  async redirects() {
    return [
      { source: '/work/:path*', destination: '/projects/:path*', permanent: true },
      { source: '/fr/work/:path*', destination: '/fr/projects/:path*', permanent: true },
    ];
  },
  images: {
    // AVIF where the browser takes it, WebP otherwise; the default was WebP
    // only. `qualities` must list every value a caller passes, or Next 16
    // refuses the build.
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 86],
  },
  // pin the root so Next does not walk up to the home directory looking for a lockfile
  turbopack: { root: __dirname },
  // the copyright year, read from the clock once here at build time and written
  // into the bundle as a literal, so the page the server built and the visitor's
  // browser print the same year whatever the visitor's clock says
  env: { BUILD_YEAR: String(new Date().getFullYear()) },
};

export default nextConfig;
