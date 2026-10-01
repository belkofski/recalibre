import Link from 'next/link';
import { InView } from '@/lib/motion';
import { LabelRow, MonoLink, Chevron } from '@/components/ui';
import { INSIGHTS_BLOCK } from '@/content/home';
import { ARTICLES } from '@/content/insights';

/* ============================================================================
   INSIGHTS.

   The reference's article block: a label, heading, lede and button, then
   the articles, each with its category, a two-line title, a standfirst and
   a read link. The reference ends each row with a coloured
   circular date badge; there is none here, because the site has never been
   public and no article has a true publication date yet (the founder's
   decision, 24 September 2026 — see content/insights.ts).

   The structure is CMS-shaped and the articles behind it are real — three
   method pieces written from the design of OPS and Contraxis, with no
   client, result, statistic or citation in any of them, and no claim of
   field or client experience (the founder's decision, 25 September 2026).

   A WHITE PANEL (the owner's decision, 26 September 2026): `theme-light
   band-light`, see globals.css, THE WHITE PANELS. The panel sets the
   padding above and below the content; the FAQ below pads its own top.

   SHORTER, THE SAME NIGHT (the owner's decision). The tall desk photograph
   that stood beside the articles is gone from this block — it is still the
   picture on the Insights page — and the three articles sit side by side.
   From a tablet down they stack, as they did.

   THE LABEL ROW IS THE HEAD (Phase B, 28 September 2026). The heading,
   the lede and the "All insights" button are gone: the button was a fifth
   on the page. The way to /insights is a MonoLink at the label row's right
   end, at every width. With no h2 above them, the three titles are the
   block's headings (h2).

   EACH ARTICLE REVEALS ITSELF (28 September 2026): 0 / 90 / 180ms by
   column, all at once below 1200 where they stack. Its dot, outside the
   link, fills under the pointer with the whole article (`.group`).

   OPEN TYPE ON THE WHITE (Phase C, 28 September 2026; experiment P3-3,
   kept 3 of 3). No seam plate and no card grounds: the three articles are
   columns of type on the panel's white, lined up with the label row and the
   tick rule, parted by a 1px hairline at 10% that runs from the category
   label to the READ THE ARTICLE row. With no ground there is no surface step
   under the pointer. Stacked below 1200, 32px either side of each hairline.
   `.ins-grid` / `.ins-col` in globals.css, HOME — INSIGHTS.
   ========================================================================= */

export default function Insights() {
  const I = INSIGHTS_BLOCK;
  return (
    <section className="theme-light band-light pad-x relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-(--space-label)">
        {/* The link is 44px tall; the negative margin keeps the row, and the
            label in it, at the height of every other label row. */}
        <LabelRow
          label={I.label}
          right={<MonoLink href={I.cta.href} label={I.cta.label.toUpperCase()} className="-my-[15px]" />}
        />

        <InView mode="picture" className="ins-grid grid w-full grid-cols-3 narrow:grid-cols-1">
          {ARTICLES.map((a, i) => (
            <InView
              as="article"
              key={a.slug}
              step={i}
              className="ins-col group relative flex flex-col narrow:[--in-delay:0ms]!"
            >
              <div className="flex flex-1 flex-col gap-[16px]">
                <span className="t-mono-11 text-ink-2">{a.subject}</span>
                <h2 className="t-card max-w-[470px] text-ink">
                  <Link href={`/insights/${a.slug}`} className="tap-44">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {a.title}
                  </Link>
                </h2>
                <p className="t-body max-w-[510px] text-ink-2">{a.dek}</p>
                {/* ONE LINK, NOT TWO. The title carries the link and its
                    overlay makes the whole card clickable. READ MORE was a
                    second link to the same article, so a screen reader
                    announced every article twice and a keyboard reader
                    tabbed through it twice. It is drawing now, with the same
                    words, and the pointer passes through it to the card.
                    `mt-auto` lines the three up along the foot of the row;
                    `tap-foot` sets the words on the card's padding line. */}
                <span className="tap-44 tap-foot pointer-events-none mt-auto inline-flex items-center gap-[8px]">
                  <span className="flex items-center gap-[8px]">
                    <span className="t-mono text-ink">READ THE ARTICLE</span>
                  </span>
                  <span className="dot-btn">
                    <Chevron />
                  </span>
                </span>
              </div>
            </InView>
          ))}
        </InView>
      </div>
    </section>
  );
}
