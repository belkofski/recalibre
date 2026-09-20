'use client';

import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react';

/**
 * Scroll-triggered entrance for the cloned blocks.
 *
 * ADDED, not measured. It reuses the build's measured --ease-reveal curve and
 * the same IntersectionObserver trigger as SplitText, so the blocks enter with
 * the page's existing motion signature rather than a second one. The duration
 * (760ms) and the stagger (70ms) are chosen: 1400ms/50ms is tuned for single
 * words and reads as sluggish on a full card.
 *
 * IMPORTANT: this CLONES its children instead of wrapping them. Every block's
 * layout is measured to the pixel and several rows carry their gutter as a
 * margin on the card itself — inserting a wrapper element would move that
 * margin inside a new flex item and collapse the gutters. Cloning adds a class
 * and a custom property and changes nothing else about the tree.
 *
 * `Reveal` takes over the container it replaces, so pass that container's own
 * classes straight through.
 */
export default function Reveal({
  children,
  className = '',
  as: As = 'div',
  startIndex = 0,
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'ul';
  startIndex?: number;
}) {
  const host = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el || revealed) return;
    const reveal = () => {
      el.setAttribute('data-revealed', 'true');
      setRevealed(true);
    };
    if (el.getBoundingClientRect().top < window.innerHeight) {
      reveal();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some(
          (e) =>
            e.isIntersecting ||
            e.boundingClientRect.top < (e.rootBounds?.height ?? window.innerHeight),
        );
        if (hit) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealed]);

  let i = startIndex;
  return (
    <As ref={host as React.Ref<HTMLDivElement & HTMLUListElement>} className={className}>
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        const idx = i++;
        const p = child.props as { className?: string; style?: React.CSSProperties };
        return cloneElement(child as React.ReactElement<typeof p>, {
          className: `${p.className ?? ''} reveal-rise`.trim(),
          style: { ...(p.style ?? {}), ['--rise-index' as string]: idx },
        });
      })}
    </As>
  );
}
