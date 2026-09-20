import Link from 'next/link';
import Img from '@/lib/Img';
import CopyEmail from '@/lib/CopyEmail';
import { FOOTER as F, FACTS } from '@/lib/content';

/**
 * FOOTER — rebuilt. The measured Elyte footer that used to live here is gone;
 * what it measured is recorded in FOOTER's comment in content.ts.
 *
 * WHAT WAS WRONG WITH IT
 *
 *   Not one rounded corner in the whole section — audited live, every element
 *   returned border-radius 0px. The rest of the site runs 12px cards, 8px
 *   controls and pill buttons, so the footer was the only square thing on it.
 *   That, more than anything, is what made it read as dated.
 *
 *   Three opaque slabs stacked on the dark plate: a grey signup bar, a white
 *   CTA card, and a 1200x308 white plate holding 247px of content. They read
 *   as three unrelated boxes rather than as one footer.
 *
 *   A button labelled "Copy" that was an <a href="mailto:">. It opened a mail
 *   client and never touched the clipboard.
 *
 *   The CTA card's arrow was two 20x20 solid black squares — the measured
 *   hover trick without the glyph it is supposed to slide. It rendered as a
 *   black block.
 *
 *   Three social icons at opacity 0.4, aria-hidden, wrapped in no link at all:
 *   three grey smudges pointing nowhere.
 *
 *   "Or write to us" — "Or" was an alternative to the newsletter that had
 *   already been taken out.
 *
 *   And the whole top half duplicated #contact, which sits immediately above
 *   it. Two consecutive sections both eyebrowed CONTACT, each with a display
 *   headline and its own route to the same inbox.
 *
 * WHAT IT IS NOW
 *
 *   One dark field on the plate, no slabs. Three blocks on the 1200 column —
 *   brand, EXPLORE, CONTACT — then a hairline and the fine print. The house
 *   radii apply. Every link goes somewhere real, and the one button does what
 *   its label says.
 *
 * STILL OPEN: no social accounts to link, so there are no social icons. Legal
 * is fine print until /legal/privacy and /legal/terms exist.
 */
export default function Footer() {
  return (
    <footer className="footer-plate relative w-full shrink-0 px-[20px] pt-[88px] pb-[40px] narrow:pt-[72px]">
      <div className="mx-auto w-full max-w-[1200px]">

        {/* brand · EXPLORE · CONTACT */}
        <div className="flex items-start gap-[80px] narrow:gap-[56px] mobile:flex-col mobile:gap-[48px]">

          {/* brand */}
          <div className="flex min-w-0 max-w-[320px] flex-1 flex-col items-start mobile:max-w-none">
            {/* The real wordmark, white-on-transparent, from
                _MASTER/04-ASSETS/brand/marks/wordmark-white.png. This slot held
                a grey placeholder rectangle, then briefly the company name set
                in type while there was no file to use. There is one now. */}
            <Link
              href="/"
              aria-label="Recalibre, back to top"
              className="focus-ring tap-44 block rounded-[8px]"
            >
              <Img
                src="/img/wordmark-white.png"
                alt="Recalibre"
                sizes="150px"
                className="block h-[26px] w-auto object-contain object-[0%_50%]"
              />
            </Link>
            <p className="mt-[20px] body-text text-on-dark-2">{F.tagline}</p>
          </div>

          {/* EXPLORE */}
          <nav aria-label="Footer" className="flex min-w-0 flex-1 flex-col items-start">
            <p className="eyebrow text-on-dark">{F.linksLabel}</p>
            <ul className="mt-[20px] flex w-full flex-col items-start gap-[12px]">
              {F.links.map((label, i) => (
                <li key={label}>
                  <Link
                    href={F.linkHrefs[i] ?? '#'}
                    className="focus-ring tap-44 body-text rounded-[8px] text-on-dark-2 transition-colors duration-[200ms] hover:text-on-dark"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CONTACT — the facts, not a second contact form */}
          <div className="flex min-w-0 flex-1 flex-col items-start">
            <p className="eyebrow text-on-dark">{F.contactLabel}</p>
            <div className="mt-[20px] flex flex-col items-start gap-[12px]">
              <CopyEmail email={FACTS.email} />
              <a
                href={`tel:${FACTS.phone.replace(/\s/g, '')}`}
                className="focus-ring tap-44 body-text rounded-[8px] text-on-dark-2 transition-colors duration-[200ms] hover:text-on-dark"
              >
                {FACTS.phone}
              </a>
              <p className="body-text text-on-dark-3">{FACTS.base}</p>
            </div>
          </div>
        </div>

        <div className="mt-[56px] h-px w-full bg-rule-on-dark" />

        {/* fine print */}
        <div className="mt-[24px] flex items-center justify-between gap-[24px] mobile:flex-col mobile:items-start mobile:gap-[10px]">
          <p className="small-text text-on-dark-3">{F.copyright}</p>
          {/* plain text, not links — the pages do not exist yet */}
          <p className="small-text text-on-dark-3">{F.legal.join(' · ')}</p>
        </div>
      </div>
    </footer>
  );
}
