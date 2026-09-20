'use client';

import { useState } from 'react';
import Link from 'next/link';
import Img from '@/lib/Img';
import { NAV } from '@/lib/content';
import MegaMenu from './MegaMenu';

/**
 * NAV — three measured states.
 *
 * DESKTOP (>=1200px)   outer box y0 x120 1200x86.41, position absolute, z-index 1
 *   nav      flex column, align/justify center, padding 18px 20px, overflow clip
 *   bar      1160x50.41, flex row, justify center, gap 10px
 *   logo     97.02x30 (intrinsic 304x94, object-fit contain at 0% 50%)
 *   links    flex 1, justify center, column-gap 32px, 15px/21px w500 ls -0.3px
 *   CTA      padding 14px 20px, background rgba(255,255,255,0), radius 0
 *   hairline absolute top 85px, inset-x 20px, 1px, rgba(255,255,255,0.12)
 *
 * NARROW (<=1199.98px), CLOSED   nav <vw>x68, padding 12px 20px, justify space-between
 *   bar      <vw-40>x44, flex row, justify space-between, align center
 *   burger   44x44 holding two 20x2 white pills, border-radius 10px,
 *            at x offset 12, y offsets 15.5 and 26.5 inside the 44 box (9px apart)
 *   hairline still absolute top 85px, inset-x 20px
 *
 * NARROW, OPEN   nav 390x382.41 at 390 wide: padding 12px 20px 32px 20px,
 *   gap 24px, background rgb(8,16,20), overflow clip
 *   inner    350x338.41, flex column, align center, gap 32px
 *   links    350x180, flex column, ALIGN CENTER, gap 32px (centred, not a row)
 *   CTA      350x50.41 full width, padding 14px 20px, transparent
 *   burger   the two pills rotate to an X; each bounding box measures
 *            15.56x15.56, which is a 22px bar at 45 degrees
 *   hairline moves to bottom 0, inset-x 0, FULL width (390), not inset 20px
 */
