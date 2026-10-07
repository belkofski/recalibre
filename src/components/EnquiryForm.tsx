'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Chevron } from '@/components/ui';
import { Spotlight, useHydrated } from '@/lib/motion';
import { SITE } from '@/content/site';
import { CAPABILITY, CHALLENGE, CONTACT, EMAIL_RE, LIMITS, TIMELINE, UNSET } from '@/content/enquiry';
import { enquiryOrigin } from '@/lib/origin';

/* ============================================================================
   THE ENQUIRY FORM.

   Styled as the reference styles its own: no boxes, just a hairline under
   each field, a mono label over it, two columns from 600 wide and one
   under it, a full-width message, and a split button beside the consent
   note (under it on a phone).

   ── THE HAIRLINE ANSWERS (the direction change) ───────────────────────────

   The hairline under a field is no longer a border on the control: it is
   the depth layer's lit rule (depth.css, `.lit-rule`), a 1px element that
   is the field's own direct child. Each field is wrapped in `Spotlight`,
   which writes where the pointer is on the wrapper, and the rule lights in
   the signal blue around that point under the pointer, fills its whole
   length while the field has focus, and draws in the flare when the field
   carries an error (`data-error` on the wrapper, beside `aria-invalid` on
   the control). On a phone the rule lights as the field passes the centre
   of the screen. With scripts off the rules rest unlit and the browser
   posts the form itself.

   THE BUDGET BAND IS GONE. Recalibre publishes no prices, and a budget
   dropdown on a site that quotes nothing is a question with no honest
   purpose. In its place are the three qualifying fields the brief
   specifies: the operational challenge, the capability needed, the
   timeline.

   ── THE FORM IS A DIAGNOSTIC, NOT A CONTACT-US FORM (the owner's audit) ──

   The page's h1 now says what the form's h2 used to, so the form opens on
   its fields. The order is the order a reader thinks in: who they are,
   where to reply, where they work, and then the one question that matters,
   "What are you trying to change?" (CONTACT.messageLabel). The three
   optional selects are folded behind one line, "ADD CONTEXT · OPTIONAL",
   a disclosure that opens in place (`.contact-fold`, contact.css) and is
   `inert` while closed, so a reader who has nothing to add never meets
   three empty dropdowns, and one who has reaches them in two taps. With
   scripts off the fold is simply open (the closed state is gated on `.js`).

   The field being answered is the one lit: its hairline fills light blue
   and its label steps to full ink (`.form-field:focus-within`).

   ── THE FOUR THINGS THE AUDIT FOUND ───────────────────────────────────────

   THE DROPDOWN TEXT WAS CUT OFF. Two of the three selects showed an
   ellipsis on desktop — "Manual, repetitive proc…", "Not sure — start with
   c…" — because a 270px half-column at 17px cannot hold a sentence beside
   the chevron a select draws for itself. Each select takes a full row of
   the folded panel now, and the labels are shorter. Nothing is truncated
   at any width the layout produces.

   THE OPTIONAL ANSWERS WERE PRE-SELECTED. Timeline opened on "Within the
   next quarter" and the challenge on "Manual, repetitive processes", so a
   visitor who never touched either still sent both, and we read a
   preference nobody expressed. Every optional list now opens unanswered.

   REQUIRED FIELDS WERE NOT MARKED. Three of the seven are required and
   nothing said so until one of them failed. They carry a REQUIRED tag and
   `aria-required`.

   VALIDATION RE-RAN ON EVERY KEYSTROKE once a field had failed. The rule
   for this site is validation on blur, so that is what it does: an error
   appears when you leave a field and clears when you leave it corrected.
   It does not flicker under the cursor while a sentence is half typed.

   EVERY OUTCOME IS VISIBLE. Submitting disables the control and says so;
   success replaces the form with a confirmation that describes what
   actually happened and promises nothing about timing, because Recalibre
   publishes no reply time; failure says what happened and leaves every
   answer in place.

   ── WHERE IT CAME FROM ────────────────────────────────────────────────────

   Sending also carries one line nobody types, as `origin`: on the contact
   page, the page, part of the page and link that brought the visitor there,
   when one was noted; everywhere else, the page this form sits at the foot
   of. It is worked out at the moment of sending, never during render, so
   the server's markup and the browser's cannot disagree, and it cannot stop
   a send (lib/origin.tsx). Without scripts the browser posts the form
   itself and the line is not sent; the email prints a dash for it, as it
   does for an unanswered question.

   ── BRIEF, IN THE FOOTER ──────────────────────────────────────────────────

   Home's footer draws it `variant="brief"` (28 September 2026; it was the
   same seven fields, `packed`): name, work email and organization in one
   grid, three across from 1200, two from 600, one under it, then the
   message under the same label the full form asks. The three optional
   questions are asked on /contact only, which keeps `variant="full"`, the
   default. The honeypot and the origin line go with both, and the contact
   route already takes a send without the three answers (it treats a
   missing one as unanswered).
   ========================================================================= */

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

