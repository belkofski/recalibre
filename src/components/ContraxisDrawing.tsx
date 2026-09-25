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

   ── WHY THERE ARE TWO LAYOUTS ─────────────────────────────────────────────

   The card in the work grid used to carry a photograph: the 22.57.47 render
   of a machine over a cube, which is a Belkofski brand picture with a pair
   of orange-lensed frames set into the face of it. On a card labelled
   "document intelligence" that read as evidence of a product, and it was
   evidence of a different product entirely.

   The drawing takes that slot instead — the one honest picture of a concept
   is a picture of how it is meant to work. `page` is the tall layout for a
   panel of its own; `card` is the wide one that leaves the lower third of a
   card free for its title and tags.

   ── AND WHY THERE IS A PHONE LAYOUT ───────────────────────────────────────

   An SVG scales uniformly, so a 600-unit drawing rendered into a 350px phone
   column renders its 14-unit labels at eight pixels. The diagram was still
   there and nobody could read a word of it. The phone layout is 360 units
   wide with the same five steps stacked, so the type lands near its nominal
   size at the width a phone actually gives it.
   ========================================================================= */

const RULE = 'rgba(255,255,255,0.22)';
const FAINT = 'rgba(255,255,255,0.10)';
const LIME = '#c7ff97';

/* THE CARD DRAWS DARKER THAN THE PAGE DOES, so it needs more ink.
   On the detail page the schematic has a panel to itself and a reader who
   has already stopped. In the work grid it sits between two photographs at
   687px, and 0.22 white on near-black at a 1.3px stroke read as an empty
   card — the one that did not fill. These are the same lines with enough
   weight to hold their own beside a picture. */
const C_RULE = 'rgba(255,255,255,0.40)';
const C_FAINT = 'rgba(255,255,255,0.17)';
const C_LABEL = 'rgba(255,255,255,0.90)';

const NODES = [
  { n: '02', label: 'FINDINGS' },
  { n: '03', label: 'ACTIONS' },
  { n: '04', label: 'TRACEABILITY' },
] as const;

const DESCRIPTION =
  'A schematic of Contraxis: a document is read, findings are surfaced, actions are proposed and every step is recorded — and a person makes the decision at the end.';

export default function ContraxisDrawing({ variant = 'page' }: { variant?: 'page' | 'card' }) {
  return (
    <>
      {variant === 'card' ? <CardDrawing /> : <PageDrawing />}
      <PhoneDrawing />
    </>
  );
}

