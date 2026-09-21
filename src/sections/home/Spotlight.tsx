import Img from '@/lib/Img';
import { InView } from '@/lib/motion';
import { Pill, Glyph, Barcode, DotGrid, MonoLink, Bars } from '@/components/ui';
import { SPOTLIGHT } from '@/content/home';
import { SITE } from '@/content/site';

/* ============================================================================
   THE SPOTLIGHT BENTO.

   The reference's featured case study: a 687px media card beside a 2×2 of
   343×470 cards, all on one seam plate at radius 25 with a 2px gap. Its
   four cards carry a challenge, a result percentage, a tool stack and a
   five-star review.

   Ours keeps all four and replaces two: the result becomes a count read out
   of the product's own code, and the review becomes a status. There is no
   rating, no client and no outcome anywhere in this block.
   ========================================================================= */

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="chip t-tag text-ink-2">{children}</span>;
}

export default function Spotlight() {
  const S = SPOTLIGHT;
  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <InView className="seam-sm shell grid w-full grid-cols-2 narrow:grid-cols-1">
        {/* The media card. */}
        <div className="card-24 relative flex min-h-[942px] flex-col justify-between overflow-clip p-[30px] narrow:min-h-[520px] mobile:p-[20px]">
          <Img
            src={S.media}
            alt={S.mediaAlt}
            sizes="(max-width: 1199px) 100vw, 687px"
            className="media-push media-push-sm"
          />
          <span className="grain grain-soft absolute inset-0" aria-hidden="true" />
          {/* The mark sits at the top of this card and the barcode at the
              bottom, so the picture is held down at both ends rather than
              washed flat across the middle, which is what was flattening it. */}
          <span
            className="absolute inset-x-0 top-0 h-[26%] bg-gradient-to-b from-ground/82 to-transparent"
            aria-hidden="true"
          />
          <span
            className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-ground/82 to-transparent"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-[8px]">
            <span className="flex items-center gap-[8px]">
              <Glyph className="[&>i]:bg-white" />
              <span className="t-mark text-ink">{SITE.name}</span>
            </span>
            <span className="t-mono text-ink-2">{S.meta}</span>
          </div>

          <div className="relative flex items-end justify-between">
            <DotGrid cols={9} rows={10} className="mobile:hidden" />
            <Barcode className="h-[13px] w-[118px]" />
          </div>
        </div>

        {/* The four cards. */}
        <div className="grid grid-cols-2 gap-[2px] mobile:grid-cols-1">
          <div className="card-24 flex min-h-[470px] flex-col justify-between p-[30px] pr-[50px] mobile:min-h-0 mobile:p-[20px]">
            <Tag>{S.challenge.label}</Tag>
            <p className="t-body-lg text-ink">
              {S.challenge.lead}
              <span className="text-ink-2">{S.challenge.rest}</span>
            </p>
          </div>

          <div className="card-24 flex min-h-[470px] flex-col justify-between p-[30px] mobile:min-h-0 mobile:p-[20px]">
            <Tag>{S.facts.label}</Tag>
            <div className="flex flex-col gap-[20px]">
              <div className="flex items-end gap-[14px]">
                <Bars total={6} lit={4} className="h-[54px]" />
                <span className="t-figure-2 text-ink">{S.facts.figure}</span>
                <span className="t-body pb-[10px] text-ink-2">{S.facts.unit}</span>
              </div>
              <p className="t-caption max-w-[200px] text-ink-2">{S.facts.caption}</p>
            </div>
          </div>

          <div className="card-24 flex min-h-[470px] flex-col justify-between p-[30px] mobile:min-h-0 mobile:p-[20px]">
            <Tag>{S.runsOn.label}</Tag>
            <div className="flex flex-col gap-[40px]">
              <p className="t-caption max-w-[240px] text-ink-2">{S.runsOn.note}</p>
              <div className="flex flex-wrap gap-[8px]">
                {S.runsOn.chips.map((c) => (
                  <Pill key={c}>{c}</Pill>
                ))}
              </div>
            </div>
          </div>

          <div className="card-24 flex min-h-[470px] flex-col justify-between p-[30px] mobile:min-h-0 mobile:p-[20px]">
            <div className="flex items-center justify-between gap-[10px]">
              <span className="pill t-tag border-lime/40 text-lime">{S.status.value}</span>
              <span className="t-mono-9 text-ink-3">{S.status.label}</span>
            </div>
            <div className="flex flex-col gap-[30px]">
              <p className="t-body-lg text-ink">
                {S.status.lead}
                <span className="text-ink-2">{S.status.rest}</span>
              </p>
              <MonoLink href={S.status.cta.href} label={S.status.cta.label} />
            </div>
          </div>
        </div>
      </InView>
    </section>
  );
}
