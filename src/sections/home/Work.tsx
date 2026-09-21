import Link from 'next/link';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { WORK, type Initiative } from '@/content/home';
import ContraxisDrawing from '@/components/ContraxisDrawing';

/* ============================================================================
   SELECTED WORK — block 05. Measured 2471px, six cards in two rows of three,
   each with a hover border and an image that scales inside its own clip.

   THREE CARDS, NOT SIX. Recalibre has three things it may honestly show, and
   repeating OPS to fill the grid was ruled out. The grid therefore runs one
   row of three at desktop instead of two rows of three, which keeps the card
   width, the gap, the radius, the hover border and the image behaviour
   exactly as measured, and simply stops after the first row.

   THE FOURTH SLOT IS DRAWN, EMPTY, AND LABELLED. A client engagement goes
   there when its scope is documented and its written permission is on file.
   Leaving the slot visible and saying what it is for is more honest than
   quietly making the grid narrower, and it is the one place on the page that
   states what is missing rather than hiding it.

   EVERY CARD PRINTS ITS STATUS. Not "LIVE" — the reference's word for all
   six of its own. Two of these are products in development and one is a
   brand Recalibre owns.
   ========================================================================= */

function Card({ item }: { item: Initiative }) {
  return (
    <Link
      href={`/work/${item.slug}`}
      className="group focus-ring flex min-w-0 flex-col overflow-clip rounded-[24px] border border-rule-2 bg-panel transition-[border-color,background-color] duration-[300ms] ease-hover hover:border-[rgba(255,255,255,0.28)] hover:bg-raised"
    >
      {/* media */}
      <div className="relative aspect-[4/3] w-full overflow-clip bg-ground">
        {item.drawing ? (
          <ContraxisDrawing />
        ) : item.src ? (
          <Img
            src={item.src}
            alt={item.alt}
            sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 440px"
            className="block h-full w-full object-cover object-left-top transition-transform duration-[600ms] ease-hover group-hover:scale-[1.03]"
          />
        ) : null}

        <span className="absolute left-[14px] top-[14px] z-[2] rounded-full border border-rule bg-scrim px-[10px] py-[5px] t-mono-9 text-ink-2">
          {item.status}
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-[14px] p-[22px]">
        <div className="flex items-baseline justify-between gap-[12px]">
          <h3 className="t-card text-ink">{item.name}.</h3>
          <span className="t-mono-9 shrink-0 text-ink-3">{item.year}</span>
        </div>
        <p className="t-small text-ink-2">{item.summary}</p>
        <p className="t-caption mt-auto text-ink-3">{item.caption}</p>
        <div className="flex flex-wrap gap-[6px]">
          {item.tags.map((t) => (
            <span key={t} className="tag t-tag">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function Work() {
  return (
    <section id="work" aria-labelledby="work-head" className="w-full overflow-clip pad-top scroll-mt-[60px]">
      <div className="shell pad-x flex w-full flex-col gap-[40px]">
        <div className="flex items-end justify-between gap-[40px] narrow:flex-col narrow:items-start narrow:gap-[20px]">
          <div className="flex flex-col gap-[16px]">
            <p className="t-mono text-ink-3">{WORK.eyebrow}</p>
            <Rise as="h2" id="work-head" lines={WORK.headline} className="t-display text-ink" />
          </div>
          <p className="t-body-lg max-w-[46ch] text-ink-2">{WORK.lede}</p>
        </div>

        <div className="grid grid-cols-3 gap-[16px] tablet:grid-cols-2 mobile:grid-cols-1">
          {WORK.items.map((item, i) => (
            <InView key={item.slug} className="flex" delay={i * 90}>
              <Card item={item} />
            </InView>
          ))}

          {/* the reserved slot */}
          <InView delay={270} className="flex">
            <div className="flex min-h-[260px] w-full flex-col justify-between rounded-[24px] border border-dashed border-rule-2 p-[22px]">
              <p className="t-mono-9 text-ink-3">{WORK.reserved.label}</p>
              <p className="t-small max-w-[34ch] text-ink-3">{WORK.reserved.note}</p>
            </div>
          </InView>
        </div>
      </div>
    </section>
  );
}
