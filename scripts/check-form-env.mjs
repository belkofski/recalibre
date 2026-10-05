/**
 * Stops a LIVE build when the contact form could not send.
 *
 *   node scripts/check-form-env.mjs     (runs itself before `npm run build`)
 *
 * In production the contact route refuses every enquiry unless all three
 * settings below are set (src/app/api/contact/route.ts), and the visitor is
 * told the form could not reach us. That is honest, but it is also every
 * enquiry lost, silently, for as long as nobody notices. This check makes
 * it loud (5 October 2026): a Netlify production build with any of the
 * three missing fails, with the reason in the deploy log, and the live site
 * stays on the last deploy that passed.
 *
 * Only Netlify's production context is checked (Netlify sets CONTEXT to
 * "production", "deploy-preview" or "branch-deploy"), so previews and a
 * build on this computer are never stopped.
 *
 * THE OWNER'S WAY OUT. The owner decided on 25 September 2026 that the live
 * site may run with the form off until the sending address is verified.
 * Setting ALLOW_FORM_OFF=1 in Netlify keeps that choice available: the build
 * then passes with a warning instead of failing.
 */
const NAMES = ['RESEND_API_KEY', 'CONTACT_TO', 'CONTACT_FROM'];

if (process.env.CONTEXT !== 'production') process.exit(0);

const missing = NAMES.filter((n) => !(process.env[n] ?? '').trim());
if (missing.length === 0) process.exit(0);

const lines = [
  '',
  `The contact form would refuse every enquiry: ${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} not set.`,
  'Set all three in Netlify (Site configuration > Environment variables), with a scope that',
  'includes Builds as well as Functions, then deploy again. See .env.example for what each one is.',
  'To publish with the form off on purpose, set ALLOW_FORM_OFF=1 there instead.',
  '',
];

if (process.env.ALLOW_FORM_OFF === '1') {
  console.warn(['WARNING (ALLOW_FORM_OFF=1, so the build goes on):', ...lines].join('\n'));
  process.exit(0);
}

console.error(['BUILD STOPPED:', ...lines].join('\n'));
process.exit(1);
