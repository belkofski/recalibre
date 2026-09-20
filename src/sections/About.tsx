import Link from 'next/link';
import { ABOUT } from '@/lib/content';

/**
 * ABOUT — built from the supplied screenshot (2000×1244), normalised to the
 * project's 1440 reference width. Scale factor 0.72 (1440 / 2000).
 *
 * Every value carries its source measurement in SCREENSHOT pixels so the
 * arithmetic is checkable:
 *
 *   section        rails y12.5 → y936.5, 924 img              → 665.33
 *   rails          x224.5 / x1774.5                           → 161.64 / 1277.64
 *   container      x275 → x1728, 1453 img                     → 1046.16
 *   left column    x275 → x752, 477 img                       → 343.44
 *   right column   x752 → x1728, 976 img                      → 702.72
 *   headline       4 lines, pitch 55 img                      → 39.6 line-height
 *   button         box y357, 167×64 img                       → 120.24 × 46.08
 *   cards          y489 → y843, h354 img                      → 254.88
 *   card 1         x752 → x1127, w375 img                     → 270
 *   gutter         x1127 → x1150, 23 img                      → 16.56
 *   card 2         x1150 → x1728, w578 img                    → 416.16
 *   chamfers       Δ63/68 · Δ56/64 · Δ61/64 — 45° cuts        → 45
 *
 * TYPE — the screenshot does not carry its typeface, so each size below was
 * solved by matching Geist's rendered ink width to the measured ink width of
 * the same string. The headline agrees across all four of its lines at 36px
 * (ratios 0.992 / 1.027 / 1.003 / 0.996), which is what fixes the 0.72 scale.
 * The quote solves at 16.5 (0.914 across four lines), the stat at 33, the name
 * at 16, the role at 14.5, the eyebrow and label at 16.
 *
 * VERTICAL — each block's box top is its measured INK top minus Geist's
 * ink offset at that size and line-height, so the ink lands where the
 * screenshot puts it rather than where the line box would.
 *
 * COLOUR — measured off the screenshot as page rgb(242,242,242), rails
 * rgb(217,217,217), accent rgb(238,104,56), display rgb(0,0,0), secondary
 * rgb(55,55,55). Those literals are now replaced by the organised palette in
 * globals.css: the orange accent folds into the single blue accent, and the
 * greys onto the shared text/surface scale. Geometry is unchanged.
 *
 * NOT REPRODUCED: the screenshot's copy, its five-star rating, its "50+ Happy
 * Clients" figure and its two portraits. That is the reference's own demo
 * filler — one fabricated person appears twice under two different companies.
 * The slots carry bracketed placeholders fitted to the measured ink widths, as
 * every other section on this page does.
 */

/** The 4-point sparkle marking the eyebrow and each rail intersection. */
function Sparkle({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="block shrink-0"
    >
      <path
        d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z"
        fill={color}
      />
    </svg>
  );
}

/**
 * Rail overlay: two vertical and two horizontal 1px lines, a grey sparkle at
 * each of the four intersections, and four accent ticks sitting ON the rails
 * (top x417, bottom x420, both verticals y807 — measured).
 */
function Rails() {
  const rail = 'absolute bg-rule-card';
  const tick = 'absolute bg-accent';
  const mark = 'absolute';
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div className={`${rail} top-0 right-0 left-0 h-px`} />
      <div className={`${rail} right-0 bottom-0 left-0 h-px`} />
      <div className={`${rail} top-0 bottom-0 left-[161.64px] w-px`} />
      <div className={`${rail} top-0 right-[162.36px] bottom-0 w-px`} />

      {/* intersections — 11px img sparkle → 7.92 */}
      <div className={`${mark} top-0 left-[161.64px] -translate-x-1/2 -translate-y-1/2`}>
        <Sparkle size={7.92} color="var(--color-text-3)" />
      </div>
      <div className={`${mark} top-0 right-[162.36px] translate-x-1/2 -translate-y-1/2`}>
        <Sparkle size={7.92} color="var(--color-text-3)" />
      </div>
      <div className={`${mark} bottom-0 left-[161.64px] -translate-x-1/2 translate-y-1/2`}>
        <Sparkle size={7.92} color="var(--color-text-3)" />
      </div>
      <div className={`${mark} right-[162.36px] bottom-0 translate-x-1/2 translate-y-1/2`}>
        <Sparkle size={7.92} color="var(--color-text-3)" />
      </div>

      {/* accent ticks — 20×3 img horizontal, 4×22 img vertical */}
      <div className={`${tick} top-0 left-[300.24px] h-[2.16px] w-[14.4px] -translate-y-1/2`} />
      <div className={`${tick} bottom-0 left-[302.4px] h-[2.16px] w-[14.4px] translate-y-1/2`} />
      <div className={`${tick} top-[572.4px] left-[161.64px] h-[15.84px] w-[2.88px] -translate-x-1/2`} />
      <div className={`${tick} top-[572.4px] right-[162.36px] h-[15.84px] w-[2.88px] translate-x-1/2`} />
    </div>
  );
}

/** 45° corner cut — measured Δ63/68 · Δ56/64 · Δ61/64. */
const CHAMFER = 45;

