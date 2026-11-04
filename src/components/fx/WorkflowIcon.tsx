import type { WfIcon } from '@/lib/workflow';

/* The workflow tiles' glyphs: one stroke weight, one box, drawn inline in
   the text colour. The '///' is the firm's own mark (components/ui.tsx),
   used for the agent tile. */
const PATHS: Record<WfIcon, React.ReactNode> = {
  mail: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 8l9 6 9-6" />
    </>
  ),
  document: (
    <>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5M10 13h6M10 17h6" />
    </>
  ),
  agent: <path d="M6 5h4L7 19H3zM13 5h4l-3 14h-4zM20 5h4l-3 14h-4z" fill="currentColor" stroke="none" transform="translate(-1.5 0) scale(0.92)" />,
  table: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M9 10v9M15 10v9" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1-4 4-6 7-6s6 2 7 6" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4l9 16H3z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  offline: (
    <>
      <path d="M7 18a4 4 0 0 1 .5-8A5.5 5.5 0 0 1 18 11a3.5 3.5 0 0 1-.5 7H7z" />
      <path d="M4 4l16 16" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8 6h6a4 4 0 0 1 0 8h-4a4 4 0 0 0 0 8h6" />
    </>
  ),
  photo: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 16l5-5 4 4 3-3 6 6" />
      <circle cx="16" cy="9" r="1.5" />
    </>
  ),
};

export default function WorkflowIcon({ icon, className = '' }: { icon: WfIcon; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`block size-full ${className}`}
    >
      {PATHS[icon]}
    </svg>
  );
}
