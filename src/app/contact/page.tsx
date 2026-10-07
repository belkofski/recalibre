import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { ArtImg } from '@/lib/Img';
import { InView, Rise, Scene } from '@/lib/motion';
import EnquiryForm from '@/components/EnquiryForm';
import { Card, Glyph, Orbs, type Orb } from '@/components/ui';
import { SITE } from '@/content/site';
import { CONTACT } from '@/content/enquiry';
import Faq from '@/sections/home/Faq';

export const metadata: Metadata = pageMeta({
  title: 'Contact — start a calibration',
  description: 'Describe the operational problem in your own words. A person reads every enquiry.',
  path: '/contact',
  image: '/img/og-contact-b.jpg',
  imageAlt: 'A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left.',
});

/* ============================================================================
   CONTACT — a conversion page, cut to what it needs (the third pass): the
   h1, one sentence, the direct line, the form, and the FAQ folded under it.

   One panel split down the middle: the room's photograph behind the left
   half carrying the h1, the two-sentence lede and the direct line (the
   address, the phone, the place; their glyphs name them, so the label row
   over each came off, and the social links live in the footer); the form
   on the right on its own deep card. The eyebrow and the two promises came
   off: the eyebrow repeated the form's own button, and the promises are
   the footer's on every other page.

   IT MOVES WITH THE SCROLL. The panel is a Scene: as it leaves through the
   top of the window the photograph pushes in and drifts down behind the
   words (`.contact-plate`, contact.css). The form is a scene of its own and
   its fields stagger up as it comes into the window (EnquiryForm), which on
   a phone is after the photograph card. The FAQ's questions stagger in the
   same way (sections/home/Faq.tsx).

   NO REPLY TIME IS PROMISED anywhere on this page. Recalibre's real one is
   not on record.
   ========================================================================= */

const CONTACT_ORBS: readonly Orb[] = [
  { x: '50%', y: '96%', size: 640, color: 'deep', a: 0.14 },
  { x: '94%', y: '6%', size: 420, color: 'glow', a: 0.08, delay: -11, dur: 32 },
];

export default function ContactPage() {
  return (
    <>
      <Scene
        as="section"
        aria-labelledby="contact-head"
        className="pad-x relative isolate flex w-full flex-col items-center overflow-clip bg-raised pb-(--space-5) pt-[calc(var(--bar)+var(--space-4))] phone:pb-(--space-4) phone:pt-[calc(var(--bar)+var(--space-3))]"
      >
        <Orbs orbs={CONTACT_ORBS} />
        <div className="seam shell grid w-full grid-cols-2 narrow:grid-cols-1">
          {/* THE WORDS CARD, on the photograph: no surface, the picture is
              the ground. Beside the form it takes the form's height;
              stacked, its own, never shorter than the room needs to read
              as a room (`.contact-words`, contact.css). */}
          <Card
            radius={30}
            surface={false}
            className="contact-words flex flex-col justify-between gap-(--space-6) overflow-clip p-(--plate-pad)"
          >
            {/* THE DARKENING IS IN THE PICTURE FILES (scripts/plates.py):
                three cuts, each with its fades where its own words land —
                the upright one, a 1.42:1 one from 460 to 809 and a 1.92:1
                one from 810 to 1199. In a box of its own, because a
                <picture> is a box in the card's column. The picture fades
                in; the plate layer between them is the scroll's. */}
            <InView mode="picture" className="absolute inset-0">
              <div className="contact-plate absolute inset-0">
                <div className="settle absolute inset-0">
                  <ArtImg
                    src="/img/plate-room-contact-c.jpg"
                    sources={[
                      {
                        src: '/img/plate-room-contact-mid-b.jpg',
                        media: '(min-width: 460px) and (max-width: 809.98px)',
                        sizes: '845px',
                      },
                      {
                        src: '/img/plate-room-contact-wide-a.jpg',
                        media: '(min-width: 810px) and (max-width: 1199.98px)',
                        sizes: '100vw',
                      },
                    ]}
                    alt="A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left."
                    sizes="(max-width: 459.98px) 600px, (max-width: 1199px) 100vw, 820px"
                    className="media-push media-push-sm"
                  />
                </div>
              </div>
            </InView>

            {/* THE VEIL UNDER THE WORDS: a fall from the top takes the
                words' band down and leaves the room's floor as it is;
                deeper below 1200, where the lede crosses the screen's pale
                face. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ground/70 via-ground/35 via-55% to-transparent narrow:via-ground/55"
            />
            <div className="relative flex flex-col gap-(--space-5)">
              <Rise
                as="h1"
                id="contact-head"
                lines={[CONTACT.headline]}
                wrap
                by="word"
                className="t-display text-ink"
              />
              <InView delay={120}>
                <p className="t-lede max-w-[480px] text-ink-2 tablet:max-w-[400px]">{CONTACT.lede}</p>
              </InView>
            </div>

            {/* THE DIRECT LINE, on a veil of its own at the foot (the plate's
                baked fade). Full ink, on purpose: over the photograph 60%
                does not hold the contrast a reader needs. Below 600 the
                address scales with the width so it holds one line. */}
            <InView delay={240} className="relative flex flex-col gap-(--space-2)">
              <a
                href={`mailto:${SITE.email}`}
                className="tap-44 t-card w-fit max-w-full gap-(--space-2) text-ink phone:text-[length:min(28px,calc((100vw-106px)/11.2))]!"
              >
                <Glyph name="mail" size={16} className="flex-none text-ink-3" />
                {SITE.email}
              </a>
              <div className="flex flex-wrap gap-x-(--space-6) gap-y-0">
                <a href={`tel:${SITE.phoneHref}`} className="tap-44 t-body w-fit gap-(--space-2) text-ink">
                  <Glyph name="phone" size={14} className="flex-none text-ink-3" />
                  {SITE.phone}
                </a>
                <span className="t-body flex min-h-[44px] items-center gap-(--space-2) text-ink">
                  <Glyph name="pin" size={14} className="flex-none text-ink-3" />
                  {SITE.location}
                </span>
              </div>
            </InView>
          </Card>

          {/* THE FORM CARD: a step deeper than a surface, lit under the
              pointer. No heading of its own: the h1 across the seam is the
              question it answers. `id="contact-form"` is where the FAQ's
              closing link and the footer's BACK TO THE FORM land. */}
          <Card radius={30} deep spot id="contact-form" className="flex overflow-clip">
            <div className="flex flex-1 flex-col p-(--plate-pad)">
              <EnquiryForm variant="full" />
            </div>
          </Card>
        </div>
      </Scene>

      <Faq ctaHref="#contact-form" />
    </>
  );
}
