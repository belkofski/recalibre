#!/usr/bin/env python3
"""
Derive every published plate from the approved `assets` folder.

    python3 scripts/plates.py            # write the plates
    python3 scripts/plates.py --check    # report exposure only

WHY THIS FILE EXISTS
--------------------
The reference ships every image at `opacity: 1` and `filter: none`. It has
exactly one gradient overlay on its whole homepage. Its pictures look rich
because the PICTURES are graded, not because the page dims them.

Ours was doing the opposite: publishing crushed plates (the hero plate's
brightest pixel was 116 of 255) and then dimming them again to 0.72 behind a
70%-black gradient. The result was a page of near-identical black rectangles.

So the grading moves here, once, into the plate. Each entry records the
approved source file it came from, so every published byte traces back to
`assets` exactly as required. Nothing is invented, added or composited from
outside that folder.
"""
import sys, os, json
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

SRC = 'assets'
OUT = 'public/img'


def load(name):
    p = os.path.join(SRC, name)
    if not os.path.exists(p):
        raise SystemExit(f'missing approved source: {p}')
    return Image.open(p).convert('RGB')


def crop_rel(im, box):
    """Crop by fractions of the frame: (left, top, right, bottom)."""
    w, h = im.size
    l, t, r, b = box
    return im.crop((round(w * l), round(h * t), round(w * r), round(h * b)))


def fit(im, w, h):
    """Cover-crop to an exact size, centred."""
    return ImageOps.fit(im, (w, h), Image.LANCZOS, centering=(0.5, 0.5))


def grade(im, *, black=6, white=242, gamma=1.0, sat=1.0, contrast=1.0, bright=1.0):
    """
    Put the plate into the page's tonal world with a real range at both ends.

    `black` and `white` are the output floor and ceiling. A plate whose
    brightest pixel is 116 has no highlight to catch the eye; one whose
    darkest is 0 across half the frame has no shadow detail to read. Every
    plate here lands between the two so the page has depth rather than
    simply being dark.
    """
    if bright != 1.0:
        im = ImageEnhance.Brightness(im).enhance(bright)
    if contrast != 1.0:
        im = ImageEnhance.Contrast(im).enhance(contrast)
    if sat != 1.0:
        im = ImageEnhance.Color(im).enhance(sat)
    if gamma != 1.0:
        lut = [min(255, round(255 * ((i / 255) ** (1 / gamma)))) for i in range(256)]
        im = im.point(lut * 3)
    # normalise the existing range, then map it onto [black, white]
    g = im.convert('L')
    lo, hi = g.getextrema()
    if hi - lo < 4:
        return im
    span = hi - lo
    lut = []
    for i in range(256):
        v = (i - lo) / span
        lut.append(max(0, min(255, round(black + v * (white - black)))))
    return im.point(lut * 3)


def falloff(im, side='left', strength=0.62, reach=0.58, curve=1.6):
    """
    Bake the darkening the text sits on into the picture instead of laying a
    gradient over it at runtime. One graded plate reads as photography; a
    picture with a black sheet on top reads as a picture with a sheet on top.
    """
    w, h = im.size
    mask = Image.new('L', (w, h), 255)
    px = mask.load()
    for x in range(w):
        t = x / max(1, w - 1)
        if side == 'right':
            t = 1 - t
        if side in ('bottom', 'top'):
            continue
        f = max(0.0, 1 - t / reach) ** curve
        v = round(255 * (1 - strength * f))
        for y in range(h):
            px[x, y] = v
    if side in ('bottom', 'top'):
        for y in range(h):
            t = y / max(1, h - 1)
            if side == 'top':
                t = 1 - t
            f = max(0.0, (t - (1 - reach)) / reach) ** 1.0 if t > 1 - reach else 0.0
            v = round(255 * (1 - strength * f))
            for x in range(w):
                px[x, y] = v
    black = Image.new('RGB', (w, h), (4, 4, 5))
    return Image.composite(im, black, mask)


def vignette(im, strength=0.5, radius=0.78):
    """A round falloff so the middle of a card holds the eye. The reference
    gets this from its photography; ours gets it here."""
    w, h = im.size
    m = Image.new('L', (w, h), 0)
    px = m.load()
    cx, cy = w / 2, h / 2
    mx = (cx ** 2 + cy ** 2) ** 0.5
    for y in range(h):
        for x in range(w):
            d = (((x - cx) ** 2 + (y - cy) ** 2) ** 0.5) / mx
            f = max(0.0, (d - radius) / (1 - radius)) ** 1.4 if d > radius else 0.0
            px[x, y] = round(255 * (1 - strength * f))
    return Image.composite(im, Image.new('RGB', (w, h), (4, 4, 5)), m)


