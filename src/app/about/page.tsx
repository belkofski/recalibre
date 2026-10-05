import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Img, { ArtImg } from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import { LabelRow, MonoLink, FirmMark, Chip, LinkedText } from '@/components/ui';
import { ABOUT as A } from '@/content/about';
import { SITE } from '@/content/site';
import Capabilities from '@/sections/home/Capabilities';
import Engagement from '@/sections/home/Engagement';

export const metadata: Metadata = pageMeta({
  title: 'About — a firm built to carry the whole program',
  description:
    'Recalibre is a strategy, design and technology firm. Strategy, design, agentic AI, automation and engineering are one integrated capability, carried by one team.',
  path: '/about',
  image: '/img/og-about-a.jpg',
  imageAlt: 'A rendered room: a chair facing a wide screen showing the OPS overview, an ottoman beside it, against a deep blue wall.',
});

/* ============================================================================
   ABOUT — the reference's own about composition, section for section.

     the split opener        heading left, figures and paragraph right
     the wide media band     the room, the firm's own art direction: the
                             seat facing the set, with its own phone cut
     (the figure row         four counts of the site's own content, 05 ·
                             03 · 02 · 01 — taken off on the owner's Phase A
                             brief of 27 September 2026, with the two
                             figures over the opener's paragraph)
     the record block        how the firm is organized, with the chip rows
     the people block        the reference runs four portraits here
     the services deck       the sticky capability chapters, with no button
     three stages            the homepage's three stages, one button in card
                             01, where the page ends
                             (the FAQ tail came off the same day: it is
                             read on Home and on Contact, and nowhere else)

   TWO SUBSTITUTIONS, both for the same reason: Recalibre publishes no
   employee and no client. The reference's track-record table becomes the
   disciplines that carry an engagement (the chip row is labelled THE
   DISCIPLINES; until 25 September 2026 it read THE CAPABILITIES, but the
   five capabilities are the cards on Home and are named differently); its
   four-portrait team grid becomes the same five disciplines at card scale,
   with the one named role — the founder — stated as a role. His portrait,
   the one on the homepage, stands beside the people block's heading, on
   the side the heading leaves bare, and under its paragraph on a phone
   (the owner's decision of 25 September 2026), with no name and no title
   (see content/about.ts).
   ========================================================================= */
