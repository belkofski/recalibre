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
  image: '/img/og-contact.jpg',
  imageAlt: 'The Recalibre showroom: a deep blue wall, a single chair and a wide screen, lit from the left.',
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
        className="pad-x relative flex w-full flex-col items-center overflow-clip bg-raised pb-[30px] pt-[80px] tablet:pt-[74px] mobile:pb-[20px] mobile:pt-[70px]"
      >
        <div className="seam shell grid w-full grid-cols-2 narrow:grid-cols-1">
          {/* the photographic half */}
          <div className="card-30 relative flex min-h-[720px] flex-col justify-between overflow-clip p-[50px] narrow:min-h-[420px] mobile:p-[20px]">
            <Img
              src="/img/plate-room-tall.jpg"
              alt="The Recalibre showroom: a deep blue wall, a single chair and a wide screen, lit from the left."
              priority
              /* Drawn 810px wide, not 687: the card is taller than the
                 plate's shape and the 1.1 push scales it up again. */
              sizes="(max-width: 1199px) 100vw, 820px"
              className="media-push media-push-sm"
            />
            <span className="absolute inset-0 bg-ground/34" aria-hidden="true" />
            {/* The address block sits over a perforated steel bed — the
                busiest surface on the site. A flat wash either buries the
                picture or loses the type; holding the two ends down keeps
                both. */}
            <span
              className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-ground via-ground/72 to-transparent"
              aria-hidden="true"
            />
            <span
              className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-ground/72 to-transparent"
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-[30px]">
              <span className="flex items-center gap-[7px]">
                <Glyph className="[&>i]:bg-lime" />
                <span className="t-mono text-ink-2">START A PROJECT</span>
              </span>
              <Rise as="h1" id="contact-head" lines={['Get in touch.']} className="t-display text-ink" />
              <p className="t-body max-w-[420px] text-ink-2">
                Describe the operational problem in your own words. We will tell you whether it is a strategy
                problem, a systems problem or a design problem — and what a Calibration would cover.
              </p>
            </div>

            <div className="relative flex flex-col gap-[30px]">
              <div className="flex flex-col gap-[8px]">
                <span className="t-mono-9 text-ink-3">EMAIL</span>
                <a
                  href={`mailto:${SITE.email}`}
                  className="focus-ring tap-44 t-sub w-fit text-ink transition-colors duration-300 hover:text-lime"
                >
                  {SITE.email}
                </a>
              </div>
              <div className="flex flex-wrap gap-[50px]">
                <div className="flex flex-col gap-[8px]">
                  <span className="t-mono-9 text-ink-3">PHONE</span>
                  <a
                    href={`tel:${SITE.phoneHref}`}
                    className="focus-ring tap-44 t-note w-fit text-ink transition-colors duration-300 hover:text-lime"
                  >
                    {SITE.phone}
                  </a>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <span className="t-mono-9 text-ink-3">LOCATION</span>
                  {/* Matched to the phone link beside it: that one is 44px
                      tall for the touch target, and a plain span at its own
                      height put the two values on different baselines. */}
                  <span className="t-note flex min-h-[44px] items-center text-ink">{SITE.location}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-[10px]">
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
            <div className="flex w-[70px] flex-none flex-col items-center justify-between border-r border-rule-3 py-[30px] mobile:hidden">
              <Barcode vertical className="h-[86px] w-[11px]" />
              <RailText>{SITE.descriptor}</RailText>
            </div>
            <div className="flex flex-1 flex-col gap-[50px] p-[50px] tablet:p-[40px] mobile:gap-[34px] mobile:p-[20px]">
              <h2 id="contact-form" className="t-card text-ink">Tell us what is not working yet.</h2>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* On this page "Ask a question" went to the page it was already on and
          did nothing. Here it goes up to the form. */}
      <Faq ctaHref="#contact-form" />
    </>
  );
}
