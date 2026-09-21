import { Rise, InView } from '@/lib/motion';
import { PROCESS as P } from '@/content/home';

/* ============================================================================
   HOW AN ENGAGEMENT RUNS — block 07. Measured 1040px, four cards, staggered.

   The reference's four steps map onto the four the brief names, and the
   staggered composition is kept: cards two and four sit lower than one and
   three, which is what stops a row of four equal boxes reading as a table.

   This is the same program as the three-card engagement model further down,
   stated at a finer grain — Build there contains System Design and Build and
   Validate here. Both groupings are the founder's own.
   ========================================================================= */
export default function Process() {
  return (
    <section id="process" aria-labelledby="process-head" className="w-full overflow-clip pad-top scroll-mt-[60px]">
      <div className="shell pad-x flex w-full flex-col gap-[48px]">
        <div className="flex flex-col gap-[16px]">
          <p className="t-mono text-ink-3">{P.eyebrow}</p>
          <Rise as="h2" id="process-head" lines={P.headline} className="t-display max-w-[14ch] text-ink" />
        </div>

        <div className="grid grid-cols-4 gap-[16px] tablet:grid-cols-2 mobile:grid-cols-1">
          {P.cards.map((c, i) => (
            <InView
              key={c.n}
              delay={i * 90}
              /* the stagger: even-indexed cards sit 48px lower */
              className={`flex ${i % 2 === 1 ? 'mt-[48px] narrow:mt-0' : ''}`}
            >
              <div className="flex min-h-[300px] w-full flex-col rounded-[24px] border border-rule-2 bg-panel p-[24px] transition-colors duration-[300ms] ease-hover hover:border-[rgba(255,255,255,0.24)] mobile:min-h-0">
                <p className="t-mono-11 text-lime">{c.n}</p>
                <h3 className="t-card mt-[20px] text-ink">{c.title}</h3>
                <p className="t-small mt-[14px] text-ink-2">{c.body}</p>
                <p className="t-mono-9 mt-auto pt-[24px] text-ink-3">{c.tag}</p>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}
