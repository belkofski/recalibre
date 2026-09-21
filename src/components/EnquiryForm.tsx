'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Glyph } from '@/components/ui';

/* ============================================================================
   THE ENQUIRY FORM.

   Styled exactly as the reference styles its own: no boxes, just a hairline
   under each field, a mono label with the three-square mark in front of it,
   two columns at desktop collapsing to one, a full-width message, and a
   split button beside the consent note.

   THE BUDGET BAND IS GONE. Recalibre publishes no prices, and a budget
   dropdown on a site that quotes nothing is a question with no honest
   purpose. In its place are the three qualifying fields the brief
   specifies: the operational challenge, the capability needed, the
   timeline.

   VALIDATION IS ON BLUR, never on keystroke. A field that has already
   failed once re-validates as it is corrected, so the error clears the
   moment it is fixed rather than on the next blur.

   EVERY OUTCOME IS VISIBLE. Submitting disables the control and says so;
   success replaces the form with a confirmation that promises nothing about
   timing, because Recalibre publishes no reply time; failure says what
   happened and leaves every answer in place.
   ========================================================================= */

const CHALLENGE = [
  'Manual processes that should be automated',
  'Systems and tools that do not connect',
  'A legacy platform that needs modernizing',
  'Reporting that takes too long to produce',
  'An identity that no longer reflects the organization',
  'Something else',
] as const;

const CAPABILITY = [
  'Agentic AI and intelligent automation',
  'Custom software development',
  'Enterprise systems and integration',
  'Digital product and experience design',
  'Brand strategy and identity',
  'Not sure yet — start with calibration',
] as const;

const TIMELINE = [
  'As soon as possible',
  'Within the next quarter',
  'This financial year',
  'Planning ahead, no date set',
] as const;

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="flex items-center gap-[7px]">
      <Glyph className="[&>i]:bg-lime" />
      <span className="t-mono text-ink-2">{children}</span>
    </label>
  );
}

const FIELD =
  'w-full min-h-[44px] border-b border-rule bg-transparent pb-[12px] pt-[4px] text-ink placeholder:text-ink-3 outline-none transition-colors duration-300 focus:border-lime';
const FIELD_TEXT = { fontSize: '19px', lineHeight: '26px', letterSpacing: '-0.19px' };

