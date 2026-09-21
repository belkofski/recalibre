import Link from 'next/link';
import { Rise, InView } from '@/lib/motion';
import { ENGAGEMENT as E } from '@/content/home';

/* ============================================================================
   THE ENGAGEMENT MODEL — block 11, in the pricing block's geometry.

   Measured 1225px: three cards, numbered 01/02/03, one of them flagged
   POPULAR, each with a timeline chip, a feature list, a CTA, and a large
   animated price at the foot.

   ALL THREE CARDS ARE KEPT, with their dimensions, numbering, image
   treatment, responsive stacking and CTA behaviour. Two things change:

     THE PRICE IS GONE. $1,500 / $4,990 / $6,000 per month are the
     reference's numbers, and inventing prices is forbidden. The slot the
     price occupied — same position, same weight — carries the scope
     statement instead.

     THE ODOMETER IS GONE WITH IT. The counter animated a number counting up
     to a price. With no number to count to, the animation has nothing to
     say, so it is not kept for its own sake. The card still reveals on
     scroll like every other card on the page.

     THE TIMELINE CHIP IS GONE. ">5 DAYS" and ">14 DAYS" are delivery times.
     Recalibre publishes none.
   ========================================================================= */
export default function Engagement() {
  return (
    <section id="engagement" aria-labelledby="eng-head" className="w-full overflow-clip pad-top scroll-mt-[60px]">
      <div className="shell pad-x flex w-full flex-col gap-[48px]">
        <div className="flex items-end justify-between gap-[40px] narrow:flex-col narrow:items-start narrow:gap-[20px]">
          <div className="flex flex-col gap-[16px]">
            <p className="t-mono text-ink-3">{E.eyebrow}</p>
            <Rise as="h2" id="eng-head" lines={E.headline} className="t-display text-ink" />
          </div>
          <p className="t-body-lg max-w-[44ch] text-ink-2">{E.lede}</p>
        </div>

        <div className="grid grid-cols-3 gap-[16px] tablet:grid-cols-1 mobile:grid-cols-1">
          {E.cards.map((c, i) => (
            <InView key={c.n} delay={i * 90} className="flex">
              <div
                className={`flex w-full flex-col rounded-[24px] border bg-panel p-[28px] transition-colors duration-[300ms] ease-hover mobile:p-[22px] ${
                  c.popular
                    ? 'border-[rgba(199,255,151,0.34)] bg-raised'
                    : 'border-rule-2 hover:border-[rgba(255,255,255,0.24)]'
                }`}
              >
                <div className="flex items-center justify-between gap-[12px]">
                  <p className="t-mono-11 text-ink-3">{c.n}</p>
                  {c.popular ? (
                    <span className="t-mono-9 rounded-full border border-[rgba(199,255,151,0.34)] px-[10px] py-[4px] text-lime">
                      MOST COMMON
                    </span>
                  ) : null}
                </div>

                <h3 className="t-card mt-[22px] text-ink">{c.title}.</h3>
                <p className="t-small mt-[10px] text-ink-2">{c.note}</p>

                <ul className="mt-[24px] flex flex-col gap-[10px] border-t border-rule-3 pt-[20px]">
                  {c.points.map((p) => (
                    <li key={p} className="t-small flex items-start gap-[10px] text-ink-2">
                      <span
                        aria-hidden="true"
                        className="mt-[6px] block h-[5px] w-[5px] shrink-0 rounded-full bg-lime"
                      />
                      {p}
                    </li>
                  ))}
                </ul>

                {/* where the price was */}
                <p className="t-lede mt-auto max-w-[18ch] pt-[32px] text-ink">{E.scopeLine}</p>

                <Link
                  href="/contact"
                  className={`focus-ring t-btn mt-[20px] ${c.popular ? 'pill pill-solid' : 'pill'}`}
                >
                  {c.cta}
                </Link>
              </div>
            </InView>
          ))}
        </div>

        <p className="t-small max-w-[74ch] text-ink-3">{E.footnote}</p>
      </div>
    </section>
  );
}
