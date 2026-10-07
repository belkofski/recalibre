import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { ArtImg } from '@/lib/Img';
import { Scene } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import { Card, FirmMark, Orbs } from '@/components/ui';
import { ABOUT as A } from '@/content/about';
import { SITE } from '@/content/site';
import Organized from '@/sections/about/Organized';
import Disciplines from '@/sections/about/Disciplines';
import Accountability from '@/sections/about/Accountability';
import Principles from '@/sections/home/Principles';

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

     the opener          the heading and its lede; at the right the room,
                         the seat facing the set           (this file)
     how we are organized  the heading, the sentence that says why, and
                         the two reasons as two cards of different widths
                                                sections/about/Organized
     the disciplines     the five drawn as an orbit around the firm's mark,
                         lit as the reader goes down; a stack on a phone
                                     sections/about/Disciplines, Orbit
     accountability      one person: the portrait, the statement, the note
                                           sections/about/Accountability
     the principles      the three rules, each its title and its rule
                                                sections/home/Principles

   WHAT CAME OFF in the third pass (the owner's note: too many words, the
   same blocks on two pages): the stages, which Home carries; the story's
   first paragraph under the lede; every label row over a heading; the
   second sentence of each card; the principles' explanations. Nothing was
   rewritten: each block keeps the owner's first sentence or its title.

   WHAT THE PAGE STILL DOES NOT SAY: the principal's name and title. Neither
   has been approved, and a title invented for a founder is still invented
   (content/about.ts). The portrait stands with no caption, on purpose.

   ONE MARKED PHRASE on the page, "whole program." in the opener.
   ========================================================================= */

/* ---------------------------------------------------------------------------
   THE ROOM. The firm's own art direction, the seat facing the set. Not
   another full-width band (the owner's note: every page's picture was the
   same shape): from 1200 up a portrait beside the opener's words, as tall
   as the window allows; from 600 to 1199 a 3:2 inset held to the right;
   on a phone a 4:5 inset, four fifths of the column, held to the right. The
   portrait crop serves the tall boxes and the wide crop the tablet's.

   It moves with the scroll: the box opens from its foot as it comes up (on
   a phone, where it starts below the first screen), the room drifts inside
   its oversized box for as long as it is in view, and the box steps back
   and dims as it leaves through the top. The defaults are the finished
   state (styles/scroll.css). The halo is the card's own orb set, drawn
   behind it on the page's ground.
   ------------------------------------------------------------------------ */
function Room() {
  return (
    <Scene end={0.75} className="about-room relative isolate">
      <span aria-hidden="true" className="absolute -inset-[12%] -z-10">
        <Orbs variant="card" />
      </span>
      <div className="about-room-box sx-open sx-recede">
        <Card radius={30} spot className="absolute inset-0 overflow-clip">
          <span className="sx-drift absolute inset-x-0 -inset-y-[10%] block">
            <ArtImg
              src="/img/plate-about-seat-a.jpg"
              srcTall="/img/plate-about-seat-tall-b.jpg"
              media="(min-width: 1200px), (max-width: 599.98px)"
              alt="A rendered room: a chair facing a wide screen showing the OPS overview, an ottoman beside it, against a deep blue wall."
              sizes="72vw"
              sizesTall="(min-width: 1200px) 560px, 80vw"
              className="media-fill"
            />
          </span>
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
      </div>
    </Scene>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHead lines={A.headline} mark="whole program." lede={A.lede} aside={<Room />} />
      <Organized />
      <Disciplines />
      <Accountability />
      <Principles />
    </>
  );
}
