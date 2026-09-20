import Link from 'next/link';
import { SplitText } from '@/lib/prim';
import { CASES } from '@/lib/content';

const PLATE_SIZES =
  '(min-width: 1200px) calc(min(100vw, 1200px) - 40px), (min-width: 810px) and (max-width: 1199.98px) calc(min(100vw, 1200px) - 40px), (max-width: 809.98px) calc(min(100vw, 1200px) - 40px)';

/**
 * CASES — measured y4067 x120 1200×1772.
 * section: flex column, gap 44px, padding 120px 20px (symmetric).
 * This is the ONE centred head on the page: eyebrow text-align center, and the
 * h2 wrap measures x348 w744 — centred inside the 1160 column, not left of it.
 * Body 1160×1330, gap 12px: two plates of 1160×659.
 * plate:  background rgb(8,16,20); image absolute top -0.5px bottom 0.5px;
 *         scrim linear-gradient(270deg, rgba(8,16,20,0.4) 24%, rgb(8,16,20) 100%)
 *         — note 270deg, this one runs right-to-left, not downward.
 *         scrim is flex row, align-items END, justify space-between, pad 12px.
 * glass:  482×635, padding 36px, background rgba(8,16,20,0.12),
 *         backdrop-filter blur(5px), radius 0px, justify space-between.
 *         Logo 107×48 (intrinsic 94×24, object-fit contain at 0% 0%).
 */
export default function Cases() {
  return (
    <section className="mx-auto flex w-full max-w-[1200px] shrink-0 flex-col items-center justify-center gap-[44px] overflow-clip px-[20px] py-[120px] mobile:gap-[36px] mobile:py-[60px]">
      <div className="flex w-full shrink-0 flex-col items-center justify-center gap-[24px] overflow-clip">
        <div className="flex w-full shrink-0 flex-col justify-start">
          <p className="text-center text-[14px] leading-[19.6px] font-semibold tracking-[0.84px] whitespace-pre-wrap uppercase text-[rgb(8,16,20)]">
            {CASES.eyebrow.text}
          </p>
        </div>
        <div className="flex max-w-[744px] shrink-0 flex-col justify-start">
          <h2 className="text-center t-h2 whitespace-pre-wrap text-[rgb(8,16,20)]">
            <SplitText>{CASES.heading.text}</SplitText>
          </h2>
        </div>
      </div>

      <div className="relative flex w-full shrink-0 flex-col items-start justify-center gap-[12px] mobile:gap-[20px]">
        {CASES.plates.map((p, i) => (
          <div key={i} className="flex w-full shrink-0 flex-col items-center justify-start gap-[10px]">
            <div className="w-full shrink-0">
              {/* plate height measured 659 / 560 / 640; align-items center at 1200px+,
                  flex-end below (justify stays center at every width) */}
              <div className="relative flex h-[659px] w-full items-center justify-center overflow-clip bg-[rgb(8,16,20)] narrow:items-end tablet:h-[560px] mobile:h-[640px]">
                <div
                  className="absolute z-0 overflow-clip"
                  style={{ top: '-0.5px', right: 0, bottom: '0.5px', left: 0 }}
                >
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.img}
                      alt=""
                      width={p.w}
                      height={p.h}
                      loading="lazy"
                      sizes={PLATE_SIZES}
                      className="block h-full w-full overflow-clip object-cover object-center"
                    />
                  </div>
                </div>
                {/* scrim: flex row / align end / justify space-between / padding 12px with a
                    270deg gradient at 1200px+; flex column / align end / justify end /
                    padding 10px / gap 10px with a downward gradient from 0% below.
                    The gradient itself is set per breakpoint in globals.css. */}
                <div className="cases-scrim relative flex min-w-0 flex-1 items-end justify-between self-stretch overflow-clip p-[12px] narrow:flex-col narrow:justify-end narrow:gap-[10px] narrow:p-[10px]">
                  {/* measured: maxW 482px + padding 36px + justify space-between at 1200px+;
                      maxW none + padding 24px + gap 24px + justify center below */}
                    <div className="flex min-w-0 max-w-[482px] flex-1 flex-col items-start justify-between self-stretch overflow-clip bg-[rgba(8,16,20,0.12)] p-[36px] backdrop-blur-[5px] narrow:w-full narrow:max-w-none narrow:flex-none narrow:justify-center narrow:gap-[24px] narrow:self-auto narrow:p-[24px]">
                    <div className="relative h-[48px] w-[107px] shrink-0">
                      <div className="absolute inset-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/img/badge-wide.png"
                          alt=""
                          width={94}
                          height={24}
                          loading="lazy"
                          className="block h-full w-full overflow-clip object-contain object-[0%_0%]"
                        />
                      </div>
                    </div>
                    <div className="flex w-full shrink-0 flex-col items-center justify-center gap-[24px]">
                      <div className="flex w-full shrink-0 flex-col items-start justify-center gap-[12px] overflow-clip">
                        <div className="flex w-full shrink-0 flex-col justify-start">
                          <h3 className="text-[24px] leading-[28.8px] font-normal tracking-[-0.96px] whitespace-pre-wrap text-[rgb(255,255,255)]">
                            {p.title.text}
                          </h3>
                        </div>
                        <div className="flex w-full shrink-0 flex-col justify-start">
                          <p className="text-[16px] leading-[24px] whitespace-pre-wrap text-[rgb(200,200,200)]">
                            {p.body.text}
                          </p>
                        </div>
                      </div>
                      <div className="flex w-full shrink-0 flex-col justify-start">
                        <p className="text-[16px] leading-[17.6px] font-medium whitespace-pre-wrap text-[rgb(255,255,255)]">
                          <Link href="/work" className="font-[inherit] text-[rgb(255,255,255)]">
                            {p.link.text}
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Measured at EVERY width, but positioned two different ways:
            1200px+   position absolute, z-index 1, 236x130, measured
                      top 1188px right 12px bottom 12px left 912px inside the
                      1160x1330 body — i.e. inset 12px into its bottom-right corner,
                      which lands it over the second plate. Written as right/bottom
                      plus the measured size, which gives the identical box.
            below     position relative, full width, in flow as the body's third
                      child, adding 130px + the body gap. */}
        <div className="absolute right-[12px] bottom-[12px] z-[1] h-[130px] w-[236px] shrink-0 narrow:static narrow:h-auto narrow:w-full">
          <Link
            href="/work"
            className="flex h-[130px] w-full flex-col items-end justify-between overflow-clip bg-[rgb(255,255,255)] p-[12px]"
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
                {CASES.narrowCard.text}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
