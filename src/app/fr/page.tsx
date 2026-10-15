import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/content/site';

export const metadata: Metadata = {
  title: { absolute: 'Recalibre — Stratégie, design et technologie' },
  description: 'Recalibre accompagne les organisations dans la modernisation de leurs opérations, expériences clients et infrastructures numériques.',
  alternates: { canonical: 'https://recalibre.cloud/fr', languages: { en: 'https://recalibre.cloud/', fr: 'https://recalibre.cloud/fr' } },
  openGraph: { title: 'Recalibre — Stratégie, design et technologie', description: 'Une capacité intégrée pour transformer les opérations, les expériences et les fondations numériques.' },
};

const pillars = [
  ['Stratégie', 'Clarifier les priorités, les décisions et la trajectoire.'],
  ['Design', 'Concevoir des expériences simples, utiles et durables.'],
  ['Technologie', 'Construire les systèmes qui rendent le changement réel.'],
];

export default function FrenchHome() {
  return (
    <div lang="fr" className="pad-x shell">
      <section className="flex min-h-[min(760px,calc(100svh-56px))] flex-col justify-center py-[clamp(96px,14vw,180px)]">
        <p className="t-mono-11 mb-8 text-accent-bright">RECALIBRE · ALGÉRIE</p>
        <h1 className="t-display max-w-[920px] text-balance text-ink">Nous réalignons la stratégie, le design et votre fondation numérique.</h1>
        <p className="t-lede mt-10 max-w-[620px] text-ink-2">Une capacité intégrée pour les organisations qui veulent avancer avec plus de clarté, de cohérence et de maîtrise.</p>
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <Link href="/contact" className="pill t-mono text-ink">DÉMARRER UNE CALIBRATION</Link>
          <Link href="/" className="t-mono-11 text-accent-bright underline-offset-4 hover:underline" lang="en">Voir la version anglaise</Link>
        </div>
      </section>
      <section className="grid gap-[2px] pb-[clamp(96px,12vw,160px)] md:grid-cols-3" aria-labelledby="expertise-fr">
        <h2 id="expertise-fr" className="sr-only">Notre expertise</h2>
        {pillars.map(([title, text], index) => (
          <article key={title} className="card-24 flex min-h-[240px] flex-col justify-between p-[clamp(24px,4vw,40px)] transition-transform duration-300 hover:-translate-y-1">
            <span className="t-mono-11 text-accent-bright">0{index + 1}</span>
            <div><h3 className="t-card text-ink">{title}</h3><p className="t-body mt-4 max-w-[28ch] text-ink-2">{text}</p></div>
          </article>
        ))}
      </section>
      <section className="border-t border-rule py-[clamp(80px,12vw,140px)]">
        <p className="t-mono-11 text-ink-3">PARLONS DE VOTRE PROCHAIN MOUVEMENT</p>
        <h2 className="t-display mt-8 max-w-[760px] text-ink">Votre prochaine étape commence par une bonne question.</h2>
        <a href={`mailto:${SITE.email}`} className="t-lede mt-10 inline-block text-accent-bright underline-offset-4 hover:underline">{SITE.email}</a>
      </section>
    </div>
  );
}

export function generateStaticParams() { return []; }
