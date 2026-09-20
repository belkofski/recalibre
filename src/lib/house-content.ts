import type { ImageSrc } from './images.generated';

/* ==========================================================================
   BELKOFSKI — the house Recalibre owns.

   WHAT IS ON RECORD, AND THEREFORE WHAT MAY BE SAID.

   On record, in this project and in _MASTER: Belkofski is an eyewear house
   the founder owns and runs. That is the same fact the partner row carries,
   under the same OUR OWN stamp, and it is the whole of what is written down.

   NOT ON RECORD, AND THEREFORE NOT WRITTEN HERE: what Recalibre specifically
   did for Belkofski, when it did it, what was delivered, what it cost, what
   it changed, or how it performed. None of that exists in any file I can
   check. It is not softened or hedged into the copy below — it is absent.
   The moment the founder writes one sentence saying what the work actually
   was, it belongs here and this note can go.

   THE CAPTIONS DESCRIBE THEIR OWN PICTURE AND NOTHING ELSE. Each one was
   written after opening the file. None of them is a claim about a result.

   THE STAMP IS NOT DECORATION. Showing a company you own without saying so
   is the oldest way a page like this lies, and this site has already been
   killed once by softer claims than that.
   ========================================================================== */

export type Shot = {
  src: ImageSrc;
  alt: string;
  caption: string;
  /** CSS aspect-ratio for the frame, so nothing is cropped into a guess. */
  ratio: string;
  /** Whether the tile runs two rows tall on the asymmetric grid. */
  span?: boolean;
};

export const HOUSE = {
  eyebrow: 'OUR OWN HOUSE',
  headline: 'Belkofski.',
  stamp: 'OUR OWN · NOT A CLIENT',
  lead: [
    'An eyewear house the founder owns and runs.',
    'It is on this page because it is finished, and because',
    'nobody has to give permission for us to show it.',
  ],
  shots: [
    {
      src: '/img/belkofski-cube.jpg',
      alt: 'A render: a machine head above a polished black cube, a molten dark mass spilling down its face, a pair of frames with orange lenses set into it, on a perforated steel bed.',
      caption: 'The cube.',
      ratio: '1129 / 1600',
      span: true,
    },
    {
      src: '/img/belkofski-frames.jpg',
      alt: 'A pair of black Belkofski frames on black, lenses in a deep orange gradient, the name set along the temple arm and again inside the lens.',
      caption: 'Frames, orange lens.',
      ratio: '1 / 1',
    },
    {
      src: '/img/belkofski-shelf.jpg',
      alt: 'A pair of dark frames with red lenses resting on an orange steel shelf, between perforated black panels lit from behind.',
      caption: 'On the shelf.',
      ratio: '1 / 1',
    },
    {
      src: '/img/belkofski-paddle.jpg',
      alt: 'A blue pickleball paddle carrying the Belkofski wordmark, lying on a court line with a white ball beside it and a pair of clear frames with green lenses on its face.',
      caption: 'Court, paddle, frames.',
      ratio: '1127 / 1400',
    },
  ] as readonly Shot[],
  note:
    'What Recalibre did for Belkofski, and when, is not written down anywhere we can check — so it is not claimed here. The pictures are real and the ownership is on record. The rest waits for the founder.',
} as const;
