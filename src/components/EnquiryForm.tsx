'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { sendGAEvent } from '@next/third-parties/google';
import { Chevron } from '@/components/ui';
import { SITE } from '@/content/site';
import {
  CAPABILITY,
  CHALLENGE,
  EMAIL_RE,
  LIMITS,
  SERVICE_OPTIONS,
  TIMELINE,
  UNSET,
  type EnquiryType,
} from '@/content/enquiry';
import { enquiryOrigin } from '@/lib/origin';
import { useLocale } from '@/lib/locale';
import { localePath } from '@/lib/i18n';
import { ui } from '@/content/ui';

/* ============================================================================
   THE ENQUIRY FORM — and, since 4 November 2026, THE QUOTATION REQUEST.

   Styled exactly as the reference styles its own: no boxes, just a hairline
   under each field, a mono label, two columns from 600 wide and one under
   it, a full-width message, and a split button beside the consent note
   (under it on a phone).

   TWO MODES, ONE FORM. An enquiry is how every engagement starts: name,
   work email, organization, the three optional questions (challenge,
   capability, timeline) and the message. A quotation request is the second
   path the audit of 3 November 2026 found missing — a buyer who already
   knows what they want had no way to say so. It asks for the service the
   quotation is for (required), the timeline, an indicative budget as free
   text (optional), and the scope in the sender's own words, which is the
   same textarea as the message under another label, so the body size and
   the required-field logic do not change. The mode comes from the page
   (`?type=quotation`, read on the server so it works with scripts off), and
   a service page's link pre-selects the service (`&service=…`).

   THE BUDGET: free text, not bands. The band select came off on 25
   September 2026 because Recalibre publishes no prices and a dropdown of
   ranges it never set is a question with no honest purpose; the owner's
   reversal of 4 November 2026 brings back the question, not the bands. The
   sender writes a figure, a range, or nothing.

   THE SUMMARY. In quotation mode a line under the fields reads back the
   service, the timeline and the budget as they are chosen, so the sender
   sees what the request will say before it is sent. It reads the form's
   own values on input; the fields stay uncontrolled.

   ── THE FOUR THINGS THE AUDIT OF SEPTEMBER FOUND, STILL HELD ─────────────

   Nothing is truncated at any width the layout produces; every optional
   list opens unanswered; required fields are marked (a REQUIRED tag and
   `aria-required`); validation runs on blur and only on blur. Every outcome
   is visible: sending disables the control and says so; success replaces
   the form with a confirmation that promises nothing about timing; failure
   says what happened and leaves every answer in place.

   ── WHERE IT CAME FROM ────────────────────────────────────────────────────

   Sending also carries one line nobody types, as `origin` (lib/origin.tsx),
   worked out at the moment of sending. Without scripts the browser posts
   the form itself and the line is not sent; the email prints a dash for it.

   ── BRIEF, IN THE FOOTER ──────────────────────────────────────────────────

   Home's footer draws it `variant="brief"`: name, work email and
   organization in one grid, then the message. Always an enquiry.

   ── IN BOTH LANGUAGES ─────────────────────────────────────────────────────

   Every word here comes from content/ui.ts for the page's language; the
   hidden `locale` field tells the API which language to answer in when the
   browser posts the form itself.
   ========================================================================= */

type ErrorKey = 'name' | 'email' | 'message' | 'service' | 'budget';
type Errors = Partial<Record<ErrorKey, string>>;

function Label({ htmlFor, children, required, tag }: { htmlFor: string; children: React.ReactNode; required?: boolean; tag: string }) {
  return (
    <label htmlFor={htmlFor} className="flex items-center gap-[8px]">
      <span className="t-mono text-ink-2">{children}</span>
      {required ? (
        <span className="t-mono text-accent-bright" aria-hidden="true">
          {tag}
        </span>
      ) : null}
    </label>
  );
}

const FIELD_BOX =
  'w-full min-h-[44px] border-b border-rule bg-transparent pb-[12px] pt-[4px] transition-colors duration-300 ease-hover focus:border-accent-bright';
const FIELD = `${FIELD_BOX} text-ink placeholder:text-ink-3`;
const SELECT = `${FIELD_BOX} field-select appearance-none cursor-pointer truncate pr-[28px]`;
const FIELD_TEXT = { fontSize: '18px', lineHeight: '26px', letterSpacing: '-0.01em' };

function fill(template: string, max: number) {
  return template.replace('{max}', max.toLocaleString('en'));
}