export default function About() {
  const q = ABOUT.quote;
  const s = ABOUT.stat;
  return (
    <section id="about" className="scroll-mt-[24px] section-pad relative flex w-full shrink-0 justify-center overflow-clip bg-paper-2">
      <Rails />

      {/* container x275 → x1728, centred on the 720 axis */}
      <div className="relative z-[1] flex w-[1046.16px] items-start">
        {/* LEFT RAIL LABEL — ink x306 y111 → 220.32 / 70.92, box 70.92 − 3.94 */}
        <div className="flex w-[343.44px] shrink-0 items-center gap-[15.12px] pt-[2.08px]">
          <Sparkle size={7.92} color="var(--color-accent)" />
          <p className="eyebrow whitespace-pre text-text">
            {ABOUT.eyebrow.text}
          </p>
        </div>

        {/* RIGHT COLUMN x752 → x1728. Headline ink y112 → 71.64, box 71.64 − 6.74 */}
        <div className="flex w-[702.72px] shrink-0 flex-col items-start">
          {/* Four hard lines. Lines 3 and 4 carry a leading space in the
              reference — measured as an 11px img indent on those two only. */}
          <h2 className="text-[40px] leading-[48px] font-medium text-text">
            <span className="block whitespace-pre">{ABOUT.headline.l1.text}</span>
            <span className="block whitespace-pre">{ABOUT.headline.l2.text}</span>
            <span className="block whitespace-pre">{ABOUT.headline.l3.text}</span>
            <span className="block whitespace-pre">{ABOUT.headline.l4.text}</span>
          </h2>

          {/* button — box top 248.04, i.e. 24.73 below the 158.41 headline block */}
          <Link
            href="#contact"
            className="mt-[24.73px] flex h-[48px] items-center justify-center rounded-[8px] bg-ink px-[22px] transition-opacity hover:opacity-85"
          >
            <span className="btn-label whitespace-pre text-on-dark">
              {ABOUT.cta.text}
            </span>
          </Link>

          {/* card row — top 343.08, gutter 23 img → 16.56 */}
          <div className="mt-[48.96px] flex w-full items-start gap-[16.56px]">
            {/* CARD 1 — 375×354 img, chamfer top-right */}
            <div
              className="relative h-[254.88px] w-[270px] shrink-0 rounded-[12px] bg-paper"
              style={{
                clipPath: `polygon(0 0, calc(100% - ${CHAMFER}px) 0, 100% ${CHAMFER}px, 100% 100%, 0 100%)`,
              }}
            >
              {/* stars — ink x783 y521, 133×21 img → 95.76 × 15.12 */}
              <div className="absolute top-[23.04px] left-[22.32px] flex items-center gap-[2.88px]">
                {Array.from({ length: q.stars }, (_, i) => (
                  <svg key={i} width={17.28} height={15.12} viewBox="0 0 24 23" aria-hidden="true">
                    <path
                      d="M12 0l3.09 7.36L23 8.04l-6 5.2 1.8 7.76L12 16.9l-6.8 4.1L7 13.24l-6-5.2 7.91-.68L12 0z"
                      fill="var(--color-accent)"
                    />
                  </svg>
                ))}
              </div>

              {/* quote — ink tops y593/625/658/692, pitch 24; box 74.88 − 5.63 */}
              <div className="absolute top-[69.25px] left-[22.32px] w-[230px]">
                {q.body.map((line, i) => (
                  <p
                    key={i}
                    className="body-text whitespace-pre text-text-2"
                  >
                    {line.text}
                  </p>
                ))}
              </div>

              {/* avatar — x780 y754, 62×62 img → 44.64. Waiting on the client
                  photograph that goes with the quote. */}
              <span
                aria-hidden="true"
                className="absolute top-[190.8px] left-[20.16px] block h-[44.64px] w-[44.64px] rounded-full border border-rule-card bg-paper-3"
              />
              {/* name ink y757 → box 187.46 · role ink y793 → box 213.06 */}
              <p className="absolute top-[187.46px] left-[84.24px] text-[16px] leading-[26px] font-semibold whitespace-pre text-text">
                {q.name.text}
              </p>
              <p className="absolute top-[213.06px] left-[84.24px] small-text whitespace-pre text-text-2">
                {q.role.text}
              </p>
            </div>

            {/* CARD 2 — 578×354 img, chamfer top-left and bottom-right */}
            <div
              className="relative h-[254.88px] w-[416.16px] shrink-0 rounded-[12px] bg-paper"
              style={{
                clipPath: `polygon(${CHAMFER}px 0, 100% 0, 100% calc(100% - ${CHAMFER}px), calc(100% - ${CHAMFER}px) 100%, 0 100%, 0 ${CHAMFER}px)`,
              }}
            >
              {/* stat ink x1203 y527 → box 18.61 · label ink x1312 y537 → box 29.06 */}
              <p className="absolute top-[18.61px] left-[38.16px] text-[33px] leading-[44px] font-semibold tracking-[-1px] whitespace-pre text-text">
                {s.value.text}
              </p>
              <p className="absolute top-[29.06px] left-[116.64px] body-text whitespace-pre text-text-2">
                {s.label.text}
              </p>

              {/* portrait — x1529 y517, 172×175 img → 123.84 × 126, inset 20.16.
                  Waiting on a photograph of the founder. */}
              <span
                aria-hidden="true"
                className="absolute top-[20.16px] right-[20.16px] block h-[126px] w-[123.84px] rounded-[8px] border border-rule-card bg-paper-3"
              />

              {/* attribution — ink x1180, on card 1's baselines */}
              <p className="absolute top-[187.46px] left-[21.6px] text-[16px] leading-[26px] font-semibold whitespace-pre text-text">
                {s.name.text}
              </p>
              <p className="absolute top-[213.06px] left-[21.6px] small-text whitespace-pre text-text-2">
                {s.role.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
