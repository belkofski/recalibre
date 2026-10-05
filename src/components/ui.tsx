import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

/* ============================================================================
   THE KIT.

   A few small parts account for nearly every repeated object on the site.
   They are built once here, measured, and reused — so a button is the same
   48px object on ten pages and a mono label is the same 10px object on forty.

   ONE GRAPHIC SYSTEM SINCE 28 SEPTEMBER 2026 (Phase C): the firm's '///'
   (`FirmMark`), the chevron cut from it (`Chevron`), the tick rule
   (`TickRule`), the status dot (`Status`) and the caption hairline
   (`Caption`). The reference's three squares, its barcode, dot grid, window
   dots, level bars and sideways rail text are gone, with their CSS.
   ========================================================================= */

/** The '///' as a path in its own 44 x 22 box, for a drawing that cannot
 *  place the component: the system diagram's centre card draws it in its
 *  own SVG. lib/curtain.ts keeps a copy of its own, because the curtain is
 *  serialised into the page and can import nothing. */
export const FIRM_MARK_PATH = 'M9 0h9L9 22H0zM22 0h9l-9 22h-9zM35 0h9l-9 22h-9z';

const MARK_SIZE = {
  sm: '-mr-[3px] h-[5px] w-[10px]',
  md: '-mr-[4px] h-[7px] w-[14px]',
  lg: 'h-[20px] w-[40px]',
} as const;

/**
 * THE FIRM'S OWN MARK, '///': beside the name wherever the name is set as a
 * mark (the header, the footer, the closing panel and the signature blocks),
 * before every section label (`LabelRow`) and at the centre of a work card.
 * It is never turned and never mirrored.
 *
 * Fadi's decision of 25 September 2026: the tab icon and the mark beside
 * the name are his own '///'. Since 28 September 2026 it also takes the
 * places the reference's three squares had as a mark (the label rows, the
 * work card's centre); where the squares stood for an arrow, `Chevron`
 * below, cut from the same bar, takes the place.
 *
 * The bars are the ones in his own mark file (app/icon.svg, copied into
 * assets with his yes), cut to their own 44 x 22 outline, so every size is
 * twice as wide as it is tall:
 *   sm  10 x 5    the default: footer, signature blocks, label rows
 *   md  14 x 7    the header (28 September 2026)
 *   lg  40 x 20   the work card's centre mark, beside `.t-mark-lg`
 * The negative right margin on the two small sizes gives back part of the
 * extra width against the 7px squares they replaced, so a name beside the
 * mark starts where it did (sm) or 3px later (md).
 *
 * It paints in the text colour: call sites write `text-accent-bright`,
 * `text-white` or, before a label, `text-ink-3`. Windows high-contrast mode
 * keeps a colour set on the mark itself rather than replacing it, which
 * would leave a white mark on a light theme's white ground; `forced-colors:`
 * sets it to the reader's own text colour there.
 */
export function FirmMark({ size = 'sm', className = '' }: { size?: keyof typeof MARK_SIZE; className?: string }) {
  return (
    <svg
      viewBox="0 0 44 22"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={`${MARK_SIZE[size]} flex-none forced-colors:text-[CanvasText] ${className}`}
    >
      <path d={FIRM_MARK_PATH} />
    </svg>
  );
}

/**
 * THE CHEVRON (28 September 2026, judged unanimously: `C-chevron-decision`,
 * B slimmed). The '///' bar cut through its middle, the halves meeting at
 * the tip: the bar's slant (9 across for 22 up), both ends cut level like the
 * bar's, filled in the text colour. Two drawings, one per size, each centred
 * in its box by its centre of mass:
 *   label       6 x 10, arms 3.0px    MonoLink's dot, back links, MENU
 *   ring, tip   8 x 13, arms 4.0px    the 44px carousel rings, the 48px
 *                                      button tip, the FAQ
 * Any other size follows the same rule: box W x H, arm t, d = 9H/44,
 * x0 = (W - t - d) / 2, points (x0,0) (x0+t,0) (x0+t+d,H/2) (x0+t,H) (x0,H)
 * (x0+d,H/2).
 *
 * DIRECTION IS A MIRROR, NEVER A TURN: `forward` as drawn, `back` mirrored
 * (`.chev-back`, scaleX(-1)). The one exception is a disclosure, a state
 * rather than a destination (the FAQ, the phone stage fold, MENU): `down`
 * turns it 90 degrees while closed, `up` 270 while open, and the turn eases
 * 300ms on the hover curve. A disclosure sits in its own square box (16px
 * for the 8 x 13, 12px for the 6 x 10) so the turned shape stays inside it.
 *
 * Inside a hovered or focused link, button or `.group`, a forward chevron
 * moves 2px forward and a mirrored one 2px back; a disclosure does not
 * move. All of that is CSS (`.chev*` in globals.css).
 */
