import Link from 'next/link';

/**
 * PLATE CARD — measured y2440, 380×588 total.
 *   a          380×520, padding 24px, background rgb(8,16,20), justify end
 *   image      absolute inset -2.10938px / -1.90625px / -3.07812px / -1.89062px
 *              i.e. 383.8×525.19 — it bleeds ~2px past every edge. Measured, kept.
 *   scrim      same box, linear-gradient(rgba(8,16,20,0.4) 43.618%, rgb(8,16,20) 100%)
 *   notch      52×52 white square absolute top 0 right 0 — the card is notched
 *              into its own top-right corner. Holds the 20×20 arrow pair.
 *   title      TWO h3 nodes, both 24px/28.8px w400 ls -0.96px white, in a
 *              10px-gap overflow-hidden window; the duplicate sits at
 *              top 36px left 166px with transform translateX(-166px) so it
 *              arrives as the resting one leaves. Both nodes are real.
 *   body       380×48 below the plate, 20px gap, 16px/24px rgb(112,112,112)
 */
export default function PlateCard({
  img, w, h, title, body, sizes,
}: {
  img: string; w: number; h: number; title: string; body: string; sizes: string;
}) {
  return (
    <div className="shrink-0">
      <div className="flex flex-col items-center justify-center gap-[20px] overflow-clip">
        <Link
          href="/services"
          className="group/card relative flex h-[520px] w-full shrink-0 flex-col items-start justify-end overflow-clip bg-[rgb(8,16,20)] p-[24px]"
        >
          <div
            className="absolute z-0 overflow-clip"
            style={{ top: '-2.10938px', right: '-1.90625px', bottom: '-3.07812px', left: '-1.89062px' }}
          >
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt=""
                width={w}
                height={h}
                loading="lazy"
                sizes={sizes}
                className="block h-full w-full overflow-clip object-cover object-center"
              />
            </div>
          </div>
          <div
            className="absolute z-0 overflow-clip"
            style={{
              top: '-2.10938px', right: '-1.90625px', bottom: '-3.07812px', left: '-1.89062px',
              backgroundImage: 'linear-gradient(rgba(8, 16, 20, 0.4) 43.618%, rgb(8, 16, 20) 100%)',
            }}
          />

          {/* corner notch: 52×52, white, flush to top-right */}
          <div className="absolute top-0 right-0 z-[1] flex h-[52px] w-[52px] shrink-0 items-center justify-center gap-[10px] overflow-clip bg-[rgb(255,255,255)]">
            <div className="aspect-square w-[20px] shrink-0 bg-[rgb(8,16,20)]" />
            <div
              className="arrow-incoming absolute z-[1] aspect-square w-[20px] shrink-0 bg-[rgb(8,16,20)]"
              style={{ ['--rest-top' as string]: '56px', ['--hover-left' as string]: '56px' }}
            />
          </div>

          {/* title window: 28.8px tall, overflow hidden, two nodes */}
          <div className="relative flex w-full shrink-0 flex-col items-center justify-center gap-[10px] overflow-hidden">
            <div className="title-incoming absolute z-[1] flex w-full shrink-0 flex-col justify-start">
              <h3 className="text-[24px] leading-[28.8px] font-normal tracking-[-0.96px] whitespace-pre-wrap text-[rgb(255,255,255)]">
                {title}
              </h3>
            </div>
            <div className="title-resting flex w-full shrink-0 flex-col justify-start">
              <h3 className="text-[24px] leading-[28.8px] font-normal tracking-[-0.96px] whitespace-pre-wrap text-[rgb(255,255,255)]">
                {title}
              </h3>
            </div>
          </div>
        </Link>

        <div className="flex w-full shrink-0 flex-col justify-start">
          <p className="text-[16px] leading-[24px] whitespace-pre-wrap text-[rgb(112,112,112)]">{body}</p>
        </div>
      </div>
    </div>
  );
}
