import { SITE } from '@/content/site';
import { SITE_URL, absoluteUrl } from '@/lib/seo';
import { home, services, industries, work, insights } from '@/content';

/* /llms.txt — what the site is, for a model that reads it (4 November 2026).
   The convention: a Markdown file at the root, a title, a one-line summary,
   then the pages worth reading with one line each. Every word is read off
   the same content the pages print, in English, with the French addresses
   listed at the end; nothing is written here that a page does not say. */

export const dynamic = 'force-static';

export function GET() {
  const H = home('en');
  const { SERVICES, FAMILIES } = services('en');
  const { SECTORS } = industries('en');
  const { INITIATIVES } = work('en');
  const { ARTICLES } = insights('en');
  const line = (label: string, path: string, desc: string) => `- [${label}](${absoluteUrl(path)}): ${desc}`;

  const text = `# ${SITE.name}

> ${SITE.name} is a ${SITE.descriptor.toLowerCase()} firm in ${SITE.location}. ${H.ABOUT.bodyLead}

${H.CAPABILITIES.lede} Every engagement starts with a Calibration: a fixed-scope assessment that produces a written plan the client keeps. Build and Partnership follow. Recalibre publishes no prices, no client results and no testimonials; two of its products, OPS and Contraxis, are in development and every screen of them on the site carries demonstration data.

## Services

${FAMILIES.map((f) => line(f.name, `/services/${f.slug}`, f.lede)).join('\n')}
${SERVICES.map((s) => line(s.headline.join(' ').replace(/\.$/, ''), `/services/${s.slug}`, s.meta.description)).join('\n')}

## Industries

${SECTORS.map((s) => line(s.name, `/industries`, s.meta.description)).join('\n')}

## Projects

${INITIATIVES.map((i) => line(i.name, `/projects/${i.slug}`, i.blurb ?? i.summary)).join('\n')}

## Insights

${ARTICLES.map((a) => line(a.title, `/insights/${a.slug}`, a.dek)).join('\n')}

## Contact

- [Contact](${absoluteUrl('/contact')}): an enquiry, or a quotation request naming a service, a scope and a timeline. Email ${SITE.email}, phone ${SITE.phone}.

## In French

The whole site is available in French under ${SITE_URL}/fr, page for page: ${absoluteUrl('/services', 'fr')}, ${absoluteUrl('/industries', 'fr')}, ${absoluteUrl('/projects', 'fr')}, ${absoluteUrl('/contact', 'fr')}.

## Optional

- [About](${absoluteUrl('/about')}): how the firm is structured and who answers for an engagement.
- [Privacy](${absoluteUrl('/privacy')}) and [Terms](${absoluteUrl('/terms')}).
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
