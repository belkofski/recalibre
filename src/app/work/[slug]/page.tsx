import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Img, { ArtImg } from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import {
  Card,
  cardClass,
  Caption,
  Chevron,
  Chip,
  FirmMark,
  LabelRow,
  MonoLink,
  Pill,
  SectionHead,
  Status,
} from '@/components/ui';
import Shot from '@/sections/work/Shot';
import MoreWork from '@/sections/work/MoreWork';
import { pageMeta } from '@/lib/seo';
import { CASE_CHAPTERS as C, INITIATIVES, initiativeBySlug } from '@/content/work';
import { SPOTLIGHT } from '@/content/home';

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
   audit, 6 October 2026: THE PROBLEM / THE SYSTEM / WHAT WE BUILT / STATUS;
   see CASE_CHAPTERS in content/work.ts for why the last is STATUS and not
   RESULT).

     the cover            a split: the words on the page's own ground, the
                          picture published whole beside them, clip-revealed;
                          a rail of four anchors under it
     #problem             the two-tone paragraph, the scope at its right
     #system              the meta grid, and the facts where an entry has any
     #built               the list, as rows on hairlines
     #pictures            the first shot full width, the rest on the seam
     #status              one card: the state, the note, the owner, and NEXT
     more work            the two initiatives that follow

   TWO OF THE REFERENCE'S BLOCKS ARE NOT HERE. Its project-team row names
   three employees, and its client-quote block carries a five-star rating
   and an attributed quote. Recalibre has no employee to name and no client
   who has given written permission to be quoted, so both are removed rather
   than filled.

   A case study ends with the work: no FAQ tail (the owner's Phase A brief,
   27 September 2026 — the FAQ is read on Contact). The footer carries the
   page's one calibration button.
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

  /* The two-tone paragraph: the first sentence in full ink, the rest at
     60%. Split once, on the first sentence end. */
  const sentences = item.problem.body.split('. ');
  const lead = sentences[0];
  const tail = sentences.slice(1).join('. ');

  const meta = [
    ['YEAR', item.year],
    ['CATEGORY', item.category],
    ['STATUS', item.status],
    /* The owner is named on the entry — a client's or a partner's. The
       two products in development name none and print "In-house
       product". This used to fall back to the firm's name for any
       finished entry, which is what printed "Recalibre" as Belkofski's
       owner. */
    ['OWNER', item.owner ?? 'In-house product'],
  ] as const;
  const owner = meta[3][1];

  const [first, ...moreShots] = item.shots;

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
          top, which is how the work cards stack too. The picture takes the
          clip reveal: it appears from its foot upward and settles.
          ───────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="init-head"
        className="pad-x relative flex w-full flex-col items-center bg-raised pb-(--space-5) pt-[calc(var(--bar)+var(--space-4))] phone:pb-(--space-4) phone:pt-[calc(var(--bar)+var(--space-3))]"
      >
        <div className="shell flex w-full flex-col gap-(--space-4)">
          <div className="seam grid w-full grid-cols-[480px_1fr] narrow:grid-cols-1">
            <Card radius={30} pad className="flex flex-col justify-between gap-(--space-6) narrow:gap-(--space-5) mobile:gap-(--space-4)">
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

            {item.hero ? (
              <InView
                mode="clip"
                className={`${cardClass({ radius: 30 })} aspect-[7/5] overflow-clip narrow:order-first narrow:aspect-[16/10] mobile:aspect-[4/3]`}
              >
                <span className="settle absolute inset-0 block">
                  {item.heroTall ? (
                    /* Below 810 the cover's own phone cut: a 4:3 frame at
                       a readable scale, not the wide cover shrunk. */
                    <ArtImg
                      src={item.hero}
                      srcTall={item.heroTall}
                      media="(max-width: 809.98px)"
                      alt={item.heroAlt}
                      sizes="(max-width: 1199px) 100vw, 900px"
                      sizesTall="calc(100vw - 44px)"
                      className="media-fill"
                    />
                  ) : (
                    <Img
                      src={item.hero}
                      alt={item.heroAlt}
                      priority
                      sizes="(max-width: 1199px) 100vw, 900px"
                      className="media-fill"
                    />
                  )}
                </span>
              </InView>
            ) : (
              /* THE SYSTEM DIAGRAM, where a cover picture would be. Its
                 caption runs along the card's foot on the caption hairline,
                 40px up (20 on a phone), and the diagram takes the box
                 above the hairline. The dots run only under the pointer
                 (see SystemDiagram.tsx), so there is no pause control. The
                 caption is hidden from a screen reader, which hears the
                 diagram's own description. */
              <Card radius={30} className="aspect-[7/5] overflow-clip narrow:order-first narrow:aspect-[4/3] mobile:aspect-[5/6]">
                <span className="absolute inset-0 bg-ground">
                  <SystemDiagram
                    preset="cover"
                    className="absolute inset-x-0 bottom-[72px] top-[84px] mobile:bottom-[52px] mobile:top-[64px]"
                  />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-[40px] mobile:bottom-[20px]">
                    <Caption as="div" className="px-(--card-pad)">
                      {DIAGRAM_CAPTION}
                    </Caption>
                  </div>
                </span>
              </Card>
            )}
          </div>

          {/* THE CHAPTER RAIL: four same-page anchors, as pills, each a
              44px target. The browser's own fragment navigation scrolls on
              every click and stops under the bar (scroll-padding). */}
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

      {/* ── 2. THE PROBLEM ───────────────────────────────────────────────
          The paragraph in two tones, the scope at its right. Never a
          client's problem unless the client has given permission (see
          `problem` in content/work.ts). No calibration link here: the
          footer carries the page's one button. */}
      <section id={C.problem.id} aria-labelledby="problem-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-alone)">
          <SectionHead id="problem-head" label={C.problem.label} lines={[C.problem.heading]} />
          <div className="grid w-full grid-cols-2 gap-(--space-8) narrow:grid-cols-1 narrow:gap-(--space-5)">
            <InView>
              <p className="t-lede text-ink">
                {lead}.{tail ? <span className="text-ink-2"> {tail}</span> : null}
              </p>
            </InView>
            <InView delay={90} className="flex flex-col gap-(--space-4)">
              <p className="t-mono text-ink-3">SCOPE</p>
              <div className="flex flex-wrap gap-(--space-1)">
                {item.scope.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </InView>
          </div>
        </div>
      </section>

      {/* ── 3. THE SYSTEM ────────────────────────────────────────────────
          The structural facts, read out of the record: the four fields
          every entry has, then the facts where an entry has any. Never
          results. */}
      <section id={C.system.id} aria-labelledby="system-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-alone)">
          <SectionHead id="system-head" label={C.system.label} lines={[C.system.heading]} />
          <div className="flex w-full flex-col gap-(--space-6) mobile:gap-(--space-5)">
            <dl className="grid w-full grid-cols-4 gap-x-(--space-5) tablet:grid-cols-2 tablet:gap-y-(--space-5) mobile:grid-cols-2 mobile:gap-(--space-4)">
              {meta.map(([k, v], i) => (
                /* One reveal per cell, staggered by its column: four
                   across, two on a tablet and a phone. Each cell on its
                   own hairline. */
                <InView key={k} step={i} className="flex flex-col gap-(--space-2) border-t border-rule pt-(--space-3)">
                  <dt className="t-mono text-ink-3">{k}</dt>
                  {/* Tabular, so the year's digits keep the ladder's
                      widths. THE STATUS: the dot and the words, no capsule;
                      the signal blue for work in development, ink at 50%
                      for delivered and partner work. Same words. */}
                  <dd className={`t-body text-ink ${k === 'YEAR' ? 'tabular-nums' : ''}`}>
                    {k === 'STATUS' ? (
                      <Status state={item.tone === 'dev' ? 'development' : 'delivered'} className="text-ink">
                        {v}
                      </Status>
                    ) : (
                      v
                    )}
                  </dd>
                </InView>
              ))}
            </dl>

            {/* THE FIGURE MAY BE A WORD, AND THE UNIT MAY BE EMPTY. OPS
                prints no count (25 September 2026): its three cells carry
                "Offline", "Self-hosted" and "FR · AR" with no unit, so the
                key is the label and the unit span is drawn only where a
                unit is set. The row is left out altogether when an entry
                has no facts. At card size, not display: a page has one
                loud voice. */}
            {item.facts.length > 0 ? (
              <div className="grid w-full grid-cols-3 gap-x-(--space-5) mobile:grid-cols-1 mobile:gap-(--space-4)">
                {item.facts.map((f, i) => (
                  <InView key={f.label} step={i} className="flex flex-col gap-(--space-2) border-t border-rule pt-(--space-3)">
                    <p className="t-card tabular-nums text-ink">
                      {f.value}
                      {f.unit ? <span className="t-lede text-ink-3"> {f.unit}</span> : null}
                    </p>
                    <p className="t-mono max-w-[220px] text-ink-2">{f.label}</p>
                  </InView>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── 4. WHAT WE BUILT ─────────────────────────────────────────────
          The heading is each entry's own (`builtHeading`): a shared "What
          is built." told a reader that a concept with no code had been
          built. The list as rows on hairlines, each with the '///' in
          front. NO NUMBER: the items are not in an order, so a 01-06 over
          them only counted content. Each row reveals as it arrives, a step
          after the one above. */}
      <section id={C.built.id} aria-labelledby="built-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-alone)">
          <SectionHead id="built-head" label={item.problem.label} lines={[item.builtHeading]} wrap />
          <ul className="flex w-full flex-col">
            {item.built.map((b, i) => (
              <InView
                as="li"
                key={b}
                delay={Math.min(i, 5) * 60}
                className="flex items-start gap-(--space-3) border-t border-rule py-(--space-4) last:border-b"
              >
                <FirmMark className="case-row-mark text-ink-3" />
                <span className="t-body max-w-[840px] text-ink">{b}</span>
              </InView>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 5. THE PICTURES ──────────────────────────────────────────────
          The first shot full width, the page's one massive visual, with
          the clip reveal; the rest on the seam grid, each at its own
          shape, paired by shape where two share a row. OPS runs all four
          full width: three are wide, and the 4:3 daily report has no
          partner of its shape left on the page (25 September 2026).
          Belkofski's gallery is one picture, the court shot (D-06).
          Contraxis has no interface and keeps the gallery diagram. */}
      <section id={C.pictures.id} aria-label="Images" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-row)">
          <LabelRow label={C.pictures.label} />
          {first ? (
            <div className="seam grid w-full grid-cols-2 mobile:grid-cols-1">
              <Shot shot={first} mode="clip" wide />
              {moreShots.map((shot, i) => (
                <Shot key={shot.src} shot={shot} wide={Boolean(shot.wide)} step={shot.wide ? 0 : i % 2} />
              ))}
            </div>
          ) : (
            <InView mode="scale" className={`${cardClass({ radius: 30 })} flex w-full items-center justify-center overflow-clip py-(--space-7)`}>
              {/* The same box the schematic drew in — a square 86% of the
                  panel, and a 360:470 block across a phone — so the panel
                  keeps its height. The caption on its hairline across the
                  panel's foot, hidden from a screen reader, which hears
                  the diagram's own description. */}
              <SystemDiagram
                preset="gallery"
                className="relative aspect-square w-[86%] mobile:aspect-[360/470] mobile:w-full"
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-[20px]">
                <Caption as="div" className="px-(--card-pad)">
                  {DIAGRAM_CAPTION}
                </Caption>
              </div>
            </InView>
          )}
        </div>
      </section>

      {/* ── 6. STATUS ────────────────────────────────────────────────────
          Where it stands, and nothing more: the state as the entry prints
          it, the demonstration note where the screens run on demonstration
          data (SPOTLIGHT's own line, content/home.ts), the owner, and the
          way on to the next case. The site states a status and stops; it
          does not explain an absence (see `absent` in content/work.ts). */}
      <section id={C.status.id} aria-labelledby="status-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-alone)">
          <SectionHead id="status-head" label={C.status.label} lines={[C.status.heading]} />
          <InView mode="scale" className="seam flex w-full">
            <Card radius={30} pad className="flex w-full flex-col gap-(--space-6) mobile:gap-(--space-5)">
              <div className="grid w-full grid-cols-2 gap-(--space-8) narrow:gap-(--space-5) mobile:grid-cols-1">
                <div className="flex flex-col items-start gap-(--space-3)">
                  <Status state={item.tone === 'dev' ? 'development' : 'delivered'} className="text-ink">
                    {item.status}
                  </Status>
                  {item.demo ? <p className="t-body max-w-[440px] text-ink-2">{SPOTLIGHT.status.note}</p> : null}
                </div>
                <div className="flex flex-col gap-(--space-2)">
                  <p className="t-mono text-ink-3">{meta[3][0]}</p>
                  <p className="t-body text-ink">{owner}</p>
                </div>
              </div>
              {/* The way on: NEXT and the next initiative's name, on the
                  card's foot hairline. */}
              {next ? (
                <div className="flex w-full justify-end border-t border-rule pt-(--space-4)">
                  <MonoLink href={`/work/${next.slug}`} lead="NEXT" label={next.name} />
                </div>
              ) : null}
            </Card>
          </InView>
        </div>
      </section>

      {/* ── 7. MORE WORK ─────────────────────────────────────────────── */}
      <MoreWork items={others} />
    </>
  );
}
