/* Resolves the project's `@/…` alias for scripts that import the content
 * files directly under Node (scripts/dump-strings.mjs). Registered with
 * `--import ./scripts/alias-loader.mjs`; Node's own type stripping handles
 * the `.ts` files. */
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register(
  'data:text/javascript,' +
    encodeURIComponent(`
export async function resolve(specifier, context, next) {
  if (specifier.startsWith('@/')) {
    const base = ${JSON.stringify(pathToFileURL(new URL('../src/', import.meta.url).pathname).href)};
    const target = base + specifier.slice(2);
    for (const ext of ['.ts', '.tsx', '/index.ts']) {
      try { return await next(target + ext, context); } catch {}
    }
    return next(target, context);
  }
  return next(specifier, context);
}
`),
  import.meta.url,
);
