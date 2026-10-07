import Link from 'next/link';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { InView, Magnetic, Rise, Spotlight, Tilt } from '@/lib/motion';

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

   ONE COMPONENT LANGUAGE SINCE 6 OCTOBER 2026 (the owner's audit): every
   card is `Card`, every section opens with `SectionHead`, every small label
   is `Eyebrow`, and the primary button can lean toward the pointer
   (`Btn magnetic`). The label row draws its own tick rule as it arrives.
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

/** A same-page jump, a mail or phone link or an outside address goes
 *  through a plain anchor; everything else through the router. The router
 *  scrolls to a hash once; with the address already ending in it, the next
 *  click on the same link did nothing (the footer's BACK TO THE FORM worked
 *  exactly one time). The browser's own fragment navigation scrolls on every
 *  click and stops below the bar (globals.css, scroll-padding). */
const isPlain = (href: string) =>
  href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('#');

/**
 * The primary button: a white face and a blue tip, 2px apart, 48px tall,
 * 8px radius. Under the pointer the blue wipes across the face from the
 * left and the chevron in the tip moves 2px forward; pressed, the whole
 * button scales to 0.98. `magnetic` (6 October 2026) lets it lean toward
 * the pointer and spring back — for the site's few primary actions (the
 * hero, the stages, the footer), never for a button inside a card.
 */
export function Btn({
  href,
  label,
  className = '',
  onClick,
  type,
  magnetic = false,
}: {
  href?: string;
  label: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  magnetic?: boolean;
}) {
  const inner = (
    <>
      <span className="btn-face t-btn">{label}</span>
      <span className="btn-tip">
        <Chevron size="tip" />
      </span>
    </>
  );
  const cls = `btn ${className}`;
  const el = href ? (
    isPlain(href) ? (
      <a href={href} className={cls}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    )
  ) : (
    <button type={type ?? 'button'} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
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
  const body = (
    <>
      {/* The words carry the link line (depth.css): a hairline draws under
          them from the left on hover or focus, the link's own or its
          card's, and the dot fills beside it. */}
      <span className="link-line flex items-center gap-[8px]">
        {lead ? <span className="t-mono text-ink-2">{lead}</span> : null}
        <span className="t-mono text-ink">{label}</span>
      </span>
      <span className="dot-btn">
        <Chevron />
      </span>
    </>
  );
  const cls = `tap-44 inline-flex items-center gap-[8px] ${className}`;
  return isPlain(href) ? (
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
export function Pill({ children, href, onClick }: { children: ReactNode; href?: string; onClick?: () => void }) {
  if (href) {
    const inner = <span className="pill t-mono text-ink">{children}</span>;
    return isPlain(href) ? (
      <a href={href} className="tap-44" onClick={onClick}>
        {inner}
      </a>
    ) : (
      <Link href={href} className="tap-44" onClick={onClick}>
        {inner}
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
 * Inside an `InView` that carries `.tick-draw` (every `LabelRow` does) the
 * rule draws itself left to right as the block comes in.
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
 * right end, at every width: a MonoLink there is how a block reaches its
 * own page. The mark is ink at 50%, the small-mark colour (C7); the label
 * is 60%. Since 6 October 2026 the row is its own reveal and its rule
 * draws as it arrives (`.tick-draw`).
 */
export function LabelRow({ label, right, className = '' }: { label: string; right?: ReactNode; className?: string }) {
  return (
    <InView className={`tick-draw flex w-full flex-col gap-[8px] ${className}`}>
      <div className="flex items-center justify-between gap-[16px]">
        <span className="flex items-center gap-[8px]">
          <FirmMark className="text-ink-3" />
          <span className="t-mono text-ink-2">{label}</span>
        </span>
        {right ?? null}
      </div>
      <TickRule />
    </InView>
  );
}

/**
 * THE EYEBROW (6 October 2026): a small label over a thing — a chapter's
 * number, a card's category, a status line — in `.t-mono` at 50% ink, with
 * the '///' before it where it opens a block. Not the section label (that
 * is `LabelRow`, with its rule).
 */
export function Eyebrow({
  children,
  mark = false,
  className = '',
  as: Tag = 'p',
}: {
  children: ReactNode;
  mark?: boolean;
  className?: string;
  as?: 'p' | 'span' | 'div';
}) {
  return (
    <Tag className={`t-mono flex items-center gap-[8px] text-ink-3 ${className}`}>
      {mark ? <FirmMark className="text-ink-3" /> : null}
      <span>{children}</span>
    </Tag>
  );
}

/**
 * THE SECTION OPENER (6 October 2026): the one way a section begins. The
 * label row with its rule, then the heading at the section size with its
 * lines rising, and the lede beside it from 1200 up (under it below), so
 * every block on every page starts with the same voice. `right` is a
 * MonoLink at the label row's end (the block's own page); `mark` the one
 * marked phrase a page may carry.
 *
 * Headings are `t-section`, a step under the page's h1, by the owner's
 * audit: a page has one loud voice. A section that must open at display
 * size (the OPS flagship) passes `size="display"`.
 */
export function SectionHead({
  label,
  lines,
  lede,
  right,
  id,
  mark,
  wrap,
  as = 'h2',
  size = 'section',
  by = 'line',
  className = '',
}: {
  label: string;
  lines: readonly string[];
  lede?: string;
  right?: ReactNode;
  id?: string;
  mark?: string;
  wrap?: boolean;
  as?: 'h1' | 'h2';
  size?: 'section' | 'display';
  by?: 'line' | 'word';
  className?: string;
}) {
  return (
    <div className={`flex w-full flex-col gap-(--space-label) ${className}`}>
      <LabelRow label={label} right={right} />
      <div className="grid w-full grid-cols-2 items-end gap-x-[40px] narrow:grid-cols-1 narrow:gap-y-(--space-lede)">
        <Rise
          as={as}
          id={id}
          lines={lines}
          mark={mark}
          wrap={wrap}
          by={by}
          className={`${size === 'display' ? 't-display' : 't-section'} text-ink`}
        />
        {lede ? (
          <InView delay={120} className="justify-self-start narrow:justify-self-auto">
            <p className="t-body max-w-[420px] text-ink-2">{lede}</p>
          </InView>
        ) : null}
      </div>
    </div>
  );
}

/**
 * THE CARD (6 October 2026): the one card. Radius 30 or 24 (20 on a phone,
 * automatic) on a seam plate, `pad` for the card padding token,
 * `interactive` for the one hover (`.card-hover`: the ground steps up, the
 * dot fills, the picture leans). The words inside it keep one vocabulary:
 * eyebrow/meta `t-mono text-ink-3`, title `t-card text-ink`, description
 * `t-body text-ink-2`, tags `Chip`, the action a MonoLink-shaped foot. A
 * card that is a link (WorkCard) uses `cardClass` on the link itself.
 *
 * THE SURFACE (7 October 2026, the direction change; styles/depth.css). A
 * card is a `surface` by default now: a lit vertical fill with film grain,
 * a 1px inner highlight and a gradient edge lighter where the light falls.
 * `surface={false}` keeps the flat ground (a photograph edge to edge, a
 * card inside a photograph). `deep` steps a surface down, for a card inside
 * a card. `spot` lights it under the pointer (and, on a phone, as it passes
 * the centre of the screen): the card is wrapped in `Spotlight`, which
 * writes the light's place, and renders the surface light's own layer.
 * `tilt` makes a picture card lean toward the pointer (`Tilt`); put the
 * picture in a `.tilt-layer` so it moves the other way. Put a tilting card
 * inside its reveal, never the reveal inside the card.
 */
export function cardClass({
  radius = 30,
  pad = false,
  interactive = false,
  surface = true,
  deep = false,
  spot = false,
  tilt = false,
}: {
  radius?: 30 | 24;
  pad?: boolean;
  interactive?: boolean;
  surface?: boolean;
  deep?: boolean;
  spot?: boolean;
  tilt?: boolean;
} = {}) {
  return (
    `card ${radius === 30 ? 'card-30' : 'card-24'}` +
    (pad ? ' p-(--card-pad)' : '') +
    (interactive ? ' card-hover group' : '') +
    (surface ? ' surface' : '') +
    (surface && deep ? ' surface-deep' : '') +
    (spot ? ' spot' : '') +
    (tilt ? ' tilt' : '')
  );
}

export function Card({
  children,
  radius = 30,
  pad = false,
  interactive = false,
  surface = true,
  deep = false,
  spot = false,
  tilt = false,
  as: Tag = 'div',
  className = '',
  ...rest
}: {
  children: ReactNode;
  radius?: 30 | 24;
  pad?: boolean;
  interactive?: boolean;
  surface?: boolean;
  deep?: boolean;
  spot?: boolean;
  tilt?: boolean;
  as?: 'div' | 'article' | 'li' | 'section' | 'figure' | 'aside';
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'>) {
  let el = (
    <Tag className={`${cardClass({ radius, pad, interactive, surface, deep, spot, tilt })} ${className}`} {...rest}>
      {/* The surface light, under everything in the card (z-index −1 inside
          the surface's own stacking context), drawn only where the card
          asks for the spotlight. */}
      {spot ? <span aria-hidden="true" className="spot-light" /> : null}
      {children}
    </Tag>
  );
  if (tilt) el = <Tilt>{el}</Tilt>;
  if (spot) el = <Spotlight>{el}</Spotlight>;
  return el;
}

/* ============================================================================
   THE DEPTH KIT (7 October 2026, the direction change). The parts that turn
   a list into objects: the ambient light behind a block, the in-house
   glyphs and their tiles, the big outline ordinal, the device frame around
   a capture. The stylesheet is styles/depth.css; the scripts are in
   lib/motion.tsx.
   ========================================================================= */

/** One orb: where it sits (percent of the block), how big, which blue, how
 *  strong, and when its drift starts. */
type Orb = { x: string; y: string; size: number; color: 'deep' | 'glow' | 'white'; a: number; delay?: number; dur?: number };

/* The presets, by the block they light. Sizes in pixels, so an orb is the
   same object at every width and a phone simply sees less of it. */
const ORBS: Record<'hero' | 'section' | 'card' | 'foot', readonly Orb[]> = {
  hero: [
    { x: '12%', y: '28%', size: 760, color: 'deep', a: 0.2 },
    { x: '86%', y: '82%', size: 560, color: 'glow', a: 0.09, delay: -9, dur: 34 },
    { x: '58%', y: '6%', size: 420, color: 'white', a: 0.045, delay: -17, dur: 30 },
  ],
  section: [
    { x: '8%', y: '18%', size: 640, color: 'deep', a: 0.16 },
    { x: '92%', y: '92%', size: 520, color: 'glow', a: 0.08, delay: -11, dur: 32 },
  ],
  card: [
    { x: '18%', y: '22%', size: 440, color: 'deep', a: 0.22 },
    { x: '92%', y: '88%', size: 380, color: 'glow', a: 0.11, delay: -7, dur: 26 },
  ],
  foot: [
    { x: '50%', y: '112%', size: 960, color: 'deep', a: 0.2 },
    { x: '8%', y: '-4%', size: 420, color: 'glow', a: 0.06, delay: -13, dur: 36 },
  ],
};

const ORB_COLOR = {
  deep: 'var(--color-glow-deep)',
  glow: 'var(--color-glow)',
  white: '#ffffff',
} as const;

/**
 * THE ORBS: the ambient light behind a block (depth.css, `.orbs`). Put it
 * inside a block that is `relative isolate overflow-clip` (or a Card, which
 * is), before the content; it fills the block at z-index −1 and the content
 * needs no z-index. Decorative, hidden from assistive technology, still
 * under reduced motion.
 */
export function Orbs({
  variant = 'section',
  className = '',
  style,
}: {
  variant?: keyof typeof ORBS;
  className?: string;
  /** For a block that wants the preset placed differently: the wrapper's
   *  own style (an inset, a clip) — never the orbs' colours. */
  style?: CSSProperties;
}) {
  return (
    <span aria-hidden="true" className={`orbs ${className}`} style={style}>
      {ORBS[variant].map((o, i) => (
        <span
          key={i}
          className="orb"
          style={
            {
              '--orb-x': o.x,
              '--orb-y': o.y,
              '--orb-size': `${o.size}px`,
              '--orb-color': ORB_COLOR[o.color],
              '--orb-a': String(o.a),
              '--orb-delay': `${o.delay ?? 0}s`,
              '--orb-dur': `${o.dur ?? 28}s`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}

/* THE GLYPHS: drawn here for this site on a 16-unit grid, stroke 1.1 with
   round caps and joins, no fill — the same hand as the system diagram's
   icons (components/SystemDiagram.tsx), so a tile on a card and a card in
   the diagram read as one set. None comes from a library. A glyph stands
   for a structural idea the content already names (a register, a permit, a
   signature, no signal, a person deciding); it never pretends to be a
   logo, a chart or a screenshot. */
const GLYPHS = {
  register: 'M3 4h1 M6 4h7 M3 8h1 M6 8h7 M3 12h1 M6 12h5',
  permit: 'M3 2.5h10v11H3z M5.5 5.5h5 M5.5 8h3 M9.6 10.6a1.4 1.4 0 1 0 2.8 0 1.4 1.4 0 0 0-2.8 0z',
  crew: 'M6 7.2a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2z M2.3 13.2c.4-2.3 1.8-3.6 3.7-3.6s3.3 1.3 3.7 3.6 M10.6 7a1.9 1.9 0 1 0 0-3.8 M13.7 12.8c-.3-1.9-1.3-3-2.7-3.3',
  report: 'M4 2.5h5.4l3.1 3.1v7.9H4z M9.4 2.5v3.1h3.1 M6 8h4 M6 10.3c.5-.6 1-.6 1.4 0s.9.6 1.4 0 M6 12.3h2.5',
  'signal-off': 'M2.3 6.4a8.2 8.2 0 0 1 11.4 0 M4.9 9a4.6 4.6 0 0 1 6.2 0 M8 12.3h.01 M3 3l10 10',
  server: 'M3 3.5h10v3.6H3z M3 8.9h10v3.6H3z M5.5 5.3h.01 M5.5 10.7h.01',
  languages: 'M2.5 4.2h8 M6.5 2.6v1.6 M4.2 4.2c.5 3 2.4 5.4 4.8 6.4 M8.8 4.2c-.5 3-2.4 5.4-4.8 6.4 M9.4 13.6l2.1-5.3 2.1 5.3 M10.2 11.8h2.6',
  rtl: 'M13.5 8h-11 M5.5 5L2.5 8l3 3 M8 3h5.5 M8 13h5.5',
  person: 'M10.4 5.2a2.4 2.4 0 1 1-4.8 0 2.4 2.4 0 0 1 4.8 0z M3.6 13.5c.5-2.5 2.2-3.9 4.4-3.9s3.9 1.4 4.4 3.9',
  decide: 'M8 14.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13z M5.3 8.2l1.9 1.9 3.6-3.8',
  handover: 'M2.5 8h7 M7 5.5L9.5 8 7 10.5 M11 3h2.5v10H11',
  owned: 'M6 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M8.2 8.2l5.3 5.3 M11 11l1.5-1.5 M12.5 12.5l1.5-1.5',
  plan: 'M3.5 2.5h9v11h-9z M5.5 5.6l1 1 1.8-1.8 M9.2 5.5h1.8 M5.5 9.4l1 1 1.8-1.8 M9.2 9.3h1.8',
  scope: 'M2.5 5.5v-3h3 M10.5 2.5h3v3 M13.5 10.5v3h-3 M5.5 13.5h-3v-3 M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  build: 'M2.5 9.5h5v4h-5z M8.5 9.5h5v4h-5z M5.5 3h5v4h-5z',
  support: 'M8 14.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13z M8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M3.4 3.4l2.8 2.8 M12.6 3.4L9.8 6.2 M12.6 12.6L9.8 9.8 M3.4 12.6l2.8-2.8',
  problem: 'M8 14.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13z M8 5v4 M8 11.3h.01',
  system: 'M3.5 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M12.5 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M8 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M4.3 5.4L7.2 10.6 M11.7 5.4L8.8 10.6 M5 4h6',
  pictures: 'M2.5 3.5h11v9h-11z M2.5 10.5l3.5-3.5 3 3 2-2 2.5 2.5 M10.5 6.5h.01',
  status: 'M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M8 14A6 6 0 1 0 8 2',
  strategy: 'M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M8 2v2 M8 12v2 M2 8h2 M12 8h2',
  design: 'M3 13l7.5-7.5 2 2L5 15H3v-2z M9.5 6.5l2-2 M11.5 2.5l2 2',
  agent: 'M8 2v3 M8 11v3 M2 8h3 M11 8h3 M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  automation: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M8 1.5v2 M8 12.5v2 M1.5 8h2 M12.5 8h2 M3.4 3.4l1.4 1.4 M11.2 11.2l1.4 1.4 M12.6 3.4l-1.4 1.4 M4.8 11.2l-1.4 1.4',
  engineering: 'M5.5 3L2.5 8l3 5 M10.5 3l3 5-3 5 M9.2 2.5l-2.4 11',
  brand: 'M2.5 8.5V3h5.5l5.5 5.5-5.5 5.5z M5.5 6h.01',
  software: 'M2.5 3h11v10h-11z M2.5 6h11 M4.8 4.5h.01 M6.8 4.5h.01 M5.5 9l1.5 1.5-1.5 1.5 M8.5 12h2.5',
  enterprise: 'M3 13.5h10 M4 13.5v-10h8v10 M6.5 6h.01 M9.5 6h.01 M6.5 8.5h.01 M9.5 8.5h.01 M7 13.5v-2.5h2v2.5',
  product: 'M8 1.8l6 3.2v6L8 14.2 2 11V5z M2 5l6 3.2 6-3.2 M8 8.2v6',
  document: 'M4 2.5h5.2L12 5.3v8.2H4z M9.2 2.5v2.8H12 M6 7.3h4 M6 9.3h4 M6 11.8c.5-.7 1-.7 1.4 0s.9.7 1.4 0',
  workflow: 'M2.5 4.5h3.5v3H2.5z M10 8.5h3.5v3H10z M6 6h2v4.5h2',
  oversight: 'M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  dashboard: 'M2.5 11a5.5 5.5 0 1 1 11 0 M8 11l2.5-3.5 M8 11h.01',
  field: 'M2.5 11h11 M3.5 11a4.5 4.5 0 0 1 9 0 M8 6.5V4 M6.5 4h3',
  data: 'M8 5.5c3 0 5.5-1 5.5-2S11 1.5 8 1.5 2.5 2.5 2.5 3.5s2.5 2 5.5 2z M2.5 3.5v9c0 1 2.5 2 5.5 2s5.5-1 5.5-2v-9 M2.5 8c0 1 2.5 2 5.5 2s5.5-1 5.5-2',
  identity: 'M2 4h12v8H2z M4.6 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M3 10.6c.3-1 .9-1.5 1.6-1.5s1.3.5 1.6 1.5 M9 6.5h3.5 M9 9h3.5',
  accessibility: 'M8 14.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13z M8 5.2h.01 M5 7l3 .6 3-.6 M8 7.6v2.4l-1.5 2.6 M8 10l1.5 2.6',
  arrow: 'M2.5 8h11 M9.5 4l4 4-4 4',
  check: 'M3 8.5l3.2 3.2L13 5',
  clock: 'M8 14.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13z M8 4.5V8l2.5 1.5',
  mail: 'M2 4h12v8H2z M2 4.5l6 4.5 6-4.5',
  phone: 'M4 2.5h2.5l1.2 3-1.7 1.3a7 7 0 0 0 3.2 3.2l1.3-1.7 3 1.2v2.5a1.5 1.5 0 0 1-1.5 1.5C6.5 13.5 2.5 9.5 2.5 4A1.5 1.5 0 0 1 4 2.5z',
  pin: 'M8 14s-4-3.6-4-7a4 4 0 0 1 8 0c0 3.4-4 7-4 7z M8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  signature: 'M2.5 11.5c1.5-.2 2.4-1.6 3.1-3.6.6-1.7.9-3.8.4-4-.6-.2-1.3 2.2-1.3 5 0 2.2.6 3 1.6 2.6 1-.5 1.6-2 2.3-2 .6 0 .4 1.4 1 1.4.7 0 1-1.4 1.6-1.4.5 0 .6 1 1.3 1h1.5',
  calendar: 'M2.5 4h11v9.5h-11z M2.5 7h11 M5.5 2.5v3 M10.5 2.5v3',
  layers: 'M8 2.5l6 3-6 3-6-3z M2 8.5l6 3 6-3 M2 11.5l6 3 6-3',
} as const;

export type GlyphName = keyof typeof GLYPHS;

/** The path table itself, for a drawing that places a glyph inside its own
 *  SVG (About's orbit, a diagram's node) and cannot nest the component. */
export const GLYPH_PATHS: Readonly<Record<GlyphName, string>> = GLYPHS;

/**
 * THE GLYPH: one in-house icon, 20px unless told otherwise, in the text
 * colour. Decorative by default (`aria-hidden`); a glyph that is the only
 * content of a control gets its name from the control's own label.
 */
export function Glyph({ name, size = 20, className = '' }: { name: GlyphName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`flex-none ${className}`}
    >
      <path d={GLYPHS[name]} />
    </svg>
  );
}

/**
 * THE GLYPH TILE (depth.css, `.glyph-tile`): a 48px rounded tile (40 on a
 * phone) with the soft fill and the hairline edge, holding one glyph.
 * `signal` lights the one tile a block singles out (the open chapter, the
 * first stage); `sm` is the 40px tile at every width.
 */
export function GlyphTile({
  name,
  signal = false,
  sm = false,
  className = '',
}: {
  name: GlyphName;
  signal?: boolean;
  sm?: boolean;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={`glyph-tile${signal ? ' glyph-tile-signal' : ''}${sm ? ' glyph-tile-sm' : ''} ${className}`}>
      <Glyph name={name} size={sm ? 18 : 20} />
    </span>
  );
}

/**
 * THE NUMERAL (depth.css, `.numeral`): the big outline ordinal behind a
 * chapter, hidden from assistive technology (the small ordinal beside the
 * title is the one that is read). The call site places it: the usual corner
 * is `right-(--card-pad) top-(--card-pad)` inside a padded card.
 */
export function Numeral({ n, className = '' }: { n: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`numeral t-numeral ${className}`}>
      {n}
    </span>
  );
}

/**
 * THE FRAME (depth.css, `.frame`): the device frame around a product
 * capture: a 2px bezel, a 24px bar with three dots, the screen beneath. The
 * screen's shape is the call site's (`screenClassName="aspect-[16/10]"`);
 * the capture inside fills it (`absolute inset-0`). `bare` leaves the bar
 * off, for a phone capture, which has no window to show.
 */
export function Frame({
  children,
  className = '',
  screenClassName = '',
  bare = false,
}: {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
  bare?: boolean;
}) {
  return (
    <div className={`frame${bare ? ' frame-bare' : ''} ${className}`}>
      {bare ? null : (
        <div className="frame-bar" aria-hidden="true">
          <span className="frame-dot" />
          <span className="frame-dot" />
          <span className="frame-dot" />
        </div>
      )}
      <div className={`frame-screen ${screenClassName}`}>{children}</div>
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
 * card's meta, `text-ink` on a case cover); the dot keeps its own. The
 * development dot carries a soft ring (globals.css, THE STATUS RING).
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
