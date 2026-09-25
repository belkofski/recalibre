'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

   ── WHAT CHANGED ──────────────────────────────────────────────────────────

   THE PANEL WAS A THIRD TOO TALL. The reference's is 514px; ours was 666,
   and on a phone it was 793px inside an 844px screen — it filled the device
   edge to edge with air. The cause was a 44px minimum tap target set on each
   link ON TOP OF a 6px flex gap, so every row reserved 44px of height and
   then added the gap again. The rows now carry their own padding to the same
   44px and the gap is removed, which is the same touch target in two thirds
   of the space.

   THE CORNERS WERE WRONG. The reference rounds only the two bottom corners
   (`0 0 25px 25px`) because the panel drops out of the bar and is continuous
   with it. Ours was rounded on all four, so it read as a floating box that
   happened to be near the bar.

   THE EMAIL RAN TO THE CARD EDGE. At 19.7px it filled its 237px card with
   nothing to spare. It is set to break rather than overflow, and the card
   it sits in is given the wider half of the pair.
   ========================================================================= */

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // A new page closes the menu, whichever link got there. The menu's own
  // "START A CALIBRATION" link had no close action and left the panel
  // covering the contact form it had just opened. Adjusted during render, as React
  // recommends for state that follows a prop, rather than in an effect.
  const pathname = usePathname();
  const [shownPath, setShownPath] = useState(pathname);
  if (pathname !== shownPath) {
    setShownPath(pathname);
    setOpen(false);
  }

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
    const outside = (t: Node) =>
      !panelRef.current?.contains(t) && !toggleRef.current?.contains(t);
    // A press on the layer under the panel is not "outside": that layer
    // closes the menu itself, on click, so the press cannot fall through
    // to the page. Closing here, on mousedown, would unmount the layer
    // between the press and the release.
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (backdropRef.current?.contains(t) || !outside(t)) return;
      close();
    };
    // TABBING OFF THE END OF THE PANEL LEFT IT OPEN. Focus went on to the
    // page behind it — on a phone, to a control the panel was covering —
    // with aria-expanded still true. Focus landing anywhere outside the
    // panel and its button closes it.
    const onFocus = (e: FocusEvent) => {
      if (outside(e.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('focusin', onFocus);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('focusin', onFocus);
    };
  }, [open, close]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* THE PAGE IS NOT DIMMED, BUT IT IS COVERED. A tap outside the open
          panel used to close it AND land on whatever was under the finger:
          on a 390 x 667 screen a tap just below the panel closed the menu
          and opened a case study. This layer is invisible and takes that
          tap instead. The page still scrolls under it, as the reference's
          does. It sits first so the bar and the panel paint over it. A
          right-click closed the menu before the layer existed (any press
          outside did); the layer answers one the same way, and keeps the
          browser's own menu out of it. */}
      {open ? (
        <div
          ref={backdropRef}
          className="fixed inset-0"
          onClick={close}
          onContextMenu={(e) => {
            e.preventDefault();
            close();
          }}
          aria-hidden="true"
        />
      ) : null}
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
              <span className="t-mark text-ink">{SITE.name}<span className="t-mark-r">{SITE.mark}</span></span>
            </Link>
            <span className="h-[14px] w-px bg-rule mobile:hidden" aria-hidden="true" />
            <span className="t-mono-9 text-ink-2 mobile:hidden">{SITE.descriptor}</span>
          </div>

          {/* Right: the link row on desktop, then the menu control. */}
          <div className="flex items-center gap-[30px]">
            <nav aria-label="Primary" className="flex items-center gap-[41px] narrow:hidden">
              {NAV.filter((n) => n.href !== '/contact').map((n) => (
                <Link key={n.href} href={n.href} className="focus-ring tap-44 tap-wide t-nav text-ink-2 transition-colors duration-300 hover:text-ink">
                  {n.label}
                </Link>
              ))}
              <Link href="/contact" className="tap-44 focus-ring">
                <span className="pill t-tag text-ink">START A CALIBRATION</span>
              </Link>
            </nav>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
              className="focus-ring tap-44 tap-wide flex items-center gap-[7px]"
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

          IT USED TO RUN OFF THE BOTTOM OF A SHORT PHONE. On a 390 x 667
          screen the panel reached y=724 with no way to get at the last of
          it: the page behind it scrolls, the panel does not, and scrolling
          the page moved the panel with it. It is capped at the height left
          under the bar — `100dvh` so a browser's own toolbars are counted —
          and scrolls inside itself when it needs to. `overscroll-contain`
          stops that scroll handing off to the page underneath at the end.
          ------------------------------------------------------------------ */}
      <div className="pad-x pointer-events-none absolute inset-x-0 top-[51px]">
        <div className="shell flex justify-end">
          <div
            id="site-menu"
            ref={panelRef}
            inert={!open}
            aria-hidden={!open}
            className={`seam pointer-events-auto flex max-h-[calc(100dvh-51px-12px)] w-[500px] origin-top flex-col overflow-y-auto overscroll-contain !rounded-t-none pt-0 transition-[opacity,transform] duration-[450ms] mobile:w-full ${
              open ? 'scale-100 opacity-100' : 'pointer-events-none scale-[0.96] opacity-0'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-panel)' }}
          >
            {/* The link card. */}
            <div className="card-24 flex flex-col gap-[14px] p-[30px] pb-[24px] mobile:p-[20px]">
              <div className="flex items-center justify-between">
                <span className="t-mono-9 text-ink-2">MENU</span>
                <span className="t-mono-9 text-ink-3">{SITE.location}</span>
              </div>
              {/* Each row is its own 44px target through its padding, so the
                  list needs no gap on top of it. `tap-44` here would add a
                  second 44px on every row and was what made the panel tall. */}
              <nav aria-label="Menu" className="-my-[4px] flex flex-col">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={close}
                    className="focus-ring t-menu flex min-h-[44px] w-fit items-center text-ink transition-colors duration-300 hover:text-lime"
                  >
                    {n.label.toLowerCase()}
                  </Link>
                ))}
              </nav>
              <div className="-mb-[10px] mt-[4px] flex flex-wrap items-center gap-x-[20px]">
                {LEGAL.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={close}
                    className="focus-ring t-fine flex min-h-[44px] w-fit items-center text-ink-2 transition-colors duration-300 hover:text-ink"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Two short cards: how to reach us, and where we are. */}
            <div className="grid grid-cols-[1.16fr_1fr] gap-[2px] mobile:grid-cols-1">
              <div className="card-24 flex flex-col justify-between gap-[10px] p-[24px] pb-[16px] mobile:p-[20px] mobile:pb-[12px]">
                <div className="-mt-[6px] flex flex-col">
                  <a
                    href={`tel:${SITE.phoneHref}`}
                    className="focus-ring t-mono flex min-h-[44px] w-fit items-center text-ink-2 transition-colors duration-300 hover:text-ink"
                  >
                    {SITE.phone}
                  </a>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="focus-ring flex min-h-[44px] w-full items-center break-all text-ink transition-colors duration-300 hover:text-lime"
                    style={{ fontSize: '18px', lineHeight: '23px', letterSpacing: '-0.2px' }}
                  >
                    {SITE.email}
                  </a>
                </div>
                <div className="-mb-[6px] flex items-center gap-[18px]">
                  {SITE.social.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring t-mono-9 flex min-h-[44px] items-center text-ink-2 transition-colors duration-300 hover:text-ink"
                    >
                      {s.label}
                      <span className="sr-only normal-case"> (opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="card-24 flex flex-col justify-between gap-[18px] p-[24px] mobile:p-[20px]">
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
                <MonoLink href="/contact" lead="START" label="A CALIBRATION" onClick={close} />
              </div>
            </div>

            {/* The fine print strip. */}
            <div className="flex items-center justify-center py-[9px]">
              <span className="t-mono-9 text-ink-3 opacity-60">
                © {SITE.year} {SITE.name}. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
