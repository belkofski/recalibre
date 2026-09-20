import { BLOCKS } from '@/lib/blocks-content';
import Link from 'next/link';
import Img from '@/lib/Img';
import { Lines, HeadLines } from '@/lib/prim';
import Sparkle from './Sparkle';
import Reveal from './Reveal';

/**
 * BLOCK B2 — "WHY CHOOSE US" (reference 6.webp, 2000×1244, scale 0.72)
 * Site B: Covix.
 *
 *   eyebrow    ink y57, centred                    → 41.04
 *   headline   ink y116 / y208, pitch 92           → 83.52 · line-height 66.24
 *   photo      x223-895 y375-1227, 673×853         → 160.56 · 270 · 484.56 × 614.16
 *   lead       ink y382, pitch 49, x949            → 275.04 · line-height 35.28 · 683.28
 *   meta row   ink y651 x952 → x1775               → 468.72 · 685.44
 *   cards      x953-1345 / x1379-1772, gap 34      → 282.96 / 283.68, gap 24.48
 *
 * Lead line 4 carries a leading space in the reference — the same quirk the
 * About band's headline has (measured as a ~12px img indent on that line only).
 *
 * NOT CARRIED OVER: "Trusted Worldwide", "12+ Countries" and the six named
 * tool logos. Those are the reference's claims and third-party marks, not
 * yours.
 *
 * THE AVATAR STACK AND THE COUNTER CARD ARE GONE — 20 September 2026, for the
 * same reason the two About cards went. The stack was three blank circles
 * followed by a [00] badge: three blank circles in a row is the reference's
 * "people who use this" device, and it makes that claim whether or not anyone
 * is drawn in them. The second card was [00] over [AWAITING FIGURE] and
 * "Figure to be supplied." — a number card with no number.
 *
 * What is left is real: the founder's sentence about the integrated team, the
 * line about what the work is built for, and the Calibration card. The
 * remaining card now runs the full width the pair used to share.
 *
 * PHONE. The 1120.32px row of a 484.56 x 614.16 frame beside the text is
 * unchanged above 1200px. Below it the frame and the text stack, and the
 * frame keeps a sensible height rather than 614px of empty box on a phone.
 */
export default function WhyChoose() {
  const B = BLOCKS.whyChoose;
  return (
    <section className="flex w-full shrink-0 flex-col items-center overflow-clip bg-paper-2 section-pad">
      <div className="flex items-center gap-[10.8px]">
        <Sparkle size={9.36} color="var(--color-accent)" />
        <p className="eyebrow whitespace-pre text-text">
          {B.eyebrow}
        </p>
      </div>

      <HeadLines
        lines={[B.headline.l1, B.headline.l2]}
        className="section-head mt-[20px] text-center text-text"
      />

      <div className="mt-[56px] flex w-full max-w-[1120.32px] items-start gap-[38.88px] narrow:flex-col narrow:gap-[28px]">
        {/* The frame held "Photograph to come" for a picture of the team that
            does not exist and is not owed to anyone but the founder. What
            does exist is the work: OPS running a day in the field, on a
            phone with no signal and on the desk it syncs back to. That is
            the argument this block is making — one team, one system — so
            it is the picture. Labelled as demonstration data, like every
            other product capture on the page. */}
        <figure
          data-evidence
          className="m-0 flex w-[484.56px] shrink-0 flex-col narrow:w-full"
        >
          <div className="h-[560px] w-full overflow-clip rounded-[12px] border border-rule-on-light bg-paper-3 narrow:h-[320px] mobile:h-[240px]">
            <Img
              src="/img/ops-offline.png"
              alt="OPS on a phone in the field with no signal: the day's checklist, two jobs ticked, and the reports waiting in the queue beside what the office sees."
              sizes="(max-width: 1199px) 100vw, 485px"
              className="block h-full w-full object-cover object-left-top"
            />
          </div>
          <figcaption className="meta-text mt-[12px] text-text-3">
            OPS · a day in the field, offline. Demonstration data.
          </figcaption>
        </figure>

        <div className="flex w-full min-w-0 flex-1 flex-col">
          <Lines lines={B.lead} className="pt-[5px] lead-head text-text" />

          <div className="mt-[42px] h-px w-full bg-rule-on-light" />

          {/* meta row — globe mark, two lines, avatar stack right */}
          <div className="mt-[26px] flex items-center justify-between">
            <div className="flex items-center gap-[17.28px]">
              <svg viewBox="0 0 24 24" className="h-[25.92px] w-[25.92px]" aria-hidden="true">
                <circle cx="12" cy="12" r="9.2" fill="none" stroke="var(--color-text)" strokeWidth="1.3" />
                <ellipse cx="12" cy="12" rx="4" ry="9.2" fill="none" stroke="var(--color-text)" strokeWidth="1.3" />
                <line x1="2.8" y1="12" x2="21.2" y2="12" stroke="var(--color-text)" strokeWidth="1.3" />
              </svg>
              <Lines lines={[B.metaTitle, B.metaSub]} className="body-text text-text-2" />
            </div>
          </div>

          {/* two cards — 282.96 / 283.68 on a 24.48 gutter */}
          <Reveal className="mt-[46px] flex items-stretch gap-[24.48px]">
            <div className="card-lift flex w-full flex-col rounded-[12px] bg-paper p-[20.16px]">
              <Lines lines={B.cardA.title} className="title-2 text-text" />
              <Lines lines={B.cardA.body} className="mt-[12px] small-text text-text-3" />
              {/* Was a 3-column grid with a row gap and NO column gap, inside
                  242.64px of card — so each track was 80.88px and the tracks
                  touched. "Automation" measures 64.8px of ink plus a 12px
                  marker plus a 5px gap = 81.8px, 0.9px over its track, so it
                  ran straight into "Software" with no space between them; the
                  four that did fit sat flush edge to edge anyway.

                  The 12px rounded squares were the other half of the problem:
                  six labels each behind a small empty square reads as a
                  checklist of unticked boxes, not as a list of capabilities.

                  Pills that wrap: they size to their own text, so no label can
                  outgrow its slot, and nothing here can be mistaken for a
                  control. Measured at 12px: the six come to 66.2 / 57 / 29.4 /
                  82.8 / 69.5 / 66.5, so they fall 3 + 3 into 242.64 on a 6px
                  gap, the same two rows as before with real space in them. */}
              <div className="mt-[16px] flex flex-wrap gap-[6px] border-t border-rule-on-light pt-[12px]">
                {B.cardA.tools.map((t, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full border border-rule-on-light px-[8px] py-[3px] text-[12px] leading-[16px] font-medium whitespace-pre text-text-2"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-auto pt-[18px]">
                <Link
                  href="#contact"
                  className="focus-ring btn-label flex h-[48px] w-full items-center justify-center gap-[10px] rounded-full bg-ink text-on-dark transition-colors duration-[260ms] hover:bg-accent"
                >
                  {B.cardA.cta}
                  <span aria-hidden="true" className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-paper text-[13px] text-text">
                    ↗
                  </span>
                </Link>
              </div>
            </div>

          </Reveal>
        </div>
      </div>
    </section>
  );
}
