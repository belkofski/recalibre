import type { CSSProperties } from 'react';
import { ArtImg } from '@/lib/Img';
import { InView, Ordinal, Rise, ScrollStory, Spotlight, Stack, Tilt } from '@/lib/motion';
import {
  Caption,
  Card,
  Chip,
  Frame,
  GlyphTile,
  MonoLink,
  Numeral,
  Orbs,
  SectionHead,
  Status,
  cardClass,
  type GlyphName,
} from '@/components/ui';
import { OPS_STORY, WORK } from '@/content/home';
import { IMAGE_SIZE } from '@/lib/images.generated';
import OpsProgress from './OpsProgress';
import OpsCaption from './OpsCaption';

/* ============================================================================
   SELECTED WORK — OPS, the flagship.

   OPS is the hero case study, and the page shows the actual product: one
   card on one plate, headed as the product and then read as a story of
   four chapters, each the OPS page's own line about what a site gets,
   beside the screen that shows it. Nothing on the screens is claimed to
   be a client's: every one carries demonstration data, and the card says
   so twice, in each screen's caption and in the note at the foot.

   THE HEAD IS NOT PINNED. The product's name at display size, its tagline
   and its register are read once at the top; what follows the reader is
   the picture. The name is the one h2 on the site allowed display size
   (the brief; see SectionHead), and the chapters are its h3s, which puts
   OPS and the three initiatives in the row under it on one level of the
   outline. The register's four words are four glyph chips, each a
   picture of the thing it names, rather than a mono line with dots.

   THE STAGE, from 1200 up (the direction change). The four captures sit
   in one device frame on a lit surface at the right: a dotted bed, the
   ambient light behind it, a spotlight under the pointer, and the whole
   card leaning 3° toward it while the frame inside leans the other way.
   The column is the sticky thing, never the tilting card. At the left the
   chapters scroll past, each with its glyph tile, its small ordinal
   rolling in and its outline numeral behind, and the one being read lifts
   its numeral's stroke and its tile's edge into the signal blue. Under the
   frame the capture's own caption follows the chapter (OpsCaption.tsx),
   and under the chapters the tick rule lights to its place (OpsProgress).

   THE STACK, below 1200. Nothing pins beside the words; the four chapters
   are four surface cards that slide over one another as the reader
   scrolls (`Stack`, lib/motion.tsx), each with its tile, its ordinal, its
   numeral, its words and its own screen in a bare frame, at the file's
   own shape, read off the manifest as the case galleries do: the captures
   are of three shapes, and a 16:10 frame cut the signature block off the
   4:3 daily report, the chapter about signatures. Below 810 the phone
   cut's shape is read the same way. The screen is held under 46svh so the
   next card's top edge shows under the current one. Covered cards shrink
   and dim; the centred card lights. Under reduced motion they only stick;
   without scripts they are a plain column.

   ONE FRAME CANNOT TAKE FOUR SHAPES, so on the stage each capture is shown
   whole, anchored to the frame's top-left corner as a window's content is,
   on the frame's own ground (home-story.css, `.ops-capture`).
   ========================================================================= */

/** 'EXPLORE OPS' as the two-tone link: first word dimmed, the rest lit. */
function split(label: string): { lead: string | undefined; label: string } {
  const [lead, ...rest] = label.split(' ');
  return rest.length ? { lead, label: rest.join(' ') } : { lead: undefined, label };
}

/** The register's four words, as glyphs: a register, a permit, a crew, a
 *  report. Pictures of the words beside them, not claims. */
const REGISTER_GLYPHS: readonly GlyphName[] = ['register', 'permit', 'crew', 'report'];

/** One glyph per chapter, by its number: the register of jobs, the
 *  permit, no signal, the report. */
const CHAPTER_GLYPHS: Record<(typeof OPS_STORY.chapters)[number]['n'], GlyphName> = {
  '01': 'register',
  '02': 'permit',
  '03': 'signal-off',
  '04': 'report',
};

