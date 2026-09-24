import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { Tick, Barcode, Glyph } from '@/components/ui';
import { STATEMENT } from '@/content/home';
import { SITE } from '@/content/site';

/* ============================================================================
   THE STATEMENT AND THE BAND.

   A centred 78px statement, a hairline dropped under it, a narrow centred
   paragraph — then a 1.82:1 media panel with the lime stage strip running
   straight across it, a barcode bottom left and a mono note bottom right.
   Every dimension is the reference's.
   ========================================================================= */

export default function Statement() {
  const strip = [...STATEMENT.strip, ...STATEMENT.strip];
  return (
    <section className="pad-x pad-top mobile:pt-[50px] relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col items-center gap-[90px] mobile:gap-[40px]">
        <div className="flex w-full flex-col items-center gap-[30px]">
          <Rise
            as="h2"
            lines={STATEMENT.lines}
            className="t-statement text-center text-ink"
            stagger={70}
          />
          <Tick />
          <InView className="w-[480px] max-w-full">
            <p className="t-body text-center text-ink-2">{STATEMENT.body}</p>
          </InView>
        </div>

        <InView className="relative w-full overflow-clip rounded-[30px] bg-raised mobile:rounded-[20px]">
          <div className="relative aspect-[1.8224/1] w-full mobile:aspect-[4/5]">
            <Img
              src={STATEMENT.media}
              alt={STATEMENT.mediaAlt}
              sizes="(max-width: 809px) 100vw, 1380px"
              className="media-push media-push-sm"
            />
            <span
              className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-ground via-ground/70 to-transparent"
              aria-hidden="true"
            />

            {/* The lime stage strip, 30px tall, running edge to edge. */}
            <div className="absolute inset-x-0 top-1/2 flex h-[30px] -translate-y-1/2 items-center overflow-clip bg-lime">
              <div className="marquee-track" style={{ animationDuration: '30s' }}>
                {strip.map((s, i) => (
                  <span key={i} className="t-mono-11 flex-none px-[113px] text-ground mobile:px-[40px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* The two feet of the panel. */}
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-0 p-[50px] mobile:grid-cols-1 mobile:gap-[20px] mobile:p-[20px]">
              <div className="flex items-end mobile:hidden">
                <Barcode className="h-[13px] w-[118px]" />
              </div>
              <div className="flex flex-col items-start gap-[30px] mobile:gap-[16px]">
                <p className="t-mono max-w-[330px] !leading-[13px] text-ink-2">{STATEMENT.note}</p>
                <span className="flex items-center gap-[8px]">
                  <Glyph className="[&>i]:bg-white" />
                  <span className="t-mark text-ink">{SITE.name}<span className="t-mark-r">{SITE.mark}</span></span>
                </span>
              </div>
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
}
