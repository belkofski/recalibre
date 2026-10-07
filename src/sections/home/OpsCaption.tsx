'use client';

import { useRef } from 'react';
import { useActiveStep } from '@/lib/motion';

/* ============================================================================
   THE CAPTION UNDER THE PINNED SCREEN. The stage shows one capture at a
   time and each has its own caption, so the caption follows the chapter
   the story reports (`useActiveStep`, lib/motion.tsx: one reading of where
   the reader is, the story's). The four lines are drawn once, stacked in
   one grid cell so the tallest sets the foot's height and none is ever
   cut, and the one that is on fades in over the one going out; the
   chapter's ordinal sits at the right. The server prints the first
   chapter, as the story marks it, so the foot is complete without a
   script. No pager dots: the tick rule under the chapters is the count.
   ========================================================================= */

export default function OpsCaption({
  chapters,
  className = '',
}: {
  chapters: readonly { n: string; caption: string }[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useActiveStep(ref);
  return (
    <div ref={ref} className={`flex items-start justify-between gap-(--space-4) border-t border-rule pt-(--space-3) ${className}`}>
      <div className="ops-caption-lines min-w-0 flex-1">
        {chapters.map((ch, i) => (
          <p
            key={ch.n}
            className="ops-caption-line t-mono text-ink-3"
            data-on={i === active ? '' : undefined}
            aria-hidden={i === active ? undefined : true}
          >
            {ch.caption}
          </p>
        ))}
      </div>
      <span className="t-mono tabular-nums text-ink-3">{(chapters[active] ?? chapters[0])?.n}</span>
    </div>
  );
}
