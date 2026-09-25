/* ============================================================================
   PRIVACY AND TERMS.

   The footer of every earlier version of this site linked to both of these
   and neither existed. They exist now.

   THE REGISTERED ENTITY is named in the text of both pages: EURL Recalibre,
   under the law of Algeria, on the founder's word of 24 September 2026. Its
   registration number is NOT printed, by his decision of 25 September. Its
   registered address is printed the way he supplied it the same day — a map
   pin with no street name — as the place, the pin's coordinates and a link
   to the pin (SITE.address). A paragraph that carries that link is written
   as `parts`, so the link is real markup rather than a pasted URL.

   Everything else describes what this site actually does: it serves pages,
   it has one form, and the form sends an email. There is no analytics, no
   advertising network, no tracking cookie and no third-party embed on it,
   so none of those is described — describing protections against things
   that are not happening is its own kind of dishonesty.
   ========================================================================= */

import { SITE } from '@/content/site';

/* THE REVIEW DATE, one value for both pages: the day their text last
   changed. The pages promise the date moves whenever the notice changes, and
   it did on 24 September 2026 (the company named, the retention rule, the
   email provider) and again on 25 September 2026 (the page an enquiry came
   from; the articles described as positions Recalibre holds). LAUNCH DAY:
   set this to that day — Fadi's decision of 24 September 2026 is that the
   date the public sees is the launch date. */
const REVIEWED = 'Last reviewed 25 September 2026';

/** The registered-address clause both pages share: place, coordinates, and
 *  the pin itself as a link. */
const ADDRESS_PARTS = [
  `registered address: ${SITE.address.place}, at ${SITE.address.coordinates} (`,
  { label: 'map', href: SITE.address.map },
  ').',
] as const;

export const PRIVACY = {
  updated: REVIEWED,
  intro:
    'This notice describes what this website collects, why, and what happens to it. It is written to be read rather than to be defended, and it describes only what this site actually does.',
  sections: [
    {
      heading: 'What this site collects',
      paragraphs: [
        'One inquiry form. It is the same form wherever you meet it — at the foot of most pages, and at the top of the contact page — and it sends to the same place. It asks for your name, your organization, your work email address, the nature of your operational challenge, the capability you think you need, a timeline and a description of the problem in your own words. The form also sends the page you sent it from or, if a link on this site brought you to the contact page, which page, which part of it and which link that was. Your browser keeps that note in the open tab only, and drops it when the tab is closed. Only the name, the email address and the description are required. The three questions in between are optional and are sent unanswered unless you answer them.',
        'One hidden field on that form is a spam trap. It is left empty by a person and filled in by an automated script, and a submission that fills it is discarded rather than delivered.',
        'No account can be created on this site, so no password is ever collected. No payment can be made on this site, so no financial information is ever collected.',
      ],
    },
    {
      heading: 'What this site does not collect',
      paragraphs: [
        'There is no analytics package on this site, no advertising network, no tracking pixel, no social embed and no third-party script that observes you. There is therefore no cookie banner, because there are no cookies to consent to.',
        'Standard web server logs may record the request — an address, a time, a page and a browser string — as any web server does. These are operational records, not a profile, and they are not combined with anything you send through the form.',
      ],
    },
    {
      heading: 'What happens to what you send',
      paragraphs: [
        { parts: ['What you send is received by EURL Recalibre, ', ...ADDRESS_PARTS] },
        'The contents of the form are delivered to us as a single email, sent through Resend (resend.com), the email service the site uses. Nothing is sent back to you automatically — you receive no confirmation email and no acknowledgment, only a reply written by a person when there is one to write.',
        'It is read by a person. It is used to reply to you and to assess whether the work is something we can usefully take on. It is not sold, not rented, not added to a marketing list, and not shared with any third party for their own purposes. If a reply requires us to involve somebody else, we ask you first.',
        'The web server records the network address a submission came from for a short period, so that the form can be rate limited against automated abuse. It is not attached to the message and not used to identify you.',
      ],
    },
    {
      heading: 'How long it is kept',
      paragraphs: [
        'Inquiries are kept for twenty-four months and then deleted. If an inquiry leads to work, the correspondence is kept for as long as the engagement runs and afterwards for the period the company’s accounting records require. If nothing comes of an inquiry, tell us and we delete it.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'You may ask what we hold about you, ask for it to be corrected, or ask for it to be deleted. Email the address at the foot of this page and a person will action it rather than route it into a queue.',
      ],
    },
    {
      heading: 'Client data is a separate matter',
      paragraphs: [
        'Nothing on this page concerns operational data inside systems Recalibre builds for an organization. That is governed by the engagement agreement for that work, and data residency, access and retention are agreed during Calibration and written into the scope before anything is built.',
      ],
    },
    {
      heading: 'Changes',
      paragraphs: [
        'If this notice changes, the review date at the top of the page changes with it. Material changes are not applied retroactively to information already sent to us.',
      ],
    },
  ],
} as const;

export const TERMS = {
  updated: REVIEWED,
  intro:
    'These terms cover the use of this website. They do not cover an engagement — that is governed by a separate written agreement, agreed with you before any work begins.',
  sections: [
    {
      heading: 'What this site is',
      paragraphs: [
        {
          parts: [
            'An informational website describing Recalibre, its capabilities, its engagement model and its work. It is not an offer, a quotation, or a commitment to perform work. It is published by EURL Recalibre, ',
            ...ADDRESS_PARTS,
          ],
        },
      ],
    },
    {
      heading: 'Accuracy',
      paragraphs: [
        'Everything stated about Recalibre on this site is accurate to the best of our knowledge at the review date above.',
        'Products described as in development are in development. They are not deployed with any organization, and every product screen on this site carries demonstration data, labeled as such on the screen itself.',
      ],
    },
    {
      heading: 'No professional advice',
      paragraphs: [
        'The articles published under Insights describe positions Recalibre holds. They are not professional, legal, regulatory or financial advice, and they are not warranted to fit your circumstances. Decisions about your organization remain yours.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'The content of this site, including its text, images, product screens and drawings, belongs to Recalibre or to the party it names, and may not be reproduced commercially without permission. Marks belonging to other organizations appear on this site as marks only and remain the property of their owners.',
      ],
    },
    {
      heading: 'Inquiries sent through this site',
      paragraphs: [
        'Sending the contact form does not create a contract, a retainer or a duty of confidence. Please do not send confidential or commercially sensitive material through it. If confidentiality is needed before a conversation, say so in the form and we will arrange it properly first.',
      ],
    },
    {
      heading: 'Availability',
      paragraphs: [
        'This site is provided “as is”. We do not warrant that it will be uninterrupted or error free, and we may change or remove any part of it. Where it links to a site we do not control, we are not responsible for what is there.',
      ],
    },
    {
      heading: 'Governing law',
      paragraphs: [
        'These terms are governed by the law of Algeria.',
      ],
    },
  ],
} as const;
