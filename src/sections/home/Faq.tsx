'use client';

import { useState } from 'react';
import { Rise, InView } from '@/lib/motion';
import { LabelRow, Tick, Btn } from '@/components/ui';
import { FAQ } from '@/content/home';

/* ============================================================================
   THE FAQ.

   The reference's accordion: a 690px column centred on the page, each row
   a card with a separate square toggle 2px to its right on the same seam
   plate at radius 13. The chevron is the accent blue, the answer expands in place, and
   the block closes with a centred sub-question and a button.

   THE HOMEPAGE DRAWS IT SHORTER (`compact`, the owner's decision of 26
   September 2026): two columns, the heading and the closing question with
   its button on the left, the same 690px accordion on the right, so the
   block no longer ends in a second, centred block of its own. From a tablet
   down the columns stack: heading, questions, then the closing question.
   The other pages keep the centred form.
   ========================================================================= */

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 8"
      aria-hidden="true"
      className={`size-[12px] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none"
    >
      <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Questions() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="seam-sm flex flex-col !rounded-[13px]">
      {FAQ.items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="flex gap-[2px]">
            <div className="card-24 flex flex-1 flex-col !rounded-[11px] px-[24px] pb-[22px] mobile:px-[16px]">
              <h3 className="flex">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="focus-ring t-question flex min-h-[66px] w-full items-center text-left text-ink"
                >
                  {item.q}
                </button>
              </h3>
              <div
                id={`faq-${i}`}
                className="grid transition-[grid-template-rows] duration-[450ms]"
                style={{
                  gridTemplateRows: isOpen ? '1fr' : '0fr',
                  transitionTimingFunction: 'var(--ease-panel)',
                }}
              >
                {/* `inert` as well as the height collapse. The grid
                    row going to 0fr hides the answer from a reader
                    looking at the page and from nobody else: the text
                    stayed in the accessibility tree, so a screen
                    reader announced all six answers at once under a
                    control that said they were collapsed. */}
                <div className="overflow-hidden" inert={!isOpen}>
                  <p className="t-small pt-[14px] text-ink-2">{item.a}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => setOpen(isOpen ? null : i)}
              className="card-24 flex w-[68px] flex-none items-center justify-center !rounded-[11px] text-accent-bright transition-colors duration-300 hover:bg-white/[0.03] mobile:w-[52px]"
            >
              <Chevron open={isOpen} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* `ctaHref`: where "Start a calibration" goes. Everywhere it goes to the contact
   page. On the contact page itself that was the page the reader was already
   on, so a tap did nothing; that page points it at the form instead. */
export default function Faq({
  ctaHref = FAQ.tail.cta.href,
  compact = false,
}: {
  ctaHref?: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <section className="pad-x pad-top mobile:pt-0 relative flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-[40px] mobile:gap-[30px]">
          <LabelRow label={FAQ.label} />

          {/* One grid, three places. On a desktop: the heading top left, the
              closing question bottom left, the questions down the right.
              From a tablet down, one column in reading order. */}
          <div className="grid w-full grid-cols-2 gap-x-[40px] gap-y-[40px] narrow:grid-cols-1 narrow:gap-y-[30px]">
            <Rise
              as="h2"
              lines={FAQ.headline}
              className="t-display col-start-1 row-start-1 max-w-[600px] text-ink [&_.rise-line>span]:[text-wrap:balance]"
            />

            <InView className="col-start-2 row-span-2 row-start-1 w-full max-w-[690px] justify-self-end narrow:col-start-1 narrow:row-span-1 narrow:row-start-2 narrow:max-w-none">
              <Questions />
            </InView>

            <InView className="col-start-1 row-start-2 flex flex-col items-start gap-[24px] self-end narrow:row-start-3">
              <h2 className="t-sub text-ink">{FAQ.tail.headline}</h2>
              <p className="t-mono text-ink-2">{FAQ.tail.note}</p>
              <Btn href={ctaHref} label={FAQ.tail.cta.label} />
            </InView>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pad-x pad-top mobile:pt-0 relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col items-center gap-[70px] mobile:gap-[40px]">
        <div className="flex w-full flex-col items-center gap-[70px] mobile:gap-[30px]">
          <LabelRow label={FAQ.label} />
          <Rise as="h2" lines={FAQ.headline} className="t-display text-center text-ink" />
        </div>

        <InView className="w-[690px] max-w-full">
          <Questions />
        </InView>

        <div className="flex flex-col items-center gap-[30px] pt-[80px] mobile:pt-[40px]">
          <h2 className="t-sub text-center text-ink">{FAQ.tail.headline}</h2>
          <Tick />
          <p className="t-mono text-ink-2">{FAQ.tail.note}</p>
          <Btn href={ctaHref} label={FAQ.tail.cta.label} />
        </div>
      </div>
    </section>
  );
}
