import { InView } from '@/lib/motion';
import { Orbs, SectionHead } from '@/components/ui';
import WorkCard from '@/components/WorkCard';
import type { Initiative } from '@/content/work';

/* ============================================================================
   MORE WORK — the pair that closes a case study.

   TWO CARDS, NOT EVERY OTHER ONE. The block is a two-column seam plate;
   with four initiatives on the site a plain "all the others" is three cards
   and leaves an orphan in the second row. The page passes the two that
   FOLLOW it in the list, wrapping round the end, so each case points at a
   different pair instead of the same two every time.

   THE CARD IS THE SHARED ONE (components/WorkCard.tsx), as on the index
   and the homepage row, in its landscape cut for a row of two: the art on
   top, the words under it on the surface, the spotlight and the tilt
   under the pointer. The cuts with the foot laid into the file, the
   runtime gradient and the veil over the OPS capture that this block used
   to draw are gone with the layout that laid the words over the picture.
   The summary is not printed here; the block is a way on, not an index.

   NOT "ALSO IN DEVELOPMENT". Two of the four initiatives are in
   development, one is a partner's brand and one was delivered for a client,
   so that label was wrong on most of the pages that used it.
   ========================================================================= */
export default function MoreWork({ items }: { items: readonly Initiative[] }) {
  return (
    <section
      aria-labelledby="more-head"
      className="pad-x pad-top relative isolate flex w-full flex-col items-center overflow-clip"
    >
      <Orbs variant="section" />
      <div className="shell flex w-full flex-col gap-(--space-alone)">
        <SectionHead id="more-head" label="MORE FROM RECALIBRE" lines={['More work.']} />

        {/* One reveal per card, the second column 90ms after the first;
            one column on a phone, where both start at once. The reveal
            wraps the card's own spotlight and tilt, never the other way
            round. */}
        <div className="seam grid w-full grid-cols-2 phone:grid-cols-1">
          {items.map((o, i) => (
            <InView key={o.slug} step={i % 2} className={i % 2 ? 'phone:[--in-delay:0ms]!' : ''}>
              <WorkCard
                art="landscape"
                /* Under the page's h1 and the block's own h2. */
                heading="h3"
                item={{
                  slug: o.slug,
                  name: o.name,
                  status: o.status,
                  /* The state is the meta line's last term; the card
                     prints it as the Status, on a line of its own. */
                  meta: `${o.year} · ${o.category} · ${o.state}`.toUpperCase(),
                  demo: o.demo,
                  tags: o.tags,
                  src: o.cover,
                  srcTall: o.coverTall,
                  srcTallMobileOnly: o.coverTallMobileOnly,
                  alt: o.coverAlt,
                  figure: o.figure,
                  art: o.art,
                  plate: o.plate,
                  mark: o.mark,
                  markTone: o.markTone,
                  tone: o.tone,
                }}
              />
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}
