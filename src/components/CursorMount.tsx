'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/* The cursor's doorman. The inverted cursor (fx/InvertedCursor.tsx) and
   the library it rides on are loaded only once a mouse or a pen has moved
   on a device that has one, and never under prefers-reduced-motion — so a
   phone, a crawler and a reader who asked for stillness download nothing.
   Mounted last in <body> (components/RootShell.tsx). */
const Cursor = dynamic(() => import('@/components/fx/InvertedCursor'), { ssr: false });

export default function CursorMount() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;
    const arm = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') setReady(true);
    };
    document.addEventListener('pointermove', arm, { once: true, passive: true });
    return () => document.removeEventListener('pointermove', arm);
  }, []);
  return ready ? <Cursor /> : null;
}
