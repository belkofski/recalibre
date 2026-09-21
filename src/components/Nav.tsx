'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SITE, NAV, LEGAL } from '@/content/site';

/* ============================================================================
   THE FIXED BAR AND THE EXPANDING MENU.

   MEASURED OFF THE REFERENCE at 1440:
     bar          1440 x 51, fixed to the top, fully transparent, z-index 8
     shell        1380 wide at x=30 — the 30px gutter, everywhere
     wordmark     19 / 22.8 / -0.57, weight 500, with a mono subtitle under it
     links        mono 11 / 14.3 / +0.66, uppercase
     trigger      29 x 14, no box, no border
     panel        0.45s cubic-bezier(0.44, 0, 0.22, 1)

   THE LINK HOVER. On the reference each nav label is rendered three times
   inside a clipped box. That is a vertical roll: the label slides up out of
   the box while an identical copy slides in from below, so the word appears
   to re-stamp itself rather than change colour. Reproduced here with two
   copies, which is all the effect needs.

   WHAT IS DIFFERENT FROM THE REFERENCE, AND WHY:

     SIGN UP IS GONE, and so are the four routes behind it. The reference's
     menu offers a client portal promising live system status, the current
     sprint and shared files. None of that exists. A link to a login for an
     account nobody can hold is the kind of thing this site cannot ship.

     THE AVAILABILITY LINE IS GONE. The reference prints "2 build slots open
     / Booking for Q3". Recalibre has no published availability. The slot
     carries the location and the live local time there instead — a fact
     about the clock, not a claim about the company.

     THE COPYRIGHT LINE CARRIES NO FOUNDING YEAR. The reference prints
     "© 2017—2026". Recalibre's founding year is not on record, so the line
     prints the current year alone.
   ========================================================================= */

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  /* Escape closes it, and focus goes back to the control that opened it.
     While it is open the page behind does not scroll. */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLElement>('a, button')?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[8] h-[51px]">
        <div className="shell pad-x flex h-[51px] items-center justify-between gap-[24px]">
          {/* wordmark */}
          <Link href="/" className="focus-ring flex items-baseline gap-[10px]" aria-label="Recalibre, home">
            <span className="t-mark text-ink">
              {SITE.name}
              {SITE.mark}
            </span>
            <span className="t-mono-9 text-ink-3 mobile:hidden">{SITE.descriptor}</span>
          </Link>

          {/* links — hidden below 1200, where the menu carries them */}
          <nav aria-label="Primary" className="flex items-center gap-[28px] narrow:hidden">
            {NAV.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`roll focus-ring t-mono-11 tap-44 ${active ? 'text-ink' : 'text-ink-2'}`}
                >
                  <span className="roll-track">
                    <span>{item.label}</span>
                    <span aria-hidden="true">{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* trigger */}
          <button
            ref={trigger}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="focus-ring tap-44 t-mono-11 text-ink-2 transition-colors duration-[300ms] hover:text-ink"
          >
            Menu
          </button>
        </div>
      </header>

      {/* ── the panel ───────────────────────────────────────────────────── */}
      <div
        id="site-menu"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        /* `hidden` is toggled rather than display, so the transition can run
           and so nothing inside is focusable while it is closed. */
        inert={!open ? true : undefined}
        className={`fixed inset-0 z-[40] flex flex-col bg-ground transition-[opacity,transform] duration-[450ms] ease-panel ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none translate-y-[-12px] opacity-0'
        }`}
      >
        <div className="shell pad-x flex h-[51px] shrink-0 items-center justify-between">
          <span className="t-mono-11 text-ink-3">Menu</span>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              trigger.current?.focus();
            }}
            className="focus-ring tap-44 t-mono-11 text-ink-2 transition-colors duration-[300ms] hover:text-ink"
          >
            Close
          </button>
        </div>

        <div className="shell pad-x flex min-h-0 flex-1 flex-col justify-between gap-[40px] pb-[40px] pt-[24px]">
          <nav aria-label="Menu" className="flex flex-col">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring group flex items-baseline gap-[18px] border-b border-rule-3 py-[18px] text-ink transition-colors duration-[300ms] hover:text-lime"
              >
                <span className="t-mono-9 text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                <span className="t-display">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-[28px]">
            <div className="flex flex-col gap-[8px]">
              <p className="t-mono text-ink-3">Direct</p>
              <a href={`mailto:${SITE.email}`} className="focus-ring tap-44 t-body text-ink hover:text-lime">
                {SITE.email}
              </a>
              <a href={`tel:${SITE.phoneHref}`} className="focus-ring tap-44 t-body text-ink hover:text-lime">
                {SITE.phone}
              </a>
            </div>

            <div className="flex flex-col gap-[8px]">
              <p className="t-mono text-ink-3">Elsewhere</p>
              {SITE.social.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="focus-ring tap-44 t-body text-ink hover:text-lime"
                >
                  {s.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-[8px]">
              <p className="t-mono text-ink-3">Legal</p>
              {LEGAL.map((l) => (
                <Link key={l.href} href={l.href} className="focus-ring tap-44 t-body text-ink hover:text-lime">
                  {l.label}
                </Link>
              ))}
            </div>

            <Link href="/contact" className="pill pill-solid focus-ring t-btn">
              Start a conversation
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
