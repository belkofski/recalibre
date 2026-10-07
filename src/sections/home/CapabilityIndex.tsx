import type { CSSProperties, ReactNode } from 'react';
import { ArtImg } from '@/lib/Img';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import { Frame, GlyphTile, MonoLink, Orbs, SectionHead, type GlyphName } from '@/components/ui';
import { CAPABILITIES } from '@/content/home';
import CapabilityTabs, { type CapabilityRow } from './CapabilityTabs';

/* ============================================================================
   WHAT WE DO — the capability index, dark, as five lit panels.

   The five-card carousel came off on the owner's audit: Home no longer
   explains every capability, it lists them and shows one at a time. The
   white slab that held the list went with the direction change (the owner
   read it as a document, and the site is dark only): the index is five
   surfaces in one seam plate now, the open one wide, the rest folded to a
   glyph, an ordinal and a vertical title (CapabilityTabs.tsx); below 1200
   the same five are a snap rail of cards. The way out is ALL CAPABILITIES,
   never the calibration button (that is the hero's, the stages' and the
   footer's). Ambient light sits behind the plate.

   THE VISUALS ARE DRAWN HERE, on the server, and handed to the client leaf
   as nodes, so the pictures go through the optimiser with the page and the
   only script the section carries is the one that opens a panel. One true
   visual per capability, or none:

     01  the Contraxis system diagram on a dot grid (a schematic, and it
         says so)
     02  the signed OPS daily report, a capture on demonstration data, in
         a device frame
     03  TYPE ONLY: its three tags as glyph rows on a dot grid. No systems
         proof that is not OPS exists, and an honest empty slot beats fake
         proof.
     04  the ABP Continental site's own photograph
     05  the Belkofski cube render

   Each node fills an `absolute inset-0` box of whatever shape the leaf
   gives it (the panel's visual band, the rail card's 16:10 or 4:5), inset
   by `--cap-inset`, which the leaf sets per shape. The capture sits
   left-top in its box so a narrower cut loses the right of the screen,
   never its header, and in the panels it is shown whole on the frame's
   ground (home.css); the photographs take their centre and carry their
   shade in the file, so no veil is laid over them.
   ========================================================================= */

type Row = (typeof CAPABILITIES.rows)[number];

/** The glyph each capability carries, by its anchor on /capabilities: a
 *  drawn mark for the idea the title names, never a logo or a claim. */
const GLYPH: Record<Row['slug'], GlyphName> = {
  'agentic-ai': 'agent',
  'custom-software': 'software',
  'enterprise-systems': 'enterprise',
  'product-design': 'product',
  'brand-identity': 'brand',
};

/** The type plate's three rows, one glyph per tag in the tags' order. */
const PLATE_GLYPHS: readonly GlyphName[] = ['enterprise', 'data', 'workflow'];

/** The dot grid on a visual's ground: a child of the card, under its
 *  content and over its fill (the surface's own background would hide a
 *  grid set on the card itself). */
function Dots() {
  return <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />;
}

