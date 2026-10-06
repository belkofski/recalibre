import { InView } from '@/lib/motion';
import { Card, SectionHead } from '@/components/ui';
import { PRINCIPLES } from '@/content/home';

/* ============================================================================
   WHY RECALIBRE — the three principles.

   The reference's evidence block was two counters on the left and a
   testimonial slider on the right. It carries operating principles here —
   no quotation marks, no name, no job title, no rating, no date and no
   review label, because there is no client to attribute any of it to.

   THREE CARDS, NO PAGER (the owner's audit, 6 October 2026). From 28
   September 2026 this was one card paged by two arrows, so two of the
   three rules were always out of sight and a reader who did not press
   never learned them. The block answers the buyer's second question — why
   this firm — and an answer behind a pager is an answer withheld. The
   three sit side by side on one seam plate now, each in its own card, and
   the section needs no state: it is a server component, and the only
   script in it is the reveal.

   THE CARD'S OWN VOCABULARY, as every card on the site keeps it: the
   principle's label in mono, its word (`Governance`) at the card size, the
   rule itself at the lede size in full ink and the explanation at body in
   the second tint. The ordinal sits at the label's right in tabular
   figures; it orders the three and counts nothing else.

   A WHITE PANEL (the owner's decision, 26 September 2026): `theme-light
   band-light`, see globals.css, THE WHITE PANELS. The panel sets the
   padding above and below the content; the stages below pad their own top.
   The label is set in the 60% tint, not the 50% the dark cards use: 50% is
   3.8:1 on white, under the small-text minimum, and the panel's own rule
   (28 September 2026) is that text which must pass 4.5:1 takes the 60%.

   No marked word in the heading: the page marks one word, the hero's.
   ========================================================================= */

/** 'GOVERNANCE' → 'Governance': the label's own word, in title case. */
const word = (label: string) => label.charAt(0) + label.slice(1).toLowerCase();

export default function Principles() {
  const P = PRINCIPLES;
  return (
    <section className="theme-light band-light pad-x relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-row)">
        <SectionHead label={P.label} lines={P.headline} lede={P.lede} />

        {/* The cards reveal 0 / 90 / 180ms by column; stacked below 1200
            they are one column and come in one after another the same way,
            which reads as a list filling rather than a block landing. */}
        <ul className="seam-sm grid w-full grid-cols-3 narrow:grid-cols-1">
          {P.items.map((p, i) => (
            <InView as="li" key={p.n} step={i} className="flex">
              <Card radius={24} pad as="article" className="flex w-full flex-col justify-between gap-(--space-row)">
                <div className="flex flex-col gap-(--space-3)">
                  <p className="t-mono flex items-center justify-between gap-(--space-3) text-ink-2">
                    <span>{p.label}</span>
                    <span className="tabular-nums">{p.n}</span>
                  </p>
                  <h3 className="t-card text-ink">{word(p.label)}</h3>
                </div>
                <p className="flex flex-col gap-(--space-2)">
                  <span className="t-lede text-ink">{p.lead}</span>
                  <span className="t-body text-ink-2">{p.rest.trim()}</span>
                </p>
              </Card>
            </InView>
          ))}
        </ul>
      </div>
    </section>
  );
}
