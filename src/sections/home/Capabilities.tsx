import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { Btn, Chip, DotGrid } from '@/components/ui';
import { CAPABILITIES } from '@/content/home';

/* ============================================================================
   THE CAPABILITY CHAPTERS — the reference's sticky deck, measured.

   The header pins at top:150. Each chapter pins at top:110, stands 530px
   tall on its own #050505 ground, and is spaced 590px apart in flow, so one
   chapter rides up over the last as you scroll. There is no z-index: DOM
   order does the painting, exactly as the reference leaves it.

   Below 1200px the pinning is dropped and the chapters stack, which is what
   the reference does at its own two narrow breakpoints.
   ========================================================================= */

export default function Capabilities() {
  const C = CAPABILITIES;
  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-[70px] mobile:gap-[40px]">
        {/* The header pins while the deck runs under it. */}
        <div className="sticky top-[150px] flex w-full justify-end narrow:static">
          <div className="flex w-[690px] flex-col gap-[50px] narrow:w-full">
            <div className="flex flex-col gap-[30px]">
              <Rise as="h2" lines={C.headline} className="t-display text-ink" />
              <InView>
                <p className="t-body max-w-[360px] text-ink-2">{C.lede}</p>
              </InView>
            </div>
            <InView>
              <Btn href={C.cta.href} label={C.cta.label} />
            </InView>
          </div>
        </div>

        <div className="flex w-full flex-col gap-[60px] mobile:gap-[24px]">
          {C.rows.map((row) => (
            <article
              key={row.n}
              className="rule-row sticky top-[110px] grid h-[530px] w-full grid-cols-2 overflow-clip bg-ground pt-[60px] narrow:static narrow:h-auto narrow:grid-cols-1 narrow:gap-[30px] narrow:pb-[40px] mobile:pt-[30px]"
            >
              <div className="flex items-start gap-[40px]">
                <p className="t-figure text-ink">{row.n}</p>
                <DotGrid cols={9} rows={5} className="mt-[14px] mobile:hidden" />
              </div>

              <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[14px]">
                  <h3 className="t-card text-ink">{row.title}</h3>
                  <p className="t-small max-w-[420px] text-ink-2">{row.body}</p>
                </div>
                <div className="relative aspect-[418/278] w-[418px] max-w-full shrink-0 overflow-clip rounded-[16px]">
                  <Img
                    src={row.src}
                    alt={row.alt}
                    sizes="(max-width: 809px) 100vw, 418px"
                    className="media-fill"
                  />
                  <span className="grain absolute inset-0" aria-hidden="true" />
                </div>
                <div className="flex flex-wrap items-center gap-[8px]">
                  {row.tags.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
