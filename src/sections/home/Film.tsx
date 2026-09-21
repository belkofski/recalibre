'use client';

import { useRef, useState } from 'react';
import Img from '@/lib/Img';
import { Rise } from '@/lib/motion';
import { Tick, Glyph } from '@/components/ui';
import { FILM } from '@/content/home';
import { SITE } from '@/content/site';

/* ============================================================================
   THE FILM PANEL.

   The reference's video section: one 1380px panel at radius 30 with a
   grained still behind it, corner brackets, a duration badge, a centred
   two-line heading, a hairline drop, a line of copy and a lime play button.

   Pressing play swaps the still for the footage at the size it was recorded
   — 400×522 — rather than stretching a phone capture across a 1380px panel.
   ========================================================================= */

export default function Film() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="pad-x relative flex w-full flex-col items-center overflow-clip">
      <figure className="card-30 shell relative flex w-full flex-col items-center justify-center overflow-clip px-[80px] pb-[50px] pt-[80px] tablet:px-[40px] mobile:px-[20px] mobile:pb-[30px] mobile:pt-[40px]">
        <Img
          src={FILM.media}
          alt={FILM.mediaAlt}
          sizes="(max-width: 809px) 100vw, 1380px"
          className="media-push media-push-sm"
        />
        <span className="grain grain-soft absolute inset-0" aria-hidden="true" />
        <span className="absolute inset-0 bg-ground/40" aria-hidden="true" />

        {/* The four corner brackets. */}
        {(
          [
            'left-[40px] top-[40px] border-l border-t',
            'right-[40px] top-[40px] border-r border-t',
            'left-[40px] bottom-[40px] border-b border-l',
            'right-[40px] bottom-[40px] border-b border-r',
          ] as const
        ).map((pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={`pointer-events-none absolute size-[22px] border-rule mobile:hidden ${pos}`}
          />
        ))}

        <div className="relative flex w-full flex-col items-center gap-[30px]">
          {!playing ? (
            <>
              <span className="pill t-mono-9 border-rule text-ink">{FILM.badge}</span>
              <Rise as="h2" lines={FILM.headline} className="t-sub text-center text-ink" />
              <Tick />
              <p className="t-caption max-w-[420px] text-center text-ink-2">{FILM.body}</p>
              <button
                type="button"
                onClick={() => {
                  setPlaying(true);
                  requestAnimationFrame(() => videoRef.current?.play());
                }}
                className="focus-ring group mt-[30px] flex size-[72px] items-center justify-center rounded-full bg-lime transition-transform duration-300 hover:scale-[1.06] mobile:size-[56px]"
              >
                <span className="sr-only">Play the OPS overview, twenty seconds, silent</span>
                <Glyph big className="[&>i]:bg-ground" />
              </button>
            </>
          ) : (
            <div className="flex w-full flex-col items-center gap-[20px]">
              <video
                ref={videoRef}
                src={FILM.src}
                poster={FILM.poster}
                width={FILM.width}
                height={FILM.height}
                controls
                playsInline
                muted
                loop
                aria-label={FILM.label}
                className="w-[400px] max-w-full rounded-[16px] border border-rule-2"
              />
              <figcaption className="t-mono-9 text-ink-2">{FILM.caption}</figcaption>
            </div>
          )}
        </div>

        {!playing ? (
          <figcaption className="relative mt-[70px] flex items-center gap-[8px] mobile:mt-[36px]">
            <Glyph className="[&>i]:bg-white" />
            <span className="t-mark text-ink">{SITE.name}</span>
          </figcaption>
        ) : null}
      </figure>
    </section>
  );
}
