'use client';

import { useEffect, useRef, useState } from 'react';
import Img from '@/lib/Img';
import { Lines, HeadLines } from '@/lib/prim';
import { OPS_BLOCK as B, OPS_LOOP, OPS_STEPS } from '@/lib/ops-content';
import Sparkle from './blocks/Sparkle';

/**
 * OPS — A DAY IN THE FIELD.
 *
 * The one section on this page that demonstrates a product rather than
 * describing one. Six steps in the order a working day actually runs, each
 * one a real capture of the interface, and the twenty-second loop beside
 * them.
 *
 * ── WHY IT IS DRIVEN BY THE READER, NOT BY A TIMER ─────────────────────────
 *
 * A carousel that advances on its own takes the screen away mid-sentence and
 * has to be chased. These steps move when they are pressed, so a procurement
 * lead can sit on the permit screen for as long as they want to read it. The
 * list is a real tablist: arrow keys move between steps, Home and End jump to
 * the ends, and the panel is wired to the step with aria-controls. That is the
 * pattern a screen reader already knows.
 *
 * ── WHAT THE MOTION IS FOR ────────────────────────────────────────────────
 *
 * One cross-fade between screens, 260ms, and nothing else. It exists so the
 * eye can tell that the picture changed rather than that the page jumped —
 * the two captures are the same interface at the same size, so without it the
 * swap is ambiguous. Under prefers-reduced-motion it is gone entirely and the
 * swap is instant, which is the same information delivered without movement.
 *
 * ── THE VIDEO ─────────────────────────────────────────────────────────────
 *
 * Twenty seconds, silent, 400x522, held at its own size and never upscaled.
 * It plays only while it is on screen and only when the visitor has not asked
 * their system to stop motion; either way the button is there and its word
 * follows the element's real state, so it can never say Pause while the thing
 * is stopped.
 *
 * ── HONESTY ───────────────────────────────────────────────────────────────
 *
 * The status word is rendered at the top, the note under the headline says
 * the product is in development and carries demonstration data, and every
 * single capture repeats "Demonstration data." in its own caption. Nothing
 * here says OPS runs anywhere, because it does not yet.
 */
