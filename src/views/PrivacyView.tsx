import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import type { Locale } from '@/lib/i18n';
import LegalPage from '@/components/LegalPage';
import { PRIVACY } from '@/content/legal';

export function privacyMeta(locale: Locale): Metadata {
  return pageMeta({
  locale,
  title: 'Privacy Policy',
  description:
    'What this website collects, why, and what happens to it. One form, visit counting only with your consent, no advertising network.',
  path: '/privacy',
  image: '/img/og-home-b.jpg',
  imageAlt: 'A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left.',
  });
}

export default function PrivacyView({ locale }: { locale: Locale }) {
  void locale; // the French work package picks the French document here
  return <LegalPage title="Privacy Policy." doc={PRIVACY} />;
}
