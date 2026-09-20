import { Eyebrow, H2 } from '@/lib/prim';
import { TESTIMONIALS as T } from '@/lib/content';

const AV_SIZES = '(min-width: 1200px) 60px, (min-width: 810px) and (max-width: 1199.98px) 60px, (max-width: 809.98px) 60px';

/** Avatar 60×59.69, aspect-ratio 1.00519/1, border-radius 100px. */
/** Measured intrinsics differ per instance: 774x770 on cards 1 and 2,
 *  800x1200 on card 3. Both render at 60x59.69 with object-fit cover. */
function Avatar({ src = '/img/avatar-round.png', w = 774, h = 770 }: { src?: string; w?: number; h?: number }) {
  return (
    <div className="relative aspect-[1.00519/1] h-[59.69px] w-[60px] shrink-0 rounded-[100px]">
      <div className="absolute inset-0 rounded-[100px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={w} height={h} loading="eager" sizes={AV_SIZES}
          className="block h-full w-full overflow-clip rounded-[100px] object-cover object-center" />
      </div>
    </div>
  );
}

/** Attribution block: 316×50.8, gap 10px, padding-left 20px (measured). */
function Attribution({ name, role, tone }: { name: string; role: string; tone: 'ink' | 'white' }) {
  return (
    <div className="flex w-full shrink-0 flex-col items-start justify-center gap-[10px] overflow-clip pl-[20px]">
      <div className="flex w-full shrink-0 flex-col justify-start">
        <h3 className={`text-[20px] leading-[24px] font-normal tracking-[-0.4px] whitespace-pre-wrap ${tone === 'ink' ? 'text-[rgb(8,16,20)]' : 'text-[rgb(255,255,255)]'}`}>{name}</h3>
      </div>
      <div className="flex w-full shrink-0 flex-col justify-start">
        <h3 className={`text-[12px] leading-[16.8px] font-medium tracking-[0.72px] whitespace-pre-wrap uppercase ${tone === 'ink' ? 'text-[rgb(112,112,112)]' : 'text-[rgb(200,200,200)]'}`}>{role}</h3>
      </div>
    </div>
  );
}

/** White quote card: 380×500, padding 32px, justify space-between, radius 0px. */
function QuoteCard({ quote, name, role, logo, logoW, avatar }: { quote: string; name: string; role: string; logo: string; logoW: number; avatar?: { src: string; w: number; h: number } }) {
  return (
    <div className="min-w-0 flex-1 narrow:w-full">
      <div className="flex h-[500px] flex-col items-center justify-between overflow-clip bg-[rgb(255,255,255)] p-[32px]">
        <div className="flex w-full shrink-0 items-center justify-between overflow-clip">
          <Avatar {...(avatar ?? {})} />
          {/* logo 136×44, object-fit contain at 100% 50%. Intrinsics measured
              203×48 on card 1 and 197×48 on card 3. */}
          <div className="relative h-[44px] w-[136px] shrink-0">
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="" width={logoW} height={48} loading="lazy"
                className="block h-full w-full overflow-clip object-contain object-[100%_50%]" />
            </div>
          </div>
        </div>
        <div className="flex w-full shrink-0 flex-col justify-start">
          <h3 className="text-[24px] leading-[28.8px] font-normal tracking-[-0.96px] whitespace-pre-wrap text-[rgb(8,16,20)]">{quote}</h3>
        </div>
        <Attribution name={name} role={role} tone="ink" />
      </div>
    </div>
  );
}

/**
 * TESTIMONIALS — measured y6806.73 x120 1200×934.
 * section padding 120px 20px 112px 20px — ASYMMETRIC (120 top, 112 bottom).
 * head 1160×158, gap 24px, h2 wrap maxW 774px, left aligned.
 * row 1160×500, flex row, gap 10px; items x140 / 530 / 920 → pitch 390.
 * The middle plate's scrim is linear-gradient(rgba(18,18,20,0) 24.5865%,
 * rgb(18,18,20) 100%) — that stop colour is rgb(18,18,20), NOT the page ink
 * rgb(8,16,20). It is the only place that colour appears.
 * Play control: 70×70 white circle, radius 100px, holding a 14×14 svg.
 */
