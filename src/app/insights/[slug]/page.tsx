import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { ArtImg } from '@/lib/Img';
import { Rise, InView, Scene } from '@/lib/motion';
import { Caption, Card, Chevron, Frame, Orbs } from '@/components/ui';
import { pageMeta } from '@/lib/seo';
import { ArticleLd } from '@/components/JsonLd';
import { ArticleLink } from '@/sections/insights/ArticleCard';
import { DiagramFocus } from '@/sections/insights/ArticleArt';
import { ARTICLES, INSIGHTS_BLOCK as I } from '@/content/insights';

/* ONLY THE SLUGS IN THE LIST — see work/[slug]/page.tsx. A wrong address
   under /insights/ gets the full "page not found" page from the server
   instead of an empty shell that filled in once scripts ran. */
export const dynamicParams = false;

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
  return pageMeta({
    title: a.title,
    description: a.dek,
    path: `/insights/${a.slug}`,
    image: a.share,
    imageAlt: a.alt,
    article: true,
  });
}

/* ============================================================================
   AN ARTICLE (the third pass: the body stays, the chrome around it goes).

     the opener       ALL INSIGHTS, the title rising word by word, the dek
                      beside it; the head lifts out as it leaves the window
     the cover        the article's own visual, and no other article's: the
                      OPS field screen, the OPS permit register, or the
                      Contraxis diagram pushed in toward the person's step.
                      The box opens from its foot as it comes up the window
                      and the capture settles inside its frame (a Scene on
                      the figure). An OPS screen says "Demonstration data."
                      once, under it.
     the body         a 620px measure, centred, in the reading type, with
                      the reading line sticky at the window's head, filling
                      as the column passes (a Scene on the column)
     more insights    the other two as text links: no pictures

   The byline and subject rows came off the opener; the byline stays in
   the closing line with the article's own disclosure.

   THE NEWSLETTER CAPTURE IS NOT HERE. Recalibre runs no mailing list.
   ========================================================================= */
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();

  const others = ARTICLES.filter((x) => x.slug !== a.slug);

  return (
    <>
      <ArticleLd
        headline={a.title}
        description={a.dek}
        path={`/insights/${a.slug}`}
        image={a.src ?? a.share}
      />
      <Scene
        as="section"
        aria-labelledby="art-head"
        /* PageHead's top: the 56px bar plus the section token. */
        className="pad-x relative flex w-full flex-col items-center overflow-clip pt-[calc(var(--bar)+var(--space-section))]"
      >
        <div className="sx-lift shell grid w-full grid-cols-2 items-end gap-[40px] narrow:grid-cols-1 narrow:gap-(--space-lede)">
          <div className="flex w-[640px] max-w-full flex-col gap-(--space-lede) pr-[50px] narrow:w-full narrow:pr-0">
            {/* Back is the chevron mirrored, never turned. */}
            <Link href="/insights" className="tap-44 flex w-fit items-center gap-(--space-1)">
              <Chevron dir="back" className="text-accent-bright" />
              <span className="t-mono-11 hover-read">ALL INSIGHTS</span>
            </Link>
            <Rise as="h1" id="art-head" lines={[a.title]} wrap by="word" className="t-display text-ink" />
          </div>
          <InView>
            <p className="t-lede max-w-[500px] text-ink-2">{a.dek}</p>
          </InView>
        </div>
      </Scene>

      <article className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-7) mobile:gap-(--space-row)">
          <Scene as="figure" end={0.2} className="flex w-full flex-col gap-(--space-2)">
            <div className="insights-cover sx-open w-full">
              <Card radius={30} className="relative overflow-clip">
                <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />
                <Orbs variant="card" />
                <div className="p-(--space-5) mobile:p-(--space-3)">
                  {a.src ? (
                    <Frame bare="mobile" screenClassName="relative aspect-[16/9]">
                      <div className="sx-zoom absolute inset-0">
                        <ArtImg
                          src={a.src}
                          alt={a.alt}
                          sizes="(max-width: 1199px) calc(100vw - 72px), 1320px"
                          className="media-fill object-left-top"
                        />
                      </div>
                    </Frame>
                  ) : (
                    <div className="insights-cover-diagram relative w-full">
                      <DiagramFocus className="inset-0" />
                    </div>
                  )}
                </div>
              </Card>
            </div>
            {a.src ? (
              <div aria-hidden="true">
                <Caption as="div">Demonstration data.</Caption>
              </div>
            ) : null}
          </Scene>

          {/* THE READING COLUMN: 620 wide, the paragraphs in `.t-read`, the
              block headings in `.t-article-h2`. The reading line is its
              first child, sticky; the negative margin takes back the gap
              it would add. */}
          <Scene className="mx-auto flex w-full max-w-[620px] flex-col gap-(--space-row)">
            <div
              aria-hidden="true"
              className="insights-read"
              style={{ marginBottom: 'calc(-1 * var(--space-row) - 2px)' } as CSSProperties}
            >
              <span />
            </div>
            <InView>
              <p className="t-lede border-l border-accent-bright pl-(--space-4) text-ink">{a.standfirst}</p>
            </InView>

            {a.body.map((block, i) => (
              <InView key={i} className="flex flex-col gap-(--space-3)">
                {block.heading ? <h2 className="t-article-h2 text-ink">{block.heading}</h2> : null}
                {block.paragraphs.map((p, j) => (
                  <p key={j} className="t-read">
                    {p}
                  </p>
                ))}
              </InView>
            ))}

            {/* The disclosure belongs to the article, not to the template. */}
            <InView className="border-t border-rule pt-(--space-4)">
              <p className="t-caption text-ink-2">
                {I.byline}
                {a.note ? ` · ${a.note}` : null}
              </p>
            </InView>
          </Scene>
        </div>
      </article>

      {others.length ? (
        <section aria-labelledby="more-art" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
          <div className="shell flex w-full flex-col gap-(--space-5)">
            <h2 id="more-art" className="t-section text-ink">
              More insights.
            </h2>
            <Scene as="ul" end={0.3} className="sx-stagger grid w-full grid-cols-2 gap-(--space-3) phone:grid-cols-1">
              {others.map((o, i) => (
                <li key={o.slug} style={{ '--i': i * 2 } as CSSProperties} className="flex">
                  <ArticleLink article={o} />
                </li>
              ))}
            </Scene>
          </div>
        </section>
      ) : null}
    </>
  );
}
