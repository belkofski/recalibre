import type { CSSProperties } from 'react';
import { Rise, Scene } from '@/lib/motion';
import { Card, GlyphTile, MonoLink, Numeral, Orbs, type GlyphName } from '@/components/ui';
import { ABOUT as A } from '@/content/about';
import { CAPABILITIES } from '@/content/home';
import { split } from '@/sections/about/split';

/* ============================================================================
   HOW WE ARE ORGANIZED — where the reference lists its track record.

   Recalibre publishes no client, so the block carries the reason the firm
   is shaped the way it is: the heading, the story's first sentence under
   it (the one claim the rest of the page draws: the orbit is that sentence,
   drawn), and the two reasons as two cards, each the first sentence of its
   paragraph and nothing more (the owner's note on the second pass: cut the
   words). The rest of each paragraph is still in content/about.ts, unread
   here.

   THE CARDS ARE NOT A PAIR OF EQUAL SQUARES. The longer reason takes seven
   columns and the shorter five, and they come in from opposite sides as
   the block rises into the window (`.sx-from-left`, `.sx-from-right`, read
   off the block's Scene). The numeral stands in the card's head row beside
   the glyph tile, so it never runs under a word.

   THE WAY OUT OF THE BLOCK is ALL CAPABILITIES, to the capabilities page.
   ========================================================================= */

/** The two cards' numbers, glyphs and entrances, in the paragraphs' order. */
const CARDS: readonly {
  n: string;
  glyph: GlyphName;
  enter: string;
  span: string;
}[] = [
  { n: '02', glyph: 'system', enter: 'sx-from-left', span: 'about-org-wide' },
  {
    n: '03',
    glyph: 'product',
    enter: 'sx-from-right',
    span: 'about-org-narrow',
  },
];

export default function Organized() {
  const [lead, ...rest] = CAPABILITIES.cta.label.split(' ');
  const [claim] = split(A.story.paragraphs[0]);
  return (
    <Scene
      as="section"
      end={0.7}
      aria-labelledby="story-head"
      className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip"
    >
      <div className="shell flex w-full flex-col gap-(--space-row)">
        <div className="grid w-full grid-cols-2 items-end gap-x-[40px] gap-y-(--space-lede) narrow:grid-cols-1">
          <Rise as="h2" id="story-head" lines={A.story.heading} className="t-section text-ink" />
          <div className="flex flex-col items-start gap-(--space-4)">
            <p className="t-lede max-w-[520px] text-ink-2">{claim}</p>
            <MonoLink href={CAPABILITIES.cta.href} lead={lead} label={rest.join(' ')} />
          </div>
        </div>

        <div className="relative isolate w-full">
          <Orbs variant="section" className="about-org-orbs" />
          {/* The pair is a scene of its own, so the cards come in as THEY
              rise into the window rather than as the heading does. */}
          <Scene end={0.55} className="about-org-grid">
            {A.story.paragraphs.slice(1).map((p, i) => {
              const card = CARDS[i];
              if (!card) return null;
              const [first] = split(p);
              return (
                <div key={card.n} className={`${card.enter} ${card.span} flex`} style={{ '--i': i } as CSSProperties}>
                  <Card radius={24} pad spot as="article" className="about-org-card flex w-full flex-col gap-(--space-4)">
                    <div className="flex items-start justify-between gap-(--space-3)">
                      <GlyphTile name={card.glyph} />
                      <Numeral n={card.n} className="about-flow-numeral about-org-numeral" />
                    </div>
                    <p className="t-lede text-ink">{first}</p>
                  </Card>
                </div>
              );
            })}
          </Scene>
        </div>
      </div>
    </Scene>
  );
}
