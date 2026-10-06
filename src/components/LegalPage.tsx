import PageHead from '@/components/PageHead';
import { InView } from '@/lib/motion';
import { Card, Eyebrow, LabelRow } from '@/components/ui';
import { SITE } from '@/content/site';

/* A paragraph is a string, or — when it carries a link — a list of parts,
   each a run of text or one link. The registered address on both pages is
   the one case: it ends in a link to the map pin the founder supplied. */
type Part = string | { label: string; href: string };
type Paragraph = string | { parts: readonly Part[] };
type Doc = {
  updated: string;
  intro: string;
  sections: readonly { heading: string; paragraphs: readonly Paragraph[] }[];
};

/* An outside link inside a sentence: the form's own inline-link style, with
   the "(opens in a new tab)" note screen readers get everywhere else on the
   site. Links inside a sentence are exempt from the 44px rule (see
   EnquiryForm). */
function Para({ p }: { p: Paragraph }) {
  if (typeof p === 'string') return <>{p}</>;
  return (
    <>
      {p.parts.map((part, k) =>
        typeof part === 'string' ? (
          part
        ) : (
          <a
            key={k}
            href={part.href}
            target="_blank"
            rel="noreferrer"
            className="text-ink underline decoration-rule underline-offset-2"
          >
            {part.label}
            <span className="sr-only normal-case"> (opens in a new tab)</span>
          </a>
        ),
      )}
    </>
  );
}

/**
 * The shell both legal routes share — the reference uses one template for
 * its two, and so does this: the split opener, then the document on a
 * 760px measure, then the contact card on the seam plate.
 *
 * The party each document binds is named in the document text itself
 * (content/legal.ts), in the same style as the sentences around it; this
 * shell adds nothing about the entity.
 *
 * Since the audit (6 October 2026) the document's headings are `t-section`,
 * the size every h2 on the site takes, so a legal page speaks in the same
 * voice as the rest; the contact block at the foot is the kit's `Card`.
 */
export default function LegalPage({ title, doc }: { title: string; doc: Doc }) {
  return (
    <>
      <PageHead
        lines={[title]}
        wrap
        lede={doc.intro}
        aside={
          <InView delay={120} className="flex flex-col gap-(--space-4)">
            <div className="flex flex-col gap-(--space-1) border-t border-rule pt-(--space-5)">
              <Eyebrow>LAST REVIEWED</Eyebrow>
              <span className="t-body tabular-nums text-ink">{doc.updated.replace('Last reviewed ', '')}</span>
            </div>
          </InView>
        }
      />

      {/* Not named after the title: the opener above is already the region
          called "Privacy policy." (or "Terms of service."), and a second
          region with the same name is a list of duplicates to a reader
          moving by landmark. */}
      <section aria-label="The document" className="pad-x pad-top flex w-full flex-col items-center overflow-clip">
        <div className="shell flex w-full flex-col gap-(--space-alone)">
          {/* The small label carries no full stop, as no label on the site does. */}
          <LabelRow label={title.replace(/\.$/, '').toUpperCase()} />

          <div className="mx-auto flex w-full max-w-[760px] flex-col gap-(--space-6)">
            {/* One column, so every section is step 0 of the stagger (28
                September 2026): a delay that grew with the index left the
                tenth section waiting 360ms after it was on screen. */}
            {doc.sections.map((s) => (
              <InView key={s.heading} as="article" className="flex flex-col gap-(--space-4)">
                <h2 className="t-section text-ink">{s.heading}</h2>
                <div className="flex flex-col gap-(--space-3)">
                  {s.paragraphs.map((p, j) => (
                    <p key={j} className="t-body text-ink-2">
                      <Para p={p} />
                    </p>
                  ))}
                </div>
              </InView>
            ))}

            {/* The contact card: the direct line, as the footer prints it.
                Below 600 the address scales with the width so it holds one
                line, the footer's own rule: the card's inset is the same
                84px there (gutter, seam and card padding on both sides). */}
            <InView mode="scale" className="seam-sm flex pt-(--space-4)">
              <Card radius={24} pad as="aside" aria-label="Contact" className="flex w-full flex-col gap-(--space-3)">
                <Eyebrow mark>CONTACT</Eyebrow>
                <a
                  href={`mailto:${SITE.email}`}
                  className="tap-44 t-card w-fit text-ink phone:text-[length:min(28px,calc((100vw-84px)/11.2))]!"
                >
                  {SITE.email}
                </a>
                <a href={`tel:${SITE.phoneHref}`} className="tap-44 t-mono w-fit text-ink">
                  {SITE.phone}
                </a>
                <span className="t-fine text-ink-3">{SITE.location}</span>
              </Card>
            </InView>
          </div>
        </div>
      </section>
    </>
  );
}
