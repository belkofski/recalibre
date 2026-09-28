'use client';

import { useState } from 'react';
import { Rise, InView, useMedia } from '@/lib/motion';
import { LabelRow, Btn, Chevron } from '@/components/ui';
import { ENGAGEMENT } from '@/content/home';

/* ============================================================================
   THE THREE STAGES.

   One geometry on Home and About (28 September 2026). Three cards side by
   side on one seam plate; card 01 stands on the raised ground, a step up
   from the other two, because it is the only way in. Since 28 September
   2026 that ground is `raised-2` (#1a1a1a): on `raised` it matched the
   #101010 plate and lost its outline. The heading takes the right column
   and the footnote the left.

   The figure slot of the reference's pricing deck carries, in the place a
   price would take, what the buyer receives at the end of the stage and
   when that stage's scope is fixed. There is no price and no POPULAR stamp:
   Recalibre publishes neither.

   ONE BUTTON. All three stages said "Start a calibration" and went to the
   same place, so the one button sits in card 01's foot, under what it
   delivers and its scope line (was: one loose button under the deck on
   Home, one in each card's foot on About).

   THE ROWS LINE UP WITHOUT A FLOOR. The plate lays out six rows (title,
   note, points, receive, scope, button) and each card takes them through
   `grid-rows-subgrid`, so the longest note sets where every list starts
   and the longest list where every YOU RECEIVE starts. No number reserves
   a height.

   On a phone each stage shows its number, title and note and opens on a
   tap to the rest; the first is open.
   ========================================================================= */

type Stage = (typeof ENGAGEMENT.cards)[number];

/** A plain list on hairlines. */
function Points({ points }: { points: readonly string[] }) {
  return (
    <ul className="flex flex-col divide-y divide-rule pt-[12px]">
      {points.map((p) => (
        <li key={p} className="t-body py-[12px] text-ink-2">
          {p}
        </li>
      ))}
    </ul>
  );
}

/* WHAT YOU LEAVE WITH. A stage of an unpriced engagement is an abstraction
   until it says what the buyer actually receives at the end of it. */
function Receive({ c }: { c: Stage }) {
  return (
    <div className="mt-[12px] flex flex-col gap-[8px] border-t border-rule pt-[24px]">
      <span className="t-mono text-ink-3">YOU RECEIVE</span>
      <span className="t-body text-ink">{c.output}</span>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   ONE STAGE.

   From a tablet up the card is a subgrid of the plate's six rows, and the
   three wrappers around its lower half are `contents`, so the list, the
   receive block, the scope line and the button each take their own row. On
   a phone the card is a column and those wrappers are the fold. The fold is
   CSS, so the server draws the phone's first state with no jump; hiding a
   folded panel from a screen reader (`inert`) needs a script, so that
   waits for `useMedia` and never applies on a wider screen.
   ------------------------------------------------------------------------ */
function StageCard({
  c,
  i,
  open,
  onToggle,
  phone,
}: {
  c: Stage;
  i: number;
  open: boolean;
  onToggle: () => void;
  phone: boolean;
}) {
  const titleId = `stage-${c.n}-title`;
  const panelId = `stage-${c.n}-panel`;
  const first = i === 0;
  return (
    <InView
      delay={i * 90}
      className={`card-30 row-span-6 grid grid-rows-subgrid gap-y-0 p-(--card-pad) mobile:row-span-1 mobile:flex mobile:flex-col ${
        first ? 'bg-raised-2' : ''
      }`}
    >
      {/* The head: the number over the title in row one, the note in row
          two. On a phone the whole head is the tap target, named by the
          stage's own title; the button is not drawn from a tablet up. */}
      <div className="relative row-span-2 grid grid-rows-subgrid mobile:flex mobile:flex-col mobile:pr-[44px]">
        <div className="flex flex-col gap-[24px]">
          <span className="t-mono-11 tabular-nums text-ink-2">{c.n}</span>
          <h3 id={titleId} className="t-card text-ink">
            {c.title}
          </h3>
        </div>
        <p className="t-lede pt-[8px] text-ink-2">{c.note}</p>
        <span
          aria-hidden="true"
          className="absolute right-0 top-0 hidden size-[44px] items-center justify-end text-accent-bright mobile:flex"
        >
          <Chevron className={open ? 'rotate-180' : ''} />
        </span>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-labelledby={titleId}
          onClick={onToggle}
          className="focus-ring absolute -inset-[8px] hidden rounded-[8px] mobile:block"
        />
      </div>

      <div
        id={panelId}
        className={`contents grid-rows-[1fr] transition-[grid-template-rows] duration-[450ms] mobile:grid ${
          open ? '' : 'mobile:grid-rows-[0fr]'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-panel)' }}
      >
        <div className="contents mobile:block mobile:overflow-hidden" inert={phone && !open}>
          <div className="contents mobile:flex mobile:flex-col">
            <Points points={c.points} />
            <Receive c={c} />
            <span className="t-mono pt-[16px] text-ink-2">{c.scope}</span>
            {/* `data-origin-card` names the card in the enquiry email's
                "Came from" line (lib/origin.tsx). */}
            {first ? (
              <div data-origin-card={c.title.replace(/\.$/, '')} className="pt-[24px]">
                <Btn href="/contact" label={c.cta} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </InView>
  );
}

function Stages() {
  const [open, setOpen] = useState<number | null>(0);
  const phone = useMedia('(max-width: 809.98px)');
  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-row)">
        <div className="flex w-full flex-col gap-(--space-label)">
          <LabelRow label={ENGAGEMENT.label} />

          {/* The heading in the right column, the footnote in the left; one
              column below 1200, heading first. */}
          <div className="grid w-full grid-cols-2 items-end gap-x-[40px] narrow:grid-cols-1 narrow:gap-y-[24px]">
            <Rise
              as="h2"
              lines={ENGAGEMENT.headline}
              className="t-display col-start-2 row-start-1 text-ink narrow:col-start-1"
            />
            <InView className="col-start-1 row-start-1 narrow:row-start-2">
              <p className="t-body max-w-[400px] text-ink-2">{ENGAGEMENT.footnote}</p>
            </InView>
          </div>
        </div>

        <div className="seam grid w-full grid-cols-3 grid-rows-[auto_auto_1fr_auto_auto_auto] mobile:grid-cols-1 mobile:grid-rows-none">
          {ENGAGEMENT.cards.map((c, i) => (
            <StageCard
              key={c.n}
              c={c}
              i={i}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
              phone={phone}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Home and About draw the same stages (28 September 2026). */
export default Stages;
