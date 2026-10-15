import { NextResponse } from 'next/server';
import { appendFile } from 'node:fs/promises';
import { CAPABILITY, CHALLENGE, EMAIL_RE, LIMITS, MAX_BODY_BYTES, TIMELINE } from '@/content/enquiry';
import { SITE } from '@/content/site';

/**
 * CONTACT SUBMISSIONS
 *
 * Deliberate behaviour, so that a real enquiry can never be silently swallowed:
 *
 *   configured   (RESEND_API_KEY + CONTACT_TO set,  → emailed, then confirmed
 *                and in production CONTACT_FROM too)
 *   development  (not configured)                   → appended to
 *                .contact-submissions.jsonl, confirmed, loud server warning
 *   production   (not configured)                   → REFUSED, and the visitor
 *                is told plainly rather than thanked for nothing
 *
 * The production refusal is the point. A contact form that says "thank you" and
 * drops the message is worse than no form at all.
 *
 * CONTACT_FROM IS REQUIRED IN PRODUCTION, by the owner's decision of 25
 * September 2026: the form stays off until his own sending address on
 * recalibre.cloud is set. Without it the email would come from Resend's test
 * sender, onboarding@resend.dev, which delivers only to the owner of the
 * Resend account. In development the test sender is still the fallback.
 *
 * ── WHAT A MALFORMED REQUEST USED TO DO ───────────────────────────────────
 *
 * The body was cast to a type and read straight away — `(body.name ?? '')
 * .trim()`. A cast is not a check. `null` threw on the property read and a
 * numeric name threw on `.trim()`, and both surfaced as an empty 500: a
 * server exception shown to whoever sent it, with a stack trace in the log
 * and nothing useful in the response.
 *
 * Every field is now proved to be a string before it is touched, every
 * length is capped, every dropdown value has to be one this site actually
 * offered, and the request itself has a size ceiling. Anything that fails
 * comes back as a 400 or a 422 that says which field it was.
 *
 * ── THE FORM WITHOUT SCRIPTS ──────────────────────────────────────────────
 *
 * The browser posts the form here itself when the page's script is off or
 * never loaded, as `application/x-www-form-urlencoded`. That body is read
 * into the same shape and goes through the same checks; the only difference
 * is the answer, which is a plain page saying what happened rather than JSON
 * nobody would see. The words on it are the form's own.
 *
 * ── WHERE IT CAME FROM ────────────────────────────────────────────────────
 *
 * The form fills in one field itself, `origin`: the page, part of the page
 * and link that brought a visitor to the contact page, or the page a footer
 * form was sent from (lib/origin.tsx). It is text like every field, but it
 * is never required, control characters in it become spaces, and past its
 * ceiling it is cut rather than refused, so nothing in it can turn a valid
 * enquiry away. It reaches the email as the line "Came from:" after the
 * three optional answers — a dash when it is empty, as it is when the form
 * is sent without scripts — and the development log as `origin`. The email
 * is plain text, so there is nothing in it to escape.
 */

/** Fields that must be strings when present. Anything else is a 400. */
const STRING_FIELDS = [
  'name',
  'organization',
  'email',
  'challenge',
  'capability',
  'timeline',
  'message',
  'website',
  'origin',
] as const;

type Clean = Record<(typeof STRING_FIELDS)[number], string>;

function bad(message: string, status = 400, field?: string) {
  return NextResponse.json({ ok: false, message, field }, { status });
}

