'use client';

import { useEffect } from 'react';
import { LEGAL, PAGES } from '@/content/site';
import { LIMITS } from '@/content/enquiry';

/* ============================================================================
   WHERE AN ENQUIRY CAME FROM.

   The owner's decision of 25 September 2026: the email the form sends says
   which page the visitor came from, which part of that page, and which
   button or link they pressed to reach the form. Nothing on screen changes.
   The Privacy page says it is sent (content/legal.ts).

   ── HOW IT IS KNOWN ──────────────────────────────────────────────────────

   A click on any link to the contact page, anywhere on the site, is noted
   the moment it happens, while the page it was pressed on is still on
   screen: the page's name, the part of the page, and the words on the link.
   The note is kept in the tab's sessionStorage — the tab's own memory, gone
   when the tab closes — and the form reads it when it is sent. It is never
   put in an address, never sent anywhere but in the enquiry, and holds
   nothing about the visitor: only words the site itself printed. No cookie,
   no third party.

   A click made on the contact page itself is not noted, so the menu's
   contact link pressed there does not overwrite the link that brought the
   visitor in.

   ── THE NAMES ARE THE SITE'S OWN ─────────────────────────────────────────

   The page: the PAGES and LEGAL labels in content/site.ts ("Home page",
   "Capabilities page", "Privacy Policy page"); on a case study or an article, the page's own
   heading, which is the initiative name from content/work.ts or the article
   title from content/insights.ts; the 404's own title, "Page not found".
   The two content files are not imported: they hold the full text of seven
   pages, and this file ships on every page.

   The part of the page, first match wins: "menu" for anything in the
   header, "footer" for the footer, "first screen" for the first block of
   the page, then the block's own name (its aria-label, or the text its
   aria-labelledby points at), then its first heading — cut to six words.

   The link: its words as they read at the click, so a relabelled button is
   reported by its new label with no change here.

   ── NOTHING HERE CAN STOP AN ENQUIRY ─────────────────────────────────────

   Every storage call can throw — a private window, blocked site data — and
   every one is wrapped. A failure is silent: the note is not kept, and the
   email says less. `enquiryOrigin` never throws.
   ========================================================================= */

const KEY = 'recalibre.enquiry-origin';

/** Whitespace collapsed, a closing full stop dropped. */
function tidy(text: string | null | undefined): string {
  return (text ?? '').replace(/\s+/g, ' ').trim().replace(/\.$/, '');
}

/** At most `max` words, with an ellipsis when cut. */
function firstWords(text: string, max: number): string {
  const all = text.split(' ').filter(Boolean);
  return all.length > max ? `${all.slice(0, max).join(' ')}…` : all.join(' ');
}

function currentPath(): string {
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

/** The page's name, in the site's own words. See the header. */
function pageName(): string {
  if (document.getElementById('nf-head')) return 'Page not found';
  const initiative = tidy(document.getElementById('init-head')?.textContent);
  if (initiative) return `${initiative} page`;
  const article = tidy(document.getElementById('art-head')?.textContent);
  if (article) return `Insights article “${article}”`;
  const path = currentPath();
  const named = [...PAGES, ...LEGAL].find((l) => l.href === path);
  return named ? `${named.label} page` : tidy(document.title);
}

/** The part of the page a link sits in. See the header. */
function partOf(link: Element): string {
  if (link.closest('header')) return 'menu';
  if (link.closest('footer')) return 'footer';
  const block = link.closest('section');
  if (!block) return '';
  if (block === document.querySelector('main section')) return 'first screen';
  const labelledBy = block.getAttribute('aria-labelledby');
  const name =
    block.getAttribute('aria-label') ||
    (labelledBy ? document.getElementById(labelledBy)?.textContent : '') ||
    block.querySelector('h1, h2, h3')?.textContent;
  // A card that names itself (the three stage cards, which share one button
  // label) is added after the block: "Three stages, Build card".
  const card = link.closest('[data-origin-card]')?.getAttribute('data-origin-card');
  const part = firstWords(tidy(name), 6);
  return card ? [part, `${tidy(card)} card`].filter(Boolean).join(', ') : part;
}

/** The words on the link. Read text by text, because a two-word link
 *  (START / A CALIBRATION) is two spans with no space between them. */
function linkWords(link: Element): string {
  const parts: string[] = [];
  const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) parts.push(node.textContent ?? '');
  return firstWords(tidy(parts.join(' ')), 8) || tidy(link.getAttribute('aria-label'));
}

/** One line: "Home page, first screen: “Start a calibration”". */
function describe(link: Element): string {
  const where = [pageName(), partOf(link)].filter(Boolean).join(', ');
  const words = linkWords(link);
  return (words ? `${where}: “${words}”` : where).slice(0, LIMITS.origin);
}

/**
 * What the form sends as `origin`, worked out at the moment of sending. On
 * the contact page: the note, if one was kept, or that the visitor arrived
 * without a link on this site. Everywhere else the form is the one at the
 * foot of the page, so it names that page. Never throws; '' at worst.
 */
export function enquiryOrigin(): string {
  try {
    if (currentPath() !== '/contact') return `${pageName()}, form at the foot of the page`;
    let noted: string | null;
    try {
      noted = window.sessionStorage.getItem(KEY);
    } catch {
      return pageName();
    }
    return (noted || `${pageName()}, arrived directly`).slice(0, LIMITS.origin);
  } catch {
    return '';
  }
}

/** Mounted once, in the root layout, beside MotionReady. Draws nothing. */
export function EnquiryOrigin() {
  useEffect(() => {
    // Capture, so the note is taken before the menu closes or the router
    // starts to change the page.
    const onClick = (event: MouseEvent) => {
      try {
        if (!(event.target instanceof Element)) return;
        const link = event.target.closest('a[href]');
        if (!link) return;
        const to = new URL(link.getAttribute('href') ?? '', window.location.href);
        if (to.origin !== window.location.origin || to.pathname !== '/contact') return;
        if (currentPath() === '/contact') return;
        window.sessionStorage.setItem(KEY, describe(link));
      } catch {
        // Silent by design. See the header.
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}
