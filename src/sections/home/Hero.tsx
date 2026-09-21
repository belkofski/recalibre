'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Img from '@/lib/Img';
import { Rise, Decode, InView } from '@/lib/motion';
import { HERO } from '@/content/home';
import { SITE } from '@/content/site';

/* ============================================================================
   THE HERO.

   MEASURED OFF THE REFERENCE at 1440: 1295px tall, padding 80/30/30, ground
   #101010 — one step up from the page, which is what separates it from the
   block beneath without a rule.

   KEPT: the status rail, the metadata, the CTA row, the media panel with its
   caption plate, the grain, the hairline border, and the responsive
   behaviour at all three widths.

   THE HEADLINE MOTION IS THE REFERENCE'S OWN. Each line slides up from
   behind its own edge over 0.6s; the sentence beneath decodes character by
   character. Both are the template's effects, not new ones. There is no word
   rotator — the reference has none, and adding one would be adding a visual
   idea the brief rules out.

   THE RAIL. The reference prints "NOW BOOKING FOR Q3 · EST. 2023". Recalibre
   publishes neither an availability nor a founding year, so the rail carries
   what is true: where the firm is, and the time there right now.
   ========================================================================= */

/** The local clock. Rendered empty on the server and filled after hydration,
 *  because the server's idea of "now" and the reader's are different and a
 *  mismatch between them is a hydration error. */
function LocalTime() {
  const [now, setNow] = useState('');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: SITE.timeZone,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  // suppressHydrationWarning: the value is deliberately absent on the server.
  return (
    <span suppressHydrationWarning className="tabular-nums">
      {now ? `${now} LOCAL` : ' '}
    </span>
  );
}

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-head"
      className="relative w-full overflow-clip border-b border-rule bg-raised grain"
    >
      <div className="shell pad-x flex w-full flex-col pb-[30px] pt-[80px] mobile:pt-[70px]">
        {/* ── the status rail ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-[16px] border-b border-rule-3 pb-[16px]">
          <p className="t-mono flex items-center gap-[8px] text-ink-2">
            <span aria-hidden="true" className="block h-[6px] w-[6px] rounded-full bg-lime" />
            {HERO.railLabel}
          </p>
          <p className="t-mono text-ink-3">
            <LocalTime />
          </p>
        </div>

        {/* ── the headline ────────────────────────────────────────────── */}
        <Rise
          as="h1"
          id="hero-head"
          lines={HERO.headline}
          className="t-hero mt-[60px] max-w-[19ch] text-ink mobile:mt-[36px]"
        />

        {/* ── the sentence, decoding ──────────────────────────────────── */}
        <Decode
          text={HERO.lede}
          className="t-body-lg mt-[28px] max-w-[54ch] text-ink-2"
        />

        {/* ── the CTA row ─────────────────────────────────────────────── */}
        <InView className="mt-[36px] flex flex-wrap items-center gap-[12px]" delay={220}>
          <Link href={HERO.ctaPrimary.href} className="pill pill-solid focus-ring t-btn">
            {HERO.ctaPrimary.label}
          </Link>
          <Link href={HERO.ctaSecondary.href} className="pill focus-ring t-btn">
            {HERO.ctaSecondary.label}
            <span aria-hidden="true" className="block h-[5px] w-[5px] rounded-full bg-lime" />
          </Link>
        </InView>

        {/* ── the media panel ─────────────────────────────────────────── */}
        <InView className="mt-[60px] mobile:mt-[40px]" delay={120}>
          <figure className="card media-scrim relative m-0 aspect-[16/9] w-full mobile:aspect-[4/5]">
            <Img
              src={HERO.media}
              alt={HERO.mediaAlt}
              priority
              sizes="(max-width: 809px) 100vw, (max-width: 1199px) 100vw, 1380px"
              className="block h-full w-full object-cover object-[center_38%]"
            />
            <figcaption className="absolute bottom-[16px] left-[16px] z-[2] flex items-center gap-[8px] rounded-full border border-rule bg-scrim px-[14px] py-[8px]">
              <span aria-hidden="true" className="block h-[5px] w-[5px] rounded-full bg-flare" />
              <span className="t-mono-9 text-ink-2">{HERO.mediaCaption}</span>
            </figcaption>
          </figure>
        </InView>
      </div>
    </section>
  );
}
