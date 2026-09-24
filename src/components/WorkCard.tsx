import Link from 'next/link';
import Img from '@/lib/Img';
import { Pill, Glyph } from '@/components/ui';
import ContraxisDrawing from '@/components/ContraxisDrawing';
import type { ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   THE INITIATIVE CARD — one definition, used by the homepage grid and by the
   work index.

   It existed twice before, once in each place, and the two copies drifted:
   the homepage grid was rebuilt to fill its frame and the index was left
   with the earlier treatment, so the same initiatives appeared as
   strong, full-bleed cards on one page and as pale screenshots floating in
   black fields on the next. The card is a single object now, and the only
   way the two grids can differ is if someone passes different props.

   ── THE CARD, AS THE REFERENCE BUILDS IT ──────────────────────────────────

   Radius 30, no inner padding, the picture rendered at about 1.22x the box
   that clips it and centre-cropped, the title at the bottom left, the tags
   at the bottom right. Nothing at the centre: the reference puts a client's
   logo there because its cards carry work belonging to someone else, and all
   three of these belong to Recalibre — a mark in that position would be
   either the same glyph three times or the card's own title printed twice.

   The status is a fact about the initiative, not a headline, so it takes a
   small plate in the top-left corner and states itself once, with a lime dot
   for finished work Recalibre owns and an orange one for work in progress.

   ── AND THE THREE THINGS THAT WERE WRONG WITH IT ──────────────────────────

   THE TEXT FOUGHT THE PICTURE ON A PHONE. At 390px the summary — four lines
   of it on the index — sat straight on top of a perforated steel render and
   a bright blue court, and no scrim deep enough to fix that leaves a picture
   worth showing. Below 810px the card splits instead: the art takes a 4:3
   block of its own and the words sit under it on the card's own ground.
   Nothing overlaps, so nothing has to be dimmed.

   THE WIDE CARD ASKED FOR AN IMAGE HALF ITS WIDTH. `sizes` ended at 690px
   for every card, and the wide one spans the full 1380px shell, so the
   browser was entitled to download a source too small for the box and
   stretch it. Each shape states its own width now.

   ONE INITIATIVE HAS NO PHOTOGRAPH, deliberately. Contraxis is a concept
   with no interface, and the render it used to carry was a Belkofski brand
   picture with a pair of frames set into it. It carries the schematic
   instead — see ContraxisDrawing.tsx.
   ========================================================================= */

export type WorkCardItem = {
  slug: string;
  name: string;
  status: string;
  /** The line under the title: year, category and state. */
  meta: string;
  tags: readonly string[];
  /** Null where the initiative has no honest photograph. `figure` says what
   *  is drawn in its place. */
  src: ImageSrc | null;
  /** The phone crop, where the wide card's 2.93:1 plate would otherwise be
   *  cut to its middle third inside a 4:3 media block. */
  srcTall?: ImageSrc;
  alt: string;
  figure?: 'contraxis';
  /** How dark the picture already is where the title sits. A light picture
   *  needs a deeper scrim than a dark one, and using one scrim for both is
   *  what makes a set of cards look unconsidered. */
  art: 'light' | 'dark';
  /** True where the art is a COMPOSED PLATE rather than a photograph: a
   *  picture whose edges were chosen, so the card must not crop it again.
   *  The 1.22x overscale below exists to push a photograph's subject out to
   *  the frame, which is right for a photograph and wrong for a composition
   *  — on the OPS plate it threw away 76px on every side and cut the
   *  product's own heading in half. A plate draws at 1:1 and still leans in
   *  on hover. */
  plate?: boolean;
  /** THE MARK THE REFERENCE CENTRES ON EVERY CARD, measured at 687px: a
   *  156 x 100 box, dead centre, horizontally and vertically.
   *
   *  The reference fills it with the client's logo, because its cards carry
   *  other people's work. All three of these are Recalibre's, so a real
   *  logo file exists for only one of them: Belkofski has a wordmark and is
   *  given it. The two products carry the firm's own glyph beside their own
   *  name — the same lockup the hero's statement card uses, and neither
   *  half of it is invented.
   *
   *  `src` wins where a real mark file exists; `word` is the lockup. */
  mark?: { src?: ImageSrc; word?: string };
  /** The colour the mark prints in. White everywhere the picture is dark
   *  behind the centre — but the OPS plate measures 219 of 255 there, and a
   *  white mark on a white dashboard is no mark at all, so that one prints
   *  in ink. `art` cannot decide this: it describes the title band at the
   *  foot, which on Belkofski is light while its centre is dark. */
  markTone?: 'light' | 'dark';
  tone: 'owned' | 'dev';
  /** An optional line under the meta, on the index where there is room. */
  summary?: string;
};

function Media({ item, wide, eager }: { item: WorkCardItem; wide: boolean; eager: boolean }) {
  if (!item.src) {
    return (
      /* 6% rather than 8%, so the drawing reaches nearer the card's edge —
         the two cards beside it carry a picture to the edge, and a diagram
         inset by a tenth of the card read as the odd one out. */
      <span className="absolute inset-0 flex items-start justify-center bg-ground px-[6%] pt-[6%]">
        <ContraxisDrawing variant="card" />
      </span>
    );
  }
  const sizes = wide
    ? '(max-width: 809px) 100vw, (max-width: 1199px) 100vw, 1380px'
    : '(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 690px';
  /* The square cards take the reference's 1.22x overscale so the subject
     fills the frame. Two kinds of art opt out: the wide card, whose plate is
     already a wide crop of the same photograph — overscaling a crop of a
     crop cut the Belkofski wordmark in half — and any composed plate, whose
     edges were chosen and must not be cropped again. */
  const cls = `media-zoom ${wide || item.plate ? 'media-fill' : 'media-push'}`;
  if (item.srcTall) {
    return (
      <>
        <Img src={item.src} alt={item.alt} sizes={sizes} className={`${cls} mobile:hidden`} />
        {/* The same picture, so the same words: the wide one is display:none
            at this width and its description went with it. */}
        <Img src={item.srcTall} alt={item.alt} sizes="100vw" className={`${cls} hidden mobile:block`} />
      </>
    );
  }
  /* Only a single-crop card loads eagerly. A two-crop card keeps both
     crops lazy: one of them is display:none at any width, and an eager
     image downloads whether or not it is shown. */
  return <Img src={item.src} alt={item.alt} sizes={sizes} eager={eager} className={cls} />;
}

/**
 * The centre mark. 156 x 100 is the reference's own box, measured off a 687px
 * card; the lockup is capped to it rather than stretched into it, so a short
 * name and a long one are the same size as each other rather than the same
 * width as the box.
 */
function CardMark({ item }: { item: WorkCardItem }) {
  if (!item.mark) return null;
  const dark = item.markTone === 'dark';
  return (
    <span
      /* 156 x 100 dead centre is the reference's box, measured identical on
         all four of its cards at a 687px card. Written as 22.7% x 14.56% it
         is the same 156 x 100 there, and it keeps the same share of the
         frame on the wide card and at every width below 1200, where a fixed
         pixel box would have grown into a card half the size.

         The phone gets a bigger share, which is also the reference's: 102 x
         70 on a 346 card, so 29.5% x 20.2%.

         AND IT STANDS DOWN ON A CARD WITH NO PHOTOGRAPH, on the phone only.
         The reference's mark always lands on a picture, which has nothing
         in it to collide with. Contraxis carries a drawing instead, and the
         phone layout of that drawing is a stack of full-width boxes — there
         is no clear centre to put a mark in, and "Contraxis" printed across
         "FINDINGS" is not the reference's card, it is a broken one. The
         desktop drawing was re-cut to leave the box clear (see
         ContraxisDrawing.tsx) and keeps its mark. */
      className={`pointer-events-none absolute left-1/2 top-1/2 z-[2] flex h-[14.56%] w-[22.7%] -translate-x-1/2 -translate-y-1/2 items-center justify-center mobile:h-[20.2%] mobile:w-[29.5%] ${
        item.src ? '' : 'mobile:hidden'
      }`}
      aria-hidden="true"
    >
      {item.mark.src ? (
        <Img
          src={item.mark.src}
          alt=""
          className={`max-h-full w-auto max-w-full object-contain ${dark ? 'mark-ink' : 'mark-white'}`}
        />
      ) : (
        <span className="flex items-center gap-[11px] mobile:gap-[7px]">
          <Glyph
            className={`glyph-xl mobile:glyph-lg ${dark ? '[&>i]:bg-ground' : '[&>i]:bg-white'}`}
          />
          <span className={`t-mark-lg ${dark ? 'text-ground' : 'text-white'}`}>
            {item.mark.word}
          </span>
        </span>
      )}
    </span>
  );
}

function Words({
  item,
  showSummary,
  heading: H,
  ids,
}: {
  item: WorkCardItem;
  showSummary: boolean;
  /** The name is a heading — an H3 under the homepage's own H2, an H2 on
   *  the index, whose opener is the H1 — so the four initiatives appear in
   *  the page's outline instead of "Selected work" running straight into
   *  the FAQ. Same class, same rendering; only the tag changes. */
  heading: 'h2' | 'h3';
  /** The id stem for the copy of the words the link points a screen reader
   *  at. The words print twice, once over the art and once under it, and
   *  only one copy carries ids, so none prints twice on a page. */
  ids?: string;
}) {
  const id = (part: string) => (ids ? `${ids}-${part}` : undefined);
  return (
    <>
      <span className="flex flex-col gap-[10px]">
        <H id={id('name')} className="t-card text-ink">
          {item.name}.
        </H>
        <span id={id('meta')} className="t-mono text-ink-2">
          {item.meta}
        </span>
        {showSummary && item.summary ? (
          <span id={id('summary')} className="t-small mt-[4px] max-w-[440px] text-ink-2">
            {item.summary}
          </span>
        ) : null}
      </span>
      <span id={id('tags')} className="flex flex-wrap items-center justify-end gap-[8px] mobile:justify-start">
        {item.tags.map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
      </span>
    </>
  );
}

export default function WorkCard({
  item,
  heading = 'h3',
  wide = false,
  showSummary = false,
  eager = false,
}: {
  item: WorkCardItem;
  /** The tag the card's name prints in — an H3 under the homepage's own
   *  H2, an H2 on the index, whose opener is the H1 — so the four
   *  initiatives appear in the page's outline instead of "Selected work"
   *  running straight into the FAQ. Same class, same rendering. */
  heading?: 'h2' | 'h3';
  wide?: boolean;
  showSummary?: boolean;
  /** Load the picture now rather than when it scrolls near. For a card
   *  that is already on the first screen — the top row of the work index —
   *  where lazy loading only delays a picture the reader is looking at. */
  eager?: boolean;
}) {
  const light = item.art === 'light';
  /* NAMED BY ITS OWN TITLE, DESCRIBED BY THE REST. The link used to carry a
     hidden label ("OPS — PRODUCT IN DEVELOPMENT"), and a label replaces the
     card's own words as the link's spoken name: a reader moving by links
     heard that and nothing else — not the year, the category, the state,
     the summary or the tags. The name is now the heading, and the meta
     line, the summary where it prints, and the tags are the description,
     so the whole card is read out. The slug is unique on any page that
     renders the grid, so the ids are too. */
  const id = `work-${item.slug}`;
  const describedBy = [id + '-meta', showSummary && item.summary ? id + '-summary' : '', id + '-tags']
    .filter(Boolean)
    .join(' ');
  return (
    <Link
      href={`/work/${item.slug}`}
      aria-labelledby={`${id}-name`}
      aria-describedby={describedBy}
      className="card-30 group focus-ring relative block overflow-clip mobile:flex mobile:flex-col"
    >
      {/* ── the art ──────────────────────────────────────────────────────
          Absolute inside the card on desktop, so the words sit over it; a
          block of its own below 810px, so they sit under it. */}
      {/* A photograph gets a 4:3 block on a phone. The schematic gets a
          portrait one, because the phone layout of the drawing is taller
          than it is wide and a 4:3 box cut "A PERSON DECIDES" off its foot. */}
      <span
        className={`relative block overflow-clip mobile:w-full ${
          wide ? 'aspect-[2.93/1]' : 'aspect-square'
        } ${item.src ? 'mobile:aspect-[4/3]' : 'mobile:aspect-[3/4]'}`}
      >
        <Media item={item} wide={wide} eager={eager} />

        {/* NO RUNTIME VEIL. The film is in the plate (scripts/plates.py,
            `filmgrain`); the layer that used to sit here was mid-grey at a
            combined 0.245 and washed the card's own grade out of it. */}

        {/* The scrims exist for the overlaid layout only. Below 810px the
            words have moved off the picture and nothing needs dimming. */}
        <span
          className={`absolute inset-x-0 bottom-0 z-[1] mobile:hidden ${
            light
              ? 'h-[62%] bg-gradient-to-t from-ground via-ground/88 to-transparent'
              : 'h-[48%] bg-gradient-to-t from-ground/92 via-ground/38 to-transparent'
          }`}
          aria-hidden="true"
        />
        {light ? (
          <span
            className="absolute inset-x-0 top-0 z-[1] h-[30%] bg-gradient-to-b from-ground/55 to-transparent mobile:hidden"
            aria-hidden="true"
          />
        ) : null}

        {/* THE STATUS PILL USED TO SIT HERE, top-left, floating over the
            picture. The reference has no such pill: it prints the state as
            the last term of the meta line under the title ("2026 · 3 week
            build · Live"), and that is where ours prints it now — see
            `meta` in the content files. Nothing stopped being said; it
            moved to the reference's position for saying it, and it stopped
            landing on top of the OPS interface's own logo. */}
        <CardMark item={item} />
      </span>

      {/* ── the words, over the art ──────────────────────────────────────── */}
      <span className="absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-[20px] p-[30px] mobile:hidden">
        <Words item={item} showSummary={showSummary} heading={heading} ids={id} />
      </span>

      {/* ── the words, under the art ─────────────────────────────────────── */}
      <span className="hidden flex-col items-start gap-[14px] p-[20px] mobile:flex">
        <Words item={item} showSummary={showSummary} heading={heading} />
      </span>

      <span
        className="pointer-events-none absolute inset-0 z-[3] rounded-[30px] border border-transparent transition-colors duration-500 group-hover:border-rule group-focus-visible:border-rule mobile:rounded-[20px]"
        aria-hidden="true"
      />
    </Link>
  );
}
