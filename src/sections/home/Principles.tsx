import { Rise, InView } from '@/lib/motion';
import { PRINCIPLES as P } from '@/content/home';

/* ============================================================================
   HOW WE OPERATE — block 09, in the testimonial block's geometry.

   WHAT THE REFERENCE PUTS HERE: two named client quotes with portraits, a
   5.0/5 rating, a "verified review" stamp, a date, and two animated figures
   — "70% manual steps removed" and "220,000+ hours returned per month".

   Recalibre has no client, so it has none of that, and the brief is explicit
   that a testimonial layout may carry operating principles instead, without
   quotation marks, names, ratings or review labels. So:

     the two big figures   keep their scale and position and carry the two
                           non-negotiables, set as words at the same size
     the quote cards       keep their card geometry, their stagger and their
                           reveal, and carry three rules about how the work
                           is done rather than claims about what it achieved

   There is no attribution anywhere in this block, because there is nobody to
   attribute it to. A principle stated in the firm's own voice is honest; the
   same sentence in quotation marks is a testimonial nobody gave.
   ========================================================================= */
export default function Principles() {
  return (
    <section aria-labelledby="principles-head" className="w-full overflow-clip pad-top">
      <div className="shell pad-x flex w-full flex-col gap-[48px]">
        <div className="flex items-end justify-between gap-[40px] narrow:flex-col narrow:items-start narrow:gap-[20px]">
          <div className="flex flex-col gap-[16px]">
            <p className="t-mono text-ink-3">{P.eyebrow}</p>
            <Rise as="h2" id="principles-head" lines={P.headline} className="t-display max-w-[14ch] text-ink" />
          </div>
          <p className="t-body-lg max-w-[44ch] text-ink-2">{P.lede}</p>
        </div>

        {/* the two figure slots, carrying words */}
        <div className="grid grid-cols-2 gap-px border-y border-rule-3 bg-rule-3 mobile:grid-cols-1">
          {P.pillars.map((p, i) => (
            <InView key={p.label} delay={i * 110} className="flex flex-col gap-[10px] bg-ground py-[36px] pr-[24px]">
              <p className="t-figure text-ink">
                {p.big} <span className="text-ink-3">{p.small}</span>
              </p>
              <p className="t-mono-9 text-ink-2">{p.label}</p>
            </InView>
          ))}
        </div>

        {/* the three principles, in the quote-card geometry */}
        <div className="grid grid-cols-3 gap-[16px] tablet:grid-cols-1 mobile:grid-cols-1">
          {P.items.map((item, i) => (
            <InView key={item.n} delay={i * 90} className="flex">
              <div className="flex w-full flex-col gap-[18px] rounded-[24px] border border-rule-2 bg-panel p-[28px] transition-colors duration-[300ms] ease-hover hover:border-[rgba(255,255,255,0.24)] mobile:p-[22px]">
                <p className="t-mono-11 text-lime">{item.n}</p>
                <h3 className="t-lede max-w-[24ch] text-ink">{item.title}</h3>
                <p className="t-small text-ink-2">{item.body}</p>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}
