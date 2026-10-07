import Hero from '@/sections/home/Hero';
import MarkRow from '@/sections/home/MarkRow';
import CapabilityIndex from '@/sections/home/CapabilityIndex';
import OpsStory from '@/sections/home/OpsStory';
import WorkRow from '@/sections/home/WorkRow';
import Stages from '@/sections/home/Engagement';

/**
 * THE HOMEPAGE — six blocks, each with one job, each moving as the page is
 * scrolled down (the third pass: fewer words, one picture in one place,
 * nothing that needs a sideways swipe):
 *
 *    Hero              the headline, the sentence, the action; the room
 *                      steps back and the words rise out as it leaves
 *    MarkRow           the partner ticker, sliding in from the right
 *    CapabilityIndex   the five capabilities, a pinned block the scroll walks
 *    OpsStory          selected work: OPS as the flagship, a scroll story
 *    WorkRow           the other three, at three sizes, staggering in
 *    Stages            the three stages, the flow line drawing with the scroll
 *    Footer            the final call, with the brief form (layout.tsx)
 *
 * The principles moved to About, which is the page about how the firm
 * works; the stages stay here, where the reader decides to start.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <MarkRow />
      <CapabilityIndex />
      <OpsStory />
      <WorkRow />
      <Stages />
    </>
  );
}
