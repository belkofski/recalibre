import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';

/**
 * /manifest.webmanifest — what a phone reads when the site is saved to its
 * home screen. There was none, so an iPhone or an Android phone saving the
 * site had no icon of the firm's to show.
 *
 * The three pictures are the founder's own '///' mark files, copied into
 * assets on his yes of 25 September 2026 and published unchanged in public/:
 * the tile at 192 and 512, and the version with the wider margin that a phone
 * may crop to a circle or a rounded square ("maskable"). The colours are the
 * site's ground colour, the same one the browser bar is given in layout.tsx.
 *
 * Only what a home-screen icon needs. No description and no display mode: the
 * site opens in the phone's browser, exactly as it does from a link.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    start_url: '/',
    background_color: '#f2f0eb',
    theme_color: '#f2f0eb',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