export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-0 left-1/2 z-[1] w-full max-w-[1200px] -translate-x-1/2">
      <nav
        className={`relative flex flex-col items-center justify-center overflow-clip px-[20px] py-[18px] narrow:justify-between narrow:py-[12px] ${
          open ? 'narrow:gap-[24px] narrow:bg-[rgb(8,16,20)] narrow:pb-[32px]' : ''
        }`}
      >
        <div className="relative flex w-full flex-col items-center justify-center gap-[32px] narrow:w-full">
          {/* bar: 1160×50.41 desktop / <vw-40>×44 narrow */}
          <div className="relative flex w-full items-center justify-center gap-[10px] narrow:h-[44px] narrow:justify-between">
            {/* THE REAL WORDMARK, from _MASTER/04-ASSETS/brand/marks. What was
                here was a 278-byte grey rectangle — the clone's placeholder —
                so the brand slot rendered as a grey box on every page.

                The measured box was 97.02x30, an aspect of 3.234:1. The real
                mark is 1105x208, which is 5.31:1, so object-contain inside the
                old box would have scaled it to 18px tall and left it floating
                in a 30px slot. The box goes; the mark sets its own width from
                a fixed height. */}
            <div className="flex shrink-0 items-center justify-start gap-[10px]">
              <Link href="/" aria-label="Recalibre, home" className="focus-ring tap-44 block shrink-0 rounded-[8px]">
                <Img
                  src="/img/wordmark-white.png"
                  alt="Recalibre"
                  priority
                  sizes="128px"
                  className="block h-[24px] w-auto object-contain object-[0%_50%]"
                />
              </Link>
            </div>

            {/* links: a centred row on desktop, a centred column when the narrow menu is open */}
            <div
              className={`flex min-w-0 flex-1 items-center justify-center gap-[32px] overflow-clip narrow:absolute narrow:top-[76px] narrow:left-0 narrow:h-[180px] narrow:w-full narrow:flex-col narrow:gap-[32px] ${
                open ? '' : 'narrow:hidden'
              }`}
            >
              {NAV.links.map((l) =>
                'children' in l && l.children ? (
                  <div key={l.label} className="group relative shrink-0 narrow:w-full narrow:text-center">
                    <div className="flex flex-col items-center justify-center gap-[16px] overflow-hidden">
                      <div className="flex shrink-0 items-center justify-center gap-[8px]">
                        <p className="text-[15px] leading-[21px] font-medium tracking-[-0.3px] whitespace-pre text-[rgb(255,255,255)]">
                          {l.label}
                        </p>
                        {/* caret 8×4, path M 4 4 L 0 0 L 8 0 Z */}
                        <div className="h-[4px] w-[8px] shrink-0">
                          <svg viewBox="0 0 8 4" width="100%" height="100%" className="block overflow-hidden">
                            <path d="M 4 4 L 0 0 L 8 0 Z" fill="rgb(255, 255, 255)" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* dropdown: absolute top 40px, centred, gap 16px, 14px/19.6px */}
                    <div className="invisible absolute top-[40px] left-1/2 z-[1] flex -translate-x-1/2 flex-col items-center justify-center gap-[16px] group-hover:visible">
                      {l.children.map((c) => (
                        <div key={c.label} className="flex shrink-0 items-center justify-start gap-[10px]">
                          <p className="small-text whitespace-pre text-[rgb(200,200,200)]">
                            <Link href={c.href} className="font-[inherit] text-[rgb(255,255,255)]">
                              {c.label}
                            </Link>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div key={l.label} className="flex shrink-0 flex-col justify-start">
                    <p className="text-[15px] leading-[21px] font-medium tracking-[-0.3px] whitespace-pre text-[rgb(255,255,255)]">
                      <Link href={l.href} className="font-[inherit] text-[rgb(255,255,255)]">
                        {l.label}
                      </Link>
                    </p>
                  </div>
                ),
              )}
            </div>

            {/* CTA: measured padding 14px 20px, transparent, radius 0 */}
            <div className={`shrink-0 narrow:absolute narrow:top-[288px] narrow:left-0 narrow:w-full ${open ? '' : 'narrow:hidden'}`}>
              <Link
                href={NAV.cta.href}
                className="flex items-center justify-center gap-[10px] bg-[rgba(255,255,255,0)] px-[20px] py-[14px]"
              >
                <div className="flex shrink-0 flex-col justify-start">
                  <p className="text-[16px] leading-[22.4px] font-medium whitespace-pre text-[rgb(255,255,255)]">
                    {NAV.cta.label}
                  </p>
                </div>
              </Link>
            </div>

            {/* burger: 44×44 holding two 20×2 pills, radius 10px, 9px apart */}
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative hidden h-[44px] w-[44px] shrink-0 cursor-pointer overflow-hidden narrow:block"
            >
              <span
                className="absolute block h-[2px] w-[20px] rounded-[10px] bg-[rgb(255,255,255)]"
                style={
                  open
                    ? { top: '21px', left: '12px', transform: 'rotate(45deg)' }
                    : { top: '15.5px', left: '12px' }
                }
              />
              <span
                className="absolute block h-[2px] w-[20px] rounded-[10px] bg-[rgb(255,255,255)]"
                style={
                  open
                    ? { top: '21px', left: '12px', transform: 'rotate(-45deg)' }
                    : { top: '26.5px', left: '12px' }
                }
              />
            </button>
          </div>
        </div>

        <MegaMenu />

        {/* hairline: top 85px inset-x 20px when closed; bottom 0 full width when the
            narrow menu is open — measured at 390×1 x0 y381.41 */}
        <div
          className={
            open
              ? 'absolute right-0 bottom-0 left-0 z-[1] h-px overflow-clip bg-[rgba(255,255,255,0.12)] narrow:top-auto'
              : 'absolute top-[85px] right-[20px] left-[20px] z-[1] h-px max-w-[1160px] overflow-clip bg-[rgba(255,255,255,0.12)]'
          }
        />
      </nav>
    </div>
  );
}
