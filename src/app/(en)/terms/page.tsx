import type { Metadata } from 'next';
import TermsView, { termsMeta } from '@/views/TermsView';

export const metadata: Metadata = termsMeta('en');

export default function Page() {
  return <TermsView locale="en" />;
}
