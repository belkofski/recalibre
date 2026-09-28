import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Img from '@/lib/Img';
import { Rise } from '@/lib/motion';
import EnquiryForm from '@/components/EnquiryForm';
import { Barcode, RailText, Glyph, Chip } from '@/components/ui';
import { SITE } from '@/content/site';
import Faq from '@/sections/home/Faq';

export const metadata: Metadata = pageMeta({
  title: 'Contact — describe the operational problem',
  description:
    'Describe the operational problem in your own words. A person reads every inquiry that arrives through this form.',
  path: '/contact',
  image: '/img/og-contact-b.jpg',
  imageAlt: 'A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left.',
});

/* ============================================================================
   CONTACT — the reference's contact page.

   One panel filling the viewport, split down the middle: a photograph
   behind the left half carrying the label, the heading, the copy and the
   direct details; the form on the right on its own card. Below it, the FAQ.

   NO REPLY TIME IS PROMISED anywhere on this page. Recalibre's real one is
   not on record, and a promise the firm has not made is still a promise the
   reader will hold it to.
   ========================================================================= */
export default function ContactPage() {
  return (
    <>
      <section
        aria-labelledby="contact-head"
        className="pad-x relative flex w-full flex-col items-center overflow-clip bg-raised pb-[32px] pt-[80px] phone:pb-[24px] phone:pt-[72px]"
      >
        <div className="seam shell grid w-full grid-cols-2 narrow:grid-cols-1">
          {/* the photographic half */}
          {/* No floor since 28 September 2026 (720, 420 below 1200): beside the
              form the card takes the form's height; stacked, its own. The
              gap keeps the two blocks apart when nothing stretches it. */}
          <div className="card-30 relative flex flex-col justify-between gap-[48px] overflow-clip p-[50px] tablet:p-[40px] mobile:p-[20px]">
            <Img
              src="/img/plate-room-contact-b.jpg"
              alt="A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left."
              priority
              /* Drawn 810px wide, not 687: the card is taller than the
                 plate's shape and the 1.1 push scales it up again. */
              sizes="(max-width: 1199px) 100vw, 820px"
              className="media-push media-push-sm"
            />
            {/* The card's flat 34% darkening is in the picture file now
                (scripts/plates.py, `wash`). The heading sits at the top of
                the card and the address block at its foot. A heavier flat
                darkening either buries the picture or loses the type;
                holding the two ends down keeps both. */}
            <span
              className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-ground via-ground/72 to-transparent"
              aria-hidden="true"
            />
            <span
              className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-ground/72 to-transparent"
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-[32px]">
              <span className="flex items-center gap-[8px]">
                <Glyph className="[&>i]:bg-accent-bright" />
                <span className="t-mono-11 text-ink-2">START A CALIBRATION</span>
              </span>
              <Rise as="h1" id="contact-head" lines={['Get in touch.']} className="t-display text-ink" />
              <p className="t-body max-w-[420px] text-ink-2">
                Describe the operational problem in your own words. We will tell you whether it is a strategy
                problem, a systems problem or a design problem — and what a Calibration would cover.
              </p>
            </div>

            <div className="relative flex flex-col gap-[32px]">
              <div className="flex flex-col gap-[8px]">
                <span className="t-mono text-ink-3">EMAIL</span>
                {/* The address at 28px is 308px wide, more than a phone's card
                    below 400: below 600 it scales with the width and holds one
                    line (important: the type roles are unlayered). */}
                <a
                  href={`mailto:${SITE.email}`}
                  className="focus-ring tap-44 t-card w-fit max-w-full text-ink transition-colors duration-300 hover:text-accent-bright phone:text-[length:min(28px,calc((100vw-84px)/11.2))]!"
                >
                  {SITE.email}
                </a>
              </div>
              <div className="flex flex-wrap gap-[48px]">
                <div className="flex flex-col gap-[8px]">
                  <span className="t-mono text-ink-3">PHONE</span>
                  <a
                    href={`tel:${SITE.phoneHref}`}
                    className="focus-ring tap-44 t-body w-fit text-ink transition-colors duration-300 hover:text-accent-bright"
                  >
                    {SITE.phone}
                  </a>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <span className="t-mono text-ink-3">LOCATION</span>
                  {/* Matched to the phone link beside it: that one is 44px
                      tall for the touch target, and a plain span at its own
                      height put the two values on different baselines. */}
                  <span className="t-body flex min-h-[44px] items-center text-ink">{SITE.location}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-[8px]">
                {SITE.social.map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="focus-ring tap-44">
                    <Chip>{s.label}</Chip>
                    <span className="sr-only normal-case"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* the form half, with the reference's technical rail */}
          <div className="card-30 flex overflow-clip">
            <div className="flex w-[70px] flex-none flex-col items-center justify-between border-r border-rule-3 py-[32px] mobile:hidden">
              <Barcode vertical className="h-[86px] w-[11px]" />
              <RailText>{SITE.descriptor}</RailText>
            </div>
            <div className="flex flex-1 flex-col gap-[48px] p-[50px] tablet:gap-[40px] tablet:p-[40px] mobile:gap-[32px] mobile:p-[20px]">
              <h2 id="contact-form" className="t-card text-ink">Tell us what is not working yet.</h2>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* The FAQ's closing link goes up to this page's own form, not to the
          footer's (there is none here). */}
      <Faq ctaHref="#contact-form" />
    </>
  );
}
