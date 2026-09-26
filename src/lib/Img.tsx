import NextImage, { getImageProps } from 'next/image';
import { IMAGE_SIZE, type ImageSrc } from './images.generated';

/**
 * The only way an image goes on this page.
 *
 * ONE RULE THAT IS NOT ABOUT THIS COMPONENT: never replace an image's bytes
 * while keeping its filename. The optimiser caches by (url, width, quality)
 * AND by the Accept header, so swapping a file in place leaves the WebP and
 * AVIF variants holding the old picture. That is exactly what happened when
 * the grey placeholder was overwritten with the real wordmark: curl saw the
 * new mark, every browser saw the old one, and no amount of cache-busting on
 * the request fixed it because the extra parameter is not part of the key.
 * A CDN behaves the same way. Give a new picture a new name.
 *
 * Three things it guarantees, each of which was wrong somewhere before it
 * existed:
 *
 *  1. THE SIZE IS THE FILE'S REAL SIZE. Width and height come from the
 *     generated manifest, which is read from the files themselves. Six images
 *     were declaring sizes they were not — one claimed 8140x5427 for a
 *     1160x773 file — so the browser reserved the wrong space and the page
 *     jumped as each one loaded.
 *
 *  2. THE FILE EXISTS. `src` is typed to the manifest's keys, so referencing an
 *     image that is not in public/img fails the build instead of rendering a
 *     blank box. After adding or replacing a file, run `npm run images`.
 *
 *  3. IT IS OPTIMISED. Goes through next/image, so a 4MB product screenshot is
 *     resized and served as WebP at the size actually needed, rather than
 *     shipped whole. `sizes` tells it the CSS width so it picks correctly.
 *
 * `alt` is required and has no default. A decorative image passes alt="" on
 * purpose; a meaningful one has to say something. There is no third option.
 */
export default function Img({
  src,
  alt,
  className,
  sizes,
  priority = false,
  eager = false,
  quality,
}: {
  src: ImageSrc;
  alt: string;
  className?: string;
  /** CSS width at each breakpoint, e.g. "664px". Lets next/image pick a file. */
  sizes?: string;
  /** Above the fold only. Everything else stays lazy.
   *
   *  WHAT THIS DID BEFORE WAS ADD A PRELOAD LINK AND SWITCH OFF LAZY
   *  LOADING, NOTHING ELSE. Next 16
   *  calls the prop `preload` now, and a preload is only an early request:
   *  the picture still queued at the browser's default priority, behind the
   *  scripts and styles, on every page. It now also carries
   *  fetchpriority="high", which is the attribute that actually moves the
   *  page's main picture to the front of the queue.
   *
   *  ON PURPOSE, BOTH AT ONCE. Next's image docs advise against `preload`
   *  together with `fetchPriority`; the pair does not throw (only preload
   *  with lazy loading does), and the preload link inherits the high
   *  priority, so the two are set together here. Do not "fix" it. */
  priority?: boolean;
  /** Load now, but without a preload hint. For images that are in the
   *  document but never intersect the viewport on their own — the marks
   *  inside the marquee sit off to the right until the strip carries them
   *  in, so lazy loading never fires and they arrive one at a time in front
   *  of the reader. Eager is right for a handful of small vectors; it is
   *  not a substitute for `priority` and not for anything large. */
  eager?: boolean;
  quality?: number;
}) {
  const { w, h } = IMAGE_SIZE[src];

  // Small assets skip the optimiser. Re-encoding a 15x15 social icon produced a
  // 7x7 file, which then had to be stretched back into its 16px box — the
  // optimiser cannot help an image that is already smaller than its slot, and
  // rounding at that scale costs real pixels. 64px is the cutoff: below it an
  // image is an icon, and icons ship as they are.
  const tiny = Math.max(w, h) <= 64;

  // SVG is already resolution-independent, and Next refuses to run it through
  // the optimiser unless dangerouslyAllowSVG is set — which it should not be,
  // because an SVG is executable markup and the optimiser would be serving it
  // from our own origin. Vector marks ship as they are.
  const vector = src.endsWith('.svg');
  const raw = tiny || vector;

  return (
    <NextImage
      src={src}
      alt={alt}
      width={w}
      height={h}
      sizes={raw ? undefined : sizes}
      quality={quality}
      preload={priority}
      fetchPriority={priority ? 'high' : undefined}
      loading={priority ? undefined : eager ? 'eager' : 'lazy'}
      unoptimized={raw}
      className={className}
    />
  );
}

/**
 * ONE PICTURE, TWO CROPS, ONE DOWNLOAD.
 *
 * The hero used to draw both of its crops as two images and hide one with
 * CSS, and a hidden image is still a downloaded one: every desktop fetched
 * the phone crop (103 KB) and every phone fetched the desktop crop (82 KB),
 * to show neither. A <picture> lets the browser choose before it asks for
 * anything. The phone crop is offered below 810px, which is the template's
 * own breakpoint (see globals.css), and on a tablet held upright; the wide
 * crop everywhere else. The upright tablet was added on 25 September 2026
 * with the re-cut hero (D-07): the wide crop's subject, the screen, sits in
 * its right third, and a tall box centred on it cut the screen to a strip
 * at its right edge, leaving a wall and a chair. The phone crop is composed
 * for a tall box and holds the chair, the screen and the seat. Both go
 * through the same optimiser at the same manifest sizes, and the <img> that
 * lands is the same element the page always drew, with the same class.
 *
 * On the hero it is the main picture of its page, so by default it is never
 * lazy and it is asked for first. There is no preload link: Next's image
 * preload is written without a media condition, so it would fetch the
 * second crop again.
 *
 * THE SAME PAIR, FURTHER DOWN A PAGE. Home's capability cards (26 September
 * 2026) draw a wide and a tall crop on the same breakpoints, but well below
 * the first screen and far narrower than the window. They pass `lazy` and
 * the widths each crop is actually drawn at (`sizes`, `sizesTall`). Left
 * out, the three props give exactly what the hero has always had.
 */
export function ArtImg({
  src,
  srcTall,
  alt,
  className,
  quality,
  sizes = '100vw',
  sizesTall = '100vw',
  lazy = false,
}: {
  /** The wide crop, drawn from 810px up, except on an upright tablet. */
  src: ImageSrc;
  /** The portrait crop, drawn below 810px and on an upright tablet. */
  srcTall: ImageSrc;
  alt: string;
  className?: string;
  quality?: number;
  /** The CSS width the wide crop is drawn at. The hero's is the window. */
  sizes?: string;
  /** The CSS width the tall crop is drawn at. */
  sizesTall?: string;
  /** Below the first screen: load when near, at the default priority. */
  lazy?: boolean;
}) {
  const wide = IMAGE_SIZE[src];
  const tall = IMAGE_SIZE[srcTall];
  const {
    props: { srcSet: tallSet },
  } = getImageProps({ src: srcTall, alt, width: tall.w, height: tall.h, sizes: sizesTall, quality });

  return (
    <picture>
      <source
        media="(max-width: 809.98px), (max-width: 1199.98px) and (orientation: portrait)"
        srcSet={tallSet}
        sizes={sizesTall}
      />
      <NextImage
        src={src}
        alt={alt}
        width={wide.w}
        height={wide.h}
        sizes={sizes}
        quality={quality}
        loading={lazy ? 'lazy' : 'eager'}
        fetchPriority={lazy ? undefined : 'high'}
        className={className}
      />
    </picture>
  );
}
