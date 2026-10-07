import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { pageMeta } from '@/lib/seo';
import { InView, Scene } from '@/lib/motion';
import { Caption } from '@/components/ui';
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
   THE INSIGHTS INDEX (the third pass: one picture, one place; fewer words).

   The opener is "Insights." and the owner's own line, "Notes from the
   work."; the long lede came off. Then the articles in the order the
   content prints them ("first", not "most recent": no article carries a
   date): the first as the featured card, the page's one big moment, with
   the Contraxis diagram focused on the person's step; the other two in an
   uneven row under it, 7/5 from 1200 (6/5 from 700), the smaller card
   standing lower, each with its own OPS screen. The row is a Scene and the
   two cards stagger in as it comes up the window. The two OPS screens say
   what data they carry once, under the row.

   THE NEWSLETTER CAPTURE IS NOT HERE. Recalibre runs no mailing list.
   ========================================================================= */
export default function InsightsIndex() {
  const [lead, ...rest] = ARTICLES;
  if (!lead) return null;
  const [second, third] = rest;

  return (
    <>
      <PageHead lines={['Insights.']}>
        <InView delay={120}>
          <p className="t-lede max-w-[520px] text-ink-2">{I.pageHeadline}</p>
        </InView>
      </PageHead>

      <section aria-label="Articles" className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-row)">
          <FeaturedArticle article={lead} />
          {second ? (
            <div className="flex w-full flex-col gap-(--space-3)">
              <Scene className="insights-row sx-stagger" end={0.3}>
                <div style={{ '--i': 0 } as CSSProperties} className="insights-row-a flex">
                  <ArticleCard article={second} shape="wide" />
                </div>
                {third ? (
                  <div style={{ '--i': 2 } as CSSProperties} className="insights-row-b flex">
                    <ArticleCard article={third} shape="tall" />
                  </div>
                ) : null}
              </Scene>
              <div aria-hidden="true">
                <Caption as="div">Demonstration data.</Caption>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
