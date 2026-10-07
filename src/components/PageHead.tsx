import type { ReactNode } from 'react';
import { Rise, InView } from '@/lib/motion';
import { Orbs } from '@/components/ui';

/**
 * The opener every inner route on the reference shares.
 *
 * It is not a banner. It is the homepage's own two-column split, run at the
 * top of the page: the heading held in the left half at display size with
 * its words rising one after another, and whatever the page needs — figures,
 * filters, a lede, a link — held in the right half. Its top is the 56px bar
 * plus the section token (28 September 2026): 176 / 160 / 136. Heading to
 * lede is `--space-lede`.
 *
 * A LIT ROOM, NOT A HEADING ON BLACK (the direction change). The opener
 * carries the ambient light every major block carries now: the left-weighted
 * orb set behind the heading (`Orbs hero-left`, every disc kept left of
 * about 400px from 1200 up, so the light never crosses the aside), still
 * under reduced motion, and nothing with scripts off but the glow itself.
 * The section is its own stacking context so the orbs sit under the words
 * without the words needing a z-index. Work, About, Capabilities, Insights
 * and the legal pages inherit it; Contact and the 404 draw their own openers.
 */
export default function PageHead({
  lines,
  mark,
  lede,
  id = 'page-head',
  children,
  aside,
  wrap,
  orbs = true,
  by = 'word',
}: {
  lines: readonly string[];
  /** The one marked word of the page (C7, 28 September 2026): only
   *  About's "whole program." passes it; no other opener carries a mark. */
  mark?: string;
  lede?: string;
  id?: string;
  /** Let the title wrap where it is not hand-broken to the column. */
  wrap?: boolean;
  children?: ReactNode;
  /** The right-hand column. The reference fills it differently per route. */
  aside?: ReactNode;
  /** The ambient light behind the heading. On by default; a page whose
   *  opener sits on a photograph switches it off. */
  orbs?: boolean;
  /** How the heading rises: each word out of its own clip box (the
   *  default, the hero's way) or each authored line. */
  by?: 'line' | 'word';
}) {
  return (
    <section
      aria-labelledby={id}
      className="pad-x relative isolate flex w-full flex-col items-center overflow-clip pt-[calc(var(--bar)+var(--space-section))]"
    >
      {orbs ? <Orbs variant="hero-left" /> : null}
      <div className="shell grid w-full grid-cols-2 items-start gap-[40px] narrow:grid-cols-1">
        <div className="flex w-[600px] max-w-full flex-col gap-(--space-lede) pr-[50px] narrow:w-full narrow:pr-0">
          <Rise as="h1" id={id} lines={lines} wrap={wrap} by={by} className="t-display text-ink" mark={mark} />
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
