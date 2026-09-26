import Link from 'next/link';
import { Rise, InView } from '@/lib/motion';
import { LabelRow, Btn, Glyph } from '@/components/ui';
import { INSIGHTS_BLOCK } from '@/content/home';
import { ARTICLES } from '@/content/insights';

/* ============================================================================
   INSIGHTS.

   The reference's article block: a label, heading, lede and button, then
   the articles on a seam plate, each with its category, a two-line title, a
   standfirst and a read link. The reference ends each row with a lime
   circular date badge; there is none here, because the site has never been
   public and no article has a true publication date yet (the founder's
   decision, 24 September 2026 — see content/insights.ts).

   The structure is CMS-shaped and the articles behind it are real — three
   method pieces written from the design of OPS and Contraxis, with no
   client, result, statistic or citation in any of them, and no claim of
   field or client experience (the founder's decision, 25 September 2026).

   A WHITE PANEL (the owner's decision, 26 September 2026): `theme-light
   band-light`, see globals.css, THE WHITE PANELS. The panel sets the
   padding above and below the content. The FAQ below pads its own top on
   a desktop and a tablet but not on a phone, so `band-light-after-mobile`
   puts the black gap under the panel there.

   SHORTER, THE SAME NIGHT (the owner's decision). The tall desk photograph
   that stood beside the articles is gone from this block — it is still the
   picture on the Insights page — and the three articles sit side by side
   under one row that carries the heading on the left and the lede and the
   button on the right. From a tablet down they stack, as they did.
   ========================================================================= */

export default function Insights() {
  const I = INSIGHTS_BLOCK;
  return (
    <section className="theme-light band-light band-light-after-mobile pad-x relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-[40px] mobile:gap-[30px]">
        <LabelRow label={I.label} />

        <div className="grid w-full grid-cols-2 items-end gap-[40px] narrow:grid-cols-1 narrow:gap-[24px]">
          <Rise as="h2" lines={I.headline} className="t-display text-ink" />
          <InView className="flex items-center gap-[30px] justify-self-end narrow:justify-self-start mobile:flex-col mobile:items-start mobile:gap-[24px]">
            <p className="t-body max-w-[360px] text-ink-2">{I.lede}</p>
            <Btn href={I.cta.href} label={I.cta.label} />
          </InView>
        </div>

        <InView className="seam grid w-full grid-cols-3 narrow:grid-cols-1">
          {ARTICLES.map((a) => (
            <article
              key={a.slug}
              className="card-30 group relative flex flex-col p-[30px] transition-colors duration-300 hover:bg-ink/[0.02] mobile:p-[20px]"
            >
              <div className="flex flex-1 flex-col gap-[16px]">
                <span className="t-mono text-ink-2">{a.subject}</span>
                <h3 className="t-card max-w-[470px] text-ink">
                  <Link href={`/insights/${a.slug}`} className="focus-ring tap-44">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {a.title}
                  </Link>
                </h3>
                <p className="t-caption max-w-[510px] text-ink-2">{a.dek}</p>
                {/* ONE LINK, NOT TWO. The title carries the link and its
                    overlay makes the whole card clickable. READ MORE was a
                    second link to the same article, so a screen reader
                    announced every article twice and a keyboard reader
                    tabbed through it twice. It is drawing now, with the same
                    words, and the pointer passes through it to the card.
                    `mt-auto` lines the three up along the foot of the row. */}
                <span className="tap-44 pointer-events-none mt-auto inline-flex items-center gap-[9px]">
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
        </InView>
      </div>
    </section>
  );
}
