import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import LegalPage from '@/components/LegalPage';
import { PRIVACY } from '@/content/legal';

export const metadata: Metadata = pageMeta({
  title: 'Privacy Policy',
  description:
    'What this website collects, why, and what happens to it. No analytics, no advertising network, no tracking cookie.',
  path: '/privacy',
  image: '/img/og-home.jpg',
  imageAlt: 'The Recalibre showroom: a deep blue wall, a single chair and a wide screen, lit from the left.',
});

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy." doc={PRIVACY} />;
}
