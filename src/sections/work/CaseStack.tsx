import type { ReactNode } from 'react';
import { InView, Scene, Stack } from '@/lib/motion';
import { Card, cardClass, Chip, GlyphTile, Numeral, Orbs, Status, type GlyphName } from '@/components/ui';
import { CASE_CHAPTERS as C, type Initiative } from '@/content/work';

/* ============================================================================
   THE CHAPTERS OF A CASE STUDY, AS ONE STACK — THE PROBLEM / THE SYSTEM /
   WHAT WE BUILT / STATUS (CASE_CHAPTERS in content/work.ts says why the
   last is STATUS and not RESULT). Four surface cards that slide over one
   another as the reader scrolls (`Stack`, lib/motion.tsx): each sticks
   under the bar a step lower than the last, and the covered one shrinks
   and dims as the next rides up. From 1200 up the stack takes 70% of the
   shell with the outline numeral in a column of its own; below, the
   numeral sits in the corner.

   CUT TO WHAT FITS A WINDOW (the owner's third note: too many words). Each
   card is its heading and a few short items, so it fits the window and
   pins whole at a laptop and a phone:

     01 THE PROBLEM     the paragraph's first two sentences, in two tones
     02 THE SYSTEM      year, field, owner and scope as rows, and the
                        facts as three big-word tiles where an entry has
                        any (never results)
     03 WHAT WE BUILT   the entry's own heading over its list, each line cut
                        at its colon where it has one (the words before the
                        colon already read as an item)
     04 STATUS          the state, on one line

   The label rows over each heading are gone (they repeated it), and so is
   the status card's second honesty line: the page prints "Demonstration
   data." once, on the cover. The numerals drift against the scroll as the
   stack passes (`Scene`, `.sx-drift`), so the column moves continuously,
   not only when a card arrives. Under reduced motion the cards only
   stick; without scripts they are a plain column, complete.
   ========================================================================= */

/** The OPS facts' glyphs, in the record's order: offline, self-hosted,
 *  French and Arabic. */
const FACT_GLYPHS: readonly GlyphName[] = ['signal-off', 'server', 'languages'];

/** One glyph per built line, by entry then index. */
const BUILT_GLYPHS: Readonly<Record<string, readonly GlyphName[]>> = {
  ops: ['register', 'permit', 'crew', 'report', 'signal-off', 'server'],
  'abp-continental': ['brand', 'document', 'software'],
  belkofski: ['strategy', 'identity', 'pictures', 'software'],
  contraxis: ['document', 'data', 'arrow', 'workflow', 'decide'],
};

/** A built line as a list item: the words before its colon, where it has
 *  one; the whole line otherwise. */
const short = (line: string) => line.split(':')[0];

/**
 * One chapter card. The numeral is a grid cell of its own from 1200 up and
 * the corner of the card below (`.case-numeral`, styles/work.css); the
 * tile sits in the top-right corner at every width.
 */
function Chapter({
  n,
  id,
  glyph,
  heading,
  orbs = false,
  children,
}: {
  n: string;
  id: string;
  glyph: GlyphName;
  heading: string;
  orbs?: boolean;
  children?: ReactNode;
}) {
  return (
    <Card
      radius={30}
      spot
      as="section"
      id={id}
      aria-labelledby={`${id}-head`}
      data-stack-card=""
      className="stack-card case-card grid grid-cols-[160px_minmax(0,1fr)] gap-x-(--space-6) p-(--plate-pad) narrow:grid-cols-1"
    >
      {orbs ? <Orbs variant="card" /> : null}
      <Numeral n={n} className="case-numeral sx-drift" />
      <GlyphTile name={glyph} className="case-tile absolute right-(--plate-pad) top-(--plate-pad)" />
      <div className="flex min-w-0 flex-col gap-(--space-5) mobile:gap-(--space-4)">
        <h2 id={`${id}-head`} className="case-head t-section text-ink">
          {heading}
        </h2>
        {children}
      </div>
    </Card>
  );
}

/** A row of the system: the tile and the term on one line, the value
 *  under the term (`.case-row-value`). The tile lives inside the term,
 *  because a list of definitions may hold nothing else. */
function Row({ glyph, label, className = '', children }: { glyph: GlyphName; label: string; className?: string; children: ReactNode }) {
  return (
    <div className={`flex min-w-0 flex-col ${className}`}>
      <dt className="flex items-start gap-(--space-3)">
        <GlyphTile name={glyph} sm />
        <span className="t-mono pt-[2px] text-ink-3">{label}</span>
      </dt>
      <dd className="case-row-value t-body text-ink">{children}</dd>
    </div>
  );
}

