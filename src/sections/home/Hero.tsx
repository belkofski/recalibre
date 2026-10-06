import { ArtImg } from '@/lib/Img';
import { Rise, InView, Parallax } from '@/lib/motion';
import { Btn, MonoLink } from '@/components/ui';
import { HERO } from '@/content/home';

/* ============================================================================
   THE HERO — the reference's bordered, image-led composition, cleared.

   One slab of #101010 carrying the photograph edge to edge, with a
   30px-radius panel laid over it. The panel lays no wash over the picture:
   its 12% black layer moved into the picture file on 25 September 2026 and
   came off altogether with the owner's brighter hero of 26 September 2026
   (scripts/plates.py). Inside the panel: the eyebrow, the headline over the
   media, the one sentence of what the firm does, the button pair and the
   proof line. Nothing else.

   WHAT CAME OFF, on the owner's Phase A brief of 27 September 2026: the
   70px technical rail with its barcode and the rotated location, the three
   window dots at the top right, the dot field, and the statement plate at
   the foot — the card that quoted the firm to itself beside the founder's
   portrait, under a '/ / RECALIBRE' stamp and a second wordmark. All of it
   was the template's furniture in the template's positions; none of it
   said anything the headline does not. What is left on the first screen is
   the room, the words and the one action.

   WHAT CHANGED ON THE OWNER'S AUDIT (6 October 2026). The words under the
   headline answer his two questions in his order — who it is for is the
   headline's own "your operations"; what we do for them is `HERO.sub`, at
   the lede size now rather than body, because it is the one sentence on the
   first screen that is not the headline. The two Calibration sentences
   that sat under the button since 28 September 2026 are the proof line
   now: the same three promises in three words each (`HERO.proof`), on one
   mono line, so the promise is still checkable where it is made and takes
   one line to check. The lede that named the reader (`HERO.lede`) is not
   printed here: About carries its sentence (ABOUT.bodyLead), and on a
   phone a third paragraph under the headline reached the set.

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
   The proof line is shorter than the two sentences it replaced, so the
   floors hold with room to spare.

   THE FRAME (Phase B, 28 September 2026): 80 above the panel and 32 under
   it (72 and 24 on a phone, below 600), on the 8px grid under the 56px bar.

   THE ENTRANCE, one gesture: the photograph is already in place beneath
   the curtain (lib/curtain.ts waits for it to decode — it is the one
   picture marked fetchpriority="high", which ArtImg sets by default); the
   headline rises word by word as the curtain clears, the sentence fades up
   200ms after it, the buttons 350ms after and the proof line 500ms after.
   Since the audit the picture settles too: it waits at 1.06 under the
   curtain and eases to 1 over 1.8s once the curtain is up (`.hero-settle`,
   globals.css), and from 1200 up it drifts with the scroll at 0.08 of the
   distance (`Parallax`), so the room is a room and not a backdrop. The
   drift's box is 6% taller than the clip, so no edge ever shows. On a
   phone and under reduced motion neither runs.

   THE SCROLL CUE, bottom left of the panel from 1200 up: the one word and
   a 32px hairline, static. It does not loop, pulse or bounce; it is a
   label, not an animation, and it is hidden from assistive technology
   because the page under it is the cue.

   THE ONE MARKED WORD on Home is the headline's 'operations'
   (`HERO.mark`); no other heading on the page carries one.

   Nothing here is invented. The eyebrow carries the two facts that are on
   record — how many capabilities and how they are carried — and every
   sentence is the founder's own.
   ========================================================================= */

/** The scroll cue's one word: a structural label, not a claim. */
const SCROLL = 'SCROLL';

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
        {/* Parallax is the clip box's direct child, measured off the box
            (lib/motion.tsx), and taller than it by 6% each way. The settle
            is its own layer inside, so the two transforms never compound
            on one element. */}
        <Parallax speed={0.08} className="absolute -inset-y-[6%] inset-x-0">
          <div className="hero-settle absolute inset-0">
            {/* The phone gets a portrait crop of the same room rather than
                a wide picture squeezed into a tall box — and only that
                crop. These were two images with one hidden by CSS, and a
                hidden image still downloads: ~100 KB on every first visit
                for a picture nobody saw. One <picture> now; see ArtImg in
                lib/Img.tsx. */}
            <ArtImg
              src={HERO.media}
              srcTall={HERO.mediaTall}
              alt={HERO.mediaAlt}
              /* Below 600 the upright panel is narrower than the plate, so
                 the plate covers it by height and is drawn about 780 wide
                 whatever the window; asking for the window's width fetched
                 the 828 variant for 1560 device pixels. */
              sizesTall="(max-width: 599.98px) 540px, 100vw"
              className="media-fill"
            />
          </div>
        </Parallax>
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
          <div className="flex flex-col gap-(--space-row) phone:pt-(--space-5)">
            <div className="flex flex-col gap-(--space-row)">
              {/* `fit-head` opens the query container that `.t-hero` measures
                  itself against — see globals.css. */}
              <div className="fit-head flex flex-col gap-(--space-3)">
                <p className="t-mono-11 text-ink-2">{HERO.eyebrow}</p>
                <Rise
                  as="h1"
                  by="word"
                  lines={HERO.headline}
                  className="t-hero max-w-[1210px] text-ink"
                  mark={HERO.mark}
                />
              </div>
              {/* THE SENTENCE AND THE ACTIONS KEEP TO THE WALL. From 810px
                  up, `.hero-wall` (globals.css) holds them to the band of
                  picture left of the television, so nothing under the
                  headline ever reaches the set; 560px is the sentence's
                  ceiling where the wall is wider than that. The button row
                  wraps where the wall is narrower than the pair, the link
                  dropping under the button. */}
              <InView delay={200}>
                <p className="hero-wall t-lede max-w-[560px] text-ink-2">{HERO.sub}</p>
              </InView>
            </div>

            <div className="flex flex-col gap-(--space-4)">
              <InView
                delay={350}
                className="hero-wall flex flex-row flex-wrap items-center gap-x-(--space-row) gap-y-(--space-4) phone:flex-col phone:items-start phone:gap-(--space-4)"
              >
                <Btn href={HERO.ctaPrimary.href} label={HERO.ctaPrimary.label} magnetic />
                <MonoLink href={HERO.ctaSecondary.href} lead={HERO.ctaSecondary.lead} label={HERO.ctaSecondary.label} />
              </InView>

              {/* THE PROOF LINE: the Calibration card's three promises, three
                  words each, parted by 6px dots in the strong hairline grey
                  (the status dot's size, never its blue: these are not
                  states). A list, so a screen reader counts three items
                  rather than reading one run-on line. */}
              <InView delay={500}>
                <ul className="hero-wall flex flex-wrap items-center gap-x-(--space-3) gap-y-(--space-1)">
                  {HERO.proof.map((item, i) => (
                    <li key={item} className="flex items-center gap-(--space-3)">
                      {i > 0 ? (
                        <span aria-hidden="true" className="block size-[6px] flex-none rounded-full bg-rule-strong" />
                      ) : null}
                      <span className="t-mono text-ink-2">{item}</span>
                    </li>
                  ))}
                </ul>
              </InView>
            </div>
          </div>

          {/* The scroll cue: a word and a hairline, at the foot of the
              column, from 1200 up only. Static by decision; see the head of
              this file. */}
          <div aria-hidden="true" className="narrow:hidden">
            <InView delay={700} className="hero-cue">
              <span className="hero-cue-line" />
              <span className="t-mono text-ink-3">{SCROLL}</span>
            </InView>
          </div>
        </div>
      </div>
    </section>
  );
}
