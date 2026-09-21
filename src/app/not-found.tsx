import Link from 'next/link';
import { Rise } from '@/lib/motion';
import { NAV } from '@/content/site';

/**
 * 404. The reference ships one and even lists it in its own navigation.
 * This one does the single thing a 404 is for: say plainly that the address
 * is wrong, and give the reader every route on the site so they do not have
 * to guess a second time.
 */
export default function NotFound() {
  return (
    <section
      aria-labelledby="nf-head"
      className="grain relative flex w-full flex-col justify-center overflow-clip pad-y"
    >
      <div className="shell pad-x flex w-full flex-col gap-[24px]">
        <p className="t-mono text-flare">ERROR 404</p>
        <Rise
          as="h1"
          id="nf-head"
          lines={['That page is not', 'at this address.']}
          className="t-display max-w-[16ch] text-ink"
        />
        <p className="t-body-lg max-w-[52ch] text-ink-2">
          It may have moved, or the link may be wrong. Every page on this site is listed below.
        </p>

        <nav aria-label="All pages" className="mt-[16px] flex flex-col border-t border-rule">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring flex items-baseline gap-[18px] border-b border-rule py-[18px] text-ink transition-colors duration-[300ms] hover:text-lime"
            >
              <span className="t-mono-9 text-ink-3">{String(i + 1).padStart(2, '0')}</span>
              <span className="t-card">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
