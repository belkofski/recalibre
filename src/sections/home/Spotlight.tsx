import { ArtImg } from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { Pill, FirmMark, MonoLink } from '@/components/ui';
import { SPOTLIGHT } from '@/content/home';
import { SITE } from '@/content/site';

/* ============================================================================
   THE OPS BLOCK.

   The reference's featured case study: a 687px media card beside a 2×2 of
   343×470 cards, all on one seam plate at radius 25 with a 2px gap. Its
   four cards carry a challenge, a result percentage, a tool stack and a
   five-star review.

   Ours keeps all four and replaces two: the result becomes one of the
   product's own facts in a word (no count: nothing on this page can check
   one), and the review becomes a status. There is no rating, no client and
   no outcome anywhere in this block.

   THE BLOCK HAS A HEAD (the Creative Director audit of 27 September 2026,
   P0-7, under the owner's Phase A brief). It was the one Home block
   without a headline, so the largest words in it were "Offline", a
   limitation, at 74px. It is headed like Work and Capabilities now: the
   eyebrow, "OPS." at display size and the product's one-sentence summary
   as the lede, in the 690px right column. "Offline" is a fact on a card
   again, at card size, with its caption under it.

   AND NO ORNAMENT. The dot grid, the barcode and the six dim bars were
   template decoration (the brief, section 26); they are gone, with the
   corner veil that held the barcode. The two fades stay: the picture is a
   pale screen, and the mark in the top-left corner needs them.
   ========================================================================= */

function Tag({ children }: { children: React.ReactNode }) {
  /* `w-fit`: the cards are flex columns, and a chip left to stretch ran the
     full width of its card. A tag is as wide as its word. */
  return <span className="chip t-tag w-fit text-ink-2">{children}</span>;
}

export default function Spotlight() {
  const S = SPOTLIGHT;
  return (
    <section className="pad-x pad-top mobile:pt-[40px] relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-[100px] mobile:gap-[40px]">
        <div className="flex w-full justify-end">
          <div className="flex w-[690px] flex-col gap-[30px] narrow:w-full">
            <div className="flex flex-col gap-[12px]">
              <InView>
                <p className="t-mono text-ink-2">{S.label}</p>
              </InView>
              <Rise as="h2" lines={S.headline} className="t-display text-ink" />
            </div>
            <InView>
              <p className="t-body max-w-[360px] text-ink-2">{S.lede}</p>
            </InView>
          </div>
        </div>

        <InView className="seam-sm grid w-full grid-cols-2 narrow:grid-cols-1">
          {/* The media card. */}
          <div className="card-24 relative flex min-h-[942px] flex-col overflow-clip p-[30px] narrow:min-h-[520px] mobile:p-[20px]">
            {/* MOUNTED FLAT (27 September 2026). The plate is cut at the card's
                own 687 x 942, so the 1.1x push only enlarged an interface that
                is already drawn above its native size and cut the panel's
                header off under the mark. A screen is drawn at 1:1.

                THE TABLET TAKES ITS OWN CUT (28 September 2026). Below 1200
                the card is one column, (viewport − 52) × 520, a landscape
                box; the portrait plate cover-cropped to it lost the "hors
                ligne" chip (rows 49–71 of the plate were outside the frame
                at 810–1199). The tablet range takes its own 1148 × 520 cut,
                anchored left so a narrower box loses the right of the list
                beside the panel, never the panel. The cut is asked for at
                its own width, not the window's: a 520px-tall cover box
                needs the whole 1148, and a viewport-width variant (828 at
                810) was being enlarged 1.39x to fill it. */}
            <ArtImg
              src={S.media}
              srcTall={S.mediaTablet}
              media="(min-width: 810px) and (max-width: 1199.98px)"
              alt={S.mediaAlt}
              sizes="(max-width: 809.98px) 100vw, 687px"
              sizesTall="1148px"
              lazy
              className="media-fill tablet:object-left"
            />
            {/* The mark sits at the top of this card, so the picture is held
                down at the top and the foot rather than washed flat across the
                middle. */}
            <span
              className="absolute inset-x-0 top-0 h-[26%] bg-gradient-to-b from-ground/82 to-transparent"
              aria-hidden="true"
            />
            <span
              className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-ground/82 to-transparent"
              aria-hidden="true"
            />
            {/* AND DARKER STILL JUST BEHIND THE MARK. On the pale screen the
                mark fell to about 3:1 under the fade alone. This patch sits
                inside the fade above, in the corner the mark is in, and leaves
                the rest of the picture as it is (the owner's "darken just
                behind the words", 25 September 2026). Below 1200 it runs the
                full width, as a deeper fade. See `.veil-ops-words` in
                globals.css. */}
            <span
              className="veil-ops-words absolute left-0 top-0 h-[min(170px,26%)] w-[480px] max-w-full tablet:w-full mobile:w-full"
              aria-hidden="true"
            />

            <div className="relative flex items-center gap-[8px]">
              <FirmMark className="text-white" />
              <span className="t-mark text-ink">{SITE.name}<span className="t-mark-r">{SITE.mark}</span></span>
            </div>
          </div>

          {/* The four cards. */}
          <div className="grid grid-cols-2 gap-[2px] mobile:grid-cols-1">
            <div className="card-24 flex min-h-[470px] flex-col justify-between gap-[24px] p-[30px] mobile:min-h-0 mobile:p-[20px]">
              <Tag>{S.challenge.label}</Tag>
              {/* The lead at the card's reading size; the rest a step down and
                  dimmed, on its own lines, so the statement is read once at
                  24px and argued at 16px rather than run ten lines deep at
                  one size on a 263px measure. */}
              <div className="flex flex-col gap-[14px] mobile:max-w-[420px]">
                <p className="t-body-lg text-ink">{S.challenge.lead}</p>
                <p className="t-body text-ink-2">{S.challenge.rest}</p>
              </div>
            </div>

            <div className="card-24 flex min-h-[470px] flex-col justify-between gap-[24px] p-[30px] mobile:min-h-0 mobile:p-[20px]">
              <Tag>{S.facts.label}</Tag>
              <div className="flex flex-col gap-[14px]">
                <p className="t-card text-ink">{S.facts.figure}</p>
                <p className="t-caption max-w-[240px] text-ink-2">{S.facts.caption}</p>
              </div>
            </div>

            <div className="card-24 flex min-h-[470px] flex-col justify-between gap-[24px] p-[30px] mobile:min-h-0 mobile:p-[20px]">
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

            <div className="card-24 flex min-h-[470px] flex-col justify-between gap-[24px] p-[30px] mobile:min-h-0 mobile:p-[20px]">
              <Tag>{S.status.label}</Tag>
              {/* The state is a pill in the body, in the accent, and the
                  caveat under it at note size: it is true and it stays, but
                  it no longer has the rank of the pitch. */}
              <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[14px]">
                  <span className="pill t-tag w-fit border-accent-bright/40 text-accent-bright">{S.status.value}</span>
                  <p className="t-mono text-ink-2">{S.status.note}</p>
                </div>
                <MonoLink href={S.status.cta.href} label={S.status.cta.label} />
              </div>
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
}
