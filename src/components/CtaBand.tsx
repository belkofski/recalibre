import { InView, Rise } from '@/lib/motion';
import { Btn, MonoLink } from '@/components/ui';
import Magnetic from '@/components/fx/Magnetic';
import { SERVICE_CTA } from '@/content/services';
import { localePath, type Locale } from '@/lib/i18n';

/* THE TWO WAYS IN, at the foot of every service page: the calibration, which
   is the one door every engagement goes through, and the quotation request,
   the second path the audit found missing for a buyer who already knows
   what they want. The quotation link carries the service into the form
   (`?type=quotation&service=…`; the contact page reads it). */
export default function CtaBand({ locale, service }: { locale: Locale; service?: string }) {
  const quote = `${localePath(locale, '/contact')}?type=quotation${service ? `&service=${service}` : ''}`;
  return (
    <section aria-labelledby="cta-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
      <div className="seam shell flex">
        <div className="card-30 grid w-full grid-cols-[minmax(0,1fr)_auto] items-end gap-x-[40px] gap-y-[32px] bg-raised-2 p-[50px] tablet:p-[40px] narrow:grid-cols-1 mobile:p-[20px]">
          <div className="flex flex-col gap-(--space-lede)">
            <Rise as="h2" id="cta-head" lines={SERVICE_CTA.ctaHeadline} className="t-display text-ink" />
            <InView>
              <p className="t-body max-w-[460px] text-ink-2">{SERVICE_CTA.ctaBody}</p>
            </InView>
          </div>
          <InView className="flex flex-wrap items-center gap-[24px]">
            <Magnetic>
              <Btn href={localePath(locale, '/contact')} label={SERVICE_CTA.calibrate.label} />
            </Magnetic>
            <MonoLink href={quote} label={SERVICE_CTA.quote.label} />
          </InView>
        </div>
      </div>
    </section>
  );
}
