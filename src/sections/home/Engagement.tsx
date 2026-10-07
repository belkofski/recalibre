import { Fragment, type CSSProperties } from 'react';
import { InView, Rise, Scene, Spotlight } from '@/lib/motion';
import { Btn, Chevron, GlyphTile, Numeral, TickRule, cardClass, type GlyphName } from '@/components/ui';
import { ENGAGEMENT, STAGES_FLOW } from '@/content/home';

/* ============================================================================
   THE THREE STAGES (Home; About draws the flow rail alone, `StagesFlow`).

   The heading alone opens the block. Over the cards, the flow rail: the
   three stages as glyph tiles on one hairline, each over its card, with a
   chevron between each pair and, on Home, a hairline dropping from each
   tile to its card. On a phone the rail turns and runs down the left. The
   rail repeats the cards' titles, so it is hidden from assistive
   technology: the cards are the content, the rail is the picture of it.

   EACH STAGE, cut in the third pass to what a reader needs: its title,
   its one line, and what you receive at the end of it. The lists of
   points, the scope lines and the footnote under the heading are not
   printed here (they stay in content/home.ts; the footer's card reads
   two of them). The one button, "Start a calibration", stays in stage
   one, the only way in; its edge is drawn in the signal blue.

   WITH THE SCROLL (Home). The section is a scene: the rail's line draws
   across as the block moves up the window (`.flow-rail-draw`, home.css,
   read off --sp, so it follows the scroll both ways), the nodes light in
   order once the rail is in view, and the three cards come up one after
   another (`.sx-stagger`, on the list). Where About draws the rail it
   keeps its one-shot draw (`.flow-line`).

   THE ROWS LINE UP. From 1024 every card is a subgrid of the plate's four
   rows (title, line, what you receive, the button's row), so the longest
   line sets where every YOU GET starts. No number reserves a height.
   ========================================================================= */

type Stage = (typeof ENGAGEMENT.cards)[number];

/** How many stages the indicator counts across. */
const STAGE_COUNT = ENGAGEMENT.cards.length;

/** The glyph each stage's node carries: the plan, the build, the support.
 *  Structural pictures of the three words, not claims. */
const FLOW_GLYPHS: Record<(typeof STAGES_FLOW.nodes)[number]['n'], GlyphName> = {
  '01': 'plan',
  '02': 'build',
  '03': 'support',
};

/** What the buyer leaves each stage with: a structural label. */
const YOU_GET = 'YOU GET';

/* ---------------------------------------------------------------------------
   THE RAIL. One hairline, three nodes, two chevrons; the nodes and the
   chevrons carry `--i` in order along the line (0, 0.5, 1, 1.5, 2), so each
   lights after the one before it. `scroll` (Home) draws the line with the
   scroll instead of once on arrival; it needs a `Scene` ancestor.
   ------------------------------------------------------------------------ */
export function StagesFlow({
  className = '',
  drops = false,
  scroll = false,
}: {
  className?: string;
  drops?: boolean;
  scroll?: boolean;
}) {
  const at = (i: number) => ({ '--i': String(i) }) as CSSProperties;
  return (
    <div aria-hidden="true" className={`w-full ${className}`}>
      <InView className={`flow-rail${drops ? ' flow-rail-drops' : ''}`}>
        <span className={`${scroll ? 'flow-rail-draw' : 'flow-line'} flow-rail-line pulse-line`} />
        {STAGES_FLOW.nodes.map((node, i) => (
          <Fragment key={node.n}>
            {i > 0 ? (
              <span className="flow-node flow-rail-chev" style={at(i - 0.5)}>
                <Chevron className="text-ink-3" />
              </span>
            ) : null}
            <span className="flow-node flow-rail-node" style={at(i)}>
              {/* The tile's own box, so the drop can hang from its foot. */}
              <span className="flow-rail-tile">
                <GlyphTile name={FLOW_GLYPHS[node.n]} signal={i === 0} />
              </span>
              <span className="t-mono-11 tabular-nums text-ink-3">{node.n}</span>
              <span className="t-mono text-ink">{node.label}</span>
            </span>
          </Fragment>
        ))}
      </InView>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   ONE STAGE. The list item is the stagger's box (it moves); the card inside
   it is the spotlight's (it lights), so the two never share an element.
   From 1024 both are subgrids of the plate's four rows.
   ------------------------------------------------------------------------ */
function StageCard({ c, i }: { c: Stage; i: number }) {
  const first = i === 0;
  return (
    <li className="stage-slot" style={{ '--i': i } as CSSProperties}>
      <Spotlight>
        <article
          aria-labelledby={`stage-${c.n}-title`}
          className={`${cardClass({ radius: 30, pad: true, surface: true, spot: true })} stage-card ${first ? 'stage-first' : ''}`}
        >
          <span aria-hidden="true" className="spot-light" />
          <Numeral n={c.n} className="right-(--card-pad) top-(--card-pad) stage-numeral" />
          <div className="flex flex-col gap-(--space-4) pr-[96px]">
            <TickRule lit={(i + 1) / STAGE_COUNT} />
            <h3 id={`stage-${c.n}-title`} className="t-card text-ink">
              {c.title}
            </h3>
          </div>
          <p className="t-lede pt-(--space-2) text-ink-2">{c.note}</p>
          <div className="mt-(--space-5) flex flex-col gap-(--space-1) border-t border-rule pt-(--space-4)">
            <span className="t-mono text-ink-3">{YOU_GET}</span>
            <span className="t-body text-ink">{c.output}</span>
          </div>
          {/* `data-origin-card` names the card in the enquiry email's
              "Came from" line (lib/origin.tsx). */}
          {first ? (
            <div data-origin-card={c.title.replace(/\.$/, '')} className="pt-(--space-5)">
              <Btn href="/contact" label={c.cta} magnetic />
            </div>
          ) : (
            <span aria-hidden="true" />
          )}
        </article>
      </Spotlight>
    </li>
  );
}

function Stages() {
  return (
    <Scene
      as="section"
      end={0.35}
      aria-labelledby="stages-title"
      className="stages pad-x pad-top relative flex w-full flex-col items-center overflow-clip"
    >
      <div className="shell flex w-full flex-col gap-(--space-row)">
        <Rise as="h2" id="stages-title" lines={ENGAGEMENT.headline} className="t-section text-ink" />

        {/* The rail stands one step over the cards, which is the length of
            the drops that join them. */}
        <div className="flex w-full flex-col gap-(--space-5)">
          <StagesFlow drops scroll />
          <ol className="stage-plate sx-stagger">
            {ENGAGEMENT.cards.map((c, i) => (
              <StageCard key={c.n} c={c} i={i} />
            ))}
          </ol>
        </div>
      </div>
    </Scene>
  );
}

/** Home draws the stages; About links to them. */
export default Stages;
