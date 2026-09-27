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


def filmgrain(im, amount=18, coarse=0.35, seed=7, cell=None, shown=None):
    """
    Bake the film into the plate instead of veiling the picture at runtime.

    THIS REPLACES A RUNTIME LAYER THAT WAS UNDOING THE GRADE. `.grain-soft`
    laid mid-grey noise over the photograph at a combined 0.245 opacity. Grey
    at a quarter strength over a near-black picture is not film, it is a veil:
    measured at 1440 on a type-free strip of the hero, the published plate
    reads 20 and the same strip on the page read 57 — the overlay added 37
    points of luminance and lifted every shadow in the frame. The reference's
    own strip reads 20, because its pictures carry their grain in the file.

    So this noise is ZERO-MEAN by construction: each pixel moves up or down
    around its own value, never toward grey. The black level is untouched and
    the grade in this file is what reaches the page.

    `amount` is the peak excursion in levels, `coarse` the share carried by a
    second, larger-celled pass — the one that stops fine grain reading as a
    uniform screen door over a big panel.

    `cell` is why the grain reaches the screen at all, and `shown` is how
    every recipe below sets it. A plate is never drawn at its own size: this
    one is 2200 wide and the hero draws it at 1432, so a one-pixel cell is
    resampled to 0.65 of a pixel and averaged out of existence — baked at 1:1
    the film measured 3.90 in the file and 1.22 on the page. At cell=2 the
    grain is drawn at half the plate's resolution and survives.

    That ratio is different for every plate on this site, from 1.45 (a wide
    plate at 2200 drawn at 1518) to 3.25 (a 1360px chapter still drawn in a
    418px box). One `cell` cannot serve both: at 2 the still's grain lands at
    0.6 of a screen pixel and disappears again. So the caller passes `shown`
    — the width in CSS pixels the browser actually draws this plate at, read
    off the live page at 1440, not guessed — and the cell is sized so the
    grain always arrives at about 1.3 screen pixels, which is where the hero
    was validated. Capped at 4: past that the file itself starts to read as a
    mosaic rather than as a picture.

    `shown` is the NARROWEST point in the chain, not the CSS box. next/image
    resizes the plate to a srcset width before the browser draws it, and
    either step can be the tighter one: the contact plate is 1255 wide, is
    served at 828 and is then drawn about 810 wide (its card is 687 wide and
    taller than the plate's shape, and the 1.1 push scales it up again), so
    810 is the number that matters.

    `amount` is then one number for the whole site, and it is tuned against a
    REAL BROWSER RENDER — see the hero block below for why a resample in here
    cannot predict it.

    WHAT amount=18 ACTUALLY DELIVERS, measured at 1440 on the live page by
    differencing two renders of the same route — one with this function and
    one without — so the number is the grain alone, as it lands on screen,
    with the picture's own detail cancelled out:

        hero (the surface validated against tbd®)      1.85
        the bright plates, desk / geometry / stills    1.9 - 2.9
        the dark plates under a panel's wash          0.8 - 1.5
        the old `.grain-soft` veil, same measurement   2.0 - 2.4

    The dark plates read low and that is correct, not a shortfall: grain of
    ±18 on a picture whose median is 22 clips at zero on the way down, which
    is why the hero itself measures 1.85 and not 2.5. And where a panel's
    picture carries a wash for the type over it — the film panel 40%, the
    closing panel 42%, the 404 panel 38%, the contact card 34% (the hero's
    12% came off on 26 September 2026, see its recipe)
    — the wash is laid AFTER this function (see `wash`), as the page used to
    lay it over the finished picture, so it attenuates the grain and the
    picture TOGETHER and the film reads the same relative to what it sits
    on. Nothing here is compensated for a wash; that would put more grain on
    the page than the photograph has.
    """
    import random
    w, h = im.size
    if cell is None:
        if not shown:
            raise SystemExit('filmgrain needs shown= (the drawn CSS width) or cell=')
        cell = max(1, min(4, round(1.3 * w / shown)))
    rnd = random.Random(seed)

    # The coarse cell, drawn small and scaled up, then the fine cell at `cell`.
    cw, ch = max(1, w // 16), max(1, h // 16)
    fw, fh = max(1, w // cell), max(1, h // cell)
    coarse_amt = amount * coarse
    fine_amt = amount * (1.0 - coarse)

    def plane(pw, ph, amt):
        half = amt
        data = bytes(max(0, min(255, 128 + int(rnd.uniform(-half, half))))
                     for _ in range(pw * ph))
        return Image.frombytes('L', (pw, ph), data)

    c = plane(cw, ch, coarse_amt).resize((w, h), Image.BILINEAR)
    f = plane(fw, fh, fine_amt).resize((w, h), Image.NEAREST)

    # Sum the two planes around the neutral 128, then apply as a signed offset.
    noise = Image.blend(c, f, 0.5)          # mean stays at 128
    base = im.convert('RGB')
    # offset = (noise - 128) * 2, added to every channel
    lut = [max(0, min(255, (i - 128) * 2 + 128)) for i in range(256)]
    signed = noise.point(lut)
    out = Image.merge('RGB', tuple(
        Image.blend(ch_, signed, 0.5).point([max(0, min(255, (i - 64) * 2)) for i in range(256)])
        for ch_ in base.split()))
    return out


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


def wash(im, alpha, colour=(5, 5, 5)):
    """
    A panel's flat darkening, laid into the file instead of over the page.

    Four panels used to lay a sheet of the page's ground colour over their
    picture at runtime — the closing panel at 42%, the film panel at 40%, the
    404 page at 38%, the contact card at 34% — and the home hero a 12% black
    one. The page lays no flat wash over a picture now (the owner's
    decision of 25 September 2026, audit item B-31), so the same sheet is
    composited here, AFTER `filmgrain`, exactly as the browser composited
    it over the finished picture: each panel looks as it did, and the file
    is what reaches the screen. `colour` is the page ground, #050505. The
    hero's was black, and it carried its 12% in the file until the owner
    asked for a brighter hero on 26 September 2026; it has none now.
    """
    return Image.blend(im, Image.new('RGB', im.size, colour), alpha)


# The bright "//" painted on the wall of the rendered room, in the master's
# own pixels (4000 x 2250): the mark and its soft fringe, with a few pixels
# of plain wall on every side.
SLASH = (1412, 944, 1506, 1034)


def unslash(im, box=SLASH):
    """
    Take the painted "//" off the wall of the rendered room (audit item D-07,
    the owner's yes of 25 September 2026). It crossed the line under the
    home headline and the Contact page's intro.

    The mark sits on plain wall lit by a smooth gradient and nothing else, so
    the honest repair is that wall: every pixel in the box is filled from the
    wall just outside it — each row interpolated between the box's left and
    right edges, each column between its top and bottom, the two averaged.
    Nothing is drawn in and nothing is brought from elsewhere in the frame.
    The film laid over the plate afterwards covers it like any other stretch
    of wall.

    It works in the master's own pixels, so it runs on the master before any
    crop, never after. The lossy webp copy of the room is the same 4000 x
    2250 frame with the mark in the same pixels, so the same box repairs it
    too; the closing panel and two share cards are cut from that copy.
    """
    if im.size != (4000, 2250):
        raise SystemExit('unslash expects the 4000 x 2250 room')
    im = im.copy()
    px = im.load()
    l, t, r, b = box

    def mean(pts):
        s = [0, 0, 0]
        for p in pts:
            c = px[p]
            s = [s[i] + c[i] for i in range(3)]
        return [v / len(pts) for v in s]

    left = {y: mean([(x, y) for x in range(l - 4, l)]) for y in range(t, b)}
    right = {y: mean([(x, y) for x in range(r, r + 4)]) for y in range(t, b)}
    top = {x: mean([(x, y) for y in range(t - 4, t)]) for x in range(l, r)}
    bot = {x: mean([(x, y) for y in range(b, b + 4)]) for x in range(l, r)}
    for y in range(t, b):
        v = (y - t + 0.5) / (b - t)
        for x in range(l, r):
            u = (x - l + 0.5) / (r - l)
            across = [left[y][i] * (1 - u) + right[y][i] * u for i in range(3)]
            down = [top[x][i] * (1 - v) + bot[x][i] * v for i in range(3)]
            px[x, y] = tuple(round((across[i] + down[i]) / 2) for i in range(3))
    return im


def shade(im, box, strength=0.65, feather=0.05):
    """
    Darken one soft-edged rectangle of the frame, given as fractions
    (left, top, right, bottom). For a strip of light behind a line of small
    type that a falloff across a whole side could only reach by darkening
    everything else with it. `feather` is the blur, as a fraction of the
    width, so the edge reads as shadow and not as a box.
    """
    w, h = im.size
    l, t, r, b = box
    mask = Image.new('L', (w, h), 255)
    mask.paste(round(255 * (1 - strength)),
               (round(l * w), round(t * h), round(r * w), round(b * h)))
    mask = mask.filter(ImageFilter.GaussianBlur(feather * w / 2))
    return Image.composite(im, Image.new('RGB', (w, h), (4, 4, 5)), mask)


# The television in the rendered room, in the master's own pixels (4000 x
# 2250): the outer edge of its black bezel. Measured 27 September 2026 by
# thresholding the frame (max channel under 40) inside a window around it:
# left 1443-1446, right 2238-2241, top 1140-1144, bottom 1592-1599. The
# render holds the set square to the camera - the edges differ by four
# pixels end to end - so the face is a rectangle and needs no perspective
# warp; a warp on four pixels would only soften the interface.
TV = (1446, 1141, 2238, 1596)


def screen(room, shot, box=TV, inset=6, white=205, vignette=0.14, reflect=0.06, glow=0.12):
    """
    Put a real screen on the television (the owner's Phase A brief, 27
    September 2026, sections 4 and 13). The set used to play a stock face
    lit through blinds, and the brief asks for Recalibre's own work on it,
    art-directed into the room rather than pasted on top of it.

    What "photographed in the room" means here, in order:

      the crop      `shot` is already cut to the face's shape by the caller
                    (the overview's header, its four cards and the chart;
                    the table below the fold is not on a 16:9 set).
      the light     a display in a dark room is not paper-white. The face
                    the render shipped with read 169 at its brightest one
                    percent, and the interface is scaled so its white lands
                    at `white` before the room's grade, which then treats
                    the screen exactly as it treats the wall - the same
                    ceiling, the same desaturation, the same grain - so it
                    cannot read as a layer.
      the glass     a light fall-off towards the edges (`vignette`) and one
                    soft band of the window's light across the top left
                    corner (`reflect`), both faint.
      the room      the screen lights what is near it. A blurred copy of
                    the face is screened over the wall around the set at
                    `glow`, so the wall beside a white interface is a
                    little brighter than the wall beside a black one, as
                    it would be.

    The bezel is the render's own: the face is pasted `inset` pixels inside
    the measured edge so the set's frame stays.
    """
    from PIL import ImageChops, ImageDraw
    l, t, r, b = box
    l, t, r, b = l + inset, t + inset, r - inset, b - inset
    w, h = r - l, b - t
    face = shot.resize((w, h), Image.LANCZOS)
    face = face.point(lambda v: round(v * white / 255))

    # The glass: darker towards the edges, one band of light top left.
    vig = Image.new('L', (w, h), 0)
    ImageDraw.Draw(vig).ellipse((-w * 0.25, -h * 0.55, w * 1.25, h * 1.55), fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(w * 0.18))
    vig = vig.point(lambda v: round(255 - vignette * (255 - v)))
    face = Image.composite(face, Image.new('RGB', (w, h), (0, 0, 0)), vig)
    band = Image.new('L', (w, h), 0)
    ImageDraw.Draw(band).polygon([(0, 0), (int(w * 0.55), 0), (0, int(h * 0.9))], fill=round(255 * reflect))
    band = band.filter(ImageFilter.GaussianBlur(w * 0.06))
    face = Image.composite(Image.new('RGB', (w, h), (255, 255, 255)), face, band)

    out = room.copy()
    out.paste(face, (l, t))

    # The spill onto the wall: the face, blurred wide, screened over the
    # room around the set and nowhere else (the set itself is masked out).
    if glow > 0:
        pad = 160
        layer = Image.new('RGB', room.size, (0, 0, 0))
        layer.paste(face.point(lambda v: round(v * glow)), (l, t))
        layer = layer.filter(ImageFilter.GaussianBlur(70))
        keep = Image.new('L', room.size, 0)
        ImageDraw.Draw(keep).rectangle((l - pad, t - pad, r + pad, b + pad), fill=255)
        ImageDraw.Draw(keep).rectangle((box[0], box[1], box[2], box[3]), fill=0)
        keep = keep.filter(ImageFilter.GaussianBlur(24))
        lit = ImageChops.screen(out, layer)
        out = Image.composite(lit, out, keep)
    return out


def corner(im, strength=0.7, steps=((0.70, 0.78),), fade=0.2):
    """
    Darken the lower-left corner of a frame. Each step is a (right, top)
    pair of fractions: full strength left of `right` and below `top`, easing
    to nothing over `fade` beyond each edge. Where steps overlap the deeper
    one wins, so two steps make a soft stair rather than a darker square.
    For a line of type set in that corner of a card whose picture is lit
    there — the footer's brand line, which lands lower in the frame on a
    tall card than on a wide one. Built at an eighth of the size and scaled
    up: the ramp is smooth, so nothing is lost.
    """
    w, h = im.size
    sw, sh = max(2, w // 8), max(2, h // 8)
    small = Image.new('L', (sw, sh))
    px = small.load()

    def ease(t):
        t = max(0.0, min(1.0, t))
        return t * t * (3 - 2 * t)

    for y in range(sh):
        fy = y / (sh - 1)
        for x in range(sw):
            fx = x / (sw - 1)
            g = 0.0
            for right, top in steps:
                gx = ease(1 - (fx - right) / fade) if fx > right else 1.0
                gy = ease(1 - (top - fy) / fade) if fy < top else 1.0
                g = max(g, gx * gy)
            px[x, y] = round(255 * (1 - strength * g))
    mask = small.resize((w, h), Image.BILINEAR)
    return Image.composite(im, Image.new('RGB', (w, h), (4, 4, 5)), mask)


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
    # Source: hero-showroom-master-4000x2250.png, the lossless master of the
    # rendered room (hero-showroom-4000x2250.webp is the same picture, lossy;
    # it still feeds the closing panel and the share cards, whose frames did
    # not change). What the frame holds is the wall, the chair and the
    # screen — a real light source, a real depth of field, and a horizon.
    print('hero')
    # The "//" painted on the wall is taken off both copies of the room
    # before any crop; see `unslash`. The hero and the Contact page's plate
    # are cut from the repaired master; the closing panel and the home and
    # Contact share cards from the repaired webp (the owner's yes of 25
    # September 2026: the mark comes off every picture that shows it).
    show = unslash(load('hero-showroom-4000x2250.webp'))
    room = unslash(load('hero-showroom-master-4000x2250.png'))
    # THE TELEVISION PLAYS OPS (the owner's Phase A brief, 27 September
    # 2026). The overview screen, cut from the capture in `assets` (never
    # from the public copy) to the set's 16:9: the header, the four cards
    # and the activity chart, 16 px in from the window's rounded corners so
    # no corner of the capture's backdrop shows. `show`, the lossy copy that
    # feeds the share cards, keeps the render as delivered for now.
    room = screen(room, load('ops-g1.jpg').crop((16, 24, 1584, 906)))
    # THE PAINTED "//" STAYS ON THE WALL FOR THE LAPTOP PLATE (the owner's
    # decision of 28 September 2026: his Phase A brief lists the mark under
    # keep, and with the words fitted to the whole room it sits in clear
    # wall between the paragraph and the set). The phone plate, the Contact
    # plate and the share cards keep the repaired wall: on those frames the
    # mark lands behind words. `marked` is the same room, un-repaired.
    marked = screen(load('hero-showroom-master-4000x2250.png'), load('ops-g1.jpg').crop((16, 24, 1584, 906)))
    #
    # THE SIGN IS OUT OF FRAME, on the owner's word of 25 September 2026
    # (audit item D-07). The whole-room frame this replaced showed the tall
    # glass sign, "Recalibre" and its mark, at the right of the picture, and
    # on the laptops people actually use — 1200 to 1440 wide, 1280 and 1366
    # among them — the headline ran across its lettering. The source has no
    # room left of 0 to pan into, so it offers two frames only: the sign
    # whole, or the sign out. This is the second. The frame stops at 0.575,
    # short of the glass at 0.583, and at the plate's 1.6:1 that makes it
    # 0.639 of the source tall. The headline keeps its size and its place;
    # what is under it now is wall and window.
    #
    # WHERE THE SCREEN SITS. At this scale the screen is 30% of the frame's
    # height, and on a 16:9 laptop the room between the foot of the headline
    # and the top of the statement card is about 26%, so it cannot clear
    # both. The headline wins: the frame starts at 0.224, the screen's top
    # clears "foundation." at 1200, 1280, 1366 and 1440, and on the shorter
    # windows the card covers the foot of the screen rather than its face.
    #
    # THE GRADE. The frame lost the lit glass and the pale wall beyond it,
    # and with the old ceiling of 185 the room went to the dark. 220 with a
    # little gamma brought the wall and the chair back up: measured on the
    # page at 1440, the first screen's panel read about 30 against 33
    # before the re-cut. The left falloff still holds the daylight at the
    # frame's edge and the bottom one the lit floor; the right one went
    # with the sign it was there to dim.
    #
    # BRIGHTER, ON THE OWNER'S REQUEST OF 26 SEPTEMBER 2026. He was shown
    # three grades of this frame side by side and picked the brightest:
    # brightness 0.92 (was 0.76), ceiling 242 (was 220), gamma 1.25 (was
    # 1.15), and no wash at all (it was 12%, see below). The falloffs and
    # the grain are unchanged; the window's shade is not (see THE WINDOW'S
    # SHADE, below). Published under new names (`-c`; `-b` was the first
    # cut of the brighter grade, never on the live site), because a
    # picture's address is its cache key (lib/Img.tsx).
    #
    # "FIVE" SITS ON THE WINDOW. The small line over the headline starts on
    # the glass and the olive tree at the frame's left, and its first word
    # read as low as 3.3:1 there. `shade` darkens that strip of window
    # alone, so the word read at 5.6:1 or better from 1200 to 1440 wide on
    # the grade before the brighter one (see the measurement under it).
    #
    # THE FILM IS IN THE FILE NOW. `.grain-soft` used to lay mid-grey noise
    # over this photograph at a combined 0.245 opacity, and grey at a quarter
    # strength over a near-black frame is not film, it is a veil. Measured at
    # 1440 on a type-free strip of the hero: the published plate reads 20 and
    # the page read 57 — the overlay added 37 points and lifted every shadow
    # the grade on the line below had just set. The reference's own strip
    # reads 20, because its pictures carry their grain in the file.
    #
    # `filmgrain` is zero-mean, so the black level survives the texture: the
    # strip rendered at 21.3 against the reference's 22.2 (on the frame
    # before this one).
    #
    # amount=18, cell=2 is calibrated against a REAL BROWSER RENDER, not a
    # resample in this script. Two things eat fine grain before it reaches
    # the page — Next re-encodes at q=75, and Chrome's own 2200->1432
    # downscale smooths harder than LANCZOS — so a value tuned in here misses
    # badly: amount=10 predicted 3.73 and rendered 1.45. The live readings
    # that set it: 10 -> 1.45, 22 -> 4.81, 18 -> 3.96, against the
    # reference's 3.68 on the same strip.
    #
    # THE PANEL'S 12% IS GONE. The rounded panel over this picture was a 12%
    # black layer at runtime (`bg-black/12` in Hero.tsx), and from 25
    # September 2026 the same 12% was laid into this file after the grain,
    # rim and all. The owner's brighter hero of 26 September 2026 drops it:
    # the file is the grade, the falloffs, the shade and the grain, and the
    # page publishes it at full strength as before.
    #
    # THE WINDOW'S SHADE, DEEPENED FOR THE BRIGHTER GRADE (26 September
    # 2026). Measured on the page with the `-b` cut (headless Chrome, the
    # plate as served, the worst 5% of the pixels under each word, the words
    # at 60% white), the brighter window let the type over it slip under
    # 4.5:1. The small line over the headline, as a line, fell to 4.60 at
    # 1400 x 900 and 4.24 at 1440 x 1000, with FIVE at 3.88 and CAPABILITIES
    # at 4.09 there. The lede under the headline, whose left end sits on
    # the same window, fell to 4.26 - 4.52 as a line from 1200 to 1680 wide,
    # its words to 2.87 - 4.0; on the old grade it read 5.26 - 5.55.
    #
    # So a second, taller shade takes the same strip of window from the
    # small line's top down past the lede's second line: 0.07 to 0.55 of the
    # frame's height, the glass, the tree and the bright edge of the post at
    # 0.25, at 45%. The first shade stays as it was for the small line. The
    # wall, the chair, the screen and the floor keep the brighter grade.
    # Measured the same way on the `-c` plate, at 19 windows from 1000 x 800
    # to 2560 x 1440: the small line reads 5.99 to 7.00 as a line (6.26 to
    # 6.61 from 1200 x 800 to 1440 x 900) and no word under 5.59 (FIVE at
    # 1440 x 1000); the lede 5.29 to 6.36 as a line, and no word under 4.94
    # ("For" at 1680 x 1050, 3.79 on the old grade) or, from 1200 to 1600
    # wide, under 5.32.
    #
    # THE WHOLE FRAME, `-e` (the owner's instruction of 27 September 2026,
    # late evening: "zoom out our image in hero to capture the full image in
    # desktop"). The laptop plate is the entire render at its own 16:9,
    # 2200 x 1238, which a 1440 x 900 window's slab (1432 x 806) covers with
    # no crop at all; wider windows lose a little top and bottom. The tall
    # glass sign and the right wall are in frame again; the sign stands
    # behind the end of the headline's second line, which is why the
    # earlier frame stopped short of it (see the note above). The "//" on
    # the wall stays off, on the 25 September decision (`unslash`).
    #
    # The grade is the `-c`/`-d` grade. The left falloff and the two window
    # shades are the same objects mapped from the old frame's fractions to
    # the whole frame's (the old frame was 0.575 of the width and 0.224 to
    # 0.8629 of the height): reach 0.62 -> 0.36; the shades' boxes
    # (0.0, 0.10, 0.27, 0.26) -> (0.0, 0.29, 0.155, 0.39) and
    # (0.0, 0.07, 0.285, 0.55) -> (0.0, 0.27, 0.164, 0.575). The bottom
    # falloff keeps its reach, so the floor and the foot of the set darken
    # as before. OPS is on the television as on `-d`: three levels of
    # screen white were judged on the page at 1440 (175, 205, 230); 175
    # read as a switched-off grey panel, 230 competed with the headline,
    # 205 reads as a lit display under a headline that still leads.
    hero = grade(fit(marked, 2200, 1238),
                 black=5, white=242, sat=0.40, contrast=1.06, bright=0.92, gamma=1.25)
    hero = falloff(hero, 'left', strength=0.50, reach=0.36, curve=1.70)
    hero = falloff(hero, 'bottom', strength=0.55, reach=0.40)
    hero = shade(hero, (0.0, 0.29, 0.155, 0.39), strength=0.65, feather=0.05)
    hero = shade(hero, (0.0, 0.27, 0.164, 0.575), strength=0.45, feather=0.05)
    # `-f` (28 September 2026): `-e` with the painted mark left on the wall.
    save(filmgrain(hero, amount=18, shown=1432), 'plate-hero-wall-f.jpg', 88)

    # The phone crop: a portrait frame off the same room, so the hero is the
    # same place on a phone rather than a squeezed version of a wide picture.
    # It leaves the sign out, as the desktop frame does: it stops at 0.575
    # like the wide one, and at the phone's shape that makes it the chair,
    # the screen and the wall between them. Its top edge stops at 0.15:
    # taking it to 0.00 to "zoom out" pulled the ceiling and its track
    # lighting into frame, which read as a mistake above the headline.
    #
    # THE FALLOFF HAS TO REACH THE BODY COPY, not just the headline. A phone
    # stacks eyebrow, headline, lede and both buttons down the frame, so the
    # text runs to about 0.68 of the panel where the desktop's stops at 0.45.
    # At strength 0.40 / reach 0.58 the lede sat straight on the screen's lit
    # face and measured 43.6 against the reference's 23. At 0.78 / 0.88 it
    # measured 24.2 on the old frame; on this one the wall behind the lede
    # reads 10 on the page at 390 (it was 12 before the re-cut), and the
    # room is still there below the fold. Its ceiling went from 170 to 190
    # with a little gamma for the same reason as the wide plate's.
    #
    # BRIGHTER WITH THE WIDE PLATE, on the owner's request of 26 September
    # 2026: brightness 0.92 (was 0.76), ceiling 214 (was 190), gamma 1.2
    # (was 1.1), and no 12% wash after the grain (it had one, as the wide
    # plate did). The top falloff and the grain are unchanged. Measured on
    # the page the same way as the wide plate: the lede reads 6.05 to 6.18
    # at 360 x 740, 375 x 667, 390 x 844 and 430 x 932 (6.65 to 6.72 on the
    # old grade).
    #
    # AS A LINE. Word by word, the lede's second and third lines cross the
    # top of the screen, and on the brighter grade the lit stripes of the
    # face under "tools," (390 x 844) and "capabilities." (430 x 932) took
    # those words to 3.51:1; the old grade held them at 4.50. A soft shade
    # over the top of the screen, 36%, brings them back: on the `-c` plate
    # the lede reads 6.16 to 6.37 as a line and no word under 5.03 at 360 x
    # 740, 375 x 667, 390 x 844, 393 x 852, 414 x 896 and 430 x 932, and
    # 6.48 to 6.87 on the upright tablets that take this crop.
    #
    # RE-FRAMED FOR THE SCREEN (27 September 2026, `-d`). With OPS on the
    # set, the old frame put a white interface straight behind the lede and
    # the white button. The set has to sit under the words, and the words
    # on a phone run to about 560px of the panel, so the set's top edge
    # sits at 0.70 of the frame and the phone panel is floored at 800px
    # (Hero.tsx: min-h max(100svh, 800px)), which keeps the button above
    # the fold on a 667px phone and the set below the link on every phone.
    # The set is at 0.507 to 0.71 of the source's height, so putting it at
    # 0.70 of a frame means the frame starts at the ceiling (0.0) and ends
    # at 0.7244; at the plate's shape that is 1198 of the source's width,
    # right-aligned at 0.575 as before, and the chair is out of the phone's
    # frame (a leg at the foot). The ceiling's track lights sit in the top
    # falloff and read as fixtures switched off. The 36% shade over the top
    # of the set is not needed: nothing is written on it now.
    tall = falloff(grade(fit(crop_rel(room, (0.2755, 0.0, 0.575, 0.7244)), 1000, 1360),
                         black=5, white=214, sat=0.40, contrast=1.06, bright=0.92, gamma=1.2),
                   'top', strength=0.78, reach=0.88, curve=1.3)
    save(filmgrain(tall, amount=18, shown=390), 'plate-hero-wall-tall-d.jpg', 88)

    # THE STATEMENT CARD'S PICTURE IS NO LONGER CUT. The hero's statement
    # card, and the 120x154 portrait at its edge (plate-card-founder.jpg),
    # came off the first screen on the owner's Phase A brief of 27
    # September 2026. The portrait's one place is About; its plate is cut
    # below (plate-about-founder.jpg) from the same frame.


    # -- THE THREE WORK CARDS -------------------------------------------------
    # The reference fills each card edge to edge with one photograph and puts
    # the mark at the centre. Ours had a pale screenshot floating in a black
    # field with the status pill parked where the mark goes — and the same
    # status repeated on the line underneath. These three fill.

    # OPS. Source: ops-g5.jpg, the product running on a tablet.
    #
    # THIS USED TO CROP INTO ops-g4 AT (0.035, 0.075, 0.675, 0.545) — the
    # sidebar and the orange header, magnified until the French menu items
    # were legible one by one. Two things were wrong with it. The card then
    # overscaled that crop by 1.22 and threw away 76px on every side, so
    # "Bonjour, Equipe Atlas." ran off the right edge mid-phrase; and a
    # screenshot enlarged that far stops reading as a product and starts
    # reading as a zoom.
    #
    # The reference fills each card with one photograph of a thing. The
    # nearest honest equivalent here is the product on a device: ops-g5 is
    # the tablet shot, and this is the largest square the source can give
    # (1200 wide, centred on the device at y=843), which holds the whole
    # tablet with its bezel and about 20px of air above and below. The dark
    # bezel gives the card an edge, the orange header is the one accent, and
    # nothing is cut.
    #
    # It is a COMPOSED PLATE, not a photograph, so the card draws it at 1:1 —
    # see `plate` in WorkCard.tsx. Overscaling a composition is what broke
    # the old one.
    #
    # AND IT IS EVIDENCE, SO IT IS PUBLISHED AS SHOT: the crop and nothing
    # else, no grade and no grain. The founder's override of 17 September
    # 2026 says evidence assets are never graded, and the OPS record says
    # "Never grade it": a pale interface graded like a photograph goes grey
    # on grey. This card used to carry a grade and a grain; the owner chose
    # on 25 September 2026 to follow the rule (B-31). New bytes, so a new
    # name: see the rule at the top of src/lib/Img.tsx. The old card-ops.jpg
    # was deleted on 25 September 2026.
    print('work cards')
    # THE PERMITS SCREEN, FLAT (the owner's Phase A brief, 27 September
    # 2026, sections 12 and 13). The square used to carry the overview in a
    # tablet mockup cut from ops-g5.jpg; the brief wants real screens, no
    # device, no cream ground, and no OPS screen shown twice on Home: the
    # overview is on the hero's television, so the Work square shows the
    # permits register, the French and Arabic screen, cut from the app
    # window inside ops-plate-3.png (never from the public copy). The crop
    # starts 16px inside the window's rounded corner so no backdrop shows,
    # and takes the sidebar, the three counters, the permits by zone and
    # the head of the register with its Arabic line. Evidence: published
    # as shot, no grade, no grain. New bytes, new name.
    save(fit(crop_rel(load('ops-plate-3.png'), (0.175, 0.1222, 0.6688, 1.0)), 1200, 1200), 'card-ops-permits.jpg', 90)

    # Contraxis. NO PLATE, DELIBERATELY.
    #
    # The card used to carry the 22.57.47 machine render. That render is a
    # Belkofski brand picture: a pair of orange-lensed frames is set into the
    # mass on the face of the cube, plainly visible at card size. Putting it
    # on Contraxis told a reader that an eyewear photograph was evidence of a
    # document-intelligence product.
    #
    # Contraxis has no interface and will not have one until it reaches a
    # working build, so its card and its cover carry the schematic drawn in
    # ContraxisDrawing.tsx — the five steps the concept describes, labelled
    # on its own face as a drawing. See that file.

    # ABP Continental. Source: abp.png, a capture of the website Recalibre
    # delivered — 2290 x 1652 of it, the whole hero.
    #
    # NONE OF THE OBVIOUS SQUARES WORK. The page's lower third is a yellow
    # plate carrying black text, and the card prints its own title in white
    # across that same corner; every full-height square put one on top of
    # the other. The page's own headline, three lines of it at display size,
    # fights the card's title for the same job.
    #
    # So the crop is the photograph the site is built on, taken from the
    # right of the frame: the two riggers bolting a column, the crawler
    # crane, the dusk band — and, because they are the site's own design and
    # not decoration, the menu rule and the field coordinates whole. It
    # stops at y=0.714, above the white rule and well above the yellow.
    #
    # A composed crop, so `plate` on the card: 1.22x would take 76px off
    # every side of a frame whose edges were chosen, and there is no room
    # left in the source to cut wider and let the overscale bring it back.
    # Behind the centre mark it measures 24 of 255, so ABP's wordmark prints
    # white like Belkofski's and unlike OPS's.
    print('abp')
    abp = load('abp.png')
    #
    # AND IT IS LIFTED, NOT LEFT AS SHOT. Ungraded, the crop's brightest
    # two per cent landed at 99 of 255 — the exact failure this file was
    # written to stop, a plate with no highlight anywhere in it. bright
    # 1.55 with gamma 1.12 brings the dusk band and the sky back without
    # bleaching the steel; the page dims nothing at runtime.
    save(filmgrain(grade(crop_rel(abp, (0.48472, 0.0, 1.0, 0.71429)),
                         black=6, white=240, sat=1.06, contrast=1.0,
                         bright=1.55, gamma=1.12),
                   shown=687), 'card-abp.jpg', 90)

    # The site shown whole, for the detail page's gallery. Never bled off an
    # edge and never upscaled — the capture is 2290 wide and this is 2290
    # wide. A website is read, not cropped.
    #
    # AND NEVER GRADED. It is evidence — the client's own website, in a
    # gallery — and the founder's override of 17 September 2026 puts no
    # filter on anything in a gallery. It used to carry a grade; since 25
    # September 2026 it is the capture as delivered (B-31), under a new name
    # (src/lib/Img.tsx). The old abp-site-home.jpg was deleted on 25 September.
    save(abp, 'abp-site-home-clean.jpg', 88)

    # The detail cover, 1400 x 1000, cut from the same right-hand side as
    # the card and for the same reason. The cover panel is half covered by
    # the title card, and the page's own headline sits exactly there: the
    # full-width crop printed "...ing the / ...structure / ...gy runs on."
    # down the middle of the panel, three half-sentences under our own
    # title. Taking the frame from x=0.40 leaves the headline out
    # altogether and keeps the field coordinates, which are the site's
    # design rather than its copy. It stops at y=0.725, where the yellow
    # plate begins — 0.80 left a cut yellow stripe along the bottom edge.
    #
    # The whole page is still published, at full size, in the gallery
    # below, which is where a website should be read.
    save(filmgrain(grade(fit(crop_rel(abp, (0.40, 0.0, 1.0, 0.725)), 1400, 1000),
                         black=6, white=240, sat=1.04, contrast=1.02, bright=1.35),
                   shown=894), 'hero-abp.jpg', 90)

    # Belkofski. Source: shot02-pickleball-6250.png. The only asset on the
    # page with a colour in it.
    #
    # IT USED TO BE THE WIDE CARD, 2.93:1 across the foot of the grid,
    # because three initiatives leave an odd slot. There are four now, so
    # the grid is the reference's 2 x 2 of squares and this is a square.
    #
    # AND THE SQUARE IS CENTRED ON THE PADDLE'S OWN PRINTED WORDMARK. The
    # reference centres a client's logo on every card; this photograph
    # already carries one, printed across the blue, and a second copy laid
    # over it was the card printing the same word twice. Framed this way the
    # picture supplies the mark itself, so the card passes none — see
    # `mark` in the content files.
    bk = load('bk-g4.jpg')
    court = load('shot02-pickleball-6250.png')
    save(filmgrain(grade(crop_rel(court, (0.17241, 0.16493, 0.87284, 0.72917)),
                         black=6, white=246, sat=1.06, contrast=1.04), shown=687),
         'card-belkofski.jpg', 88)

    # -- THE THREE DETAIL COVERS ----------------------------------------------
    # A card is 687px square and a cover panel is 1380 × 640, so one crop
    # cannot serve both: the card crop, blown across a cover, is the
    # "magnified dashboard" the audit found behind the OPS title. These are
    # cut for the cover's own shape, and the left third is darkened in the
    # plate so a white title has something to sit on without a sheet of
    # black being laid over the picture at runtime.
    print('covers')

    # NO FALLOFF ON EITHER OF THESE, and that is the point.
    #
    # The first attempt kept the reference's full-bleed cover and darkened the
    # foot of the plate so a white title had something to sit on. It works on
    # a photograph. It does not work on a screenshot of a white dashboard:
    # darkening it enough for white type destroys the very thing the cover
    # exists to show, and stopping short leaves the title on light grey.
    #
    # So the cover is a split instead — a text card beside a picture card on
    # the same 2px seam as every other pair on this site — and the picture is
    # published whole, at 1400 x 1000 for the 898 x 640 card it sits in
    # (OPS at 1516 x 1083 since 25 September 2026, see below).

    # OPS. Source: ops-g1.jpg, the product's own overview screen, at a scale
    # a reader can actually read: the four counters, the zone list and the
    # activity chart, not one magnified corner of a dashboard.
    #
    # EVIDENCE, SO NO GRADE AND NO GRAIN (B-31, 25 September 2026; see the
    # OPS card above). AND AS LARGE AS THE SOURCE ALLOWS: the same crop used
    # to be shrunk to 1400 wide, and on a Retina screen the cover needs
    # about 1792. 1516 x 1083 is the whole of that crop at the cover's
    # 1.4:1, nothing enlarged (D-23). The old hero-ops.jpg is deleted.
    save(fit(crop_rel(load('ops-g1.jpg'), (0.0, 0.0, 1.0, 0.72)), 1516, 1083), 'hero-ops-clean.jpg', 90)

    # Belkofski. Source: the 22.58.29 frames on black. The card keeps the
    # court and its blue; the cover leads with the product, because the
    # paddle was reading as the subject of an eyewear house.
    frames = load('WhatsApp Image 2025-10-31 at 22.58.29 (10).jpeg')
    save(filmgrain(grade(fit(crop_rel(frames, (0.04, 0.06, 1.0, 0.98)), 1400, 1000),
                         black=4, white=240, sat=1.08, contrast=1.05, bright=1.3), shown=894),
         'hero-belkofski.jpg', 90)

    # The phone crop of the wide Belkofski card. A 2.93:1 plate in the 4:3
    # media block a card takes below 810px is cropped to its middle third,
    # and the middle third of that photograph cuts the wordmark in half.
    save(filmgrain(grade(fit(crop_rel(court, (0.04, 0.20, 0.96, 0.78)), 1200, 900),
                         black=6, white=246, sat=1.06, contrast=1.04), shown=350),
         'card-belkofski-tall.jpg', 88)

    # -- THE FIRM'S OWN RENDER ------------------------------------------------
    # Source: hero.png — the same machine scene under red light with the cube
    # closed and NO eyewear in it, which is why it can carry a firm-level
    # slot that the 22.57.47 frame cannot. Every crop stops above y=0.88:
    # the plate prints "Recalibre®" across its bottom left corner. Fadi
    # stated on 24 September 2026 that the mark is registered; the
    # certificate is not yet on file. The crops stay as they are.
    print('the firm')
    # still-recalibre.jpg (hero.png, the red gantry render) is no longer
    # cut: the systems capability carries type only from 27 September 2026
    # (the owner's Phase A brief, section 16), because that render shows no
    # system. plate-recalibre-film.jpg went earlier with the Film block.
    # The render is still loaded: the Contraxis share card below is cut
    # from it, and that card is not in the brief's scope yet.
    red = load('hero.png')
    # tile-recalibre.jpg (the closing panel's "us + you" tile) is no longer
    # made: the closing panel came off every page on 26 September 2026 (the
    # owner's decision) and the file with it.

    # -- OPS, AS A TALL PANEL -------------------------------------------------
    # Source: ops-g5.jpg. The spotlight block on the homepage is the OPS
    # block; its 687 × 942 media card was carrying the eyewear render. It
    # carries OPS. The bottom of the source is cut away because it prints a
    # working address into the pixels, and an address on a page is an
    # invitation to visit it.
    #
    # The card this fills carries the Recalibre mark across its top and a
    # barcode across its foot, and the plate is a white screen. A narrow
    # band at each end used to be darkened here, on top of a grade and a
    # grain. All three came off on 25 September 2026: the picture is
    # evidence, and evidence is published as shot (B-31; see the OPS card
    # above). The card still lays its own dark fade across the top 26% and
    # the foot 30% (src/sections/home/Spotlight.tsx), which is what keeps
    # the mark and the barcode readable. New bytes, new name; the old
    # plate-ops-tall.jpg is deleted.
    #
    # THE OFFLINE DAY SHEET (27 September 2026, the owner's Phase A brief,
    # section 13: every OPS appearance on Home shows a different part of the
    # product). The tablet mockup from ops-g5 is gone; this is the "Ma
    # journee" phone panel with its "hors ligne" chip, cut from the app
    # window in mob-plate-1.png at the card's own 687 x 942, with a margin
    # of the window's ground on its left and the "Sur le terrain" card kept
    # out on its right. The panel is about 570px wide in the source, so it
    # is drawn at 1.2x here and reads soft on a 2x screen; a larger capture
    # of this panel would replace it under the same name rule. Evidence,
    # published as shot.
    save(fit(crop_rel(load('mob-plate-1.png'), (0.158, 0.451, 0.3676, 0.962)), 687, 942), 'plate-ops-offline.jpg', 90)

    # -- REGRADES -------------------------------------------------------------
    # These plates already existed and were already traced to `assets`; what
    # they lacked was any highlight at all. Rebuilt from the same sources at
    # a range the page can actually show.
    # THE BELKOFSKI GALLERY IS ONE PICTURE, the court shot. It used to be
    # five. On 25 September 2026 the owner confirmed his decisions of 25
    # August (B-29): the campaign render (B11) comes off, the shelf (B38),
    # approved only as a small round picture, comes off, and so does one of
    # each pair that showed the same picture twice: the lens shot is cut
    # from the cover's own file, and the paddle close-up is a second crop of
    # the court shot. Those four files, and their recipes, were deleted on
    # 25 September 2026.
    #
    # The court shot is evidence, so it is published as shot, with no grade
    # and no grain (founder override of 17 September 2026; B-31), under a
    # new name (src/lib/Img.tsx). It runs the full width of the gallery
    # (D-06). belkofski-court.jpg stays, unreferenced.
    print('regrades')
    save(fit(crop_rel(load('shot02-pickleball-6250.png'), (0.0, 0.20, 1.0, 0.70)), 1800, 1125),
         'belkofski-court-clean.jpg', 88)

    # plate-room-close-nomark.jpg, the closing panel's room, is no longer
    # made: the closing panel came off every page on 26 September 2026 (the
    # owner's decision) and the file with it.
    # The Contact page's picture: the same frame of the room, cut now from the
    # repaired master (no "//", which crossed the intro on phones) and at the
    # full 1255 pixels that frame holds at this shape rather than 1100. The
    # card is drawn about 810 wide, so a 2x screen wants 1620 and was getting
    # 1100 (audit item D-23). The card's 34% is in the file (`wash`); its two
    # soft fades, at the top and at the foot, are still laid by the page.
    save(wash(filmgrain(grade(fit(crop_rel(room, (0.20, 0.20, 0.55, 0.92)), 1255, 1620),
                              black=5, white=226, sat=0.62, contrast=1.04, bright=0.92), shown=810), 0.34),
         'plate-room-contact-b.jpg', 88)
    # `-b` (27 September 2026): the same cut, from the room with OPS on
    # the television. A new name because the address is the cache key.

    desk = load('dorwa-svc-web.jpg')
    save(filmgrain(grade(fit(crop_rel(desk, (0.0, 0.06, 1.0, 0.94)), 2000, 1100),
                         black=5, white=232, sat=0.85, contrast=1.04, bright=1.18), shown=1380),
         'plate-desk-wide.jpg', 88)
    # THE TALL CROP, AT THE SIZE THE SOURCE CAN GIVE. It used to be shrunk
    # to 1200 x 1260, and the Home insights block draws it 783 wide, which a
    # Retina screen fills with 1566. The slice is 1470 wide; 1460 x 1533 is
    # the same 20:21 shape and the same crop, nothing enlarged (D-23, 25
    # September 2026). The grade is unchanged — this is not evidence — and
    # the grain keeps `shown=687`: `filmgrain` sizes the cell from the
    # plate's width (3 here, 2 before). Simulated at the widths the two
    # pages ask for — 828 and 750 at 1x, the whole file at 2x — it lands
    # within 8% of the old plate's grain on screen. New bytes, new name;
    # the old plate-desk-tall.jpg is deleted.
    save(filmgrain(grade(fit(crop_rel(desk, (0.10, 0.04, 0.92, 0.96)), 1460, 1533),
                         black=5, white=232, sat=0.85, contrast=1.04, bright=1.18), shown=687),
         'plate-desk-tall-2x.jpg', 88)

    geo = load('dorwa-svc-3d.jpg')
    # plate-geometry-wide.jpg, the homepage Statement's band, is no longer
    # made: the Statement came off the homepage on 26 September 2026 (the
    # owner's decision) and the file with it.
    # This frame for the 404 page, with that panel's 38% in the file
    # (`wash`) instead of laid over it on the page.
    save(wash(filmgrain(grade(fit(crop_rel(geo, (0.0, 0.06, 1.0, 0.92)), 2200, 1210),
                              black=5, white=238, sat=0.9, contrast=1.06, bright=1.1), shown=1518), 0.38),
         'plate-geometry-404.jpg', 88)
    # plate-geometry-footer.jpg, the footer's picture card, is no longer made:
    # the footer became one smoked-glass card with no picture on 26 September
    # 2026 (the owner's decision; see components/Footer.tsx), and the file
    # went with it.
    save(filmgrain(grade(fit(crop_rel(geo, (0.10, 0.04, 0.94, 0.96)), 1500, 2000),
                         black=5, white=238, sat=0.9, contrast=1.06, bright=1.1), shown=670),
         'render-geometry.jpg', 88)

    # -- THE CHAPTER STILLS ---------------------------------------------------
    # Five capability chapters, five different pictures: the page should not
    # show the same frame twice inside one scroll.
    print('stills')
    # PICTURES ONLY FROM RECALIBRE'S WORLD (the owner's Phase A brief, 27
    # September 2026, section 16). The partner's polyhedron and desk renders
    # (still-geometry, still-desk) and the firm's red gantry render
    # (still-recalibre) came off the chapters; the court shot stays on the
    # Work square only. What the chapters show now, one true picture each:
    #   01 the Contraxis system diagram (a component, not a file)
    #   02 the OPS daily report, cut from ops-g3.jpg, the signed screen
    #   03 type only, until a systems proof that is not OPS exists
    #   04 the ABP Continental website as delivered, cut from abp.png
    #   05 the Belkofski brand render: the frames set into the cube on the
    #      gantry bed (the 22.57.47 file in `assets`)
    # The two captures are evidence and are published as shot; the render
    # is graded like the other dark renders were. New bytes, new names.
    cube = load('WhatsApp Image 2025-10-31 at 22.57.47 (1).jpeg')
    report = load('ops-g3.jpg')
    abp_site = load('abp.png')
    save(fit(crop_rel(report, (0.0, 0.0, 1.0, 0.682)), 1360, 906), 'still-ops-report.jpg', 90)
    save(fit(crop_rel(abp_site, (0.0, 0.0757, 1.0, 1.0)), 1360, 906), 'still-abp.jpg', 90)
    save(filmgrain(grade(fit(crop_rel(cube, (0.0, 0.20, 1.0, 0.73)), 1360, 906),
                         black=5, white=236, sat=1.02, contrast=1.05, bright=1.06), shown=418),
         'still-belkofski-cube.jpg', 88)

    # -- THE CAPABILITY CARDS (Home 06, the owner's decision of 26 Sep 2026) --
    # Home's capability block is a row of photo cards now, one open and four
    # closed to strips (sections/home/CapabilitiesSlider.tsx). /about keeps
    # the chapters and the stills above; these are new files under new names
    # (src/lib/Img.tsx), cut from the same five sources.
    #
    # THE OPEN CARD IS 948 x 742 at 1440 x 900 (the reference's own shape,
    # 1.28:1), and its picture is drawn at that width. A 2x screen wants
    # 1896 x 1484, and no source is that big: every source is a portrait, so
    # the wide crop takes the source's full width and is cut to 1.278:1.
    # Nothing is enlarged. On the phone the open card is 278 x 760 (0.37:1)
    # and the picture is drawn about 304 wide; the tall crop is 0.4:1, which
    # also serves an upright tablet (402-550 wide), and the phone's box
    # trims its sides.
    #
    #   plate                       size        density on its card
    #   geometry  wide / tall   1792x1402 / 760x1900   1.89x / 2.50x
    #   desk      wide / tall   1792x1402 / 760x1900   1.89x / 2.50x
    #   recalibre wide / tall   1600x1252 / 704x1760   1.69x / 2.32x
    #   belkofski wide / tall   1127x 882 / 560x1400   1.19x / 1.84x
    #   ops       wide / tall   1466x1148 / 458x1148   1.55x / 1.51x
    #
    # The grain follows each plate's own drawn width (`shown`): 948 for the
    # wide crop, the open card at 1440, and 304 for the tall crop, the open
    # card at 390 x 844. The grades are the chapter stills' own. The red
    # render stops above 0.88 as every crop of it does (its lower-left
    # corner prints "Recalibre®"). The OPS screen is evidence and is
    # published as captured, with no grade and no grain, like every OPS
    # capture; the card lays its own veil behind the words.
    #
    # THE WORDS SIT ON THE PICTURE, top and foot, in white, so each plate is
    # darkened where they land (`falloff`, in the plate, not over it on the
    # page). Measured on the rendered cards against the brightest tenth of
    # the pixels behind each line, before this: the court lines behind the
    # Belkofski category and number (2.8:1 and 1.4:1), the desk's white
    # papers behind its name and text on a tablet and a phone (3.0:1 and
    # 3.9:1), the paddle's blue behind the Belkofski text on a phone
    # (3.5:1), the red render's text at 1440 (4.1:1) and the geometry's
    # number on a tablet (4.2:1). Each plate gets only the side it needs,
    # at the strength that brings every line to 4.5:1 or better.
    #   (top strength, top reach), (foot strength, foot reach); None = none
    print('capability cards')
    # One graded render is left on the cards (see the chapter stills above
    # for what came off and why): the Belkofski cube, cut wide for the open
    # card and tall for a phone, with the same foot fall-off the red render
    # had so the card's words sit on dark.
    cards = {
        'belkofski-cube': (cube, (0.00, 0.19, 1.00, 0.742), (0.216, 0.00, 0.783, 1.00), (1466, 1148), (458, 1148),
                           dict(black=5, white=236, sat=1.02, contrast=1.05, bright=1.06), None, (0.45, 0.5)),
    }

    def words(im, top, foot):
        if top:
            im = falloff(im, side='top', strength=top[0], reach=top[1])
        if foot:
            im = falloff(im, side='bottom', strength=foot[0], reach=foot[1])
        return im

    for key, (im, wide_box, tall_box, wide_size, tall_size, g, top, foot) in cards.items():
        save(filmgrain(words(grade(fit(crop_rel(im, wide_box), *wide_size), **g), top, foot), shown=948),
             f'cap-{key}-wide.jpg', 88)
        save(filmgrain(words(grade(fit(crop_rel(im, tall_box), *tall_size), **g), top, foot), shown=304),
             f'cap-{key}-tall.jpg', 88)
    # THE TWO CAPTURES, FLAT. The daily report (ops-g3.jpg, 1400 x 1368):
    # the wide card takes its header, the three counters, the day's detail
    # and the signature; the tall one is the detail column. The ABP site
    # (abp.png, 2290 x 1652): the wide card is the page less 90px of each
    # margin; the tall one is its left third, the headline and the yellow
    # plate. Published as shot, q90.
    save(fit(crop_rel(report, (0.0, 0.0, 1.0, 0.8012)), 1466, 1148), 'cap-report-wide.jpg', 90)
    save(fit(crop_rel(report, (0.243, 0.0, 0.634, 1.0)), 458, 1148), 'cap-report-tall.jpg', 90)
    save(fit(crop_rel(abp_site, (0.039, 0.0, 0.961, 1.0)), 1466, 1148), 'cap-abp-wide.jpg', 90)
    save(fit(crop_rel(abp_site, (0.0, 0.0, 0.2882, 1.0)), 458, 1148), 'cap-abp-tall.jpg', 90)

    # -- THE SHARE CARDS ------------------------------------------------------
    # Every route was pasting the same tall machine render into other people's
    # chat windows, under the same title, so eight different pages produced
    # one indistinguishable preview. These are 1200 x 630 — the size every
    # platform crops to — and each one belongs to the page it is attached to.
    print('share cards')
    # The home and Contact cards show the room's wall, so since 25 September
    # 2026 they are cut from the repaired webp (no "//"), under new names;
    # frame and grade are unchanged.
    og = {
        'og-home-nomark.jpg': (show,   (0.052, 0.22, 0.600, 0.72),  dict(black=5, white=214, sat=0.45, contrast=1.06, bright=0.84)),
        'og-about.jpg':      (desk,   (0.02,  0.12, 0.98,  0.78),  dict(black=5, white=232, sat=0.85, contrast=1.04, bright=1.18)),
        'og-insights.jpg':   (geo,    (0.04,  0.10, 0.96,  0.68),  dict(black=5, white=238, sat=0.9,  contrast=1.06, bright=1.1)),
        'og-contact-nomark.jpg': (show,   (0.10,  0.24, 0.58,  0.76),  dict(black=5, white=224, sat=0.60, contrast=1.04, bright=0.94)),
        'og-work.jpg':       (court,  (0.0,   0.22, 1.0,   0.68),  dict(black=6, white=244, sat=1.04, contrast=1.02)),
        'og-ops.jpg':        (load('ops-g1.jpg'), (0.0, 0.0, 1.0, 0.53), dict(black=8, white=250, sat=1.04, contrast=1.02)),
        'og-belkofski.jpg':  (frames, (0.04,  0.12, 1.0,   0.94),  dict(black=4, white=240, sat=1.08, contrast=1.05, bright=1.3)),
        # Contraxis has no photograph of its own and will not be given one.
        # Its card is the firm's render, and the description under it says
        # the product is at concept stage.
        'og-abp.jpg':        (abp,    (0.40,  0.0,  1.0,   0.725), dict(black=6, white=240, sat=1.04, contrast=1.02, bright=1.35)),
        # Contraxis has no photograph of its own and will not be given one.
        'og-contraxis.jpg':  (red,    (0.0,   0.10, 1.0,   0.66),  dict(black=5, white=236, sat=1.02, contrast=1.05, bright=1.06)),
    }
    for name, (im, box, g) in og.items():
        save(grade(fit(crop_rel(im, box), 1200, 630), **g), name, 86)

    # THE THREE ARTICLE CARDS. Each article was sending its own page picture
    # as its preview — a 1500 x 2000 portrait for one, a 2200 x 1238 capture
    # for the other two — and every platform cropped them its own way. These
    # are the same three pictures at the card size. The geometry card is a
    # band of the render below the one the article frames, because the top
    # of that frame is empty black at this shape. The two OPS captures are
    # interfaces: the no-signal and permits screens of OPS, mob-plate-1.png
    # and ops-plate-3.png in `assets`. The cards used to be cut from two
    # 2200px reductions of those files kept in public/img (ops-field-wide.png
    # and ops-permits-wide.png). Those copies were deleted on 25 September
    # 2026; the same reduction — LANCZOS to 2200 x 1238, which reproduces
    # both copies pixel for pixel — is made here from the originals, so the
    # cards are byte for byte what they were. They are published clean — no
    # grade, no grain — as every interface capture on the site is.
    save(grade(fit(crop_rel(geo, (0.10, 0.22, 0.94, 0.549)), 1200, 630),
               black=5, white=238, sat=0.9, contrast=1.06, bright=1.1),
         'og-human-oversight.jpg', 86)
    for name, capture in (('og-offline-first.jpg', 'mob-plate-1.png'),
                          ('og-right-to-left.jpg', 'ops-plate-3.png')):
        shot = load(capture).resize((2200, 1238), Image.LANCZOS)
        save(fit(crop_rel(shot, (0.0, 0.0, 1.0, 0.933)), 1200, 630), name, 86)

    # -- THE ABOUT PAGE'S PORTRAIT --------------------------------------------
    # The owner put the founder portrait in About's accountability block on
    # 25 September 2026, no name and no title. The block draws it 240 wide,
    # twice the home card's 120, and the home plate is 360 wide, which is
    # 1.5x there: too soft for a 2x screen. So the same frame is cut again
    # at 480 x 616, the home plate's own shape, with exactly the home
    # plate's grade and grain and nothing added; only `shown` follows the
    # width the page draws it at, as the filmgrain docstring asks.
    print('about portrait')
    save(filmgrain(grade(fit(load('founder-portrait.webp'), 480, 616),
                         black=4, white=245, sat=0.0, contrast=1.10, bright=0.92),
                   amount=14, shown=240),
         'plate-about-founder.jpg', 90)


if __name__ == '__main__':
    if '--check' in sys.argv:
        import glob
        for f in sorted(glob.glob(os.path.join(OUT, '*.jpg'))):
            report(f)
    else:
        build()
