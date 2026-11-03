import type { Metadata } from 'next';
import ProjectView, { projectMeta, projectParams } from '@/views/ProjectView';

/* ONLY THE SLUGS IN THE LIST. Without this, an address like /projects/nope
   was built on request, and what the server sent for it was an empty shell
   that filled in with the 404 card only once scripts ran. A slug that is not
   in the list is refused at the door, and the reader gets the same full
   "page not found" page as any other wrong address. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projectParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return projectMeta(slug, 'fr');
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectView slug={slug} locale="fr" />;
}