/** The visual for one row, filling an `absolute inset-0` box of any shape. */
function Visual({ row }: { row: Row }) {
  if ('figure' in row && row.figure === 'contraxis') {
    /* The diagram picks its own layout from the box it is given (a size
       container), so the panel's landscape band and the rail's upright
       card both draw a diagram that fits. */
    return (
      <>
        <Dots />
        <SystemDiagram preset="card" className="absolute inset-(--cap-inset)" />
      </>
    );
  }
  if ('card' in row && row.card) {
    const sizes = '(min-width: 1200px) 600px, (min-width: 810px) 60vw, 85vw';
    if ('demo' in row && row.demo) {
      /* A capture, in the device frame; the phone cut is served below 810,
         where the frame drops its bar (`bare="mobile"`): a phone-shaped
         capture has no window to show. */
      return (
        <Frame bare="mobile" className="absolute inset-(--cap-inset) flex flex-col" screenClassName="relative min-h-0 flex-1">
          <span className="settle absolute inset-0 block">
            <ArtImg
              src={row.card}
              srcTall={row.cardTall}
              media="(max-width: 809.98px)"
              alt={row.alt}
              sizes={sizes}
              sizesTall="85vw"
              lazy
              className="media-fill object-left-top cap-capture"
            />
          </span>
        </Frame>
      );
    }
    /* A photograph: no frame, no dots, edge to edge. */
    return (
      <span className="settle absolute inset-0 block">
        <ArtImg
          src={row.card}
          srcTall={row.cardTall}
          media="(max-width: 809.98px)"
          alt={'cardAlt' in row && row.cardAlt ? row.cardAlt : row.alt}
          sizes={sizes}
          sizesTall="85vw"
          lazy
          className="media-fill"
        />
      </span>
    );
  }
  /* The type plate. Hidden from a screen reader, as the page's copy is
     (sections/capabilities/TypePlate.tsx): the row's chips already read
     the same three tags, so the plate would read them twice. The rows
     light in order as the panel opens (home.css). */
  return (
    <>
      <Dots />
      <div aria-hidden="true" className="cap-type absolute inset-(--cap-inset) flex flex-col justify-end">
        {row.tags.map((t, i) => (
          <div key={t} className="cap-type-row" style={{ '--i': i } as CSSProperties}>
            <GlyphTile name={PLATE_GLYPHS[i] ?? 'enterprise'} sm />
            <span className="t-card text-ink">{t}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/** The caption the row's visual carries, if any. */
function captionFor(row: Row): string | undefined {
  if ('figure' in row && row.figure === 'contraxis') return DIAGRAM_CAPTION;
  if ('demo' in row && row.demo) return row.demo;
  return undefined;
}

/* WITHOUT SCRIPTS the panels are one column of five open cards. Every
   closed state in home.css is gated on `.js`, which the server writes on
   <html> whether or not scripts arrive, so this block, read only where
   they do not, hands the plate its open shape the way the <noscript> block
   in layout.tsx hands every reveal its finished state. */
const NOSCRIPT =
  '.cap-plate{flex-direction:column;height:auto!important}' +
  '.cap-panel{flex:none!important}' +
  '.cap-visual{aspect-ratio:16/10;flex:none!important;opacity:1!important;scale:none!important;visibility:visible!important}' +
  '.cap-panel-short{display:none!important}' +
  '.cap-panel-words{width:auto!important}' +
  '.cap-panel-copy>*,.cap-type-row{opacity:1!important;translate:none!important}' +
  '.cap-panel-head::after{content:none!important}';

export default function CapabilityIndex() {
  const C = CAPABILITIES;
  /* 'ALL CAPABILITIES' as the two-tone link: the first word dimmed, the
     rest lit, the words the content's own. */
  const [lead, ...rest] = C.cta.label.split(' ');
  const rows: CapabilityRow[] = C.rows.map((row) => ({
    n: row.n,
    slug: row.slug,
    short: row.short,
    title: row.title,
    body: row.body,
    tags: row.tags,
    caption: captionFor(row),
    glyph: GLYPH[row.slug],
  }));
  const visuals: ReactNode[] = C.rows.map((row) => <Visual key={row.slug} row={row} />);

  return (
    <section className="pad-x pad-top relative isolate flex w-full flex-col items-center overflow-clip">
      <Orbs variant="section" />
      <div className="shell relative flex w-full flex-col gap-(--space-row)">
        <SectionHead
          label={C.label}
          lines={C.headline}
          lede={C.lede}
          right={<MonoLink href={C.cta.href} lead={lead} label={rest.join(' ') || C.cta.label} />}
        />
        <CapabilityTabs rows={rows} visuals={visuals} />
        <noscript>
          <style>{NOSCRIPT}</style>
        </noscript>
      </div>
    </section>
  );
}
