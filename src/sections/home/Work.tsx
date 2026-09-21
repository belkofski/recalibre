import Link from 'next/link';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { Pill } from '@/components/ui';
import { WORK, type Initiative } from '@/content/home';

/* ============================================================================
   SELECTED WORK.

   The reference runs six square CMS cards across a two-column seam plate at
   687px. Recalibre has three initiatives it may honestly show, so the plate,
   the 2px seam, the 30px card radius and the hover are kept exactly, and the
   third card takes the full width of the second row rather than leaving a
   slot empty or repeating a project to fill it.

   ── WHAT CHANGED, AND WHY ─────────────────────────────────────────────────

   The geometry was already close. The card was not. Measured against the
   reference, three things were wrong:

     THE ART DID NOT FILL. The reference renders each card image at about
     1.22x the box that clips it (838px of picture inside a 687px card) so
     the subject fills the frame. Ours sat a screenshot in the middle of a
     black field with a wide margin all round, which reads as a picture
     pasted onto a card rather than a card made of a picture.

     THE STATUS OWNED THE CENTRE. The reference centres the client's mark.
     Ours centred a bordered status pill — in the exact spot the eye goes
     first — and then repeated the same status word for word on the line
     underneath. The status now sits once, on a small plate in the top-left
     corner, with a lime dot for work Recalibre owns and an orange one for
     work still in development. The centre is left to the picture.

     ONE SCRIM FOR EVERY CARD. The reference's titles read because its
     photographs are dark at the bottom, not because it lays the same black
     sheet over everything. Two of ours are dark there and one — the OPS
     interface — is not, so the scrim is set per card instead of globally.
   ========================================================================= */

function Card({ item, wide = false }: { item: Initiative; wide?: boolean }) {
  const light = item.art === 'light';
  return (
    <Link
      href={`/work/${item.slug}`}
      aria-label={`${item.name} — ${item.status}`}
      className={`card-30 group focus-ring relative block overflow-clip ${
        wide ? 'aspect-[2.93/1] mobile:aspect-[1.6/1]' : 'aspect-square'
      }`}
    >
      <Img
        src={item.src}
        alt={item.alt}
        sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 690px"
        className="media-push transition-transform duration-[1100ms] ease-[var(--ease-in-view)] group-hover:scale-[1.3]"
      />

      {/* The picture carries its own film, so the plate here only keeps the
          card continuous with the rest of the page. */}
      <span className="grain grain-soft absolute inset-0" aria-hidden="true" />

      {/* The scrim, set to what this particular picture needs under a title. */}
      <span
        className={`absolute inset-x-0 bottom-0 z-[1] ${
          light
            ? 'h-[62%] bg-gradient-to-t from-ground via-ground/88 to-transparent'
            : 'h-[48%] bg-gradient-to-t from-ground/92 via-ground/38 to-transparent'
        }`}
        aria-hidden="true"
      />
      {/* A light picture also needs the top held down, or the corner tag and
          the mark sit on white. */}
      {light ? (
        <span
          className="absolute inset-x-0 top-0 z-[1] h-[30%] bg-gradient-to-b from-ground/55 to-transparent"
          aria-hidden="true"
        />
      ) : null}

      {/* The hover edge the reference draws on its case-study cards. */}
      <span
        className="pointer-events-none absolute inset-0 z-[3] rounded-[30px] border border-transparent transition-colors duration-500 group-hover:border-rule mobile:rounded-[20px]"
        aria-hidden="true"
      />

      {/* NOTHING AT THE CENTRE. The reference centres the client's logo there,
          which identifies work belonging to someone else. All three of these
          belong to Recalibre, so a mark in that position is either the same
          Recalibre glyph three times or the initiative's own name printed
          twice on one card — once in the middle and again in the title below
          it. Both are worse than leaving the picture alone, so the picture is
          left alone and the title carries the name once. */}

      {/* The status, once, in the corner, on its own plate so it reads over a
          light picture as well as a dark one. */}
      <span className="absolute left-[30px] top-[30px] z-[2] flex items-center gap-[7px] rounded-full border border-rule-2 bg-ground/70 py-[6px] pl-[10px] pr-[13px] backdrop-blur-[6px] mobile:left-[20px] mobile:top-[20px]">
        <span
          className={`block h-[6px] w-[6px] flex-none rounded-full ${item.tone === 'owned' ? 'bg-lime' : 'bg-flare'}`}
          aria-hidden="true"
        />
        <span className="t-tag text-ink">{item.status}</span>
      </span>

      {/* The title block. */}
      <span className="absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-[20px] p-[30px] mobile:flex-col mobile:items-start mobile:gap-[14px] mobile:p-[20px]">
        <span className="flex flex-col gap-[10px]">
          <span className="t-card text-ink">{item.name}.</span>
          <span className="t-mono text-ink-2">{item.meta}</span>
        </span>
        <span className="flex flex-wrap items-center justify-end gap-[8px] mobile:justify-start">
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
