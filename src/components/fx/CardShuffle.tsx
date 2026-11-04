'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useHydrated, useReducedMotion } from '@/lib/motion';

/* ============================================================================
   THE CARD SHUFFLE — the first interaction the owner confirmed (3 November
   2026), from Framer University's "Card Shuffle Scroll Animation", rebuilt
   here with `motion`.

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
   depth N + rel. At p = 0 the server's pose is the natural one, so there
   is no layout shift when the script arrives.

   THE FALLBACKS. Under prefers-reduced-motion the deck is a plain grid of
   the same five cards, every one readable and linkable. With scripts off
   the stage is not sticky and the cards stack in flow (`<noscript>` rule
   in globals.css), which is the same grid by other means. `will-change`
   is set on the moving cards only.
   ========================================================================= */

export type ShuffleCard = {
  key: string;
  node: ReactNode;
};

const VH_PER_CARD = 90;

function Card({
  i,
  n,
  progress,
  children,
}: {
  i: number;
  n: number;
  progress: MotionValue<number>;
  children: ReactNode;
}) {
  const sign = i % 2 === 0 ? 1 : -1;
  const lerp = (a: number, b: number, s: number) => a + (b - a) * s;
  const ease = (s: number) => 1 - Math.pow(1 - s, 3);
  const pose = (p: number) => {
    const pos = p * (n - 1);
    const rel = i - pos;
    if (rel >= 0) {
      const d = rel;
      return { y: `${-16 * d}px`, rotate: sign * 2 * d, scale: 1 - 0.05 * d, z: n - Math.round(d) + 1, opacity: 1 };
    }
    if (rel > -1) {
      const t = -rel;
      if (t < 0.5) {
        const s = ease(t / 0.5);
        return { y: `${-120 * s}%`, rotate: -12 * s, scale: 1, z: n + 2, opacity: 1 };
      }
      const s = ease((t - 0.5) / 0.5);
      const d = n + rel;
      return {
        y: `calc(${lerp(-120, 0, s)}% + ${lerp(0, -16 * d, s)}px)`,
        rotate: lerp(-12, sign * 2 * d, s),
        scale: lerp(1, 1 - 0.05 * d, s),
        z: 0,
        opacity: 1,
      };
    }
    const d = n + rel;
    return { y: `${-16 * d}px`, rotate: sign * 2 * d, scale: 1 - 0.05 * d, z: n - Math.round(d) + 1, opacity: 1 };
  };
  const y = useTransform(progress, (p) => pose(p).y);
  const rotate = useTransform(progress, (p) => pose(p).rotate);
  const scale = useTransform(progress, (p) => pose(p).scale);
  const zIndex = useTransform(progress, (p) => pose(p).z);
  return (
    <motion.div
      className="shuffle-card absolute inset-0 origin-bottom will-change-transform"
      style={{ y, rotate, scale, zIndex }}
    >
      {children}
    </motion.div>
  );
}

export default function CardShuffle({ cards, className = '' }: { cards: readonly ShuffleCard[]; className?: string }) {
  const section = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const n = cards.length;

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
            <Card key={c.key} i={i} n={n} progress={scrollYProgress}>
              {c.node}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
