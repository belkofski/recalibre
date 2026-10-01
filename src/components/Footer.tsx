'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Rise } from '@/lib/motion';
import EnquiryForm from '@/components/EnquiryForm';
import { FirmMark, Pill, MonoLink } from '@/components/ui';
import { SITE, NAV, LEGAL } from '@/content/site';

/* ============================================================================
   THE FOOTER: ONE CARD.

   The owner's decision of 26 September 2026: the form panel and the
   two-card footer row under it become one card, and the closing photograph
   above it came off every page, so this card is where every page ends.
   It was first built as a liquid-glass card, after the footer at
   liquid-glass-footer.framer.website; on 27 September the owner asked for
   the glass to come off, so it is drawn in the site's own card language,
   one `card-30` on a `seam` plate, with nothing behind it.

   What it holds, top to bottom: the heading and the direct line; on Home
   the form in its brief dress (EnquiryForm, `variant="brief"`: name, work
   email, organization and message; 28 September 2026), on every other page
   one mono link to Contact; then the mark, the page links and the social
   links; then the fine print. Nothing in it is new words.

   ── ONE FORM PER PAGE ─────────────────────────────────────────────────────

   The contact route carries its own enquiry form at the top of the page. The
   footer carried a second, identical one, so /contact asked the same six
   questions twice on one screen — and a reader who filled in the first had
   no way to know the second was the same form. On that route the card keeps
   its heading, and what sits where the form would is the direct line's note
   instead, with a link back up to the form that is already open.
   ========================================================================= */

export default function Footer() {
  const path = usePathname();
  const onContact = path === '/contact';
  /* THE FORM IS DRAWN ON HOME ONLY (the owner's Phase A brief, 27
     September 2026). It closed every page, seven fields under the same FAQ,
     so a case study could not end with its work. Elsewhere the card keeps
     its heading and the direct line, and one mono link goes to Contact,
     where the form is: since 28 September 2026 not a second button under
     a heading that already says the same words. */
  const onHome = path === '/';
  return (
    <footer className="pad-x pad-top w-full bg-ground pb-[40px] mobile:pb-[24px]">
      <div className="seam shell flex">
        <div className="card-30 flex w-full flex-col gap-[40px] p-[50px] tablet:p-[40px] mobile:gap-[32px] mobile:p-[20px]">
          {/* The heading, and the direct line opposite it. */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-[40px] gap-y-[24px] narrow:grid-cols-1">
            {/* The 80px role is the conversion heading's alone (28 September
                2026); on /contact the heading is not that sentence, so it
                takes the section display size. */}
            <Rise
              as="h2"
              lines={onContact ? ['Or reach us directly.'] : ['Start a calibration.']}
              className={`${onContact ? 't-display' : 't-display-lg'} text-ink`}
              wrap
            />
            <div className="flex flex-col gap-[4px]">
              {onContact ? (
                /* A label, so it takes the label's mark: the '///' at 50%
                   (28 September 2026). */
                <span className="flex items-center gap-[8px] pb-[8px]">
                  <FirmMark className="text-ink-3" />
                  <span className="t-mono text-ink-2">DIRECT</span>
                </span>
              ) : null}
              {/* Below 600 the address scales with the width so it holds one
                  line: at 28px it is 308px wide, and a 390 phone's box is 306.
                  Important, because the type roles are unlayered. */}
              <a
                href={`mailto:${SITE.email}`}
                className="tap-44 t-card w-fit text-ink phone:text-[length:min(28px,calc((100vw-84px)/11.2))]!"
              >
                {SITE.email}
              </a>
              <a
                href={`tel:${SITE.phoneHref}`}
                className="tap-44 t-mono w-fit text-ink"
              >
                {SITE.phone}
              </a>
            </div>
          </div>

          {onContact ? (
            <div className="flex flex-wrap items-center justify-between gap-[24px]">
              <p className="t-caption max-w-[360px] text-ink-2">
                The inquiry form is at the top of this page. A person reads every message that arrives
                through it.
              </p>
              <MonoLink href="#contact-form" lead="BACK TO" label="THE FORM" />
            </div>
          ) : onHome ? (
            <div id="enquiry">
              <EnquiryForm variant="brief" />
            </div>
          ) : (
            <MonoLink href="/contact" label="START A CALIBRATION" className="self-start" />
          )}

          <div className="flex flex-col gap-[24px]">
            <div className="h-px w-full bg-rule" aria-hidden="true" />

            {/* The mark, the pages, the social links. */}
            <div className="flex flex-wrap items-center justify-between gap-x-[32px] gap-y-[24px]">
              <span className="flex items-center gap-[16px]">
                <span className="flex items-center gap-[8px]">
                  <FirmMark className="text-accent-bright" />
                  <span className="t-mark text-ink">
                    {SITE.name}
                    <span className="t-mark-r">{SITE.mark}</span>
                  </span>
                </span>
                <span className="h-[14px] w-px bg-rule mobile:hidden" aria-hidden="true" />
                <span className="t-mono-11 text-ink-2 mobile:hidden">{SITE.descriptor}</span>
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
                    className="tap-44 t-mono hover-read"
                  >
                    {s.label}
                    <span className="sr-only normal-case"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-rule" aria-hidden="true" />

            {/* The fine print. */}
            <div className="flex flex-wrap items-center justify-between gap-x-[24px] gap-y-[8px]">
              <p className="t-fine tabular-nums text-ink-3">
                © {SITE.year} {SITE.name}. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center gap-x-[24px]">
                <span className="t-fine text-ink-3">{SITE.location}</span>
                {LEGAL.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="tap-44 t-fine hover-read"
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
