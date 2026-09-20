/**
 * CLIENT MARQUEE — measured y900 x0 1440×90, overflow clip.
 * Shell x120 w1200. Track: ul flex row, column-gap 72px, items h30.
 * 4 unique plates duplicated 3× (12 li). Velocity -24.0 px/s leftward.
 * One copy = 750.48px → 750.48 / 24.0 = 31.27s per cycle.
 * Plate widths at h30: 123.33, 103.33, 122.5, 113.33 (attr 296/248/294/272 × 72).
 */
const PLATES = [
  { src: '/img/client-1.png', w: 296, h: 72, boxW: 123.33 },
  { src: '/img/client-2.png', w: 248, h: 72, boxW: 103.33 },
  { src: '/img/client-3.png', w: 294, h: 72, boxW: 122.5 },
  { src: '/img/client-4.png', w: 272, h: 72, boxW: 113.33 },
] as const;

export default function Clients() {
  return (
    <section className="flex w-full shrink-0 items-center justify-center overflow-clip">
      <div className="mx-auto w-full max-w-[1200px] flex-1">
        <div className="flex h-[90px] w-full max-w-full items-center justify-start gap-[72px] overflow-clip">
          <div className="flex min-w-0 flex-1 items-center justify-start gap-[72px]">
            <ul className="marquee-track flex w-full max-w-full list-none items-center justify-start gap-[72px] p-0">
              {[0, 1, 2].map((copy) =>
                PLATES.map((p, i) => (
                  <li
                    key={`${copy}-${i}`}
                    className="relative h-[30px] shrink-0"
                    style={{ width: `${p.boxW}px` }}
                  >
                    <div className="absolute inset-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.src}
                        alt=""
                        width={p.w}
                        height={p.h}
                        loading="lazy"
                        className="block h-full w-full overflow-clip object-cover object-center"
                      />
                    </div>
                  </li>
                )),
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
