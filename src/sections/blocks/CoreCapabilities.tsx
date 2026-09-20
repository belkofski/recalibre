import { BLOCKS } from '@/lib/blocks-content';

/**
 * BLOCK A3 — "Three core layers." (reference 3.webp, 2000×964, scale 0.72)
 * Site A, dark variant. Background rgb(26,26,26), accent rgb(35,83,247).
 *
 *   section      964 tall                             → 694.08
 *   eyebrow      ink y17 x181, var(--color-on-dark-2)       → 12.24 · 130.32  mono
 *   chips        y158-186 x179-299, blue fill         → 113.76 · 128.88 · h20.16
 *   item 1       ink y205 x179, row to x936           → 147.6 · 128.88 · w 673.92
 *   item body    ink y258, pitch 27                   → 185.76 · line-height 19.44
 *   item 2       ink y357, var(--color-on-dark-3)              → 257.04
 *   item 3       ink y441, pitch 84                   → 317.52 · pitch 60.48
 *   headline     ink y664 / y742, pitch 78            → 478.08 · line-height 56.16
 *   panel rule   x1000 vertical, y24 / y910 horizontal→ 720 · 17.28 / 655.2
 *   panel A box  x1070-1265 y190-510                  → 770.4 · 136.8 · 140.4 × 230.4
 *   panel B box  x1565-1740 y190-500                  → 1126.8 · 136.8 · 126 × 223.2
 *   centre node  x1350-1470 y290-410                  → 972 · 208.8 · 86.4 × 86.4
 *   panel C      x1225-1595 y605-755                  → 882 · 435.6 · 266.4 × 108
 *
 * The right-hand diagram is a bespoke illustration. Its BOXES, RULES and
 * CONNECTORS are placed at the measured coordinates; the dotted field and the
 * per-row glyphs are reconstructed, not traced.
 */
