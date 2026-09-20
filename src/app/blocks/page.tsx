import KeyValue from '@/sections/blocks/KeyValue';
import HowItWorks from '@/sections/blocks/HowItWorks';
import CoreCapabilities from '@/sections/blocks/CoreCapabilities';
import Work from '@/sections/blocks/Work';
import WhyChoose from '@/sections/blocks/WhyChoose';
import Services from '@/sections/blocks/Services';
import Intro from '@/sections/blocks/Intro';
import Features from '@/sections/blocks/Features';
import Flow from '@/sections/blocks/Flow';

/**
 * /blocks — the nine cloned sections, each kept as its own block so none of
 * them touches the homepage. Grouped by the reference they came from, because
 * they are five different design languages, not one.
 */
const GROUPS = [
  {
    ref: 'A · [N.xx/11] instrument panel',
    note: 'accent rgb(35,83,247) · mono labels · numbered sections',
    blocks: [
      { file: '10.webp', name: 'Key value — 3 cards', el: <KeyValue /> },
      { file: '9.webp', name: 'How it works — 4 cards with rails', el: <HowItWorks /> },
      { file: '3.webp', name: 'Core capabilities — dark, accordion + diagram', el: <CoreCapabilities /> },
    ],
  },
  {
    ref: 'B · Covix',
    note: 'accent rgb(238,104,56) · sparkle eyebrow · same site as the homepage About band',
    blocks: [
      { file: '5.webp', name: 'Work — numbered image cards (screenshot cropped)', el: <Work /> },
      { file: '6.webp', name: 'Why choose us — photo, lead, two cards', el: <WhyChoose /> },
      { file: '11.webp', name: 'Services — dark accordion (screenshot cropped)', el: <Services /> },
    ],
  },
  {
    ref: 'C · Greyola Finn',
    note: 'condensed uppercase display · black · no accent',
    blocks: [{ file: '4.webp', name: 'Intro — display, 01/02/03 rail, three columns', el: <Intro /> }],
  },
  {
    ref: 'D · AgenAI',
    note: 'accent rgb(235,75,49) · six cards around a hub',
    blocks: [{ file: '7.webp', name: 'All features in one', el: <Features /> }],
  },
  {
    ref: 'E · Oberon',
    note: 'accent rgb(221,90,39) · mono · dashed column rails',
    blocks: [{ file: '8.webp', name: 'How it works — four mono columns', el: <Flow /> }],
  },
];

export default function BlocksPage() {
  /* running 01..09 index, computed up front so nothing mutates during render */
  const numbered = GROUPS.map((g) => g.blocks.map((b) => b.file)).flat();
  return (
    <main className="w-full bg-[rgb(250,250,250)]">
      <header className="mx-auto max-w-[1180px] px-[24px] pt-[56px] pb-[36px]">
        <p className="font-mono text-[12px] tracking-[0.6px] text-[rgb(120,120,120)] uppercase">
          Nine cloned sections · five references
        </p>
        <h1 className="mt-[10px] text-[36px] leading-[42px] font-medium tracking-[-1px] text-[rgb(20,20,20)]">
          Blocks
        </h1>
        <p className="mt-[12px] max-w-[640px] text-[15px] leading-[23px] text-[rgb(90,90,90)]">
          Each block is measured from its own screenshot at scale 0.72 and built
          to that reference alone. Words are bracketed placeholders fitted to the
          measured ink widths — none of the references&rsquo; copy, claims,
          ratings, logos or photographs are reproduced.
        </p>
      </header>

      {GROUPS.map((g) => (
        <section key={g.ref}>
          <div className="mx-auto max-w-[1180px] px-[24px] pt-[28px] pb-[14px]">
            <p className="font-mono text-[12px] tracking-[0.5px] text-[rgb(40,40,40)] uppercase">
              {g.ref}
            </p>
            <p className="mt-[4px] font-mono text-[11.5px] text-[rgb(140,140,140)]">{g.note}</p>
          </div>
          {g.blocks.map((b) => {
            const n = numbered.indexOf(b.file) + 1;
            return (
              <div key={b.file}>
                <div className="mx-auto flex max-w-[1180px] items-baseline gap-[12px] px-[24px] pt-[18px] pb-[10px]">
                  <span className="font-mono text-[12px] text-[rgb(150,150,150)]">
                    {String(n).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] font-medium text-[rgb(20,20,20)]">{b.name}</span>
                  <span className="font-mono text-[11.5px] text-[rgb(150,150,150)]">{b.file}</span>
                </div>
                <div className="border-y border-[rgb(226,226,226)]">{b.el}</div>
              </div>
            );
          })}
        </section>
      ))}

      <div className="h-[80px]" />
    </main>
  );
}
