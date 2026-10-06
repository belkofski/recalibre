/* ============================================================================
   THE ENQUIRY FORM'S QUESTIONS — one definition, read by both sides.

   The three dropdown lists were declared inside the form component, so the
   API route had no way to check that a submitted value was ever offered. A
   request could arrive carrying any string at all in `capability` and it
   would be written into the email as though a visitor had chosen it.

   They live here now, and the route validates against the same arrays the
   browser renders. The form and the server cannot drift.

   ── WHY EVERY LIST STARTS EMPTY ───────────────────────────────────────────

   The three questions are optional. They used to be pre-selected — timeline
   defaulted to "Within the next quarter", the challenge to "Manual,
   repetitive processes" — so a visitor who never looked at them still sent
   an answer, and we read a preference nobody expressed. Each list now opens
   on a neutral prompt that submits an empty value.

   ── AND WHY THE LABELS ARE SHORT ──────────────────────────────────────────

   A select draws its own chevron inside the field. In a 270px column at
   17px, "An identity that no longer reflects the organization" showed about
   a third of itself before the arrow cut it off. Every label below fits its
   column at the narrowest desktop width the layout produces.
   ========================================================================= */

/** The neutral opening option. Submits an empty value, so an untouched
 *  field sends no invented preference. */
export const UNSET = '';

export const CHALLENGE = [
  'Manual, repetitive work',
  'Systems that do not connect',
  'A legacy platform to replace',
  'Reporting that takes too long',
  'An identity that no longer fits',
  'Something else',
] as const;

/** The five capabilities in the founder's order. Three are shortened:
 *  'Agentic AI and automation' and 'Product and experience design' are
 *  the capability cards' own titles, and 'Enterprise systems' is the name
 *  the owner chose for this form on 25 September 2026. His full names for
 *  those three are wider than the field on a phone. */
export const CAPABILITY = [
  'Agentic AI and automation',
  'Custom software development',
  'Enterprise systems',
  'Product and experience design',
  'Brand strategy and identity',
  'Not sure yet',
] as const;

export const TIMELINE = [
  'As soon as possible',
  'Within the next quarter',
  'This financial year',
  'No date set yet',
] as const;

/* --------------------------------------------------------------------------
   LIMITS

   Published in the fields as helper text and enforced again on the server,
   so a visitor is told the ceiling before they hit it rather than after.
   -------------------------------------------------------------------------- */
export const LIMITS = {
  name: 120,
  organization: 160,
  email: 254, // the maximum length of an address, per RFC 5321
  message: 4000,
  /** Not a field anyone types: the "Came from" line the form fills in
   *  itself (lib/origin.tsx). Past this it is cut, never refused. */
  origin: 300,
} as const;

/** The whole request body, as bytes. A lead form has no business accepting
 *  an upload, and an unbounded `request.json()` is a free denial of service. */
export const MAX_BODY_BYTES = 24 * 1024;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* --------------------------------------------------------------------------
   THE CONTACT PAGE AS A CONVERSION PAGE (the owner's audit, 6 October 2026).

   The heading is the sentence the form already carried as its h2; the
   message field's label and the two proof lines are his words from the
   audit and the Calibration card's own two promises. The optional questions
   stay, folded behind one line, so the form reads as the start of a
   diagnostic and not as a contact-us form.
   -------------------------------------------------------------------------- */
export const CONTACT = {
  eyebrow: 'START A CALIBRATION',
  headline: 'Tell us what is not working yet.',
  lede: 'Describe the operational problem in your own words. We will tell you whether it is a strategy problem, a systems problem or a design problem — and what a Calibration would cover.',
  messageLabel: 'What are you trying to change?',
  messagePlaceholder: 'What is not working yet?',
  optionalToggle: 'ADD CONTEXT · OPTIONAL',
  proof: ['Fixed scope, agreed before it starts', 'A written plan you keep, whether or not you continue'],
  submit: 'Start a calibration',
} as const;

export type EnquiryField = keyof typeof LIMITS;
