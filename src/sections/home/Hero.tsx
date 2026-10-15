import { ArtImg } from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { Btn, MonoLink } from '@/components/ui';
import { HERO, ENGAGEMENT } from '@/content/home';

/* ============================================================================
   THE HERO — the reference's bordered, image-led composition, cleared.

   One slab of #101010 carrying the photograph edge to edge, with a
   30px-radius panel laid over it. The panel lays no wash over the picture:
   its 12% black layer moved into the picture file on 25 September 2026 and
   came off altogether with the owner's brighter hero of 26 September 2026
   (scripts/plates.py). Inside the panel: the eyebrow, the headline over the
   media, the lede, and the button pair. Nothing else.

   WHAT CAME OFF, on the owner's Phase A brief of 27 September 2026: the
   70px technical rail with its barcode and the rotated location, the three
   window dots at the top right, the dot field, and the statement plate at
   the foot — the card that quoted the firm to itself beside the founder's
   portrait, under a '/ / RECALIBRE' stamp and a second wordmark. All of it
   was the template's furniture in the template's positions; none of it
   said anything the headline does not. What is left on the first screen is
   the room, the words and the one action.

   THE HEIGHT. 90svh on a laptop, floored at 640px, rather than the full
   viewport: the top of the next section shows under the panel, so the
   first screen reads as the start of a page rather than a box the reader
   is held in. ON A PHONE (below 600) the panel is floored at 1060px: the
   phone plate puts the television's top edge at 0.70 of the panel
   (scripts/plates.py, the tall plate), and the words end about 722px down
   at 320 (695 at 390) with the two sentences under the button: 722 / 0.70
   is 1031. It was 960 until 28 September 2026, when the two sentences
   took `.t-body` and the 8px grid and their last lines reached the set;
   the set is the reward under the words, never behind them. The plate is
   published at its native size (1198 x 1630) for the taller panel, and
   `sizesTall` asks for the 1080 variant, so the phone draws it sharper
   than the 960 panel did. From 600 to 809 the frame and the column are
   the tablet's, floored at 940 for the same reason (636 / 0.70 at 600).

   THE FRAME (Phase B, 28 September 2026): 80 above the panel and 32 under
   it (72 and 24 on a phone, below 600), on the 8px grid under the 56px bar.

   THE ENTRANCE, one gesture: the photograph is already in place beneath
   the curtain (lib/curtain.ts waits for it to decode); the headline rises
   as the curtain clears, the lede fades up 200ms after it and the buttons
   350ms after it. The photograph does not settle as the pictures below
   the fold do (28 September 2026): the curtain is its entrance. The lede
   no longer churns through random letters after it was already readable
   (the letter churn was deleted with the rest of the site's decoration on
   28 September 2026).

   THE ONE MARKED WORD on Home is the headline's 'operations'
   (`HERO.mark`); no other heading on the page carries one.

   Nothing here is invented. The eyebrow carries the two facts that are on
   record — how many capabilities and how they are carried — and the lede is
   the founder's own sentence.
   ========================================================================= */