export default function CoreCapabilities() {
  const B = BLOCKS.coreCapabilities;
  const boxRule = 'border border-rule-on-dark';
  return (
    <section className="relative flex h-[694.08px] w-full shrink-0 justify-center overflow-clip bg-ink-2">
      <div className="relative w-[1440px]">
        {/* eyebrow + the rule that runs from it to the panel */}
        <p className="absolute top-[8px] left-[130.32px] font-mono text-[11px] leading-[16px] tracking-[0.5px] whitespace-pre text-on-dark-2">
          {B.eyebrow}
        </p>
        <div className="absolute top-[17.28px] right-[133px] left-[420px] h-px bg-rule-on-dark" />

        {/* LEFT COLUMN — chips, three accordion rows, display headline */}
        <div className="absolute top-[113.76px] left-[128.88px] flex gap-[5.76px]">
          {B.chips.map((c, i) => (
            <span
              key={i}
              className="bg-accent px-[3.6px] py-[1.44px] font-mono text-[12px] leading-[17.28px] whitespace-pre text-on-dark uppercase"
            >
              {c}
            </span>
          ))}
        </div>

        {B.items.map((item, i) => {
          const top = [141, 250.5, 311][i];
          const active = i === 0;
          return (
            <div
              key={i}
              className="group absolute left-[128.88px] w-[673.92px] cursor-pointer"
              style={{ top: `${top}px` }}
            >
              <div className="flex items-center gap-[10.8px]">
                {active && (
                  <span className="block h-[7.2px] w-[7.2px] shrink-0 bg-accent" />
                )}
                <span
                  className={`text-[24px] leading-[31.68px] whitespace-pre transition-colors duration-[260ms] ${
                    active ? 'text-on-dark' : 'text-on-dark-3 group-hover:text-on-dark-2'
                  }`}
                >
                  {item.title}
                </span>
                <span className="mx-[7.2px] min-w-0 flex-1 border-b border-dotted border-rule-strong" />
                <span
                  className={`font-mono text-[12px] leading-[16px] whitespace-pre ${
                    active ? 'text-on-dark' : 'text-on-dark-3'
                  }`}
                >
                  {item.n}
                </span>
              </div>
              {item.body.length > 0 && (
                <div className="mt-[14px]">
                  {item.body.map((line, j) => (
                    <p
                      key={j}
                      className="text-[14px] leading-[19.44px] whitespace-pre text-on-dark-2"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <h2 className="absolute top-[466px] left-[128.88px] text-[45px] leading-[56.16px] font-normal tracking-[-1.4px] text-on-dark">
          <span className="block whitespace-pre">{B.headline.l1}</span>
          <span className="block whitespace-pre">{B.headline.l2}</span>
        </h2>

        {/* RIGHT PANEL — rule at x720, field from y17.28 to y655.2 */}
        <div className="absolute top-0 bottom-0 left-[720px] w-px bg-rule-on-dark" />
        <div
          className="absolute top-[17.28px] left-[720px] overflow-clip"
          style={{
            width: '587px',
            height: '637.92px',
            backgroundImage: 'radial-gradient(var(--color-rule-on-dark) 1px, transparent 1px)',
            backgroundSize: '14.4px 14.4px',
          }}
        >
          {/* panel A */}
          <div
            className={`absolute ${boxRule} px-[14.4px] pt-[14.4px]`}
            style={{ left: '50.4px', top: '119.52px', width: '140.4px', height: '230.4px' }}
          >
            <p className="font-mono text-[10px] leading-[14px] tracking-[0.5px] whitespace-pre text-on-dark-2 uppercase">
              {B.diagram.leftTitle}
            </p>
            {B.diagram.leftRows.map((r, i) => (
              <div
                key={i}
                className="mt-[10.8px] flex items-center gap-[7.2px] border-b border-rule-on-dark pb-[7.2px]"
              >
                <span className="block h-[8.64px] w-[8.64px] shrink-0 border border-rule-bright" />
                <span className="font-mono text-[10px] leading-[14px] whitespace-pre text-text-3">
                  {r}
                </span>
              </div>
            ))}
          </div>

          {/* panel B */}
          <div
            className={`absolute ${boxRule} px-[14.4px] pt-[14.4px]`}
            style={{ left: '406.8px', top: '119.52px', width: '126px', height: '223.2px' }}
          >
            <p className="font-mono text-[10px] leading-[14px] tracking-[0.5px] whitespace-pre text-on-dark-2 uppercase">
              {B.diagram.rightTitle}
            </p>
            {B.diagram.rightRows.map((r, i) => (
              <div
                key={i}
                className="mt-[10.8px] flex items-center gap-[7.2px] border-b border-rule-on-dark pb-[7.2px]"
              >
                <span className="block h-[8.64px] w-[8.64px] shrink-0 rounded-full border border-rule-bright" />
                <span className="font-mono text-[10px] leading-[14px] whitespace-pre text-text-3">
                  {r}
                </span>
              </div>
            ))}
          </div>

          {/* connectors into the centre node */}
          <div className="absolute top-[234px] left-[191px] h-px w-[61px] bg-rule-on-dark" />
          <div className="absolute top-[234px] left-[338px] h-px w-[69px] bg-rule-on-dark" />

          {/* centre node — 86.4 square, black, white asterisk */}
          <div
            className="absolute flex items-center justify-center bg-ink"
            style={{ left: '252px', top: '191.52px', width: '86.4px', height: '86.4px' }}
          >
            <svg viewBox="0 0 24 24" className="h-[28px] w-[28px]" aria-hidden="true">
              <g stroke="var(--color-on-dark)" strokeWidth="1.6" strokeLinecap="round">
                <line x1="12" y1="3" x2="12" y2="21" />
                <line x1="4.2" y1="7.5" x2="19.8" y2="16.5" />
                <line x1="4.2" y1="16.5" x2="19.8" y2="7.5" />
              </g>
            </svg>
          </div>

          {/* blue spine from the node down to panel C */}
          <div className="absolute top-[277.92px] left-[293px] w-[3.6px] bg-accent" style={{ height: '140px' }} />

          {/* panel C */}
          <div
            className={`absolute ${boxRule} bg-ink-3 pt-[14.4px]`}
            style={{ left: '162px', top: '417.6px', width: '266.4px', height: '108px' }}
          >
            <p className="text-center font-mono text-[10px] leading-[14px] tracking-[0.5px] whitespace-pre text-on-dark-2 uppercase">
              {B.diagram.footTitle}
            </p>
            <div className="mt-[14.4px] flex items-center justify-center gap-[10.8px]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="flex h-[38.88px] w-[38.88px] items-center justify-center border border-rule-strong"
                >
                  <span className="block h-[10.8px] w-[10.8px] border border-rule-bright" />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* bottom rule */}
        <div className="absolute right-[133px] bottom-[38.88px] left-[128.88px] h-px bg-rule-on-dark" />
      </div>
    </section>
  );
}
