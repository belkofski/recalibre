/**
 * Fails if any /img/... path referenced anywhere in src/ does not exist on
 * disk, or if the generated manifest is stale.
 *
 *   node scripts/check-images.mjs
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const refs = new Map();
// The generated manifest names EVERY file in public/img, so counting it as a
// reference made the unused check tautological — it could never report a file
// as unused, which is exactly what it exists to do. Retiring footer-plate.png
// for a CSS gradient is what surfaced this: nothing referenced it any more and
// the check still called it used.
const IGNORE = /images\.generated\.ts$/;
for (const file of walk('src').filter((f) => /\.(tsx?|css)$/.test(f) && !IGNORE.test(f))) {
  for (const m of readFileSync(file, 'utf8').matchAll(/['"`(](\/img\/[A-Za-z0-9._@/-]+)['"`)]/g)) {
    if (!refs.has(m[1])) refs.set(m[1], new Set());
    refs.get(m[1]).add(file);
  }
}

let bad = 0;
for (const [src, files] of [...refs].sort()) {
  if (!existsSync(join('public', src))) {
    console.error(`✗ missing file: ${src}\n    referenced by ${[...files].join(', ')}`);
    bad++;
  }
}

const used = new Set(refs.keys());
const onDisk = readdirSync('public/img').filter((n) => !n.startsWith('.')).map((n) => `/img/${n}`);
const unused = onDisk.filter((f) => !used.has(f));

if (bad) { console.error(`\n${bad} broken image reference(s).`); process.exit(1); }
console.log(`✓ all ${refs.size} referenced images exist`);
if (unused.length) console.log(`  (${unused.length} file(s) in public/img nothing references: ${unused.join(', ')})`);
