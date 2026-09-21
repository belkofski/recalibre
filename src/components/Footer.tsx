import Link from 'next/link';
import { SITE, NAV, LEGAL } from '@/content/site';
import { Rise } from '@/lib/motion';

/* ============================================================================
   THE FOOTER.

   The reference closes with a giant wordmark, the two direct contacts, the
   route list, the legal pair and a copyright line. All of that is kept.

   TWO THINGS ARE NOT:

     THE FOUNDING YEAR. The reference prints "© 2017—2026". Recalibre's
     founding year is not on record anywhere that can be checked, so the line
     prints the current year alone. A range with an invented left-hand side
     is a founding date by another name.

     THE ®. Asserted, not registered. See src/content/site.ts.
   ========================================================================= */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-clip border-t border-rule bg-ground grain">
      <div className="shell pad-x flex w-full flex-col gap-[64px] pb-[40px] pt-[80px] mobile:gap-[44px] mobile:pt-[50px]">
        {/* the wordmark, set at statement size as the reference does */}
        <Rise as="p" lines={[SITE.name]} className="t-statement text-ink" />

        <div className="flex flex-wrap justify-between gap-[40px]">
          <div className="flex flex-col gap-[10px]">
            <p className="t-mono text-ink-3">Direct</p>
            <a href={`mailto:${SITE.email}`} className="focus-ring tap-44 t-body-lg text-ink transition-colors duration-[300ms] hover:text-lime">
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phoneHref}`} className="focus-ring tap-44 t-body-lg text-ink transition-colors duration-[300ms] hover:text-lime">
              {SITE.phone}
            </a>
            <p className="t-small mt-[6px] text-ink-2">{SITE.location}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-[10px]">
            <p className="t-mono text-ink-3">Pages</p>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring tap-44 t-body text-ink-2 transition-colors duration-[300ms] hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-[10px]">
            <p className="t-mono text-ink-3">Elsewhere</p>
            {SITE.social.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="focus-ring tap-44 t-body text-ink-2 transition-colors duration-[300ms] hover:text-ink"
              >
                {s.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-[10px]">
            <p className="t-mono text-ink-3">Legal</p>
            {LEGAL.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="focus-ring tap-44 t-body text-ink-2 transition-colors duration-[300ms] hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-[16px] border-t border-rule-3 pt-[24px]">
          <p className="t-mono-9 text-ink-3">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="t-mono-9 text-ink-3">{SITE.descriptor}</p>
        </div>
      </div>
    </footer>
  );
}
