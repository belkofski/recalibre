import type { CSSProperties } from 'react';
import Link from 'next/link';
import { InView, Spotlight, Ticker } from '@/lib/motion';
import { Card, cardClass, Chevron, LabelRow } from '@/components/ui';
import { MARKS } from '@/content/site';
import { BAND } from '@/content/home';
import { INITIATIVES } from '@/content/work';

/* ============================================================================
   THE PARTNERS — a ticker of marks under the hero.

   The reference closes its hero slab with a label row and a marquee of
   client logos. The marquee went on 27 September 2026 (P0-8: five marks
   run three times over, moving without being asked), the typed-names row
   that held the place went on 28 September 2026 for a register of five
   rows on hairlines, and the register went with the direction change: the
   owner read it as a list in a document, which is what it was.

   ONE TILE PER PARTNER. A surface (depth.css) 96px tall, at least 220
   wide, carrying the relationship as its eyebrow and the mark centred
   under it: Belkofski, Dorwa and Hostino as their own logo files, drawn
   through `mask-image` in the text colour at 70% (100% as the tile
   lights); ABP Continental and Saidis as their names in the site's own
   lettering, because MARKS gives them no file and a logo that does not
   exist is not drawn. Alphabetical, as MARKS is, so the order claims
   nothing. No index number: it would count site content. The context
   sentence the register opened under a row is not printed here; the case
   page carries it.

   THE TWO WITH WORK ON THE SITE ARE LINKS: the whole tile goes to the case
   (SEE THE WORK, named for a voice user), it lights under the pointer, its
   dot fills and it presses. The three that open nothing are plain
   surfaces with no hover ground: a tile that goes nowhere must not invite
   a press, so only the mark brightens as the pointer passes.

   THE TICKER (lib/motion.tsx) draws the five once and once again, the
   copy inert and hidden from assistive technology, so the two links are
   reached once by the keyboard and the loop is seamless. It runs at 48
   pixels a second, pauses under the pointer and while anything inside has
   focus, and stands still under reduced motion, where the row scrolls by
   hand. On a phone nothing lights as it passes (`touch={false}`): a moving
   tile must never flicker. Without scripts the loop is the stylesheet's.

   The band sits on the numeric scale since the owner's audit (6 October
   2026): one token above the label (`--space-5`, 32), the row rhythm
   between the label and the ticker (40 / 40 / 24) and `--space-6` (48)
   under it, where the slab's rounded foot meets the page's black. The
   label row draws its own rule as it arrives (LabelRow); the ticker fades
   up after it.
   ========================================================================= */

/** The two words the eyebrow prints, and the link's name: the run
 *  prompt's own words (§3.8). */
const PARTNER = 'PARTNER';
const CLIENT = 'CLIENT';
const SEE_THE_WORK = 'SEE THE WORK';

/**
 * Each logo file's own ink, measured from the file (scratch/register,
 * mark-geo.json), at its drawn size: `w` x `h` is the box on the page,
 * `size` and `pos` place the whole file behind it so only the ink shows.
 * Belkofski's wordmark sits inside a wider SVG canvas; Dorwa's and
 * Hostino's files are their ink. A file not listed here is not a logo (the
 * typed names), and the tile sets the name instead.
 */
const MARK_GEOMETRY: Record<string, { w: number; h: number; size: string; pos: string; nudge?: boolean }> = {
  '/img/partner-belkofski.svg': { w: 162.43, h: 22, size: '285.71px 66.07px', pos: '-61.57px -22px' },
  '/img/partner-dorwa.png': { w: 65.29, h: 30, size: '65.29px 30px', pos: '0 0' },
  '/img/partner-hostino.png': { w: 96.59, h: 30, size: '96.59px 30px', pos: '0 0', nudge: true },
};

function Mark({ src }: { src: string | null }) {
  const g = src ? MARK_GEOMETRY[src] : undefined;
  if (!src || !g) return null;
  const image = `url(${src})`;
  const style: CSSProperties = {
    width: g.w,
    height: g.h,
    maskImage: image,
    WebkitMaskImage: image,
    maskSize: g.size,
    WebkitMaskSize: g.size,
    maskPosition: g.pos,
    WebkitMaskPosition: g.pos,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  };
  return (
    <span
      aria-hidden="true"
      className={`block flex-none bg-current forced-colors:bg-[CanvasText] ${g.nudge ? 'translate-y-[2px]' : ''}`}
      style={style}
    />
  );
}

type TileProps = { name: string; src: string | null; relation: string; href: string | null };

/** One tile: the eyebrow row, then the mark centred in the rest of the
 *  surface (`.mark-tile`, home.css). A link where the case is on the
 *  site, a plain surface where it is not. */
function Tile({ name, src, relation, href }: TileProps) {
  const eyebrow = (
    <span className="flex items-center justify-between gap-(--space-3)">
      <span className="t-mono text-ink-3">{relation}</span>
      {href ? (
        <span className="dot-btn">
          <Chevron />
        </span>
      ) : null}
    </span>
  );
  /* The logo files are hidden from assistive technology (a mask has no
     text), so the name is set beside them for the reader who cannot see
     it; the typed names are already the name. */
  const mark = (
    <span className="flex items-center justify-center whitespace-nowrap text-ink/70 transition-colors duration-300 ease-hover group-hover:text-ink group-focus-visible:text-ink">
      {src ? (
        <>
          <Mark src={src} />
          <span className="sr-only">{name}</span>
        </>
      ) : (
        <span className="t-mark-lg text-ink">{name}</span>
      )}
    </span>
  );

  if (href) {
    return (
      <Spotlight touch={false}>
        <Link
          href={href}
          aria-label={`${SEE_THE_WORK}: ${name}`}
          className={`${cardClass({ radius: 24, interactive: true, surface: true, spot: true })} press mark-tile`}
        >
          <span aria-hidden="true" className="spot-light" />
          {eyebrow}
          {mark}
        </Link>
      </Spotlight>
    );
  }
  return (
    <Card radius={24} className="mark-tile group">
      {eyebrow}
      {mark}
    </Card>
  );
}

export default function MarkRow() {
  const tiles: TileProps[] = MARKS.map((m) => {
    const work = INITIATIVES.find((w) => w.name === m.name);
    return {
      name: m.name,
      src: 'src' in m ? m.src : null,
      relation: work?.status.startsWith(CLIENT) ? `${PARTNER} · ${CLIENT}` : PARTNER,
      href: work ? `/work/${work.slug}` : null,
    };
  });

  return (
    <section
      aria-label="Partners"
      className="pad-x relative flex w-full flex-col items-center overflow-clip rounded-b-[30px] bg-raised pb-(--space-6) pt-(--space-5) mobile:rounded-b-[20px]"
    >
      <div className="shell flex w-full flex-col gap-(--space-row)">
        <LabelRow label={BAND.label} />
        {/* The ticker runs to the window's edges, past the shell's gutter,
            and fades out at each end through its own mask. */}
        <InView className="-mx-(--gutter)">
          <Ticker speed={48} className="mark-ticker">
            {tiles.map((t) => (
              <Tile key={t.name} {...t} />
            ))}
          </Ticker>
        </InView>
      </div>
    </section>
  );
}
