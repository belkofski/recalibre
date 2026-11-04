import Link from 'next/link';
import { Rise, InView } from '@/lib/motion';
import { LabelRow, MonoLink, Chip, Chevron } from '@/components/ui';
import CardShuffle from '@/components/fx/CardShuffle';
import WorkflowCard from '@/components/fx/WorkflowCard';
import ServiceIllustration from '@/components/art/ServiceIllustration';
import { CAPABILITIES } from '@/content/home';
import { SERVICES } from '@/content/services';
import { WORKFLOWS } from '@/content/workflows';
import { localePath, type Locale } from '@/lib/i18n';

/* ============================================================================
   HOME 05 — THE SERVICES, AS A DECK THE READER SHUFFLES.

   The white-panel carousel (CapabilitiesSlider, 26 September 2026) gave
   way on 4 November 2026 to the card-shuffle stack the owner confirmed
   from Framer University (components/fx/CardShuffle.tsx): five cards, one
   per service, each with the service's own drawing, its number, its name,
   the home card's line and its tags, and each a link to the service's
   page. The heading and the lede are the ones the block has always had
   ('Our capabilities.', the founder's line about one team), so the enquiry
   form's origin note reads the same first heading.

   Under the deck, one workflow pattern as a template card and the way to
   the services index: a reader who has seen the five services is shown
   what one of them looks like running, and where to read the rest.
   ========================================================================= */

export default function Services({ locale }: { locale: Locale }) {
  const C = CAPABILITIES;
  const cards = SERVICES.map((s) => ({
    key: s.slug,
    node: (
      <Link
        href={localePath(locale, `/services/${s.slug}`)}
        className="card-30 spot group flex h-full flex-col gap-[20px] overflow-clip bg-raised p-(--card-pad)"
      >
        {/* The drawing takes what height the card leaves after the words,
            never more: the card is a fixed shape on the stage. */}
        <span className="card-24 relative min-h-0 flex-1 overflow-clip bg-ground">
          <ServiceIllustration id={s.slug} className="aspect-auto! absolute inset-0 h-full" />
        </span>
        <span className="flex items-start justify-between gap-[16px]">
          <span className="flex flex-col gap-[8px]">
            <span className="t-mono-11 tabular-nums text-ink-3">{s.n}</span>
            <span className="t-card text-ink">{s.headline.join(' ')}</span>
          </span>
          <span className="dot-btn mt-[8px] flex-none" aria-hidden="true">
            <Chevron />
          </span>
        </span>
        <span className="t-body line-clamp-2 text-ink-2 mobile:line-clamp-3">{s.short}</span>
        <span className="flex flex-wrap gap-[8px] mobile:hidden">
          {s.tags.slice(0, 3).map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </span>
      </Link>
    ),
  }));

  return (
    <section aria-labelledby="capabilities-head" className="pad-x pad-top relative flex w-full flex-col items-center">
      <div className="shell flex w-full flex-col gap-(--space-label)">
        <LabelRow label="SERVICES" right={<MonoLink href={localePath(locale, '/services')} lead="ALL" label="SERVICES" />} />
        <div className="flex w-full flex-col gap-(--space-lede)">
          <Rise as="h2" id="capabilities-head" lines={C.headline} className="t-display text-ink" />
          <InView>
            <p className="t-body max-w-[460px] text-ink-2">{C.lede}</p>
          </InView>
        </div>
      </div>
      <CardShuffle cards={cards} className="mt-[24px]" />
      <div className="shell grid w-full grid-cols-[1fr_1fr] gap-[2px] narrow:grid-cols-1">
        <InView className="flex">
          <WorkflowCard spec={WORKFLOWS[0]!} href={localePath(locale, '/services/advanced-solutions')} />
        </InView>
        <InView step={1} className="card-24 flex flex-col justify-between gap-[24px] bg-raised-2 p-(--card-pad)">
          <p className="t-lede text-ink">You brief once. The same team carries it through to production.</p>
          <MonoLink href={localePath(locale, '/contact')} label={C.cta.label.toUpperCase()} />
        </InView>
      </div>
    </section>
  );
}