export default function OpsWalkthrough() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  /** Arrow keys move between steps, as a tablist is expected to. */
  function onKeyDown(e: React.KeyboardEvent) {
    const last = OPS_STEPS.length - 1;
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (active === last ? 0 : active + 1)
      : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? (active === 0 ? last : active - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  const step = OPS_STEPS[active] ?? OPS_STEPS[0];
  if (!step) return null;

  return (
    <section
      id="ops"
      aria-labelledby="ops-head"
      className="scroll-mt-[24px] flex w-full shrink-0 flex-col items-center overflow-clip bg-paper section-pad"
    >
      <div className="flex items-center gap-[10.8px]">
        <Sparkle size={9.36} color="var(--color-accent)" />
        <p className="eyebrow whitespace-pre text-text">{B.eyebrow}</p>
      </div>

      <HeadLines
        lines={[B.headline.l1, B.headline.l2]}
        id="ops-head"
        className="section-head mt-[20px] text-center text-text"
      />

      <Lines lines={B.lead} className="lead-text mt-[20px] max-w-[62ch] text-center text-text-2" />

      {/* The status word and the honesty line, before any picture. */}
      <div className="mt-[24px] flex max-w-[64ch] flex-col items-center gap-[10px]">
        <span className="rounded-full border border-rule-on-light px-[12px] py-[4px] font-mono text-[11px] leading-[16px] tracking-[0.6px] whitespace-pre text-text-3">
          {B.status}
        </span>
        <p className="small-text text-center text-text-3">{B.note}</p>
      </div>

      <div className="mt-[56px] flex w-full max-w-[1120.32px] items-start gap-[38.88px] narrow:flex-col narrow:gap-[28px]">
        {/* the day, in order */}
        <div
          role="tablist"
          aria-label="A working day in OPS, step by step"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex w-[300px] shrink-0 flex-col border-t border-rule-on-light narrow:w-full"
        >
          {OPS_STEPS.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`ops-tab-${s.id}`}
                aria-selected={on}
                aria-controls={`ops-panel-${s.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={`focus-ring flex min-h-[56px] w-full cursor-pointer items-center gap-[14px] border-b border-rule-on-light px-[4px] py-[14px] text-left transition-colors duration-[200ms] ${
                  on ? 'text-text' : 'text-text-3 hover:text-text-2'
                }`}
              >
                <span className="font-mono text-[11px] leading-[16px] tracking-[0.6px]">{s.n}</span>
                <span className="title-2">{s.label}</span>
                {/* the marker for the selected step — a filled square, not a colour change alone */}
                <span
                  aria-hidden="true"
                  className={`ml-auto block h-[8px] w-[8px] shrink-0 border ${
                    on ? 'border-text bg-text' : 'border-rule-card'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* the screen */}
        <div className="flex min-w-0 flex-1 flex-col narrow:w-full">
          {OPS_STEPS.map((s, i) => (
            <figure
              key={s.id}
              data-evidence
              role="tabpanel"
              id={`ops-panel-${s.id}`}
              aria-labelledby={`ops-tab-${s.id}`}
              hidden={i !== active}
              className="ops-panel m-0 flex flex-col"
            >
              <div className="w-full overflow-clip rounded-[12px] border border-rule-on-light bg-paper-3">
                <Img
                  src={s.src}
                  alt={s.alt}
                  sizes="(max-width: 1199px) 100vw, 780px"
                  className="block h-auto w-full"
                />
              </div>
              <figcaption className="meta-text mt-[12px] text-text-3">{s.caption}</figcaption>
            </figure>
          ))}

          <p className="body-text mt-[20px] max-w-[62ch] text-text-2">{step.body}</p>
        </div>
      </div>

      {/* the loop, held at its own size */}
      <div className="mt-[56px] flex w-full max-w-[1120.32px] items-start gap-[38.88px] border-t border-rule-on-light pt-[40px] narrow:flex-col narrow:gap-[24px]">
        <OpsLoop />
        <div className="min-w-0 flex-1">
          <p className="title-2 text-text">Twenty seconds, no sound.</p>
          <p className="body-text mt-[10px] max-w-[52ch] text-text-2">
            The overview as it moves. It is the only footage of OPS that exists, held at the size it
            was recorded rather than blown up to fill a panel.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * The loop. Plays while it is on screen, pauses the moment it leaves, and
 * never starts on its own for a visitor who asked their system to stop
 * motion. The button is always present and its word is read from the
 * element's own play/pause events, so the label cannot drift out of step
 * with what the video is doing.
 */
function OpsLoop() {
  const video = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  /** null until the visitor presses something, then their choice wins. */
  const [choice, setChoice] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(q.matches);
    sync();
    q.addEventListener('change', sync);
    return () => q.removeEventListener('change', sync);
  }, []);

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
    <figure data-evidence className="m-0 flex shrink-0 flex-col items-start gap-[12px]">
      <div
        className="overflow-clip rounded-[12px] border border-rule-on-light bg-paper-3"
        style={{ width: OPS_LOOP.width }}
      >
        <video
          ref={video}
          className="block h-auto w-full"
          width={OPS_LOOP.width}
          height={OPS_LOOP.height}
          poster={OPS_LOOP.poster}
          aria-label="A silent screen recording of the OPS overview: the cards counting the day's interventions, technicians in the field and active permits, and the seven-day activity chart beneath them."
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={OPS_LOOP.src} type="video/mp4" />
        </video>
      </div>
      <button
        type="button"
        onClick={toggle}
        className="focus-ring flex h-[44px] items-center gap-[8px] rounded-full border border-rule-on-light px-[18px] btn-label text-text transition-colors duration-[200ms] hover:border-rule-strong"
      >
        <span aria-hidden="true" className="block h-[8px] w-[8px] bg-text" />
        {playing ? 'Pause' : 'Play'}
      </button>
      <figcaption className="meta-text text-text-3">{OPS_LOOP.caption}</figcaption>
    </figure>
  );
}
