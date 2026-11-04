'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useHydrated, useReducedMotion } from '@/lib/motion';

/* ============================================================================
   THE CARD SHUFFLE — the first interaction the owner confirmed (3 November
   2026), from Framer University's "Card Shuffle Scroll Animation".

   A tall section with a stage pinned inside it (`position: sticky`,
   100svh). Five cards stand in a stack on the stage, the front one whole,
   each card behind it a little higher, a little smaller and turned a
   degree or two. As the reader scrolls through the section the front card
   lifts off the top, turns, and drops to the back of the stack while every
   other card advances one place — one card per 90vh of scroll, so the
   whole deck has been seen when the stage releases.

   THE MATHS. Progress p runs 0 → 1 over the section; pos = p × (N − 1).
   For card i, rel = i − pos. A card with rel ≥ 0 sits at depth d = rel:
   y = −16px·d, scale = 1 − 0.05·d, rotate = ±2°·d (alternating by index).
   The card in transition (−1 < rel < 0, t = −rel) lifts for the first half
   (y → −120%, rotate → −12°, on top) and for the second half eases down
   into depth N + rel at the back. A card that has already cycled sits at
   depth N + rel. At p = 0 the server's pose is the natural one, written as
   inline styles, so there is no layout shift when the script arrives.

   NO LIBRARY (4 November 2026, the performance pass). The first build drove
   the cards through `motion`'s useScroll; the maths above is a few lines,
   and a passive scroll listener with one requestAnimationFrame does the
   same work without shipping 44 KB of library on the home page. `motion`
   now rides only with the cursor, loaded on a fine pointer after its first
   move. The transforms are written straight to the cards' style, by
   transform alone, so nothing lays the page out again.

   THE FALLBACKS. Under prefers-reduced-motion the deck is a plain grid of
   the same five cards, every one readable and linkable. With scripts off
   the stage is not sticky and the cards stack in flow (`<noscript>` rule in
   globals.css), which is the same grid by other means.
   ========================================================================= */

export type ShuffleCard = {
  key: string;
  node: ReactNode;
};

const VH_PER_CARD = 90;

type Pose = { y: string; rotate: number; scale: number; z: number };

const lerp = (a: number, b: number, s: number) => a + (b - a) * s;
const ease = (s: number) => 1 - Math.pow(1 - s, 3);

function pose(i: number, n: number, p: number): Pose {
  const sign = i % 2 === 0 ? 1 : -1;
  const pos = p * (n - 1);
  const rel = i - pos;
  if (rel >= 0) {
    const d = rel;
    return { y: `${-16 * d}px`, rotate: sign * 2 * d, scale: 1 - 0.05 * d, z: n - Math.round(d) + 1 };
  }
  if (rel > -1) {
    const t = -rel;
    if (t < 0.5) {
      const s = ease(t / 0.5);
      return { y: `${-120 * s}%`, rotate: -12 * s, scale: 1, z: n + 2 };
    }
    const s = ease((t - 0.5) / 0.5);
    const d = n + rel;
    return {
      y: `calc(${lerp(-120, 0, s)}% + ${lerp(0, -16 * d, s)}px)`,
      rotate: lerp(-12, sign * 2 * d, s),
      scale: lerp(1, 1 - 0.05 * d, s),
      z: 0,
    };
  }
  const d = n + rel;
  return { y: `${-16 * d}px`, rotate: sign * 2 * d, scale: 1 - 0.05 * d, z: n - Math.round(d) + 1 };
}

function styleOf(q: Pose): CSSProperties {
  return { transform: `translateY(${q.y}) rotate(${q.rotate}deg) scale(${q.scale})`, zIndex: q.z };
}

export default function CardShuffle({ cards, className = '' }: { cards: readonly ShuffleCard[]; className?: string }) {
  const section = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const n = cards.length;

  useEffect(() => {
    const el = section.current;
    if (!el || reduce) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('.shuffle-card'));
    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      items.forEach((card, i) => {
        const q = pose(i, n, p);
        card.style.transform = `translateY(${q.y}) rotate(${q.rotate}deg) scale(${q.scale})`;
        card.style.zIndex = String(q.z);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n, reduce]);

  if (hydrated && reduce) {
    return (
      <div className={`grid grid-cols-2 gap-[2px] mobile:grid-cols-1 ${className}`}>
        {cards.map((c) => (
          <div key={c.key}>{c.node}</div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={section}
      className={`shuffle relative w-full ${className}`}
      style={{ height: `max(300svh, ${n * VH_PER_CARD}svh)` }}
    >
      <div className="shuffle-stage sticky top-0 flex h-[100svh] w-full items-center justify-center">
        <div className="relative aspect-[5/4] w-[min(690px,calc(100vw-40px))] max-h-[calc(100svh-120px)] mobile:aspect-[4/5]">
          {cards.map((c, i) => (
            <div
              key={c.key}
              className="shuffle-card absolute inset-0 origin-bottom will-change-transform"
              style={styleOf(pose(i, n, 0))}
            >
              {c.node}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
