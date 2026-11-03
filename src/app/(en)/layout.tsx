import type { Metadata, Viewport } from 'next';
import RootShell from '@/components/RootShell';
import { ROOT_VIEWPORT, rootMetadata } from '@/lib/seo';

/* The English root layout. One of two (see components/RootShell.tsx): it
   declares the document's language and nothing else, and everything the two
   languages share is in the shell. Metadata is not inherited between
   sibling root layouts, so the defaults are declared here as well, from the
   one function in lib/seo.ts. */
export const metadata: Metadata = rootMetadata('en');
export const viewport: Viewport = ROOT_VIEWPORT;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>;
}
