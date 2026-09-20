'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SplitText } from '@/lib/prim';
import { APPROACH } from '@/lib/content';

/**
 * APPROACH — measured y5839 x120 1200×967.73.
 * section: flex ROW, align-items center, gap 60px, padding 120px 20px.
 *
 * The two columns are NOT the same height and do NOT start at the same y:
 *   left  x140 550×727.73   (starts y5959)
 *   right x750 550×713.59   (starts y5966.06 — centred, so it sits 7.07px lower)
 * 750 - (140 + 550) = 60, the column gap. 727.73 is 727.73, not 728.
 *
 * left:  image 550×727.73 (aspect-ratio 0.755769/1), padding 12px, justify end,
 *        with a 236×130 white card notched into the bottom-left of the frame.
 *        That card is align-items END, justify space-between: arrow top-right,
 *        label bottom-left.
 * right: flex column, gap 160px. Head 215.2 (gap 24px, h2 wrap maxW 594px,
 *        three lines). Accordion 338.39, gap 24px.
 *        row open   184.8 = 28.8 header + 12 gap + 120 body + 24 pad-bottom
 *        row closed  52.8 = 28.8 header + 24 pad-bottom   (body not laid out)
 *        header: title 270px flex 1, number 270px flex 1 text-align RIGHT,
 *        18px/25.2px — the number sits 1.79px lower than the 24px title.
 */
export default function Approach() {
  const [open, setOpen] = useState(0);

  return (
    <section className="mx-auto flex w-full max-w-[1200px] shrink-0 items-center justify-center gap-[60px] px-[20px] py-[120px] narrow:flex-col tablet:pb-[100px] mobile:gap-[44px] mobile:py-[60px]">
      {/* LEFT */}
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-[10px] overflow-clip narrow:w-full">
        <div className="relative flex aspect-[0.755769/1] w-full shrink-0 flex-col items-start justify-end gap-[10px] p-[12px]">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/cta-portrait.png"
              alt=""
              width={786}
              height={1040}
              loading="lazy"
              sizes="(min-width: 1200px) max((min(100vw, 1200px) - 100px) / 2, 1px), (min-width: 810px) and (max-width: 1199.98px) calc(min(100vw, 1200px) - 40px), (max-width: 809.98px) calc(min(100vw, 1200px) - 40px)"
              className="block h-full w-full overflow-clip object-cover object-center"
            />
          </div>
          <div className="relative h-[130px] w-[236px] shrink-0">
            <Link
              href="/contact"
              className="flex h-full w-full flex-col items-end justify-between overflow-clip bg-[rgb(255,255,255)] p-[12px]"
            >
              <div className="relative flex w-[20px] shrink-0 items-center justify-end gap-[10px] overflow-clip">
                <div className="aspect-square w-[20px] shrink-0 bg-[rgb(8,16,20)]" />
                <div
                  className="arrow-incoming absolute z-[1] aspect-square w-[20px] shrink-0 bg-[rgb(8,16,20)]"
                  style={{ ['--rest-top' as string]: '24px', ['--hover-left' as string]: '24px' }}
                />
              </div>
              <div className="flex w-full shrink-0 flex-col justify-start">
                <p className="text-[16px] leading-[22.4px] font-medium whitespace-pre-wrap text-[rgb(8,16,20)]">
                  {APPROACH.cardCta.text}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      {/* right column gap measured 160px at 1200px+, 80px in the middle band, 36px on mobile */}
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-[160px] overflow-clip narrow:w-full tablet:gap-[80px] mobile:gap-[36px]">
        <div className="flex w-full shrink-0 flex-col items-center justify-center gap-[24px] overflow-clip">
          <div className="flex w-full shrink-0 flex-col justify-start">
            <p className="text-left text-[14px] leading-[19.6px] font-semibold tracking-[0.84px] whitespace-pre-wrap uppercase text-[rgb(8,16,20)]">
              {APPROACH.eyebrow.text}
            </p>
          </div>
          <div className="flex w-full max-w-[594px] shrink-0 flex-col justify-start">
            <h2 className="text-left t-h2 whitespace-pre-wrap text-[rgb(8,16,20)]">
              <SplitText>{APPROACH.heading.text}</SplitText>
            </h2>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col items-center justify-center gap-[24px] overflow-clip">
          {APPROACH.rows.map((r, i) => (
            <div key={r.n} className="w-full shrink-0">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-expanded={open === i}
                className="flex w-full cursor-pointer flex-col items-center justify-center gap-[12px] overflow-hidden pb-[24px] text-left"
              >
                <div className="flex w-full shrink-0 items-center justify-center gap-[10px]">
                  <div className="flex min-w-0 flex-1 flex-col justify-start">
                    <h3 className="text-[24px] leading-[28.8px] font-normal tracking-[-0.96px] whitespace-pre-wrap text-[rgb(8,16,20)]">
                      {r.title.text}
                    </h3>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-start">
                    <p className="text-right text-[18px] leading-[25.2px] whitespace-pre-wrap text-[rgb(8,16,20)]">
                      {r.n}
                    </p>
                  </div>
                </div>
                {open === i && (
                  <div className="flex w-full shrink-0 flex-col justify-start">
                    <p className="text-[16px] leading-[24px] whitespace-pre-wrap text-[rgb(112,112,112)]">
                      {r.body.text}
                    </p>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
