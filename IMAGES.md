# Images — what to send

Drop files into `public/img/`, then run:

```bash
npm run images && npm run check:images
```

That reads the real pixel size of every file and regenerates the manifest. If a
file is missing or the manifest is stale, the build fails rather than shipping a
blank box.

Every slot below currently shows a labelled empty frame, not a grey plate — a
missing image can't be mistaken for a design choice.

---

## Still needed

| Slot | Frame on the page | Send | Minimum width |
|---|---|---|---|
| **OPS screenshot** | 622 × 389 · **16:10** | the dashboard, real data | 1400px (2800 ideal) |
| **Contraxis screenshot** | 622 × 389 · **16:10** | a document under review | 1400px (2800 ideal) |
| **Why Recalibre photo** | 485 × 614 · **4:5 portrait** | you, the team, or the work | 970px (1940 ideal) |
| **Capabilities image** | 334 × 220 · **3:2 landscape** | anything showing AI/automation work | 670px (1340 ideal) |
| **Founder portrait** | 124 × 126 · **square** | head and shoulders | 250px (500 ideal) |
| **Client photo** | 45 × 45 round · **square** | goes with the client quote | 180px (360 ideal) |

Already in place: the hero showroom image, and the wordmark.

## Notes that matter

**The two product screenshots are the important ones.** The cards were rebuilt
specifically to hold them — the original design was a 2.49:1 photo panel, which
would have cut 28% off the top and bottom of any screenshot. They're 16:10 now,
so nothing is lost. If your capture isn't exactly 16:10 it's anchored to the
top, so the interface's navigation always survives.

**Format:** PNG for screenshots, JPG or WebP for photographs. Don't compress
them first — the site resizes and converts everything automatically, and it can
only work with what you give it.

**Size:** send the largest you have. Big files cost nothing here; the site
serves a small version to phones and a large one to desktops from the same file.

**Don't put text into the image.** Anything written inside a picture can't be
read aloud, can't be translated, and can't be found by search.

## When they arrive

Tell me the filenames and I'll place them, write the alt text for each, remove
the "to come" frames, and check nothing shifts as they load.
