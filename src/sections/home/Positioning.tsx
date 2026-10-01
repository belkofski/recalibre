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
   not counts: the reader sees what the firm carries without a number. The
   words inside each name are held together (28 September 2026), so a line
   breaks only at a ' · ' and never inside a name ('Enterprise systems /
   and integration' at 1440 and 1024). Done here, not in the content.

   NO MARKED WORD (28 September 2026): the page marks one word, the hero's.
   The heading and the index lines are 100% and 60% ink; 50% is 3.8:1 on
   the white panel, under the 4.5 small text needs.

   A WHITE PANEL (the owner's decision, 26 September 2026): `theme-light
   band-light`, see globals.css, THE WHITE PANELS. The panel sets the
   padding above and below the content, so the section no longer pads its
   own top. Work, below, pads its own top, and that is the black gap.
   ========================================================================= */

/** A title list as one line: full stops dropped, the words of each name
 *  joined by no-break spaces, the names joined with a middle dot. The dot
 *  is held to the name before it by a no-break space and followed by a
 *  plain one (29 September 2026), so a line can end on a dot but never
 *  start with one. */
const indexLine = (titles: readonly { title: string }[]) =>
  titles.map((t) => t.title.replace(/\.$/, '').replace(/ /g, '\u00a0')).join('\u00a0· ');

export default function Positioning() {
  return (
    <section className="theme-light band-light pad-x relative flex w-full flex-col items-center overflow-clip">
      <div className="shell grid w-full grid-cols-2 narrow:grid-cols-1 narrow:gap-(--space-row)">
        <div className="w-[600px] max-w-full pr-[50px] narrow:w-full narrow:pr-0">
          <Rise as="h2" lines={ABOUT.headline} className="t-display text-ink" />
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
            <p className="t-caption text-balance text-ink-2">{indexLine(CAPABILITIES.rows)}</p>
            <p className="t-caption text-balance text-ink-2">{indexLine(ENGAGEMENT.cards)}</p>
          </InView>
        </div>
      </div>
    </section>
  );
}
