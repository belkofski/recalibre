import { ArtImg } from '@/lib/Img';
import { InView, Parallax } from '@/lib/motion';
import { FirmMark } from '@/components/ui';
import { SITE } from '@/content/site';

/* ============================================================================
   THE WIDE MEDIA BAND — the room, the firm's own art direction: the seat
   facing the set, with its own phone cut.

   The picture is revealed from its foot upward (the clip tier) while the
   room inside it settles from 1.08, and from 1200 up it drifts with the
   scroll at a sixth of its speed. The Parallax box is the direct child of
   the aspect box that clips it, measured off that box, and stands 6%
   taller than it so no edge shows at either end of the drift (10%: on a
   1080px-tall window the band's centre is 850px off the window's at the
   moment it enters, and 6% of 850 is more than 6% of a 625px band); the settle
   wrapper sits inside the Parallax, so the two transforms multiply
   instead of fighting. The wordmark at the foot stays outside the drift:
   it belongs to the frame, not the picture.

   The foot's darkening is in the plate (scripts/plates.py, the hero's
   bottom falloff), so the page dims nothing. The barcode that stood at the
   foot's left came off on the owner's brief, section 26: a decorative
   barcode. Not lazy since 28 September 2026: its top sits about 754px down
   a 900px laptop screen, where it is the largest paint.
   ========================================================================= */
export default function MediaBand() {
  return (
    <section aria-label="The firm" className="pad-x pad-top relative flex w-full flex-col items-center overflow-clip">
      <InView mode="clip" className="shell relative w-full overflow-clip rounded-[30px] mobile:rounded-[20px]">
        <div className="relative aspect-[1.8224/1] w-full mobile:aspect-[4/5]">
          <Parallax speed={0.06} className="absolute inset-x-0 -inset-y-[10%]">
            <div className="settle absolute inset-0">
              <ArtImg
                src="/img/plate-about-seat-a.jpg"
                srcTall="/img/plate-about-seat-tall-b.jpg"
                media="(max-width: 809.98px)"
                alt="A rendered room: a chair facing a wide screen showing the OPS overview, an ottoman beside it, against a deep blue wall."
                sizes="(max-width: 1199px) 100vw, 1380px"
                sizesTall="100vw"
                className="media-fill"
              />
            </div>
          </Parallax>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end p-(--panel-pad)">
            <span className="flex items-center gap-(--space-1)">
              <FirmMark className="text-white" />
              <span className="t-mark text-ink">
                {SITE.name}
                <span className="t-mark-r">{SITE.mark}</span>
              </span>
            </span>
          </div>
        </div>
      </InView>
    </section>
  );
}
