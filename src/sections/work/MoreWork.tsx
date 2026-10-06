import Link from 'next/link';
import Img, { ArtImg } from '@/lib/Img';
import { InView } from '@/lib/motion';
import SystemDiagram from '@/components/SystemDiagram';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import { Caption, cardClass, Chip, SectionHead, Status } from '@/components/ui';
import type { Initiative } from '@/content/work';

/* ============================================================================
   MORE WORK — the pair that closes a case study.

   TWO CARDS, NOT EVERY OTHER ONE. The block is a two-column seam plate;
   with four initiatives on the site a plain "all the others" is three cards
   and leaves an orphan in the second row. The page passes the two that
   FOLLOW it in the list, wrapping round the end, so each case points at a
   different pair instead of the same two every time.

   NOT "ALSO IN DEVELOPMENT". Two of the four initiatives are in
   development, one is a partner's brand and one was delivered for a client,
   so that label was wrong on most of the pages that used it.
   ========================================================================= */
export default function MoreWork({ items }: { items: readonly Initiative[] }) {
  /* A PAIR WITH THE DIAGRAM IN IT STANDS TALLER on a tablet (the owner's
     decision of 26 September 2026). At 1.6:1 a tablet's card left the
     diagram a strip 80-140px tall and it could draw its icon tiles only;
     at about 360px tall it prints its words. Both cards of the pair take
     4:3, which is that 360 at 1024 wide, so the row stays even. Below 600
     the cards stand one under the other and only the diagram's card grows. */
  const tallPair = items.some((o) => !o.cover);
  return (
    <section aria-labelledby="more-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-alone)">
        <SectionHead id="more-head" label="MORE FROM RECALIBRE" lines={['More work.']} />

        {/* One reveal per card, the second column 90ms after the first;
            one column on a phone, both step 0. */}
        <div className="seam grid w-full grid-cols-2 mobile:grid-cols-1">
          {items.map((o, i) => {
            /* THE CARD'S OWN CUT, WITH ITS FOOT IN THE FILE (28 September
               2026): the two photographs are drawn from `coverMore`, the
               cover cut to this card's 1.6:1 with the darkening under the
               words laid into the picture, and on a tablet beside the
               diagram from `coverMoreTall`, the 4:3 cut (from the top where
               `coverFrom` says so). Nothing is dimmed over them at runtime.
               OPS has no such cut: it is a product capture, published clean,
               and keeps the card's own shade and its `.veil-ops-foot`, the
               one kept exception. */
            const pic = o.coverMore ?? o.cover;
            const sizes = '(max-width: 809px) 100vw, 687px';
            return (
              <InView key={o.slug} step={i % 2}>
                <Link
                  href={`/work/${o.slug}`}
                  className={
                    `${cardClass({ interactive: true })} flex aspect-[1.6/1] flex-col justify-end overflow-clip p-(--card-pad)` +
                    (tallPair ? ' tablet:aspect-square' : '') +
                    (o.cover
                      ? ''
                      : ' [@media(max-width:459.98px)]:aspect-[2/3] [@media(min-width:460px)_and_(max-width:599.98px)]:aspect-[4/5] mid:aspect-[4/3]')
                  }
                >
                  {pic ? (
                    <span className="settle absolute inset-0 block">
                      {tallPair && o.coverMore && o.coverMoreTall ? (
                        <ArtImg
                          src={o.coverMore}
                          srcTall={o.coverMoreTall}
                          media="(min-width: 810px) and (max-width: 1199.98px)"
                          alt={o.coverAlt}
                          sizes={sizes}
                          sizesTall={sizes}
                          lazy
                          className="media-zoom media-fill"
                        />
                      ) : (
                        /* In the taller pair, a cover with marks printed
                           along its top is cropped from the top (`coverFrom`). */
                        <Img
                          src={pic}
                          alt={o.coverAlt}
                          sizes={sizes}
                          className={'media-zoom media-fill' + (tallPair && o.coverFrom === 'top' ? ' tablet:object-top' : '')}
                        />
                      )}
                    </span>
                  ) : (
                    /* The diagram above the words, in the box they leave
                       free; its caption is the first line of the words,
                       under it. The words (the caption on its hairline, the
                       name, the meta line and the Status) take 154-170px, so
                       the card stands taller than the picture cards where the
                       diagram would otherwise fall to its bare tiles: 2:3
                       below 460, 4:5 from 460 to 599, 4:3 from 600 to 809
                       and, with its neighbour, square from 810 to 1199. */
                    <span className="absolute inset-0 bg-ground">
                      <SystemDiagram
                        preset="more"
                        className="absolute inset-x-0 bottom-[164px] top-(--card-pad) tablet:bottom-[170px] mobile:bottom-[154px]"
                      />
                    </span>
                  )}
                  {/* The foot's shade is for words over a picture that does
                      not carry its own; over the diagram it would only dim
                      its lower row. */}
                  {o.cover && !o.coverMore ? (
                    <span
                      className="absolute inset-0 bg-gradient-to-t from-ground/85 via-ground/10 to-transparent"
                      aria-hidden="true"
                    />
                  ) : null}
                  {/* A LIGHT PICTURE GETS A DEEPER FOOT, as on the work
                      cards. Only OPS is light: a pale screen published as
                      shot, over which the meta line and the tags fell below
                      4.5:1. The band the words sit in is darkened: the lower
                      half of the card, never less than 210px (190 on a
                      phone). See `.veil-ops-foot` in globals.css. */}
                  {o.art === 'light' ? (
                    <span
                      className="veil-ops-foot absolute inset-x-0 bottom-0 h-[max(50%,210px)] mobile:h-[max(50%,190px)]"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="relative flex flex-col gap-(--space-3)">
                    {/* THE CAPTION, the words' first line, on its hairline
                        across the card: "Demonstration data." on the product
                        screen, read out with the card; the diagram's, which a
                        screen reader hears in the diagram's own description,
                        hidden from it. */}
                    {o.demo ? (
                      <span className="-mx-(--card-pad) block">
                        <Caption as="div" className="px-(--card-pad)">
                          {o.demo}
                        </Caption>
                      </span>
                    ) : !o.cover ? (
                      <span aria-hidden="true" className="-mx-(--card-pad) block">
                        <Caption as="div" className="px-(--card-pad)">
                          {DIAGRAM_CAPTION}
                        </Caption>
                      </span>
                    ) : null}
                    <span className="flex items-end justify-between gap-(--space-4)">
                      <span className="flex flex-col items-start gap-(--space-1)">
                        <span className="t-card text-ink">{o.name}.</span>
                        {/* The year and the field on a plain mono line, and
                            the state under it as the Status: the short state,
                            as every card prints it; the full status belongs
                            to the detail page. */}
                        <span className="t-mono tabular-nums text-ink-3">
                          {o.year} · {o.category}
                        </span>
                        <Status state={o.tone === 'dev' ? 'development' : 'delivered'} className="text-ink-2">
                          {o.state}
                        </Status>
                      </span>
                      <span className="flex flex-wrap items-center justify-end gap-(--space-1) mobile:hidden">
                        {/* Over a picture the tags take their own dark ground. */}
                        {o.tags.slice(0, 2).map((t) => (
                          <Chip key={t} onArt={Boolean(o.cover)}>
                            {t}
                          </Chip>
                        ))}
                      </span>
                    </span>
                  </span>
                </Link>
              </InView>
            );
          })}
        </div>
      </div>
    </section>
  );
}
