'use client';

import { memo, useEffect, useId, useRef, useState } from 'react';
import { useHydrated, useReducedMotion } from '@/lib/motion';
import {
  DIAGRAM_DESCRIPTION,
  PRESETS,
  lh,
  pointAt,
  type DEdge,
  type DNode,
  type IconName,
  type Layout,
  type Preset,
} from '@/lib/diagram';

/* ============================================================================
   CONTRAXIS, AS A MOVING SYSTEM DIAGRAM — the owner's decision of 26
   September 2026, replacing the still schematic that stood in every slot
   (ContraxisDrawing.tsx, now removed).

   The style is the Diagramflow reference's NEURAL mode in its dark theme,
   rebuilt from measurements: glass cards (white at 0.04, a 1px edge at
   0.12, radius 14) with a 32px icon tile, a larger centre card with a soft
   glow, cubic connectors, a port dot where a line meets a card, and two
   small dots riding every line, half a loop apart, all in phase, one loop
   in about 2.86 seconds. The type is the site's one face, Geist,
   and the seven icons are drawn here on a 16-unit grid. The words and the
   geometry are in lib/diagram.ts.

   ONE CARD HAS A COLOURED EDGE. "A person decides", the step that is not
   automated, is outlined in a thin line of the site's light blue, #8aa4ec
   (the owner's decision of 26 September 2026, first drawn in the lime the
   site used until 27 September), in every layout. Everything else
   stays white on the ground.

   ── IT IS STILL A SCHEMATIC ───────────────────────────────────────────────

   No Contraxis screenshot may be published, and a drawing dressed up as an
   interface is the same lie told more slowly. So: no window chrome, no
   figures, no data, nothing about volume, speed or accuracy — and every slot
   still prints "Schematic — not a screenshot" beside it. The dots show the
   order of the five steps. They do not stand for documents or for traffic.

   ── WHAT THE SERVER SENDS, AND WHAT THE SCRIPT ADDS ───────────────────────

   The server sends the whole diagram — cards, words, lines, ports — as SVG,
   one per layout, and CSS shows the one that fits the slot (`.sd` in
   globals.css). With scripts off, or for a reader who asks for reduced
   motion, that is the finished state: a still diagram, no dots. The script
   adds the dots, to the layout on show only, and moves them in one
   requestAnimationFrame loop. Nothing is measured and nothing is laid out
   again, so nothing moves but the dots.

   ── ON A CARD, FIVE SECONDS AT A TIME ─────────────────────────────────────

   Motion that starts on its own, runs longer than five seconds and sits
   beside other content needs a way to stop it (WCAG 2.2.2). On the cards
   (Home, the work index, 'More work') the dots do not run that long: each
   time the diagram comes on screen they fade in, ride their lines for about
   a loop and a half, and fade out, 4.6 seconds in all, and the diagram
   rests as the server drew it. Pointing at the card, or moving keyboard
   focus into it, runs them once more.

   ── ON THE CONTRAXIS PAGE, A LOOP, WITH A WAY TO STOP IT ──────────────────

   The cover and the gallery on /work/contraxis are `loop`: there the dots
   keep riding for as long as the diagram is on screen (the owner's decision
   of 26 September 2026). So each carries a PAUSE MOTION control, built as
   the partner band's PAUSE LOGOS control is (sections/home/MarkRow.tsx) —
   the same type and colours, a 44px target, and words that change with the
   state (RESUME MOTION) instead of a pressed state, for the reason given
   there. Pausing holds the dots where they are and resuming carries on from
   there. The control is placed by the slot beside the diagram, never over
   it. It appears once the script that moves the dots is running, and never
   for a reader who asks for reduced motion, who gets no dots at all.

   In both, the first run waits until the page has loaded and gone quiet,
   so it never competes with the page's first paint.
   ========================================================================= */

/** One loop of a dot along its line, measured on the reference: 0.00035 of
 *  the curve per millisecond. */
const LOOP_MS = 2860;
/** One run of the dots on a card, fades included: under WCAG 2.2.2's five
 *  seconds. A `loop` slot fades in once and runs until paused. */
const RUN_MS = 4600;
/** The fade at each end of a run, and the dots' opacity between (the
 *  reference's 0.7). */