/** True when the browser posted the form itself — see the header. */
function isPlainForm(request: Request): boolean {
  return (request.headers.get('content-type') ?? '').startsWith('application/x-www-form-urlencoded');
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** The sentence the form prints under a required answer that failed. The
 *  JSON line for a 422 says "the highlighted fields"; the scripts-off page
 *  has no field to highlight, so it prints the form's own words instead. */
const FIELD_SENTENCE = new Map<string, string>([
  ['name', 'Please give us a name to reply to.'],
  ['email', 'That does not look like an email address we can reply to.'],
  ['message', 'A sentence or two about the problem, so we can be useful.'],
]);

/** The scripts-off answer. Every sentence is one the form already shows:
 *  the confirmation block on success, the failure line otherwise. */
function plainPage(ok: boolean, message: string, status: number, field?: string): Response {
  const line = (status === 422 && field ? FIELD_SENTENCE.get(field) : undefined) ?? message;
  const body = ok
    ? `<h1>That has reached us.</h1>
<p>Your message has been delivered to us by email and a person will read it — there is no autoresponder, so nothing further arrives in your inbox until we reply. To add anything to it, write to us directly.</p>
<p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
<p><a href="tel:${SITE.phoneHref}">${SITE.phone}</a></p>`
    : `<p>${escapeHtml(line)} Email <a href="mailto:${SITE.email}">${SITE.email}</a> directly.</p>`;
  return new Response(
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${SITE.name}</title>
</head>
<body>
${body}
<p><a href="/contact">Back to the form</a></p>
</body>
</html>
`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

/* --------------------------------------------------------------------------
   ABUSE PROTECTION

   Two measures, both cheap and neither of them a CAPTCHA:

   1. A hidden field named `website`. A person never sees it and never fills
      it; the common form-spam bots fill every input they find. A filled one
      is accepted with a 200 and quietly dropped, because telling a bot it
      was detected only teaches it.

   2. A fixed window per address. Five delivered messages in ten minutes is
      far above anything a real enquirer does and far below a flood.

   The window is in memory, so it resets when the server restarts and is not
   shared between instances if this is ever deployed behind more than one.
   It raises the cost of a naive script, which is what it is for. A
   deployment that needs more than that should put a rate limit at the edge.
   -------------------------------------------------------------------------- */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

/** Who is sending. `x-forwarded-for` is whatever the sender wrote unless the
 *  host in front of this server overwrites it, and no host is chosen yet, so
 *  this is the best available name for a visitor and not a proof of one. The
 *  day the host is known, the address it guarantees is read here and nowhere
 *  else. */
function sender(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function recentFrom(who: string, now: number): number[] {
  return (hits.get(who) ?? []).filter((t) => now - t < WINDOW_MS);
}

/** A PLACE IN THE WINDOW IS TAKEN BEFORE DELIVERY AND GIVEN BACK IF THE
 *  SEND FAILS. The window used to count the attempt, so a visitor retrying
 *  a send that kept failing was told they had sent several messages when
 *  nothing had gone anywhere. Counting only after delivery fixed that and
 *  opened a gap the other way: a burst of simultaneous sends all passed the
 *  check before any of them was counted, and ten at once from one address
 *  went through where five should have. So the place is taken first,
 *  synchronously, and released when the send fails — a failed send still
 *  costs nothing, and a burst is still capped at five. Returns the stamp to
 *  release, or null when the window is full. */
function reserve(who: string): number | null {
  const now = Date.now();
  const recent = recentFrom(who, now);
  if (recent.length >= MAX_PER_WINDOW) return null;
  recent.push(now);
  hits.set(who, recent);
  // Keep the map from growing without bound on a long-lived server.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return now;
}

/** Gives one place back: the one the failed send took, not every send that
 *  happened to land in the same millisecond. */
function release(who: string, stamp: number): void {
  const recent = hits.get(who);
  if (!recent) return;
  const i = recent.indexOf(stamp);
  if (i >= 0) recent.splice(i, 1);
  if (!recent.length) hits.delete(who);
}

/** How long the email provider gets before we stop waiting for it. A fetch
 *  with no signal can hang for as long as the platform allows, which means
 *  the visitor watches "Sending…" until their own browser gives up. */
const PROVIDER_TIMEOUT_MS = 8000;

export async function POST(request: Request) {
  const plain = isPlainForm(request);
  const res = await handle(request, plain);
  if (!plain) return res;
  // The browser sent the form itself, so it gets a page it can show rather
  // than JSON it would print as text.
  const { ok, message, field } = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    message?: string;
    field?: string;
  };
  return plainPage(ok === true, message ?? '', res.status, field);
}

async function handle(request: Request, plain: boolean): Promise<Response> {
  /* ---- the request itself ------------------------------------------- */
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return bad('That submission is too large to accept.', 413);
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return bad('That submission could not be read.', 400);
  }
  if (raw.length > MAX_BODY_BYTES) {
    return bad('That submission is too large to accept.', 413);
  }

  let parsed: unknown;
  if (plain) {
    // The browser's own encoding of the form. Every value is already a
    // string, so the shape check below passes it straight through.
    parsed = Object.fromEntries(new URLSearchParams(raw));
  } else {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return bad('That submission was malformed.', 400);
    }
  }

  /* ---- the shape ------------------------------------------------------ */
  // `typeof null === 'object'` and an array is an object too, so both have
  // to be excluded explicitly. This is the check whose absence produced the
  // empty 500s.
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return bad('That submission was malformed.', 400);
  }
  const body = parsed as Record<string, unknown>;

  const clean = {} as Clean;
  for (const key of STRING_FIELDS) {
    const value = body[key];
    if (value === undefined || value === null) {
      clean[key] = '';
      continue;
    }
    if (typeof value !== 'string') {
      return bad(`The ${key} field must be text.`, 400, key);
    }
    clean[key] = value.trim();
  }

  /* ---- the honeypot --------------------------------------------------- */
  if (clean.website) {
    console.warn('[contact] honeypot filled — dropped');
    return NextResponse.json({ ok: true });
  }

  /* ---- the three required answers ------------------------------------- */
  if (clean.name.length < 2) return bad('Please check the highlighted fields and try again.', 422, 'name');
  if (!EMAIL_RE.test(clean.email))
    return bad('Please check the highlighted fields and try again.', 422, 'email');
  if (clean.message.length < 10)
    return bad('Please check the highlighted fields and try again.', 422, 'message');

  /* ---- the ceilings --------------------------------------------------- */
  const tooLong = (
    [
      ['name', LIMITS.name],
      ['organization', LIMITS.organization],
      ['email', LIMITS.email],
      ['message', LIMITS.message],
    ] as const
  ).find(([field, max]) => clean[field].length > max);
  if (tooLong) {
    return bad(`That ${tooLong[0]} is longer than this form accepts.`, 413, tooLong[0]);
  }

  /* ---- the three optional choices ------------------------------------- */
  // Empty is valid — these questions are optional and default to unanswered.
  // A value that is not empty has to be one this site actually offered.
  const offered = [
    ['challenge', CHALLENGE],
    ['capability', CAPABILITY],
    ['timeline', TIMELINE],
  ] as const;
  for (const [field, options] of offered) {
    const value = clean[field];
    if (value && !(options as readonly string[]).includes(value)) {
      return bad(`That ${field} is not one of the available answers.`, 422, field);
    }
  }

  /* ---- where it came from --------------------------------------------- */
  // Optional, and never a reason to refuse. See the header.
  const origin = clean.origin
    .replace(/\p{Cc}+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, LIMITS.origin);

  const who = sender(request);
  const slot = reserve(who);
  if (slot === null) {
    return bad('That is several messages in a short time. Please try again in ten minutes.', 429);
  }

  const record = {
    at: new Date().toISOString(),
    name: clean.name,
    organization: clean.organization,
    email: clean.email,
    challenge: clean.challenge,
    capability: clean.capability,
    timeline: clean.timeline,
    origin,
    message: clean.message,
  };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  // Required in production; see the header. `||`, so an empty line in the
  // settings counts as not set.
  const from =
    process.env.CONTACT_FROM ||
    (process.env.NODE_ENV === 'production' ? '' : 'Recalibre site <onboarding@resend.dev>');

  if (apiKey && to && from) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        // Bounded, so a provider that stops answering fails as a failure
        // instead of as an indefinite wait.
        signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: record.email,
          subject: `New enquiry — ${record.name}${record.organization ? ` · ${record.organization}` : ''}`,
          text:
            `Name: ${record.name}\n` +
            `Organization: ${record.organization || '—'}\n` +
            `Email: ${record.email}\n` +
            `Challenge: ${record.challenge || '—'}\n` +
            `Capability: ${record.capability || '—'}\n` +
            `Timeline: ${record.timeline || '—'}\n` +
            `Came from: ${record.origin || '—'}\n\n` +
            `${record.message}\n`,
        }),
      });
      if (!res.ok) throw new Error(`provider responded ${res.status}`);
      return NextResponse.json({ ok: true });
    } catch (error) {
      release(who, slot);
      const timedOut = error instanceof Error && error.name === 'TimeoutError';
      console.error('[contact] delivery failed', error);
      return NextResponse.json(
        {
          ok: false,
          message: timedOut
            ? 'Our mail provider did not respond in time. Please try again.'
            : 'We could not send that just now. Please try again in a moment.',
        },
        { status: 502 },
      );
    }
  }

  if (process.env.NODE_ENV === 'production') {
    // Nothing went anywhere, so the place in the window goes back too.
    release(who, slot);
    console.error(
      '[contact] REFUSED — RESEND_API_KEY, CONTACT_TO and CONTACT_FROM must all be set in production.',
    );
    return NextResponse.json(
      {
        ok: false,
        message: 'The form could not reach us.',
      },
      { status: 503 },
    );
  }

  console.warn(
    '[contact] NOT EMAILED — no RESEND_API_KEY/CONTACT_TO. Written to .contact-submissions.jsonl instead.',
  );
  try {
    await appendFile('.contact-submissions.jsonl', `${JSON.stringify(record)}\n`, 'utf8');
  } catch (error) {
    release(who, slot);
    // The whole point of the development path is that the message is kept
    // somewhere. If the write fails there is nothing to come back to, so the
    // visitor is told — confirming a message that was never stored is the
    // one failure this route exists to prevent.
    console.error('[contact] could not write local submission log', error);
    return NextResponse.json(
      { ok: false, message: 'We could not record that just now.' },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
