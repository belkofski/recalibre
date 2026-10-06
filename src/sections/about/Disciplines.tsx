import type { CSSProperties } from 'react';
import { InView } from '@/lib/motion';
import { LabelRow } from '@/components/ui';
import { ABOUT as A } from '@/content/about';

/* ============================================================================
   THE DISCIPLINES — the five that carry an engagement, as a 01–05 system.

   The reference runs a four-portrait team grid here. Recalibre publishes
   no employee, so the grid has been the disciplines since the page was
   built; on 6 October 2026 (the owner's audit) the five cards became one
   vertical list on a hairline spine. The spine draws downward as the list
   comes in (`.flow-vertical`, the flow line of the stages rail turned on
   its side) and a node lights on it at each row, one after another
   (`.flow-node`, `--i`); each row's words fade up on their own, a beat
   apart. Every row is laid on the same three tracks — ordinal, title, body
   — so the five titles share one left edge and the five bodies another,
   which is what the old subgrid did across five columns.

   THE ORDINALS ARE BACK. Phase C (29 September 2026) took the 01–05 off the
   cards because the disciplines are not in an order and a number over them
   only counted content. The audit's brief restores them as the spine's
   index: the number names a place on the line, as a chapter number names
   a place in a case study, and the content keeps `n` for exactly that.

   NO HEADING OF ITS OWN. The content carries no headline for this list,
   and none is invented: the block opens on its label row, and its rows are
   h3s under the organized block's "Why it is structured this way.", whose
   first paragraph names these five as one capability — the list is that
   paragraph, itemised.
   // TODO(content): a headline for the disciplines block, if the owner
   // wants one over the list.

   Below 1200 the title and body stack in the right-hand track beside the
   ordinal; on a phone the spine's inset and the row's padding close up.
   ========================================================================= */
export default function Disciplines() {
  return (
    <section aria-label="The disciplines" className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-label)">
        <LabelRow label="THE DISCIPLINES" />

        {/* The wrapper is the spine's own reveal: a fade with no travel (the
            plate tier), so the rows' 24px rise is the only rise. Its `is-in`
            is what draws the line. */}
        <InView mode="picture" className="flow-vertical about-spine w-full">
          <span aria-hidden="true" className="flow-line about-spine-line" />
          <ol className="flex w-full flex-col">
            {A.disciplines.map((d, i) => (
              <InView
                as="li"
                key={d.n}
                delay={i * 60}
                className="about-disc"
                style={{ '--i': i } as CSSProperties}
              >
                <span aria-hidden="true" className="flow-node about-node" />
                <div className="about-disc-row grid grid-cols-[minmax(0,96px)_minmax(0,5fr)_minmax(0,7fr)] items-start gap-x-(--space-5) gap-y-(--space-3) py-(--space-6) narrow:grid-cols-[64px_minmax(0,1fr)] mobile:py-(--space-5) phone:grid-cols-[40px_minmax(0,1fr)]">
                  <span className="t-mono-11 pt-(--space-1) tabular-nums text-ink-3">{d.n}</span>
                  <h3 className="t-card text-ink">{d.title}</h3>
                  <p className="t-body max-w-[480px] text-ink-2 narrow:col-start-2">{d.body}</p>
                </div>
              </InView>
            ))}
          </ol>
        </InView>
      </div>
    </section>
  );
}
