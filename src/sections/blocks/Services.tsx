'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BLOCKS } from '@/lib/blocks-content';
import Img from '@/lib/Img';
import { Lines, HeadLines } from '@/lib/prim';
import Sparkle from './Sparkle';
import Reveal from './Reveal';

/**
 * BLOCK B3 — "CAPABILITIES" (reference 11.webp, 2000×1244, scale 0.72)
 * Site B: Covix, dark variant. Background rgb(0,0,0).
 *
 *   eyebrow    ink y109, centred                 → 78.48
 *   headline   ink y166 / y259, pitch 93         → 119.52 · line-height 66.96
 *   row 01     x228-1772 y428-1180               → 164.16 · 308.16 · 1112 × 541
 *   row 02     top ~y1195, gap ~15               → gap 10.8
 *   radius     ~24                               → 17.28
 *
 * CAUTION: 11.webp is CROPPED — row 02 runs off the bottom, so the row count,
 * the open row's height and the section's bottom padding are NOT measured.
 *
 * ── THE + BUTTON NOW DOES SOMETHING ────────────────────────────────────────
 *
 * It never did. Every row rendered from a hard-coded `open` flag, the button
 * carried `aria-expanded` and no handler, and four of the five rows had no
 * body to reveal even if it had worked. A control that announces itself as
 * expandable and then ignores the press is worse than no control: a screen
 * reader tells the visitor there is more, and there is not.
 *
 * One row is open at a time, the first by default, and pressing the open row
 * closes it. The whole header is the button — a 31px circle is a small target
 * for the thing that is meant to be pressed, and the visible circle keeps its
 * measured size while the pressable area is the full width of the card.
 *
 * ── WHAT IS IN THE PICTURE FRAME ───────────────────────────────────────────
 *
 * Four rows show a real interface with demonstration data and say so in the
 * caption. Row 01 is Contraxis, which has no screenshot; it gets the same
 * labelled drawing the product card uses, never a stand-in capture. The
 * frame previously held a stock photograph from the cloned template behind an
 * "Image to come" overlay.
 *
 * ── PHONE ──────────────────────────────────────────────────────────────────
 *
 * The measured layout holds at 1200px and above, where each part of a card
 * sits at its own coordinates inside a fixed height. Below that the card
 * releases into ordinary flow (`narrow:static`, `narrow:h-auto`) and the
 * parts stack in reading order: number, title, tags, picture, sentence,
 * button. No measured value changes; they stop applying at a width they were
 * never measured for.
 */
