import Link from 'next/link';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { ARTICLES, INSIGHTS_BLOCK as I } from '@/content/insights';

/* ============================================================================
   INSIGHTS — block 12. Measured 1377px: a header with a "Read all" control
   and three article cards, each with a circular lime date badge.

   The reference's cards, badge, hover and stacking are kept exactly. What
   changed is what they point at: three method pieces written from
   Recalibre's own work, with no client result and no borrowed statistic in
   any of them. The byline is the firm, because naming an author means
   naming an employee.
   ========================================================================= */
export default function Insights() {
  return (
    <section id="insights" aria-labelledby="insights-head" className="w-full overflow-clip pad-top scroll-mt-[60px]">
      <div className="shell pad-x flex w-full flex-col gap-[40px]">
        <div className="flex items-end justify-between gap-[40px] narrow:flex-col narrow:items-start narrow:gap-[20px]">
          <div className="flex flex-col gap-[16px]">
            <p className="t-mono text-ink-3">{I.eyebrow}</p>
            <Rise as="h2" id="insights-head" lines={I.headline} className="t-display text-ink" />
            <p className="t-body-lg max-w-[48ch] text-ink-2">{I.lede}</p>
          </div>
          <Link href={I.cta.href} className="pill focus-ring t-btn shrink-0">
            {I.cta.label}
            <span aria-hidden="true" className="block h-[5px] w-[5px] rounded-full bg-lime" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-[16px] tablet:grid-cols-2 mobile:grid-cols-1">
          {ARTICLES.map((a, i) => (
            <InView key={a.slug} delay={i * 90} className="flex">
              <Link
                href={`/insights/${a.slug}`}
                className="group focus-ring flex w-full flex-col overflow-clip rounded-[24px] border border-rule-2 bg-panel transition-[border-color,background-color] duration-[300ms] ease-hover hover:border-[rgba(255,255,255,0.28)] hover:bg-raised"
              >
                <div className="relative aspect-[16/10] w-full overflow-clip bg-ground">
                  <Img
                    src={a.src}
                    alt={a.alt}
                    sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 440px"
                    className="block h-full w-full object-cover transition-transform duration-[600ms] ease-hover group-hover:scale-[1.03]"
                  />
                  {/* the lime date badge — measured 70x70, radius 100px */}
                  <span className="absolute right-[14px] top-[14px] flex h-[70px] w-[70px] flex-col items-center justify-center rounded-full bg-lime text-scrim">
                    <span className="t-mono-9">{a.month}</span>
                    <span className="t-card leading-none">{a.day}</span>
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-[12px] p-[22px]">
                  <p className="t-mono-9 text-ink-3">
                    {a.subject} · {a.minutes} min read
                  </p>
                  <h3 className="t-lede text-ink">{a.title}</h3>
                  <p className="t-small text-ink-2">{a.dek}</p>
                  <p className="t-mono-9 mt-auto pt-[10px] text-ink-3 transition-colors duration-[300ms] group-hover:text-lime">
                    READ MORE
                  </p>
                </div>
              </Link>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}