export function Chevron({
  dir = 'forward',
  size = 'label',
  className = '',
}: {
  dir?: 'forward' | 'back' | 'down' | 'up';
  size?: 'label' | 'ring' | 'tip';
  className?: string;
}) {
  const big = size !== 'label';
  const svg = (
    <svg
      width={big ? 8 : 6}
      height={big ? 13 : 10}
      viewBox={big ? '0 0 8 13' : '0 0 6 10'}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={`chev ${big ? 'chev-13' : 'chev-10'} chev-${dir} ${dir === 'down' || dir === 'up' ? '' : className}`}
    >
      <path d={big ? 'M0.67 0L4.67 0L7.33 6.5L4.67 13L0.67 13L3.33 6.5Z' : 'M0.477 0L3.477 0L5.523 5L3.477 10L0.477 10L2.523 5Z'} />
    </svg>
  );
  if (dir === 'forward' || dir === 'back') return svg;
  return (
    <span aria-hidden="true" className={`chev-box ${big ? 'size-[16px]' : 'size-[12px]'} ${className}`}>
      {svg}
    </span>
  );
}

/**
 * The primary button: a white face and a blue tip, 2px apart, 48px tall,
 * 8px radius. On hover the two swap colour and the chevron in the tip moves
 * 2px forward; pressed, the whole button scales to 0.98.
 */