export default function Hero() {
  return (
    <section className="pad-x relative flex h-[90svh] min-h-[640px] w-full flex-col items-center justify-center overflow-clip bg-raised pb-[32px] pt-[80px] phone:h-auto phone:pb-[24px] phone:pt-[72px] phone:min-h-[max(100svh,1060px)] mid:min-h-[max(90svh,940px)]">
      {/* The photograph, inset 4px and rounded, exactly as the reference
          lays it — it is wider than the panel, so the panel reads as laid
          over a picture rather than a picture inside a box.

          IT PUBLISHES AT FULL STRENGTH. The reference renders every image on
          its homepage at `opacity: 1` and `filter: none`, and carries one
          gradient overlay on the entire page. Ours was at 0.72 behind a
          70%-black gradient, over a plate whose brightest pixel was 116 of
          255 — three separate reductions stacked on one picture, which is
          why the hero read as a black field rather than as a room. The
          darkening the type needs is now graded into the plate itself (see
          scripts/plates.py: the falloffs and the window's shade). The 12%
          the panel below used to lay over it is gone, from the page and
          from the file, so what is left here is the picture. */}
      <div className="absolute inset-x-[4px] bottom-[4px] top-0 overflow-clip rounded-[30px] bg-raised mobile:rounded-[20px]">
        {/* The phone gets a portrait crop of the same room rather than a
            wide picture squeezed into a tall box — and only that crop. These
            were two images with one hidden by CSS, and a hidden image still
            downloads: ~100 KB on every first visit for a picture nobody
            saw. One <picture> now; see ArtImg in lib/Img.tsx. */}
        <ArtImg
          src={HERO.media}
          srcTall={HERO.mediaTall}
          alt={HERO.mediaAlt}
          /* Below 600 the upright panel is narrower than the plate, so the
             plate covers it by height and is drawn about 780 wide whatever
             the window; asking for the window's width fetched the 828
             variant for 1560 device pixels. */
          sizesTall="(max-width: 599.98px) 540px, 100vw"
          className="media-fill"
        />
        {/* NO RUNTIME VEIL OVER THE PHOTOGRAPH. The film this picture needs is
            baked into the plate (scripts/plates.py, `filmgrain`), because the
            layer that used to sit here was mid-grey at 0.245 and lifted the
            hero's shadows from 20 to 57 — it undid the grade in the file. The
            reference's own pictures carry their grain in the file and its
            strip measures 20. Ours measured the same on the frame before
            the re-cut (see scripts/plates.py). */}
      </div>

      <div className="shell relative flex w-full flex-1 rounded-[30px] mobile:rounded-[20px]">
        {/* The content column. It used to sit right of a 70px rail; the rail
            is gone, so the words start 50px in from the panel's edge. */}
        <div className="flex min-w-0 flex-1 flex-col justify-between p-[50px] phone:p-[20px] phone:pb-[120px]">
          <div className="flex flex-col gap-[40px] phone:gap-[32px] phone:pt-[32px]">
            <div className="flex flex-col gap-[40px] phone:gap-[24px]">
              {/* `fit-head` opens the query container that `.t-hero` measures
                  itself against — see globals.css. */}
              <div className="fit-head flex flex-col gap-[16px]">
                <p className="t-mono-11 text-ink-2">{HERO.eyebrow}</p>
                <Rise as="h1" lines={HERO.headline} className="t-hero max-w-[1210px] text-ink" mark={HERO.mark} />
              </div>
              {/* THE LEDE AND THE ACTIONS KEEP TO THE WALL. From 810px up,
                  `.hero-wall` (globals.css) holds them to the band of picture
                  left of the television, so nothing under the headline ever
                  reaches the set; 540px is still the lede's ceiling. The
                  button row wraps where the wall is narrower than the pair,
                  the link dropping under the button, 24px below it. */}
              <InView delay={200}>
                <p className="hero-wall t-body max-w-[540px] text-ink-2">{HERO.lede}</p>
              </InView>
            </div>

            <InView
              delay={350}
              className="hero-wall flex flex-row flex-wrap items-center gap-x-[40px] gap-y-[24px] phone:flex-col phone:items-start phone:gap-[24px]"
            >
              <Btn href={HERO.ctaPrimary.href} label={HERO.ctaPrimary.label} />
              <MonoLink href={HERO.ctaSecondary.href} lead="SEE" label={HERO.ctaSecondary.label} />
              {/* WHAT THE BUTTON ASKS FOR, in the two sentences the Stage One
                  card already prints (content/home.ts, ENGAGEMENT): the
                  owner's decision of 28 September 2026. A jargon word asked
                  for on the first screen and defined 8,000px lower read as
                  pressure; these two lines make the promise checkable where
                  it is made. Sentence case at `.t-body`, 60% white (28
                  September 2026; the inline 15px is gone) — never the mono
                  label style. */}
              <p className="hero-wall t-body w-full text-ink-2">
                {ENGAGEMENT.cards[0].scope}.
                <br />
                {ENGAGEMENT.cards[0].output}.
              </p>
            </InView>
          </div>
        </div>
      </div>
    </section>
  );
}
