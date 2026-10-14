import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Chevron, FIRM_MARK_PATH, LabelRow } from '@/components/ui';
import { MARKS, SITE } from '@/content/site';
import { BAND } from '@/content/home';
import { INITIATIVES } from '@/content/work';
import PartnerStage from './PartnerStage';

/* ============================================================================
   THE PARTNERS, AS A HUB (14 October 2026, the owner's reference: a
   Framer page with a chrome tile in the middle and logo cards on either
   side, joined to it by curved lines that carry light).

   The reference's purple-to-orange glow is the hero picture's own range
   instead, sampled off public/img/plate-hero-wall-f.jpg: the near-black
   navy #0a0c1b, #161e39, #23315a, #344778 and #4a5c88, and the silvers
   #8d8e93 to #b5b5b8. Nothing else on the section takes another colour.

   THE TILE is Recalibre: the '///' in silver and the name under it, the
   way the reference's tile carries its own mark. It is drawing, not
   content, so it is hidden from assistive technology: the bar already
   names the firm on every page.

   THE CARDS are the five partners, in MARKS's alphabetical order, so the
   order claims nothing: three on the left, two on the right, set between
   the left three's heights. A card carries the partner's own logo where
   the site has the file (Belkofski, Dorwa, Hostino) and the name set in
   type where it does not (ABP Continental, Saidis), never a drawn
   stand-in. Under it, the relationship, as the register printed it:
   PARTNER, and PARTNER · CLIENT for ABP Continental. The two partners whose
   work is on the site are links to it, marked by the chevron.

   Under 810 the hub turns upright: the tile on top, the cards alternating
   either side of one line that runs up into it.

   The lines, the light on them and the entrance are PartnerStage's.
   ========================================================================= */

const PARTNER = 'PARTNER';
const CLIENT = 'CLIENT';

/**
 * Each logo file's own ink, measured from the file (scratch/register,
 * mark-geo.json), at its drawn size: `w` x `h` is the box on the page,
 * `size` and `pos` place the whole file behind it so only the ink shows.
 * `--logo-s` in globals.css scales all four together, smaller on a tablet
 * and a phone. Belkofski's wordmark sits inside a wider SVG canvas; Dorwa's
 * and Hostino's files are their ink. A file not listed here is not a logo.
 */
const MARK_GEOMETRY: Record<string, { w: number; h: number; size: [number, number]; pos: [number, number]; nudge?: boolean }> = {
  '/img/partner-belkofski.svg': { w: 162.43, h: 22, size: [285.71, 66.07], pos: [-61.57, -22] },
  '/img/partner-dorwa.png': { w: 65.29, h: 30, size: [65.29, 30], pos: [0, 0] },
  '/img/partner-hostino.png': { w: 96.59, h: 30, size: [96.59, 30], pos: [0, 0], nudge: true },
};

const px = (n: number) => `calc(${n}px * var(--logo-s, 1))`;

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

/**
 * The stars: tiny points drawn as one background each, from a fixed seed so
 * the server and the browser draw the same sky. Fewer, fainter ones near the
 * top, where the label row is. `twinkle` is the smaller set that breathes.
 */
function sky(count: number, seed: number) {
  let x = seed;
  const rnd = () => ((x = (x * 16807) % 2147483647) - 1) / 2147483646;
  const dots: string[] = [];
  for (let i = 0; i < count; i++) {
    const left = (rnd() * 100).toFixed(2);
    const top = (8 + Math.sqrt(rnd()) * 90).toFixed(2);
    const size = (0.8 + rnd() * 1.1).toFixed(2);
    const alpha = (0.18 + rnd() * 0.5).toFixed(2);
    dots.push(`radial-gradient(${size}px ${size}px at ${left}% ${top}%, rgba(214,220,238,${alpha}) 50%, transparent 100%)`);
  }
  return dots.join(',');
}
const SKY = sky(54, 7);
const TWINKLE = sky(14, 4127);

/** The tile: the '///' in silver over the name. */
function Tile() {
  return (
    <div className="hub-tile" data-hub-tile aria-hidden="true">
      <div className="hub-tile-face">
        <svg className="hub-tile-mark" viewBox="0 0 44 22" focusable="false">
          <defs>
            <linearGradient id="hub-silver" x1="0" y1="0" x2="0.35" y2="1">
              <stop offset="0" stopColor="#f6f7fa" />
              <stop offset="0.48" stopColor="#b5b5b8" />
              <stop offset="0.52" stopColor="#8d8e93" />
              <stop offset="1" stopColor="#d6d9e2" />
            </linearGradient>
          </defs>
          <path d={FIRM_MARK_PATH} fill="url(#hub-silver)" />
        </svg>
        <span className="hub-tile-name">
          <span className="hub-tile-word">{SITE.name}</span>
          <span className="hub-tile-r">{SITE.mark}</span>
        </span>
      </div>
    </div>
  );
}

export default function MarkRow() {
  const cards = MARKS.map((m) => {
    const work = INITIATIVES.find((w) => w.name === m.name);
    const client = Boolean(work?.status.startsWith(CLIENT));
    return {
      name: m.name,
      src: 'src' in m ? m.src : null,
      relation: client ? `${PARTNER} · ${CLIENT}` : PARTNER,
      spoken: client ? 'partner and client' : 'partner',
      href: work ? `/work/${work.slug}` : null,
    };
  });

  return (
    <section
      aria-label="Partners"
      className="hub-band pad-x relative flex w-full flex-col items-center overflow-clip rounded-b-[30px] bg-raised pb-[72px] pt-[32px] mobile:rounded-b-[20px] mobile:pb-[48px] mobile:pt-[24px]"
    >
      <div className="hub-sky" aria-hidden="true" style={{ backgroundImage: SKY }}>
        <div className="hub-sky-twinkle" style={{ backgroundImage: TWINKLE }} />
      </div>
      <div className="hub-glow" aria-hidden="true" />

      <div className="shell relative flex w-full flex-col gap-[40px] mobile:gap-[32px]">
        <LabelRow label={BAND.label} />

        <PartnerStage>
          <Tile />
          <ul className="hub-cards">
            {cards.map((c, i) => {
              const face = (
                <>
                  {c.src ? <Logo src={c.src} /> : <span aria-hidden="true" className="hub-name">{c.name}</span>}
                  <span className="hub-rel t-mono" aria-hidden="true">
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
    </section>
  );
}