export default function Testimonials() {
  return (
    <section className="mx-auto flex w-full max-w-[1200px] shrink-0 flex-col items-center justify-center gap-[44px] overflow-clip px-[20px] pt-[120px] pb-[112px] mobile:py-[60px]">
      <div className="flex w-full shrink-0 flex-col items-start justify-center gap-[24px] overflow-clip">
        <Eyebrow>{T.eyebrow.text}</Eyebrow>
        <div className="flex max-w-[774px] shrink-0 flex-col justify-start">
          <H2>{T.heading.text}</H2>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center justify-center gap-[10px] narrow:flex-col">
        <QuoteCard quote={T.quote1.quote.text} name={T.quote1.name.text} role={T.quote1.role.text} logo="/img/logo-strip-a.png" logoW={203} />

        {/* video plate */}
        <div className="min-w-0 flex-1 narrow:w-full">
          {/* video plate measures 500 at 1200px+, 484 in the middle band, 500 on mobile */}
          <div className="relative flex h-[500px] flex-col items-center justify-center gap-[10px] overflow-clip bg-[rgb(8,16,20)] tablet:h-[484px]">
            <div className="absolute inset-0 z-0 overflow-clip">
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/team-portrait.png" alt="" width={786} height={1040} loading="lazy"
                  sizes="(min-width: 1200px) max((min(100vw, 1200px) - 60px) / 3, 1px), (min-width: 810px) and (max-width: 1199.98px) calc(min(100vw, 1200px) - 40px), (max-width: 809.98px) calc(min(100vw, 1200px) - 40px)"
                  className="block h-full w-full overflow-clip object-cover object-center" />
              </div>
            </div>
            <div
              className="relative flex min-h-0 w-full flex-1 flex-col items-center justify-end overflow-clip p-[32px]"
              style={{ backgroundImage: 'linear-gradient(rgba(18, 18, 20, 0) 24.5865%, rgb(18, 18, 20) 100%)' }}
            >
              <div className="flex w-full min-h-0 flex-1 flex-col items-center justify-center gap-[10px] overflow-clip">
                <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center gap-[10px] overflow-clip rounded-[100px] bg-[rgb(255,255,255)]">
                  <svg viewBox="0 0 24 24" role="presentation" className="block aspect-square h-[14px] w-[14px] shrink-0 overflow-hidden">
                    {/* measured bounding box 15 x 17.99 inside the 24x24 viewBox */}
                    <path d="M 0 0 L 0 17.99 L 15 8.995 Z" fill="rgb(8, 16, 20)" />
                  </svg>
                </div>
                <div className="flex w-full shrink-0 flex-col items-center justify-center gap-[4px] overflow-clip">
                  <div className="flex w-full shrink-0 flex-col justify-start">
                    <p className="text-center text-[16px] leading-[24px] font-semibold whitespace-pre-wrap text-[rgb(255,255,255)]">{T.video.label.text}</p>
                  </div>
                  <div className="flex w-full shrink-0 flex-col justify-start">
                    <p className="text-center text-[14px] leading-[19.6px] whitespace-pre-wrap text-[rgb(200,200,200)]">{T.video.meta.text}</p>
                  </div>
                </div>
              </div>
              <Attribution name={T.video.name.text} role={T.video.role.text} tone="white" />
            </div>
          </div>
        </div>

        <QuoteCard quote={T.quote2.quote.text} name={T.quote2.name.text} role={T.quote2.role.text} logo="/img/logo-strip-b.png" logoW={197} avatar={{ src: '/img/avatar-tall.png', w: 800, h: 1200 }} />
      </div>
    </section>
  );
}
