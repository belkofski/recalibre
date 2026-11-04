import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import type { Locale } from '@/lib/i18n';
import { Suspense } from 'react';
import { InView } from '@/lib/motion';
import ProjectsGrid, { DisciplineFilter } from '@/components/ProjectsGrid';
import PageHead from '@/components/PageHead';
import WorkCard from '@/components/WorkCard';
import { INITIATIVES, WORK_INDEX as W } from '@/content/work';
import { toCard } from '@/lib/cards';

export function projectsMeta(locale: Locale): Metadata {
  return pageMeta({
  locale,
  title: 'Selected work',
  description:
    'Selected work by Recalibre: field operations, document intelligence, industrial contracting and eyewear.',
  path: '/projects',
  image: '/img/og-work.jpg',
  imageAlt: 'A blue Belkofski paddle carrying the wordmark, lying across a court line, shot from above.',
  });
}

/* ============================================================================
   THE WORK INDEX — the reference's case-study index, composed the same way.

   Its opener is a split: heading and lede on the left, a search field, a
   filter row and a counter on the right. Two changes:

     THE COUNTER IS GONE. It animates "0% repeat or referral clients", which
     is both a performance claim and a client claim. The bar graphic that
     stood in its place, beside a line counting the four, came off on 27
     September 2026: see the note in the aside below.

     THE SEARCH IS GONE. A search box over four entries is furniture
     pretending to be a control. So was the filter row: it looked like a
     control, filtered nothing, and had no label saying otherwise. It is
     rendered as what it actually is — the disciplines these four cover —
     under a heading that says so.

   The grid below renders components/WorkCard, the same card the homepage
   uses. It was a second copy of that markup until the homepage card was
   rebuilt and this one was not, and the same initiatives appeared as
   full-bleed art on one page and as pale screenshots on the next.
   ========================================================================= */
export default function ProjectsView({ locale }: { locale: Locale }) {
  void locale; // the French work package threads it into the cards
  return (
    <>
      <PageHead
        lines={W.headline}
        lede={W.lede}
        aside={
          <InView className="flex flex-col gap-[40px]">
            {/* LABELLED, BECAUSE THEY DO NOTHING. A row of unlabelled chips
                over a grid reads as a filter, and a reader who taps one and
                gets no response has been told the site is broken. They are
                the disciplines these four initiatives cover, and they say
                so. Four entries do not need filtering. */}
            {/* THE CHIPS FILTER NOW (4 November 2026): through the address,
                so a filtered view can be linked to. See ProjectsGrid.tsx. */}
            <Suspense fallback={null}>
              <DisciplineFilter disciplines={W.disciplines} label="DISCIPLINES" />
            </Suspense>
            {/* THE COUNT RAIL IS GONE (the owner's Phase A brief, 27
                September 2026). Twelve dim bars and "FOUR PROJECTS · TWO IN
                DEVELOPMENT · ONE PARTNER · ONE CLIENT" stood under the
                disciplines: a count of the site's own content, with the
                smallest number on the site at the end of it. */}
          </InView>
        }
      />

      <section aria-label="Projects" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        {/* Two across from 600 up, one below (28 September 2026); the last
            card goes wide only when the count is odd, exactly as the
            homepage grid does it. The cards are rendered here, on the
            server, and the grid island only chooses which to show. */}
        <Suspense
          fallback={
            <div className="seam shell grid w-full grid-cols-2 phone:grid-cols-1">
              {INITIATIVES.map((item) => (
                <WorkCard key={item.slug} item={toCard(item)} heading="h2" showSummary stackOnTablet />
              ))}
            </div>
          }
        >
          <ProjectsGrid
            cards={INITIATIVES.map((item, i) => ({
              slug: item.slug,
              tags: item.tags,
              node: (
                <WorkCard
                  showSummary
                  /* The opener is this page's H1, so each name is an H2 here;
                     the homepage grid sits under its own H2 and keeps H3. */
                  heading="h2"
                  /* The top row is on the first screen at every width, so it
                     loads now. Lazy loading a picture that is already in view
                     only delays it. */
                  eager={i < 2}
                  /* From 600 to 1199px the cards take the phone layout, the
                     art on top and the words under it (the owner's decision
                     D-03, 25 September 2026; from 600 since 28 September). */
                  stackOnTablet
                  item={toCard(item)}
                />
              ),
            }))}
          />
        </Suspense>
      </section>

    </>
  );
}
