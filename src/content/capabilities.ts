import type { ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   THE CAPABILITIES PAGE (the owner's audit, 6 October 2026: "Capabilities
   should be a first-class page … visitors don't have a clean place to
   explore them individually").

   The five capabilities themselves, their words, tags, anchors and related
   work, are CAPABILITIES in content/home.ts: one record, read by Home's
   index and by this page. What is here is the page's own frame: its
   heading, its lede (the same sentence Home's block carries), the two
   structural labels it prints, and the picture each chapter shows.

   ONE PICTURE, ONE PLACE (the owner's note on the second pass: the same
   pictures everywhere made the site look careless). Home's capability
   cards carry their own pictures in content/home.ts; this page shows
   different ones, each chosen so no photograph stands on more than three
   pages. Every alt below is the sentence the site already prints for the
   same file elsewhere (the OPS block's, the ABP case study's, the
   Belkofski work card's): no new words.
   ========================================================================= */

export const CAPABILITIES_PAGE = {
  eyebrow: 'CAPABILITIES',
  headline: ['Brief once.'],
  lede: 'One team takes it from brief to production.',
  /** Names the chapter index for a screen reader. */
  indexLabel: 'CAPABILITIES',
  /** Over the links to the initiatives that show a capability in use. */
  relatedLabel: 'IN THE WORK',
  /** Each chapter's picture, by slug. 01 is the Contraxis system diagram
   *  and 03 the drawn type plate, so neither has an entry. */
  pictures: {
    'custom-software': {
      src: '/img/plate-ops-offline.jpg' as ImageSrc,
      alt: 'The OPS day sheet on a phone, offline: the technician’s interventions for the day in Secteur 7, under an offline chip. Demonstration data.',
      /** The honesty note an OPS screen carries, once per block. */
      demo: 'Demonstration data.',
    },
    'product-design': {
      src: '/img/abp-site-home-clean.jpg' as ImageSrc,
      alt: 'The ABP Continental home page: its lead image of steel erection at dusk, two riggers bolting a column with a crawler crane behind them, map coordinates printed in the corner, the headline “Building the infrastructure energy runs on.” across the lower left, and a yellow update plate beside a work-with-us panel.',
    },
    'brand-identity': {
      src: '/img/card-belkofski.jpg' as ImageSrc,
      alt: 'A blue Belkofski paddle and a pair of clear frames on a court, cut by the white line, shot from above.',
    },
  } as Readonly<Record<string, { src: ImageSrc; alt: string; demo?: string }>>,
} as const;
