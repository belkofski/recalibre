import type { Metadata } from 'next';
import ContactView, { contactMeta, contactMode, type ContactSearch } from '@/views/ContactView';

export const metadata: Metadata = contactMeta('en');

/* The address picks the form (`?type=quotation&service=…`); see
   views/ContactView.tsx. */
export default async function Page({ searchParams }: { searchParams: Promise<ContactSearch> }) {
  const { mode, service } = contactMode(await searchParams);
  return <ContactView locale="en" mode={mode} service={service} />;
}
