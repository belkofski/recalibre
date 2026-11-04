import { Geist } from 'next/font/google';

/* Geist, one face for the whole site — the owner's decision of 27 September
   2026, confirmed 4 November 2026 (the reference pairs it with Geist Mono
   for its small labels; those labels keep their capitals and tracking and
   are set in Geist too, `--font-mono` in globals.css points here). Nothing
   else is loaded.

   Declared here, at module scope, because `next/font` must be called once
   at the top level of a module and the site now has two root layouts (one
   per language, see components/RootShell.tsx) that share it. */
export const geist = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-geist',
  display: 'swap',
});
