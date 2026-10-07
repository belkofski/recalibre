import type { CSSProperties } from 'react';
import Img, { ArtImg } from '@/lib/Img';
import { HScroll, InView, Scene } from '@/lib/motion';
import { cardClass, Frame } from '@/components/ui';
import { IMAGE_SIZE } from '@/lib/images.generated';
import { CASE_CHAPTERS as C, type Initiative, type Shot } from '@/content/work';

/* ============================================================================
   THE PICTURES — a case study's shots, none of them the cover.

   MORE THAN ONE (OPS, Belkofski): a row that slides sideways WHILE THE
   READER SCROLLS DOWN (`HScroll`, lib/motion.tsx). The owner's third note:
   nobody swipes sideways, so the old snap rail went. The block pins, the
   row travels by exactly its overhang, and the page goes on. The row is
   uneven on purpose: each shot keeps its own shape at one height, so a wide
   capture stands beside a tall phone; the second is drawn a step smaller
   where the two share a shape (`data-size`). Where the row cannot pin (no
   script, reduced motion, a window under 560 tall, a row that already
   fits) it is laid out flat: side by side from 600 up, each at its own
   shape, and down a column on a phone with the second shot inset.

   ONE (ABP): the website in its device frame, the width of the shell,
   opening from its foot as it rises into the window (`.sx-open`).

   NONE (Contraxis): no block; the diagram on the cover is its one visual.

   No caption under each picture: the page's honesty line is on the cover.
   FULL SIZE stays, a plain link to the file, a 44px target.
   ========================================================================= */

/** A capture is drawn in a device frame; a photograph is not. */
const PHOTOGRAPHS: ReadonlySet<string> = new Set(['/img/belkofski-court-clean.jpg', '/img/still-belkofski-cube.jpg']);

/** Two shots of nearly one shape: the second is drawn a step smaller, so
 *  the row is never two equal frames side by side. */
function alike(a: Shot | undefined, b: Shot) {
  if (!a) return false;
  const ra = IMAGE_SIZE[a.src].w / IMAGE_SIZE[a.src].h;
  const rb = IMAGE_SIZE[b.src].w / IMAGE_SIZE[b.src].h;
  return Math.abs(ra - rb) < 0.3;
}

function OpenFull({ shot }: { shot: Shot }) {
  return (
    <a
      href={shot.src}
      target="_blank"
      rel="noreferrer"
      aria-label={`FULL SIZE: ${shot.alt} (opens in a new tab)`}
      className="t-mono hover-read flex min-h-[44px] w-fit items-center text-ink-3"
    >
      FULL SIZE
    </a>
  );
}

/** One picture of the row: its own shape (`--ar`, and `--ar-tall` for the
 *  phone's cut below 810), its picture settling from a zoom as the block
 *  rises in. */
function Pic({ shot, size }: { shot: Shot; size: 'lg' | 'sm' }) {
  const { w, h } = IMAGE_SIZE[shot.src];
  const tall = shot.srcTall ? IMAGE_SIZE[shot.srcTall] : null;
  const style = {
    '--ar': `${w} / ${h}`,
    ...(tall ? { '--ar-tall': `${tall.w} / ${tall.h}` } : {}),
  } as CSSProperties;
  const photo = PHOTOGRAPHS.has(shot.src);
  return (
    <figure data-size={size} style={style} className={`${cardClass({ radius: 24 })} case-pic m-0 flex flex-col p-(--space-2)`}>
      <div
        className={`case-pic-screen relative w-full overflow-clip rounded-[16px] mobile:rounded-[12px] ${photo ? '' : 'border border-rule'}`}
      >
        <span className="sx-zoom absolute inset-0 block">
          {shot.srcTall ? (
            <ArtImg
              src={shot.src}
              srcTall={shot.srcTall}
              media="(max-width: 809.98px)"
              alt={shot.alt}
              sizes="(max-width: 1199px) 70vw, 1100px"
              sizesTall="86vw"
              lazy
              className="media-fill"
            />
          ) : (
            <Img src={shot.src} alt={shot.alt} sizes="(max-width: 809px) 86vw, (max-width: 1199px) 70vw, 1100px" className="media-fill" />
          )}
        </span>
      </div>
      <figcaption className="px-(--space-1)">
        <OpenFull shot={shot} />
      </figcaption>
    </figure>
  );
}

export default function CasePictures({ item }: { item: Initiative }) {
  const shots = item.shots;

  const [first] = shots;
  if (shots.length === 1 && first) {
    const shot = first;
    const { w, h } = IMAGE_SIZE[shot.src];
    return (
      <Scene as="section" id={C.pictures.id} aria-label="Pictures" end={0.6} className="pad-x pad-top flex w-full flex-col items-center">
        <div className="shell">
          <InView mode="picture">
            {/* No taller than the window under the bar: the width follows
                the height the window allows, times the capture's shape. */}
            <figure
              className={`${cardClass({ radius: 30 })} m-0 mx-auto flex flex-col gap-(--space-2) p-(--space-3) mobile:p-(--space-2)`}
              style={{ maxWidth: `max(360px, calc((100svh - 200px) * ${w} / ${h}))` }}
            >
              <div className="sx-open [--sx-radius:18px]">
                <Frame bare="mobile" screenClassName="relative">
                  <div className="relative w-full" style={{ aspectRatio: `${w} / ${h}` }}>
                    <span className="sx-zoom absolute inset-0 block">
                      <Img src={shot.src} alt={shot.alt} sizes="(max-width: 809px) 100vw, 1340px" className="media-fill" />
                    </span>
                  </div>
                </Frame>
              </div>
              <figcaption className="px-(--space-1)">
                <OpenFull shot={shot} />
              </figcaption>
            </figure>
          </InView>
        </div>
      </Scene>
    );
  }

  if (shots.length < 2) return null;
  return (
    <Scene
      as="section"
      id={C.pictures.id}
      aria-label="Pictures"
      end={0.15}
      className="case-pics-sec flex w-full flex-col pt-(--space-section)"
    >
      <HScroll
        className="case-pics"
        label="Pictures"
        head={
          <div className="pad-x w-full">
            <div className="shell flex items-center gap-(--space-4)">
              <span className="t-mono text-ink-3">{C.pictures.label}</span>
              <span aria-hidden="true" className="hs-progress flex-1" />
            </div>
          </div>
        }
      >
        {shots.map((shot, i) => (
          <Pic key={shot.src} shot={shot} size={i > 0 && alike(shots[0], shot) ? 'sm' : 'lg'} />
        ))}
      </HScroll>
    </Scene>
  );
}
