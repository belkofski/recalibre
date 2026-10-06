import type { CSSProperties } from 'react';
import { InView } from '@/lib/motion';
import { LabelRow, MonoLink } from '@/components/ui';
import { MARKS } from '@/content/site';
import { BAND } from '@/content/home';
import { INITIATIVES } from '@/content/work';

/* ============================================================================
   THE PARTNER REGISTER (Phase C, 28 September 2026).

   The reference closes its hero slab with a label row and a marquee of
   client logos. The marquee went on 27 September 2026 (P0-8: five marks
   run three times over, moving without being asked), and the typed-names
   row that held the place went on 28 September 2026 for this: A, the
   register, judged unanimously over a five-cell logo strip
   (scratch/C-register.json; the strip is pictured for Fadi as the
   alternative).

   ONE ROW PER PARTNER, EVERY NAME TYPED THE SAME. The name, the partner's
   own mark where a logo file exists, the relationship and, on the two
   partners whose work is on the site, SEE THE WORK. ABP Continental and
   Saidis have no logo file on the site (their files were their names typed
   out), so MARKS gives them no `src` and their mark cells stay empty: no
   placeholder. Alphabetical, as MARKS is, so the order
   claims nothing. No index number: it would count site content.

   THE CONTEXT LINE is the case's own first sentence, read from
   content/work.ts at build time and never retyped. It opens under the row
   on hover (after 120ms, so a pointer passing through opens nothing; it
   closes in 200ms at once) and at once on keyboard focus. On a phone, and
   on any screen without hover, it is always shown. The row itself is not
   a link and has no pointer cursor: only SEE THE WORK goes anywhere.

   THE MARKS are the files in public/img, drawn through `mask-image` in the
   text colour at 70% (100% on the row's hover), each cropped to its own
   ink. They are sized to the same area as Belkofski's wordmark at 22px
   ink height, then held to 30px tall, and sit at the right of their cell,
   24px in. Hostino's house sits 2px low so its middle is on the row's.

   Rows are 64px on a laptop and a tablet (21 + 22 + 20 + the 1px
   hairline) and 56px on a phone, where the relationship drops under the
   name; the two case rows grow with their line. On the laptop and the
   tablet the row is padded 16px on the left, so the 1px light-blue rule
   that marks the row under the pointer never touches the name.

   THE NAME IS SET AT FULL INK. The mockup set it at 80%; the site's text
   has three tints only (100 / 60 / 50, the colour roles of 28 September
   2026), and the name must stay brighter than the 70% marks beside it.

   The band sits on the numeric scale since the owner's audit (6 October
   2026): one token above the label (`--space-5`, 32), the row rhythm
   between the label and the list (40 / 40 / 24) and `--space-6` (48)
   under the list, where the white panel's black begins. The label row
   draws its own rule as it arrives (LabelRow), and each row of the
   register is its own reveal, 90ms after the one above it and never more
   than 270ms after the first, so five names arrive as a register being
   filled rather than as one block.
   ========================================================================= */

/** The two words the relationship column prints, and the link's label:
 *  the run prompt's own words (§3.8). */
const PARTNER = 'PARTNER';
const CLIENT = 'CLIENT';
const SEE_THE_WORK = 'SEE THE WORK';

/**
 * Each logo file's own ink, measured from the file (scratch/register,
 * mark-geo.json), at its drawn size: `w` x `h` is the box on the page,
 * `size` and `pos` place the whole file behind it so only the ink shows.
 * Belkofski's wordmark sits inside a wider SVG canvas; Dorwa's and
 * Hostino's files are their ink. A file not listed here is not a logo (the
 * typed names), and its cell stays empty.
 */
const MARK_GEOMETRY: Record<string, { w: number; h: number; size: string; pos: string; nudge?: boolean }> = {
  '/img/partner-belkofski.svg': { w: 162.43, h: 22, size: '285.71px 66.07px', pos: '-61.57px -22px' },
  '/img/partner-dorwa.png': { w: 65.29, h: 30, size: '65.29px 30px', pos: '0 0' },
  '/img/partner-hostino.png': { w: 96.59, h: 30, size: '96.59px 30px', pos: '0 0', nudge: true },
};

/** The first sentence of a case's summary, exactly as written there. */
const firstSentence = (s: string) => {
  const end = s.indexOf('. ');
  return end === -1 ? s : s.slice(0, end + 1);
};

