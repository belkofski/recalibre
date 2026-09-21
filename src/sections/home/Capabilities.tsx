import Img from '@/lib/Img';
import { Rise } from '@/lib/motion';
import { CAPABILITIES as C } from '@/content/home';

/* ============================================================================
   THE FIVE CAPABILITIES — block 06, and the most involved thing on the page.

   MEASURED OFF THE REFERENCE at 1440. This block is a STICKY CARD DECK, not
   a list:

     section header   position: sticky, top 150px, height 242px
     each chapter     position: sticky, top 110px, height 530px
     flow spacing     590px between chapter tops — 530 of card + 60 of gap

   The chapters therefore pin one after another and each new one slides up
   over the last, with the header pinned behind all of them. That is the
   "sticky and split-screen composition" the brief asks to preserve, and it
   is the reason this block measures 3,349px for five cards that are 530px
   tall.

   No z-index is set anywhere: the cards are siblings in document order, so a
   later card paints over an earlier one for free, and the header — which
   comes first — paints under all of them.

   BELOW 810px THE DECK IS RELEASED. Five pinned 530px cards on a phone means
   five screens that each have to be scrolled past twice. The chapters become
   ordinary stacked blocks with auto height, which is what the measured
   geometry becomes when its fixed heights are taken away.

   THE CONTENT IS THE FOUNDER'S OWN. Each chapter carries his description of
   that capability, unedited, and a picture of something that exists. The
   pairing is the honest one rather than the flattering one: the agentic-AI
   chapter gets a drawing, because Contraxis has no publishable screen.
   ========================================================================= */
export default function Capabilities() {
  return (
    <section id="capabilities" aria-labelledby="cap-head" className="w-full pad-top scroll-mt-[60px]">
      <div className="shell pad-x flex w-full flex-col">
        {/* the pinned header */}
        <div className="sticky top-[150px] flex flex-col gap-[16px] narrow:static">
          <p className="t-mono text-ink-3">{C.eyebrow}</p>
          <Rise as="h2" id="cap-head" lines={C.headline} className="t-display max-w-[16ch] text-ink" />
          <p className="t-body-lg max-w-[48ch] text-ink-2">{C.lede}</p>
        </div>

        {/* the deck */}
        <div className="mt-[70px] flex flex-col gap-[60px] mobile:mt-[40px] mobile:gap-[16px]">
          {C.rows.map((row) => (
            <article
              key={row.n}
              aria-labelledby={`cap-${row.n}`}
              className="sticky top-[110px] flex h-[530px] overflow-clip rounded-[24px] border border-rule-2 bg-panel mobile:static mobile:h-auto mobile:flex-col"
            >
              {/* left — the words */}
              <div className="flex min-w-0 flex-1 flex-col p-[36px] mobile:p-[22px]">
                <p className="t-mono-11 text-ink-3">
                  /{row.n}<span className="text-lime">0</span>
                </p>

                <h3 id={`cap-${row.n}`} className="t-card mt-[22px] max-w-[16ch] text-ink">
                  {row.title}.
                </h3>

                <p className="t-body mt-[18px] max-w-[46ch] text-ink-2">{row.body}</p>

                <div className="mt-auto flex flex-wrap gap-[6px] pt-[24px]">
                  {row.tags.map((t) => (
                    <span key={t} className="tag t-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* right — the evidence */}
              <figure className="relative m-0 w-[46%] shrink-0 overflow-clip bg-ground mobile:aspect-[4/3] mobile:w-full">
                <Img
                  src={row.src}
                  alt={row.alt}
                  sizes="(max-width: 809px) 100vw, 640px"
                  className="block h-full w-full object-cover object-left-top"
                />
                <figcaption className="absolute bottom-[14px] left-[14px] rounded-full border border-rule bg-scrim px-[10px] py-[5px] t-mono-9 text-ink-2">
                  {row.caption}
                </figcaption>
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
