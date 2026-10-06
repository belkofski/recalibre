import type { CSSProperties } from 'react';
import Img, { ArtImg } from '@/lib/Img';
import { InView } from '@/lib/motion';
import { Caption, cardClass } from '@/components/ui';
import { IMAGE_SIZE } from '@/lib/images.generated';
import type { Shot as ShotEntry } from '@/content/work';

/* ============================================================================
   ONE SHOT OF A CASE STUDY'S GALLERY.

   EVERY SHOT AT ITS OWN SHAPE. These were all forced into a 16:10 box, and
   most of the OPS screens are not 16:10 — the 4:3 one lost its bottom sixth
   and the 16:9 ones lost a tenth of their width, which on a dashboard is a
   column of the table. The box takes the file's real ratio, so nothing is
   cropped. Below 810 a shot with a phone cut (`srcTall`) draws it, in a box
   of that file's own shape.

   AND A WAY TO SEE ONE PROPERLY. A dense operational screen at 350px on a
   phone is a texture, not evidence. The link opens the original file — a
   plain link, keyboard-reachable, with no viewer to learn — at the end of
   the caption's hairline.

   TWO ENTRANCES. The first shot of a gallery is the page's one massive
   visual and takes the clip reveal (`mode="clip"`): it appears from its
   foot upward while the picture settles from 1.08. The rest take the
   picture tier: a fade with no travel while the picture settles from 1.06.
   ========================================================================= */
export default function Shot({
  shot,
  mode = 'picture',
  step = 0,
  wide = false,
}: {
  shot: ShotEntry;
  mode?: 'picture' | 'clip';
  /** The figure's column in its row (0 / 1), for the 90ms stagger. */
  step?: number;
  /** Spans both columns of the seam grid. */
  wide?: boolean;
}) {
  const { w, h } = IMAGE_SIZE[shot.src];
  const tall = shot.srcTall ? IMAGE_SIZE[shot.srcTall] : null;
  const sizes = wide ? '(max-width: 809px) 100vw, 1380px' : '(max-width: 809px) 100vw, 687px';
  const box = {
    '--ar': `${w} / ${h}`,
    ...(tall ? { '--ar-tall': `${tall.w} / ${tall.h}` } : {}),
  } as CSSProperties;
  return (
    <InView
      as="figure"
      mode={mode}
      step={step}
      className={`${cardClass({ radius: 30 })} m-0 flex flex-col overflow-clip ${wide ? 'col-span-2 mobile:col-span-1' : ''}`}
    >
      <div
        className={`relative w-full overflow-clip [aspect-ratio:var(--ar)] ${tall ? 'mobile:[aspect-ratio:var(--ar-tall)]' : ''}`}
        style={box}
      >
        <div className="settle absolute inset-0">
          {shot.srcTall ? (
            <ArtImg
              src={shot.src}
              srcTall={shot.srcTall}
              media="(max-width: 809.98px)"
              alt={shot.alt}
              sizes={sizes}
              sizesTall="calc(100vw - 44px)"
              lazy
              className="media-fill"
            />
          ) : (
            <Img src={shot.src} alt={shot.alt} sizes={sizes} className="media-fill" />
          )}
        </div>
      </div>
      <Caption
        as="figcaption"
        className="flex-wrap px-(--space-4) pb-(--space-4) mobile:px-(--space-3) mobile:pb-(--space-3)"
        end={
          <a
            href={shot.src}
            target="_blank"
            rel="noreferrer"
            /* A 44px target that takes no height of its own in the
               caption's line. */
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
    </InView>
  );
}
