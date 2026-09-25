import Link from 'next/link';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { LabelRow, Tick, Btn, Glyph } from '@/components/ui';
import { INSIGHTS_BLOCK } from '@/content/home';
import { ARTICLES } from '@/content/insights';

/* ============================================================================
   INSIGHTS.

   The reference's article block: a centred label, heading, hairline drop,
   lede and button, then a seam plate holding one tall media card beside a
   stack of article rows, each with its category, a two-line title, a
   standfirst and a read link. The reference ends each row with a lime
   circular date badge; there is none here, because the site has never been
   public and no article has a true publication date yet (the founder's
   decision, 24 September 2026 — see content/insights.ts).

   The structure is CMS-shaped and the articles behind it are real — three
   method pieces written from the design of OPS and Contraxis, with no
   client, result, statistic or citation in any of them, and no claim of
   field or client experience (the founder's decision, 25 September 2026).
   ========================================================================= */

export default function Insights() {
  const I = INSIGHTS_BLOCK;
  return (
    <section className="pad-x pad-top mobile:pt-0 relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col items-center gap-[70px] mobile:gap-[40px]">
        <div className="flex w-full flex-col items-center gap-[70px] mobile:gap-[30px]">
          <LabelRow label={I.label} />
          {/* FULL WIDTH ON A PHONE. The button takes its width from this
              column, and the column used to take its width from the line
              above the button, which filled it. That line is now short
              ("Positions Recalibre holds.", 25 September 2026), so on a
              phone the column is held at full width instead and the button
              keeps the phone width it had. */}
          <div className="flex flex-col items-center gap-[30px] mobile:w-full">
            <Rise as="h2" lines={I.headline} className="t-display text-center text-ink" />
            <Tick />
            <InView className="flex flex-col items-center gap-[30px] mobile:w-full">
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
              /* Drawn 783px wide, not 687: the card grows with the list
                 beside it and the picture covers the taller box. */
              sizes="(max-width: 1199px) 100vw, 790px"
              className="media-fill"
            />
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
                  {/* ONE LINK, NOT TWO. The title carries the link and its
                      overlay makes the whole row clickable. READ MORE was a
                      second link to the same article, so a screen reader
                      announced every article twice and a keyboard reader
                      tabbed through it twice. It is drawing now, in the same
                      box it had, with the same words, and the pointer passes
                      through it to the row. */}
                  <span className="tap-44 pointer-events-none inline-flex items-center gap-[9px]">
                    <span className="flex items-center gap-[6px]">
                      <span className="t-mono text-ink">READ THE ARTICLE</span>
                    </span>
                    <span className="dot-btn">
                      <Glyph />
                    </span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </InView>
      </div>
    </section>
  );
}
