import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import ContraxisDrawing from '@/components/ContraxisDrawing';
import { LabelRow, Pill, Chip, MonoLink, Glyph, Barcode, DotGrid } from '@/components/ui';
import { INITIATIVES, initiativeBySlug } from '@/content/work';
import { SITE } from '@/content/site';
import Faq from '@/sections/home/Faq';
import Close from '@/sections/home/Close';

export function generateStaticParams() {
  return INITIATIVES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = initiativeBySlug(slug);
  if (!item) return { title: 'Not found' };
  return { title: item.name, description: item.summary };
}

/* ============================================================================
   AN INITIATIVE PAGE — the reference's case-study template.

     the cover panel      full width, the title set into its foot
     the meta grid        four fields across, then a two-tone paragraph
     the problem          right-aligned heading over the copy
     the facts            figures at counter scale
     what is built        a numbered list on hairlines
     the gallery          one wide, then a pair
     more initiatives     two cards on the seam plate

   TWO OF THE REFERENCE'S BLOCKS ARE NOT HERE. Its project-team row names
   three employees, and its client-quote block carries a five-star rating
   and an attributed quote. Recalibre has no employee to name and no client
   who has given written permission to be quoted, so both are removed rather
   than filled. The cover panel and the facts row take their space.
   ========================================================================= */
