import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import type { Locale } from '@/lib/i18n';
import LegalPage from '@/components/LegalPage';
import { legal, tr } from '@/content';

export function termsMeta(locale: Locale): Metadata {
  const t = tr(locale);
  return pageMeta({
  locale,
  title: t('Terms of Service'),
  description: t(
    'Terms covering the use of this website. An engagement is governed by a separate written agreement.'),
  path: '/terms',
  image: '/img/og-home-b.jpg',
  imageAlt: t('A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left.'),
  });
}

export default function TermsView({ locale }: { locale: Locale }) {
  return <LegalPage title={tr(locale)('Terms of Service.')} doc={legal(locale).TERMS} locale={locale} path="/terms" />;
}
