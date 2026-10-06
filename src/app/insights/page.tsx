import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import FeaturedArticle from '@/sections/insights/FeaturedArticle';
import ArticleCard from '@/sections/insights/ArticleCard';
import { ARTICLES, INSIGHTS_BLOCK as I } from '@/content/insights';

export const metadata: Metadata = pageMeta({
  title: 'Insights — method pieces on operational systems',
  description:
    'Method pieces on the decisions that shape an operational system: where oversight sits, which copy of the day’s records counts, what a second language costs.',
  path: '/insights',
  image: '/img/og-insights-a.jpg',
  imageAlt: 'A rendered room: a wide screen on a stand showing the OPS overview, against a deep blue wall.',
});

/* ============================================================================
   THE INSIGHTS INDEX.

   The opener is the site's PageHead: "Insights." with the lede under it and
   the owner's own line, "Notes from the work.", under that at lede size
   (his audit of 6 October 2026). Nothing stands in the right column: the
   rendered room that stood there, and the plate of the set that carried
   the rows below, were pictures of nothing the articles are about, and
   they came off with the social chips (the brief, §6.10; the chips live in
   the footer, where every page already has them).

   Then the articles, in the order the content prints them: the first as
   the featured card, a 7/5 split with its picture or diagram revealed from
   its foot; the other two as Card/Insight side by side, the second 90ms
   after the first. "First", not "most recent": no article carries a date.

   THE NEWSLETTER CAPTURE IS NOT HERE. Recalibre runs no mailing list, and a
   subscribe field that goes nowhere is a control that lies about what it
   does.
   ========================================================================= */
export default function InsightsIndex() {
  const [lead, ...rest] = ARTICLES;
  if (!lead) return null;

  return (
    <>
      <PageHead lines={['Insights.']} lede={I.lede}>
        <InView delay={120}>
          <p className="t-lede max-w-[520px] text-ink">{I.pageHeadline}</p>
        </InView>
      </PageHead>

      <section aria-label="Articles" className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-row)">
          <FeaturedArticle article={lead} />
          {rest.length ? (
            <div className="seam grid w-full grid-cols-2 phone:grid-cols-1">
              {rest.map((a, i) => (
                <ArticleCard key={a.slug} article={a} step={i % 2} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
