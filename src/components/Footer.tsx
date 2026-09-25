'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Img from '@/lib/Img';
import { Rise } from '@/lib/motion';
import EnquiryForm from '@/components/EnquiryForm';
import { Barcode, RailText, DotGrid, Glyph, Pill, MonoLink } from '@/components/ui';
import { SITE, NAV, LEGAL } from '@/content/site';

/* ============================================================================
   THE FORM PANEL AND THE FOOTER.

   One seam plate at radius 31 holds both, exactly as the reference does:
   a 711px contact card with its own 70px technical rail and the form set in
   underlined fields, then a two-card footer row — a media card carrying the
   mark, and an information card carrying the address, the links and the
   fine print.

   ── ONE FORM PER PAGE ─────────────────────────────────────────────────────

   The contact route carries its own enquiry form at the top of the page. The
   footer carried a second, identical one, so /contact asked the same six
   questions twice on one screen — and a reader who filled in the first had
   no way to know the second was the same form. On that route the card keeps
   its position, its rail and its heading, and what sits inside it is the
   direct line instead: the address, the phone, and a link back up to the
   form that is already open.
   ========================================================================= */

export default function Footer() {
  const onContact = usePathname() === '/contact';
  return (
    <footer className="pad-x w-full bg-ground pb-[80px] mobile:pb-[40px]">
      <div className="seam shell flex w-full flex-col">
        {/* The contact card. */}
        <div className="card-30 flex w-full overflow-clip">
          <div className="flex w-[70px] flex-none flex-col items-center justify-between border-r border-rule-3 py-[30px] mobile:hidden">
            <Barcode vertical className="h-[86px] w-[11px]" />
            <RailText>{SITE.location}</RailText>
          </div>

          <div className="flex flex-1 flex-col gap-[50px] p-[50px] tablet:p-[40px] mobile:gap-[34px] mobile:p-[20px]">
            <Rise
              as="h2"
              lines={onContact ? ['Or reach us directly.'] : ['Start a calibration.']}
              className="t-display text-ink"
              wrap
            />
            {onContact ? (
              <div className="flex flex-wrap items-end justify-between gap-[40px]">
                <div className="flex flex-col gap-[22px]">
                  <span className="flex items-center gap-[7px]">
                    <Glyph className="[&>i]:bg-lime" />
                    <span className="t-mono text-ink-2">DIRECT</span>
                  </span>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="focus-ring t-sub flex min-h-[44px] w-fit items-center text-ink transition-colors duration-300 hover:text-lime"
                  >
                    {SITE.email}
                  </a>
                  <a
                    href={`tel:${SITE.phoneHref}`}
                    className="focus-ring t-body-lg flex min-h-[44px] w-fit items-center text-ink-2 transition-colors duration-300 hover:text-ink"
                  >
                    {SITE.phone}
                  </a>
                </div>
                <div className="flex flex-col items-start gap-[20px]">
                  <p className="t-caption max-w-[360px] text-ink-2">
                    The inquiry form is at the top of this page. A person reads every message that arrives
                    through it.
                  </p>
                  <MonoLink href="#contact-form" lead="BACK TO" label="THE FORM" />
                </div>
              </div>
            ) : (
              <EnquiryForm />
            )}
          </div>
        </div>

        {/* The footer row. */}
        <div className="grid w-full grid-cols-2 gap-[2px] narrow:grid-cols-1">
          <div className="card-30 relative flex min-h-[475px] flex-col justify-end overflow-clip p-[50px] narrow:min-h-[280px] mobile:p-[20px]">
            <Img
              src="/img/plate-geometry-wide.jpg"
              /* NOT THE BELKOFSKI FRAMES. The footer is the firm's own
                 signature block, and a photograph of another company's
                 product is not the firm. */
              alt="A monochrome render: wireframe polyhedra and solid white planes suspended against black, lit along their edges."
              /* 880, NOT THE BOX'S 687. The plate is 1.82:1 and the box is
                 687 x 481, so cover draws the picture 874px wide and clips the
                 sides. The hint is how wide the picture is drawn, not how
                 wide the box is; at 687 an ordinary screen was sent a 750px
                 file and stretched it. */
              sizes="(max-width: 1199px) 100vw, 880px"
              className="media-fill opacity-80"
            />
            <span className="grain grain-flat absolute inset-0" aria-hidden="true" />
            <DotGrid cols={9} rows={6} className="absolute right-[60px] top-[80px] mobile:hidden" />
            <span className="relative flex items-center gap-[18px]">
              <span className="flex items-center gap-[8px]">
                <Glyph className="[&>i]:bg-lime" />
                <span className="t-mark text-ink">{SITE.name}<span className="t-mark-r">{SITE.mark}</span></span>
              </span>
              <span className="h-[14px] w-px bg-rule" aria-hidden="true" />
              <span className="t-mono-9 text-ink-2">{SITE.descriptor}</span>
            </span>
          </div>

          <div className="card-30 flex min-h-[475px] flex-col justify-between gap-[50px] p-[50px] narrow:min-h-0 mobile:gap-[34px] mobile:p-[20px]">
            <div className="flex flex-col gap-[40px]">
              <div className="flex flex-col gap-[7px]">
                <a
                  href={`mailto:${SITE.email}`}
                  className="focus-ring tap-44 t-sub w-fit text-ink transition-colors duration-300 hover:text-lime"
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
              <nav aria-label="Footer" className="flex flex-wrap gap-[8px]">
                {NAV.map((n) => (
                  <Pill key={n.href} href={n.href}>
                    {n.label}
                  </Pill>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-[24px]">
              <div className="flex flex-wrap items-center gap-[16px]">
                {SITE.social.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring tap-44 t-mono-9 text-ink-3 transition-colors duration-300 hover:text-ink"
                  >
                    {s.label}
                    <span className="sr-only normal-case"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
              <p className="t-mono-9 text-ink-3">
                © {SITE.year} {SITE.name}. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center gap-[24px]">
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
