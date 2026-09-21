'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Rise, InView } from '@/lib/motion';
import { FAQ as F } from '@/content/home';

/* ============================================================================
   THE FAQ — block 13. Measured 1240px, six rows, one open by default, the
   open row's index chip filled.

   The accordion behaviour is the reference's: one row open at a time, the
   first open on arrival, the marker rotating on 0.3s. Six questions, as the
   reference has, replaced with the six a corporate buyer actually asks —
   scope, stages, data governance, human oversight, integration, and
   ownership and support.

   It is a real disclosure widget, not a styled div: each header is a button
   that owns its panel through aria-controls, reports its state through
   aria-expanded, and is reachable and operable from the keyboard. The
   reference's own accordion announces nothing.
   ========================================================================= */
export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" aria-labelledby="faq-head" className="w-full overflow-clip pad-top scroll-mt-[60px]">
      <div className="shell pad-x flex w-full items-start gap-[64px] narrow:flex-col narrow:gap-[32px]">
        <div className="sticky top-[110px] flex w-[380px] shrink-0 flex-col gap-[16px] narrow:static narrow:w-full">
          <p className="t-mono text-ink-3">{F.eyebrow}</p>
          <Rise as="h2" id="faq-head" lines={F.headline} className="t-display text-ink" />
          <p className="t-small mt-[10px] max-w-[34ch] text-ink-2">
            Anything not answered here is worth a direct question.
          </p>
          <Link href="/contact" className="pill focus-ring t-btn mt-[10px] self-start">
            Ask us directly
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 flex-col border-t border-rule">
          {F.items.map((item, i) => {
            const isOpen = i === open;
            const panelId = `faq-panel-${i}`;
            const headId = `faq-head-${i}`;
            return (
              <InView key={item.q} delay={i * 50} className="border-b border-rule">
                <h3>
                  <button
                    type="button"
                    id={headId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="focus-ring flex w-full cursor-pointer items-start gap-[16px] py-[22px] text-left"
                  >
                    <span
                      className={`t-mono-9 mt-[6px] shrink-0 transition-colors duration-[300ms] ${
                        isOpen ? 'text-lime' : 'text-ink-3'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`t-lede flex-1 ${isOpen ? 'text-ink' : 'text-ink-2'}`}>{item.q}</span>
                    <span
                      aria-hidden="true"
                      className={`mt-[8px] shrink-0 text-ink-2 transition-transform duration-[300ms] ease-hover ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.25" />
                      </svg>
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headId}
                  hidden={!isOpen}
                  className="pb-[24px] pl-[34px] pr-[32px] mobile:pl-[28px] mobile:pr-0"
                >
                  <p className="t-body max-w-[62ch] text-ink-2">{item.a}</p>
                </div>
              </InView>
            );
          })}
        </div>
      </div>
    </section>
  );
}