export default function OpsStory() {
  const S = OPS_STORY;
  const count = S.chapters.length;
  const cta = split(S.cta.label);
  const register = S.register.split(' · ');

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
            {/* The one ambient light of the block, behind the card's ground. */}
            <Orbs variant="card" />

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
                <ul className="flex flex-wrap gap-(--space-1)">
                  {register.map((word, i) => (
                    <li key={word}>
                      <Chip glyph={REGISTER_GLYPHS[i]}>{word}</Chip>
                    </li>
                  ))}
                </ul>
              </InView>
            </header>

            {/* ── the stage, from 1200 up ───────────────────────────── */}
            <ScrollStory className="ops-stage grid w-full grid-cols-[5fr_7fr] items-start gap-x-(--space-6) narrow:hidden">
              <div className="flex w-full flex-col">
                <ol className="flex flex-col">
                  {S.chapters.map((ch, i) => (
                    <li
                      key={ch.n}
                      data-step=""
                      data-on={i === 0 ? '' : undefined}
                      className="relative flex min-h-[60vh] flex-col justify-center"
                    >
                      {/* The outline numeral, behind and above the words;
                          its stroke lifts into the signal blue while the
                          chapter is the one being read. */}
                      <Numeral n={ch.n} className="ops-numeral -left-[8px] -top-[24px]" />
                      {/* The dim is on its own box inside the reveal: the
                          two both move opacity, and on one element the
                          story's rule would replace the reveal's transition. */}
                      <InView>
                        <div className="story-dim flex flex-col gap-(--space-3)">
                          <GlyphTile name={CHAPTER_GLYPHS[ch.n]} />
                          <Ordinal n={ch.n} className="t-mono-11 text-ink-3" />
                          <h3 className="t-card text-ink">{ch.title}</h3>
                          <p className="t-body max-w-[440px] text-ink-2">{ch.body}</p>
                        </div>
                      </InView>
                    </li>
                  ))}
                </ol>
                <OpsProgress count={count} className="pt-(--space-5)" />
              </div>

              {/* The pinned column. The sticky is the column's; the card
                  inside it tilts, so the two never share an element. */}
              <div className="story-pin w-full">
                <Spotlight>
                  <Tilt max={3}>
                    <div className={`${cardClass({ radius: 24, spot: true, tilt: true })} p-(--space-4)`}>
                      <span aria-hidden="true" className="spot-light" />
                      {/* The dotted bed, a child: the surface's own
                          background-image would override a grid drawn on
                          the card itself. */}
                      <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />
                      <Orbs variant="card" />
                      <span className="tilt-layer relative block">
                        <Frame screenClassName="story-visual ops-screen">
                          {S.chapters.map((ch, i) => (
                            <figure key={ch.n} data-layer="" data-on={i === 0 ? '' : undefined} className="story-layer">
                              <ArtImg
                                src={ch.src}
                                alt={ch.alt}
                                sizes="(min-width: 1200px) 58vw, 100vw"
                                lazy
                                className="media-fill ops-capture"
                              />
                            </figure>
                          ))}
                        </Frame>
                      </span>
                      <OpsCaption chapters={S.chapters} className="mt-(--space-3)" />
                    </div>
                  </Tilt>
                </Spotlight>
              </div>
            </ScrollStory>

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
                    <p className="t-body max-w-[440px] text-ink-2">{ch.body}</p>
                    <InView mode="picture" className="pt-(--space-2)">
                      <figure className="ops-stack-figure flex flex-col gap-(--space-2)">
                        <Frame bare screenClassName="ops-stack-screen">
                          <span className="settle absolute inset-0 block">
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
                        </Frame>
                        <Caption as="figcaption">{ch.caption}</Caption>
                      </figure>
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
              <p className="t-caption text-ink-3">{S.note}</p>
            </InView>
          </Card>
        </InView>
      </div>
    </section>
  );
}
