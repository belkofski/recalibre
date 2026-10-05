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

   Strict-Transport-Security is NOT here. It tells browsers to refuse plain
   HTTP for the domain for a year, and it goes in only once recalibre.cloud
   is confirmed and serving over HTTPS — the record still lists the domain
   as an open decision. */
const dev = process.env.NODE_ENV === 'development';

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "media-src 'self'",
  `connect-src 'self'${dev ? ' ws: wss:' : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // the site does not need to announce what it runs on
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
  // pin the root so Next does not walk up to the home directory looking for a lockfile
  turbopack: { root: __dirname },
  // the copyright year, read from the clock once here at build time and written
  // into the bundle as a literal, so the page the server built and the visitor's
  // browser print the same year whatever the visitor's clock says
  env: { BUILD_YEAR: String(new Date().getFullYear()) },
  // A 1440 STEP IN THE IMAGE WIDTHS (5 October 2026). The defaults jump from
  // 1200 to 1920, so on a 1440 laptop every full-width picture (1376 to 1432px
  // drawn) came as the 1920 file: the hero 212 KB where 125 would do, the
  // Belkofski court 403 where 263 would. The rest are Next's own defaults.
  images: { deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840] },
};

export default nextConfig;
