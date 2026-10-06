import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import WorkCard from '@/components/WorkCard';
import FeaturedOps from '@/sections/work/FeaturedOps';
import { Chip } from '@/components/ui';
import { INITIATIVES, WORK_INDEX as W } from '@/content/work';
import { WORK } from '@/content/home';

export const metadata: Metadata = pageMeta({
  title: 'Selected work',
  description:
    'Selected work by Recalibre: field operations, document intelligence, industrial contracting and eyewear.',
  path: '/work',
  image: '/img/og-work.jpg',
  imageAlt: 'A blue Belkofski paddle carrying the wordmark, lying across a court line, shot from above.',
});

/* ============================================================================
   THE WORK INDEX.

   Its opener is a split: heading and lede on the left, the disciplines on
   the right. Two of the reference's devices are not here:

     THE COUNTER IS GONE. It animates "0% repeat or referral clients", which
     is both a performance claim and a client claim.

     THE SEARCH IS GONE. A search box over four entries is furniture
     pretending to be a control. So was the filter row: it looked like a
     control, filtered nothing, and had no label saying otherwise. It is
     rendered as what it actually is — the disciplines these four cover —
     under a heading that says so.

   THE FLAGSHIP LEADS (the owner's audit, 6 October 2026): OPS opens the
   index on its own split panel, and the other three follow as cards, three
   across, two on a tablet, one on a phone. The card is components/WorkCard,
   the same card the homepage row renders.
   ========================================================================= */
export default function WorkIndex() {
  const rest = INITIATIVES.filter((i) => i.slug !== WORK.featured);
  return (
    <>
      <PageHead
        lines={W.headline}
        lede={W.lede}
        aside={
          <InView className="flex flex-col gap-(--space-5)">
            {/* LABELLED, BECAUSE THEY DO NOTHING. A row of unlabelled chips
                over a grid reads as a filter, and a reader who taps one and
                gets no response has been told the site is broken. They are
                the disciplines these four initiatives cover, and they say
                so. Four entries do not need filtering. */}
            <div className="flex flex-col gap-(--space-3)">
              <p className="t-mono text-ink-3">DISCIPLINES</p>
              <div className="flex flex-wrap gap-(--space-1)">
                {W.disciplines.map((f) => (
                  <Chip key={f}>{f}</Chip>
                ))}
              </div>
            </div>
          </InView>
        }
      />

      <FeaturedOps />

      <section aria-label="Work" className="pad-x flex w-full flex-col items-center overflow-clip pt-(--space-6)">
        {/* One reveal per card, staggered by its column: three across, two
            on a tablet, one on a phone, where every card starts at once. */}
        <div className="seam shell grid w-full grid-cols-3 narrow:grid-cols-2 phone:grid-cols-1">
          {rest.map((item, i) => (
            <InView key={item.slug} step={i % 3} className="phone:[--in-delay:0ms]!">
              <WorkCard
                showSummary
                /* The opener is this page's H1 and the flagship its first
                   H2, so each name is an H2 here; the homepage row sits
                   under its own H2 and keeps H3. */
                heading="h2"
                /* The phone layout at every width (6 October 2026): the art
                   a square on top, the words under it, so a summary, the
                   centre mark and the Contraxis diagram never cover one
                   another in a card a third of the shell wide. It was the
                   layout from 600 to 1199 only (the owner's decision D-03,
                   25 September 2026; from 600 since 28 September 2026), and
                   at 1440 the mark landed on the summary. */
                stack
                item={{
                  slug: item.slug,
                  name: item.name,
                  status: item.status,
                  /* The state is the meta line's last term; the card
                     prints it as the Status, on a line of its own. */
                  meta: `${item.year} · ${item.category} · ${item.state}`.toUpperCase(),
                  demo: item.demo,
                  tags: item.tags,
                  src: item.cover,
                  srcTall: item.coverTall,
                  srcTallMobileOnly: item.coverTallMobileOnly,
                  srcCard: item.coverCard,
                  alt: item.coverAlt,
                  figure: item.figure,
                  art: item.art,
                  plate: item.plate,
                  mark: item.mark,
                  markTone: item.markTone,
                  tone: item.tone,
                  summary: item.summary,
                }}
              />
            </InView>
          ))}
        </div>
      </section>
    </>
  );
}
