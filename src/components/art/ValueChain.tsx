'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { useHydrated } from '@/lib/motion';
import { localePath, type Locale } from '@/lib/i18n';
import { Chevron } from '@/components/ui';
import type { Segment } from '@/content/industries';
import { serviceBySlug } from '@/content/services';

/* ============================================================================
   THE VALUE CHAIN — the sector's structure, with the firm's services on it.

   Four segments across (upstream, midstream, downstream, and the services
   around all three), drawn as a chain of tiles joined by the site's own
   chevron; under them, the segment's panel: what happens there, the
   realities of the work, and the services that apply with one line each.

   Pointing at a segment, or moving to it with the keyboard, shows its
   panel. The tiles are real buttons (`aria-pressed`, `aria-controls`), so
   the chain is operable without a pointer. BEFORE SCRIPTS RUN, AND WITH
   SCRIPTS OFF, every panel is in the page, stacked under the chain: the
   server renders the complete thing and the script only adds the choice.
   Under reduced motion nothing moves anyway; there is no animation in it.
   ========================================================================= */

export default function ValueChain({ chain, locale }: { chain: readonly Segment[]; locale: Locale }) {
  const [active, setActive] = useState(0);
  const hydrated = useHydrated();
  const base = useId();
  return (
    <div className="flex w-full flex-col gap-[24px]">
      {/* the chain */}
      <div className="grid w-full grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch gap-[8px] mobile:grid-cols-1" role="group" aria-label="The value chain">
        {chain.map((seg, i) => {
          const on = hydrated && i === active;
          return (
            <span key={seg.key} className="contents">
              {i > 0 ? (
                <span aria-hidden="true" className="flex items-center justify-center text-ink-3 mobile:hidden">
                  <Chevron />
                </span>
              ) : null}
              <button
                type="button"
                aria-pressed={on}
                aria-controls={`${base}-${seg.key}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`card-24 press flex min-h-[88px] flex-col items-start justify-between gap-[12px] p-[20px] text-left transition-colors duration-300 ease-hover ${
                  on ? 'bg-raised-2 outline outline-1 outline-accent-bright' : 'hover:bg-raised-2'
                }`}
              >
                <span className="t-mono-11 tabular-nums text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                <span className="t-question text-ink">{seg.title}</span>
              </button>
            </span>
          );
        })}
      </div>

      {/* the panels */}
      <div className="flex flex-col gap-[2px]">
        {chain.map((seg, i) => {
          const shown = !hydrated || i === active;
          return (
            <div
              key={seg.key}
              id={`${base}-${seg.key}`}
              hidden={!shown}
              className="card-30 grid grid-cols-2 gap-[40px] p-(--card-pad) narrow:grid-cols-1"
            >
              <div className="flex flex-col gap-[16px]">
                <h3 className="t-card text-ink">{seg.title}</h3>
                <p className="t-body text-ink-2">{seg.what}</p>
                <ul className="flex flex-col divide-y divide-rule border-t border-rule">
                  {seg.realities.map((r) => (
                    <li key={r} className="t-body py-[12px] text-ink-2">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-[16px]">
                <p className="t-mono text-ink-3">WHAT WE BUILD HERE</p>
                <ul className="flex flex-col divide-y divide-rule border-y border-rule">
                  {seg.services.map(({ slug, how }) => {
                    const s = serviceBySlug(slug)!;
                    return (
                      <li key={slug} className="py-[12px]">
                        <Link href={localePath(locale, `/services/${slug}`)} className="group flex flex-col gap-[4px]">
                          <span className="flex items-center gap-[8px]">
                            <span className="t-mono-11 tabular-nums text-ink-3">{s.n}</span>
                            <span className="t-question hover-read text-ink">{s.headline.join(' ')}</span>
                          </span>
                          <span className="t-caption text-ink-2">{how}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
