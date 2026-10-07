import { ArtImg } from '@/lib/Img';
import { InView, Rise, Scene } from '@/lib/motion';
import { Caption, Card, MonoLink } from '@/components/ui';
import { initiativeBySlug, WORK_INDEX } from '@/content/work';

/* ============================================================================
   FEATURED OPS — the work index opens with the flagship, and it is the
   page's one big moment: the words on a narrow surface, and beside them,
   wider than they are, OPS on a screen in the blue room (a picture no other
   page shows). Below 1200 the picture goes on top in its own wide cut.

   The words are the name, the owner's one line under it, the honesty note
   (the screen in the room runs on demonstration data) and the way in.

   AS THE PAGE SCROLLS the picture settles from a zoom while the block
   rises into the window, and the whole block steps back and dims as it
   leaves through the top (`Scene`, `.sx-zoom`, `.sx-recede`). The defaults
   are the finished state: without scripts or under reduced motion it
   simply stands.
   ========================================================================= */
export default function FeaturedOps() {
  const ops = initiativeBySlug('ops');
  if (!ops) return null;
  return (
    <Scene
      as="section"
      aria-labelledby="work-featured"
      end={0.15}
      className="pad-x pad-top relative isolate flex w-full flex-col items-center overflow-clip"
    >
      <div className="sx-recede shell">
        <div className="seam grid w-full grid-cols-[5fr_7fr] narrow:grid-cols-1">
          <Card radius={30} pad spot className="flex flex-col justify-between gap-(--space-5)">
            <div className="flex flex-col gap-(--space-4)">
              <Rise as="h2" id="work-featured" lines={[`${ops.name}.`]} className="t-display text-ink" />
              {ops.tagline ? (
                <InView delay={60}>
                  <p className="t-lede max-w-[360px] text-ink">{ops.tagline}</p>
                </InView>
              ) : null}
            </div>
            <InView delay={120}>
              {ops.demo ? (
                <Caption as="div" end={<MonoLink href={`/work/${ops.slug}`} lead="EXPLORE" label={ops.name} />}>
                  {ops.demo}
                </Caption>
              ) : (
                <MonoLink href={`/work/${ops.slug}`} lead="EXPLORE" label={ops.name} />
              )}
            </InView>
          </Card>

          {/* The room: the near-square plate from 1200 up, in a square
              (the screen, the stand and the chair; the plate's foot is
              floor), the plate's own wide cut below. The picture layer is cut 6% larger than the card
              so the lean never shows an edge; the zoom sits inside it. */}
          <InView
            mode="clip"
            className="aspect-square max-h-[calc(100svh-120px)] narrow:order-first narrow:max-h-none narrow:aspect-[1148/718]"
          >
            <Card radius={30} spot tilt surface={false} className="h-full overflow-clip">
              <span className="tilt-layer absolute -inset-[6%] block">
                <span className="sx-zoom absolute inset-0 block">
                  <span className="settle absolute inset-0 block">
                    <ArtImg
                      src={WORK_INDEX.featured.src}
                      srcTall={WORK_INDEX.featured.srcTall}
                      media="(max-width: 1199.98px)"
                      alt={WORK_INDEX.featured.alt}
                      sizes="820px"
                      sizesTall="100vw"
                      className="media-fill object-[50%_30%]"
                    />
                  </span>
                </span>
              </span>
            </Card>
          </InView>
        </div>
      </div>
    </Scene>
  );
}
