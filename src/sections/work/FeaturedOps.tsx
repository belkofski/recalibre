import { ArtImg } from '@/lib/Img';
import { InView, Rise } from '@/lib/motion';
import { Caption, Card, cardClass, Chip, MonoLink, Status } from '@/components/ui';
import { initiativeBySlug } from '@/content/work';
import { OPS_STORY } from '@/content/home';

/* ============================================================================
   FEATURED OPS — the work index opens with the flagship (the owner's audit,
   6 October 2026: OPS leads the work), on a seam plate split 5/7: the words
   on the page's own ground, the overview published whole beside them and
   revealed from its foot as the reader arrives. Below 1200 the picture goes
   on top, as the case cover stacks.

   Every line is the OPS entry's own (content/work.ts) or the OPS story's
   register line (content/home.ts). The only action is the secondary
   EXPLORE OPS: the calibration button never sits on a work card.
   ========================================================================= */
export default function FeaturedOps() {
  const ops = initiativeBySlug('ops');
  if (!ops || !ops.hero) return null;
  return (
    <section
      aria-labelledby="work-featured"
      className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip"
    >
      <div className="seam shell grid w-full grid-cols-[5fr_7fr] narrow:grid-cols-1">
        <Card radius={30} pad className="flex flex-col justify-between gap-(--space-6) narrow:gap-(--space-5)">
          <InView>
            <Status state="development" className="text-ink-2">
              {ops.status}
            </Status>
          </InView>

          <div className="flex flex-col gap-(--space-4)">
            {/* The flagship headline is the one h2 on the site at display
                size (the brief's ladder); every other h2 is `t-section`. */}
            <Rise as="h2" id="work-featured" lines={[`${ops.name}.`]} className="t-display text-ink" />
            {ops.tagline ? (
              <InView delay={60}>
                <p className="t-lede text-ink">{ops.tagline}</p>
              </InView>
            ) : null}
            <InView delay={120}>
              <p className="t-mono text-ink-3">{OPS_STORY.register}</p>
            </InView>
            <InView delay={180}>
              <p className="t-body max-w-[440px] text-ink-2">{ops.summary}</p>
            </InView>
          </div>

          <InView delay={240} className="flex flex-col gap-(--space-4)">
            <div className="flex flex-wrap gap-(--space-1)">
              {ops.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            {/* The demonstration line on the caption hairline, with the
                link at its end: the screen beside it is a white dashboard,
                where a caption laid over it would not read. */}
            {ops.demo ? (
              <Caption as="div" end={<MonoLink href={`/work/${ops.slug}`} lead="EXPLORE" label={ops.name} />}>
                {ops.demo}
              </Caption>
            ) : (
              <MonoLink href={`/work/${ops.slug}`} lead="EXPLORE" label={ops.name} />
            )}
          </InView>
        </Card>

        {/* The clip reveal: the picture appears from its foot upward while
            it settles from 1.08 (`.settle`), the premium picture entrance.
            The cover's own phone cut below 810. */}
        <InView
          mode="clip"
          className={`${cardClass({ radius: 30 })} relative aspect-[7/5] overflow-clip narrow:order-first narrow:aspect-[7/5] mobile:aspect-[4/3]`}
        >
          <span className="settle absolute inset-0 block">
            <ArtImg
              src={ops.hero}
              srcTall={ops.heroTall}
              media="(max-width: 809.98px)"
              alt={ops.heroAlt}
              sizes="(max-width: 1199px) 100vw, 805px"
              sizesTall="calc(100vw - 44px)"
              className="media-fill"
            />
          </span>
        </InView>
      </div>
    </section>
  );
}
