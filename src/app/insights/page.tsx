import type { Metadata } from 'next';
import Link from 'next/link';
import Img from '@/lib/Img';
import { InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import { MonoLink, Chip } from '@/components/ui';
import { ARTICLES, INSIGHTS_BLOCK as I } from '@/content/insights';
import { SITE } from '@/content/site';
import Close from '@/sections/home/Close';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Method pieces on agentic AI oversight, offline-first field operations and bidirectional enterprise systems — written from Recalibre’s own work.',
};

/* ============================================================================
   THE INSIGHTS INDEX — the reference's blog index.

   Its opener is a split: heading, copy and social links on the left; the
   most recent article, with its image, on the right. Below that runs the
   media-card-and-rows grid on a seam plate, the same object the homepage
   uses.

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
        lines={['News & Insights.']}
        lede={I.lede}
        aside={
          <InView className="flex flex-col gap-[24px]">
            <Link
              href={`/insights/${lead.slug}`}
              className="group focus-ring relative block aspect-[16/9] w-full overflow-clip rounded-[16px]"
            >
              <Img
                src={lead.src}
                alt={lead.alt}
                priority
                sizes="(max-width: 1199px) 100vw, 690px"
                className="media-zoom media-fill"
              />
              <span className="grain grain-soft absolute inset-0" aria-hidden="true" />
            </Link>
            <div className="flex flex-col gap-[12px]">
              <span className="t-mono text-ink-2">
                {lead.subject} · {lead.minutes} MIN READ
              </span>
              <h2 className="t-card max-w-[520px] text-ink">
                <Link href={`/insights/${lead.slug}`} className="focus-ring">
                  {lead.title}
                </Link>
              </h2>
              <MonoLink href={`/insights/${lead.slug}`} label="READ MORE" />
            </div>
          </InView>
        }
      >
        <InView className="flex flex-wrap items-center gap-[10px]">
          {SITE.social.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="focus-ring tap-44">
              <Chip>{s.label}</Chip>
            </a>
          ))}
        </InView>
      </PageHead>

      <section aria-label="Articles" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <InView className="seam shell grid w-full grid-cols-2 narrow:grid-cols-1">
          <div className="card-30 relative min-h-[723px] overflow-clip narrow:min-h-[320px]">
            <Img
              src="/img/plate-desk-tall.jpg"
              alt="A desk at night in black and white: a monitor showing a wireframe layout and sketches on paper."
              sizes="(max-width: 1199px) 100vw, 687px"
              className="media-fill"
            />
            <span className="grain grain-soft absolute inset-0" aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-[2px]">
            {[lead, ...rest].map((a) => (
              <article
                key={a.slug}
                className="card-30 group relative flex flex-1 items-start justify-between gap-[30px] p-[30px] transition-colors duration-300 hover:bg-white/[0.02] mobile:p-[20px]"
              >
                <div className="flex flex-col gap-[16px]">
                  <span className="t-mono text-ink-2">
                    {a.subject} · {a.minutes} MIN READ
                  </span>
                  <h3 className="t-card max-w-[470px] text-ink">
                    <Link href={`/insights/${a.slug}`} className="focus-ring tap-44">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {a.title}
                    </Link>
                  </h3>
                  <p className="t-caption max-w-[510px] text-ink-2">{a.dek}</p>
                  <MonoLink href={`/insights/${a.slug}`} label="READ MORE" />
                </div>
                <span className="flex size-[72px] flex-none flex-col items-center justify-center rounded-full bg-lime mobile:size-[58px]">
                  <span className="t-mono-9 text-ground/70">{a.month}</span>
                  <span className="t-body-lg !leading-[22px] text-ground">{a.day}</span>
                  <span className="t-mono-9 text-ground/70">{a.year}</span>
                </span>
              </article>
            ))}
          </div>
        </InView>
      </section>

      <Close />
    </>
  );
}
