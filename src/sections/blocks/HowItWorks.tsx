import Link from 'next/link';
import { BLOCKS } from '@/lib/blocks-content';
import Reveal from './Reveal';

/**
 * BLOCK A2 — "Understand the flow." (reference 9.webp, 2000×964, scale 0.72)
 * Site A: the [N.xx/11] blue instrument-panel reference.
 *
 *   eyebrow    ink y54  x181                       → 38.88 · 130.32   mono
 *   headline   ink y117 / y196, pitch 79           → 84.24 · line-height 56.88
 *   button     x1588 y103, 233×63                  → 167.76 × 45.36
 *   cards      x179/591/1004/1417, w401.5, gap 11  → 289.08, gap 7.92
 *   card box   y344 → y836, h492                   → 247.68 → 354.24
 *   // 00N     ink y370 x200 (card-rel 26/21)      → 18.72 · 15.12
 *   body       ink y491, pitch 27                  → 105.84 · line-height 19.44
 *   rail       y585 x190, 385×11 (card-rel 241/11) → 173.52 · 7.92 · 277.2 × 7.92
 *   title      ink y651 x202 (card-rel 307/23)     → 221.04 · 16.56
 *
 * Rail fill sampled off the reference: rgb(35,83,247) over rgb(247,247,247),
 * filled 100% / 22% / 0% / 0% across the four cards.
 *
 * The four isometric icons are bespoke illustrations in the reference and are
 * NOT reproduced — neutral line stand-ins sit at the measured box instead.
 */
export default function HowItWorks() {
  const B = BLOCKS.howItWorks;
  return (
    <section className="flex w-full shrink-0 justify-center overflow-clip bg-paper pt-[32px] pb-[92px]">
      <div className="relative w-[1180.8px]">
        <p className="font-mono text-[12px] leading-[16px] tracking-[0.6px] whitespace-pre text-text-3">
          {B.eyebrow}
        </p>

        <h2 className="mt-[27px] text-[45px] leading-[56.88px] font-normal tracking-[-1.5px] text-text">
          <span className="block whitespace-pre">{B.headline.l1}</span>
          <span className="block whitespace-pre">{B.headline.l2}</span>
        </h2>

        <Link
          href="/contact"
          className="focus-ring absolute top-[23.5px] right-0 flex h-[45.36px] w-[167.76px] items-center justify-center gap-[10.8px] bg-ink transition-colors duration-[260ms] hover:bg-accent"
        >
          <span className="block h-[7.2px] w-[7.2px] shrink-0 bg-paper" />
          <span className="font-mono text-[12px] leading-[16px] tracking-[0.6px] whitespace-pre text-on-dark uppercase">
            {B.cta}
          </span>
        </Link>

        <Reveal className="mt-[62px] flex w-full items-start">
          {B.cards.map((card, i) => (
            <div
              key={i}
              className={`card-lift relative h-[354.24px] w-[289.08px] shrink-0 border border-rule-card ${
                i > 0 ? 'ml-[7.92px]' : ''
              }`}
            >
              <span className="absolute top-[18.72px] left-[15.12px] font-mono text-[11px] leading-[16px] whitespace-pre text-text-3">
                {card.n}
              </span>

              <div className="absolute top-[100px] left-[15.12px] w-[255px]">
                {card.body.map((line, j) => (
                  <p
                    key={j}
                    className="text-[14px] leading-[19.44px] whitespace-pre text-text-2"
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* progress rail — 277.2 × 7.92 at card-rel 7.92 / 173.52 */}
              <div className="absolute top-[173.52px] left-[7.92px] h-[7.92px] w-[277.2px] bg-paper-3">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${card.fill * 100}%` }}
                />
              </div>

              <p
                className={`absolute top-[215px] left-[16.56px] text-[22px] leading-[28.8px] whitespace-pre ${
                  card.fill > 0 ? 'text-accent' : 'text-text-3'
                }`}
              >
                {card.title}
              </p>

              {/* icon stand-in — bottom right, measured ~100×100 box */}
              <svg
                viewBox="0 0 30 30"
                aria-hidden="true"
                className="absolute right-[18px] bottom-[14px] h-[72px] w-[72px]"
              >
                {Array.from({ length: 3 }, (_, r) => (
                  <g key={r} transform={`translate(0 ${r * 8})`}>
                    <path
                      d="M4 12 L15 7 L26 12 L15 17 Z"
                      fill={card.fill > 0 ? 'var(--color-accent)' : 'none'}
                      fillOpacity={0.25}
                      stroke={card.fill > 0 ? 'var(--color-accent)' : 'var(--color-text)'}
                      strokeWidth={0.7}
                    />
                  </g>
                ))}
              </svg>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
