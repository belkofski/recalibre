/* ============================================================================
   CONTRAXIS — A DRAWING, AND IT LOOKS LIKE ONE.

   Twenty-two Contraxis images exist in the asset register and every one of
   them is quarantined: no Contraxis screenshot may be published. The one
   image in the working `assets` folder named for Contraxis is a capture of a
   different company's analytics product and is withheld for that reason.

   So this slot gets a drawing. The hard part is making sure it can never be
   mistaken for an interface, because a drawing dressed up as a screenshot is
   the same lie told more slowly. It is deliberately built as a diagram:
   hairline rules, mono labels, no window chrome, no fake data, no rounded
   application panels, and the caption under every instance of it says
   "Illustration — not a screenshot."

   WHAT IT SHOWS is the five steps the founder's own description names:
   read the document, surface the findings, propose the action, keep the
   trail, and leave the decision with a person. Nothing about volume, speed,
   accuracy or adoption, because none of that exists yet.
   ========================================================================= */

const STEPS = [
  { n: '01', label: 'DOCUMENT', note: 'Contract, invoice, report' },
  { n: '02', label: 'FINDINGS', note: 'Terms, dates, obligations' },
  { n: '03', label: 'ACTIONS', note: 'Proposed, not executed' },
  { n: '04', label: 'TRACEABILITY', note: 'Every step recorded' },
] as const;

export default function ContraxisDrawing() {
  return (
    <div
      role="img"
      aria-label="A diagram of the Contraxis concept: a document is read, findings are surfaced, actions are proposed and every step is recorded — and a person makes the decision at the end."
      className="flex h-full w-full flex-col justify-center gap-[10px] bg-ground p-[22px]"
    >
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center gap-[12px]">
          <span className="t-mono-9 w-[18px] shrink-0 text-ink-3">{s.n}</span>

          {/* the node */}
          <span className="flex min-w-0 flex-1 items-center gap-[10px] border-t border-rule-2 pt-[8px]">
            <span
              aria-hidden="true"
              className="block h-[6px] w-[6px] shrink-0 rounded-full border border-ink-3"
            />
            <span className="t-mono-9 truncate text-ink-2">{s.label}</span>
            <span className="t-mono-9 ml-auto hidden truncate text-ink-3 tablet:inline">{s.note}</span>
          </span>

          {/* the connector, on every row but the last */}
          {i < STEPS.length - 1 ? (
            <span aria-hidden="true" className="t-mono-9 shrink-0 text-ink-3">
              ↓
            </span>
          ) : null}
        </div>
      ))}

      {/* the step that is not automated */}
      <div className="mt-[6px] flex items-center gap-[12px] border-t border-rule pt-[12px]">
        <span className="t-mono-9 w-[18px] shrink-0 text-lime">05</span>
        <span className="t-mono-9 text-lime">A PERSON DECIDES</span>
      </div>
    </div>
  );
}
