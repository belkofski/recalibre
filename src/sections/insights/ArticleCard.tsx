import Link from 'next/link';
import { InView, Spotlight } from '@/lib/motion';
import { Chevron, GlyphTile, cardClass } from '@/components/ui';
import { readingMinutes, type Article } from '@/content/insights';
import ArticleArt, { subjectGlyph } from './ArticleArt';

/* ============================================================================
   CARD/INSIGHT — one article as a card: on the Insights index (the two
   that are not featured) and under an article ("More insights").

   The card IS its reveal, so it can be staggered by its column (`step`),
   and it wears `cardClass` as WorkCard does. Its art stands over its
   words in a 16:10 band (a portrait block for the diagram below 1200,
   where a landscape band that narrow would draw the diagram as tiles
   alone; the phone's own 4:3 cut for a picture). The words keep the card
   vocabulary: the subject's glyph in a tile beside the meta in `t-mono` at
   50%, the title at `t-card`, the dek at `t-body` 60%, and a MonoLink-
   shaped foot whose line draws and whose dot fills on the card's hover.

   A SURFACE WITH A SPOTLIGHT, NO TILT (the direction change). The card is
   its own reveal, and a reveal transforms its own element, so the tilt
   cannot sit on it; the spotlight can, and does: the call site wraps the
   card in `Spotlight`, the card carries `.spot` and draws its own surface
   light as its first child. On a phone it lights as it passes the centre.
   Inside, the capture sits in a device frame on the dot grid; the
   diagram has the orbs behind it as well.

   One link per card: the title carries it with the overlay span, the art
   and the foot are drawing (28 September 2026). The heading is an H3
   wherever the card stands: under the featured article's H2 on the index
   and under "More insights." on an article.
   ========================================================================= */
export default function ArticleCard({ article: a, step = 0 }: { article: Article; step?: number }) {
  const href = `/insights/${a.slug}`;
  return (
    <Spotlight>
      <InView
        as="article"
        step={step}
        className={`${cardClass({ radius: 30, interactive: true, surface: true, spot: true })} flex flex-col overflow-clip`}
      >
        <span aria-hidden="true" className="spot-light" />
        <div
          className={`insights-card-art relative isolate w-full overflow-clip ${a.src ? 'insights-art-photo' : 'insights-art-figure'}`}
        >
          <ArticleArt article={a} layout="card" sizes="(max-width: 599px) 100vw, (max-width: 1199px) 50vw, 640px" />
        </div>

        <div className="flex flex-1 flex-col justify-between gap-(--space-5) p-(--card-pad)">
          <div className="flex flex-col gap-(--space-3)">
            <span className="flex items-center gap-(--space-2)">
              <GlyphTile sm name={subjectGlyph(a.subject)} />
              <span className="t-mono tabular-nums text-ink-3">
                {a.subject} · {readingMinutes(a)} MIN READ
              </span>
            </span>
            <h3 className="t-card text-ink">
              <Link href={href} className="tap-44">
                <span className="absolute inset-0" aria-hidden="true" />
                {a.title}
              </Link>
            </h3>
            <p className="t-body max-w-[510px] text-ink-2">{a.dek}</p>
          </div>
          <span className="t-mono hover-read flex items-center gap-(--space-1)">
            <span className="link-line">READ THE ARTICLE</span>
            <span className="dot-btn">
              <Chevron />
            </span>
          </span>
        </div>
      </InView>
    </Spotlight>
  );
}
