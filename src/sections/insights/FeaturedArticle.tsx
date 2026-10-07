import Link from 'next/link';
import { InView } from '@/lib/motion';
import { Card, Chevron, Eyebrow, GlyphTile } from '@/components/ui';
import { INSIGHTS_BLOCK as I, readingMinutes, type Article } from '@/content/insights';
import ArticleArt, { subjectGlyph } from './ArticleArt';

/* ============================================================================
   THE FEATURED ARTICLE — the first in the list, on the Insights index.

   "First", not "most recent": no article carries a date (see
   content/insights.ts), so the list's order is the only order there is.

   One `Card` on a seam plate, split 7/5 from 1200 up: the art in the wider
   column, revealed from its foot upward (the clip tier, the entrance every
   large picture takes), and the words in the narrower one. Below 1200 the
   art stands over the words. The split mirrors the work index's featured
   OPS card (5/7, words first), so the two indexes open the same way round.

   A SURFACE THAT ANSWERS (the direction change). The card was a flat
   rectangle with a picture over words; it is a lit surface now, and it
   leans toward the pointer (`tilt`, up to 5°) while the framed capture on
   its tilt layer leans the other way, the spotlight lights the edge and
   the ground under the pointer, and the dot in the foot fills. On a phone
   the same card lights as it passes the centre of the screen. The card
   wraps itself in the two scripts; the two reveals live inside it, which
   is allowed: only one element must never carry both a reveal and the
   tilt, and here the tilt is the card's and the reveals are its children.

   ONE LINK, NOT THREE (28 September 2026). The picture, the title and the
   READ control were three links to the same article, which a screen
   reader announces three times over. The title carries the link and an
   overlay makes the whole card clickable; the picture and the control
   are drawing. The dot in the foot fills on the card's own hover
   (`interactive`), because the control is not the link.

   THE TITLE IS THE PAGE'S SECOND VOICE: `t-section`, a step under
   "Insights." (the brief, §6.10), where the small cards' titles are
   `t-card`. The words column takes the panel padding, not the card's:
   a 560px column at 32px reads as a card; at 50px it reads as a plate.
   The subject is a glyph in a tile beside its name, so the three subjects
   read as marks.
   ========================================================================= */
export default function FeaturedArticle({ article: a }: { article: Article }) {
  const href = `/insights/${a.slug}`;
  return (
    <div className="seam flex w-full">
      <Card radius={30} interactive spot tilt as="article" className="insights-feature w-full overflow-clip">
        <InView
          mode="clip"
          className={`insights-feature-art relative isolate overflow-clip ${a.src ? 'insights-art-photo' : 'insights-art-figure'}`}
        >
          <ArticleArt article={a} layout="feature" lazy={false} sizes="(max-width: 1199px) 100vw, 740px" />
        </InView>

        <InView
          delay={150}
          className="flex flex-col justify-between gap-(--space-6) p-(--panel-pad) narrow:gap-(--space-5)"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-(--space-3) gap-y-(--space-2)">
            <Eyebrow as="span" mark>
              {I.featuredLabel}
            </Eyebrow>
            <span className="flex items-center gap-(--space-2)">
              <GlyphTile sm name={subjectGlyph(a.subject)} />
              <span className="t-mono tabular-nums text-ink-3">
                {a.subject} · {readingMinutes(a)} MIN READ
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-(--space-4)">
            <h2 className="t-section text-ink">
              <Link href={href} className="tap-44">
                <span className="absolute inset-0" aria-hidden="true" />
                {a.title}
              </Link>
            </h2>
            <p className="t-lede max-w-[460px] text-ink-2">{a.dek}</p>
          </div>

          {/* The words carry the link line (depth.css): the hairline draws
              under them with the card's hover, as the dot fills. */}
          <span className="t-mono hover-read flex items-center gap-(--space-1)">
            <span className="link-line">READ THE ARTICLE</span>
            <span className="dot-btn">
              <Chevron />
            </span>
          </span>
        </InView>
      </Card>
    </div>
  );
}
