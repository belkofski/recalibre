import { Rise, InView } from '@/lib/motion';
import WorkCard from '@/components/WorkCard';
import { WORK, type Initiative } from '@/content/home';

/* ============================================================================
   SELECTED WORK.

   The reference runs six square CMS cards across a two-column seam plate at
   687px. Recalibre has three initiatives it may honestly show, so the plate,
   the 2px seam, the 30px card radius and the hover are kept exactly, and the
   third card takes the full width of the second row rather than leaving a
   slot empty or repeating a project to fill it.

   The card itself lives in components/WorkCard, because the work index
   renders the same three initiatives and the two grids had already drifted:
   this one was rebuilt to fill its frame and that one was not.
   ========================================================================= */

export default function Work() {
  const [a, b, c] = WORK.items as readonly [Initiative, Initiative, Initiative];
  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-[100px] mobile:gap-[40px]">
        <div className="flex w-full justify-end">
          <div className="flex w-[690px] flex-col gap-[30px] narrow:w-full">
            <Rise as="h2" lines={WORK.headline} className="t-display text-ink" />
            <InView>
              <p className="t-body max-w-[360px] text-ink-2">{WORK.lede}</p>
            </InView>
          </div>
        </div>

        <InView className="seam grid w-full grid-cols-2 mobile:grid-cols-1">
          <WorkCard item={a} />
          <WorkCard item={b} />
          <div className="col-span-2 mobile:col-span-1">
            <WorkCard item={c} wide />
          </div>
        </InView>
      </div>
    </section>
  );
}
