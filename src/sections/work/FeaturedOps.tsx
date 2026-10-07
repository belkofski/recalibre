import { InView, Rise } from '@/lib/motion';
import { Caption, Card, Chip, MonoLink, Status, type GlyphName } from '@/components/ui';
import { initiativeBySlug } from '@/content/work';
import { OPS_STORY } from '@/content/home';
import CaptureCard from './CaptureCard';

/* ============================================================================
   FEATURED OPS — the work index opens with the flagship (the owner's audit:
   OPS leads the work), on a seam plate split 5/7: the words on a surface
   that lights under the pointer, the overview in a device frame on a
   tilting surface beside them (CaptureCard.tsx). Below 1200 the picture
   goes on top, as the case cover stacks.

   Every line is the OPS entry's own (content/work.ts) or the OPS story's
   register line (content/home.ts), whose four words print as four glyph
   chips, each a picture of the thing it names, rather than a mono line
   with dots. The only action is the secondary EXPLORE OPS: the
   calibration button never sits on a work card.
   ========================================================================= */

/** The register's four words, as glyphs: a register, a permit, a crew, a
 *  report. Pictures of the words beside them, not claims. */
const REGISTER_GLYPHS: readonly GlyphName[] = ['register', 'permit', 'crew', 'report'];

export default function FeaturedOps() {
  const ops = initiativeBySlug('ops');
  if (!ops || !ops.hero) return null;
  const register = OPS_STORY.register.split(' · ');
  return (
    <section
      aria-labelledby="work-featured"
      className="pad-x pad-top relative isolate flex w-full flex-col items-center overflow-clip"
    >
      <div className="seam shell grid w-full grid-cols-[5fr_7fr] narrow:grid-cols-1">
        <Card radius={30} pad spot className="flex flex-col justify-between gap-(--space-6) narrow:gap-(--space-5)">
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
              <ul className="flex flex-wrap gap-(--space-1)">
                {register.map((word, i) => (
                  <li key={word}>
                    <Chip glyph={REGISTER_GLYPHS[i]}>{word}</Chip>
                  </li>
                ))}
              </ul>
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

        {/* The capture in its frame, first below 1200. The widths are the
            screen's inside the frame: the 7fr column less the bed's 64px
            each side from 1200 up, the window less the gutters, the seam
            and the bed below 810. */}
        <CaptureCard
          src={ops.hero}
          srcTall={ops.heroTall}
          alt={ops.heroAlt}
          sizes="(max-width: 1199px) 100vw, 760px"
          sizesTall="calc(100vw - 80px)"
          className="narrow:order-first"
        />
      </div>
    </section>
  );
}
