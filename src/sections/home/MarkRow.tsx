import Img from '@/lib/Img';
import { LabelRow } from '@/components/ui';
import { MARKS, MARK_ROW } from '@/content/site';
import { BAND } from '@/content/home';

/* ============================================================================
   THE MARK BAND.

   The reference closes its hero slab with a label row and a marquee of
   client logos in circular wells. The slab, the row, the wells and the
   marquee are kept exactly; what changes is that the marks carry no
   relationship claim, and the two Recalibre owns are stamped.
   ========================================================================= */

function Well({ mark }: { mark: (typeof MARKS)[number] }) {
  return (
    <div className="relative mx-[10px] flex size-[150px] flex-none items-center justify-center rounded-full bg-white/[0.03] mobile:size-[110px]">
      <Img
        src={mark.src}
        alt={mark.name}
        sizes="150px"
        className="mark-white max-h-[30px] w-auto max-w-[92px] object-contain opacity-60 transition-opacity duration-300 mobile:max-h-[24px]"
      />
      {mark.ours ? (
        <span className="t-mono-9 absolute bottom-[22px] text-lime mobile:bottom-[14px]">{MARK_ROW.stamp}</span>
      ) : null}
    </div>
  );
}

export default function MarkRow() {
  const loop = [...MARKS, ...MARKS, ...MARKS];
  return (
    <section
      aria-label="Marks on the register"
      className="pad-x relative flex w-full flex-col items-center overflow-clip rounded-b-[30px] bg-raised pb-[60px] pt-[30px] tablet:pb-[36px] tablet:pt-[20px] mobile:rounded-b-[20px] mobile:pb-[20px] mobile:pt-[20px]"
    >
      <div className="shell flex w-full flex-col gap-[40px] mobile:gap-[24px]">
        <LabelRow label={BAND.label} right={BAND.right} />

        <div className="flex items-center mobile:flex-col mobile:gap-[24px]">
          <p className="t-lede w-[250px] flex-none text-ink narrow:w-[220px] mobile:w-full">{BAND.statement}</p>
          <div
            className="relative ml-[95px] flex-1 overflow-clip mobile:ml-0 mobile:w-full"
            style={{
              maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
              WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
            }}
          >
            <div className="marquee-track" style={{ animationDuration: '38s' }}>
              {loop.map((m, i) => (
                <Well key={`${m.name}-${i}`} mark={m} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
