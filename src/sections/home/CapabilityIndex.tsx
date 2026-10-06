import { Fragment, type ReactNode } from 'react';
import { ArtImg } from '@/lib/Img';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import { MonoLink, SectionHead, TickRule } from '@/components/ui';
import { CAPABILITIES } from '@/content/home';
import CapabilityTabs, { type CapabilityTab } from './CapabilityTabs';

/* ============================================================================
   WHAT WE DO — the capability index, on a white panel.

   The five-card carousel came off on the owner's audit: Home no longer
   explains every capability, it lists them and shows one at a time. The
   rows are an index, the card beside them is the one picture the open row
   earns, and the way out is ALL CAPABILITIES, never the calibration button
   (that is the hero's, the stages' and the footer's).

   THE VISUALS ARE DRAWN HERE, on the server, and handed to the client leaf
   as nodes, so the pictures go through the optimiser with the page and the
   only script the section carries is the one that opens a row
   (CapabilityTabs.tsx). One true visual per capability, or none:

     01  the Contraxis system diagram (a schematic, and it says so)
     02  the signed OPS daily report, a capture on demonstration data
     03  TYPE ONLY: its three tags at card size on the dark ground, with the
         tick rule between them. No systems proof that is not OPS exists,
         and an honest empty slot beats fake proof.
     04  the ABP Continental site's own photograph
     05  the Belkofski cube render

   The captures (02) sit left-top in their box so a narrower cut loses the
   right of the screen, never its header; the photographs take their
   centre. 04 and 05 carry their shade in the file and need no veil; the
   foot that reads over them sits on the card's own ground anyway.
   ========================================================================= */

type Row = (typeof CAPABILITIES.rows)[number];

/** The visual for one row, filling an `absolute inset-0` box of any shape:
 *  the pinned 4:5 card from 1200 up, the row's own 4:3 box below. */
function Visual({ row }: { row: Row }) {
  if ('figure' in row && row.figure === 'contraxis') {
    /* The diagram picks its own layout from the box it is given (a size
       container), so the portrait card and the landscape row both draw a
       diagram that fits. */
    return <SystemDiagram preset="card" className="absolute inset-(--card-pad)" />;
  }
  if ('card' in row && row.card) {
    const capture = 'demo' in row && Boolean(row.demo);
    return (
      <div className="settle absolute inset-0">
        <ArtImg
          src={row.card}
          alt={'cardAlt' in row && row.cardAlt ? row.cardAlt : row.alt}
          sizes="(min-width: 1200px) 670px, 100vw"
          lazy
          className={`media-fill ${capture ? 'object-left-top' : ''}`}
        />
      </div>
    );
  }
  /* The type plate. Hidden from a screen reader, as the page's copy is
     (sections/capabilities/TypePlate.tsx): the row's chips already read
     the same three tags, so the plate would read them twice. */
  return (
    <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-end gap-(--space-4) p-(--card-pad)">
      {row.tags.map((t, i) => (
        <Fragment key={t}>
          {i > 0 ? <TickRule /> : null}
          <p className="t-card text-ink">{t}</p>
        </Fragment>
      ))}
    </div>
  );
}

/** The caption the row's visual carries, if any. */
function captionFor(row: Row): string | undefined {
  if ('figure' in row && row.figure === 'contraxis') return DIAGRAM_CAPTION;
  if ('demo' in row && row.demo) return row.demo;
  return undefined;
}

export default function CapabilityIndex() {
  const C = CAPABILITIES;
  /* 'ALL CAPABILITIES' as the two-tone link: the first word dimmed, the
     rest lit, the words the content's own. */
  const [lead, ...rest] = C.cta.label.split(' ');
  const rows: CapabilityTab[] = C.rows.map((row) => ({
    n: row.n,
    slug: row.slug,
    short: row.short,
    title: row.title,
    body: row.body,
    tags: row.tags,
    caption: captionFor(row),
  }));
  const visuals: ReactNode[] = C.rows.map((row) => <Visual key={row.slug} row={row} />);

  return (
    <section className="theme-light band-light pad-x relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-row)">
        <SectionHead
          label={C.label}
          lines={C.headline}
          lede={C.lede}
          right={<MonoLink href={C.cta.href} lead={lead} label={rest.join(' ') || C.cta.label} />}
        />
        <CapabilityTabs rows={rows} visuals={visuals} />
      </div>
    </section>
  );
}