export function Btn({
  href,
  label,
  className = '',
  onClick,
  type,
}: {
  href?: string;
  label: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  const inner = (
    <>
      <span className="btn-face t-btn">{label}</span>
      <span className="btn-tip">
        <Chevron size="tip" />
      </span>
    </>
  );
  if (href) {
    // A same-page jump (#…) is a plain anchor too — see MonoLink.
    const external =
      href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('#');
    const cls = `btn ${className}`;
    return external ? (
      <a href={href} className={cls}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type ?? 'button'} onClick={onClick} className={`btn ${className}`}>
      {inner}
    </button>
  );
}

/**
 * The secondary action: two mono words, the first dimmed and the second
 * lit, followed by a 24px circle holding the chevron. On hover the circle
 * fills light blue and the chevron moves 2px forward.
 */
export function MonoLink({
  href,
  lead,
  label,
  className = '',
  onClick,
  ariaLabel,
}: {
  href: string;
  lead?: string;
  label: string;
  className?: string;
  /** For a link inside something that must close when it is used — the menu. */
  onClick?: () => void;
  /** Where the same words link to more than one place on a page (the
   *  register's two SEE THE WORK). It must begin with `label`, so the name
   *  a voice user reads off the screen still opens it. */
  ariaLabel?: string;
}) {
  /* A SAME-PAGE JUMP GOES THROUGH A PLAIN ANCHOR, NOT THE ROUTER. The router
     scrolls to a hash once; with the address already ending in it, the next
     click on the same link does nothing — the footer's BACK TO THE FORM
     worked exactly one time. The browser's own fragment navigation scrolls
     on every click and stops below the bar (globals.css, scroll-padding). */
  const external =
    href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('#');
  const body = (
    <>
      <span className="flex items-center gap-[8px]">
        {lead ? <span className="t-mono text-ink-2">{lead}</span> : null}
        <span className="t-mono text-ink">{label}</span>
      </span>
      <span className="dot-btn">
        <Chevron />
      </span>
    </>
  );
  const cls = `tap-44 inline-flex items-center gap-[8px] ${className}`;
  return external ? (
    <a href={href} onClick={onClick} className={cls} aria-label={ariaLabel}>
      {body}
    </a>
  ) : (
    <Link href={href} onClick={onClick} className={cls} aria-label={ariaLabel}>
      {body}
    </Link>
  );
}

/**
 * With `href`, a link pill: a control, `.pill` in `.t-mono` (10px), 28px
 * tall, the size the bar's own pill takes; the link around it is 44px tall,
 * so the hit area clears the minimum without changing the drawing. Without
 * `href`, a tag: since 28 September 2026 the one tag shape, `.chip` (24px,
 * `.t-tag`), the same as `Chip` draws.
 */
export function Pill({ children, href }: { children: ReactNode; href?: string }) {
  if (href) {
    return (
      <Link href={href} className="tap-44">
        <span className="pill t-mono text-ink">{children}</span>
      </Link>
    );
  }
  return <span className="chip t-tag text-ink-2">{children}</span>;
}

/** A tag: the one tag shape (`.chip`). Used under each capability chapter. */
export function Chip({ children, onArt = false }: { children: ReactNode; onArt?: boolean }) {
  /* `onArt`: the tag is drawn over a photograph and takes its own dark
     ground (`.chip-art`, globals.css; 28 September 2026). */
  return <span className={`chip t-tag text-ink-2${onArt ? ' chip-art' : ''}`}>{children}</span>;
}

/**
 * THE TICK RULE (28 September 2026). A 1px hairline in ink at 35% with a
 * 1 x 4 tick every 8px and a 1 x 8 tick every 40px, both hanging below the
 * line: 9px tall, as wide as its container. Drawn in `.tick-rule` from
 * hard-stop background layers, a pattern and not a shaded gradient.
 *
 * `lit` (0 to 1) draws the first part of the line and its ticks in the
 * signal blue (`--color-signal`: light blue on black, the deep blue on a
 * white panel, where the light one is 2.4:1). A change of `lit` eases the
 * lit width over 300ms on the hover curve; under reduced motion it jumps.
 *
 * Used in exactly three places: under every section label (`LabelRow`
 * below), as the capability carousel's progress (lit = (index + 1) / count)
 * and across the head of each stage card (lit = 1/3, 2/3, 3/3). Nowhere
 * else: the site draws no other rule, ruler or grid.
 */
export function TickRule({ lit, className = '' }: { lit?: number; className?: string }) {
  const style =
    lit === undefined ? undefined : ({ '--lit': String(Math.min(1, Math.max(0, lit))) } as CSSProperties);
  return (
    <span aria-hidden="true" className={`tick-rule ${className}`} style={style}>
      {lit === undefined ? null : <span className="tick-rule-lit" />}
    </span>
  );
}

/**
 * The section label row: the '///' and a mono label, with the tick rule
 * under them across the section. `right` is drawn as given at the row's
 * right end, at every width: a MonoLink there is how Insights reaches
 * /insights (28 September 2026). The mark is ink at 50%, the small-mark
 * colour (C7); the label is 60%.
 */
export function LabelRow({ label, right }: { label: string; right?: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-[8px]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-[8px]">
          <FirmMark className="text-ink-3" />
          <span className="t-mono text-ink-2">{label}</span>
        </span>
        {right ?? null}
      </div>
      <TickRule />
    </div>
  );
}

/**
 * THE STATUS (28 September 2026): a 6px dot and a `.t-mono` label, one
 * shape everywhere a state is printed (work cards, case pages, the OPS
 * block). The dot is the signal blue for work in development and ink at 50%
 * for delivered work (and for partner work, which is delivered); never
 * orange, never in a capsule. The label is the status string exactly as the
 * content prints it. Its colour comes from the call site (`text-ink-2` in a
 * card's meta, `text-ink` on a case cover); the dot keeps its own.
 */
export function Status({
  state,
  children,
  className = '',
}: {
  state: 'development' | 'delivered';
  children: string;
  className?: string;
}) {
  return (
    <span className={`status t-mono ${className}`}>
      <span aria-hidden="true" className={`status-dot ${state === 'development' ? 'status-dot-dev' : ''}`} />
      {children}
    </span>
  );
}

/**
 * THE CAPTION (28 September 2026): a `.t-mono` label at 50% ink on a 1px
 * hairline (10%) that runs the full width of its container, set under the
 * picture or figure it captions: "Demonstration data.", "Schematic — not a
 * screenshot" and every picture caption the site prints, the words exactly
 * as printed. `end` is a control that shares the caption's line (the
 * gallery's OPEN FULL SIZE, the diagram's pause), drawn at the right end on
 * the same hairline. `as="figcaption"` inside a `<figure>`.
 */
export function Caption({
  children,
  end,
  as: Tag = 'p',
  className = '',
}: {
  children: string;
  end?: ReactNode;
  as?: 'p' | 'figcaption' | 'div';
  className?: string;
}) {
  /* Never in a box, over a picture too: where a caption sits on a
     photograph the darkening is in the plate, and on a product capture it
     is the card's own veil (the kept exception). */
  return (
    <Tag className={`caption ${className}`}>
      <span className="t-mono">{children}</span>
      {end ?? null}
    </Tag>
  );
}

/**
 * A sentence with some of its own words as links (5 October 2026). The
 * site already states its proof in plain sentences — "ABP Continental uses
 * a custom build of OPS in its own operation." — and those sentences led
 * nowhere. `links` maps a phrase to the page that shows it; the phrase's
 * first appearance, as a whole word, becomes the link, and not one word of
 * the sentence changes. Pass the same `seen` set to several paragraphs (an
 * article) and each phrase is linked once across all of them. The form's
 * inline-link style; a link inside a sentence is exempt from the 44px rule
 * (see EnquiryForm).
 */
export function LinkedText({
  text,
  links,
  seen,
}: {
  text: string;
  links?: Readonly<Record<string, string>>;
  seen?: Set<string>;
}) {
  if (!links) return <>{text}</>;
  const hits: { at: number; phrase: string; href: string }[] = [];
  for (const [phrase, href] of Object.entries(links)) {
    if (seen?.has(phrase)) continue;
    const at = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).exec(text)?.index;
    if (at !== undefined) hits.push({ at, phrase, href });
  }
  hits.sort((a, b) => a.at - b.at);
  const out: ReactNode[] = [];
  let from = 0;
  for (const h of hits) {
    if (h.at < from) continue;
    out.push(text.slice(from, h.at));
    out.push(
      <Link
        key={h.at}
        href={h.href}
        className="text-ink underline decoration-rule underline-offset-2 transition-colors duration-300 ease-hover hover:decoration-current"
      >
        {h.phrase}
      </Link>,
    );
    from = h.at + h.phrase.length;
    seen?.add(h.phrase);
  }
  out.push(text.slice(from));
  return <>{out}</>;
}
