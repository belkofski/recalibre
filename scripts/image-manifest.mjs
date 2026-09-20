/**
 * Reads the true pixel size of every file in public/img and writes it to
 * src/lib/images.generated.ts.
 *
 * WHY THIS EXISTS. Every <img> needs a width and a height so the browser can
 * reserve the right space before the file arrives — without them the page
 * jumps as images load. Those numbers were hand-written from the reference
 * site's own images, so six of them described a file that no longer existed at
 * that size: one claimed 8140x5427 for a 1160x773 file, another 774x770 for a
 * 59x59 one.
 *
 * Hand-written numbers go stale the moment a file is replaced. These are read
 * from the files themselves.
 *
 *   node scripts/image-manifest.mjs           regenerate
 *   node scripts/image-manifest.mjs --check   fail if stale (CI / pre-commit)
 *
 * No dependencies: PNG, JPEG, WebP and GIF headers are parsed directly.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'public/img';
const OUT = 'src/lib/images.generated.ts';

function size(buf) {
  // PNG: 8-byte signature, then IHDR length+type, then width/height
  if (buf.readUInt32BE(0) === 0x89504e47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  // GIF: little-endian width/height at byte 6
  if (buf.slice(0, 3).toString('latin1') === 'GIF') {
    return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
  }
  // WebP: RIFF container, three possible chunk types
  if (buf.slice(0, 4).toString('latin1') === 'RIFF' && buf.slice(8, 12).toString('latin1') === 'WEBP') {
    const chunk = buf.slice(12, 16).toString('latin1');
    if (chunk === 'VP8X') return { w: (buf.readUIntLE(24, 3) & 0xffffff) + 1, h: (buf.readUIntLE(27, 3) & 0xffffff) + 1 };
    if (chunk === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const b = buf.readUInt32LE(21);
      return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
    }
  }
  // JPEG: walk the marker segments to the first Start Of Frame
  if (buf.readUInt16BE(0) === 0xffd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  // SVG: no pixels, but a viewBox (or width/height) gives the aspect ratio,
  // which is all next/image needs to reserve the right box. Read as text.
  const head = buf.slice(0, 2048).toString('utf8');
  if (head.includes('<svg')) {
    const vb = head.match(/viewBox\s*=\s*["']\s*[-\d.]+[,\s]+[-\d.]+[,\s]+([\d.]+)[,\s]+([\d.]+)/);
    if (vb) return { w: Math.round(Number(vb[1])), h: Math.round(Number(vb[2])) };
    const w = head.match(/\bwidth\s*=\s*["']([\d.]+)/);
    const h = head.match(/\bheight\s*=\s*["']([\d.]+)/);
    if (w && h) return { w: Math.round(Number(w[1])), h: Math.round(Number(h[1])) };
  }
  return null;
}

const entries = [];
for (const name of readdirSync(DIR).sort()) {
  if (name.startsWith('.')) continue;
  const info = size(readFileSync(join(DIR, name)));
  if (!info) { console.warn(`  ? unreadable header, skipped: ${name}`); continue; }
  entries.push([`/img/${name}`, info]);
}

const body = entries.map(([k, v]) => `  '${k}': { w: ${v.w}, h: ${v.h} },`).join('\n');
const file = `/**
 * GENERATED — do not edit. Run \`npm run images\` after adding or replacing a
 * file in public/img.
 *
 * The true pixel size of every image, read from the file itself. See
 * scripts/image-manifest.mjs for why these are not written by hand.
 */
export const IMAGE_SIZE = {
${body}
} as const;

export type ImageSrc = keyof typeof IMAGE_SIZE;
`;

if (process.argv.includes('--check')) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (current !== file) {
    console.error('✗ image manifest is stale. Run: npm run images');
    process.exit(1);
  }
  console.log(`✓ image manifest matches all ${entries.length} files`);
} else {
  writeFileSync(OUT, file);
  console.log(`✓ wrote ${OUT} — ${entries.length} images`);
}
