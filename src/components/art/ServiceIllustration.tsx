import type { ServiceSlug } from '@/content/services';

/* ============================================================================
   ONE DRAWING PER SERVICE (4 November 2026).

   The audit found every capability card borrowing a project's picture — a
   Contraxis schematic, an OPS report, an ABP photograph, a Belkofski cube —
   and no service with a visual of its own. These five are the services'
   own: line drawings in the site's tokens (1.5px strokes in ink at 35%, the
   accent blue for the one thing each drawing is about, the raised ground
   for tiles), on the same dot grid, in the same 418 x 278 box the About
   chapters use for their pictures. Nothing in them is a screenshot and
   nothing is a claim: they draw the shape of the work, not an instance of
   it. Token-driven, so a palette change re-skins all five.

   Each is a server-rendered SVG; there is no script and no motion in them.
   The interactions work package adds the workflow canvas beside them on the
   Advanced Solutions page; these stay still.
   ========================================================================= */

const W = 418;
const H = 278;

function Grid({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.9" className="fill-ink/12" />
      </pattern>
    </defs>
  );
}

function Frame({ id, children, title }: { id: string; children: React.ReactNode; title: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={title}
      className="block h-full w-full"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Grid id={id} />
      <rect width={W} height={H} fill={`url(#${id})`} />
      {children}
    </svg>
  );
}

/* Shared strokes. `ill` is the hairline ink; `ill-a` the accent. */
const L = 'stroke-ink/35 stroke-[1.5]';
const A = 'stroke-accent-bright stroke-[1.5]';
const TILE = 'fill-raised stroke-ink/25 stroke-[1.5]';

/* ---------------------------------------------------------------- /01 */
function Agentic() {
  return (
    <Frame id="ill-agentic" title="A document read by an agent, its proposal handed to a person who decides, and the decision fed back.">
      {/* the document */}
      <rect x="28" y="92" width="76" height="94" rx="8" className={TILE} />
      <path d="M44 116h44M44 132h44M44 148h30" className={L} />
      {/* the agent */}
      <path d="M190 84l40 0 20 35-20 35-40 0-20-35z" className={`fill-raised ${A}`} />
      <path d="M200 104h18L210 136h-9zM216 104h9l-8 32h-9z" className="fill-accent-bright" />
      {/* the person */}
      <circle cx="350" cy="120" r="34" className={TILE} />
      <circle cx="350" cy="110" r="9" className={L} />
      <path d="M332 142c3-12 11-18 18-18s15 6 18 18" className={L} />
      <path d="M338 160l8 8 16-18" className={A} />
      {/* edges */}
      <path d="M104 139h66" className={L} />
      <path d="M250 119h66" className={L} />
      <circle cx="140" cy="139" r="3.5" className="fill-accent-bright" />
      <circle cx="284" cy="119" r="3.5" className="fill-accent-bright" />
      {/* the trail back */}
      <path d="M350 154v40H210v-40" className={`${L} [stroke-dasharray:3_6]`} />
      <path d="M204 122l6-8 6 8" className={L} />
      {/* the record */}
      <rect x="150" y="206" width="118" height="44" rx="8" className={TILE} />
      <path d="M166 222h86M166 236h54" className={L} />
    </Frame>
  );
}

/* ---------------------------------------------------------------- /02 */
function Software() {
  return (
    <Frame id="ill-software" title="An operations console: a sidebar, three counters, a trend line and a register.">
      <rect x="30" y="34" width="358" height="210" rx="12" className={TILE} />
      <path d="M30 62h358" className={L} />
      <path d="M102 62v182" className={L} />
      <circle cx="48" cy="48" r="3" className="fill-ink/35" />
      <circle cx="60" cy="48" r="3" className="fill-ink/35" />
      <path d="M46 84h40M46 100h32M46 116h36M46 132h28" className={L} />
      <path d="M46 152h40" className={A} />
      {/* counters */}
      <rect x="120" y="78" width="78" height="42" rx="8" className={L} />
      <rect x="210" y="78" width="78" height="42" rx="8" className={L} />
      <rect x="300" y="78" width="72" height="42" rx="8" className={L} />
      <path d="M132 92h30M222 92h30M312 92h26" className={L} />
      <path d="M132 108h18M222 108h24M312 108h14" className={A} />
      {/* trend */}
      <rect x="120" y="134" width="252" height="52" rx="8" className={L} />
      <path d="M132 176l34-12 30 6 32-20 34 8 30-16 36 10 24-18" className={A} />
      {/* register */}
      <path d="M120 204h252M120 220h252M120 236h252" className={L} />
      <circle cx="128" cy="212" r="2.5" className="fill-accent-bright" />
      <circle cx="128" cy="228" r="2.5" className="fill-ink/35" />
    </Frame>
  );
}

