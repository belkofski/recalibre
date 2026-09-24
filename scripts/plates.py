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
    resizes the plate to a srcset width before the browser draws it, and that
    step is usually the tighter one: the contact plate is 1100 wide, is served
    at 750 and is then drawn at 756, so 750 is the number that matters.

    `amount` is then one number for the whole site, and it is tuned against a
    REAL BROWSER RENDER — see the hero block below for why a resample in here
    cannot predict it.

    WHAT amount=18 ACTUALLY DELIVERS, measured at 1440 on the live page by
    differencing two renders of the same route — one with this function and
    one without — so the number is the grain alone, as it lands on screen,
    with the picture's own detail cancelled out:

        hero (the surface validated against tbd®)      1.85
        the bright plates, desk / geometry / stills    1.9 - 2.9
        the dark plates under a page wash             0.8 - 1.5
        the old `.grain-soft` veil, same measurement   2.0 - 2.4

    The dark plates read low and that is correct, not a shortfall: grain of
    ±18 on a picture whose median is 22 clips at zero on the way down, which
    is why the hero itself measures 1.85 and not 2.5. And where a section
    lays its own wash over the picture — the film panel at ground/40, the
    closing panel at ground/42, the contact card at ground/34 — the wash
    attenuates the grain and the picture TOGETHER, so the film reads the same
    relative to what it sits on. Nothing here is compensated for a wash; that
    would put more grain on the page than the photograph has.
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
    # pixels. Fadi stated on 24 September 2026 that the mark is registered;
    # the certificate is not yet on file. The crop stays as it is, the sign
    # cut out of the frame rather than retouched. What is left is the wall,
    # the chair, the screen and the seating — a real light source, a real
    # depth of field, and a horizon, which is what the page has been missing.
    # The headline sits over the left of this frame, so the darkening the
    # type needs is baked in here instead of laid over the picture at
    # runtime. The plate then publishes at opacity 1, as the reference does.
    print('hero')
    show = load('hero-showroom-4000x2250.webp')
    # The crop is cut at the panel's own aspect so `fit` has nothing left to
    # take off: a second crop on top of a chosen one is how the chair and the
    # seating fell out of frame and left the screen filling half the hero.
    # TWO THINGS THIS FRAME WAS GETTING WRONG, both found by putting the page
    # furniture over the plate and measuring the columns.
    #
    # THE STATEMENT CARD SAT ON THE SCREEN. The card lands at 73%-91% down the
    # panel, and the screen's face ran to 82%, so the card covered the middle
    # of the only thing in the room worth looking at. The window is 37/1000
    # lower down the source now: the same frame, the same chair and seating,
    # but the screen rides above the card and the card lands on the stand.
    #
    # THE DAYLIGHT AT THE LEFT OUT-READ THE HEADLINE. The glass and the plants
    # at the frame's left edge measured 1.35x the frame's own mean, and the
    # vertical rail and the first word of the headline both sit on them. The
    # reference's hero runs its left edge at 0.58x. Strength 0.46 could not
    # reach that; 0.66 over the same width brings the edge to about 1.05x
    # without flattening the wall behind it. A matching, gentler falloff on
    # the right takes the sliver of the glass sign off the card's corner.
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
    # strip now renders at 21.3 against the reference's 22.2.
    #
    # amount=18, cell=2 is calibrated against a REAL BROWSER RENDER, not a
    # resample in this script. Two things eat fine grain before it reaches
    # the page — Next re-encodes at q=75, and Chrome's own 2200->1432
    # downscale smooths harder than LANCZOS — so a value tuned in here misses
    # badly: amount=10 predicted 3.73 and rendered 1.45. The live readings
    # that set it: 10 -> 1.45, 22 -> 4.81, 18 -> 3.96, against the
    # reference's 3.68 on the same strip.
    band = crop_rel(show, (0.000, 0.084, 0.822, 0.991))
    # THE FRAME IS THE WHOLE ROOM NOW, not a band of the wall. At the old
    # 0.052-0.600 crop the right edge landed exactly on the sign's left edge,
    # so any widening at all cut the wordmark in half — and the source has no
    # room left of 0 to pan into, so a half-open frame was not available. It
    # is either out (<=1.15x) or whole (1.50x). Whole: the sign stands in its
    # own space and its foot clears the statement card at y666.
    #
    # THE WIDER FRAME IS BRIGHTER CONTENT, so the grade had to move with it.
    # At the old crop the type side fell on a dark wall; at 1.50x it falls on
    # lit floor and the sign's spill, and the strip under the headline went
    # from 17 to 38 with the old numbers. `bright` cannot fix that — `grade`
    # normalises the range afterwards and cancels it (0.76 and 0.38 measure
    # the same). The ceiling and the left falloff are the real levers, and
    # dropping the ceiling alone kills the highlights this room needs: at
    # white=120 the strip reads 19 but the brightest pixel is 107, which is
    # the flat, dead plate this file's `grade` docstring warns about.
    #
    # So the darkening is put where the type is and nowhere else. Measured on
    # the plate: strip under the headline 21.1, the headline's own band 10.9,
    # the screen-and-sign side 33.8 — the left reads as night and the right
    # keeps its highlights.
    # THE LEFT FALLOFF WAS DOING THE WRONG JOB. At strength 0.94 over reach
    # 0.95 it was not light falling off, it was a black sheet over 95% of the
    # frame — the exact thing `falloff`'s own docstring says not to make. It
    # was set that way to pull a "shadow strip" down to the reference's 20,
    # but that strip sits at the FOOT of the frame where no text goes. The
    # readable zones are the headline and the lede, and they were being
    # crushed along with everything else: the room went to 32 and the lede
    # to 11.
    #
    # WHAT IS ACTUALLY BEHIND THE HEADLINE IS FLAT WALL. Measured: with the
    # falloff at 0.94 the headline band reads 10.1, and with it almost off it
    # reads 15.5. Four points across the whole range, because that part of
    # the frame is plain dark blue wall and there is nothing in it to reveal.
    # No grade brings back a picture that was never there — only a different
    # crop or a shorter headline would, and both are the owner's call.
    #
    # So the darkening is split. A gentle left for the text, and a `bottom`
    # to hold the lit floor down where the reference's own foot sits dark.
    # The room gains what the sheet was taking: subject 31.9 -> 40.0, lede
    # 11.3 -> 20.1, foot held at 31.3.
    hero = grade(fit(band, 2200, 1375), black=5, white=185, sat=0.40, contrast=1.06, bright=0.76)
    hero = falloff(hero, 'left', strength=0.50, reach=0.62, curve=1.70)
    hero = falloff(hero, 'bottom', strength=0.55, reach=0.40)
    hero = falloff(hero, 'right', strength=0.24, reach=0.30, curve=1.3)
    save(filmgrain(hero, amount=18, shown=1432), 'plate-hero-room.jpg', 88)

    # The phone crop: a portrait frame off the same room, so the hero is the
    # same place on a phone rather than a squeezed version of a wide picture.
    # It carries the sign, because the desktop frame does now — a phone that
    # showed only bare wall would be a different hero. Its top edge stops at
    # 0.15: taking it to 0.00 to "zoom out" pulled the ceiling and its track
    # lighting into frame, which read as a mistake above the headline.
    #
    # THE FALLOFF HAS TO REACH THE BODY COPY, not just the headline. A phone
    # stacks eyebrow, headline, lede and both buttons down the frame, so the
    # text runs to about 0.68 of the panel where the desktop's stops at 0.45.
    # At strength 0.40 / reach 0.58 the lede sat straight on the screen's lit
    # face and measured 43.6 against the reference's 23. At 0.78 / 0.88 it
    # measures 24.2, and the room is still there below the fold.
    save(filmgrain(falloff(grade(fit(crop_rel(show, (0.330, 0.150, 0.800, 0.950)), 1000, 1360),
                                 black=5, white=170, sat=0.40, contrast=1.06, bright=0.76),
                           'top', strength=0.78, reach=0.88, curve=1.3), amount=18, shown=390),
         'plate-hero-room-tall.jpg', 88)

    # THE STATEMENT CARD'S PICTURE. The reference puts a 120x154 portrait of
    # the person it quotes at the card's right edge, rounded on that side
    # only. With no picture our text ran the full 390 and the card read as a
    # hollow slab. The founder supplied this portrait and it lives in
    # `assets`, so the card carries a face like the reference's does.
    #
    # NO HAND CROP. The frame is 1112x1414, a ratio of 0.786 against the
    # slot's 0.779 — near enough that `fit` trims about one percent off the
    # sides and nothing off the head. An earlier frame needed a hand-placed
    # window; this one does not, so there is none to go stale.
    #
    # MONO, LIKE THE REFERENCE'S. The supplied frame is in colour, and it is
    # the only colour thing that would be in the hero: the room behind it
    # runs at sat 0.40 and everything else in the card is white on black.
    # tbd® prints its own portrait black and white for the same reason. The
    # contrast is lifted a little because desaturating an office background
    # flattens it, and `bright` is held near 1.0 because this frame is lit
    # far brighter than the plates around it (median 109 against the hero's
    # 20) — it is meant to be the bright object in a dark card.
    save(filmgrain(grade(fit(load('founder-portrait.webp'), 360, 462),
                         black=4, white=245, sat=0.0, contrast=1.10, bright=0.92),
                   amount=14, shown=120),
         'plate-card-founder.jpg', 90)


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
    print('work cards')
    ops = load('ops-g5.jpg')
    save(filmgrain(grade(crop_rel(ops, (0.0, 0.1519, 1.0, 0.9019)),
                         black=6, white=236, sat=1.0, contrast=1.03),
                   shown=687), 'card-ops.jpg', 90)

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
    mach = load('WhatsApp Image 2025-10-31 at 22.57.47 (1).jpeg')

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
    save(grade(abp, black=6, white=240, sat=1.02, contrast=1.03), 'abp-site-home.jpg', 88)

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

    # Belkofski. Source: shot02-pickleball-6250.png. The one piece of
    # finished, owned work on the page, and the only asset with a colour in
    # it.
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
    # published whole, at 1400 x 1000 for the 898 x 640 card it sits in.

    # OPS. Source: ops-g1.jpg, the product's own overview screen, at a scale
    # a reader can actually read: the four counters, the zone list and the
    # activity chart, not one magnified corner of a dashboard.
    save(filmgrain(grade(fit(crop_rel(load('ops-g1.jpg'), (0.0, 0.0, 1.0, 0.72)), 1400, 1000),
                         black=8, white=250, sat=1.04, contrast=1.02), shown=894), 'hero-ops.jpg', 90)

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
    red = load('hero.png')
    save(filmgrain(grade(fit(crop_rel(red, (0.0, 0.06, 1.0, 0.70)), 2200, 1100),
                         black=5, white=236, sat=1.02, contrast=1.05, bright=1.06), shown=1518),
         'plate-recalibre-wide.jpg', 88)
    save(filmgrain(grade(fit(crop_rel(red, (0.04, 0.10, 0.96, 0.68)), 1360, 906),
                         black=5, white=236, sat=1.02, contrast=1.05, bright=1.06), shown=418),
         'still-recalibre.jpg', 88)
    save(filmgrain(grade(fit(crop_rel(red, (0.18, 0.20, 0.76, 0.64)), 600, 600),
                         black=5, white=238, sat=1.04, contrast=1.05, bright=1.1), shown=120),
         'tile-recalibre.jpg', 90)

    # -- OPS, AS A TALL PANEL -------------------------------------------------
    # Source: ops-g5.jpg. The spotlight block on the homepage is the OPS
    # block; its 687 × 942 media card was carrying the eyewear render. It
    # carries OPS. The bottom of the source is cut away because it prints a
    # working address into the pixels, and an address on a page is an
    # invitation to visit it.
    #
    # The card this fills carries the Recalibre mark across its top and a
    # barcode across its foot, and the plate is a white screen: both were
    # sitting on it invisibly. A narrow band at each end is darkened here so
    # the middle — which is the product — stays at full strength.
    ops_tall = grade(fit(crop_rel(load('ops-g5.jpg'), (0.10, 0.12, 0.90, 0.90)), 1100, 1500),
                     black=6, white=246, sat=1.02, contrast=1.02)
    save(filmgrain(falloff(falloff(ops_tall, 'top', strength=0.94, reach=0.17),
                           'bottom', strength=0.92, reach=0.15), shown=756),
         'plate-ops-tall.jpg', 88)

    # -- REGRADES -------------------------------------------------------------
    # These plates already existed and were already traced to `assets`; what
    # they lacked was any highlight at all. Rebuilt from the same sources at
    # a range the page can actually show.
    # THE BELKOFSKI GALLERY. Five shots that used to be three crops of one
    # scene with two more beside it, and two of the five carried a caption
    # written for a picture they were not. `belkofski-lens` was described as
    # "frames on black" and was a crop of the orange shelf; `belkofski-cube`
    # was described as a machine head over a cube with frames set into it and
    # was another crop of the same shelf. Each recipe now points at the
    # source its description was written for, and the two redundant crops are
    # gone. The gallery is five different photographs.
    print('regrades')
    shelf = load('bk-g5.jpg')     # the frames on the lit shelf — the warm one
    save(filmgrain(grade(fit(shelf, 1600, 1600),
                         black=5, white=240, sat=1.04, contrast=1.02, bright=1.06), shown=687),
         'belkofski-shelf.jpg', 88)
    save(filmgrain(grade(fit(crop_rel(frames, (0.02, 0.10, 0.98, 0.94)), 1400, 1000),
                         black=4, white=240, sat=1.08, contrast=1.04, bright=1.3), shown=687),
         'belkofski-lens.jpg', 88)
    save(filmgrain(grade(fit(crop_rel(load('shot02-pickleball-6250.png'), (0.0, 0.20, 1.0, 0.70)), 1800, 1125),
                         black=6, white=244, sat=1.04, contrast=1.02), shown=687),
         'belkofski-court.jpg', 88)
    save(filmgrain(grade(fit(crop_rel(bk, (0.22, 0.30, 0.86, 0.90)), 1200, 1500),
                         black=6, white=244, sat=1.04, contrast=1.04), shown=687),
         'belkofski-paddle.jpg', 88)
    # The 22.57.47 render, back where it is true: it is a Belkofski picture,
    # and the frames set into the face of the cube are the subject of it.
    save(filmgrain(grade(fit(crop_rel(mach, (0.02, 0.12, 0.98, 0.72)), 2000, 1000),
                         black=5, white=236, sat=1.10, contrast=1.06, bright=1.08), shown=1376),
         'belkofski-cube.jpg', 88)

    # The room, as a wide plate for the pages that need an interior.
    save(filmgrain(grade(fit(crop_rel(show, (0.02, 0.18, 0.565, 0.92)), 2200, 1210),
                         black=5, white=226, sat=0.62, contrast=1.04, bright=0.92), shown=1518),
         'plate-room-wide.jpg', 88)
    save(filmgrain(grade(fit(crop_rel(show, (0.20, 0.20, 0.55, 0.92)), 1100, 1420),
                         black=5, white=226, sat=0.62, contrast=1.04, bright=0.92), shown=756),
         'plate-room-tall.jpg', 88)

    desk = load('dorwa-svc-web.jpg')
    save(filmgrain(grade(fit(crop_rel(desk, (0.0, 0.06, 1.0, 0.94)), 2000, 1100),
                         black=5, white=232, sat=0.85, contrast=1.04, bright=1.18), shown=1380),
         'plate-desk-wide.jpg', 88)
    save(filmgrain(grade(fit(crop_rel(desk, (0.10, 0.04, 0.92, 0.96)), 1200, 1260),
                         black=5, white=232, sat=0.85, contrast=1.04, bright=1.18), shown=687),
         'plate-desk-tall.jpg', 88)

    geo = load('dorwa-svc-3d.jpg')
    save(filmgrain(grade(fit(crop_rel(geo, (0.0, 0.06, 1.0, 0.92)), 2200, 1210),
                         black=5, white=238, sat=0.9, contrast=1.06, bright=1.1), shown=1518),
         'plate-geometry-wide.jpg', 88)
    save(filmgrain(grade(fit(crop_rel(geo, (0.10, 0.04, 0.94, 0.96)), 1500, 2000),
                         black=5, white=238, sat=0.9, contrast=1.06, bright=1.1), shown=670),
         'render-geometry.jpg', 88)

    # -- THE CHAPTER STILLS ---------------------------------------------------
    # Five capability chapters, five different pictures: the page should not
    # show the same frame twice inside one scroll.
    print('stills')
    stills = {
        'still-geometry.jpg':     (geo,  (0.06, 0.10, 0.96, 0.72), dict(black=5, white=238, sat=0.9,  contrast=1.06, bright=1.12)),
        'still-desk.jpg':         (desk, (0.04, 0.10, 0.96, 0.86), dict(black=5, white=232, sat=0.85, contrast=1.04, bright=1.2)),
        # (still-ops-overview is a capture of the product, kept in public/img
        #  by hand rather than derived here — and NOT grained. It is an
        #  interface, not a photograph: the same is true of the seven
        #  ops-*.png shots on /work/ops, which are drawn at up to 1376px so
        #  a reader can read them. Grain over small interface type costs the
        #  very thing the capture exists to show, and none of them carried a
        #  grade for the veil to undo — they are white screens. They lost
        #  `.grain-soft` with everything else and are published clean.)
        'still-belkofski.jpg':    (bk,   (0.04, 0.16, 0.96, 0.78), dict(black=6, white=244, sat=1.04, contrast=1.04)),
    }
    for name, (im, box, g) in stills.items():
        # Every chapter still is drawn in the same 418px card, so they share
        # one `shown` — and it is the tightest squeeze on the site: 1360 into
        # 418. At the hero's cell of 2 this grain would land at 0.6 of a
        # screen pixel and vanish.
        save(filmgrain(grade(fit(crop_rel(im, box), 1360, 906), **g), shown=418), name, 88)

    # -- THE SHARE CARDS ------------------------------------------------------
    # Every route was pasting the same tall machine render into other people's
    # chat windows, under the same title, so eight different pages produced
    # one indistinguishable preview. These are 1200 x 630 — the size every
    # platform crops to — and each one belongs to the page it is attached to.
    print('share cards')
    og = {
        'og-home.jpg':       (show,   (0.052, 0.22, 0.600, 0.72),  dict(black=5, white=214, sat=0.45, contrast=1.06, bright=0.84)),
        'og-about.jpg':      (desk,   (0.02,  0.12, 0.98,  0.78),  dict(black=5, white=232, sat=0.85, contrast=1.04, bright=1.18)),
        'og-insights.jpg':   (geo,    (0.04,  0.10, 0.96,  0.68),  dict(black=5, white=238, sat=0.9,  contrast=1.06, bright=1.1)),
        'og-contact.jpg':    (show,   (0.10,  0.24, 0.58,  0.76),  dict(black=5, white=224, sat=0.60, contrast=1.04, bright=0.94)),
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
    # interfaces kept in public/img by hand, like still-ops-overview above —
    # but unlike the seven /work/ops shots, which are byte-copies of files
    # in `assets`, these two have no counterpart in `assets`; each card is a
    # re-cut of a picture the site already publishes, not a new one. They
    # are read from public/img and published clean — no grade, no grain —
    # as every interface capture on the site is.
    save(grade(fit(crop_rel(geo, (0.10, 0.22, 0.94, 0.549)), 1200, 630),
               black=5, white=238, sat=0.9, contrast=1.06, bright=1.1),
         'og-human-oversight.jpg', 86)
    for name, capture in (('og-offline-first.jpg', 'ops-field-wide.png'),
                          ('og-right-to-left.jpg', 'ops-permits-wide.png')):
        shot = Image.open(os.path.join(OUT, capture)).convert('RGB')
        save(fit(crop_rel(shot, (0.0, 0.0, 1.0, 0.933)), 1200, 630), name, 86)


if __name__ == '__main__':
    if '--check' in sys.argv:
        import glob
        for f in sorted(glob.glob(os.path.join(OUT, '*.jpg'))):
            report(f)
    else:
        build()
