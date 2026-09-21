import Link from 'next/link';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { CLOSE as C } from '@/content/home';
import { SITE } from '@/content/site';

/* ============================================================================
   THE CLOSING CTA — block 14. Measured 1025px: a full-bleed photographic
   panel with the type sitting over it, a highlighted detail, and the button.

   The image movement, the scrim, the highlighted word and the button
   treatment are kept. What changes is the photograph and the words.

   NO PROMISE ABOUT A REPLY. The reference offers a free first call and says
   what it will tell you on it. Recalibre publishes no reply time and no free
   consultation, so the block says what happens — a person reads it — and
   nothing about when.
   ========================================================================= */
export default function Close() {
  return (
    <section id="start" aria-labelledby="close-head" className="w-full overflow-clip pad-y scroll-mt-[60px]">
      <div className="shell pad-x">
        <InView>
          <div className="media-scrim grain relative flex min-h-[560px] w-full flex-col justify-end overflow-clip rounded-[24px] border border-rule-2 p-[48px] mobile:min-h-[420px] mobile:p-[24px]">
            <Img
              src={C.media}
              alt={C.mediaAlt}
              sizes="(max-width: 1199px) 100vw, 1380px"
              className="absolute inset-0 -z-[1] block h-full w-full object-cover object-left-top"
            />

            <div className="relative z-[3] flex flex-col gap-[20px]">
              <p className="t-mono text-lime">{C.eyebrow}</p>
              <Rise as="h2" id="close-head" lines={C.headline} className="t-display max-w-[16ch] text-ink" />
              <p className="t-body-lg max-w-[52ch] text-ink-2">{C.body}</p>

              <div className="mt-[12px] flex flex-wrap items-center gap-[12px]">
                <Link href={C.cta.href} className="pill pill-solid focus-ring t-btn">
                  {C.cta.label}
                </Link>
                <a href={`mailto:${SITE.email}`} className="pill focus-ring t-btn">
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
}
