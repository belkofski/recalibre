import { ArtImg } from '@/lib/Img';
import SystemDiagram from '@/components/SystemDiagram';
import { Caption, Frame, Orbs, type GlyphName } from '@/components/ui';
import { DIAGRAM_CAPTION } from '@/lib/diagram';
import type { Article } from '@/content/insights';

/* ============================================================================
   AN ARTICLE'S ART, filling whatever box it is given.

   An article with a picture draws it; an article with none draws the
   Contraxis system diagram in the picture's place, as WorkCard does for a
   card with no photograph (28 September 2026). The box is the caller's:
   the featured card's 7/5 column, the small card's band, each with its
   own aspect per width (insights.css). This component only fills it.

   THE CAPTURE IS AN OBJECT NOW (the direction change). It used to cover
   the box edge to edge with its caption laid over its foot on a dark veil;
   the owner read that as a screenshot dropped in a box. Now the box is a
   surface — a faint dot grid on the card's ground, the ambient orbs, and a
   sheen that sweeps once as the box comes in — and the capture sits on it
   in a device frame (`Frame`, drawn by the page: a bezel, a window bar, a
   screen), shown whole (`object-fit: contain`, so no edge of the OPS
   screen is cut), with its own note on the caption hairline under the
   frame. On the featured card the frame rides a `.tilt-layer`, so it leans
   the other way as the card tilts toward the pointer; the small card does
   not tilt, so its frame sits still and the card's spotlight is its answer.
   Below 810 the frame drops its bar (`bare="mobile"`): the phone cut is a
   phone-shaped capture with no window to show.

   THE FRAME TAKES THE PICTURE'S OWN SHAPE. The capture is not stretched
   over a box and contained inside it (a box of the wrong shape left a black
   strip beside the screen): it flows at its own ratio, as wide as the well
   allows and never taller than the room above the note (`.insights-shot`,
   insights.css, measured in the well's own container units), and the frame
   is drawn to fit around it, centred in the well. A phone's cut is a 4:3
   capture and a desktop's is 16:9, and the frame simply follows whichever
   the browser served; the bands' aspects (insights.css) are set so the
   frame fills the band's width at each of the three widths.

   THE DIAGRAM IS STILL A SCHEMATIC, so it prints "Schematic — not a
   screenshot" at the foot of its own ground, on the caption hairline, and
   its box is inset above the caption. The caption is hidden from a screen
   reader, which hears the diagram's own description instead; the capture's
   note is hidden the same way, because its alt already says it.
   ========================================================================= */

/** The in-house glyph that stands for an article's subject: the card and
 *  the article page draw it in a tile beside the subject's name, so the
 *  three subjects read as three marks and not three strings. A subject
 *  the table does not know takes the document glyph. */
const SUBJECT_GLYPH: Readonly<Record<string, GlyphName>> = {
  'Agentic AI': 'agent',
  Operations: 'field',
  'Enterprise systems': 'enterprise',
};
export function subjectGlyph(subject: string): GlyphName {
  return SUBJECT_GLYPH[subject] ?? 'document';
}

export default function ArticleArt({
  article: a,
  sizes,
  sizesTall = 'calc(100vw - 40px)',
  lazy = true,
  layout = 'card',
}: {
  article: Article;
  /** The CSS width the wide crop is drawn at, per breakpoint. */
  sizes: string;
  /** The CSS width the phone's own cut is drawn at. */
  sizesTall?: string;
  /** False for the one picture that stands at the top of its page. */
  lazy?: boolean;
  /** `feature`: the tilting featured card, with the orbs and the sheen and
   *  the frame on a tilt layer. `card`: the small card's band, which does
   *  not tilt and lights its orbs behind the diagram only. */
  layout?: 'feature' | 'card';
}) {
  const feature = layout === 'feature';
  /* The frame and its note, or the diagram and its caption, inset from
     the box's edge by the card's own step: the panel step on the featured
     card, the card step on the small one, 16 on a phone. */
  const inset = feature ? 'inset-(--space-5) mobile:inset-(--space-3)' : 'inset-(--space-4) mobile:inset-(--space-3)';

  /* The ground every variant shares: the dot grid on the surface. Drawn on
     a child, because the surface's own background-image would override a
     class on the card; negative z, so it paints over the fill and under
     everything else in the box. */
  const dots = <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />;

  if (a.src) {
    /* The well is whatever room the column leaves above the note; the
       frame wraps the picture and is centred in it. */
    const frame = (
      <div className="insights-well flex min-h-0 w-full flex-1 items-center justify-center">
        <Frame bare="mobile" className="w-fit max-w-full">
          <div className="settle">
            <ArtImg
              src={a.src}
              srcTall={a.srcTall}
              media="(max-width: 809.98px)"
              alt={a.alt}
              lazy={lazy}
              sizes={sizes}
              sizesTall={sizesTall}
              className="insights-shot"
            />
          </div>
        </Frame>
      </div>
    );
    /* AN OPS SCREEN SAYS WHAT DATA IT CARRIES wherever it shows (the
       owner, 25 September 2026): the article's own note on the caption
       hairline under the frame, on the surface. */
    const note = a.note ? (
      <div aria-hidden="true" className="w-full">
        <Caption as="div">{a.note}</Caption>
      </div>
    ) : null;
    const column = `absolute ${inset} flex flex-col gap-(--space-3)`;
    return (
      <>
        {dots}
        {feature ? (
          <>
            <Orbs variant="card" />
            <span aria-hidden="true" className="sheen" />
            <span className={`tilt-layer ${column}`}>
              {frame}
              {note}
            </span>
          </>
        ) : (
          <div className={column}>
            {frame}
            {note}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {dots}
      <Orbs variant="card" />
      {feature ? <span aria-hidden="true" className="sheen" /> : null}
      <div className={`absolute ${inset}`}>
        <div className="settle absolute inset-0">
          <SystemDiagram preset="card" className="absolute inset-x-0 top-0 bottom-[44px]" />
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0">
          <Caption as="div">{DIAGRAM_CAPTION}</Caption>
        </div>
      </div>
    </>
  );
}
