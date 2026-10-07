import { InView, Ordinal } from '@/lib/motion';
import { Card, Glyph, Numeral, Orbs, SectionHead, type GlyphName } from '@/components/ui';
import { PRINCIPLES } from '@/content/home';

/* ============================================================================
   WHY RECALIBRE — the three principles.

   The reference's evidence block was two counters on the left and a
   testimonial slider on the right. It carries operating principles here —
   no quotation marks, no name, no job title, no rating, no date and no
   review label, because there is no client to attribute any of it to.

   THREE CARDS, NO PAGER. An answer behind a pager is an answer withheld:
   the three sit side by side on one seam plate, each in its own card, and
   the section needs no state: it is a server component, and the only
   scripts in it are the reveal and the spotlight.

   DARK, AS OBJECTS (the direction change; this was a white panel). Each
   principle is a lit surface with a large glyph of its rule in the signal
   blue on a 64px tile — a person deciding, a state, a thing owned — its
   outline numeral behind the corner, a sheen that sweeps it once as it
   arrives, and the spotlight under the pointer. On a phone it lights as it
   passes the centre of the screen. The words keep the card's own
   vocabulary: the principle's label in mono with its small ordinal, its
   word (`Governance`) at the card size, the rule itself at the lede size
   in full ink and the explanation at body in the second tint, in a
   narrower measure. The ordinal orders the three and counts nothing else.

   No marked word in the heading: the page marks one word, the hero's.
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
    <section className="pad-x pad-top relative isolate flex w-full flex-col items-center overflow-clip">
      <Orbs variant="section" />
      <div className="shell flex w-full flex-col gap-(--space-row)">
        <SectionHead label={P.label} lines={P.headline} lede={P.lede} />

        {/* The cards reveal 0 / 90 / 180ms by column; stacked below 1200
            they are one column and come in one after another the same way,
            which reads as a list filling rather than a block landing. The
            list item wraps its own card, so the list stays a list. */}
        <ul className="seam-sm grid w-full grid-cols-3 narrow:grid-cols-1">
          {P.items.map((p, i) => (
            <InView as="li" key={p.n} step={i} className="flex narrow:[--in-delay:0ms]!">
              <Card
                radius={24}
                pad
                spot
                as="article"
                className="relative flex min-h-[420px] w-full flex-col justify-between gap-(--space-row) narrow:min-h-0"
              >
                <span aria-hidden="true" className="sheen" />
                <Numeral n={p.n} className="right-(--card-pad) top-(--card-pad)" />
                <div className="flex flex-col gap-(--space-4)">
                  <div className="flex items-center justify-between gap-(--space-3)">
                    <span aria-hidden="true" className="glyph-tile glyph-tile-signal principle-tile">
                      <Glyph name={GLYPHS[p.n]} size={32} />
                    </span>
                    <p className="t-mono flex items-center gap-(--space-3) text-ink-3">
                      <span>{p.label}</span>
                      <Ordinal n={p.n} className="t-mono-11 text-ink-3" />
                    </p>
                  </div>
                  <h3 className="t-card text-ink">{word(p.label)}</h3>
                </div>
                <p className="flex flex-col gap-(--space-2)">
                  <span className="t-lede text-ink">{p.lead}</span>
                  <span className="t-body max-w-[440px] text-ink-2">{p.rest.trim()}</span>
                </p>
              </Card>
            </InView>
          ))}
        </ul>
      </div>
    </section>
  );
}
