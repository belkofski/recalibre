import PageHead from '@/components/PageHead';
import { InView } from '@/lib/motion';
import { PENDING_ENTITY } from '@/content/legal';
import { SITE } from '@/content/site';

type Doc = {
  updated: string;
  intro: string;
  sections: readonly { heading: string; paragraphs: readonly string[] }[];
};

/**
 * The shell both legal routes share — the reference uses one template for
 * its two, and so does this.
 *
 * The pending-entity notice is rendered at the top of both, in the warning
 * accent, because a legal page that cannot name the party it binds is
 * incomplete and should say so where a reader will see it rather than in a
 * comment nobody reads.
 */
export default function LegalPage({ title, doc }: { title: string; doc: Doc }) {
  return (
    <>
      <PageHead eyebrow="LEGAL" lines={[title]} lede={doc.intro}>
        <p className="t-mono-9 mt-[6px] text-ink-3">{doc.updated}</p>
      </PageHead>

      <section aria-label={title} className="w-full overflow-clip pad-y">
        <div className="shell pad-x mx-auto flex w-full max-w-[760px] flex-col gap-[36px]">
          <p className="t-small rounded-[12px] border border-[rgba(255,69,0,0.42)] p-[18px] text-flare">
            {PENDING_ENTITY}
          </p>

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

          <div className="flex flex-col gap-[10px] border-t border-rule pt-[24px]">
            <p className="t-mono-9 text-ink-3">CONTACT</p>
            <a
              href={`mailto:${SITE.email}`}
              className="focus-ring tap-44 t-body text-ink transition-colors duration-[300ms] hover:text-lime"
            >
              {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phoneHref}`}
              className="focus-ring tap-44 t-body text-ink transition-colors duration-[300ms] hover:text-lime"
            >
              {SITE.phone}
            </a>
            <p className="t-small text-ink-3">{SITE.location}</p>
          </div>
        </div>
      </section>
    </>
  );
}