/* NO MARK BEFORE A FIELD'S LABEL (28 September 2026). The '///' stands
   before section labels only; a field's label is its words, in the same
   style as before, with the REQUIRED tag after it. `.form-label` is what
   the field's focus lights (contact.css). The gap under it is the label's
   own margin, because the field's column holds the rule as a direct child
   and a column gap would open between the control and its line. */
function Label({
  htmlFor,
  children,
  required,
  className = '',
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={`flex items-center gap-(--space-1) ${className}`}>
      {/* No colour utility: the label's rest (60%) and its step to full
          ink with the field's focus are both `.form-label`'s (contact.css),
          and a utility here would outweigh the step. */}
      <span className="form-label t-mono">{children}</span>
      {required ? (
        <span className="t-mono text-accent-bright" aria-hidden="true">
          · REQUIRED
        </span>
      ) : null}
    </label>
  );
}

/** THE FIELD'S BOX: the wrapper the spotlight writes on and the rule
 *  reads from. `relative`, a column, the rule its direct child after the
 *  control; `data-error` while the field carries an error, so the rule
 *  draws in the flare. */
function Field({ children, error = false }: { children: React.ReactNode; error?: boolean }) {
  return (
    <Spotlight>
      <div className="form-field relative flex flex-col" data-error={error ? '' : undefined}>
        {children}
      </div>
    </Spotlight>
  );
}

/** The hairline under a control: the depth layer's lit rule, decorative. */
const rule = <span aria-hidden="true" className="lit-rule" />;

/* No border of its own: the line under the control is the lit rule, the
   field's next sibling. */
const FIELD_BOX = 'w-full min-h-[44px] bg-transparent pb-[12px] pt-[4px]';
/* NO `outline-none` (28 September 2026): the site's one focus ring
   (globals.css) draws round a field reached by keyboard, and the hairline
   still fills light blue under it. */
const FIELD = `${FIELD_BOX} text-ink placeholder:text-ink-3`;
/* The select draws the light-blue chevron (`.field-select`, globals.css)
   in place of the browser's own, so the value needs room reserved for it
   or it runs underneath. The lists sit on full-width rows, which is what
   actually fixes the truncation; `truncate` stays as the backstop for a
   narrow phone. No text colour here: `.field-select` sets it, grey until
   an answer is picked. */
const SELECT = `${FIELD_BOX} field-select appearance-none cursor-pointer truncate pr-[28px]`;
/* One size for every field, typed or picked (28 September 2026). */
const FIELD_TEXT = { fontSize: '18px', lineHeight: '26px', letterSpacing: '-0.01em' };

function Select({
  id,
  name,
  label,
  options,
}: {
  id: string;
  name: string;
  label: string;
  options: readonly string[];
}) {
  return (
    <Field>
      <Label htmlFor={id} className="mb-(--space-4)">
        {label}
      </Label>
      <select id={id} name={name} defaultValue={UNSET} style={FIELD_TEXT} className={SELECT}>
        <option value={UNSET} className="bg-ground">
          Select one — optional
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-ground">
            {o}
          </option>
        ))}
      </select>
      {rule}
    </Field>
  );
}

