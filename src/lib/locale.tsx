'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { DEFAULT_LOCALE, localeFromPath, type Locale } from '@/lib/i18n';
import { useHydrated } from '@/lib/motion';

/* The page's language, for the client components that cannot take it as a
   prop from a server view: the bar, the footer, the form. Set once per root
   layout (components/RootShell.tsx). A server component reads `locale` from
   its props instead; this context is never the source of truth, only the
   carrier.

   ONE PAGE HAS NO ROOT LAYOUT TO TELL IT: the 404 (app/global-not-found.tsx)
   is a single document for both languages, rendered without a request. For
   it the provider follows the address instead, once the page is alive, and
   sets <html lang> to match — the server's copy is English, the reader
   under /fr gets French a frame later. */
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({
  locale,
  detect = false,
  children,
}: {
  locale: Locale;
  detect?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const value = detect && hydrated ? localeFromPath(pathname ?? '/') : locale;
  useEffect(() => {
    if (detect) document.documentElement.lang = value;
  }, [detect, value]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}
