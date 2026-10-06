import Link from 'next/link';
import { InView } from '@/lib/motion';
import { cardClass, Chevron, LabelRow, Status } from '@/components/ui';
import { initiativeBySlug, type Initiative } from '@/content/work';

/* ============================================================================
   IN THE WORK — the initiatives that show a capability in use, under its
   chapter: compact link rows, not work cards (the pictures belong to /work
   and the chapter has just shown its own). Each row is one link carrying
   the card (`cardClass` on the link itself, as WorkCard does): the name at
   card size, the year and the field, the initiative's status as the one
   `Status` shape, and the dot at the right that fills under the pointer.

   The names come off `related` in content/home.ts and resolve through
   content/work.ts, so a row prints only an initiative that has a page. A
   capability with no related work (03, until a systems proof that is not
   OPS exists) prints nothing here at all: no label, no empty plate.
   ========================================================================= */
export default function RelatedWork({ slugs, label }: { slugs: readonly string[]; label: string }) {
  const items = slugs.map((s) => initiativeBySlug(s)).filter((i): i is Initiative => Boolean(i));
  if (items.length === 0) return null;
  return (
    <div className="flex w-full flex-col gap-(--space-4)">
      <LabelRow label={label} />
      {/* Two rows side by side where there are two, one full-width row
          where there is one: a seam plate never shows an empty cell. */}
      <div className={`seam-sm grid ${items.length > 1 ? 'grid-cols-2 phone:grid-cols-1' : 'grid-cols-1'}`}>
        {items.map((item, i) => (
          <InView key={item.slug} step={i} className="flex phone:[--in-delay:0ms]!">
            <Link
              href={`/work/${item.slug}`}
              aria-label={`${item.name}: ${item.category}`}
              className={`${cardClass({ radius: 24, pad: true, interactive: true })} caps-related w-full`}
            >
              <span className="flex min-w-0 flex-col gap-(--space-2)">
                <span className="t-card text-ink">{item.name}</span>
                <span className="flex flex-wrap items-center gap-x-(--space-3) gap-y-(--space-1)">
                  <span className="t-mono tabular-nums text-ink-3">
                    {item.year} · {item.category}
                  </span>
                  <Status state={item.tone === 'dev' ? 'development' : 'delivered'} className="text-ink-2">
                    {item.status}
                  </Status>
                </span>
              </span>
              <span className="dot-btn">
                <Chevron />
              </span>
            </Link>
          </InView>
        ))}
      </div>
    </div>
  );
}
