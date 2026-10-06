import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { ArtImg } from '@/lib/Img';
import { InView, Rise } from '@/lib/motion';
import EnquiryForm from '@/components/EnquiryForm';
import { Card, Chip, Eyebrow, FirmMark } from '@/components/ui';
import { SITE } from '@/content/site';
import { CONTACT } from '@/content/enquiry';
import Faq from '@/sections/home/Faq';

export const metadata: Metadata = pageMeta({
  title: 'Contact — describe the operational problem',
  description:
    'Describe the operational problem in your own words. A person reads every inquiry that arrives through this form.',
  path: '/contact',
  image: '/img/og-contact-b.jpg',
  imageAlt: 'A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left.',
});

/* ============================================================================
   CONTACT — a conversion page (the owner's audit).

   One panel filling the viewport, split down the middle: a photograph
   behind the left half carrying the eyebrow, the heading, the lede, the two
   promises and the direct details; the form on the right on its own card.
   Below it, the FAQ, whose closing link comes back up to the form.

   THE H1 IS THE QUESTION THE FORM USED TO ASK AS ITS H2 — "Tell us what is
   not working yet." — so the page opens on the sentence that matters and
   the form opens on its fields. Under the lede, the two promises the
   Calibration card already makes (CONTACT.proof), each on a hairline, are
   the whole case for filling it in; nothing else is claimed.

   NO REPLY TIME IS PROMISED anywhere on this page. Recalibre's real one is
   not on record, and a promise the firm has not made is still a promise the
   reader will hold it to.
   ========================================================================= */
