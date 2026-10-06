'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { InView, useHydrated, useMedia } from '@/lib/motion';
import { Card, Chip, MonoLink, TickRule } from '@/components/ui';

/* ============================================================================
   THE CAPABILITY INDEX — the moving part. CapabilityIndex.tsx composes the
   section on the server and draws the five visuals; this file holds the one
   piece of state, which row is open, and the two shapes that state takes.

   FROM 1200 UP IT IS A TABLIST. Five rows on hairlines at the left, one
   open; a dark card at the right, pinned under the bar, holding five
   stacked layers of which the open row's is shown (the stylesheet's
   `.story-layer` crossfade, with `data-on` set here rather than by the
   scroll). One 2px bar in the signal blue slides to the open row on the
   spring curve — a bar that moves, never five borders that toggle.

   BELOW 1200 IT IS AN ACCORDION. The pinned card is gone; each open row
   prints its own visual under its words, in a 4:3 box, and the roles turn
   from tab/tabpanel to a disclosure (`aria-expanded`). The same markup
   serves both: `useMedia` switches the roles after hydration, and until
   then the page carries the tablist, which is the finished state on the
   width the server cannot know.

   ONE ROW IS ALWAYS OPEN. An index is not a FAQ: the card at the right
   must always show something, so a row cannot be closed, only another
   opened. On the accordion the same rule holds, so the two shapes share
   one state and the first row is open on the server.

   WHAT OPENS A ROW: a click or a tap; Enter or Space on its head; ↑ ↓ Home
   End from any head (the focus follows); and on a pointer device from
   1200 up, resting on a row for 90ms — long enough that a pointer crossing
   the list on its way elsewhere opens nothing.

   THE BAR IS MEASURED, NOT COMPUTED. The open row is taller than the
   others, and the heads can wrap at 1200, so the bar reads the open head's
   offset and height off the DOM and writes them to two custom properties.
   A ResizeObserver on the list re-reads them every frame the folds are
   moving, so the bar follows the heads as they shift.
   ========================================================================= */

export type CapabilityTab = {
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
};

const HOVER_MS = 90;

