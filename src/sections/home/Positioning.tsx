import { Rise, InView } from '@/lib/motion';
import { MonoLink } from '@/components/ui';
import { ABOUT } from '@/content/home';

/* ============================================================================
   THE FIRM.

   The reference's two-column split: a heading held in the left 690 and, in
   the right 690, a two-tone paragraph. The reference sets two performance
   counters over that paragraph; ours were two counts of the site's own
   content ("05 capabilities", "03 stages"), and the owner's Phase A brief
   of 27 September 2026 took them off. The paragraph stands alone now.

   A WHITE PANEL (the owner's decision, 26 September 2026): `theme-light
   band-light`, see globals.css, THE WHITE PANELS. The panel sets the
   padding above and below the content, so the section no longer pads its
   own top. Work, below, pads its own top, and that is the black gap.
   ========================================================================= */

export default function Positioning() {
  return (
    <section className="theme-light band-light pad-x relative flex w-full flex-col items-center overflow-clip">
      <div className="shell grid w-full grid-cols-2 narrow:grid-cols-1 narrow:gap-[40px]">
        <div className="w-[600px] max-w-full pr-[50px] narrow:w-full narrow:pr-0">
          <Rise as="h2" lines={ABOUT.headline} className="t-display text-ink" mark={ABOUT.mark} />
        </div>

        <div className="flex flex-col gap-[100px] mobile:gap-[40px]">
          <InView className="flex flex-col items-start gap-[40px]">
            <p className="t-lede max-w-[500px] text-ink">
              {ABOUT.bodyLead}
              <span className="text-ink-2">{ABOUT.bodyRest}</span>
            </p>
            <MonoLink href={ABOUT.cta.href} label={ABOUT.cta.label} />
          </InView>
        </div>
      </div>
    </section>
  );
}
