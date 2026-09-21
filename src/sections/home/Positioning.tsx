import Link from 'next/link';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { POSITIONING as P } from '@/content/home';

/* ============================================================================
   THE FIRM — block 04. Measured 541px, 150px of top padding, split editorial.

   THE COUNTERS. The reference animates "80+ systems in production" and "19
   days to average first launch" at 64px here. Both are performance claims.

   The two slots keep their scale, their position and their reveal, and carry
   three structural facts instead — five capabilities, three stages, two
   products in development. Three rather than two is a deliberate adjustment:
   those are the exact three facts the founder named, and every one of them
   can be counted on this site rather than taken on trust.
   ========================================================================= */
export default function Positioning() {
  return (
    <section aria-labelledby="firm-head" className="w-full overflow-clip pad-top">
      <div className="shell pad-x flex w-full flex-col gap-[48px]">
        <div className="flex items-start justify-between gap-[48px] narrow:flex-col narrow:gap-[28px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[16px]">
            <p className="t-mono text-ink-3">{P.eyebrow}</p>
            <Rise as="h2" id="firm-head" lines={P.headline} className="t-display max-w-[14ch] text-ink" />
          </div>

          <div className="flex w-[460px] shrink-0 flex-col gap-[24px] narrow:w-full">
            <p className="t-body-lg text-ink-2">{P.body}</p>
            <Link href={P.cta.href} className="pill focus-ring t-btn self-start">
              {P.cta.label}
              <span aria-hidden="true" className="block h-[5px] w-[5px] rounded-full bg-lime" />
            </Link>
          </div>
        </div>

        {/* the three figures */}
        <div className="grid grid-cols-3 gap-px border-y border-rule-3 bg-rule-3 mobile:grid-cols-1">
          {P.figures.map((f, i) => (
            <InView key={f.label} className="flex flex-col gap-[10px] bg-ground py-[32px] pr-[24px]" delay={i * 90}>
              <p className="t-figure text-ink">
                {f.value}
                {f.unit ? <span className="t-card text-ink-3"> {f.unit}</span> : null}
              </p>
              <p className="t-small max-w-[26ch] text-ink-2">{f.label}</p>
            </InView>
          ))}
        </div>

        <InView>
          <figure className="card media-scrim relative m-0 aspect-[21/9] w-full mobile:aspect-[4/3]">
            <Img
              src={P.media}
              alt={P.mediaAlt}
              sizes="(max-width: 1199px) 100vw, 1380px"
              className="block h-full w-full object-cover object-[center_40%]"
            />
          </figure>
        </InView>
      </div>
    </section>
  );
}
