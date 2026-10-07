import { InView, Ordinal, ScrollStory, Stack } from '@/lib/motion';
import { Card, GlyphTile, LabelRow, Numeral, Orbs } from '@/components/ui';
import { ABOUT as A } from '@/content/about';
import Orbit, { ORBIT_GLYPHS } from '@/sections/about/Orbit';
import OrbitLive from '@/sections/about/OrbitLive';

/* ============================================================================
   THE DISCIPLINES — the five that carry an engagement, as a system.

   The reference runs a four-portrait team grid here. Recalibre publishes
   no employee, so the grid has been the disciplines since the page was
   built; on the owner's audit the five cards became one list on a spine,
   and on the owner's verdict on that list ("plain words with zero design") the
   spine came off. The five are drawn now: an ORBIT of five glyph nodes
   around the firm's mark (Orbit.tsx), the node of the chapter being read
   lit, beside the five chapters read in turn.

   From 1200 up it is a scroll story (`ScrollStory`): the chapters in the
   left column, each a room half a window tall with its outline numeral,
   its tile, its ordinal, its title and its body; the orbit pinned in the
   right column on a dot-grid surface with its own light, following the
   chapter (OrbitLive.tsx writes the chapter on the drawing). The chapter
   not being read dims to half.

   Below 1200 the orbit stands first, square on a tablet and portrait on a
   phone with node 01 lit, and the five chapters follow as a STACK of
   cards that slide over one another (`Stack`), each lighting as it passes
   the centre of the screen. Sticky is CSS, so the stack is a plain,
   complete column without scripts.

   THE ORDINALS name a place on the ring, as a chapter number names a
   place in a case study; the content keeps `n` for exactly that. The
   disciplines are not in an order of merit, and the drawing is a ring for
   that reason.

   NO HEADING OF ITS OWN. The content carries no headline for this block,
   and none is invented: it opens on its label row, and its chapters are
   h3s under the organized block's "Why it is structured this way.", whose
   first paragraph names these five as one capability; the orbit is that
   sentence, drawn.
   // TODO(content): a headline for the disciplines block, if the owner
   // wants one over the drawing.
   ========================================================================= */

/** The drawing on its bed: a dot grid and the card's own light under it,
 *  then the orbit filling the inset box. One markup for the pinned card
 *  and the narrow head card; the box's inset is the stylesheet's. */
function Bed({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />
      <Orbs variant="card" />
      <div className="about-orbit-box">{children}</div>
    </>
  );
}

export default function Disciplines() {
  return (
    <section aria-label="The disciplines" className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-label)">
        <LabelRow label="THE DISCIPLINES" />

        {/* FROM 1200 UP: the chapters beside the pinned orbit. The first
            chapter is marked on by the server, so the page is finished
            without a script. */}
        <ScrollStory className="about-story grid w-full grid-cols-[5fr_7fr] items-start gap-x-(--space-6) narrow:hidden">
          <ol className="flex w-full flex-col">
            {A.disciplines.map((d, i) => (
              <li
                key={d.n}
                data-step=""
                data-on={i === 0 ? '' : undefined}
                className="relative flex min-h-[50vh] flex-col justify-center"
              >
                {/* The outline numeral stands at the room's top, where the
                    words never reach on a window of ordinary height; the
                    words are positioned so that where they do, on a short
                    window, they paint over the outline and not under it. */}
                <Numeral n={d.n} className="about-numeral -left-[8px] -top-[24px]" />
                <InView className="relative">
                  <div className="story-dim flex flex-col gap-(--space-3)">
                    <GlyphTile name={ORBIT_GLYPHS[d.n]} />
                    <Ordinal n={d.n} className="t-mono-11 text-ink-3" />
                    <h3 className="t-card text-ink">{d.title}</h3>
                    <p className="t-body max-w-[440px] text-ink-2">{d.body}</p>
                  </div>
                </InView>
              </li>
            ))}
          </ol>

          {/* The drawing must live inside the story's root: OrbitLive finds
              the story by walking up from here. */}
          <div className="story-pin w-full">
            <Card radius={30} className="relative aspect-square w-full max-h-[calc(100svh-var(--bar)-64px)]">
              <Bed>
                <OrbitLive>
                  <Orbit layout="square" />
                </OrbitLive>
              </Bed>
            </Card>
          </div>
        </ScrollStory>

        {/* BELOW 1200: the orbit at the head, still, then the chapters as a
            stack. The square drawing on a tablet, the portrait on a phone;
            both are sent, and the width shows one. */}
        <div className="hidden w-full narrow:flex narrow:flex-col narrow:gap-(--space-5)">
          <Card radius={30} className="about-orbit-card relative w-full">
            <Bed>
              <Orbit layout="square" className="phone:hidden" />
              <Orbit layout="portrait" className="hidden phone:block" />
            </Bed>
          </Card>

          <Stack>
            {A.disciplines.map((d) => (
              /* A stack card is the stack's own child and takes no
                 `relative`: the sticky is the stylesheet's. The spotlight's
                 wrapper lays out nothing, so the card still is. */
              <Card key={d.n} radius={24} pad spot as="article" data-stack-card="" className="stack-card flex flex-col gap-(--space-3)">
                <Numeral n={d.n} className="about-numeral-sm right-(--card-pad) top-(--card-pad)" />
                <div className="flex items-center gap-(--space-3)">
                  <GlyphTile name={ORBIT_GLYPHS[d.n]} sm />
                  <Ordinal n={d.n} className="t-mono-11 text-ink-3" />
                </div>
                <h3 className="t-card text-ink">{d.title}</h3>
                <p className="t-body text-ink-2">{d.body}</p>
              </Card>
            ))}
          </Stack>
        </div>
      </div>
    </section>
  );
}
