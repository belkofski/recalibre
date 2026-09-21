'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SITE, NAV, LEGAL } from '@/content/site';
import { Glyph, MonoLink } from '@/components/ui';

/* ============================================================================
   THE BAR AND THE LAYERED MENU.

   Measured off the reference: the bar is 51px tall on #101010 and carries a
   1px scroll-progress line along its top edge. The menu is NOT a full-screen
   list — it is a 500px panel that drops out of the right end of the bar,
   built from the same 2px card seam as the rest of the page: a tall card
   holding the links, two short cards under it, and a fine print strip.
   ========================================================================= */

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        toggleRef.current?.focus();
      }
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || toggleRef.current?.contains(t)) return;
      close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open, close]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* The scroll line. #101010 track, lime fill, 1px — the reference's. */}
      <div className="absolute inset-x-0 top-0 h-px bg-raised" aria-hidden="true">
        <div
          className="h-px origin-left bg-lime"
          style={{ transform: `scaleX(${progress})`, width: '100%' }}
        />
      </div>

      <div className="pad-x relative flex h-[51px] items-center bg-raised">
        <div className="shell flex items-center justify-between">
          {/* Left: the wordmark, a 3px rule, and the descriptor. */}
          <div className="flex items-center gap-[18px]">
            <Link href="/" className="focus-ring tap-44 flex items-center gap-[8px]">
              <Glyph className="[&>i]:bg-lime" />
              <span className="t-mark text-ink">{SITE.name}</span>
            </Link>
            <span className="h-[14px] w-px bg-rule" aria-hidden="true" />
            <span className="t-mono-9 text-ink-2 mobile:hidden">{SITE.descriptor}</span>
          </div>

          {/* Right: the link row on desktop, then the menu control. */}
          <div className="flex items-center gap-[30px]">
            <nav aria-label="Primary" className="flex items-center gap-[41px] narrow:hidden">
              {NAV.filter((n) => n.href !== '/contact').map((n) => (
                <Link key={n.href} href={n.href} className="focus-ring tap-44 t-nav text-ink-2 transition-colors duration-300 hover:text-ink">
                  {n.label}
                </Link>
              ))}
              <Link href="/contact" className="tap-44 focus-ring">
                <span className="pill t-tag text-ink">CONTACT</span>
              </Link>
            </nav>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
              className="focus-ring tap-44 flex items-center gap-[7px]"
            >
              <Glyph className="[&>i]:bg-lime" />
              <span className="t-nav text-ink-2">{open ? 'CLOSE' : 'MENU'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          The panel. 500px wide, anchored to the right edge of the shell on
          desktop; full width on mobile. It drops from the bar, scaling from
          0.96, and never covers the page — the reference does not dim.
          ------------------------------------------------------------------ */}
      <div className="pad-x pointer-events-none absolute inset-x-0 top-[51px]">
        <div className="shell flex justify-end">
          <div
            id="site-menu"
            ref={panelRef}
            inert={!open}
            aria-hidden={!open}
            className={`seam pointer-events-auto flex w-[500px] origin-top flex-col rounded-t-none pt-0 transition-[opacity,transform] duration-[450ms] mobile:w-full ${
              open ? 'scale-100 opacity-100' : 'pointer-events-none scale-[0.96] opacity-0'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-panel)' }}
          >
            {/* The link card. */}
            <div className="card-24 flex flex-col gap-[12px] p-[30px] mobile:p-[20px]">
              <div className="flex items-center justify-between">
                <span className="t-mono-9 text-ink-2">MENU</span>
                <span className="t-mono-9 text-ink-3">{SITE.location}</span>
              </div>
              <nav aria-label="Menu" className="flex flex-col gap-[6px]">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={close}
                    className="focus-ring tap-44 t-menu w-fit text-ink transition-colors duration-300 hover:text-lime"
                  >
                    {n.label.toLowerCase()}
                  </Link>
                ))}
              </nav>
              <div className="mt-[8px] flex flex-col gap-[4px]">
                {LEGAL.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={close}
                    className="focus-ring tap-44 t-fine w-fit text-ink-2 transition-colors duration-300 hover:text-ink"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Two short cards: how to reach us, and where we are. */}
            <div className="grid grid-cols-2 gap-[2px] mobile:grid-cols-1">
              <div className="card-24 flex flex-col gap-[16px] p-[30px] mobile:p-[20px]">
                <div className="flex flex-col gap-[6px]">
                  <a
                    href={`tel:${SITE.phoneHref}`}
                    className="focus-ring tap-44 t-mono w-fit text-ink-2 transition-colors duration-300 hover:text-ink"
                  >
                    {SITE.phone}
                  </a>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="focus-ring tap-44 w-fit text-ink transition-colors duration-300 hover:text-lime"
                    style={{ fontSize: '19.7px', lineHeight: '25.6px', letterSpacing: '-0.2px' }}
                  >
                    {SITE.email}
                  </a>
                </div>
                <div className="flex items-center gap-[10px]">
                  {SITE.social.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring tap-44 t-mono-9 text-ink-3 transition-colors duration-300 hover:text-ink"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="card-24 flex flex-col gap-[20px] p-[30px] mobile:p-[20px]">
                <div className="flex items-start gap-[9px]">
                  <span aria-hidden="true" className="flex h-[33px] items-stretch gap-[4px]">
                    <i className="block w-[2px] rounded-full bg-lime" />
                    <i className="block w-[2px] rounded-full bg-lime" />
                    <i className="block w-[2px] rounded-full bg-white/10" />
                  </span>
                  <span className="flex flex-col gap-[4px]">
                    <span className="t-note text-ink">{SITE.location}</span>
                    <span className="t-mono-9 text-ink-2">{SITE.descriptor}</span>
                  </span>
                </div>
                <MonoLink href="/contact" lead="START" label="A CONVERSATION" />
              </div>
            </div>

            {/* The fine print strip. */}
            <div className="flex items-center justify-center p-[10px]">
              <span className="t-mono-9 text-ink-3 opacity-50">
                © {new Date().getFullYear()} {SITE.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
