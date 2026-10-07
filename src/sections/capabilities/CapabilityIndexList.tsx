import { InView, Ordinal, Spotlight } from '@/lib/motion';
import { cardClass, Chevron, Eyebrow, GlyphTile } from '@/components/ui';
import { CAPABILITIES } from '@/content/home';
import { CAPABILITY_GLYPH } from './CapabilityChapter';

/* ============================================================================
   THE OPENER'S INDEX — the five chapters as link tiles in the right half of
   the page head, so the page says what it holds before the reader scrolls.
   Each tile is one anchor carrying the card: the capability's glyph in a
   tile, the ordinal rolling in, the title at lede size (an index entry,
   not a card title: five must fit the opener), and the dot that fills
   under the pointer. The surface lights under the pointer and, on a phone,
   as it passes the centre of the screen; pressed, the tile gives 2%. The
   tiles arrive one after another, 60ms apart.

   Plain anchors: the browser's own jump stops under the bar (globals.css,
   scroll-padding), and the sticky index takes over from there. With
   scripts off they are exactly that, and every tile is drawn.
   ========================================================================= */
export default function CapabilityIndexList({ label }: { label: string }) {
  return (
    <InView delay={120} className="flex w-full flex-col gap-(--space-3)">
      <Eyebrow mark>{label}</Eyebrow>
      <ol className="seam-sm flex w-full flex-col">
        {CAPABILITIES.rows.map((row, i) => (
          /* The list item wraps its own reveal and spotlight, so the list
             stays a list to assistive technology. */
          <li key={row.slug}>
            <InView delay={i * 60}>
              <Spotlight>
                <a
                  href={`#${row.slug}`}
                  className={`${cardClass({ radius: 24, interactive: true, surface: true, spot: true })} press caps-index-tile`}
                >
                  <span aria-hidden="true" className="spot-light" />
                  <GlyphTile name={CAPABILITY_GLYPH[row.slug]} />
                  <Ordinal n={row.n.replace('/', '')} className="t-mono-11 text-ink-3" />
                  <span className="t-lede text-ink">{row.title}</span>
                  <span className="dot-btn">
                    <Chevron />
                  </span>
                </a>
              </Spotlight>
            </InView>
          </li>
        ))}
      </ol>
    </InView>
  );
}
