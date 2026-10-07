import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import { Caption, Card, Chevron, Orbs, Pill } from '@/components/ui';
import CaptureCard from '@/sections/work/CaptureCard';
import CaseStack from '@/sections/work/CaseStack';
import PicturesRail from '@/sections/work/PicturesRail';
import MoreWork from '@/sections/work/MoreWork';
import { pageMeta } from '@/lib/seo';
import { CASE_CHAPTERS as C, INITIATIVES, initiativeBySlug } from '@/content/work';

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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

/* The chapters a reader can jump to from the cover: the four with a
   heading. The pictures have a label and no heading, and are reached by
   scrolling. */
/* The third chapter is named by the entry itself (`problem.label`: WHAT WAS
   DELIVERED, WHAT A SITE GETS, WHAT IT IS MEANT TO DO), never by one shared
   word: "WHAT WE BUILT" over a concept with no code, or a product in
   development, was a build claim the content takes care not to make. */
const rail = (label: string) => [C.problem, C.system, { id: C.built.id, label }, C.status] as const;

/* ============================================================================
   AN INITIATIVE PAGE — the case-study template, in chapters (the owner's
   audit: THE PROBLEM / THE SYSTEM / WHAT WE BUILT / STATUS; see
   CASE_CHAPTERS in content/work.ts for why the last is STATUS and not
   RESULT).

     the cover            a split: the words on a surface that lights under
                          the pointer, the picture beside them as an object
                          (a capture in a device frame on a tilting
                          surface, a photograph on a tilting surface, or
                          the system drawing on a dotted bed), clip-
                          revealed; a rail of four anchors under it
     #problem, #system,   one STACK of four surface cards that slide over
     #built, #status      one another (sections/work/CaseStack.tsx)
     #pictures            a snap rail of framed shots, or the one shot, or
                          the diagram (sections/work/PicturesRail.tsx)
     more work            the two initiatives that follow, as the shared
                          card (sections/work/MoreWork.tsx)

   TWO OF THE REFERENCE'S BLOCKS ARE NOT HERE. Its project-team row names
   three employees, and its client-quote block carries a five-star rating
   and an attributed quote. Recalibre has no employee to name and no client
   who has given written permission to be quoted, so both are removed rather
   than filled.

   A case study ends with the work: no FAQ tail (the owner's Phase A brief —
   the FAQ is read on Contact). The footer carries the page's one
   calibration button.
   ========================================================================= */
