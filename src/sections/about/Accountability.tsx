import Img from '@/lib/Img';
import { Rise, Scene } from '@/lib/motion';
import { Card, Orbs, type Orb } from '@/components/ui';
import { ABOUT as A } from '@/content/about';
import { split } from '@/sections/about/split';

/* ============================================================================
   ACCOUNTABILITY — the people block, with one person in it.

   The reference runs four portraits, names and titles. Recalibre names
   nobody: the block says what the accountability consists of and shows the
   founder's portrait with no name and no title (the owner's decision; see
   content/about.ts). The statement is the paragraph's first sentence, and
   the note under it is kept whole: it is the checkable part.

   THE PORTRAIT IS THE PAGE'S SMALL PICTURE, set against the room's large
   one: 288 wide on a dot-grid surface. It opens from its foot as the block
   rises into the window while the face settles from a slight zoom inside
   it; the words rise beside it. The block's light is its own set of orbs,
   both right of centre, so no glow crosses the face.
   ========================================================================= */

/** Both discs right of centre, away from the portrait at the left. */
const ACCOUNT_ORBS: readonly Orb[] = [
  { x: '86%', y: '30%', size: 640, color: 'deep', a: 0.14 },
  {
    x: '64%',
    y: '96%',
    size: 480,
    color: 'glow',
    a: 0.08,
    delay: -11,
    dur: 32,
  },
];

export default function Accountability() {
  const [statement] = split(A.leadership.body);
  return (
    <Scene
      as="section"
      end={0.75}
      aria-labelledby="lead-head"
      className="pad-x pad-top relative isolate flex w-full flex-col items-center overflow-clip"
    >
      <Orbs orbs={ACCOUNT_ORBS} />
      <div className="shell grid w-full grid-cols-[288px_minmax(0,1fr)] mid:grid-cols-[220px_minmax(0,1fr)] items-center gap-x-(--space-8) gap-y-(--space-5) mid:gap-x-(--space-6) phone:grid-cols-1">
        <Scene end={0.55} className="w-[288px] max-w-full mid:w-[220px] phone:order-last phone:w-[220px]">
          <div className="about-portrait sx-open">
            <Card radius={24} spot className="p-(--space-3)">
              <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />
              <span className="relative block overflow-clip rounded-[14px]">
                <span className="sx-zoom block">
                  <Img
                    src={A.leadership.portrait}
                    alt={A.leadership.portraitAlt}
                    sizes="(max-width: 599.98px) 196px, 256px"
                    className="block h-auto w-full"
                  />
                </span>
              </span>
            </Card>
          </div>
        </Scene>

        <div className="flex w-full max-w-[640px] flex-col gap-(--space-5)">
          <Rise as="h2" id="lead-head" lines={A.leadership.heading} className="t-section text-ink" />
          <div className="sx-rise flex flex-col gap-(--space-4)">
            <p className="t-lede text-ink">{statement}</p>
            <p className="t-caption border-t border-rule pt-(--space-3) text-ink-2">{A.leadership.note}</p>
          </div>
        </div>
      </div>
    </Scene>
  );
}
