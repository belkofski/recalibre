import { BLOCKS } from '@/lib/blocks-content';
import Reveal from './Reveal';

/**
 * BLOCK D — "All Features in One" (reference 7.webp, 2000×1125, scale 0.72)
 * Site D: AgenAI. Background rgb(255,255,255), accent rgb(235,75,49).
 *
 *   headline   ink y20-69                        → 14.4 · centred
 *   card grid  three rows × two columns, a centre node between them
 *   left col   x~560-980                         → 403 · w 302
 *   right col  x~1465-1890                       → 1054 · w 306
 *   node       x~1125-1325 y~490-710             → 810 · 352 · 144 × 158
 *   connectors 1px rails from each column into the node, with a dot at the join
 *
 * 7.webp is cropped at the top — the heading's own top edge sits on the frame
 * edge, so the section's padding above it is not measured.
 *
 * The six card glyphs are bespoke icons in the reference; rounded dark plates
 * stand in at the measured box.
 */
export default function Features() {
  const B = BLOCKS.features;
  const left = B.cards.slice(0, 3);
  const right = B.cards.slice(3);

  const Card = ({ c }: { c: (typeof B.cards)[number] }) => (
    <div className="card-lift w-[302px] rounded-[18px] bg-paper p-[20px] shadow-[0_4px_16px_rgba(8,16,20,0.05)]">
      <span className="mb-[18px] flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-ink-3">
        <span className="block h-[14px] w-[14px] rounded-[3px] border-[1.4px] border-on-dark" />
      </span>
      <p className="text-[16.5px] leading-[22px] font-semibold whitespace-pre text-text">
        {c.title}
      </p>
      <div className="mt-[8px]">
        {c.body.map((l, i) => (
          <p key={i} className="text-[12.5px] leading-[17.5px] whitespace-pre text-text-3">
            {l}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <section className="flex w-full shrink-0 flex-col items-center overflow-clip bg-paper pt-[14px] pb-[70px]">
      <h2 className="text-[45px] leading-[56px] font-semibold tracking-[-0.8px] whitespace-pre text-text">
        {B.headline}
      </h2>

      <div className="relative mt-[62px] flex w-[1072px] items-center justify-between">
        <Reveal className="flex flex-col gap-[34px]">
          {left.map((c, i) => (
            <Card key={i} c={c} />
          ))}
        </Reveal>

        {/* connector rails + centre node */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute top-[86px] bottom-[86px] left-[322px] w-px bg-rule-on-light" />
          <div className="absolute top-[86px] bottom-[86px] right-[322px] w-px bg-rule-on-light" />
          <div className="absolute top-[86px] left-[302px] h-px w-[20px] bg-rule-on-light" />
          <div className="absolute bottom-[86px] left-[302px] h-px w-[20px] bg-rule-on-light" />
          <div className="absolute top-[86px] right-[302px] h-px w-[20px] bg-rule-on-light" />
          <div className="absolute right-[302px] bottom-[86px] h-px w-[20px] bg-rule-on-light" />
          <div className="absolute top-1/2 left-[322px] h-px w-[144px] -translate-y-1/2 bg-rule-on-light" />
          <div className="absolute top-1/2 right-[322px] h-px w-[144px] -translate-y-1/2 bg-rule-on-light" />
          <span className="absolute top-1/2 left-[318px] block h-[8px] w-[8px] -translate-y-1/2 rounded-full bg-accent" />
          <span className="absolute top-1/2 right-[318px] block h-[8px] w-[8px] -translate-y-1/2 rounded-full bg-accent" />
        </div>

        <div className="absolute top-1/2 left-1/2 flex h-[158px] w-[144px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[26px] bg-accent shadow-[0_10px_30px_var(--color-accent-tint)]">
          <svg viewBox="0 0 48 30" className="h-[34px] w-[54px]" aria-hidden="true">
            <circle cx="18" cy="15" r="13" fill="var(--color-on-dark)" fillOpacity="0.92" />
            <circle cx="30" cy="15" r="13" fill="var(--color-on-dark)" fillOpacity="0.92" />
          </svg>
          <span className="mt-[10px] text-[17px] leading-[22px] font-medium whitespace-pre text-on-dark">
            {B.hub}
          </span>
        </div>

        <Reveal className="flex flex-col gap-[34px]" startIndex={3}>
          {right.map((c, i) => (
            <Card key={i} c={c} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
