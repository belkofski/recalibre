import { InView } from '@/lib/motion';
import { Chevron, Eyebrow } from '@/components/ui';
import { CAPABILITIES } from '@/content/home';

/* ============================================================================
   THE OPENER'S INDEX — the five chapters as anchor rows in the right half
   of the page head, so the page says what it holds before the reader
   scrolls: the ordinal, the title at card size, and the dot that fills
   under the pointer, each row a 44px target on a hairline. Plain anchors:
   the browser's own jump stops under the bar (globals.css,
   scroll-padding), and the sticky index takes over from there.
   ========================================================================= */
export default function CapabilityIndexList({ label }: { label: string }) {
  return (
    <InView delay={120} className="flex w-full flex-col gap-(--space-3)">
      <Eyebrow mark>{label}</Eyebrow>
      <ol className="m-0 flex w-full list-none flex-col border-t border-rule p-0">
        {CAPABILITIES.rows.map((row) => (
          <li key={row.slug} className="border-b border-rule">
            <a
              href={`#${row.slug}`}
              className="tap-44 group flex w-full items-center justify-between gap-(--space-4) py-(--space-2)"
            >
              <span className="flex min-w-0 items-baseline gap-(--space-4)">
                <span className="t-mono-11 w-[32px] shrink-0 tabular-nums text-ink-3">{row.n.replace('/', '')}</span>
                <span className="t-card text-ink transition-colors duration-300 group-hover:text-ink-2">{row.title}</span>
              </span>
              <span className="dot-btn">
                <Chevron />
              </span>
            </a>
          </li>
        ))}
      </ol>
    </InView>
  );
}
