import { ArtImg } from '@/lib/Img';
import SystemDiagram from '@/components/SystemDiagram';
import { Rise, InView } from '@/lib/motion';
import { Caption, Chip } from '@/components/ui';
import { CAPABILITIES } from '@/content/home';

/* ============================================================================
   THE CAPABILITY CHAPTERS — the reference's sticky deck.

   The header pins at top:120 and each chapter at top:112, on its own
   #050505 ground, so one chapter rides up over the last as you scroll.
   There is no z-index: DOM order does the painting, exactly as the
   reference leaves it. No chapter has a floor since 28 September 2026 (it
   stood at 530); its content sets its height.

   THE DECK IS A GRID OF EQUAL ROWS, not a column. Each chapter pins over
   the last, so one taller chapter showed its bottom strip — its own last
   tag — under the shorter one pinned on top of it. `auto-rows-fr` gives
   every chapter the tallest one's height. A grid item still pins against
   the whole deck, as the column's items did.

   Below 1200px the pinning is dropped and the chapters stack, which is what
   the reference does at its own two narrow breakpoints. They go back to the
   rule-row's own `relative` there. A window under 680px tall does the same
   (the `short` variant in globals.css).

   NO DOT FIELD (28 September 2026): the 9 x 5 grid of dots beside each
   chapter's number was decoration and is gone with the site's other
   rulers and grids; the left column holds the number alone. Each chapter
   fades up as it arrives (it IS its `InView`: a wrapper would stop it
   pinning), and its picture fades and settles from 1.06. Chapter 02's
   still takes a phone cut below 810, the day's detail and the signature
   readable at 350px.

   NO BUTTON (28 September 2026): the deck is not the door. The page's ways
   in are the opener's link and card 01 of the stages below.
   ========================================================================= */

export default function Capabilities() {
  const C = CAPABILITIES;
  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-alone)">
        {/* The header pins while the deck runs under it. */}
        <div className="sticky top-[120px] flex w-full justify-end narrow:static">
          <div className="flex w-[690px] flex-col gap-(--space-lede) narrow:w-full">
            <Rise as="h2" lines={C.headline} className="t-display text-ink" />
            <InView>
              <p className="t-body max-w-[360px] text-ink-2">{C.lede}</p>
            </InView>
          </div>
        </div>

        <div className="grid w-full auto-rows-fr gap-[64px] narrow:flex narrow:flex-col mobile:gap-[24px]">
          {C.rows.map((row) => (
            <InView
              as="article"
              key={row.n}
              className="rule-row sticky top-[112px] grid w-full grid-cols-2 overflow-clip bg-ground pt-[64px] short:relative short:top-0 narrow:relative narrow:top-0 mobile:grid-cols-1 narrow:gap-[32px] narrow:pb-[40px] mobile:pt-[32px]"
            >
              <div className="flex items-start">
                {/* The chapter's number as a label, not a 64px numeral that
                    counts chapters (28 September 2026). */}
                <p className="t-mono-11 tabular-nums text-ink-3">{row.n.replace('/', '')}</p>
              </div>

              <div className="flex flex-col gap-[32px]">
                <div className="flex flex-col gap-[16px]">
                  <h3 className="t-card text-ink">{row.title}</h3>
                  <p className="t-body max-w-[420px] text-ink-2">{row.body}</p>
                </div>
                {/* One true picture per chapter, or none (27 September 2026,
                    the owner's Phase A brief, section 16): the diagram for
                    01, a capture or a render for 02, 04 and 05, nothing
                    for 03 until a systems proof that is not OPS exists. */}
                {'figure' in row && row.figure === 'contraxis' ? (
                  <div className="card-24 relative aspect-[418/278] w-[418px] max-w-full shrink-0 overflow-clip">
                    <SystemDiagram preset="card" className="absolute inset-[14px]" />
                  </div>
                ) : row.src ? (
                  /* The picture and, where the row carries one, its caption
                     on its hairline under it, as the Home card prints it
                     ("Demonstration data." on /02; 28 September 2026). */
                  <div className="flex w-[418px] max-w-full shrink-0 flex-col gap-[12px]">
                    <InView
                      mode="picture"
                      className="relative aspect-[418/278] w-full shrink-0 overflow-clip rounded-[24px] mobile:rounded-[20px]"
                    >
                      <div className="settle absolute inset-0">
                        <ArtImg
                          src={row.src}
                          srcTall={'stillTall' in row ? row.stillTall : undefined}
                          media="(max-width: 809.98px)"
                          alt={row.alt}
                          sizes="(max-width: 809px) 100vw, 418px"
                          sizesTall="calc(100vw - 40px)"
                          lazy
                          className="media-fill"
                        />
                      </div>
                    </InView>
                    {'demo' in row && row.demo ? (
                      <Caption>{row.demo}</Caption>
                    ) : null}
                  </div>
                ) : null}
                <div className="flex flex-wrap items-center gap-[8px]">
                  {row.tags.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}
