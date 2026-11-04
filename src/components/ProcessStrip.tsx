import { InView, Rise } from '@/lib/motion';
import { LabelRow } from '@/components/ui';
import { home, tr } from '@/content';
import type { Locale } from '@/lib/i18n';

/* THE THREE STAGES, IN A STRIP. The home page and About carry the full
   deck (sections/home/Engagement.tsx); the service pages need the same
   three stages said once, short, under the service's own account of what
   each stage means for it. Three cards on one seam, the number, the title,
   the note and what the buyer receives — the same words as the deck, read
   from the same record, and nothing added. */
export default function ProcessStrip({
  label,
  headline,
  footnote = true,
  locale,
}: {
  label: string;
  headline: readonly string[];
  footnote?: boolean;
  locale: Locale;
}) {
  const { ENGAGEMENT } = home(locale);
  const t = tr(locale);
  return (
    <section aria-labelledby="process-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-label)">
        <LabelRow label={label} />
        <div className="flex w-full justify-end">
          <div className="flex w-[690px] narrow:w-full">
            <Rise as="h2" id="process-head" lines={headline} className="t-display text-ink" />
          </div>
        </div>
        <div className="seam grid w-full grid-cols-3 mobile:grid-cols-1">
          {ENGAGEMENT.cards.map((c, i) => (
            <InView
              key={c.n}
              step={i}
              className={`card-30 flex flex-col gap-[24px] p-(--card-pad) ${i === 0 ? 'bg-raised-2' : ''}`}
            >
              <span className="t-mono-11 tabular-nums text-ink-2">{c.n}</span>
              <div className="flex flex-col gap-[8px]">
                <h3 className="t-card text-ink">{c.title}</h3>
                <p className="t-body text-ink-2">{c.note}</p>
              </div>
              <div className="mt-auto flex flex-col gap-[8px] border-t border-rule pt-[16px]">
                <span className="t-mono text-ink-3">{t('YOU RECEIVE')}</span>
                <span className="t-body text-ink">{c.output}</span>
              </div>
            </InView>
          ))}
        </div>
        {footnote ? (
          <InView>
            <p className="t-caption max-w-[600px] text-ink-2">{ENGAGEMENT.footnote}</p>
          </InView>
        ) : null}
      </div>
    </section>
  );
}
