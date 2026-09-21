import Img from '@/lib/Img';
import { Btn, Pill } from '@/components/ui';
import { NAV } from '@/content/site';

/**
 * 404 — the reference's own: one full panel carrying a photograph, and a
 * small card floated at its centre holding the code, a line of copy and the
 * way back. The route list is added under it, because a 404 that also tells
 * you every address on the site saves the reader a second guess.
 */
export default function NotFound() {
  return (
    <section
      aria-labelledby="nf-head"
      className="pad-x relative flex w-full flex-col items-center overflow-clip bg-raised pb-[30px] pt-[80px] tablet:pt-[74px] mobile:pb-[20px] mobile:pt-[70px]"
    >
      <div className="card-30 shell relative flex min-h-[720px] w-full items-center justify-center overflow-clip p-[30px] mobile:min-h-[520px] mobile:p-[20px]">
        <Img
          src="/img/plate-geometry-wide.jpg"
          alt=""
          priority
          sizes="(max-width: 809px) 100vw, 1380px"
          className="media-push media-push-sm"
        />
        <span className="grain grain-soft absolute inset-0" aria-hidden="true" />
        <span className="absolute inset-0 bg-ground/38" aria-hidden="true" />

        <div className="relative flex w-[380px] max-w-full flex-col items-center gap-[24px] rounded-[24px] border border-rule-2 bg-ground/80 p-[40px] text-center backdrop-blur-[3px] mobile:p-[24px]">
          <p className="t-mono-9 text-ink-2">THIS PAGE DOES NOT EXIST</p>
          <h1 id="nf-head" className="t-display text-ink">
            404
          </h1>
          <p className="t-caption max-w-[260px] text-ink-2">
            The address is wrong or the page has moved. Everything on this site is one of the five below.
          </p>
          <Btn href="/" label="Back to home" />
          <nav aria-label="All pages" className="flex flex-wrap items-center justify-center gap-[8px]">
            {NAV.map((item) => (
              <Pill key={item.href} href={item.href}>
                {item.label}
              </Pill>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
