import type { Metadata } from 'next';
import InsightsView, { insightsMeta } from '@/views/InsightsView';

export const metadata: Metadata = insightsMeta('fr');

export default function Page() {
  return <InsightsView locale="fr" />;
}
