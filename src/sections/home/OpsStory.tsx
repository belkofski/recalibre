import type { CSSProperties } from 'react';
import { ArtImg } from '@/lib/Img';
import { InView, Rise, ScrollStory } from '@/lib/motion';
import { Caption, Card, MonoLink, SectionHead, Status } from '@/components/ui';
import { OPS_STORY, WORK } from '@/content/home';
import { IMAGE_SIZE } from '@/lib/images.generated';
import OpsProgress from './OpsProgress';

/* ============================================================================
   SELECTED WORK — OPS, the flagship.

   The owner's audit: OPS should be the hero case study, and the page should
   show the actual product. The block of four cards (Spotlight) is gone;
   this is one card on one plate, headed as the product and then read as a
   story: four chapters at the left, each the OPS page's own line about
   what a site gets, and at the right the screen that shows it, pinned
   under the bar and crossfading as the reader moves from one chapter to
   the next. Nothing on the screens is claimed to be a client's: every one
   carries demonstration data, and the card says so twice, in each screen's
   caption and in the note at the foot.

   THE HEAD IS NOT PINNED. The product's name at display size, its tagline
   and its register are read once at the top; what follows the reader is
   the picture. The name is the one h2 on the site allowed display size
   (the brief; see SectionHead), and the chapters are its h3s, which puts
   OPS and the three initiatives in the row under it on one level of the
   outline.

   BELOW 1200 NOTHING PINS. Each chapter prints its own screen under its
   words, revealed from the foot up as it arrives; the pinned column is not
   drawn. The box takes the file's own shape, read off the manifest as the
   case galleries do (sections/work/Shot.tsx): the captures are of three
   shapes, and a 16:10 frame cut the signature block off the 4:3 daily
   report, the chapter about signatures. Below 810 the phone cut's shape is
   read the same way.

   THE ONE PICTURE BOX in the pinned column follows 16:10, the shape most
   of the laptop captures are near, held under the window's height so the
   caption on its foot is always on screen with it. One box cannot take
   four shapes, so there each capture is drawn whole on the card's ground
   (home-story.css) rather than cropped to the frame.
   ========================================================================= */

/** 'EXPLORE OPS' as the two-tone link: first word dimmed, the rest lit. */
function split(label: string): { lead: string | undefined; label: string } {
  const [lead, ...rest] = label.split(' ');
  return rest.length ? { lead, label: rest.join(' ') } : { lead: undefined, label };
}

export default function OpsStory() {
  const S = OPS_STORY;
  const count = S.chapters.length;
  const cta = split(S.cta.label);

  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-row)">
        <SectionHead label="SELECTED WORK" lines={WORK.headline} lede={WORK.lede} />

        {/* The plate scales in from 0.96 with the card; the words inside it
            come in on their own, after. */}
        <InView mode="scale" className="seam w-full">
          <Card
            radius={30}
            pad
            as="article"
            aria-labelledby="ops-story-title"
            className="flex w-full flex-col gap-(--space-7) narrow:gap-(--space-6)"
          >
            {/* ── the head ──────────────────────────────────────────── */}
            <header className="flex flex-col gap-(--space-4)">
              <InView>
                <Status state="development" className="text-ink-2">
                  {S.label}
                </Status>
              </InView>
              <div className="flex flex-col gap-(--space-3)">
                <Rise as="h2" id="ops-story-title" lines={S.headline} className="t-display text-ink" />
                <InView delay={120}>
                  <p className="t-lede max-w-[560px] text-ink">{S.tagline}</p>
                </InView>
              </div>
              <InView delay={200}>
                <p className="t-mono text-ink-3">{S.register}</p>
              </InView>
            </header>

            {/* ── the story ─────────────────────────────────────────── */}
            <ScrollStory className="grid w-full grid-cols-[5fr_7fr] items-start gap-x-(--space-6) narrow:grid-cols-1 narrow:gap-y-(--space-6)">
              <div className="flex w-full flex-col">
                <ol className="flex flex-col narrow:gap-(--space-7)">
                  {S.chapters.map((ch, i) => {
                    const wide = IMAGE_SIZE[ch.src];
                    const tall = IMAGE_SIZE[ch.srcTall];
                    const box = {
                      '--ar': `${wide.w} / ${wide.h}`,
                      '--ar-tall': `${tall.w} / ${tall.h}`,
                    } as CSSProperties;
                    return (
                      <li
                        key={ch.n}
                        data-step=""
                        data-on={i === 0 ? '' : undefined}
                        className="ops-chapter flex min-h-[60vh] flex-col justify-center gap-(--space-5) narrow:min-h-0 narrow:gap-(--space-4)"
                      >
                        {/* The dim is on its own box inside the reveal: the two
                            both move opacity, and on one element the story's
                            rule would replace the reveal's transition. */}
                        <InView>
                          <div className="story-dim flex flex-col gap-(--space-3)">
                            <span className="t-mono-11 tabular-nums text-ink-3">{ch.n}</span>
                            <h3 className="t-card text-ink">{ch.title}</h3>
                            <p className="t-body max-w-[460px] text-ink-2">{ch.body}</p>
                          </div>
                        </InView>

                        {/* The chapter's own screen, below 1200 only. */}
                        <InView mode="clip" className="hidden narrow:block">
                          <figure className="flex flex-col gap-(--space-2)">
                            <Card
                              radius={24}
                              className="relative w-full overflow-clip [aspect-ratio:var(--ar)] mobile:[aspect-ratio:var(--ar-tall)]"
                              style={box}
                            >
                              <div className="settle absolute inset-0">
                                <ArtImg
                                  src={ch.src}
                                  srcTall={ch.srcTall}
                                  media="(max-width: 809.98px)"
                                  alt={ch.alt}
                                  sizes="100vw"
                                  sizesTall="100vw"
                                  lazy
                                  className="media-fill object-left-top"
                                />
                              </div>
                            </Card>
                            <Caption as="figcaption">{ch.caption}</Caption>
                          </figure>
                        </InView>
                      </li>
                    );
                  })}
                </ol>
                <OpsProgress count={count} className="pt-(--space-5) narrow:pt-(--space-6)" />
              </div>

              {/* The pinned column, from 1200 up. Each layer is the screen
                  and its caption together, so the caption changes with the
                  screen it describes. */}
              <div className="story-pin w-full narrow:hidden">
                <div className="story-visual ops-visual w-full">
                  {S.chapters.map((ch, i) => (
                    <figure
                      key={ch.n}
                      data-layer=""
                      data-on={i === 0 ? '' : undefined}
                      className="story-layer flex flex-col gap-(--space-2)"
                    >
                      <Card radius={24} className="relative min-h-0 flex-1 overflow-clip">
                        <ArtImg
                          src={ch.src}
                          alt={ch.alt}
                          sizes="(min-width: 1200px) 58vw, 100vw"
                          lazy
                          className="media-fill object-left-top"
                        />
                      </Card>
                      <Caption as="figcaption">{ch.caption}</Caption>
                    </figure>
                  ))}
                </div>
              </div>
            </ScrollStory>

            {/* ── the foot ──────────────────────────────────────────── */}
            <InView
              as="footer"
              className="flex flex-wrap items-center justify-between gap-(--space-3) border-t border-rule pt-(--space-4)"
            >
              <MonoLink href={S.cta.href} lead={cta.lead} label={cta.label} />
              <p className="t-caption text-ink-3">{S.note}</p>
            </InView>
          </Card>
        </InView>
      </div>
    </section>
  );
}
