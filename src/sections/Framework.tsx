import { Eyebrow, H2, Rule } from '@/lib/prim';
import { FRAMEWORK } from '@/lib/content';

/**
 * FRAMEWORK — measured y3148 x120 1200×919.
 * section: flex column, gap 100px, padding 120px 20px 0px 20px.
 *          Vertical padding is ASYMMETRIC: 120 top, 0 bottom.
 * head 1160×158, gap 24px, h2 wrap maxW 744px.
 * grid 1160×440:
 *      grid-template-columns 348px 348px 348px
 *      grid-template-rows    180px 180px
 *      row-gap 80px, column-gap 58px   ← the gaps are DIFFERENT on purpose
 *      item x 140 / 546 / 952 → pitch 406 = 348 + 58
 * item 346×180 (maxW 346px inside a 348px track — a measured 2px inset),
 *      gap 44px: a 24×24 solid ink square, then a 112px text block (gap 16px).
 * Section closes on a 1160×1 hairline of rgba(8,16,20,0.12) at y4066.
 */
export default function Framework() {
  return (
    <section className="mx-auto flex w-full max-w-[1200px] shrink-0 flex-col items-center justify-center gap-[100px] overflow-clip px-[20px] pt-[120px] pb-0 mobile:gap-[46px] mobile:py-[60px]">
      <div className="flex w-full shrink-0 flex-col items-start justify-center gap-[24px] overflow-clip">
        <Eyebrow>{FRAMEWORK.eyebrow.text}</Eyebrow>
        <div className="flex max-w-[744px] shrink-0 flex-col justify-start">
          <H2>{FRAMEWORK.heading.text}</H2>
        </div>
      </div>

      <div className="grid w-full shrink-0 justify-center [grid-template-columns:348px_348px_348px] [grid-template-rows:180px_180px] [column-gap:58px] [row-gap:80px] tablet:[grid-template-columns:repeat(2,minmax(0,1fr))] tablet:[grid-template-rows:180px_180px_180px] mobile:[grid-template-columns:minmax(0,1fr)] mobile:[grid-template-rows:repeat(6,180px)]">
        {FRAMEWORK.steps.map((s, i) => (
          <div key={i} className="max-w-[346px] shrink-0">
            <div className="flex max-w-full flex-col items-start justify-center gap-[44px] overflow-clip">
              <div className="aspect-square w-[24px] shrink-0 bg-[rgb(8,16,20)]" />
              <div className="flex w-full shrink-0 flex-col items-center justify-center gap-[16px] overflow-clip">
                <div className="flex w-full shrink-0 flex-col justify-start">
                  <h3 className="text-left text-[20px] leading-[24px] font-normal tracking-[-0.4px] whitespace-pre-wrap text-[rgb(8,16,20)]">
                    {s.title.text}
                  </h3>
                </div>
                <div className="flex w-full shrink-0 flex-col justify-start">
                  <p className="text-left text-[16px] leading-[24px] whitespace-pre-wrap text-[rgb(112,112,112)]">
                    {s.body.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Rule tone="dark" />
    </section>
  );
}
