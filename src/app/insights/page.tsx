import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Link from 'next/link';
import Img from '@/lib/Img';
import { InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import { Chip, Glyph } from '@/components/ui';
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
            <span className="relative block aspect-[16/9] w-full overflow-clip rounded-[16px]">
              {/* An article with no honest picture draws the Contraxis
                  diagram, as WorkCard does for a card with no photograph
                  (28 September 2026). */}
              {lead.src ? (
                <Img
                  src={lead.src}
                  alt={lead.alt}
                  priority
                  sizes="(max-width: 1199px) 100vw, 690px"
                  className="media-zoom media-fill"
                />
              ) : (
                <span className="absolute inset-0 bg-raised">
                  <span className="t-mono-9 absolute left-[20px] top-[20px] text-ink-2" aria-hidden="true">
                    {DIAGRAM_CAPTION}
                  </span>
                  <SystemDiagram preset="card" className="absolute inset-x-0 bottom-[12px] top-[44px]" />
                </span>
              )}
            </span>
            <div className="flex flex-col gap-[12px]">
              <span className="t-mono text-ink-2">
                {lead.subject} · {readingMinutes(lead)} MIN READ
              </span>
              <h2 className="t-card max-w-[520px] text-ink">
                <Link href={`/insights/${lead.slug}`} className="focus-ring">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {lead.title}
                </Link>
              </h2>
              <span className="t-mono flex items-center gap-[9px] text-ink-3 transition-colors duration-300 group-hover:text-ink">
                READ THE ARTICLE
                <span className="dot-btn">
                  <Glyph />
                </span>
              </span>
            </div>
          </InView>
        }
      >
        <InView className="flex flex-wrap items-center gap-[10px]">
          {SITE.social.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="focus-ring tap-44">
              <Chip>{s.label}</Chip>
              <span className="sr-only normal-case"> (opens in a new tab)</span>
            </a>
          ))}
        </InView>
      </PageHead>

      <section aria-label="Articles" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <InView className="seam shell grid w-full grid-cols-2 narrow:grid-cols-1">
          <div className="card-30 relative min-h-[723px] overflow-clip narrow:min-h-[320px]">
            <Img
              src="/img/plate-insights-set-a.jpg"
              alt="A rendered room: a wide screen showing the OPS overview, against a deep blue wall."
              /* 725, not the card's 687: the plate covers a 687 x 762 box,
                 so it is drawn 725 wide, and 687 asked for one size down. */
              sizes="(max-width: 1199px) 100vw, 725px"
              className="media-fill"
            />
            {/* A static hairline edge, so the pale screen does not float:
                the same device WorkCard uses for its hover edge, without
                the hover. */}
            <span
              className="pointer-events-none absolute inset-0 rounded-[30px] border border-rule-2 mobile:rounded-[20px]"
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-col gap-[2px]">
            {[lead, ...rest].map((a) => (
              <article
                key={a.slug}
                className="card-30 group relative flex flex-1 items-start justify-between gap-[30px] p-[30px] transition-colors duration-300 hover:bg-white/[0.02] mobile:p-[20px]"
              >
                <div className="flex flex-col gap-[16px]">
                  <span className="t-mono text-ink-2">
                    {a.subject} · {readingMinutes(a)} MIN READ
                  </span>
                  <RowTitle lead={a.slug === lead.slug} className="t-card max-w-[470px] text-ink">
                    <Link href={`/insights/${a.slug}`} className="focus-ring tap-44">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {a.title}
                    </Link>
                  </RowTitle>
                  <p className="t-caption max-w-[510px] text-ink-2">{a.dek}</p>
                  <span className="t-mono flex items-center gap-[9px] text-ink-3 transition-colors duration-300 group-hover:text-ink">
                    READ THE ARTICLE
                    <span className="dot-btn">
                      <Glyph />
                    </span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </InView>
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
