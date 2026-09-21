import type { Metadata } from 'next';
import Link from 'next/link';
import Img from '@/lib/Img';
import { InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import { ARTICLES, INSIGHTS_BLOCK as I } from '@/content/insights';
import Close from '@/sections/home/Close';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Method pieces on agentic AI oversight, offline-first field operations and bidirectional enterprise systems — written from Recalibre’s own work, with no client results and no borrowed statistics.',
};

/* ============================================================================
   THE INSIGHTS INDEX.

   The reference's sticky media column and article list are kept. The
   newsletter capture at the foot of its article pages is not: Recalibre runs
   no mailing list, and a subscribe field that goes nowhere is a control that
   lies about what it does.
   ========================================================================= */
export default function InsightsIndex() {
  return (
    <>
      <PageHead eyebrow={I.eyebrow} lines={['News & Insights.']} lede={I.lede} />

      <section aria-label="Articles" className="w-full overflow-clip pad-y">
        <div className="shell pad-x flex w-full items-start gap-[48px] narrow:flex-col narrow:gap-[28px]">
          {/* the sticky media column */}
          <InView className="sticky top-[110px] w-[420px] shrink-0 narrow:static narrow:w-full">
            <figure className="card media-scrim relative m-0 aspect-[4/5] w-full narrow:aspect-[16/9]">
              <Img
                src="/img/bearing-macro.jpg"
                alt="A single bearing standing on a black reflective surface, lit by one shaft of light."
                sizes="(max-width: 1199px) 100vw, 420px"
                className="block h-full w-full object-cover"
              />
              <figcaption className="absolute bottom-[16px] left-[16px] z-[2] max-w-[30ch] t-caption text-ink-2">
                Positions we hold and can defend from our own work.
              </figcaption>
            </figure>
          </InView>

          {/* the list */}
          <div className="flex min-w-0 flex-1 flex-col border-t border-rule">
            {ARTICLES.map((a, i) => (
              <InView key={a.slug} delay={i * 70}>
                <Link
                  href={`/insights/${a.slug}`}
                  className="group focus-ring flex items-start gap-[24px] border-b border-rule py-[28px] mobile:flex-col mobile:gap-[14px]"
                >
                  <span className="flex h-[70px] w-[70px] shrink-0 flex-col items-center justify-center rounded-full bg-lime text-scrim">
                    <span className="t-mono-9">{a.month}</span>
                    <span className="t-card leading-none">{a.day}</span>
                  </span>

                  <span className="flex min-w-0 flex-1 flex-col gap-[10px]">
                    <span className="t-mono-9 text-ink-3">
                      {a.subject} · {a.minutes} min read · {a.year}
                    </span>
                    <span className="t-lede text-ink transition-colors duration-[300ms] group-hover:text-lime">
                      {a.title}
                    </span>
                    <span className="t-small max-w-[62ch] text-ink-2">{a.dek}</span>
                  </span>

                  <span className="t-mono-9 shrink-0 self-center text-ink-3 transition-colors duration-[300ms] group-hover:text-lime">
                    READ →
                  </span>
                </Link>
              </InView>
            ))}
          </div>
        </div>
      </section>

      <Close />
    </>
  );
}
