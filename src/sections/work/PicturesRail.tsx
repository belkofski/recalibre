import { InView, Rail } from '@/lib/motion';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import { Caption, Card, LabelRow, Orbs } from '@/components/ui';
import { CASE_CHAPTERS as C, type Initiative } from '@/content/work';
import Shot from './Shot';

/* ============================================================================
   THE PICTURES — a case study's shots, by how many there are.

   MORE THAN ONE (OPS): a snap rail of framed captures, each at its own
   shape, 820px wide from 1200 up, 70% of the window on a tablet and 80% on
   a phone so the next one's edge shows and says there is more. The track
   scrolls by hand, wheel or trackpad, snaps each shot to its start, takes
   the arrow keys when it has focus, and the two 44px rings under it step
   one shot at a time (hidden below 600, where a thumb swipes); the tick
   rule under it lights to where the reader is. The first shot takes the
   clip reveal, the rest the picture tier. Without scripts the track still
   scrolls and snaps; only the rule and the rings wait.

   ONE SHOT: the picture runs the width, in a frame where it is a capture
   (ABP's site) and bare where it is a photograph (Belkofski's court). One
   picture is not a rail. Which it is comes from the record below, not
   from a guess about the file.

   NONE (Contraxis): no interface may be shown, so the system diagram
   stands here on a dotted bed with the ambient light behind it, lit under
   the pointer, with its caption on the panel's foot. Its dots run only
   under the pointer (SystemDiagram.tsx), so there is no pause control.
   ========================================================================= */

/** The initiatives whose one picture is a photograph, published as shot
 *  with nothing drawn over it; every other shot is a product capture and
 *  takes the device frame. */
const PHOTOGRAPHS: ReadonlySet<string> = new Set(['belkofski']);

export default function PicturesRail({ item }: { item: Initiative }) {
  const [first] = item.shots;
  return (
    <section id={C.pictures.id} aria-label="Images" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-row)">
        <LabelRow label={C.pictures.label} />
        {item.shots.length > 1 ? (
          <Rail
            ariaLabel="The pictures"
            className="pictures-rail [--rail-w:80vw] mid:[--rail-w:70vw] tablet:[--rail-w:70vw] min-[1200px]:[--rail-w:820px]"
          >
            {item.shots.map((shot, i) => (
              <Shot
                key={shot.src}
                shot={shot}
                mode={i === 0 ? 'clip' : 'picture'}
                /* The screen's width inside its frame: the item's width
                   less the card's padding and the bezel. */
                sizes="(max-width: 599px) 80vw, (max-width: 1199px) 70vw, 792px"
                sizesTall="(max-width: 599px) 80vw, 70vw"
              />
            ))}
          </Rail>
        ) : first ? (
          <Shot
            shot={first}
            mode="clip"
            radius={30}
            bare={PHOTOGRAPHS.has(item.slug)}
            sizes="(max-width: 809px) 100vw, 1380px"
            sizesTall="100vw"
          />
        ) : (
          <InView mode="scale">
            <Card radius={30} spot className="flex w-full items-center justify-center overflow-clip py-(--space-7)">
              {/* The bed, a child: the surface's own background-image would
                  override a dot grid drawn on the card itself. */}
              <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />
              <Orbs variant="card" />
              {/* The same box the schematic drew in — a square 86% of the
                  panel, and a 360:470 block across a phone — so the panel
                  keeps its height. The caption on its hairline across the
                  panel's foot, hidden from a screen reader, which hears
                  the diagram's own description. */}
              <SystemDiagram
                preset="gallery"
                className="relative aspect-square w-[86%] mobile:aspect-[360/470] mobile:w-full"
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-[20px]">
                <Caption as="div" className="px-(--card-pad)">
                  {DIAGRAM_CAPTION}
                </Caption>
              </div>
            </Card>
          </InView>
        )}
      </div>
    </section>
  );
}
