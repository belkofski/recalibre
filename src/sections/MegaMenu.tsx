import Link from 'next/link';
import Img from '@/lib/Img';
import { NAV } from '@/lib/content';

/**
 * MEGA-MENU — measured y101.67 x140 1160×360, 56 boxes, `opacity: 0`.
 *
 * The reference carries this panel inside the nav at 1200px+ and it never
 * becomes visible: hovering every nav item, the logo, the CTA and the whole nav
 * band, and clicking Services, all leave it at opacity 0. It is an unused
 * variant of their component. Reproduced here at its measured geometry and
 * opacity so the tree matches; it paints nothing.
 *
 * Outer box measured position: absolute, top 281.672px left 600px with
 * transform translate(-580px, -180px) — which resolves to x140 y101.67. Written
 * below as the resolved box, which measures identically.
 *
 * plate   flex row, align/justify center, gap 44px, padding 6px 6px 6px 24px,
 *         background rgb(242,243,245), shadow rgba(8,16,20,0.12) 0 16px 24px -10px
 * left    666×291.56, flex column, gap 36px, padding 14px 0 18px 0
 *   title 666×36, padding-bottom 12px, 16px/24px w500
 *   list  666×187.56, gap 32px; each row 666×41.19, gap 16px:
 *         a 44×41.19 ink square holding a 24×24 icon, then a 606 text column
 *         (gap 4px) of 16px/17.6px w500 ls-0.32px over 14px/19.6px rgb(112,112,112)
 * right   420×348 plate: image (intrinsic 786×1040, cover), a scrim of
 *         linear-gradient(rgba(8,16,20,0) 38%, rgb(8,16,20) 100%) with padding
 *         24px, and a 52×52 white notch in the top-right holding the arrow pair
 *         at the card offset (top 56px left -24px).
 */
export default function MegaMenu() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-[101.67px] left-1/2 z-[1] h-[360px] w-full max-w-[1160px] -translate-x-1/2 opacity-0 narrow:hidden"
    >
      <div className="relative flex h-full w-full max-w-full items-center justify-center gap-[44px] overflow-clip bg-[rgb(242,243,245)] py-[6px] pr-[6px] pl-[24px] shadow-[rgba(8,16,20,0.12)_0px_16px_24px_-10px]">
        {/* left column */}
        <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-[36px] overflow-clip pt-[14px] pb-[18px]">
          <div className="relative flex w-full shrink-0 items-center justify-center gap-[10px] overflow-clip pb-[12px]">
            <div className="flex min-w-0 flex-1 flex-col justify-start">
              <p className="text-[16px] leading-[24px] font-medium text-[rgb(8,16,20)]">
                {NAV.mega.title.text}
              </p>
            </div>
          </div>
          <div className="relative flex w-full shrink-0 flex-col items-start justify-center gap-[32px]">
            {NAV.mega.items.map((it, i) => (
              <Link key={i} href="#capabilities" className="relative flex w-full shrink-0 items-center justify-start gap-[10px]">
                <div className="relative min-w-0 flex-1">
                  <div className="relative flex items-center justify-start gap-[16px] overflow-clip">
                    <div className="relative flex h-[41.19px] w-[44px] shrink-0 flex-col items-center justify-center gap-[10px] overflow-clip bg-[rgb(8,16,20)]">
                      <div className="relative aspect-square h-[24px] w-[24px] shrink-0 overflow-clip">
                        <div className="absolute inset-0">
                          <Img src={it.icon} alt="" sizes="24px"
                            className="block h-full w-full overflow-clip object-contain object-center" />
                        </div>
                      </div>
                    </div>
                    <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-[4px] overflow-clip">
                      <div className="flex w-full shrink-0 flex-col justify-start">
                        <p className="text-[16px] leading-[17.6px] font-medium tracking-[-0.32px] text-[rgb(8,16,20)]">
                          {it.title.text}
                        </p>
                      </div>
                      <div className="flex w-full shrink-0 flex-col justify-start">
                        <p className="small-text text-[rgb(112,112,112)]">{it.body.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* right feature plate */}
        <div className="relative h-[348px] w-[420px] shrink-0">
          <Link href="#contact" className="relative flex h-full w-full flex-col items-center justify-center gap-[10px] overflow-clip">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0">
                {/* Was declaring 786x1040 for a 420x556 file. */}
                <Img src="/img/nav-feature.png" alt="" sizes="420px"
                  className="block h-full w-full overflow-clip object-cover object-center" />
              </div>
            </div>
            <div
              className="relative flex h-full w-full flex-col items-start justify-end gap-[10px] overflow-clip p-[24px]"
              style={{ backgroundImage: 'linear-gradient(rgba(8, 16, 20, 0) 38%, rgb(8, 16, 20) 100%)' }}
            >
              <div className="flex w-full shrink-0 flex-col justify-start">
                <h3 className="text-[24px] leading-[28.8px] font-normal tracking-[-0.96px] text-[rgb(255,255,255)]">
                  {NAV.mega.feature.title.text}
                </h3>
              </div>
              <div className="flex w-full shrink-0 flex-col justify-start">
                <p className="small-text text-[rgb(200,200,200)]">
                  {NAV.mega.feature.body.text}
                </p>
              </div>
            </div>
          </Link>
          {/* 52×52 white notch, top-right, holding the arrow pair at the card offset */}
          <div className="absolute top-0 right-0 z-[1] flex h-[52px] w-[52px] items-center justify-center gap-[10px] overflow-clip bg-[rgb(255,255,255)]">
            <div className="aspect-square w-[20px] shrink-0 bg-[rgb(8,16,20)]" />
            <div className="arrow-incoming absolute z-[1] aspect-square w-[20px] shrink-0 bg-[rgb(8,16,20)]"
              style={{ ['--rest-top' as string]: '56px', ['--hover-left' as string]: '56px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
