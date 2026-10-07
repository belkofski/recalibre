'use client';

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { Steps } from '@/lib/motion';
import { Glyph, GlyphTile, MonoLink, Numeral, type GlyphName } from '@/components/ui';

/* ============================================================================
   THE CAPABILITIES, WALKED BY THE SCROLL.

   A `Steps` block of five (lib/motion.tsx): the block pins under the bar
   and the capability being read follows the scroll down, one for every
   ~55% of a window. Nothing slides sideways and nothing needs a swipe.

   FROM 1200 UP, THE EXPANDING PANELS. Five surfaces on one seam plate; the
   open one takes 3.2 shares of the width and the rest one each, and the
   open one walks along the row as the page goes down. A closed panel shows
   its glyph tile, its ordinal and its short name up its left edge; the
   open one shows a drawn object (its outline numeral and its glyph at
   size, on a dotted bed), its title, its one line and the way to its
   chapter. Pressing a closed panel scrolls the page to its step
   (`data-step-go`), so the scroll stays the one source of where the
   reader is.

   BELOW 1200, ONE AT A TIME. The five names are the list and the progress
   (two columns of names on a phone, a column beside the card from 600),
   and the card beside or under them shows the capability being read.
   Pressing a name scrolls to it.

   NOT PINNED (reduced motion, no scripts, a window under 560 tall such as
   a phone held sideways): the five are a plain column, every one whole,
   and nothing is hidden or inert (home.css, `.cap-steps:not([data-pinned])`).

   No photographs: each capability is drawn (its glyph and its numeral),
   and its one line is its summary, as written.
   ========================================================================= */

export type CapabilityStep = {
  /** '01'. */
  n: string;
  slug: string;
  short: string;
  title: string;
  line: string;
  glyph: GlyphName;
};

/** The way from a capability to its chapter on /capabilities: a
 *  structural label, named for a voice user with the capability's name. */
const EXPLORE = 'EXPLORE';

/** The active step and whether the block is pinned, read off the Steps
 *  root's own attributes, so there is one reading of where the reader is. */
function useStepsState(ref: RefObject<HTMLElement | null>) {
  const [state, setState] = useState({ active: 0, pinned: false });
  useEffect(() => {
    const root = ref.current?.closest<HTMLElement>('.steps');
    if (!root || typeof MutationObserver === 'undefined') return;
    const read = () => {
      const n = Number(root.dataset.active ?? 0);
      setState({ active: Number.isFinite(n) ? n : 0, pinned: root.hasAttribute('data-pinned') });
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ['data-active', 'data-pinned'] });
    return () => mo.disconnect();
  }, [ref]);
  return state;
}

function Frame({ rows }: { rows: readonly CapabilityStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { active, pinned } = useStepsState(ref);
  const on = (i: number) => (i === active ? '' : undefined);
  /* Only a pinned block hides the steps it is not showing. */
  const hidden = (i: number) => pinned && i !== active;

  return (
    <div ref={ref} className="cap-frame pad-x flex w-full flex-col items-center">
      <div className="shell flex w-full flex-col gap-(--space-4)">
        {/* ── the panels, from 1200 up ─────────────────────────────── */}
        <div className="cap-plate seam narrow:hidden">
          {rows.map((row, i) => (
            <article
              key={row.slug}
              data-step-of={i}
              data-on={on(i)}
              aria-labelledby={`cap-${row.slug}-t`}
              className="cap-panel card card-30 surface"
            >
              <button
                type="button"
                data-step-go={i}
                aria-current={active === i ? 'step' : undefined}
                className="cap-panel-head"
              >
                <GlyphTile name={row.glyph} signal={active === i} />
                <span className="t-mono-11 tabular-nums text-ink-3">{row.n}</span>
                <span className="sr-only"> {row.short}</span>
              </button>
              <span aria-hidden="true" className="cap-panel-short t-card">
                {row.short}
              </span>
              <div aria-hidden="true" className="cap-art">
                <span className="grid-dots absolute inset-0 rounded-[inherit]" />
                <Numeral n={row.n} className="cap-art-numeral" />
                <Glyph name={row.glyph} size={160} className="cap-art-glyph" />
              </div>
              <div className="cap-panel-words" inert={hidden(i)}>
                <div className="cap-panel-copy">
                  <h3 id={`cap-${row.slug}-t`} className="t-card text-ink" style={{ '--i': 0 } as CSSProperties}>
                    {row.title}
                  </h3>
                  <p className="t-body max-w-[460px] text-ink-2" style={{ '--i': 1 } as CSSProperties}>
                    {row.line}
                  </p>
                  <div style={{ '--i': 2 } as CSSProperties}>
                    <MonoLink href={`/capabilities#${row.slug}`} label={EXPLORE} ariaLabel={`${EXPLORE} ${row.short}`} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── one at a time, below 1200 ───────────────────────────────── */}
        <div className="cap-one hidden narrow:grid">
          <ol className="cap-list" aria-label="Capabilities">
            {rows.map((row, i) => (
              <li key={row.slug} className="flex">
                <button
                  type="button"
                  data-step-go={i}
                  data-step-of={i}
                  data-on={on(i)}
                  aria-current={active === i ? 'step' : undefined}
                  className="cap-list-item"
                >
                  <span className="cap-list-tile">
                    <GlyphTile name={row.glyph} sm signal={active === i} />
                  </span>
                  <span className="t-mono-11 tabular-nums text-ink-3">{row.n}</span>
                  <span className="cap-list-name">{row.short}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="cap-cards">
            {rows.map((row, i) => (
              <article
                key={row.slug}
                data-step-of={i}
                data-on={on(i)}
                aria-labelledby={`cap-${row.slug}-m`}
                inert={hidden(i)}
                className="cap-card card card-24 surface"
              >
                <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />
                <Numeral n={row.n} className="cap-card-numeral" />
                <div className="cap-card-head">
                  <GlyphTile name={row.glyph} sm />
                  <span className="t-mono-11 tabular-nums text-ink-3">{row.n}</span>
                </div>
                <h3 id={`cap-${row.slug}-m`} className="cap-card-title t-card text-ink">
                  {row.title}
                </h3>
                <p className="t-body text-ink-2">{row.line}</p>
                <MonoLink href={`/capabilities#${row.slug}`} label={EXPLORE} ariaLabel={`${EXPLORE} ${row.short}`} />
              </article>
            ))}
          </div>
        </div>

        {/* The rule fills with the walk through the five (scroll.css). */}
        <div aria-hidden="true" className="steps-progress" />
      </div>
    </div>
  );
}

export default function CapabilitySteps({ rows }: { rows: readonly CapabilityStep[] }) {
  return (
    <Steps count={rows.length} stepVh={55} className="cap-steps">
      <Frame rows={rows} />
    </Steps>
  );
}
