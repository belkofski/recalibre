import type { ReactNode } from 'react';
import { InView, Stack } from '@/lib/motion';
import {
  Card,
  cardClass,
  Chip,
  Eyebrow,
  GlyphTile,
  MonoLink,
  Numeral,
  Orbs,
  Status,
  type GlyphName,
} from '@/components/ui';
import { CASE_CHAPTERS as C, type Initiative } from '@/content/work';
import { SPOTLIGHT } from '@/content/home';

/* ============================================================================
   THE CHAPTERS OF A CASE STUDY, AS ONE STACK — the owner's audit: THE
   PROBLEM / THE SYSTEM / WHAT WE BUILT / STATUS (CASE_CHAPTERS in
   content/work.ts says why the last is STATUS and not RESULT). The four
   used to be four sections of a document: a paragraph, a meta grid of
   words on hairlines, a list of rows, a card. They are four surface cards
   now that slide over one another as the reader scrolls (`Stack`,
   lib/motion.tsx): each sticks under the bar a step lower than the last,
   the covered one shrinks and dims as the next rides up, and the one at
   the centre of a phone's screen lights. From 1200 up the stack takes 70%
   of the shell, with the outline numeral in a column of its own at the
   left; below it takes the width and the numeral sits in the corner,
   under the chapter's glyph tile.

   WHAT EACH CARD HOLDS, every word the entry's own:

     01 THE PROBLEM     the paragraph in two tones, the scope as chips
     02 THE SYSTEM      the four fields every entry has as glyph rows, and
                        the facts, where an entry has any, as three big-word
                        tiles (never results)
     03 WHAT WE BUILT   the entry's own heading (`builtHeading`) over its
                        list as a wall of tiles, one glyph each; NO NUMBER
                        on them: the items are not in an order, and a 01-06
                        over them only counted content
     04 STATUS          the state as the entry prints it, the demonstration
                        note where the screens run on demonstration data,
                        the owner, and NEXT

   A card taller than its room (the OPS wall on a phone) is unpinned by the
   script and scrolls as a plain block while the next still slides over it.
   Under reduced motion the cards only stick; without scripts they are a
   plain column, complete. The glyphs are pictures of the structural ideas
   the content already names, never claims.
   ========================================================================= */

/** The category's glyph, by entry: field operations, document
 *  intelligence, industrial contracting, brand and digital. */
const CATEGORY_GLYPH: Readonly<Record<string, GlyphName>> = {
  ops: 'field',
  contraxis: 'document',
  'abp-continental': 'build',
  belkofski: 'brand',
};

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

/** A built line short enough for a tile a third of the card wide. */
const SHORT_LINE = 60;

/**
 * One chapter card. The numeral is a grid cell of its own from 1200 up
 * and the corner of the card below (`.case-numeral`, styles/work.css);
 * the tile sits in the top-right corner at every width. `wall` is a block
 * that takes the card's whole width under the words — the tiles of the
 * system's facts and the built list, which need more measure than the
 * words' column beside the numeral gives them at 1200.
 */
function Chapter({
  n,
  id,
  glyph,
  label,
  heading,
  orbs = false,
  children,
  wall,
}: {
  n: string;
  id: string;
  glyph: GlyphName;
  label: string;
  heading: string;
  /** The ambient light behind the card's ground. */
  orbs?: boolean;
  children?: ReactNode;
  wall?: ReactNode;
}) {
  return (
    <Card
      radius={30}
      spot
      as="section"
      id={id}
      aria-labelledby={`${id}-head`}
      data-stack-card=""
      className="stack-card case-card grid grid-cols-[160px_minmax(0,1fr)] gap-x-(--space-6) gap-y-(--space-6) p-(--plate-pad) narrow:grid-cols-1 mobile:gap-y-(--space-5)"
    >
      {orbs ? <Orbs variant="card" /> : null}
      <Numeral n={n} className="case-numeral" />
      <GlyphTile name={glyph} className="absolute right-(--plate-pad) top-(--plate-pad)" />
      <div className="flex flex-col gap-(--space-5)">
        <div className="case-head flex flex-col gap-(--space-3)">
          <Eyebrow mark>{label}</Eyebrow>
          <h2 id={`${id}-head`} className="t-section text-ink">
            {heading}
          </h2>
        </div>
        {children}
      </div>
      {wall ? <div className="col-span-2 narrow:col-span-1">{wall}</div> : null}
    </Card>
  );
}

