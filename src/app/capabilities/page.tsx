import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageHead from '@/components/PageHead';
import { CAPABILITIES } from '@/content/home';
import { CAPABILITIES_PAGE as P } from '@/content/capabilities';
import CapabilityIndexList from '@/sections/capabilities/CapabilityIndexList';
import CapabilityNav from '@/sections/capabilities/CapabilityNav';
import CapabilityChapter, { CAPABILITY_GLYPH } from '@/sections/capabilities/CapabilityChapter';

/* The share card is the home page's room: this page has no picture of its
   own, and the room is the one that says "the firm". The sentence under it
   is the one the root layout and lib/seo print for the same picture. */
export const metadata: Metadata = pageMeta({
  title: 'Capabilities — five capabilities, one team',
  description: P.lede,
  path: '/capabilities',
  image: '/img/og-home-b.jpg',
  imageAlt: 'A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left.',
});

/* ============================================================================
   THE CAPABILITIES PAGE (the owner's audit, 6 October 2026: "Capabilities
   should be a first-class page … visitors don't have a clean place to
   explore them individually").

     the split opener     the heading with its lede at the left, under the
                          opener's own light; at the right the five
                          chapters as glyph tiles that light and jump
                                           sections/capabilities/CapabilityIndexList
     the index            pinned at the left of the chapters from 1200 up,
                          a glyph per row, lit to the chapter being read;
                          a chip row under the bar below
                                           sections/capabilities/CapabilityNav
     five chapters        one section per capability, its slug as its id,
                          each an object: the numeral behind the title,
                          the one true visual it has on a tilting surface,
                          and the work that shows it in use as tiles
                                           sections/capabilities/CapabilityChapter

   The page ends with its last chapter; the footer carries the final call.
   No calibration button here: that is the hero's, the stages' and the
   footer's. Every word is CAPABILITIES (content/home.ts), the page's own
   frame (content/capabilities.ts) or an initiative's (content/work.ts).

   THE TWO SHAPES SHARE ONE WRAPPER. From 1200 up it is a grid of 240px and
   the rest, so the index's grid area runs the height of all five chapters
   and the sticky has that height to hold in. Below 1200 it is a column
   (a flex container, whose items are constrained by the container and not
   by a grid area), so the chip row can stay under the bar through the
   same five chapters.
   ========================================================================= */
export default function CapabilitiesPage() {
  /* The index is a client component; it takes the glyph by name rather
     than the chapter's map, so the chapter module (the diagram, the
     pictures) is never part of its bundle. */
  const items = CAPABILITIES.rows.map((row) => ({ slug: row.slug, n: row.n, short: row.short, glyph: CAPABILITY_GLYPH[row.slug] }));
  return (
    <>
      <PageHead lines={P.headline} lede={P.lede} aside={<CapabilityIndexList label={P.indexLabel} />} />

      <div className="pad-x relative flex w-full flex-col items-center">
        <div className="shell grid w-full grid-cols-[240px_minmax(0,1fr)] gap-x-[40px] narrow:flex narrow:flex-col">
          <CapabilityNav items={items} label={P.indexLabel} />
          <div className="flex min-w-0 w-full flex-col">
            {CAPABILITIES.rows.map((row) => (
              <CapabilityChapter key={row.slug} row={row} relatedLabel={P.relatedLabel} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
