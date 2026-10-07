'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { SITE, NAV, LEGAL } from '@/content/site';
import { useScrollState } from '@/lib/motion';
import { Btn, Chevron, FirmMark, Orbs } from '@/components/ui';

/* ============================================================================
   THE BAR AND THE FULL-SCREEN MENU (6 October 2026, the owner's audit:
   "the header feels more like an editorial website than a commercial
   technology firm").

   THE BAR is 56px tall and fixed. At the top of a page it is the hero
   slab's own ground (#101010). Scrolled, it turns to glass over the page
   (`.bar[data-scrolled]`, globals.css) with a hairline under it; on the way
   down past the first screen it steps aside (`data-hidden`) and comes back
   on the first scroll up, so the reader has the whole window while reading
   and the actions the moment they look for them. The 1px progress line
   along the top edge never moves.

   WHAT IT HOLDS, from 1200 up: the wordmark; the four links — About, Work,
   Capabilities, Insights — each with a hairline that draws under it on
   hover and stays under the page the reader is on (`.nav-link`); and the
   one action, START A CALIBRATION, as a pill. Home is the wordmark and
   Contact is the pill, so neither is a word in the row.

   UNDER 1200 the bar holds the wordmark and MENU. The menu is the whole
   window under the bar, on the page's own ground (`.menu-full`): the four
   pages at the menu size rising out of their own clip boxes one after
   another, the one button under them, then the direct line — email, phone,
   place, the two social links — and the fine print. It fades in with
   `@starting-style`, closes on a link, on Escape, on a press outside it (the
   bar) and when focus leaves it, and while it is open the page behind it
   does not scroll (`html.menu-open`).

   The panel that dropped out of the bar's right end (the 500px seam card of
   28 September 2026) is gone: on a phone it was a box floating over the
   page, and the audit asked for a proper full-screen navigation.

   THE MENU IS A LIT ROOM TOO (the direction change): one set of ambient
   orbs behind its links (`Orbs section`), under the words, still under
   reduced motion. The panel is its own stacking context for them; the bar,
   the links and the progress line are unchanged.
   ========================================================================= */

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { scrolled, direction, far } = useScrollState();

  // A new page closes the menu, whichever link got there. Adjusted during
  // render, as React recommends for state that follows a prop.
  const pathname = usePathname();
  const [shownPath, setShownPath] = useState(pathname);
  if (pathname !== shownPath) {
    setShownPath(pathname);
    setOpen(false);
  }

  const close = useCallback(() => setOpen(false), []);

  // The progress line: one reading per frame, like every scroll handler on
  // the site, and a render only when the value has moved a thousandth.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      setProgress((p) => (Math.abs(p - next) < 0.001 ? p : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // The page behind the open menu holds still.
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.classList.add('menu-open');
    else root.classList.remove('menu-open');
    return () => root.classList.remove('menu-open');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        toggleRef.current?.focus();
      }
    };
    const outside = (t: Node) => !panelRef.current?.contains(t) && !toggleRef.current?.contains(t);
    const onDown = (e: MouseEvent) => {
      if (outside(e.target as Node)) close();
    };
    // Tabbing off the end of the menu must not leave it open over the page.
    const onFocus = (e: FocusEvent) => {
      if (outside(e.target as Node)) close();
    };
    // The menu is drawn for a window under 1200; a window widened past it
    // with the menu open would keep the page locked.
    const wide = window.matchMedia('(min-width: 1200px)');
    const onWide = () => {
      if (wide.matches) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('focusin', onFocus);
    wide.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('focusin', onFocus);
      wide.removeEventListener('change', onWide);
    };
  }, [open, close]);

  const current = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const hidden = !open && far && direction === 'down';

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* The scroll line: a 10% hairline track, the light-blue fill, 1px,
          above the bar so it stays when the bar steps aside. */}
      <div className="absolute inset-x-0 top-0 z-10 h-px bg-rule" aria-hidden="true">
        <div className="h-px origin-left bg-accent-bright" style={{ transform: `scaleX(${progress})`, width: '100%' }} />
      </div>

      <div
        className="bar pad-x relative flex h-[56px] items-center bg-raised"
        data-scrolled={scrolled || open || undefined}
        data-hidden={hidden || undefined}
      >
        <div className="shell flex items-center justify-between">
          {/* Left: the wordmark, a rule, and the descriptor. */}
          <div className="flex items-center gap-[16px]">
            <Link href="/" className="tap-44 flex items-center gap-[8px]" aria-label={`${SITE.name}, home`}>
              <FirmMark size="md" className="text-accent-bright" />
              <span className="t-mark text-ink">
                {SITE.name}
                <span className="t-mark-r">{SITE.mark}</span>
              </span>
            </Link>
            <span className="h-[14px] w-px bg-rule mobile:hidden" aria-hidden="true" />
            <span className="t-mono-11 text-ink-2 mobile:hidden">{SITE.descriptor}</span>
          </div>

          {/* Right: the four links and the pill from 1200 up; MENU under it. */}
          <div className="flex items-center gap-[32px]">
            <nav aria-label="Primary" className="flex items-center gap-[40px] narrow:hidden">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={current(n.href) ? 'page' : undefined}
                  className="nav-link tap-44 tap-wide t-nav text-ink"
                >
                  {n.label}
                </Link>
              ))}
              <Link href="/contact" className="tap-44" aria-current={current('/contact') ? 'page' : undefined}>
                <span className="pill t-mono flex items-center gap-[8px] text-ink">
                  START A CALIBRATION
                  <Chevron className="text-accent-bright" />
                </span>
              </Link>
            </nav>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
              className="tap-44 tap-wide hidden items-center gap-[8px] narrow:flex"
            >
              {/* A disclosure, like the FAQ's: MENU opens a panel, so the
                  chevron points down while it is closed and up while open. */}
              <Chevron dir={open ? 'up' : 'down'} className="text-accent-bright" />
              <span className="t-nav text-ink">{open ? 'CLOSE' : 'MENU'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          THE MENU, under 1200 only: the window under the bar. It carries no
          display, opacity or transition utility of its own; `data-open`
          drives all of it (`.menu-full`, globals.css).
          ------------------------------------------------------------------ */}
      <div
        id="site-menu"
        ref={panelRef}
        inert={!open}
        aria-hidden={!open}
        data-open={open || undefined}
        className="menu-full pad-x relative isolate hidden overflow-clip narrow:flex"
      >
        <Orbs variant="section" />
        <div className="shell flex min-h-full flex-1 flex-col justify-between gap-(--space-6) pb-(--space-5) pt-(--space-6)">
          <nav aria-label="Menu" className="flex flex-col gap-(--space-1)">
            {NAV.map((n, i) => (
              <span key={n.href} className="menu-item" style={{ '--i': i } as CSSProperties}>
                <Link
                  href={n.href}
                  onClick={close}
                  aria-current={current(n.href) ? 'page' : undefined}
                  className="t-menu-lg flex min-h-[44px] w-fit items-center gap-[16px] text-ink"
                >
                  <span className="t-mono-11 tabular-nums text-ink-3">0{i + 1}</span>
                  {n.label}
                </Link>
              </span>
            ))}
            <span className="menu-item mt-(--space-4)" style={{ '--i': NAV.length } as CSSProperties}>
              <span className="block w-fit" onClick={close}>
                <Btn href="/contact" label="Start a calibration" />
              </span>
            </span>
          </nav>

          <div className="flex flex-col gap-(--space-5)">
            <div className="menu-fade grid grid-cols-2 gap-x-(--space-5) gap-y-(--space-4) border-t border-rule pt-(--space-5) phone:grid-cols-1" style={{ '--i': 0 } as CSSProperties}>
              <div className="flex flex-col gap-[4px]">
                <span className="t-mono text-ink-3">EMAIL</span>
                <a href={`mailto:${SITE.email}`} className="t-body flex min-h-[44px] items-center break-all text-ink">
                  {SITE.email}
                </a>
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="t-mono text-ink-3">PHONE</span>
                <a href={`tel:${SITE.phoneHref}`} className="t-body flex min-h-[44px] items-center text-ink">
                  {SITE.phone}
                </a>
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="t-mono text-ink-3">LOCATION</span>
                <span className="t-body flex min-h-[44px] items-center text-ink">{SITE.location}</span>
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="t-mono text-ink-3">FOLLOW</span>
                <span className="flex items-center gap-[24px]">
                  {SITE.social.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="t-body hover-read flex min-h-[44px] items-center"
                    >
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
                </span>
              </div>
            </div>

            <div className="menu-fade flex flex-wrap items-center justify-between gap-x-(--space-4) gap-y-(--space-1) border-t border-rule pt-(--space-3)" style={{ '--i': 1 } as CSSProperties}>
              <span className="t-fine tabular-nums text-ink-3">
                © {SITE.year} {SITE.name}. All rights reserved.
              </span>
              <span className="flex items-center gap-x-(--space-4)">
                {LEGAL.map((l) => (
                  <Link key={l.href} href={l.href} onClick={close} className="t-fine hover-read flex min-h-[44px] items-center">
                    {l.label}
                  </Link>
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
