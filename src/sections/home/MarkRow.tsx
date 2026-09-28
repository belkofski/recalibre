import { LabelRow } from '@/components/ui';
import { MARKS } from '@/content/site';
import { BAND } from '@/content/home';

/* ============================================================================
   THE PARTNER ROW.

   The reference closes its hero slab with a label row and a marquee of
   client logos in circular wells. The label row is kept. The marquee is
   not (the Creative Director audit of 27 September 2026, P0-8, under the
   owner's Phase A brief): a logo wall is a template slot built for twelve
   marks or more, and run with five it repeated the set three times over,
   put the same partner on screen twice at once, faded them at both ends
   beside a PAUSE LOGOS control, and moved without being asked. Five
   partners are five, in one still row, each once, and nothing moves.

   THE FIVE ARE NAMES, IN ONE STYLE, UNTIL THE LOGO FILES ARRIVE. Three of
   the five marks on file are logos (Belkofski, Dorwa, Hostino) and two are
   the companies' names typed in the site's own face (ABP Continental,
   Saidis), and typed names beside real logos read as placeholders for
   logos that never came. The brief says design honestly around the gap
   (section 41): all five print as names in one style, at 85% white, so
   nothing here can be mistaken for a mock logo. When the two files come,
   the row takes five logos in one monochrome treatment at one cap height;
   the mark files stay in public/img and content/site.ts for that day.
   Alphabetical order, so the order claims nothing.

   Laptops: five across the shell, 276px a cell. Tablets: three over two.
   Phones: the names run on as a centred line and wrap where they must.
   The band's top is 32 since 28 September 2026 (30 was off the 8px grid);
   Phase C replaces the row itself with the register.
   ========================================================================= */

export default function MarkRow() {
  return (
    <section
      aria-label="Partners"
      className="pad-x relative flex w-full flex-col items-center overflow-clip rounded-b-[30px] bg-raised pb-[40px] pt-[32px] mobile:rounded-b-[20px] mobile:pb-[32px] mobile:pt-[20px]"
    >
      <div className="shell flex w-full flex-col gap-[40px] mobile:gap-[32px]">
        <LabelRow label={BAND.label} />
        <ul className="flex w-full flex-wrap items-center justify-center gap-y-[24px] mobile:gap-x-[28px] mobile:gap-y-[16px]">
          {MARKS.map((m) => (
            <li key={m.name} className="flex w-1/5 items-center justify-center narrow:w-1/3 mobile:w-auto">
              <span className="t-partner whitespace-nowrap text-ink/85">{m.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
