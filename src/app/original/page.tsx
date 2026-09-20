import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Clients from '@/sections/Clients';
import Pillars from '@/sections/Pillars';
import Services from '@/sections/Services';
import Framework from '@/sections/Framework';
import Cases from '@/sections/Cases';
import Approach from '@/sections/Approach';
import Testimonials from '@/sections/Testimonials';
import Faq from '@/sections/Faq';
import Footer from '@/sections/Footer';

/**
 * /original — the Elyte-measured composition that was the homepage until the
 * nine cloned blocks replaced it. Kept verbatim so the swap is reversible and
 * so the two can be compared side by side. Nothing here was deleted.
 *
 * Measured y at 1440 (reference):
 *   Hero          y0        900
 *   Clients       y900       90
 *   Pillars       y990     1122
 *   Services      y2112    1036
 *   Framework     y3148     919
 *   Cases         y4067    1772
 *   Approach      y5839     967.73
 *   Testimonials  y6806.73  934
 *   Faq           y7740.73  918
 *   Footer        y8658.73 1182.59
 *   document height 9841.33
 */
export default function Original() {
  return (
    <main className="relative flex w-full flex-col items-center justify-start overflow-clip bg-[rgb(242,243,245)]">
      <Hero />
      <About />
      <Clients />
      <Pillars />
      <Services />
      <Framework />
      <Cases />
      <Approach />
      <Testimonials />
      <Faq />
      <Footer />
    </main>
  );
}
