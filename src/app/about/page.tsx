import type { Metadata } from 'next';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import { ABOUT as A } from '@/content/about';
import Capabilities from '@/sections/home/Capabilities';
import Process from '@/sections/home/Process';
import Close from '@/sections/home/Close';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Recalibre is a strategy, design and technology firm structured so that strategy, design, agentic AI, automation and engineering are one capability carried by one team.',
};

/* ============================================================================
   ABOUT.

   The reference's composition is kept: the story split, the figure row, the
   team grid, the services deck and the process cards.

   THE TRACK-RECORD LIST IS GONE. It names six clients across three date
   ranges. Recalibre has one external client and no written permission to
   name it. The block that follows — what has not been written down yet —
   occupies the same position and says what is absent instead.
   ========================================================================= */
export default function AboutPage() {
  return (
    <>
      <PageHead eyebrow={A.eyebrow} lines={A.headline} lede={A.lede} />

      {/* the story split */}
      <section aria-labelledby="story-head" className="w-full overflow-clip pad-top">
        <div className="shell pad-x grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-start gap-[48px] narrow:grid-cols-1 narrow:gap-[28px]">
          <Rise as="h2" id="story-head" lines={A.story.heading} className="t-display max-w-[14ch] text-ink" />
          <div className="flex flex-col gap-[18px]">
            {A.story.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="t-body-lg max-w-[58ch] text-ink-2">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* the figure row */}
      <section aria-label="The firm in figures" className="w-full overflow-clip pad-top">
        <div className="shell pad-x grid w-full grid-cols-4 gap-px border-y border-rule-3 bg-rule-3 tablet:grid-cols-2 mobile:grid-cols-1">
          {A.figures.map((f, i) => (
            <InView key={f.label} delay={i * 80} className="flex flex-col gap-[10px] bg-ground py-[32px] pr-[20px]">
              <p className="t-figure text-ink">{f.value}</p>
              <p className="t-small max-w-[24ch] text-ink-2">{f.label}</p>
            </InView>
          ))}
        </div>
      </section>

      {/* leadership */}
      <section aria-labelledby="lead-head" className="w-full overflow-clip pad-top">
        <div className="shell pad-x grid w-full grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start gap-[48px] narrow:grid-cols-1 narrow:gap-[28px]">
          <div className="flex flex-col gap-[18px]">
            <p className="t-mono text-ink-3">{A.leadership.eyebrow}</p>
            <Rise as="h2" id="lead-head" lines={A.leadership.heading} className="t-display max-w-[15ch] text-ink" />
            <p className="t-body-lg max-w-[52ch] text-ink-2">{A.leadership.body}</p>
            <p className="t-small max-w-[56ch] border-l-2 border-rule pl-[16px] text-ink-3">
              {A.leadership.note}
            </p>
          </div>

          <InView delay={90}>
            <figure className="card media-scrim relative m-0 aspect-[4/5] w-full narrow:aspect-[16/9]">
              <Img
                src="/img/studio-desk.jpg"
                alt="A desk at night in black and white: a monitor showing a wireframe layout, a mechanical keyboard, and hand-drawn wireframe sketches on paper beside it."
                sizes="(max-width: 1199px) 100vw, 620px"
                className="block h-full w-full object-cover"
              />
              <figcaption className="absolute bottom-[16px] left-[16px] z-[2] t-caption text-ink-2">
                Illustration.
              </figcaption>
            </figure>
          </InView>
        </div>
      </section>

      {/* the disciplines, in the team grid's geometry */}
      <section aria-labelledby="disc-head" className="w-full overflow-clip pad-top">
        <div className="shell pad-x flex w-full flex-col gap-[40px]">
          <div className="flex items-end justify-between gap-[40px] narrow:flex-col narrow:items-start narrow:gap-[16px]">
            <h2 id="disc-head" className="t-display max-w-[16ch] text-ink">
              How an engagement is staffed.
            </h2>
            <p className="t-body-lg max-w-[44ch] text-ink-2">
              Five disciplines, not five job titles. On a given engagement one person may carry two of them,
              and which two is decided by the work rather than by an org chart.
            </p>
          </div>

          <div className="grid grid-cols-5 gap-[16px] tablet:grid-cols-3 mobile:grid-cols-1">
            {A.disciplines.map((d, i) => (
              <InView key={d.n} delay={i * 70} className="flex">
                <div className="flex w-full flex-col gap-[14px] rounded-[24px] border border-rule-2 bg-panel p-[22px] transition-colors duration-[300ms] ease-hover hover:border-[rgba(255,255,255,0.24)]">
                  <p className="t-mono-11 text-lime">{d.n}</p>
                  <h3 className="t-lede text-ink">{d.title}</h3>
                  <p className="t-small text-ink-2">{d.body}</p>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* what is not written down — where the reference puts its client list */}
      <section aria-labelledby="open-head" className="w-full overflow-clip pad-top">
        <div className="shell pad-x">
          <InView className="flex flex-col gap-[20px] rounded-[24px] border border-rule-2 bg-panel p-[40px] mobile:p-[22px]">
            <Rise as="h2" id="open-head" lines={A.open.heading} className="t-card max-w-[20ch] text-ink" />
            <p className="t-body max-w-[72ch] text-ink-2">{A.open.body}</p>
          </InView>
        </div>
      </section>

      <Capabilities />
      <Process />
      <Close />
    </>
  );
}
