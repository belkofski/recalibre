import Link from 'next/link';
import Img from '@/lib/Img';
import { Spotlight, Tilt } from '@/lib/motion';
import { Caption, Chevron, Chip, FirmMark, Status, cardClass } from '@/components/ui';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import type { ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   THE INITIATIVE CARD — one definition, used by the homepage row, the work
   index and the case pages' MORE WORK row.

   It existed twice before, once in each place, and the two copies drifted:
   the homepage grid was rebuilt to fill its frame and the index was left
   with the earlier treatment, so the same initiatives appeared as strong,
   full-bleed cards on one page and as pale screenshots floating in black
   fields on the next. The card is a single object now, and the only way
   the grids can differ is if someone passes different props.

   ── ONE SHAPE AT EVERY WIDTH (the direction change) ───────────────────────

   The art on top, the words under it on the card's surface. The layout
   that laid the words over the picture is gone, and with it everything
   that only it needed: the two scrims, the veil over the OPS capture, the
   plate with the foot laid into the file (`srcCard`, still typed so the
   callers compile, and ignored), the tag's own dark ground over a
   photograph (`Chip onArt`), and the stylesheet that moved the words about
   by breakpoint. Nothing overlaps, so nothing has to be dimmed, and the
   picture is the picture.

   The art block is a square (16:10 with `art="landscape"`, for a row of
   two), 4:3 below 600 where a phone's own cut is drawn; the Contraxis
   card, which carries the system diagram instead of a photograph, takes a
   portrait block on a phone because the diagram's phone layout runs top
   to bottom and a 4:3 box would shrink it past reading.

   ── THE CARD ANSWERS THE READER ───────────────────────────────────────────

   It is a `surface` (styles/depth.css): a lit vertical fill with grain and
   a gradient edge. Under the pointer the spotlight follows it on the edge
   and the surface (`Spotlight`), the whole card leans toward it by up to
   5° (`Tilt`) while the picture inside, in a `.tilt-layer` cut 6% larger
   than its box so no edge ever shows, moves the other way and leans in 4%
   (`.media-zoom`); the dot fills and its chevron moves forward; pressed,
   the card scales to 0.98. On a phone it lights as it passes the centre of
   the screen, and presses. Under reduced motion there is no tilt and no
   zoom; the picture simply settles as the card is revealed.

   ── WHAT STAYS FROM BEFORE ────────────────────────────────────────────────

   The status is a fact about the initiative, not a headline, so it states
   itself once, under the year and the field, as the site's one `Status`.
   A caption the card carries ("Demonstration data." on the product
   screen, "Schematic — not a screenshot" under the diagram) is the first
   line of the words, on the caption hairline across the card. The centre
   mark keeps the reference's own box; the phone's share, since the art
   block is a picture alone at every width now. The name is a heading, the
   link is named by it and described by the rest, so the whole card is
   read out. One initiative has no photograph, deliberately: Contraxis is
   in development and has no interface to show, so it carries the moving
   system diagram (SystemDiagram.tsx) on a dotted bed, inset 12px.
   ========================================================================= */

export type WorkCardItem = {
  slug: string;
  name: string;
  status: string;
  /** The line under the title: year, category and state, as the content
   *  writes it ("2026 · INDUSTRIAL CONTRACTING · DELIVERED"). The card
   *  prints the last term, the state, as the `Status` on a line of its own
   *  and the rest as the meta line: split at the last " · ", so no word is
   *  retyped. */
  meta: string;
  /** A second line under the meta, in the same type: "Demonstration data."
   *  on a card whose picture is a product screen running on demonstration
   *  data. Only OPS sets it: the OPS screens are real screens from the
   *  build, and both OPS cards print what data they carry. */
  demo?: string;
  tags: readonly string[];
  /** Null where the initiative has no honest photograph. `figure` says what
   *  is drawn in its place. */
  src: ImageSrc | null;
  /** The phone crop, drawn below 600, where a wide picture cut to the 4:3
   *  block would lose its subject. */
  srcTall?: ImageSrc;
  /** `srcTall` is a phone's own cut, too small to draw larger: with this set
   *  it is drawn below 810 only, and from 810 to 1199 the card draws `src`.
   *  Only the OPS register sets it. */
  srcTallMobileOnly?: boolean;
  /** The picture with the card's foot laid into the file, for the layout
   *  whose words sat over the art. That layout is gone; the field stays
   *  typed so the callers compile, and nothing reads it. */
  srcCard?: ImageSrc;
  alt: string;
  figure?: 'contraxis';
  /** How dark the picture was where the title used to sit. The words no
   *  longer sit on the picture, so nothing reads it; typed for the callers. */
  art: 'light' | 'dark';
  /** True where the art is a COMPOSED PLATE rather than a photograph: a
   *  picture whose edges were chosen, so the card must not crop it again.
   *  The 1.22x overscale exists to push a photograph's subject out to the
   *  frame, which is right for a photograph and wrong for a composition. A
   *  plate draws at 1:1 and still leans in on hover. */
  plate?: boolean;
  /** THE MARK THE REFERENCE CENTRES ON EVERY CARD. The reference fills it
   *  with the client's logo, because its cards carry other people's work.
   *  One card here carries a file, ABP Continental's name set in the site's
   *  own lettering until ABP's own logo file arrives (see the note over
   *  MARKS in content/site.ts). Belkofski's wordmark is already printed
   *  across its photograph, so that card carries none. OPS carries the
   *  firm's own '///' beside its name. Neither half of it is invented.
   *  Contraxis draws none (see `CardMark`). `src` wins where a real mark
   *  file exists; `word` is the lockup. */
  mark?: { src?: ImageSrc; word?: string };
  /** The colour the mark prints in. White everywhere the picture is dark
   *  behind the centre — but the OPS plate measures 238 of 255 there, and a
   *  white mark on a white dashboard is no mark at all, so that one prints
   *  in ink. */
  markTone?: 'light' | 'dark';
  tone: 'owned' | 'dev';
  /** An optional line under the tags, on the index where there is room. */
  summary?: string;
};

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
 * The art, in the layer that moves the other way from the card's tilt.
 * A photograph's layer is cut 6% larger than the block that clips it, so
 * the shift never shows an edge; the diagram's is the block itself, with
 * the drawing inset 12px on a dotted bed, so its own ground never slides
 * out from under its edge.
 */
function Media({ item, eager, wide, landscape }: { item: WorkCardItem; eager: boolean; wide: boolean; landscape: boolean }) {
  if (!item.src) {
    return (
      <>
        {/* The bed, under the drawing: the surface's own background-image
            would override a dot grid drawn on the card, so the dots are a
            child, painted over the ground and under everything else. */}
        <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10" />
        <span className="tilt-layer absolute inset-0 block">
          <SystemDiagram preset="card" className="absolute inset-[12px]" />
        </span>
      </>
    );
  }
  /* A photograph takes the reference's 1.22x overscale so the subject fills
     the frame; a composed plate, whose edges were chosen, draws at 1:1. */
  const cls = `media-zoom ${item.plate ? 'media-fill' : 'media-push'}`;
  /* ONE PICTURE PER WIDTH BAND, EACH FILE DRAWN ONCE. The phone crop shows
     below 600 and, in the 4:3 block from 600 to 809, there too; a phone's
     own cut stops at 809.98 (`srcTallMobileOnly`), the rest of them carry
     to 1199, and the square draws from 1200 up. */
  const under = item.srcTall ?? item.src;
  const tallMobileOnly = Boolean(item.srcTall) && item.srcTallMobileOnly === true;
  const pick: Record<Band, ImageSrc> = {
    phone: under,
    mid: under,
    tablet: tallMobileOnly ? item.src : under,
    desk: item.src,
  };
  /* The CSS width in each band: the full width on a phone and for a card
     that spans two columns below 1200; otherwise one column of two, the
     width less the page margins (24, or 20 below 810) and the 2px seam,
     halved. The picture service lists its candidate widths from the
     smallest bare "vw" figure in `sizes` (with none, every width from 32
     up): a phone crop's `sizes` starts with a bare 100vw, which keeps its
     list at 640 and up, and a bare 50vw beside it would add 384, which the
     phone would then pick. So a phone crop's half widths are written inside
     calc(). From 1200 a square is one of three across the 1380 shell, a
     landscape one of two. */
  const width: Record<Band, string> = {
    phone: '100vw',
    mid: wide ? '100vw' : 'calc(50vw - 23px)',
    tablet: wide ? '100vw' : tallMobileOnly ? '50vw' : 'calc(50vw - 27px)',
    desk: landscape ? '690px' : '459px',
  };
  const files = [...new Set(BANDS.map((b) => pick[b]))];
  /* THE SETTLE: the wrapper between the clip box and the picture eases from
     1.06 to 1 as the card is revealed; the picture's own push and the hover
     lean multiply with it. */
  return (
    <span className="tilt-layer absolute -inset-[6%] block">
      <span className="settle absolute inset-0 block">
        {files.map((file) => {
          const on = BANDS.filter((b) => pick[b] === file);
          /* The same picture, so the same words on every crop: a crop that
             is display:none takes its description with it. Only a card
             drawn from one file loads eagerly; where there are two, each
             stays lazy, because an eager image downloads whether or not it
             is shown. */
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
    </span>
  );
}

/**
 * The centre mark. The reference's own box, measured off its cards, is
 * 156 x 100 at 687px and 102 x 70 on a 346px phone card: 29.5% x 20.2%,
 * the phone's share, which the block takes at every width now that it is
 * a picture alone. The lockup is capped to the box rather than stretched
 * into it, so a short name and a long one are the same size as each
 * other. It sits outside the tilting layer: the picture moves under it.
 */
function CardMark({ item }: { item: WorkCardItem }) {
  /* NONE ON A CARD WITH NO PHOTOGRAPH. Contraxis carries the system diagram
     instead, and the diagram's centre card is the same glyph beside the
     same name — printing the mark as well would say "Contraxis" twice in
     the middle of one card. */
  if (!item.mark || !item.src) return null;
  const dark = item.markTone === 'dark';
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-[2] flex h-[20.2%] w-[29.5%] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
    >
      {item.mark.src ? (
        <Img
          src={item.mark.src}
          alt=""
          className={`max-h-full w-auto max-w-full object-contain ${dark ? 'mark-ink' : 'mark-white'}`}
        />
      ) : (
        <span className="flex items-center gap-[11px] mobile:gap-[7px]">
          {/* The '///' at 40 x 20, twice as wide as it is tall, as the mark
              always is. */}
          <FirmMark size="lg" className={dark ? 'text-ground' : 'text-white'} />
          <span className={`t-mark-lg ${dark ? 'text-ground' : 'text-white'}`}>{item.mark.word}</span>
        </span>
      )}
    </span>
  );
}

/**
 * The words, under the art: the caption hairline first where the card has
 * one, the name beside the dot, the year and the field over the status,
 * the tags, and the summary where the page prints it. Named the card's
 * foot, not its words: the overlaid card's `.work-card-words` rules in
 * styles/work.css are dead and wait for that sheet's owner to delete
 * them, and this block must not inherit their absolute position meanwhile.
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
   *  the index, whose opener is the H1 — so the initiatives appear in the
   *  page's outline. Same class, same rendering; only the tag changes. */
  heading: 'h2' | 'h3';
  /** The id stem the link's aria-labelledby and -describedby point at. */
  id: string;
}) {
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
    <span className="work-card-foot flex flex-col gap-(--space-3) p-(--card-pad)">
      {caption}
      <span className="flex items-start justify-between gap-(--space-3)">
        <H id={`${id}-name`} className="t-card text-ink">
          {/* One piece of text, not the name and a full stop side by side,
              so a screen reader builds "OPS." and not "OPS .". */}
          {`${item.name}.`}
        </H>
        {/* The dot, on the title's first line: it fills and its chevron
            moves forward with the card's hover (`.group`). */}
        <span className="dot-btn mt-[8px] mobile:mt-[4px]">
          <Chevron />
        </span>
      </span>
      {/* The year and the field on a plain mono line, the state under it
          as the Status. */}
      <span id={`${id}-meta`} className="flex flex-col items-start gap-(--space-1)">
        <span className="t-mono tabular-nums text-ink-3">{lead}</span>
        {state ? (
          <Status state={item.tone === 'dev' ? 'development' : 'delivered'} className="text-ink-2">
            {state}
          </Status>
        ) : null}
      </span>
      {/* Tags, not links: the one tag shape, in a row that wraps. */}
      <span id={`${id}-tags`} className="flex flex-wrap items-center gap-(--space-1)">
        {item.tags.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </span>
      {showSummary && item.summary ? (
        <span id={`${id}-summary`} className="t-body max-w-[440px] text-ink-2">
          {item.summary}
        </span>
      ) : null}
    </span>
  );
}

export default function WorkCard({
  item,
  heading = 'h3',
  art = 'square',
  wide = false,
  showSummary = false,
  eager = false,
}: {
  item: WorkCardItem;
  /** The tag the card's name prints in — an H3 under the homepage's own
   *  H2, an H2 on the index, whose opener is the H1. Same class, same
   *  rendering. */
  heading?: 'h2' | 'h3';
  /** The art block's shape from 600 up: a square in a row of three, 16:10
   *  in a row of two (the case pages' MORE WORK). A phone draws 4:3 either
   *  way, and the diagram card a portrait block. */
  art?: 'square' | 'landscape';
  /** The card spans two columns below 1200 (the homepage row's orphan):
   *  its art is 16:10 there, so a square does not run to twice the height
   *  of the row above, and its picture is asked for at the full width. */
  wide?: boolean;
  showSummary?: boolean;
  /** Load the picture now rather than when it scrolls near. For a card
   *  that is already on the first screen, where lazy loading only delays
   *  a picture the reader is looking at. */
  eager?: boolean;
  /** The two layout props of the overlaid card. The words sit under the
   *  art at every width now, so both are accepted and do nothing; the
   *  callers that pass them still compile. */
  stackOnTablet?: boolean;
  stack?: boolean;
}) {
  const landscape = art === 'landscape';
  /* NAMED BY ITS OWN TITLE, DESCRIBED BY THE REST. A hidden label would
     replace the card's own words as the link's spoken name; the name is
     the heading, and the meta line, the demonstration-data line where the
     card has one, the summary where it prints, and the tags are the
     description, so the whole card is read out. The slug is unique on any
     page that renders the grid, so the ids are too. */
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
    /* The two wrappers lay out nothing (`display: contents`): they write
       the light's place and the lean on the link itself. The call site's
       reveal wraps them, never the other way round. */
    <Spotlight>
      <Tilt max={5}>
        <Link
          href={`/work/${item.slug}`}
          aria-labelledby={`${id}-name`}
          aria-describedby={describedBy}
          className={
            `${cardClass({ interactive: true, surface: true, spot: true, tilt: true })} press work-card flex h-full flex-col overflow-clip` +
            (wide ? ' work-card--wide' : '')
          }
        >
          <span aria-hidden="true" className="spot-light" />

          {/* ── the art ────────────────────────────────────────────────── */}
          <span
            className={`work-card-art relative block w-full overflow-clip ${
              landscape ? 'aspect-[16/10]' : 'aspect-square'
            } ${item.src ? 'phone:aspect-[4/3]' : 'phone:aspect-[3/4]'}`}
          >
            <Media item={item} eager={eager} wide={wide} landscape={landscape} />
            <CardMark item={item} />
          </span>

          {/* ── the words, once ────────────────────────────────────────── */}
          <Words item={item} showSummary={showSummary} heading={heading} id={id} />
        </Link>
      </Tilt>
    </Spotlight>
  );
}