export default async function InitiativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = initiativeBySlug(slug);
  if (!item) notFound();

  /* The two that FOLLOW this one in the list, wrapping round the end, so
     each page points at a different pair; the first of them is NEXT. */
  const here = INITIATIVES.findIndex((i) => i.slug === item.slug);
  const others = [...INITIATIVES.slice(here + 1), ...INITIATIVES.slice(0, here)].slice(0, 2);
  const next = others[0];

  return (
    <>
      {/* ── 1. THE COVER ────────────────────────────────────────────────
          A SPLIT, NOT A FULL-BLEED PANEL WITH TEXT ON TOP.

          The reference sets its case-study title into the foot of one
          full-width photograph, and that works because every photograph it
          publishes is dark where the title lands. Ours are not: the OPS
          cover is a screenshot of a white dashboard, and it is the cover
          most worth showing at a size a reader can read. Darkening it
          enough to carry white type destroys the interface; not darkening
          it leaves the title on light grey. Both were tried.

          So the cover is two cards on the same 2px seam the rest of the
          site is built from. It stacks below 1200px with the picture on
          top, which is how the work cards stack too.

          THE PICTURE IS AN OBJECT, in one of three ways, by what the
          entry has: a product capture (the one whose screens run on
          demonstration data) in a device frame on a tilting surface with
          a dotted bed and the ambient light; a photograph on a tilting
          surface, the picture edge to edge under the surface's lit ring,
          with no light behind it (an orb behind an opaque picture is
          invisible); and the system drawing, where there is no picture to
          publish, on a dotted bed with the light behind it, which does not
          lean: a drawing is not a thing held in the hand.
          ───────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="init-head"
        className="pad-x relative flex w-full flex-col items-center bg-raised pb-(--space-5) pt-[calc(var(--bar)+var(--space-4))] phone:pb-(--space-4) phone:pt-[calc(var(--bar)+var(--space-3))]"
      >
        <div className="shell flex w-full flex-col gap-(--space-4)">
          <div className="seam grid w-full grid-cols-[480px_1fr] narrow:grid-cols-1">
            <Card
              radius={30}
              pad
              spot
              className="flex flex-col justify-between gap-(--space-6) narrow:gap-(--space-5) mobile:gap-(--space-4)"
            >
              {/* Back is the chevron mirrored, never turned; on hover it
                  moves 2px back and the words light. */}
              <Link href="/work" className="tap-44 flex w-fit items-center gap-(--space-1)">
                <Chevron dir="back" className="text-accent-bright" />
                <span className="t-mono-11 hover-read">ALL WORK</span>
              </Link>

              <div className="flex flex-col gap-(--space-4)">
                <Rise as="h1" id="init-head" lines={[`${item.name}.`]} wrap className="t-display text-ink" />
                {/* The owner's one line under the flagship's name; no
                    other initiative has one (content/work.ts). */}
                {item.tagline ? (
                  <InView delay={60}>
                    <p className="t-lede text-ink">{item.tagline}</p>
                  </InView>
                ) : null}
                <InView delay={120}>
                  <p className="t-body max-w-[420px] text-ink-2">{item.summary}</p>
                </InView>
              </div>
            </Card>

            {item.hero && item.demo ? (
              /* THE CAPTURE: the page's main picture, asked for first. The
                 widths are the screen's inside its frame: the column less
                 the bed's 64px each side from 1200 up, the window less the
                 gutters, the seam and the bed below 810. */
              <CaptureCard
                src={item.hero}
                srcTall={item.heroTall}
                alt={item.heroAlt}
                sizes="(max-width: 1199px) 100vw, 760px"
                sizesTall="calc(100vw - 80px)"
                className="narrow:order-first"
              />
            ) : item.hero ? (
              /* THE PHOTOGRAPH. The box keeps the covers' own 7:5 on a
                 tablet too: every cover file is 7:5. Below 810 it is 4:3.
                 The picture's layer is cut 6% larger than the card so the
                 lean never shows an edge; the tilt sits on the card inside
                 the reveal, never on the reveal. */
              <InView mode="clip" className="aspect-[7/5] narrow:order-first mobile:aspect-[4/3]">
                <Card radius={30} spot tilt className="h-full overflow-clip">
                  <span className="tilt-layer absolute -inset-[6%] block">
                    <span className="settle absolute inset-0 block">
                      <Img
                        src={item.hero}
                        alt={item.heroAlt}
                        priority
                        sizes="(max-width: 1199px) 100vw, 900px"
                        className="media-fill"
                      />
                    </span>
                  </span>
                </Card>
              </InView>
            ) : (
              /* THE SYSTEM DIAGRAM, where a cover picture would be, on a
                 dotted bed with the light behind it. Its caption runs
                 along the card's foot on the caption hairline, 40px up (20
                 on a phone), and the diagram takes the box above the
                 hairline. The dots run only under the pointer (see
                 SystemDiagram.tsx), so there is no pause control. The
                 caption is hidden from a screen reader, which hears the
                 diagram's own description. */
              <Card
                radius={30}
                spot
                className="aspect-[7/5] overflow-clip narrow:order-first narrow:aspect-[4/3] mobile:aspect-[5/6]"
              >
                <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />
                <Orbs variant="card" />
                <SystemDiagram
                  preset="cover"
                  className="absolute inset-x-0 bottom-[72px] top-[84px] mobile:bottom-[52px] mobile:top-[64px]"
                />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-[40px] mobile:bottom-[20px]">
                  <Caption as="div" className="px-(--card-pad)">
                    {DIAGRAM_CAPTION}
                  </Caption>
                </div>
              </Card>
            )}
          </div>

          {/* THE CHAPTER RAIL: four same-page anchors, as pills, each a
              44px target. The browser's own fragment navigation scrolls on
              every click and stops under the bar (scroll-padding, and the
              stack card's own scroll margin). */}
          <nav aria-label="Chapters">
            <InView delay={200} className="flex flex-wrap items-center gap-(--space-1) px-(--space-1)">
              {rail(item.problem.label).map((c) => (
                <Pill key={c.id} href={`#${c.id}`}>
                  {c.label}
                </Pill>
              ))}
            </InView>
          </nav>
        </div>
      </section>

      {/* ── 2. THE CHAPTERS, AS ONE STACK ─────────────────────────────── */}
      <CaseStack item={item} next={next} />

      {/* ── 3. THE PICTURES ───────────────────────────────────────────── */}
      <PicturesRail item={item} />

      {/* ── 4. MORE WORK ──────────────────────────────────────────────── */}
      <MoreWork items={others} />
    </>
  );
}
