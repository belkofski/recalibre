import type { Metadata } from 'next';
import Link from 'next/link';
import Img from '@/lib/Img';
import { InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import ContraxisDrawing from '@/components/ContraxisDrawing';
import { Pill, Chip, Bars } from '@/components/ui';
import { INITIATIVES, WORK_INDEX as W } from '@/content/work';
import Faq from '@/sections/home/Faq';
import Close from '@/sections/home/Close';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Three initiatives: OPS and Contraxis, both products in development, and Belkofski, a brand Recalibre owns.',
};

/* ============================================================================
   THE WORK INDEX — the reference's case-study index, composed the same way.

   Its opener is a split: heading and lede on the left, a search field, a
   filter row and a counter on the right. Two changes:

     THE COUNTER IS GONE. It animates "0% repeat or referral clients", which
     is both a performance claim and a client claim. The bar graphic keeps
     its position and carries the disciplines these three cover.

     THE SEARCH IS GONE. A search box over three entries is furniture
     pretending to be a control. The filter row stays, rendered as what it
     actually is here: the set of disciplines on the page.
   ========================================================================= */
export default function WorkIndex() {
  return (
    <>
      <PageHead
        lines={W.headline}
        lede={W.lede}
        aside={
          <InView className="flex flex-col gap-[40px]">
            <div className="flex flex-wrap gap-[8px]">
              {W.filters.slice(1).map((f) => (
                <Chip key={f}>{f}</Chip>
              ))}
            </div>
            <div className="flex items-end gap-[14px] border-t border-rule-2 pt-[30px]">
              <Bars total={12} lit={7} className="h-[34px]" />
              <span className="t-mono text-ink-2">THREE INITIATIVES · TWO IN DEVELOPMENT · ONE OURS</span>
            </div>
          </InView>
        }
      />

      <section aria-label="Initiatives" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <InView className="seam shell grid w-full grid-cols-2 mobile:grid-cols-1">
          {INITIATIVES.map((item, i) => (
            <Link
              key={item.slug}
              href={`/work/${item.slug}`}
              className={`card-30 group focus-ring relative flex flex-col justify-end overflow-clip p-[30px] mobile:p-[20px] ${
                i === 2 ? 'col-span-2 aspect-[2.93/1] mobile:col-span-1 mobile:aspect-square' : 'aspect-square'
              }`}
            >
              {item.cover ? (
                <Img
                  src={item.cover}
                  alt={item.coverAlt}
                  sizes="(max-width: 809px) 100vw, 687px"
                  className="media-fill transition-transform duration-[900ms] ease-[var(--ease-in-view)] group-hover:scale-[1.03]"
                />
              ) : (
                <span className="absolute inset-0 flex items-start justify-center bg-ground pt-[7%] [&>svg]:max-h-[66%] [&>svg]:max-w-[80%]">
                  <ContraxisDrawing />
                </span>
              )}
              <span className="grain grain-soft absolute inset-0" aria-hidden="true" />
              <span
                className="absolute inset-0 bg-gradient-to-t from-ground/85 via-ground/10 to-transparent"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute inset-0 rounded-[30px] border border-transparent transition-colors duration-300 group-hover:border-rule mobile:rounded-[20px]"
                aria-hidden="true"
              />

              <span
                className={`absolute ${
                  item.cover ? 'inset-0 flex items-center justify-center' : 'left-[30px] top-[30px] mobile:left-[20px] mobile:top-[20px]'
                }`}
              >
                <span className="pill t-tag border-rule-2 bg-ground/60 text-ink backdrop-blur-[2px]">
                  {item.status}
                </span>
              </span>

              <span className="relative flex items-end justify-between gap-[20px] mobile:flex-col mobile:items-start mobile:gap-[14px]">
                <span className="flex flex-col gap-[10px]">
                  <span className="t-card text-ink">{item.name}.</span>
                  <span className="t-mono text-ink-2">
                    {item.year} · {item.category}
                  </span>
                  <span className="t-small max-w-[440px] text-ink-2">{item.summary}</span>
                </span>
                <span className="flex flex-wrap items-center justify-end gap-[8px]">
                  {item.tags.map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </span>
              </span>
            </Link>
          ))}
        </InView>
      </section>

      <Faq />
      <Close />
    </>
  );
}
