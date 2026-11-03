import type { Metadata } from 'next';
import ContactView, { contactMeta } from '@/views/ContactView';

export const metadata: Metadata = contactMeta('fr');

export default function Page() {
  return <ContactView locale="fr" />;
}
