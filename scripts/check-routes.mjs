#!/usr/bin/env node
/* The two language trees must be the same tree.
 *
 * English pages live in src/app/(en), French ones in src/app/fr, and each
 * page file is a few lines that pick a view and a locale (see
 * components/RootShell.tsx). This walks both and fails the build when a
 * route exists in one tree and not the other, or when a page in one tree
 * exports something the other does not (generateStaticParams, dynamicParams,
 * metadata, generateMetadata), so a French address cannot quietly go
 * missing or be built differently from its English twin. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const EN = join(ROOT, 'src/app/(en)');
const FR = join(ROOT, 'src/app/fr');

const PAGE_FILES = new Set(['page.tsx', 'layout.tsx', 'not-found.tsx']);

function walk(dir, base = dir, out = new Map()) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, base, out);
    else if (PAGE_FILES.has(name)) out.set(relative(base, p), exportsOf(p));
  }
  return out;
}

function exportsOf(file) {
  const src = readFileSync(file, 'utf8');
  const names = new Set();
  for (const m of src.matchAll(/^export\s+(?:const|function|async function|default(?: async)? function)\s+([A-Za-z_$][\w$]*)/gm)) {
    names.add(m[1] === 'Page' || m[1] === 'Layout' || m[1] === 'NotFound' || m[1] === 'CatchAll' ? 'default' : m[1]);
  }
  return [...names].sort().join(',');
}

const en = walk(EN);
const fr = walk(FR);
const problems = [];

for (const [route, exp] of en) {
  if (!fr.has(route)) problems.push(`missing in fr: ${route}`);
  else if (fr.get(route) !== exp) problems.push(`exports differ for ${route}: en [${exp}] fr [${fr.get(route)}]`);
}
for (const route of fr.keys()) if (!en.has(route)) problems.push(`missing in (en): ${route}`);

if (problems.length) {
  console.error('check-routes: the language trees differ');
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log(`check-routes: ${en.size} route files, both trees identical`);
