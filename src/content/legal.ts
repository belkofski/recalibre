/* ============================================================================
   PRIVACY AND TERMS.

   The footer of every earlier version of this site linked to both of these
   and neither existed. They exist now.

   THE ONE THING THAT IS NOT FILLED IN is the registered entity: its legal
   name, its registration number and its registered address. Those are not
   on record anywhere that can be checked, and they are not guessable. A
   privacy notice that cannot name the party processing the data is not a
   privacy notice — so both pages carry a visible notice saying exactly that,
   at the top, rather than a plausible-looking entity nobody can verify.

   Everything else describes what this site actually does: it serves pages,
   it has one form, and the form sends an email. There is no analytics, no
   advertising network, no tracking cookie and no third-party embed on it,
   so none of those is described — describing protections against things
   that are not happening is its own kind of dishonesty.
   ========================================================================= */

export const PENDING_ENTITY =
  'Registered entity details are pending. The legal entity name, registration number and registered address are added to this page before the site goes live at its public address. The contact details below reach us in the meantime.';

export const PRIVACY = {
  updated: 'Last reviewed 21 September 2026',
  intro:
    'This notice describes what this website collects, why, and what happens to it. It is written to be read rather than to be defended, and it describes only what this site actually does.',
  sections: [
    {
      heading: 'What this site collects',
      paragraphs: [
        'One form, on the contact page. It asks for your name, your organization, your work email address, the nature of your operational challenge, the capability you think you need, a timeline, and a description of the problem in your own words. Every field except name, email and the description is optional, and nothing is required that is not needed to reply to you.',
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
        'The contents of the form are delivered to us by email through a transactional email provider. It is read by a person. It is used to reply to you and to assess whether the work is something we can usefully take on.',
        'It is not sold, not rented, not added to a marketing list, and not shared with any third party for their own purposes. If a reply requires us to involve somebody else, we ask you first.',
      ],
    },
    {
      heading: 'How long it is kept',
      paragraphs: [
        'Enquiries are kept while they are live and for as long afterwards as is reasonable for the relationship they started. If nothing comes of an enquiry, tell us and we delete it.',
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
        'Nothing on this page concerns operational data inside systems Recalibre builds for an organization. That is governed by the engagement agreement for that work, and data residency, access and retention are agreed during calibration and written into the scope before anything is built.',
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
  updated: 'Last reviewed 21 September 2026',
  intro:
    'These terms cover the use of this website. They do not cover an engagement — that is governed by a separate written agreement, agreed with you before any work begins.',
  sections: [
    {
      heading: 'What this site is',
      paragraphs: [
        'An informational website describing Recalibre, its capabilities, its engagement model and the initiatives it is developing. It is not an offer, a quotation, or a commitment to perform work.',
      ],
    },
    {
      heading: 'Accuracy, and what is deliberately absent',
      paragraphs: [
        'Everything stated about Recalibre on this site is accurate to the best of our knowledge at the review date above. Where a fact is not settled — a founding date, an availability status, a reply time, a price, a client name — it is absent rather than estimated.',
        'Products described as in development are in development. They are not deployed with any organization, and every product screen on this site carries demonstration data, labelled as such on the screen itself.',
      ],
    },
    {
      heading: 'No professional advice',
      paragraphs: [
        'The articles published under Insights describe positions Recalibre holds and can defend from its own work. They are not professional, legal, regulatory or financial advice, and they are not warranted to fit your circumstances. Decisions about your organization remain yours.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'The content of this site, including its text, images, product screens and drawings, belongs to Recalibre or to the party it names, and may not be reproduced commercially without permission. Marks belonging to other organizations appear on this site as marks only and remain the property of their owners.',
      ],
    },
    {
      heading: 'Enquiries sent through this site',
      paragraphs: [
        'Sending the contact form does not create a contract, a retainer or a duty of confidence. Please do not send confidential or commercially sensitive material through it. If confidentiality is needed before a conversation, say so in the form and we will arrange it properly first.',
      ],
    },
    {
      heading: 'Availability',
      paragraphs: [
        'This site is provided as it is. We do not warrant that it will be uninterrupted or error free, and we may change or remove any part of it. Where it links to a site we do not control, we are not responsible for what is there.',
      ],
    },
    {
      heading: 'Governing law',
      paragraphs: [
        'These terms are governed by the law of the jurisdiction in which the Recalibre entity is registered. That entity is named on this page once its registration details are recorded — see the notice above.',
      ],
    },
  ],
} as const;
