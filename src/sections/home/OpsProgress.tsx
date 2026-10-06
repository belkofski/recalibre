'use client';

import { useEffect, useRef, useState } from 'react';
import { TickRule } from '@/components/ui';

/* ============================================================================
   THE STORY'S RULE. `ScrollStory` (lib/motion.tsx) owns no markup and
   reports the chapter being read as `data-active` on its root; the tick
   rule under the chapters lights to that chapter's place. It reads the
   attribute through a MutationObserver rather than tracking the scroll a
   second time, so there is one reading of where the reader is, the
   story's. On the server the first chapter is active, as the story marks
   it, and the rule prints lit to one part in `count`.
   ========================================================================= */

export default function OpsProgress({ count, className = '' }: { count: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = ref.current?.closest<HTMLElement>('.story');
    if (!root || typeof MutationObserver === 'undefined') return;
    const mo = new MutationObserver(() => {
      const n = Number(root.dataset.active ?? 0);
      setActive(Number.isFinite(n) ? n : 0);
    });
    mo.observe(root, { attributes: true, attributeFilter: ['data-active'] });
    return () => mo.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      <TickRule lit={(active + 1) / count} />
    </div>
  );
}
