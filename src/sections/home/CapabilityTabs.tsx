'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { InView, Ordinal, Rail, useHydrated } from '@/lib/motion';
import { Card, Chip, GlyphTile, MonoLink, TickRule, type GlyphName } from '@/components/ui';

/* ============================================================================
   THE CAPABILITY INDEX — the moving part. CapabilityIndex.tsx composes the
   section on the server and draws the five visuals; this file holds the one
   piece of state, which capability is open, and the two shapes it takes.

   FROM 1200 UP IT IS A ROW OF EXPANDING PANELS. Five surfaces in one seam
   plate, each a flex item: the open one takes 3.2 shares of the width and
   the rest one each, so at the shell's 1380 the open panel is about 610
   wide and a closed one about 190, and a change of panel is one move of
   the seams, 0.6s on the panel curve. A closed panel shows its head strip
   (the glyph tile and the ordinal) and its short title set up its left
   edge; the open one shows its visual in the band under the head and its
   words below that: the caption where there is one, the title, the body,
   the tags and EXPLORE. The words are set at the OPEN panel's width in
   every panel (a container query on the plate, not a script), so they
   never rewrap while a panel is moving; a closed panel simply clips them
   and holds them at nothing.

   BELOW 1200 IT IS A SNAP RAIL (`Rail`, lib/motion.tsx) of five cards, 60vw
   wide on a tablet and 85vw on a phone, each with its visual on top (16:10,
   4:5 on a phone) and its words under, the rule under the track lit to
   where the reader is and the two rings on a tablet. Both shapes are in
   the markup and the width hides one, so the server sends the finished
   state for a width it cannot know; the hidden one is `display: none`, so
   nothing is tabbable twice and its lazy pictures never load.

   ONE PANEL IS ALWAYS OPEN. An index is not a FAQ: the plate must always
   show something, so a panel cannot be closed, only another opened, and
   the first is open on the server.

   WHAT OPENS A PANEL: a click or a tap anywhere on it (while closed, the
   head's hit area is the whole panel; open, the hit area is the head, so
   the chips and EXPLORE under it can be reached); Enter or Space on its
   head; ← → Home End from anywhere on the plate (the focus follows to the
   head, a control that is always on screen); and on a pointer device,
   resting on a panel for 90ms — long enough that a pointer crossing the
   row on its way elsewhere opens nothing. The closed panels' words are
   `inert` once scripts run; without them every panel is laid out open
   (every closed rule is gated on `.js`, and the section's own <noscript>
   block hands the plate its column shape), so an inert panel is never one
   the reader cannot reach.
   ========================================================================= */

export type CapabilityRow = {
  /** '/01' as the content prints it. */
  n: string;
  slug: string;
  short: string;
  title: string;
  body: string;
  tags: readonly string[];
  /** The visual's caption, where it has one: "Demonstration data." on the
   *  capture, the schematic's note on the diagram. */
  caption?: string;
  glyph: GlyphName;
};

const HOVER_MS = 90;

/** The way from a panel to its chapter on /capabilities: a structural
 *  label, named for a voice user with the capability's short name. */
const EXPLORE = 'EXPLORE';

/** The row of tags under a capability's words, in either shape. */
function Tags({ tags }: { tags: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-(--space-1)">
      {tags.map((t) => (
        <li key={t} className="flex">
          <Chip>{t}</Chip>
        </li>
      ))}
    </ul>
  );
}

const step = (i: number) => ({ '--i': i } as CSSProperties);

