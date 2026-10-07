import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { Scene } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import WorkCard from '@/components/WorkCard';
import FeaturedOps from '@/sections/work/FeaturedOps';
import { Orbs } from '@/components/ui';
import { initiativeBySlug, WORK_INDEX as W, type Initiative } from '@/content/work';

export const metadata: Metadata = pageMeta({
  title: 'Selected work',
  description: 'Selected work by Recalibre: field operations, document intelligence, industrial contracting and eyewear.',
  path: '/work',
  image: '/img/og-work.jpg',
  imageAlt: 'A blue Belkofski paddle carrying the wordmark, lying across a court line, shot from above.',
});

/** The card's one line: the year and the field. */
const meta = (i: Initiative) => `${i.year} · ${i.category}`.toUpperCase();

/* ============================================================================
   THE WORK INDEX — the heading, the flagship, and the other three.

   The owner's third note: the same pictures everywhere, every card the same
   size, too many words. So each picture here is one no other page shows,
   and the three cards under the flagship are not a grid of equals: ABP's
   website in a device frame takes five columns of twelve, the Belkofski
   frames as a photograph take seven, and the Contraxis system diagram runs
   across the row under them with its words beside it. On a tablet the
   same split holds down to 600; on a phone they stand in one column, the capture and
   the diagram inset on their beds between the full-bleed photograph.

   Each card is a name, the year and the field, and the way in. Two of the
   reference's devices stay out: the counter ("0% repeat or referral
   clients" is a claim), and the search and filter row over four entries.

   AS THE PAGE SCROLLS the three cards rise one after another with the
   block's entry (`Scene`, `.sx-stagger`), each card a step behind the last;
   the flagship above zooms and recedes, so the two blocks never move alike.
   ========================================================================= */
export default function WorkIndex() {
  const abp = initiativeBySlug('abp-continental');
  const belkofski = initiativeBySlug('belkofski');
  const contraxis = initiativeBySlug('contraxis');
  return (
    <>
      <PageHead lines={W.headline} lede={W.lede} />

      <FeaturedOps />

      <Scene
        as="section"
        aria-label="Work"
        end={0.3}
        className="pad-x relative isolate flex w-full flex-col items-center overflow-clip pt-(--space-3)"
      >
        <Orbs variant="section" />
        <div className="sx-stagger seam shell grid w-full grid-cols-12 phone:grid-cols-1">
          {abp ? (
            <div style={{ '--i': 0 } as CSSProperties} className="col-span-5 flex flex-col phone:col-span-1">
              <WorkCard
                art="capture"
                item={{
                  slug: abp.slug,
                  name: abp.name,
                  meta: meta(abp),
                  src: '/img/abp-site-home-clean.jpg',
                  alt: abp.shots[0]?.alt ?? abp.coverAlt,
                }}
                artClass="min-h-[240px] flex-1 phone:aspect-[4/3] phone:min-h-0 phone:flex-none"
                sizes="(max-width: 599px) calc(100vw - 92px), (max-width: 1199px) 40vw, 420px"
                className="flex-1"
              />
            </div>
          ) : null}
          {belkofski?.hero ? (
            <div style={{ '--i': 1 } as CSSProperties} className="col-span-7 flex flex-col phone:col-span-1">
              <WorkCard
                art="photo"
                item={{
                  slug: belkofski.slug,
                  name: belkofski.name,
                  meta: meta(belkofski),
                  src: belkofski.hero,
                  alt: belkofski.heroAlt,
                }}
                artClass="aspect-[7/5]"
                sizes="(max-width: 599px) 100vw, (max-width: 1199px) 58vw, 810px"
                className="flex-1"
              />
            </div>
          ) : null}
          {contraxis ? (
            <div style={{ '--i': 2 } as CSSProperties} className="col-span-12 flex flex-col phone:col-span-1">
              <WorkCard
                art="diagram"
                side
                item={{
                  slug: contraxis.slug,
                  name: contraxis.name,
                  meta: meta(contraxis),
                  src: null,
                  alt: '',
                }}
                artClass="aspect-[16/7] tablet:aspect-[2/1] mid:aspect-[16/10] phone:aspect-[4/5]"
                className="flex-1"
              />
            </div>
          ) : null}
        </div>
      </Scene>
    </>
  );
}
