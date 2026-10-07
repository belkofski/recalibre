import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import Img from '@/lib/Img';
import { Scene, Spotlight, Tilt } from '@/lib/motion';
import { Chevron, Glyph, GlyphTile, cardClass } from '@/components/ui';
import { CAPABILITIES, WORK, type Initiative } from '@/content/home';
import type { ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   THE WORK ROW — the three initiatives that are not the flagship, under the
   OPS story and inside the same "Selected work." block.

   THREE SIZES, NOT THREE SQUARES (the third pass: "vary the size"). From
   1200 the row is 8 + 4: ABP Continental large at the left, its steel at
   16:10 edge to edge; at the right Belkofski over Contraxis, the cube inset
   in its card, and Contraxis with no picture at all. From 600 to 1199 ABP
   takes the full width and the other two share the row under it; on a
   phone the three stack, the steel edge to edge, the cube inset, Contraxis
   typographic.

   ONE PICTURE, ONE PLACE. ABP is the steel (card-abp.jpg), Belkofski is
   the cube (the paddle and the glasses belong to other pages), and
   Contraxis has no interface to show, so its card is its name at size, a
   glyph tile and a drawn glyph: design, not a screenshot.

   EACH CARD: the name, ONE line (its meta, which already carries the year,
   the field and the state) and the chevron of the link the whole card is.
   No tags, no summary, no status dot: those are for /work.

   WITH THE SCROLL. The section is a scene: the cards come in one after
   another (`.sx-stagger`, on the list), each picture settles inside its
   box from 118% (`.sx-zoom`, on its own layer inside the tilt layer), and
   Contraxis' drawn glyph turns a few degrees through the passage
   (`.sx-turn`). Under the pointer each card lights and leans (Spotlight,
   Tilt); none of the scroll classes sits on an element that tilts.
   ========================================================================= */

type Slot = 'abp-continental' | 'belkofski' | 'contraxis';

/** The picture each slot shows on Home, from the third pass's table. */
const PICTURE: Partial<Record<Slot, { src: ImageSrc; sizes: string }>> = {
  'abp-continental': { src: '/img/card-abp.jpg', sizes: '(max-width: 1199.98px) 100vw, 920px' },
  belkofski: {
    src: '/img/cap-belkofski-cube-wide-d.jpg',
    sizes: '(max-width: 599.98px) 100vw, (max-width: 1199.98px) 50vw, 460px',
  },
};

/** The description each picture carries where it is not the card's own:
 *  the cube's, as content/home.ts writes it for the same file. */
const PICTURE_ALT: Partial<Record<Slot, string>> = {
  belkofski: CAPABILITIES.rows.find((row) => row.slug === 'brand-identity')?.alt,
};

function Words({ item, big = false }: { item: Initiative; big?: boolean }) {
  return (
    <span className="work-tile-words">
      <span className="flex items-start justify-between gap-(--space-3)">
        <h3 className={`${big ? 'work-tile-name-lg' : 't-card'} text-ink`}>{item.name}</h3>
        <span aria-hidden="true" className="dot-btn mt-[6px] flex-none">
          <Chevron />
        </span>
      </span>
      <span className="t-mono text-ink-3">{item.meta}</span>
    </span>
  );
}

function Tile({ item, i, children, className }: { item: Initiative; i: number; children: ReactNode; className: string }) {
  return (
    <li className={`work-slot work-slot--${item.slug}`} style={{ '--i': i } as CSSProperties}>
      <Spotlight>
        <Tilt max={4}>
          <Link
            href={`/work/${item.slug}`}
            className={`${cardClass({ radius: 30, interactive: true, spot: true, tilt: true })} press work-tile ${className}`}
          >
            <span aria-hidden="true" className="spot-light" />
            {children}
          </Link>
        </Tilt>
      </Spotlight>
    </li>
  );
}

function Picture({ slot, item }: { slot: Slot; item: Initiative }) {
  const pic = PICTURE[slot];
  if (!pic) return null;
  return (
    <span className="work-tile-art">
      <span className="tilt-layer absolute -inset-[6%] block">
        <span className="sx-zoom absolute inset-0 block">
          <Img src={pic.src} alt={PICTURE_ALT[slot] ?? item.alt} sizes={pic.sizes} className="media-fill media-zoom" />
        </span>
      </span>
    </span>
  );
}

export default function WorkRow() {
  const by = (slug: Slot) => WORK.items.find((item) => item.slug === slug);
  const abp = by('abp-continental');
  const belk = by('belkofski');
  const cx = by('contraxis');

  return (
    <Scene as="section" end={0.55} className="pad-x relative flex w-full flex-col items-center">
      <div className="shell flex w-full flex-col pt-(--space-row)">
        <ul className="work-row sx-stagger">
          {abp ? (
            <Tile item={abp} i={0} className="work-tile--bleed">
              <Picture slot="abp-continental" item={abp} />
              <Words item={abp} />
            </Tile>
          ) : null}
          {belk ? (
            <Tile item={belk} i={1} className="work-tile--inset">
              <Picture slot="belkofski" item={belk} />
              <Words item={belk} />
            </Tile>
          ) : null}
          {cx ? (
            <Tile item={cx} i={2} className="work-tile--type">
              {/* The drawn side of the card: a glyph tile for the field and
                  the agent glyph in hairline at size, turning with the
                  scroll. Decoration; the words are the content. */}
              <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />
              <span aria-hidden="true" className="work-type-art">
                <GlyphTile name="document" signal />
                <span className="sx-turn work-type-glyph">
                  <Glyph name="agent" size={160} />
                </span>
              </span>
              <Words item={cx} big />
            </Tile>
          ) : null}
        </ul>
      </div>
    </Scene>
  );
}
