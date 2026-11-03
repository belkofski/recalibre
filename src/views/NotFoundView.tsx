'use client';

import { ArtImg } from '@/lib/Img';
import { Btn, Pill } from '@/components/ui';
import { NAV } from '@/content/site';
import { localePath } from '@/lib/i18n';
import { useLocale } from '@/lib/locale';
import { ui } from '@/content/ui';

/**
 * 404 — the reference's own: one full panel carrying a photograph, and a
 * small card floated at its centre holding the code, a line of copy and the
 * way back. The route list is added under it, because a 404 that also tells
 * you every address on the site saves the reader a second guess.
 *
 * Rendered by app/global-not-found.tsx for every wrong address in either
 * language. The language comes from the shell's provider, which on that
 * page follows the address once the page is alive (lib/locale.tsx), so a
 * reader under /fr gets the French card and French links.
 */
export default function NotFoundView() {
  const locale = useLocale();
  const t = ui(locale).notFound;
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
          <p className="t-mono text-ink-2">{t.eyebrow}</p>
          <h1 id="nf-head" className="t-display tabular-nums text-ink">
            404
          </h1>
          <p className="t-caption max-w-[260px] text-ink-2">{t.body}</p>
          <Btn href={localePath(locale, '/')} label={t.back} />
          <nav aria-label={ui(locale).nav.allPages} className="flex flex-wrap items-center justify-center gap-[8px]">
            {NAV.map((item) => (
              <Pill key={item.href} href={localePath(locale, item.href)}>
                {item.label}
              </Pill>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
