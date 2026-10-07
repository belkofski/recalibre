'use client';

import { useRef } from 'react';
import { useActiveStep } from '@/lib/motion';
import { TickRule } from '@/components/ui';

/* ============================================================================
   THE STORY'S RULE. `ScrollStory` (lib/motion.tsx) owns no markup and
   reports the chapter being read as `data-active` on its root; the tick
   rule under the chapters lights to that chapter's place. It reads that
   one attribute (`useActiveStep`) rather than tracking the scroll a second
   time, so there is one reading of where the reader is, the story's, and
   the caption under the pinned screen (OpsCaption.tsx) reads the same
   one. On the server the first chapter is active, as the story marks it,
   and the rule prints lit to one part in `count`.
   ========================================================================= */

export default function OpsProgress({ count, className = '' }: { count: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useActiveStep(ref);
  return (
    <div ref={ref} className={className}>
      <TickRule lit={(active + 1) / count} />
    </div>
  );
}
