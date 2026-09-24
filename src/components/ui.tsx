import Link from 'next/link';
import type { ReactNode } from 'react';

/* ============================================================================
   THE TEMPLATE'S PRIMITIVES.

   Nine small parts account for nearly every repeated object on the reference.
   They are built once here, measured, and reused — so a button is the same
   40px object on ten pages and a mono label is the same 10px object on forty.
   ========================================================================= */

/** The three-square mark the reference uses everywhere an arrow would go. */
export function Glyph({ big = false, className = '' }: { big?: boolean; className?: string }) {
  return (
    <span className={`glyph ${big ? 'glyph-lg' : ''} ${className}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

/**
 * The primary button: a white face and a lime tip, 2px apart, 40px tall,
 * 8px radius. On hover the two swap colour.
 */
export function Btn({
  href,
  label,
  className = '',
  onClick,
  type,
}: {
  href?: string;
  label: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  const inner = (
    <>
      <span className="btn-face t-btn">{label}</span>
      <span className="btn-tip">
        <Glyph big />
      </span>
    </>
  );
  if (href) {
    // A same-page jump (#…) is a plain anchor too — see MonoLink.
    const external =
      href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('#');
    const cls = `btn focus-ring ${className}`;
    return external ? (
      <a href={href} className={cls}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type ?? 'button'} onClick={onClick} className={`btn focus-ring ${className}`}>
      {inner}
    </button>
  );
}

/**
 * The secondary action: two mono words, the first dimmed and the second
 * lit, followed by a 24px circle that fills lime on hover.
 */
export function MonoLink({
  href,
  lead,
  label,
  className = '',
  onClick,
}: {
  href: string;
  lead?: string;
  label: string;
  className?: string;
  /** For a link inside something that must close when it is used — the menu. */
  onClick?: () => void;
}) {
  /* A SAME-PAGE JUMP GOES THROUGH A PLAIN ANCHOR, NOT THE ROUTER. The router
     scrolls to a hash once; with the address already ending in it, the next
     click on the same link does nothing — the footer's BACK TO THE FORM
     worked exactly one time. The browser's own fragment navigation scrolls
     on every click and stops below the bar (globals.css, scroll-padding). */
  const external =
    href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('#');
  const body = (
    <>
      <span className="flex items-center gap-[6px]">
        {lead ? <span className="t-mono text-ink-2">{lead}</span> : null}
        <span className="t-mono text-ink">{label}</span>
      </span>
      <span className="dot-btn">
        <Glyph />
      </span>
    </>
  );
  const cls = `focus-ring tap-44 inline-flex items-center gap-[9px] ${className}`;
  return external ? (
    <a href={href} onClick={onClick} className={cls}>
      {body}
    </a>
  ) : (
    <Link href={href} onClick={onClick} className={cls}>
      {body}
    </Link>
  );
}

/** A bordered pill. Used for tags on a card and for links in the footer. */
export function Pill({ children, href }: { children: ReactNode; href?: string }) {
  if (href) {
    // The pill stays 24px, as measured. The link around it is 44px tall, so
    // the hit area clears the minimum without changing the drawing.
    return (
      <Link href={href} className="tap-44 focus-ring">
        <span className="pill t-tag text-ink">{children}</span>
      </Link>
    );
  }
  return <span className="pill t-tag text-ink-2">{children}</span>;
}

/** A filled tag. Used under each capability chapter. */
export function Chip({ children }: { children: ReactNode }) {
  return <span className="chip t-tag text-ink-2">{children}</span>;
}

/**
 * The section label row: a hairline across the section with a tick at the
 * centre, and a mono label with the three-square mark sitting under it.
 */
export function LabelRow({ label, right }: { label: string; right?: string }) {
  return (
    <div className="rule-row flex w-full items-center justify-between pt-[15px]">
      <span className="flex items-center gap-[7px]">
        <Glyph className="[&>i]:bg-white" />
        <span className="t-mono text-ink-2">{label}</span>
      </span>
      {right ? <span className="t-mono text-ink-3 mobile:hidden">{right}</span> : null}
    </div>
  );
}

/** A short vertical hairline dropped under a centred heading. */
export function Tick() {
  return <span className="tick" aria-hidden="true" />;
}

/**
 * The barcode plate in the hero rail and on the media panels. Drawn from a
 * fixed sequence so it is identical on the server and the client — a random
 * one would differ between the two renders and flash on hydration.
 */
const BARS = [3, 1, 1, 2, 1, 3, 1, 1, 1, 2, 2, 1, 3, 1, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 1, 2, 1, 3];
export function Barcode({ vertical = false, className = '' }: { vertical?: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex opacity-50 ${vertical ? 'flex-col gap-[2px]' : 'gap-[2px]'} ${className}`}
    >
      {BARS.map((n, i) => (
        <i
          key={i}
          className="block bg-white"
          style={vertical ? { height: `${n}px`, width: '100%' } : { width: `${n}px`, height: '100%' }}
        />
      ))}
    </span>
  );
}

/**
 * The dotted field. 17 columns of 1px dots at a 19px pitch, exactly as
 * measured — it reads as a faint technical grid rather than a texture.
 */
export function DotGrid({ cols = 17, rows = 8, className = '' }: { cols?: number; rows?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1px)`,
        gap: '19px',
      }}
    >
      {Array.from({ length: cols * rows }, (_, i) => (
        <i key={i} className="block h-px w-px rounded-full bg-white/70" />
      ))}
    </span>
  );
}

/** The three window dots at the top right of the hero panel. */
export function Dots() {
  return (
    <span aria-hidden="true" className="flex items-center gap-[5px]">
      <i className="block size-[8px] rounded-full bg-white/40" />
      <i className="block size-[8px] rounded-full bg-white/40" />
      <i className="block size-[8px] rounded-full bg-white" />
    </span>
  );
}

/**
 * A run of vertical bars, some lit. The reference uses it as a level meter
 * beside a figure; here it is decoration and carries no number.
 */
export function Bars({ total = 8, lit = 5, className = '' }: { total?: number; lit?: number; className?: string }) {
  return (
    <span aria-hidden="true" className={`flex items-end gap-[4px] ${className}`}>
      {Array.from({ length: total }, (_, i) => (
        <i
          key={i}
          className={`block w-[2px] rounded-full ${i < lit ? 'bg-lime' : 'bg-white/10'}`}
          style={{ height: '100%' }}
        />
      ))}
    </span>
  );
}

/** Text turned on its side for the hero and contact rails. */
export function RailText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`t-mono-9 whitespace-nowrap text-ink-2 ${className}`}
      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
    >
      {children}
    </span>
  );
}