export default function EnquiryForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState('');
  const form = useRef<HTMLFormElement>(null);

  function check(field: keyof Errors, value: string): string | undefined {
    if (field === 'name') return value.trim().length < 2 ? 'Please give us a name to reply to.' : undefined;
    if (field === 'email')
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
        ? undefined
        : 'That does not look like an email address we can reply to.';
    return value.trim().length < 10 ? 'A sentence or two about the problem, so we can be useful.' : undefined;
  }

  function onBlur(field: keyof Errors) {
    return (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setErrors((prev) => ({ ...prev, [field]: check(field, e.target.value) }));
  }

  /** Once a field has failed, it re-checks as it is corrected. Before that,
   *  it stays quiet. */
  function onChange(field: keyof Errors) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setErrors((prev) => (prev[field] ? { ...prev, [field]: check(field, e.target.value) } : prev));
    };
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFailure('');

    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get('name') ?? ''),
      organization: String(data.get('organization') ?? ''),
      email: String(data.get('email') ?? ''),
      challenge: String(data.get('challenge') ?? ''),
      capability: String(data.get('capability') ?? ''),
      timeline: String(data.get('timeline') ?? ''),
      message: String(data.get('message') ?? ''),
    };

    const next: Errors = {
      name: check('name', payload.name),
      email: check('email', payload.email),
      message: check('message', payload.message),
    };
    setErrors(next);

    const firstBad = (Object.keys(next) as (keyof Errors)[]).find((k) => next[k]);
    if (firstBad) {
      form.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }

    setState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!res.ok || !body.ok) {
        setState('idle');
        setFailure(body.message ?? 'We could not send that just now. Please try again in a moment.');
        return;
      }
      setState('sent');
    } catch {
      setState('idle');
      setFailure('We could not reach the server. Please check your connection and try again.');
    }
  }

  if (state === 'sent') {
    return (
      <div role="status" className="flex min-h-[340px] flex-col justify-center gap-[16px]">
        <span aria-hidden="true" className="block size-[8px] rounded-full bg-lime" />
        <p className="t-card text-ink">That has reached us.</p>
        <p className="t-body max-w-[42ch] text-ink-2">
          A person reads it — not an autoresponder. If you need to add anything, reply to the address you sent
          it from and it joins the same thread.
        </p>
      </div>
    );
  }

  const err = 'border-[rgba(255,69,0,0.6)]';

  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-[50px] mobile:gap-[34px]">
      <div className="grid grid-cols-2 gap-[50px] mobile:grid-cols-1 mobile:gap-[34px]">
        <div className="flex flex-col gap-[22px]">
          <Label htmlFor="f-name">Name</Label>
          <div className="flex flex-col gap-[8px]">
            <input
              id="f-name"
              name="name"
              autoComplete="name"
              placeholder="Jane Smith"
              style={FIELD_TEXT}
              onBlur={onBlur('name')}
              onChange={onChange('name')}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'e-name' : undefined}
              className={`${FIELD} ${errors.name ? err : ''}`}
            />
            {errors.name ? (
              <p id="e-name" className="t-caption text-flare">
                {errors.name}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-[22px]">
          <Label htmlFor="f-email">Work email</Label>
          <div className="flex flex-col gap-[8px]">
            <input
              id="f-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@organization.com"
              style={FIELD_TEXT}
              onBlur={onBlur('email')}
              onChange={onChange('email')}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'e-email' : undefined}
              className={`${FIELD} ${errors.email ? err : ''}`}
            />
            {errors.email ? (
              <p id="e-email" className="t-caption text-flare">
                {errors.email}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[50px] mobile:grid-cols-1 mobile:gap-[34px]">
        <div className="flex flex-col gap-[22px]">
          <Label htmlFor="f-org">Organization</Label>
          <input
            id="f-org"
            name="organization"
            autoComplete="organization"
            placeholder="Where you work"
            style={FIELD_TEXT}
            className={FIELD}
          />
        </div>

        <div className="flex flex-col gap-[22px]">
          <Label htmlFor="f-timeline">Timeline</Label>
          <select id="f-timeline" name="timeline" defaultValue={TIMELINE[1]} style={FIELD_TEXT} className={FIELD}>
            {TIMELINE.map((t) => (
              <option key={t} value={t} className="bg-ground">
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[50px] mobile:grid-cols-1 mobile:gap-[34px]">
        <div className="flex flex-col gap-[22px]">
          <Label htmlFor="f-challenge">What are you looking to fix?</Label>
          <select id="f-challenge" name="challenge" defaultValue={CHALLENGE[0]} style={FIELD_TEXT} className={FIELD}>
            {CHALLENGE.map((c) => (
              <option key={c} value={c} className="bg-ground">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-[22px]">
          <Label htmlFor="f-capability">Which capability do you need?</Label>
          <select id="f-capability" name="capability" defaultValue={CAPABILITY[5]} style={FIELD_TEXT} className={FIELD}>
            {CAPABILITY.map((c) => (
              <option key={c} value={c} className="bg-ground">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-[22px]">
        <Label htmlFor="f-message">Tell us more</Label>
        <div className="flex flex-col gap-[8px]">
          <textarea
            id="f-message"
            name="message"
            rows={3}
            placeholder="What is not working yet?"
            style={FIELD_TEXT}
            onBlur={onBlur('message')}
            onChange={onChange('message')}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? 'e-message' : undefined}
            className={`${FIELD} resize-y ${errors.message ? err : ''}`}
          />
          {errors.message ? (
            <p id="e-message" className="t-caption text-flare">
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      {failure ? (
        <p role="alert" className="t-small rounded-[12px] border border-[rgba(255,69,0,0.42)] p-[14px] text-flare">
          {failure}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-[30px]">
        <button type="submit" disabled={state === 'sending'} className="btn focus-ring disabled:opacity-60">
          <span className="btn-face t-btn">{state === 'sending' ? 'Sending…' : 'Send request'}</span>
          <span className="btn-tip">
            <Glyph big />
          </span>
        </button>
        <p className="t-caption max-w-[24ch] text-ink-2">
          By submitting, you agree to our{' '}
          <Link href="/terms" className="focus-ring text-ink underline decoration-rule underline-offset-2">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="focus-ring text-ink underline decoration-rule underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
