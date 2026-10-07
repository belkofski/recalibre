import type { CSSProperties } from 'react';
import { ArtImg } from '@/lib/Img';
import { InView } from '@/lib/motion';
import { Card, Frame, Orbs } from '@/components/ui';
import { IMAGE_SIZE, type ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   THE CAPTURE CARD — a product screen as an object, not a screenshot in a
   box. The OPS overview sits in a device frame on a surface with a dotted
   bed and the ambient light behind it, and the whole card leans toward the
   pointer while the frame inside leans the other way. The work index's
   featured panel and the OPS case cover draw the same card.

   The picture is revealed from its foot upward while it settles (the clip
   tier), and the tilt sits on the card INSIDE that reveal, never on it.
   The frame sits centred on a bed inset from the card and its screen keeps
   the file's own shape, read off the manifest and written as `--ar` (the
   phone cut's as `--ar-tall`, drawn below 810, where the window bar goes),
   so the overview is shown whole with no strip of ground beside or under
   it whatever the card's height (`.case-capture`, styles/work.css). On a
   phone the card lights as it passes the centre of the screen; under
   reduced motion there is no tilt and the reveal is a fade; without
   scripts the card, the frame and the capture are simply there. Inside a
   `Scene` the capture leans in as the block scrolls away (`.case-zoom`,
   styles/work.css); `scale` and `transform` compose, so the settle and the
   zoom never overwrite each other.
   ========================================================================= */
export default function CaptureCard({
  src,
  srcTall,
  alt,
  sizes,
  sizesTall,
  lazy = false,
  className = '',
}: {
  src: ImageSrc;
  /** The phone's own cut, served below 810 in its 4:3 box. */
  srcTall?: ImageSrc;
  alt: string;
  /** The CSS width the wide crop is drawn at. */
  sizes: string;
  /** The CSS width the phone cut is drawn at. */
  sizesTall?: string;
  /** Below the first screen: load when near, at the default priority. */
  lazy?: boolean;
  /** The reveal's own classes: its place in a grid (`narrow:order-first`). */
  className?: string;
}) {
  const wide = IMAGE_SIZE[src];
  const tall = srcTall ? IMAGE_SIZE[srcTall] : null;
  const shape = {
    '--ar': `${wide.w} / ${wide.h}`,
    ...(tall ? { '--ar-tall': `${tall.w} / ${tall.h}` } : {}),
  } as CSSProperties;
  return (
    <InView mode="clip" className={`aspect-[7/5] mobile:aspect-[4/3] ${className}`}>
      <Card radius={30} spot tilt className="h-full" style={shape}>
        {/* The bed, a child: the surface's own background-image would
            override a dot grid drawn on the card itself. Then the light,
            both under everything else in the card. */}
        <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />
        <Orbs variant="card" />
        {/* A `div`, not a `span`: the frame inside is a block. */}
        <div className="tilt-layer case-capture">
          <Frame bare="mobile" screenClassName="relative">
            <span className="settle case-zoom absolute inset-0 block">
              <ArtImg
                src={src}
                srcTall={srcTall}
                media="(max-width: 809.98px)"
                alt={alt}
                sizes={sizes}
                sizesTall={sizesTall}
                lazy={lazy}
                className="media-fill case-contain object-left-top"
              />
            </span>
          </Frame>
        </div>
      </Card>
    </InView>
  );
}
