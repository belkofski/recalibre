import { Rise } from '@/lib/motion';

/**
 * The opener every inner route on the reference shares: a mono eyebrow, the
 * title at display size with its lines rising, and a lede. Measured padding
 * is the section rhythm plus the 51px the fixed bar occupies.
 */
export default function PageHead({
  eyebrow,
  lines,
  lede,
  id = 'page-head',
  children,
}: {
  eyebrow: string;
  lines: readonly string[];
  lede?: string;
  id?: string;
  children?: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="w-full overflow-clip border-b border-rule bg-raised grain">
      <div className="shell pad-x flex w-full flex-col gap-[20px] pb-[56px] pt-[130px] mobile:pb-[36px] mobile:pt-[96px]">
        <p className="t-mono text-ink-3">{eyebrow}</p>
        <Rise as="h1" id={id} lines={lines} className="t-display max-w-[18ch] text-ink" />
        {lede ? <p className="t-body-lg max-w-[62ch] text-ink-2">{lede}</p> : null}
        {children}
      </div>
    </section>
  );
}
