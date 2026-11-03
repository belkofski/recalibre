import type { Metadata } from 'next';
import ArticleView, { articleMeta, articleParams } from '@/views/ArticleView';

/* ONLY THE SLUGS IN THE LIST. Without this, an address like /insights/nope
   was built on request, and what the server sent for it was an empty shell
   that filled in with the 404 card only once scripts ran. A slug that is not
   in the list is refused at the door, and the reader gets the same full
   "page not found" page as any other wrong address. */
export const dynamicParams = false;

export function generateStaticParams() {
  return articleParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return articleMeta(slug, 'fr');
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleView slug={slug} locale="fr" />;
}
