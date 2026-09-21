import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { Tick, MonoLink, Glyph } from '@/components/ui';
import { CLOSE } from '@/content/home';
import { SITE } from '@/content/site';

/* ============================================================================
   THE CLOSING PANEL.

   The reference's last section before the form: one 1380px panel at radius
   30 carrying a grained still, the mark at the top, a centred two-line
   heading, a hairline drop, a line of copy, an "us + you" device built from
   a photograph, a plus and a dashed square, and a mono link.
   ========================================================================= */

export default function Close() {
  return (
    <section className="pad-x relative flex w-full flex-col items-center overflow-clip py-[80px] mobile:py-[40px]">
      <div className="card-30 shell relative flex w-full flex-col items-center overflow-clip px-[80px] pb-[130px] pt-[40px] tablet:px-[40px] tablet:pb-[80px] mobile:px-[20px] mobile:pb-[50px]">
        <Img
          src={CLOSE.media}
          alt={CLOSE.mediaAlt}
          sizes="(max-width: 809px) 100vw, 1380px"
          className="media-fill opacity-60"
        />
        <span className="grain absolute inset-0" aria-hidden="true" />
        <span className="absolute inset-0 bg-ground/55" aria-hidden="true" />

        <span className="relative flex items-center gap-[8px]">
          <Glyph className="[&>i]:bg-white" />
          <span className="t-mark text-ink">{SITE.name}</span>
        </span>

        <div className="relative flex flex-col items-center gap-[40px] pt-[70px] mobile:gap-[24px] mobile:pt-[40px]">
          <div className="flex flex-col items-center gap-[8px]">
            <Rise as="h2" lines={CLOSE.headline} className="t-display text-center text-ink" mark={CLOSE.mark} />
          </div>
          <Tick />
          <InView className="flex flex-col items-center gap-[60px] mobile:gap-[36px]">
            <p className="t-body max-w-[590px] text-center text-ink-2">{CLOSE.body}</p>

            {/* The "us + you" device. */}
            <div className="flex items-center gap-[68px] mobile:gap-[28px]">
              <span className="relative size-[120px] overflow-clip rounded-[12px] mobile:size-[92px]">
                <Img src={CLOSE.tile} alt={CLOSE.tileAlt} sizes="120px" className="media-fill" />
              </span>
              <span aria-hidden="true" className="relative block size-[16px]">
                <i className="absolute left-0 top-[7px] block h-px w-[16px] bg-white/60" />
                <i className="absolute left-[7px] top-0 block h-[16px] w-px bg-white/60" />
              </span>
              <span className="flex size-[120px] items-center justify-center rounded-[12px] border border-dashed border-rule mobile:size-[92px]">
                <span className="t-mono text-ink-2">{CLOSE.you}</span>
              </span>
            </div>

            <MonoLink href={CLOSE.cta.href} label={CLOSE.cta.label} />
          </InView>
        </div>
      </div>
    </section>
  );
}
