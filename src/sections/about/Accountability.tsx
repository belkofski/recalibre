import Img from '@/lib/Img';
import { InView } from '@/lib/motion';
import { Card, Orbs, SectionHead, type Orb } from '@/components/ui';
import { ABOUT as A } from '@/content/about';

/* ============================================================================
   ACCOUNTABILITY — the people block, with one person in it.

   The reference runs four portraits, names and titles. Recalibre names
   nobody: the block says what the accountability consists of, which is
   checkable, and shows the founder's portrait with no name and no title
   (the owner's decision; see content/about.ts). The portrait is 240 wide,
   twice the home card's old slot, and its plate is cut at 480 for 2x
   screens.

   THE PORTRAIT IS AN OBJECT NOW: it stands on a dot-grid surface card a
   token inside its edge, revealed from its foot upward (the clip tier)
   with the picture settling inside; under the pointer the card lights and
   leans toward it, and the portrait leans the other way over the dots; on
   a phone it lights as it passes the centre of the screen. The block's
   light is its own set of orbs, both right of centre: the portrait stands
   at the left, and no glow crosses the face.

   From a tablet up the portrait stands at the left and the statement
   beside it, at lede size: it is the block's one statement, not running
   text. On a phone there is no bare side, so the portrait follows the
   paragraph. The note under the statement is a sentence, so it is set as
   one: the caption type in sentence case, on a hairline, with no label
   mark.
   ========================================================================= */

/** Both discs right of centre, away from the portrait at the left. */
const ACCOUNT_ORBS: readonly Orb[] = [
  { x: '86%', y: '30%', size: 640, color: 'deep', a: 0.14 },
  { x: '64%', y: '96%', size: 480, color: 'glow', a: 0.08, delay: -11, dur: 32 },
];

export default function Accountability() {
  return (
    <section
      aria-labelledby="lead-head"
      className="pad-x pad-top relative isolate flex w-full flex-col items-center overflow-clip"
    >
      <Orbs orbs={ACCOUNT_ORBS} />
      <div className="shell flex w-full flex-col gap-(--space-alone)">
        <SectionHead id="lead-head" label={A.leadership.eyebrow} lines={A.leadership.heading} />

        <div className="grid w-full grid-cols-[288px_minmax(0,1fr)] items-start gap-x-(--space-8) gap-y-(--space-5) mobile:grid-cols-1">
          {/* The tilt sits inside the reveal, never around it. The picture
              layer is the portrait's own box, clipped to its corners, so
              the lean shows the dots at its edge and nothing else. */}
          <InView mode="clip" className="w-[288px] max-w-full mobile:order-last">
            <Card radius={24} spot tilt className="p-(--space-4)">
              <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />
              <span className="tilt-layer relative block overflow-clip rounded-[14px]">
                <span className="settle block">
                  <Img
                    src={A.leadership.portrait}
                    alt={A.leadership.portraitAlt}
                    sizes="240px"
                    className="block w-[240px] max-w-full"
                  />
                </span>
              </span>
            </Card>
          </InView>

          <div className="flex w-full max-w-[640px] flex-col gap-(--space-5)">
            <InView>
              <p className="t-lede text-ink">{A.leadership.body}</p>
            </InView>
            <InView delay={120} className="border-t border-rule pt-(--space-3)">
              <p className="t-caption text-ink-2">{A.leadership.note}</p>
            </InView>
          </div>
        </div>
      </div>
    </section>
  );
}
