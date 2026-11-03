import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import type { Locale } from '@/lib/i18n';
import LegalPage from '@/components/LegalPage';
import { TERMS } from '@/content/legal';

export function termsMeta(locale: Locale): Metadata {
  return pageMeta({
  locale,
  title: 'Terms of Service',
  description:
    'Terms covering the use of this website. An engagement is governed by a separate written agreement.',
  path: '/terms',
  image: '/img/og-home-b.jpg',
  imageAlt: 'A rendered room: a deep blue wall, a single chair and a wide screen showing the OPS overview, lit from the left.',
  });
}

export default function TermsView({ locale }: { locale: Locale }) {
  void locale; // the French work package picks the French document here
  return <LegalPage title="Terms of Service." doc={TERMS} />;
}