/** `full` (the default): every field, on /contact. `brief`: name, work
 *  email, organization and message, in Home's footer. */
export default function EnquiryForm({ variant = 'full' }: { variant?: 'full' | 'brief' }) {
  const brief = variant === 'brief';
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState('');
  /* The optional questions' fold. Closed until the reader asks for it. */
  const [more, setMore] = useState(false);
  const hydrated = useHydrated();
  const form = useRef<HTMLFormElement>(null);
  const sent = useRef<HTMLDivElement>(null);
  const failed = useRef<HTMLParagraphElement>(null);

  /* AFTER THE ANSWER, FOCUS GOES TO IT. The button was disabled or gone, so
     focus fell to the page, and on success the whole form is swapped for
     the confirmation — a swap a screen reader does not always announce.
     Moving focus onto the message reads it out and puts the next Tab where
     the reader would go next. Nothing visible changes: neither block draws
     a focus ring. */
  useEffect(() => {
    if (state === 'sent') sent.current?.focus();
  }, [state]);
  useEffect(() => {
    if (failure) failed.current?.focus();
  }, [failure]);

  function check(field: keyof Errors, value: string): string | undefined {
    const v = value.trim();
    if (field === 'name') {
      if (v.length < 2) return 'Please give us a name to reply to.';
      return v.length > LIMITS.name ? `Please keep this under ${LIMITS.name} characters.` : undefined;
    }
    if (field === 'email') {
      if (!v) return 'Please give us an email address to reply to.';
      if (!EMAIL_RE.test(v)) return 'That does not look like an email address we can reply to.';
      return v.length > LIMITS.email ? 'That address is longer than this form accepts.' : undefined;
    }
    if (v.length < 10) return 'A sentence or two about the problem, so we can be useful.';
    return v.length > LIMITS.message
      ? `Please keep this under ${LIMITS.message.toLocaleString('en')} characters.`
      : undefined;
  }

  /** On blur, and only on blur. See the header.
   *
   *  EXCEPT WHEN THE BLUR IS THE SEND BUTTON TAKING FOCUS. On a phone, a
   *  field showing an error was corrected and Send was tapped while the
   *  cursor was still in it: the blur ran first, cleared the two-line
   *  error, the button moved up out from under the finger, and the tap
   *  landed on nothing. Submitting checks every field again anyway, so
   *  when focus is leaving for that button there is nothing to redraw. */
  function onBlur(field: keyof Errors) {
    return (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const to = e.relatedTarget;
      if (to instanceof HTMLButtonElement && to.type === 'submit') return;
      setErrors((prev) => ({ ...prev, [field]: check(field, e.target.value) }));
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
      website: String(data.get('website') ?? ''),
      origin: enquiryOrigin(),
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
      // `flex-1` rather than a fixed 340px: the card this sits in is 720px
      // tall, so a short confirmation pinned to a 340px box left roughly half
      // the panel empty under it. Growing to fill and centring puts the
      // message where the form the reader just filled in was.
      <div
        ref={sent}
        tabIndex={-1}
        role="status"
        className="flex flex-1 flex-col justify-center gap-(--space-3) py-[40px] mobile:py-(--space-3)"
      >
        <p className="t-card text-ink">That has reached us.</p>
        {/* WHAT THIS USED TO SAY was "reply to the address you sent it from
            and it joins the same thread" — which described a conversation
            that does not exist. Nothing is sent back to the visitor: the
            form delivers one email to us, and that is all it does. So that
            is what it says, and the direct address is given for anything
            they want to add. */}
        <p className="t-body max-w-[46ch] text-ink-2">
          Your message has been delivered to us by email and a person will read it — there is no
          autoresponder, so nothing further arrives in your inbox until we reply. To add anything to
          it, write to us directly.
        </p>
        <div className="flex flex-wrap items-center gap-x-(--space-5) gap-y-(--space-1)">
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
            setMore(false);
          }}
          className="t-mono hover-read mt-(--space-1) flex min-h-[44px] w-fit items-center"
        >
          SEND ANOTHER
        </button>
      </div>
    );
  }

  /* The field's text size and the gap under its label. Brief, only the
     gap is tighter. The error and the help sit 8px under the rule. */
  const text = FIELD_TEXT;
  const gap = brief ? 'mb-(--space-3)' : 'mb-(--space-4)';
  const under = 't-caption mt-(--space-1)';

  const nameField = (
    <Field error={!!errors.name}>
      <Label htmlFor="f-name" required className={gap}>
        Name
      </Label>
      <input
        id="f-name"
        name="name"
        autoComplete="name"
        placeholder="Jane Smith"
        maxLength={LIMITS.name}
        required
        aria-required="true"
        style={text}
        onBlur={onBlur('name')}
        aria-invalid={errors.name ? true : undefined}
        aria-describedby={errors.name ? 'e-name' : undefined}
        className={FIELD}
      />
      {rule}
      {errors.name ? (
        <p id="e-name" className={`${under} text-flare`}>
          {errors.name}
        </p>
      ) : null}
    </Field>
  );

  const emailField = (
    <Field error={!!errors.email}>
      <Label htmlFor="f-email" required className={gap}>
        Work email
      </Label>
      <input
        id="f-email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@organization.com"
        maxLength={LIMITS.email}
        required
        aria-required="true"
        style={text}
        onBlur={onBlur('email')}
        aria-invalid={errors.email ? true : undefined}
        aria-describedby={errors.email ? 'e-email' : undefined}
        className={FIELD}
      />
      {rule}
      {errors.email ? (
        <p id="e-email" className={`${under} text-flare`}>
          {errors.email}
        </p>
      ) : null}
    </Field>
  );

  const orgField = (
    <Field>
      <Label htmlFor="f-org" className={gap}>
        Organization
      </Label>
      <input
        id="f-org"
        name="organization"
        autoComplete="organization"
        placeholder="Where you work"
        maxLength={LIMITS.organization}
        style={text}
        className={FIELD}
      />
      {rule}
    </Field>
  );

  /* The one question (CONTACT.messageLabel). Four lines on the full form,
     where it is the centre of the card; two in the footer's brief dress. */
  const messageField = (
    <Field error={!!errors.message}>
      <Label htmlFor="f-message" required className={gap}>
        {CONTACT.messageLabel}
      </Label>
      <textarea
        id="f-message"
        name="message"
        rows={brief ? 2 : 4}
        placeholder={CONTACT.messagePlaceholder}
        maxLength={LIMITS.message}
        required
        aria-required="true"
        style={text}
        onBlur={onBlur('message')}
        aria-invalid={errors.message ? true : undefined}
        aria-describedby={`${errors.message ? 'e-message ' : ''}h-message`}
        className={`${FIELD} resize-none`}
      />
      {rule}
      {errors.message ? (
        <p id="e-message" className={`${under} text-flare`}>
          {errors.message}
        </p>
      ) : null}
      <p id="h-message" className={`${under} text-ink-3`}>
        A few sentences is plenty. Up to {LIMITS.message.toLocaleString('en')} characters.
      </p>
    </Field>
  );

  const challenge = <Select id="f-challenge" name="challenge" label="What are you looking to fix?" options={CHALLENGE} />;
  const capability = (
    <Select id="f-capability" name="capability" label="Which capability do you need?" options={CAPABILITY} />
  );
  const timeline = <Select id="f-timeline" name="timeline" label="Timeline" options={TIMELINE} />;

  return (
    // WITHOUT SCRIPTS THE BROWSER SENDS THE FORM ITSELF. With no method and
    // no action it sent a GET to the page it was on, which wrote the name,
    // the address and the message into the web address and delivered
    // nothing. A plain POST to the contact route carries them in the body
    // instead, and the route answers with a plain page (see route.ts). With
    // scripts running, onSubmit takes over and none of this is reached.
    <form
      ref={form}
      method="post"
      action="/api/contact"
      onSubmit={onSubmit}
      noValidate
      className={`flex w-full flex-col ${brief ? 'gap-(--space-4)' : 'gap-(--space-6) mobile:gap-(--space-5)'}`}
    >
      {/* The honeypot. Off-screen rather than display:none, because some
          bots skip anything that is not rendered. A person never reaches it:
          it is out of the tab order and hidden from assistive technology. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="f-website">Leave this field empty</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {brief ? (
        <>
          <div className="grid grid-cols-3 gap-x-[40px] gap-y-(--space-5) narrow:grid-cols-2 phone:grid-cols-1 mobile:gap-y-(--space-4)">
            {nameField}
            {emailField}
            {orgField}
          </div>
          {messageField}
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-(--space-6) phone:grid-cols-1 mobile:gap-(--space-5)">
            {nameField}
            {emailField}
          </div>

          {orgField}
          {messageField}

          {/* THE OPTIONAL QUESTIONS, FOLDED. One line opens them; closed,
              the panel is `inert` so the three selects are out of the tab
              order and the accessibility tree, and the form reads as four
              fields. The chevron is a disclosure: it turns, it does not
              move. `aria-controls` names the panel either way. */}
          <div className="flex flex-col gap-(--space-4)">
            <button
              type="button"
              aria-expanded={more}
              aria-controls="f-more"
              onClick={() => setMore((v) => !v)}
              className="form-more tap-44 t-mono flex w-fit items-center gap-(--space-1) text-left"
            >
              <span>{CONTACT.optionalToggle}</span>
              <span aria-hidden="true" className="flex size-[16px] flex-none items-center justify-center text-accent-bright">
                <Chevron dir={more ? 'up' : 'down'} size="label" />
              </span>
            </button>
            <div id="f-more" className="contact-fold" data-open={more || undefined}>
              <div inert={hydrated && !more}>
                {/* Each select on its own full-width row, 8px of air under
                    the toggle so the first label does not sit on it. */}
                <div className="flex flex-col gap-(--space-6) pt-(--space-1) mobile:gap-(--space-5)">
                  {challenge}
                  {capability}
                  {timeline}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {failure ? (
        // EVERY FAILURE ENDS WITH THE ADDRESS. "Email us directly" with no
        // address sent a phone reader 1,300px up the page to find one; the
        // wording is the failure line in _MASTER's design direction.
        <p
          ref={failed}
          tabIndex={-1}
          role="alert"
          className="t-body rounded-[8px] border border-flare/40 p-(--space-3) text-flare"
        >
          {failure} Email{' '}
          <a href={`mailto:${SITE.email}`} className="underline underline-offset-[3px] [overflow-wrap:anywhere]">
            {/* On a phone the address wraps after the @, not mid-word. */}
            {SITE.email.split('@')[0]}@<wbr />
            {SITE.email.split('@')[1]}
          </a>{' '}
          directly.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-(--space-5) phone:flex-col phone:items-start">
        {/* Btn's own markup, by hand, because the label changes while it
            sends and the button is disabled meanwhile. The tip draws the
            chevron at 8 x 13, as Btn's does, and the face takes the wipe. */}
        <button type="submit" disabled={state === 'sending'} className="btn disabled:opacity-60">
          <span className="btn-face t-btn">{state === 'sending' ? 'Sending…' : CONTACT.submit}</span>
          <span className="btn-tip">
            <Chevron size="tip" />
          </span>
        </button>
        {/* The two links are words in a sentence and stay that size.
            An invisible layer that took each to 44px reached 14px into the
            line above, so a finger on "By submitting" opened the Terms and a
            finger on "you agree" opened the Privacy Policy — a tap on the
            sentence left the form. Links inside a sentence are the one case
            the 44px rule exempts, and the browser already snaps a near miss
            to the nearest link. */}
        <p className="t-fine max-w-[24ch] text-ink-2">
          By submitting, you agree to our{' '}
          <Link href="/terms" className="text-ink underline decoration-rule underline-offset-2">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-ink underline decoration-rule underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
