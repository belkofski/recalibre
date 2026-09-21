import { Rise, InView, Decode } from '@/lib/motion';
import { STATEMENT } from '@/content/home';

/* ============================================================================
   THE STATEMENT — block 03. Measured 1298px, 150px of top padding.

   The reference sets "4 sprints / 8 check ins / 3 stages" at 78px, with a
   chip strip beneath it and a paragraph under that.

   Every number the reference prints here is a delivery-cadence claim.
   Recalibre publishes no cadence, so the statement carries the three facts
   the founder named as structural: five capabilities, three stages, one team.
   All three are countable from this site. The chip strip keeps its exact
   geometry and runs the five capability names.
   ========================================================================= */
export default function Statement() {
  return (
    <section aria-labelledby="statement-head" className="w-full overflow-clip pad-top">
      <div className="shell pad-x flex w-full flex-col">
        <Rise
          as="h2"
          id="statement-head"
          lines={STATEMENT.lines}
          className="t-statement max-w-[16ch] text-ink"
        />

        {/* the chip strip */}
        <InView className="mt-[48px] flex flex-wrap items-center gap-[8px]" delay={80}>
          {STATEMENT.chips.map((c) => (
            <span key={c} className="tag t-tag">
              {c}
            </span>
          ))}
        </InView>

        <InView className="mt-[40px] border-t border-rule-3 pt-[28px]" delay={140}>
          <Decode text={STATEMENT.body} className="t-body-lg max-w-[62ch] text-ink-2" />
        </InView>
      </div>
    </section>
  );
}
