import { ArtImg } from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import SystemDiagram from '@/components/SystemDiagram';
import { CAPABILITIES } from '@/content/home';
import CapabilityCarousel, { type CapabilityCard } from './CapabilityCarousel';

/* ============================================================================
   HOME 06 — OUR CAPABILITIES, AS PHOTO CARDS ON A WHITE PANEL.

   The owner's decisions of 26 September 2026: this block is one of Home's
   four white panels (`theme-light band-light`, globals.css), and the pinned
   chapter deck gives way to a row of photo cards rebuilt from the reference
   carousel's measurements — one card open, four closed to strips, the same
   proportions, motion and controls. The heading and the lede stay above
   it, no longer pinned, in the left column since 28 September 2026: Work
   above and OPS below head on the right. 'Our capabilities.' is still the
   block's first heading, which is what the enquiry form's origin note
   reads.

   HOME ONLY. /about keeps the chapter deck (sections/home/Capabilities.tsx)
   on the dark page exactly as it was, so this is a second component over
   the same content, not a change to the first.

   Every word on the cards is the content's own: the row's number, its tags
   joined into the category line, its name, its text, the block's call to
   action, and the OPS card's "Demonstration data." Each open card is one
   link to the block's own destination, /contact.

   The pictures are drawn here, on the server, and handed to the carousel:
   a wide crop for the open card, a tall one for a phone and an upright
   tablet (scripts/plates.py, `cap-*`). `sizes` is the width each is drawn
   at: the open card is 948 wide at 1440, and a picture covers its card, so
   on a tablet's shorter, narrower card the wide crop is drawn about 820 to
   860 wide by the card's height. The tall crop is drawn about 300 wide on
   a phone and up to about 550 on an upright tablet.
   ========================================================================= */

const HEAD_ID = 'capabilities-head';
const SIZES = '(max-width: 1199.98px) 860px, 948px';
const SIZES_TALL = '(max-width: 809.98px) calc(100vw - 80px), 560px';
/* A PICTURE WITH ITS SHADE IN THE FILE TAKES ITS TALL CUT ON A PHONE ONLY
   (30 September 2026; cards 04 and 05, `shadeInPlate`). A shade laid into
   a file holds only where every row of the file shows. The wide cut
   (1.277) shows every row in any open card up to its own shape, which is
   every card from 600 up, portrait tablets included; the tall one (0.399)
   only in a phone's card, narrower still. From 600 to 809, and on an
   upright tablet, the tall cut was drawn wider than itself, which cut off
   the top of its shade (the category line on card 05 read 2.11:1 at 600)
   and enlarged it 1.7 to 2.4 times on a 2x screen; the wide cut is drawn
   1.4 to 1.9 times there, every row shown. The captures (card 02) keep
   the default: their shade is the card's, sized in pixels. */
const PHONE_ONLY = '(max-width: 599.98px)';

export default function CapabilitiesSlider() {
  const C = CAPABILITIES;

  const cards: CapabilityCard[] = C.rows.map((row) => ({
    n: row.n.replace('/', ''),
    title: row.title,
    body: row.body,
    category: row.tags.join(' · '),
    demo: 'demo' in row ? row.demo : undefined,
    light: 'art' in row && row.art === 'light',
    shadeInPlate: 'shadeInPlate' in row && row.shadeInPlate,
  }));

  /* ONE TRUE PICTURE PER CARD, OR NONE (the owner's Phase A brief, 27
     September 2026, section 16). Card 01 draws the Contraxis system diagram
     in the upper part of the card, above the words; card 03 draws nothing
     and its words sit on the card's own ground; the others carry a capture
     or a render cut for the card (scripts/plates.py).

     THE DIAGRAM ENDS ABOVE THE WORDS. With the name at card size and the
     text at body size (28 September 2026) the words stand about 330px
     tall from the card's foot on a laptop and a tablet (370 on a 390
     phone), so the diagram's box stops 352 (384 on a phone) above the
     foot, 16px clear of them; it scales down into the box it has.

     ON A LAPTOP THE BOX IS TALLER (28 September 2026). The 352 counted the
     foot's 40px of padding as words, and at 1440 x 900 it left a 296px
     box, under the 315 the step labels need (`.sd-card-ml`). Measured to
     the name itself, the words start 292px above the foot at 1440 and
     1920, 263 at 1280 and 262 at 1200; from 1200 up the box stops 320
     above the foot (28 clear) and starts 72 down (17 under the tag line):
     350 tall at 1440 x 900, so the labels show. At 1280 x 800 the card is
     638 tall and the box 246, which draws the 'm' diagram. Tablet and
     phone keep their boxes. */
  const media = C.rows.map((row) =>
    'figure' in row && row.figure === 'contraxis' ? (
      <SystemDiagram
        key={row.n}
        preset="card"
        className="absolute inset-x-[40px] bottom-[320px] top-[72px] tablet:bottom-[352px] tablet:top-[90px] mobile:inset-x-[20px] mobile:bottom-[384px] mobile:top-[70px]"
      />
    ) : 'card' in row && row.src ? (
      <ArtImg
        key={row.n}
        src={row.card}
        srcTall={row.cardTall}
        media={'shadeInPlate' in row && row.shadeInPlate ? PHONE_ONLY : undefined}
        alt={'cardAlt' in row ? row.cardAlt : row.alt}
        sizes={SIZES}
        sizesTall={SIZES_TALL}
        lazy
        className="cap-img"
      />
    ) : null,
  );

  /* The black gap under the panel is the next section's own top padding
     (`--space-section`), at every width. */
  return (
    <section className="pad-x theme-light band-light relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-alone)">
        <div className="flex w-full">
          {/* NO BUTTON UNDER THE LEDE (the owner's Phase A brief, 27
              September 2026): "Start a calibration" stood here, above the
              cards it should conclude, as the third of six on the page. */}
          <div className="flex w-[690px] flex-col gap-(--space-lede) narrow:w-full">
            <Rise as="h2" id={HEAD_ID} lines={C.headline} className="t-display text-ink" />
            <InView>
              <p className="t-body max-w-[360px] text-ink-2">{C.lede}</p>
            </InView>
          </div>
        </div>

        <CapabilityCarousel cards={cards} media={media} cta={C.cta} labelledBy={HEAD_ID} />
      </div>
    </section>
  );
}
