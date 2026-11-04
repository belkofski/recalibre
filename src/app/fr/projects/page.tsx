import type { Metadata } from 'next';
import ProjectsView, { projectsMeta } from '@/views/ProjectsView';

export const metadata: Metadata = projectsMeta('fr');

export default function Page() {
  return <ProjectsView locale="fr" />;
}
