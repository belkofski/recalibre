import { ArtImg } from '@/lib/Img';
import SystemDiagram from '@/components/SystemDiagram';
import { Caption } from '@/components/ui';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import type { Article } from '@/content/insights';

/* ============================================================================
   AN ARTICLE'S ART, filling whatever box it is given.

   An article with a picture draws it; an article with none draws the
   Contraxis system diagram in the picture's place, as WorkCard does for a
   card with no photograph (28 September 2026). The box is the caller's:
   the featured card's 7/5 column, the small card's band, each with its
   own aspect per width (insights.css). This component only fills it.

   The picture sits in a `.settle` wrapper, so whichever reveal the box
   runs (clip on the featured card, the fade on a small card) the picture
   settles from its own scale as it shows, and `.media-zoom` lets the
   card's hover lean it 4%.

   THE DIAGRAM IS STILL A SCHEMATIC, so it prints "Schematic — not a
   screenshot" at the foot of its own ground, on the caption hairline, and
   its box is inset above the caption. The caption is hidden from a screen
   reader, which hears the diagram's own description instead.
   ========================================================================= */
export default function ArticleArt({
  article: a,
  sizes,
  sizesTall = 'calc(100vw - 40px)',
  lazy = true,
}: {
  article: Article;
  /** The CSS width the wide crop is drawn at, per breakpoint. */
  sizes: string;
  /** The CSS width the phone's own cut is drawn at. */
  sizesTall?: string;
  /** False for the one picture that stands at the top of its page. */
  lazy?: boolean;
}) {
  if (a.src) {
    return (
      <div className="settle absolute inset-0">
        <ArtImg
          src={a.src}
          srcTall={a.srcTall}
          media="(max-width: 809.98px)"
          alt={a.alt}
          lazy={lazy}
          sizes={sizes}
          sizesTall={sizesTall}
          /* Left-top, as the article cover draws it: a capture keeps its
             sidebar and header in frame whatever the box's shape. */
          className="media-fill media-zoom object-left-top"
        />
      </div>
    );
  }
  return (
    /* On the raised ground, not the page's: the box has the site's rounded
       edge only if it is a shade lighter than what it sits on. */
    <div className="absolute inset-0 bg-raised">
      <div className="settle absolute inset-0">
        <SystemDiagram preset="card" className="absolute inset-x-0 top-(--space-3) bottom-[60px]" />
      </div>
      <div aria-hidden="true" className="absolute inset-x-(--card-pad) bottom-(--space-3)">
        <Caption as="div">{DIAGRAM_CAPTION}</Caption>
      </div>
    </div>
  );
}