export default function Services() {
  const B = BLOCKS.services;
  const [open, setOpen] = useState(0);

  return (
    <section
      id="capabilities"
      className="scroll-mt-[24px] flex w-full shrink-0 flex-col items-center overflow-clip bg-ink section-pad"
    >
      <div className="flex items-center gap-[10.8px]">
        <Sparkle size={9.36} color="var(--color-accent)" />
        <p className="eyebrow whitespace-pre text-on-dark">{B.eyebrow}</p>
      </div>

      <HeadLines
        lines={[B.headline.l1, B.headline.l2]}
        className="section-head mt-[20px] text-center text-on-dark"
      />

      <Reveal className="mt-[56px] flex w-full max-w-[1112px] flex-col gap-[10.8px]">
        {B.rows.map((row, i) => {
          const isOpen = open === i;
          const panelId = `capability-${i}`;
          return (
            <div
              key={row.n}
              className={`card-lift card-lift-dark relative w-full rounded-[12px] bg-ink-3 transition-[height] duration-[320ms] narrow:flex narrow:h-auto narrow:flex-col narrow:items-start narrow:p-[24px] ${
                isOpen ? 'h-[430px]' : 'h-[196px]'
              }`}
            >
              {/* The whole header is the control. The visible circle keeps its
                  measured 31px; the pressable area is the full card width. */}
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="focus-ring absolute inset-x-0 top-0 h-[140px] cursor-pointer rounded-t-[12px] text-left narrow:static narrow:h-auto narrow:w-full"
              >
                <span className="absolute top-[44px] left-[28px] text-[76px] leading-[86px] font-bold whitespace-pre text-on-dark/8 narrow:static narrow:block narrow:text-[40px] narrow:leading-[40px] narrow:text-on-dark/20">
                  {row.n}
                </span>

                <span
                  aria-hidden="true"
                  className="absolute top-[36px] right-[28px] flex h-[31px] w-[31px] items-center justify-center rounded-full border border-rule-strong text-[16px] leading-none text-on-dark/72 transition-colors duration-[260ms] narrow:top-[24px] narrow:right-[24px]"
                >
                  {isOpen ? '−' : '+'}
                </span>

                <span className="absolute top-[40px] left-[326px] block w-[620px] narrow:static narrow:mt-[14px] narrow:block narrow:w-full narrow:pr-[44px]">
                  <span className="title-1 block whitespace-pre text-on-dark narrow:whitespace-normal">
                    {row.title}
                  </span>
                  <span className="mt-[16px] flex flex-wrap items-center gap-[10px]">
                    {row.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-rule-strong px-[13px] py-[5px] meta-text whitespace-pre text-on-dark/88"
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                </span>
              </button>

              {isOpen && (
                <div id={panelId} className="contents">
                  <figure
                    data-evidence
                    className="absolute top-[170px] left-[326px] m-0 w-[334px] narrow:static narrow:mt-[20px] narrow:w-full"
                  >
                    <div className="relative h-[190px] w-full overflow-clip rounded-[8px] border border-rule-on-dark bg-ink-2 narrow:h-[200px]">
                      {row.drawing ? (
                        <ContraxisDrawing />
                      ) : row.img ? (
                        <Img
                          src={row.img}
                          alt={row.alt}
                          sizes="(max-width: 1199px) 100vw, 334px"
                          className="block h-full w-full object-cover object-top"
                        />
                      ) : null}
                    </div>
                    <figcaption className="meta-text mt-[8px] text-on-dark-3">{row.caption}</figcaption>
                  </figure>

                  <Lines
                    lines={row.body}
                    className="absolute top-[186px] left-[690px] w-[400px] lead-text text-on-dark/62 narrow:static narrow:mt-[20px] narrow:w-full"
                  />

                  <Link
                    href="#contact"
                    className="focus-ring absolute top-[330px] left-[690px] btn-label flex h-[48px] items-center gap-[10px] rounded-full bg-paper pr-[6px] pl-[20px] whitespace-pre text-text transition-colors duration-[260ms] hover:bg-accent hover:text-on-dark narrow:static narrow:mt-[20px]"
                  >
                    {row.cta}
                    <span
                      aria-hidden="true"
                      className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-ink text-[13px] text-on-dark"
                    >
                      ↗
                    </span>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}

/**
 * The Contraxis drawing, at card size.
 *
 * There is no capture of Contraxis and none is invented. `assets/` contains a
 * file named `contraxis-shot-ref.png` which is NOT Contraxis — it is a
 * marketing shot of another company's analytics product, kept as a visual
 * reference. This is the product's own five verbs instead, drawn plainly and
 * captioned as a drawing. It does not imitate an interface: no window chrome,
 * no toolbar, no sidebar. A drawing dressed as a screenshot is the same lie,
 * told more slowly.
 */
function ContraxisDrawing() {
  const steps = BLOCKS.work.contraxisSteps;
  return (
    <ol className="flex h-full w-full flex-col justify-center gap-[8px] px-[18px] py-[14px]">
      {steps.map((s, i) => (
        <li key={s.n} className="flex items-start gap-[10px]">
          <span className="flex flex-col items-center self-stretch">
            <span aria-hidden="true" className="mt-[5px] block h-[6px] w-[6px] shrink-0 border border-rule-strong" />
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="mt-[2px] block w-px flex-1 bg-rule-on-dark" />
            )}
          </span>
          <span className="min-w-0 flex-1 pb-[2px]">
            <span className="font-mono text-[10px] leading-[14px] tracking-[0.6px] text-on-dark-3">{s.n}</span>
            <span className="ml-[7px] text-[13px] leading-[18px] font-semibold text-on-dark">{s.label}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
