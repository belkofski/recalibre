import { BLOCKS } from '@/lib/blocks-content';
import Reveal from './Reveal';

/**
 * BLOCK E — "How it works" (reference 8.webp, 2000×1125, scale 0.72)
 * Site E: the Oberon Framer template. Background rgb(241,239,238),
 * accent rgb(221,90,39).
 *
 *   columns    x681 / x1001 / x1320 / x1639, pitch 319.5 → 490.32, pitch 230.04
 *   number chip white, mono, with a leading accent dot
 *   rules      1px dashed vertical per column; column 1's rule is accent
 *   lead       mono uppercase, left of column 1
 *   footer     accent index chip + mono label on a tinted bar
 *
 * CAUTION: 8.webp is a browser-window screenshot — the top ~60px of the frame
 * is Safari's own toolbar, and the "BUY TEMPLATE / Made in Framer" badges at
 * the bottom right are Framer's chrome. None of that is part of the section and
 * none of it is reproduced here. The section's true top edge is therefore not
 * measured.
 */
export default function Flow() {
  const B = BLOCKS.flow;
  return (
    <section className="relative flex w-full shrink-0 justify-center overflow-clip bg-paper-2 pt-[34px] pb-[104px]">
      <div className="relative w-[1404px]">
        <h2 className="pl-[490.32px] text-[43px] leading-[52px] font-normal tracking-[-1px] whitespace-pre text-text">
          {B.heading}
        </h2>

        <div className="relative mt-[36px] flex items-start border-t border-rule-on-light pt-[22px]">
          {/* lead, mono uppercase, in the left gutter */}
          <div className="w-[490.32px] shrink-0 pt-[110px] pl-[32px]">
            {B.lead.map((l, i) => (
              <p
                key={i}
                className="font-mono text-[13px] leading-[19px] tracking-[0.2px] whitespace-pre text-text"
              >
                {l}
              </p>
            ))}
          </div>

          <Reveal className="flex min-w-0 flex-1">
            {B.steps.map((s, i) => (
              <div key={i} className="relative w-[230.04px] shrink-0 pr-[18px]">
                {/* the column's dashed spine */}
                <div
                  className="absolute top-0 bottom-[-40px] left-0 w-px"
                  style={{
                    backgroundImage: `repeating-linear-gradient(to bottom, ${
                      i === 0 ? 'rgb(221,90,39)' : 'var(--color-rule-on-light)'
                    } 0 5px, transparent 5px 10px)`,
                  }}
                />

                {/* number chip */}
                <span className="ml-px flex h-[43px] w-[58px] items-center justify-center gap-[3px] bg-paper font-mono text-[20px] leading-[26px] whitespace-pre text-text">
                  <span className="text-accent">.</span>
                  {s.n.replace('.', '')}
                </span>

                <div className="mt-[92px] pl-[8px]">
                  {s.title.map((t, j) => (
                    <p
                      key={j}
                      className="font-mono text-[13.5px] leading-[19px] tracking-[0.2px] whitespace-pre text-text"
                    >
                      {t}
                    </p>
                  ))}
                </div>

                <p className="mt-[42px] pl-[50px] font-mono text-[11.5px] leading-[16px] tracking-[0.4px] whitespace-pre text-text-3">
                  {s.rail}
                </p>

                {/* glyph + dashed connector to the next column */}
                <div className="relative mt-[10px] h-[46px] pl-[8px]">
                  <span className="flex h-[46px] w-[52px] items-center justify-center border border-rule-on-light">
                    <span className="block h-[8px] w-[8px] bg-accent" />
                  </span>
                  {i < 3 && (
                    <div
                      className="absolute top-1/2 right-[6px] left-[68px] h-px"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(to right, var(--color-rule-on-light) 0 3px, transparent 3px 7px)',
                      }}
                    />
                  )}
                </div>

                <div className="mt-[44px] pl-[8px]">
                  {s.body.map((l, j) => (
                    <p
                      key={j}
                      className="text-[15.5px] leading-[21px] whitespace-pre text-text-2"
                    >
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      {/* footer bar */}
      <div className="absolute inset-x-0 bottom-0 flex h-[62px] items-center bg-rule-card">
        <span className="ml-[32px] flex h-[31px] w-[34px] items-center justify-center bg-accent font-mono text-[13px] whitespace-pre text-on-dark">
          {B.footIndex}
        </span>
        <span className="ml-[14px] font-mono text-[15px] tracking-[0.4px] whitespace-pre text-text uppercase">
          {B.footLabel}
        </span>
      </div>
    </section>
  );
}
