'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { InView, useMedia, useReducedMotion } from '@/lib/motion';
import { Eyebrow } from '@/components/ui';

/* ============================================================================
   THE CAPABILITIES INDEX — the page's one moving part.

   Five anchors, one per chapter, pinned under the bar at the left of the
   chapters from 1200 up and turned into a chip row under the bar below
   (the stylesheet, `.caps-nav`). The script does three things and nothing
   else:

     1. LIGHTS THE CHAPTER BEING READ. An IntersectionObserver watches the
        five sections against a thin band two fifths down the window, so
        exactly one chapter holds it at a time and the index changes as the
        reader crosses a chapter's top. The band is narrow on purpose: a
        band the height of the window would light two chapters at once at
        every seam. The last chapter also lights when the page is scrolled
        to its end, where a short chapter might never reach the band.

     2. MOVES THE BAR. One 2px bar on the spine slides to the lit row on
        the spring curve: its offset is measured off the row and written to
        a custom property, never computed from a row height the type could
        change. Below 1200 the bar is not drawn and the lit chip is scrolled
        to the middle of the row instead.

     3. SCROLLS TO A CHAPTER. A press on an anchor scrolls the page to the
        chapter's top under the bar (and under the chip row, below 1200),
        smoothly unless the reader asked for reduced motion, writes the
        hash, and moves focus to the chapter, so a keyboard reader lands
        where the page did. With scripts off the anchors are plain anchors
        and the browser's own scroll-padding does the same job.

   The markup is one shape at every width; the stylesheet turns it. The
   server sends the first row lit, which is the finished state for a page
   opened at its top.
   ========================================================================= */

export type CapabilityNavItem = {
  slug: string;
  /** '/01' as the content prints it; the index prints the digits. */
  n: string;
  /** The two-word name. */
  short: string;
};

/** Where the band sits: the chapter holding the point two fifths down the
 *  window is the one being read. */
const BAND = '-38% 0px -58% 0px';

export default function CapabilityNav({ items, label }: { items: readonly CapabilityNavItem[]; label: string }) {
  const [active, setActive] = useState(0);
  const narrow = useMedia('(max-width: 1199.98px)');
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);

  /* 1. The chapter being read. */
  useEffect(() => {
    const sections = items.map((it) => document.getElementById(it.slug));
    if (sections.some((s) => !s)) return;
    const index = new Map(sections.map((s, i) => [s as Element, i]));

    let raf = 0;
    const atEnd = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const doc = document.documentElement;
        if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) setActive(items.length - 1);
      });
    };

    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = index.get(e.target);
          if (i !== undefined) setActive(i);
        }
      },
      { rootMargin: BAND, threshold: 0 },
    );
    sections.forEach((s) => s && io.observe(s));
    window.addEventListener('scroll', atEnd, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', atEnd);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items]);

  /* 2. The bar, or the chip. Written straight to the DOM, as the parallax
        is, so a measurement never costs a render. */
  useEffect(() => {
    const link = links.current[active];
    const list = listRef.current;
    const bar = barRef.current;
    if (!link || !list) return;
    if (narrow) {
      const left = link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2;
      list.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' });
      return;
    }
    if (!bar) return;
    const place = () => {
      bar.style.setProperty('--bar-y', `${link.offsetTop}px`);
      bar.style.setProperty('--bar-h', `${link.offsetHeight}px`);
    };
    place();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active, narrow, reduced]);

  /* 3. The jump. */
  const jump = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(slug);
    if (!target) return;
    e.preventDefault();
    // The bar, plus the chip row below 1200 (the stylesheet's
    // scroll-margin says the same number for the browser's own jumps).
    const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar')) || 56;
    const under = narrow ? bar + 60 : bar;
    const top = target.getBoundingClientRect().top + window.scrollY - under;
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    history.pushState(null, '', `#${slug}`);
    target.focus({ preventScroll: true });
  };

  return (
    /* The reveal is the sticky item itself (the stylesheet's `.caps-nav`),
       so the pinned box is the one the grid measures. */
    <InView delay={120} className="caps-nav">
      <nav aria-label={label} className="flex w-full flex-col gap-(--space-3)">
        <Eyebrow mark className="narrow:hidden">
          {label}
        </Eyebrow>
        {/* The bar is a sibling of the list, not a child: a `ul` may hold
            only `li`, and the track around both is what the bar is placed
            against. */}
        <div className="caps-nav-track">
          <span ref={barRef} aria-hidden="true" className="caps-nav-bar" />
        <ul ref={listRef} className="caps-nav-list m-0 list-none p-0">
          {items.map((it, i) => (
            <li key={it.slug}>
              <a
                ref={(el) => {
                  links.current[i] = el;
                }}
                href={`#${it.slug}`}
                onClick={jump(it.slug)}
                aria-current={i === active ? 'location' : undefined}
                className="caps-nav-link"
              >
                <span className="caps-nav-pill">
                  <span className="caps-nav-n t-mono-11 tabular-nums">{it.n.replace('/', '')}</span>
                  <span className="t-mono">{it.short}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        </div>
      </nav>
    </InView>
  );
}
