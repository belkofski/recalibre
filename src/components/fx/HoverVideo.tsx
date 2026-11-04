'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/* A PROJECT'S OWN LOOP, ON HOVER (4 November 2026). Two of the four
   initiatives have a real moving picture on file — the Belkofski brand
   film and the OPS screen loop — and the work cards play them while the
   pointer rests on the card, or while the card has keyboard focus, over
   the still the card already shows. The file is not fetched until then
   (`preload="none"`), is muted, and stops and rewinds when the pointer
   leaves. Nothing plays on a touch screen or under prefers-reduced-motion,
   and with scripts off the still is the whole card. */
export default function HoverVideo({ src, className = '' }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    const host = video?.closest('a, .group');
    if (!video || !host) return;
    if (typeof window.matchMedia !== 'function' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (prefersReducedMotion()) return;
    const play = () => {
      video.play().then(
        () => video.classList.add('is-playing'),
        () => {},
      );
    };
    const stop = () => {
      video.pause();
      video.currentTime = 0;
      video.classList.remove('is-playing');
    };
    host.addEventListener('pointerenter', play);
    host.addEventListener('pointerleave', stop);
    host.addEventListener('focusin', play);
    host.addEventListener('focusout', stop);
    return () => {
      host.removeEventListener('pointerenter', play);
      host.removeEventListener('pointerleave', stop);
      host.removeEventListener('focusin', play);
      host.removeEventListener('focusout', stop);
    };
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className={`hover-video pointer-events-none absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 ease-hover ${className}`}
    />
  );
}
