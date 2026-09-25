import Img, { ArtImg } from '@/lib/Img';
import { Rise, Decode } from '@/lib/motion';
import { Btn, MonoLink, Dots, Barcode, DotGrid, RailText, FirmMark } from '@/components/ui';
import { HERO } from '@/content/home';
import { SITE } from '@/content/site';

/* ============================================================================
   THE HERO — the reference's bordered, image-led composition.

   One full-viewport slab of #101010 carrying the photograph edge to edge,
   with a 30px-radius panel laid over it. The panel's 12% black wash is
   graded into the picture file now (scripts/plates.py), not laid over it
   here. Inside the panel: a 70px technical rail on the left, the
   headline over the media, and a bottom row holding the dotted field
   and the statement plate.

   Nothing here is invented. The rail prints the location, the plate prints
   the firm's own description of itself, and the eyebrow carries the two
   facts that are on record — where we are and what we do.
   ========================================================================= */

export default function Hero() {
  return (
    <section className="pad-x relative flex h-[100svh] min-h-[720px] w-full flex-col items-center justify-center overflow-clip bg-raised pb-[30px] pt-[80px] tablet:pt-[74px] mobile:h-auto mobile:min-h-0 mobile:pb-[20px] mobile:pt-[70px]">
      {/* The photograph, inset 4px and rounded, exactly as the reference
          lays it — it is wider than the panel, so the panel reads as laid
          over a picture rather than a picture inside a box.

          IT PUBLISHES AT FULL STRENGTH. The reference renders every image on
          its homepage at `opacity: 1` and `filter: none`, and carries one
          gradient overlay on the entire page. Ours was at 0.72 behind a
          70%-black gradient, over a plate whose brightest pixel was 116 of
          255 — three separate reductions stacked on one picture, which is
          why the hero read as a black field rather than as a room. The
          darkening the headline needs is now graded into the plate itself
          (see scripts/plates.py), and so is the 12% the panel below used to
          lay over it, so what is left here is the picture. */}
      <div className="absolute inset-x-[4px] bottom-[4px] top-0 overflow-clip rounded-[30px] bg-raised mobile:rounded-[20px]">
        {/* The phone gets a portrait crop of the same room rather than a
            wide picture squeezed into a tall box — and only that crop. These
            were two images with one hidden by CSS, and a hidden image still
            downloads: ~100 KB on every first visit for a picture nobody
            saw. One <picture> now; see ArtImg in lib/Img.tsx. */}
        <ArtImg
          src={HERO.media}
          srcTall={HERO.mediaTall}
          alt={HERO.mediaAlt}
          className="media-fill"
        />
        {/* NO RUNTIME VEIL OVER THE PHOTOGRAPH. The film this picture needs is
            baked into the plate (scripts/plates.py, `filmgrain`), because the
            layer that used to sit here was mid-grey at 0.245 and lifted the
            hero's shadows from 20 to 57 — it undid the grade in the file. The
            reference's own pictures carry their grain in the file and its
            strip measures 20. Ours measured the same on the frame before
            the re-cut (see scripts/plates.py). */}
      </div>

      <div className="shell relative flex w-full flex-1 rounded-[30px] mobile:rounded-[20px]">
        <span className="absolute right-[30px] top-[30px] z-[2] mobile:right-[20px] mobile:top-[20px]">
          <Dots />
        </span>

        {/* The rail: the barcode at the top and the location at the foot.
            Hidden below 810px, as the reference hides its own. The reference
            prints a booking status under its barcode; this rail printed
            "STATUS: OPERATING" there until 25 Sep 2026, when the owner took
            it off, because no text of his uses the word. */}
        <div className="flex w-[70px] flex-none flex-col items-center justify-between py-[30px] mobile:hidden">
          <Barcode vertical className="h-[113px] w-[11px]" />
          <RailText>{SITE.location}</RailText>
        </div>

        {/* The content column. */}
        <div className="flex min-w-0 flex-1 flex-col justify-between p-[50px] mobile:gap-[40px] mobile:p-[20px]">
          <div className="flex flex-col gap-[40px] pb-[60px] mobile:gap-[30px] mobile:pb-0 mobile:pt-[30px]">
            <div className="flex flex-col gap-[38px] mobile:gap-[24px]">
              {/* `fit-head` opens the query container that `.t-hero` measures
                  itself against — see globals.css. */}
              <div className="fit-head flex flex-col gap-[12px]">
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
          <div className="flex min-w-0 items-end justify-between gap-[30px] overflow-clip tablet:gap-0 mobile:flex-col mobile:items-stretch">
            <DotGrid className="min-w-0 shrink overflow-clip mobile:hidden" />
            <div className="flex w-[390px] flex-none overflow-clip rounded-[12px] border border-rule-2 bg-ground/70 backdrop-blur-[2px] tablet:w-[451px] mobile:w-full">
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-[8px] border-b border-rule-3 px-[16px] py-[10px]">
                  <FirmMark className="text-lime" />
                  <span className="t-mark text-ink">{SITE.name}<span className="t-mark-r">{SITE.mark}</span></span>
                </div>
                <div className="flex gap-[12px] px-[16px] py-[14px]">
                  <RailText className="!text-ink-3">{HERO.plateStamp}</RailText>
                  <div className="flex flex-col gap-[10px]">
                    <p className="t-mono-9 !leading-[15px] text-ink-2">{HERO.plateBody}</p>
                    <p className="t-mono-9 text-ink">{HERO.plateSign}</p>
                  </div>
                </div>
              </div>
              {/* The picture at the card's right edge, rounded on that side
                  only — the reference's own 120x154 slot. Without it the text
                  ran the full 390 and the card read as a hollow slab. */}
              <Img
                src={HERO.plateMedia}
                alt={HERO.plateMediaAlt}
                sizes="120px"
                className="w-[120px] flex-none self-stretch object-cover mobile:w-[96px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
