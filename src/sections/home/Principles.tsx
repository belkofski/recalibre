'use client';

import { useState } from 'react';
import { Rise, InView } from '@/lib/motion';
import { LabelRow, Glyph } from '@/components/ui';
import { PRINCIPLES } from '@/content/home';

/* ============================================================================
   HOW WE OPERATE.

   The reference's evidence block was two counters on the left and a
   testimonial slider on the right. It carries operating principles here —
   no quotation marks, no name, no job title, no rating, no date and no
   review label, because there is no client to attribute any of it to.

   ONE OBJECT (Phase B, 28 September 2026). The two pillar words and their
   column are gone, with the grey label slab, the ghost numeral and the
   slide dots. What is left is one card: the principle's label, its word at
   display size, the rule itself, and a pager of two arrows and a count.
   The three principles are stacked in one grid cell and only the current
   one is visible, so the tallest sets the card's height and nothing moves
   when the reader pages.

   The label row runs the full width; under it the head sits in the left
   column and the card in the right, both starting on the same row (28
   September 2026: the card used to start under the head, and the half
   beside the head stood empty at 1200 and up).

   A WHITE PANEL (the owner's decision, 26 September 2026): `theme-light
   band-light`, see globals.css, THE WHITE PANELS. The panel sets the
   padding above and below the content; the stages below pad their own top.
   The round controls take their colours on white from THE KIT ON WHITE in
   the same file.
   ========================================================================= */

/** 'GOVERNANCE' → 'Governance': the label's own word, in title case. */
const word = (label: string) => label.charAt(0) + label.slice(1).toLowerCase();

export default function Principles() {
  const P = PRINCIPLES;
  const [i, setI] = useState(0);
  const item = P.items[i] ?? P.items[0];
  const total = String(P.items.length).padStart(2, '0');
  const go = (d: number) => setI((v) => (v + d + P.items.length) % P.items.length);

  return (
    <section className="theme-light band-light pad-x relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-label)">
        <LabelRow label={P.label} />

        <div className="grid w-full grid-cols-2 items-start gap-x-[40px] narrow:grid-cols-1 narrow:gap-y-(--space-row)">
          <div className="flex w-full flex-col gap-(--space-lede)">
            <Rise as="h2" lines={P.headline} className="t-display text-ink" mark={P.mark} />
            <InView>
              <p className="t-body max-w-[280px] text-ink-2">{P.lede}</p>
            </InView>
          </div>

          <InView className="seam-sm w-full">
            <div className="card-24 flex flex-col gap-(--space-row) p-(--card-pad)">
              <div className="grid [&>*]:[grid-area:1/1]">
                {P.items.map((p, n) => (
                  <div
                    key={p.n}
                    aria-current={n === i ? 'true' : undefined}
                    className={`flex flex-col ${n === i ? '' : 'invisible'}`}
                  >
                    <span className="t-mono text-ink-3">{p.label}</span>
                    <h3 className="t-display mt-[16px] text-ink">{word(p.label)}</h3>
                    <p className="t-lede mt-(--space-lede) text-ink">
                      {p.lead}
                      <span className="text-ink-2">{p.rest}</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                {/* Announced politely on every change, as the capability
                    cards' count is. */}
                <p className="t-mono-11 tabular-nums text-ink-2" aria-live="polite" aria-atomic="true">
                  {item.n} / {total}
                  <span className="sr-only"> {word(item.label)}</span>
                </p>
                <span className="-mr-[10px] flex items-center">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous principle"
                    className="focus-ring flex size-[44px] items-center justify-center"
                  >
                    <span className="dot-btn rotate-180">
                      <Glyph />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next principle"
                    className="focus-ring flex size-[44px] items-center justify-center"
                  >
                    <span className="dot-btn">
                      <Glyph />
                    </span>
                  </button>
                </span>
              </div>
            </div>
          </InView>
        </div>
      </div>
    </section>
  );
}
