'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Rise, useReducedMotion } from '@/lib/motion';
import EnquiryForm from '@/components/EnquiryForm';
import { Glyph, FirmMark, Pill, MonoLink } from '@/components/ui';
import { SITE, NAV, LEGAL } from '@/content/site';

/* ============================================================================
   THE FOOTER: ONE CARD OF SMOKED GLASS.

   The owner's decision of 26 September 2026, after the liquid-glass footer
   at liquid-glass-footer.framer.website: the form panel and the two-card
   footer row under it become one card, in dark smoked glass rather than
   the reference's silver. The closing photograph above it came off every
   page the same night, so this card is where every page ends.

   How the glass is made (globals.css, THE GLASS FOOTER): a lit rim — a
   1.5px gradient ring, bright along the top edge and again at the foot —
   around a translucent graphite pane with a frosted backdrop, and two
   soft lights behind it, one lime and one white, that the pane frosts
   over and that spill out around it onto the black page. A highlight on
   the pane follows the pointer where there is one; with reduced motion
   it stays where it starts.

   What it holds, top to bottom: the heading and the direct line; the form
   in its packed dress (EnquiryForm, `packed`: the same seven fields, three
   across); then the mark, the page links and the social links; then the
   fine print. Nothing in it is new words. The geometry photograph that
   filled half the old footer row is gone with the row.

   ── ONE FORM PER PAGE ─────────────────────────────────────────────────────

   The contact route carries its own enquiry form at the top of the page. The
   footer carried a second, identical one, so /contact asked the same six
   questions twice on one screen — and a reader who filled in the first had
   no way to know the second was the same form. On that route the card keeps
   its heading, and what sits where the form would is the direct line's note
   instead, with a link back up to the form that is already open.
   ========================================================================= */

export default function Footer() {
  const onContact = usePathname() === '/contact';
  const reduced = useReducedMotion();
  const pane = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  /* THE HIGHLIGHT FOLLOWS THE POINTER, one frame at a time. Two custom
     properties on the pane, read by its background; nothing re-renders. */
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== 'mouse') return;
    const el = pane.current;
    if (!el) return;
    const x = e.clientX;
    const y = e.clientY;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--gx', `${(((x - r.left) / r.width) * 100).toFixed(1)}%`);
      el.style.setProperty('--gy', `${(((y - r.top) / r.height) * 100).toFixed(1)}%`);
    });
  }

  return (
    <footer className="glass-foot pad-x pad-top relative w-full overflow-clip bg-ground pb-[40px] mobile:pb-[20px]">
      <div aria-hidden="true" className="glass-lights">
        <i className="glass-light-lime" />
        <i className="glass-light-white" />
      </div>

      <div className="glass-rim shell">
        <div
          ref={pane}
          onPointerMove={onPointerMove}
          className="glass-pane flex flex-col gap-[40px] p-[50px] tablet:p-[40px] mobile:gap-[30px] mobile:p-[20px]"
        >
          {/* The heading, and the direct line opposite it. */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-[40px] gap-y-[24px] narrow:grid-cols-1">
            <Rise
              as="h2"
              lines={onContact ? ['Or reach us directly.'] : ['Start a calibration.']}
              className="t-display text-ink"
              wrap
            />
            <div className="flex flex-col gap-[4px]">
              {onContact ? (
                <span className="flex items-center gap-[7px] pb-[10px]">
                  <Glyph className="[&>i]:bg-lime" />
                  <span className="t-mono text-ink-2">DIRECT</span>
                </span>
              ) : null}
              <a
                href={`mailto:${SITE.email}`}
                className="focus-ring tap-44 t-sub w-fit text-ink transition-colors duration-300 [overflow-wrap:anywhere] hover:text-lime"
              >
                {SITE.email}
              </a>
              <a
                href={`tel:${SITE.phoneHref}`}
                className="focus-ring tap-44 t-mono w-fit text-ink-2 transition-colors duration-300 hover:text-ink"
              >
                {SITE.phone}
              </a>
            </div>
          </div>

          {onContact ? (
            <div className="flex flex-wrap items-center justify-between gap-[20px]">
              <p className="t-caption max-w-[360px] text-ink-2">
                The inquiry form is at the top of this page. A person reads every message that arrives
                through it.
              </p>
              <MonoLink href="#contact-form" lead="BACK TO" label="THE FORM" />
            </div>
          ) : (
            <EnquiryForm packed />
          )}

          <div className="flex flex-col gap-[24px]">
            <div className="glass-rule" aria-hidden="true" />

            {/* The mark, the pages, the social links. */}
            <div className="flex flex-wrap items-center justify-between gap-x-[30px] gap-y-[20px]">
              <span className="flex items-center gap-[18px]">
                <span className="flex items-center gap-[8px]">
                  <FirmMark className="text-lime" />
                  <span className="t-mark text-ink">
                    {SITE.name}
                    <span className="t-mark-r">{SITE.mark}</span>
                  </span>
                </span>
                <span className="h-[14px] w-px bg-rule mobile:hidden" aria-hidden="true" />
                <span className="t-mono-9 text-ink-2 mobile:hidden">{SITE.descriptor}</span>
              </span>

              <nav aria-label="Footer" className="flex flex-wrap gap-[8px]">
                {NAV.map((n) => (
                  <Pill key={n.href} href={n.href}>
                    {n.label}
                  </Pill>
                ))}
              </nav>

              <div className="flex flex-wrap items-center gap-[16px]">
                {SITE.social.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring tap-44 t-mono-9 text-ink-2 transition-colors duration-300 hover:text-ink"
                  >
                    {s.label}
                    <span className="sr-only normal-case"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-rule" aria-hidden="true" />

            {/* The fine print. */}
            <div className="flex flex-wrap items-center justify-between gap-x-[24px] gap-y-[8px]">
              <p className="t-mono-9 text-ink-3">
                © {SITE.year} {SITE.name}. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center gap-x-[24px]">
                <span className="t-mono-9 text-ink-3">{SITE.location}</span>
                {LEGAL.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="focus-ring tap-44 t-fine text-ink-2 transition-colors duration-300 hover:text-ink"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