export default function CapabilityTabs({
  rows,
  visuals,
}: {
  rows: readonly CapabilityRow[];
  /** One per row, in order: each fills an `absolute inset-0` box. Drawn
   *  on the server (ArtImg) or by its own client component (the diagram). */
  visuals: readonly ReactNode[];
}) {
  const [active, setActive] = useState(0);
  /* Closed panels' words are `inert` only once scripts run: without them
     every panel is laid out open, and an inert panel would be readable
     but unreachable. */
  const hydrated = useHydrated();
  const count = rows.length;

  const heads = useRef<(HTMLButtonElement | null)[]>([]);
  const hover = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (hover.current) clearTimeout(hover.current);
    },
    [],
  );

  const go = (i: number) => {
    setActive(i);
    heads.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    let next: number | undefined;
    if (e.key === 'ArrowRight') next = (active + 1) % count;
    else if (e.key === 'ArrowLeft') next = (active - 1 + count) % count;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = count - 1;
    if (next === undefined) return;
    e.preventDefault();
    go(next);
  };

  /* THE INTENT IS A MOVING POINTER, NOT A RESTING ONE. The browser fires
     pointer events of its own when the page scrolls under a still mouse
     (a key moving focus to a head scrolls it into view), and those events
     used to arm the timer for whichever panel the mouse happened to rest
     over, snapping a keyboard reader's choice back. Only an event whose
     position differs from the last one counts as the reader's hand; one
     timer per panel, never reset by the small movements inside it. A
     finger never arms it: a tap is a click. */
  const last = useRef<{ x: number; y: number; row: number | null }>({ x: -1, y: -1, row: null });
  const enter = (i: number) => (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'touch') return;
    const moved = e.clientX !== last.current.x || e.clientY !== last.current.y;
    last.current.x = e.clientX;
    last.current.y = e.clientY;
    if (!moved || i === active) return;
    if (last.current.row === i && hover.current) return;
    if (hover.current) clearTimeout(hover.current);
    last.current.row = i;
    hover.current = setTimeout(() => {
      hover.current = null;
      setActive(i);
    }, HOVER_MS);
  };
  const leave = () => {
    if (hover.current) clearTimeout(hover.current);
    hover.current = null;
    last.current.row = null;
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex w-full flex-col">
      {/* ── the panels, from 1200 up ─────────────────────────────────── */}
      {/* One reveal for the plate and the rule under it, lit to the open
          panel's place; no printed count. The fade tier, not the scale
          one: the served stylesheet folds the scale tier's resting
          `transform: none` and `scale: 0.96` into one transform that the
          seen state never undoes, and a plate at 0.96 sits 30px inside
          the shell on both sides. */}
      <InView className="flex w-full flex-col gap-(--space-4) narrow:hidden">
        <div className="cap-plate seam w-full" onKeyDown={onKey}>
          {rows.map((row, i) => {
            const on = i === active;
            const headId = `cap-head-${row.slug}`;
            const panelId = `cap-panel-${row.slug}`;
            return (
              /* `Card spot` wraps itself in the spotlight; the wrapper lays
                 out nothing, so the card is the plate's flex item. */
              <Card key={row.slug} radius={30} spot className="cap-panel" data-on={on ? '' : undefined}>
                <button
                  ref={(el) => {
                    heads.current[i] = el;
                  }}
                  type="button"
                  id={headId}
                  aria-expanded={on}
                  aria-controls={panelId}
                  onClick={() => setActive(i)}
                  onPointerMove={enter(i)}
                  onPointerLeave={leave}
                  className="cap-panel-head"
                >
                  <GlyphTile name={row.glyph} signal={on} />
                  <Ordinal n={pad(i + 1)} className="t-mono-11 text-ink-3" />
                  {/* The space keeps the ordinal and the title two words
                      in the control's name. */}
                  <span className="sr-only"> {row.title}</span>
                </button>
                {/* The short title up the closed panel's left edge; the open
                    panel prints the full title below, so this one is
                    decoration. */}
                <span aria-hidden="true" className="cap-panel-short t-card">
                  {row.short}
                </span>
                <div className="cap-visual">{visuals[i]}</div>
                <div id={panelId} role="region" aria-labelledby={headId} className="cap-panel-words">
                  <div inert={hydrated && !on} className="cap-panel-copy">
                    {row.caption ? (
                      <p className="t-mono text-ink-3" style={step(0)}>
                        {row.caption}
                      </p>
                    ) : null}
                    <h3 className="t-card text-ink" style={step(1)}>
                      {row.title}
                    </h3>
                    <p className="t-body max-w-[440px] text-ink-2" style={step(2)}>
                      {row.body}
                    </p>
                    {/* The foot: the tags at the left, the way out at the
                        right, on one line where the tags fit. */}
                    <div className="cap-panel-foot" style={step(3)}>
                      <Tags tags={row.tags} />
                      <MonoLink href={`/capabilities#${row.slug}`} label={EXPLORE} ariaLabel={`${EXPLORE} ${row.short}`} />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <TickRule lit={(active + 1) / count} />
      </InView>

      {/* ── the rail, below 1200 ─────────────────────────────────────── */}
      <InView className="hidden w-full narrow:block">
        <Rail ariaLabel="What we do" className="cap-rail [--rail-w:85vw] tablet:[--rail-w:60vw]">
          {rows.map((row, i) => (
            <Card key={row.slug} radius={24} spot className="cap-rail-item flex h-full flex-col overflow-clip">
              <div className="relative aspect-[16/10] w-full phone:aspect-[4/5]">{visuals[i]}</div>
              <div className="flex flex-col gap-(--space-3) p-(--card-pad)">
                <div className="flex items-center gap-(--space-3)">
                  <GlyphTile name={row.glyph} sm />
                  <Ordinal n={pad(i + 1)} className="t-mono-11 text-ink-3" />
                </div>
                {row.caption ? <p className="t-mono text-ink-3">{row.caption}</p> : null}
                <h3 className="t-card text-ink">{row.title}</h3>
                <p className="t-body text-ink-2">{row.body}</p>
                <Tags tags={row.tags} />
                <MonoLink href={`/capabilities#${row.slug}`} label={EXPLORE} ariaLabel={`${EXPLORE} ${row.short}`} />
              </div>
            </Card>
          ))}
        </Rail>
      </InView>
    </div>
  );
}