/** A meta row: the tile and the term on one line, the definition under
 *  the term (`.case-row-value`). The tile lives inside the term, because a
 *  list of definitions may hold nothing else. */
function Row({ glyph, label, children }: { glyph: GlyphName; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <dt className="flex items-start gap-(--space-3)">
        <GlyphTile name={glyph} sm />
        <span className="t-mono pt-[2px] text-ink-3">{label}</span>
      </dt>
      <dd className="case-row-value t-body text-ink">{children}</dd>
    </div>
  );
}

export default function CaseStack({ item, next }: { item: Initiative; next?: Initiative }) {
  /* The two-tone paragraph: the first sentence in full ink, the rest at
     60%. Split once, on the first sentence end. */
  const sentences = item.problem.body.split('. ');
  const lead = sentences[0];
  const tail = sentences.slice(1).join('. ');

  /* The owner is named on the entry — a client's or a partner's. The two
     products in development name none and print "In-house product". */
  const owner = item.owner ?? 'In-house product';
  const state = item.tone === 'dev' ? 'development' : 'delivered';

  /* Three tiles across where the list divides by three and every line is
     short enough for a third of the card (ABP); otherwise two, with an odd
     last tile across both; one below 600. */
  const three = item.built.length % 3 === 0 && item.built.every((b) => b.length <= SHORT_LINE);
  const glyphs = BUILT_GLYPHS[item.slug] ?? [];

  return (
    <section className="pad-x pad-top flex w-full flex-col items-center">
      <div className="shell flex justify-center">
        <Stack className="case-stack">
          {/* ── 01 THE PROBLEM ──────────────────────────────────────────
              Never a client's problem unless the client has given
              permission (see `problem` in content/work.ts). No calibration
              link here: the footer carries the page's one button. */}
          <Chapter n="01" id={C.problem.id} glyph="problem" label={C.problem.label} heading={C.problem.heading} orbs>
            <InView>
              <p className="t-lede max-w-[640px] text-ink">
                {lead}.{tail ? <span className="text-ink-2"> {tail}</span> : null}
              </p>
            </InView>
            <InView delay={90} className="flex flex-col gap-(--space-3)">
              <p className="t-mono text-ink-3">SCOPE</p>
              <ul className="flex flex-wrap gap-(--space-1)">
                {item.scope.map((s) => (
                  <li key={s}>
                    <Chip>{s}</Chip>
                  </li>
                ))}
              </ul>
            </InView>
          </Chapter>

          {/* ── 02 THE SYSTEM ───────────────────────────────────────────
              The structural facts, read out of the record: the four
              fields every entry has, then the facts where an entry has
              any. Never results. */}
          <Chapter
            n="02"
            id={C.system.id}
            glyph="system"
            label={C.system.label}
            heading={C.system.heading}
            wall={
              /* THE FIGURE MAY BE A WORD, AND THE UNIT MAY BE EMPTY. OPS
                 prints no count: its three cells carry "Offline",
                 "Self-hosted" and "FR · AR" with no unit, so the unit span
                 is drawn only where a unit is set, and the wall is left out
                 altogether when an entry has no facts. At card size, not
                 display: a page has one loud voice. Three across, two from
                 600 to 809 where three would cut a word, one below. */
              item.facts.length > 0 ? (
                <ul className="grid grid-cols-3 gap-[2px] mobile:grid-cols-2 phone:grid-cols-1">
                  {item.facts.map((f, i) => (
                    <InView
                      as="li"
                      key={f.label}
                      step={i}
                      className={`${cardClass({ radius: 24, deep: true })} flex flex-col gap-(--space-3) p-(--space-4) ${
                        i === item.facts.length - 1 && item.facts.length % 2 === 1 ? 'mobile:col-span-2 phone:col-span-1' : ''
                      }`}
                    >
                      <GlyphTile name={FACT_GLYPHS[i] ?? 'check'} sm />
                      <p className="t-card tabular-nums text-ink">
                        {f.value}
                        {f.unit ? <span className="t-lede text-ink-3"> {f.unit}</span> : null}
                      </p>
                      <p className="t-mono text-ink-2">{f.label}</p>
                    </InView>
                  ))}
                </ul>
              ) : null
            }
          >
            <InView>
              <dl className="grid grid-cols-2 gap-(--space-4) phone:grid-cols-1">
                {/* Tabular, so the year's digits keep the ladder's widths.
                    THE STATUS: the dot and the words, no capsule; the
                    signal blue for work in development, ink at 50% for
                    delivered and partner work. Same words. */}
                <Row glyph="clock" label="YEAR">
                  <span className="tabular-nums">{item.year}</span>
                </Row>
                <Row glyph={CATEGORY_GLYPH[item.slug] ?? 'check'} label="CATEGORY">
                  {item.category}
                </Row>
                <Row glyph="status" label="STATUS">
                  <Status state={state} className="text-ink">
                    {item.status}
                  </Status>
                </Row>
                <Row glyph="person" label="OWNER">
                  {owner}
                </Row>
              </dl>
            </InView>
          </Chapter>

          {/* ── 03 WHAT WE BUILT ────────────────────────────────────────
              The heading is each entry's own (`builtHeading`): a shared
              "What is built." told a reader that a concept with no code
              had been built. The label over it is the entry's too
              (`problem.label`: WHAT WAS DELIVERED, WHAT A SITE GETS, WHAT
              IT IS MEANT TO DO). Each tile arrives a step after the one
              before, capped so a long list does not take a second to
              start. */}
          <Chapter
            n="03"
            id={C.built.id}
            glyph="build"
            label={item.problem.label}
            heading={item.builtHeading}
            wall={
              <ul className={`grid gap-[2px] ${three ? 'grid-cols-3' : 'grid-cols-2'} phone:grid-cols-1`}>
                {item.built.map((b, i) => {
                  const odd = !three && item.built.length % 2 === 1 && i === item.built.length - 1;
                  return (
                    <InView
                      as="li"
                      key={b}
                      delay={Math.min(i, 5) * 60}
                      className={`${cardClass({ radius: 24, deep: true })} flex min-h-[140px] flex-col gap-(--space-3) p-(--space-4) ${
                        odd ? 'col-span-2 phone:col-span-1' : ''
                      }`}
                    >
                      <GlyphTile name={glyphs[i] ?? 'check'} sm />
                      <p className="t-body text-ink">{b}</p>
                    </InView>
                  );
                })}
              </ul>
            }
          />

          {/* ── 04 STATUS ───────────────────────────────────────────────
              Where it stands, and nothing more: the state as the entry
              prints it, the demonstration note where the screens run on
              demonstration data (SPOTLIGHT's own line, content/home.ts),
              the owner, and the way on to the next case. The site states a
              status and stops; it does not explain an absence (see
              `absent` in content/work.ts). */}
          <Chapter n="04" id={C.status.id} glyph="status" label={C.status.label} heading={C.status.heading} orbs>
            <InView className="grid grid-cols-2 gap-(--space-6) mobile:grid-cols-1 mobile:gap-(--space-5)">
              <div className="flex flex-col items-start gap-(--space-3)">
                <Status state={state} className="text-ink">
                  {item.status}
                </Status>
                {item.demo ? <p className="t-body max-w-[440px] text-ink-2">{SPOTLIGHT.status.note}</p> : null}
              </div>
              <dl>
                <Row glyph="person" label="OWNER">
                  {owner}
                </Row>
              </dl>
            </InView>
            {/* The way on: NEXT and the next initiative's name, on the
                card's foot hairline. */}
            {next ? (
              <InView delay={90} className="flex w-full justify-end border-t border-rule pt-(--space-4)">
                <MonoLink href={`/work/${next.slug}`} lead="NEXT" label={next.name} />
              </InView>
            ) : null}
          </Chapter>
        </Stack>
      </div>
    </section>
  );
}
