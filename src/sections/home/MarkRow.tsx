'use client';

import { useState } from 'react';
import Img from '@/lib/Img';
import { LabelRow } from '@/components/ui';
import { MARKS } from '@/content/site';
import { BAND } from '@/content/home';

/* ============================================================================
   THE MARK BAND.

   The reference closes its hero slab with a label row and a marquee of
   client logos in circular wells. The slab, the row, the wells and the
   marquee are kept exactly; what changes is that the row is headed with
   the one word PARTNERS and makes no other claim. It used to carry a
   right-hand label, a sentence and a note saying two of the five were
   Recalibre's own, and a stamp under those two; all of it came off on
   25 September 2026 when the owner said all five are partners and none
   is owned by Recalibre (see content/site.ts). What stands beside the
   marquee now is the pause control alone, in the column the sentence
   used to fill.

   ── TWO THINGS THE AUDIT FOUND ────────────────────────────────────────────

   THE FIVE MARKS WERE ANNOUNCED FIFTEEN TIMES. The track is the set
   repeated three times so the loop has no seam, and every copy carried a
   real image description, so a screen reader read the whole row three
   times over. One set is announced; the other two are decoration and are
   marked as decoration.

   THE STRIP MOVED AND COULD NOT BE STOPPED. It was then the only thing on
   the page that moved without being asked (the Contraxis diagram's dots
   joined it on 26 September 2026 — see lib/motion.tsx), and a reader who
   needs it to hold still had no way to say so unless their system carried
   a reduced-motion setting. There is a control now. It is also the one piece of moving
   content that could hide a mark behind the fade at the moment somebody
   tried to read it.
   ========================================================================= */

function Well({ mark, decorative }: { mark: (typeof MARKS)[number]; decorative: boolean }) {
  return (
    <div
      className="relative mx-[10px] flex size-[150px] flex-none items-center justify-center rounded-full bg-white/[0.03] mobile:size-[110px]"
      aria-hidden={decorative || undefined}
    >
      <Img
        src={mark.src}
        alt={decorative ? '' : mark.name}
        eager
        sizes="150px"
        className="mark-white max-h-[30px] w-auto max-w-[92px] object-contain opacity-70 transition-opacity duration-300 mobile:max-h-[24px]"
      />
    </div>
  );
}

export default function MarkRow() {
  const [running, setRunning] = useState(true);
  return (
    <section
      aria-label="Partners"
      className="pad-x relative flex w-full flex-col items-center overflow-clip rounded-b-[30px] bg-raised pb-[60px] pt-[30px] tablet:pb-[36px] tablet:pt-[20px] mobile:rounded-b-[20px] mobile:pb-[20px] mobile:pt-[20px]"
    >
      <div className="shell flex w-full flex-col gap-[40px] mobile:gap-[24px]">
        <LabelRow label={BAND.label} />

        <div className="flex items-center mobile:flex-col mobile:gap-[24px]">
          <div className="flex w-[300px] flex-none flex-col gap-[14px] narrow:w-[250px] mobile:w-full">
            {/* The words change, so the button carries no pressed state:
                with both, a screen reader said "Resume …, pressed", which
                contradicts itself. */}
            <button
              type="button"
              onClick={() => setRunning((v) => !v)}
              className="focus-ring t-mono-9 flex min-h-[44px] w-fit items-center text-ink-3 transition-colors duration-300 hover:text-ink"
            >
              {running ? 'PAUSE LOGOS' : 'RESUME LOGOS'}
            </button>
          </div>

          <div
            className="relative ml-[70px] flex-1 overflow-clip mobile:ml-0 mobile:w-full"
            style={{
              maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
              WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
            }}
          >
            <div
              className="marquee-track"
              style={{ animationDuration: '38s', animationPlayState: running ? 'running' : 'paused' }}
            >
              {/* One announced set, then two the reader is not told about. */}
              {MARKS.map((m) => (
                <Well key={m.name} mark={m} decorative={false} />
              ))}
              {[0, 1].map((copy) =>
                MARKS.map((m) => <Well key={`${copy}-${m.name}`} mark={m} decorative />),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
