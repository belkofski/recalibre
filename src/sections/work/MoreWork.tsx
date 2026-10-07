import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Scene, Spotlight } from '@/lib/motion';
import { Chevron, cardClass } from '@/components/ui';
import type { Initiative } from '@/content/work';

/* ============================================================================
   MORE WORK — the way on from a case study: the two initiatives that
   FOLLOW this one in the list, wrapping round the end, so each page points
   at a different pair. The first of them is the next case.

   TEXT, NOT PICTURES (the owner's third note: the same pictures on every
   page). Each is a compact link on a surface card: the name, the year and
   the field, and the chevron; the spotlight under the pointer, the dot
   that fills. The two rise one after the other as the block enters
   (`.sx-stagger`).
   ========================================================================= */
export default function MoreWork({ items }: { items: readonly Initiative[] }) {
  return (
    <Scene as="section" aria-labelledby="more-head" end={0.35} className="pad-x pad-top flex w-full flex-col items-center">
      <div className="shell flex w-full flex-col gap-(--space-5)">
        <h2 id="more-head" className="t-section text-ink">
          More work.
        </h2>
        <ul className="sx-stagger grid w-full grid-cols-2 gap-(--space-2) phone:grid-cols-1">
          {items.map((o, i) => (
            <li key={o.slug} style={{ '--i': i } as CSSProperties} className="flex">
              <Spotlight>
                <Link
                  href={`/work/${o.slug}`}
                  aria-describedby={`more-${o.slug}-meta`}
                  className={`${cardClass({ radius: 24, interactive: true, spot: true })} press flex w-full items-center justify-between gap-(--space-4) px-(--card-pad) py-(--space-4)`}
                >
                  <span aria-hidden="true" className="spot-light" />
                  <span className="flex min-w-0 flex-col gap-(--space-1)">
                    <span className="t-lede text-ink">{o.name}</span>
                    <span id={`more-${o.slug}-meta`} className="t-mono tabular-nums text-ink-3">
                      {`${o.year} · ${o.category}`.toUpperCase()}
                    </span>
                  </span>
                  <span className="dot-btn shrink-0">
                    <Chevron />
                  </span>
                </Link>
              </Spotlight>
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  );
}
