import Link from 'next/link';
import { ABOUT } from '@/lib/content';
import { HeadLines } from '@/lib/prim';

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
 *
 * THE TWO CARDS ARE GONE — 20 September 2026. They were kept as bracketed
 * placeholders on the argument that a visible empty slot is honest. On a page
 * a client actually reads, they were not:
 *
 *   Card 1 drew five filled stars above [AWAITING CLIENT QUOTE]. A five-star
 *          rating is a graphic claim whether or not the words beneath it are
 *          filled in. There is no review behind it and no client has given one.
 *   Card 2 put [00] and [AWAITING FIGURE] beside the founder's real name and
 *          title, over a grey box standing in for a photograph. It read as a
 *          man vouching for a number that does not exist.
 *
 * The block keeps what is real: the label, the founder's own sentence about
 * who the work is for, and the one ask. It is shorter, and every word in it
 * is true. The cards come back the day there is a client quote with written
 * permission, and a figure somebody measured — see PENDING in
 * blocks-content.ts.
 *
 * PHONE. The rails, the 1046px container and the 702px text column were all
 * fixed. The measured desktop layout is untouched at 1200px and above; below
 * it the two columns stack and the rails — which are decoration keyed to the
 * container's exact edges — come off rather than float somewhere arbitrary.
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

export default function About() {
  return (
    <section id="about" className="scroll-mt-[24px] section-pad relative flex w-full shrink-0 justify-center overflow-clip bg-paper-2">
      {/* Decoration keyed to the container's measured edges (x161.64 / x1277.64).
          Below 1200px the container is narrower than those coordinates, so the
          rails would float across unrelated content. They come off instead. */}
      <div className="narrow:hidden">
        <Rails />
      </div>

      {/* container x275 → x1728, centred on the 720 axis */}
      <div className="relative z-[1] flex w-full max-w-[1046.16px] items-start narrow:flex-col narrow:items-start narrow:gap-[28px]">
        {/* LEFT RAIL LABEL — ink x306 y111 → 220.32 / 70.92, box 70.92 − 3.94 */}
        <div className="flex w-[343.44px] shrink-0 items-center gap-[15.12px] pt-[2.08px] narrow:w-full narrow:pt-0">
          <Sparkle size={7.92} color="var(--color-accent)" />
          <p className="eyebrow whitespace-pre text-text">
            {ABOUT.eyebrow.text}
          </p>
        </div>

        {/* RIGHT COLUMN x752 → x1728. Headline ink y112 → 71.64, box 71.64 − 6.74 */}
        <div className="flex w-[702.72px] shrink-0 flex-col items-start narrow:w-full">
          {/* Four hard lines. Lines 3 and 4 carry a leading space in the
              reference — measured as an 11px img indent on those two only. */}
          <HeadLines
            lines={[
              ABOUT.headline.l1.text,
              ABOUT.headline.l2.text,
              ABOUT.headline.l3.text,
              ABOUT.headline.l4.text,
            ]}
            className="sentence-head text-text"
          />

          {/* button — box top 248.04, i.e. 24.73 below the 158.41 headline block */}
          <Link
            href="#contact"
            className="focus-ring mt-[24.73px] flex h-[48px] items-center justify-center rounded-[8px] bg-ink px-[22px] transition-opacity hover:opacity-85"
          >
            <span className="btn-label whitespace-pre text-on-dark">
              {ABOUT.cta.text}
            </span>
          </Link>

        </div>
      </div>
    </section>
  );
}
