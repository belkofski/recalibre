import { GlyphTile, type GlyphName } from '@/components/ui';

/* ============================================================================
   THE TYPE PLATE — chapter 03's visual, which is no picture at all.

   No systems proof that is not OPS exists (the permits register is on the
   Work square, the overview on the television, the report on chapter 02),
   and the owner's Phase A brief chose an honest empty slot over fake proof.
   So the plate carries the chapter's own three tags, each as a glyph tile
   and the words at card size, three equal rows on the dotted ground the
   chapter's card draws, with a hairline at the foot of the first two rows
   that lights under the pointer. It reads as a drawn panel of three parts,
   not as words pushed to a corner, and it never pretends to be a system.

   Hidden from assistive technology: the three tags are read once, as the
   chips under the chapter's title; this is their picture.
   ========================================================================= */

/** One glyph per tag, in the order the content prints them: the legacy
 *  estate, the consolidated data, the connected workflow. */
const PLATE_GLYPHS: readonly GlyphName[] = ['enterprise', 'data', 'workflow'];

export default function TypePlate({ tags }: { tags: readonly string[] }) {
  return (
    <div aria-hidden="true" className="absolute inset-(--card-pad) grid grid-rows-3">
      {tags.map((t, i) => (
        <div key={t} className="relative flex items-center gap-(--space-4)">
          <GlyphTile name={PLATE_GLYPHS[i] ?? 'system'} />
          <p className="t-card text-ink">{t}</p>
          {/* The rule is the row's own child, so it lights while the row is
              under the pointer; its light follows the card's `--mx`, offset
              by the plate's inset (`.caps-plate-rule`, capabilities.css). */}
          {i < tags.length - 1 ? <span className="lit-rule caps-plate-rule absolute bottom-0 left-0" /> : null}
        </div>
      ))}
    </div>
  );
}
