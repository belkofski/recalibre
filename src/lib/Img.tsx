import NextImage from 'next/image';
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
  quality,
}: {
  src: ImageSrc;
  alt: string;
  className?: string;
  /** CSS width at each breakpoint, e.g. "664px". Lets next/image pick a file. */
  sizes?: string;
  /** Above the fold only. Everything else stays lazy. */
  priority?: boolean;
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
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      unoptimized={raw}
      className={className}
    />
  );
}
