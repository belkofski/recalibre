'use client';

import { useEffect } from 'react';

/* THE SPOTLIGHT BORDER (4 November 2026). Any card marked `.spot` carries a
   one-pixel ring that lights where the pointer is, drawn by the stylesheet
   from two custom properties (`--sx`, `--sy`). This is the one script
   behind it: a single passive listener on the document that writes the
   pointer's position into the card under it. No library, no per-card
   listener, nothing on a coarse pointer. Mounted once in the shell. */
export default function Spotlight() {
  useEffect(() => {
    if (typeof window.matchMedia !== 'function' || !window.matchMedia('(pointer: fine)').matches) return;
    let raf = 0;
    let last: PointerEvent | null = null;
    const paint = () => {
      raf = 0;
      const e = last;
      if (!e || !(e.target instanceof Element)) return;
      const card = e.target.closest<HTMLElement>('.spot');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--sx', `${e.clientX - r.left}px`);
      card.style.setProperty('--sy', `${e.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
