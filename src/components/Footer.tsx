'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CSSProperties } from 'react';
import { InView, Rise } from '@/lib/motion';
import EnquiryForm from '@/components/EnquiryForm';
import { Btn, Card, Eyebrow, FirmMark, MonoLink, Pill } from '@/components/ui';
import { SITE, PAGES, LEGAL } from '@/content/site';
import { FOOTER_CTA } from '@/content/home';

/* ============================================================================
   THE FOOTER: ONE CARD, AND THE LAST CALL ON EVERY PAGE.

   The owner's decision of 26 September 2026: the form panel and the
   two-card footer row under it become one card, and the closing photograph
   above it came off every page, so this card is where every page ends.
   It was first built as a liquid-glass card, after the footer at
   liquid-glass-footer.framer.website; on 27 September the owner asked for
   the glass to come off, so it is drawn in the site's own card language,
   one `Card radius 30` on a `seam` plate, with nothing behind it.

   What it holds, top to bottom: the heading, with the Calibration card's
   two promises under it on hairlines, and the direct line opposite; on Home
   the form in its brief dress (EnquiryForm, `variant="brief"`: name, work
   email, organization and message; 28 September 2026), on every other page
   the one primary button to Contact; then the mark, the page links and the
   social links; then the fine print. Nothing in it is new words: the
   heading and the two lines are FOOTER_CTA (content/home.ts).

   ── THE FINAL CTA (the owner's audit, 6 October 2026) ─────────────────────

   The audit's CTA policy puts the primary button in five places, and this
   is one of them: every page's last screen ends on "Start a calibration",
   leaning toward the pointer (`Btn magnetic`). It replaced the mono link
   that stood here since 28 September, which was the right weight under a
   heading that already said the same words, but left a case study or an
   article with no primary action anywhere on the page.

   ── ONE FORM PER PAGE ─────────────────────────────────────────────────────

   The contact route carries its own enquiry form at the top of the page. The
   footer carried a second, identical one, so /contact asked the same six
   questions twice on one screen — and a reader who filled in the first had
   no way to know the second was the same form. On that route the card keeps
   its heading, at the section size, and what sits where the form would is
   the direct line's note instead, with a link back up to the form that is
   already open. The two promises are not repeated there either: the
   contact page prints them itself.
   ========================================================================= */

export default function Footer() {
  const path = usePathname();
  const onContact = path === '/contact';
  /* THE FORM IS DRAWN ON HOME ONLY (the owner's Phase A brief, 27
     September 2026). It closed every page, seven fields under the same FAQ,
     so a case study could not end with its work. Elsewhere the card ends on
     the one button, and the form is one click away on /contact. */
  const onHome = path === '/';
  return (
    <footer className="pad-x pad-top w-full bg-ground pb-(--space-row)">
      <div className="seam shell flex">
        <Card radius={30} className="flex w-full flex-col gap-(--space-row) p-(--plate-pad)">
          {/* The heading, and the direct line opposite it. */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-(--space-row) gap-y-(--space-4) narrow:grid-cols-1">
            <div className="flex flex-col gap-(--space-lede)">
              {/* The 80px role is the conversion heading's alone (28 September
                  2026); on /contact the heading is not that sentence, so it
                  takes the section size every other h2 takes. The words rise
                  one at a time, as the page openers do. */}
              <Rise
                as="h2"
                lines={onContact ? ['Or reach us directly.'] : FOOTER_CTA.headline}
                by="word"
                className={`${onContact ? 't-section' : 't-display-lg'} text-ink`}
                wrap
              />
              {onContact ? null : (
                /* The Calibration card's two promises, on hairlines that
                   draw as the list arrives (`.footer-line`, shell.css). A
                   list, because they are two things and not a sentence. */
                <InView as="ul" delay={200} className="flex max-w-[560px] flex-col">
                  {FOOTER_CTA.lines.map((line, i) => (
                    <li
                      key={line}
                      style={{ '--i': i } as CSSProperties}
                      className="footer-line flex items-baseline gap-(--space-2) pb-(--space-3)"
                    >
                      <FirmMark className="relative top-[-1px] text-ink-3" />
                      <span className="t-body text-ink-2">{line}</span>
                    </li>
                  ))}
                </InView>
              )}
            </div>
            <InView delay={120} className="flex flex-col gap-[4px]">
              {onContact ? (
                /* A label, so it takes the label's mark: the '///' at 50%
                   (28 September 2026). */
                <Eyebrow mark className="pb-(--space-1)">
                  DIRECT
                </Eyebrow>
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
              <a href={`tel:${SITE.phoneHref}`} className="tap-44 t-mono w-fit text-ink">
                {SITE.phone}
              </a>
            </InView>
          </div>

          {onContact ? (
            <InView delay={200} className="flex flex-wrap items-center justify-between gap-(--space-4)">
              <p className="t-caption max-w-[360px] text-ink-2">
                The inquiry form is at the top of this page. A person reads every message that arrives
                through it.
              </p>
              <MonoLink href="#contact-form" lead="BACK TO" label="THE FORM" />
            </InView>
          ) : onHome ? (
            <div id="enquiry">
              <EnquiryForm variant="brief" />
            </div>
          ) : (
            /* The final CTA of every page but Home and Contact: the one
               primary button, magnetic, as the hero's and the first stage
               card's are. */
            <InView delay={300} className="flex">
              <Btn magnetic href="/contact" label="Start a calibration" />
            </InView>
          )}

          <div className="flex flex-col gap-(--space-4)">
            <div className="h-px w-full bg-rule" aria-hidden="true" />

            {/* The mark, the pages, the social links. */}
            <div className="flex flex-wrap items-center justify-between gap-x-(--space-5) gap-y-(--space-4)">
              <span className="flex items-center gap-(--space-3)">
                <span className="flex items-center gap-(--space-1)">
                  <FirmMark className="text-accent-bright" />
                  <span className="t-mark text-ink">
                    {SITE.name}
                    <span className="t-mark-r">{SITE.mark}</span>
                  </span>
                </span>
                <span className="h-[14px] w-px bg-rule mobile:hidden" aria-hidden="true" />
                <span className="t-mono-11 text-ink-2 mobile:hidden">{SITE.descriptor}</span>
              </span>

              {/* Every page, Home and Contact included (PAGES): the bar
                  carries four of them and this row carries all six, so a
                  reader at the foot of any page can reach any other. */}
              <nav aria-label="Footer" className="flex flex-wrap gap-(--space-1)">
                {PAGES.map((n) => (
                  <Pill key={n.href} href={n.href}>
                    {n.label}
                  </Pill>
                ))}
              </nav>

              <div className="flex flex-wrap items-center gap-(--space-3)">
                {SITE.social.map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="tap-44 t-mono hover-read">
                    {s.label}
                    <span className="sr-only normal-case"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-rule" aria-hidden="true" />

            {/* The fine print. */}
            <div className="flex flex-wrap items-center justify-between gap-x-(--space-4) gap-y-(--space-1)">
              <p className="t-fine tabular-nums text-ink-3">
                © {SITE.year} {SITE.name}. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center gap-x-(--space-4)">
                <span className="t-fine text-ink-3">{SITE.location}</span>
                {LEGAL.map((l) => (
                  <Link key={l.href} href={l.href} className="tap-44 t-fine hover-read">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </footer>
  );
}
