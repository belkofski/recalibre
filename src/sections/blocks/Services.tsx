import { BLOCKS } from '@/lib/blocks-content';
import Link from 'next/link';
import Sparkle from './Sparkle';
import Reveal from './Reveal';

/**
 * BLOCK B3 — "SERVICES" (reference 11.webp, 2000×1244, scale 0.72)
 * Site B: Covix, dark variant. Background rgb(0,0,0).
 *
 *   eyebrow    ink y109, centred                 → 78.48
 *   headline   ink y166 / y259, pitch 93         → 119.52 · line-height 66.96
 *              (same 93 pitch as 5.webp — same site, same display scale)
 *   row 01     x228-1772 y428-1180               → 164.16 · 308.16 · 1112 × 541
 *   row 02     top ~y1195, gap ~15               → gap 10.8
 *   radius     ~24                               → 17.28
 *
 * CAUTION: 11.webp is CROPPED — row 02 runs off the bottom, so the row count,
 * the open row's height and the section's bottom padding are NOT measured.
 *
 * Grown from the screenshot's 2 rows to 5, one per capability. The open row was
 * set to the measured-looking 541px while the slots held filler; with the real
 * copy in place that left 175px of dead space under the CTA, so it is now 430px
 * with the image at 220 rather than 196. Nothing measured was overridden —
 * there was no measurement here to override.
 */
export default function Services() {
  const B = BLOCKS.services;
  return (
    <section id="capabilities" className="scroll-mt-[24px] flex w-full shrink-0 flex-col items-center overflow-clip bg-ink section-pad">
      <div className="flex items-center gap-[10.8px]">
        <Sparkle size={9.36} color="var(--color-accent)" />
        <p className="eyebrow whitespace-pre text-on-dark">
          {B.eyebrow}
        </p>
      </div>

      <h2 className="section-head mt-[20px] text-center text-on-dark">
        <span className="block whitespace-pre">{B.headline.l1}</span>
        <span className="block whitespace-pre">{B.headline.l2}</span>
      </h2>

      <Reveal className="mt-[56px] flex w-[1112px] flex-col gap-[10.8px]">
        {B.rows.map((row, i) => (
          <div
            key={i}
            className={`card-lift card-lift-dark relative w-full rounded-[12px] bg-ink-3 ${
              row.open ? 'h-[430px]' : 'h-[196px]'
            }`}
          >
            {/* the oversized ghost number, left */}
            <span className="absolute top-[44px] left-[28px] text-[76px] leading-[86px] font-bold whitespace-pre text-on-dark/8">
              {row.n}
            </span>

            {/* +/- toggle, top right */}
            <button
              type="button"
              aria-expanded={row.open}
              aria-label={row.open ? 'Collapse this service' : 'Expand this service'}
              className="focus-ring tap-44 absolute top-[36px] right-[28px] flex h-[31px] w-[31px] items-center justify-center rounded-full border border-rule-strong text-[16px] leading-none text-on-dark/72 transition-colors duration-[260ms] hover:border-accent hover:text-on-dark"
            >
              <span aria-hidden="true">{row.open ? '−' : '+'}</span>
            </button>

            <div className="absolute top-[40px] left-[326px] w-[620px]">
              <p className="title-1 whitespace-pre text-on-dark">
                {row.title}
              </p>
              <div className="mt-[16px] flex items-center gap-[10px]">
                {row.tags.map((t, j) => (
                  <span
                    key={j}
                    className="rounded-full border border-rule-strong px-[13px] py-[5px] meta-text whitespace-pre text-on-dark/88"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {row.open && (
              <>
                <div className="absolute top-[170px] left-[326px] flex h-[220px] w-[334px] flex-col items-center justify-center gap-[8px] rounded-[8px] border border-rule-on-dark bg-ink-2">
                  <span aria-hidden="true" className="block h-[24px] w-[24px] rounded-[6px] border border-rule-strong" />
                  <p className="meta-text text-on-dark-3">Image to come</p>
                </div>
                <div className="absolute top-[186px] left-[690px] w-[400px]">
                  {row.body.map((l, j) => (
                    <p
                      key={j}
                      className="lead-text whitespace-pre text-on-dark/62"
                    >
                      {l}
                    </p>
                  ))}
                </div>
                <Link
                  href="#contact"
                  className="focus-ring absolute top-[296px] left-[690px] btn-label flex h-[48px] items-center gap-[10px] rounded-full bg-paper pr-[6px] pl-[20px] whitespace-pre text-text transition-colors duration-[260ms] hover:bg-accent hover:text-on-dark"
                >
                  {row.cta}
                  <span aria-hidden="true" className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-ink text-[13px] text-on-dark">
                    ↗
                  </span>
                </Link>
              </>
            )}
          </div>
        ))}
      </Reveal>
    </section>
  );
}
