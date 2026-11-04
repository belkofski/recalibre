import { localePath, type Locale } from '@/lib/i18n';
import { home, tr } from '@/content';
import Hero from '@/sections/home/Hero';
import MarkRow from '@/sections/home/MarkRow';
import Positioning from '@/sections/home/Positioning';
import Work from '@/sections/home/Work';
import Services from '@/sections/home/Services';
import Spotlight from '@/sections/home/Spotlight';
import Principles from '@/sections/home/Principles';
import Engagement from '@/sections/home/Engagement';
import Insights from '@/sections/home/Insights';
import Faq from '@/sections/home/Faq';

/**
 * THE HOMEPAGE — ten blocks, in the reference's order, with the
 * reference's positions, dimensions, motion and rhythm.
 *
 *    01  Hero           the headline, the lede, the media panel
 *    02  MarkRow        the partner register: five names, no count, no claim
 *    03  Positioning    the firm, and two structural figures
 *    04  Work           four initiatives on the reference's square grid
 *    05  Capabilities   five photo cards on a white panel, one open
 *    06  Spotlight      OPS, labelled in development in three places
 *    07  Principles     the testimonial geometry, carrying operating rules
 *    08  Engagement     three stages side by side, one way in
 *    09  Insights       three method pieces
 *    10  Faq            six corporate-buyer questions
 *
 * FOUR BLOCKS CAME OUT ON 26 SEPTEMBER 2026, on the owner's decision: the
 * Statement, the Process and the Film, then the photographic Close, which
 * came off every page (the form below it is the page's one ending now; see
 * components/Footer.tsx). Engagement, Insights and the FAQ were made shorter
 * the same night, also on his decision, keeping every line they carry
 * except the two repeated "Start a calibration" buttons and the desk
 * photograph beside the articles.
 *
 * Where tbd® holds proof Recalibre does not have — a performance counter, a
 * price, a testimonial — the block keeps its place and carries something
 * true instead. What each substitution is, and why, is written at the top of
 * the section file that makes it.
 */
export default function HomeView({ locale }: { locale: Locale }) {
  const H = home(locale);
  const t = tr(locale);
  return (
    <>
      <Hero locale={locale} />
      <MarkRow locale={locale} />
      <Positioning locale={locale} />
      <Work locale={locale} />
      <Services locale={locale} />
      <Spotlight locale={locale} />
      <Principles content={H.PRINCIPLES} prev={t('Previous principle')} next={t('Next principle')} />
      <Engagement content={H.ENGAGEMENT} receive={t('YOU RECEIVE')} ctaHref={localePath(locale, '/contact')} />
      <Insights locale={locale} />
      <Faq items={H.FAQ.items} label={H.FAQ.label} headline={H.FAQ.headline} tail={H.FAQ.tail} />
    </>
  );
}
