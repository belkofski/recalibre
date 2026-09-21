import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { PRIVACY } from '@/content/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'What this website collects, why, and what happens to it. No analytics, no advertising network, no tracking cookie.',
};

export default function PrivacyPage() {
  return <LegalPage title="Privacy policy." doc={PRIVACY} />;
}
