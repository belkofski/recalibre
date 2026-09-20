import { BLOCKS } from '@/lib/blocks-content';
import Img from '@/lib/Img';
import Reveal from './Reveal';
import { HeadLines } from '@/lib/prim';
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
 *
 * PHONE. The card held a 1120.32px row of a 400px text column beside a 16:10
 * window. Above 1200px that is unchanged. Below it the two stack — words
 * first, picture under them — and the window keeps its 16:10 ratio at whatever
 * width the column now has, so a screenshot dropped in here will never be
 * squeezed to fit.
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

      <HeadLines
        lines={[B.headline.l1, B.headline.l2]}
        className="section-head mt-[20px] text-center text-on-dark"
      />

      <Reveal className="mt-[56px] flex w-full max-w-[1120.32px] flex-col gap-[16px]">
        {B.cards.map((card) => (
          <article
            key={card.n}
            className="card-lift card-lift-dark flex w-full items-stretch gap-[32px] rounded-[12px] bg-ink-3 p-[32px] narrow:flex-col narrow:gap-[24px] mobile:p-[20px]"
          >
            <div className="flex w-[400px] shrink-0 flex-col narrow:w-full">
              <div className="flex items-center gap-[12px]">
                <span className="meta-text font-mono text-accent">{card.n}</span>
                {/* The status word is rendered, not implied. Neither product
                    is claimed to be running anywhere, because neither is. */}
                <span className="rounded-full border border-rule-strong px-[10px] py-[3px] font-mono text-[11px] leading-[16px] tracking-[0.6px] whitespace-pre text-on-dark/72">
                  {card.status}
                </span>
              </div>
              <h3 className="title-1 mt-[14px] text-on-dark">{card.title}</h3>
              <p className="lead-text mt-[16px] text-on-dark-2">{card.body}</p>
            </div>

            {/* 16:10 window. object-top so that if a screenshot is a little
                taller than the frame, the interface's top edge survives. */}
            <figure data-evidence className="m-0 flex min-w-0 flex-1 flex-col">
              <div className="relative w-full overflow-clip rounded-[8px] border border-rule-on-dark bg-ink-2">
                <div className="aspect-[16/10] w-full">
                  {card.pending ? (
                    /* No Contraxis capture exists, so this is a drawing and
                       says so underneath. It is never a stand-in screenshot. */
                    <ContraxisDrawing steps={B.contraxisSteps} />
                  ) : (
                    <Img
                      src={card.img}
                      alt={card.alt}
                      sizes="(max-width: 1199px) 100vw, 688px"
                      className="block h-full w-full object-cover object-top"
                    />
                  )}
                </div>
              </div>
              <figcaption className="meta-text mt-[10px] text-on-dark-3">{card.caption}</figcaption>
            </figure>
          </article>
        ))}
      </Reveal>
    </section>
  );
}

/**
 * THE CONTRAXIS DRAWING.
 *
 * There is no screenshot of Contraxis, and none is invented. This is the
 * five steps of the product's own sentence — reads, identifies, converts,
 * traces, escalates — drawn as a numbered spine, with "Illustration — not a
 * screenshot." underneath it in the card's caption.
 *
 * It is deliberately NOT styled to look like an interface: no window chrome,
 * no fake toolbar, no sidebar. A drawing that impersonates a screenshot is
 * the same lie as a screenshot, told more slowly.
 */
function ContraxisDrawing({
  steps,
}: {
  steps: readonly { n: string; label: string; body: string }[];
}) {
  return (
    <ol className="flex h-full w-full flex-col justify-center gap-[10px] px-[22px] py-[18px] mobile:gap-[8px] mobile:px-[16px]">
      {steps.map((s, i) => (
        <li key={s.n} className="flex items-start gap-[12px]">
          <span className="relative flex flex-col items-center">
            <span aria-hidden="true" className="mt-[5px] block h-[7px] w-[7px] shrink-0 border border-rule-strong" />
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="mt-[2px] block w-px flex-1 bg-rule-on-dark" />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-mono text-[11px] leading-[16px] tracking-[0.6px] text-on-dark-3">{s.n}</span>
            <span className="ml-[8px] text-[14px] leading-[20px] font-semibold text-on-dark">{s.label}</span>
            <span className="mt-[1px] block text-[13px] leading-[18px] text-on-dark-3 mobile:hidden">{s.body}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
