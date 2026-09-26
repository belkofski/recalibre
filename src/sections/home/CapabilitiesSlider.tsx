import { ArtImg } from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { Btn } from '@/components/ui';
import { CAPABILITIES } from '@/content/home';
import CapabilityCarousel, { type CapabilityCard } from './CapabilityCarousel';

/* ============================================================================
   HOME 06 — OUR CAPABILITIES, AS PHOTO CARDS ON A WHITE PANEL.

   The owner's decisions of 26 September 2026: this block is one of Home's
   four white panels (`theme-light band-light`, globals.css), and the pinned
   chapter deck gives way to a row of photo cards rebuilt from the reference
   carousel's measurements — one card open, four closed to strips, the same
   proportions, motion and controls. The heading, the lede and the button
   stay above it, no longer pinned. 'Our capabilities.' is still the block's
   first heading, which is what the enquiry form's origin note reads.

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

export default function CapabilitiesSlider() {
  const C = CAPABILITIES;

  const cards: CapabilityCard[] = C.rows.map((row) => ({
    n: row.n.replace('/', ''),
    title: row.title,
    body: row.body,
    category: row.tags.join(' · '),
    demo: 'demo' in row ? row.demo : undefined,
    light: 'art' in row && row.art === 'light',
  }));

  const media = C.rows.map((row) => (
    <ArtImg
      key={row.n}
      src={row.card}
      srcTall={row.cardTall}
      alt={row.alt}
      sizes={SIZES}
      sizesTall={SIZES_TALL}
      lazy
      className="cap-img"
    />
  ));

  /* The black gap under the panel is the next section's own top padding.
     On a phone Process pads 40, not the 45 every other panel gap has, so
     the panel adds the 5. */
  return (
    <section className="pad-x theme-light band-light relative flex w-full flex-col items-center overflow-clip mobile:mb-[5px]">
      <div className="shell flex w-full flex-col gap-[70px] mobile:gap-[40px]">
        <div className="flex w-full justify-end">
          <div className="flex w-[690px] flex-col gap-[50px] narrow:w-full">
            <div className="flex flex-col gap-[30px]">
              <Rise as="h2" id={HEAD_ID} lines={C.headline} className="t-display text-ink" />
              <InView>
                <p className="t-body max-w-[360px] text-ink-2">{C.lede}</p>
              </InView>
            </div>
            <InView>
              <Btn href={C.cta.href} label={C.cta.label} />
            </InView>
          </div>
        </div>

        <CapabilityCarousel cards={cards} media={media} cta={C.cta} labelledBy={HEAD_ID} />
      </div>
    </section>
  );
}