export default function EnquiryForm({
  variant = 'full',
  mode = 'enquiry',
  service = '',
}: {
  /** `full` (the default): every field, on /contact. `brief`: name, work
   *  email, organization and message, in Home's footer. */
  variant?: 'full' | 'brief';
  /** Enquiry or quotation request; the page reads it from the address. */
  mode?: EnquiryType;
  /** The service a quotation link pre-selects (a catalogue slug). */
  service?: string;
}) {
  const locale = useLocale();
  const t = ui(locale).form;
  const brief = variant === 'brief';
  const quote = !brief && mode === 'quotation';
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState('');
  const [summary, setSummary] = useState<{ service: string; timeline: string; budget: string }>({
    service: SERVICE_OPTIONS.find((o) => o.value === service)?.label ?? '',
    timeline: '',
    budget: '',
  });
  const form = useRef<HTMLFormElement>(null);
  const sent = useRef<HTMLDivElement>(null);
  const failed = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state === 'sent') sent.current?.focus();
  }, [state]);
  useEffect(() => {
    if (failure) failed.current?.focus();
  }, [failure]);

  function check(field: ErrorKey, value: string): string | undefined {
    const v = value.trim();
    if (field === 'name') {
      if (v.length < 2) return t.errName;
      return v.length > LIMITS.name ? fill(t.errNameLong, LIMITS.name) : undefined;
    }
    if (field === 'email') {
      if (!v) return t.errEmail;
      if (!EMAIL_RE.test(v)) return t.errEmailBad;
      return v.length > LIMITS.email ? t.errEmailLong : undefined;
    }
    if (field === 'service') {
      return quote && !v ? t.errService : undefined;
    }
    if (field === 'budget') {
      return v.length > LIMITS.budget ? fill(t.errBudgetLong, LIMITS.budget) : undefined;
    }
    if (v.length < 10) return quote ? t.errScope : t.errMessage;
    return v.length > LIMITS.message ? fill(t.errMessageLong, LIMITS.message) : undefined;
  }

  /** On blur, and only on blur — except when the blur is the send button
   *  taking focus, which submitting re-checks anyway. */
  function onBlur(field: ErrorKey) {
    return (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const to = e.relatedTarget;
      if (to instanceof HTMLButtonElement && to.type === 'submit') return;
      setErrors((prev) => ({ ...prev, [field]: check(field, e.target.value) }));
    };
  }

  /** The summary line reads the form itself; nothing is controlled. */
  function onInput(e: React.FormEvent<HTMLFormElement>) {
    if (!quote) return;
    const data = new FormData(e.currentTarget);
    const slug = String(data.get('service') ?? '');
    setSummary({
      service: SERVICE_OPTIONS.find((o) => o.value === slug)?.label ?? '',
      timeline: String(data.get('timeline') ?? ''),
      budget: String(data.get('budget') ?? '').trim(),
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFailure('');

    const data = new FormData(e.currentTarget);
    const payload = {
      type: quote ? 'quotation' : 'enquiry',
      locale,
      name: String(data.get('name') ?? ''),
      organization: String(data.get('organization') ?? ''),
      email: String(data.get('email') ?? ''),
      challenge: String(data.get('challenge') ?? ''),
      capability: String(data.get('capability') ?? ''),
      service: String(data.get('service') ?? ''),
      timeline: String(data.get('timeline') ?? ''),
      budget: String(data.get('budget') ?? ''),
      message: String(data.get('message') ?? ''),
      website: String(data.get('website') ?? ''),
      origin: enquiryOrigin(),
    };

    const next: Errors = {
      name: check('name', payload.name),
      email: check('email', payload.email),
      service: check('service', payload.service),
      budget: check('budget', payload.budget),
      message: check('message', payload.message),
    };
    setErrors(next);

    const firstBad = (Object.keys(next) as ErrorKey[]).find((k) => next[k]);
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
        setFailure(body.message ?? t.failGeneric);
        return;
      }
      setState('sent');
      // Measured only where the reader consented and the tag exists; a
      // call with no tag on the page goes nowhere (components/Consent.tsx).
      try {
        sendGAEvent('event', quote ? 'quotation_request' : 'enquiry_submit', { type: payload.type, form: variant });
      } catch {}
    } catch {
      setState('idle');
      setFailure(t.failNetwork);
    }
  }

  if (state === 'sent') {
    return (
      <div ref={sent} tabIndex={-1} role="status" className="flex flex-1 flex-col justify-center gap-[16px] py-[40px] mobile:py-[16px]">
        <p className="t-card text-ink">{t.sentTitle}</p>
        <p className="t-body max-w-[46ch] text-ink-2">{quote ? t.sentQuotationBody : t.sentBody}</p>
        <div className="flex flex-wrap items-center gap-x-[32px] gap-y-[8px]">
          <a href={`mailto:${SITE.email}`} className="tap-44 t-lede text-ink">
            {SITE.email}
          </a>
          <a href={`tel:${SITE.phoneHref}`} className="tap-44 t-body text-ink">
            {SITE.phone}
          </a>
        </div>
        <button
          type="button"
          onClick={() => {
            setState('idle');
            setErrors({});
            setFailure('');
          }}
          className="t-mono hover-read mt-[8px] flex min-h-[44px] w-fit items-center"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  const err = 'border-[rgba(255,69,0,0.6)]';
  const cls = (bad?: boolean) => `${FIELD} ${bad ? err : ''}`;
  const text = FIELD_TEXT;
  const gap = brief ? 'gap-[16px]' : 'gap-[24px]';

  const field = (
    id: string,
    name: ErrorKey | 'organization' | 'budget',
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
    required = false,
    help?: string,
  ) => {
    const key = name as ErrorKey;
    const bad = errors[key];
    return (
      <div className={`flex flex-col ${gap}`}>
        <Label htmlFor={id} required={required} tag={t.required}>
          {label}
        </Label>
        <div className="flex flex-col gap-[8px]">
          <input
            id={id}
            name={name}
            required={required}
            aria-required={required || undefined}
            style={text}
            onBlur={name === 'organization' ? undefined : onBlur(key)}
            aria-invalid={bad ? true : undefined}
            aria-describedby={[bad ? `e-${name}` : '', help ? `h-${name}` : ''].filter(Boolean).join(' ') || undefined}
            className={cls(!!bad)}
            {...props}
          />
          {bad ? (
            <p id={`e-${name}`} className="t-caption text-flare">
              {bad}
            </p>
          ) : null}
          {help ? (
            <p id={`h-${name}`} className="t-caption text-ink-3">
              {help}
            </p>
          ) : null}
        </div>
      </div>
    );
  };

  const nameField = field('f-name', 'name', t.name, { autoComplete: 'name', placeholder: t.namePlaceholder, maxLength: LIMITS.name }, true);
  const emailField = field(
    'f-email',
    'email',
    t.email,
    { type: 'email', inputMode: 'email', autoComplete: 'email', placeholder: t.emailPlaceholder, maxLength: LIMITS.email },
    true,
  );
  const orgField = field('f-org', 'organization', t.organization, {
    autoComplete: 'organization',
    placeholder: t.organizationPlaceholder,
    maxLength: LIMITS.organization,
  });
  const budgetField = field('f-budget', 'budget', t.budget, { placeholder: t.budgetPlaceholder, maxLength: LIMITS.budget }, false, t.budgetHelp);

  const select = (
    id: string,
    name: string,
    label: string,
    options: readonly { value: string; label: string }[],
    required = false,
    defaultValue = UNSET,
  ) => {
    const bad = required ? errors.service : undefined;
    return (
      <div className="flex flex-col gap-[24px]">
        <Label htmlFor={id} required={required} tag={t.required}>
          {label}
        </Label>
        <div className="flex flex-col gap-[8px]">
          <select
            id={id}
            name={name}
            defaultValue={defaultValue}
            required={required}
            aria-required={required || undefined}
            aria-invalid={bad ? true : undefined}
            aria-describedby={bad ? `e-${name}` : undefined}
            onBlur={required ? onBlur('service') : undefined}
            style={FIELD_TEXT}
            className={`${SELECT} ${bad ? err : ''}`}
          >
            <option value={UNSET} className="bg-ground">
              {required ? t.selectRequired : t.selectOptional}
            </option>
            {options.map((o) => (
              <option key={o.value} value={o.value} className="bg-ground">
                {o.label}
              </option>
            ))}
          </select>
          {bad ? (
            <p id={`e-${name}`} className="t-caption text-flare">
              {bad}
            </p>
          ) : null}
        </div>
      </div>
    );
  };
  const plain = (xs: readonly string[]) => xs.map((x) => ({ value: x, label: x }));

  const timeline = select('f-timeline', 'timeline', t.timeline, plain(TIMELINE));
  const challenge = select('f-challenge', 'challenge', t.challenge, plain(CHALLENGE));
  const capability = select('f-capability', 'capability', t.capability, plain(CAPABILITY));
  const serviceField = select('f-service', 'service', t.service, SERVICE_OPTIONS, true, service);

  const summaryParts = [summary.service, summary.timeline, summary.budget].filter(Boolean);

  return (
    // WITHOUT SCRIPTS THE BROWSER SENDS THE FORM ITSELF: a plain POST to the
    // contact route, which answers with a plain page in the form's language.
    <form
      ref={form}
      method="post"
      action="/api/contact"
      onSubmit={onSubmit}
      onInput={onInput}
      noValidate
      className={`flex w-full flex-col ${brief ? 'gap-[24px]' : 'gap-[48px] mobile:gap-[32px]'}`}
    >
      {/* What this is, and in which language, for the scripts-off post. */}
      <input type="hidden" name="type" value={quote ? 'quotation' : 'enquiry'} />
      <input type="hidden" name="locale" value={locale} />

      {/* The honeypot. Off-screen rather than display:none, because some
          bots skip anything that is not rendered. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="f-website">{t.honeypot}</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {brief ? (
        <div className="grid grid-cols-3 gap-x-[40px] gap-y-[32px] narrow:grid-cols-2 phone:grid-cols-1 mobile:gap-y-[24px]">
          {nameField}
          {emailField}
          {orgField}
        </div>
      ) : quote ? (
        <>
          <div className="grid grid-cols-2 gap-[48px] phone:grid-cols-1 mobile:gap-[32px]">
            {nameField}
            {emailField}
          </div>
          <div className="grid grid-cols-2 gap-[48px] phone:grid-cols-1 mobile:gap-[32px]">
            {orgField}
            {timeline}
          </div>
          {serviceField}
          {budgetField}
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-[48px] phone:grid-cols-1 mobile:gap-[32px]">
            {nameField}
            {emailField}
          </div>
          <div className="grid grid-cols-2 gap-[48px] phone:grid-cols-1 mobile:gap-[32px]">
            {orgField}
            {timeline}
          </div>
          {challenge}
          {capability}
        </>
      )}

      <div className={`flex flex-col ${gap}`}>
        <Label htmlFor="f-message" required tag={t.required}>
          {quote ? t.scope : t.message}
        </Label>
        <div className="flex flex-col gap-[8px]">
          <textarea
            id="f-message"
            name="message"
            rows={brief ? 2 : quote ? 4 : 3}
            placeholder={quote ? t.scopePlaceholder : t.messagePlaceholder}
            maxLength={LIMITS.message}
            required
            aria-required="true"
            style={text}
            onBlur={onBlur('message')}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={`${errors.message ? 'e-message ' : ''}h-message`}
            className={`${cls(!!errors.message)} resize-none`}
          />
          {errors.message ? (
            <p id="e-message" className="t-caption text-flare">
              {errors.message}
            </p>
          ) : null}
          <p id="h-message" className="t-caption text-ink-3">
            {fill(t.messageHelp, LIMITS.message)}
          </p>
        </div>
      </div>

      {quote ? (
        <p className="t-caption flex flex-wrap items-center gap-x-[12px] gap-y-[4px] border-t border-rule pt-[16px] text-ink-2" aria-live="polite">
          <span className="t-mono text-ink-3">{t.summaryLabel}</span>
          {summaryParts.length ? (
            summaryParts.map((p, i) => (
              <span key={p} className="flex items-center gap-[12px]">
                {i > 0 ? <span aria-hidden="true">·</span> : null}
                <span className="text-ink">{p}</span>
              </span>
            ))
          ) : (
            <span>{t.summaryEmpty}</span>
          )}
        </p>
      ) : null}

      {failure ? (
        <p ref={failed} tabIndex={-1} role="alert" className="t-body rounded-[8px] border border-[rgba(255,69,0,0.42)] p-[16px] text-flare">
          {failure} {t.failEmailLead}{' '}
          <a href={`mailto:${SITE.email}`} className="underline underline-offset-[3px] [overflow-wrap:anywhere]">
            {SITE.email.split('@')[0]}@<wbr />
            {SITE.email.split('@')[1]}
          </a>{' '}
          {t.failEmailTail}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-[32px] phone:flex-col phone:items-start">
        <button type="submit" disabled={state === 'sending'} className="btn disabled:opacity-60">
          <span className="btn-face t-btn">{state === 'sending' ? t.sending : quote ? t.submitQuotation : t.submitEnquiry}</span>
          <span className="btn-tip">
            <Chevron size="tip" />
          </span>
        </button>
        <p className="t-fine max-w-[24ch] text-ink-2">
          {t.consentBefore}
          <Link href={localePath(locale, '/terms')} className="text-ink underline decoration-rule underline-offset-2">
            {t.terms}
          </Link>
          {t.consentAnd}
          <Link href={localePath(locale, '/privacy')} className="text-ink underline decoration-rule underline-offset-2">
            {t.privacy}
          </Link>
          {t.consentAfter}
        </p>
      </div>
    </form>
  );
}
