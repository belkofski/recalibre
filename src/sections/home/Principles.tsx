import type { CSSProperties } from 'react';
import { Rise, Scene } from '@/lib/motion';
import { Card, Glyph, Numeral, Orbs, type GlyphName } from '@/components/ui';
import { PRINCIPLES } from '@/content/home';

/* ============================================================================
   THE PRINCIPLES — the three rules, on About only (the third pass gave Home
   the stages and About the principles; this file stays where it was so
   nothing else has to move, and Home no longer imports it).

   Each principle is its title (the label's own word, `Governance`) and its
   rule, the first sentence, and nothing more: the explanation that stood
   under each (still in content/home.ts as `rest`) came off with the
   owner's note on the second pass. So the cards are short: a head row with
   the glyph of the rule on its tile and the outline numeral, in the flow so
   no word ever runs across its strokes, then the title and the rule.

   NOT THREE EQUAL CARDS. The spans follow the rules' lengths, five, four
   and three columns of twelve from 1200 up; on a tablet the first runs
   across and the other two share a row; on a phone they are one column.
   They come in one after another as the block rises (`.sx-stagger`, read
   off the section's Scene); without scripts or with reduced motion they
   simply stand.
   ========================================================================= */

/** 'GOVERNANCE' → 'Governance': the label's own word, in title case. */
const word = (label: string) => label.charAt(0) + label.slice(1).toLowerCase();

/** The glyph of each rule, by its number: governance is a person deciding,
 *  delivery a state, ownership a thing owned. */
const GLYPHS: Record<(typeof PRINCIPLES.items)[number]['n'], GlyphName> = {
  '01': 'decide',
  '02': 'status',
  '03': 'owned',
};

export default function Principles() {
  const P = PRINCIPLES;
  return (
    <Scene
      as="section"
      end={0.8}
      aria-labelledby="principles-head"
      className="pad-x pad-top relative isolate flex w-full flex-col items-center overflow-clip"
    >
      <Orbs variant="section" />
      <div className="shell flex w-full flex-col gap-(--space-row)">
        <Rise as="h2" id="principles-head" lines={P.headline} className="t-section text-ink" />

        {/* The list is its own scene, so the cards stagger in as the list
            rises, not as the heading does. */}
        <Scene as="ul" end={0.55} className="about-principles sx-stagger m-0 w-full list-none p-0">
          {P.items.map((p, i) => (
            <li key={p.n} className="flex" style={{ '--i': i } as CSSProperties}>
              <Card radius={24} pad spot as="article" className="flex w-full flex-col gap-(--space-3)">
                <div className="flex items-start justify-between gap-(--space-3)">
                  <span aria-hidden="true" className="glyph-tile glyph-tile-signal about-principle-tile">
                    <Glyph name={GLYPHS[p.n]} size={24} />
                  </span>
                  <Numeral n={p.n} className="about-flow-numeral about-principle-numeral" />
                </div>
                <h3 className="t-card text-ink">{word(p.label)}</h3>
                <p className="t-lede max-w-[440px] text-ink-2">{p.lead}</p>
              </Card>
            </li>
          ))}
        </Scene>
      </div>
    </Scene>
  );
}
