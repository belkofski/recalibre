#!/usr/bin/env node
/* Lists every string a reader can see in the content files, once each, so
 * the French dictionary (src/content/fr/dictionary.ts) can be written and
 * checked against it. Paths, slugs, addresses and anything that is not
 * prose are left out. Run with Node 22's type stripping:
 *
 *   node --experimental-strip-types --import ./scripts/alias-loader.mjs scripts/dump-strings.mjs
 *
 * With --check it exits non-zero when a visible English string has no
 * French entry, and lists them. */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = (p) => join(here, '..', 'src', p);

const modules = {
  home: await import(src('content/home.ts')),
  about: await import(src('content/about.ts')),
  services: await import(src('content/services.ts')),
  industries: await import(src('content/industries.ts')),
  work: await import(src('content/work.ts')),
  insights: await import(src('content/insights.ts')),
  legal: await import(src('content/legal.ts')),
  workflows: await import(src('content/workflows.ts')),
  site: await import(src('content/site.ts')),
  enquiry: await import(src('content/enquiry.ts')),
};

const SKIP_KEYS = new Set(['coverFrom', 'service', 'src', 'srcTall', 'srcCard', 'coverMore', 'coverMoreTall', 'cover', 'coverTall', 'hero', 'heroTall', 'share', 'media', 'mediaTall', 'mediaTablet', 'mediaPhone', 'portrait', 'image', 'href', 'slug', 'key', 'id', 'phoneHref', 'email', 'map', 'coordinates', 'year', 'video', 'icon', 'kind', 'family', 'services', 'projects', 'insight', 'industry', 'absent', 'figure', 'art', 'tone', 'state', 'markTone', 'from', 'to', 'n', 'col', 'row', 'value']);
const seen = new Set();
const out = [];
function walk(v, key = '') {
  if (typeof v === 'string') {
    if (SKIP_KEYS.has(key)) return;
    if (!v.trim() || v.startsWith('/') || v.startsWith('http') || /^[\d\s·.:+-]+$/.test(v)) return;
    if (!seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
    return;
  }
  if (Array.isArray(v)) return v.forEach((x) => walk(x, key));
  if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, k);
}
for (const [name, mod] of Object.entries(modules)) {
  for (const [k, v] of Object.entries(mod)) {
    if (typeof v === 'function') continue;
    if (name === 'enquiry' && !['CHALLENGE', 'CAPABILITY', 'TIMELINE'].includes(k)) continue;
    if (name === 'site' && !['NAV', 'NAV_SUB', 'LEGAL', 'SITE'].includes(k)) continue;
    if (name === 'services' && k === 'SERVICE_ROUTES') continue;
    walk(v, k);
  }
}
// The site's own descriptor and location are prose; its name is not.
const skipExact = new Set(['Recalibre', '®']);
const strings = out.filter((s) => !skipExact.has(s));

if (process.argv.includes('--check')) {
  const { DICTIONARY } = await import(src('content/fr/dictionary.ts'));
  const missing = strings.filter((s) => !(s in DICTIONARY));
  if (missing.length) {
    console.error(`dump-strings: ${missing.length} of ${strings.length} visible strings have no French entry:`);
    for (const m of missing) console.error('  ' + JSON.stringify(m));
    process.exit(1);
  }
  console.log(`dump-strings: all ${strings.length} visible strings have a French entry`);
} else {
  console.log(JSON.stringify(strings, null, 2));
}
