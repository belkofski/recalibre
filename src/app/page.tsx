import Hero from '@/sections/home/Hero';
import MarkRow from '@/sections/home/MarkRow';
import Statement from '@/sections/home/Statement';
import Positioning from '@/sections/home/Positioning';
import Work from '@/sections/home/Work';
import Capabilities from '@/sections/home/Capabilities';
import Process from '@/sections/home/Process';
import Spotlight from '@/sections/home/Spotlight';
import Principles from '@/sections/home/Principles';
import Film from '@/sections/home/Film';
import Engagement from '@/sections/home/Engagement';
import Insights from '@/sections/home/Insights';
import Faq from '@/sections/home/Faq';
import Close from '@/sections/home/Close';

/**
 * THE HOMEPAGE — fourteen blocks, in the reference's order, with the
 * reference's positions, dimensions, motion and rhythm.
 *
 *    01  Hero           the headline, the decode, the media panel
 *    02  MarkRow        the proof band: marks, no count, no claim
 *    03  Statement      five capabilities / three stages / one team
 *    04  Positioning    the firm, and two structural figures
 *    05  Work           three initiatives on the reference's square grid
 *    06  Capabilities   the sticky deck — five chapters, pinned
 *    07  Process        four stages, staggered
 *    08  Spotlight      OPS, labelled in development in three places
 *    09  Principles     the testimonial geometry, carrying operating rules
 *    10  Film           twenty seconds, silent, at its own size
 *    11  Engagement     three cards, no prices
 *    12  Insights       three method pieces
 *    13  Faq            six corporate-buyer questions
 *    14  Close          the photographic CTA
 *
 * NOT ONE BLOCK OF THE REFERENCE WAS DELETED. Where tbd® holds proof
 * Recalibre does not have — a performance counter, a price, a testimonial —
 * the block keeps its place and its geometry and carries something true
 * instead. What each substitution is, and why, is written at the top of the
 * section file that makes it.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <MarkRow />
      <Statement />
      <Positioning />
      <Work />
      <Capabilities />
      <Process />
      <Spotlight />
      <Principles />
      <Film />
      <Engagement />
      <Insights />
      <Faq />
      <Close />
    </>
  );
}
