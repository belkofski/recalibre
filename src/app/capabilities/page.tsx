import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageHead from '@/components/PageHead';
import { CAPABILITIES } from '@/content/home';
import { CAPABILITIES_PAGE as P } from '@/content/capabilities';
import CapabilityNav from '@/sections/capabilities/CapabilityNav';
import CapabilityChapter, { CAPABILITY_GLYPH } from '@/sections/capabilities/CapabilityChapter';

/* The share card is the home page's room: none of the chapters' pictures
   says "the firm", and the room does. The sentence under it is the one the
   root layout and lib/seo print for the same picture. */
export const metadata: Metadata = pageMeta({
  title: 'Capabilities',
  description: P.lede,
  path: '/capabilities',
  image: '/img/og-home-b.jpg',
  imageAlt: 'A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left.',
});

/* ============================================================================
   THE CAPABILITIES PAGE (the owner's audit, 6 October 2026: "Capabilities
   should be a first-class page … visitors don't have a clean place to
   explore them individually").

     the opener      the heading and its lede (PageHead)
     the index       pinned at the left of the chapters from 1200 up; below
                     1200 a compact bar under the site's bar naming the
                     chapter being read, its five anchors behind a press
                                      sections/capabilities/CapabilityNav
     five chapters   one section per capability, its slug as its id, each
                     its own shape and its own picture, moving with the
                     scroll           sections/capabilities/CapabilityChapter

   WHAT CAME OFF in the third pass (the owner's note: fewer words, no
   sideways strips, no picture twice): the opener's list of the five
   titles, which repeated the chapters' own headings; the chip row that
   scrolled sideways below 1200; each chapter's ordinal label, its
   schematic caption and the pictures and status lines on its related
   tiles.

   The page ends with its last chapter; the footer carries the final call.
   Every word is CAPABILITIES (content/home.ts), the page's own frame
   (content/capabilities.ts) or an initiative's (content/work.ts).

   THE TWO SHAPES SHARE ONE WRAPPER. From 1200 up it is a grid of 240px and
   the rest, so the index's grid area runs the height of all five chapters
   and the sticky has that height to hold in. Below 1200 it is a column, so
   the compact bar can stay under the site's bar through the same five.
   ========================================================================= */
export default function CapabilitiesPage() {
  /* The index is a client component; it takes the glyph by name rather
     than the chapter's map, so the chapter module (the diagram, the
     pictures) is never part of its bundle. */
  const items = CAPABILITIES.rows.map((row) => ({
    slug: row.slug,
    n: row.n,
    short: row.short,
    glyph: CAPABILITY_GLYPH[row.slug],
  }));
  return (
    <>
      <PageHead lines={P.headline} lede={P.lede} />

      <div className="pad-x relative flex w-full flex-col items-center">
        <div className="shell grid w-full grid-cols-[200px_minmax(0,1fr)] gap-x-[48px] narrow:flex narrow:flex-col">
          <CapabilityNav items={items} label={P.indexLabel} />
          <div className="flex min-w-0 w-full flex-col">
            {CAPABILITIES.rows.map((row) => (
              <CapabilityChapter key={row.slug} row={row} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
