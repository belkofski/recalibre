import { InView } from '@/lib/motion';
import { Chevron } from '@/components/ui';
import { home, tr } from '@/content';
import type { Locale } from '@/lib/i18n';
import { cubic, cubicPath } from '@/lib/geometry';

/* ============================================================================
   THE PROCESS DIAGRAM (About, 4 November 2026).

   The three stages as a flow rather than a deck: three tiles joined by the
   diagrams' own S-curve with a port dot at each end, the first tile lit
   because it is the only way in, and under each tile the stage's points on
   hairlines. The words are the engagement model's (content/home.ts), read
   from the same record as the deck on Home and About and the strip on the
   service pages, so the three say one thing.

   The tiles are HTML — real headings, real lists — and only the connector
   between two tiles is drawn, in its own SVG that fills the gap, so the
   diagram is complete in the server's markup and nothing waits for a
   measurement. Below 810 the tiles stand one under the other and the
   connector turns vertical.
   ========================================================================= */

function Connector({ vertical = false }: { vertical?: boolean }) {
  const p = vertical ? cubic([20, 0], [20, 48], 'y') : cubic([0, 20], [64, 20], 'x');
  return (
    <svg
      viewBox={vertical ? '0 0 40 48' : '0 0 64 40'}
      aria-hidden="true"
      className={vertical ? 'h-[48px] w-[40px]' : 'h-[40px] w-[64px]'}
      fill="none"
    >
      <path d={cubicPath(p)} className="stroke-ink/35 stroke-[1.5]" />
      <circle cx={p[0][0]} cy={p[0][1]} r="3" className="fill-ground stroke-accent-bright stroke-[1.5]" />
      <circle cx={p[3][0]} cy={p[3][1]} r="3" className="fill-accent-bright" />
    </svg>
  );
}

export default function ProcessDiagram({ locale }: { locale: Locale }) {
  const { ENGAGEMENT } = home(locale);
  const t = tr(locale);
  return (
    <div className="flex w-full flex-col items-stretch gap-0 mobile:items-center">
      <ol className="grid w-full grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-[12px] mobile:flex mobile:flex-col mobile:items-center mobile:gap-0">
        {ENGAGEMENT.cards.map((c, i) => (
          <li key={c.n} className="contents">
            {i > 0 ? (
              <span className="flex self-center justify-self-center pt-[36px] mobile:pt-0" aria-hidden="true">
                <span className="mobile:hidden">
                  <Connector />
                </span>
                <span className="hidden mobile:block">
                  <Connector vertical />
                </span>
              </span>
            ) : null}
            <InView step={i} className="flex w-full flex-col gap-[16px]">
              <div
                className={`card-24 flex flex-col gap-[12px] p-[24px] ${
                  i === 0 ? 'bg-raised-2 outline outline-1 outline-accent-bright' : ''
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className="t-mono-11 tabular-nums text-ink-2">{c.n}</span>
                  {i === 0 ? <span className="t-tag text-accent-bright">{t('THE ONE WAY IN')}</span> : null}
                </span>
                <h3 className="t-card text-ink">{c.title}</h3>
                <p className="t-caption text-ink-2">{c.note}</p>
              </div>
              <ul className="flex flex-col divide-y divide-rule border-y border-rule px-[8px]">
                {c.points.map((p) => (
                  <li key={p} className="flex items-start gap-[10px] py-[10px]">
                    <span className="mt-[7px] flex-none text-accent-bright" aria-hidden="true">
                      <Chevron />
                    </span>
                    <span className="t-caption text-ink-2">{p}</span>
                  </li>
                ))}
              </ul>
              <p className="t-caption px-[8px] text-ink">
                <span className="t-mono text-ink-3">{t('YOU RECEIVE')} </span>
                {c.output}
              </p>
            </InView>
          </li>
        ))}
      </ol>
    </div>
  );
}
