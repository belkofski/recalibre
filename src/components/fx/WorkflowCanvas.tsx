'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { layout, order, type WorkflowSpec } from '@/lib/workflow';
import { useHydrated, useReducedMotion } from '@/lib/motion';
import WorkflowIcon from '@/components/fx/WorkflowIcon';

/* ============================================================================
   THE WORKFLOW CANVAS — a system drawn, then run (4 November 2026).

   The drawing is complete in the server's markup: a dot-grid field, the
   edges as SVG curves, the nodes as HTML tiles laid in percentages of the
   nominal box, every node in its finished (`done`) state. That is what a
   reader with scripts off sees, what a crawler reads, and what a reader
   who asked for reduced motion keeps.

   WHEN IT IS IN VIEW the script plays an execution through it: node by
   node in column order, a tile goes `running` (a ring in the accent), its
   outgoing edges carry a pulse (a dot riding the curve on a CSS offset
   path), the tile goes `done`, the next begins. After the last node it
   rests 1.5s, clears, and plays again — the one loop on the site allowed
   by the owner's decision of 4 November 2026, under these conditions: it
   runs only while visible, it has a visible 44px PAUSE control
   (`aria-pressed`, WCAG 2.2.2), and it is fully static under
   prefers-reduced-motion. No frame is drawn while it is off screen.
   ========================================================================= */

type NodeState = 'idle' | 'running' | 'done';

const RUN_MS = 420;
const PULSE_MS = 520;
const REST_MS = 1500;

export default function WorkflowCanvas({
  spec,
  className = '',
  pauseLabel = 'Pause motion',
  playLabel = 'Play motion',
}: {
  spec: WorkflowSpec;
  className?: string;
  pauseLabel?: string;
  playLabel?: string;
}) {
  const laid = layout(spec);
  const seq = order(spec);
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const box = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [states, setStates] = useState<Record<string, NodeState>>({});
  const [pulses, setPulses] = useState<Record<string, number>>({});

  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => setInView(entries.some((e) => e.isIntersecting)), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const live = hydrated && !reduce && inView && !paused;

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });
    (async () => {
      while (!cancelled) {
        setStates({});
        for (const id of seq) {
          if (cancelled) return;
          setStates((s) => ({ ...s, [id]: 'running' }));
          await wait(RUN_MS);
          if (cancelled) return;
          setStates((s) => ({ ...s, [id]: 'done' }));
          const out = laid.edges.filter((e) => e.from === id);
          if (out.length) {
            setPulses((p) => {
              const next = { ...p };
              for (const e of out) next[e.key] = (p[e.key] ?? 0) + 1;
              return next;
            });
            await wait(PULSE_MS);
          }
        }
        await wait(REST_MS);
      }
    })();
    return () => {
      cancelled = true;
      for (const t of timers) window.clearTimeout(t);
    };
    // The sequence and the edges derive from the spec, which does not change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, spec.key]);

  /* Static: everything done. Playing: what the sequence says. */
  const stateOf = (id: string): NodeState => (live ? (states[id] ?? 'idle') : 'done');
  const pct = (n: number, of: number) => `${(n / of) * 100}%`;

  return (
    <figure className={`wf flex flex-col gap-[12px] ${className}`}>
      <div
        ref={box}
        role="img"
        aria-label={spec.description}
        className="wf-field relative w-full overflow-clip rounded-[24px] border border-rule bg-raised"
        style={{ aspectRatio: `${laid.w} / ${laid.h}` } as CSSProperties}
      >
        <svg viewBox={`0 0 ${laid.w} ${laid.h}`} className="absolute inset-0 size-full" aria-hidden="true" fill="none">
          {laid.edges.map((e) => (
            <g key={e.key}>
              <path d={e.d} className={`wf-edge ${e.dashed ? 'wf-edge-dashed' : ''}`} />
              <circle cx={e.p[0][0]} cy={e.p[0][1]} r="3" className="wf-port" />
              <circle cx={e.p[3][0]} cy={e.p[3][1]} r="3" className="wf-port" />
              {live && pulses[e.key] ? (
                <circle
                  key={pulses[e.key]}
                  r="4"
                  className="wf-pulse"
                  style={{ offsetPath: `path('${e.d}')`, animationDuration: `${PULSE_MS}ms` } as CSSProperties}
                />
              ) : null}
            </g>
          ))}
        </svg>
        {laid.nodes.map((n) => (
          <div
            key={n.id}
            data-state={stateOf(n.id)}
            data-kind={n.kind}
            className="wf-node absolute flex items-center gap-[2.2cqw]"
            style={{ left: pct(n.x, laid.w), top: pct(n.y, laid.h), width: pct(n.w, laid.w), height: pct(n.h, laid.h) }}
          >
            <span className="wf-tile flex flex-none items-center justify-center">
              <span className="wf-glyph">
                <WorkflowIcon icon={n.icon} />
              </span>
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="wf-label truncate text-ink">{n.label}</span>
              {n.sub ? <span className="wf-sub truncate text-ink-3">{n.sub}</span> : null}
            </span>
            <span className="wf-check" aria-hidden="true" />
          </div>
        ))}
      </div>
      {hydrated && !reduce ? (
        <div className="flex items-center justify-end">
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
            className="tap-44 t-mono hover-read flex items-center gap-[8px]"
          >
            <span className={`size-[6px] rounded-full ${paused ? 'bg-ink-3' : 'bg-accent-bright'}`} aria-hidden="true" />
            {paused ? playLabel.toUpperCase() : pauseLabel.toUpperCase()}
          </button>
        </div>
      ) : null}
    </figure>
  );
}
