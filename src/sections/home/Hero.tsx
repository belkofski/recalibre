import Img from '@/lib/Img';
import { Rise, Decode } from '@/lib/motion';
import { Btn, MonoLink, Dots, Barcode, DotGrid, RailText, Glyph } from '@/components/ui';
import { HERO } from '@/content/home';
import { SITE } from '@/content/site';

/* ============================================================================
   THE HERO — the reference's bordered, image-led composition.

   One full-viewport slab of #101010 carrying the photograph edge to edge,
   with a 30px-radius panel laid over it at a 12% black wash. Inside the
   panel: a 70px technical rail on the left, the headline over the media,
   and a bottom row holding the dotted field and the statement plate.

   Nothing here is invented. The rail prints the location and the local date,
   the plate prints the firm's own description of itself, and the eyebrow
   carries the two facts that are on record — where we are and what we do.
   ========================================================================= */

export default function Hero() {
  return (
    <section className="pad-x relative flex h-[100svh] min-h-[720px] w-full flex-col items-center justify-center overflow-clip bg-raised pb-[30px] pt-[80px] tablet:pt-[74px] mobile:h-auto mobile:min-h-0 mobile:pb-[20px] mobile:pt-[70px]">
      {/* The photograph, inset 4px and rounded, exactly as the reference
          lays it — it is wider than the panel, so the panel reads as a wash
          over a picture rather than a picture inside a box.

          IT PUBLISHES AT FULL STRENGTH. The reference renders every image on
          its homepage at `opacity: 1` and `filter: none`, and carries one
          gradient overlay on the entire page. Ours was at 0.72 behind a
          70%-black gradient, over a plate whose brightest pixel was 116 of
          255 — three separate reductions stacked on one picture, which is
          why the hero read as a black field rather than as a room. The
          darkening the headline needs is now graded into the plate itself
          (see scripts/plates.py), so what is left here is the picture. */}
      <div className="absolute inset-x-[4px] bottom-[4px] top-0 overflow-clip rounded-[30px] bg-raised mobile:rounded-[20px]">
        <Img
          src={HERO.media}
          alt={HERO.mediaAlt}
          priority
          sizes="100vw"
          className="media-fill mobile:hidden"
        />
        {/* The phone gets a portrait crop of the same room rather than a
            wide picture squeezed into a tall box. */}
        <Img
          src={HERO.mediaTall}
          alt=""
          priority
          sizes="100vw"
          className="media-fill hidden mobile:block"
        />
        <span className="grain grain-soft absolute inset-0" aria-hidden="true" />
      </div>

      <div className="shell relative flex w-full flex-1 rounded-[30px] border border-rule-2 bg-black/12 mobile:rounded-[20px]">
        <span className="absolute right-[30px] top-[30px] z-[2] mobile:right-[20px] mobile:top-[20px]">
          <Dots />
        </span>

        {/* The rail: barcode, status, and the date. Hidden below 810px, as
            the reference hides its own. */}
        <div className="flex w-[70px] flex-none flex-col items-center justify-between border-r border-rule-3 py-[30px] mobile:hidden">
          <div className="flex flex-col items-center gap-[40px]">
            <Barcode vertical className="h-[113px] w-[11px]" />
            <RailText>{HERO.railLabel}</RailText>
          </div>
          <RailText>{SITE.location}</RailText>
        </div>

        {/* The content column. */}
        <div className="flex flex-1 flex-col justify-between p-[50px] tablet:p-[40px] mobile:gap-[40px] mobile:p-[20px]">
          <div className="flex flex-1 flex-col justify-center gap-[40px] pb-[60px] mobile:flex-none mobile:gap-[30px] mobile:pb-0 mobile:pt-[30px]">
            <div className="flex flex-col gap-[38px] mobile:gap-[24px]">
              <div className="flex flex-col gap-[12px]">
                <p className="t-mono text-ink-2">{HERO.eyebrow}</p>
                <Rise as="h1" lines={HERO.headline} className="t-hero max-w-[1210px] text-ink" mark={HERO.mark} />
              </div>
              <p className="t-body max-w-[540px] text-ink-2">
                <Decode text={HERO.lede} />
              </p>
            </div>

            <div className="flex flex-row items-center gap-[40px] mobile:flex-col mobile:items-start mobile:gap-[20px]">
              <Btn href={HERO.ctaPrimary.href} label={HERO.ctaPrimary.label} />
              <MonoLink href={HERO.ctaSecondary.href} lead="SEE" label={HERO.ctaSecondary.label} />
            </div>
          </div>

          {/* The bottom row: the dotted field, and the statement plate. */}
          <div className="flex items-end justify-between gap-[30px] overflow-clip mobile:flex-col mobile:items-stretch">
            <DotGrid className="mobile:hidden" />
            <div className="flex w-[400px] flex-none overflow-clip rounded-[12px] border border-rule-2 bg-ground/70 backdrop-blur-[2px] mobile:w-full">
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-[8px] border-b border-rule-3 px-[16px] py-[10px]">
                  <Glyph className="[&>i]:bg-lime" />
                  <span className="t-mark text-ink">{SITE.name}</span>
                </div>
                <div className="flex gap-[12px] px-[16px] py-[14px]">
                  <RailText className="!text-ink-3">{HERO.plateStamp}</RailText>
                  <div className="flex flex-col gap-[10px]">
                    <p className="t-mono-9 !leading-[15px] text-ink-2">{HERO.plateBody}</p>
                    <p className="t-mono-9 text-ink">{HERO.plateSign}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
