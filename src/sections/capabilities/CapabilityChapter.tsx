import { ArtImg } from '@/lib/Img';
import { InView, Rise } from '@/lib/motion';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import { Caption, cardClass, Chip, Eyebrow } from '@/components/ui';
import { CAPABILITIES } from '@/content/home';
import TypePlate from './TypePlate';
import RelatedWork from './RelatedWork';

/* ============================================================================
   ONE CAPABILITY, AS A CHAPTER.

   Each of the five is a section of its own with the capability's slug as
   its id (Home's index links to /capabilities#slug), on the section
   rhythm: the ordinal as an eyebrow, the title at the section size with
   its line rising, the founder's description at lede size beside it from
   1200 up, the tags, then the one true visual the capability has in a
   card revealed from its foot (the premium picture entrance), and under
   it the initiatives that show the capability in use.

   THE VISUALS are the same five Home's index draws, one per capability or
   none, because the rule is the same: a true picture or an honest slot.

     01  the Contraxis system diagram — a schematic, and its caption says so
     02  the signed OPS daily report, a capture on demonstration data
     03  the type plate: its three tags on the dark ground (TypePlate.tsx)
     04  the ABP Continental site's own photograph
     05  the Belkofski cube render

   The captures sit left-top in their box so a narrower cut loses the right
   of the screen, never its header; the photographs take their centre. 04
   and 05 carry their shade in the file. The diagram is held to 800px wide
   inside the card so its words draw near the size they were set at.
   ========================================================================= */

type Row = (typeof CAPABILITIES.rows)[number];

/** The chapter's visual, filling an `absolute inset-0` box. */
function Visual({ row }: { row: Row }) {
  if ('figure' in row && row.figure === 'contraxis') {
    return <SystemDiagram preset="card" className="absolute inset-(--card-pad) mx-auto max-w-[800px]" />;
  }
  if ('card' in row && row.card) {
    const capture = 'demo' in row && Boolean(row.demo);
    return (
      <span className="settle absolute inset-0 block">
        <ArtImg
          src={row.card}
          srcTall={'cardTall' in row ? row.cardTall : undefined}
          /* The tall crop below 810 only, where the card is a portrait box;
             an upright tablet keeps the wide crop in its landscape card. */
          media="(max-width: 809.98px)"
          alt={'cardAlt' in row && row.cardAlt ? row.cardAlt : row.alt}
          sizes="(min-width: 1200px) 1100px, 100vw"
          sizesTall="100vw"
          lazy
          className={`media-fill ${capture ? 'object-left-top' : ''}`}
        />
      </span>
    );
  }
  return <TypePlate tags={row.tags} />;
}

/** The caption the visual carries, if any: the schematic's note on the
 *  diagram, "Demonstration data." on the capture. */
function captionFor(row: Row): string | undefined {
  if ('figure' in row && row.figure === 'contraxis') return DIAGRAM_CAPTION;
  if ('demo' in row && row.demo) return row.demo;
  return undefined;
}

export default function CapabilityChapter({ row, relatedLabel }: { row: Row; relatedLabel: string }) {
  const titleId = `caps-${row.slug}-title`;
  const caption = captionFor(row);
  return (
    <section
      id={row.slug}
      tabIndex={-1}
      aria-labelledby={titleId}
      className="caps-chapter pad-top flex w-full flex-col gap-(--space-row)"
    >
      {/* The head: ordinal and title at the left, the description and tags
          at the right from 1200 up, the two aligned on the title's foot. */}
      <div className="grid w-full grid-cols-[minmax(0,7fr)_minmax(0,5fr)] items-start gap-x-[40px] gap-y-(--space-lede) narrow:grid-cols-1">
        <div className="flex flex-col gap-(--space-3)">
          <InView>
            <Eyebrow mark className="tabular-nums">
              {row.n}
            </Eyebrow>
          </InView>
          <Rise as="h2" id={titleId} lines={[row.title]} wrap className="t-section text-ink" />
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

      {/* The visual: one card, revealed from its foot while the picture
          inside settles from 1.08; the caption on its hairline beneath.
          Landscape to 810, a portrait box on a phone, where the tall crops
          are served and the diagram turns top to bottom. */}
      <div className="flex w-full flex-col gap-(--space-3)">
        <InView
          mode="clip"
          className={`${cardClass({ radius: 30 })} relative aspect-[16/10] w-full overflow-clip mobile:aspect-[4/5]`}
        >
          <Visual row={row} />
        </InView>
        {caption ? (
          <InView delay={120}>
            <Caption>{caption}</Caption>
          </InView>
        ) : null}
      </div>

      <RelatedWork slugs={row.related} label={relatedLabel} />
    </section>
  );
}
