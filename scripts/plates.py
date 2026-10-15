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


def scrim(im, side, reach, stops, rows=(0.0, 1.0), colour=(5, 5, 5)):
    """
    A card's gradient scrim, laid into the file instead of over the page
    (Phase C, 28 September 2026: the project's rule, grade in the plate and
    never dim media at runtime, applied to the last gradients the pages
    still laid over a picture).

    It reproduces the page's own gradient, not an approximation of it: a
    sheet of the page ground (#050505) whose opacity runs through `stops`,
    (position, opacity) pairs from the edge the gradient starts at (0) to
    `reach` (1), exactly as the CSS gave them, and nothing beyond `reach`.
    `side` is that edge, 'bottom' or 'top'; `reach` is a fraction of the
    BOX's height, not the plate's. The browser composited the sheet in sRGB
    over the finished picture, after its grain, and so does this: call it
    last, after `filmgrain` and `wash`. Measured on renders of the Phase B
    build at 1440, 1200, 1024, 810, 600 and 390, the darkening each scrim
    gave, row by row, matched these stops to within 0.01.

    `rows` is the band of the plate the box shows, top and bottom, as
    fractions of its height. A plate drawn whole in a box of its own shape
    is (0, 1); one drawn with the 1.1 push is (0.0455, 0.9545). It only
    holds where the box is never wider than the plate's shape, so that
    `cover` fits the plate by its height and trims only its sides: that is
    why each scrimmed plate is cut to the widest box it is drawn in.
    """
    w, h = im.size
    top, bottom = rows
    mask = Image.new('L', (1, h))
    px = mask.load()
    for y in range(h):
        b = min(1.0, max(0.0, ((y + 0.5) / h - top) / (bottom - top)))
        t = (1.0 - b if side == 'bottom' else b) / reach
        a = 0.0
        for (p0, a0), (p1, a1) in zip(stops, stops[1:]):
            if p0 <= t <= p1:
                a = a0 + (a1 - a0) * (t - p0) / (p1 - p0)
                break
        px[0, y] = round(255 * a)
    mask = mask.resize((w, h), Image.NEAREST)
    return Image.composite(Image.new('RGB', (w, h), colour), im, mask)


