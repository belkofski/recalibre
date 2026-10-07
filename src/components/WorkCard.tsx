import type { CSSProperties } from 'react';
import Link from 'next/link';
import Img from '@/lib/Img';
import { Spotlight, Tilt } from '@/lib/motion';
import { Chevron, Frame, cardClass } from '@/components/ui';
import SystemDiagram from '@/components/SystemDiagram';
import { IMAGE_SIZE, type ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   THE INITIATIVE CARD — the work index's three cards under the flagship.

   A NAME, ONE LINE, THE WAY IN. The owner's third note asked for fewer
   words: the card used to carry the meta line, the status, a row of tags
   and a sentence. It now carries the name, the year and the field, and the
   chevron; the case page says the rest.

   THREE KINDS OF ART, BY WHAT THE ENTRY HAS (`art`):

     photo     a photograph edge to edge, in a `.tilt-layer` cut 6% larger
               than its box so the lean never shows an edge
     capture   a product or website capture in a device frame on a dotted
               bed, at the file's own shape, centred in whatever box the
               row gives it (`.case-capture`, styles/work.css)
     diagram   the Contraxis system diagram, where there is no interface to
               show, on the dotted bed

   THE CARD IS NOT ONE SHAPE. The index lays the three out unevenly (a wide
   photograph beside a capture, the diagram across the row under them), so
   the art box takes its size from the call site (`artClass`), and `side`
   puts the words beside the art from 1200 up instead of under it.

   It answers the reader as every surface card does: the spotlight under
   the pointer, the lean (`Tilt`), the dot that fills and the chevron that
   moves; on a phone it lights as it passes the centre of the screen. The
   name is an H2 (the index opener is the H1) and names the link; the meta
   line describes it.
   ========================================================================= */

export type WorkCardItem = {
  slug: string;
  name: string;
  /** The card's one line: the year and the field. */
  meta: string;
  /** Null where the entry has no honest picture: the diagram stands in. */
  src: ImageSrc | null;
  alt: string;
};

export default function WorkCard({
  item,
  art,
  artClass = '',
  side = false,
  sizes,
  className = '',
}: {
  item: WorkCardItem;
  art: 'photo' | 'capture' | 'diagram';
  /** The art box's size and shape at each width (the row's call). */
  artClass?: string;
  /** The words beside the art from 1200 up, the art on the right. */
  side?: boolean;
  /** The CSS width the picture is drawn at. */
  sizes?: string;
  /** Extra classes on the link (its height in the row). */
  className?: string;
}) {
  const id = `work-${item.slug}`;
  const shape = item.src
    ? ({
        '--ar': `${IMAGE_SIZE[item.src].w} / ${IMAGE_SIZE[item.src].h}`,
      } as CSSProperties)
    : undefined;

  return (
    <Spotlight>
      <Tilt max={4}>
        <Link
          href={`/work/${item.slug}`}
          aria-labelledby={`${id}-name`}
          aria-describedby={`${id}-meta`}
          className={`${cardClass({ interactive: true, spot: true, tilt: true })} press work-card flex flex-col overflow-clip ${
            side ? 'min-[1200px]:flex-row-reverse' : ''
          } ${className}`}
        >
          <span aria-hidden="true" className="spot-light" />

          <div
            className={`work-card-art relative block w-full overflow-clip ${side ? 'min-[1200px]:w-auto min-[1200px]:flex-1' : ''} ${artClass}`}
            style={shape}
          >
            {art === 'diagram' ? (
              <>
                <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10" />
                <div className="tilt-layer absolute inset-0 block">
                  <SystemDiagram preset="card" className="absolute inset-[12px]" />
                </div>
              </>
            ) : art === 'capture' && item.src ? (
              <>
                <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10" />
                <div className="tilt-layer case-capture">
                  <Frame bare="mobile" screenClassName="relative">
                    <span className="absolute inset-0 block">
                      <Img src={item.src} alt={item.alt} sizes={sizes} className="media-fill case-contain media-zoom object-left-top" />
                    </span>
                  </Frame>
                </div>
              </>
            ) : item.src ? (
              <span className="tilt-layer absolute -inset-[6%] block">
                <Img src={item.src} alt={item.alt} sizes={sizes} className="media-fill media-zoom" />
              </span>
            ) : null}
          </div>

          <div
            className={`flex items-start justify-between gap-(--space-3) p-(--card-pad) ${
              side ? 'min-[1200px]:w-[360px] min-[1200px]:flex-none min-[1200px]:items-end' : ''
            }`}
          >
            <div className="flex flex-col gap-(--space-1)">
              <h2 id={`${id}-name`} className="t-card text-ink">
                {`${item.name}.`}
              </h2>
              <span id={`${id}-meta`} className="t-mono tabular-nums text-ink-3">
                {item.meta}
              </span>
            </div>
            <span className={`dot-btn mt-[6px] shrink-0 ${side ? 'min-[1200px]:mb-[6px]' : ''}`}>
              <Chevron />
            </span>
          </div>
        </Link>
      </Tilt>
    </Spotlight>
  );
}
