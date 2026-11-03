import type { Locale } from '@/lib/i18n';

/* ============================================================================
   THE INTERFACE'S OWN WORDS, in both languages.

   Everything a component used to say in its own markup — the bar, the menu,
   the footer, the 404, the language switch, the labels a screen reader
   hears — is here, keyed by locale, so a French page does not print an
   English control. Page copy stays in its own content file (home.ts,
   about.ts, …) and the French mirrors of those live in content/fr/.

   The French is written to the same register as the English: short,
   declarative, no marketing superlatives. DRAFT — owner review: the French
   strings await the owner's reading before `fr` is published
   (PUBLISHED_LOCALES in lib/i18n.ts).
   ========================================================================= */

const en = {
  skipToContent: 'Skip to content',
  nav: {
    primary: 'Primary',
    menu: 'Menu',
    footer: 'Footer',
    allPages: 'All pages',
    language: 'Language',
    open: 'MENU',
    close: 'CLOSE',
    pill: 'START A CALIBRATION',
    startLead: 'START',
    startLabel: 'A CALIBRATION',
    quotation: 'REQUEST A QUOTATION',
    switchTo: { en: 'English version', fr: 'Version française' },
  },
  footer: {
    heading: 'Start a calibration.',
    headingOnContact: 'Or reach us directly.',
    direct: 'DIRECT',
    noteOnContact:
      'The inquiry form is at the top of this page. A person reads every message that arrives through it.',
    backLead: 'BACK TO',
    backLabel: 'THE FORM',
    start: 'START A CALIBRATION',
    cookies: 'Cookie settings',
    rights: 'All rights reserved.',
    localTime: 'local time',
  },
  opensNewTab: ' (opens in a new tab)',
  notFound: {
    title: 'Page not found',
    eyebrow: 'THIS PAGE DOES NOT EXIST',
    body: 'The address is wrong or the page has moved. Start from one of the pages below.',
    back: 'Back to home',
  },
  consent: {
    title: 'Measurement, with your consent.',
    body: 'We would like to count visits with Google Analytics to understand which pages are read. Nothing is loaded until you accept, and you can change your mind from the footer at any time.',
    accept: 'Accept',
    decline: 'Decline',
    privacy: 'Privacy Policy',
  },
};

export type UiStrings = typeof en;

const fr: UiStrings = {
  skipToContent: 'Aller au contenu',
  nav: {
    primary: 'Principale',
    menu: 'Menu',
    footer: 'Pied de page',
    allPages: 'Toutes les pages',
    language: 'Langue',
    open: 'MENU',
    close: 'FERMER',
    pill: 'DÉMARRER UNE CALIBRATION',
    startLead: 'DÉMARRER',
    startLabel: 'UNE CALIBRATION',
    quotation: 'DEMANDER UN DEVIS',
    switchTo: { en: 'English version', fr: 'Version française' },
  },
  footer: {
    heading: 'Démarrer une calibration.',
    headingOnContact: 'Ou contactez-nous directement.',
    direct: 'DIRECT',
    noteOnContact:
      'Le formulaire est en haut de cette page. Une personne lit chaque message qui arrive par ce formulaire.',
    backLead: 'RETOUR AU',
    backLabel: 'FORMULAIRE',
    start: 'DÉMARRER UNE CALIBRATION',
    cookies: 'Paramètres des cookies',
    rights: 'Tous droits réservés.',
    localTime: 'heure locale',
  },
  opensNewTab: ' (s’ouvre dans un nouvel onglet)',
  notFound: {
    title: 'Page introuvable',
    eyebrow: 'CETTE PAGE N’EXISTE PAS',
    body: 'L’adresse est erronée ou la page a été déplacée. Repartez de l’une des pages ci-dessous.',
    back: 'Retour à l’accueil',
  },
  consent: {
    title: 'La mesure d’audience, avec votre accord.',
    body: 'Nous souhaitons compter les visites avec Google Analytics pour savoir quelles pages sont lues. Rien n’est chargé avant votre accord, et vous pouvez changer d’avis à tout moment depuis le pied de page.',
    accept: 'Accepter',
    decline: 'Refuser',
    privacy: 'Politique de confidentialité',
  },
};

export const UI: Record<Locale, UiStrings> = { en, fr };

export function ui(locale: Locale): UiStrings {
  return UI[locale];
}
