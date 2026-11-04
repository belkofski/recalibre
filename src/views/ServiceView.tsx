import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMeta } from '@/lib/seo';
import { localePath, type Locale } from '@/lib/i18n';
import { InView, Rise } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import CtaBand from '@/components/CtaBand';
import Faq from '@/sections/home/Faq';
import WorkCard from '@/components/WorkCard';
import ServiceIllustration from '@/components/art/ServiceIllustration';
import ServiceFamilyView from '@/views/ServiceFamilyView';
import { toCard } from '@/lib/cards';
import { Btn, Chevron, Chip, LabelRow, MonoLink } from '@/components/ui';
import {
  SERVICE_CTA as T,
  familyBySlug,
  serviceBySlug,
  serviceParams,
  type Service,
} from '@/content/services';
import { initiativeBySlug } from '@/content/work';
import { ARTICLES, readingMinutes } from '@/content/insights';
import { SECTORS } from '@/content/industries';

/** Every address under /services/: the two families and the five services.
 *  The page files refuse any other. */
export function catalogParams() {
  return serviceParams();
}

export function catalogMeta(slug: string, locale: Locale): Metadata {
  const f = familyBySlug(slug);
  if (f) return pageMeta({ locale, path: `/services/${f.slug}`, ...f.meta });
  const s = serviceBySlug(slug);
  if (!s) return { title: 'Not found' };
  return pageMeta({ locale, path: `/services/${s.slug}`, ...s.meta });
}

/** One dynamic segment serves both kinds of page: a family (two) and a
 *  service (five). The slug says which. */
export default function ServiceCatalogView({ slug, locale }: { slug: string; locale: Locale }) {
  const family = familyBySlug(slug);
  if (family) return <ServiceFamilyView family={family} locale={locale} />;
  const service = serviceBySlug(slug);
  if (!service) return null;
  return <ServiceDetail service={service} locale={locale} />;
}

/* ============================================================================
   A SERVICE PAGE — one of five, the pages that rank.

     the opener          the service's name with its marked phrase, its
                         lede, the family it belongs to; on the right its
                         own drawing, its tags and the two ways in
     what it covers      the list a buyer checks a brief against
     how it is delivered the three stages, said for this service
     what you receive    what the organization holds at the end
     in practice         three patterns, with the note that none is a
                         deployment claim
     related work        the initiatives that drew on this service, and
                         the article that argues its method where one exists
     the FAQ, the call

   The headings are real headings (one h1, then h2s), the lists are lists,
   and every section is readable with scripts off: this is the page a
   crawler and a procurement reader both have to be able to read.
   ========================================================================= */
