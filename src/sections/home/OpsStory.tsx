import type { CSSProperties } from 'react';
import { ArtImg } from '@/lib/Img';
import { InView, Ordinal, Rise, Scene, ScrollStory, Spotlight, Stack, Tilt } from '@/lib/motion';
import { Card, Frame, GlyphTile, MonoLink, Numeral, Orbs, Status, cardClass, type GlyphName } from '@/components/ui';
import { OPS_STORY, WORK } from '@/content/home';
import { IMAGE_SIZE } from '@/lib/images.generated';
import OpsProgress from './OpsProgress';

/* ============================================================================
   SELECTED WORK — OPS, the flagship.

   The block opens with its heading alone, then one card: the product's
   status, its name at display size and its tagline, and the story of four
   chapters, each one line beside the screen that shows it. Nothing on the
   screens is a client's; the card says so once, at its foot
   ("Demonstration data."), not under every screen. The four chips that
   repeated the chapter titles under the tagline came off in the third
   pass, with the per-screen captions.

   THE STAGE, from 1200 up. The four captures sit in one device frame on a
   lit surface at the right, pinned while the chapters scroll past at the
   left; the chapter being read lifts its numeral's stroke and its tile's
   edge into the signal blue, and the tick rule under the chapters lights
   to its place (OpsProgress). WITH THE SCROLL: the frame grows into place
   as the stage comes up (`.sx-grow`), each chapter's words come in one
   after another as it rises (`.sx-stagger`), and its outline numeral
   drifts against the scroll (`.sx-drift`). The column is the sticky
   thing, never the tilting card, and the grow is its own box between.

   THE STACK, below 1200. The four chapters are four surface cards that
   slide over one another as the reader scrolls (`Stack`), each with its
   own screen in a bare frame at the file's own shape (read off the
   manifest; held under 46svh so the next card's edge shows), the screen
   settling inside its frame as the card comes up (`.sx-zoom`).

   ONE FRAME CANNOT TAKE FOUR SHAPES, so on the stage each capture is shown
   whole and centred, the even bands beside or under it in the bezel's grey
   (home-story.css, `.ops-capture`, `.ops-screen`).
   ========================================================================= */

/** 'EXPLORE OPS' as the two-tone link: first word dimmed, the rest lit. */
function split(label: string): { lead: string | undefined; label: string } {
  const [lead, ...rest] = label.split(' ');
  return rest.length ? { lead, label: rest.join(' ') } : { lead: undefined, label };
}

/** One glyph per chapter, by its number: the register of jobs, the
 *  permit, no signal, the report. */
const CHAPTER_GLYPHS: Record<(typeof OPS_STORY.chapters)[number]['n'], GlyphName> = {
  '01': 'register',
  '02': 'permit',
  '03': 'signal-off',
  '04': 'report',
};

/** A chapter's first sentence: the stage prints one line per screen. */
const firstSentence = (s: string) => {
  const m = s.match(/^.*?[.!?](?=\s|$)/);
  return m ? m[0] : s;
};

/** The block's one honesty line, the words the OPS card already carries. */
const DEMO = WORK.items.find((item) => item.slug === WORK.featured)?.demo;

