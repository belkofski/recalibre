import { BLOCKS } from '@/lib/blocks-content';
import Img from '@/lib/Img';
import Reveal from './Reveal';
import Sparkle from './Sparkle';

/**
 * PRODUCTS (reference 5.webp, 2000x1244, scale 0.72) — REBUILT.
 *
 * The reference is a stack of full-bleed numbered PHOTO panels at 1120.32 x
 * 450, which is 2.49:1. That works for a photograph, where a crop loses
 * nothing that matters. It does not work for a product screenshot: a 16:9
 * capture dropped into a 2.49:1 box loses 28% of its height, top and bottom,
 * and a screenshot's top edge is where its navigation lives.
 *
 * So the panel became a card: text column left, a 16:10 window right, both
 * inside the reference's measured 1120.32 width. Nothing in the screenshot is
 * cropped, and the text is no longer sitting on top of the picture.
 *
 *   card      1120.32 wide, 32 padding, 32 gutter
 *   text      400
 *   window    622.32 at 16:10 -> 389, so the card stands 455 (verified live)
 *
 * The copy wraps naturally rather than being broken to fixed lines: these two
 * descriptions will change as the products ship, and hand-set breaks would
 * have to be re-solved every time.
 */
export default function Work() {
  const B = BLOCKS.work;
  return (
    <section
      id="products"
      className="section-pad flex w-full shrink-0 scroll-mt-[24px] flex-col items-center overflow-clip bg-ink"
    >
      <div className="flex items-center gap-[10.8px]">
        <Sparkle size={9.36} color="var(--color-accent)" />
        <p className="eyebrow whitespace-pre text-on-dark">{B.eyebrow}</p>
      </div>

      <h2 className="section-head mt-[20px] text-center text-on-dark">
        <span className="block whitespace-pre">{B.headline.l1}</span>
        <span className="block whitespace-pre">{B.headline.l2}</span>
      </h2>

      <Reveal className="mt-[56px] flex w-[1120.32px] flex-col gap-[16px]">
        {B.cards.map((card) => (
          <article
            key={card.n}
            className="card-lift card-lift-dark flex w-full items-stretch gap-[32px] rounded-[12px] bg-ink-3 p-[32px]"
          >
            <div className="flex w-[400px] shrink-0 flex-col">
              <span className="meta-text font-mono text-accent">{card.n}</span>
              <h3 className="title-1 mt-[14px] text-on-dark">{card.title}</h3>
              <p className="lead-text mt-[16px] text-on-dark-2">{card.body}</p>
            </div>

            {/* 16:10 window. object-top so that if a screenshot is a little
                taller than the frame, the interface's top edge survives. */}
            <div className="relative min-w-0 flex-1 overflow-clip rounded-[8px] border border-rule-on-dark bg-ink-2">
              <div className="aspect-[16/10] w-full">
                {card.pending ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-[8px]">
                    <span
                      aria-hidden="true"
                      className="block h-[28px] w-[28px] rounded-[6px] border border-rule-strong"
                    />
                    <p className="meta-text text-on-dark-3">Screenshot to come</p>
                  </div>
                ) : (
                  <Img
                    src={card.img}
                    alt={card.alt}
                    sizes="688px"
                    className="block h-full w-full object-cover object-top"
                  />
                )}
              </div>
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  );
}
