'use client';

import { useState } from 'react';
import { Rise, InView, useMedia } from '@/lib/motion';
import { LabelRow, Btn } from '@/components/ui';
import { ENGAGEMENT } from '@/content/home';

/* ============================================================================
   THE ENGAGEMENT CARDS.

   The reference's pricing deck, kept whole: three 454px cards on their own
   seam plates at radius 31, a 9px gutter, a header row carrying the stage
   number and three dots, a title with a POPULAR stamp, a checked feature
   list, and a raised foot holding the action and the figure.

   The figure slot is the only change. There is no price on it — it carries,
   in the same position and at the same size, the two things a buyer of an
   unpriced engagement needs instead: what they receive at the end of the
   stage, and when that stage's scope is fixed.

   THE "POPULAR" STAMP IS GONE. On the reference it means most-bought.
   Recalibre publishes no sales figures, so it was a popularity claim with
   nothing behind it.

   THE HOMEPAGE DRAWS IT SHORTER (`compact`, the owner's decision of 26
   September 2026). The three stages sit side by side on one seam plate, the
   heading shares its row with the footnote, and ONE "Start a calibration"
   sits under the three instead of one on each: all three said the same
   thing and went to the same place. Each stage's scope line moves up into
   its card, under what the buyer receives. On a phone each stage shows its
   number, title and line, and opens on a tap to its list; the first is open.
   The About page keeps the full deck.
   ========================================================================= */

type Stage = (typeof ENGAGEMENT.cards)[number];

function Check() {
  return (
    <span
      aria-hidden="true"
      className="mt-[1px] flex size-[16px] flex-none items-center justify-center rounded-full bg-white/[0.08]"
    >
      <svg viewBox="0 0 10 8" className="size-[8px]" fill="none">
        <path d="M1 4.2 3.5 6.7 9 1.2" stroke="currentColor" strokeWidth="1.4" className="text-accent-bright" />
      </svg>
    </span>
  );
}

/** The stage number, its three dots (one lit per stage reached) and the
 *  stage's name in mono on the right. */
function StageHead({ c, i }: { c: Stage; i: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-[10px]">
        <span className="t-body-lg text-ink">{c.n}</span>
        <span aria-hidden="true" className="flex items-center gap-[3px]">
          {[0, 1, 2].map((d) => (
            <i key={d} className={`block size-[4px] rounded-full ${d <= i ? 'bg-accent-bright' : 'bg-white/20'}`} />
          ))}
        </span>
      </span>
      <span className="t-mono-9 text-ink-2">{c.timeline}</span>
    </div>
  );
}

function Points({ points }: { points: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-[12px]">
      {points.map((p) => (
        <li key={p} className="flex items-start gap-[10px]">
          <Check />
          <span className="t-small text-ink-2">{p}</span>
        </li>
      ))}
    </ul>
  );
}

/* WHAT YOU LEAVE WITH. A stage of an unpriced engagement is an abstraction
   until it says what the buyer actually receives at the end of it. */
function Receive({ c }: { c: Stage }) {
  return (
    <div className="flex flex-col gap-[10px] border-t border-rule-2 pt-[24px]">
      <span className="t-mono-9 text-ink-3">YOU RECEIVE</span>
      <span className="t-small text-ink">{c.output}</span>
    </div>
  );
}

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

/* ---------------------------------------------------------------------------
   THE SHORT FORM, for the homepage.

   Side by side from a tablet up, every stage open. On a phone the list and
   the foot of each stage fold under its title. The fold is CSS, so the
   server draws the phone's first state with no jump; hiding a folded panel
   from a screen reader (`inert`) needs a script, so that waits for
   `useMedia` and never applies on a wider screen, where nothing folds.
   ------------------------------------------------------------------------ */
