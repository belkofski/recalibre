'use client';

import { useRef, type ReactNode } from 'react';
import { useReducedMotion } from '@/lib/motion';

/* THE MAGNETIC BUTTON (4 November 2026). The primary action leans a little
   toward the pointer while it is near — a third of the pointer's offset
   from the button's centre — and settles back when it leaves. It changes
   nothing about the button itself (components/ui.tsx `Btn`), which is
   passed in as a child; it only moves the box around it, on a short CSS
   transition rather than a library spring (the performance pass of the
   same day: nothing on the home page needs `motion`). Off under
   prefers-reduced-motion and on a coarse pointer, where there is no
   pointer to lean toward. */
export default function Magnetic({ children, strength = 0.3, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const el = ref.current;
    const r = el?.getBoundingClientRect();
    if (!el || !r) return;
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`magnetic inline-flex w-fit ${className}`}
    >
      {children}
    </div>
  );
}
