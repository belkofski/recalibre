/** A paragraph cut once at its first sentence end: the claim in front, the
 *  rest behind it. The opener sets the story's first paragraph this way
 *  (the claim at lede size in full ink, the reason in the second tint),
 *  and the organized block's two cards set the other two the same way, so
 *  one rule decides where every two-tone statement on the page breaks. A
 *  paragraph with one sentence comes back whole, with nothing behind it.
 *  Nothing is cut: both parts are printed, always. */
export function split(paragraph: string): [string, string] {
  const cut = paragraph.indexOf('. ');
  if (cut === -1) return [paragraph, ''];
  return [paragraph.slice(0, cut + 1), paragraph.slice(cut + 1).trim()];
}