const FADE_MS = 300;
const DOT_OPACITY = 0.7;
const SVG_NS = 'http://www.w3.org/2000/svg';

const INK = 'rgba(255,255,255,0.92)';
const LINE = 'rgba(255,255,255,0.16)';
const PORT = 'rgba(255,255,255,0.85)';
/** The site's light blue (`--color-accent-bright` in globals.css), for the
 *  edge of the one step a person takes. */
const ACCENT = '#8aa4ec';

/* The icons, drawn for this diagram on a 16-unit grid: stroke 1.1, round
   caps and joins, no fill. None comes from a library or from the
   reference. */
const ICONS: Record<IconName, string> = {
  // a contract: a page with a folded corner, two lines and a signature
  contract: 'M4 2.5h5.2L12 5.3v8.2H4z M9.2 2.5v2.8H12 M6 7.3h4 M6 9.3h4 M6 11.8c.5-.7 1-.7 1.4 0s.9.7 1.4 0',
  // an invoice: a receipt with a torn foot
  invoice: 'M4.5 2.5h7v11l-1.17-.8-1.16.8-1.17-.8-1.17.8-1.16-.8-1.17.8z M6.5 5.4h3 M6.5 7.6h3 M6.5 9.8h1.8',
  // a report: a page with three bars
  report: 'M3.5 2.5h9v11h-9z M6 11.2V8.6 M8 11.2V5.8 M10 11.2V9.4',
  // findings: a magnifier
  findings: 'M10.6 7a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0z M9.6 9.6l3.4 3.4',
  // actions: an arrow put forward
  actions: 'M2.5 8h10 M9.3 4.8l3.2 3.2-3.2 3.2',
  // traceability: two links of a chain
  trace: 'M6.9 9.1l2.2-2.2 M8.1 4.9l1.2-1.2a2.6 2.6 0 0 1 3.7 3.7l-1.2 1.2 M7.9 11.1l-1.2 1.2a2.6 2.6 0 0 1-3.7-3.7l1.2-1.2',
  // a person
  person: 'M10.4 5.2a2.4 2.4 0 1 1-4.8 0 2.4 2.4 0 0 1 4.8 0z M3.6 13.5c.5-2.5 2.2-3.9 4.4-3.9s3.9 1.4 4.4 3.9',
};


