import Link from 'next/link';
import Img from '@/lib/Img';
import { Caption, Chip, FirmMark, Status, cardClass } from '@/components/ui';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import type { ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   THE INITIATIVE CARD — one definition, used by the homepage row and by the
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
   at the bottom right. At the centre the reference puts a client's logo,
   because its cards carry work belonging to someone else; what this card
   puts there is set out at `mark` below.

   The status is a fact about the initiative, not a headline, so it states
   itself once, under the year and the field, as the site's one `Status`: a
   6px dot and the short state, the signal blue for work in development and
   ink at 50% for delivered work (28 September 2026; it was a plate in the
   top-left corner, and then the meta line's last term).

   A caption the card carries ("Demonstration data." on the product
   screen, "Schematic — not a screenshot" under the diagram) is the first
   line of the words, on the caption hairline across the card, directly
   under the picture's clear area (28 September 2026).

   ── THE WORDS ARE PRINTED ONCE (the owner's audit, 6 October 2026) ─────────

   They used to print twice — one copy absolute over the art for the wide
   screens, one static under it for the narrow ones, each hidden in turn by
   a media query — so every page carried a duplicate heading in its outline
   and a screen reader could land on the hidden one. There is one copy now,
   `.work-card-words`, and the stylesheet (src/styles/work.css) alone decides
   where it sits: absolute over the art from 600 up, static under it below,
   and under it to 1199 on a card that stacks (`stackOnTablet`,
   `.work-card--stack`). The row-versus-column arrangement of the text and
   the tags, and the tags' own dark ground over a photograph (`Chip onArt`),
   switch in the same stylesheet, by the same two breakpoints, so the server
   HTML is the finished state at every width.

   ── AND THE THREE THINGS THAT WERE WRONG WITH IT ──────────────────────────

   THE TEXT FOUGHT THE PICTURE ON A PHONE. At 390px the summary — four lines
   of it on the index — sat straight on top of a perforated steel render and
   a bright blue court, and no scrim deep enough to fix that leaves a picture
   worth showing. Below 600px the card splits instead: the art takes a 4:3
   block of its own and the words sit under it on the card's own ground.
   Nothing overlaps, so nothing has to be dimmed. From 600 to 809px the
   homepage's cards split too, two across: the art keeps its square and
   the words sit under it (30 September 2026).

   THE WORK INDEX TAKES THE SAME SPLIT FROM 600 TO 1199px (the owner's
   decision D-03, 25 September 2026, for 810 to 1199; from 600 since 28
   September 2026). Its cards carry the summary as well, and at half a
   tablet's width the words over the art ran into the picture, the centre
   mark and the drawing. `stackOnTablet` gives that page the phone's layout
   at those widths. One difference from the phone, on purpose: the Contraxis
   card keeps a 4:3 block there, the same height as the pictures beside it,
   and its diagram takes the landscape layout that fits it; the phone's
   portrait block would make that card half as tall again as its neighbour.

   THE WIDE CARD ASKED FOR AN IMAGE HALF ITS WIDTH. `sizes` ended at 690px
   for every card, and the wide one spans the full 1380px shell, so the
   browser was entitled to download a source too small for the box and
   stretch it. Each shape states its own width now.

   ONE INITIATIVE HAS NO PHOTOGRAPH, deliberately. Contraxis is in
   development and has no interface to show, and the render it used to carry
   was a Belkofski brand picture with a pair of frames set into it. It
   carries a moving system diagram instead (the owner's decision of 26
   September 2026, replacing the still schematic) — see SystemDiagram.tsx.
   ========================================================================= */

export type WorkCardItem = {
  slug: string;
  name: string;
  status: string;
  /** The line under the title: year, category and state, as the content
   *  writes it ("2026 · INDUSTRIAL CONTRACTING · DELIVERED"). The card
   *  prints the last term, the state, as the `Status` on a line of its own
   *  and the rest as the meta line (28 September 2026): split at the last
   *  " · ", so no word is retyped. */
  meta: string;
  /** A second line under the meta, in the same type: "Demonstration data."
   *  on a card whose picture is a product screen running on demonstration
   *  data. Only OPS sets it. The owner confirmed on 25 September 2026 that
   *  the OPS screens are real screens from the build and that both OPS
   *  cards, on the homepage and on the work index, print what data they
   *  carry. */
  demo?: string;
  tags: readonly string[];
  /** Null where the initiative has no honest photograph. `figure` says what
   *  is drawn in its place. */
  src: ImageSrc | null;
  /** The phone crop, where the wide card's 2.93:1 plate would otherwise be
   *  cut to its middle third inside a 4:3 media block. */
  srcTall?: ImageSrc;
  /** `srcTall` is a phone's own cut, too small to draw larger (28 September
   *  2026): on a card that takes the phone layout to 1199px
   *  (`stackOnTablet`) it is drawn only below 810, and from 810 to 1199 the
   *  card draws `src` in the 4:3 block, as it did before the cut existed.
   *  Only the OPS register sets it (780 x 585; a 2x tablet would draw it
   *  1.24x at 1024 and 1.47x at 1199). */
  srcTallMobileOnly?: boolean;
  /** The picture with the card's foot laid into the file (28 September
   *  2026): drawn where the words sit over the art, in place of `src`, with
   *  no scrim laid over it. Where the words sit under the art, `srcTall` (or
   *  `src`) is drawn as before. The OPS screen has none: a capture is
   *  published clean and keeps the card's own scrim. */
  srcCard?: ImageSrc;
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
   *  other people's work. One card here carries a file, ABP Continental's
   *  name set in the site's own lettering until ABP's own logo file arrives
   *  (see the note over MARKS in content/site.ts). Belkofski's wordmark is
   *  already printed across its photograph, so that card carries none. OPS
   *  carries the firm's own '///' (`FirmMark`, at its large size) beside
   *  its name. Neither half of it is invented. Contraxis draws none (see
   *  `CardMark`).
   *
   *  `src` wins where a real mark file exists; `word` is the lockup. */
  mark?: { src?: ImageSrc; word?: string };
  /** The colour the mark prints in. White everywhere the picture is dark
   *  behind the centre — but the OPS plate measures 238 of 255 there, and a
   *  white mark on a white dashboard is no mark at all, so that one prints
   *  in ink. `art` cannot decide this: it describes the title band at the
   *  foot, which on Belkofski is light while its centre is dark. */
  markTone?: 'light' | 'dark';
  tone: 'owned' | 'dev';
  /** An optional line under the meta, on the index where there is room. */
  summary?: string;
};

function Media({
  item,
  wide,
  eager,
  stack,
  summary,
}: {
  item: WorkCardItem;
  wide: boolean;
  eager: boolean;
  /** The phone layout at tablet width too (`stackOnTablet`). */
  stack: boolean;
  /** The words over the art carry the summary, so they stand taller. */
  summary: boolean;
}) {
  if (!item.src) {
    return (
      /* THE DIAGRAM TAKES THE CARD ABOVE ITS WORDS. Where the words sit
         over the art the diagram's box stops about 12px above their caption
         line: the caption, title, meta, status and tags are 156px tall on
         the desktop (160 at 810), or about 330 where the index prints the
         summary as well, with its tags under the text (6 October 2026).
         Where the words sit under the art (below 600, and a stacked card to
         1199px) the box runs to the foot of the block. Which layout of the
         diagram shows is chosen by this box's size. */
      <span className="absolute inset-0 bg-ground">
        <SystemDiagram
          preset="card"
          className={
            `absolute inset-x-0 top-(--card-pad) ${summary ? 'bottom-[340px]' : 'bottom-[168px]'} phone:bottom-[12px] phone:top-[12px] mid:bottom-[12px] mid:top-[12px]` +
            (stack ? ' tablet:bottom-[12px] tablet:top-[12px]' : ' tablet:bottom-[172px]')
          }
        />
      </span>
    );
  }
  /* The square cards take the reference's 1.22x overscale so the subject
     fills the frame. Two kinds of art opt out: the wide card, whose plate is
     already a wide crop of the same photograph — overscaling a crop of a
     crop cut the Belkofski wordmark in half — and any composed plate, whose
     edges were chosen and must not be cropped again. */
  const cls = `media-zoom ${wide || item.plate ? 'media-fill' : 'media-push'}`;
  /* ONE PICTURE PER WIDTH BAND, EACH FILE DRAWN ONCE. Where the words sit
     over the art the picture is the one with the foot in the file
     (`srcCard`, where there is one). Below 600 the words sit under the art
     and the phone crop shows (`srcTall`, where there is one). From 600 to
     809 the words sit under the art on both grids (30 September 2026): a
     stacked card draws the phone crop in its 4:3 block; an unstacked one
     draws the plain square, `src`, in a square block. A phone's own cut on
     a stacked card stops at 809.98px; from 810 to 1199 the stacked card
     draws the square instead (`srcTallMobileOnly`). */
  const over = item.srcCard ?? item.src;
  const under = item.srcTall ?? item.src;
  const tallMobileOnly = stack && !wide && Boolean(item.srcTall) && item.srcTallMobileOnly === true && over === item.src;
  const pick: Record<Band, ImageSrc> = {
    phone: under,
    mid: stack ? under : item.src,
    tablet: stack ? (tallMobileOnly ? item.src : under) : over,
    desk: over,
  };
  /* The CSS width in each band: the full width on a phone and for the wide
     card below 1200; below 1200 a square is one column of two, the width
     less the page margins (24, or 20 below 810) and the 2px seam, halved,
     which is 50vw - 27px, or 50vw - 23px below 810. The picture service
     lists its candidate widths from the smallest bare "vw" figure in
     `sizes` (with none, every width from 32 up): a phone crop's `sizes`
     starts with a bare 100vw, which keeps its list at 640 and up, and a
     bare 50vw beside it would add 384, which the phone would then pick. So
     a phone crop's half widths are written inside calc(). A square drawn
     on a tablet takes the bare 50vw the homepage has always had. */
  const width: Record<Band, string> = {
    phone: '100vw',
    mid: wide ? '100vw' : 'calc(50vw - 23px)',
    tablet: wide ? '100vw' : stack && !tallMobileOnly ? 'calc(50vw - 27px)' : '50vw',
    desk: wide ? '1380px' : '690px',
  };
  const files = [...new Set(BANDS.map((b) => pick[b]))];
  /* THE SETTLE (28 September 2026): the wrapper between the card's clip
     box and the picture eases from 1.06 to 1 as the card is revealed; the
     picture's own push and the hover lean multiply with it. */
  return (
    <span className="settle absolute inset-0 block">
      {files.map((file) => {
        const on = BANDS.filter((b) => pick[b] === file);
        /* The same picture, so the same words on every crop: a crop that
           is display:none takes its description with it. Only a card drawn
           from one file loads eagerly; where there are two or three, each
           stays lazy, because an eager image downloads whether or not it is
           shown. */
        return (
          <Img
            key={file}
            src={file}
            alt={item.alt}
            sizes={sizesFor(on, width)}
            eager={eager && files.length === 1}
            className={`${cls} ${showIn(on)}`}
          />
        );
      })}
    </span>
  );
}

/* The four width bands, narrowest first, and the literal classes that show
   or hide a picture in each (written out whole so the stylesheet builds
   them). */
type Band = 'phone' | 'mid' | 'tablet' | 'desk';
const BANDS: readonly Band[] = ['phone', 'mid', 'tablet', 'desk'];
const BAND_MAX: Record<Band, string> = { phone: '599px', mid: '809px', tablet: '1199px', desk: '' };
const SHOW: Record<Band, string> = { phone: 'phone:block', mid: 'mid:block', tablet: 'tablet:block', desk: 'block' };
const HIDE: Record<Band, string> = { phone: 'phone:hidden', mid: 'mid:hidden', tablet: 'tablet:hidden', desk: 'hidden' };

/** The display classes for a picture drawn in the bands `on`. */
function showIn(on: readonly Band[]) {
  const base = on.includes('desk');
  return [
    base ? '' : HIDE.desk,
    ...(['phone', 'mid', 'tablet'] as const)
      .filter((b) => on.includes(b) !== base)
      .map((b) => (on.includes(b) ? SHOW[b] : HIDE[b])),
  ]
    .filter(Boolean)
    .join(' ');
}

/** `sizes` for a picture drawn in the bands `on`, at the CSS width `width`
 *  gives each band: one clause per band, the last one bare, runs of the same
 *  width merged. */
function sizesFor(on: readonly Band[], width: Record<Band, string>) {
  const parts: string[] = [];
  on.forEach((band, i) => {
    const next = on[i + 1];
    if (next && width[next] === width[band]) return;
    parts.push(next ? `(max-width: ${BAND_MAX[band]}) ${width[band]}` : width[band]);
  });
  return parts.join(', ');
}

/**
 * The centre mark. 156 x 100 is the reference's own box, measured off a 687px
 * card; the lockup is capped to it rather than stretched into it, so a short
 * name and a long one are the same size as each other rather than the same
 * width as the box.
 */
function CardMark({ item, stack }: { item: WorkCardItem; stack: boolean }) {
  /* NONE ON A CARD WITH NO PHOTOGRAPH. The reference's mark always lands
     on a picture, which has nothing in it to collide with. Contraxis
     carries the system diagram instead, and the diagram's centre card is
     the same glyph beside the same name — printing the mark as well would
     say "Contraxis" twice in the middle of one card (the owner's decision
     of 26 September 2026: the centre card carries it, never both). */
  if (!item.mark || !item.src) return null;
  const dark = item.markTone === 'dark';
  return (
    <span
      /* 156 x 100 dead centre is the reference's box, measured identical on
         all four of its cards at a 687px card. Written as 22.7% x 14.56% it
         is the same 156 x 100 there, and it keeps the same share of the
         frame on the wide card and at every width below 1200, where a fixed
         pixel box would have grown into a card half the size.

         The phone gets a bigger share, which is also the reference's: 102 x
         70 on a 346 card, so 29.5% x 20.2%. A card that takes the phone
         layout from 600 to 1199px takes the phone's share of the 4:3 block
         there too. The lettering keeps its own size, so the mark beside it
         keeps its pairing.

         LIFTED, NOT HIDDEN, ON AN UNSTACKED TABLET SQUARE (28 September
         2026). From 810 the words over the art start with the caption's
         hairline about 218px above the card's foot at a 378px square, and
         the centred mark stood 13px above it at 810. The box's centre is
         held at least 212px above the foot, so it rises only where the
         square is too small for dead centre and is centred again from
         there up. */
      className={
        'pointer-events-none absolute left-1/2 top-1/2 z-[2] flex h-[14.56%] w-[22.7%] -translate-x-1/2 -translate-y-1/2 items-center justify-center phone:h-[20.2%] phone:w-[29.5%] mid:h-[20.2%] mid:w-[29.5%]' +
        (stack ? ' tablet:h-[20.2%] tablet:w-[29.5%]' : ' tablet:top-[min(50%,calc(100%-212px))]')
      }
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
          {/* The '///' at 40 x 20: the height the squares had, twice as
              wide, as the mark always is (28 September 2026). */}
          <FirmMark size="lg" className={dark ? 'text-ground' : 'text-white'} />
          <span className={`t-mark-lg ${dark ? 'text-ground' : 'text-white'}`}>
            {item.mark.word}
          </span>
        </span>
      )}
    </span>
  );
}

/**
 * The one copy of the words. Where it sits, and whether the text and the
 * tags share a row, is the stylesheet's (`.work-card-words`, `.work-card-row`,
 * `.work-card-tags` in src/styles/work.css).
 */
function Words({
  item,
  showSummary,
  heading: H,
  id,
}: {
  item: WorkCardItem;
  showSummary: boolean;
  /** The name is a heading — an H3 under the homepage's own H2, an H2 on
   *  the index, whose opener is the H1 — so the four initiatives appear in
   *  the page's outline instead of "Selected work" running straight into
   *  the footer. Same class, same rendering; only the tag changes. */
  heading: 'h2' | 'h3';
  /** The id stem the link's aria-labelledby and -describedby point at. */
  id: string;
}) {
  /* WORDS OVER A PHOTOGRAPH (28 September 2026): the tags take their own
     dark ground (`Chip onArt`, the tag's capsule). Under the art the
     stylesheet gives them the plain tag's soft fill back. The caption and
     the two meta lines print as they do everywhere, no box behind them: on
     ABP and Belkofski the darkening under them is in the plate
     (`srcCard`), on the OPS capture it is the card's own veil
     (`.veil-ops-card`, the kept exception). */
  const onArt = Boolean(item.src);
  /* The meta line's last term is the state (see `meta` above). */
  const cut = item.meta.lastIndexOf(' · ');
  const lead = cut < 0 ? item.meta : item.meta.slice(0, cut);
  const state = cut < 0 ? '' : item.meta.slice(cut + 3);
  /* The caption runs the card's full width, across its padding. The
     demonstration-data line is part of the card's description; the
     diagram's is not read out, because the diagram's own description
     already says it is a schematic. */
  const caption = item.demo ? (
    <span id={`${id}-demo`} className="-mx-(--card-pad) block self-stretch">
      <Caption as="div" className="px-(--card-pad)">
        {item.demo}
      </Caption>
    </span>
  ) : !item.src ? (
    <span aria-hidden="true" className="-mx-(--card-pad) block self-stretch">
      <Caption as="div" className="px-(--card-pad)">
        {DIAGRAM_CAPTION}
      </Caption>
    </span>
  ) : null;
  return (
    <>
      {caption}
      <span className={`work-card-row${showSummary && item.summary ? ' work-card-row--summary' : ''}`}>
        <span className="flex flex-col gap-(--space-1)">
          <H id={`${id}-name`} className="t-card text-ink">
            {/* One piece of text, not the name and a full stop side by
                side, so a screen reader builds "OPS." and not "OPS .". */}
            {`${item.name}.`}
          </H>
          {/* The year and the field on a plain mono line, the state under
              it as the Status (C10.7, 28 September 2026). */}
          <span id={`${id}-meta`} className="flex flex-col items-start gap-(--space-1)">
            <span className="t-mono tabular-nums text-ink-3">{lead}</span>
            {state ? (
              <Status state={item.tone === 'dev' ? 'development' : 'delivered'} className="text-ink-2">
                {state}
              </Status>
            ) : null}
          </span>
          {showSummary && item.summary ? (
            <span id={`${id}-summary`} className="t-body mt-[4px] max-w-[440px] text-ink-2">
              {item.summary}
            </span>
          ) : null}
        </span>
        {/* Tags, not links: the one tag shape (`Chip`, C10.8). */}
        <span id={`${id}-tags`} className="work-card-tags">
          {item.tags.map((t) => (
            <Chip key={t} onArt={onArt}>
              {t}
            </Chip>
          ))}
        </span>
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
  stackOnTablet = false,
}: {
  item: WorkCardItem;
  /** The tag the card's name prints in — an H3 under the homepage's own
   *  H2, an H2 on the index, whose opener is the H1. Same class, same
   *  rendering. */
  heading?: 'h2' | 'h3';
  wide?: boolean;
  showSummary?: boolean;
  /** Load the picture now rather than when it scrolls near. For a card
   *  that is already on the first screen, where lazy loading only delays
   *  a picture the reader is looking at. */
  eager?: boolean;
  /** Use the phone layout from 600 to 1199px as well: the art in a 4:3
   *  block of its own and the words under it. The work index passes it
   *  (the owner's decision D-03, 25 September 2026), and since the audit
   *  the homepage row does too. */
  stackOnTablet?: boolean;
}) {
  const light = item.art === 'light';
  /* NAMED BY ITS OWN TITLE, DESCRIBED BY THE REST. The link used to carry a
     hidden label ("OPS — PRODUCT IN DEVELOPMENT"), and a label replaces the
     card's own words as the link's spoken name: a reader moving by links
     heard that and nothing else. The name is the heading, and the meta
     line, the demonstration-data line where the card has one, the summary
     where it prints, and the tags are the description, so the whole card
     is read out. The slug is unique on any page that renders the grid, so
     the ids are too. */
  const id = `work-${item.slug}`;
  const describedBy = [
    id + '-meta',
    item.demo ? id + '-demo' : '',
    showSummary && item.summary ? id + '-summary' : '',
    id + '-tags',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <Link
      href={`/work/${item.slug}`}
      aria-labelledby={`${id}-name`}
      aria-describedby={describedBy}
      /* THE ONE CARD (`cardClass`): the ground, the radius and the hover —
         surface +4%, the edge to the strong hairline, the picture leaning
         (`.media-zoom` answers `.group`). The title does not move. */
      className={
        `${cardClass({ interactive: true })} work-card flex h-full flex-col overflow-clip` +
        (stackOnTablet ? ' work-card--stack' : '') +
        (item.src ? ' work-card--art' : '')
      }
    >
      {/* ── the art ──────────────────────────────────────────────────────
          A photograph gets a 4:3 block on a phone. The diagram gets a
          portrait one, because its phone layout runs top to bottom and a
          4:3 box would shrink it to a size nobody could read. A stacked
          card takes 4:3 to 1199. */}
      <span
        className={`relative block w-full overflow-clip ${
          wide ? 'aspect-[2.93/1]' : 'aspect-square'
        } ${item.src ? 'phone:aspect-[4/3]' : 'phone:aspect-[3/4]'}` +
        (stackOnTablet ? ' tablet:aspect-[4/3] mid:aspect-[4/3]' : '')
        }
      >
        <Media
          item={item}
          wide={wide}
          eager={eager}
          stack={stackOnTablet}
          summary={showSummary && Boolean(item.summary)}
        />

        {/* The scrims exist for the overlaid layout only. Below 600px, and
            on a stacked card up to 1199px, the words have moved off the
            picture and nothing needs dimming. The card with no photograph
            has none at all: its words sit on the card's own ground, below
            the diagram's box. A photograph with its foot in the file
            (`srcCard`) has none either: the darkening is in the picture.
            Only the OPS screen keeps them, a capture published clean,
            whose shade is the card's: the one kept exception. */}
        {item.src && !item.srcCard ? (
          <span
            className={`absolute inset-x-0 bottom-0 z-[1] phone:hidden mid:hidden ${
              light
                ? `h-full veil-ops-card${showSummary && item.summary ? ' veil-ops-card-tall' : ''}`
                : 'h-[48%] bg-gradient-to-t from-ground/92 via-ground/38 to-transparent'
            }` + (stackOnTablet ? ' tablet:hidden' : '')}
            aria-hidden="true"
          />
        ) : null}
        {light && item.src && !item.srcCard ? (
          <span
            className={
              'absolute inset-x-0 top-0 z-[1] h-[30%] bg-gradient-to-b from-ground/55 to-transparent phone:hidden mid:hidden' +
              (stackOnTablet ? ' tablet:hidden' : '')
            }
            aria-hidden="true"
          />
        ) : null}

        <CardMark item={item} stack={stackOnTablet} />
      </span>

      {/* ── the words, once ─────────────────────────────────────────────── */}
      <span className="work-card-words">
        <Words item={item} showSummary={showSummary} heading={heading} id={id} />
      </span>
    </Link>
  );
}
