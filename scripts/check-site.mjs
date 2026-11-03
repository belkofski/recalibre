#!/usr/bin/env node
/* The built site, read the way a crawler reads it.
 *
 * Starts the production server on a spare port, walks every address the
 * sitemap declares plus the ones that must answer in a particular way, and
 * checks what a search engine would check: status, one <h1>, a canonical,
 * the hreflang pairs with x-default, the language on <html>, the icons, the
 * JSON-LD parsing, no internal link that 404s, the old /work addresses
 * redirecting, and no draft block left unreviewed (that last one is a
 * warning, not a failure: the owner signs drafts off before the final
 * merge). Run after `next build`; `npm run verify` does.
 *
 * Node only, no browser: everything here is in the HTML the server sends,
 * which is also the point — a page a crawler cannot read without scripts is
 * a page this check cannot read either. */
import { spawn, execSync } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = Number(process.env.CHECK_PORT || 3999);
const BASE = `http://localhost:${PORT}`;
const ROOT = new URL('..', import.meta.url).pathname;

const failures = [];
const warnings = [];
const fail = (m) => failures.push(m);
const warn = (m) => warnings.push(m);

async function up() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const r = await fetch(`${BASE}/robots.txt`);
      if (r.ok) return;
    } catch {}
    await sleep(500);
  }
  throw new Error('server did not start');
}

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}
function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map((m) => attrs(m[0]));
}

async function get(path, redirect = 'follow') {
  const r = await fetch(`${BASE}${path}`, { redirect });
  return { status: r.status, headers: r.headers, html: redirect === 'follow' ? await r.text() : '' };
}

