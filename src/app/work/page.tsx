import type { Metadata } from 'next';
import { InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import WorkCard from '@/components/WorkCard';
import { Chip, Bars } from '@/components/ui';
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

   The grid below renders components/WorkCard, the same card the homepage
   uses. It was a second copy of that markup until the homepage card was
   rebuilt and this one was not, and the same three initiatives appeared as
   full-bleed art on one page and as pale screenshots on the next.
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
            <div key={item.slug} className={i === 2 ? 'col-span-2 mobile:col-span-1' : undefined}>
              <WorkCard
                wide={i === 2}
                showSummary
                item={{
                  slug: item.slug,
                  name: item.name,
                  status: item.status,
                  meta: `${item.year} · ${item.category}`,
                  tags: item.tags,
                  src: item.cover,
                  alt: item.coverAlt,
                  art: item.art,
                  tone: item.tone,
                  summary: item.summary,
                }}
              />
            </div>
          ))}
        </InView>
      </section>

      <Faq />
      <Close />
    </>
  );
}
