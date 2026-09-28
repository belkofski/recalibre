import type { ReactNode } from 'react';
import { Rise, InView } from '@/lib/motion';

/**
 * The opener every inner route on the reference shares.
 *
 * It is not a banner. It is the homepage's own two-column split, run at the
 * top of the page: the heading held in the left half at display size with
 * its lines rising, and whatever the page needs — figures, filters, a lede,
 * a link — held in the right half. Its top is the 56px bar plus the
 * section token (28 September 2026): 176 / 160 / 136. Heading to lede is
 * `--space-lede`.
 */
export default function PageHead({
  lines,
  mark,
  lede,
  id = 'page-head',
  children,
  aside,
  wrap,
}: {
  lines: readonly string[];
  mark?: string;
  lede?: string;
  id?: string;
  /** Let the title wrap where it is not hand-broken to the column. */
  wrap?: boolean;
  children?: ReactNode;
  /** The right-hand column. The reference fills it differently per route. */
  aside?: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="pad-x relative flex w-full flex-col items-center overflow-clip pt-[176px] tablet:pt-[160px] mobile:pt-[136px]">
      <div className="shell grid w-full grid-cols-2 items-start gap-[40px] narrow:grid-cols-1">
        <div className="flex w-[600px] max-w-full flex-col gap-(--space-lede) pr-[50px] narrow:w-full narrow:pr-0">
          <Rise as="h1" id={id} lines={lines} wrap={wrap} className="t-display text-ink" mark={mark} />
          {lede ? (
            <InView>
              <p className="t-body max-w-[360px] text-ink-2">{lede}</p>
            </InView>
          ) : null}
          {children}
        </div>
        {aside ? <div className="flex flex-col gap-[40px]">{aside}</div> : null}
      </div>
    </section>
  );
}