async function main() {
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { cwd: ROOT, stdio: 'ignore', env: { ...process.env, PORT: String(PORT) } });
  try {
    await up();

    // 1. the sitemap, and every address in it
    const sm = await get('/sitemap.xml');
    if (sm.status !== 200) fail(`sitemap: ${sm.status}`);
    const urls = [...sm.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    if (!urls.length) fail('sitemap lists nothing');
    const seen = new Set();
    const internal = new Set();
    const drafts = new Set();

    for (const path of urls) {
      if (seen.has(path)) fail(`sitemap lists ${path} twice`);
      seen.add(path);
      const { status, html, headers } = await get(path);
      if (status !== 200) {
        fail(`${path}: ${status}`);
        continue;
      }
      const isFr = path === '/fr' || path.startsWith('/fr/');
      const htmlTag = tags(html, 'html')[0] ?? {};
      if (htmlTag.lang !== (isFr ? 'fr' : 'en')) fail(`${path}: <html lang> is ${htmlTag.lang}`);
      const h1s = (html.match(/<h1\b/g) || []).length;
      if (h1s !== 1) fail(`${path}: ${h1s} <h1>`);
      const links = tags(html, 'link');
      const canonical = links.find((l) => l.rel === 'canonical');
      if (!canonical) fail(`${path}: no canonical`);
      else if (new URL(canonical.href).pathname !== path) fail(`${path}: canonical points at ${canonical.href}`);
      const alts = links.filter((l) => l.rel === 'alternate' && (l.hreflang || l.hrefLang));
      const langs = new Set(alts.map((l) => l.hreflang || l.hrefLang));
      if (!langs.has('x-default')) fail(`${path}: no x-default hreflang`);
      if (!langs.has(isFr ? 'fr' : 'en')) fail(`${path}: no self hreflang`);
      if (!links.some((l) => l.rel === 'icon')) fail(`${path}: no icon link`);
      if (!links.some((l) => l.rel === 'apple-touch-icon')) fail(`${path}: no apple-touch-icon link`);
      const metas = tags(html, 'meta');
      const robots = metas.find((m) => m.name === 'robots');
      if (robots && /noindex/.test(robots.content)) fail(`${path}: noindex on a sitemap page`);
      if (!metas.find((m) => m.name === 'description')?.content) fail(`${path}: no description`);
      const ogLocale = metas.find((m) => m.property === 'og:locale')?.content;
      if (ogLocale !== (isFr ? 'fr_FR' : 'en_US')) fail(`${path}: og:locale is ${ogLocale}`);
      if (!/<title>[^<]+<\/title>/.test(html)) fail(`${path}: no <title>`);
      for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
        try {
          JSON.parse(m[1]);
        } catch {
          fail(`${path}: JSON-LD does not parse`);
        }
      }
      if (!headers.get('content-security-policy')) fail(`${path}: no CSP header`);
      for (const a of tags(html, 'a')) {
        const href = a.href;
        if (!href || !href.startsWith('/') || href.startsWith('//')) continue;
        internal.add(href.split('#')[0].split('?')[0]);
      }
      if (isFr) {
        for (const label of ['START A CALIBRATION', 'Skip to content', 'All rights reserved']) {
          if (html.includes(label)) warn(`${path}: English string "${label}" in the French tree`);
        }
      }
      if (/DRAFT — owner review/.test(html)) drafts.add(path);
    }

    // 2. every internal link resolves
    for (const href of internal) {
      if (href === '' || href === '/') continue;
      if (href.startsWith('/_next') || href.startsWith('/img/')) continue;
      const r = await fetch(`${BASE}${href}`, { method: 'GET', redirect: 'manual' });
      if (r.status >= 400) fail(`link ${href}: ${r.status}`);
    }

    // 3. the 404s: one document (app/global-not-found.tsx) served in the
    //    site's own shell with a 404 status; the French reader's copy is
    //    swapped in on the client from the address (see views/NotFoundView).
    for (const path of ['/nope', '/fr/nope', '/work/nope', '/insights/nope', '/fr/insights/nope']) {
      const r = await fetch(`${BASE}${path}`, { redirect: 'manual' });
      if (r.status === 308 || r.status === 307) continue; // old addresses redirect first
      const html = await r.text();
      if (r.status !== 404) fail(`${path}: ${r.status}, not 404`);
      const htmlTag = tags(html, 'html')[0] ?? {};
      if (htmlTag.lang !== 'en') fail(`${path}: 404 page lang is ${htmlTag.lang}`);
      if (!/nf-head/.test(html)) fail(`${path}: not the site's own 404 page`);
      if (!/<header/.test(html)) fail(`${path}: 404 page served without the site shell`);
    }

    // 4. the old addresses redirect permanently (once /projects exists)
    for (const [from, to] of [['/work', '/projects'], ['/work/ops', '/projects/ops'], ['/fr/work', '/fr/projects']]) {
      const r = await fetch(`${BASE}${from}`, { redirect: 'manual' });
      if (r.status !== 308) {
        warn(`${from}: ${r.status}, not 308 → ${to} (expected until the projects work package lands)`);
        continue;
      }
      const loc = r.headers.get('location') || '';
      if (!loc.endsWith(to)) fail(`${from}: redirects to ${loc}, not ${to}`);
    }
    if (urls.some((u) => u === '/work' || u.startsWith('/work/'))) warn('sitemap still lists /work addresses');

    // 5. robots and manifest answer
    for (const p of ['/robots.txt', '/manifest.webmanifest']) {
      const r = await fetch(`${BASE}${p}`);
      if (r.status !== 200) fail(`${p}: ${r.status}`);
    }

    // 6. drafts awaiting the owner, read off the source (comments never reach the HTML)
    try {
      const out = execSync("grep -rln 'DRAFT — owner review' src/content src/views 2>/dev/null || true", { cwd: ROOT }).toString().trim();
      if (out) warn(`draft content awaiting owner review in: ${out.split('\n').join(', ')}`);
    } catch {}

    console.log(`check-site: ${urls.length} sitemap addresses, ${internal.size} internal links checked`);
    for (const w of warnings) console.log('  warning: ' + w);
    if (failures.length) {
      for (const f of failures) console.error('  FAIL: ' + f);
      process.exitCode = 1;
    } else console.log('check-site: no failures');
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
