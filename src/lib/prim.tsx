import SplitText from './SplitText';

export { default as SplitText } from './SplitText';

/** Primitives. Every number is measured — the source is in the comment. */

const TONE = {
  ink: 'bg-[rgb(8,16,20)]',
  white: 'bg-[rgb(255,255,255)]',
} as const;
type Tone = keyof typeof TONE;

/**
 * The arrow is TWO nodes, not one node translated. Measured on every instance:
 * a 20×20 square at position:relative t0 l0, plus a second 20×20 square at
 * position:absolute, inside a 20×20 overflow-clip window.
 *
 * Measured rest / hover offsets on the absolute node (sampled frame by frame):
 *   small (button)  rest top 24px left -24px  →  hover top -24px left 24px
 *   large (card)    rest top 56px left -24px  →  hover top -24px left 56px
 * Both are STEP changes: the sampler caught no intermediate frame, so there is
 * no interpolation on the offsets. Only the button background interpolates
 * (measured 289ms, decelerating — see .btn-hover-light in globals.css).
 *
 * Tones measured: hero button both rgb(8,16,20); card-on-image absolute ink and
 * resting white; card-on-light both rgb(8,16,20).
 */
export function Arrow({
  offset,
  resting = 'ink',
  incoming = 'ink',
  incomingFirst = false,
}: {
  offset: 24 | 56;
  resting?: Tone;
  incoming?: Tone;
  incomingFirst?: boolean;
}) {
  const a = <div className={`aspect-square w-[20px] shrink-0 ${TONE[resting]}`} />;
  // rest (top: offset, left: -24px) → hover (top: -24px, left: offset)
  const b = (
    <div
      className={`arrow-incoming absolute z-[1] aspect-square w-[20px] shrink-0 ${TONE[incoming]}`}
      style={{ ['--rest-top' as string]: `${offset}px`, ['--hover-left' as string]: `${offset}px` }}
    />
  );
  return (
    <div className="relative flex w-[20px] shrink-0 items-center justify-center gap-[10px] overflow-clip">
      {incomingFirst ? (
        <>
          {b}
          {a}
        </>
      ) : (
        <>
          {a}
          {b}
        </>
      )}
    </div>
  );
}

/** Eyebrow: 14px/19.6px w600 ls 0.84px, text-transform uppercase. 8 nodes. */
export function Eyebrow({
  children,
  tone = 'ink',
}: {
  children: React.ReactNode;
  tone?: 'ink' | 'white';
}) {
  return (
    <div className="flex w-full shrink-0 flex-col justify-start">
      <p
        className={`text-[14px] leading-[19.6px] font-semibold tracking-[0.84px] whitespace-pre-wrap uppercase ${
          tone === 'ink' ? 'text-[rgb(8,16,20)]' : 'text-[rgb(255,255,255)]'
        }`}
      >
        {children}
      </p>
    </div>
  );
}

/** A divider. Measured as a 1px-high background div — the page has 0 borders. */
export function Rule({ tone, className = '' }: { tone: 'light' | 'dark'; className?: string }) {
  return (
    <div
      className={`h-px w-full shrink-0 overflow-clip ${
        tone === 'light' ? 'bg-[rgba(255,255,255,0.12)]' : 'bg-[rgba(8,16,20,0.12)]'
      } ${className}`}
    />
  );
}

/** h2: 52px/57.2px w400 ls -3.12px at 1200px+. 48 word spans across the page. */
export function H2({ children, tone = 'ink' }: { children: string; tone?: 'ink' | 'white' }) {
  return (
    <h2
      className={`t-h2 whitespace-pre-wrap ${
        tone === 'ink' ? 'text-[rgb(8,16,20)]' : 'text-[rgb(255,255,255)]'
      }`}
    >
      <SplitText>{children}</SplitText>
    </h2>
  );
}

/**
 * A paragraph whose lines were broken by hand.
 *
 * The copy in blocks-content.ts is not prose — it is lines cut to the measured
 * ink width of the box each one sits in, and those boxes are `white-space: pre`
 * so the break IS the layout. Rendering each line as its own <p>, which is what
 * the page did, produced two problems: a screen reader announced one sentence
 * as several, and on a phone each line forced a box wider than the screen.
 *
 * This is one paragraph made of `.hand-line` spans. At desktop width each span
 * is a block and the hand break is honoured exactly as measured. Below 810px
 * they become inline, rejoin with a space, and wrap to the phone. See the
 * `.hand-line` note in globals.css.
 */
export function Lines({
  lines,
  className = '',
}: {
  lines: readonly string[];
  className?: string;
}) {
  return (
    <p className={className}>
      {lines.map((line, i) => (
        <span key={i} className="hand-line">
          {line}
        </span>
      ))}
    </p>
  );
}

/**
 * The same device for a heading, where the two lines are the design rather
 * than a wrapped sentence.
 */
export function HeadLines({
  lines,
  className = '',
  id,
}: {
  lines: readonly string[];
  className?: string;
  id?: string;
}) {
  return (
    <h2 id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="hand-line">
          {line}
        </span>
      ))}
    </h2>
  );
}
