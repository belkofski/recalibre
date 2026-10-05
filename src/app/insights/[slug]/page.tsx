import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArtImg } from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { Caption, Chevron, LabelRow, LinkedText } from '@/components/ui';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import { pageMeta } from '@/lib/seo';
import { ArticleLd } from '@/components/JsonLd';
import { ARTICLES, INSIGHTS_BLOCK as I, readingMinutes } from '@/content/insights';

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
     the cover panel       one image at the page width, rounded and grained
     the body              a 620px measure, centred, in the reading type
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
  /* The products the body names are linked at their first mention only,
     across all its paragraphs (5 October 2026). */
  const linked = new Set<string>();

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
        className="pad-x relative flex w-full flex-col items-center overflow-clip pt-[176px] tablet:pt-[160px] mobile:pt-[136px]"
      >
        <div className="shell grid w-full grid-cols-2 items-start gap-[40px] narrow:grid-cols-1">
          <div className="flex w-[600px] max-w-full flex-col gap-(--space-lede) pr-[50px] narrow:w-full narrow:pr-0">
            {/* Back is the chevron mirrored, never turned (28 September
                2026); on hover it moves 2px back and the words light. */}
            <Link href="/insights" className="tap-44 flex w-fit items-center gap-[8px]">
              <Chevron dir="back" className="text-accent-bright" />
              <span className="t-mono-11 hover-read">ALL INSIGHTS</span>
            </Link>
            {/* At display size, as every page's H1 is (28 September 2026):
                at 40px it was smaller than the H2s under it. */}
            <Rise as="h1" id="art-head" lines={[a.title]} wrap className="t-display text-ink" />
          </div>

          <div className="flex flex-col gap-[40px]">
            <InView>
              <p className="t-lede max-w-[500px] text-ink-2">{a.dek}</p>
            </InView>
            {/* TWO CELLS ON A TWO-COLUMN RAIL. A third cell printed
                PUBLISHED. The site has never been public, so no article has
                a true publication date yet, and the cell came off rather
                than carry a guessed one (the founder's decision, 24 September
                2026). The two that remain share the row in halves, which he
                chose the same evening over leaving the third column empty. */}
            <InView delay={90} className="grid grid-cols-2 border-t border-rule pt-[32px] mobile:grid-cols-1 mobile:gap-[24px]">
              {(
                [
                  ['WRITTEN BY', I.byline],
                  ['SUBJECT', a.subject],
                ] as const
              ).map(([k, v], i) => (
                <div
                  key={k}
                  className={`flex flex-col gap-[8px] ${i > 0 ? 'border-l border-rule pl-[24px] mobile:border-0 mobile:pl-0' : ''}`}
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
        <div className="shell flex w-full flex-col gap-[64px] mobile:gap-[40px]">
          {/* An article with no honest picture draws the Contraxis diagram
              (28 September 2026). Its phone layout runs top to bottom, so
              the box takes 3:4 there; a 4:3 box would shrink it.

              THE PICTURE TIER (28 September 2026): the cover fades in with
              no travel while the picture settles from 1.06 to 1. Below 810
              an article with a phone cut draws it: a 4:3 frame of the
              screen, not the whole capture shrunk into the box. */}
          <div className="flex w-full flex-col gap-[12px]">
            <InView mode="picture" className="relative w-full overflow-clip rounded-[30px] mobile:rounded-[20px]">
              {a.src ? (
                <div className="relative aspect-[21/9] w-full mobile:aspect-[4/3]">
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
                </div>
              ) : (
                <div className="relative aspect-[21/9] w-full mobile:aspect-[3/4]">
                  {/* On the raised ground, not the page's: the box has the
                      site's rounded edge only if it is a shade lighter than
                      what it sits on. */}
                  <span className="absolute inset-0 bg-raised">
                    <SystemDiagram
                      preset="cover"
                      className="absolute inset-x-0 bottom-[60px] top-[60px] mobile:bottom-[44px] mobile:top-[44px]"
                    />
                  </span>
                </div>
              )}
            </InView>
            {/* The caption under the box, on its hairline (C3, 28 September
                2026; it sat inside the box's foot). Hidden from a screen
                reader, which hears the diagram's own description. */}
            {a.src ? null : (
              <div aria-hidden="true">
                <Caption as="div">{DIAGRAM_CAPTION}</Caption>
              </div>
            )}
          </div>

          {/* THE READING COLUMN (28 September 2026): 620 wide, the
              paragraphs in `.t-read` (19px on 1.55, at 85% ink, the colour
              the class carries), the block headings in `.t-article-h2`. */}
          <div className="mx-auto flex w-full max-w-[620px] flex-col gap-[40px]">
            <p className="t-lede border-l border-accent-bright pl-[24px] text-ink">{a.standfirst}</p>

            {a.body.map((block, i) => (
              <InView key={i} className="flex flex-col gap-[16px]">
                {block.heading ? <h2 className="t-article-h2 text-ink">{block.heading}</h2> : null}
                {block.paragraphs.map((p, j) => (
                  <p key={j} className="t-read">
                    <LinkedText text={p} links={a.links} seen={linked} />
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
            <div className="border-t border-rule pt-[24px]">
              <p className="t-caption text-ink-2">
                {I.byline}
                {a.note ? ` · ${a.note}` : null}
              </p>
            </div>
          </div>
        </div>
      </article>

      <section aria-labelledby="more-art" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-alone)">
          <div className="flex w-full flex-col items-end gap-(--space-label)">
            <LabelRow label="MORE INSIGHTS" />
            <div className="flex w-[690px] narrow:w-full">
              <h2 id="more-art" className="t-display text-ink">
                More insights.
              </h2>
            </div>
          </div>

          {/* ONE REVEAL PER CARD, the second column 90ms after the first
              (28 September 2026); one column on a phone, where both are
              step 0. The card lifts 4% on hover and its dot fills. */}
          <div className="seam grid w-full grid-cols-2 mobile:grid-cols-1">
            {others.map((o, i) => (
              <InView
                as="article"
                key={o.slug}
                step={i % 2}
                className="card-30 group hover-lift relative flex flex-col justify-between gap-[32px] p-(--card-pad)"
              >
                <span className="t-mono-11 tabular-nums text-ink-2">
                  {o.subject} · {readingMinutes(o)} MIN READ
                </span>
                <div className="flex flex-col gap-[16px]">
                  <h3 className="t-card text-ink">
                    <Link href={`/insights/${o.slug}`} className="tap-44">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {o.title}
                    </Link>
                  </h3>
                  <p className="t-body text-ink-2">{o.dek}</p>
                  <span className="t-mono hover-read flex items-center gap-[8px]">
                    READ THE ARTICLE
                    <span className="dot-btn">
                      <Chevron />
                    </span>
                  </span>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
