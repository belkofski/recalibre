import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { TERMS } from '@/content/legal';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms covering the use of this website. An engagement is governed by a separate written agreement.',
};

export default function TermsPage() {
  return <LegalPage title="Terms of service." doc={TERMS} />;
}
