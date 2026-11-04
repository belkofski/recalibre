'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useReducedMotion } from '@/lib/motion';

/* THE MAGNETIC BUTTON (4 November 2026). The primary action leans a little
   toward the pointer while it is near — a third of the pointer's offset
   from the button's centre, on a spring — and settles back when it leaves.
   It changes nothing about the button itself (components/ui.tsx `Btn`),
   which is passed in as a child; it only moves the box around it. Off
   under prefers-reduced-motion and on a coarse pointer, where there is no
   pointer to lean toward. */
export default function Magnetic({ children, strength = 0.3, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });
  const reduce = useReducedMotion();
  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`inline-flex w-fit ${className}`}
    >
      {children}
    </motion.div>
  );
}
