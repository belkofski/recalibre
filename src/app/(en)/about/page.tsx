import type { Metadata } from 'next';
import AboutView, { aboutMeta } from '@/views/AboutView';

export const metadata: Metadata = aboutMeta('en');

export default function Page() {
  return <AboutView locale="en" />;
}
