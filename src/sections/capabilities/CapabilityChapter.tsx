import type { CSSProperties } from 'react';
import { ArtImg } from '@/lib/Img';
import { IMAGE_SIZE } from '@/lib/images.generated';
import { InView, Rise } from '@/lib/motion';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import { Caption, Card, Chip, Eyebrow, Frame, type GlyphName, Numeral, Orbs } from '@/components/ui';
import { CAPABILITIES } from '@/content/home';
import TypePlate from './TypePlate';
import RelatedWork from './RelatedWork';

/* ============================================================================
   ONE CAPABILITY, AS A CHAPTER.

   Each of the five is a section of its own with the capability's slug as
   its id (Home's index links to /capabilities#slug). The direction change
   made every chapter an object rather than a heading with a paragraph and
   a screenshot in a box: the chapter's ordinal stands behind its title as
   an outline numeral, the founder's description sits beside the title at
   lede size with the tags as chips under it, and the one true visual the
   capability has sits on a lit surface that leans toward the pointer and
   is revealed from its foot. Under it, the initiatives that show the
   capability in use, as glyph tiles that light under the pointer.

   THE VISUALS are the same five Home's index draws, one per capability or
   none, because the rule is the same: a true picture or an honest slot.

     01  the Contraxis system diagram on a dotted ground with light behind
         it — a schematic, and its caption says so
     02  the signed OPS daily report, a capture on demonstration data, in a
         device frame sized to the capture and centred on the surface (the
         frame loses its bar on a phone, where the slot serves its phone
         cut and the frame is a phone's shape)
     03  the type plate: its three tags as glyph rows on lit rules over the
         same dotted ground (TypePlate.tsx)
     04  the ABP Continental site's own photograph, edge to edge
     05  the Belkofski cube render, edge to edge

   The photographs lean the other way inside the tilting card (the kit's
   `.tilt-layer`, cut 6% larger than the card so the shift never shows an
   edge); the frame on 02 leans the same way as a whole object. The drawing
   on 01 does not lean inside its card: a diagram is drawn on the surface,
   not laid over it. The diagram is held to 800px wide inside the card so
   its words draw near the size they were set at.
   ========================================================================= */

type Row = (typeof CAPABILITIES.rows)[number];
export type CapabilitySlug = Row['slug'];

/** The glyph each capability carries, by slug: on the opener's tiles, in
 *  the sticky index and wherever else the page draws the capability as an
 *  object. One in-house glyph per capability, standing for the idea the
 *  title already names; never a logo, never a picture. */
export const CAPABILITY_GLYPH: Readonly<Record<CapabilitySlug, GlyphName>> = {
  'agentic-ai': 'agent',
  'custom-software': 'software',
  'enterprise-systems': 'enterprise',
  'product-design': 'product',
  'brand-identity': 'brand',
};

/** The dotted ground a drawn visual sits on (01's diagram, 03's plate).
 *  Drawn on a child rather than on the card: the surface's own fill would
 *  cover a background set on the card itself. Negative z, so it paints over
 *  the surface's ground and under the orbs, the light and the content. */
function Dots() {
  return <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />;
}

