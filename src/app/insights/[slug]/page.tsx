import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
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
   AN ARTICLE.

   The reference's article template, minus its newsletter capture — Recalibre
   runs no mailing list, and a subscribe field that goes nowhere is a control
   that lies about what it does.

   THE BYLINE IS THE FIRM. The reference names two authors with job titles on
   every post. Naming an author here would mean naming an employee.
   ========================================================================= */
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();

  const others = ARTICLES.filter((x) => x.slug !== a.slug);

  return (
    <>
      <section aria-labelledby="art-head" className="w-full overflow-clip border-b border-rule bg-raised grain">
        <div className="shell pad-x flex w-full flex-col gap-[20px] pb-[56px] pt-[130px] mobile:pb-[36px] mobile:pt-[96px]">
          <Link href="/insights" className="focus-ring t-mono-9 tap-44 w-fit text-ink-3 hover:text-ink">
            ← All insights
          </Link>
          <p className="t-mono text-ink-3">
            {a.subject} · {a.minutes} min read
          </p>
          <Rise as="h1" id="art-head" lines={[a.title]} className="t-display max-w-[22ch] text-ink" />
          <p className="t-lede max-w-[58ch] text-ink-2">{a.dek}</p>

          <dl className="mt-[10px] flex flex-wrap gap-[40px] border-t border-rule-3 pt-[20px]">
            <div className="flex flex-col gap-[6px]">
              <dt className="t-mono-9 text-ink-3">Written by</dt>
              <dd className="t-small m-0 text-ink">{I.byline}</dd>
            </div>
            <div className="flex flex-col gap-[6px]">
              <dt className="t-mono-9 text-ink-3">Subject</dt>
              <dd className="t-small m-0 text-ink">{a.subject}</dd>
            </div>
            <div className="flex flex-col gap-[6px]">
              <dt className="t-mono-9 text-ink-3">Published</dt>
              <dd className="t-small m-0 text-ink">
                <time dateTime={a.date}>
                  {a.day} {a.month} {a.year}
                </time>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <article className="w-full overflow-clip pad-top">
        <div className="shell pad-x flex w-full flex-col gap-[40px]">
          <InView>
            <figure className="card media-scrim relative m-0 aspect-[21/9] w-full mobile:aspect-[4/3]">
              <Img
                src={a.src}
                alt={a.alt}
                priority
                sizes="(max-width: 1199px) 100vw, 1380px"
                className="block h-full w-full object-cover object-left-top"
              />
            </figure>
          </InView>

          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-[36px]">
            <p className="t-lede border-l-2 border-lime pl-[20px] text-ink">{a.standfirst}</p>

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

            <p className="t-small border-t border-rule-3 pt-[24px] text-ink-3">
              Written by {I.byline}. This piece contains no client results, no third-party research and no
              industry statistics — only positions we hold and can defend from our own work. Where it refers
              to OPS, that product is in development and is not deployed with any organization.
            </p>
          </div>
        </div>
      </article>

      <section aria-labelledby="more-art" className="w-full overflow-clip pad-top">
        <div className="shell pad-x flex w-full flex-col gap-[28px]">
          <h2 id="more-art" className="t-card text-ink">
            More notes.
          </h2>
          <div className="grid grid-cols-2 gap-[16px] mobile:grid-cols-1">
            {others.map((o, i) => (
              <InView key={o.slug} delay={i * 90}>
                <Link
                  href={`/insights/${o.slug}`}
                  className="group focus-ring flex w-full flex-col gap-[10px] rounded-[24px] border border-rule-2 bg-panel p-[24px] transition-colors duration-[300ms] ease-hover hover:border-[rgba(255,255,255,0.24)]"
                >
                  <span className="t-mono-9 text-ink-3">
                    {o.subject} · {o.minutes} min read
                  </span>
                  <span className="t-lede text-ink transition-colors duration-[300ms] group-hover:text-lime">
                    {o.title}
                  </span>
                  <span className="t-small text-ink-2">{o.dek}</span>
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
