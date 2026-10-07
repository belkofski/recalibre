import { ArtImg } from '@/lib/Img';
import { Rise, InView, Parallax, Scene } from '@/lib/motion';
import { Btn, MonoLink, Orbs, type Orb } from '@/components/ui';
import { HERO } from '@/content/home';

/* ============================================================================
   THE HERO — the headline, the one sentence, the one action, and the room.

   TWO SHAPES, ONE PICTURE (home.css, THE HERO). Where the window is wide and
   lying down (from 1200, or from 1024 in landscape) the room fills the slab
   edge to edge and the words sit on its wall, left of the television, the
   headline sized to stop short of the glass sign (globals.css, `.t-hero`).
   Everywhere else (phones, upright tablets, a phone held sideways) the
   words stand on the dark ground with their own light, and the same room
   follows under them as a framed picture, cut so the chair, the screen and
   the sign all read. The tall phone cut is retired: it magnified the
   render's grain into a blue noise field.

   ONE FILE AT EVERY WIDTH: the frame changes shape, the picture does not,
   so there is one <img> and nothing downloads that is not shown.

   THE SCROLL. The section is a scene: as it leaves through the top, the
   picture steps back and dims (`.sx-recede`, on the frame's wrapper, never
   on the settle layer inside it) and the words rise out ahead of the page
   (`.sx-lift`, on the column, never on a reveal). From 1200 the picture
   also drifts inside its box (`Parallax`), and under the curtain it settles
   from 1.06 (`.hero-settle`). Under reduced motion all of it stands still.

   WHAT CAME OFF in the third pass: the eyebrow over the headline and the
   three proof chips under the button. The owner's note was that the site
   explains too much; the first screen keeps the headline, the sentence,
   the button and the way to the work.
   ========================================================================= */

/** The scroll cue's one word: a structural label, not a claim. */
const SCROLL = 'SCROLL';

/** The light on the dark ground, where the words stand alone: one deep
 *  disc behind the headline, one paler one at the right of the sentence. */
const HERO_ORBS_GROUND: readonly Orb[] = [
  { x: '18%', y: '22%', size: 480, color: 'deep', a: 0.24, dur: 30 },
  { x: '88%', y: '46%', size: 340, color: 'glow', a: 0.1, delay: -12, dur: 36 },
];

export default function Hero() {
  return (
    <Scene as="section" end={0.45} className="hero pad-x relative isolate flex w-full flex-col items-center overflow-clip bg-raised">
      {/* The ground's own light, drawn only where the words stand on the
          dark ground (the stacked shape); the wide shape lights the wall. */}
      <span aria-hidden="true" className="hero-ground-orbs absolute inset-0 overflow-clip">
        <Orbs orbs={HERO_ORBS_GROUND} />
      </span>

      <div className="hero-words shell relative flex w-full">
        {/* The column rises out as the hero leaves. It is a plain box: the
            reveals inside it own their own transforms. */}
        <div className="hero-col sx-lift flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex flex-col gap-(--space-row)">
            {/* `fit-head` opens the query container that `.t-hero` measures
                itself against — see globals.css. */}
            <div className="fit-head flex flex-col">
              <Rise
                as="h1"
                by="word"
                lines={HERO.headline}
                className="t-hero max-w-[1210px] text-ink"
                mark={HERO.mark}
              />
            </div>
            {/* In the wide shape the sentence and the actions keep to the
                wall left of the television (`.hero-wall`, globals.css). */}
            <InView delay={200}>
              <p className="hero-wall t-lede max-w-[560px] text-ink-2">{HERO.sub}</p>
            </InView>
            <InView
              delay={350}
              className="hero-wall flex flex-row flex-wrap items-center gap-x-(--space-row) gap-y-(--space-4) phone:flex-col phone:items-start phone:gap-(--space-3)"
            >
              <Btn href={HERO.ctaPrimary.href} label={HERO.ctaPrimary.label} magnetic />
              <MonoLink href={HERO.ctaSecondary.href} lead={HERO.ctaSecondary.lead} label={HERO.ctaSecondary.label} />
            </InView>
          </div>

          {/* The scroll cue, at the foot of the column in the wide shape
              from 1200 up only. Hidden from assistive technology: the page
              under it is the cue. */}
          <div aria-hidden="true" className="hero-cue-wrap narrow:hidden">
            <InView delay={700} className="hero-cue">
              <span className="pulse-line hero-cue-line" />
              <span className="t-mono text-ink-3">{SCROLL}</span>
            </InView>
          </div>
        </div>
      </div>

      {/* THE ROOM. The wrapper recedes with the scroll; the clip box inside
          it carries the ring (`hero-edge`) and is its own stacking context,
          so the light over the wall stays under the words. */}
      <div className="hero-room sx-recede">
        <div className="hero-edge hero-frame isolate overflow-clip bg-raised">
          {/* Parallax is the clip box's direct child, measured off the box
              and 6% taller each way so no edge shows; the settle is its own
              layer inside, so the two transforms never compound. */}
          <Parallax speed={0.08} className="absolute -inset-y-[6%] inset-x-0">
            <div className="hero-settle absolute inset-0">
              <ArtImg
                src={HERO.media}
                alt={HERO.mediaAlt}
                /* In the stacked shape the frame is narrower than the
                   picture it covers (4:3 on a phone, 16:10 above), so the
                   file is drawn wider than the window there. */
                sizes="(max-width: 599.98px) 135vw, (max-width: 1023.98px) 115vw, (max-width: 1199.98px) and (orientation: portrait) 115vw, 100vw"
                className="media-fill hero-img"
              />
            </div>
          </Parallax>
          {/* THE LIGHT ON THE WALL, wide shape only: composited in `screen`
              so the blue lifts the wall rather than tinting it, and kept
              left of the television by the preset. */}
          <span aria-hidden="true" className="hero-orbs absolute inset-0 isolate overflow-clip rounded-[inherit]">
            <Orbs variant="hero-left" />
          </span>
        </div>
      </div>
    </Scene>
  );
}
