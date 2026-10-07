'use client';

import { Fragment, useState, type CSSProperties } from 'react';
import { InView, Spotlight, useMedia } from '@/lib/motion';
import { SectionHead, Btn, Chevron, Glyph, GlyphTile, Numeral, TickRule, cardClass, type GlyphName } from '@/components/ui';
import { ENGAGEMENT, STAGES_FLOW } from '@/content/home';

/* ============================================================================
   THE THREE STAGES.

   One geometry on Home and About. Three cards side by side on one seam
   plate, and card 01 is the only way in: its edge is drawn in the signal
   blue (`.stage-first`) where the other two keep the surface's own. The
   section opens as every section does (SectionHead): the label row, the
   heading at the section size and the footnote beside it as the lede.

   THE FLOW ("Calibration → Build → Partnership … one of the site's main
   visual systems"). Above the cards a rail: the three stages as glyph
   tiles on one hairline, each tile centred over its card, a chevron
   between each pair; the line draws left to right as the block comes in,
   the nodes light in order after it (`.flow-line`, `.flow-node`,
   globals.css THE FLOW LINE), and once they are lit a pulse of light rides
   the line every four seconds (`.pulse-line`, depth.css; the geometry and
   the delay are in styles/home.css). On Home a hairline drops from each
   tile's foot to the top of its card (`drops`), so the rail and the deck
   read as one drawing; About draws the same rail without them. On a phone
   the rail turns and runs downward at the left (`.flow-vertical`
   geometry), the nodes stacked beside it, above the stacked cards. The
   rail repeats the three titles the cards already carry, so it is hidden
   from assistive technology: the cards are the content, the rail is the
   picture of it.

   The figure slot of the reference's pricing deck carries, in the place a
   price would take, what the buyer receives at the end of the stage and
   when that stage's scope is fixed. There is no price and no POPULAR stamp:
   Recalibre publishes neither.

   ONE BUTTON. All three stages said "Start a calibration" and went to the
   same place, so the one button sits in card 01's foot, under what it
   delivers and its scope line. It is one of the four places the button may
   lean toward the pointer (`magnetic`).

   THE ROWS LINE UP WITHOUT A FLOOR. The plate lays out six rows (title,
   note, points, receive, scope, button) and each card takes them through
   `grid-rows-subgrid`, so the longest note sets where every list starts
   and the longest list where every YOU RECEIVE starts. No number reserves
   a height.

   THE CARDS ARE SURFACES THAT ANSWER (the direction change): the lit fill
   and the gradient edge, the spotlight under the pointer (and under the
   centre of a phone's screen), the stage's outline numeral behind its
   head, and a check glyph before each point. The card IS its reveal: a
   subgrid item must be the grid's direct child, so the `InView` takes the
   card classes (`cardClass`) rather than wrapping a `Card`; the Spotlight
   around it lays out nothing, so the article stays the grid's child.

   On a phone each stage shows its number, title and note and opens on a
   tap to the rest; the first is open. The tick rule across the head of
   each card is lit to the stage's place in the three, over the number.
   The cards reveal 0 / 90 / 180ms by column, all at once on a phone.
   ========================================================================= */

type Stage = (typeof ENGAGEMENT.cards)[number];

/** How many stages the indicator counts across. */
const STAGE_COUNT = ENGAGEMENT.cards.length;

/** The glyph each stage's node carries, by the stage's number: the plan,
 *  the build, the support. Structural pictures of the three words, not
 *  claims. */
const FLOW_GLYPHS: Record<(typeof STAGES_FLOW.nodes)[number]['n'], GlyphName> = {
  '01': 'plan',
  '02': 'build',
  '03': 'support',
};

/* ---------------------------------------------------------------------------
   THE RAIL. One hairline, three nodes, two chevrons. The nodes and the
   chevrons all carry `--i`, in order along the line (0, 0.5, 1, 1.5, 2),
   so each lights 320ms after the one before it once the line has drawn;
   the chevrons also read `--i` for their place on the line. The tiles and
   the chevrons sit on the page's ground, so the line reads as passing
   behind them rather than through. The first tile is the lit one, in the
   signal blue: the only way in. Decorative by design, see the head of this
   file; the wrapper carries the aria-hidden because the reveal does not
   take it.
   ------------------------------------------------------------------------ */
