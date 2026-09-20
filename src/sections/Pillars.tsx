import Link from 'next/link';
import { Arrow, Eyebrow, H2 } from '@/lib/prim';
import { PILLARS } from '@/lib/content';

/**
 * PILLARS — measured y990 x120 1200×1122.
 * section: flex row, align-items START, gap 40px, padding 160px 20px 140px 20px.
 *          The vertical padding is ASYMMETRIC: 160 top, 140 bottom.
 * left  column x140 w560 h822  (flex 1 0 0, gap 50px)
 * right column x740 w560 h564.7 (flex 1 0 0, aspect-ratio 0.991667/1)
 * column gap 40px → 740 - (140 + 560) = 40.
 * Head h158, gap 24px. Items h116 each, 50px apart (116 + 50 = 166 pitch).
 * Item marker 36×36, border-radius 100px, background TRANSPARENT (measured).
 */
export default function Pillars() {
  return (
    <section className="mx-auto flex w-full max-w-[1200px] shrink-0 items-start justify-center gap-[40px] px-[20px] pt-[160px] pb-[140px] narrow:flex-col tablet:pt-[120px] mobile:gap-[36px] mobile:py-[60px]">
      {/* LEFT */}
      {/* text column gap measured 50px at 1200px+ and 1024, 36px at <=809.98px */}
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-[50px] narrow:w-full mobile:gap-[36px]">
        <div className="flex w-full shrink-0 flex-col items-center justify-center gap-[24px] overflow-clip">
          <Eyebrow>{PILLARS.eyebrow.text}</Eyebrow>
          <div className="flex w-full shrink-0 flex-col justify-start">
            <H2>{PILLARS.heading.text}</H2>
          </div>
        </div>

        {PILLARS.items.map((it) => (
          <div key={it.n} className="w-full shrink-0">
            <div className="flex flex-col items-start justify-center gap-[20px] overflow-clip">
              {/* 36×36, radius 100px, transparent background — as measured */}
              <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center gap-[10px] overflow-clip rounded-[100px]">
                <div className="flex shrink-0 flex-col justify-start">
                  <p className="text-[14px] leading-[19.6px] whitespace-pre text-[rgb(8,16,20)]">{it.n}</p>
                </div>
              </div>
              <div className="flex w-full shrink-0 flex-col items-center justify-center gap-[12px] overflow-clip">
                <div className="flex w-full shrink-0 flex-col justify-start">
                  <h3 className="text-[20px] leading-[24px] font-normal tracking-[-0.4px] whitespace-pre-wrap text-[rgb(8,16,20)]">
                    {it.title.text}
                  </h3>
                </div>
                <div className="flex w-full shrink-0 flex-col justify-start">
                  <p className="text-[16px] leading-[24px] whitespace-pre-wrap text-[rgb(112,112,112)]">
                    {it.body.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      {/* aspect-ratio measured 0.991667/1 at 1200px+ and in the middle band;
          at <=809.98px it measures 350x440 → 0.795455/1 */}
      {/* measured: the image is the SECOND column at 1200px+ but the FIRST one at
          every narrower width, where the section stacks. aspect-ratio 0.991667/1
          down to 1024, then 0.795455/1 at <=809.98px. */}
      <div className="relative flex aspect-[0.991667/1] min-w-0 flex-1 flex-col items-center justify-center gap-[10px] narrow:order-first narrow:w-full mobile:aspect-[0.795455/1]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/about-portrait.png"
            alt=""
            width={1190}
            height={1200}
            loading="eager"
            sizes="(min-width: 1200px) max((min(100vw, 1200px) - 80px) / 2, 1px), (min-width: 810px) and (max-width: 1199.98px) calc(min(100vw, 1200px) - 40px), (max-width: 809.98px) calc(min(100vw, 1200px) - 40px)"
            className="block h-full w-full overflow-clip object-cover object-center"
          />
        </div>
        {/* scrim: stops measured at 60% → 100% */}
        <div
          className="relative flex min-h-0 w-full flex-1 flex-col items-center justify-end gap-[10px] overflow-clip p-[8px]"
          style={{ backgroundImage: 'linear-gradient(rgba(8, 16, 20, 0) 60%, rgb(8, 16, 20) 100%)' }}
        >
          <div className="w-full shrink-0">
            {/* backdrop-filter blur(5px) over rgba(255,255,255,0.12). radius 0px. */}
            <Link
              href="/contact"
              className="flex items-center justify-center gap-[20px] overflow-clip bg-[rgba(255,255,255,0.12)] p-[16px] backdrop-blur-[5px]"
            >
              <div className="aspect-[1.00519/1] h-[59.69px] w-[60px] shrink-0 rounded-[100px]">
                <div className="absolute-0 relative h-full w-full rounded-[100px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/img/avatar-round.png"
                    alt=""
                    width={774}
                    height={770}
                    loading="eager"
                    sizes="(min-width: 1200px) 60px, (min-width: 810px) and (max-width: 1199.98px) 60px, (max-width: 809.98px) 60px"
                    className="block h-full w-full overflow-clip rounded-[100px] object-cover object-center"
                  />
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[10px] overflow-clip">
                <div className="flex w-full shrink-0 flex-col justify-start">
                  <h3 className="text-[20px] leading-[24px] font-normal tracking-[-0.4px] whitespace-pre-wrap text-[rgb(255,255,255)]">
                    {PILLARS.card.name.text}
                  </h3>
                </div>
                <div className="flex w-full shrink-0 flex-col justify-start">
                  <h3 className="text-[12px] leading-[16.8px] font-medium tracking-[0.72px] whitespace-pre-wrap uppercase text-[rgb(200,200,200)]">
                    {PILLARS.card.role.text}
                  </h3>
                </div>
              </div>
              <div className="relative flex shrink-0 items-center justify-end gap-[10px]">
                <div className="flex shrink-0 flex-col justify-start">
                  <p className="text-[16px] leading-[22.4px] font-medium whitespace-pre text-[rgb(255,255,255)]">
                    {PILLARS.card.cta.text}
                  </p>
                </div>
                <Arrow offset={24} resting="white" incoming="ink" incomingFirst />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
