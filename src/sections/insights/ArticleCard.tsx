import Link from 'next/link';
import { Spotlight } from '@/lib/motion';
import { Chevron, cardClass } from '@/components/ui';
import { readingMinutes, type Article } from '@/content/insights';
import ArticleArt, { leadSentence } from './ArticleArt';

/* ============================================================================
   CARD/INSIGHT — an article that is not featured, on the Insights index.

   A lit surface with the spotlight: the framed capture on its dotted band,
   then the title and ONE line (the dek's first sentence), and the dot that
   fills on hover (the third pass cut the meta line and the READ words; the
   whole card is the title's link). `shape` sets the band: `wide` for the
   larger card of the row, `tall` for the smaller, so the two never read as
   one template (insights.css).

   The card is not its own reveal any more: its row is a Scene and the cards
   stagger in as the row comes up the window (`.sx-stagger` on the row,
   app/insights/page.tsx), so nothing here owns a transform.
   ========================================================================= */
export default function ArticleCard({ article: a, shape = 'wide' }: { article: Article; shape?: 'wide' | 'tall' }) {
  const href = `/insights/${a.slug}`;
  return (
    <Spotlight>
      <article className={`${cardClass({ radius: 30, interactive: true, spot: true })} flex w-full flex-col overflow-clip`}>
        <span aria-hidden="true" className="spot-light" />
        <div className={`insights-card-art insights-card-${shape} relative isolate w-full overflow-clip`}>
          <ArticleArt
            article={a}
            sizes={shape === 'wide' ? '(max-width: 809px) 100vw, 760px' : '(max-width: 809px) 100vw, 540px'}
            inset={
              shape === 'wide'
                ? 'inset-(--space-4) mobile:inset-(--space-3)'
                : 'inset-(--space-5) mobile:inset-x-(--space-6) mobile:inset-y-(--space-4)'
            }
          />
        </div>

        <div className="flex flex-1 items-end justify-between gap-(--space-4) p-(--card-pad)">
          <div className="flex flex-col gap-(--space-2)">
            <h3 className="t-card text-ink">
              <Link href={href} className="tap-44">
                <span className="absolute inset-0" aria-hidden="true" />
                {a.title}
              </Link>
            </h3>
            <p className="t-body max-w-[460px] text-ink-2">{leadSentence(a.dek)}</p>
          </div>
          <span aria-hidden="true" className="dot-btn flex-none">
            <Chevron />
          </span>
        </div>
      </article>
    </Spotlight>
  );
}

/* ============================================================================
   THE TEXT LINK — an article under another article ("Read next").

   A cross-link block carries no picture (the third pass): the subject and
   the reading time on one mono line, the title, and the chevron in its dot,
   on a surface card that lights under the pointer. One link, the card
   itself.
   ========================================================================= */
export function ArticleLink({ article: a }: { article: Article }) {
  return (
    <Spotlight>
      <Link
        href={`/insights/${a.slug}`}
        className={`${cardClass({ radius: 24, interactive: true, spot: true })} flex h-full items-center justify-between gap-(--space-4) px-(--card-pad) py-(--space-5)`}
      >
        <span aria-hidden="true" className="spot-light" />
        <span className="flex min-w-0 flex-col gap-(--space-2)">
          <span className="t-mono tabular-nums text-ink-3">
            {a.subject} · {readingMinutes(a)} MIN READ
          </span>
          <span className="t-card text-ink">{a.title}</span>
        </span>
        <span aria-hidden="true" className="dot-btn flex-none">
          <Chevron />
        </span>
      </Link>
    </Spotlight>
  );
}
