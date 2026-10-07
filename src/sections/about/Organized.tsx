import { InView } from '@/lib/motion';
import { Card, GlyphTile, MonoLink, Numeral, Orbs, SectionHead, type GlyphName } from '@/components/ui';
import { ABOUT as A } from '@/content/about';
import { CAPABILITIES } from '@/content/home';
import { StagesFlow } from '@/sections/home/Engagement';
import { split } from '@/sections/about/split';

/* ============================================================================
   HOW WE ARE ORGANIZED — where the reference lists its track record.

   Recalibre publishes no client, so the block carries the reason the firm
   is shaped the way it is: the story's second and third paragraphs. The
   first is read in the opener, beside the heading, and is not repeated.

   They were two columns of body copy on black. Now each is an OBJECT: a
   numbered surface card (02, 03, after the opener's first paragraph) with
   a glyph tile for what the paragraph is about (the gaps between three
   suppliers: a system; the firm's own products: a product), the outline
   numeral in its corner, a sheen that sweeps it once as it arrives, and
   the spotlight under the pointer. Inside, the words are a caption to the
   object: the first sentence at lede size in full ink, the rest at body in
   the second tint on a narrow measure. Nothing is cut.

   Under the pair, the three stages as the flow rail the stages block
   draws (sections/home/Engagement.tsx): one drawing on Home and here,
   without Home's drops, since no cards stand under it on this page. The
   chip rows that listed the stages and the disciplines came off: the rail
   is the stages, and the orbit below is the disciplines.

   THE WAY OUT OF THE BLOCK is the label row's link: ALL CAPABILITIES, to
   the capabilities page. No marked word: the page has one, "whole
   program." in its opener.
   ========================================================================= */

/** The two cards' numbers and glyphs, in the paragraphs' order. */
const CARDS: readonly { n: string; glyph: GlyphName }[] = [
  { n: '02', glyph: 'system' },
  { n: '03', glyph: 'product' },
];

export default function Organized() {
  // The link's two words are the content's own label, split for the
  // MonoLink's dimmed lead and lit word.
  const [lead, ...rest] = CAPABILITIES.cta.label.split(' ');
  return (
    <section aria-labelledby="story-head" className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-alone)">
        <SectionHead
          id="story-head"
          label="HOW WE ARE ORGANIZED"
          lines={A.story.heading}
          right={<MonoLink href={CAPABILITIES.cta.href} lead={lead} label={rest.join(' ')} />}
        />

        {/* The light behind the pair reaches past the plate (the plate is
            opaque, and a glow kept inside it would never be seen) and the
            section clips it at the window's edge. */}
        <div className="relative isolate flex w-full flex-col">
          <Orbs variant="section" className="about-org-orbs" />

          <div className="seam-sm grid w-full grid-cols-2 narrow:grid-cols-1">
            {A.story.paragraphs.slice(1).map((p, i) => {
              const card = CARDS[i];
              if (!card) return null;
              const [claim, reason] = split(p);
              return (
                /* The reveal is the grid's child and stretches to the row;
                   the card grows to fill it, so the two stand level on the
                   plate whatever their words take. */
                <InView key={card.n} step={i} className="flex flex-col">
                  <Card
                    radius={24}
                    pad
                    spot
                    as="article"
                    className="about-org-card relative flex min-h-[320px] flex-1 flex-col gap-(--space-4)"
                  >
                    <span aria-hidden="true" className="sheen" />
                    <Numeral n={card.n} className="right-(--card-pad) top-(--card-pad)" />
                    {/* The head band is as tall as the numeral, so the
                        words start under both the tile and the figure. */}
                    <div className="about-org-head">
                      <GlyphTile name={card.glyph} />
                    </div>
                    <div className="relative flex flex-col gap-(--space-3)">
                      <p className="t-lede text-ink">{claim}</p>
                      {reason ? <p className="t-body max-w-[440px] text-ink-2">{reason}</p> : null}
                    </div>
                  </Card>
                </InView>
              );
            })}
          </div>

          <div className="w-full pt-(--space-6)">
            <StagesFlow drops={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
