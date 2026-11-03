import type { Metadata } from 'next';
import ProjectsView, { projectsMeta } from '@/views/ProjectsView';

export const metadata: Metadata = projectsMeta('en');

export default function Page() {
  return <ProjectsView locale="en" />;
}