export default function OpsStory() {
  const S = OPS_STORY;
  const count = S.chapters.length;
  const cta = split(S.cta.label);

  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-row)">
        <Rise as="h2" lines={WORK.headline} className="t-section text-ink" />

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
            {/* The one ambient light of the block, behind the card's ground:
                the card preset's two orbs with a third between them, because
                the plate runs some 3000px tall on a phone and two lights at
                22% and 88% left the middle chapters dark. Still one set. */}
            <Orbs
              orbs={[
                { x: '18%', y: '12%', size: 440, color: 'deep', a: 0.22 },
                { x: '90%', y: '50%', size: 420, color: 'glow', a: 0.11, delay: -7, dur: 26 },
                { x: '14%', y: '88%', size: 380, color: 'deep', a: 0.18, delay: -13, dur: 30 },
              ]}
            />

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
            </header>

            {/* ── the stage, from 1200 up ───────────────────────────── */}
            {/* The stage is a scene: its frame grows into place as the stage
                comes up (`.sx-grow`, on its own box inside the sticky
                column), and each chapter is a scene of its own whose words
                come in one after another as it rises (`.sx-stagger`) while
                its outline numeral drifts against the scroll. */}
            <Scene end={0.5} className="w-full narrow:hidden">
            <ScrollStory className="ops-stage grid w-full grid-cols-[5fr_7fr] items-start gap-x-(--space-6)">
              <div className="flex w-full flex-col">
                <ol className="flex flex-col">
                  {S.chapters.map((ch, i) => (
                    <Scene
                      as="li"
                      key={ch.n}
                      end={0.6}
                      data-step=""
                      data-on={i === 0 ? '' : undefined}
                      className="ops-chapter relative flex min-h-[60vh] flex-col justify-center"
                    >
                      {/* The outline numeral, behind and above the words;
                          its stroke lifts into the signal blue while the
                          chapter is the one being read. */}
                      <Numeral n={ch.n} className="ops-numeral sx-drift -left-[8px] -top-[24px]" />
                      {/* The dim is the box; the stagger moves its children,
                          so the two never set the same property on one
                          element. */}
                      <div className="story-dim sx-stagger flex flex-col gap-(--space-3)">
                        <GlyphTile name={CHAPTER_GLYPHS[ch.n]} />
                        <Ordinal n={ch.n} className="t-mono-11 text-ink-3" />
                        <h3 className="t-card text-ink">{ch.title}</h3>
                        <p className="t-body max-w-[440px] text-ink-2">{firstSentence(ch.body)}</p>
                      </div>
                    </Scene>
                  ))}
                </ol>
                <OpsProgress count={count} className="pt-(--space-5)" />
              </div>

              {/* The pinned column. The sticky is the column's; the card
                  inside it tilts, so the two never share an element. */}
              <div className="story-pin w-full">
                <div className="sx-grow">
                <Spotlight>
                  <Tilt max={3}>
                    <div className={`${cardClass({ radius: 24, spot: true, tilt: true })} p-(--space-4)`}>
                      <span aria-hidden="true" className="spot-light" />
                      {/* The dotted bed, a child: the surface's own
                          background-image would override a grid drawn on
                          the card itself. */}
                      <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />
                      <Orbs variant="card" />
                      {/* A `div`, not a `span`: the frame is a block. */}
                      <div className="tilt-layer relative">
                        <Frame screenClassName="story-visual ops-screen">
                          {S.chapters.map((ch, i) => (
                            <figure key={ch.n} data-layer="" data-on={i === 0 ? '' : undefined} className="story-layer">
                              <ArtImg
                                src={ch.src}
                                alt={ch.alt}
                                sizes="(min-width: 1200px) 690px, 100vw"
                                lazy
                                className="media-fill ops-capture"
                              />
                            </figure>
                          ))}
                        </Frame>
                      </div>
                    </div>
                  </Tilt>
                </Spotlight>
                </div>
              </div>
            </ScrollStory>
            </Scene>

            {/* ── the stack, below 1200 ─────────────────────────────── */}
            <Stack className="ops-stack hidden narrow:flex">
              {S.chapters.map((ch) => {
                const wide = IMAGE_SIZE[ch.src];
                const tall = IMAGE_SIZE[ch.srcTall];
                const box = {
                  '--ar': `${wide.w} / ${wide.h}`,
                  '--ar-tall': `${tall.w} / ${tall.h}`,
                } as CSSProperties;
                return (
                  <Card
                    key={ch.n}
                    radius={24}
                    spot
                    as="article"
                    data-stack-card=""
                    className="stack-card flex flex-col gap-(--space-3) p-(--card-pad)"
                    style={box}
                  >
                    <Numeral n={ch.n} className="ops-numeral-sm right-(--card-pad) top-(--card-pad)" />
                    <div className="flex items-center gap-(--space-3)">
                      <GlyphTile name={CHAPTER_GLYPHS[ch.n]} sm />
                      <Ordinal n={ch.n} className="t-mono-11 text-ink-3" />
                    </div>
                    <h3 className="t-card text-ink">{ch.title}</h3>
                    <p className="t-body max-w-[440px] text-ink-2">{firstSentence(ch.body)}</p>
                    {/* The screen settles inside its frame as the card comes
                        up (`.sx-zoom`, on its own box inside the reveal's
                        settle layer). */}
                    <InView mode="picture" className="pt-(--space-2)">
                      <Scene as="figure" end={0.7} className="ops-stack-figure">
                        <Frame bare screenClassName="ops-stack-screen">
                          <span className="settle absolute inset-0 block">
                            <span className="sx-zoom absolute inset-0 block">
                              <ArtImg
                                src={ch.src}
                                srcTall={ch.srcTall}
                                media="(max-width: 809.98px)"
                                alt={ch.alt}
                                sizes="100vw"
                                sizesTall="100vw"
                                lazy
                                className="media-fill ops-capture"
                              />
                            </span>
                          </span>
                        </Frame>
                      </Scene>
                    </InView>
                  </Card>
                );
              })}
            </Stack>

            {/* ── the foot ──────────────────────────────────────────── */}
            <InView
              as="footer"
              className="flex flex-wrap items-center justify-between gap-(--space-3) border-t border-rule pt-(--space-4)"
            >
              <MonoLink href={S.cta.href} lead={cta.lead} label={cta.label} />
              {DEMO ? <p className="t-mono text-ink-3">{DEMO}</p> : null}
            </InView>
          </Card>
        </InView>
      </div>
    </section>
  );
}
