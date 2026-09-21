'use client';

import { useEffect, useRef, useState } from 'react';
import { Rise, InView, useReducedMotion } from '@/lib/motion';
import { FILM as F } from '@/content/home';

/* ============================================================================
   IN MOTION — block 10. Measured 1001px, a single framed film with a
   duration badge.

   The reference badges its film 02:14 and calls it a two-minute walkthrough.
   Recalibre has twenty seconds of silent screen recording, and it is
   upright — 400 x 522 against the reference's 1280 x 720. The frame is kept;
   the film is held at its own size inside it rather than stretched to fill a
   panel it was never shot for, and the badge says 00:20 because that is what
   it is.

   IT PLAYS ONLY WHILE IT IS ON SCREEN, and only for a reader who has not
   asked their system to stop motion. Either way the control is there, and
   its word is read from the element's own play and pause events — so the
   button can never say Pause while the film is stopped.
   ========================================================================= */
export default function Film() {
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [onScreen, setOnScreen] = useState(false);
  /** null until the reader presses something; after that their choice wins. */
  const [choice, setChoice] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    el.muted = true;
    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first) setOnScreen(first.isIntersecting);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    el.addEventListener('play', on);
    el.addEventListener('pause', off);
    return () => {
      el.removeEventListener('play', on);
      el.removeEventListener('pause', off);
    };
  }, []);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (onScreen && (choice ?? !reduced)) void el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [onScreen, reduced, choice]);

  function toggle() {
    const next = !playing;
    setChoice(next);
    const el = video.current;
    if (!el) return;
    if (next) void el.play().catch(() => setPlaying(false));
    else el.pause();
  }

  return (
    <section aria-labelledby="film-head" className="w-full overflow-clip pad-top">
      <div className="shell pad-x flex w-full items-start gap-[40px] narrow:flex-col narrow:gap-[28px]">
        <InView className="flex w-full max-w-[400px] shrink-0 flex-col gap-[14px] narrow:max-w-[360px]">
          <figure className="card relative m-0 w-full">
            <video
              ref={video}
              className="block h-auto w-full"
              width={F.width}
              height={F.height}
              poster={F.poster}
              aria-label={F.label}
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={F.src} type="video/mp4" />
            </video>
            <span className="absolute right-[14px] top-[14px] rounded-full border border-rule bg-scrim px-[10px] py-[5px] t-mono-9 tabular-nums text-ink-2">
              {F.badge}
            </span>
          </figure>

          <div className="flex items-center justify-between gap-[12px]">
            <button type="button" onClick={toggle} className="pill focus-ring t-btn">
              <span aria-hidden="true" className="block h-[6px] w-[6px] rounded-full bg-lime" />
              {playing ? 'Pause' : 'Play'}
            </button>
            <figcaption className="t-caption text-ink-3">{F.caption}</figcaption>
          </div>
        </InView>

        <div className="flex min-w-0 flex-1 flex-col gap-[20px]">
          <p className="t-mono text-ink-3">{F.eyebrow}</p>
          <Rise as="h2" id="film-head" lines={F.headline} className="t-display max-w-[14ch] text-ink" />
          <p className="t-body-lg max-w-[46ch] text-ink-2">{F.body}</p>
        </div>
      </div>
    </section>
  );
}
