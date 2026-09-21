'use client';

import { useState } from 'react';
import { Rise, InView } from '@/lib/motion';
import { LabelRow, Tick, Btn } from '@/components/ui';
import { FAQ } from '@/content/home';

/* ============================================================================
   THE FAQ.

   The reference's accordion: a 690px column centred on the page, each row
   a card with a separate square toggle 2px to its right on the same seam
   plate at radius 13. The chevron is lime, the answer expands in place, and
   the block closes with a centred sub-question and a button.
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

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col items-center gap-[70px] mobile:gap-[40px]">
        <div className="flex w-full flex-col items-center gap-[70px] mobile:gap-[30px]">
          <LabelRow label={FAQ.label} />
          <Rise as="h2" lines={FAQ.headline} className="t-display text-center text-ink" />
        </div>

        <InView className="w-[690px] max-w-full">
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
                      <div className="overflow-hidden">
                        <p className="t-small pt-[14px] text-ink-2">{item.a}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="card-24 flex w-[68px] flex-none items-center justify-center !rounded-[11px] text-lime transition-colors duration-300 hover:bg-white/[0.03] mobile:w-[52px]"
                  >
                    <Chevron open={isOpen} />
                  </button>
                </div>
              );
            })}
          </div>
        </InView>

        <div className="flex flex-col items-center gap-[30px] pt-[80px] mobile:pt-[40px]">
          <h2 className="t-sub text-center text-ink">{FAQ.tail.headline}</h2>
          <Tick />
          <p className="t-mono text-ink-2">{FAQ.tail.note}</p>
          <Btn href={FAQ.tail.cta.href} label={FAQ.tail.cta.label} />
        </div>
      </div>
    </section>
  );
}
