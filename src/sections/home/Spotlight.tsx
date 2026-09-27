import Img from '@/lib/Img';
import { InView } from '@/lib/motion';
import { Pill, FirmMark, Barcode, DotGrid, MonoLink, Bars } from '@/components/ui';
import { SPOTLIGHT } from '@/content/home';
import { SITE } from '@/content/site';

/* ============================================================================
   THE SPOTLIGHT BENTO.

   The reference's featured case study: a 687px media card beside a 2×2 of
   343×470 cards, all on one seam plate at radius 25 with a 2px gap. Its
   four cards carry a challenge, a result percentage, a tool stack and a
   five-star review.

   Ours keeps all four and replaces two: the result becomes one of the
   product's own facts in a word (no count: nothing on this page can check
   one), and the review becomes a status. There is no rating, no client and
   no outcome anywhere in this block.
   ========================================================================= */

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="chip t-tag text-ink-2">{children}</span>;
}

export default function Spotlight() {
  const S = SPOTLIGHT;
  return (
    <section className="pad-x pad-top mobile:pt-[40px] relative flex w-full flex-col items-center overflow-clip">
      <InView className="seam-sm shell grid w-full grid-cols-2 narrow:grid-cols-1">
        {/* The media card. */}
        <div className="card-24 relative flex min-h-[942px] flex-col justify-between overflow-clip p-[30px] narrow:min-h-[520px] mobile:p-[20px]">
          {/* MOUNTED FLAT (27 September 2026). The plate is cut at the card's own
              687 x 942, so the 1.1x push only enlarged an interface that is
              already drawn above its native size and cut the panel's header
              off under the mark. A screen is drawn at 1:1. */}
          <Img
            src={S.media}
            alt={S.mediaAlt}
            sizes="(max-width: 1199px) 100vw, 687px"
            className="media-fill"
          />
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
          {/* AND DARKER STILL JUST BEHIND THE WORDS AND THE BARCODE. The
              picture has been published as shot since 25 September 2026,
              and on the pale screen the grey line under the mark fell to
              about 3:1, and under 2:1 on a tablet. These two patches sit
              inside the fades above, one in the corner the words are in
              and one round the barcode, and leave the rest of the picture
              as it is (the owner's "darken just behind the words", 25
              September 2026). Below 1200 both patches run the full width,
              as a deeper fade, which also covers the barcode where a phone
              moves it to the left edge. See `.veil-ops-words` in
              globals.css. */}
          <span
            className="veil-ops-words absolute left-0 top-0 h-[min(170px,26%)] w-[480px] max-w-full tablet:w-full mobile:w-full"
            aria-hidden="true"
          />
          <span
            className="veil-ops-code absolute bottom-0 right-0 h-[min(110px,30%)] w-[360px] max-w-full tablet:w-full mobile:w-full"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-[8px]">
            <span className="flex items-center gap-[8px]">
              <FirmMark className="text-white" />
              <span className="t-mark text-ink">{SITE.name}<span className="t-mark-r">{SITE.mark}</span></span>
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
            {/* `fit-fig` and `t-figure-fit` size the word to this card on
                laptops, where "Offline" at 74px is wider than the card
                between 1200 and about 1396 wide (see globals.css). */}
            <div className="fit-fig flex flex-col gap-[20px]">
              <div className="flex items-end gap-[14px]">
                {/* Every bar in the one dim tone, so the gauge is drawing
                    and not a score (the owner's decision of 25 September
                    2026). Four of six used to be lit, under WHAT IS BUILT,
                    and read as a share of the product finished. */}
                <Bars total={6} lit={0} className="h-[54px]" />
                <span className="t-figure-2 t-figure-fit text-ink">{S.facts.figure}</span>
                {/* The unit is drawn only where one is set: an empty span
                    still took its 14px gap, which is the difference between
                    "Offline" fitting the card at 1440 and not. */}
                {S.facts.unit ? <span className="t-body pb-[10px] text-ink-2">{S.facts.unit}</span> : null}
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
              <span className="pill t-tag border-accent-bright/40 text-accent-bright">{S.status.value}</span>
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
