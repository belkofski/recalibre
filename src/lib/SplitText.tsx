'use client';

import { Fragment, useEffect, useRef, useState } from 'react';

/**
 * The reference splits every display heading into ONE INLINE-BLOCK SPAN PER WORD
 * — 6 in the h1, 48 across the h2s — and reveals them one at a time.
 *
 * Measured off the reference, 211 rAF samples per element
 * (measure/anim-capture.mjs, anim-scroll2.mjs, anim-trigger.mjs):
 *
 *   initial   opacity 0.001 · rotate 2deg · translateY 10px · blur(4px)
 *   final     opacity 1     · rotate 0    · translateY 0    · blur(0px)
 *   duration  1400ms
 *   stagger   50ms per word
 *   trigger   the element's top crossing the viewport bottom — measured firing
 *             at an element top of 902.8px in a 900px viewport, i.e. plain
 *             intersection at threshold 0 with no root margin
 *   easing    the measured curve itself, as --ease-reveal in globals.css
 *
 * The flag goes on the PARENT heading, not on a wrapper: the reference has
 * exactly one span per word and no container span, so adding one would put a
 * node in the tree that the reference does not have.
 */
export default function SplitText({ children }: { children: string }) {
  const first = useRef<HTMLSpanElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const heading = first.current?.parentElement;
    if (!heading || revealed) return;
    const reveal = () => {
      heading.setAttribute('data-revealed', 'true');
      setRevealed(true);
    };
    // already above the trigger line on first paint (the hero): reveal now
    if (heading.getBoundingClientRect().top < window.innerHeight) {
      reveal();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        // reveal when it enters the viewport, and also when the viewport has
        // been jumped past it (deep link, reload mid-page, fast scroll) — the
        // reference reveals those too, and an isIntersecting-only check would
        // leave them hidden for good
        const hit = entries.some(
          (e) => e.isIntersecting || e.boundingClientRect.top < (e.rootBounds?.height ?? window.innerHeight),
        );
        if (hit) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0 },
    );
    io.observe(heading);
    return () => io.disconnect();
  }, [revealed]);

  // Split on ANY run of whitespace, not on ' '. A single-space split let a
  // "\n" in the copy ride inside a word span, and with white-space:pre-wrap on
  // the heading that span rendered as two stacked lines — one word twice the
  // height of every other. Splitting on /\s+/ makes that impossible to author.
  const words = children.trim().split(/\s+/);
  return (
    <>
      {words.map((w, i) => (
        // keyed Fragment so the separating space stays a bare text node and each
        // word produces exactly ONE span, as the reference measures
        <Fragment key={i}>
          <span
            ref={i === 0 ? first : undefined}
            className="reveal-word"
            style={{ ['--word-index' as string]: i }}
          >
            {w}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </>
  );
}
