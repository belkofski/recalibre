import type { Metadata } from 'next';
import AboutView, { aboutMeta } from '@/views/AboutView';

export const metadata: Metadata = aboutMeta('fr');

export default function Page() {
  return <AboutView locale="fr" />;
}
