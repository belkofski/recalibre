import type { CSSProperties } from 'react';
import Img, { ArtImg } from '@/lib/Img';
import { InView } from '@/lib/motion';
import { Caption, cardClass, Frame } from '@/components/ui';
import { IMAGE_SIZE } from '@/lib/images.generated';
import type { Shot as ShotEntry } from '@/content/work';

/* ============================================================================
   ONE SHOT OF A CASE STUDY'S PICTURES.

   EVERY SHOT AT ITS OWN SHAPE. These were all forced into a 16:10 box, and
   most of the OPS screens are not 16:10 — the 4:3 one lost its bottom sixth
   and the 16:9 ones lost a tenth of their width, which on a dashboard is a
   column of the table. The box takes the file's real ratio, so nothing is
   cropped. Below 810 a shot with a phone cut (`srcTall`) draws it, in a box
   of that file's own shape.

   A CAPTURE SITS IN A FRAME; A PHOTOGRAPH DOES NOT. A product screen is an
   object when it has a device around it: the figure is a surface card with
   the frame inset on it and the caption on the hairline under the frame.
   The frame's bar goes below 810, where the slot serves its phone cut. A
   photograph (`bare`) is published edge to edge on its card, with nothing
   drawn over it, and keeps the caption under it on the card's own
   padding.

   AND A WAY TO SEE ONE PROPERLY. A dense operational screen at 350px on a
   phone is a texture, not evidence. The link opens the original file — a
   plain link, keyboard-reachable, with no viewer to learn — at the end of
   the caption's hairline, a 44px target that takes no height of its own in
   the caption's line.

   TWO ENTRANCES. The first shot of a gallery is the page's one massive
   visual and takes the clip reveal (`mode="clip"`): it appears from its
   foot upward while the picture settles from 1.08. The rest take the
   picture tier: a fade with no travel while the picture settles from 1.06.
   ========================================================================= */
export default function Shot({
  shot,
  mode = 'picture',
  step = 0,
  bare = false,
  radius = 24,
  sizes,
  sizesTall = 'calc(100vw - 44px)',
}: {
  shot: ShotEntry;
  mode?: 'picture' | 'clip';
  /** The figure's column in its row, for the 90ms stagger. */
  step?: number;
  /** A photograph: edge to edge on its card, no frame over it. */
  bare?: boolean;
  /** 24 in a rail of shots; 30 for the one shot that runs the width. */
  radius?: 30 | 24;
  /** The CSS width the shot is drawn at. */
  sizes: string;
  /** The CSS width the phone cut is drawn at, below 810. */
  sizesTall?: string;
}) {
  const { w, h } = IMAGE_SIZE[shot.src];
  const tall = shot.srcTall ? IMAGE_SIZE[shot.srcTall] : null;
  const box = {
    '--ar': `${w} / ${h}`,
    ...(tall ? { '--ar-tall': `${tall.w} / ${tall.h}` } : {}),
  } as CSSProperties;

  const picture = (
    <span className="settle absolute inset-0 block">
      {shot.srcTall ? (
        <ArtImg
          src={shot.src}
          srcTall={shot.srcTall}
          media="(max-width: 809.98px)"
          alt={shot.alt}
          sizes={sizes}
          sizesTall={sizesTall}
          lazy
          className="media-fill"
        />
      ) : (
        <Img src={shot.src} alt={shot.alt} sizes={sizes} className="media-fill" />
      )}
    </span>
  );

  const caption = (
    <Caption
      as="figcaption"
      className="flex-wrap"
      end={
        <a
          href={shot.src}
          target="_blank"
          rel="noreferrer"
          className="t-mono hover-read relative z-[1] -my-[15px] flex min-h-[44px] items-center"
        >
          <span className="sr-only">{shot.caption} — </span>
          OPEN FULL SIZE
          <span className="sr-only normal-case"> (opens in a new tab)</span>
        </a>
      }
    >
      {shot.caption}
    </Caption>
  );

  if (bare) {
    return (
      <InView as="figure" mode={mode} step={step} className={`${cardClass({ radius })} m-0 flex w-full flex-col overflow-clip`}>
        <div className="relative w-full overflow-clip [aspect-ratio:var(--ar)]" style={box}>
          {picture}
        </div>
        <div className="p-(--space-3)">{caption}</div>
      </InView>
    );
  }

  return (
    <InView
      as="figure"
      mode={mode}
      step={step}
      className={`${cardClass({ radius })} m-0 flex w-full flex-col gap-(--space-3) p-(--space-3)`}
      style={box}
    >
      <Frame
        bare="mobile"
        screenClassName={`relative [aspect-ratio:var(--ar)] ${tall ? 'mobile:[aspect-ratio:var(--ar-tall)]' : ''}`}
      >
        {picture}
      </Frame>
      {caption}
    </InView>
  );
}
