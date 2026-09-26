import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import WorkCard from '@/components/WorkCard';
import { Chip, Bars } from '@/components/ui';
import { INITIATIVES, WORK_INDEX as W } from '@/content/work';
import Faq from '@/sections/home/Faq';

export const metadata: Metadata = pageMeta({
  title: 'Work — two products, an eyewear house, a client',
  description:
    'Four projects: OPS and Contraxis, both products in development; Belkofski, a partner of Recalibre; and ABP Continental, delivered for a client.',
  path: '/work',
  image: '/img/og-work.jpg',
  imageAlt: 'A blue Belkofski paddle carrying the wordmark, lying across a court line, shot from above.',
});

/* ============================================================================
   THE WORK INDEX — the reference's case-study index, composed the same way.

   Its opener is a split: heading and lede on the left, a search field, a
   filter row and a counter on the right. Two changes:

     THE COUNTER IS GONE. It animates "0% repeat or referral clients", which
     is both a performance claim and a client claim. The bar graphic keeps
     its position, beside the line that says what the four are, with every
     bar in the same dim tone: lit, it read as a score nobody recorded.

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
export default function WorkIndex() {
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
            <div className="flex flex-col gap-[16px]">
              <p className="t-mono text-ink-3">DISCIPLINES ACROSS THESE FOUR</p>
              <div className="flex flex-wrap gap-[8px]">
                {W.disciplines.map((f) => (
                  <Chip key={f}>{f}</Chip>
                ))}
              </div>
            </div>
            <div className="flex items-end gap-[14px] border-t border-rule-2 pt-[30px]">
              {/* Every bar in the one dim tone (the owner's decision of 25
                  September 2026). Seven of twelve used to be lit, a ratio
                  nothing on the record backs. */}
              <Bars total={12} lit={0} className="h-[34px]" />
              <span className="t-mono text-ink-2">
                FOUR PROJECTS · TWO IN DEVELOPMENT · ONE PARTNER · ONE CLIENT
              </span>
            </div>
          </InView>
        }
      />

      <section aria-label="Work" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <InView className="seam shell grid w-full grid-cols-2 mobile:grid-cols-1">
          {INITIATIVES.map((item, i) => (
            /* THE LAST CARD GOES WIDE ONLY WHEN THE COUNT IS ODD, exactly as
               the homepage grid does it — an even number of initiatives is
               the reference's 2 x 2 of squares and needs no special case.
               Both grids read the length rather than naming index 2, so
               adding a fourth initiative cannot leave one page in the old
               shape. */
            <div
              key={item.slug}
              className={
                INITIATIVES.length % 2 === 1 && i === INITIATIVES.length - 1
                  ? 'col-span-2 mobile:col-span-1'
                  : undefined
              }
            >
              <WorkCard
                wide={INITIATIVES.length % 2 === 1 && i === INITIATIVES.length - 1}
                showSummary
                /* The opener is this page's H1, so each name is an H2 here;
                   the homepage grid sits under its own H2 and keeps H3. */
                heading="h2"
                /* The top row is on the first screen at every width (the
                   first card at 390, both at 1440), so it loads now. Lazy
                   loading a picture that is already in view only delays it. */
                eager={i < 2}
                /* From 810 to 1199px the cards take the phone layout, the
                   art on top and the words under it, so nothing is printed
                   over a picture or the drawing (the owner's decision D-03,
                   25 September 2026). The homepage does not pass this. */
                stackOnTablet
                item={{
                  slug: item.slug,
                  name: item.name,
                  status: item.status,
                  /* The state is the meta line's last term, as the
                     reference prints it. */
                  meta: `${item.year} · ${item.category} · ${item.state}`.toUpperCase(),
                  demo: item.demo,
                  tags: item.tags,
                  src: item.cover,
                  srcTall: item.coverTall,
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
            </div>
          ))}
        </InView>
      </section>

      <Faq />
    </>
  );
}
