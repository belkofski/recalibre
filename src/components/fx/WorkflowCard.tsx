import Link from 'next/link';
import { order, type WorkflowSpec } from '@/lib/workflow';
import WorkflowIcon from '@/components/fx/WorkflowIcon';
import { Caption, Chevron } from '@/components/ui';
import { WORKFLOW_CAPTION } from '@/content/workflows';

/* ============================================================================
   THE WORKFLOW CARD — a pattern as a template card (4 November 2026).

   The reference's n8n-style template card: a chain of icon tiles joined by
   short connectors, the pattern's name under it and its meta line under
   that. It reads the same spec the canvas plays, in execution order, so
   the card and the canvas never disagree about a pattern. No script: the
   lift on hover is the stylesheet's (`.hover-lift`, `.spot`).

   Every card carries the caption "Pattern — not a deployment", because a
   chain of tiles named after real operations would otherwise read as a
   claim that the firm has run them for someone.
   ========================================================================= */

export default function WorkflowCard({
  spec,
  href,
  className = '',
  caption = true,
  captionText = WORKFLOW_CAPTION,
}: {
  spec: WorkflowSpec;
  /** The caption in the page's language (content/index.ts). */
  captionText?: string;
  /** Where the card goes, when it goes anywhere. */
  href?: string;
  className?: string;
  caption?: boolean;
}) {
  const ids = order(spec);
  const nodes = ids.map((id) => spec.nodes.find((n) => n.id === id)!);
  const body = (
    <>
      <div className="flex flex-wrap items-center gap-[6px]" aria-label={spec.description} role="img">
        {nodes.map((n, i) => (
          <span key={n.id} className="flex items-center gap-[6px]">
            {i > 0 ? <span className="h-px w-[14px] bg-rule-strong" aria-hidden="true" /> : null}
            <span
              data-kind={n.kind}
              className="wf-chip flex size-[40px] items-center justify-center rounded-[10px] border border-rule bg-raised-2 text-ink"
              title={n.label}
            >
              <span className="size-[18px]">
                <WorkflowIcon icon={n.icon} />
              </span>
            </span>
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-[6px]">
        <span className="t-question text-ink">{spec.title}</span>
        <span className="t-mono-11 text-ink-3">{spec.meta}</span>
      </div>
      {caption ? (
        <span className="-mx-(--card-pad) mt-auto block">
          <Caption as="div" className="px-(--card-pad)">
            {captionText}
          </Caption>
        </span>
      ) : null}
    </>
  );
  const cls = `card-24 spot hover-lift flex h-full flex-col gap-[20px] p-(--card-pad) ${className}`;
  if (href) {
    return (
      <Link href={href} className={`${cls} group`}>
        {body}
        <span className="flex items-center justify-end" aria-hidden="true">
          <span className="dot-btn">
            <Chevron />
          </span>
        </span>
      </Link>
    );
  }
  return <div className={cls}>{body}</div>;
}
