import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import EnquiryForm from '@/components/EnquiryForm';
import { InView } from '@/lib/motion';
import { SITE } from '@/content/site';
import Faq from '@/sections/home/Faq';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Describe the operational problem in your own words. A person reads every enquiry that arrives through this form.',
};

/* ============================================================================
   CONTACT.

   The reference's composition: the form on one side, the direct details on
   the other, the reviews block beneath, then the FAQ.

   THE REVIEWS BLOCK IS GONE from this route — it is two client quotes and
   two animated figures, and the homepage already carries the operating
   principles that replaced them. Repeating them here would be filler.

   NO REPLY TIME IS PROMISED anywhere on this page. Recalibre's real one is
   not on record, and a promise the firm has not made is still a promise the
   reader will hold it to.
   ========================================================================= */
export default function ContactPage() {
  return (
    <>
      <PageHead
        eyebrow="CONTACT"
        lines={['Get in touch.']}
        lede="Describe the operational problem in your own words. We will tell you whether it is a strategy problem, a systems problem or a design problem — and what a calibration would cover."
      />

      <section aria-label="Enquiry" className="w-full overflow-clip pad-y">
        <div className="shell pad-x grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] items-start gap-[48px] narrow:grid-cols-1 narrow:gap-[28px]">
          <InView className="flex flex-col gap-[28px]">
            <div className="flex flex-col gap-[10px]">
              <p className="t-mono-9 text-ink-3">EMAIL</p>
              <a
                href={`mailto:${SITE.email}`}
                className="focus-ring tap-44 t-body-lg text-ink transition-colors duration-[300ms] hover:text-lime"
              >
                {SITE.email}
              </a>
            </div>

            <div className="flex flex-col gap-[10px]">
              <p className="t-mono-9 text-ink-3">PHONE</p>
              <a
                href={`tel:${SITE.phoneHref}`}
                className="focus-ring tap-44 t-body-lg text-ink transition-colors duration-[300ms] hover:text-lime"
              >
                {SITE.phone}
              </a>
            </div>

            <div className="flex flex-col gap-[10px]">
              <p className="t-mono-9 text-ink-3">LOCATION</p>
              <p className="t-body-lg text-ink">{SITE.location}</p>
            </div>

            <div className="flex flex-col gap-[10px] border-t border-rule-3 pt-[24px]">
              <p className="t-mono-9 text-ink-3">WHAT HAPPENS NEXT</p>
              <ol className="flex flex-col gap-[10px]">
                {[
                  'You send this form.',
                  'A person reads it — not an autoresponder.',
                  'If it is a fit, we propose what a calibration would cover.',
                ].map((s, i) => (
                  <li key={s} className="t-small flex items-start gap-[10px] text-ink-2">
                    <span className="t-mono-9 shrink-0 pt-[2px] text-lime">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </InView>

          <InView delay={90}>
            <EnquiryForm />
          </InView>
        </div>
      </section>

      <Faq />
    </>
  );
}
