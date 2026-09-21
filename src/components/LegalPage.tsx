import PageHead from '@/components/PageHead';
import { InView } from '@/lib/motion';
import { LabelRow, Glyph } from '@/components/ui';
import { PENDING_ENTITY } from '@/content/legal';
import { SITE } from '@/content/site';

type Doc = {
  updated: string;
  intro: string;
  sections: readonly { heading: string; paragraphs: readonly string[] }[];
};

/**
 * The shell both legal routes share — the reference uses one template for
 * its two, and so does this: the split opener, then the document on a
 * 760px measure, then the contact card on the seam plate.
 *
 * The pending-entity notice is rendered where a reader will see it, because
 * a legal page that cannot yet name the party it binds is incomplete and
 * should say so on its face rather than in a comment nobody reads.
 */
export default function LegalPage({ title, doc }: { title: string; doc: Doc }) {
  return (
    <>
      <PageHead
        lines={[title]}
        lede={doc.intro}
        aside={
          <InView className="flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[10px] border-t border-rule-2 pt-[30px]">
              <span className="t-mono-9 text-ink-3">LAST REVIEWED</span>
              <span className="t-note text-ink">{doc.updated.replace('Last reviewed ', '')}</span>
            </div>
            <p className="t-small max-w-[440px] rounded-[16px] border border-[rgba(255,69,0,0.42)] p-[18px] text-flare">
              {PENDING_ENTITY}
            </p>
          </InView>
        }
      />

      <section aria-label={title} className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-[70px] mobile:gap-[40px]">
          <LabelRow label={title.toUpperCase()} />

          <div className="mx-auto flex w-full max-w-[760px] flex-col gap-[36px]">
            {doc.sections.map((s, i) => (
              <InView key={s.heading} delay={i * 40} className="flex flex-col gap-[14px]">
                <h2 className="t-card text-ink">{s.heading}</h2>
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="t-body text-ink-2">
                    {p}
                  </p>
                ))}
              </InView>
            ))}

            <div className="flex flex-col gap-[14px] border-t border-rule-2 pt-[30px]">
              <span className="flex items-center gap-[7px]">
                <Glyph className="[&>i]:bg-lime" />
                <span className="t-mono text-ink-2">CONTACT</span>
              </span>
              <a
                href={`mailto:${SITE.email}`}
                className="focus-ring tap-44 t-note w-fit text-ink transition-colors duration-300 hover:text-lime"
              >
                {SITE.email}
              </a>
              <a
                href={`tel:${SITE.phoneHref}`}
                className="focus-ring tap-44 t-note w-fit text-ink transition-colors duration-300 hover:text-lime"
              >
                {SITE.phone}
              </a>
              <span className="t-mono-9 text-ink-3">{SITE.location}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