export default function CapabilityTabs({
  rows,
  visuals,
}: {
  rows: readonly CapabilityTab[];
  /** One per row, in order: each fills an `absolute inset-0` box. Drawn
   *  on the server (ArtImg) or by its own client component (the diagram). */
  visuals: readonly ReactNode[];
}) {
  const [active, setActive] = useState(0);
  const narrow = useMedia('(max-width: 1199.98px)');
  /* Folded rows are `inert` only once scripts run: without them every row
     is laid out open (the fold's closed state is gated on `.js`), and an
     inert row would be readable but unreachable. */
  const hydrated = useHydrated();
  const count = rows.length;

  const listRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const heads = useRef<(HTMLButtonElement | null)[]>([]);
  const hover = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* The bar: written straight to the DOM, as the parallax is, so a
     measurement never costs a render. */
  useEffect(() => {
    const list = listRef.current;
    const bar = barRef.current;
    if (!list || !bar) return;
    const place = () => {
      const head = heads.current[active];
      if (!head) return;
      bar.style.setProperty('--bar-y', `${head.offsetTop}px`);
      bar.style.setProperty('--bar-h', `${head.offsetHeight}px`);
    };
    place();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active]);

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
    if (e.key === 'ArrowDown') next = (active + 1) % count;
    else if (e.key === 'ArrowUp') next = (active - 1 + count) % count;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = count - 1;
    if (next === undefined) return;
    e.preventDefault();
    go(next);
  };

  /* THE INTENT IS A MOVING POINTER, NOT A RESTING ONE. The browser fires
     pointer events of its own when the page scrolls under a still mouse
     (a key moving focus to a row scrolls it into view), and those events
     used to arm the timer for whichever row the mouse happened to rest
     over, snapping a keyboard reader's choice back. Only an event whose
     position differs from the last one counts as the reader's hand; one
     timer per row, never reset by the small movements inside it. */
  const last = useRef<{ x: number; y: number; row: number | null }>({ x: -1, y: -1, row: null });
  const enter = (i: number) => (e: PointerEvent<HTMLButtonElement>) => {
    if (narrow || e.pointerType === 'touch') return;
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
  const current = rows[active] ?? rows[0];

  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-[40px] narrow:grid-cols-1">
      {/* ── the rows ─────────────────────────────────────────────────── */}
      <div
        ref={listRef}
        onKeyDown={onKey}
        className="cap-index-list relative w-full border-y border-rule"
      >
        <span ref={barRef} aria-hidden="true" className="cap-index-bar" />
        {rows.map((row, i) => {
          const on = i === active;
          const tabId = `cap-tab-${row.slug}`;
          const panelId = `cap-panel-${row.slug}`;
          return (
            <div key={row.slug} className={i > 0 ? 'border-t border-rule' : ''}>
              <button
                ref={(el) => {
                  heads.current[i] = el;
                }}
                type="button"
                id={tabId}
                aria-expanded={on}
                aria-controls={panelId}
                onClick={() => setActive(i)}
                onPointerMove={enter(i)}
                onPointerLeave={leave}
                className="cap-index-head flex min-h-[72px] w-full items-center gap-(--space-4) rounded-[8px] px-(--space-4) py-(--space-3) text-left"
              >
                <span className="t-mono-11 w-[40px] shrink-0 tabular-nums text-ink-2 phone:w-[24px]">{row.n.replace('/', '')}</span>
                {/* The open title at full ink, the rest a step down, so the
                    list has the same two tones the story's chapters have. */}
                <span className={`t-card transition-colors duration-300 ${on ? 'text-ink' : 'text-ink-2'}`}>{row.title}</span>
              </button>

              {/* The fold: 0fr to 1fr on the panel curve; `inert` while
                  closed, so a folded row is out of the tab order and out of
                  the screen reader's path as well as out of sight. */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={tabId}
                data-on={on ? '' : undefined}
                className="cap-index-fold"
              >
                <div inert={hydrated && !on}>
                  <div className="flex flex-col gap-(--space-4) pb-(--space-5) pl-[88px] pr-(--space-4) phone:pl-(--space-4)">
                    <p className="t-body max-w-[520px] text-ink-2">{row.body}</p>
                    <div className="flex flex-wrap gap-(--space-1)">
                      {row.tags.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                    <MonoLink href={`/capabilities#${row.slug}`} label="EXPLORE" ariaLabel={`EXPLORE ${row.short}`} />
                    {/* Below 1200 the row carries its own visual; from 1200
                        up this box is not drawn and the card at the right
                        shows the same visual. */}
                    <Card radius={24} className="theme-dark mt-(--space-2) hidden aspect-[4/3] w-full overflow-clip narrow:block">
                      {visuals[i]}
                    </Card>
                    {row.caption ? <p className="t-mono hidden text-ink-2 narrow:block">{row.caption}</p> : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── the card ─────────────────────────────────────────────────── */}
      {/* Its own reveal (a plate scales in from 0.96), with the sticky card
          inside the reveal's box, which stretches to the grid row's height
          so the card has room to stay pinned while the rows scroll. */}
      <InView mode="scale" className="narrow:hidden">
        <Card
          radius={30}
          className="theme-dark sticky top-[calc(var(--bar)+32px)] flex aspect-[4/5] max-h-[calc(100svh-120px)] w-full flex-col overflow-clip"
        >
          <div className="story-visual min-h-0 flex-1">
            {visuals.map((v, i) => (
              <div key={rows[i]?.slug ?? i} data-on={i === active ? '' : undefined} className="story-layer">
                {v}
              </div>
            ))}
          </div>
          {/* The foot, on the card's own ground rather than over the
              picture: the count and the rule lit to the open row's place,
              and the visual's caption where it has one. */}
          <div className="flex flex-col gap-(--space-2) p-(--card-pad) pt-(--space-3)">
            <TickRule lit={(active + 1) / count} />
            <div className="flex items-center justify-between gap-(--space-3)">
              <span className="t-mono tabular-nums text-ink-3">
                {pad(active + 1)} / {pad(count)}
              </span>
              {current?.caption ? <span className="t-mono text-ink-3">{current.caption}</span> : null}
            </div>
          </div>
        </Card>
      </InView>
    </div>
  );
}
