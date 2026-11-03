'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Btn } from '@/components/ui';
import { useLocale } from '@/lib/locale';
import { ui } from '@/content/ui';

/* ============================================================================
   MEASUREMENT, WITH CONSENT — the owner's decision of 4 November 2026.

   The site had no analytics and no banner, and said so on its Privacy page.
   It now measures visits with Google Analytics 4, and only after the reader
   says yes. This file is the whole mechanism:

     NOTHING LOADS BEFORE A YES. The GA script is not in the page until the
     reader accepts; a decline is remembered the same way an acceptance is,
     so the banner is not asked twice. Both live in localStorage under
     `recalibre.consent`, which is the reader's own browser and leaves with
     it. The footer's "Cookie settings" reopens the banner, so a decision
     can be changed.

     NOTHING EXISTS WITHOUT AN ID. `NEXT_PUBLIC_GA_ID` is set in the host's
     production context only; without it this component renders nothing at
     all — no banner, no script — so a preview or a local build never
     reports into the live property, and the strict Content Security Policy
     is only opened to Google's hosts when the ID is present (next.config.ts).

     CONSENT MODE v2. On a yes the consent state is declared before the tag
     loads: analytics storage granted, every advertising signal denied. The
     site runs no advertising, so those three are never granted.

   The banner is not a modal: it does not trap focus, it does not cover the
   skip link, and the page stays usable under it. Both buttons are 44px.
   ========================================================================= */

const KEY = 'recalibre.consent';
const OPEN_EVENT = 'recalibre:consent';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type Decision = 'granted' | 'denied' | null;

function readDecision(): Decision {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

/** Fired by the footer's "Cookie settings". */
export function openConsent() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function hasAnalytics(): boolean {
  return Boolean(GA_ID);
}

const noop = () => () => {};
function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

/* The decision is an external store — the browser's storage — and is read
   as one, so a change made in another tab is seen here too. */
const listeners = new Set<() => void>();
function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) fn();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener('storage', onStorage);
  };
}
function writeDecision(d: Exclude<Decision, null>) {
  try {
    window.localStorage.setItem(KEY, d);
  } catch {
    // A browser that refuses storage still gets its answer honoured for
    // this page; it will be asked again next time, which is the honest
    // outcome when the answer cannot be kept.
  }
  for (const fn of listeners) fn();
}

function declareConsent() {
  window.dataLayer = window.dataLayer || [];
  // gtag reads `arguments` objects off the data layer, not arrays, so the
  // declaration is pushed the way gtag itself pushes it.
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  }
  // @ts-expect-error gtag's own calling convention
  gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

export default function Consent({ privacyHref }: { privacyHref: string }) {
  const locale = useLocale();
  const t = ui(locale).consent;
  const hydrated = useHydrated();
  const decision = useSyncExternalStore(subscribe, readDecision, () => null);
  // "Cookie settings" in the footer reopens the banner after a decision.
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const onOpen = () => setReopened(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (decision === 'granted') declareConsent();
  }, [decision]);

  if (!GA_ID || !hydrated) return null;

  const open = decision === null || reopened;
  const decide = (d: Exclude<Decision, null>) => {
    writeDecision(d);
    setReopened(false);
  };

  return (
    <>
      {decision === 'granted' ? <GoogleAnalytics gaId={GA_ID} /> : null}
      {open ? (
        <section
          aria-label={t.title}
          className="consent fixed bottom-[20px] right-[20px] z-[70] w-[min(420px,calc(100vw-40px))] rounded-[24px] border border-rule bg-raised p-[24px] mobile:bottom-[12px] mobile:right-[12px]"
        >
          <p className="t-card text-ink">{t.title}</p>
          <p className="t-caption mt-[12px] text-ink-2">
            {t.body}{' '}
            <a href={privacyHref} className="text-ink underline decoration-rule underline-offset-2">
              {t.privacy}
            </a>
          </p>
          <div className="mt-[20px] flex flex-wrap items-center gap-[12px]">
            <Btn onClick={() => decide('granted')} label={t.accept} />
            <button
              type="button"
              onClick={() => decide('denied')}
              className="tap-44 t-btn hover-read rounded-full border border-rule px-[18px] text-ink-2"
            >
              {t.decline}
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
