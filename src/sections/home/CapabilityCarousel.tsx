'use client';

import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { useHydrated } from '@/lib/motion';
import { Chevron, Glyph } from '@/components/ui';

/* ============================================================================
   THE CAPABILITY CARDS — the moving part. See CapabilitiesSlider.tsx for the
   block, and globals.css (THE CAPABILITY CARDS, the `cap-` classes) for
   every measurement.

   All state is one number: which card is open. Everything that moves is a
   CSS transition on a class this sets, so the server's HTML is the finished
   first state (card 01 open), and with scripts off the <noscript> rule at
   the foot lays all five cards out open, one under the other.

   What changes the card, all measured on the reference:
     the arrows          previous and next, wrapping round at both ends
     a closed card       straight to it, under the pointer or a finger
     a bar               straight to it
     the keyboard        ← → wrap, Home and End, with focus anywhere inside
     a sideways drag     past 36px; it counts as sideways once it has moved
                         10px across before 12px down. The cards do not
                         follow the finger: the change happens on release.
                         A click straight after any press that travelled
                         more than 12px, sideways or not, is swallowed, so
                         a drag never opens the card's link.
   Nothing plays by itself.

   ONE CONTROL PER JOB FOR A SCREEN READER AND THE KEYBOARD. A closed card
   is a click target for the pointer and the finger only: the bars do the
   same job, one per card, and each bar is the one button that names its
   card. The reference makes the closed cards buttons as well, which reads
   every name out twice and, on a phone, puts four 12px-wide buttons in the
   tab order.
   ========================================================================= */

export type CapabilityCard = {
  /** '01' — the content's '/01' without its slash, as the reference prints. */
  n: string;
  title: string;
  body: string;
  /** The row's tags, joined: the reference's category line. */
  category: string;
  /** "Demonstration data." on the card that shows the OPS screen. */
  demo?: string;
  /** A white picture: the words need their own dark ground (see the CSS). */
  light: boolean;
};

const SLOP = 10; // px across before a drag counts as sideways
const CANCEL = 12; // px down that makes it a scroll instead; px of any
// travel after which the press is a drag, not a click
const TRAVEL = 36; // px a drag must cover to change the card
const SWALLOW = 300; // ms a click is ignored after a drag

