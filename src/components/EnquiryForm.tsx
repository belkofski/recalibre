'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

/* ============================================================================
   THE ENQUIRY FORM.

   The reference asks for name, email, what you are looking for, YOUR BUDGET,
   when you want to start, and a message.

   THE BUDGET BAND IS GONE. Recalibre publishes no prices, and a budget
   dropdown on a site that quotes nothing is a question with no honest
   purpose — it exists to qualify the sender, not to help them. In its place
   are the three qualifying fields the brief specifies: the operational
   challenge, the capability needed, and the timeline.

   VALIDATION IS ON BLUR, never on keystroke. Being told an email address is
   invalid while still typing the third character of it is a small hostility
   that a lot of forms commit. A field that has already failed once
   re-validates as it is corrected, so the error clears the moment it is
   fixed rather than on the next blur.

   EVERY OUTCOME IS VISIBLE. Submitting disables the control and says so;
   success replaces the form with a confirmation that promises nothing about
   timing, because Recalibre publishes no reply time; failure says what
   happened and leaves every answer in place so nothing has to be retyped.
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
      <div
        role="status"
        className="flex min-h-[420px] flex-col justify-center gap-[16px] rounded-[24px] border border-[rgba(199,255,151,0.34)] bg-raised p-[36px] mobile:p-[22px]"
      >
        <span aria-hidden="true" className="block h-[8px] w-[8px] rounded-full bg-lime" />
        <p className="t-card text-ink">That has reached us.</p>
        <p className="t-body max-w-[42ch] text-ink-2">
          A person reads it — not an autoresponder. If you need to add anything, reply to the address you sent
          it from and it joins the same thread.
        </p>
      </div>
    );
  }

  const field = 'h-[52px] w-full rounded-[12px] border border-rule-2 bg-ground px-[16px] t-body text-ink placeholder:text-ink-3 transition-colors duration-[300ms] focus:border-[rgba(199,255,151,0.5)] focus:outline-none';
  const label = 't-mono-9 text-ink-3';

  return (
    <form
      ref={form}
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-[18px] rounded-[24px] border border-rule-2 bg-panel p-[36px] mobile:p-[22px]"
    >
      <div className="grid grid-cols-2 gap-[16px] mobile:grid-cols-1">
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="f-name" className={label}>
            Name
          </label>
          <input
            id="f-name"
            name="name"
            autoComplete="name"
            onBlur={onBlur('name')}
            onChange={onChange('name')}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'e-name' : undefined}
            className={`${field} ${errors.name ? 'border-[rgba(255,69,0,0.6)]' : ''}`}
          />
          {errors.name ? (
            <p id="e-name" className="t-caption text-flare">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-[8px]">
          <label htmlFor="f-org" className={label}>
            Organization
          </label>
          <input id="f-org" name="organization" autoComplete="organization" className={field} />
        </div>
      </div>

      <div className="flex flex-col gap-[8px]">
        <label htmlFor="f-email" className={label}>
          Work email
        </label>
        <input
          id="f-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          onBlur={onBlur('email')}
          onChange={onChange('email')}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'e-email' : undefined}
          className={`${field} ${errors.email ? 'border-[rgba(255,69,0,0.6)]' : ''}`}
        />
        {errors.email ? (
          <p id="e-email" className="t-caption text-flare">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-[16px] mobile:grid-cols-1">
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="f-challenge" className={label}>
            The operational challenge
          </label>
          <select id="f-challenge" name="challenge" defaultValue={CHALLENGE[0]} className={field}>
            {CHALLENGE.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-[8px]">
          <label htmlFor="f-capability" className={label}>
            Capability needed
          </label>
          <select id="f-capability" name="capability" defaultValue={CAPABILITY[5]} className={field}>
            {CAPABILITY.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-[8px]">
        <label htmlFor="f-timeline" className={label}>
          Timeline
        </label>
        <select id="f-timeline" name="timeline" defaultValue={TIMELINE[1]} className={field}>
          {TIMELINE.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-[8px]">
        <label htmlFor="f-message" className={label}>
          What is not working yet
        </label>
        <textarea
          id="f-message"
          name="message"
          rows={5}
          onBlur={onBlur('message')}
          onChange={onChange('message')}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'e-message' : undefined}
          className={`${field} h-auto resize-y py-[14px] ${errors.message ? 'border-[rgba(255,69,0,0.6)]' : ''}`}
        />
        {errors.message ? (
          <p id="e-message" className="t-caption text-flare">
            {errors.message}
          </p>
        ) : null}
      </div>

      {failure ? (
        <p role="alert" className="t-small rounded-[12px] border border-[rgba(255,69,0,0.42)] p-[14px] text-flare">
          {failure}
        </p>
      ) : null}

      <div className="mt-[6px] flex flex-wrap items-center justify-between gap-[14px]">
        <button type="submit" disabled={state === 'sending'} className="pill pill-solid focus-ring t-btn disabled:opacity-60">
          {state === 'sending' ? (
            <>
              <span
                aria-hidden="true"
                className="block h-[10px] w-[10px] animate-spin rounded-full border border-current border-t-transparent motion-reduce:animate-none"
              />
              Sending
            </>
          ) : (
            'Send enquiry'
          )}
        </button>
        <p className="t-caption max-w-[38ch] text-ink-3">
          By sending this you agree to our{' '}
          <Link href="/terms" className="focus-ring underline decoration-rule underline-offset-2 hover:text-ink">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="focus-ring underline decoration-rule underline-offset-2 hover:text-ink">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
