'use client';

import { useState } from 'react';
import Sparkle from './blocks/Sparkle';
import { FACTS } from '@/lib/content';

/**
 * CONTACT — the only section on this page that is NOT a measured clone.
 *
 * None of the ten reference screenshots contained a contact form, so there is
 * nothing to measure against. It is therefore built from the project's own
 * design tokens and the house spacing rules (8px grid, 8px radius on inputs and
 * buttons, 44px minimum touch target), in the Covix/site-B language of the two
 * sections that sit either side of it: black ground, sparkle eyebrow, 54px
 * display headline, 17.28px card radius.
 *
 * Everything else on the page exists to get someone here, so this section owns
 * the page's single conversion: one form, one button.
 *
 * States: idle · validating on blur · submitting · sent · failed. Every one of
 * them says something on screen.
 *
 * PENDING: a real destination. /api/contact currently validates the submission
 * and refuses to pretend it delivered it — see that route.
 */

type Field = 'name' | 'company' | 'email' | 'brief';
type Errors = Partial<Record<Field, string>>;

const LABELS: Record<Field, string> = {
  name: 'Your name',
  company: 'Company',
  email: 'Work email',
  brief: 'What are you trying to fix?',
};

/** Deliberately forgiving: this is a lead form, not an identity check. */
function validate(field: Field, value: string): string | undefined {
  const v = value.trim();
  if (field === 'name' && v.length < 2) return 'Please tell us who you are.';
  if (field === 'email') {
    if (!v) return 'We need an email to reply to.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "That email doesn't look right.";
  }
  if (field === 'brief' && v.length < 10) return 'A sentence or two is plenty.';
  return undefined;
}

const FIELDS: Field[] = ['name', 'company', 'email', 'brief'];

