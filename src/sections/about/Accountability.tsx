import Img from '@/lib/Img';
import { InView } from '@/lib/motion';
import { cardClass, SectionHead } from '@/components/ui';
import { ABOUT as A } from '@/content/about';

/* ============================================================================
   ACCOUNTABILITY — the people block, with one person in it.

   The reference runs four portraits, names and titles. Recalibre names
   nobody: the block says what the accountability consists of, which is
   checkable, and shows the founder's portrait with no name and no title
   (the owner's decision of 25 September 2026; see content/about.ts). The
   portrait is 240 wide, twice the home card's old slot, and its plate is
   cut at 480 for 2x screens. It is revealed from its foot upward (the clip
   tier) inside its own rounded frame, so the frame never grows.

   From a tablet up the portrait stands at the left and the statement
   beside it, at lede size: it is the block's one statement, not running
   text. On a phone there is no bare side, so the portrait follows the
   paragraph. The note under the statement is a sentence, so it is set as
   one (C10.1, 28 September 2026): the caption type in sentence case, on a
   hairline, with no label mark.
   ========================================================================= */
export default function Accountability() {
  return (
    <section aria-labelledby="lead-head" className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-alone)">
        <SectionHead id="lead-head" label={A.leadership.eyebrow} lines={A.leadership.heading} />

        <div className="grid w-full grid-cols-[240px_minmax(0,1fr)] items-start gap-x-(--space-8) gap-y-(--space-5) mobile:grid-cols-1">
          <InView mode="clip" className={`${cardClass({ radius: 24 })} w-[240px] max-w-full overflow-clip mobile:order-last`}>
            <div className="settle">
              <Img src={A.leadership.portrait} alt={A.leadership.portraitAlt} sizes="240px" className="block w-[240px]" />
            </div>
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
