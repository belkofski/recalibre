import { Rise, InView } from '@/lib/motion';
import { LabelRow } from '@/components/ui';
import { PROCESS } from '@/content/home';

/* ============================================================================
   HOW WE WORK.

   The reference's staggered four-column grid: 345px columns, an 80px row
   gap, and the four steps laid on a diagonal with two pattern tiles set
   between them —
       row 1   [ 01 ] [ tile ] [ 02 ] [      ]
       row 2   [    ] [  03  ] [tile] [  04  ]
   The tiles are drawn, not photographed: a moiré of stroked ellipses, which
   is what the reference puts there.
   ========================================================================= */

function Tile({ variant }: { variant: 0 | 1 }) {
  const rings = Array.from({ length: 22 }, (_, i) => i);
  return (
    <div className="relative flex size-full items-center justify-center overflow-clip rounded-[24px] bg-white/[0.03]">
      <svg viewBox="0 0 242 200" className="absolute inset-0 size-full" aria-hidden="true">
        <g fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="0.8">
          {rings.map((i) =>
            variant === 0 ? (
              <ellipse key={i} cx="121" cy="100" rx={14 + i * 11} ry={9 + i * 7} transform={`rotate(${-24 + i * 1.1} 121 100)`} />
            ) : (
              <ellipse key={i} cx="121" cy="100" rx={200 - i * 8} ry={22 + i * 3} transform={`rotate(${-48 + i * 2.2} 121 100)`} />
            ),
          )}
        </g>
      </svg>
      <span className="relative flex size-[40px] items-center justify-center">
        <span className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(2, 12px)' }} aria-hidden="true">
          <i className="block size-[12px] bg-white" />
          <i className="block size-[12px] bg-white" style={{ gridColumn: 2, gridRow: 2 }} />
          <i className="block size-[12px] bg-white" style={{ gridColumn: 1, gridRow: 3 }} />
        </span>
      </span>
    </div>
  );
}

function Step({ step, delay }: { step: (typeof PROCESS.cards)[number]; delay: number }) {
  return (
    <InView delay={delay} className="flex flex-col gap-[30px]">
      <p className="t-mono-11 text-ink">{step.n}</p>
      <div className="flex flex-col gap-[16px]">
        <h3 className="t-card text-ink">
          {step.title.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </h3>
        <p className="t-small text-ink-2">{step.body}</p>
      </div>
    </InView>
  );
}

export default function Process() {
  const [a, b, c, d] = PROCESS.cards;
  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-[70px] mobile:gap-[40px]">
        <div className="flex w-full flex-col items-end gap-[70px] mobile:gap-[30px]">
          <LabelRow label={PROCESS.label} />
          <div className="flex w-[690px] narrow:w-full">
            <Rise as="h2" lines={PROCESS.headline} className="t-display text-ink" mark={PROCESS.mark} />
          </div>
        </div>

        <div className="grid w-full grid-cols-4 gap-x-0 gap-y-[80px] narrow:grid-cols-2 narrow:gap-[40px] mobile:grid-cols-1 mobile:gap-[36px]">
          <Step step={a} delay={0} />
          <div className="h-[200px] w-[242px] narrow:w-full">
            <Tile variant={0} />
          </div>
          <Step step={b} delay={90} />
          <div aria-hidden="true" className="narrow:hidden" />

          <div aria-hidden="true" className="narrow:hidden" />
          <Step step={c} delay={0} />
          <div className="h-[200px] w-[242px] narrow:w-full">
            <Tile variant={1} />
          </div>
          <Step step={d} delay={90} />
        </div>
      </div>
    </section>
  );
}