export default function AboutPage() {
  return (
    <>
      <PageHead
        lines={A.headline}
        mark="whole program."
        aside={
          <InView className="flex flex-col items-start gap-[40px]">
            <p className="t-lede max-w-[500px] text-ink">
              {A.lede}
              <span className="text-ink-2"> {A.story.paragraphs[0]}</span>
            </p>
            <MonoLink href="/contact" label="START A CALIBRATION" />
          </InView>
        }
      />

      {/* the wide media band */}
      <section aria-label="The firm" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        {/* The picture tier (28 September 2026): the band fades in with no
            travel while the room inside it settles from 1.06 to 1. */}
        <InView mode="picture" className="shell relative w-full overflow-clip rounded-[30px] mobile:rounded-[20px]">
          <div className="relative aspect-[1.8224/1] w-full mobile:aspect-[4/5]">
            {/* The foot's darkening is in the plate now (scripts/plates.py,
                the hero's bottom falloff), so the page dims nothing. The
                barcode that stood at the foot's left came off on the owner's
                brief, section 26: a decorative barcode. The mark keeps the
                bottom-right corner. Not lazy since 28 September 2026: its
                top sits about 754px down a 900px laptop screen, where it is
                the largest paint. */}
            <div className="settle absolute inset-0">
              <ArtImg
                src="/img/plate-about-seat-a.jpg"
                srcTall="/img/plate-about-seat-tall-b.jpg"
                media="(max-width: 809.98px)"
                alt="A rendered room: a chair facing a wide screen showing the OPS overview, an ottoman beside it, against a deep blue wall."
                sizes="(max-width: 1199px) 100vw, 1380px"
                sizesTall="100vw"
                className="media-fill"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-end p-[50px] mobile:p-[20px]">
              <span className="flex items-center gap-[8px]">
                <FirmMark className="text-white" />
                <span className="t-mark text-ink">{SITE.name}<span className="t-mark-r">{SITE.mark}</span></span>
              </span>
            </div>
          </div>
        </InView>
      </section>

      {/* the record block — where the reference lists its track record */}
      <section aria-labelledby="story-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-alone)">
          <div className="flex w-full flex-col items-end gap-(--space-label)">
            <LabelRow label="HOW WE ARE ORGANIZED" />
            <div className="flex w-[690px] narrow:w-full">
              {/* No marked word here: the page has one, "whole program." in
                  its opener (C7, 28 September 2026). */}
              <Rise as="h2" id="story-head" lines={A.story.heading} className="t-display text-ink" />
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-[96px] narrow:grid-cols-1 narrow:gap-[40px]">
            <div className="flex flex-col gap-[24px]">
              {A.story.paragraphs.slice(1).map((p) => (
                <p key={p.slice(0, 24)} className="t-body text-ink-2">
                  <LinkedText text={p} links={A.story.links} />
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-[40px]">
              <div className="flex flex-col gap-[16px]">
                <p className="t-mono text-ink-2">THE STAGES</p>
                <div className="flex flex-wrap gap-[8px]">
                  {['CALIBRATION', 'BUILD', 'PARTNERSHIP'].map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-[16px]">
                <p className="t-mono text-ink-2">THE DISCIPLINES</p>
                <div className="flex flex-wrap gap-[8px]">
                  {['STRATEGY', 'DESIGN', 'AGENTIC AI', 'AUTOMATION', 'ENGINEERING'].map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* the people block */}
      <section aria-labelledby="lead-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-alone)">
          <div className="flex w-full flex-col items-end gap-(--space-label)">
            <LabelRow label={A.leadership.eyebrow} />
            {/* THE PORTRAIT TAKES THE SIDE OF THE ROW THE HEADING LEAVES
                BARE. From 1200 up the heading sits in the right-hand 690, so
                the portrait stands on the left; from 810 to 1199 the heading
                starts at the left edge, so it stands on the right. Either way
                its top is level with the heading's, and at 308 tall it is no
                taller than the heading and paragraph beside it, so the row
                keeps its height and nothing below it moves. On a phone there
                is no bare side, so the portrait follows the paragraph. 240
                wide is twice the home card's slot, and its plate is cut at
                480 for 2x screens. */}
            <div className="flex w-full flex-row-reverse items-start justify-between gap-[32px] tablet:flex-row mobile:flex-col">
              <div className="flex w-[690px] flex-col gap-(--space-lede) narrow:w-full">
                <Rise as="h2" id="lead-head" lines={A.leadership.heading} className="t-display text-ink" />
                <InView>
                  <p className="t-body max-w-[420px] text-ink-2">{A.leadership.body}</p>
                </InView>
              </div>
              {/* The portrait in a clip box of its own, so it can settle
                  inside its rounded frame without the frame growing. */}
              <InView mode="picture" className="w-[240px] flex-none overflow-clip rounded-[20px]">
                <div className="settle">
                  <Img
                    src={A.leadership.portrait}
                    alt={A.leadership.portraitAlt}
                    sizes="240px"
                    className="block w-[240px]"
                  />
                </div>
              </InView>
            </div>
          </div>

          {/* THE FIVE TITLES SHARE ONE LINE, and the five bodies one start,
              from their own content: each card takes the row's two tracks
              (title, body) through `grid-rows-subgrid`, so the
              tallest title in a row sets that track for all of them. No card
              has a floor since 28 September 2026 (it stood at 300, and the
              body at four lines). Five across from 1340 up: under that a
              34px "Engineering." is wider than its card, so the row runs
              three and two as on a tablet.

              EACH CARD IS ITS OWN REVEAL (28 September 2026), staggered by
              its place in the row and capped at the fourth step; a subgrid
              card cannot be wrapped, so the card IS the `InView`. NO NUMBER
              (Phase C, 29 September 2026): the five disciplines are not in
              an order, so a 01-05 over them only counted content (brief
              section 14). `d.n` stays as the key. */}
          <div className="seam grid w-full grid-cols-5 max-[1339.98px]:grid-cols-3 mobile:grid-cols-1">
            {A.disciplines.map((d, i) => (
              <InView
                key={d.n}
                step={i}
                className="card-30 row-span-2 grid grid-rows-subgrid gap-y-[16px] p-(--card-pad)"
              >
                <h3 className="t-card text-ink">{d.title}</h3>
                <p className="t-body text-ink-2">{d.body}</p>
              </InView>
            ))}
          </div>

          {/* A sentence, so it is set as one (C10.1, 28 September 2026):
              the caption type in sentence case, with no label mark. */}
          <InView>
            <p className="t-caption text-ink-2">{A.leadership.note}</p>
          </InView>
        </div>
      </section>

      <Capabilities />
      <Engagement />
    </>
  );
}
