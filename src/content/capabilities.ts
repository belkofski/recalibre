/* ============================================================================
   THE CAPABILITIES PAGE (the owner's audit, 6 October 2026: "Capabilities
   should be a first-class page … visitors don't have a clean place to
   explore them individually").

   The five capabilities themselves, their words, tags, pictures, anchors
   and related work, are CAPABILITIES in content/home.ts: one record, read
   by Home's index and by this page. What is here is the page's own frame:
   its heading, its lede (the same sentence Home's block carries) and the
   two structural labels it prints. Nothing is claimed that Home does not
   already say.
   ========================================================================= */

export const CAPABILITIES_PAGE = {
  eyebrow: 'CAPABILITIES',
  headline: ['Our capabilities.'],
  lede: 'Five capabilities, one team. You brief once and the same team carries it through to production.',
  /** Over the anchor list in the opener and the sticky index beside the chapters. */
  indexLabel: 'FIVE CAPABILITIES',
  /** Over the row of initiatives that show a capability in use. */
  relatedLabel: 'IN THE WORK',
} as const;
