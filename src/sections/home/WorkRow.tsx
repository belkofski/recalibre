import { InView } from '@/lib/motion';
import WorkCard from '@/components/WorkCard';
import { WORK } from '@/content/home';

/* ============================================================================
   THE WORK ROW — the three initiatives that are not the flagship, under the
   OPS story and inside the same SELECTED WORK block: OpsStory.tsx prints
   the block's opener, this prints only the grid, one row's space below.

   THE GRID READS ITS OWN LENGTH, as the two-by-two it replaces did: the
   row is `WORK.items` without `WORK.featured`, so an initiative added to
   or taken from content/home.ts changes the shape here without anyone
   editing this file, and nothing is ever repeated to fill a slot.

   THREE ACROSS FROM 1200, two below, one below 600. Three cards in two
   columns leave one alone on its row; that one takes both columns rather
   than leaving a grey slot of the plate beside it. The words sit under
   the art on a tablet (`stackOnTablet`), as they do on the work index.

   ONE REVEAL PER CARD, by column: 0 / 90 / 180ms across the three; on the
   two-column range the third card is in the first column again and starts
   at once; on a phone every card starts at once. The plate itself only
   fades, with the first card, so its grey never stands empty first.
   ========================================================================= */

/** The delay override for each card where its column changes with the
 *  width — written out so every class name is in the source. */
const NARROW_DELAY = ['', 'phone:[--in-delay:0ms]!', 'narrow:[--in-delay:0ms]!'] as const;

export default function WorkRow() {
  const items = WORK.items.filter((item) => item.slug !== WORK.featured);
  const last = items.length - 1;
  const orphan = items.length % 2 === 1;

  return (
    <section className="pad-x relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col pt-(--space-row)">
        <InView mode="picture" className="work-row seam grid w-full grid-cols-3 narrow:grid-cols-2 phone:grid-cols-1">
          {items.map((item, i) => (
            <InView
              key={item.slug}
              step={i % 3}
              className={`${NARROW_DELAY[i % 3]} ${orphan && i === last ? 'narrow:col-span-2 phone:col-span-1' : ''}`}
            >
              <WorkCard item={item} heading="h3" stackOnTablet />
            </InView>
          ))}
        </InView>
      </div>
    </section>
  );
}
