import type { Metadata } from 'next';
import PrivacyView, { privacyMeta } from '@/views/PrivacyView';

export const metadata: Metadata = privacyMeta('en');

export default function Page() {
  return <PrivacyView locale="en" />;
}
