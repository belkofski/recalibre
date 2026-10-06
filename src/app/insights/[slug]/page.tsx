import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArtImg } from '@/lib/Img';
import { Rise, InView, Parallax } from '@/lib/motion';
import { Caption, Card, Chevron, SectionHead } from '@/components/ui';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import { pageMeta } from '@/lib/seo';
import { ArticleLd } from '@/components/JsonLd';
import ArticleCard from '@/sections/insights/ArticleCard';
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
   AN ARTICLE — the reference's post template.

     the split opener      title and standfirst left, the meta rail right
     the cover panel       one picture at the page width, revealed from its
                           foot and drifting with the scroll
     the body              a 620px measure, centred, in the reading type
     more insights         the other articles as Card/Insight on the seam

   THE BAR'S PROGRESS LINE IS THE READING PROGRESS; nothing is added here.

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
      <ArticleLd
        headline={a.title}
        description={a.dek}
        path={`/insights/${a.slug}`}
        image={a.src ?? a.share}
      />
      <section
        aria-labelledby="art-head"
        /* PageHead's top: the 56px bar plus the section token. */
        className="pad-x relative flex w-full flex-col items-center overflow-clip pt-[calc(var(--bar)+var(--space-section))]"
      >
        <div className="shell grid w-full grid-cols-2 items-start gap-[40px] narrow:grid-cols-1">
          <div className="flex w-[600px] max-w-full flex-col gap-(--space-lede) pr-[50px] narrow:w-full narrow:pr-0">
            {/* Back is the chevron mirrored, never turned (28 September
                2026); on hover it moves 2px back and the words light. */}
            <Link href="/insights" className="tap-44 flex w-fit items-center gap-(--space-1)">
              <Chevron dir="back" className="text-accent-bright" />
              <span className="t-mono-11 hover-read">ALL INSIGHTS</span>
            </Link>
            {/* At display size, as every page's H1 is (28 September 2026):
                at 40px it was smaller than the H2s under it. The title
                comes from the content and cannot be hand-broken, so it
                wraps; its words rise one after another, as the page
                openers do (6 October 2026). */}
            <Rise as="h1" id="art-head" lines={[a.title]} wrap by="word" className="t-display text-ink" />
          </div>

          <div className="flex flex-col gap-(--space-row)">
            <InView>
              <p className="t-lede max-w-[500px] text-ink-2">{a.dek}</p>
            </InView>
            {/* TWO CELLS ON A TWO-COLUMN RAIL. A third cell printed
                PUBLISHED. The site has never been public, so no article has
                a true publication date yet, and the cell came off rather
                than carry a guessed one (the founder's decision, 24 September
                2026). The two that remain share the row in halves, which he
                chose the same evening over leaving the third column empty. */}
            <InView
              delay={90}
              className="grid grid-cols-2 border-t border-rule pt-(--space-5) mobile:grid-cols-1 mobile:gap-(--space-4)"
            >
              {(
                [
                  ['WRITTEN BY', I.byline],
                  ['SUBJECT', a.subject],
                ] as const
              ).map(([k, v], i) => (
                <div
                  key={k}
                  className={`flex flex-col gap-(--space-1) ${i > 0 ? 'border-l border-rule pl-(--space-4) mobile:border-0 mobile:pl-0' : ''}`}
                >
                  <span className="t-mono text-ink-3">{k}</span>
                  <span className="t-body text-ink">{v}</span>
                </div>
              ))}
            </InView>
          </div>
        </div>
      </section>

      <article className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-7) mobile:gap-(--space-row)">
          {/* THE COVER: the one large picture of the page, so it takes the
              clip tier (6 October 2026): revealed from its foot upward
              while it settles from 1.08, and from 1200 up it drifts with
              the scroll (Parallax, 0.06; the wrapper stands 6% taller than
              the box so no edge shows). Below 810 an article with a phone
              cut draws it: a 4:3 frame of the screen, not the whole capture
              shrunk into the box.

              An article with no honest picture draws the Contraxis diagram
              (28 September 2026) with the clip reveal alone: its layouts
              are chosen by the size of their box, so the box is not given
              extra height to drift in. Its phone layout runs top to bottom,
              so the box takes 3:4 there; a 4:3 box would shrink it. */}
          <figure className="flex w-full flex-col gap-(--space-2)">
            <Card radius={30} className="overflow-clip">
              <InView mode="clip" className="relative w-full overflow-clip">
                {a.src ? (
                  <div className="relative aspect-[16/9] w-full mobile:aspect-[4/3]">
                    <Parallax speed={0.06} className="absolute inset-x-0 -inset-y-[6%]">
                      <div className="settle absolute inset-0">
                        <ArtImg
                          src={a.src}
                          srcTall={a.srcTall}
                          media="(max-width: 809.98px)"
                          alt={a.alt}
                          sizes="(max-width: 1199px) 100vw, 1380px"
                          sizesTall="calc(100vw - 40px)"
                          className="media-fill object-left-top"
                        />
                      </div>
                    </Parallax>
                  </div>
                ) : (
                  <div className="relative aspect-[21/9] w-full mobile:aspect-[3/4]">
                    {/* On the raised ground, not the page's: the box has the
                        site's rounded edge only if it is a shade lighter than
                        what it sits on. */}
                    <div className="settle absolute inset-0 bg-raised">
                      <SystemDiagram
                        preset="cover"
                        className="absolute inset-x-0 bottom-[60px] top-[60px] mobile:bottom-[44px] mobile:top-[44px]"
                      />
                    </div>
                  </div>
                )}
              </InView>
            </Card>
            {/* The caption under the box, on its hairline (C3, 28 September
                2026; it sat inside the box's foot). Hidden from a screen
                reader, which hears the diagram's own description. */}
            {a.src ? null : (
              <div aria-hidden="true">
                <Caption as="div">{DIAGRAM_CAPTION}</Caption>
              </div>
            )}
          </figure>

          {/* THE READING COLUMN (28 September 2026): 620 wide, the
              paragraphs in `.t-read` (19px on 1.55, at 85% ink, the colour
              the class carries), the block headings in `.t-article-h2`. */}
          <div className="mx-auto flex w-full max-w-[620px] flex-col gap-(--space-row)">
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

            {/* The disclosure belongs to the article, not to the template.
                This line used to read "OPS is in development" under all
                three, including the one that never mentions OPS.

                A SENTENCE, SO IT IS SET AS ONE (C10.1, 28 September 2026):
                the caption type in sentence case at 60%, with no label mark
                in front of it. The words are unchanged. */}
            <InView className="border-t border-rule pt-(--space-4)">
              <p className="t-caption text-ink-2">
                {I.byline}
                {a.note ? ` · ${a.note}` : null}
              </p>
            </InView>
          </div>
        </div>
      </article>

      {others.length ? (
        <section aria-labelledby="more-art" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
          <div className="shell flex w-full flex-col gap-(--space-alone)">
            <SectionHead id="more-art" label="MORE INSIGHTS" lines={['More insights.']} />
            {/* Card/Insight, one reveal per card, the second column 90ms
                after the first; one column on a phone, where both are
                step 0. */}
            <div className="seam grid w-full grid-cols-2 phone:grid-cols-1">
              {others.map((o, i) => (
                <ArticleCard key={o.slug} article={o} step={i % 2} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
