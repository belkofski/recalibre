import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import LegalPage from '@/components/LegalPage';
import { TERMS } from '@/content/legal';

export const metadata: Metadata = pageMeta({
  title: 'Terms of Service',
  description:
    'Terms covering the use of this website. An engagement is governed by a separate written agreement.',
  path: '/terms',
  image: '/img/og-home-nomark.jpg',
  imageAlt: 'A rendered room: a deep blue wall, a single chair and a wide screen, lit from the left.',
});

export default function TermsPage() {
  return <LegalPage title="Terms of Service." doc={TERMS} />;
}