function CompactStage({
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
  return (
    <InView delay={i * 90} className="card-30 flex flex-col p-[30px] tablet:p-[24px] mobile:p-[20px]">
      <div className="relative flex flex-col gap-[28px] mobile:gap-[20px]">
        <StageHead c={c} i={i} />
        <div className="flex items-start justify-between gap-[16px]">
          <div className="flex flex-col gap-[2px]">
            <h3 id={titleId} className="t-card text-ink">
              {c.title}
            </h3>
            <p className="t-card text-ink-2">{c.note}</p>
          </div>
          <span aria-hidden="true" className="hidden size-[44px] flex-none items-center justify-center text-accent-bright mobile:flex">
            <Chevron open={open} />
          </span>
        </div>
        {/* The whole head is the phone's tap target; the button is named by
            the stage's own title. Not drawn from a tablet up. */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-labelledby={titleId}
          onClick={onToggle}
          className="focus-ring absolute -inset-[8px] hidden rounded-[16px] mobile:block"
        />
      </div>

      <div
        id={panelId}
        className={`grid flex-1 grid-rows-[1fr] transition-[grid-template-rows] duration-[450ms] ${
          open ? '' : 'mobile:grid-rows-[0fr]'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-panel)' }}
      >
        <div className="flex flex-col overflow-hidden" inert={phone && !open}>
          <div className="flex flex-1 flex-col gap-[28px] pt-[28px] mobile:gap-[24px] mobile:pt-[24px]">
            <Points points={c.points} />
            <div className="mt-auto flex flex-col gap-[16px]">
              <Receive c={c} />
              <span className="t-mono text-ink-2">{c.scope}</span>
            </div>
          </div>
        </div>
      </div>
    </InView>
  );
}

function Compact() {
  const [open, setOpen] = useState<number | null>(0);
  const phone = useMedia('(max-width: 809.98px)');
  return (
    <section className="pad-x pad-top mobile:pt-0 relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-[40px] mobile:gap-[30px]">
        <LabelRow label={ENGAGEMENT.label} />

        <div className="grid w-full grid-cols-2 items-end gap-[40px] narrow:grid-cols-1 narrow:gap-[24px]">
          <Rise as="h2" lines={ENGAGEMENT.headline} className="t-display text-ink" />
          <InView className="justify-self-end narrow:justify-self-start">
            <p className="t-mono max-w-[400px] text-ink-2">{ENGAGEMENT.footnote}</p>
          </InView>
        </div>

        <div className="seam grid w-full grid-cols-3 mobile:grid-cols-1">
          {ENGAGEMENT.cards.map((c, i) => (
            <CompactStage
              key={c.n}
              c={c}
              i={i}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
              phone={phone}
            />
          ))}
        </div>

        {/* ONE WAY IN, ONE BUTTON. The enquiry's "Came from" line names this
            block by its heading (lib/origin.tsx). */}
        <InView>
          <Btn href="/contact" label={ENGAGEMENT.cards[0].cta} />
        </InView>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   THE FULL DECK, for the About page.
   ------------------------------------------------------------------------ */
function Full() {
  return (
    <section className="pad-x pad-top mobile:pt-0 relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col items-center gap-[70px] mobile:gap-[40px]">
        <div className="flex w-full flex-col items-center gap-[70px] mobile:gap-[30px]">
          <LabelRow label={ENGAGEMENT.label} />
          <Rise as="h2" lines={ENGAGEMENT.headline} className="t-display text-center text-ink" />
        </div>

        <div className="grid w-full grid-cols-3 gap-[9px] tablet:grid-cols-2 mobile:grid-cols-1">
          {ENGAGEMENT.cards.map((c, i) => (
            <InView
              key={c.n}
              delay={i * 90}
              className={`seam flex flex-col ${i === 2 ? 'tablet:col-span-2' : ''}`}
            >
              <div className="card-30 flex flex-1 flex-col gap-[40px] p-[30px] mobile:p-[20px]">
                <StageHead c={c} i={i} />

                {/* THE THIRD CARD IS TWICE AS WIDE ON A TABLET, because the
                    reference runs two cards and then one across the full
                    width rather than stacking three. A card that wide with
                    one narrow column of text down its left side leaves half
                    of itself empty, so on that card, at that width only, the
                    title and the list sit side by side. `contents` means the
                    other two cards lay out exactly as they did before. */}
                <div
                  className={
                    i === 2
                      ? 'contents tablet:grid tablet:grid-cols-2 tablet:items-start tablet:gap-[40px]'
                      : 'contents'
                  }
                >
                  <div className="flex flex-col gap-[2px]">
                    <h3 className="t-card text-ink">{c.title}</h3>
                    <p className="t-card text-ink-2">{c.note}</p>
                  </div>

                  <Points points={c.points} />
                </div>

                <div className="mt-auto">
                  <Receive c={c} />
                </div>
              </div>

              {/* `data-origin-card` names the card in the enquiry email's
                  "Came from" line (lib/origin.tsx): all three buttons read
                  "Start a calibration", so the card is what tells them apart. */}
              <div
                data-origin-card={c.title.replace(/\.$/, '')}
                className="flex items-center gap-[20px] rounded-b-[29px] bg-white/[0.03] p-[30px] mobile:flex-col mobile:items-start mobile:p-[20px]"
              >
                <Btn href="/contact" label={c.cta} />
                <span className="t-mono text-ink-2">{c.scope}</span>
              </div>
            </InView>
          ))}
        </div>

        <InView>
          <p className="t-mono max-w-[400px] text-center text-ink-2">{ENGAGEMENT.footnote}</p>
        </InView>
      </div>
    </section>
  );
}

export default function Engagement({ compact = false }: { compact?: boolean }) {
  return compact ? <Compact /> : <Full />;
}