export function StagesFlow({ className = '', drops = false }: { className?: string; drops?: boolean }) {
  const at = (i: number) => ({ '--i': String(i) }) as CSSProperties;
  return (
    <div aria-hidden="true" className={`w-full ${className}`}>
      <InView className={`flow-rail${drops ? ' flow-rail-drops' : ''}`}>
        <span className="flow-line flow-rail-line pulse-line" />
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

/** The points on hairlines, a check glyph before each: a list of what the
 *  stage does, drawn as the things done. */
function Points({ points }: { points: readonly string[] }) {
  return (
    <ul className="flex flex-col divide-y divide-rule pt-(--space-2)">
      {points.map((p) => (
        <li key={p} className="t-body flex items-start gap-(--space-2) py-(--space-2) text-ink-2">
          <Glyph name="check" size={14} className="mt-[5px] text-ink-3" />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

/* WHAT YOU LEAVE WITH. A stage of an unpriced engagement is an abstraction
   until it says what the buyer actually receives at the end of it. */
function Receive({ c }: { c: Stage }) {
  return (
    <div className="mt-(--space-2) flex flex-col gap-(--space-1) border-t border-rule pt-(--space-4)">
      <span className="t-mono text-ink-3">YOU RECEIVE</span>
      <span className="t-body text-ink">{c.output}</span>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   ONE STAGE.

   From a tablet up the card is a subgrid of the plate's six rows, and the
   three wrappers around its lower half are `contents`, so the list, the
   receive block, the scope line and the button each take their own row. On
   a phone the card is a column and those wrappers are the fold. The fold is
   CSS, so the server draws the phone's first state with no jump; hiding a
   folded panel from a screen reader (`inert`) needs a script, so that
   waits for `useMedia` and never applies on a wider screen.

   The spotlight's own layer and the numeral are absolute, so neither takes
   a row of the subgrid. The card never takes `relative`: the surface sets
   it, and a utility would only shadow it.
   ------------------------------------------------------------------------ */
function StageCard({
  c,
  i,
  open,
  onToggle,
  phone,
}: {
  c: Stage;
  i: number;
  open: boolean;
  onToggle: () => void;
  phone: boolean;
}) {
  const titleId = `stage-${c.n}-title`;
  const panelId = `stage-${c.n}-panel`;
  const first = i === 0;
  return (
    <Spotlight>
      <InView
        as="article"
        step={i}
        className={`${cardClass({ radius: 30, pad: true, surface: true, spot: true })} row-span-6 grid grid-rows-subgrid gap-y-0 mobile:row-span-1 mobile:flex mobile:flex-col mobile:[--in-delay:0ms]! ${
          first ? 'stage-first' : ''
        }`}
      >
        <span aria-hidden="true" className="spot-light" />
        <Numeral n={c.n} className="right-(--card-pad) top-(--card-pad) stage-numeral" />

        {/* The head: the number over the title in row one, the note in row
            two. On a phone the whole head is the tap target, named by the
            stage's own title; the button is not drawn from a tablet up. */}
        <div className="relative row-span-2 grid grid-rows-subgrid mobile:flex mobile:flex-col mobile:pr-[44px]">
          <div className="flex flex-col gap-(--space-4)">
            <div className="flex flex-col gap-(--space-3)">
              <TickRule lit={(i + 1) / STAGE_COUNT} />
              <span className="t-mono-11 tabular-nums text-ink-3">{c.n}</span>
            </div>
            <h3 id={titleId} className="t-card text-ink">
              {c.title}
            </h3>
          </div>
          <p className="t-lede pt-(--space-1) text-ink-2">{c.note}</p>
          <span
            aria-hidden="true"
            className="absolute right-0 top-0 hidden size-[44px] items-center justify-end text-accent-bright mobile:flex"
          >
            <Chevron dir={open ? 'up' : 'down'} />
          </span>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-labelledby={titleId}
            onClick={onToggle}
            className="absolute -inset-[8px] hidden rounded-[8px] mobile:block"
          />
        </div>

        <div
          id={panelId}
          /* The closed state lives in home.css (`.js .stage-fold:not([data-open])`),
             gated on scripts as every fold on the site is, so a phone without
             them shows all three stages open. */
          className="stage-fold contents transition-[grid-template-rows] duration-[450ms] mobile:grid"
          data-open={open || undefined}
          style={{ transitionTimingFunction: 'var(--ease-panel)' }}
        >
          <div className="contents mobile:block mobile:overflow-hidden" inert={phone && !open}>
            <div className="contents mobile:flex mobile:flex-col">
              <Points points={c.points} />
              <Receive c={c} />
              <span className="t-mono pt-(--space-3) text-ink-2">{c.scope}</span>
              {/* `data-origin-card` names the card in the enquiry email's
                  "Came from" line (lib/origin.tsx). */}
              {first ? (
                <div data-origin-card={c.title.replace(/\.$/, '')} className="pt-(--space-4)">
                  <Btn href="/contact" label={c.cta} magnetic />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </InView>
    </Spotlight>
  );
}

function Stages() {
  const [open, setOpen] = useState<number | null>(0);
  const phone = useMedia('(max-width: 809.98px)');
  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-row)">
        <SectionHead label={ENGAGEMENT.label} lines={ENGAGEMENT.headline} lede={ENGAGEMENT.footnote} />

        {/* The rail stands one step over the plate, which is the length of
            the drops that join them. */}
        <div className="flex w-full flex-col gap-(--space-5)">
          <StagesFlow drops />

          {/* The plate fades with its first card (no travel), so its grey
              never stands empty while the cards come in. */}
          <InView
            mode="picture"
            className="seam grid w-full grid-cols-3 grid-rows-[auto_auto_1fr_auto_auto_auto] mobile:grid-cols-1 mobile:grid-rows-none"
          >
            {ENGAGEMENT.cards.map((c, i) => (
              <StageCard
                key={c.n}
                c={c}
                i={i}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
                phone={phone}
              />
            ))}
          </InView>
        </div>
      </div>
    </section>
  );
}

/** Home and About draw the same stages. */
export default Stages;
