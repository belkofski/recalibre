import { Rise, InView } from '@/lib/motion';
import { LabelRow, Btn } from '@/components/ui';
import { ENGAGEMENT } from '@/content/home';

/* ============================================================================
   THE ENGAGEMENT CARDS.

   The reference's pricing deck, kept whole: three 454px cards on their own
   seam plates at radius 31, a 9px gutter, a header row carrying the stage
   number and three dots, a title with a POPULAR stamp, a checked feature
   list, and a raised foot holding the action and the figure.

   The figure slot is the only change. There is no price on it — it carries
   the scope statement in the same position, at the same size, by
   instruction.
   ========================================================================= */

function Check() {
  return (
    <span
      aria-hidden="true"
      className="mt-[1px] flex size-[16px] flex-none items-center justify-center rounded-full bg-white/[0.08]"
    >
      <svg viewBox="0 0 10 8" className="size-[8px]" fill="none">
        <path d="M1 4.2 3.5 6.7 9 1.2" stroke="currentColor" strokeWidth="1.4" className="text-lime" />
      </svg>
    </span>
  );
}

export default function Engagement() {
  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col items-center gap-[70px] mobile:gap-[40px]">
        <div className="flex w-full flex-col items-center gap-[70px] mobile:gap-[30px]">
          <LabelRow label={ENGAGEMENT.label} />
          <Rise as="h2" lines={ENGAGEMENT.headline} className="t-display text-center text-ink" />
        </div>

        <div className="grid w-full grid-cols-3 gap-[9px] narrow:grid-cols-1">
          {ENGAGEMENT.cards.map((c, i) => (
            <InView key={c.n} delay={i * 90} className="seam flex flex-col">
              <div className="card-30 flex flex-1 flex-col gap-[40px] p-[30px] mobile:p-[20px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-[10px]">
                    <span className="t-body-lg text-ink">{c.n}</span>
                    <span aria-hidden="true" className="flex items-center gap-[3px]">
                      {[0, 1, 2].map((d) => (
                        <i
                          key={d}
                          className={`block size-[4px] rounded-full ${d <= i ? 'bg-lime' : 'bg-white/20'}`}
                        />
                      ))}
                    </span>
                  </span>
                  <span className="t-mono-9 text-ink-2">{c.timeline}</span>
                </div>

                <div className="flex flex-col gap-[2px]">
                  <span className="flex flex-wrap items-center gap-[10px]">
                    <h3 className="t-card text-ink">{c.title}</h3>
                    {c.popular ? <span className="chip t-tag text-ink">POPULAR</span> : null}
                  </span>
                  <p className="t-card text-ink-2">{c.note}</p>
                </div>

                <ul className="flex flex-col gap-[12px]">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-start gap-[10px]">
                      <Check />
                      <span className="t-small text-ink-2">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-[20px] rounded-b-[29px] bg-white/[0.03] p-[30px] mobile:flex-col mobile:items-start mobile:p-[20px]">
                <Btn href="/contact" label={c.cta} />
                <span className="t-mono text-ink-2">{ENGAGEMENT.scopeLine}</span>
              </div>
            </InView>
          ))}
        </div>

        <InView>
          <p className="t-mono max-w-[400px] text-center text-ink-2">{ENGAGEMENT.footnote}</p>
        </InView>
      </div>
    </section>
  );
}
