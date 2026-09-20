import Link from 'next/link';
import { BLOCKS } from '@/lib/blocks-content';
import Reveal from './Reveal';
import Sparkle from './Sparkle';

/**
 * BLOCK A1 — "Less manual work. More intelligent execution." (reference 10.webp)
 * Site A: the [N.xx/11] blue instrument-panel reference. Accent rgb(35,83,247).
 *
 * Measured off 10.webp (2000×1055), normalised at scale 0.72 → 1440.
 *
 *   cards        x189/739/1290 → w540 each, gaps 10 and 11   → 388.8, 7.2 / 7.92
 *   card box     y314 → y955, h641                           → 226.08 → 687.6
 *   column       x189 → x1830, 1641                          → 1181.52
 *   headline     ink y88 / y167, pitch 79                    → 63.36, line-height 56.88
 *   button       x1596 y74, 235×62                           → 169.2 × 44.64
 *   card rule    rgb(226,226,226) 1px
 *   // 00N       ink y351, right inset 31                    → 26.64, 22.32
 *   icon         ink y351 x229, h179                         → 26.64, 28.8, 128.88
 *   title        ink y610 x222                               → 213.12, 23.76
 *   body         ink y668, pitch 27                          → 254.88, line-height 19.44
 *   tag          ink y901                                    → 422.64
 *
 * NOTE: 10.webp is cropped — its own nav bar bleeds into the top of the frame,
 * so the section's true top edge is not in the screenshot. Padding above the
 * headline is set to the measured ink position, not to a measured section edge.
 *
 * The three icons are bespoke isometric illustrations in the reference. They are
 * NOT reproduced: the boxes below are neutral stand-ins at the measured size.
 */
export default function KeyValue() {
  const B = BLOCKS.keyValue;
  return (
    <section id="how" className="scroll-mt-[24px] flex w-full shrink-0 justify-center overflow-clip bg-paper section-pad">
      <div className="relative w-[1181.52px]">
        {/* eyebrow — ADDED. This was the one section on the page with no
            label above its headline, which is what made it read as a stray. */}
        <div className="flex items-center gap-[10.8px]">
          <Sparkle size={9.36} color="var(--color-accent)" />
          <p className="eyebrow whitespace-pre text-text">{B.eyebrow}</p>
        </div>

        <h2 className="section-head mt-[20px] text-text">
          <span className="block whitespace-pre">{B.headline.l1}</span>
          <span className="block whitespace-pre">{B.headline.l2}</span>
        </h2>

        {/* GET STARTED — 235×62 img, right-aligned at x1596 */}
        <Link
          href="#contact"
          className="focus-ring absolute top-[36px] right-0 flex h-[44.64px] w-[169.2px] items-center justify-center gap-[10.8px] bg-ink transition-colors duration-[260ms] hover:bg-accent"
        >
          <span className="block h-[7.2px] w-[7.2px] shrink-0 bg-paper" />
          <span className="font-mono text-[12px] leading-[16px] tracking-[0.6px] whitespace-pre text-on-dark uppercase">
            {B.cta}
          </span>
        </Link>

        {/* three cards on 388.8 tracks, gaps 7.2 / 7.92 */}
        <Reveal className="mt-[56px] flex w-full items-start">
          {B.cards.map((card, i) => (
            <div
              key={i}
              className={`card-lift relative h-[461.52px] w-[388.8px] shrink-0 border border-rule-card ${
                i === 1 ? 'ml-[7.2px]' : i === 2 ? 'ml-[7.92px]' : ''
              }`}
            >
              <span className="absolute top-[26.64px] right-[22.32px] font-mono text-[11px] leading-[16px] whitespace-pre text-text-3">
                {card.n}
              </span>

              {/* icon plate — stand-in at the measured 128.88 box */}
              <div
                className="absolute top-[26.64px] left-[28.8px] h-[128.88px] w-[144px]"
                aria-hidden="true"
              >
                <svg viewBox="0 0 40 36" className="h-full w-full">
                  {Array.from({ length: 4 }, (_, r) =>
                    Array.from({ length: 5 }, (_, c) => (
                      <rect
                        key={`${r}-${c}`}
                        x={2 + c * 7}
                        y={2 + r * 8}
                        width={6}
                        height={7}
                        fill={i === 0 ? 'var(--color-accent)' : 'none'}
                        stroke={i === 0 ? 'var(--color-accent)' : 'var(--color-text)'}
                        strokeWidth={0.6}
                        opacity={i === 0 ? (r + c) % 3 === 0 ? 1 : 0.35 : 1}
                      />
                    )),
                  )}
                </svg>
              </div>

              <p className="absolute top-[207.5px] left-[23.76px] title-2 whitespace-pre text-text">
                {card.title}
              </p>

              <div className="absolute top-[249.5px] left-[23.76px] w-[340px]">
                {card.body.map((line, j) => (
                  <p
                    key={j}
                    className="body-text whitespace-pre text-text-2"
                  >
                    {line}
                  </p>
                ))}
              </div>

              <span className="absolute top-[417px] left-[23.76px] bg-paper-3 px-[3.6px] py-[2.16px] font-mono text-[12px] leading-[16px] tracking-[0.3px] whitespace-pre text-text-3 uppercase">
                {card.tag}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
