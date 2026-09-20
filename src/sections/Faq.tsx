'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eyebrow, H2 } from '@/lib/prim';
import { FAQ } from '@/lib/content';

/**
 * FAQ — measured y7740.73 x120 1200×918.
 * section: flex row, align-items START, gap 112px,
 *          padding 112px 20px 160px 20px — ASYMMETRIC (112 top, 160 bottom).
 * left  x140 494×646, justify space-between, maxW 494px
 * right x746 554×646, gap 34px, overflow hidden
 * 746 - (140 + 494) = 112, the column gap.
 *
 * Rows measured (pitch = height + 34):
 *   open   238 = 48 header + 22 gap + 144 body + 24 padding-bottom
 *   closed  56 = 24 header + 32 padding-bottom   (1-line question)
 *   closed  80 = 48 header + 32 padding-bottom   (2-line question)
 * Icon 24×24, overflow hidden, holding TWO bars of rgb(112,112,112) at
 * border-radius 10px: 16×2 at top 11px left 4px, and 2×16 at top 4px left 11px.
 * Both bars are present in both states. The wrapper's transform is
 * rotate(180deg) when open and rotate(90deg) when closed — measured as
 * matrix(-1,0,0,-1,0,0) and matrix(0,1,-1,0,0,0).
 */
export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="mx-auto flex w-full max-w-[1200px] shrink-0 items-start justify-center gap-[112px] overflow-clip px-[20px] pt-[112px] pb-[160px] narrow:flex-col tablet:gap-[36px] mobile:gap-[24px] mobile:py-[60px]">
      {/* LEFT */}
      {/* the 494px cap is measured at EVERY width (head is 494x114 even at 768) */}
      <div className="flex min-w-0 max-w-[494px] flex-1 flex-col items-start justify-between self-stretch overflow-clip narrow:w-full">
        <div className="flex w-full shrink-0 flex-col items-start justify-center gap-[24px] overflow-clip">
          <Eyebrow>{FAQ.eyebrow.text}</Eyebrow>
          <div className="flex w-full max-w-[494px] shrink-0 flex-col justify-start">
            <H2>{FAQ.heading.text}</H2>
          </div>
        </div>

        {/* 494×150 white card, padding 20px, align-items END, justify space-between */}
        {/* measured display:none at every width below 1200px — the card is desktop only */}
        <div className="relative w-full shrink-0 narrow:hidden">
          <Link
            href="/contact"
            className="flex h-[150px] w-full flex-col items-end justify-between overflow-clip bg-[rgb(255,255,255)] p-[20px]"
          >
            <div className="relative flex w-[20px] shrink-0 items-center justify-end gap-[10px] overflow-clip">
              <div className="aspect-square w-[20px] shrink-0 bg-[rgb(8,16,20)]" />
              <div
                className="arrow-incoming absolute z-[1] aspect-square w-[20px] shrink-0 bg-[rgb(8,16,20)]"
                style={{ ['--rest-top' as string]: '24px', ['--hover-left' as string]: '24px' }}
              />
            </div>
            <div className="flex w-full shrink-0 flex-col items-center justify-center gap-[6px] overflow-clip">
              <div className="flex w-full shrink-0 flex-col justify-start">
                <p className="text-[16px] leading-[22.4px] font-medium whitespace-pre-wrap text-[rgb(8,16,20)]">
                  {FAQ.card.title.text}
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col justify-start">
                <p className="text-[14px] leading-[19.6px] whitespace-pre-wrap text-[rgb(112,112,112)]">
                  {FAQ.card.sub.text}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* RIGHT */}
      <div className="min-w-0 flex-1 narrow:w-full">
        <div className="flex flex-col items-center justify-center gap-[34px] overflow-hidden">
          {FAQ.rows.map((r, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="w-full shrink-0">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className={`flex w-full cursor-pointer flex-col items-center justify-center overflow-clip text-left ${
                    isOpen ? 'gap-[22px] pb-[24px]' : 'gap-[10px] pb-[32px]'
                  }`}
                >
                  <div className="flex w-full shrink-0 items-center justify-center gap-[10px] overflow-clip">
                    <div className="flex min-w-0 flex-1 flex-col justify-start">
                      {/* measured: the OPEN question is rgb(8,16,20); the closed ones rgb(112,112,112) */}
                      <h3
                        className={`text-[20px] leading-[24px] font-normal tracking-[-0.4px] whitespace-pre-wrap ${
                          isOpen ? 'text-[rgb(8,16,20)]' : 'text-[rgb(112,112,112)]'
                        }`}
                      >
                        {r.q.text}
                      </h3>
                    </div>
                    <div
                      className="relative z-[1] h-[24px] w-[24px] shrink-0 overflow-hidden"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(90deg)' }}
                    >
                      <div className="absolute h-[2px] w-[16px] rounded-[10px] bg-[rgb(112,112,112)]" style={{ top: '11px', left: '4px' }} />
                      <div className="absolute h-[16px] w-[2px] rounded-[10px] bg-[rgb(112,112,112)]" style={{ top: '4px', left: '11px' }} />
                    </div>
                  </div>
                  {isOpen && (
                    <div className="flex w-full shrink-0 flex-col justify-start">
                      <p className="text-[16px] leading-[24px] whitespace-pre-wrap text-[rgb(112,112,112)]">
                        {r.a.text}
                      </p>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
