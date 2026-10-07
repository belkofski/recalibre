import Link from 'next/link';
import { InView, Spotlight } from '@/lib/motion';
import { cardClass, Chevron, type GlyphName, GlyphTile, LabelRow, Status } from '@/components/ui';
import { initiativeBySlug, type Initiative } from '@/content/work';

/* ============================================================================
   IN THE WORK — the initiatives that show a capability in use, under its
   chapter: compact link tiles, not work cards (the pictures belong to /work
   and the chapter has just shown its own). Each tile is one link carrying
   the card (`cardClass` on the link itself, as WorkCard does): the
   initiative's glyph in a tile, the name at card size, the year and the
   field, the initiative's status as the one `Status` shape on its own
   line, and the dot at the right that fills under the pointer. The surface
   lights under the pointer (and as it passes the centre of a phone's
   screen); pressed, the tile gives 2%.

   The names come off `related` in content/home.ts and resolve through
   content/work.ts, so a tile prints only an initiative that has a page. A
   capability with no related work (03, until a systems proof that is not
   OPS exists) prints nothing here at all: no label, no empty plate.
   ========================================================================= */

/** The glyph each initiative carries, by slug: the idea its page is about,
 *  as the content names it (field work, a document, a brand, an identity),
 *  never its mark. An initiative added without one takes the layered
 *  glyph, the plainest in the set. */
export const INITIATIVE_GLYPH: Readonly<Record<string, GlyphName>> = {
  ops: 'field',
  contraxis: 'document',
  'abp-continental': 'brand',
  belkofski: 'identity',
};

export default function RelatedWork({
  slugs,
  label,
  className = '',
}: {
  slugs: readonly string[];
  label: string;
  className?: string;
}) {
  const items = slugs.map((s) => initiativeBySlug(s)).filter((i): i is Initiative => Boolean(i));
  if (items.length === 0) return null;
  return (
    <div className={`flex w-full flex-col gap-(--space-4) ${className}`}>
      <LabelRow label={label} />
      {/* Two tiles side by side where there are two, one full-width tile
          where there is one: a seam plate never shows an empty cell. */}
      <div className={`seam-sm grid ${items.length > 1 ? 'grid-cols-2 phone:grid-cols-1' : 'grid-cols-1'}`}>
        {items.map((item, i) => (
          /* The reveal wraps the list cell; the spotlight wrapper lays out
             nothing and writes the light's place on the link, which is
             the card. */
          <InView key={item.slug} step={i} className="flex phone:[--in-delay:0ms]!">
            <Spotlight>
              <Link
                href={`/work/${item.slug}`}
                aria-label={`${item.name}: ${item.category}`}
                className={`${cardClass({ radius: 24, pad: true, interactive: true, surface: true, spot: true })} press caps-related w-full`}
              >
                <span aria-hidden="true" className="spot-light" />
                <GlyphTile name={INITIATIVE_GLYPH[item.slug] ?? 'layers'} />
                <span className="flex min-w-0 flex-col gap-(--space-2)">
                  <span className="t-card text-ink">{item.name}</span>
                  <span className="t-mono tabular-nums text-ink-3">
                    {item.year} · {item.category}
                  </span>
                  <Status state={item.tone === 'dev' ? 'development' : 'delivered'} className="text-ink-2">
                    {item.status}
                  </Status>
                </span>
                <span className="dot-btn">
                  <Chevron />
                </span>
              </Link>
            </Spotlight>
          </InView>
        ))}
      </div>
    </div>
  );
}
