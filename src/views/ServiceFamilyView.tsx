import Link from 'next/link';
import { localePath, type Locale } from '@/lib/i18n';
import { InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import ProcessStrip from '@/components/ProcessStrip';
import CtaBand from '@/components/CtaBand';
import Faq from '@/sections/home/Faq';
import WorkCard from '@/components/WorkCard';
import SystemDiagram from '@/components/SystemDiagram';
import Showcase from '@/components/art/Showcase';
import ServiceIllustration from '@/components/art/ServiceIllustration';
import WorkflowCanvas from '@/components/fx/WorkflowCanvas';
import WorkflowCard from '@/components/fx/WorkflowCard';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import { toCard } from '@/lib/cards';
import { Caption, Chip, LabelRow, MonoLink } from '@/components/ui';
import type { Family } from '@/content/services';
import { services as svc, tr, work, workflows } from '@/content';

/* ============================================================================
   A FAMILY PAGE — Digital Presence, Advanced Solutions.

     the opener          heading and lede on the left; on the right, what
                         the family can honestly show: the two delivered
                         pieces of digital presence in frames, or the
                         Contraxis schematic for the systems family (the
                         interactions work package puts the workflow canvas
                         there)
     the services        numbered rows, the reference's own service list:
                         number, title, the home card's line, the tags, the
                         service's drawing, a link to its page
     the work            the family's related initiatives, as work cards
     the three stages    the engagement, in a strip
     the call, the FAQ
   ========================================================================= */
export default function ServiceFamilyView({ family, locale }: { family: Family; locale: Locale }) {
  const { SERVICES, SERVICES_PAGE: P, SERVICE_CTA } = svc(locale);
  const { CANVAS, WORKFLOWS, WORKFLOW_CAPTION } = workflows(locale);
  const { INITIATIVES } = work(locale);
  const t = tr(locale);
  const services = family.services.map((s) => SERVICES.find((x) => x.slug === s)!);
  const projects = family.projects.map((p) => INITIATIVES.find((x) => x.slug === p)!).filter(Boolean);
  const systems = family.slug === 'advanced-solutions';
  return (
    <>
      <PageHead
        lines={family.headline}
        mark={family.mark}
        lede={family.lede}
        aside={
          systems ? (
            <InView mode="picture" className="flex flex-col gap-[12px]">
              <div className="card-24 relative aspect-[418/278] w-full overflow-clip bg-raised">
                <SystemDiagram preset="card" className="absolute inset-[14px]" />
              </div>
              <Caption as="div">{DIAGRAM_CAPTION}</Caption>
            </InView>
          ) : (
            <InView mode="picture">
              <Showcase />
            </InView>
          )
        }
      >
        <InView>
          <p className="t-body max-w-[500px] text-ink-2">{family.body}</p>
        </InView>
        <InView>
          <MonoLink href={localePath(locale, '/services')} lead={t('ALL')} label={t('SERVICES')} />
        </InView>
      </PageHead>

      {/* THE WORKFLOW CANVAS, full width, on the systems family (4 November
          2026): the pattern the three services add up to, drawn and run —
          inputs, the agent, the outputs, a person deciding, a record kept
          — with three pattern cards under it. Every one is captioned as a
          pattern, not a deployment. */}
      {systems ? (
        <section aria-labelledby="family-canvas" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
          <div className="shell flex w-full flex-col gap-(--space-label)">
            <LabelRow label={t('HOW IT RUNS')} />
            <div className="grid w-full grid-cols-[minmax(0,1fr)_690px] items-end gap-[40px] narrow:grid-cols-1">
              <h2 id="family-canvas" className="t-display text-ink">
                {CANVAS.title}.
              </h2>
              <InView>
                <p className="t-body max-w-[520px] text-ink-2">{CANVAS.description}</p>
              </InView>
            </div>
            <InView mode="picture">
              <WorkflowCanvas spec={CANVAS} pauseLabel={t('Pause motion')} playLabel={t('Play motion')} />
              <Caption as="div" className="mt-[8px]">{WORKFLOW_CAPTION}</Caption>
            </InView>
            <div className="grid w-full grid-cols-3 gap-[2px] tablet:grid-cols-2 mobile:grid-cols-1">
              {WORKFLOWS.slice(0, 3).map((w, i) => (
                <InView key={w.key} step={i} className="flex">
                  <WorkflowCard spec={w} captionText={WORKFLOW_CAPTION} />
                </InView>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* the services, numbered */}
      <section aria-labelledby="family-services" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-label)">
          <LabelRow label={t('THE SERVICES')} />
          <h2 id="family-services" className="sr-only">
            {t('The services')}
          </h2>
          <div className="flex w-full flex-col">
            {services.map((s, i) => (
              <InView
                key={s.slug}
                as="article"
                className="grid w-full grid-cols-[120px_1fr_418px] items-start gap-[40px] border-t border-rule py-(--space-row) narrow:grid-cols-[80px_1fr] mobile:grid-cols-1 mobile:gap-[24px]"
              >
                <p className="t-display tabular-nums text-ink-3">{s.n}</p>
                <div className="flex flex-col gap-[24px]">
                  <div className="flex flex-col gap-[12px]">
                    <h3 className="t-card text-ink">
                      <Link href={localePath(locale, `/services/${s.slug}`)} className="hover-read">
                        {s.headline.join(' ')}
                      </Link>
                    </h3>
                    <p className="t-body max-w-[520px] text-ink-2">{s.short}</p>
                  </div>
                  <div className="flex flex-wrap gap-[8px]">
                    {s.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                  <MonoLink href={localePath(locale, `/services/${s.slug}`)} label={SERVICE_CTA.readMore} />
                </div>
                <Link
                  href={localePath(locale, `/services/${s.slug}`)}
                  aria-hidden="true"
                  tabIndex={-1}
                  className="card-24 hover-lift block overflow-clip narrow:col-span-2 narrow:max-w-[418px] mobile:col-span-1"
                >
                  <ServiceIllustration id={s.slug} />
                </Link>
                {i === services.length - 1 ? null : null}
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* the related work */}
      {projects.length ? (
        <section aria-labelledby="family-work" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
          <div className="shell flex w-full flex-col gap-(--space-label)">
            <LabelRow
              label={SERVICE_CTA.projectsLabel}
              right={<MonoLink href={localePath(locale, '/projects')} lead={t('ALL')} label={t('PROJECTS')} />}
            />
            <h2 id="family-work" className="sr-only">
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

      <ProcessStrip label={P.deliveryLabel} headline={P.deliveryHeadline} footnote={false} locale={locale} />
      <CtaBand locale={locale} />
      <Faq
        items={family.faq}
        label={SERVICE_CTA.faqLabel}
        headline={[t('Questions about'), `${family.name}.`]}
        prefix="family-faq"
        ctaHref={localePath(locale, '/contact')}
        tail={{ headline: t('Still have a question?'), note: SERVICE_CTA.quote.label }}
      />
    </>
  );
}
