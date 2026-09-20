import { BLOCKS } from '@/lib/blocks-content';
import { Lines, HeadLines } from '@/lib/prim';
import Reveal from './Reveal';

/**
 * BLOCK C — condensed display intro (reference 4.webp, 2000×1055, scale 0.72)
 * Site C: the Greyola Finn Framer template. Background rgb(0,0,0).
 *
 *   headline   ink y115 x219 w1581 / y205 x489, pitch 90
 *              → 82.8 · 157.68 · 1138.32 · line-height 64.8, centred
 *   sub        two lines, centred
 *   rail       01 / 02 / 03 on a hairline, three 44px discs
 *   columns    three equal tracks divided by 1px vertical rules
 *
 * TYPEFACE: solved against the reference twice over — Geist Bold at 85px renders
 * the reference's own first line at its measured 1138.32 ink width, and its
 * ascender (60.4) lands within 2px of the measured 58.32. So no horizontal
 * squeeze is needed; the reference face is less condensed than it looks.
 *
 * NOT CARRIED OVER: the reference's name and location ("I'M GREYOLA FINN BASED
 * IN CALIFORNIA, USA") and its nine portrait photographs.
 *
 * PHONE. Three boxes here were wider than a phone screen and were being cut
 * off by the section's `overflow-clip` rather than scrolling: the 64px
 * headline (788px of unwrappable `whitespace-pre`), the 620px numbered rail,
 * and the 1315px three-column row. The measured desktop layout is unchanged at
 * 1200px and above; below it the headline steps down and wraps, the rail
 * fills the width it is given, and the three columns become three stacked
 * rows divided by the same hairline, turned from vertical to horizontal.
 */
export default function Intro() {
  const B = BLOCKS.intro;
  return (
    <section className="flex w-full shrink-0 flex-col items-center overflow-clip bg-ink section-pad">
      <HeadLines
        lines={[B.headline.l1, B.headline.l2]}
        className="statement text-center text-on-dark"
      />

      <Lines
        lines={B.sub}
        className="lead-text mt-[24px] max-w-[62ch] text-center text-on-dark-2"
      />

      {/* 01 / 02 / 03 rail */}
      <div className="relative mt-[48px] flex w-full max-w-[620px] items-center justify-between">
        <div className="absolute top-1/2 right-[22px] left-[22px] h-px -translate-y-1/2 bg-rule-on-dark" />
        {B.steps.map((s, i) => (
          <span
            key={i}
            className="tap-44 relative z-[1] flex h-[33px] w-[33px] items-center justify-center rounded-full bg-ink-2 font-mono text-[12px] whitespace-pre text-on-dark-2"
          >
            {s}
          </span>
        ))}
      </div>

      {/* three columns, 1px rules between */}
      <Reveal className="mt-[56px] flex w-full max-w-[1315px] items-start border-t border-rule-on-dark mobile:flex-col mobile:items-stretch">
        {B.columns.map((col, i) => (
          <div
            key={i}
            className={`flex min-w-0 flex-1 flex-col items-center px-[28px] pt-[40px] pb-[40px] mobile:px-0 ${
              /* the rule between columns turns with them: a left edge in a row,
                 a top edge in a stack */
              i > 0 ? 'border-l border-rule-on-dark mobile:border-l-0 mobile:border-t' : ''
            }`}
          >
            {/* three-dot progress */}
            <div className="flex items-center gap-[7px]">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="block h-[7px] w-[7px] rounded-full"
                  style={{
                    backgroundColor:
                      d <= i ? 'var(--color-on-dark)' : 'var(--color-rule-strong)',
                  }}
                />
              ))}
            </div>

            {/* stacked avatar plates — the reference's photographs are not used */}
            <div className="mt-[28px] flex items-center">
              {[0, 1, 2].map((a) => (
                <span
                  key={a}
                  className="-ml-[10px] block h-[46px] w-[46px] rounded-[12px] border border-rule-on-dark bg-ink-3 first:ml-0"
                />
              ))}
            </div>

            <p className="mt-[30px] title-2 whitespace-pre text-on-dark uppercase">
              {col.title}
            </p>
            <Lines lines={col.body} className="body-text mt-[12px] text-center text-on-dark-2" />
          </div>
        ))}
      </Reveal>
    </section>
  );
}
