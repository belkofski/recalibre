import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import { LabelRow, Pill, Chip, MonoLink, Glyph, Barcode, DotGrid } from '@/components/ui';
import { pageMeta } from '@/lib/seo';
import { IMAGE_SIZE } from '@/lib/images.generated';
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

/* ============================================================================
   AN INITIATIVE PAGE — the reference's case-study template.

     the cover panel      full width, the title set into its foot
     the meta grid        four fields across, then a two-tone paragraph
     the problem          right-aligned heading over the copy
     the facts            figures at counter scale
     what is built        a numbered list on hairlines
     the gallery          one shot to a row, each at its own shape
     more initiatives     two cards on the seam plate

   TWO OF THE REFERENCE'S BLOCKS ARE NOT HERE. Its project-team row names
   three employees, and its client-quote block carries a five-star rating
   and an attributed quote. Recalibre has no employee to name and no client
   who has given written permission to be quoted, so both are removed rather
   than filled. The cover panel and the facts row take their space.
   ========================================================================= */
export default async function InitiativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = initiativeBySlug(slug);
  if (!item) notFound();

  /* TWO CARDS, NOT EVERY OTHER ONE. The block below is a two-column seam
     plate; with four initiatives on the site a plain "all the others" is
     three cards and leaves an orphan in the second row. These are the two
     that FOLLOW this one in the list, wrapping round the end, so each
     detail page points at a different pair instead of the same two every
     time. */
  const here = INITIATIVES.findIndex((i) => i.slug === item.slug);
  const others = [...INITIATIVES.slice(here + 1), ...INITIATIVES.slice(0, here)].slice(0, 2);
  /* A PAIR WITH THE DIAGRAM IN IT STANDS TALLER below the desktop (the
     owner's decision of 26 September 2026). At 1.6:1 a tablet's card left
     the diagram a strip 80-140px tall and it could draw its icon tiles
     only; at 360px tall it prints its words. Both cards of the pair take
     the height, so the row stays even. On a phone the cards stand one
     under the other and only the diagram's card grows (see below). Each
     taller card is also set to its column's full width: with a 1.6:1
     ratio and no width of its own, a card turns a minimum height into a
     minimum width (360 x 1.6 = 576) and runs out of its column. */
  const tallPair = others.some((o) => !o.cover);

  return (
    <>
      {/* ── the cover panel ─────────────────────────────────────────────
          A SPLIT, NOT A FULL-BLEED PANEL WITH TEXT ON TOP.

          The reference sets its case-study title into the foot of one
          full-width photograph, and that works because every photograph it
          publishes is dark where the title lands. Ours are not: the OPS
          cover is a screenshot of a white dashboard, and it is the cover
          most worth showing at a size a reader can read. Darkening it enough
          to carry white type destroys the interface; not darkening it leaves
          the title on light grey. Both were tried.

          So the cover is two cards on the same 2px seam the rest of the site
          is built from — the words on the page's own ground, the picture
          published whole beside them. It stacks below 1200px with the
          picture on top, which is how the work cards stack too.
          ───────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="init-head"
        className="pad-x relative flex w-full flex-col items-center bg-raised pb-[30px] pt-[80px] tablet:pt-[74px] mobile:pb-[20px] mobile:pt-[70px]"
      >
        <div className="seam shell grid w-full grid-cols-[480px_1fr] narrow:grid-cols-1">
          <div className="card-30 flex min-h-[640px] flex-col justify-between gap-[40px] p-[40px] narrow:min-h-0 narrow:gap-[30px] mobile:gap-[24px] mobile:p-[20px]">
            <Link href="/work" className="focus-ring tap-44 flex w-fit items-center gap-[7px]">
              <Glyph className="rotate-180 [&>i]:bg-accent-bright" />
              <span className="t-mono text-ink-2">ALL WORK</span>
            </Link>

            <div className="flex flex-col gap-[24px]">
              <span className="flex w-fit items-center gap-[7px] rounded-full border border-rule-2 bg-white/[0.04] py-[6px] pl-[10px] pr-[13px]">
                <span
                  className={`block h-[6px] w-[6px] flex-none rounded-full ${item.tone === 'owned' ? 'bg-accent-bright' : 'bg-flare'}`}
                  aria-hidden="true"
                />
                <span className="t-tag text-ink">{item.status}</span>
              </span>
              <Rise as="h1" id="init-head" lines={[`${item.name}.`]} wrap className="t-display text-ink" />
              <p className="t-body max-w-[420px] text-ink-2">{item.summary}</p>
            </div>

            <div className="flex items-end justify-between gap-[20px] narrow:hidden">
              <DotGrid cols={7} rows={4} />
              <Barcode className="h-[13px] w-[118px]" />
            </div>
          </div>

          <div
            className={`card-30 relative min-h-[640px] overflow-clip narrow:order-first narrow:min-h-0 ${
              item.hero ? 'narrow:aspect-[16/10] mobile:aspect-[4/3]' : 'narrow:aspect-[4/3] mobile:aspect-[5/6]'
            }`}
          >
            {item.hero ? (
              <Img
                src={item.hero}
                alt={item.heroAlt}
                priority
                sizes="(max-width: 1199px) 100vw, 900px"
                className="media-fill"
              />
            ) : (
              /* THE SYSTEM DIAGRAM, where a cover picture would be. Its
                 caption sits on the same 40px line as the barcode in the
                 card beside it, and the diagram takes the box above,
                 clear of the line where that card prints "ALL WORK".
                 Here the dots loop, so the pause control stands on the
                 caption's line at the other side, under the box. */
              <span className="absolute inset-0 bg-ground">
                <SystemDiagram
                  preset="cover"
                  loop
                  className="absolute inset-x-0 bottom-[56px] top-[84px] mobile:bottom-[36px] mobile:top-[64px]"
                  pauseClassName="absolute bottom-[24px] right-[40px] mobile:bottom-[4px] mobile:right-[20px]"
                />
                <span
                  className="t-mono-9 absolute bottom-[40px] left-[40px] text-ink-2 mobile:bottom-[20px] mobile:left-[20px]"
                  aria-hidden="true"
                >
                  {DIAGRAM_CAPTION}
                </span>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── the meta grid ───────────────────────────────────────────────── */}
      <section aria-label="Details" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-[70px] mobile:gap-[40px]">
          <div className="grid w-full grid-cols-4 tablet:grid-cols-2 tablet:gap-y-[30px] mobile:grid-cols-2 mobile:gap-[24px]">
            {(
              [
                ['YEAR', item.year],
                ['CATEGORY', item.category],
                ['STATUS', item.status],
                /* The owner is named on the entry — a client's or a
                   partner's. The two products in development name none
                   and print "In-house product". This used to fall back
                   to the firm's name for any finished entry, which is
                   what printed "Recalibre" as Belkofski's owner. */
                ['OWNER', item.owner ?? 'In-house product'],
              ] as const
            ).map(([k, v], i) => (
              <InView
                key={k}
                delay={i * 60}
                className={`flex flex-col gap-[12px] ${i > 0 ? 'border-l border-rule-2 pl-[40px] mobile:border-0 mobile:pl-0' : ''}`}
              >
                <p className="t-mono-9 text-ink-3">{k}</p>
                <p className="t-note text-ink">{v}</p>
              </InView>
            ))}
          </div>

          <div className="grid w-full grid-cols-2 gap-[100px] narrow:grid-cols-1 narrow:gap-[40px]">
            <InView className="flex flex-col items-start gap-[40px]">
              <p className="t-lede text-ink">
                {item.problem.body.split('. ')[0]}.
                <span className="text-ink-2"> {item.problem.body.split('. ').slice(1).join('. ')}</span>
              </p>
              <MonoLink href="/contact" label="START A CALIBRATION" />
            </InView>

            <InView delay={90} className="flex flex-col gap-[24px]">
              <p className="t-mono text-ink-2">SCOPE</p>
              <div className="flex flex-wrap gap-[8px]">
                {item.scope.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </InView>
          </div>
        </div>
      </section>

      {/* ── the facts ───────────────────────────────────────────────────── */}
      <section aria-labelledby="built-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-[70px] mobile:gap-[40px]">
          <div className="flex w-full flex-col items-end gap-[70px] mobile:gap-[30px]">
            <LabelRow label={item.problem.label} />
            <div className="flex w-[690px] narrow:w-full">
              {/* Per initiative. A shared "What is built." sat over a concept
                  with no code and over a brand that is not software. */}
              <h2 id="built-head" className="t-display text-ink">{item.builtHeading}</h2>
            </div>
          </div>

          {/* THE FIGURE MAY BE A WORD, AND THE UNIT MAY BE EMPTY. OPS prints
              no count (25 September 2026): its three cells carry "Offline",
              "Self-hosted" and "FR · AR" with no unit, so the key is the
              label and the unit span is drawn only where a unit is set. A
              row of one or two cells needs nothing more: the hairline sits
              on the cell, not on the column, so an empty column shows no
              border and each cell keeps the width it has in a full row. The
              row is left out altogether when an entry has no facts. */}
          {item.facts.length > 0 && (
            <div className="grid w-full grid-cols-3 mobile:grid-cols-1 mobile:gap-[28px]">
              {item.facts.map((f, i) => (
                <InView
                  key={f.label}
                  delay={i * 80}
                  className={`flex flex-col gap-[16px] ${i > 0 ? 'border-l border-rule-2 pl-[40px] mobile:border-0 mobile:pl-0' : ''}`}
                >
                  <p className="t-figure text-ink">
                    {f.value}
                    {f.unit ? <span className="t-body-lg text-ink-3"> {f.unit}</span> : null}
                  </p>
                  <p className="t-mono max-w-[220px] text-ink-2">{f.label}</p>
                </InView>
              ))}
            </div>
          )}

          <InView className="seam grid w-full grid-cols-2 mobile:grid-cols-1">
            {item.built.map((b, i) => (
              <div key={b} className="card-30 flex items-start gap-[18px] p-[30px] mobile:p-[20px]">
                <span className="t-mono-11 shrink-0 pt-[4px] text-accent-bright">{String(i + 1).padStart(2, '0')}</span>
                <span className="t-small text-ink-2">{b}</span>
              </div>
            ))}
          </InView>
        </div>
      </section>

      {/* ── the gallery ─────────────────────────────────────────────────── */}
      <section aria-label="Images" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        {item.shots.length > 0 ? (
          <InView className="seam shell grid w-full grid-cols-2 mobile:grid-cols-1">
            {/* EVERY SHOT AT ITS OWN SHAPE. These were all forced into a
                16:10 box, and most of the OPS screens are not 16:10 — the
                4:3 one lost its bottom sixth and the 16:9 ones lost a tenth
                of their width, which on a dashboard is a column of the
                table. The box takes the file's real ratio, so nothing is
                cropped. Where two normal shots share a row they are paired
                by shape. OPS runs all four of its shots full width: three
                are wide, and the 4:3 daily report has no partner of its
                shape left on the page, so it is marked wide too rather than
                leave half a row empty (25 September 2026). Belkofski's
                gallery is one picture, the court shot, and it runs full
                width for the same reason (D-06, 25 September 2026).

                AND A WAY TO SEE ONE PROPERLY. A dense operational screen at
                350px on a phone is a texture, not evidence. The link opens
                the original file — a plain link, keyboard-reachable, with no
                viewer to learn. */}
            {item.shots.map((shot) => {
              const { w, h } = IMAGE_SIZE[shot.src];
              return (
                <figure
                  key={shot.src}
                  className={`card-30 relative m-0 flex flex-col overflow-clip ${shot.wide ? 'col-span-2 mobile:col-span-1' : ''}`}
                >
                  <div className="relative w-full" style={{ aspectRatio: `${w} / ${h}` }}>
                    <Img
                      src={shot.src}
                      alt={shot.alt}
                      sizes={shot.wide ? '(max-width: 809px) 100vw, 1380px' : '(max-width: 809px) 100vw, 687px'}
                      className="media-fill"
                    />
                  </div>
                  <figcaption className="flex flex-wrap items-center justify-between gap-[14px] px-[24px] py-[18px] mobile:px-[20px]">
                    <span className="t-mono-9 text-ink-2">{shot.caption}</span>
                    <a
                      href={shot.src}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring t-mono-9 flex min-h-[44px] items-center text-ink-3 transition-colors duration-300 hover:text-ink"
                    >
                      <span className="sr-only">{shot.caption} — </span>
                      OPEN FULL SIZE
                      <span className="sr-only normal-case"> (opens in a new tab)</span>
                    </a>
                  </figcaption>
                </figure>
              );
            })}
          </InView>
        ) : (
          <InView className="card-30 shell relative flex w-full items-center justify-center overflow-clip py-[60px]">
            {/* The same box the schematic drew in — a square 86% of the
                panel, and a 360:470 block across a phone — so the panel
                keeps its height. */}
            {/* The dots loop here, so the pause control takes the top-left
                corner, in the panel's 60px above the diagram and on the
                caption's left edge. */}
            <SystemDiagram
              preset="gallery"
              loop
              className="relative aspect-square w-[86%] mobile:aspect-[360/470] mobile:w-full"
              pauseClassName="absolute left-[30px] top-[8px]"
            />
            <span className="t-mono-9 absolute bottom-[24px] left-[30px] text-ink-2">Schematic — not a screenshot</span>
            <DotGrid cols={9} rows={4} className="absolute right-[40px] top-[40px] mobile:hidden" />
            <Barcode className="absolute bottom-[24px] right-[30px] h-[13px] w-[118px] mobile:hidden" />
          </InView>
        )}
      </section>

      {/* ── more initiatives ────────────────────────────────────────────── */}
      <section aria-labelledby="more-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-[70px] mobile:gap-[40px]">
          <div className="flex w-full flex-col items-end gap-[70px] mobile:gap-[30px]">
            {/* NOT "ALSO IN DEVELOPMENT". Two of the four initiatives are
                in development, one is a partner's brand and one was
                delivered for a client, so that label was wrong on most of
                the pages that used it. */}
            <LabelRow label="MORE FROM RECALIBRE" />
            <div className="flex w-[690px] narrow:w-full">
              <h2 id="more-head" className="t-display text-ink">
                More work.
              </h2>
            </div>
          </div>

          <InView className="seam grid w-full grid-cols-2 mobile:grid-cols-1">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/work/${o.slug}`}
                className={
                  'card-30 group focus-ring relative flex aspect-[1.6/1] flex-col justify-end overflow-clip p-[30px] mobile:p-[20px]' +
                  (tallPair ? ' tablet:min-h-[360px] tablet:w-full' : '') +
                  (o.cover ? '' : ' mobile:min-h-[440px] mobile:w-full')
                }
              >
                {o.cover ? (
                  /* In the taller pair, a cover with marks printed along
                     its top is cropped from the top (`coverFrom`). */
                  <Img
                    src={o.cover}
                    alt={o.coverAlt}
                    sizes="(max-width: 809px) 100vw, 687px"
                    className={
                      'media-zoom media-fill' +
                      (tallPair && o.coverFrom === 'top' ? ' tablet:object-top' : '')
                    }
                  />
                ) : (
                  /* The diagram above the words, in the box they leave
                     free, with its caption in the corner. The schematic
                     that stood here was cut for a square card and lost its
                     top edge in this one. On a phone the card is at least
                     440 tall, which leaves the diagram a 310px block: room
                     for its top-to-bottom layout with every word in it. */
                  <span className="absolute inset-0 bg-ground">
                    <span
                      className="t-mono-9 absolute left-[30px] top-[30px] text-ink-2 mobile:left-[20px] mobile:top-[20px]"
                      aria-hidden="true"
                    >
                      {DIAGRAM_CAPTION}
                    </span>
                    <SystemDiagram
                      preset="more"
                      className="absolute inset-x-0 bottom-[100px] top-[52px] tablet:bottom-[106px] mobile:bottom-[90px] mobile:top-[40px]"
                    />
                  </span>
                )}
                {/* The foot's shade is for words over a picture; over the
                    diagram it would only dim its lower row. */}
                {o.cover ? (
                  <span
                    className="absolute inset-0 bg-gradient-to-t from-ground/85 via-ground/10 to-transparent"
                    aria-hidden="true"
                  />
                ) : null}
                {/* A LIGHT PICTURE GETS A DEEPER FOOT, as on the work cards
                    (`art` in WorkCard.tsx). Only OPS is light: its picture
                    is a pale screen published as shot, and over it the
                    meta line and the tags fell below 4.5:1 (the tags to
                    1.8:1 at 810 wide). This patch darkens the band the
                    words sit in: the lower half of the card, and never
                    less than 150px (125px on a phone), a little more than
                    the words' own height. Above it the picture is as it
                    was. See `.veil-ops-foot` in globals.css. */}
                {o.art === 'light' ? (
                  <span
                    className="veil-ops-foot absolute inset-x-0 bottom-0 h-[max(50%,150px)] mobile:h-[max(50%,125px)]"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="relative flex items-end justify-between gap-[20px]">
                  <span className="flex flex-col gap-[10px]">
                    <span className="t-card text-ink">{o.name}.</span>
                    {/* The short state, as every other card prints it; the
                        full status belongs to the detail page. */}
                    <span className="t-mono text-ink-2">
                      {o.year} · {o.category} · {o.state}
                    </span>
                    {/* "Demonstration data." on the card whose picture is a
                        product screen, in the meta line's own type, as the
                        OPS cards on Home and Work print it (`demo` in
                        WorkCard.tsx). It is inside the link, so a screen
                        reader reads it out with the rest of the card. */}
                    {o.demo ? <span className="t-mono text-ink-2">{o.demo}</span> : null}
                  </span>
                  <span className="flex flex-wrap items-center justify-end gap-[8px] mobile:hidden">
                    {o.tags.slice(0, 2).map((t) => (
                      <Pill key={t}>{t}</Pill>
                    ))}
                  </span>
                </span>
              </Link>
            ))}
          </InView>
        </div>
      </section>
      {/* A case study ends with the work: no FAQ tail (the owner's Phase A
          brief, 27 September 2026 — the FAQ is read on Home and Contact). */}
    </>
  );
}
