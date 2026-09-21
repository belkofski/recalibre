import { NextResponse } from 'next/server';
import { appendFile } from 'node:fs/promises';

/**
 * CONTACT SUBMISSIONS
 *
 * Deliberate behaviour, so that a real enquiry can never be silently swallowed:
 *
 *   configured   (RESEND_API_KEY + CONTACT_TO set)  → emailed, then confirmed
 *   development  (not configured)                   → appended to
 *                .contact-submissions.jsonl, confirmed, loud server warning
 *   production   (not configured)                   → REFUSED, and the visitor
 *                is told plainly rather than thanked for nothing
 *
 * The production refusal is the point. A contact form that says "thank you" and
 * drops the message is worse than no form at all.
 */

/**
 * The corporate enquiry shape. The reference template's form asks for a
 * budget band; ours does not, because Recalibre publishes no prices and a
 * budget dropdown on a form whose site quotes nothing is a question with no
 * honest purpose. `challenge`, `capability` and `timeline` are the three
 * qualifying fields the brief specifies in its place.
 */
type Body = {
  name?: string;
  organization?: string;
  email?: string;
  challenge?: string;
  capability?: string;
  timeline?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: 'That submission was malformed.' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const organization = (body.organization ?? '').trim();
  const email = (body.email ?? '').trim();
  const challenge = (body.challenge ?? '').trim();
  const capability = (body.capability ?? '').trim();
  const timeline = (body.timeline ?? '').trim();
  const message = (body.message ?? '').trim();

  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
    return NextResponse.json(
      { ok: false, message: 'Please check the highlighted fields and try again.' },
      { status: 422 },
    );
  }
  // crude ceiling — a lead form has no business accepting an essay
  if (message.length > 5000 || name.length > 200 || organization.length > 200) {
    return NextResponse.json({ ok: false, message: 'That message is too long to send.' }, { status: 413 });
  }

  const record = {
    at: new Date().toISOString(),
    name, organization, email, challenge, capability, timeline, message,
  };
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;

  if (apiKey && to) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM ?? 'Recalibre site <onboarding@resend.dev>',
          to: [to],
          reply_to: email,
          subject: `New enquiry — ${name}${organization ? ` · ${organization}` : ''}`,
          text:
            `Name: ${name}\n` +
            `Organization: ${organization || '—'}\n` +
            `Email: ${email}\n` +
            `Challenge: ${challenge || '—'}\n` +
            `Capability: ${capability || '—'}\n` +
            `Timeline: ${timeline || '—'}\n\n` +
            `${message}\n`,
        }),
      });
      if (!res.ok) throw new Error(`provider responded ${res.status}`);
      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error('[contact] delivery failed', error);
      return NextResponse.json(
        { ok: false, message: 'We could not send that just now. Please try again in a moment.' },
        { status: 502 },
      );
    }
  }

  if (process.env.NODE_ENV === 'production') {
    console.error('[contact] REFUSED — RESEND_API_KEY and CONTACT_TO are not set in production.');
    return NextResponse.json(
      {
        ok: false,
        message: 'Our contact form is not connected yet. Please email us directly for now.',
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
    // The whole point of the development path is that the message is kept
    // somewhere. If the write fails there is nothing to come back to, so the
    // visitor is told — confirming a message that was never stored is the
    // one failure this route exists to prevent.
    console.error('[contact] could not write local submission log', error);
    return NextResponse.json(
      { ok: false, message: 'We could not record that just now. Please email us directly.' },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