# The three scrims the pages laid over their photographs until 28 September
# 2026, as their CSS gave them (see `scrim`):
#   the work card's foot    (WorkCard.tsx, a dark picture) 48% of the card:
#                           92% ground at the foot, 38% halfway, none at the top
#   the More-work card      (work/[slug]/page.tsx) the whole card: 85% at the
#                           foot, 10% halfway, none at the top
#   the Contact card        (contact/page.tsx) 52% from the foot: 100%, 72%
#                           halfway, none; and 38% from the top: 72%, none
WORK_FOOT = ('bottom', 0.48, ((0.0, 0.92), (0.5, 0.38), (1.0, 0.0)))
# The work card's foot for ABP Continental, deeper than the page's was. Its
# picture is the site's photograph of steel at dusk, and under the page's
# scrim the words on it fell short of 4.5:1 against the brightest tenth of
# the pixels behind them: the meta line at 3.3 on the work index at 1440
# and 3.0 at 1200 (the index prints the summary, so its words stand to
# 43% of the card), and the first tag at 3.3 on Home at 600 (the tags
# wrap to three rows there). This one holds 92% at the foot, 60% at 36%
# of the card and 30% at 51%, and is gone at 60%: rendered in place of
# the page's scrim, every line on the card reads 4.8:1 or better at 1440,
# 1200, 1024, 810 and 600, on Home and on the index. The centre mark sits above
# it. Belkofski keeps the page's own depth (WORK_FOOT): the same deeper
# foot would dim the frames on the paddle, the card's subject.
WORK_FOOT_DEEP = ('bottom', 0.60, ((0.0, 0.92), (0.6, 0.6), (0.85, 0.3), (1.0, 0.0)))
MORE_FOOT = ('bottom', 1.0, ((0.0, 0.85), (0.5, 0.10), (1.0, 0.0)))
# The "More work" foot as the plates lay it: a little deeper in the card's
# lower quarter than the page's, 94% at the foot and 62% at a quarter of
# its height, and from halfway up as light as it was (14% there, the
# page's 10%, fading to none at the top). Under the page's own
# the first tag read 3.9:1 (Belkofski) and 4.3:1 (ABP) at 810, against the
# brightest tenth behind it; rendered in place of the page's gradient at
# 1440, 1200, 1024, 810, 600 and 390, every small line reads 4.7:1 or
# better, and the names (28px and up) 3.7:1 or better, as before.
MORE_FOOT_DEEP = ('bottom', 1.0, ((0.0, 0.94), (0.25, 0.62), (0.5, 0.14), (1.0, 0.0)))
# THE TALL FOOT (Phase C, 28 September 2026), for the two photographs'
# cards where the words stand to about half the card: the work index from
# 1200 up (Home's small squares from 600 to 809 drew it too, until Home's
# grid went to one column there on 29 September 2026), which prints the summary (the meta line at
# 48% of the card at 1200). The caption and the meta lines print with no
# box behind them since that day, so the foot holds 86% to 41% of the card
# and fades out by 75%; measured on renders at 600, 700, 809, 1200 and
# 1440, every small line reads 4.5:1 or better against the brightest
# tenth behind it. Drawn only there (`coverCard`); the
# larger squares keep their own feet above.
CARD_FOOT_TALL = ('bottom', 0.75, ((0.0, 0.94), (0.55, 0.86), (0.8, 0.55), (1.0, 0.0)))
CONTACT_FOOT = ('bottom', 0.52, ((0.0, 1.0), (0.5, 0.72), (1.0, 0.0)))
CONTACT_HEAD = ('top', 0.38, ((0.0, 0.72), (1.0, 0.0)))
PUSH_SM = (0.05 / 1.1, 1.05 / 1.1)  # the band a 1.1 push shows: 0.0455-0.9545


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
    # The "//" painted on the wall is taken off the master before any crop;
    # see `unslash`. Every crop of the room but the laptop hero plate is cut
    # from the repaired master (the owner's yes of 25 September 2026: the
    # mark comes off every picture that shows it). The lossy webp copy is no
    # longer read: the two share cards that were cut from it (the room
    # with the stock face still on the television) are cut from `room`
    # below since 28 September 2026, so the set shows OPS everywhere.
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
    # Published at the size the room holds there, 1198 x 1630 (28 September
    # 2026): the phone panel grew from 960 to 1060 and the 1000 x 1360 cut
    # was drawn 1.7x. Same crop, same grade, same grain at the drawn size;
    # new bytes, new name (`-e`).
    tall = falloff(grade(fit(crop_rel(room, (0.2755, 0.0, 0.575, 0.7244)), 1198, 1630),
                         black=5, white=214, sat=0.40, contrast=1.06, bright=0.92, gamma=1.2),
                   'top', strength=0.78, reach=0.88, curve=1.3)
    save(filmgrain(tall, amount=18, shown=390), 'plate-hero-wall-tall-e.jpg', 88)

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
    abp_card = filmgrain(grade(crop_rel(abp, (0.48472, 0.0, 1.0, 0.71429)),
                               black=6, white=240, sat=1.06, contrast=1.0,
                               bright=1.55, gamma=1.12),
                         shown=687)
    save(abp_card, 'card-abp.jpg', 90)
    # THE CARD'S FOOT IS IN THE FILE NOW (Phase C, 28 September 2026). The
    # work card laid its scrim over this square wherever its words sit on
    # the picture (Home from 600 up, the work index from 1200 up); a foot
    # is laid here instead, the square drawn whole in a square box, so the
    # page draws it at full strength with nothing over it. It is deeper
    # than the page's was, so that every line on the card reads 4.5:1 (see
    # WORK_FOOT_DEEP). The clean square above stays for the layouts whose
    # words sit under the picture (Home below 600, the work index below
    # 1200), where nothing was ever dimmed. See `scrim`.
    save(scrim(abp_card, *WORK_FOOT_DEEP), 'card-abp-foot-a.jpg', 90)
    # And the tall foot, for the index (see
    # CARD_FOOT_TALL).
    save(scrim(abp_card, *CARD_FOOT_TALL), 'card-abp-foot-deep-a.jpg', 90)
    # And the "More work" card's foot, which is the whole card. That card is
    # 1.6:1, so this is the middle band of the square that `cover` showed
    # there, 1180 x 738; on a tablet, beside the diagram, the card stands
    # 4:3 and was cropped from the top (`coverFrom`), so that shape has its
    # own cut, the square's top 1180 x 885. Each is the card's own shape,
    # so the foot lands where the page laid it.
    save(scrim(abp_card.crop((0, 221, 1180, 959)), *MORE_FOOT_DEEP), 'card-abp-more-a.jpg', 90)
    save(scrim(abp_card.crop((0, 0, 1180, 885)), *MORE_FOOT_DEEP), 'card-abp-more-tall-a.jpg', 90)

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
    bk_card = filmgrain(grade(crop_rel(court, (0.17241, 0.16493, 0.87284, 0.72917)),
                              black=6, white=246, sat=1.06, contrast=1.04), shown=687)
    save(bk_card, 'card-belkofski.jpg', 88)
    # The foot in the file, as on ABP's square above, at the page's own
    # depth (WORK_FOOT): every line reads 4.5:1 or better from 1024 up, and
    # a deeper foot would dim the frames on the paddle. On Home's small 2 x
    # 2 (600-809) the first tag, where the tags wrap into the picture, reads
    # 2.7-4.5:1, as it did under the page's scrim. Then the "More work"
    # card's foot on the square's 1.6:1 middle band (1300 x 812) and on the
    # 4:3 a tablet gives it beside the diagram, centred (1300 x 975). The
    # square is drawn only where the card's words sit on it; below that the
    # phone crop is drawn, clean.
    save(scrim(bk_card, *WORK_FOOT), 'card-belkofski-foot-a.jpg', 88)
    # The tall foot, where the words stand to half the card: the index,
    # which prints the summary (see CARD_FOOT_TALL). Home's small squares
    # drew it too until 29 September 2026, when its 600-809 grid went to
    # one column of full-width squares.
    save(scrim(bk_card, *CARD_FOOT_TALL), 'card-belkofski-foot-deep-a.jpg', 88)
    save(scrim(bk_card.crop((0, 244, 1300, 1056)), *MORE_FOOT_DEEP), 'card-belkofski-more-a.jpg', 88)
    save(scrim(bk_card.crop((0, 162, 1300, 1137)), *MORE_FOOT_DEEP), 'card-belkofski-more-tall-a.jpg', 88)

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
    # The card this fills carries the Recalibre mark across its top, and
    # the plate is a white screen. A narrow band at each end used to be
    # darkened here, on top of a grade and a grain. All three came off on
    # 25 September 2026: the picture is evidence, and evidence is published
    # as shot (B-31; see the OPS card above). The card still lays its own
    # dark fade across the top 26% and the foot 30% (src/sections/home/
    # Spotlight.tsx), which is what keeps the mark readable: a product
    # capture's veil belongs to the card, not to the picture, and it is the
    # one runtime shade the site keeps (Phase C, 28 September 2026). New
    # bytes, new name; the old plate-ops-tall.jpg is deleted.
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
    mob = load('mob-plate-1.png')
    save(fit(crop_rel(mob, (0.158, 0.451, 0.3676, 0.962)), 687, 942), 'plate-ops-offline.jpg', 90)
    # THE SAME SHEET FOR A TABLET (28 September 2026). Below 1200 the block
    # is one column and the media card is (viewport - 52) x 520, a landscape
    # box from 758 x 520 to 1147 x 520, while the plate above is a portrait
    # 687 x 942: cover-cropped, the box showed rows 287-655 of it at 1024
    # (235-707 at 810) and the "hors ligne" chip (rows 49-71) was outside
    # the frame. This is the same window in mob-plate-1.png cut 1:1 at the
    # box's largest size, 1148 x 520, from the app window's own left edge
    # (x=458: no grid paper, no rounded window) across the "Ma journee"
    # panel (x 504-982) and the left of the "Sur le terrain" list beside it.
    # Phase B (the same day) gave the card this cut's own 1148:520 shape at
    # every tablet width, so it is drawn whole there, at 1:1 at 1199 and
    # smaller below. Evidence, published as shot; new bytes, new name.
    #
    # MOVED 36 ROWS LOWER (Phase C, 28 September 2026; it was
    # plate-ops-offline-tablet-a.jpg, rows 600-1120, now retired). The tails
    # of the KPI cards' captions (source rows 618-634, "3 équipes
    # mobilisées") showed faintly under the card's top veil. This cut starts
    # at row 636, under them, and its edges fall between lines of type; the
    # "hors ligne" chip (rows 730-748) lands at y 94-112. From 600 to 1199
    # the card's top fade and its patch behind the mark are shallow enough
    # (17% and 14% of the card, 88px and 72px at its full 520, Spotlight.tsx)
    # to hold the mark and leave the chip clear at every scale the card
    # draws this cut (0.66 at 810 to 1.0 at 1199). A pixel crop, 1:1, no resampling.
    save(mob.crop((458, 636, 1606, 1156)), 'plate-ops-offline-tablet-b.jpg', 90)
    # THE NARROW TABLET'S CUT WAS DROPPED (28 September 2026). A 541 x 245
    # cut of the day panel alone, (473, 670)-(1014, 915), served 810 to
    # 1023px, where the card drew it 1.40x (810) to 1.79x (1023) on a 1x
    # screen and twice that on a 2x one: blurrier than the tablet cut above,
    # which the no-downgrade rule forbids. 810 to 1199 keeps the cut above,
    # anchored left; the list on the right is cut at the card's edge at 810,
    # recorded as the lesser cost. Only a larger capture of this panel would
    # give the narrow tablet its own sharp frame.
    # THE PHONE'S OWN CUT (Phase C, 28 September 2026; the phone-crop
    # panel's winner, three judges to none). On a phone the card is a 346
    # to 386 x 520 upright box, and the portrait sheet above put the chip
    # and the clock under the top veil. It serves below 600: wider, `cover`
    # fits it by its width and pushes the chip back under the veil (at
    # 700), so from 600 to 809 the 1148 cut above serves, drawn 1:1 from
    # the left, the chip at y 131-149. This frame starts lower on the same
    # panel, source (466, 499)-(1010, 1224), native 544 x 725, and is cut
    # to 538 x 725 (0.742, the box at 430), never enlarged in the file. A
    # 2x phone draws it 1.43x (390) to 1.45x (430) of the source's pixels;
    # the sheet above, already enlarged 1.2x in its file, reached 1.33x
    # there. Only a larger capture of this panel would draw it sharp.
    # Evidence, published as shot.
    # `-b` (29 September 2026): the frame's top rows, source y 499-698, held
    # the foot of a desktop stat card ("Techniciens équipés / 11 / 3 équipes
    # mobilisées", to row 668, its shadow to 698), which showed under the
    # "/// Recalibre" mark through the top veil. Those rows are laid to the
    # capture's own ground, #f2f1ef, sampled beside the phone at its top
    # edge (the phone's frame starts at row 699), before the cut, so the
    # veil lands on plain ground. The rest is the -a frame as shot.
    ops_phone = mob.crop((466, 499, 1010, 1224))
    ops_phone.paste((242, 241, 239), (0, 0, 544, 699 - 499))
    save(fit(ops_phone, 538, 725), 'plate-ops-offline-phone-b.jpg', 90)

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
    # 1100 (audit item D-23). The card's 34% is in the file (`wash`).
    CONTACT = dict(black=5, white=226, sat=0.62, contrast=1.04, bright=0.92)
    contact = wash(filmgrain(grade(fit(crop_rel(room, (0.20, 0.20, 0.55, 0.92)), 1255, 1620),
                                   **CONTACT), shown=810), 0.34)
    # `-b` (27 September 2026) was this cut as published, from the room with
    # OPS on the television. It is no longer saved (28 September 2026): the
    # page draws `-c` and its two wider cuts instead, and the file is gone.
    #
    # ITS TWO FADES ARE IN THE FILE NOW, `-c` (Phase C, 28 September 2026).
    # The page laid a fade over the head of the card, where the heading
    # sits, and a deeper one up from the foot, under the address block;
    # they are laid here instead (CONTACT_HEAD, CONTACT_FOOT), on the same
    # cut, over the grain and the wash as the browser laid them, and the
    # page draws nothing over the picture. They hold where the card is
    # upright, from 1200 up and below 460 (687 x 955 at 1440, 346 x
    # 673 at 390): there `cover` fits the plate by its height, the 1.1
    # push shows its rows 0.0455-0.9545 (PUSH_SM), and the fades land
    # where the page laid them. At the page's depth one line falls short
    # of 4.5:1, as it did: the small EMAIL label, between the two fades,
    # reads 4.5 at 1440 and 2.2 at 390 against the brightest tenth behind
    # it. A foot deep enough to lift it to 4.9 (100% at the foot, 80% at
    # 35% of the card, 72% at 56%, none at 70%) was simulated and not
    # taken: it puts the set and its screen in the dark.
    save(scrim(scrim(contact, *CONTACT_FOOT, rows=PUSH_SM), *CONTACT_HEAD, rows=PUSH_SM),
         'plate-room-contact-c.jpg', 88)
    # BETWEEN THOSE WIDTHS THE CARD LIES DOWN. Stacked over the form it is
    # 416 x 537 at 460 (0.775, the upright cut's own shape), 556 x 539 at
    # 600, 765 x 541 at 809, then 758 x 593 at 810 and 1147 x 598 at 1199
    # (1.92:1), and `cover` cut the upright plate to a band across its
    # middle, so its fades would land off the card. So the same room is cut
    # twice more, each wide enough for every box in its range to fit it by
    # its height and trim only its sides, with the same grade, grain, wash
    # and fades. Both keep the blue wall to its own edges (the pillar and
    # the window start at x 570, the glass sign at 2332) and are 1:1:
    #   460-809    1.42:1  source (600, 570)-(2330, 1788), 1730 x 1218: the
    #              chair whole, the set, the ottoman and the lit floor; a 2x
    #              screen draws it 0.97x (600) to 0.98x (809)
    #   810-1199   1.92:1  source (590, 836)-(2330, 1742), 1740 x 906: the
    #              wall above the set, the set and the chair to its seat;
    #              1.44x (810) to 1.45x (1199) on a 2x screen, where the
    #              upright cut reached 1.33x (810) and 1.70x (1024)
    # The grain follows the width each is drawn at: about 840 at 809 and
    # 1260 at 1024.
    #
    # THE 460-809 CUT MOVED UP, `-mid-b` (28 September 2026). At 460 to
    # about 475 the card is at its narrowest in that range and the intro
    # paragraph wraps to four lines, which reached the television's pale
    # top edge (source row 1142, 36% down the card): its brightest tenth
    # read 2.75:1 at 460 and 2.86 at 470. The same 1730 x 1218 frame now
    # starts 120 rows higher, on the plain wall (rows 570-690 are the same
    # smooth blue as the rows under them), so the set's top lands 47% down
    # the card, clear of the words, and the frame ends at row 1788, still
    # under the chair's feet (row 1730). Same grade, grain, wash and fades.
    # `-mid-a` is no longer saved and its file is gone.
    for name, box, shown in (('plate-room-contact-mid-b.jpg', (600, 570, 2330, 1788), 840),
                             ('plate-room-contact-wide-a.jpg', (590, 836, 2330, 1742), 1260)):
        wide = wash(filmgrain(grade(room.crop(box), **CONTACT), shown=shown), 0.34)
        save(scrim(scrim(wide, *CONTACT_FOOT, rows=PUSH_SM), *CONTACT_HEAD, rows=PUSH_SM), name, 88)

    # -- THE ROOM, THREE MORE TIMES (28 September 2026) -----------------------
    # THE BORROWED PICTURES ARE GONE. The desk photograph (dorwa-svc-web.jpg)
    # on the About band and the wireframe-geometry render (dorwa-svc-3d.jpg)
    # on the Insights index and the 404 were a partner's renders, and the
    # owner's brief of 27 September 2026 (section 29) allows only Recalibre's
    # own work, a client's work, Recalibre's own art direction or a
    # purpose-built product picture. The rendered room is the firm's own art
    # direction, so the three slots are cut from it, each a different part
    # of the room from the hero's, chosen by a three-judge panel on 28
    # September 2026 (composition, brand, and no-downgrade lenses):
    #
    #   About band      the seat: the chair facing the set with OPS on it,
    #                   the ottoman, the foot of the sign. A1 of four.
    #   Insights plate  the set straight on, the ottoman below. I3 of three.
    #   404             the plain blue wall below the ceiling line, nothing
    #                   under the card. N3 of three, re-cut from the master
    #                   so the set's corner and the glass mullion are out.
    #
    # The grade is the hero's family, a touch less bright (ceiling 232,
    # gamma 1.2, saturation 0.45), so the room reads as one room across the
    # site; the 404 keeps the contact plate's grade and its panel's 38% in
    # the file (`wash`). The old plate-desk-wide.jpg, plate-desk-tall-2x.jpg,
    # plate-geometry-404.jpg and render-geometry.jpg, and their recipes, are
    # deleted.
    print('the room, again')
    ROOM = dict(black=5, white=232, sat=0.45, contrast=1.06, bright=0.92, gamma=1.2)
    # The About band, 1380 x 757 on a laptop, prints the firm's mark at its
    # bottom right, so the foot is darkened in the plate (the hero's bottom
    # falloff), never by a sheet laid over it on the page.
    seat = grade(fit(crop_rel(room, (0.17, 0.40, 0.66, 0.87)), 2000, 1100), **ROOM)
    seat = falloff(seat, 'bottom', strength=0.55, reach=0.40)
    save(filmgrain(seat, amount=18, shown=1380), 'plate-about-seat-a.jpg', 88)
    # THE PHONE HAS ITS OWN CUT (the judges' one condition on A1): the band
    # is 4:5 on a phone, and the centre strip of the wide plate cut the chair
    # in half. This frame holds the whole chair and the set's left two
    # thirds, on the rule of the brief's section 35: the crop is designed,
    # never left to the browser.
    # Published at the size the source holds there (1240 x 1575 native): the
    # first cut, 880 x 1100, was enlarged on a 430px phone and on an upright
    # tablet. New bytes, new name (`-b`).
    seat_tall = grade(fit(crop_rel(room, (0.19, 0.30, 0.50, 1.0)), 1240, 1550), **ROOM)
    seat_tall = falloff(seat_tall, 'bottom', strength=0.55, reach=0.40)
    save(filmgrain(seat_tall, amount=18, shown=350), 'plate-about-seat-tall-b.jpg', 88)
    # The Insights plate: 687 x 723 beside three article rows, the same
    # 20:21 shape the desk plate had.
    save(filmgrain(grade(fit(crop_rel(room, (0.30, 0.40, 0.62, 0.82)), 1460, 1533), **ROOM),
                   amount=18, shown=687),
         'plate-insights-set-a.jpg', 88)
    # ITS OWN CUT BELOW 1200 (Phase C, 28 September 2026). There the plate
    # stands in a 16:10 box, 972 x 608 at 1024 and 1147 x 717 at 1199, and
    # the upright plate above, cut to it, was a band across the face of the
    # set: a grey slab of screen with no room around it. This is the set
    # with its wall at 16:10, straight on, source (1182, 1000)-(2330, 1718):
    # 141px of wall above the set, the set on its legs, and the chair's arm
    # coming in at the lower left. The frame is 1148 wide because that is
    # the box at 1199; the room gives no wider frame of the set there
    # without the glass sign (from x 2332, the frame's right edge) or more
    # of the chair. 1:1, so it is never enlarged on a 1x screen. The same
    # grade and grain as the plate above, the grain for the 1024 box.
    save(filmgrain(grade(room.crop((1182, 1000, 2330, 1718)), **ROOM), amount=18, shown=972),
         'plate-insights-set-tablet-a.jpg', 88)
    # The 404: the wall, drawn 1380 x 720 under a centred card. The frame
    # stops above the set's top bezel (0.50 of the source; the bezel is at
    # 0.507), right of the glass mullion at the room's left edge, and BELOW
    # the ceiling line (0.145): the first cut started at 0.08 and carried a
    # black band across the top that read as a crop error, and the phone's
    # card sat on the line. Published at the size the source holds there.
    WALL = dict(black=5, white=226, sat=0.62, contrast=1.04, bright=0.92)
    save(wash(filmgrain(grade(crop_rel(room, (0.15, 0.155, 0.58, 0.50)), **WALL), shown=1380), 0.38),
         'plate-wall-404-b.jpg', 88)
    # The phone's own cut of the same wall: the box is upright there, and
    # the wide cut cover-scaled through it was enlarged. The whole clean
    # wall left of the set (its outer edge is at 0.3615), from the ceiling
    # line down, 820 x 1091: the first cut (660 wide) was drawn 1.17x at
    # 390 and 1.3x at 430, because the phone box is wider than the frame
    # and the panel's 1.1 push was on top. The page turns the push off
    # below 810 (not-found.tsx), so this is drawn at about 0.95.
    save(wash(filmgrain(grade(crop_rel(room, (0.15, 0.155, 0.355, 0.64)), **WALL), shown=350), 0.38),
         'plate-wall-404-tall-b.jpg', 88)

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
    # Chapter 02's phone cut (Phase C, 28 September 2026; the phone-crop
    # panel's winner, three judges to none). Below 810 the still is drawn
    # 350 to 390 wide, and the whole report at that width is a picture of
    # a form nobody can read. This is the Détail card with its trail and
    # attachments and the whole Signature card, source (334, 330)-(1351,
    # 1008), 1017 x 678, reduced to 780 x 520 (1.5:1), no word cut.
    # Evidence, published as shot.
    save(fit(crop_rel(report, (0.2386, 0.2412, 0.965, 0.7368)), 780, 520), 'still-ops-report-phone-a.jpg', 90)
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
    #   ops       wide / tall   1466x1148 / 411x1031   1.55x / 1.26x
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

    # THE CARD'S SHADE IS IN THE FILE NOW, `-b` (Phase C, 28 September
    # 2026). The carousel laid the reference's gradient (`.cap-shade`) over
    # every card, top to bottom: black at 18% at the top, none at 32%,
    # 32.76% at 62% and 78% at the foot. On this graded render it is laid
    # here instead (CAP_SHADE), over the grain as the browser laid it, and
    # the card draws no shade over it. Each cut is the shape of the open
    # card it is drawn in (the wide one 1440 x 900's, the tall one a phone's),
    # so `cover` shows all its rows there. A shorter window crops a few rows
    # off the top and the foot (at 1440 x 800 rows 0.035-0.965), which moves
    # the shade by that much and no more. The capture on card 02 (the
    # daily report) is published flat, and its shade stays the card's, as
    # the OPS veils do; the ABP card is a photograph with its own shade in
    # the file (ABP_SHADE, below).
    CAP_SHADE = ('bottom', 1.0, ((0.0, 0.78), (0.38, 0.3276), (0.68, 0.0), (1.0, 0.18)))
    # THE CUBE'S OWN SHADE, `-d` (30 September 2026). Under the shared
    # shade the card's body read 3.88:1 at 1440 and its category line
    # 1.44:1 at 600, where it crosses the lit gantry block. The first fix
    # (`-c`, 29 September) darkened the whole render, the gantry and the
    # cube's lower half included, and still read 2.11:1 at 600, where the
    # tall cut was drawn wider than itself and its top rows fell outside the
    # card. These stops keep the foot band the words sit on as deep as `-c`
    # (85% at the foot, 55% at 38% up), then fall faster (20% at 55% up,
    # clear at 70% up, where `-c` still laid 22%), and rise again toward the
    # top edge the category line sits under (15% at 86% up, 55% at 93%, 70%
    # at the edge; `-c` laid 37 to 50% there).
    # A shade in the file holds only where every row shows: from 600 up the
    # card draws the wide cut, which shows every row in every open card
    # (sections/home/CapabilitiesSlider.tsx, PHONE_ONLY), and a phone's card
    # is narrower than the tall cut's own 0.399 (a phone 800px tall or
    # more). The wide cut, measured line by line at 600, 700, 768, 809, 810,
    # 1024, 1280 x 720 and 1440: every line 4.69:1 or better.
    CUBE_SHADE = ('bottom', 1.0, ((0.0, 0.85), (0.38, 0.55), (0.55, 0.2), (0.70, 0.0), (0.86, 0.15),
                                  (0.93, 0.55), (1.0, 0.7)))
    # THE PHONE CUT'S OWN TOP, `-e` (1 October 2026). On a 360 x 800 phone
    # the category line runs three lines and its third, at about 92% up,
    # crossed the gantry's lit head at 3.09:1 under CUBE_SHADE. The phone
    # cut keeps CUBE_SHADE to 86% up (the gantry block, 77-88% up, stays
    # lit), then rises steeply: 30% at 88.5%, 72% at 90%, 78% at the edge.
    # Line by line: 4.58:1 or better at 360 x 800, 390 x 844 and 430 x 932.
    # The gantry's red clamp and cable loop, above the block, read darker.
    # Not solved by the file: on a 320 x 800 phone the title's "and" and the
    # first line of the text cross the cube's lit top face (1.39 and 4.36:1
    # at their worst tenth), and on short phones (360 x 640, 375 x 667) the
    # card is shorter than the cut, so the title lands on the cube (1.43 and
    # 2.58:1) and the category line on the gantry (2.02 and 3.90:1). Phase B
    # read 1.3-1.8:1 there. Carried to Phase D (a cut for
    # short and narrow phones).
    CUBE_TALL_SHADE = ('bottom', 1.0, ((0.0, 0.85), (0.38, 0.55), (0.55, 0.2), (0.70, 0.0), (0.86, 0.15),
                                       (0.885, 0.3), (0.90, 0.72), (1.0, 0.78)))
    for key, (im, wide_box, tall_box, wide_size, tall_size, g, top, foot) in cards.items():
        save(scrim(filmgrain(words(grade(fit(crop_rel(im, wide_box), *wide_size), **g), top, foot), shown=948),
                   *CUBE_SHADE, colour=(0, 0, 0)),
             f'cap-{key}-wide-d.jpg', 88)
        save(scrim(filmgrain(words(grade(fit(crop_rel(im, tall_box), *tall_size), **g), top, foot), shown=304),
                   *CUBE_TALL_SHADE, colour=(0, 0, 0)),
             f'cap-{key}-tall-e.jpg', 88)
    # THE CAPTURE, FLAT. The daily report (ops-g3.jpg, 1400 x 1368): the
    # wide card takes its header, the three counters, the day's detail and
    # the signature; the tall one is the report's right-hand column (`-b`,
    # below). Published as shot, q90. (The ABP site's cuts, below, are the
    # photograph only.)
    save(fit(crop_rel(report, (0.0, 0.0, 1.0, 0.8012)), 1466, 1148), 'cap-report-wide.jpg', 90)
    # THE TALL CARD'S NEW CUT, `-b` (Phase C, 28 September 2026; the
    # phone-crop panel's winner, three judges to none). The first cut
    # (cap-report-tall.jpg, now deleted) was the report's left column from
    # the top: the header, the counters and the day's detail, its lines cut
    # off at the frame's right edge. This is the right-hand column: the
    # attachments, the signature with its countersignature, and the hours
    # and states of the day's interventions (the crew's name is cut at the
    # left edge there, under the card's words), source (958, 337)-(1370,
    # 1368), 412 x 1031, cut to 411 x 1031 (0.399, the open card's shape).
    # The window ends at x 1367, so the right 2-3px are its grey border,
    # under the card's dark ground. The source gives no more: it is drawn
    # 1.36x at 390 and 1.53x at 430 on a 2x phone, 2.29x at 430 on 3x, and
    # 1.9-2.2x from 600 to 809 and on 2x upright tablets. Evidence,
    # published as shot.
    save(fit(crop_rel(report, (0.6843, 0.2463, 0.9786, 1.0)), 411, 1031), 'cap-report-tall-b.jpg', 90)
    # THE ABP CARD IS THE PHOTOGRAPH ONLY, `-b` (Phase C, 29 September 2026).
    # The first cuts (cap-abp-wide.jpg and cap-abp-tall.jpg, now deleted)
    # were the page whole and its left third: the card's name and text sat
    # on the site's own headline, and the strip's label on its yellow plate.
    # These are cut from the same capture to the steel-and-crane picture
    # alone, measured on the source's pixels: right of the headline block
    # (its last glyph ends at x 807, the "// HEAVY CONSTRUCTION" line at
    # 483), under the map coordinates (x 2046-2240, rows 140-184) and the
    # menu (rows 30-45), and above the page's hairline (rows 1188-1189),
    # which runs over the yellow plate (from row 1247) and the work-with-us
    # panel (from row 1341). No ABP type, tag, arrow or coordinate is left
    # under the card's words.
    #   wide  source (1031, 196)-(2290, 1182), 1259 x 986, the open card's
    #         1.277. SMALLER THAN THE 1466 x 1148 THE CARD WAS CUT TO, and
    #         published at its native size, never enlarged: the clean
    #         region gives no more. `cover` draws it about 0.75x at 1440.
    #   tall  source (1560, 0)-(2032, 1182), 472 x 1182, the workers on the
    #         beam and the column; cut to 458 x 1148 (0.399).
    # Published clean (no grade, no grain). THE SHADE IS IN THE FILE: the
    # cut is a photograph, not a capture, so the carousel's gradient
    # (`.cap-shade`) is laid here and the card draws none (content/home.ts,
    # `shadeInPlate`).
    # ITS OWN SHADE, `-c` (30 September 2026). Under the shared CAP_SHADE
    # the category line over the dusk sky read 4.09 to 4.46:1, so the card
    # kept the OPS card's two runtime veils; a veil over a photograph breaks
    # the project's rule (grade in the plate, never dim media at runtime).
    # ABP_SHADE is CAP_SHADE up to 68% of the height (clear there); above
    # it, toward the top edge the category line and the number sit under, it
    # rises to 20% at 86% up, 60% at 93% and 78% at the edge (CAP_SHADE
    # lays 10%, 14% and 18% there). The veils are gone
    # (content/home.ts, `veil`). Measured on renders at 360, 390, 430, 600,
    # 700, 768, 809, 810, 1024, 1280 x 720 and 1440: every line 4.94:1 or
    # better (5.34:1 under the veils).
    ABP_SHADE = ('bottom', 1.0, ((0.0, 0.78), (0.38, 0.3276), (0.68, 0.0), (0.86, 0.2), (0.93, 0.6), (1.0, 0.78)))
    save(scrim(abp_site.crop((1031, 196, 2290, 1182)), *ABP_SHADE, colour=(0, 0, 0)), 'cap-abp-wide-c.jpg', 90)
    save(scrim(fit(abp_site.crop((1560, 0, 2032, 1182)), 458, 1148), *ABP_SHADE, colour=(0, 0, 0)),
         'cap-abp-tall-c.jpg', 90)

    # -- THE OPS SCREENS, CUT FOR A PHONE (Phase C, 28 September 2026) -------
    # Below 810 a capture drawn whole is a picture of a screen nobody can
    # read: the interface is shrunk to a third of its size, or `cover` cuts
    # it wherever the box ends. Each slot gets a frame of its own, chosen by
    # a panel of three judges (legibility, composition, honesty) from cuts
    # of the same captures; the winners are cut here exactly as judged. All
    # are evidence, published as shot: no grade, no grain. None is enlarged
    # in its file; where the phone still draws one larger than its pixels,
    # the note says so, and only a larger capture would fix it.
    print('phone cuts')
    permits = load('ops-plate-3.png')
    overview = load('ops-g1.jpg')
    # The permits register with the Arabic line of PTC-2231 through its Zone
    # column and the "21 jours" and "Renouvelé" pills whole, source (884,
    # 938)-(1674, 1530), 790 x 592, reduced to 780 x 585 (4:3). ONE FILE
    # FOR TWO SLOTS: the OPS work card's phone block (Home and the work
    # index) and the right-to-left article's cover, on different pages.
    save(fit(crop_rel(permits, (0.325, 0.6131, 0.6154, 1.0)), 780, 585), 'ops-register-phone-a.jpg', 90)
    # The case page's cover: the header, all four counters, and the
    # Activité and Répartition cards, no word cut, source (372, 52)-(1548,
    # 934), 1176 x 882, reduced to 772 x 579 (4:3).
    save(fit(crop_rel(overview, (0.2325, 0.0346, 0.9675, 0.621)), 772, 579), 'hero-ops-phone-a.jpg', 90)
    # The case page's gallery, 3:4 where the shot allows it. The overview
    # full height, source (384, 0)-(1512, 1504), 1128 x 1504: the right
    # edge clips the "Nouvelle intervention" button and the fourth
    # counter's border, and no word.
    save(fit(crop_rel(overview, (0.24, 0.0, 0.945, 1.0)), 772, 1029), 'ops-overview-tall-a.jpg', 90)
    # The permits: the counters, the whole "Permis par zone" card and the
    # register with the Arabic line, source (890, 450)-(1700, 1530), 810 x
    # 1080.
    save(fit(crop_rel(permits, (0.3272, 0.2941, 0.625, 1.0)), 772, 1029), 'ops-permits-tall-a.jpg', 90)
    # The day without signal, at 4:3 (the judges' fixes all preferred it to
    # a 3:4 that loses columns): the whole sync queue, its title, "2 en
    # file", four rows and the Élément, Origine and État columns, source
    # (96, 25)-(1256, 895) of mob-pair-1.png, 1160 x 870, reduced to 780 x
    # 585. ONE FILE FOR TWO SLOTS: this gallery shot and the offline-first
    # article's cover, on different pages.
    save(fit(crop_rel(load('mob-pair-1.png'), (0.071, 0.0247, 0.929, 0.8826)), 780, 585), 'ops-queue-phone-a.jpg', 90)
    # The daily report's signature column, source (922, 375)-(1368, 970),
    # 446 x 595, cut to 446 x 594 (3:4). The softest of the set: a 2x phone
    # draws it about 1.55x (390) to 1.73x (430). A 2x capture of ops-g3's
    # right column would serve it sharp; none exists.
    save(fit(crop_rel(report, (0.6586, 0.2741, 0.9771, 0.7091)), 446, 594), 'ops-daily-report-tall-a.jpg', 90)

    # -- THE SHARE CARDS ------------------------------------------------------
    # Every route was pasting the same tall machine render into other people's
    # chat windows, under the same title, so eight different pages produced
    # one indistinguishable preview. These are 1200 x 630 — the size every
    # platform crops to — and each one belongs to the page it is attached to.
    print('share cards')
    # THE ROOM'S CARDS ARE CUT FROM THE SAME ROOM AS THE PAGES (28 September
    # 2026). The Home and Contact cards used to come from the lossy webp,
    # which still had the stock striped face on the television; they come
    # from `room` now, so the set shows OPS as it does on every page, with
    # no "//" on the wall. The Home card is the whole room at the card's
    # shape, in the laptop hero's grade; the About and Insights cards are
    # the frames those pages carry since the borrowed pictures came off.
    # New bytes, new names (`-b`, `-a`): the address is the cache key.
    og = {
        'og-home-b.jpg':     (room,   (0.0,   0.0,  1.0,   1.0),   dict(black=5, white=242, sat=0.40, contrast=1.06, bright=0.92, gamma=1.25)),
        'og-about-a.jpg':    (room,   (0.17,  0.40, 0.66,  0.87),  ROOM),
        'og-insights-a.jpg': (room,   (0.30,  0.44, 0.62,  0.78),  ROOM),
        'og-contact-b.jpg':  (room,   (0.10,  0.24, 0.58,  0.76),  dict(black=5, white=224, sat=0.60, contrast=1.04, bright=0.94)),
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
    # are the same three pictures at the card size. The oversight article's
    # page picture was the borrowed geometry render (gone, 28 September
    # 2026: see THE ROOM, THREE MORE TIMES); the page draws the Contraxis
    # system diagram there now, which is a component and not a file, so its
    # card is the room's wall, the frame the 404 shows, without the 404's
    # wash. The two OPS captures are
    # interfaces: the no-signal and permits screens of OPS, mob-plate-1.png
    # and ops-plate-3.png in `assets`. The cards used to be cut from two
    # 2200px reductions of those files kept in public/img (ops-field-wide.png
    # and ops-permits-wide.png). Those copies were deleted on 25 September
    # 2026; the same reduction — LANCZOS to 2200 x 1238, which reproduces
    # both copies pixel for pixel — is made here from the originals, so the
    # cards are byte for byte what they were. They are published clean — no
    # grade, no grain — as every interface capture on the site is.
    # The article's card (28 September 2026): the seats before the set, low,
    # with the floor's light. The first cut was the bare wall with the
    # ceiling band across it, and a share card with no subject is the
    # emptiest picture a link can carry. Native 1840 x 833, reduced.
    save(grade(fit(crop_rel(room, (0.14, 0.58, 0.60, 0.95)), 1200, 630), **ROOM),
         'og-human-oversight-b.jpg', 86)
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
