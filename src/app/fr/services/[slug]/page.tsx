import type { Metadata } from 'next';
import ServiceCatalogView, { catalogMeta, catalogParams } from '@/views/ServiceView';

/* ONLY THE SLUGS IN THE CATALOGUE: the two families and the five services
   (content/services.ts). Any other address under /services/ gets the
   site's own 404 from the server. */
export const dynamicParams = false;

export function generateStaticParams() {
  return catalogParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return catalogMeta(slug, 'fr');
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServiceCatalogView slug={slug} locale="fr" />;
}
