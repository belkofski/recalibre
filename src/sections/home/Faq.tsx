'use client';

import { useState } from 'react';
import { Rise, InView } from '@/lib/motion';
import { LabelRow, MonoLink, Chevron } from '@/components/ui';
import { FAQ } from '@/content/home';

/* ============================================================================
   THE FAQ.

   One layout on Home and Contact (28 September 2026; Contact drew a centred
   column until then). Two columns: the heading and the closing question
   with its link on the left, the questions on the right. Below 1200 one
   column in reading order: heading, questions, closing question.

   One card per question on a seam plate at 24. The whole row is the
   button, question and chevron together, at least 44px tall; the separate
   chevron card beside each question is gone. The answer opens in place.

   THE CHEVRON IS A DISCLOSURE (28 September 2026): the firm's chevron,
   8 x 13 in a 16px box, turned down while the answer is closed and up
   while it is open, 300ms on the hover curve. It is the one chevron that
   turns: it shows a state, not a way. The card lifts 4% under the pointer
   (`.hover-lift`) and the question presses (`.press`) while held.
   ========================================================================= */

function Questions() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="seam-sm flex flex-col">
      {FAQ.items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="card-24 hover-lift flex flex-col px-(--card-pad) py-[20px]"
          >
            <h3 className="flex">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="press t-question flex min-h-[44px] w-full items-center justify-between gap-[16px] text-left text-ink"
              >
                <span>{item.q}</span>
                <span aria-hidden="true" className="flex size-[44px] flex-none items-center justify-end text-accent-bright">
                  <Chevron dir={isOpen ? 'up' : 'down'} size="ring" />
                </span>
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
                <p className="t-body pt-[16px] text-ink-2">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * `ctaHref`: where "ask it through the form" goes: the footer's form on
 * Home, the page's own form on Contact. A same-page jump, so it is a plain
 * anchor (see MonoLink). One layout on both pages since 28 September 2026.
 */
export default function Faq({
  ctaHref = '#enquiry',
}: {
  ctaHref?: string;
}) {
  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-label)">
        <LabelRow label={FAQ.label} />

        {/* One grid, three places. On a desktop: the heading top left, the
            closing question bottom left, the questions down the right.
            From a tablet down, one column in reading order. */}
        <div className="grid w-full grid-cols-2 gap-x-[40px] gap-y-(--space-row) narrow:grid-cols-1">
          <Rise
            as="h2"
            lines={FAQ.headline}
            className="t-display col-start-1 row-start-1 max-w-[600px] text-ink [&_.rise-line>span]:[text-wrap:balance]"
          />

          <InView className="col-start-2 row-span-2 row-start-1 w-full max-w-[690px] justify-self-end narrow:col-start-1 narrow:row-span-1 narrow:row-start-2 narrow:max-w-none">
            <Questions />
          </InView>

          <InView className="col-start-1 row-start-2 flex flex-col items-start gap-[24px] self-end narrow:row-start-3">
            <h2 className="t-card text-ink">{FAQ.tail.headline}</h2>
            <MonoLink href={ctaHref} label={FAQ.tail.note} />
          </InView>
        </div>
      </div>
    </section>
  );
}
