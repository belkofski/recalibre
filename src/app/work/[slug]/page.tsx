import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import ContraxisDrawing from '@/components/ContraxisDrawing';
import { INITIATIVES, initiativeBySlug } from '@/content/work';
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
   AN INITIATIVE PAGE.

   The reference's case-study template, with four of its eleven fields
   deliberately absent: the three-person project team, the animated results
   pair, the client quote with its rating, and the link to the live site.

   None of the four is hidden. The line at the foot of every one of these
   pages says what is not on it and why. A missing section is honest; a
   made-up figure is the one thing this site cannot survive, and it has
   already cost this project two earlier versions.
   ========================================================================= */
export default async function InitiativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = initiativeBySlug(slug);
  if (!item) notFound();

  const others = INITIATIVES.filter((i) => i.slug !== item.slug);

  return (
    <>
      {/* ── the opener ──────────────────────────────────────────────────── */}
      <section aria-labelledby="init-head" className="w-full overflow-clip border-b border-rule bg-raised grain">
        <div className="shell pad-x flex w-full flex-col gap-[20px] pb-[56px] pt-[130px] mobile:pb-[36px] mobile:pt-[96px]">
          <Link href="/work" className="focus-ring t-mono-9 tap-44 w-fit text-ink-3 hover:text-ink">
            ← All work
          </Link>

          <div className="flex flex-wrap items-center gap-[10px]">
            <span
              className={`t-mono-9 rounded-full border px-[10px] py-[5px] ${
                item.tone === 'dev'
                  ? 'border-[rgba(255,69,0,0.42)] text-flare'
                  : 'border-[rgba(199,255,151,0.34)] text-lime'
              }`}
            >
              {item.status}
            </span>
            <span className="t-mono-9 text-ink-3">
              {item.year} · {item.category}
            </span>
          </div>

          <Rise as="h1" id="init-head" lines={[`${item.name}.`]} className="t-display text-ink" />
          <p className="t-lede max-w-[54ch] text-ink-2">{item.summary}</p>
        </div>
      </section>

      {/* ── the facts rail ──────────────────────────────────────────────── */}
      <section aria-label="Details" className="w-full overflow-clip pad-top">
        <div className="shell pad-x grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-[40px] narrow:grid-cols-1">
          <InView className="flex flex-col gap-[24px]">
            <dl className="flex flex-col gap-px border-y border-rule-3 bg-rule-3">
              {[
                ['Year', item.year],
                ['Category', item.category],
                ['Status', item.status],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-[16px] bg-ground py-[14px]">
                  <dt className="t-mono-9 text-ink-3">{k}</dt>
                  <dd className="t-small m-0 text-right text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col gap-[10px]">
              <p className="t-mono-9 text-ink-3">SCOPE</p>
              <div className="flex flex-wrap gap-[6px]">
                {item.scope.map((s) => (
                  <span key={s} className="tag t-tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </InView>

          <InView delay={90} className="flex flex-col gap-[28px]">
            <div className="flex flex-col gap-[14px]">
              <p className="t-mono-9 text-ink-3">{item.problem.label}</p>
              <p className="t-lede max-w-[46ch] text-ink">{item.problem.body}</p>
            </div>

            <div className="grid grid-cols-3 gap-[16px] border-t border-rule-3 pt-[24px] mobile:grid-cols-1">
              {item.facts.map((f) => (
                <div key={f.unit} className="flex flex-col gap-[8px]">
                  <p className="t-figure text-ink">
                    {f.value}
                    <span className="t-card text-ink-3"> {f.unit}</span>
                  </p>
                  <p className="t-caption max-w-[24ch] text-ink-2">{f.label}</p>
                </div>
              ))}
            </div>
          </InView>
        </div>
      </section>

      {/* ── what is built ───────────────────────────────────────────────── */}
      <section aria-labelledby="built-head" className="w-full overflow-clip pad-top">
        <div className="shell pad-x flex w-full flex-col gap-[28px]">
          <h2 id="built-head" className="t-card text-ink">
            What is built.
          </h2>
          <ul className="flex flex-col border-t border-rule-3">
            {item.built.map((b, i) => (
              <InView key={b} as="li" delay={i * 50} className="flex items-start gap-[16px] border-b border-rule-3 py-[16px]">
                <span className="t-mono-9 shrink-0 pt-[3px] text-lime">{String(i + 1).padStart(2, '0')}</span>
                <span className="t-body max-w-[70ch] text-ink-2">{b}</span>
              </InView>
            ))}
          </ul>
        </div>
      </section>

      {/* ── the gallery ─────────────────────────────────────────────────── */}
      <section aria-label="Images" className="w-full overflow-clip pad-top">
        <div className="shell pad-x grid w-full grid-cols-2 gap-[16px] mobile:grid-cols-1">
          {item.shots.length > 0 ? (
            item.shots.map((shot, i) => (
              <InView key={shot.src} delay={(i % 2) * 90} className={shot.wide ? 'col-span-2 mobile:col-span-1' : ''}>
                <figure className="m-0 flex flex-col gap-[10px]">
                  <div className="card relative aspect-[16/10] w-full">
                    <Img
                      src={shot.src}
                      alt={shot.alt}
                      sizes={shot.wide ? '(max-width: 809px) 100vw, 1380px' : '(max-width: 809px) 100vw, 680px'}
                      className="block h-full w-full object-cover object-left-top"
                    />
                  </div>
                  <figcaption className="t-caption text-ink-3">{shot.caption}</figcaption>
                </figure>
              </InView>
            ))
          ) : (
            <InView className="col-span-2 mobile:col-span-1">
              <figure className="m-0 flex flex-col gap-[10px]">
                <div className="card relative aspect-[16/7] w-full mobile:aspect-[4/3]">
                  <ContraxisDrawing />
                </div>
                <figcaption className="t-caption text-ink-3">Illustration — not a screenshot.</figcaption>
              </figure>
            </InView>
          )}
        </div>
      </section>

      {/* ── what is deliberately not here ───────────────────────────────── */}
      <section aria-labelledby="absent-head" className="w-full overflow-clip pad-top">
        <div className="shell pad-x">
          <InView className="flex flex-col gap-[14px] rounded-[24px] border border-rule-2 bg-panel p-[32px] mobile:p-[22px]">
            <p id="absent-head" className="t-mono-9 text-ink-3">
              WHAT IS NOT ON THIS PAGE
            </p>
            <p className="t-body max-w-[76ch] text-ink-2">{item.absent}</p>
            <p className="t-small max-w-[76ch] text-ink-3">
              There is no project team, no results pair and no client quote on any initiative page on this
              site, because Recalibre has no employees to name, nothing yet measured, and no client who has
              given written permission to be quoted.
            </p>
          </InView>
        </div>
      </section>

      {/* ── the other two ───────────────────────────────────────────────── */}
      <section aria-labelledby="more-head" className="w-full overflow-clip pad-top">
        <div className="shell pad-x flex w-full flex-col gap-[28px]">
          <h2 id="more-head" className="t-card text-ink">
            The other initiatives.
          </h2>
          <div className="grid grid-cols-2 gap-[16px] mobile:grid-cols-1">
            {others.map((o, i) => (
              <InView key={o.slug} delay={i * 90}>
                <Link
                  href={`/work/${o.slug}`}
                  className="group focus-ring flex w-full flex-col overflow-clip rounded-[24px] border border-rule-2 bg-panel transition-[border-color,background-color] duration-[300ms] ease-hover hover:border-[rgba(255,255,255,0.28)] hover:bg-raised"
                >
                  <div className="relative aspect-[16/9] w-full overflow-clip bg-ground">
                    {o.cover ? (
                      <Img
                        src={o.cover}
                        alt={o.coverAlt}
                        sizes="(max-width: 809px) 100vw, 680px"
                        className="block h-full w-full object-cover object-left-top transition-transform duration-[600ms] ease-hover group-hover:scale-[1.03]"
                      />
                    ) : (
                      <ContraxisDrawing />
                    )}
                  </div>
                  <div className="flex flex-col gap-[10px] p-[22px]">
                    <p className="t-mono-9 text-ink-3">{o.status}</p>
                    <h3 className="t-card text-ink">{o.name}.</h3>
                  </div>
                </Link>
              </InView>
            ))}
          </div>
        </div>
      </section>

      <Close />
    </>
  );
}
