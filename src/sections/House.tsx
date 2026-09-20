import Img from '@/lib/Img';
import { Lines } from '@/lib/prim';
import { HOUSE } from '@/lib/house-content';
import Reveal from './blocks/Reveal';
import Sparkle from './blocks/Sparkle';

/**
 * BELKOFSKI — the one finished thing on this page.
 *
 * Everything else the site shows is in development. This is not: it is a
 * brand that exists, with frames that exist, photographed and rendered.
 *
 * ── WHY IT IS HERE AND WHY IT IS LABELLED THE WAY IT IS ────────────────────
 *
 * The brand-and-identity capability is the only one of the five with no
 * product behind it, so it had nothing to point at. Belkofski is the
 * founder's own eyewear house, which makes it usable without waiting on
 * anyone: no client permission is owed, no NDA applies, and nothing about it
 * has to be checked with a third party before it ships.
 *
 * It is also exactly why the stamp says OUR OWN rather than a client name.
 * Presenting a company you own as a client is the oldest way an agency page
 * lies, and this site has already been killed once by softer claims than
 * that. The partner row carries the same stamp on the same two names for the
 * same reason.
 *
 * ── WHAT IS DELIBERATELY NOT WRITTEN HERE ─────────────────────────────────
 *
 * No scope of work, no dates, no deliverables list, no results. The pictures
 * are real and the ownership is on record; what Recalibre specifically did
 * for Belkofski and when is not written down anywhere I can check, so it is
 * not asserted. Every caption below describes what is visibly in its own
 * picture and stops there.
 *
 * ── LAYOUT ────────────────────────────────────────────────────────────────
 *
 * Four pictures on an asymmetric grid, because four equal tiles reads as a
 * stock gallery. The tall render leads, the product shot sits beside it, and
 * two smaller frames sit under. Below 810px the grid collapses to one column
 * in the same order.
 */
export default function House() {
  return (
    <section
      id="house"
      aria-labelledby="house-head"
      className="flex w-full shrink-0 flex-col items-center overflow-clip bg-ink section-pad"
    >
      <div className="flex items-center gap-[10.8px]">
        <Sparkle size={9.36} color="var(--color-accent)" />
        <p className="eyebrow whitespace-pre text-on-dark">{HOUSE.eyebrow}</p>
      </div>

      <h2 id="house-head" className="section-head mt-[20px] text-center text-on-dark">
        {HOUSE.headline}
      </h2>

      <div className="mt-[18px] flex items-center gap-[10px]">
        <span className="rounded-full border border-rule-strong px-[12px] py-[4px] font-mono text-[11px] leading-[16px] tracking-[0.6px] whitespace-pre text-on-dark/72">
          {HOUSE.stamp}
        </span>
      </div>

      <Lines lines={HOUSE.lead} className="lead-text mt-[20px] max-w-[58ch] text-center text-on-dark-2" />

      <Reveal className="mt-[48px] grid w-full max-w-[1120.32px] grid-cols-2 gap-[16px] mobile:grid-cols-1">
        {HOUSE.shots.map((shot) => (
          <figure
            key={shot.src}
            data-evidence
            className={`m-0 flex flex-col ${shot.span ? 'row-span-2' : ''}`}
          >
            <div
              className="w-full overflow-clip rounded-[12px] border border-rule-on-dark bg-ink-2"
              style={{ aspectRatio: shot.ratio }}
            >
              <Img
                src={shot.src}
                alt={shot.alt}
                sizes="(max-width: 809px) 100vw, 552px"
                className="block h-full w-full object-cover"
              />
            </div>
            <figcaption className="meta-text mt-[10px] text-on-dark-3">{shot.caption}</figcaption>
          </figure>
        ))}
      </Reveal>

      <p className="small-text mt-[28px] max-w-[62ch] text-center text-on-dark-3">{HOUSE.note}</p>
    </section>
  );
}
