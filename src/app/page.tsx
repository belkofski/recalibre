import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';

import Intro from '@/sections/blocks/Intro';
import ServicesBlock from '@/sections/blocks/Services';
import KeyValue from '@/sections/blocks/KeyValue';
import Work from '@/sections/blocks/Work';
import WhyChoose from '@/sections/blocks/WhyChoose';
import Partners from '@/sections/Partners';
import OpsWalkthrough from '@/sections/OpsWalkthrough';
import House from '@/sections/House';

/**
 * HOMEPAGE — eight stops, each one carrying something the company actually
 * says. Every section earns its place or it is not here.
 *
 *   Hero          dark    the showroom image and the name
 *   Intro         black   what the firm is · strategy / design / technology
 *   About         light   who it is for — the positioning band
 *   Services      black   the five capabilities
 *   KeyValue      white   the three-stage engagement model
 *   Work          dark    OPS and Contraxis
 *   OpsWalkthrough light   OPS demonstrated: a working day in six screens
 *   WhyChoose     light   the integrated-capability argument
 *   House         black   Belkofski — the one finished thing, stamped OUR OWN
 *   Partners      light   five real names. The only proof block on the page.
 *   Contact       black   the form. The reason the other seven exist.
 *   Footer        dark
 *
 * Tone: dark · black · light · black · white · dark · white · light · light ·
 * black · dark.
 *
 * The rule was "no two adjacent sections share a ground", and the walkthrough
 * bends it: it sits on paper between Work's black and WhyChoose's paper-2.
 * Deliberate — the six captures are light interfaces on a light ground, and
 * floating them on black would have put a hard edge around every screenshot
 * and made a demonstration read as a gallery. Paper and paper-2 are a visible
 * step apart, so the seam still reads.
 *
 * WHY FOUR BLOCKS CAME OFF. The nine cloned blocks were five sites' worth of
 * competing ideas: three of them were different treatments of "our
 * capabilities" and two were different treatments of "how we work". The company
 * content has exactly one set of capabilities and exactly one process, so the
 * duplicates had nothing to say. The survivors were chosen by fit, not taste:
 *
 *   capabilities → Services   the only block with room for a title, its
 *                             sub-disciplines and a sentence, which is the
 *                             shape the capability content actually has
 *   process      → KeyValue   exactly three cards for exactly three stages, so
 *                             no measured geometry had to be altered to fit
 *
 * Removed here, files intact, still rendered side by side at /blocks:
 *   Features · CoreCapabilities · HowItWorks · Flow
 * And the original Elyte composition is preserved whole at /original.
 *
 * STILL OPEN: no phone layout between the hero and the footer — every block is
 * fixed-width desktop and clips below ~1200px.
 */
export default function Home() {
  return (
    <main className="relative flex w-full flex-col items-center justify-start overflow-clip bg-page">
      <Hero />
      <Intro />
      <About />
      <ServicesBlock />
      <KeyValue />
      <Work />
      <OpsWalkthrough />
      <WhyChoose />
      <House />
      <Partners />
      <Contact />
      <Footer />
    </main>
  );
}
