import Img from '@/lib/Img';
import { Marquee, InView } from '@/lib/motion';
import { MARKS, MARK_ROW } from '@/content/site';

/* ============================================================================
   THE PROOF BAND — block 02. Measured 310px, padding 30/30/60, ground #101010.

   The reference heads this band with "Teams that handed us their busywork"
   over an animated counter, then runs a logo marquee beneath.

   The counter is gone: it is a performance claim. The marquee is kept exactly
   — same strip, same continuous travel, same seamless loop — and the heading
   above it makes no relationship claim at all, because two of the five
   relationships are not settled. ABP Continental may appear as a mark and may
   not be called a client. Dorwa Production is a logo only. Both by
   instruction. The two Recalibre owns are stamped.

   There is no count under this row. A figure that includes companies you own
   does not survive a check, and the two that would make it honest are open.
   ========================================================================= */
export default function MarkRow() {
  return (
    <section
      aria-labelledby="marks-head"
      className="relative w-full overflow-clip border-b border-rule bg-raised pb-[60px] pt-[30px] grain"
    >
      <div className="shell pad-x flex w-full flex-col gap-[24px]">
        <div className="flex flex-wrap items-end justify-between gap-[16px]">
          <div className="flex flex-col gap-[10px]">
            <p className="t-mono text-ink-3">{MARK_ROW.eyebrow}</p>
            <h2 id="marks-head" className="t-lede text-ink">
              {MARK_ROW.heading}
            </h2>
          </div>
          <p className="t-small max-w-[46ch] text-ink-3">{MARK_ROW.note}</p>
        </div>
      </div>

      <InView className="mt-[8px] w-full">
        <Marquee seconds={44} className="border-y border-rule-3 py-[26px]">
          {MARKS.map((m) => (
            <span key={m.name} className="flex shrink-0 items-center gap-[10px] px-[34px]">
              <Img
                src={m.src}
                alt={m.name}
                sizes="160px"
                className="block h-[22px] w-auto opacity-70"
              />
              {m.ours ? (
                <span className="t-mono-9 rounded-full border border-rule-2 px-[8px] py-[3px] text-lime">
                  {MARK_ROW.stamp}
                </span>
              ) : null}
            </span>
          ))}
        </Marquee>
      </InView>
    </section>
  );
}
