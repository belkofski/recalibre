import { Rise } from '@/lib/motion';
import { MonoLink, Orbs, type GlyphName } from '@/components/ui';
import { CAPABILITIES } from '@/content/home';
import CapabilitySteps, { type CapabilityStep } from './CapabilitySteps';

/* ============================================================================
   WHAT WE DO — the five capabilities, walked by the scroll.

   The heading alone opens the block (its label row repeated it), with the
   way to the whole page at its right; the five follow in a pinned `Steps`
   block (CapabilitySteps.tsx). No photographs here (the third pass: the
   pictures that stood in the panels each belong to another page now);
   each capability is drawn, its glyph and its outline numeral. Its one
   line is its summary as written (ten words or fewer since the copy deck
   of 7 October 2026, so it prints whole), and the tags and the captions
   are left to /capabilities.
   ========================================================================= */

type Row = (typeof CAPABILITIES.rows)[number];

/** The glyph each capability carries, by its anchor on /capabilities: a
 *  drawn mark for the idea the title names, never a logo or a claim. */
const GLYPH: Record<Row['slug'], GlyphName> = {
  'agentic-ai': 'agent',
  'custom-software': 'software',
  'enterprise-systems': 'enterprise',
  'product-design': 'product',
  'brand-identity': 'brand',
};

export default function CapabilityIndex() {
  const C = CAPABILITIES;
  /* 'ALL CAPABILITIES' as the two-tone link: the first word dimmed. */
  const [lead, ...rest] = C.cta.label.split(' ');
  const rows: CapabilityStep[] = C.rows.map((row) => ({
    n: row.n.replace('/', ''),
    slug: row.slug,
    short: row.short,
    title: row.title,
    line: row.body,
    glyph: GLYPH[row.slug],
  }));

  return (
    <section aria-labelledby="cap-title" className="relative isolate w-full overflow-clip">
      <Orbs variant="section" />
      <div className="pad-x pad-top flex w-full flex-col items-center">
        <div className="shell flex w-full flex-wrap items-end justify-between gap-x-(--space-6) gap-y-(--space-3)">
          <Rise as="h2" id="cap-title" lines={C.headline} className="t-section text-ink" />
          <MonoLink href={C.cta.href} lead={lead} label={rest.join(' ') || C.cta.label} />
        </div>
      </div>
      <CapabilitySteps rows={rows} />
    </section>
  );
}
