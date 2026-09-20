import Img from '@/lib/Img';
import Reveal from '@/sections/blocks/Reveal';
import Sparkle from '@/sections/blocks/Sparkle';
import { PARTNERS, PARTNERS_BLOCK as P } from '@/lib/partners-content';

/**
 * PARTNERS — the first block on this page carrying proof rather than a claim.
 *
 * Every name, mark and description is real and comes from _MASTER. Nothing here
 * is filler and nothing is a placeholder, which is why it is also the only
 * block that needed no "to come" frame.
 *
 * NOT A LOGO WALL, per the brand note. A wall of marks at equal size implies a
 * client list and invites you to read scale into it. These are five hairline
 * rows: the mark, the name, what they do, and — on the two Fadi owns — a stamp
 * saying so. The headline counts three, not five, because the other two are his
 * and counting your own company does not survive a check.
 *
 * The marks are dark ink on transparency, so this block sits on paper. See the
 * note in partners-content.ts: that choice is what lets all five ship as drawn,
 * with no inversion and no fallback to type.
 */
export default function Partners() {
  return (
    <section id="partners" className="flex w-full shrink-0 flex-col items-center overflow-clip bg-paper-2 section-pad">
      <div className="flex items-center gap-[10.8px]">
        <Sparkle size={9.36} color="var(--color-accent)" />
        <p className="eyebrow whitespace-pre text-text">{P.eyebrow}</p>
      </div>

      <h2 className="section-head mt-[20px] text-center text-text">
        <span className="block whitespace-pre">{P.headline.l1}</span>
        <span className="block whitespace-pre">{P.headline.l2}</span>
      </h2>

      <Reveal className="mt-[56px] flex w-full max-w-[1120.32px] flex-col border-t border-rule-on-light">
        {PARTNERS.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-[32px] border-b border-rule-on-light py-[26px] mobile:flex-col mobile:items-start mobile:gap-[14px]"
          >
            {/* mark — a fixed 200px track so five different aspect ratios
                still line their names up on one left edge */}
            <div
              className="flex w-[200px] shrink-0 items-center mobile:w-auto"
              style={{ height: `${p.markH}px` }}
            >
              <Img
                src={p.mark}
                alt={p.name}
                sizes="200px"
                className="block h-full w-auto object-contain object-left"
              />
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-[16px] mobile:w-full">
              <p className="title-2 min-w-0 text-text">{p.name}</p>
              {p.kind === 'house' && (
                <span className="shrink-0 rounded-full border border-rule-on-light px-[9px] py-[3px] text-[11px] leading-[16px] font-semibold tracking-[0.6px] whitespace-pre text-text-3">
                  {P.stamp}
                </span>
              )}
            </div>

            <p className="shrink-0 body-text text-text-3 mobile:text-left">{p.detail}</p>
          </div>
        ))}
      </Reveal>

      <p className="mt-[24px] small-text text-text-3">{P.note}</p>
    </section>
  );
}
