import Link from 'next/link';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { LabelRow, Tick, Btn, MonoLink } from '@/components/ui';
import { INSIGHTS_BLOCK } from '@/content/home';
import { ARTICLES } from '@/content/insights';

/* ============================================================================
   INSIGHTS.

   The reference's article block: a centred label, heading, hairline drop,
   lede and button, then a seam plate holding one tall media card beside a
   stack of article rows, each with its category, a two-line title, a
   standfirst, a read link and a lime circular date badge.

   The structure is CMS-shaped and the articles behind it are real — three
   method pieces written from Recalibre's own work, with no client, result,
   statistic or citation in any of them.
   ========================================================================= */

export default function Insights() {
  const I = INSIGHTS_BLOCK;
  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col items-center gap-[70px] mobile:gap-[40px]">
        <div className="flex w-full flex-col items-center gap-[70px] mobile:gap-[30px]">
          <LabelRow label={I.label} />
          <div className="flex flex-col items-center gap-[30px]">
            <Rise as="h2" lines={I.headline} className="t-display text-center text-ink" />
            <Tick />
            <InView className="flex flex-col items-center gap-[30px]">
              <p className="t-body max-w-[360px] text-center text-ink-2">{I.lede}</p>
              <Btn href={I.cta.href} label={I.cta.label} />
            </InView>
          </div>
        </div>

        <InView className="seam grid w-full grid-cols-2 narrow:grid-cols-1">
          <div className="card-30 relative min-h-[723px] overflow-clip narrow:min-h-[320px]">
            <Img
              src={I.media}
              alt={I.mediaAlt}
              sizes="(max-width: 1199px) 100vw, 687px"
              className="media-fill"
            />
            <span className="grain grain-soft absolute inset-0" aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-[2px]">
            {ARTICLES.map((a) => (
              <article
                key={a.slug}
                className="card-30 group relative flex flex-1 items-start justify-between gap-[30px] p-[30px] transition-colors duration-300 hover:bg-white/[0.02] mobile:p-[20px]"
              >
                <div className="flex flex-col gap-[16px]">
                  <span className="t-mono text-ink-2">{a.subject}</span>
                  <h3 className="t-card max-w-[470px] text-ink">
                    <Link href={`/insights/${a.slug}`} className="focus-ring tap-44">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {a.title}
                    </Link>
                  </h3>
                  <p className="t-caption max-w-[510px] text-ink-2">{a.dek}</p>
                  <MonoLink href={`/insights/${a.slug}`} label="READ MORE" />
                </div>

                <span className="flex size-[72px] flex-none flex-col items-center justify-center rounded-full bg-lime mobile:size-[58px]">
                  <span className="t-mono-9 text-ground/70">{a.month}</span>
                  <span className="t-body-lg !leading-[22px] text-ground">{a.day}</span>
                  <span className="t-mono-9 text-ground/70">{a.year}</span>
                </span>
              </article>
            ))}
          </div>
        </InView>
      </div>
    </section>
  );
}
