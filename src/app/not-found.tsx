import type { Metadata } from 'next';
import { ArtImg } from '@/lib/Img';
import { InView, Rise } from '@/lib/motion';
import { Card, Numeral, Pill } from '@/components/ui';
import { PAGES } from '@/content/site';
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
 * you every address on the site saves the reader a second guess. Since the
 * audit the list is every page (PAGES, six of them), and the sentence above
 * it no longer counts them, so a seventh page would not make it wrong.
 *
 * THE CODE IS ALSO ON THE WALL (the direction change): the big outline
 * numeral ghosted at the panel's top-right corner behind the floated card,
 * hidden from assistive technology (the h1 in the card is the one that is
 * read), and the floated card is a deep surface with the spotlight rather
 * than a translucent box with a border. No orbs over the photograph. On a
 * phone the card sits under the numeral instead of over it, so the ghost
 * is never cut by the card's top edge.
 *
 * BACK TO HOME came off in the third pass: HOME is the first of the pills
 * under it, so the card offered the same way back twice.
 */
export default function NotFound() {
  return (
    <section
      aria-labelledby="nf-head"
      className="pad-x relative flex w-full flex-col items-center overflow-clip bg-raised pb-(--space-5) pt-[calc(var(--bar)+var(--space-4))] phone:pb-(--space-4) phone:pt-[calc(var(--bar)+var(--space-3))]"
    >
      {/* The panel takes the plate's own shape, not a floor (28 September
          2026): 23:12 is 1380 x 720 at 1440, 4:3 on a tablet, and 3:4 below
          810, the upright cut's ratio. Where the card needs more height
          (a 320 phone, or the room the numeral takes above it) the box
          grows to hold it. */}
      <Card
        radius={30}
        surface={false}
        /* Below 810 the card is pushed down under the numeral's room (the
           padding, the numeral at line-height 0.9 and a step of air): a
           utility, because the card's own padding is one and would win over
           a rule in the components layer. */
        className="shell flex aspect-[23/12] w-full items-center justify-center overflow-clip p-(--card-pad) tablet:aspect-[4/3] mobile:aspect-[3/4] mobile:justify-start mobile:pt-[calc(var(--card-pad)+108px+var(--space-4))]"
      >
        {/* The wall is revealed from its foot upward while it settles (the
            clip tier, the premium picture entrance); the card over it
            arrives after, from 0.96. The two are separate reveals, so the
            card is never clipped with the picture. */}
        <InView mode="clip" className="absolute inset-0 overflow-clip">
          <div className="settle absolute inset-0">
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
          </div>
        </InView>
        {/* THE ROOM'S OWN WALL. The borrowed geometry render came off on
            28 September 2026, and the wall is cut below the ceiling line
            with its own upright cut for a phone, where the panel is taller
            than it is wide. No wash over the picture: the panel's 38%
            darkening is still in the file (scripts/plates.py, `wash`), so
            the page dims nothing. */}

        {/* The ghosted code on the wall, in the panel's top-right corner:
            200 on a desktop, 120 on a phone (`.nf-numeral`, shell.css). */}
        <Numeral n="404" className="nf-numeral right-(--card-pad) top-(--card-pad)" />

        <InView mode="scale" delay={300} className="nf-card relative">
          <Card
            radius={24}
            deep
            spot
            className="flex flex-col items-center gap-(--space-4) p-(--space-row) text-center"
          >
            <p className="t-mono text-ink-2">THIS PAGE DOES NOT EXIST</p>
            <Rise as="h1" id="nf-head" lines={['404']} className="t-display tabular-nums text-ink" />
            <p className="t-caption max-w-[260px] text-ink-2">
              The address is wrong or the page has moved. Start from one of the pages below.
            </p>
            <nav aria-label="All pages" className="flex flex-wrap items-center justify-center gap-(--space-1)">
              {PAGES.map((item) => (
                <Pill key={item.href} href={item.href}>
                  {item.label}
                </Pill>
              ))}
            </nav>
          </Card>
        </InView>
      </Card>
    </section>
  );
}
