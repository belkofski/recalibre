import { InView } from '@/lib/motion';
import { SectionHead, MonoLink, Chip } from '@/components/ui';
import { ABOUT as A } from '@/content/about';
import { CAPABILITIES, STAGES_FLOW } from '@/content/home';

/* ============================================================================
   HOW WE ARE ORGANIZED — where the reference lists its track record.

   Recalibre publishes no client, so the block carries the reason the firm
   is shaped the way it is: the story's second and third paragraphs, one to
   a column from 1200 up, and under them on a hairline the two index rows,
   the stages and the disciplines, as chips. The first paragraph is read in
   the opener, beside the heading, and is not repeated here.

   The chips' words are the content's own: the stage labels from the flow
   rail (content/home.ts, STAGES_FLOW) and the discipline titles from the
   list below (content/about.ts), set in capitals. Nothing here is typed in
   twice. No marked word: the page has one, "whole program." in its opener.

   THE WAY OUT OF THE BLOCK is the label row's link (6 October 2026): ALL
   CAPABILITIES, to the capabilities page, which took over from the sticky
   capability deck that used to run under this block on About.
   ========================================================================= */

/** 'Agentic AI.' → 'AGENTIC AI'. */
const asChip = (title: string) => title.replace(/\.$/, '').toUpperCase();

function ChipRow({ label, items, step }: { label: string; items: readonly string[]; step: number }) {
  return (
    <InView step={step} className="flex flex-col gap-(--space-3)">
      <p className="t-mono text-ink-3">{label}</p>
      <ul className="flex flex-wrap gap-(--space-1)">
        {items.map((s) => (
          <li key={s} className="flex">
            <Chip>{s}</Chip>
          </li>
        ))}
      </ul>
    </InView>
  );
}

export default function Organized() {
  // The link's two words are the content's own label, split for the
  // MonoLink's dimmed lead and lit word.
  const [lead, ...rest] = CAPABILITIES.cta.label.split(' ');
  return (
    <section aria-labelledby="story-head" className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-alone)">
        <SectionHead
          id="story-head"
          label="HOW WE ARE ORGANIZED"
          lines={A.story.heading}
          right={<MonoLink href={CAPABILITIES.cta.href} lead={lead} label={rest.join(' ')} />}
        />

        <div className="flex w-full flex-col gap-(--space-6)">
          <div className="grid w-full grid-cols-2 gap-x-(--space-8) gap-y-(--space-4) narrow:grid-cols-1">
            {A.story.paragraphs.slice(1).map((p, i) => (
              <InView key={p.slice(0, 24)} step={i}>
                <p className="t-body max-w-[560px] text-ink-2">{p}</p>
              </InView>
            ))}
          </div>

          <div className="grid w-full grid-cols-2 gap-x-(--space-8) gap-y-(--space-5) border-t border-rule pt-(--space-4) narrow:grid-cols-1">
            <ChipRow label="THE STAGES" items={STAGES_FLOW.nodes.map((n) => n.label)} step={0} />
            <ChipRow label="THE DISCIPLINES" items={A.disciplines.map((d) => asChip(d.title))} step={1} />
          </div>
        </div>
      </div>
    </section>
  );
}