def report(path):
    im = Image.open(path).convert('L')
    h = im.histogram()
    n = sum(h)
    acc, q = 0, {}
    for i, c in enumerate(h):
        acc += c
        for p in (2, 50, 98):
            if p not in q and acc >= n * p / 100:
                q[p] = i
    lo, hi = im.getextrema()
    print(f'  {os.path.basename(path):26} {str(Image.open(path).size):12} '
          f'range {lo:3}-{hi:3}  p02/p50/p98 {q.get(2,0):3}/{q.get(50,0):3}/{q.get(98,0):3}')


def save(im, name, q=90):
    p = os.path.join(OUT, name)
    im.save(p, quality=q, optimize=True, subsampling=1)
    report(p)


# ============================================================================
# THE RECIPES
#
# Every entry names the approved source in `assets` it derives from. Nothing
# is composited from outside that folder and nothing is invented.
# ============================================================================

def build():
    os.makedirs(OUT, exist_ok=True)

    # -- HERO -----------------------------------------------------------------
    # Source: hero-showroom-4000x2250.webp, Recalibre's own showroom render.
    # Cropped left of the glass sign: that panel prints "Recalibre®" into the
    # pixels and the ® is a registration that does not exist, so it is cut
    # out of the frame rather than retouched. What is left is the wall, the
    # chair, the screen and the seating — a real light source, a real depth
    # of field, and a horizon, which is what the page has been missing.
    # The headline sits over the left of this frame, so the darkening the
    # type needs is baked in here instead of laid over the picture at
    # runtime. The plate then publishes at opacity 1, as the reference does.
    print('hero')
    show = load('hero-showroom-4000x2250.webp')
    # The crop is cut at the panel's own aspect so `fit` has nothing left to
    # take off: a second crop on top of a chosen one is how the chair and the
    # seating fell out of frame and left the screen filling half the hero.
    band = crop_rel(show, (0.052, 0.198, 0.600, 0.803))
    hero = grade(fit(band, 2200, 1375), black=5, white=210, sat=0.40, contrast=1.06, bright=0.76)
    save(falloff(hero, 'left', strength=0.46, reach=0.78, curve=1.2), 'plate-hero-room.jpg', 88)

    # The phone crop: a portrait frame off the same band, so the hero is the
    # same room on a phone rather than a squeezed version of a wide picture.
    save(falloff(grade(fit(crop_rel(show, (0.145, 0.20, 0.545, 0.90)), 1000, 1360),
                       black=5, white=210, sat=0.40, contrast=1.06, bright=0.76),
                 'top', strength=0.40, reach=0.58), 'plate-hero-room-tall.jpg', 88)

    # -- THE THREE WORK CARDS -------------------------------------------------
    # The reference fills each card edge to edge with one photograph and puts
    # the mark at the centre. Ours had a pale screenshot floating in a black
    # field with the status pill parked where the mark goes — and the same
    # status repeated on the line underneath. These three fill.

    # OPS. Source: ops-g4.jpg, the product's own screen. Cropped into the
    # working surface so the interface reads as a surface at card size rather
    # than as a screenshot sitting on a table.
    print('work cards')
    ops = load('ops-g4.jpg')
    save(vignette(grade(fit(crop_rel(ops, (0.035, 0.075, 0.675, 0.545)), 1200, 1200),
                        black=8, white=248, sat=1.06, contrast=1.02),
                  strength=0.34, radius=0.72), 'card-ops.jpg', 90)

    # Contraxis. Source: the 2025-10-31 22.57.47 machine render — Recalibre's
    # own, the same scene family as the rest of the brand imagery. A product
    # concept has no screen to show, so the card carries the brand's own
    # picture of a machine examining an object, and the status is stated in
    # the line under the title where every other card states it.
    mach = load('WhatsApp Image 2025-10-31 at 22.57.47 (1).jpeg')
    save(vignette(grade(fit(crop_rel(mach, (0.02, 0.30, 0.98, 0.92)), 1400, 1400),
                        black=5, white=232, sat=1.10, contrast=1.06, bright=1.02),
                  strength=0.46, radius=0.62), 'card-contraxis.jpg', 88)

    # Belkofski. Source: bk-g4.jpg. The one piece of finished, owned work on
    # the page, and the only asset with a colour in it — so it takes the wide
    # card and keeps its blue.
    bk = load('bk-g4.jpg')
    court = load('shot02-pickleball-6250.png')
    save(grade(fit(crop_rel(court, (0.0, 0.215, 1.0, 0.55)), 2400, 820),
               black=6, white=246, sat=1.06, contrast=1.04),
         'card-belkofski.jpg', 88)

    # -- REGRADES -------------------------------------------------------------
    # These plates already existed and were already traced to `assets`; what
    # they lacked was any highlight at all. Rebuilt from the same sources at
    # a range the page can actually show.
    print('regrades')
    opt = load('WhatsApp Image 2025-10-31 at 22.58.29 (10).jpeg')   # the frames, on black
    save(grade(fit(opt, 2000, 1250), black=4, white=238, sat=1.06, contrast=1.05, bright=1.35),
         'plate-optics-wide.jpg', 88)

    shelf = load('bk-g5.jpg')     # the frames on the lit shelf — the warm one
    save(grade(fit(shelf, 1600, 1600), black=5, white=240, sat=1.04, contrast=1.02, bright=1.06),
         'belkofski-shelf.jpg', 88)
    save(grade(fit(crop_rel(shelf, (0.18, 0.28, 0.92, 0.80)), 1400, 1000),
               black=5, white=242, sat=1.06, contrast=1.02, bright=1.12), 'belkofski-lens.jpg', 88)
    save(grade(fit(crop_rel(load('shot02-pickleball-6250.png'), (0.06, 0.06, 0.96, 0.80)), 1400, 1000),
               black=6, white=244, sat=1.02, contrast=1.02), 'belkofski-frames.jpg', 88)
    save(grade(fit(crop_rel(bk, (0.22, 0.30, 0.86, 0.90)), 1200, 1500),
               black=6, white=244, sat=1.04, contrast=1.04), 'belkofski-paddle.jpg', 88)
    save(grade(fit(crop_rel(load('bk-g5.jpg'), (0.0, 0.0, 0.70, 0.62)), 1200, 1500),
               black=5, white=238, sat=1.08, contrast=1.02, bright=1.1), 'belkofski-cube.jpg', 88)

    # The room, as a wide plate for the pages that need an interior.
    save(grade(fit(crop_rel(show, (0.02, 0.18, 0.565, 0.92)), 2200, 1210),
               black=5, white=226, sat=0.62, contrast=1.04, bright=0.92), 'plate-room-wide.jpg', 88)
    save(grade(fit(crop_rel(show, (0.20, 0.20, 0.55, 0.92)), 1100, 1420),
               black=5, white=226, sat=0.62, contrast=1.04, bright=0.92), 'plate-room-tall.jpg', 88)

    # The machine scene, regraded off its own source instead of the blurred
    # copy, for the sections that carry a picture of the work itself.
    save(grade(fit(crop_rel(mach, (0.0, 0.18, 1.0, 0.98)), 1100, 1500),
               black=5, white=234, sat=1.06, contrast=1.04, bright=1.05), 'plate-machine-tall.jpg', 88)

    desk = load('dorwa-svc-web.jpg')
    save(grade(fit(crop_rel(desk, (0.0, 0.06, 1.0, 0.94)), 2000, 1100),
               black=5, white=232, sat=0.85, contrast=1.04, bright=1.18), 'plate-desk-wide.jpg', 88)
    save(grade(fit(crop_rel(desk, (0.10, 0.04, 0.92, 0.96)), 1200, 1260),
               black=5, white=232, sat=0.85, contrast=1.04, bright=1.18), 'plate-desk-tall.jpg', 88)

    geo = load('dorwa-svc-3d.jpg')
    save(grade(fit(crop_rel(geo, (0.0, 0.06, 1.0, 0.92)), 2200, 1210),
               black=5, white=238, sat=0.9, contrast=1.06, bright=1.1), 'plate-geometry-wide.jpg', 88)
    save(grade(fit(crop_rel(geo, (0.10, 0.04, 0.94, 0.96)), 1500, 2000),
               black=5, white=238, sat=0.9, contrast=1.06, bright=1.1), 'render-geometry.jpg', 88)

    # -- THE CHAPTER STILLS ---------------------------------------------------
    # Five capability chapters, five different pictures: the page should not
    # show the same frame twice inside one scroll.
    print('stills')
    stills = {
        'still-geometry.jpg':     (geo,  (0.06, 0.10, 0.96, 0.72), dict(black=5, white=238, sat=0.9,  contrast=1.06, bright=1.12)),
        'still-machine.jpg':      (mach, (0.0,  0.02, 1.0,  0.46), dict(black=5, white=234, sat=1.06, contrast=1.04, bright=1.08)),
        'still-desk.jpg':         (desk, (0.04, 0.10, 0.96, 0.86), dict(black=5, white=232, sat=0.85, contrast=1.04, bright=1.2)),
        # (still-ops-overview and still-ops-permits are captures of the
        #  product, kept in public/img by hand rather than derived here.)
        'still-optics.jpg':       (opt,  (0.02, 0.18, 0.98, 0.86), dict(black=4, white=238, sat=1.06, contrast=1.04, bright=1.4)),
        'still-belkofski.jpg':    (bk,   (0.04, 0.16, 0.96, 0.78), dict(black=6, white=244, sat=1.04, contrast=1.04)),
    }
    for name, (im, box, g) in stills.items():
        save(grade(fit(crop_rel(im, box), 1360, 906), **g), name, 88)


if __name__ == '__main__':
    if '--check' in sys.argv:
        import glob
        for f in sorted(glob.glob(os.path.join(OUT, '*.jpg'))):
            report(f)
    else:
        build()
