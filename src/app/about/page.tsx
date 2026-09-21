import type { Metadata } from 'next';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import PageHead from '@/components/PageHead';
import { LabelRow, MonoLink, Barcode, Glyph, Chip } from '@/components/ui';
import { ABOUT as A } from '@/content/about';
import { SITE } from '@/content/site';
import Capabilities from '@/sections/home/Capabilities';
import Engagement from '@/sections/home/Engagement';
import Faq from '@/sections/home/Faq';
import Close from '@/sections/home/Close';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Recalibre is a strategy, design and technology firm structured so that strategy, design, agentic AI, automation and engineering are one capability carried by one team.',
};

/* ============================================================================
   ABOUT — the reference's own about composition, section for section.

     the split opener        heading left, figures and paragraph right
     the wide media band     one photograph at the page width
     the figure row          four structural facts on a 4-up grid
     the record block        how the firm is organized, with the chip rows
     the people block        the reference runs four portraits here
     the services deck       the same sticky chapters as the homepage
     three ways to start     the engagement cards
     the FAQ and the close

   TWO SUBSTITUTIONS, both for the same reason: Recalibre publishes no
   employee and no client. The reference's track-record table becomes the
   disciplines that carry an engagement; its four-portrait team grid becomes
   the same five disciplines at card scale, with the one named role — the
   founder — stated as a role rather than illustrated with a portrait that
   does not exist in the approved asset folder.
   ========================================================================= */
export default function AboutPage() {
  return (
    <>
      <PageHead
        lines={A.headline}
        mark="one program"
        aside={
          <>
            <div className="grid grid-cols-2">
              {A.figures.slice(0, 2).map((f, i) => (
                <InView
                  key={f.value}
                  delay={i * 90}
                  className={`flex flex-col gap-[16px] ${i > 0 ? 'border-l border-rule-2 pl-[50px]' : ''}`}
                >
                  <p className="t-figure text-ink">{f.value}</p>
                  <p className="t-mono text-ink-2">{f.label}</p>
                </InView>
              ))}
            </div>
            <InView className="flex flex-col items-start gap-[40px]">
              <p className="t-lede max-w-[500px] text-ink">
                {A.lede}
                <span className="text-ink-2"> {A.story.paragraphs[0]}</span>
              </p>
              <MonoLink href="/contact" label="CONTACT US" />
            </InView>
          </>
        }
      />

      {/* the wide media band */}
      <section aria-label="The studio" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <InView className="shell relative w-full overflow-clip rounded-[30px] mobile:rounded-[20px]">
          <div className="relative aspect-[1.8224/1] w-full mobile:aspect-[4/5]">
            <Img
              src="/img/plate-desk-wide.jpg"
              alt="A desk at night in black and white: a monitor showing a wireframe layout, a keyboard, and wireframe sketches on paper beside it."
              sizes="(max-width: 809px) 100vw, 1380px"
              className="media-fill"
            />
            <span className="grain absolute inset-0" aria-hidden="true" />
            <span
              className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-ground via-ground/70 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-[50px] mobile:p-[20px]">
              <Barcode className="h-[13px] w-[118px] mobile:hidden" />
              <span className="flex items-center gap-[8px]">
                <Glyph className="[&>i]:bg-white" />
                <span className="t-mark text-ink">{SITE.name}</span>
              </span>
            </div>
          </div>
        </InView>
      </section>

      {/* the figure row */}
      <section aria-label="The firm in figures" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell grid w-full grid-cols-4 tablet:grid-cols-2 tablet:gap-y-[40px] mobile:grid-cols-1 mobile:gap-[28px]">
          {A.figures.map((f, i) => (
            <InView
              key={f.label}
              delay={i * 80}
              className={`flex flex-col gap-[16px] ${i > 0 ? 'border-l border-rule-2 pl-[40px] mobile:border-0 mobile:pl-0' : ''}`}
            >
              <p className="t-figure text-ink">{f.value}</p>
              <p className="t-mono max-w-[200px] text-ink-2">{f.label}</p>
            </InView>
          ))}
        </div>
      </section>

      {/* the record block — where the reference lists its track record */}
      <section aria-labelledby="story-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-[70px] mobile:gap-[40px]">
          <div className="flex w-full flex-col items-end gap-[70px] mobile:gap-[30px]">
            <LabelRow label="HOW THE FIRM IS ORGANIZED" />
            <div className="flex w-[690px] narrow:w-full">
              <Rise as="h2" id="story-head" lines={A.story.heading} className="t-display text-ink" mark="structured" />
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-[100px] narrow:grid-cols-1 narrow:gap-[40px]">
            <div className="flex flex-col gap-[24px]">
              {A.story.paragraphs.slice(1).map((p) => (
                <p key={p.slice(0, 24)} className="t-body text-ink-2">
                  {p}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-[40px]">
              <div className="flex flex-col gap-[16px]">
                <p className="t-mono text-ink-2">THE STAGES</p>
                <div className="flex flex-wrap gap-[8px]">
                  {['CALIBRATION', 'SYSTEM DESIGN', 'BUILD AND VALIDATE', 'PARTNERSHIP'].map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-[16px]">
                <p className="t-mono text-ink-2">THE CAPABILITIES</p>
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
        <div className="shell flex w-full flex-col gap-[70px] mobile:gap-[40px]">
          <div className="flex w-full flex-col items-end gap-[70px] mobile:gap-[30px]">
            <LabelRow label={A.leadership.eyebrow} />
            <div className="flex w-[690px] flex-col gap-[30px] narrow:w-full">
              <Rise as="h2" id="lead-head" lines={A.leadership.heading} className="t-display text-ink" mark="Founder-led," />
              <InView>
                <p className="t-body max-w-[420px] text-ink-2">{A.leadership.body}</p>
              </InView>
            </div>
          </div>

          <InView className="seam grid w-full grid-cols-5 tablet:grid-cols-3 mobile:grid-cols-1">
            {A.disciplines.map((d) => (
              <div key={d.n} className="card-30 flex min-h-[300px] flex-col justify-between gap-[24px] p-[30px] mobile:min-h-0 mobile:p-[20px]">
                <p className="t-mono-11 text-lime">{d.n}</p>
                <div className="flex flex-col gap-[12px]">
                  <h3 className="t-card text-ink">{d.title}</h3>
                  <p className="t-small text-ink-2">{d.body}</p>
                </div>
              </div>
            ))}
          </InView>

          <InView className="flex items-center gap-[10px]">
            <Glyph className="[&>i]:bg-lime" />
            <p className="t-mono text-ink-2">{A.leadership.note}</p>
          </InView>
        </div>
      </section>

      <Capabilities />
      <Engagement />
      <Faq />
      <Close />
    </>
  );
}
