import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Link from 'next/link';
import { localePath, type Locale } from '@/lib/i18n';
import { ENQUIRY_TYPES, SERVICE_SLUGS, type EnquiryType } from '@/content/enquiry';
import { ui } from '@/content/ui';
import { home, tr } from '@/content';
import { ArtImg } from '@/lib/Img';
import { Rise } from '@/lib/motion';
import EnquiryForm from '@/components/EnquiryForm';
import { FirmMark, Chip } from '@/components/ui';
import { SITE } from '@/content/site';
import Faq from '@/sections/home/Faq';
import { BreadcrumbLd } from '@/components/JsonLd';
import { nav } from '@/content';

export function contactMeta(locale: Locale): Metadata {
  const t = tr(locale);
  return pageMeta({
  locale,
  title: t('Contact — describe the operational problem'),
  description: t(
    'Describe the operational problem in your own words. A person reads every inquiry that arrives through this form.'),
  path: '/contact',
  image: '/img/og-contact-b.jpg',
  imageAlt: t('A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left.'),
  });
}

/* ============================================================================
   CONTACT — the reference's contact page.

   One panel filling the viewport, split down the middle: a photograph
   behind the left half carrying the label, the heading, the copy and the
   direct details; the form on the right on its own card. Below it, the FAQ.

   NO REPLY TIME IS PROMISED anywhere on this page. Recalibre's real one is
   not on record, and a promise the firm has not made is still a promise the
   reader will hold it to.
   ========================================================================= */
/** The address decides the mode (`?type=quotation&service=…`), read on the
 *  server so the page is right with scripts off; anything else is an
 *  enquiry. Reading the address makes this page request-rendered, which
 *  the site accepts: it runs the Node server anyway. */
export type ContactSearch = { type?: string | string[]; service?: string | string[] };

export function contactMode(sp: ContactSearch): { mode: EnquiryType; service: string } {
  const type = Array.isArray(sp.type) ? sp.type[0] : sp.type;
  const service = Array.isArray(sp.service) ? sp.service[0] : sp.service;
  return {
    mode: (ENQUIRY_TYPES as readonly string[]).includes(type ?? '') ? (type as EnquiryType) : 'enquiry',
    service: service && SERVICE_SLUGS.includes(service) ? service : '',
  };
}

export default function ContactView({
  locale,
  mode = 'enquiry',
  service = '',
}: {
  locale: Locale;
  mode?: EnquiryType;
  service?: string;
}) {
  const t = ui(locale).form;
  const T = tr(locale);
  const quote = mode === 'quotation';
  const here = localePath(locale, '/contact');
  const N = nav(locale).NAV;
  return (
    <>
      <BreadcrumbLd locale={locale} items={[[N[0]!.label, '/'], [N[6]!.label, '/contact']]} />
      <section
        aria-labelledby="contact-head"
        className="pad-x relative flex w-full flex-col items-center overflow-clip bg-raised pb-[32px] pt-[80px] phone:pb-[24px] phone:pt-[72px]"
      >
        <div className="seam shell grid w-full grid-cols-2 narrow:grid-cols-1">
          {/* the photographic half */}
          {/* No floor since 28 September 2026 (720, 420 below 1200): beside the
              form the card takes the form's height; stacked, its own. The
              gap keeps the two blocks apart when nothing stretches it. */}
          <div className="card-30 relative flex flex-col justify-between gap-[48px] overflow-clip p-[50px] tablet:p-[40px] mobile:p-[20px]">
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
                column's 48px gap to the card. */}
            <div className="absolute inset-0">
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
                /* The page's largest paint, and a photograph with no text in
                   it: 60 is indistinguishable at its size and a third lighter
                   on the wire (the Lighthouse pass of 4 November 2026). */
                quality={60}
                className="media-push media-push-sm"
              />
            </div>

            <div className="relative flex flex-col gap-[32px]">
              <span className="flex items-center gap-[8px]">
                <FirmMark className="text-ink-3" />
                <span className="t-mono-11 text-ink-2">{T('START A CALIBRATION')}</span>
              </span>
              <Rise as="h1" id="contact-head" lines={[T('Get in touch.')]} mark={T('touch')} className="t-display text-ink" eager />
              <p className="t-body max-w-[420px] text-ink-2">
                {T('Describe the operational problem in your own words. We will tell you whether it is a strategy problem, a systems problem or a design problem — and what a Calibration would cover.')}
              </p>
            </div>

            <div className="relative flex flex-col gap-[32px]">
              <div className="flex flex-col gap-[8px]">
                <span className="t-mono text-ink-3">{T('EMAIL')}</span>
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
              <div className="flex flex-wrap gap-[48px]">
                <div className="flex flex-col gap-[8px]">
                  <span className="t-mono text-ink-3">{T('PHONE')}</span>
                  <a
                    href={`tel:${SITE.phoneHref}`}
                    className="tap-44 t-body w-fit text-ink"
                  >
                    {SITE.phone}
                  </a>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <span className="t-mono text-ink-3">{T('LOCATION')}</span>
                  {/* Matched to the phone link beside it: that one is 44px
                      tall for the touch target, and a plain span at its own
                      height put the two values on different baselines. */}
                  <span className="t-body flex min-h-[44px] items-center text-ink">{T(SITE.location)}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-[8px]">
                {SITE.social.map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="tap-44">
                    {/* On the photograph: the tag's own dark ground
                        (`Chip onArt`, 28 September 2026). */}
                    <Chip onArt>{s.label}</Chip>
                    <span className="sr-only normal-case">{ui(locale).opensNewTab}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* The form half. The reference's technical rail beside it (a
              vertical barcode and the descriptor set sideways) went on 28
              September 2026 with the rest of its graphic devices; the form
              takes the 70px it held. */}
          <div className="card-30 flex overflow-clip">
            <div className="flex flex-1 flex-col gap-[48px] p-[50px] tablet:gap-[40px] tablet:p-[40px] mobile:gap-[32px] mobile:p-[20px]">
              {/* THE MODE TOGGLE (4 November 2026): two links, so it works
                  with scripts off and the address says which form this is.
                  The chosen one is lit; the heading follows it. */}
              <div className="flex flex-col gap-[24px]">
                <nav aria-label={t.modeLabel} className="flex flex-wrap gap-[8px]">
                  {(
                    [
                      ['enquiry', t.modeEnquiry, here],
                      ['quotation', t.modeQuotation, `${here}?type=quotation${service ? `&service=${service}` : ''}`],
                    ] as const
                  ).map(([key, label, href]) => (
                    <Link
                      key={key}
                      href={href}
                      scroll={false}
                      aria-current={mode === key ? 'page' : undefined}
                      className="tap-44 flex items-center"
                    >
                      <span
                        className={`pill t-mono transition-colors duration-300 ease-hover ${
                          mode === key ? 'border-accent-bright bg-accent-bright text-on-accent-bright' : 'text-ink'
                        }`}
                      >
                        {label.toUpperCase()}
                      </span>
                    </Link>
                  ))}
                </nav>
                <h2 id="contact-form" className="t-card text-ink">
                  {quote ? t.headingQuotation : t.headingEnquiry}
                </h2>
              </div>
              <EnquiryForm mode={mode} service={service} />
            </div>
          </div>
        </div>
      </section>

      {/* The FAQ's closing link goes up to this page's own form, not to the
          footer's (there is none here). */}
      <Faq ctaHref="#contact-form" items={home(locale).FAQ.items} label={home(locale).FAQ.label} headline={home(locale).FAQ.headline} tail={home(locale).FAQ.tail} />
    </>
  );
}
