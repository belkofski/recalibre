import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import { MonoLink } from '@/components/ui';
import { ABOUT as A } from '@/content/about';
import MediaBand from '@/sections/about/MediaBand';
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
   ABOUT — the firm, section for section (the owner's audit, 6 October 2026).

     the split opener        heading left with its lede, the story's first
                             paragraph right at lede size, and the way down
                             the page: THE STAGES
     the wide media band     the room, revealed from its foot and drifting
                             with the scroll        sections/about/MediaBand
     how we are organized    the story's two paragraphs, the stage and
                             discipline chips, ALL CAPABILITIES
                                                    sections/about/Organized
     the disciplines         the five, on a spine that draws, 01–05
                                                    sections/about/Disciplines
     accountability          one person, the portrait, the note
                                                    sections/about/Accountability
     why Recalibre           the principles, the homepage's white panel
                                                    sections/home/Principles
     how we work             the three stages, one button in card 01,
                             where the page's own content ends; the footer
                             carries the final call  sections/home/Engagement

   WHAT CAME OFF: the sticky capability deck (sections/home/Capabilities.tsx,
   deleted) — the capabilities have a page of their own now, and this block
   reaches it from the organized block's label row. The FAQ tail came off
   on 27 September 2026: it is read on Contact only since 6 October 2026.

   WHAT THE PAGE STILL DOES NOT SAY: the principal's name and title. Neither
   has been approved, and a title invented for a founder is still invented
   (content/about.ts). The portrait stands with no caption, on purpose.

   ONE MARKED PHRASE on the page, "whole program." in the opener (C7, 28
   September 2026); no other heading here carries one. Every h2 is the
   section size; the opener is the page's one display voice.
   ========================================================================= */

/** The story's first paragraph is two sentences; the first carries the
 *  claim and is set in full ink, the second explains it and steps back. */
function split(paragraph: string): [string, string] {
  const cut = paragraph.indexOf('. ');
  if (cut === -1) return [paragraph, ''];
  return [paragraph.slice(0, cut + 1), paragraph.slice(cut + 1).trim()];
}

export default function AboutPage() {
  const [claim, reason] = split(A.story.paragraphs[0]);
  return (
    <>
      <PageHead
        lines={A.headline}
        mark="whole program."
        lede={A.lede}
        aside={
          <InView delay={120} className="flex flex-col items-start gap-(--space-5)">
            <p className="t-lede max-w-[560px] text-ink">
              {claim}
              {reason ? <span className="text-ink-2"> {reason}</span> : null}
            </p>
            <MonoLink href="#stages" lead="THE" label="STAGES" />
          </InView>
        }
      />

      <MediaBand />
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
