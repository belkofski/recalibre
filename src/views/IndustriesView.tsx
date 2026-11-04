import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMeta } from '@/lib/seo';
import { localePath, type Locale } from '@/lib/i18n';
import { InView, Rise } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import CtaBand from '@/components/CtaBand';
import Faq from '@/sections/home/Faq';
import WorkCard from '@/components/WorkCard';
import ValueChain from '@/components/art/ValueChain';
import { toCard } from '@/lib/cards';
import { Chip, LabelRow, MonoLink } from '@/components/ui';
import { BreadcrumbLd, FaqLd } from '@/components/JsonLd';
import { nav } from '@/content';
import { industries, services as svc, tr, work } from '@/content';

export function industriesMeta(locale: Locale): Metadata {
  return pageMeta({ locale, path: '/industries', ...industries(locale).INDUSTRIES_PAGE.meta });
}

/* ============================================================================
   INDUSTRIES — one sector today, the page built to take more.

     the opener          the sector's name with its marked phrase, its lede
                         and its two paragraphs
     the value chain     the sector's structure with the services on it
     who it is for       the six kinds of organization, one card each, with
                         what they deal with, what the firm builds, and the
                         services that apply
     related work        ABP Continental and OPS, the two pieces of
                         published work from this sector
     the FAQ, the call

   SECTORS holds one entry. A second sector is a second entry; the page
   maps the list, each sector under its own heading.
   ========================================================================= */
export default function IndustriesView({ locale }: { locale: Locale }) {
  const { SECTORS, INDUSTRIES_PAGE: P } = industries(locale);
  const { SERVICES, SERVICE_CTA } = svc(locale);
  const { INITIATIVES } = work(locale);
  const t = tr(locale);
  const serviceBySlug = (s: string) => SERVICES.find((x) => x.slug === s);
  const names = Object.fromEntries(SERVICES.map((s) => [s.slug, { n: s.n, name: s.headline.join(' ') }]));
  const single = SECTORS.length === 1;
  const N = nav(locale).NAV;
  return (
    <>
      <BreadcrumbLd locale={locale} items={[[N[0]!.label, '/'], [N[4]!.label, '/industries']]} />
      {SECTORS.map((s) => (
        <FaqLd key={s.slug} items={s.faq} locale={locale} />
      ))}
      {SECTORS.map((sector, si) => {
        const projects = sector.projects.map((p) => INITIATIVES.find((x) => x.slug === p)!).filter(Boolean);
        return (
          <div key={sector.slug} id={sector.slug}>
            {si === 0 ? (
              <PageHead
                lines={single ? sector.headline : P.headline}
                mark={single ? sector.mark : undefined}
                lede={single ? sector.lede : P.lede}
                aside={
                  <InView className="flex flex-col gap-[24px]">
                    {sector.body.map((p) => (
                      <p key={p.slice(0, 24)} className="t-body text-ink-2">
                        {p}
                      </p>
                    ))}
                  </InView>
                }
              />
            ) : (
              <section className="pad-x pad-top flex w-full flex-col items-center">
                <div className="shell">
                  <Rise as="h2" lines={sector.headline} mark={sector.mark} className="t-display text-ink" />
                </div>
              </section>
            )}

            {/* the value chain */}
            <section aria-labelledby={`${sector.slug}-chain`} className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
              <div className="shell flex w-full flex-col gap-(--space-label)">
                <LabelRow label={sector.chainLabel} />
                <div className="grid w-full grid-cols-[minmax(0,1fr)_690px] items-end gap-[40px] narrow:grid-cols-1">
                  <Rise as="h2" id={`${sector.slug}-chain`} lines={sector.chainHeadline} className="t-display text-ink" />
                  <InView>
                    <p className="t-body max-w-[520px] text-ink-2">{sector.chainNote}</p>
                  </InView>
                </div>
                <InView>
                  <ValueChain
                    chain={sector.chain}
                    locale={locale}
                    names={names}
                    buildLabel={t('WHAT WE BUILD HERE')}
                    groupLabel={t('The value chain')}
                  />
                </InView>
              </div>
            </section>

            {/* who it is for */}
            <section aria-labelledby={`${sector.slug}-who`} className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
              <div className="shell flex w-full flex-col gap-(--space-label)">
                <LabelRow label={sector.audiencesLabel} />
                <div className="flex w-full justify-end">
                  <div className="flex w-[690px] narrow:w-full">
                    <Rise as="h2" id={`${sector.slug}-who`} lines={sector.audiencesHeadline} className="t-display text-ink" />
                  </div>
                </div>
                <div className="seam grid w-full grid-cols-3 tablet:grid-cols-2 mobile:grid-cols-1">
                  {sector.audiences.map((a, i) => (
                    <InView key={a.title} step={i % 3} className="card-30 hover-lift flex flex-col gap-[20px] p-(--card-pad)">
                      <div className="flex flex-col gap-[8px]">
                        <h3 className="t-card text-ink">{a.title}</h3>
                        <p className="t-caption text-ink-2">{a.who}</p>
                      </div>
                      <div className="flex flex-col gap-[12px] border-t border-rule pt-[16px]">
                        <p className="t-body text-ink-2">{a.need}</p>
                        <p className="t-body text-ink">{a.build}</p>
                      </div>
                      <div className="mt-auto flex flex-wrap gap-[8px] pt-[8px]">
                        {a.services.map((slug) => (
                          <Link key={slug} href={localePath(locale, `/services/${slug}`)} className="tap-44 flex items-center">
                            <Chip>{serviceBySlug(slug)!.n.replace('/', '') + ' · ' + serviceBySlug(slug)!.tags[0]}</Chip>
                          </Link>
                        ))}
                      </div>
                    </InView>
                  ))}
                </div>
              </div>
            </section>

            {/* related work */}
            {projects.length ? (
              <section aria-labelledby={`${sector.slug}-work`} className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
                <div className="shell flex w-full flex-col gap-(--space-label)">
                  <LabelRow label={P.projectsLabel} right={<MonoLink href={localePath(locale, '/projects')} lead={t('ALL')} label={t('PROJECTS')} />} />
                  <h2 id={`${sector.slug}-work`} className="sr-only">
                    {t('Related work')}
                  </h2>
                  <div className="seam grid w-full grid-cols-2 phone:grid-cols-1">
                    {projects.map((item, i) => (
                      <InView key={item.slug} step={i % 2}>
                        <WorkCard item={toCard(item)} heading="h3" showSummary stackOnTablet locale={locale} />
                      </InView>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            <Faq
              items={sector.faq}
              label={P.faqLabel}
              headline={P.faqHeadline}
              prefix={`${sector.slug}-faq`}
              ctaHref={localePath(locale, '/contact')}
              tail={{ headline: t('Still have a question?'), note: SERVICE_CTA.quote.label }}
            />
          </div>
        );
      })}
      <CtaBand locale={locale} />
    </>
  );
}
