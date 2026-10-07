import { ArtImg } from '@/lib/Img';
import SystemDiagram from '@/components/SystemDiagram';
import { Frame, type GlyphName } from '@/components/ui';
import type { Article } from '@/content/insights';

/* ============================================================================
   AN ARTICLE'S ART, and the two small helpers the insights pages share.

   ONE PICTURE, ONE PLACE (the third pass). Each article has a visual of its
   own and no two share one: human oversight draws the Contraxis diagram,
   focused on the one step a person takes ("A person decides"); offline-first
   draws the OPS field screen; right-to-left draws the OPS permit register.
   On the index a card serves the phone its own 4:3 cut of the screen below
   810; the article itself shows the desktop capture only.

   THE CAPTURE sits on the card's dotted ground in a device frame drawn by
   the page, at its own ratio, never taller than the well it is given
   (`.insights-shot`, insights.css), so nothing is cropped or boxed. It
   settles from 118% inside the frame's screen as its block comes in
   (`.sx-zoom`, read from the nearest Scene).

   THE DIAGRAM IS FOCUSED, not shown whole. It is drawn into a clip box and
   pushed in toward "A person decides" as its block comes into the window:
   from the right edge where the flow runs left to right, from the foot
   where it runs top to bottom (`.insights-focus`, insights.css). The rest
   state, which is also the state with scripts off or under reduced
   motion, is the focused one. The diagram keeps its own description for a
   screen reader; the "schematic" caption came off with the other captions.
   ========================================================================= */

/** The in-house glyph that stands for an article's subject. A subject the
 *  table does not know takes the document glyph. */
const SUBJECT_GLYPH: Readonly<Record<string, GlyphName>> = {
  'Agentic AI': 'agent',
  Operations: 'field',
  'Enterprise systems': 'enterprise',
};
export function subjectGlyph(subject: string): GlyphName {
  return SUBJECT_GLYPH[subject] ?? 'document';
}

/** The dek's first sentence: a card prints its title and one line. */
export function leadSentence(text: string): string {
  const m = text.match(/^.*?[.!?](?=\s|$)/);
  return m ? m[0] : text;
}

/** The Contraxis diagram in a clip box, pushed in toward the person's step.
 *  The box is the caller's (`className` places it). */
export function DiagramFocus({ className = '' }: { className?: string }) {
  return (
    <div className={`insights-focus ${className}`}>
      <div className="insights-focus-mask absolute inset-0">
        <div className="insights-focus-zoom absolute inset-0">
          <SystemDiagram preset="cover" className="absolute inset-0" />
        </div>
      </div>
    </div>
  );
}

/** A card's framed capture, filling the band it is given. */
export default function ArticleArt({
  article: a,
  sizes,
  sizesTall = 'calc(100vw - 40px)',
  lazy = true,
  inset = 'inset-(--space-4) mobile:inset-(--space-3)',
}: {
  article: Article;
  /** The CSS width the wide capture is drawn at, per breakpoint. */
  sizes: string;
  /** The CSS width the phone's own cut is drawn at. */
  sizesTall?: string;
  lazy?: boolean;
  /** How far the frame stands in from the band's edge. */
  inset?: string;
}) {
  if (!a.src) return null;
  return (
    <>
      <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />
      <div className={`absolute ${inset} flex flex-col`}>
        <div className="insights-well flex min-h-0 w-full flex-1 items-center justify-center">
          <Frame bare="mobile" className="w-fit max-w-full">
            <div className="sx-zoom">
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
      </div>
    </>
  );
}
