'use client';

import { useState, type CSSProperties } from 'react';
import { Rise, InView, Scene, useHydrated } from '@/lib/motion';
import { Card, MonoLink, Chevron } from '@/components/ui';
import { FAQ } from '@/content/home';

/* ============================================================================
   THE FAQ.

   On Contact only since the owner's audit (Home is shorter by a third and
   the questions belong where the form is). The layout is its own two
   columns rather than `SectionHead`: the heading top left and the closing
   question bottom left, the questions down the right. Below 1200 one
   column in reading order: heading, questions, closing question.

   One `Card` per question on a seam plate at 24. The whole row is the
   button, question and chevron together, at least 44px tall; the separate
   chevron card beside each question is gone. The answer opens in place
   through the one fold the contact route uses (`.contact-fold`,
   contact.css: 0fr → 1fr on the panel curve, `inert` while closed).

   THE CHEVRON IS A DISCLOSURE (28 September 2026): the firm's chevron,
   8 x 13 in a 16px box, turned down while the answer is closed and up
   while it is open, 300ms on the hover curve. It is the one chevron that
   turns: it shows a state, not a way. The card is a lit surface with the
   spotlight (the direction change): its edge and ground light under the
   pointer, and on a phone as the row passes the centre of the screen; the
   one card hover (`interactive`) steps the ground up and the question
   presses (`.press`) while held. The tail's link draws its line under its
   words (MonoLink carries `.link-line`).

   The heading is `t-section` now, a step under the page's h1, so the page
   has one loud voice (the owner's audit).

   THE THIRD PASS: every answer starts folded (the page's words are the
   questions; an answer is a tap away), the FAQ label row over the heading
   came off (it repeated it), and the questions are no longer one reveal
   each: the column is a Scene and they stagger up as it comes into the
   window (`.sx-stagger`, the fifth and sixth on the fourth's step, the
   most the stagger finishes within one entry).
   ========================================================================= */

function Questions() {
  const [open, setOpen] = useState<number | null>(null);
  const hydrated = useHydrated();
  return (
    <Scene end={0.3} className="seam-sm sx-stagger flex flex-col">
      {FAQ.items.map((item, i) => {
        const isOpen = open === i;
        return (
          /* Each row its step in the column's stagger, capped at the
             fifth. */
          <div key={item.q} style={{ '--i': Math.min(i, 4) } as CSSProperties}>
            <Card radius={24} interactive spot className="flex flex-col px-(--card-pad) py-[20px]">
              <h3 className="flex">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="press t-question flex min-h-[44px] w-full items-center justify-between gap-(--space-3) text-left text-ink"
                >
                  <span>{item.q}</span>
                  <span aria-hidden="true" className="flex size-[44px] flex-none items-center justify-end text-accent-bright">
                    <Chevron dir={isOpen ? 'up' : 'down'} size="ring" />
                  </span>
                </button>
              </h3>
              <div id={`faq-${i}`} className="contact-fold" data-open={isOpen || undefined}>
                {/* `inert` as well as the height collapse. The grid row going
                    to 0fr hides the answer from a reader looking at the page
                    and from nobody else: the text stayed in the accessibility
                    tree, so a screen reader announced all six answers at once
                    under a control that said they were collapsed. Only once
                    hydrated: without scripts every answer is open (the fold's
                    closed state is gated on `.js`) and must not be inert. */}
                <div inert={hydrated && !isOpen}>
                  <p className="t-body pt-(--space-3) text-ink-2">{item.a}</p>
                </div>
              </div>
            </Card>
          </div>
        );
      })}
    </Scene>
  );
}

/**
 * `ctaHref`: where "ask it through the form" goes: the page's own form on
 * Contact (`#contact-form`). A same-page jump, so it is a plain anchor
 * (see MonoLink). The default is kept for any page that still draws the
 * footer's brief form.
 */
export default function Faq({
  ctaHref = '#enquiry',
}: {
  ctaHref?: string;
}) {
  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col">

        {/* One grid, three places. On a desktop: the heading top left, the
            closing question bottom left, the questions down the right.
            From a tablet down, one column in reading order. */}
        <div className="grid w-full grid-cols-2 gap-x-[40px] gap-y-(--space-row) narrow:grid-cols-1">
          <Rise
            as="h2"
            lines={FAQ.headline}
            className="t-section col-start-1 row-start-1 max-w-[600px] text-ink"
          />

          <div className="col-start-2 row-span-2 row-start-1 w-full max-w-[690px] justify-self-end narrow:col-start-1 narrow:row-span-1 narrow:row-start-2 narrow:max-w-none">
            <Questions />
          </div>

          {/* The closing question is a line, not a heading: the section
              has one h2 and the questions are its h3s. */}
          <InView className="col-start-1 row-start-2 flex flex-col items-start gap-(--space-4) self-end narrow:row-start-3">
            <p className="t-card text-ink">{FAQ.tail.headline}</p>
            <MonoLink href={ctaHref} label={FAQ.tail.note} />
          </InView>
        </div>
      </div>
    </section>
  );
}