function ServiceDetail({ service: s, locale }: { service: Service; locale: Locale }) {
  const family = familyBySlug(s.family)!;
  const projects = s.projects.map((p) => initiativeBySlug(p)!).filter(Boolean);
  const insight = s.insight ? ARTICLES.find((a) => a.slug === s.insight) : undefined;
  const quote = `${localePath(locale, '/contact')}?type=quotation&service=${s.slug}`;
  return (
    <>
      <PageHead
        lines={s.headline}
        mark={s.mark}
        lede={s.lede}
        aside={
          <InView className="flex flex-col gap-[24px]">
            <div className="card-24 overflow-clip bg-raised">
              <ServiceIllustration id={s.slug} />
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {s.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-[24px]">
              <Btn href={localePath(locale, '/contact')} label={T.calibrate.label} />
              <MonoLink href={quote} label={T.quote.label} />
            </div>
          </InView>
        }
      >
        <InView className="flex items-center gap-[12px]">
          <span className="t-mono text-ink-3">{T.familyLabel}</span>
          <Link href={localePath(locale, `/services/${family.slug}`)} className="t-mono hover-read text-ink">
            {family.name.toUpperCase()}
          </Link>
        </InView>
      </PageHead>

      {/* what it covers */}
      <section aria-labelledby="covers-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-label)">
          <LabelRow label={T.coversLabel} />
          <div className="grid w-full grid-cols-[minmax(0,1fr)_690px] gap-[40px] narrow:grid-cols-1">
            <Rise as="h2" id="covers-head" lines={['What it', 'covers.']} className="t-display text-ink" />
            <InView as="ul" className="flex flex-col divide-y divide-rule border-y border-rule">
              {s.covers.map((c, i) => (
                <li key={c} className="grid grid-cols-[48px_1fr] items-baseline gap-[16px] py-[16px]">
                  <span className="t-mono-11 tabular-nums text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                  <span className="t-body text-ink">{c}</span>
                </li>
              ))}
            </InView>
          </div>
        </div>
      </section>

      {/* how it is delivered */}
      <section aria-labelledby="stages-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-label)">
          <LabelRow label={T.stagesLabel} />
          <div className="flex w-full justify-end">
            <div className="flex w-[690px] narrow:w-full">
              <Rise as="h2" id="stages-head" lines={['How it is', 'delivered.']} className="t-display text-ink" />
            </div>
          </div>
          <div className="seam grid w-full grid-cols-3 mobile:grid-cols-1">
            {s.stages.map((st, i) => (
              <InView key={st.title} step={i} className={`card-30 flex flex-col gap-[24px] p-(--card-pad) ${i === 0 ? 'bg-raised-2' : ''}`}>
                <span className="t-mono-11 tabular-nums text-ink-2">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-card text-ink">{st.title}</h3>
                <p className="t-body text-ink-2">{st.body}</p>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* what you receive */}
      <section aria-labelledby="receive-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="seam shell flex">
          <div className="card-30 grid w-full grid-cols-[minmax(0,1fr)_690px] gap-[40px] p-(--card-pad) narrow:grid-cols-1">
            <div className="flex flex-col gap-(--space-lede)">
              <LabelRow label={T.receiveLabel} />
              <Rise as="h2" id="receive-head" lines={['What you', 'receive.']} className="t-display text-ink" />
            </div>
            <InView as="ul" className="flex flex-col divide-y divide-rule">
              {s.receive.map((r) => (
                <li key={r} className="flex items-start gap-[16px] py-[16px]">
                  <span className="mt-[9px] flex-none text-accent-bright" aria-hidden="true">
                    <Chevron />
                  </span>
                  <span className="t-lede text-ink">{r}</span>
                </li>
              ))}
            </InView>
          </div>
        </div>
      </section>

      {/* in practice */}
      <section aria-labelledby="patterns-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-label)">
          <LabelRow label={T.patternsLabel} />
          <Rise as="h2" id="patterns-head" lines={['What it looks like', 'in practice.']} className="t-display max-w-[690px] text-ink" />
          <div className="seam grid w-full grid-cols-3 mobile:grid-cols-1">
            {s.patterns.map((p, i) => (
              <InView key={p.title} step={i} className="card-30 hover-lift flex flex-col gap-[16px] p-(--card-pad)">
                <span className="t-mono-11 tabular-nums text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-card text-ink">{p.title}</h3>
                <p className="t-body text-ink-2">{p.body}</p>
              </InView>
            ))}
          </div>
          <InView>
            <p className="t-caption max-w-[600px] text-ink-2">{T.patternsNote}</p>
          </InView>
        </div>
      </section>

      {/* related work and reading */}
      <section aria-labelledby="related-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-label)">
          <LabelRow label={T.projectsLabel} right={<MonoLink href={localePath(locale, '/projects')} lead="ALL" label="PROJECTS" />} />
          <h2 id="related-head" className="sr-only">
            Related work
          </h2>
          <div className="seam grid w-full grid-cols-2 phone:grid-cols-1">
            {projects.map((item, i) => (
              <InView key={item.slug} step={i % 2}>
                <WorkCard item={toCard(item)} heading="h3" showSummary stackOnTablet />
              </InView>
            ))}
          </div>
          {/* THE SECTOR (4 November 2026): every service page links the
              industry page, so the three kinds of page link each other. */}
          <InView className="flex flex-wrap items-center gap-x-[24px] gap-y-[8px]">
            <span className="t-mono text-ink-3">SECTOR</span>
            {SECTORS.map((sec) => (
              <MonoLink key={sec.slug} href={`${localePath(locale, '/industries')}#${sec.slug}`} label={sec.name.toUpperCase()} />
            ))}
          </InView>
          {insight ? (
            <InView className="seam-sm flex">
              <Link
                href={localePath(locale, `/insights/${insight.slug}`)}
                className="card-24 hover-lift group flex w-full items-center justify-between gap-[24px] p-(--card-pad)"
              >
                <span className="flex flex-col gap-[8px]">
                  <span className="t-mono text-ink-3">{T.insightLabel}</span>
                  <span className="t-card text-ink">{insight.title}</span>
                  <span className="t-mono-11 tabular-nums text-ink-2">
                    {insight.subject} · {readingMinutes(insight)} MIN READ
                  </span>
                </span>
                <span className="dot-btn flex-none">
                  <Chevron />
                </span>
              </Link>
            </InView>
          ) : null}
        </div>
      </section>

      <Faq
        items={s.faq}
        label={T.faqLabel}
        headline={['Questions about', 'this service.']}
        prefix="service-faq"
        ctaHref={quote}
        tail={{ headline: 'Still have a question?', note: T.quote.label }}
      />
      <CtaBand locale={locale} service={s.slug} />
    </>
  );
}
