import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Spotlight } from '@/lib/motion';
import { cardClass, Chevron } from '@/components/ui';
import { initiativeBySlug, type Initiative } from '@/content/work';

/* ============================================================================
   IN THE WORK — the initiatives that show a capability in use, under its
   chapter, as text links and nothing more (the owner's note on the second
   pass: cross-links carry no pictures). Each is one link carrying a
   surface card: the name, one meta line (year, field and state), and the dot with
   its chevron; the surface lights under the pointer. The links arrive one
   after another with the chapter's scroll (`.sx-stagger`, read off the
   chapter's Scene).

   The names come off `related` in content/home.ts and resolve through
   content/work.ts, so a link prints only an initiative that has a page. A
   capability with no related work (03) prints nothing here at all.
   ========================================================================= */

/** 'IN DEVELOPMENT' → 'In development': the state as the meta line's last
 *  term, in the line's sentence case, so every card carries its honesty
 *  label (COPY4, S213/S217/S227/S232). */
const sentence = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export default function RelatedWork({ slugs, label }: { slugs: readonly string[]; label: string }) {
  const items = slugs.map((s) => initiativeBySlug(s)).filter((i): i is Initiative => Boolean(i));
  if (items.length === 0) return null;
  return (
    <div className="caps-related-block flex w-full flex-col gap-(--space-2)">
      <p className="t-mono-11 text-ink-3">{label}</p>
      <ul className="caps-related-list sx-stagger m-0 list-none p-0">
        {items.map((item, i) => (
          <li key={item.slug} className="flex" style={{ '--i': i } as CSSProperties}>
            <Spotlight>
              <Link
                href={`/work/${item.slug}`}
                className={`${cardClass({ radius: 24, interactive: true, surface: true, spot: true })} press caps-related`}
              >
                <span aria-hidden="true" className="spot-light" />
                <span className="flex min-w-0 flex-col gap-[2px]">
                  <span className="t-lede text-ink">{item.name}</span>
                  <span className="t-mono-11 tabular-nums text-ink-3">
                    {/* Each term holds together, so a narrow card breaks the
                        line at a dot, never inside "In development". */}
                    {[item.year, item.category, sentence(item.state)].map((t, k) => (
                      <span key={t}>
                        {k > 0 ? ' · ' : null}
                        <span className="whitespace-nowrap">{t}</span>
                      </span>
                    ))}
                  </span>
                </span>
                <span className="dot-btn">
                  <Chevron />
                </span>
              </Link>
            </Spotlight>
          </li>
        ))}
      </ul>
    </div>
  );
}
