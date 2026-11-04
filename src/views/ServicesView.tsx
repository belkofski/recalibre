import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMeta } from '@/lib/seo';
import { localePath, type Locale } from '@/lib/i18n';
import { InView, Rise } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import ProcessStrip from '@/components/ProcessStrip';
import CtaBand from '@/components/CtaBand';
import Faq from '@/sections/home/Faq';
import ServiceIllustration from '@/components/art/ServiceIllustration';
import { Chevron, LabelRow, MonoLink } from '@/components/ui';
import { services as svc, tr } from '@/content';

export function servicesMeta(locale: Locale): Metadata {
  return pageMeta({ locale, path: '/services', ...svc(locale).SERVICES_PAGE.meta });
}

/* ============================================================================
   THE SERVICES INDEX — the page the site never had.

     the opener          the heading and the lede on the left; on the right
                         the five services as a list a reader can jump from
     the two families    two cards on one seam, each naming its services
                         with their drawings and opening its own page
     the three stages    the engagement, in a strip
     the call            the two ways in
     the FAQ             the buyer's questions about services as a whole

   Every word comes from content/services.ts; the five numbers are the
   home page's own, so the two pages count the same things.
   ========================================================================= */
export default function ServicesView({ locale }: { locale: Locale }) {
  const { FAMILIES, SERVICES, SERVICES_PAGE: P, SERVICE_CTA } = svc(locale);
  const t = tr(locale);
  const serviceBySlug = (s: string) => SERVICES.find((x) => x.slug === s);
  return (
    <>
      <PageHead
        lines={P.headline}
        mark={P.mark}
        lede={P.lede}
        aside={
          <InView className="seam-sm flex flex-col">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={localePath(locale, `/services/${s.slug}`)}
                className="card-24 hover-lift group flex min-h-[64px] items-center justify-between gap-[16px] px-(--card-pad) py-[16px]"
              >
                <span className="flex items-center gap-[16px]">
                  <span className="t-mono-11 tabular-nums text-ink-3">{s.n}</span>
                  <span className="t-question text-ink">{s.headline.join(' ')}</span>
                </span>
                <span className="dot-btn flex-none">
                  <Chevron />
                </span>
              </Link>
            ))}
          </InView>
        }
      />

      {/* the two families */}
      <section aria-labelledby="families-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-label)">
          <LabelRow label={P.familiesLabel} />
          <h2 id="families-head" className="sr-only">
            {P.familiesLabel}
          </h2>
          <div className="seam grid w-full grid-cols-2 narrow:grid-cols-1">
            {FAMILIES.map((f, i) => (
              <InView key={f.slug} step={i} className="card-30 flex flex-col gap-[32px] p-(--card-pad)">
                <div className="flex flex-col gap-[16px]">
                  <span className="t-mono text-ink-2">{f.name.toUpperCase()}</span>
                  <Rise as="h3" lines={f.headline} mark={f.mark} className="t-display text-ink" />
                  <p className="t-body max-w-[520px] text-ink-2">{f.lede}</p>
                </div>
                {/* its services, each with its drawing */}
                <ul className="flex flex-col divide-y divide-rule border-y border-rule">
                  {f.services.map((slug) => {
                    const s = serviceBySlug(slug)!;
                    return (
                      <li key={slug}>
                        <Link
                          href={localePath(locale, `/services/${s.slug}`)}
                          className="group grid grid-cols-[auto_1fr_120px] items-center gap-[16px] py-[16px] phone:grid-cols-[auto_1fr]"
                        >
                          <span className="t-mono-11 tabular-nums text-ink-3">{s.n}</span>
                          <span className="flex flex-col gap-[4px]">
                            <span className="t-question text-ink">{s.headline.join(' ')}</span>
                            <span className="t-caption text-ink-2">{s.tags.slice(0, 3).join(' · ')}</span>
                          </span>
                          <span className="card-24 overflow-clip phone:hidden">
                            <ServiceIllustration id={s.slug} />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <MonoLink
                  href={localePath(locale, `/services/${f.slug}`)}
                  lead={t('EXPLORE')}
                  label={f.name.toUpperCase()}
                  className="mt-auto self-start"
                />
              </InView>
            ))}
          </div>
        </div>
      </section>

      <ProcessStrip label={P.deliveryLabel} headline={P.deliveryHeadline} locale={locale} />
      <CtaBand locale={locale} />
      <Faq
        items={P.faq}
        label={P.faqLabel}
        headline={P.faqHeadline}
        prefix="services-faq"
        ctaHref={localePath(locale, '/contact')}
        tail={{ headline: t('Still have a question?'), note: SERVICE_CTA.quote.label }}
      />
    </>
  );
}
