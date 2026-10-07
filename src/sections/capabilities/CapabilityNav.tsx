'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useMedia, useReducedMotion } from '@/lib/motion';
import { Chevron, Glyph, type GlyphName } from '@/components/ui';

/* ============================================================================
   THE CAPABILITIES INDEX — where the reader is among the five chapters.

   TWO SHAPES, ONE NAV. From 1200 up: five anchors pinned at the left of the
   chapters, a glyph per row, with one 2px bar riding the spine to the row
   being read. Below 1200 the owner's note rules out the chip row that
   stood here (it scrolled sideways, and the chips sat off the screen):
   instead a compact bar under the site's bar names the chapter being read
   ("03 / Enterprise systems") over a rule that fills as the reader goes
   down through the five. Pressed, it opens the five anchors as a list that
   drops beneath it. It is a <details>, so with scripts off it still opens
   and every anchor is a plain anchor; the script only keeps its name and
   its rule current, and closes it after a jump.

   The script does four things:
     1. LIGHTS THE CHAPTER BEING READ: an IntersectionObserver on a thin
        band two fifths down the window, so one chapter holds it at a time.
     2. MOVES THE BAR (from 1200 up), measured off the lit row.
     3. FILLS THE RULE (below 1200) with the reader's way through the
        chapters, written as `--caps-p` on the nav each scroll frame.
     4. SCROLLS TO A CHAPTER on a press, under the bar (and the compact bar
        below 1200), writes the hash and moves focus to the chapter.
   ========================================================================= */

export type CapabilityNavItem = {
  slug: string;
  /** '/01' as the content prints it; the index prints the digits. */
  n: string;
  /** The two-word name. */
  short: string;
  glyph: GlyphName;
};

const BAND = '-38% 0px -58% 0px';

export default function CapabilityNav({ items, label }: { items: readonly CapabilityNavItem[]; label: string }) {
  const [active, setActive] = useState(0);
  const narrow = useMedia('(max-width: 1199.98px)');
  const reduced = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const foldRef = useRef<HTMLDetailsElement>(null);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);

  /* 1. The chapter being read, and 3. the rule. */
  useEffect(() => {
    const sections = items.map((it) => document.getElementById(it.slug));
    if (sections.some((s) => !s)) return;
    const first = sections[0] as HTMLElement;
    const last = sections[sections.length - 1] as HTMLElement;
    const index = new Map(sections.map((s, i) => [s as Element, i]));

    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      const doc = document.documentElement;
      if (window.scrollY + vh >= doc.scrollHeight - 2) setActive(items.length - 1);
      const top = first.getBoundingClientRect().top;
      // Above the first chapter (the opener), the first is the one coming.
      if (top > vh * 0.4) setActive(0);
      const bottom = last.getBoundingClientRect().bottom;
      const span = Math.max(1, bottom - top - vh);
      const p = Math.min(1, Math.max(0, -top / span));
      navRef.current?.style.setProperty('--caps-p', p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const i = index.get(e.target);
            if (i !== undefined) setActive(i);
          }
        },
        { rootMargin: BAND, threshold: 0 },
      );
      sections.forEach((s) => s && io?.observe(s));
    }
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items]);

  /* 2. The bar, from 1200 up. */
  useEffect(() => {
    const link = links.current[active];
    const list = listRef.current;
    const bar = barRef.current;
    if (narrow || !link || !list || !bar) return;
    const place = () => {
      bar.style.setProperty('--bar-y', `${link.offsetTop}px`);
      bar.style.setProperty('--bar-h', `${link.offsetHeight}px`);
    };
    place();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active, narrow]);

  /* 4. The jump. */
  const jump = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(slug);
    if (!target) return;
    e.preventDefault();
    if (foldRef.current) foldRef.current.open = false;
    const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar')) || 56;
    const under = narrow ? bar + 52 : bar;
    const top = target.getBoundingClientRect().top + window.scrollY - under;
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    history.pushState(null, '', `#${slug}`);
    target.focus({ preventScroll: true });
  };

  const now = items[active] ?? items[0] ?? { slug: '', n: '', short: '', glyph: 'layers' as GlyphName };

  return (
    <nav ref={navRef} aria-label={label} className="caps-nav">
      {/* FROM 1200 UP: the pinned list on its spine. */}
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
                <Glyph name={it.glyph} size={16} className="caps-nav-glyph" />
                <span className="caps-nav-n t-mono-11 tabular-nums">{it.n.replace('/', '')}</span>
                <span className="t-mono">{it.short}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* BELOW 1200: the chapter being read, the rule, and the five behind
          a press. */}
      <details ref={foldRef} className="caps-now">
        <summary className="caps-now-bar">
          {/* The name of the chapter changes as the reader goes down; a
              screen reader hears the change only when it asks, so no live
              region chatters on every scroll. */}
          <span className="caps-now-n t-mono-11 tabular-nums">{now.n.replace('/', '')}</span>
          <span aria-hidden="true" className="t-mono-11 text-ink-3">
            /
          </span>
          <span className="t-mono min-w-0 flex-1 truncate text-ink">{now.short}</span>
          <span aria-hidden="true" className="caps-now-chev">
            <Chevron dir="down" />
          </span>
        </summary>
        <ul className="caps-now-list m-0 list-none p-0">
          {items.map((it, i) => (
            <li key={it.slug}>
              <a
                href={`#${it.slug}`}
                onClick={jump(it.slug)}
                aria-current={i === active ? 'location' : undefined}
                className="caps-now-link"
              >
                <Glyph name={it.glyph} size={16} className="caps-nav-glyph" />
                <span className="caps-nav-n t-mono-11 tabular-nums">{it.n.replace('/', '')}</span>
                <span className="t-mono">{it.short}</span>
              </a>
            </li>
          ))}
        </ul>
      </details>
      {/* Outside the <details>: a closed one renders nothing but its
          summary. */}
      <span aria-hidden="true" className="caps-now-rule" />
    </nav>
  );
}
