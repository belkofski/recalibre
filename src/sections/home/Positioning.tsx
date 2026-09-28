import { Rise, InView } from '@/lib/motion';
import { MonoLink } from '@/components/ui';
import { ABOUT, CAPABILITIES, ENGAGEMENT } from '@/content/home';

/* ============================================================================
   THE FIRM.

   The reference's two-column split: a heading held in the left column and,
   in the right, a two-tone paragraph. The reference sets two performance
   counters over that paragraph; ours were two counts of the site's own
   content ("05 capabilities", "03 stages"), and the owner's Phase A brief
   of 27 September 2026 took them off.

   TWO INDEX LINES INSTEAD (Phase B, 28 September 2026): under the paragraph
   and its link, the five capability names and the three stage names, read
   from CAPABILITIES and ENGAGEMENT with their full stops dropped. Names,
   not counts: the reader sees what the firm carries without a number.

   A WHITE PANEL (the owner's decision, 26 September 2026): `theme-light
   band-light`, see globals.css, THE WHITE PANELS. The panel sets the
   padding above and below the content, so the section no longer pads its
   own top. Work, below, pads its own top, and that is the black gap.
   ========================================================================= */

/** A title list as one line: full stops dropped, joined with a middle dot. */
const indexLine = (titles: readonly { title: string }[]) =>
  titles.map((t) => t.title.replace(/\.$/, '')).join(' · ');

export default function Positioning() {
  return (
    <section className="theme-light band-light pad-x relative flex w-full flex-col items-center overflow-clip">
      <div className="shell grid w-full grid-cols-2 narrow:grid-cols-1 narrow:gap-(--space-row)">
        <div className="w-[600px] max-w-full pr-[50px] narrow:w-full narrow:pr-0">
          <Rise as="h2" lines={ABOUT.headline} className="t-display text-ink" mark={ABOUT.mark} />
        </div>

        <div className="flex flex-col items-start gap-[24px]">
          <InView className="flex flex-col items-start gap-[40px]">
            <p className="t-lede max-w-[500px] text-ink">
              {ABOUT.bodyLead}
              <span className="text-ink-2">{ABOUT.bodyRest}</span>
            </p>
            <MonoLink href={ABOUT.cta.href} label={ABOUT.cta.label} />
          </InView>
          {/* 12px caption, sentence case, as the titles are written (28
              September 2026): in the 11px capitals they wrapped to three
              lines at 1440 and four at 390. */}
          <InView className="flex max-w-[500px] flex-col gap-[8px]">
            <p className="t-caption text-balance text-ink-3">{indexLine(CAPABILITIES.rows)}</p>
            <p className="t-caption text-balance text-ink-3">{indexLine(ENGAGEMENT.cards)}</p>
          </InView>
        </div>
      </div>
    </section>
  );
}