/** The chapter's visual, inside the tilting surface card. */
function Visual({ row }: { row: Row }) {
  if ('figure' in row && row.figure === 'contraxis') {
    return (
      <>
        <Dots />
        <Orbs variant="card" />
        <SystemDiagram preset="card" className="absolute inset-(--card-pad) mx-auto max-w-[800px]" />
      </>
    );
  }
  if ('card' in row && row.card) {
    const capture = 'demo' in row && Boolean(row.demo);
    const picture = (
      <span className="settle absolute inset-0 block">
        <ArtImg
          src={row.card}
          srcTall={'cardTall' in row ? row.cardTall : undefined}
          /* The tall crop below 810 only, where the card is a portrait box;
             an upright tablet keeps the wide crop in its landscape card. */
          media="(max-width: 809.98px)"
          alt={'cardAlt' in row && row.cardAlt ? row.cardAlt : row.alt}
          sizes="(min-width: 1200px) 1040px, 100vw"
          sizesTall="100vw"
          lazy
          className="media-fill"
        />
      </span>
    );
    if (capture) {
      /* THE FRAME IS THE CAPTURE'S SIZE. A frame the width of the card
         would hold the report with the frame's black ground at its sides
         (the report is 1.28 wide to 1 tall, the card 1.6), which is a
         screenshot dropped in a box again; a frame that covered the box
         would crop the report's foot, and the report ends in a signature.
         So the box is as tall as the card allows and exactly as wide as
         the capture at that height, centred (`.caps-frame-box`,
         capabilities.css, from the two crops' ratios written here off the
         manifest). The report is shown whole, the frame hugs it, and the
         surface shows around it with its light. A `div`, not a `span`: the
         frame is a block. */
      const wide = IMAGE_SIZE[row.card];
      const tall = 'cardTall' in row && row.cardTall ? IMAGE_SIZE[row.cardTall] : wide;
      const ratios = {
        '--r-wide': (wide.w / wide.h).toFixed(4),
        '--r-tall': (tall.w / tall.h).toFixed(4),
      } as CSSProperties;
      return (
        <div className="tilt-layer caps-frame-box absolute block" style={ratios}>
          <Frame bare="mobile" className="h-full" screenClassName="relative min-h-0 flex-1">
            {picture}
          </Frame>
        </div>
      );
    }
    return <span className="tilt-layer absolute -inset-[6%] block">{picture}</span>;
  }
  return (
    <>
      <Dots />
      <Orbs variant="card" />
      <TypePlate tags={row.tags} />
    </>
  );
}

/** The caption the visual carries, if any: the schematic's note on the
 *  diagram, "Demonstration data." on the capture. The plate and the
 *  photographs carry none. */
function captionFor(row: Row): string | undefined {
  if ('figure' in row && row.figure === 'contraxis') return DIAGRAM_CAPTION;
  if ('demo' in row && row.demo) return row.demo;
  return undefined;
}

export default function CapabilityChapter({ row, relatedLabel }: { row: Row; relatedLabel: string }) {
  const titleId = `caps-${row.slug}-title`;
  const caption = captionFor(row);
  const digits = row.n.replace('/', '');
  return (
    /* The rhythm is set by margins, not one gap: head to visual is the
       section's row space, visual to the related tiles a step more, so the
       tiles read as the chapter's foot rather than a third row of it. */
    <section id={row.slug} tabIndex={-1} aria-labelledby={titleId} className="caps-chapter pad-top flex w-full flex-col">
      {/* The head: the outline numeral behind the ordinal and the title at
          the left, the description and tags at the right from 1200 up. The
          eyebrow and the title are positioned so they paint over the
          numeral, which is placed by the stylesheet (`.caps-numeral`). */}
      <div className="grid w-full grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-x-[40px] gap-y-(--space-lede) narrow:grid-cols-1">
        <div className="relative flex flex-col gap-(--space-3)">
          <Numeral n={digits} className="caps-numeral" />
          <InView className="relative">
            <Eyebrow mark className="tabular-nums">
              {row.n}
            </Eyebrow>
          </InView>
          <Rise as="h2" id={titleId} lines={[row.title]} wrap className="t-section relative text-ink" />
        </div>
        <InView delay={120} className="flex flex-col gap-(--space-4)">
          <p className="t-lede max-w-[520px] text-ink-2">{row.body}</p>
          <div className="flex flex-wrap gap-(--space-1)">
            {row.tags.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </InView>
      </div>

      {/* The visual: a surface card revealed from its foot, lit under the
          pointer and leaning toward it (the card is inside the reveal, as
          the tilt must be). A sheen sweeps it once as it comes in. The
          caption on its hairline beneath. Landscape to 810, a portrait box
          on a phone, where the tall crops are served and the diagram turns
          top to bottom. */}
      <div className="mt-(--space-row) flex w-full flex-col gap-(--space-3)">
        <InView mode="clip" className="caps-visual-box relative aspect-[16/10] w-full mobile:aspect-[4/5]">
          <Card radius={30} spot tilt className="caps-visual absolute inset-0 overflow-clip">
            <span aria-hidden="true" className="sheen" />
            <Visual row={row} />
          </Card>
        </InView>
        {caption ? (
          <InView delay={120}>
            <Caption>{caption}</Caption>
          </InView>
        ) : null}
      </div>

      <RelatedWork slugs={row.related} label={relatedLabel} className="mt-(--space-6)" />
    </section>
  );
}
