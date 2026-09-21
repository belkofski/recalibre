import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { LabelRow, MonoLink, Glyph } from '@/components/ui';
import { ARTICLES, INSIGHTS_BLOCK as I } from '@/content/insights';
import Close from '@/sections/home/Close';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return { title: 'Not found' };
  return { title: a.title, description: a.dek };
}

/* ============================================================================
   AN ARTICLE — the reference's post template.

     the split opener      title and standfirst left, the meta rail right
     the cover panel       one image at the page width, rounded and grained
     the body              a 720px measure, centred
     more notes            two cards on the seam plate

   THE NEWSLETTER CAPTURE IS NOT HERE. Recalibre runs no mailing list, and a
   subscribe field that goes nowhere is a control that lies about what it
   does.

   THE BYLINE IS THE FIRM. The reference names an author with a job title on
   every post; naming one here would mean naming an employee.
   ========================================================================= */
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();

  const others = ARTICLES.filter((x) => x.slug !== a.slug);

  return (
    <>
      <section
        aria-labelledby="art-head"
        className="pad-x relative flex w-full flex-col items-center overflow-clip pt-[200px] tablet:pt-[180px] mobile:pt-[110px]"
      >
        <div className="shell grid w-full grid-cols-2 items-start gap-[40px] narrow:grid-cols-1">
          <div className="flex w-[600px] max-w-full flex-col gap-[30px] pr-[50px] narrow:w-full narrow:pr-0">
            <Link href="/insights" className="focus-ring tap-44 flex w-fit items-center gap-[7px]">
              <Glyph className="rotate-180 [&>i]:bg-lime" />
              <span className="t-mono text-ink-2">ALL INSIGHTS</span>
            </Link>
            <Rise as="h1" id="art-head" lines={[a.title]} wrap className="t-sub text-ink" />
          </div>

          <div className="flex flex-col gap-[40px]">
            <InView>
              <p className="t-lede max-w-[500px] text-ink-2">{a.dek}</p>
            </InView>
            <InView delay={90} className="grid grid-cols-3 border-t border-rule-2 pt-[30px] mobile:grid-cols-1 mobile:gap-[20px]">
              {(
                [
                  ['WRITTEN BY', I.byline],
                  ['SUBJECT', a.subject],
                  ['PUBLISHED', `${a.day} ${a.month} ${a.year}`],
                ] as const
              ).map(([k, v], i) => (
                <div
                  key={k}
                  className={`flex flex-col gap-[10px] ${i > 0 ? 'border-l border-rule-2 pl-[24px] mobile:border-0 mobile:pl-0' : ''}`}
                >
                  <span className="t-mono-9 text-ink-3">{k}</span>
                  <span className="t-note text-ink">{v}</span>
                </div>
              ))}
            </InView>
          </div>
        </div>
      </section>

      <article className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-[70px] mobile:gap-[40px]">
          <InView className="relative w-full overflow-clip rounded-[30px] mobile:rounded-[20px]">
            <div className="relative aspect-[21/9] w-full mobile:aspect-[4/3]">
              <Img
                src={a.src}
                alt={a.alt}
                priority
                sizes="(max-width: 1199px) 100vw, 1380px"
                className="media-fill object-left-top"
              />
              <span className="grain grain-soft absolute inset-0" aria-hidden="true" />
            </div>
          </InView>

          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-[36px]">
            <p className="t-lede border-l border-lime pl-[24px] text-ink">{a.standfirst}</p>

            {a.body.map((block, i) => (
              <InView key={i} className="flex flex-col gap-[16px]">
                {block.heading ? <h2 className="t-card text-ink">{block.heading}</h2> : null}
                {block.paragraphs.map((p, j) => (
                  <p key={j} className="t-body text-ink-2">
                    {p}
                  </p>
                ))}
              </InView>
            ))}

            <div className="flex items-center gap-[10px] border-t border-rule-2 pt-[24px]">
              <Glyph className="[&>i]:bg-lime" />
              <p className="t-mono text-ink-2">
                {I.byline} · OPS is in development and is not deployed with any organization
              </p>
            </div>
          </div>
        </div>
      </article>

      <section aria-labelledby="more-art" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-[70px] mobile:gap-[40px]">
          <div className="flex w-full flex-col items-end gap-[70px] mobile:gap-[30px]">
            <LabelRow label="MORE NOTES" />
            <div className="flex w-[690px] narrow:w-full">
              <h2 id="more-art" className="t-display text-ink">
                More notes.
              </h2>
            </div>
          </div>

          <InView className="seam grid w-full grid-cols-2 mobile:grid-cols-1">
            {others.map((o) => (
              <article key={o.slug} className="card-30 relative flex flex-col justify-between gap-[30px] p-[30px] mobile:p-[20px]">
                <span className="t-mono text-ink-2">
                  {o.subject} · {o.minutes} MIN READ
                </span>
                <div className="flex flex-col gap-[16px]">
                  <h3 className="t-card text-ink">
                    <Link href={`/insights/${o.slug}`} className="focus-ring tap-44">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {o.title}
                    </Link>
                  </h3>
                  <p className="t-caption text-ink-2">{o.dek}</p>
                  <MonoLink href={`/insights/${o.slug}`} label="READ MORE" />
                </div>
              </article>
            ))}
          </InView>
        </div>
      </section>

      <Close />
    </>
  );
}
