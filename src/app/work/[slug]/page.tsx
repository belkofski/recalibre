import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Img, { ArtImg } from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import { LabelRow, Chip, MonoLink, Chevron, Status, Caption } from '@/components/ui';
import { pageMeta } from '@/lib/seo';
import { IMAGE_SIZE } from '@/lib/images.generated';
import type { CSSProperties } from 'react';
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
     the facts            figures at display size
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
  /* A PAIR WITH THE DIAGRAM IN IT STANDS TALLER on a tablet (the owner's
     decision of 26 September 2026). At 1.6:1 a tablet's card left the
     diagram a strip 80-140px tall and it could draw its icon tiles only;
     at about 360px tall it prints its words. Both cards of the pair take
     4:3, which is that 360 at 1024 wide, so the row stays even: a ratio
     since 28 September 2026, not the 360px floor. Below 600 the cards
     stand one under the other and only the diagram's card grows (see
     below). */
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
        className="pad-x relative flex w-full flex-col items-center bg-raised pb-[32px] pt-[80px] phone:pb-[24px] phone:pt-[72px]"
      >
        <div className="seam shell grid w-full grid-cols-[480px_1fr] narrow:grid-cols-1">
          {/* No floor: on the desktop the row takes the cover's 7:5 (641
              tall in its 898 cell at 1440), and this card stretches to it.
              The dot grid and the barcode that stood at its foot went on 28
              September 2026 with the rest of the reference's devices, so
              the words now sit at the foot, where the reference sets its
              title, with the back link at the top. */}
          <div className="card-30 flex flex-col justify-between gap-[40px] p-[40px] narrow:gap-[32px] mobile:gap-[24px] mobile:p-[20px]">
            {/* Back is the chevron mirrored, never turned (28 September
                2026); on hover it moves 2px back and the words light. */}
            <Link href="/work" className="tap-44 flex w-fit items-center gap-[8px]">
              <Chevron dir="back" className="text-accent-bright" />
              <span className="t-mono-11 hover-read">ALL WORK</span>
            </Link>

            {/* THE STATUS IS PRINTED ONCE (28 September 2026): in the meta
                grid's STATUS cell below, not over the title as well. The
                cover is the picture and the title. */}
            <div className="flex flex-col gap-[24px]">
              <Rise as="h1" id="init-head" lines={[`${item.name}.`]} wrap className="t-display text-ink" />
              <p className="t-body max-w-[420px] text-ink-2">{item.summary}</p>
            </div>
          </div>

          <div
            className={`card-30 relative aspect-[7/5] overflow-clip narrow:order-first ${
              item.hero ? 'narrow:aspect-[16/10] mobile:aspect-[4/3]' : 'narrow:aspect-[4/3] mobile:aspect-[5/6]'
            }`}
          >
            {item.hero && item.heroTall ? (
              /* Below 810 the cover's own phone cut (28 September 2026): a
                 4:3 frame at a readable scale, not the wide cover shrunk. */
              <ArtImg
                src={item.hero}
                srcTall={item.heroTall}
                media="(max-width: 809.98px)"
                alt={item.heroAlt}
                sizes="(max-width: 1199px) 100vw, 900px"
                sizesTall="calc(100vw - 44px)"
                className="media-fill"
              />
            ) : item.hero ? (
              <Img
                src={item.hero}
                alt={item.heroAlt}
                priority
                sizes="(max-width: 1199px) 100vw, 900px"
                className="media-fill"
              />
            ) : (
              /* THE SYSTEM DIAGRAM, where a cover picture would be. Its
                 caption runs along the card's foot on the caption hairline
                 (28 September 2026), 40px up (20 on a phone), and the
                 diagram takes the box above the hairline, clear of the line
                 where the card beside it prints "ALL WORK". The dots run
                 only under the pointer (see SystemDiagram.tsx), so there is
                 no pause control. The caption is hidden from a screen
                 reader, which hears the diagram's own description. */
              <span className="absolute inset-0 bg-ground">
                <SystemDiagram
                  preset="cover"
                  className="absolute inset-x-0 bottom-[72px] top-[84px] mobile:bottom-[52px] mobile:top-[64px]"
                />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-[40px] mobile:bottom-[20px]">
                  <Caption as="div" className="px-[40px] mobile:px-[20px]">
                    {DIAGRAM_CAPTION}
                  </Caption>
                </div>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── the meta grid ───────────────────────────────────────────────── */}
      <section aria-label="Details" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-[64px] mobile:gap-[40px]">
          <div className="grid w-full grid-cols-4 tablet:grid-cols-2 tablet:gap-y-[32px] mobile:grid-cols-2 mobile:gap-[24px]">
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
              /* One reveal per cell, staggered by its column (28 September
                 2026): four across, two on a tablet and a phone. */
              <InView
                key={k}
                step={i}
                className={`flex flex-col gap-[12px] ${i > 0 ? 'border-l border-rule pl-[40px] mobile:border-0 mobile:pl-0' : ''}`}
              >
                <p className="t-mono text-ink-3">{k}</p>
                {/* Tabular, so the year's digits keep the ladder's widths.
                    THE STATUS (28 September 2026): the dot and the words, no
                    capsule, the one place a case page prints it. The signal
                    blue for work in development, ink at 50% for delivered
                    and partner work; never orange. Same words. */}
                <p className={`t-body text-ink ${k === 'YEAR' ? 'tabular-nums' : ''}`}>
                  {k === 'STATUS' ? (
                    <Status state={item.tone === 'dev' ? 'development' : 'delivered'} className="text-ink">
                      {v}
                    </Status>
                  ) : (
                    v
                  )}
                </p>
              </InView>
            ))}
          </div>

          <div className="grid w-full grid-cols-2 gap-[96px] narrow:grid-cols-1 narrow:gap-[40px]">
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
        <div className="shell flex w-full flex-col gap-(--space-alone)">
          <div className="flex w-full flex-col items-end gap-(--space-label)">
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
            <div className="grid w-full grid-cols-3 mobile:grid-cols-1 mobile:gap-[24px]">
              {item.facts.map((f, i) => (
                <InView
                  key={f.label}
                  step={i}
                  className={`flex flex-col gap-[16px] ${i > 0 ? 'border-l border-rule pl-[40px] mobile:border-0 mobile:pl-0' : ''}`}
                >
                  <p className="t-display tabular-nums text-ink">
                    {f.value}
                    {f.unit ? <span className="t-lede text-ink-3"> {f.unit}</span> : null}
                  </p>
                  <p className="t-mono max-w-[220px] text-ink-2">{f.label}</p>
                </InView>
              ))}
            </div>
          )}

          {/* One reveal per card, by column (28 September 2026). NO NUMBER
              (Phase C, 29 September 2026): the items are not in an order,
              so a 01-06 over them only counted content (brief section 14). */}
          <div className="seam grid w-full grid-cols-2 mobile:grid-cols-1">
            {item.built.map((b, i) => (
              <InView key={b} step={i % 2} className="card-30 flex p-(--card-pad)">
                <span className="t-body text-ink-2">{b}</span>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* ── the gallery ─────────────────────────────────────────────────── */}
      <section aria-label="Images" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        {item.shots.length > 0 ? (
          <div className="seam shell grid w-full grid-cols-2 mobile:grid-cols-1">
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
                viewer to learn.

                ONE REVEAL PER FIGURE, THE PICTURE TIER (28 September 2026):
                each fades in with no travel while its picture settles from
                1.06 to 1, in a box that clips it; a figure in the second
                column waits 90ms. Below 810 a shot with a phone cut
                (`srcTall`) draws it, in a box of that file's own shape. The
                caption runs under the picture on the caption hairline, the
                full width of the figure, with OPEN FULL SIZE at its end. */}
            {item.shots.map((shot, i) => {
              const { w, h } = IMAGE_SIZE[shot.src];
              const tall = shot.srcTall ? IMAGE_SIZE[shot.srcTall] : null;
              const sizes = shot.wide ? '(max-width: 809px) 100vw, 1380px' : '(max-width: 809px) 100vw, 687px';
              const box = {
                '--ar': `${w} / ${h}`,
                ...(tall ? { '--ar-tall': `${tall.w} / ${tall.h}` } : {}),
              } as CSSProperties;
              return (
                <InView
                  as="figure"
                  mode="picture"
                  key={shot.src}
                  step={shot.wide ? 0 : i % 2}
                  className={`card-30 relative m-0 flex flex-col overflow-clip ${shot.wide ? 'col-span-2 mobile:col-span-1' : ''}`}
                >
                  <div
                    className={`relative w-full overflow-clip [aspect-ratio:var(--ar)] ${tall ? 'mobile:[aspect-ratio:var(--ar-tall)]' : ''}`}
                    style={box}
                  >
                    <div className="settle absolute inset-0">
                      {shot.srcTall ? (
                        <ArtImg
                          src={shot.src}
                          srcTall={shot.srcTall}
                          media="(max-width: 809.98px)"
                          alt={shot.alt}
                          sizes={sizes}
                          sizesTall="calc(100vw - 44px)"
                          lazy
                          className="media-fill"
                        />
                      ) : (
                        <Img src={shot.src} alt={shot.alt} sizes={sizes} className="media-fill" />
                      )}
                    </div>
                  </div>
                  <Caption
                    as="figcaption"
                    className="flex-wrap px-[24px] pb-[20px] mobile:px-[20px] mobile:pb-[16px]"
                    end={
                      <a
                        href={shot.src}
                        target="_blank"
                        rel="noreferrer"
                        /* A 44px target that takes no height of its own
                           in the caption's line. */
                        className="t-mono hover-read relative z-[1] -my-[15px] flex min-h-[44px] items-center"
                      >
                        <span className="sr-only">{shot.caption} — </span>
                        OPEN FULL SIZE
                        <span className="sr-only normal-case"> (opens in a new tab)</span>
                      </a>
                    }
                  >
                    {shot.caption}
                  </Caption>
                </InView>
              );
            })}
          </div>
        ) : (
          <InView className="card-30 shell relative flex w-full items-center justify-center overflow-clip py-[64px]">
            {/* The same box the schematic drew in — a square 86% of the
                panel, and a 360:470 block across a phone — so the panel
                keeps its height. */}
            <SystemDiagram
              preset="gallery"
              className="relative aspect-square w-[86%] mobile:aspect-[360/470] mobile:w-full"
            />
            {/* The caption on its hairline across the panel's foot, under
                the diagram (28 September 2026), in the panel's 64px below
                it; the dot grid and the barcode beside it are gone. Hidden
                from a screen reader, which hears the diagram's own
                description. */}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-[20px]">
              <Caption as="div" className="px-(--card-pad)">
                {DIAGRAM_CAPTION}
              </Caption>
            </div>
          </InView>
        )}
      </section>

      {/* ── more initiatives ────────────────────────────────────────────── */}
      <section aria-labelledby="more-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-alone)">
          <div className="flex w-full flex-col items-end gap-(--space-label)">
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

          {/* ONE REVEAL PER CARD, the second column 90ms after the first
              (28 September 2026); one column on a phone, both step 0. */}
          <div className="seam grid w-full grid-cols-2 mobile:grid-cols-1">
            {others.map((o, i) => {
              /* THE CARD'S OWN CUT, WITH ITS FOOT IN THE FILE (28 September
                 2026): the two photographs are drawn from `coverMore`, the
                 cover cut to this card's 1.6:1 with the darkening under the
                 words laid into the picture, and on a tablet beside the
                 diagram from `coverMoreTall`, the 4:3 cut, drawn in the pair's square
                 box with its sides trimmed (from the top
                 where `coverFrom` says so). Nothing is dimmed over them at
                 runtime. OPS has no such cut: it is a product capture,
                 published clean, and keeps the card's own shade and its
                 `.veil-ops-foot`, the one kept exception. */
              const pic = o.coverMore ?? o.cover;
              const sizes = '(max-width: 809px) 100vw, 687px';
              return (
                <InView key={o.slug} step={i % 2}>
                  <Link
                    href={`/work/${o.slug}`}
                    className={
                      'card-30 group relative flex aspect-[1.6/1] flex-col justify-end overflow-clip p-(--card-pad)' +
                      (tallPair ? ' tablet:aspect-square' : '') +
                      (o.cover
                        ? ''
                        : ' [@media(max-width:459.98px)]:aspect-[2/3] [@media(min-width:460px)_and_(max-width:599.98px)]:aspect-[4/5] mid:aspect-[4/3]')
                    }
                  >
                    {pic ? (
                      <span className="settle absolute inset-0 block">
                        {tallPair && o.coverMore && o.coverMoreTall ? (
                          <ArtImg
                            src={o.coverMore}
                            srcTall={o.coverMoreTall}
                            media="(min-width: 810px) and (max-width: 1199.98px)"
                            alt={o.coverAlt}
                            sizes={sizes}
                            sizesTall={sizes}
                            lazy
                            className="media-zoom media-fill"
                          />
                        ) : (
                          /* In the taller pair, a cover with marks printed
                             along its top is cropped from the top
                             (`coverFrom`). */
                          <Img
                            src={pic}
                            alt={o.coverAlt}
                            sizes={sizes}
                            className={
                              'media-zoom media-fill' +
                              (tallPair && o.coverFrom === 'top' ? ' tablet:object-top' : '')
                            }
                          />
                        )}
                      </span>
                    ) : (
                      /* The diagram above the words, in the box they leave
                         free; its caption is the first line of the words,
                         under it (28 September 2026). The schematic that
                         stood here was cut for a square card and lost its
                         top edge in this one. The words under it (the
                         caption on its hairline, the name, the meta line
                         and the Status) take 154-170px, so the card stands
                         taller than the picture cards where the diagram
                         would otherwise fall to its bare tiles: 2:3 below
                         460 (a 345px box at 390, 300 at 360: the
                         top-to-bottom 'p'), 4:5 from 460 to 599 (346 at
                         460), 4:3 from 600 to 809 (243 at 600: 'm') and, with its neighbour, square from 810
                         to 1199 (184 at 810: 't'). */
                      <span className="absolute inset-0 bg-ground">
                        <SystemDiagram
                          preset="more"
                          className="absolute inset-x-0 bottom-[164px] top-(--card-pad) tablet:bottom-[170px] mobile:bottom-[154px]"
                        />
                      </span>
                    )}
                    {/* The foot's shade is for words over a picture that
                        does not carry its own; over the diagram it would
                        only dim its lower row. */}
                    {o.cover && !o.coverMore ? (
                      <span
                        className="absolute inset-0 bg-gradient-to-t from-ground/85 via-ground/10 to-transparent"
                        aria-hidden="true"
                      />
                    ) : null}
                    {/* A LIGHT PICTURE GETS A DEEPER FOOT, as on the work
                        cards (`art` in WorkCard.tsx). Only OPS is light: its
                        picture is a pale screen published as shot, and over
                        it the meta line and the tags fell below 4.5:1 (the
                        tags to 1.8:1 at 810 wide). This patch darkens the
                        band the words sit in: the lower half of the card,
                        and never less than 210px (190px on a phone), a
                        little more than the words' own height with the
                        caption. Above it the
                        picture is as it was. See `.veil-ops-foot` in
                        globals.css. */}
                    {o.art === 'light' ? (
                      <span
                        className="veil-ops-foot absolute inset-x-0 bottom-0 h-[max(50%,210px)] mobile:h-[max(50%,190px)]"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="relative flex flex-col gap-[16px]">
                      {/* THE CAPTION, the words' first line, on its hairline
                          across the card (28 September 2026): "Demonstration
                          data." on the product screen, read out with the
                          card; the diagram's "Schematic — not a screenshot",
                          which a screen reader hears in the diagram's own
                          description, hidden from it. */}
                      {o.demo ? (
                        <span className="-mx-(--card-pad) block">
                          <Caption as="div" className="px-(--card-pad)">
                            {o.demo}
                          </Caption>
                        </span>
                      ) : !o.cover ? (
                        <span aria-hidden="true" className="-mx-(--card-pad) block">
                          <Caption as="div" className="px-(--card-pad)">
                            {DIAGRAM_CAPTION}
                          </Caption>
                        </span>
                      ) : null}
                      <span className="flex items-end justify-between gap-[24px]">
                        <span className="flex flex-col items-start gap-[8px]">
                          <span className="t-card text-ink">{o.name}.</span>
                          {/* The year and the field on a plain mono line,
                              and the state under it as the Status (C10.7,
                              28 September 2026): the short state, as every
                              card prints it; the full status belongs to the
                              detail page. No word changed. */}
                          <span className="t-mono tabular-nums text-ink-3">
                            {o.year} · {o.category}
                          </span>
                          <Status
                            state={o.tone === 'dev' ? 'development' : 'delivered'}
                            className="text-ink-2"
                          >
                            {o.state}
                          </Status>
                        </span>
                        <span className="flex flex-wrap items-center justify-end gap-[8px] mobile:hidden">
                          {/* Over a picture the tags take their own dark
                              ground (`Chip onArt`, 28 September 2026). */}
                          {o.tags.slice(0, 2).map((t) => (
                            <Chip key={t} onArt={Boolean(o.cover)}>
                              {t}
                            </Chip>
                          ))}
                        </span>
                      </span>
                    </span>
                  </Link>
                </InView>
              );
            })}
          </div>
        </div>
      </section>
      {/* A case study ends with the work: no FAQ tail (the owner's Phase A
          brief, 27 September 2026 — the FAQ is read on Home and Contact). */}
    </>
  );
}
