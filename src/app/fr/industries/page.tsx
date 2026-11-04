import type { Metadata } from 'next';
import IndustriesView, { industriesMeta } from '@/views/IndustriesView';

export const metadata: Metadata = industriesMeta('fr');

export default function Page() {
  return <IndustriesView locale="fr" />;
}
