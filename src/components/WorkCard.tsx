import Link from 'next/link';
import Img from '@/lib/Img';
import { Pill } from '@/components/ui';
import type { ImageSrc } from '@/lib/images.generated';

/* ============================================================================
   THE INITIATIVE CARD — one definition, used by the homepage grid and by the
   work index.

   It existed twice before, once in each place, and the two copies drifted:
   the homepage grid was rebuilt to fill its frame and the index was left
   with the earlier treatment, so the same three initiatives appeared as
   strong, full-bleed cards on one page and as pale screenshots floating in
   black fields on the next. The card is a single object now, and the only
   way the two grids can differ is if someone passes different props.

   ── THE CARD, AS THE REFERENCE BUILDS IT ──────────────────────────────────

   Radius 30, no inner padding, the picture rendered at about 1.22x the box
   that clips it and centre-cropped, the title at the bottom left, the tags
   at the bottom right. Nothing at the centre: the reference puts a client's
   logo there because its cards carry work belonging to someone else, and all
   three of these belong to Recalibre — a mark in that position would be
   either the same glyph three times or the card's own title printed twice.

   The status is a fact about the initiative, not a headline, so it takes a
   small plate in the top-left corner and states itself once, with a lime dot
   for finished work Recalibre owns and an orange one for work in progress.
   ========================================================================= */

export type WorkCardItem = {
  slug: string;
  name: string;
  status: string;
  /** The line under the title: year, category and state. */
  meta: string;
  tags: readonly string[];
  src: ImageSrc;
  alt: string;
  /** How dark the picture already is where the title sits. A light picture
   *  needs a deeper scrim than a dark one, and using one scrim for both is
   *  what makes a set of cards look unconsidered. */
  art: 'light' | 'dark';
  tone: 'owned' | 'dev';
  /** An optional line under the meta, on the index where there is room. */
  summary?: string;
};

export default function WorkCard({
  item,
  wide = false,
  showSummary = false,
}: {
  item: WorkCardItem;
  wide?: boolean;
  showSummary?: boolean;
}) {
  const light = item.art === 'light';
  return (
    <Link
      href={`/work/${item.slug}`}
      aria-label={`${item.name} — ${item.status}`}
      className={`card-30 group focus-ring relative block overflow-clip ${
        wide ? 'aspect-[2.93/1] mobile:aspect-[1.6/1]' : 'aspect-square'
      }`}
    >
      <Img
        src={item.src}
        alt={item.alt}
        sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 690px"
        /* The square cards take the reference's 1.22x overscale so the
           subject fills the frame. The wide card does not: its plate is
           already a wide crop of the same photograph, and overscaling a
           crop of a crop cut the Belkofski wordmark in half. */
        className={`media-zoom ${wide ? 'media-fill' : 'media-push'}`}
      />

      {/* The picture carries its own film; the plate only keeps the card
          continuous with the rest of the page. */}
      <span className="grain grain-soft absolute inset-0" aria-hidden="true" />

      <span
        className={`absolute inset-x-0 bottom-0 z-[1] ${
          light
            ? 'h-[62%] bg-gradient-to-t from-ground via-ground/88 to-transparent'
            : 'h-[48%] bg-gradient-to-t from-ground/92 via-ground/38 to-transparent'
        }`}
        aria-hidden="true"
      />
      {light ? (
        <span
          className="absolute inset-x-0 top-0 z-[1] h-[30%] bg-gradient-to-b from-ground/55 to-transparent"
          aria-hidden="true"
        />
      ) : null}

      <span
        className="pointer-events-none absolute inset-0 z-[3] rounded-[30px] border border-transparent transition-colors duration-500 group-hover:border-rule mobile:rounded-[20px]"
        aria-hidden="true"
      />

      <span className="absolute left-[30px] top-[30px] z-[2] flex items-center gap-[7px] rounded-full border border-rule-2 bg-ground/70 py-[6px] pl-[10px] pr-[13px] backdrop-blur-[6px] mobile:left-[20px] mobile:top-[20px]">
        <span
          className={`block h-[6px] w-[6px] flex-none rounded-full ${item.tone === 'owned' ? 'bg-lime' : 'bg-flare'}`}
          aria-hidden="true"
        />
        <span className="t-tag text-ink">{item.status}</span>
      </span>

      <span className="absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-[20px] p-[30px] mobile:flex-col mobile:items-start mobile:gap-[14px] mobile:p-[20px]">
        <span className="flex flex-col gap-[10px]">
          <span className="t-card text-ink">{item.name}.</span>
          <span className="t-mono text-ink-2">{item.meta}</span>
          {showSummary && item.summary ? (
            <span className="t-small mt-[4px] max-w-[440px] text-ink-2">{item.summary}</span>
          ) : null}
        </span>
        <span className="flex flex-wrap items-center justify-end gap-[8px] mobile:justify-start">
          {item.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </span>
      </span>
    </Link>
  );
}
