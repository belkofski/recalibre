'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The footer's old "Copy" button was an <a href="mailto:"> with the word Copy
 * on it. It opened a mail client; it never touched the clipboard. The label
 * described something the control did not do.
 *
 * This one copies, and says so. Two targets, because they are two different
 * intentions and each deserves its own control:
 *
 *   the address itself -> mailto:, for people who want to write now
 *   the copy button    -> clipboard, for people who want the address elsewhere
 *
 * Feedback is required on every action (house rule), so the button swaps to
 * "Copied" with a tick for 1.8s. writeText can reject — insecure origin, denied
 * permission, an older browser — so a failure says "Press Ctrl+C" rather than
 * silently doing nothing and looking broken all over again.
 */
export default function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // a pending timeout must not fire into an unmounted component
  useEffect(() => () => clearTimeout(timer.current), []);

  /**
   * navigator.clipboard only exists on a secure origin. Served over plain http
   * — a LAN preview on 192.168.x.x, say — it is undefined, so the modern call
   * is tried first and the old execCommand path catches that case. Both need a
   * real user gesture; if neither lands, the button says so instead of looking
   * like it did nothing.
   */
  const write = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to the legacy path
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    // off-screen rather than hidden: display:none cannot be selected
    ta.style.cssText = 'position:fixed;top:-9999px;opacity:0';
    document.body.appendChild(ta);
    try {
      ta.select();
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      ta.remove();
    }
  };

  const copy = async () => {
    clearTimeout(timer.current);
    setState((await write(email)) ? 'copied' : 'failed');
    timer.current = setTimeout(() => setState('idle'), 1800);
  };

  const label =
    state === 'copied' ? 'Copied' : state === 'failed' ? 'Press Ctrl+C' : 'Copy';

  return (
    <div className="flex items-center gap-[8px]">
      <a
        href={`mailto:${email}`}
        className="focus-ring tap-44 body-text rounded-[8px] text-on-dark underline decoration-[rgba(255,255,255,0.28)] underline-offset-[4px] transition-colors duration-[200ms] hover:decoration-[rgb(255,255,255)]"
      >
        {email}
      </a>

      <button
        type="button"
        onClick={copy}
        // aria-live on a wrapper the button owns, so a screen reader hears the
        // result without the button's accessible name changing under focus
        aria-label={`Copy ${email} to clipboard`}
        className="focus-ring tap-44 flex h-[28px] shrink-0 items-center gap-[6px] rounded-[8px] border border-rule-on-dark px-[9px] text-[12px] leading-[16px] font-medium text-on-dark-2 transition-colors duration-[200ms] hover:border-rule-strong hover:text-on-dark"
      >
        {state === 'copied' ? (
          <svg viewBox="0 0 24 24" className="h-[13px] w-[13px]" aria-hidden="true"
            fill="none" stroke="currentColor" strokeWidth="2.4"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-[13px] w-[13px]" aria-hidden="true"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="12" height="12" rx="2.5" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        )}
        <span className="whitespace-pre">{label}</span>
      </button>

      <span aria-live="polite" className="sr-only">
        {state === 'copied' ? 'Address copied to clipboard' : ''}
      </span>
    </div>
  );
}
