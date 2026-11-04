'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { InView } from '@/lib/motion';

/* ============================================================================
   THE PROJECTS FILTER (4 November 2026).

   The discipline chips on the projects index used to be labelled "they do
   nothing" because four entries did not need filtering. They filter now,
   through the address (`?discipline=BRAND`), so a filtered view can be
   linked to and the back button undoes it. Two small islands read the same
   address: the chip row, and the grid, which shows the cards whose tags
   carry the discipline. The cards themselves are rendered on the server
   and handed in as nodes; this file never draws a card.

   With scripts off the chips are ordinary links and the grid shows every
   card, which is the honest fallback: nothing is hidden behind a script.
   ========================================================================= */

export type GridCard = { slug: string; tags: readonly string[]; node: ReactNode };

export const ALL = 'ALL';

function useDiscipline(): string | null {
  const sp = useSearchParams();
  const d = sp.get('discipline');
  return d ? d.toUpperCase() : null;
}

export function DisciplineFilter({ disciplines, label, all = ALL }: { disciplines: readonly string[]; label: string; all?: string }) {
  const active = useDiscipline();
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-[16px]">
      <p className="t-mono text-ink-3">{label}</p>
      <nav aria-label={label} className="flex flex-wrap gap-[8px]">
        {[all, ...disciplines].map((d) => {
          const on = d === all ? !active : active === d;
          return (
            <Link
              key={d}
              href={d === all ? pathname : `${pathname}?discipline=${encodeURIComponent(d)}`}
              scroll={false}
              replace
              aria-current={on ? 'true' : undefined}
              className="tap-44 flex items-center"
            >
              <span className={`chip t-tag transition-colors duration-300 ease-hover ${on ? 'border-accent-bright bg-accent-bright text-on-accent-bright' : 'text-ink-2 hover:text-ink'}`}>
                {d}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function ProjectsGrid({ cards, empty = 'No project carries that discipline yet.' }: { cards: readonly GridCard[]; empty?: string }) {
  const active = useDiscipline();
  const list = active ? cards.filter((c) => c.tags.includes(active)) : cards;
  const n = list.length;
  return (
    <div className="seam shell grid w-full grid-cols-2 phone:grid-cols-1" aria-live="polite">
      {list.map((c, i) => {
        const last = n % 2 === 1 && i === n - 1;
        return (
          <InView key={c.slug} step={last ? 0 : i % 2} className={last ? 'col-span-2 phone:col-span-1' : undefined}>
            {c.node}
          </InView>
        );
      })}
      {n === 0 ? (
        <p className="card-30 col-span-2 p-(--card-pad) t-body text-ink-2 phone:col-span-1">{empty}</p>
      ) : null}
    </div>
  );
}
