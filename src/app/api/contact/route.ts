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

type Body = { name?: string; company?: string; email?: string; brief?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: 'That submission was malformed.' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const company = (body.company ?? '').trim();
  const email = (body.email ?? '').trim();
  const brief = (body.brief ?? '').trim();

  if (name.length < 2 || !EMAIL_RE.test(email) || brief.length < 10) {
    return NextResponse.json(
      { ok: false, message: 'Please check the highlighted fields and try again.' },
      { status: 422 },
    );
  }
  // crude ceiling — a lead form has no business accepting an essay
  if (brief.length > 5000 || name.length > 200 || company.length > 200) {
    return NextResponse.json({ ok: false, message: 'That message is too long to send.' }, { status: 413 });
  }

  const record = { at: new Date().toISOString(), name, company, email, brief };
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
          subject: `New enquiry — ${name}${company ? ` · ${company}` : ''}`,
          text: `Name: ${name}\nCompany: ${company || '—'}\nEmail: ${email}\n\n${brief}\n`,
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
    console.error('[contact] could not write local submission log', error);
  }
  return NextResponse.json({ ok: true });
}
