import type { Metadata } from 'next';
import ServicesView, { servicesMeta } from '@/views/ServicesView';

export const metadata: Metadata = servicesMeta('fr');

export default function Page() {
  return <ServicesView locale="fr" />;
}
