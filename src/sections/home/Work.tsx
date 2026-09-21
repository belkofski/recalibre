import Link from 'next/link';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { Pill } from '@/components/ui';
import ContraxisDrawing from '@/components/ContraxisDrawing';
import { WORK, type Initiative } from '@/content/home';

/* ============================================================================
   SELECTED WORK.

   The reference runs six square CMS cards across a two-column seam plate at
   687px. Recalibre has three initiatives it may honestly show, so the plate,
   the 2px seam, the 30px card radius, the 30px inset and the hover are kept
   exactly, and the third card takes the full width of the second row rather
   than leaving a slot empty or repeating a project to fill it.

   The reference centres a client logo on each card. Ours centres the status,
   because the status is the fact that matters about each of these three.
   ========================================================================= */

function Card({ item, wide = false }: { item: Initiative; wide?: boolean }) {
  return (
    <Link
      href={`/work/${item.slug}`}
      className={`card-30 group focus-ring relative flex flex-col justify-end overflow-clip p-[30px] mobile:p-[20px] ${
        wide ? 'aspect-[2.93/1] mobile:aspect-square' : 'aspect-square'
      }`}
    >
      {item.drawing ? (
        <span className="absolute inset-0 flex items-center justify-center bg-ground">
          <ContraxisDrawing />
        </span>
      ) : item.src ? (
        <Img
          src={item.src}
          alt={item.alt}
          sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 687px"
          className="media-fill transition-transform duration-[900ms] ease-[var(--ease-in-view)] group-hover:scale-[1.03]"
        />
      ) : null}

      <span className="grain absolute inset-0" aria-hidden="true" />
      <span
        className="absolute inset-0 bg-gradient-to-t from-ground/85 via-ground/10 to-transparent"
        aria-hidden="true"
      />
      {/* The hover edge the reference draws on its case-study cards. */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[30px] border border-transparent transition-colors duration-300 group-hover:border-rule mobile:rounded-[20px]"
        aria-hidden="true"
      />

      {/* Where the reference sets a client mark, this sets the status —
          the one fact that matters about each of these three. On the drawn
          card it moves to the corner so it does not sit over the schematic. */}
      <span
        className={`absolute ${
          item.drawing ? 'left-[30px] top-[30px] mobile:left-[20px] mobile:top-[20px]' : 'inset-0 flex items-center justify-center'
        }`}
      >
        <span className="pill t-tag border-rule-2 bg-ground/60 text-ink backdrop-blur-[2px]">{item.status}</span>
      </span>

      <span className="relative flex items-end justify-between gap-[20px] mobile:flex-col mobile:items-start mobile:gap-[14px]">
        <span className="flex flex-col gap-[10px]">
          <span className="t-card text-ink">{item.name}.</span>
          <span className="t-mono text-ink-2">{item.meta}</span>
        </span>
        <span className="flex flex-wrap items-center justify-end gap-[8px]">
          {item.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </span>
      </span>
    </Link>
  );
}

export default function Work() {
  const [a, b, c] = WORK.items as readonly [Initiative, Initiative, Initiative];
  return (
    <section className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <div className="shell flex w-full flex-col gap-[100px] mobile:gap-[40px]">
        <div className="flex w-full justify-end">
          <div className="flex w-[690px] flex-col gap-[30px] narrow:w-full">
            <Rise as="h2" lines={WORK.headline} className="t-display text-ink" />
            <InView>
              <p className="t-body max-w-[360px] text-ink-2">{WORK.lede}</p>
            </InView>
          </div>
        </div>

        <InView className="seam grid w-full grid-cols-2 mobile:grid-cols-1">
          <Card item={a} />
          <Card item={b} />
          <div className="col-span-2 mobile:col-span-1">
            <Card item={c} wide />
          </div>
        </InView>
      </div>
    </section>
  );
}
