import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Img from '@/lib/Img';
import { Rise, InView, Scene } from '@/lib/motion';
import SystemDiagram from '@/components/SystemDiagram';
import { Caption, Card, Chevron, Orbs } from '@/components/ui';
import CaptureCard from '@/sections/work/CaptureCard';
import CaseStack from '@/sections/work/CaseStack';
import CasePictures from '@/sections/work/CasePictures';
import MoreWork from '@/sections/work/MoreWork';
import { pageMeta } from '@/lib/seo';
import { INITIATIVES, initiativeBySlug } from '@/content/work';

/* ONLY THE SLUGS IN THE LIST. Without this, an address like /work/nope
   was built on request, and what the server sent for it was an empty
   shell that filled in with the 404 card only once scripts ran, under a
   title and search tags that argued with each other. A slug that is not
   in the list is now refused at the door, and the reader gets the same
   full "page not found" page as any other wrong address. */
export const dynamicParams = false;

export function generateStaticParams() {
  return INITIATIVES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = initiativeBySlug(slug);
  if (!item) return { title: 'Not found' };
  return pageMeta({
    title: item.tab,
    description: item.blurb ?? item.summary,
    path: `/work/${item.slug}`,
    image: item.share,
    imageAlt: item.shareAlt,
  });
}

/* ============================================================================
   AN INITIATIVE PAGE — the case-study template.

     the cover            the words on a surface beside the picture as an
                          object: the OPS overview in a device frame on a
                          tilting surface, a photograph on a tilting
                          surface, or the Contraxis system drawing on a
                          dotted bed. As the reader scrolls away it steps
                          back and dims while its picture leans in
                          (`Scene`, `.sx-recede`, `.case-zoom`).
     #problem, #system,   one STACK of four cards that slide over one
     #built, #status      another, cut to fit a window, the numerals
                          drifting (sections/work/CaseStack.tsx)
     #pictures            a row that slides sideways while the page goes
                          down, or the one picture opening from its foot
                          (sections/work/CasePictures.tsx); none on
                          Contraxis, whose diagram is the cover
     more work            the two that follow, as text links on surface
                          cards (sections/work/MoreWork.tsx)

   ONE PICTURE, ONE PLACE (the owner's third note): no picture appears
   twice on a page, and the cross-links carry none. ONE "Demonstration
   data." per page where OPS screens show, on the cover.

   TWO OF THE REFERENCE'S BLOCKS ARE NOT HERE. Its project-team row names
   three employees, and its client-quote block carries a five-star rating
   and an attributed quote. Recalibre has no employee to name and no client
   who has given written permission to be quoted, so both are removed rather
   than filled. A case study ends with the work: the footer carries the
   page's one calibration button.
   ========================================================================= */
export default async function InitiativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = initiativeBySlug(slug);
  if (!item) notFound();

  /* The two that FOLLOW this one in the list, wrapping round the end, so
     each page points at a different pair; the first of them is next. */
  const here = INITIATIVES.findIndex((i) => i.slug === item.slug);
  const others = [...INITIATIVES.slice(here + 1), ...INITIATIVES.slice(0, here)].slice(0, 2);

  return (
    <>
      {/* ── 1. THE COVER ────────────────────────────────────────────────
          A split, not a full-bleed panel with text on top: the OPS cover
          is a white dashboard, which cannot carry white type. Two cards on
          the 2px seam; below 1200 the picture goes on top. */}
      <Scene
        as="section"
        aria-labelledby="init-head"
        className="pad-x relative flex w-full flex-col items-center bg-raised pb-(--space-5) pt-[calc(var(--bar)+var(--space-4))] phone:pb-(--space-4) phone:pt-[calc(var(--bar)+var(--space-3))]"
      >
        <div className="sx-recede shell">
          <div className="seam grid w-full grid-cols-[440px_1fr] narrow:grid-cols-1">
            <Card
              radius={30}
              pad
              spot
              className="flex flex-col justify-between gap-(--space-6) narrow:gap-(--space-5) mobile:gap-(--space-4)"
            >
              {/* Back is the chevron mirrored, never turned. */}
              <Link href="/work" className="tap-44 flex w-fit items-center gap-(--space-1)">
                <Chevron dir="back" className="text-accent-bright" />
                <span className="t-mono-11 hover-read">ALL WORK</span>
              </Link>

              <div className="flex flex-col gap-(--space-4)">
                <Rise as="h1" id="init-head" lines={[`${item.name}.`]} wrap className="t-display text-ink" />
                {/* The flagship's own one line where it has one (OPS);
                    the summary otherwise. One line, not both. */}
                <InView delay={60}>
                  {item.tagline ? (
                    <p className="t-lede max-w-[400px] text-ink">{item.tagline}</p>
                  ) : (
                    <p className="t-body max-w-[400px] text-ink-2">{item.summary}</p>
                  )}
                </InView>
                {/* The page's one honesty line: the OPS screens here run on
                    demonstration data. */}
                {item.demo ? (
                  <InView delay={120}>
                    <Caption as="div">{item.demo}</Caption>
                  </InView>
                ) : null}
              </div>
            </Card>

            {item.hero && item.demo ? (
              /* THE CAPTURE: the page's main picture, asked for first. */
              <CaptureCard
                src={item.hero}
                srcTall={item.heroTall}
                alt={item.heroAlt}
                sizes="(max-width: 1199px) 100vw, 760px"
                sizesTall="calc(100vw - 80px)"
                className="narrow:order-first"
              />
            ) : item.hero ? (
              /* THE PHOTOGRAPH, at the cover files' own 7:5 (4:3 below
                 810). The layer is cut 6% larger than the card so the lean
                 never shows an edge; the scroll zoom sits inside it. */
              <InView mode="clip" className="aspect-[7/5] narrow:order-first mobile:aspect-[4/3]">
                <Card radius={30} spot tilt className="h-full overflow-clip">
                  <span className="tilt-layer absolute -inset-[6%] block">
                    <span className="settle case-zoom absolute inset-0 block">
                      <Img src={item.hero} alt={item.heroAlt} priority sizes="(max-width: 1199px) 100vw, 940px" className="media-fill" />
                    </span>
                  </span>
                </Card>
              </InView>
            ) : (
              /* THE SYSTEM DIAGRAM, where a cover picture would be, on a
                 dotted bed with the light behind it. Its own description
                 tells a screen reader it is a schematic. */
              <Card radius={30} spot className="aspect-[7/5] overflow-clip narrow:order-first narrow:aspect-[4/3] mobile:aspect-[5/6]">
                <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />
                <Orbs variant="card" />
                <div className="case-zoom absolute inset-0">
                  <SystemDiagram preset="cover" className="absolute inset-x-0 inset-y-[48px] mobile:inset-y-[24px]" />
                </div>
              </Card>
            )}
          </div>
        </div>
      </Scene>

      {/* ── 2. THE CHAPTERS, AS ONE STACK ─────────────────────────────── */}
      <CaseStack item={item} />

      {/* ── 3. THE PICTURES ───────────────────────────────────────────── */}
      <CasePictures item={item} />

      {/* ── 4. MORE WORK ──────────────────────────────────────────────── */}
      <MoreWork items={others} />
    </>
  );
}
