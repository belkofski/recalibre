import type { Metadata } from 'next';
import InsightsView, { insightsMeta } from '@/views/InsightsView';

export const metadata: Metadata = insightsMeta('en');

export default function Page() {
  return <InsightsView locale="en" />;
}
