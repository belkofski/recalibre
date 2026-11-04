'use client';

import { useEffect, useState } from 'react';
import { useHydrated } from '@/lib/motion';
import { useLocale } from '@/lib/locale';
import { ui } from '@/content/ui';

/* THE TIME WHERE THE FIRM IS. The footer prints the place on the server; this
   adds the hour there once the page is alive, so the server's markup and the
   first client render agree (a clock rendered on the server is always wrong
   by the time it is read, and React would flag the mismatch). Algiers time,
   whatever the reader's own clock says; redrawn each minute. */
const ZONE = 'Africa/Algiers';

function now(locale: string): string {
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: ZONE }).format(
    new Date(),
  );
}

export default function LocalTime() {
  const locale = useLocale();
  const hydrated = useHydrated();
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(now(locale));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [locale]);
  if (!hydrated || !time) return null;
  return (
    <>
      {' · '}
      <time dateTime={new Date().toISOString()} title={ui(locale).footer.localTime}>
        {time}
      </time>
    </>
  );
}