/* ---------------------------------------------------------------- /03 */
function Integration() {
  return (
    <Frame id="ill-integration" title="Four systems connected through one source of operational data.">
      {/* the four systems */}
      <rect x="40" y="48" width="86" height="54" rx="8" className={TILE} />
      <rect x="292" y="48" width="86" height="54" rx="8" className={TILE} />
      <rect x="40" y="176" width="86" height="54" rx="8" className={TILE} />
      <rect x="292" y="176" width="86" height="54" rx="8" className={TILE} />
      <path d="M56 68h40M56 82h26M308 68h40M308 82h30M56 196h34M56 210h24M308 196h40M308 210h20" className={L} />
      {/* the source of truth */}
      <rect x="164" y="98" width="90" height="82" rx="12" className={`fill-raised ${A}`} />
      <ellipse cx="209" cy="124" rx="24" ry="8" className={L} />
      <path d="M185 124v30c0 4.4 10.7 8 24 8s24-3.6 24-8v-30" className={L} />
      <path d="M185 139c0 4.4 10.7 8 24 8s24-3.6 24-8" className={L} />
      {/* elbows */}
      <path d="M126 75h24v39h14" className={L} />
      <path d="M292 75h-24v39h-14" className={L} />
      <path d="M126 203h24v-39h14" className={L} />
      <path d="M292 203h-24v-39h-14" className={A} />
      <circle cx="150" cy="96" r="3.5" className="fill-accent-bright" />
      <circle cx="268" cy="184" r="3.5" className="fill-accent-bright" />
    </Frame>
  );
}

/* ---------------------------------------------------------------- /04 */
function Design() {
  return (
    <Frame id="ill-design" title="A laptop and a phone carrying the same layout, one block selected for editing.">
      {/* laptop */}
      <rect x="40" y="48" width="236" height="150" rx="10" className={TILE} />
      <path d="M24 214h268" className={L} />
      <path d="M40 198l-8 16M276 198l8 16" className={L} />
      <path d="M60 76h80M60 92h56" className={L} />
      <rect x="60" y="110" width="92" height="66" rx="6" className={`${A} [stroke-dasharray:4_4]`} />
      <rect x="57" y="107" width="6" height="6" className="fill-accent-bright" />
      <rect x="149" y="107" width="6" height="6" className="fill-accent-bright" />
      <rect x="57" y="173" width="6" height="6" className="fill-accent-bright" />
      <rect x="149" y="173" width="6" height="6" className="fill-accent-bright" />
      <rect x="166" y="110" width="90" height="30" rx="6" className={L} />
      <rect x="166" y="148" width="90" height="28" rx="6" className={L} />
      {/* phone */}
      <rect x="302" y="80" width="80" height="150" rx="14" className={TILE} />
      <path d="M330 94h24" className={L} />
      <path d="M316 114h52M316 128h36" className={L} />
      <rect x="316" y="144" width="52" height="40" rx="6" className={A} />
      <rect x="316" y="192" width="52" height="22" rx="6" className={L} />
      {/* cursor */}
      <path d="M118 150l20 8-8 3-3 8z" className="fill-ink stroke-ground stroke-[1.5]" />
    </Frame>
  );
}

/* ---------------------------------------------------------------- /05 */
function Brand() {
  return (
    <Frame id="ill-brand" title="An identity system: the mark, the type, the colour and the grid, each on its own tile.">
      <rect x="36" y="40" width="166" height="96" rx="10" className={TILE} />
      <rect x="216" y="40" width="166" height="96" rx="10" className={TILE} />
      <rect x="36" y="150" width="166" height="88" rx="10" className={TILE} />
      <rect x="216" y="150" width="166" height="88" rx="10" className={TILE} />
      {/* the mark */}
      <path d="M94 66h18l-18 44H76zM120 66h18l-18 44h-18zM146 66h18l-18 44h-18z" className="fill-accent-bright" />
      {/* the type */}
      <text x="244" y="110" className="fill-ink font-sans text-[54px] font-light tracking-[-0.04em]">
        Aa
      </text>
      <path d="M332 70h36M332 86h28M332 102h32" className={L} />
      {/* the colour */}
      <circle cx="76" cy="194" r="18" className="fill-accent-bright" />
      <circle cx="122" cy="194" r="18" className="fill-ink" />
      <circle cx="168" cy="194" r="18" className={`fill-raised-2 ${L}`} />
      {/* the grid */}
      <path d="M232 172h134M232 190h134M232 208h134M232 226h134" className={L} />
      <path d="M260 160v70M300 160v70M340 160v70" className={L} />
      <rect x="260" y="190" width="40" height="18" className="fill-accent-bright/70" />
    </Frame>
  );
}

const DRAWINGS: Record<ServiceSlug, () => React.ReactElement> = {
  'agentic-ai-and-automation': Agentic,
  'custom-software-development': Software,
  'enterprise-systems-and-integration': Integration,
  'product-and-experience-design': Design,
  'brand-strategy-and-identity': Brand,
};

export default function ServiceIllustration({ id, className = '' }: { id: ServiceSlug; className?: string }) {
  const Drawing = DRAWINGS[id];
  return (
    <div className={`relative aspect-[418/278] w-full overflow-clip ${className}`}>
      <Drawing />
    </div>
  );
}
