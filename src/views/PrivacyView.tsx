import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import type { Locale } from '@/lib/i18n';
import LegalPage from '@/components/LegalPage';
import { legal, tr } from '@/content';

export function privacyMeta(locale: Locale): Metadata {
  const t = tr(locale);
  return pageMeta({
  locale,
  title: t('Privacy Policy'),
  description: t(
    'What this website collects, why, and what happens to it. One form, visit counting only with your consent, no advertising network.'),
  path: '/privacy',
  image: '/img/og-home-b.jpg',
  imageAlt: t('A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left.'),
  });
}

export default function PrivacyView({ locale }: { locale: Locale }) {
  return <LegalPage title={tr(locale)('Privacy Policy.')} doc={legal(locale).PRIVACY} locale={locale} />;
}
