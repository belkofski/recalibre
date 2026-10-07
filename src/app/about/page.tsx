import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { ArtImg } from '@/lib/Img';
import { InView, Parallax } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import { Card, FirmMark, MonoLink, Orbs } from '@/components/ui';
import { ABOUT as A } from '@/content/about';
import { SITE } from '@/content/site';
import { split } from '@/sections/about/split';
import Organized from '@/sections/about/Organized';
import Disciplines from '@/sections/about/Disciplines';
import Accountability from '@/sections/about/Accountability';
import Principles from '@/sections/home/Principles';
import Stages from '@/sections/home/Engagement';

export const metadata: Metadata = pageMeta({
  title: 'About — a firm built to carry the whole program',
  description:
    'Recalibre is a strategy, design and technology firm. Strategy, design, agentic AI, automation and engineering are one integrated capability, carried by one team.',
  path: '/about',
  image: '/img/og-about-a.jpg',
  imageAlt: 'A rendered room: a chair facing a wide screen showing the OPS overview, an ottoman beside it, against a deep blue wall.',
});

/* ============================================================================
   ABOUT — the firm, section for section.

     the opener              heading left with its lede, the story's first
                             paragraph under it as the two-tone statement,
                             and the way down the page: THE STAGES. At the
                             right, the room: the seat facing the set, on a
                             surface card that leans toward the pointer,
                             haloed by its own light          (this file)
     how we are organized    the story's two paragraphs as two numbered
                             glyph cards, the stages rail under them, ALL
                             CAPABILITIES              sections/about/Organized
     the disciplines         the five drawn as an orbit around the firm's
                             mark, lit chapter by chapter; a stack on a
                             phone         sections/about/Disciplines, Orbit
     accountability          one person: the portrait on a dot-grid card,
                             the statement, the note
                                              sections/about/Accountability
     why Recalibre           the principles, the homepage's own
                                                    sections/home/Principles
     how we work             the three stages, one button in card 01,
                             where the page's own content ends; the footer
                             carries the final call  sections/home/Engagement

   WHAT CAME OFF: the wide media band under the opener (the room is in the
   opener now, beside the words, and the full-width picture went with the
   owner's verdict on a page that read as a document); the chip rows under
   the story (the rail and the orbit are those lists, drawn); the
   disciplines' spine. Earlier: the sticky capability deck, which has a
   page of its own, and the FAQ tail, read on Contact only.

   WHAT THE PAGE STILL DOES NOT SAY: the principal's name and title. Neither
   has been approved, and a title invented for a founder is still invented
   (content/about.ts). The portrait stands with no caption, on purpose.

   ONE MARKED PHRASE on the page, "whole program." in the opener; no other
   heading here carries one. Every h2 is the section size; the opener is
   the page's one display voice.
   ========================================================================= */

/* ---------------------------------------------------------------------------
   THE ROOM. The firm's own art direction, the seat facing the set, with its
   own phone cut: beside the opener's words from 1200 up (4:3), under them
   on a tablet (16:10) and on a phone (4:5, the tall plate).

   It is a picture card that answers: a surface whose ring sits over the
   picture, revealed from its foot upward while the room settles inside;
   from 1200 up the room drifts with the scroll at a sixth of its speed
   (the Parallax box is the card's direct child, measured off the card,
   and 6% taller than it so no edge shows); under the pointer the card
   lights at its edge and leans toward it up to five degrees while the
   room, in the tilt layer, leans the other way, oversized so the shift
   never shows an edge. On a phone it lights as it holds the centre of the
   screen. Reduced motion: no tilt, no drift, the fade alone.

   The light around it is a halo: the card's own orb set drawn in a box
   12% larger than the card, behind it on the page's ground, so the glow
   sits around the card's edges and never on the picture. The wordmark at
   the foot stays outside the drift: it belongs to the frame, not the
   picture. The foot's darkening is in the plate, so the page dims nothing.
   ------------------------------------------------------------------------ */
function Room() {
  return (
    <div className="relative isolate">
      <span aria-hidden="true" className="absolute -inset-[12%] -z-10">
        <Orbs variant="card" />
      </span>
      <InView mode="clip" className="aspect-[4/3] tablet:aspect-[16/10] mobile:aspect-[4/5]">
        <Card radius={30} spot tilt className="h-full overflow-clip">
          <Parallax speed={0.06} className="absolute inset-x-0 -inset-y-[6%]">
            <span className="tilt-layer absolute -inset-[6%] block">
              <span className="settle absolute inset-0 block">
                <ArtImg
                  src="/img/plate-about-seat-a.jpg"
                  srcTall="/img/plate-about-seat-tall-b.jpg"
                  media="(max-width: 809.98px)"
                  alt="A rendered room: a chair facing a wide screen showing the OPS overview, an ottoman beside it, against a deep blue wall."
                  sizes="(max-width:1199px) 100vw, 690px"
                  sizesTall="100vw"
                  className="media-fill"
                />
              </span>
            </span>
          </Parallax>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end p-(--panel-pad)">
            <span className="flex items-center gap-(--space-1)">
              <FirmMark className="text-white" />
              <span className="t-mark text-ink">
                {SITE.name}
                <span className="t-mark-r">{SITE.mark}</span>
              </span>
            </span>
          </div>
        </Card>
      </InView>
    </div>
  );
}

export default function AboutPage() {
  const [claim, reason] = split(A.story.paragraphs[0]);
  return (
    <>
      <PageHead lines={A.headline} mark="whole program." lede={A.lede} aside={<Room />}>
        {/* The story's first paragraph, under the lede: the claim at lede
            size in full ink, the reason in the second tint. */}
        <InView delay={120} className="flex flex-col items-start gap-(--space-5)">
          <p className="t-lede max-w-[560px] text-ink">
            {claim}
            {reason ? <span className="text-ink-2"> {reason}</span> : null}
          </p>
          <MonoLink href="#stages" lead="THE" label="STAGES" />
        </InView>
      </PageHead>

      <Organized />
      <Disciplines />
      <Accountability />
      <Principles />

      {/* Stages takes no props, so the anchor the opener's link lands on is
          a wrapper; the bar's scroll padding (globals.css) keeps the
          section's label clear of it. */}
      <div id="stages">
        <Stages />
      </div>
    </>
  );
}
