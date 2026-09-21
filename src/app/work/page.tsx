import type { Metadata } from 'next';
import Link from 'next/link';
import Img from '@/lib/Img';
import { InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import ContraxisDrawing from '@/components/ContraxisDrawing';
import { INITIATIVES, WORK_INDEX as W } from '@/content/work';
import Faq from '@/sections/home/Faq';
import Close from '@/sections/home/Close';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Three initiatives: OPS and Contraxis, both products in development, and Belkofski, a brand Recalibre owns. No client case study appears on this site without written permission.',
};

/* ============================================================================
   THE WORK INDEX.

   The reference runs a filter row over eight entries with a counter above it.
   Three things change:

     THE COUNTER IS GONE. It animates "0% repeat or referral clients", which
     is both a performance claim and a client claim.

     THE FILTER ROW IS KEPT but is not interactive with three entries. A
     filter that can only ever narrow three items to two is furniture
     pretending to be a control, so the row is rendered as what it actually
     is here: the set of disciplines these three cover.

     THE RESERVED SLOT IS VISIBLE. Saying what is missing is better than
     quietly making the grid narrower.

   The page closes with the FAQ and the CTA, exactly as the reference's
   inner pages do.
   ========================================================================= */
export default function WorkIndex() {
  return (
    <>
      <PageHead eyebrow={W.eyebrow} lines={W.headline} lede={W.lede}>
        <div className="mt-[10px] flex flex-wrap gap-[6px]">
          {W.filters.slice(1).map((f) => (
            <span key={f} className="tag t-tag">
              {f}
            </span>
          ))}
        </div>
      </PageHead>

      <section aria-label="Initiatives" className="w-full overflow-clip pad-y">
        <div className="shell pad-x flex w-full flex-col gap-[16px]">
          {INITIATIVES.map((item, i) => (
            <InView key={item.slug} delay={i * 90}>
              <Link
                href={`/work/${item.slug}`}
                className="group focus-ring flex w-full items-stretch overflow-clip rounded-[24px] border border-rule-2 bg-panel transition-[border-color,background-color] duration-[300ms] ease-hover hover:border-[rgba(255,255,255,0.28)] hover:bg-raised mobile:flex-col"
              >
                <div className="relative aspect-[16/10] w-[42%] shrink-0 overflow-clip bg-ground mobile:aspect-[4/3] mobile:w-full">
                  {item.cover ? (
                    <Img
                      src={item.cover}
                      alt={item.coverAlt}
                      sizes="(max-width: 809px) 100vw, 580px"
                      className="block h-full w-full object-cover object-left-top transition-transform duration-[600ms] ease-hover group-hover:scale-[1.03]"
                    />
                  ) : (
                    <ContraxisDrawing />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-[16px] p-[32px] mobile:p-[22px]">
                  <div className="flex flex-wrap items-center gap-[10px]">
                    <span
                      className={`t-mono-9 rounded-full border px-[10px] py-[5px] ${
                        item.tone === 'dev'
                          ? 'border-[rgba(255,69,0,0.42)] text-flare'
                          : 'border-[rgba(199,255,151,0.34)] text-lime'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="t-mono-9 text-ink-3">
                      {item.year} · {item.category}
                    </span>
                  </div>

                  <h2 className="t-card text-ink">{item.name}.</h2>
                  <p className="t-body max-w-[54ch] text-ink-2">{item.summary}</p>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-[12px] pt-[16px]">
                    <div className="flex flex-wrap gap-[6px]">
                      {item.tags.map((t) => (
                        <span key={t} className="tag t-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="t-mono-9 text-ink-3 transition-colors duration-[300ms] group-hover:text-lime">
                      READ MORE
                    </span>
                  </div>
                </div>
              </Link>
            </InView>
          ))}

          <InView delay={280}>
            <div className="flex w-full flex-wrap items-center justify-between gap-[16px] rounded-[24px] border border-dashed border-rule-2 p-[32px] mobile:p-[22px]">
              <p className="t-mono-9 text-ink-3">{W.reserved.label}</p>
              <p className="t-small max-w-[56ch] text-ink-3">{W.reserved.note}</p>
            </div>
          </InView>
        </div>
      </section>

      <Faq />
      <Close />
    </>
  );
}
