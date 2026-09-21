/* ============================================================================
   CONTRAXIS — A DRAWING, AND IT LOOKS LIKE ONE.

   Twenty-two Contraxis images exist in the asset register and every one of
   them is quarantined: no Contraxis screenshot may be published. The one
   image in the working `assets` folder named for Contraxis is a capture of a
   different company's analytics product and is withheld for that reason.

   So this slot gets a drawing. The hard part is making sure it can never be
   mistaken for an interface, because a drawing dressed up as a screenshot is
   the same lie told more slowly. It is built as a schematic: hairline rules,
   mono labels, no window chrome, no fake data, no rounded application
   panels, and it says on its own face that it is an illustration.

   WHAT IT SHOWS is the five steps the founder's own description names:
   read the document, surface the findings, propose the action, keep the
   trail, and leave the decision with a person. Nothing about volume, speed,
   accuracy or adoption, because none of that exists yet.
   ========================================================================= */

const RULE = 'rgba(255,255,255,0.22)';
const FAINT = 'rgba(255,255,255,0.10)';
const LIME = '#c7ff97';

const NODES = [
  { n: '02', label: 'FINDINGS' },
  { n: '03', label: 'ACTIONS' },
  { n: '04', label: 'TRACEABILITY' },
] as const;

export default function ContraxisDrawing() {
  return (
    <svg
      viewBox="0 0 600 600"
      role="img"
      aria-label="A schematic of the Contraxis concept: a document is read, findings are surfaced, actions are proposed and every step is recorded — and a person makes the decision at the end."
      className="size-full max-h-[86%] max-w-[86%]"
      fontFamily="var(--font-mono)"
    >
      {/* the measurement field the whole drawing sits on */}
      <g stroke={FAINT} strokeWidth="1">
        <line x1="60" y1="40" x2="60" y2="560" />
        <line x1="540" y1="40" x2="540" y2="560" />
        <line x1="60" y1="40" x2="540" y2="40" />
        <line x1="60" y1="560" x2="540" y2="560" />
      </g>

      {/* 01 — the document */}
      <g>
        <rect x="120" y="86" width="150" height="190" fill="none" stroke={RULE} strokeWidth="1.2" />
        <g stroke={RULE} strokeWidth="1" opacity="0.55">
          <line x1="142" y1="124" x2="248" y2="124" />
          <line x1="142" y1="146" x2="248" y2="146" />
          <line x1="142" y1="168" x2="212" y2="168" />
          <line x1="142" y1="206" x2="248" y2="206" />
          <line x1="142" y1="228" x2="226" y2="228" />
        </g>
        <text x="120" y="72" fill={RULE} fontSize="15" letterSpacing="2.4">
          01 · DOCUMENT
        </text>
        {/* the arrow across to the nodes */}
        <line x1="270" y1="181" x2="360" y2="181" stroke={RULE} strokeWidth="1.2" />
        <path d="M352 175 L362 181 L352 187 Z" fill={RULE} />
      </g>

      {/* 02–04 — what the system does with it */}
      {NODES.map((node, i) => {
        const y = 118 + i * 64;
        return (
          <g key={node.n}>
            <rect x="370" y={y} width="170" height="44" fill="none" stroke={RULE} strokeWidth="1.2" />
            <circle cx="392" cy={y + 22} r="4" fill="none" stroke={RULE} strokeWidth="1.2" />
            <text x="408" y={y + 27} fill="rgba(255,255,255,0.72)" fontSize="14" letterSpacing="1.8">
              {node.label}
            </text>
            <text x="346" y={y + 27} fill={FAINT} fontSize="13" letterSpacing="1.6">
              {node.n}
            </text>
            {i < NODES.length - 1 ? (
              <line x1="455" y1={y + 44} x2="455" y2={y + 64} stroke={RULE} strokeWidth="1.2" />
            ) : null}
          </g>
        );
      })}

      {/* the handover line */}
      <line x1="455" y1="306" x2="455" y2="376" stroke={RULE} strokeWidth="1.2" strokeDasharray="5 6" />
      <line x1="195" y1="276" x2="195" y2="376" stroke={RULE} strokeWidth="1.2" strokeDasharray="5 6" />
      <line x1="195" y1="376" x2="455" y2="376" stroke={RULE} strokeWidth="1.2" strokeDasharray="5 6" />

      {/* 05 — the step that is not automated */}
      <g>
        <rect x="120" y="404" width="360" height="72" fill="none" stroke={LIME} strokeWidth="1.4" />
        <text x="146" y="438" fill={LIME} fontSize="14" letterSpacing="2">
          05
        </text>
        <text x="146" y="462" fill={LIME} fontSize="20" letterSpacing="1.6">
          A PERSON DECIDES
        </text>
        <circle cx="450" cy="440" r="10" fill="none" stroke={LIME} strokeWidth="1.4" />
        <circle cx="450" cy="440" r="3.5" fill={LIME} />
      </g>

      <text x="120" y="524" fill="rgba(255,255,255,0.34)" fontSize="13" letterSpacing="2.2">
        SCHEMATIC — NOT A SCREENSHOT
      </text>
    </svg>
  );
}