export default function CapabilityCarousel({
  cards,
  media,
  cta,
  labelledBy,
}: {
  cards: readonly CapabilityCard[];
  /** One picture per card, drawn on the server (see CapabilitiesSlider). */
  media: readonly ReactNode[];
  cta: { label: string; href: string };
  /** The id of the block's heading, which names the carousel. */
  labelledBy: string;
}) {
  const count = cards.length;
  const [open, setOpen] = useState(0);
  const hydrated = useHydrated();

  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const openRef = useRef(0);
  const refocus = useRef(false);

  /* Opening a card closes the link that may have had focus, and focus
     would drop to the page, so it is handed to the new card's link. */
  const go = useCallback(
    (to: number) => {
      const next = ((to % count) + count) % count;
      const from = openRef.current;
      if (next === from) return;
      const focused = document.activeElement;
      refocus.current = focused !== null && focused === links.current[from];
      openRef.current = next;
      setOpen(next);
    },
    [count],
  );

  useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    links.current[open]?.focus({ preventScroll: true });
  }, [open]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Alt+← is the browser's Back, and Ctrl or Cmd with an arrow belongs to
    // the system: only a bare key moves the cards.
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const to =
      e.key === 'ArrowRight'
        ? openRef.current + 1
        : e.key === 'ArrowLeft'
          ? openRef.current - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? count - 1
              : null;
    if (to === null) return;
    e.preventDefault();
    go(to);
  };

  /* ── the drag ───────────────────────────────────────────────────────── */
  /* `down`: it went down first, so it can no longer turn sideways. `moved`:
     it travelled far enough, either way, that its click is not a click. */
  const drag = useRef<{ id: number; x: number; y: number; across: boolean; down: boolean; moved: boolean } | null>(
    null,
  );
  const swallowUntil = useRef(0);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, across: false, down: false, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = Math.abs(e.clientX - d.x);
    const dy = Math.abs(e.clientY - d.y);
    if (dx > CANCEL || dy > CANCEL) d.moved = true;
    if (d.across || d.down) return;
    if (dy > CANCEL && dy > dx) {
      d.down = true;
      return;
    }
    if (dx > SLOP) {
      d.across = true;
      // Keep the release even if the pointer leaves the row.
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* a pointer that has already gone cannot be captured */
      }
    }
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId) return;
    if (d.across || d.moved) swallowUntil.current = performance.now() + SWALLOW;
    if (!d.across) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > TRAVEL) go(openRef.current + (dx < 0 ? 1 : -1));
  };
  const onPointerCancel = () => {
    drag.current = null;
  };
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (performance.now() < swallowUntil.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const pad = (v: number) => String(v).padStart(2, '0');
  const current = cards[open] ?? cards[0];

  /* WITH SCRIPTS OFF nothing can open a card, so every card is laid out
     open, full width, one under the other, and the controls are hidden. */
  const noScript =
    `.cap-row{flex-direction:column;height:auto;gap:2px}` +
    `.cap-card{width:100%;height:clamp(420px,70svh,640px)}` +
    `.cap-media,.cap-text,.cap-veil-top,.cap-veil-foot{width:100%}` +
    // every card is open here, so none takes the closed strip's longer band
    `.cap-card:not(.cap-open) .cap-veil-top{height:170px}` +
    `.cap-media{transform:none}` +
    `.cap-text{opacity:1;transform:none;pointer-events:auto}` +
    `.cap-dim,.cap-labels,.cap-show,.cap-controls{display:none}`;

  return (
    <div
      className="cap-root"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelledBy}
      onKeyDown={onKeyDown}
    >
      <noscript>
        <style>{noScript}</style>
      </noscript>

      <div
        className="theme-dark cap-row"
        style={{ '--rest': count - 1 } as CSSProperties}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
      >
        {cards.map((c, i) => {
          const isOpen = i === open;
          return (
            <div
              key={c.n}
              className={`cap-card ${isOpen ? 'cap-open' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${c.title}`}
              data-origin-card={c.title.replace(/\.$/, '')}
            >
              <div className="cap-media">{media[i]}</div>
              {c.light ? (
                <>
                  <span className="cap-veil-top" aria-hidden="true" />
                  <span className="cap-veil-foot" aria-hidden="true" />
                </>
              ) : null}
              <span className="cap-shade" aria-hidden="true" />
              <span className="cap-dim" aria-hidden="true" />

              <span className="cap-labels" aria-hidden="true">
                <span className="cap-label-num">{c.n}</span>
                {/* The OPS strip's "Demonstration data." (see the CSS). */}
                {c.demo ? <span className="cap-label-demo t-mono">{c.demo}</span> : null}
                <span className="cap-label-title">{c.title}</span>
              </span>

              {/* Closed cards' words are out of reach once scripts run
                  (`inert`); before that, and with scripts off, every card's
                  words are a working link. */}
              <Link
                ref={(el) => {
                  links.current[i] = el;
                }}
                href={cta.href}
                className="cap-text"
                draggable={false}
                inert={hydrated && !isOpen}
              >
                <span className="cap-top">
                  <span className="cap-meta">
                    <span className="cap-cat">{c.category}</span>
                    {c.demo ? <span className="cap-demo">{c.demo}</span> : null}
                  </span>
                  <span className="cap-num">{c.n}</span>
                </span>
                <span className="cap-foot">
                  <h3 className="cap-title">{c.title}</h3>
                  <span className="cap-body">{c.body}</span>
                  {/* THE CARD'S FOOT IS A MONOLINK'S DRAWING (28 September
                      2026): the label and the 24px dot, as every secondary
                      action on the site. A span, not a MonoLink: the whole
                      card is already the one link. */}
                  <span className="tap-44 mt-[16px] inline-flex items-center gap-[8px]">
                    <span className="t-mono text-ink">{cta.label}</span>
                    <span className="dot-btn" aria-hidden="true">
                      <Glyph />
                    </span>
                  </span>
                </span>
              </Link>

              {/* A closed card opens under the pointer or a finger. Not a
                  button: the bar below is this card's button (see the note
                  at the top). */}
              {isOpen ? null : <span className="cap-show" aria-hidden="true" onClick={() => go(i)} />}
            </div>
          );
        })}
      </div>

      <div className="cap-controls">
        <div className="cap-left">
          {/* Announced politely on every change: the count, then the name. */}
          <p className="cap-counter" aria-live="polite" aria-atomic="true">
            {pad(open + 1)}
            <span className="text-ink-3"> / {pad(count)}</span>
            <span className="sr-only"> {current?.title}</span>
          </p>
          <div className="cap-bars">
            {cards.map((c, i) => (
              <button
                key={c.n}
                type="button"
                className="cap-bar"
                aria-label={`Show ${c.title}`}
                aria-current={i === open}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </div>
        <div className="cap-arrows">
          <button type="button" className="cap-arrow" aria-label="Previous capability" onClick={() => go(open - 1)}>
            <Chevron dir="left" />
          </button>
          <button type="button" className="cap-arrow" aria-label="Next capability" onClick={() => go(open + 1)}>
            <Chevron dir="right" />
          </button>
        </div>
      </div>
    </div>
  );
}
