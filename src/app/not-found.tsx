import type { Metadata } from 'next';
import { ArtImg } from '@/lib/Img';
import { Btn, Pill } from '@/components/ui';
import { NAV } from '@/content/site';
import { HOME_SHARE } from '@/lib/seo';

/* Every other route names itself in the tab; this one inherited the site
   default, so a reader with six tabs open could not tell which one had gone
   wrong. */
export const metadata: Metadata = {
  title: 'Page not found',
  /* ONE ROBOTS TAG, AND NO ADDRESS. Next writes its own "noindex" into
     every 404 it serves; the robots line here added a second one, worded
     differently, and the root layout's `canonical: './'` resolved to
     /_not-found — an address that is itself a 404. Both are switched off.
     The share block's `url: './'` in the root layout resolved to the same
     address, so the 404 carries the block without it. */
  robots: null,
  alternates: null,
  openGraph: HOME_SHARE,
};

/**
 * 404 — the reference's own: one full panel carrying a photograph, and a
 * small card floated at its centre holding the code, a line of copy and the
 * way back. The route list is added under it, because a 404 that also tells
 * you every address on the site saves the reader a second guess.
 */
export default function NotFound() {
  return (
    <section
      aria-labelledby="nf-head"
      className="pad-x relative flex w-full flex-col items-center overflow-clip bg-raised pb-[32px] pt-[80px] phone:pb-[24px] phone:pt-[72px]"
    >
      {/* The panel takes the plate's own shape, not a floor (28 September
          2026): 23:12 is 1380 x 720 at 1440, 4:3 on a tablet, and 3:4 below
          810, the upright cut's ratio. Where the card needs more height
          (a 320 phone) the box grows to hold it. */}
      <div className="card-30 shell relative flex aspect-[23/12] w-full items-center justify-center overflow-clip p-(--card-pad) tablet:aspect-[4/3] mobile:aspect-[3/4]">
        <ArtImg
          src="/img/plate-wall-404-b.jpg"
          srcTall="/img/plate-wall-404-tall-b.jpg"
          media="(max-width: 809.98px)"
          alt=""
          sizes="(max-width: 809.98px) 100vw, 1380px"
          /* No `sizesTall`: the upright box is the plate's own 3:4 since
             28 September 2026, drawn at the box's width, so the default
             100vw is right. */
          className="media-push media-push-sm media-push-flat-phone"
        />
        {/* THE ROOM'S OWN WALL. The borrowed geometry render came off on
            28 September 2026, and the wall is cut below the ceiling line
            with its own upright cut for a phone, where the panel is taller
            than it is wide. No wash over the picture: the panel's 38%
            darkening is still in the file (scripts/plates.py, `wash`), so
            the page dims nothing. The card is a translucent ground with no
            blur behind it: glass came off the site on 27 September 2026. */}

        <div className="relative flex w-[380px] max-w-full flex-col items-center gap-[24px] rounded-[24px] border border-rule bg-ground/80 p-[40px] text-center mobile:p-[24px]">
          <p className="t-mono text-ink-2">THIS PAGE DOES NOT EXIST</p>
          <h1 id="nf-head" className="t-display tabular-nums text-ink">
            404
          </h1>
          <p className="t-caption max-w-[260px] text-ink-2">
            The address is wrong or the page has moved. Start from one of the five pages below.
          </p>
          <Btn href="/" label="Back to home" />
          <nav aria-label="All pages" className="flex flex-wrap items-center justify-center gap-[8px]">
            {NAV.map((item) => (
              <Pill key={item.href} href={item.href}>
                {item.label}
              </Pill>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