function Icon({ name, x, y, size }: { name: IconName; x: number; y: number; size: number }) {
  return (
    <path
      d={ICONS[name]}
      transform={`translate(${x} ${y}) scale(${size / 16})`}
      fill="none"
      stroke={INK}
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** A card: the glass panel, the icon tile, the title and the step number. */
function Card({ n, L }: { n: DNode; L: Layout }) {
  const m = L.m;
  // "A person decides" alone takes the blue edge; see the note at the top.
  const edge = n.role === 'end' ? ACCENT : 'rgba(255,255,255,0.12)';
  const panel = (
    <>
      {/* The ground first, so a line or the centre's glow behind a card
          never shows through the 4% glass. */}
      <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={m.r} style={{ fill: 'var(--color-ground)' }} />
      <rect
        x={n.x}
        y={n.y}
        width={n.w}
        height={n.h}
        rx={m.r}
        fill="rgba(255,255,255,0.04)"
        stroke={edge}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </>
  );
  const tile = (tx: number, ty: number) => (
    <>
      <rect x={tx} y={ty} width={m.tile} height={m.tile} rx={m.tileR} fill="rgba(255,255,255,0.06)" />
      {n.icon ? <Icon name={n.icon} x={tx + (m.tile - m.icon) / 2} y={ty + (m.tile - m.icon) / 2} size={m.icon} /> : null}
    </>
  );
  const tH = lh(m.fsT);
  const sH = lh(m.fsS);
  const block = n.lines.length * tH + (n.sub ? m.lead + sH : 0);

  if (n.style === 'bare') {
    return (
      <g>
        {panel}
        {tile(n.x + (n.w - m.tile) / 2, n.y + (n.h - m.tile) / 2)}
      </g>
    );
  }
  if (n.style === 'row') {
    const tx = n.x + m.padX;
    const x = tx + m.tile + m.gap;
    const top = n.y + (n.h - block) / 2;
    return (
      <g>
        {panel}
        {tile(tx, n.y + (n.h - m.tile) / 2)}
        {n.lines.map((t, i) => (
          <text key={t} x={x} y={top + tH / 2 + i * tH} dominantBaseline="central" fontSize={m.fsT} fontWeight={500} fill={INK}>
            {t}
          </text>
        ))}
        {n.sub ? (
          <text
            x={x}
            y={top + n.lines.length * tH + m.lead + sH / 2}
            dominantBaseline="central"
            fontSize={m.fsS}
            className="sd-mono"
            fill="rgba(255,255,255,0.5)"
          >
            {n.sub}
          </text>
        ) : null}
      </g>
    );
  }
  // stack: the tile over the words, centred
  const cx = n.x + n.w / 2;
  const top = n.y + m.padY + m.tile + m.gap;
  return (
    <g>
      {panel}
      {tile(cx - m.tile / 2, n.y + m.padY)}
      {n.lines.map((t, i) => (
        <text
          key={t}
          x={cx}
          y={top + tH / 2 + i * tH}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={m.fsT}
          fontWeight={500}
          fill={INK}
        >
          {t}
        </text>
      ))}
      {n.sub ? (
        <text
          x={cx}
          y={top + n.lines.length * tH + m.lead + sH / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={m.fsS}
          className="sd-mono"
          fill="rgba(255,255,255,0.5)"
        >
          {n.sub}
        </text>
      ) : null}
    </g>
  );
}

/** The centre card: the site's three-square glyph, glowing, over the name. */
function Core({ n, L, uid }: { n: DNode; L: Layout; uid: string }) {
  const c = L.m.core;
  const gap = Math.round(c.q * 0.25);
  const G = 2 * c.q + gap;
  const cx = n.x + n.w / 2;
  const gx = cx - G / 2;
  const gy = n.lines.length || n.sub ? n.y + c.padY : n.y + (n.h - G) / 2;
  const tH = lh(c.fsT);
  const top = gy + G + c.gap;
  /* The halo is the reference's 80px white glow at 0.08, drawn as a radial
     gradient rather than a blur filter: the dots repaint the SVG every
     frame, and a blur that large would be re-rasterised with them. */
  const reach = 8.4 * c.q;
  const hx = n.w / 2 + reach;
  const hy = n.h / 2 + reach;
  return (
    <g>
      <ellipse cx={cx} cy={n.y + n.h / 2} rx={hx} ry={hy} fill={`url(#${uid}-halo)`} />
      <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={c.r} style={{ fill: 'var(--color-ground)' }} />
      <rect
        x={n.x}
        y={n.y}
        width={n.w}
        height={n.h}
        rx={c.r}
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <g filter={`url(#${uid}-glow)`} fill="rgba(255,255,255,0.95)">
        <rect x={gx} y={gy} width={c.q} height={c.q} />
        <rect x={gx + c.q + gap} y={gy} width={c.q} height={c.q} />
        <rect x={gx} y={gy + c.q + gap} width={c.q} height={c.q} />
      </g>
      {n.lines.map((t, i) => (
        <text
          key={t}
          x={cx}
          y={top + tH / 2 + i * tH}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={c.fsT}
          fontWeight={600}
          fill="rgba(255,255,255,0.95)"
        >
          {t}
        </text>
      ))}
      {n.sub ? (
        <text
          x={cx}
          y={top + n.lines.length * tH + 2 + lh(c.fsS) / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={c.fsS}
          fill="rgba(255,255,255,0.5)"
        >
          {n.sub}
        </text>
      ) : null}
    </g>
  );
}

/* Memoised: the SVG never changes once drawn, so a change in the reader's
   motion setting re-renders the component without redrawing any of it. */
const Variant = memo(function Variant({
  preset,
  vkey,
  L,
  uid,
}: {
  preset: Preset;
  vkey: string;
  L: Layout;
  uid: string;
}) {
  const id = `${uid}-${vkey}`;
  return (
    <svg
      viewBox={`0 0 ${L.w} ${L.h}`}
      preserveAspectRatio="xMidYMid meet"
      className={`sd-v sd-${preset}-${vkey}`}
      data-v={vkey}
      role="img"
      aria-label={DIAGRAM_DESCRIPTION}
    >
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="0.75" stopColor="#fff" stopOpacity="0.015" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        {/* The glyph's glow: the reference's two white drop-shadows, 12 and
            24, on a region only a little larger than the glyph. */}
        <filter id={`${id}-glow`} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur in="SourceAlpha" stdDeviation={L.m.core.q * 0.45} result="a" />
          <feGaussianBlur in="SourceAlpha" stdDeviation={L.m.core.q} result="b" />
          <feFlood floodColor="#fff" floodOpacity="0.5" />
          <feComposite in2="a" operator="in" result="ga" />
          <feFlood floodColor="#fff" floodOpacity="0.35" />
          <feComposite in2="b" operator="in" result="gb" />
          <feMerge>
            <feMergeNode in="gb" />
            <feMergeNode in="ga" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g fill="none" stroke={LINE} strokeWidth={1.25} vectorEffect="non-scaling-stroke">
        {L.edges.map((e) => (
          <path key={e.key} d={e.d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>

      {/* The dots' layer, under the cards. Empty as sent: the script fills
          the one layout on show, and only while the dots run. */}
      <g fill={PORT} opacity={0} data-dots="" />

      {L.nodes.map((n) =>
        n.role === 'core' ? <Core key={n.key} n={n} L={L} uid={id} /> : <Card key={n.key} n={n} L={L} />,
      )}

      {/* Ports last, so each sits on the edge of its card. */}
      <g fill={PORT}>
        {L.edges.flatMap((e) =>
          e.ports.map((p) => <circle key={`${e.key}-${p[0]}-${p[1]}`} cx={p[0]} cy={p[1]} r={L.m.port} />),
        )}
      </g>
    </svg>
  );
});

export default function SystemDiagram({
  preset,
  className = '',
  loop = false,
  pauseClassName = '',
}: {
  preset: Preset;
  /** Places the diagram's box inside its slot. The box must have a size of
   *  its own: the layouts are picked by its width and height. */
  className?: string;
  /** The dots keep running while the diagram is on screen, and a PAUSE
   *  MOTION control is drawn beside it (see the note at the top). Off, the
   *  dots run 4.6 seconds each time the diagram appears. */
  loop?: boolean;
  /** Places the pause control in the slot, clear of the diagram's box. */
  pauseClassName?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const variants = PRESETS[preset];
  const [paused, setPaused] = useState(false);
  /* The effect below reads the pause through a ref and is told of a change
     through `control`, so pausing holds the dots where they are instead of
     tearing the loop down and drawing it again. */
  const pausedRef = useRef(false);
  const control = useRef<{ pause: () => void; resume: () => void } | null>(null);
  const togglePause = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (next) control.current?.pause();
    else control.current?.resume();
  };

  useEffect(() => {
    const root = rootRef.current;
    if (reduced || !root) return;

    /* The dots live in the layout on show, two per line, half a loop apart.
       They are made when a run starts and moved to another layout if the
       slot changes shape. */
    type Dots = { key: string; edges: readonly DEdge[]; layer: SVGGElement; circles: SVGCircleElement[] };
    let dots: Dots | null = null;
    const shown = () =>
      [...root.querySelectorAll<SVGSVGElement>('svg[data-v]')].find((svg) => svg.getBoundingClientRect().width > 0);
    const clear = () => {
      if (!dots) return;
      dots.layer.replaceChildren();
      dots.layer.setAttribute('opacity', '0');
      dots = null;
    };
    const mount = () => {
      const svg = shown();
      const key = svg?.dataset.v;
      if (dots && dots.key === key) return;
      clear();
      const v = variants.find((x) => x.key === key);
      const layer = svg?.querySelector<SVGGElement>('g[data-dots]');
      if (!key || !v || !layer) return;
      const circles = v.layout.edges.flatMap(() =>
        [0, 1].map(() => {
          const c = document.createElementNS(SVG_NS, 'circle');
          c.setAttribute('r', String(v.layout.m.dot));
          layer.appendChild(c);
          return c;
        }),
      );
      dots = { key, edges: v.layout.edges, layer, circles };
    };
    const draw = (phase: number, opacity: number) => {
      if (!dots) return;
      const { edges, circles, layer } = dots;
      layer.setAttribute('opacity', opacity.toFixed(3));
      edges.forEach((e, i) => {
        for (let k = 0; k < 2; k++) {
          const c = circles[i * 2 + k];
          if (!c) continue;
          const [x, y] = pointAt(e.p, (phase + k * 0.5) % 1);
          c.setAttribute('cx', x.toFixed(2));
          c.setAttribute('cy', y.toFixed(2));
        }
      });
    };

    /* One run: fade in, ride the lines, fade out, then rest. The clock is
       the wall clock, so a run can never outlast RUN_MS, however slowly
       the frames come. A `loop` fades in and keeps going; `ran` is how far
       it has got, so a paused loop resumes where it stopped. */
    let raf = 0;
    let t0 = -1;
    let ran = 0;
    const frame = (now: number) => {
      if (t0 < 0) t0 = now - ran;
      const t = now - t0;
      ran = t;
      if (!loop && t >= RUN_MS) {
        raf = 0;
        ran = 0;
        clear();
        return;
      }
      const fadeIn = Math.min(1, t / FADE_MS);
      draw(t / LOOP_MS, DOT_OPACITY * (loop ? fadeIn : Math.min(fadeIn, (RUN_MS - t) / FADE_MS)));
      raf = requestAnimationFrame(frame);
    };
    let ready = false;
    let onScreen = false;
    const start = () => {
      if (raf || !ready || !onScreen || pausedRef.current) return;
      mount();
      if (!dots) return;
      t0 = -1;
      raf = requestAnimationFrame(frame);
    };
    // Paused: the frames stop and the dots stay where they are.
    const hold = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const stop = () => {
      hold();
      ran = 0;
      clear();
    };
    control.current = { pause: hold, resume: start };

    // A run each time the diagram comes on screen; it stops if it leaves.
    const io = new IntersectionObserver((entries) => {
      onScreen = entries.some((e) => e.isIntersecting);
      if (onScreen) start();
      else stop();
    });
    io.observe(root);
    // The slot changed shape, so a different layout may be the one shown.
    const ro = new ResizeObserver(() => {
      if (dots && dots.key !== shown()?.dataset.v) {
        clear();
        if (raf) mount();
      }
    });
    ro.observe(root);
    // And, on a card, a run again when the reader points at it or tabs
    // into it. A loop is already running.
    const host = root.closest('a') ?? root.parentElement ?? root;
    if (!loop) {
      host.addEventListener('pointerenter', start);
      host.addEventListener('focusin', start);
    }

    // The first run waits for the page to load and go quiet.
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const settle = () => {
      const go = () => {
        ready = true;
        start();
      };
      if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(go, { timeout: 2000 });
      else timer = setTimeout(go, 600);
    };
    if (document.readyState === 'complete') settle();
    else window.addEventListener('load', settle, { once: true });

    return () => {
      stop();
      control.current = null;
      io.disconnect();
      ro.disconnect();
      host.removeEventListener('pointerenter', start);
      host.removeEventListener('focusin', start);
      window.removeEventListener('load', settle);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [reduced, variants, loop]);

  const box = (
    <div ref={rootRef} className={`sd ${className}`}>
      {variants.map((v) => (
        <Variant key={v.key} preset={preset} vkey={v.key} L={v.layout} uid={uid} />
      ))}
    </div>
  );
  if (!loop) return box;
  return (
    <>
      {box}
      {/* Built as the partner band's PAUSE LOGOS (MarkRow.tsx): the same
          classes, so the same type, colours and 44px target. */}
      {hydrated && !reduced ? (
        <button
          type="button"
          onClick={togglePause}
          className={`focus-ring t-mono-9 flex min-h-[44px] w-fit items-center text-ink-3 transition-colors duration-300 hover:text-ink ${pauseClassName}`}
        >
          {paused ? 'RESUME MOTION' : 'PAUSE MOTION'}
        </button>
      ) : null}
    </>
  );
}
