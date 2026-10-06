import Hero from '@/sections/home/Hero';
import MarkRow from '@/sections/home/MarkRow';
import CapabilityIndex from '@/sections/home/CapabilityIndex';
import OpsStory from '@/sections/home/OpsStory';
import WorkRow from '@/sections/home/WorkRow';
import Principles from '@/sections/home/Principles';
import Stages from '@/sections/home/Engagement';

/**
 * THE HOMEPAGE — seven blocks (6 October 2026, the owner's audit: "the
 * homepage currently tries to explain everything Recalibre does"). It
 * answers three questions in order — what are you, why should I care, what
 * do I do next — and stops:
 *
 *    01  Hero              the headline, what we do, the one action, the proof
 *    02  MarkRow           the partner register: five names, no count, no claim
 *    03  CapabilityIndex   what we do: five capabilities, one open, on white
 *    04  OpsStory          selected work: OPS as the flagship, a scroll story
 *        WorkRow           and the other three initiatives in a row
 *    05  Principles        why Recalibre: three rules, no pager
 *    06  Stages            how engagement works: the flow and the three cards
 *    07  Footer            the final call, with the brief form (layout.tsx)
 *
 * WHAT CAME OUT, on the audit: the firm statement (its sentence is the
 * capabilities' lede), the five-card capability carousel (the index above
 * replaces it, and /capabilities is the page), the OPS block of four cards
 * (the story replaces it), the Insights block (the page is in the bar) and
 * the FAQ (read on Contact, under the form it answers for). About a third of
 * the page's length went with them, and no sentence the owner approved was
 * cut: each moved to the page it belongs to.
 *
 * Where tbd® holds proof Recalibre does not have — a performance counter, a
 * price, a testimonial — the block keeps its place and carries something
 * true instead. What each substitution is, and why, is written at the top of
 * the section file that makes it.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <MarkRow />
      <CapabilityIndex />
      <OpsStory />
      <WorkRow />
      <Principles />
      <Stages />
    </>
  );
}
