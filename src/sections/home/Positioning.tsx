import { Rise, InView } from '@/lib/motion';
import { MonoLink } from '@/components/ui';
import { ABOUT } from '@/content/home';

/* ============================================================================
   THE FIRM.

   The reference's two-column split: a heading held in the left 690 and, in
   the right 690, two figures over a two-tone paragraph. Its figures are
   performance counters; ours are structural facts, and both are countable
   on this site.
   ========================================================================= */

export default function Positioning() {
  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell grid w-full grid-cols-2 narrow:grid-cols-1 narrow:gap-[40px]">
        <div className="w-[600px] max-w-full pr-[50px] narrow:w-full narrow:pr-0">
          <Rise as="h2" lines={ABOUT.headline} className="t-display text-ink" mark={ABOUT.mark} />
        </div>

        <div className="flex flex-col gap-[100px] mobile:gap-[40px]">
          <div className="grid grid-cols-2 mobile:gap-[24px]">
            {ABOUT.figures.map((f, i) => (
              <InView
                key={f.value}
                delay={i * 90}
                className={`flex items-center gap-[35px] ${i > 0 ? 'border-l border-rule-2 pl-[50px] mobile:border-0 mobile:pl-0' : ''}`}
              >
                <div className="flex flex-col gap-[16px]">
                  <p className="t-figure text-ink">{f.value}</p>
                  <p className="t-mono text-ink-2">{f.label}</p>
                </div>
              </InView>
            ))}
          </div>

          <InView className="flex flex-col items-start gap-[40px]">
            <p className="t-lede max-w-[500px] text-ink">
              {ABOUT.bodyLead}
              <span className="text-ink-2">{ABOUT.bodyRest}</span>
            </p>
            <MonoLink href={ABOUT.cta.href} label={ABOUT.cta.label} />
          </InView>
        </div>
      </div>
    </section>
  );
}
