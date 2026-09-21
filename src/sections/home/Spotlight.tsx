import Link from 'next/link';
import Img from '@/lib/Img';
import { Rise, InView } from '@/lib/motion';
import { SPOTLIGHT as S } from '@/content/home';

/* ============================================================================
   THE SPOTLIGHT — block 08. Measured 1096px: a challenge column, an animated
   impact figure, a stack chip row, and a five-star review card.

   WHAT THE REFERENCE PUTS HERE is a client case study with a result: "72% of
   all tickets resolved end to end without a human", and a named quote under
   a 5.0/5 rating.

   WHAT GOES HERE INSTEAD is OPS, labelled in three separate places as in
   development, with demonstration data, and deployed with nobody.

   THE IMPACT COUNTER becomes three facts read out of the product's own code
   and recorded in the project file: fourteen pages, nine roles, three
   languages including right-to-left Arabic. Those describe the shape of what
   is built. They are not claims about what it has achieved, because it has
   not been used by anyone yet.

   THE "WHAT IT RUNS ON" CHIP ROW, which on the reference lists a client's
   SaaS subscriptions, states how OPS is deployed: self-hosted, one server,
   one database, held by whoever uses it. Also on record.

   THE REVIEW CARD IS GONE from this block and its geometry is reused by the
   principles block that follows.
   ========================================================================= */
export default function Spotlight() {
  return (
    <section id="ops" aria-labelledby="spot-head" className="w-full overflow-clip pad-top scroll-mt-[60px]">
      <div className="shell pad-x flex w-full flex-col gap-[40px]">
        {/* header */}
        <div className="flex items-end justify-between gap-[40px] narrow:flex-col narrow:items-start narrow:gap-[20px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-wrap items-center gap-[10px]">
              <span className="t-mono-9 rounded-full border border-[rgba(255,69,0,0.42)] px-[10px] py-[5px] text-flare">
                {S.status}
              </span>
              <p className="t-mono text-ink-3">{S.eyebrow}</p>
            </div>
            <Rise as="h2" id="spot-head" lines={S.headline} className="t-display max-w-[16ch] text-ink" />
          </div>
          <Link href={S.cta.href} className="pill focus-ring t-btn shrink-0">
            {S.cta.label}
            <span aria-hidden="true" className="block h-[5px] w-[5px] rounded-full bg-lime" />
          </Link>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-[16px] narrow:grid-cols-1">
          {/* the problem */}
          <InView className="flex flex-col justify-between gap-[28px] rounded-[24px] border border-rule-2 bg-panel p-[32px] mobile:p-[22px]">
            <div className="flex flex-col gap-[16px]">
              <p className="t-mono-9 text-ink-3">{S.challenge.label}</p>
              <p className="t-lede max-w-[34ch] text-ink">{S.challenge.body}</p>
            </div>

            <div className="flex flex-col gap-[14px]">
              <p className="t-mono-9 text-ink-3">{S.runsOn.label}</p>
              <p className="t-small max-w-[42ch] text-ink-2">{S.runsOn.note}</p>
              <div className="flex flex-wrap gap-[6px]">
                {S.runsOn.chips.map((c) => (
                  <span key={c} className="tag t-tag">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </InView>

          {/* what is built */}
          <InView delay={110} className="flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[20px] rounded-[24px] border border-rule-2 bg-panel p-[32px] mobile:p-[22px]">
              <p className="t-mono-9 text-ink-3">{S.facts.label}</p>
              <div className="grid grid-cols-3 gap-[16px] mobile:grid-cols-1">
                {S.facts.items.map((f) => (
                  <div key={f.unit} className="flex flex-col gap-[8px]">
                    <p className="t-figure text-ink">
                      {f.value}
                      <span className="t-card text-ink-3"> {f.unit}</span>
                    </p>
                    <p className="t-caption max-w-[22ch] text-ink-2">{f.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <figure className="card media-scrim relative m-0 aspect-[16/10] w-full">
              <Img
                src="/img/ops-interventions.png"
                alt="The OPS interventions register: each job with its reference, description, crew, zone, time and status, beside the permits falling due."
                sizes="(max-width: 1199px) 100vw, 720px"
                className="block h-full w-full object-cover object-left-top"
              />
              <figcaption className="absolute bottom-[14px] left-[14px] z-[2] rounded-full border border-rule bg-scrim px-[10px] py-[5px] t-mono-9 text-ink-2">
                OPS · Interventions. Demonstration data.
              </figcaption>
            </figure>
          </InView>
        </div>

        <p className="t-small max-w-[70ch] text-ink-3">{S.note}</p>
      </div>
    </section>
  );
}
