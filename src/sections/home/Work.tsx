import { Rise, InView } from '@/lib/motion';
import WorkCard from '@/components/WorkCard';
import { WORK } from '@/content/home';

/* ============================================================================
   SELECTED WORK.

   The reference runs six square CMS cards across a two-column seam plate at
   687px. The plate, the 2px seam, the 30px card radius and the hover are
   kept exactly.

   THE GRID READS ITS OWN LENGTH. An even number of initiatives is the
   reference's shape exactly: squares, two across, nothing else. An odd
   number would leave one slot empty, so the last card takes the full width
   of its row instead — never a project repeated to fill a gap. Adding or
   removing an initiative in content/home.ts changes the shape here without
   anyone editing this file, which is how the two grids drifted apart the
   first time.

   TWO ACROSS FROM 600 (30 September 2026), as the brief asks: one
   column only below 600. From 600 to 809 the words sit under each square
   rather than over it (see components/WorkCard); a square of 277 to 382px
   under its words drew the diagram too small to read and the OPS screen
   under its veil.

   The card itself lives in components/WorkCard, because the work index
   renders the same initiatives and the two grids had already drifted:
   this one was rebuilt to fill its frame and that one was not.
   ========================================================================= */

export default function Work() {
  const items = WORK.items;
  const last = items.length - 1;
  /** True where the count is odd and the final card has no partner. */
  const orphan = items.length % 2 === 1;
  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-alone)">
        <div className="flex w-full justify-end">
          <div className="flex w-[690px] flex-col gap-(--space-lede) narrow:w-full">
            <Rise as="h2" lines={WORK.headline} className="t-display text-ink" />
            <InView>
              <p className="t-body max-w-[360px] text-ink-2">{WORK.lede}</p>
            </InView>
          </div>
        </div>

        {/* ONE REVEAL PER CARD (28 September 2026), by column: the left
            square at once, the right 90ms after it, the wide last card at
            once. One column below 600, where every card starts at once.
            The plate itself only fades (no travel), with the first card,
            so its grey never stands empty before the cards arrive. */}
        <InView mode="picture" className="seam grid w-full grid-cols-2 phone:grid-cols-1">
          {items.map((item, i) => {
            const wide = orphan && i === last;
            return wide ? (
              <InView key={item.slug} className="col-span-2 phone:col-span-1">
                <WorkCard item={item} wide />
              </InView>
            ) : (
              <InView key={item.slug} step={i % 2} className="phone:[--in-delay:0ms]!">
                <WorkCard item={item} />
              </InView>
            );
          })}
        </InView>
      </div>
    </section>
  );
}