export default function ContactPage() {
  return (
    <>
      <section
        aria-labelledby="contact-head"
        className="pad-x relative flex w-full flex-col items-center overflow-clip bg-raised pb-(--space-5) pt-[80px] phone:pb-(--space-4) phone:pt-[72px]"
      >
        <div className="seam shell grid w-full grid-cols-2 narrow:grid-cols-1">
          {/* THE WORDS CARD, on the photograph. */}
          {/* No floor since 28 September 2026 (720, 420 below 1200): beside the
              form the card takes the form's height; stacked, its own. The
              gap keeps the two blocks apart when nothing stretches it. The
              card keeps its own 50 / 40 / 20 padding (globals.css, the
              rhythm note: the footer and contact cards do). */}
          <Card
            radius={30}
            className="flex flex-col justify-between gap-(--space-6) overflow-clip p-[50px] tablet:p-[40px] mobile:p-[20px]"
          >
            {/* THE DARKENING IS IN THE PICTURE FILES (28 September 2026).
                The card's flat 34% was already baked (scripts/plates.py,
                `wash`); the two runtime fades that held the heading at the
                top and the address block at the foot are baked now too, so
                nothing is dimmed at runtime. The card is upright from 1200
                up and below 460, and landscape between (0.78 to 1.92 wide
                for 1 tall), so it takes three cuts, each with its fades
                where its own words land: the upright one, a 1.42:1 one from
                460 to 809 and a 1.92:1 one from 810 to 1199. Drawn 810px
                wide from 1200, not 687: the card is taller than the plate's
                shape and the 1.1 push scales it up again.

                IN A BOX OF ITS OWN, because a <picture> is a box in the
                card's column: bare, it counted as an item and added the
                column's gap to the card. The picture fades in (no travel:
                it is the ground the words stand on, and a picture that
                rose would carry them). */}
            <InView mode="picture" className="absolute inset-0">
              <div className="settle absolute inset-0">
                <ArtImg
                  src="/img/plate-room-contact-c.jpg"
                  sources={[
                    {
                      src: '/img/plate-room-contact-mid-b.jpg',
                      media: '(min-width: 460px) and (max-width: 809.98px)',
                      /* Drawn by its height in this range: 591 to 595 tall
                         with the push, so 840 to 845 wide whatever the
                         window (28 September 2026; `100vw` asked for 1080 at
                         460 on a 2x phone and drew it 1.55x). */
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
            </InView>

            <div className="relative flex flex-col gap-(--space-5)">
              <InView>
                <Eyebrow mark as="p">
                  {CONTACT.eyebrow}
                </Eyebrow>
              </InView>
              {/* The headline is one sentence from the content and wraps
                  where the card is narrow; each word rises out of its own
                  clip box, as every page opener does. */}
              <Rise
                as="h1"
                id="contact-head"
                lines={[CONTACT.headline]}
                wrap
                by="word"
                className="t-display text-ink"
              />
              <InView delay={120}>
                <p className="t-lede max-w-[480px] text-ink-2">{CONTACT.lede}</p>
              </InView>
              {/* THE TWO PROMISES (CONTACT.proof): the Calibration card's own
                  two lines, on hairlines, the '///' before each at 50%. */}
              <InView delay={200}>
                <ul className="contact-proof flex max-w-[480px] flex-col">
                  {CONTACT.proof.map((line) => (
                    <li key={line} className="flex items-center gap-(--space-2) py-(--space-3)">
                      <FirmMark className="text-ink-3" />
                      <span className="t-body text-ink">{line}</span>
                    </li>
                  ))}
                </ul>
              </InView>
            </div>

            <InView delay={240} className="relative flex flex-col gap-(--space-5)">
              <div className="flex flex-col gap-(--space-1)">
                <span className="t-mono text-ink-3">EMAIL</span>
                {/* The address at 28px is 308px wide, more than a phone's card
                    below 400: below 600 it scales with the width and holds one
                    line (important: the type roles are unlayered).

                    FULL INK, ON PURPOSE (28 September 2026). Everywhere else a
                    text link rests at 60% and lights to 100 on hover; here the
                    address and the phone sit on the photograph, over the
                    screen's pale face at 390 to 809, where 60% does not
                    hold the contrast a reader needs. They stay at 100% and
                    take no colour step on hover. */}
                <a
                  href={`mailto:${SITE.email}`}
                  className="tap-44 t-card w-fit max-w-full text-ink phone:text-[length:min(28px,calc((100vw-84px)/11.2))]!"
                >
                  {SITE.email}
                </a>
              </div>
              <div className="flex flex-wrap gap-(--space-6)">
                <div className="flex flex-col gap-(--space-1)">
                  <span className="t-mono text-ink-3">PHONE</span>
                  <a href={`tel:${SITE.phoneHref}`} className="tap-44 t-body w-fit text-ink">
                    {SITE.phone}
                  </a>
                </div>
                <div className="flex flex-col gap-(--space-1)">
                  <span className="t-mono text-ink-3">LOCATION</span>
                  {/* Matched to the phone link beside it: that one is 44px
                      tall for the touch target, and a plain span at its own
                      height put the two values on different baselines. */}
                  <span className="t-body flex min-h-[44px] items-center text-ink">{SITE.location}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-(--space-1)">
                {SITE.social.map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="tap-44">
                    {/* On the photograph: the tag's own dark ground
                        (`Chip onArt`, 28 September 2026). */}
                    <Chip onArt>{s.label}</Chip>
                    <span className="sr-only normal-case"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </InView>
          </Card>

          {/* THE FORM CARD. No heading of its own: the h1 across the seam
              is the question it answers, so the card opens on the fields.
              `id="contact-form"` is where the FAQ's closing link and the
              footer's BACK TO THE FORM land. The reference's technical rail
              beside it went on 28 September 2026 with the rest of its
              graphic devices; the form takes the 70px it held. */}
          <Card radius={30} id="contact-form" className="flex overflow-clip">
            <InView
              delay={120}
              className="flex flex-1 flex-col p-[50px] tablet:p-[40px] mobile:p-[20px]"
            >
              <EnquiryForm variant="full" />
            </InView>
          </Card>
        </div>
      </section>

      {/* The FAQ's closing link goes up to this page's own form, not to the
          footer's (there is none here). */}
      <Faq ctaHref="#contact-form" />
    </>
  );
}
