import { TickRule } from '@/components/ui';

/* ============================================================================
   THE TYPE PLATE — chapter 03's visual, which is no picture at all.

   No systems proof that is not OPS exists (the permits register is on the
   Work square, the overview on the television, the report on chapter 02),
   and the owner's Phase A brief chose an honest empty slot over fake proof.
   So the plate carries the chapter's own three tags at card size on the
   dark ground, each on its own hairline, filling the box the other
   chapters give to a picture. Home's index (sections/home/CapabilityIndex)
   draws the same plate in its card; this is the page's copy, laid as three
   equal rows so the plate reads as a set, not as words pushed to a corner.
   ========================================================================= */
export default function TypePlate({ tags }: { tags: readonly string[] }) {
  return (
    <div aria-hidden="true" className="caps-plate absolute inset-0 p-(--card-pad)">
      {tags.map((t) => (
        <div key={t} className="caps-plate-row">
          <p className="t-card text-ink">{t}</p>
          <TickRule />
        </div>
      ))}
    </div>
  );
}
