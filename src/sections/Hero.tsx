import Link from 'next/link';
import { Arrow, SplitText } from '@/lib/prim';
import { HERO } from '@/lib/content';
import Nav from './Nav';
import Img from '@/lib/Img';

/**
 * HERO — measured y0 x0 1440×900. background rgb(8,16,20), overflow clip.
 * Layer 1: img absolute inset-0, 1440×900, attr 3200×1800, object-fit cover at
 *          object-position 50% 50% (66% 50% at <=809.98px so the tall
 *          crop keeps the wordmark plate in frame), loading eager.
 * Layer 2: scrim linear-gradient(rgba(8,16,20,0) 33%, rgb(8,16,20) 100%).
 * Shell x120 w1200, pad 0 20px 20px → content column x140 w1160.
 * Stack: gap 36px, pad-bottom 60px, justify end. Inner gap 20px.
 * h1 maxW 764px · 72px/79.2px w400 ls -4.32px. sub maxW 540px · 18px/25.2px.
 * Buttons h50.41 (pad 14px 20px), gap 20px, radius 0px.
 * Strap y840.41 h39.59, pad-top 20px, two 575px halves, 14px/19.6px.
 */
export default function Hero() {
  return (
    <section // measured heights: 100vh at 1200px+, 80vh at 810-1199.98px, 82vh at <=809.98px
      className="relative flex h-[100vh] w-full shrink-0 items-center justify-center gap-[10px] overflow-clip bg-[rgb(8,16,20)] tablet:h-[80vh] mobile:h-[82vh]">
      <div className="absolute inset-0 overflow-clip">
        <div className="absolute inset-0">
          <Img
            src="/img/hero-showroom.webp"
            alt="The Recalibre showroom, the company name on a lit blue wall."
            priority
            sizes="100vw"
            className="hero-appear block h-full w-full overflow-clip object-cover object-[50%_50%] mobile:object-[66%_50%]"
          />
        </div>
      </div>

      <Nav />

      {/* scrim: measured stop positions 33% → 100% */}
      {/* scrim stops measured 33% at 1200px+ and in the middle band, 30% at
          <=809.98px. Set per breakpoint in globals.css. */}
      <div className="hero-scrim relative flex h-full min-w-0 flex-1 items-center justify-center gap-[10px] overflow-clip">
        <div className="relative flex h-full min-w-0 max-w-[1200px] flex-1 flex-col items-start justify-end overflow-clip px-[20px] pb-[20px] mobile:h-auto mobile:self-end">
          <div className="relative flex w-full shrink-0 flex-col items-start justify-center gap-[36px] overflow-clip pb-[60px] mobile:pb-0">
            <div className="flex w-full shrink-0 flex-col items-start justify-center gap-[20px]">
              <div className="flex max-w-[764px] shrink-0 flex-col justify-start">
                <h1 className="t-h1 whitespace-pre-wrap text-[rgb(255,255,255)]">
                  <SplitText>{HERO.headline.text}</SplitText>
                </h1>
              </div>
              <div className="flex max-w-[540px] shrink-0 flex-col justify-start">
                <p className="lead-text whitespace-pre-wrap text-[rgb(200,200,200)]">
                  {HERO.sub.text}
                </p>
              </div>
            </div>

            <div className="flex w-full shrink-0 items-center justify-start gap-[20px] overflow-clip mobile:flex-col mobile:items-stretch mobile:gap-[12px]">
              <div className="shrink-0">
                <Link
                  href="#contact"
                  className="btn-hover-light flex items-center justify-center gap-[10px] px-[20px] py-[14px]"
                >
                  <div className="flex shrink-0 flex-col justify-start">
                    <p className="text-[16px] leading-[22.4px] font-medium whitespace-pre text-[rgb(8,16,20)]">
                      {HERO.primaryCta.text}
                  </p>
                </div>
                  <Arrow offset={24} resting="ink" incoming="ink" />
                </Link>
              </div>
              <div className="shrink-0">
                <Link
                  href="#products"
                  className="flex items-center justify-center gap-[10px] bg-[rgba(255,255,255,0)] px-[20px] py-[14px]"
                >
                  <div className="flex shrink-0 flex-col justify-start">
                    <p className="text-[16px] leading-[22.4px] font-medium whitespace-pre text-[rgb(255,255,255)]">
                      {HERO.secondaryCta.text}
                  </p>
                </div>
                </Link>
              </div>
            </div>
          </div>

          {/* strap: two flex-1 halves (575px each at 1440), one left one right */}
          <div // measured: the strap is not laid out at <=809.98px
          className="flex w-full shrink-0 items-center justify-between overflow-clip pt-[20px] mobile:hidden">
            <div className="flex min-w-0 flex-1 items-center justify-center gap-[10px] overflow-clip">
              <div className="flex min-w-0 flex-1 flex-col justify-start">
                <p className="small-text whitespace-pre-wrap text-[rgb(255,255,255)]">
                  {HERO.footLeft.text}
                </p>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-start">
                <p className="text-right small-text whitespace-pre-wrap text-[rgb(255,255,255)]">
                  {HERO.footRight.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
