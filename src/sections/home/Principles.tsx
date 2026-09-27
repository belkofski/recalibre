'use client';

import { useState } from 'react';
import { Rise, InView } from '@/lib/motion';
import { LabelRow, Glyph } from '@/components/ui';
import { PRINCIPLES } from '@/content/home';

/* ============================================================================
   HOW WE OPERATE.

   The reference's evidence block: two counters rotating on the left, and a
   testimonial slider on the right with a portrait panel, a two-tone quote,
   dot indicators and a pair of round controls.

   Every part of that is kept. What changes is what it carries: the counters
   become the two non-negotiables at the same scale, and the slider carries
   operating principles — no quotation marks, no name, no job title, no
   rating, no date and no review label, because there is no client to
   attribute any of it to.

   A WHITE PANEL (the owner's decision, 26 September 2026): `theme-light
   band-light`, see globals.css, THE WHITE PANELS. The panel sets the
   padding above and below the content. The engagement stages below pad
   their own top on a desktop and a tablet but not on a phone (the Film
   that used to follow had none at all), so `band-light-after-mobile` puts
   the black gap under the panel there.
   The dots and the round controls take their colours on white from THE KIT
   ON WHITE in the same file.
   ========================================================================= */

export default function Principles() {
  const P = PRINCIPLES;
  const [i, setI] = useState(0);
  const item = P.items[i] ?? P.items[0];
  const go = (d: number) => setI((v) => (v + d + P.items.length) % P.items.length);

  return (
    <section className="theme-light band-light band-light-after-mobile pad-x relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-[120px] mobile:gap-[40px]">
        <div className="flex w-full flex-col items-end gap-[70px] mobile:gap-[30px]">
          <LabelRow label={P.label} />
          <div className="flex w-[690px] flex-col gap-[40px] narrow:w-full">
            <Rise as="h2" lines={P.headline} className="t-display text-ink" mark={P.mark} />
            <InView>
              <p className="t-body max-w-[280px] text-ink-2">{P.lede}</p>
            </InView>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 narrow:grid-cols-1 narrow:gap-[40px]">
          {/* The two pillars, at counter scale, in the reference's positions. */}
          <div className="flex flex-col justify-between gap-[40px] pr-[60px] narrow:pr-0">
            {P.pillars.map((p, n) => (
              <InView
                key={p.big}
                delay={n * 90}
                className={`flex flex-col gap-[14px] border-l border-rule-2 pl-[35px] ${
                  n === 0 ? 'self-end text-right narrow:self-start narrow:text-left' : ''
                }`}
              >
                <p className="t-figure text-ink">{p.big}</p>
                <p className="t-mono text-ink-2">{p.small}</p>
              </InView>
            ))}
          </div>

          {/* The slider. */}
          <InView className="seam-sm flex min-h-[319px] w-full flex-row mobile:flex-col">
            <div className="card-24 relative flex w-[220px] flex-none flex-col justify-between overflow-clip bg-ink/[0.03] p-[20px] mobile:w-full">
              <span className="t-mono-9 text-ink-2">{item.label}</span>
              {/* The dots below already say "Principle 01"; this is decoration. */}
              <span className="t-figure text-ink/10" aria-hidden="true">
                {item.n}
              </span>
            </div>

            <div className="card-24 flex flex-1 flex-col justify-between gap-[30px] p-[30px] mobile:p-[20px]">
              <p className="t-body-lg text-ink">
                {item.lead}
                <span className="text-ink-2">{item.rest}</span>
              </p>
              <div className="flex items-center justify-between">
                <span className="-ml-[10px] flex items-center">
                  {P.items.map((p, n) => (
                    <button
                      key={p.n}
                      type="button"
                      aria-label={`Principle ${p.n}`}
                      aria-current={n === i}
                      onClick={() => setI(n)}
                      className="focus-ring flex size-[44px] items-center justify-center"
                    >
                      <span
                        className={`slide-dot block size-[5px] rounded-full transition-colors duration-300 ${
                          n === i ? 'bg-accent-bright' : 'bg-white/25'
                        }`}
                      />
                    </button>
                  ))}
                </span>
                <span className="group flex items-center">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous principle"
                    className="focus-ring flex size-[44px] items-center justify-center"
                  >
                    <span className="dot-btn rotate-180">
                      <Glyph />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next principle"
                    className="focus-ring flex size-[44px] items-center justify-center"
                  >
                    <span className="dot-btn">
                      <Glyph />
                    </span>
                  </button>
                </span>
              </div>
            </div>
          </InView>
        </div>
      </div>
    </section>
  );
}
