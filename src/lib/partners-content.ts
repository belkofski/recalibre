import type { ImageSrc } from './images.generated';

/**
 * PARTNERS — real, and harvested from _MASTER, not written here.
 *
 *   names, kinds and details   _HARVEST/content/partners.ts
 *   the counting rule          _MASTER/04-ASSETS/README.md
 *   the row's design           _MASTER/01-BRAND/design-direction.md
 *
 * THE RULE THAT MATTERS. `kind: 'house'` is a company Fadi owns and runs
 * himself: its mark still appears in the row, but it is never presented as a
 * client, because counting your own company does not survive a check.
 * Belkofski and Saidis are both his, which is why they carry the OUR OWN
 * stamp. Nothing on the page counts any of these rows — see the note above
 * PARTNERS_BLOCK for why the figure came off.
 *
 * THE ROW IS NOT A LOGO WALL — five hairline rows, the mark at a common cap
 * height on the left, the name, the detail, and the stamp on the two houses.
 *
 * ON A LIGHT GROUND, DELIBERATELY. The brand note says the two PNG marks
 * (dorwa, hostino) "cannot survive" being recoloured for a dark ground, and
 * that no asset is ever CSS-inverted, so on dark those two rows would have had
 * to fall back to type. All five marks are dark ink on transparency, so a light
 * ground shows every one of them exactly as drawn — no inversion, no filter,
 * no fallback, and nothing graded.
 */
export type Partner = {
  name: string;
  kind: 'partner' | 'house';
  detail: string;
  mark: ImageSrc;
  /**
   * Rendered BOX height in px, set per mark — because matching the boxes does
   * not match the marks. Measured with getBBox in the browser, the ink fills
   * a different share of each viewBox:
   *
   *   abp        13.1 of 24      = 0.546
   *   saidis     11.9 of 24      = 0.495
   *   belkofski  77.0 of 231.24  = 0.333   <- a third, hence the tall box
   *
   * Set to the same box height, Belkofski's letters came out 8.7px against
   * ABP's 14.2px and it read as faint rather than as a quieter brand. These
   * boxes are solved backwards from a common ~13px of ink:
   * 13/0.546 = 24, 13/0.495 = 26, 13/0.333 = 39.
   *
   * The two PNGs are pictorial marks, not wordmarks, so they carry their own
   * weight and are set by eye against the three above.
   */
  markH: number;
};

export const PARTNERS: readonly Partner[] = [
  { name: 'ABP Continental', kind: 'partner', detail: 'Industrial contracting',   mark: '/img/partner-abp.svg',       markH: 24 },
  { name: 'Dorwa Production', kind: 'partner', detail: 'Production',              mark: '/img/partner-dorwa.png',     markH: 38 },
  { name: 'Hostino',          kind: 'partner', detail: 'Hosting and infrastructure', mark: '/img/partner-hostino.png', markH: 34 },
  { name: 'Belkofski',        kind: 'house',   detail: 'Our own eyewear house',   mark: '/img/partner-belkofski.svg', markH: 39 },
  { name: 'Saidis',           kind: 'house',   detail: 'Our own trading entity',  mark: '/img/partner-saidis.svg',    markH: 26 },
] as const;

/**
 * NO COUNT IS PUBLISHED, AND THIS IS NOT A STYLE PREFERENCE.
 *
 * The headline used to be composed from these rows and read "Three standing
 * partners. Two houses of our own." The arithmetic was right and the claim was
 * not. "Standing partner" states an ongoing commercial relationship, and for
 * two of the three there is nothing on record that supports it:
 *
 *   Dorwa Production  declared a partner by the owner on 26 Aug 2026, with no
 *                     scope, no date and no written permission on file.
 *                     _MASTER/README.md carries it as open decision 1, still
 *                     unanswered.
 *   Hostino           a hosting supplier, counted as a partner in three
 *                     previous builds. Same open question.
 *
 * Charter rules 13 and 22 forbid a partner figure outright, for this reason.
 * So the marks are shown, the names are shown, and nothing is counted. The
 * rows say everything a reader needs; a number on top of them would be the
 * only unverified thing in the block.
 *
 * The count goes back the day the founder confirms what those two
 * relationships actually are — and not before.
 */
export const PARTNERS_BLOCK = {
  eyebrow: 'PARTNERS',
  headline: {
    l1: 'Who we work with,',
    l2: 'and what we own.',
  },
  note: 'The two we own are marked as ours. They are not counted as clients.',
  stamp: 'OUR OWN',
} as const;
