import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Link from 'next/link';
import Img, { ArtImg } from '@/lib/Img';
import { InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import { Caption, Chip, Chevron } from '@/components/ui';
import { ARTICLES, INSIGHTS_BLOCK as I, readingMinutes } from '@/content/insights';
import { SITE } from '@/content/site';

export const metadata: Metadata = pageMeta({
  title: 'Insights — method pieces on operational systems',
  description:
    'Method pieces on the decisions that shape an operational system: where oversight sits, which copy of the day’s records counts, what a second language costs.',
  path: '/insights',
  image: '/img/og-insights-a.jpg',
  imageAlt: 'A rendered room: a wide screen on a stand showing the OPS overview, against a deep blue wall.',
});

/* ============================================================================
   THE INSIGHTS INDEX — the reference's blog index.

   Its opener is a split: heading, copy and social links on the left; the
   first article in the list, with its image, on the right — "first", not
   "most recent", because no article carries a date (see content/insights.ts).
   Below that runs the media-card-and-rows grid on a seam plate, the same
   object the homepage uses.

   THE NEWSLETTER CAPTURE IS NOT HERE. Recalibre runs no mailing list, and a
   subscribe field that goes nowhere is a control that lies about what it
   does. The social links take its position.
   ========================================================================= */
export default function InsightsIndex() {
  const [lead, ...rest] = ARTICLES;
  if (!lead) return null;

  return (
    <>
      <PageHead
        lines={['Insights.']}
        lede={I.lede}
        aside={
          /* ONE LINK, NOT THREE. The picture, the title and a READ MORE
             control were three separate links to the same article, which a
             screen reader announces three times over and a keyboard reader
             tabs through three times to get to the next thing. The title
             carries the link and an overlay makes the whole block clickable;
             the picture and the control are drawing. */
          <InView className="group relative flex flex-col gap-[24px]">
            <span className="relative block aspect-[16/9] w-full overflow-clip rounded-[24px]">
              {/* An article with no honest picture draws the Contraxis
                  diagram, as WorkCard does for a card with no photograph
                  (28 September 2026). */}
              {lead.src ? (
                <span className="settle absolute inset-0 block">
                  <Img
                    src={lead.src}
                    alt={lead.alt}
                    priority
                    sizes="(max-width: 1199px) 100vw, 690px"
                    className="media-zoom media-fill"
                  />
                </span>
              ) : (
                <span className="absolute inset-0 bg-raised">
                  <SystemDiagram preset="card" className="absolute inset-x-0 bottom-[12px] top-[12px]" />
                </span>
              )}
            </span>
            {/* The caption under the box it names, on its hairline (C3, 28
                September 2026; it sat in the box's top-left corner). Hidden
                from a screen reader, which hears the diagram's own
                description, "A schematic of Contraxis: …". */}
            {lead.src ? null : (
              <div aria-hidden="true" className="-mt-[8px]">
                <Caption as="div">{DIAGRAM_CAPTION}</Caption>
              </div>
            )}
            <div className="flex flex-col gap-[16px]">
              <span className="t-mono-11 tabular-nums text-ink-2">
                {lead.subject} · {readingMinutes(lead)} MIN READ
              </span>
              <h2 className="t-card max-w-[520px] text-ink">
                <Link href={`/insights/${lead.slug}`}>
                  <span className="absolute inset-0" aria-hidden="true" />
                  {lead.title}
                </Link>
              </h2>
              <span className="t-mono hover-read flex items-center gap-[8px]">
                READ THE ARTICLE
                <span className="dot-btn">
                  <Chevron />
                </span>
              </span>
            </div>
          </InView>
        }
      >
        <InView className="flex flex-wrap items-center gap-[8px]">
          {SITE.social.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="tap-44">
              <Chip>{s.label}</Chip>
              <span className="sr-only normal-case"> (opens in a new tab)</span>
            </a>
          ))}
        </InView>
      </PageHead>

      <section aria-label="Articles" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        {/* ONE REVEAL PER CARD (28 September 2026): the plate is a picture
            and fades in with no travel while the room settles; the rows,
            the second column, follow 90ms later. */}
        <div className="seam shell grid w-full grid-cols-2 narrow:grid-cols-1">
          {/* No floor (28 September 2026): on the desktop the plate takes
              the rows' height beside it, and below 1200, where it stands
              over them, a 16:10 box, which takes the set's own 16:10 cut
              with its wall (Phase C): the desktop plate, cut to that box,
              lost the set's sides. */}
          <InView mode="picture" className="card-30 relative overflow-clip narrow:aspect-[16/10]">
            <div className="settle absolute inset-0">
              <ArtImg
                src="/img/plate-insights-set-a.jpg"
                srcTall="/img/plate-insights-set-tablet-a.jpg"
                media="(max-width: 1199.98px)"
                alt="A rendered room: a wide screen showing the OPS overview, against a deep blue wall."
                /* 870, not the card's 687: the plate covers the rows' height
                   beside it, 687 x 905 at 1440 (28 September 2026), so it is
                   drawn about 862 wide, and 687 asked for one size down. */
                sizes="(max-width: 1199px) 100vw, 870px"
                sizesTall="(max-width: 809.98px) calc(100vw - 44px), calc(100vw - 52px)"
                className="media-fill"
              />
            </div>
            {/* A static hairline edge, so the pale screen does not float:
                the same device WorkCard uses for its hover edge, without
                the hover. */}
            <span
              className="pointer-events-none absolute inset-0 rounded-[30px] border border-rule mobile:rounded-[20px]"
              aria-hidden="true"
            />
          </InView>

          <InView step={1} className="flex flex-col gap-[2px]">
            {[lead, ...rest].map((a) => (
              <article
                key={a.slug}
                className="card-30 group hover-lift relative flex flex-1 items-start justify-between gap-[32px] p-(--card-pad)"
              >
                <div className="flex flex-col gap-[16px]">
                  <span className="t-mono-11 tabular-nums text-ink-2">
                    {a.subject} · {readingMinutes(a)} MIN READ
                  </span>
                  <RowTitle lead={a.slug === lead.slug} className="t-card max-w-[470px] text-ink">
                    <Link href={`/insights/${a.slug}`} className="tap-44">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {a.title}
                    </Link>
                  </RowTitle>
                  <p className="t-body max-w-[510px] text-ink-2">{a.dek}</p>
                  <span className="t-mono hover-read flex items-center gap-[8px]">
                    READ THE ARTICLE
                    <span className="dot-btn">
                      <Chevron />
                    </span>
                  </span>
                </div>
              </article>
            ))}
          </InView>
        </div>
      </section>

    </>
  );
}

/* THE LEAD'S ROW TITLE. The lead is already this page's H2, in the opener
   above; listed again as an H3 it was one article with two headings. Its
   row keeps the size and drops the tag. Every other row is the H3 it was. */
function RowTitle({ lead, className, children }: { lead: boolean; className: string; children: React.ReactNode }) {
  return lead ? <p className={className}>{children}</p> : <h3 className={className}>{children}</h3>;
}
