import type { CSSProperties, ReactNode } from 'react';
import Img from '@/lib/Img';
import { Rise, Scene } from '@/lib/motion';
import SystemDiagram from '@/components/SystemDiagram';
import { Caption, Card, Chip, type GlyphName, Numeral, Orbs } from '@/components/ui';
import { CAPABILITIES } from '@/content/home';
import { CAPABILITIES_PAGE as P } from '@/content/capabilities';
import TypePlate from './TypePlate';
import RelatedWork from './RelatedWork';

/* ============================================================================
   ONE CAPABILITY, AS A CHAPTER.

   Each of the five is a section with the capability's slug as its id
   (Home's index links to /capabilities#slug). Per chapter: the outline
   numeral behind the title, the founder's one sentence, one row of tags,
   one visual, and text links to the work that shows it in use. Nothing
   else: the owner's note on the second pass asked for fewer words.

   THE CHAPTERS ARE NOT FIVE COPIES OF ONE SPLIT. Each has its own shape,
   so the page reads as a sequence rather than a template:

     01  wide    the Contraxis system diagram in its row layout across the
                 column, 21:9 (16:9 on a tablet, square on a phone)
     02  right   the OPS day sheet on a phone, a 3:4 inset beside the words
                 (an inset under them on a phone)
     03  left    the drawn type plate at the left, 4:3, words at the right
     04  wide    the ABP Continental home page across the column, 16:9
     05  right   the Belkofski paddle, a composed square, beside the words

   AND EACH MOVES WITH THE SCROLL (the owner's note: the reader scrolls
   down and the page should answer). The chapter is a `Scene`; its numeral
   drifts against the scroll, its tags arrive one after another, and its
   visual has its own entrance, never the same as its neighbour's: 01
   grows into place, 02 opens from its foot while the screen settles, 03
   slides in from the left, 04 settles from a zoom and steps back as it
   leaves, 05 opens from its foot. The defaults are the finished state
   (styles/scroll.css), so without scripts or with reduced motion every
   chapter simply stands.
   ========================================================================= */

type Row = (typeof CAPABILITIES.rows)[number];
export type CapabilitySlug = Row['slug'];

/** The glyph each capability carries, by slug: in the sticky index and
 *  wherever else the page draws the capability as an object. */
export const CAPABILITY_GLYPH: Readonly<Record<CapabilitySlug, GlyphName>> = {
  'agentic-ai': 'agent',
  'custom-software': 'software',
  'enterprise-systems': 'enterprise',
  'product-design': 'product',
  'brand-identity': 'brand',
};

type Shape = 'wide' | 'right' | 'left';

/** Each chapter's shape and the class its visual box takes for its
 *  entrance (scroll.css), by slug. */
const LAYOUT: Readonly<Record<CapabilitySlug, { shape: Shape; enter: string; inner?: string }>> = {
  'agentic-ai': { shape: 'wide', enter: 'sx-grow' },
  'custom-software': { shape: 'right', enter: 'sx-open', inner: 'sx-zoom' },
  'enterprise-systems': { shape: 'left', enter: 'sx-from-left' },
  'product-design': { shape: 'wide', enter: 'sx-recede', inner: 'sx-zoom' },
  'brand-identity': { shape: 'right', enter: 'sx-open' },
};

/** The dotted ground a drawn visual sits on (01's diagram, 03's plate). */
function Dots() {
  return <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />;
}

function Visual({ row, inner }: { row: Row; inner?: string }): ReactNode {
  if ('figure' in row && row.figure === 'contraxis') {
    return (
      <>
        <Dots />
        <Orbs variant="card" />
        {/* The row layout ('more'): the work card and the case page draw
            the stacked ones, so this page shows the flow in one line. On a
            phone the box runs to the card's edges (the layout keeps its
            own margin), so a 320 window still draws its words at 10px. */}
        <SystemDiagram preset="more" className="absolute inset-(--card-pad) phone:-inset-x-[4px] phone:inset-y-(--space-3)" />
      </>
    );
  }
  const pic = P.pictures[row.slug];
  if (pic) {
    const sizes =
      row.slug === 'product-design' ? '(min-width: 1200px) 1100px, 100vw' : '(min-width: 1200px) 480px, (min-width: 600px) 42vw, 82vw';
    return (
      <span className={`absolute inset-0 block ${inner ?? ''}`}>
        <Img src={pic.src} alt={pic.alt} sizes={sizes} className="media-fill" />
      </span>
    );
  }
  return (
    <>
      <Dots />
      <Orbs variant="card" />
      <TypePlate tags={row.tags} />
    </>
  );
}

export default function CapabilityChapter({ row }: { row: Row }) {
  const titleId = `caps-${row.slug}-title`;
  const digits = row.n.replace('/', '');
  const { shape, enter, inner } = LAYOUT[row.slug];
  const demo = P.pictures[row.slug]?.demo;

  const head = (
    <div className="relative flex flex-col">
      <span aria-hidden="true" className="caps-num sx-drift">
        <Numeral n={digits} className="caps-numeral" />
      </span>
      <Rise as="h2" id={titleId} lines={[row.title]} wrap className="t-section relative text-ink" />
    </div>
  );

  const copy = (
    <div className="relative flex flex-col gap-(--space-4)">
      <p className="t-lede max-w-[520px] text-ink-2">{row.body}</p>
      <div className="sx-stagger flex flex-wrap gap-(--space-1)">
        {row.tags.slice(0, 4).map((t, i) => (
          <span key={t} className="inline-flex" style={{ '--i': i } as CSSProperties}>
            <Chip>{t}</Chip>
          </span>
        ))}
      </div>
    </div>
  );

  /* The visual is a scene of its own: its entrance plays while IT rises
     through the lower half of the window, not while the chapter's title
     does (the visual sits a screen lower in the wide chapters). */
  const visual = (
    <Scene end={0.5} className="caps-vis-col flex flex-col gap-(--space-2)">
      <div className={`caps-vis ${enter}`}>
        <Card radius={30} spot className="absolute inset-0 overflow-clip">
          <Visual row={row} inner={inner} />
        </Card>
      </div>
      {demo ? <Caption>{demo}</Caption> : null}
    </Scene>
  );

  const related = <RelatedWork slugs={row.related} label={P.relatedLabel} />;

  return (
    <section id={row.slug} tabIndex={-1} aria-labelledby={titleId} className="caps-chapter pad-top w-full">
      <Scene end={0.7} className={`caps-ch caps-ch--${shape}`} data-slug={row.slug}>
        {shape === 'wide' ? (
          <>
            <div className="caps-ch-head">
              {head}
              {copy}
            </div>
            {visual}
            {related}
          </>
        ) : (
          <>
            <div className="caps-ch-text">
              {head}
              {copy}
              {related}
            </div>
            {visual}
          </>
        )}
      </Scene>
    </section>
  );
}
