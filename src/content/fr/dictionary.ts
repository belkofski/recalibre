import { DICT_HOME } from '@/content/fr/dict-home';
import { DICT_SERVICES } from '@/content/fr/dict-services';
import { DICT_INDUSTRIES_WORK } from '@/content/fr/dict-industries-work';
import { DICT_INSIGHTS_LEGAL } from '@/content/fr/dict-insights-legal';
import { DICT_UI } from '@/content/fr/dict-ui';

/* ============================================================================
   THE FRENCH DICTIONARY — every English sentence on the site, and its
   French (4 November 2026).

   Keyed by the English, applied by content/index.ts to the one content
   tree, so a French page is the English page's structure with its words
   swapped. Split by source file for reading; merged here. A sentence
   missing from it is left in English on the French page, where
   `scripts/dump-strings.mjs --check` lists it and the French reader can
   see it — never a broken page.

   DRAFT — owner review: the French awaits the owner's reading before `fr`
   joins PUBLISHED_LOCALES in lib/i18n.ts.
   ========================================================================= */
export const DICTIONARY: Readonly<Record<string, string>> = {
  ...DICT_HOME,
  ...DICT_SERVICES,
  ...DICT_INDUSTRIES_WORK,
  ...DICT_INSIGHTS_LEGAL,
  ...DICT_UI,
};
