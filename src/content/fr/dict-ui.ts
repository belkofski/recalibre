/* The French of the words the components print themselves — labels, link
   words, headings a view hard-codes — keyed by the English. Anything a
   component prints through `tr(locale)` (content/index.ts) must be here.
   DRAFT — owner review. */
export const DICT_UI: Readonly<Record<string, string>> = {
  // ── names and marks that stay as they are, so the coverage check is honest
  'ABP Continental': 'ABP Continental',
  OPS: 'OPS',
  Belkofski: 'Belkofski',
  '3D': '3D',
  Contraxis: 'Contraxis',
  'Enterprise systems and integration': 'Systèmes d’entreprise et intégration',
  ').': ').',

  'LAST REVIEWED': 'DERNIÈRE RÉVISION',
  CONTACT: 'CONTACT',
  'The document': 'Le document',
  Partners: 'Partenaires',
  'More insights.': 'D’autres perspectives.',
  'partner and client': 'partenaire et client',
  partner: 'partenaire',
  'Previous': 'Précédent',
  'Next': 'Suivant',



  // ── shared
  'START A CALIBRATION': 'DÉMARRER UNE CALIBRATION',
  'ALL PROJECTS': 'TOUS LES PROJETS',
  'ALL INSIGHTS': 'TOUTES LES PERSPECTIVES',
  ALL: 'TOUS',
  SERVICES: 'SERVICES',
  PROJECTS: 'PROJETS',
  EXPLORE: 'EXPLORER',
  'YOU RECEIVE': 'VOUS RECEVEZ',
  'THE ONE WAY IN': 'LA SEULE PORTE D’ENTRÉE',
  'Related work': 'Projets liés',
  'MIN READ': 'MIN DE LECTURE',
  'READ THE ARTICLE': 'LIRE L’ARTICLE',
  Articles: 'Articles',
  Partner: 'Partenaire',
  Client: 'Client',
  'Pause motion': 'Mettre en pause',
  'Play motion': 'Relancer',
  'No project carries that discipline yet.': 'Aucun projet ne porte encore cette discipline.',
  DISCIPLINES: 'DISCIPLINES',
  'Previous principle': 'Principe précédent',
  'Next principle': 'Principe suivant',
  'The firm': 'Le cabinet',
  'The services': 'Les services',
  'The value chain': 'La chaîne de valeur',

  // ── about
  'HOW WE ARE ORGANIZED': 'COMMENT NOUS SOMMES ORGANISÉS',
  'THE STAGES': 'LES ÉTAPES',
  'THE DISCIPLINES': 'LES DISCIPLINES',
  CALIBRATION: 'CALIBRATION',
  BUILD: 'CONSTRUCTION',
  PARTNERSHIP: 'PARTENARIAT',
  STRATEGY: 'STRATÉGIE',
  AUTOMATION: 'AUTOMATISATION',
  'How an engagement': 'Comment se déroule',
  'runs.': 'une mission.',
  'About — a firm built to carry the whole program': 'À propos — un cabinet conçu pour porter tout le programme',
  'Recalibre is a strategy, design and technology firm. Strategy, design, agentic AI, automation and engineering are one integrated capability, carried by one team.':
    'Recalibre est un cabinet de stratégie, de design et de technologie. Stratégie, design, IA agentique, automatisation et ingénierie forment une seule capacité intégrée, portée par une seule équipe.',
  'A rendered room: a chair facing a wide screen showing the OPS overview, an ottoman beside it, against a deep blue wall.':
    'Une pièce en image de synthèse : une chaise face à un grand écran affichant l’aperçu OPS, un pouf à côté, contre un mur bleu profond.',

  // ── projects index and case pages
  'Selected work': 'Projets choisis',
  work: 'choisis',
  'Selected work by Recalibre: field operations, document intelligence, industrial contracting and eyewear.':
    'Les projets choisis de Recalibre : opérations de terrain, intelligence documentaire, sous-traitance industrielle et lunetterie.',
  'A blue Belkofski paddle carrying the wordmark, lying across a court line, shot from above.':
    'Une raquette Belkofski bleue portant le logotype, posée en travers d’une ligne de court, vue du dessus.',
  Work: 'Projets',
  Details: 'Détails',
  Images: 'Images',
  YEAR: 'ANNÉE',
  CATEGORY: 'CATÉGORIE',
  OWNER: 'PROPRIÉTAIRE',
  'In-house product': 'Produit interne',
  SCOPE: 'PÉRIMÈTRE',
  SECTOR: 'SECTEUR',
  'MORE FROM RECALIBRE': 'AUSSI CHEZ RECALIBRE',
  'More work.': 'D’autres projets.',
  'OPEN FULL SIZE': 'OUVRIR EN GRAND',
  'Not found': 'Introuvable',

  // ── insights
  'Insights — method pieces on operational systems': 'Perspectives — des textes de méthode sur les systèmes opérationnels',
  'Method pieces on the decisions that shape an operational system: where oversight sits, which copy of the day’s records counts, what a second language costs.':
    'Des textes de méthode sur les décisions qui façonnent un système opérationnel : où se place la supervision, quelle copie des registres du jour fait foi, ce que coûte une seconde langue.',
  'A rendered room: a wide screen on a stand showing the OPS overview, against a deep blue wall.':
    'Une pièce en image de synthèse : un grand écran sur pied affichant l’aperçu OPS, contre un mur bleu profond.',
  'A rendered room: a wide screen showing the OPS overview, against a deep blue wall.':
    'Une pièce en image de synthèse : un grand écran affichant l’aperçu OPS, contre un mur bleu profond.',
  'WRITTEN BY': 'ÉCRIT PAR',
  SUBJECT: 'SUJET',
  'MORE INSIGHTS': 'AUTRES PERSPECTIVES',
  'More notes.': 'D’autres notes.',
  CONTENTS: 'SOMMAIRE',
  Contents: 'Sommaire',
  Recalibre: 'Recalibre',

  // ── contact
  'Contact — describe the operational problem': 'Contact — décrivez le problème opérationnel',
  'Describe the operational problem in your own words. A person reads every inquiry that arrives through this form.':
    'Décrivez le problème opérationnel dans vos propres mots. Une personne lit chaque demande qui arrive par ce formulaire.',
  'Get in touch.': 'Prenez contact.',
  touch: 'contact',
  'Describe the operational problem in your own words. We will tell you whether it is a strategy problem, a systems problem or a design problem — and what a Calibration would cover.':
    'Décrivez le problème opérationnel dans vos propres mots. Nous vous dirons s’il s’agit d’un problème de stratégie, de systèmes ou de design — et ce qu’une Calibration couvrirait.',
  EMAIL: 'E-MAIL',
  PHONE: 'TÉLÉPHONE',
  LOCATION: 'LIEU',

  // ── legal pages
  'Privacy Policy.': 'Politique de confidentialité.',
  'Terms of Service.': 'Conditions d’utilisation.',
  'What this website collects, why, and what happens to it. One form, visit counting only with your consent, no advertising network.':
    'Ce que ce site collecte, pourquoi, et ce qu’il en advient. Un formulaire, un comptage des visites seulement avec votre accord, aucun réseau publicitaire.',
  'Terms covering the use of this website. An engagement is governed by a separate written agreement.':
    'Les conditions d’utilisation de ce site. Une mission relève d’un accord écrit distinct.',

  // ── services and industries views
  'THE SERVICES': 'LES SERVICES',
  'HOW IT RUNS': 'COMMENT ÇA TOURNE',
  'What it': 'Ce que cela',
  'covers.': 'couvre.',
  'How it is': 'Comment c’est',
  'delivered.': 'livré.',
  'What you': 'Ce que vous',
  'receive.': 'recevez.',
  'What it looks like': 'À quoi cela ressemble',
  'in practice.': 'en pratique.',
  'Questions about this service.': 'Questions sur ce service.',
  'this service.': 'ce service.',
  'WHAT WE BUILD HERE': 'CE QUE NOUS CONSTRUISONS ICI',
  'You brief once. The same team carries it through to production.': 'Vous briefez une fois. La même équipe mène le travail jusqu’à la production.',
};
