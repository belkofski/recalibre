import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Chevron, FIRM_MARK_PATH, LabelRow } from '@/components/ui';
import { MARKS, SITE } from '@/content/site';
import { BAND } from '@/content/home';
import { INITIATIVES } from '@/content/work';
import PartnerStage from './PartnerStage';

/* ============================================================================
   THE PARTNERS, AS A HUB (14 October 2026).

   The owner's reference was a Framer page: a tile in the middle, logo
   cards either side, joined to it by curved lines. His third look, the
   same day, set the style: the Contraxis diagram's
   (components/SystemDiagram.tsx), "to make it compatible with our design
   language", on the same black. So this is that diagram's kit, drawn in
   HTML because the cards carry logo files:
     - a black panel (the ground, #050505) on the band, as the Contraxis
       cover sits on its page
     - flat cards: white at 4% over the black, a 1px edge at 12%, radius
       14, the name at 100% and the relationship under it at 50%
     - the centre card: white at 3%, an edge at 18%, the firm's '///' in
       white over the name and the descriptor, as Contraxis's centre card
       carries its own
     - cubic lines in white at 16%, a port dot where each meets a card,
       and dots that ride the lines only while the reader points at the
       panel or moves focus into it (PartnerStage.tsx)
   No glow, no starfield, no chrome edge and no tick rule: those came off
   on the owner's second and third looks.

   THE CARDS are the five partners in the owner's order (14 October 2026:
   ABP Continental and Dorwa change places from the alphabetical one):
   Dorwa Production and Belkofski on the left (above the centre card on a
   phone), ABP Continental, Hostino and Saidis on the right (below it).
   The order is placement only and claims nothing. A card carries
   the partner's own logo where the site has the file (Belkofski, Dorwa,
   Hostino) and the name set in type where it does not (ABP Continental,
   Saidis), never a drawn stand-in. Under it, the relationship: Partner,
   and Partner · Client for ABP Continental. The two partners whose work is
   on the site are links to it, marked by the chevron.
   ========================================================================= */

const PARTNER = 'Partner';
/** The owner's order: the first two left of the centre card, the rest right. */
const ORDER = ['Dorwa Production', 'Belkofski', 'ABP Continental', 'Hostino', 'Saidis'];
const CLIENT = 'CLIENT';

/**
 * Each logo file's own ink, measured from the file (scratch/register,
 * mark-geo.json), at its drawn size: `w` x `h` is the box on the page,
 * `size` and `pos` place the whole file behind it so only the ink shows.
 * `--logo-u` in globals.css scales all four together with the stage.
 * Belkofski's wordmark sits inside a wider SVG canvas; Dorwa's and
 * Hostino's files are their ink. A file not listed here is not a logo.
 */
const MARK_GEOMETRY: Record<string, { w: number; h: number; size: [number, number]; pos: [number, number]; nudge?: boolean }> = {
  '/img/partner-belkofski.svg': { w: 162.43, h: 22, size: [285.71, 66.07], pos: [-61.57, -22] },
  '/img/partner-dorwa.png': { w: 65.29, h: 30, size: [65.29, 30], pos: [0, 0] },
  '/img/partner-hostino.png': { w: 96.59, h: 30, size: [96.59, 30], pos: [0, 0], nudge: true },
};

/** A length off the file's own size: `--logo-u` is the stage's logo scale,
 *  as a length so it can follow the window (globals.css). */
const px = (n: number) => `calc(${n} * var(--logo-u, 1px))`;

function Logo({ src }: { src: string }) {
  const g = MARK_GEOMETRY[src];
  if (!g) return null;
  const image = `url(${src})`;
  const style: CSSProperties = {
    width: px(g.w),
    height: px(g.h),
    maskImage: image,
    WebkitMaskImage: image,
    maskSize: `${px(g.size[0])} ${px(g.size[1])}`,
    WebkitMaskSize: `${px(g.size[0])} ${px(g.size[1])}`,
    maskPosition: `${px(g.pos[0])} ${px(g.pos[1])}`,
    WebkitMaskPosition: `${px(g.pos[0])} ${px(g.pos[1])}`,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  };
  return <span aria-hidden="true" className={`hub-logo ${g.nudge ? 'hub-logo-nudge' : ''}`} style={style} />;
}

/** The centre card: the '///' over the name and the descriptor. */
function Core() {
  return (
    <div className="hub-core" data-hub-core aria-hidden="true">
      <svg className="hub-core-mark" viewBox="0 0 44 22" focusable="false">
        <path d={FIRM_MARK_PATH} fill="currentColor" />
      </svg>
      <span className="hub-core-name">{SITE.name}</span>
      <span className="hub-core-sub">{SITE.descriptor}</span>
    </div>
  );
}

export default function MarkRow() {
  const rank = (name: string) => {
    const i = ORDER.indexOf(name);
    return i === -1 ? ORDER.length : i;
  };
  const cards = [...MARKS].sort((a, b) => rank(a.name) - rank(b.name)).map((m) => {
    const work = INITIATIVES.find((w) => w.name === m.name);
    const client = Boolean(work?.status.startsWith(CLIENT));
    return {
      name: m.name,
      src: 'src' in m ? m.src : null,
      relation: client ? `${PARTNER} · Client` : PARTNER,
      spoken: client ? 'partner and client' : 'partner',
      href: work ? `/work/${work.slug}` : null,
    };
  });

  return (
    <section
      aria-label="Partners"
      className="relative w-full rounded-b-[34px] bg-raised px-[4px] pb-[4px] mobile:rounded-b-[24px]"
    >
      <div className="hub-panel pad-x">
        <div className="shell flex flex-col gap-[40px] mobile:gap-[28px]">
          <LabelRow label={BAND.label} />

          <PartnerStage>
            <Core />
            <ul className="hub-cards">
              {cards.map((c, i) => {
                const face = (
                  <>
                    {c.src ? <Logo src={c.src} /> : <span aria-hidden="true" className="hub-name">{c.name}</span>}
                    <span className="hub-rel" aria-hidden="true">
                      {c.relation}
                      {c.href ? <Chevron className="text-accent-bright" /> : null}
                    </span>
                    <span className="sr-only">
                      {c.name}, {c.spoken}
                      {c.href ? '. See the work.' : ''}
                    </span>
                  </>
                );
                return (
                  <li key={c.name} className="hub-slot" data-hub-card={i}>
                    {c.href ? (
                      <Link href={c.href} className="hub-card hub-card-link">
                        {face}
                      </Link>
                    ) : (
                      <div className="hub-card">{face}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </PartnerStage>
        </div>
      </div>
    </section>
  );
}
