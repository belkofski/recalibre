import Img from '@/lib/Img';
import { Caption } from '@/components/ui';

/* ============================================================================
   THE SHOWCASE — two pieces of delivered digital presence, in frames.

   The Digital Presence family page opens on the two things the site can
   honestly show: the ABP Continental website as delivered (the page's own
   capture, public/img/abp-site-home-clean.jpg) in a laptop frame, and the
   Belkofski brand render (the partner's own picture, already on the site)
   as an upright plate beside it. Both are already published elsewhere on
   the site with their captions; nothing new is claimed here.

   The two move at different speeds as the page scrolls — the plate a
   little faster than the laptop — through CSS scroll-driven animation
   alone (`.parallax-*` in globals.css, `animation-timeline: view()`). A
   browser without it, scripts off, and prefers-reduced-motion all get the
   two standing still, which is the complete picture.
   ========================================================================= */

export default function Showcase() {
  return (
    <div className="relative grid w-full grid-cols-[1fr_auto] items-end gap-[24px] phone:grid-cols-1">
      {/* the laptop */}
      <figure className="parallax-slow flex flex-col gap-[12px]">
        <div className="relative">
          <div className="relative overflow-clip rounded-t-[14px] border border-rule bg-raised p-[6px] pb-0">
            <div className="flex h-[14px] items-center gap-[5px] px-[6px]" aria-hidden="true">
              <span className="size-[5px] rounded-full bg-ink/35" />
              <span className="size-[5px] rounded-full bg-ink/35" />
              <span className="size-[5px] rounded-full bg-ink/35" />
            </div>
            <div className="relative aspect-[16/10] w-full overflow-clip rounded-t-[6px] bg-ground">
              <Img
                src="/img/abp-site-home-clean.jpg"
                alt="The ABP Continental home page as delivered: steel erection at dusk under the headline “Building the infrastructure energy runs on.”"
                sizes="(max-width: 599.98px) 100vw, (max-width: 1199.98px) 70vw, 520px"
                className="absolute inset-x-0 top-0 w-full"
              />
            </div>
          </div>
          <div className="h-[10px] rounded-b-[10px] border border-t-0 border-rule bg-raised-2" aria-hidden="true" />
        </div>
        <Caption as="figcaption">ABP Continental · the site we built for them.</Caption>
      </figure>

      {/* the brand plate */}
      <figure className="parallax-fast flex w-[150px] flex-col gap-[12px] phone:w-full">
        <div className="relative aspect-[458/1148] w-full overflow-clip rounded-[14px] border border-rule phone:aspect-[4/5]">
          <Img
            src="/img/cap-belkofski-cube-tall-e.jpg"
            alt="A Belkofski brand render: a black cube on a perforated steel bed, a pair of orange-lensed frames set into its face, lit in red."
            sizes="(max-width: 599.98px) 100vw, 150px"
            className="media-fill"
          />
        </div>
        <Caption as="figcaption">Belkofski · a partner.</Caption>
      </figure>
    </div>
  );
}