export default function CaseStack({ item }: { item: Initiative }) {
  /* The two-tone paragraph: the first sentence in full ink, the second at
     60%, and no further. */
  const sentences = item.problem.body.split('. ');
  const lead = sentences[0] ?? item.problem.body;
  const second = sentences[1];

  /* The owner is named on the entry — a client's or a partner's. The two
     products in development name none and print "In-house product". */
  const owner = item.owner ?? 'In-house product';
  const state = item.tone === 'dev' ? 'development' : 'delivered';
  const glyphs = BUILT_GLYPHS[item.slug] ?? [];

  return (
    <Scene as="section" aria-label="The case" className="pad-x pad-top flex w-full flex-col items-center">
      <div className="shell flex justify-center">
        <Stack className="case-stack">
          {/* ── 01 THE PROBLEM ─────────────────────────────────────────── */}
          <Chapter n="01" id={C.problem.id} glyph="problem" heading={C.problem.heading} orbs>
            <InView>
              <p className="t-lede max-w-[640px] text-ink">
                {lead.endsWith('.') ? lead : `${lead}.`}
                {second ? <span className="text-ink-2"> {second.endsWith('.') ? second : `${second}.`}</span> : null}
              </p>
            </InView>
          </Chapter>

          {/* ── 02 THE SYSTEM ──────────────────────────────────────────── */}
          <Chapter n="02" id={C.system.id} glyph="system" heading={C.system.heading}>
            <InView>
              <dl className="grid grid-cols-2 gap-x-(--space-4) gap-y-(--space-4)">
                <Row glyph="clock" label="YEAR">
                  <span className="tabular-nums">{item.year}</span>
                </Row>
                <Row glyph="field" label="CATEGORY">
                  {item.category}
                </Row>
                <Row glyph="person" label="OWNER">
                  {owner}
                </Row>
                <Row glyph="scope" label="SCOPE" className="col-span-2">
                  <ul className="flex flex-wrap gap-(--space-1) pt-[4px]">
                    {item.scope.map((s) => (
                      <li key={s}>
                        <Chip>{s}</Chip>
                      </li>
                    ))}
                  </ul>
                </Row>
              </dl>
            </InView>
            {/* THE FIGURE MAY BE A WORD: OPS prints no count, its three
                cells carry "Offline", "Self-hosted" and "FR · AR". Three
                across, one below 600. */}
            {item.facts.length > 0 ? (
              <ul className="grid grid-cols-3 gap-[2px] phone:grid-cols-1">
                {item.facts.map((f, i) => (
                  <InView
                    as="li"
                    key={f.label}
                    step={i}
                    className={`${cardClass({ radius: 24, deep: true })} flex flex-col gap-(--space-2) p-(--space-4) phone:flex-row phone:items-center phone:gap-(--space-3) phone:p-(--space-3)`}
                  >
                    <GlyphTile name={FACT_GLYPHS[i] ?? 'check'} sm />
                    <div className="flex flex-col gap-[2px]">
                      <p className="t-lede tabular-nums text-ink">
                        {f.value}
                        {f.unit ? <span className="text-ink-3"> {f.unit}</span> : null}
                      </p>
                      <p className="t-mono text-ink-3">{f.label}</p>
                    </div>
                  </InView>
                ))}
              </ul>
            ) : null}
          </Chapter>

          {/* ── 03 WHAT WE BUILT ───────────────────────────────────────────
              The heading is each entry's own (`builtHeading`): a shared
              "What is built." told a reader that a concept with no code
              had been built. */}
          <Chapter n="03" id={C.built.id} glyph="build" heading={item.builtHeading}>
            <ul className="grid grid-cols-2 gap-x-(--space-5) gap-y-(--space-3) phone:grid-cols-1">
              {item.built.map((b, i) => (
                <InView as="li" key={b} delay={Math.min(i, 5) * 50} className="flex items-start gap-(--space-3)">
                  <GlyphTile name={glyphs[i] ?? 'check'} sm />
                  <p className="t-body pt-[6px] text-ink mobile:pt-[4px]">{short(b)}</p>
                </InView>
              ))}
            </ul>
          </Chapter>

          {/* ── 04 STATUS ──────────────────────────────────────────────────
              Where it stands, on one line. The site states a status and
              stops; it does not explain an absence (`absent`). */}
          <Chapter n="04" id={C.status.id} glyph="status" heading={C.status.heading} orbs>
            <InView>
              <Status state={state} className="text-ink">
                {item.status}
              </Status>
            </InView>
          </Chapter>
        </Stack>
      </div>
    </Scene>
  );
}