export default async function InitiativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = initiativeBySlug(slug);
  if (!item) notFound();

  const others = INITIATIVES.filter((i) => i.slug !== item.slug);

  return (
    <>
      {/* ── the cover panel ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="init-head"
        className="pad-x relative flex w-full flex-col items-center overflow-clip bg-raised pb-[30px] pt-[80px] tablet:pt-[74px] mobile:pb-[20px] mobile:pt-[70px]"
      >
        <div className="card-30 shell relative flex min-h-[640px] w-full flex-col justify-end overflow-clip p-[50px] mobile:min-h-[420px] mobile:p-[20px]">
          {item.cover ? (
            <Img
              src={item.cover}
              alt={item.coverAlt}
              priority
              sizes="(max-width: 809px) 100vw, 1380px"
              className="media-fill opacity-80"
            />
          ) : (
            <span className="absolute inset-0 flex items-start justify-center bg-ground pt-[7%] [&>svg]:max-h-[66%] [&>svg]:max-w-[80%]">
              <ContraxisDrawing />
            </span>
          )}
          <span className="grain grain-soft absolute inset-0" aria-hidden="true" />
          <span
            className="absolute inset-0 bg-gradient-to-t from-ground/95 via-ground/32 to-ground/8"
            aria-hidden="true"
          />

          <span className="absolute left-[50px] top-[40px] flex items-center gap-[18px] mobile:left-[20px] mobile:top-[20px]">
            <Link href="/work" className="focus-ring tap-44 flex items-center gap-[7px]">
              <Glyph className="rotate-180 [&>i]:bg-lime" />
              <span className="t-mono text-ink-2">ALL WORK</span>
            </Link>
          </span>

          <div className="relative flex flex-col gap-[24px]">
            <span className="pill t-tag w-fit border-rule-2 bg-ground/60 text-ink backdrop-blur-[2px]">
              {item.status}
            </span>
            <Rise as="h1" id="init-head" lines={[`${item.name}.`]} wrap className="t-display text-ink" />
            <p className="t-body max-w-[540px] text-ink-2">{item.summary}</p>
          </div>
        </div>
      </section>

      {/* ── the meta grid ───────────────────────────────────────────────── */}
      <section aria-label="Details" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-[70px] mobile:gap-[40px]">
          <div className="grid w-full grid-cols-4 tablet:grid-cols-2 tablet:gap-y-[30px] mobile:grid-cols-2 mobile:gap-[24px]">
            {(
              [
                ['YEAR', item.year],
                ['CATEGORY', item.category],
                ['STATUS', item.status],
                ['OWNER', item.tone === 'owned' ? `${SITE.name}` : 'In-house product'],
              ] as const
            ).map(([k, v], i) => (
              <InView
                key={k}
                delay={i * 60}
                className={`flex flex-col gap-[12px] ${i > 0 ? 'border-l border-rule-2 pl-[40px] mobile:border-0 mobile:pl-0' : ''}`}
              >
                <p className="t-mono-9 text-ink-3">{k}</p>
                <p className="t-note text-ink">{v}</p>
              </InView>
            ))}
          </div>

          <div className="grid w-full grid-cols-2 gap-[100px] narrow:grid-cols-1 narrow:gap-[40px]">
            <InView className="flex flex-col items-start gap-[40px]">
              <p className="t-lede text-ink">
                {item.problem.body.split('. ')[0]}.
                <span className="text-ink-2"> {item.problem.body.split('. ').slice(1).join('. ')}</span>
              </p>
              <MonoLink href="/contact" label="TALK ABOUT THIS WORK" />
            </InView>

            <InView delay={90} className="flex flex-col gap-[24px]">
              <p className="t-mono text-ink-2">SCOPE</p>
              <div className="flex flex-wrap gap-[8px]">
                {item.scope.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </InView>
          </div>
        </div>
      </section>

      {/* ── the facts ───────────────────────────────────────────────────── */}
      <section aria-label="What is built" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-[70px] mobile:gap-[40px]">
          <div className="flex w-full flex-col items-end gap-[70px] mobile:gap-[30px]">
            <LabelRow label={item.problem.label} />
            <div className="flex w-[690px] narrow:w-full">
              <h2 className="t-display text-ink">What is built.</h2>
            </div>
          </div>

          <div className="grid w-full grid-cols-3 mobile:grid-cols-1 mobile:gap-[28px]">
            {item.facts.map((f, i) => (
              <InView
                key={f.unit}
                delay={i * 80}
                className={`flex flex-col gap-[16px] ${i > 0 ? 'border-l border-rule-2 pl-[40px] mobile:border-0 mobile:pl-0' : ''}`}
              >
                <p className="t-figure text-ink">
                  {f.value}
                  <span className="t-body-lg text-ink-3"> {f.unit}</span>
                </p>
                <p className="t-mono max-w-[220px] text-ink-2">{f.label}</p>
              </InView>
            ))}
          </div>

          <InView className="seam grid w-full grid-cols-2 mobile:grid-cols-1">
            {item.built.map((b, i) => (
              <div key={b} className="card-30 flex items-start gap-[18px] p-[30px] mobile:p-[20px]">
                <span className="t-mono-11 shrink-0 pt-[4px] text-lime">{String(i + 1).padStart(2, '0')}</span>
                <span className="t-small text-ink-2">{b}</span>
              </div>
            ))}
          </InView>
        </div>
      </section>

      {/* ── the gallery ─────────────────────────────────────────────────── */}
      <section aria-label="Images" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        {item.shots.length > 0 ? (
          <InView className="seam shell grid w-full grid-cols-2 mobile:grid-cols-1">
            {item.shots.map((shot) => (
              <figure
                key={shot.src}
                className={`card-30 relative m-0 overflow-clip ${shot.wide ? 'col-span-2 mobile:col-span-1' : ''}`}
              >
                <div className="relative aspect-[16/10] w-full">
                  <Img
                    src={shot.src}
                    alt={shot.alt}
                    sizes={shot.wide ? '(max-width: 809px) 100vw, 1380px' : '(max-width: 809px) 100vw, 687px'}
                    className="media-fill object-left-top"
                  />
                  <span className="grain grain-soft absolute inset-0" aria-hidden="true" />
                </div>
                <figcaption className="t-mono-9 absolute bottom-[20px] left-[24px] text-ink-2">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </InView>
        ) : (
          <InView className="card-30 shell relative flex w-full items-center justify-center overflow-clip py-[60px]">
            <ContraxisDrawing />
            <span className="t-mono-9 absolute bottom-[24px] left-[30px] text-ink-2">Illustration — not a screenshot.</span>
            <DotGrid cols={9} rows={4} className="absolute right-[40px] top-[40px] mobile:hidden" />
            <Barcode className="absolute bottom-[24px] right-[30px] h-[13px] w-[118px] mobile:hidden" />
          </InView>
        )}
      </section>

      {/* ── more initiatives ────────────────────────────────────────────── */}
      <section aria-labelledby="more-head" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-[70px] mobile:gap-[40px]">
          <div className="flex w-full flex-col items-end gap-[70px] mobile:gap-[30px]">
            <LabelRow label="ALSO IN DEVELOPMENT" />
            <div className="flex w-[690px] narrow:w-full">
              <h2 id="more-head" className="t-display text-ink">
                More initiatives.
              </h2>
            </div>
          </div>

          <InView className="seam grid w-full grid-cols-2 mobile:grid-cols-1">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/work/${o.slug}`}
                className="card-30 group focus-ring relative flex aspect-[1.6/1] flex-col justify-end overflow-clip p-[30px] mobile:p-[20px]"
              >
                {o.cover ? (
                  <Img
                    src={o.cover}
                    alt={o.coverAlt}
                    sizes="(max-width: 809px) 100vw, 687px"
                    className="media-fill transition-transform duration-[900ms] ease-[var(--ease-in-view)] group-hover:scale-[1.03]"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-start justify-center bg-ground pt-[7%] [&>svg]:max-h-[66%] [&>svg]:max-w-[80%]">
                    <ContraxisDrawing />
                  </span>
                )}
                <span className="grain grain-soft absolute inset-0" aria-hidden="true" />
                <span
                  className="absolute inset-0 bg-gradient-to-t from-ground/85 via-ground/10 to-transparent"
                  aria-hidden="true"
                />
                <span className="relative flex items-end justify-between gap-[20px]">
                  <span className="flex flex-col gap-[10px]">
                    <span className="t-card text-ink">{o.name}.</span>
                    <span className="t-mono text-ink-2">
                      {o.year} · {o.category}
                    </span>
                  </span>
                  <span className="flex flex-wrap items-center justify-end gap-[8px] mobile:hidden">
                    {o.tags.slice(0, 2).map((t) => (
                      <Pill key={t}>{t}</Pill>
                    ))}
                  </span>
                </span>
              </Link>
            ))}
          </InView>
        </div>
      </section>

      <Faq />
      <Close />
    </>
  );
}
