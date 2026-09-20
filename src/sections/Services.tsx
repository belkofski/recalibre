import { Eyebrow, H2 } from '@/lib/prim';
import { SERVICES } from '@/lib/content';
import PlateCard from './PlateCard';

const CARD_SIZES =
  '(min-width: 1200px) calc(max((min(100vw, 1200px) - 60px) / 3, 50px) * 1.01), (min-width: 810px) and (max-width: 1199.98px) calc(calc(min(100vw, 1200px) - 40px) * 1.01), (max-width: 809.98px) calc(calc(min(100vw, 1200px) - 40px) * 1.01)';

/**
 * SERVICES — measured y2112 x120 1200×1036.
 * section: flex column, gap 50px, padding 120px 20px (symmetric here).
 * head 1160×158, gap 24px, h2 wrap maxW 696px.
 * grid 1160×588: grid-template-columns 380px 380px 380px, rows 588px, gap 10px,
 *      justify-content center. Card x at 140 / 530 / 920 → pitch 390.
 *      The tracks are FIXED px, not fr. A fourth card would wrap.
 */
export default function Services() {
  return (
    <section className="mx-auto flex w-full max-w-[1200px] shrink-0 flex-col items-center justify-center gap-[50px] overflow-clip px-[20px] py-[120px] mobile:gap-[36px] mobile:py-[60px]">
      <div className="flex w-full shrink-0 flex-col items-start justify-center gap-[24px] overflow-clip">
        <Eyebrow>{SERVICES.eyebrow.text}</Eyebrow>
        <div className="flex max-w-[696px] shrink-0 flex-col justify-start">
          <H2>{SERVICES.heading.text}</H2>
        </div>
      </div>

      <div className="grid w-full shrink-0 justify-center gap-[10px] [grid-template-columns:380px_380px_380px] [grid-template-rows:588px] narrow:[grid-template-columns:repeat(3,minmax(50px,1fr))] narrow:[grid-template-rows:none] tablet:gap-[60px] mobile:gap-[36px] [&>*]:narrow:col-span-3">
        {SERVICES.cards.map((c, i) => (
          <PlateCard
            key={i}
            img={c.img}
            w={c.w}
            h={c.h}
            title={c.title.text}
            body={c.body.text}
            sizes={CARD_SIZES}
          />
        ))}
      </div>
    </section>
  );
}