export default function Contact() {
  const [values, setValues] = useState<Record<Field, string>>({
    name: '',
    company: '',
    email: '',
    brief: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [failure, setFailure] = useState('');

  const set = (f: Field, v: string) => {
    setValues((prev) => ({ ...prev, [f]: v }));
    // clear an error as soon as the person fixes it; never re-validate on type
    if (errors[f]) setErrors((prev) => ({ ...prev, [f]: undefined }));
  };

  const blur = (f: Field) => {
    const message = validate(f, values[f]);
    setErrors((prev) => ({ ...prev, [f]: message }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: Errors = {};
    for (const f of FIELDS) {
      const m = validate(f, values[f]);
      if (m) found[f] = m;
    }
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setFailure(data.message ?? 'We could not send that just now.');
        setStatus('failed');
        return;
      }
      setStatus('sent');
    } catch {
      setFailure('We could not reach the server. Please check your connection.');
      setStatus('failed');
    }
  };

  const inputBase =
    'h-[48px] w-full rounded-[8px] border bg-ink-2 px-[16px] text-[16px] text-on-dark ' +
    'placeholder:text-on-dark-3 transition-colors duration-[200ms] ' +
    'focus:outline-none focus-visible:outline-none';

  return (
    <section
      id="contact"
      className="flex w-full shrink-0 scroll-mt-[24px] flex-col items-center overflow-clip bg-ink section-pad"
    >
      <div className="flex items-center gap-[10.8px]">
        <Sparkle size={9.36} color="var(--color-accent)" />
        <p className="eyebrow whitespace-pre text-on-dark">
          CONTACT
        </p>
      </div>

      <h2 className="section-head mt-[20px] text-center text-on-dark">
        <span className="block whitespace-pre">Start with a</span>
        <span className="block whitespace-pre">Calibration.</span>
      </h2>

      <div className="mt-[56px] flex w-[1120.32px] items-start gap-[38.88px]">
        {/* left — what happens next, so the form is not a black box */}
        <div className="w-[484.56px] shrink-0">
          <p className="lead-text text-on-dark-2">
            Tell us what is slowing the business down. We will come back with an
            honest read on whether we are the right people for it, and what a
            first engagement would look like.
          </p>

          <ol className="mt-[36px] border-t border-rule-on-dark">
            {/*
              WHAT THIS LIST MAY SAY. Step 01 is checkable: the form posts and
              a person reads the inbox. Steps 02 and 03 used to read "We reply
              within two working days." and "A 45-minute call, no charge." —
              a reply time, a call length and a price, none of which the
              founder has ever stated. They were a promise to a customer that
              nobody had agreed to.

              They are gone rather than softened. The moment the founder says
              what the real reply time is, it goes back here as step 02 and
              nowhere else, so there is one copy of it on the site.
            */}
            {[
              ['01', 'You send this form.'],
              ['02', 'A person reads it — not an autoresponder.'],
            ].map(([n, t]) => (
              <li
                key={n}
                className="flex items-center gap-[16px] border-b border-rule-on-dark py-[16px]"
              >
                <span className="flex h-[33px] w-[33px] shrink-0 items-center justify-center rounded-full bg-ink-2 font-mono text-[12px] text-on-dark-2">
                  {n}
                </span>
                <span className="body-text text-on-dark-2">{t}</span>
              </li>
            ))}
          </ol>

          {/* The direct route, always visible. If the form ever fails, the
              person still has a way to reach a human. */}
          <div className="mt-[32px] flex flex-col gap-[10px]">
            <a
              href={`mailto:${FACTS.email}`}
              className="focus-ring w-fit body-text text-on-dark underline decoration-on-dark-3 underline-offset-4 transition-colors hover:decoration-accent"
            >
              {FACTS.email}
            </a>
            <a
              href={`tel:${FACTS.phone.replace(/\s/g, '')}`}
              className="focus-ring w-fit body-text text-on-dark-2 transition-colors hover:text-on-dark"
            >
              {FACTS.phone}
            </a>
            <p className="body-text text-on-dark-3">{FACTS.base}</p>
          </div>
        </div>

        {/* right — the form */}
        <div className="min-w-0 flex-1 rounded-[12px] bg-ink-3 p-[28px]">
          {status === 'sent' ? (
            <div
              role="status"
              className="flex min-h-[420px] flex-col items-start justify-center"
            >
              <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-accent text-[20px] text-on-dark">
                ✓
              </span>
              <p className="mt-[20px] title-1 font-semibold text-on-dark">
                That is with us.
              </p>
              {/* No reply time here either — same owed fact, same rule. */}
              <p className="body-text mt-[10px] text-on-dark-2">
                A person reads every message that comes through this form. If it
                is urgent, the phone number above is the faster route.
              </p>
              <button
                type="button"
                onClick={() => {
                  setValues({ name: '', company: '', email: '', brief: '' });
                  setStatus('idle');
                }}
                className="focus-ring btn-label mt-[24px] h-[48px] rounded-[8px] px-[18px] text-on-dark-2 underline underline-offset-4 transition-colors hover:text-on-dark"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="flex flex-col gap-[16px]">
                {FIELDS.map((f) => {
                  const err = errors[f];
                  const describedBy = err ? `${f}-error` : undefined;
                  return (
                    <div key={f}>
                      <label
                        htmlFor={f}
                        className="small-text mb-[8px] block font-medium text-on-dark-2"
                      >
                        {LABELS[f]}
                        {f !== 'company' && (
                          <span aria-hidden="true" className="ml-[4px] text-accent">
                            *
                          </span>
                        )}
                      </label>

                      {f === 'brief' ? (
                        <textarea
                          id={f}
                          name={f}
                          rows={4}
                          value={values[f]}
                          onChange={(e) => set(f, e.target.value)}
                          onBlur={() => blur(f)}
                          aria-invalid={err ? true : undefined}
                          aria-describedby={describedBy}
                          placeholder="Fragmented processes, manual reporting, a system nobody trusts…"
                          className={`${inputBase} h-auto resize-none py-[14px] leading-[24px] ${
                            err
                              ? 'border-danger focus:border-danger'
                              : 'border-rule-on-dark focus:border-accent'
                          }`}
                        />
                      ) : (
                        <input
                          id={f}
                          name={f}
                          type={f === 'email' ? 'email' : 'text'}
                          autoComplete={
                            f === 'name'
                              ? 'name'
                              : f === 'email'
                                ? 'email'
                                : 'organization'
                          }
                          value={values[f]}
                          onChange={(e) => set(f, e.target.value)}
                          onBlur={() => blur(f)}
                          aria-invalid={err ? true : undefined}
                          aria-describedby={describedBy}
                          placeholder={
                            f === 'email' ? 'you@company.com' : f === 'company' ? 'Optional' : ''
                          }
                          className={`${inputBase} ${
                            err
                              ? 'border-danger focus:border-danger'
                              : 'border-rule-on-dark focus:border-accent'
                          }`}
                        />
                      )}

                      {err && (
                        <p
                          id={`${f}-error`}
                          className="meta-text mt-[6px] text-danger"
                        >
                          {err}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {status === 'failed' && (
                <p
                  role="alert"
                  className="small-text mt-[16px] rounded-[8px] border border-danger/40 bg-danger/10 px-[14px] py-[12px] text-danger"
                >
                  {failure}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="focus-ring btn-label mt-[24px] flex h-[48px] w-full items-center justify-center gap-[10px] rounded-[8px] bg-paper font-semibold text-text transition-colors duration-[260ms] hover:bg-accent hover:text-on-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="block h-[16px] w-[16px] animate-spin rounded-full border-[2px] border-current border-t-transparent"
                    />
                    Sending…
                  </>
                ) : (
                  'Send'
                )}
              </button>

              <p className="meta-text mt-[14px] text-center text-on-dark-3">
                We only use this to reply. No list, no forwarding.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