function PageDrawing() {
  return (
    <svg
      viewBox="0 0 600 600"
      role="img"
      aria-label={DESCRIPTION}
      className="size-full max-h-[86%] max-w-[86%] mobile:hidden"
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

/**
 * The phone layout: 360 units wide, so a label set at 16 units renders at
 * about 15 pixels in a 350px column instead of the eight it was getting.
 */
function PhoneDrawing() {
  return (
    <svg
      viewBox="0 0 360 470"
      role="img"
      aria-label={DESCRIPTION}
      className="hidden w-full mobile:block"
      fontFamily="var(--font-mono)"
    >
      <g stroke={FAINT} strokeWidth="1">
        <line x1="20" y1="26" x2="340" y2="26" />
        <line x1="20" y1="26" x2="20" y2="446" />
        <line x1="340" y1="26" x2="340" y2="446" />
      </g>

      <text x="40" y="58" fill={RULE} fontSize="15" letterSpacing="1.8">
        01 · DOCUMENT
      </text>
      <rect x="40" y="72" width="88" height="112" fill="none" stroke={RULE} strokeWidth="1.3" />
      <g stroke={RULE} strokeWidth="1" opacity="0.5">
        <line x1="56" y1="98" x2="112" y2="98" />
        <line x1="56" y1="116" x2="112" y2="116" />
        <line x1="56" y1="134" x2="92" y2="134" />
      </g>
      <line x1="84" y1="184" x2="84" y2="206" stroke={RULE} strokeWidth="1.3" />
      <path d="M78 198 L84 208 L90 198 Z" fill={RULE} />

      {NODES.map((node, i) => {
        const y = 212 + i * 46;
        return (
          <g key={node.n}>
            <rect x="40" y={y} width="280" height="36" fill="none" stroke={RULE} strokeWidth="1.3" />
            <circle cx="62" cy={y + 18} r="4" fill="none" stroke={RULE} strokeWidth="1.2" />
            <text x="80" y={y + 23} fill="rgba(255,255,255,0.74)" fontSize="16" letterSpacing="1.5">
              {node.label}
            </text>
            <text x="292" y={y + 23} fill={FAINT} fontSize="14" letterSpacing="1.4">
              {node.n}
            </text>
          </g>
        );
      })}

      <line x1="180" y1="350" x2="180" y2="372" stroke={RULE} strokeWidth="1.2" strokeDasharray="5 6" />

      <rect x="40" y="372" width="280" height="50" fill="none" stroke={LIME} strokeWidth="1.4" />
      <text x="62" y="403" fill={LIME} fontSize="17" letterSpacing="1.4">
        05 · A PERSON DECIDES
      </text>

      <text x="40" y="446" fill="rgba(255,255,255,0.34)" fontSize="13" letterSpacing="1.8">
        SCHEMATIC — NOT A SCREENSHOT
      </text>
    </svg>
  );
}

/**
 * The card layout: the same five steps laid out across rather than down, so
 * the lower third of the card stays clear for the title, the meta line and
 * the tags that every other card in the grid carries in that position.
 */
function CardDrawing() {
  /* The same five steps as the page drawing, laid out across rather than
     down, but sized to the card it actually sits in.

     IT USED TO BE A 600x360 LANDSCAPE INSIDE A 687x687 SQUARE, centred, so a
     quarter of the card above the drawing was empty black and the card read
     as unfinished next to the two that carry a photograph edge to edge. It
     is 600x470 now and sits to the top of the card, which leaves the lower
     band clear for the title, the meta line and the tags exactly as before
     while the drawing itself fills the space the picture would have. */
  return (
    <svg
      viewBox="0 0 600 470"
      role="img"
      aria-label={DESCRIPTION}
      className="w-full mobile:hidden"
      fontFamily="var(--font-mono)"
    >
      <g stroke={C_FAINT} strokeWidth="1">
        <line x1="40" y1="40" x2="560" y2="40" />
        <line x1="40" y1="40" x2="40" y2="440" />
        <line x1="560" y1="40" x2="560" y2="440" />
      </g>

      {/* 01 — the document */}
      <text x="72" y="76" fill={C_RULE} fontSize="14" letterSpacing="2.2">
        01 · DOCUMENT
      </text>
      <rect x="72" y="92" width="130" height="210" fill="none" stroke={C_RULE} strokeWidth="1.3" />
      <g stroke={C_RULE} strokeWidth="1" opacity="0.5">
        <line x1="94" y1="130" x2="180" y2="130" />
        <line x1="94" y1="158" x2="180" y2="158" />
        <line x1="94" y1="186" x2="150" y2="186" />
        <line x1="94" y1="226" x2="180" y2="226" />
      </g>

      <line x1="202" y1="197" x2="282" y2="197" stroke={C_RULE} strokeWidth="1.3" />
      <path d="M274 191 L284 197 L274 203 Z" fill={C_RULE} />

      {/* 02–04 */}
      {NODES.map((node, i) => {
        const y = 92 + i * 72;
        return (
          <g key={node.n}>
            <rect x="296" y={y} width="200" height="50" fill="none" stroke={C_RULE} strokeWidth="1.3" />
            <circle cx="320" cy={y + 25} r="3.5" fill="none" stroke={C_RULE} strokeWidth="1.2" />
            <text x="338" y={y + 30} fill={C_LABEL} fontSize="13.5" letterSpacing="1.7">
              {node.label}
            </text>
            {i < NODES.length - 1 ? (
              <line x1="396" y1={y + 50} x2="396" y2={y + 72} stroke={C_RULE} strokeWidth="1.2" />
            ) : null}
          </g>
        );
      })}

      {/* THE HANDOVER AND THE DECISION BAR SIT 28 LOWER THAN THEY DID, to
          clear the card's centre mark.

          The reference centres a 156 x 100 mark on every card, and on a
          photograph there is nothing for it to land on. Here there was: the
          mark's box maps to x 221-376, y 250-350 in this viewBox, and the
          dashed handover ran straight through it at y=340. Dropping the
          path and the bar by 28 puts the horizontal at y=368 and the bar at
          368-432 — still inside the 470 height, and the two verticals at
          x=137 and x=396 fall outside the box on either side. Nothing in
          the drawing crosses the mark now. */}
      <g stroke={C_RULE} strokeWidth="1.2" strokeDasharray="5 6">
        <line x1="396" y1="286" x2="396" y2="368" />
        <line x1="137" y1="302" x2="137" y2="368" />
        <line x1="137" y1="368" x2="396" y2="368" />
      </g>

      {/* 05 */}
      <rect x="72" y="368" width="424" height="64" fill="none" stroke={LIME} strokeWidth="1.4" />
      <text x="96" y="407" fill={LIME} fontSize="17" letterSpacing="1.8">
        05 · A PERSON DECIDES
      </text>
      <circle cx="462" cy="400" r="8" fill="none" stroke={LIME} strokeWidth="1.3" />
      <circle cx="462" cy="400" r="3" fill={LIME} />

      <text x="476" y="76" fill="rgba(255,255,255,0.48)" fontSize="12" letterSpacing="2">
        SCHEMATIC
      </text>
    </svg>
  );
}