function Mark({ src }: { src: string | null }) {
  const g = src ? MARK_GEOMETRY[src] : undefined;
  if (!src || !g) return null;
  const image = `url(${src})`;
  const style: CSSProperties = {
    width: g.w,
    height: g.h,
    maskImage: image,
    WebkitMaskImage: image,
    maskSize: g.size,
    WebkitMaskSize: g.size,
    maskPosition: g.pos,
    WebkitMaskPosition: g.pos,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  };
  return (
    <span
      aria-hidden="true"
      className={`block flex-none bg-current forced-colors:bg-[CanvasText] ${g.nudge ? 'translate-y-[2px]' : ''}`}
      style={style}
    />
  );
}

export default function MarkRow() {
  const rows = MARKS.map((m) => {
    const work = INITIATIVES.find((w) => w.name === m.name);
    return {
      name: m.name,
      src: 'src' in m ? m.src : null,
      relation: work?.status.startsWith(CLIENT) ? `${PARTNER} · ${CLIENT}` : PARTNER,
      work: work ? { href: `/work/${work.slug}`, line: firstSentence(work.summary) } : null,
    };
  });

  return (
    <section
      aria-label="Partners"
      className="pad-x relative flex w-full flex-col items-center overflow-clip rounded-b-[30px] bg-raised pb-(--space-6) pt-(--space-5) mobile:rounded-b-[20px]"
    >
      <div className="shell flex w-full flex-col gap-(--space-row)">
        <LabelRow label={BAND.label} />
        <ul className="w-full border-t border-rule">
          {rows.map((r, i) => (
            <InView
              as="li"
              key={r.name}
              step={Math.min(i, 3)}
              className="group/row relative grid grid-cols-[minmax(0,1fr)_200px_280px] items-start border-b border-rule pb-[20px] pl-[16px] pt-[21px] [grid-template-areas:'name_mark_rel'_'ctx_ctx_.'] before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-accent-bright before:opacity-0 before:transition-opacity before:duration-300 before:ease-hover hover:before:opacity-100 focus-within:before:opacity-100 tablet:grid-cols-[minmax(0,1fr)_200px_240px] mobile:grid-cols-[minmax(0,1fr)] mobile:pb-[5px] mobile:pl-0 mobile:pt-[6px] mobile:[grid-template-areas:'name'_'ctx'_'rel'] mobile:before:hidden"
            >
              <span className="text-[22px] font-medium leading-[22px] tracking-[-0.02em] text-ink [grid-area:name] whitespace-nowrap mobile:whitespace-normal">
                {r.name}
              </span>

              {r.work ? (
                /* Closed at 0fr; the delay is on the way in only, so the
                   line never opens under a pointer passing through. */
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] delay-0 duration-200 ease-hover [grid-area:ctx] group-focus-within/row:grid-rows-[1fr] group-focus-within/row:duration-300 group-hover/row:grid-rows-[1fr] group-hover/row:delay-[120ms] group-hover/row:duration-300 mobile:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
                  <div className="min-h-0 overflow-hidden">
                    <p className="text-[15px] font-normal leading-[24px] tracking-[-0.01em] text-ink-2 mobile:leading-[20px]">
                      {r.work.line}
                    </p>
                  </div>
                </div>
              ) : null}

              <span className="flex h-[22px] items-center justify-end pr-[24px] text-ink/70 transition-colors duration-300 ease-hover [grid-area:mark] group-focus-within/row:text-ink group-hover/row:text-ink mobile:hidden">
                <Mark src={r.src} />
              </span>

              <div className="flex h-[22px] items-center justify-between gap-[16px] [grid-area:rel] mobile:mt-[2px] mobile:h-[20px] mobile:justify-start">
                <span className="t-mono text-ink-3 transition-colors duration-300 ease-hover group-focus-within/row:text-ink group-hover/row:text-ink">
                  {r.relation}
                </span>
                {r.work ? (
                  /* 44px tall to the finger on a phone too: the line is 20px
                     there, and an invisible layer takes the target 12px
                     above and below it and 8px to each side. */
                  <MonoLink
                    href={r.work.href}
                    label={SEE_THE_WORK}
                    ariaLabel={`${SEE_THE_WORK}: ${r.name}`}
                    className="mobile:relative mobile:z-[1] mobile:h-[20px] mobile:min-h-0 mobile:after:absolute mobile:after:-inset-x-[8px] mobile:after:-inset-y-[12px]"
                  />
                ) : null}
              </div>
            </InView>
          ))}
        </ul>
      </div>
    </section>
  );
}
