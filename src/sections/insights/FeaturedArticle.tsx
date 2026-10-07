import Link from 'next/link';
import { InView, Scene } from '@/lib/motion';
import { Card, Chevron, Orbs } from '@/components/ui';
import type { Article } from '@/content/insights';
import { DiagramFocus, leadSentence } from './ArticleArt';

/* ============================================================================
   THE FEATURED ARTICLE — the first in the list, the index's one big moment.

   One tilting `Card`, split 7/5 from 1200 up: the art in the wider column,
   revealed from its foot, and the words in the narrower one; below 1200 the
   art is a band over the words. The art is the Contraxis diagram pushed in
   toward "A person decides" as the card comes up the window (a Scene on the
   art box; ArticleArt's `DiagramFocus`).

   THE WORDS ARE THE TITLE AND ONE LINE (the third pass): the dek's first
   sentence, then the READ control. The label row and the meta line came
   off. One link: the title carries it with an overlay, so the whole card
   is the target and a screen reader hears it once.
   ========================================================================= */
export default function FeaturedArticle({ article: a }: { article: Article }) {
  const href = `/insights/${a.slug}`;
  return (
    <div className="seam flex w-full">
      <Card radius={30} interactive spot tilt as="article" className="insights-feature w-full overflow-clip">
        <InView mode="clip" className="insights-feature-art relative isolate overflow-clip">
          <Scene className="absolute inset-0" end={0.15}>
            <span aria-hidden="true" className="grid-dots absolute inset-0 -z-10 rounded-[inherit]" />
            <Orbs variant="card" />
            <span aria-hidden="true" className="sheen" />
            <DiagramFocus className="inset-(--space-5) mobile:inset-(--space-3)" />
          </Scene>
        </InView>

        <InView
          delay={150}
          className="flex flex-col justify-end gap-(--space-5) p-(--panel-pad)"
        >
          <h2 className="t-section text-ink">
            <Link href={href} className="tap-44">
              <span className="absolute inset-0" aria-hidden="true" />
              {a.title}
            </Link>
          </h2>
          <p className="t-lede max-w-[460px] text-ink-2">{leadSentence(a.dek)}</p>
          <span className="t-mono hover-read flex items-center gap-(--space-1)">
            <span className="link-line">READ THE ARTICLE</span>
            <span className="dot-btn">
              <Chevron />
            </span>
          </span>
        </InView>
      </Card>
    </div>
  );
}
