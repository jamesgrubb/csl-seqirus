# CSL Seqirus — design study

Measured from the live sites (computed styles) on 25 Nov 2026:
**cslseqirus.us** (primary reference: the Seqirus sub-brand) and **csl.com** (parent brand).
`cslseqirus.com` currently fails TLS (expired certificate), so it could not be inspected.

These values are what the sites render, not the official brand book. Confirm against the
CSL brand portal before launch, especially for print-accurate colour.

## Typography

| Role | Family | Size / line | Weight | Tracking | Colour |
|---|---|---|---|---|---|
| Statement (centred section lead) | Montserrat | 48 / 57.6 | **300** | −1px | `#29261E` |
| Banner title (in box over image) | Montserrat | 36 / 40 | **300** | normal | `#29261E` |
| H1 (in hero box) | Montserrat | 30 / 39 | 700 | −1px | `#010101` |
| H2 section | Montserrat | 32 / 40 | 700 | normal | `#29261E` |
| Body | Montserrat | 16 / 24–27 | **300** | 0.5px | `#343027` |
| Primary nav | Montserrat | 15–16 | 500 | 0.5px (−0.25px on Seqirus) | `#29261E` |
| Utility nav | Montserrat | 14 | 400 | normal | `#29261E` |
| Button | Montserrat | 15 / 25.5 | 700 | normal | `#FFFFFD` on red |
| Text link | Montserrat | 15 | 500 | 0.5px | `#EA002A` + 2px `#E7040B` underline |

**Web fonts:** both sites self-host Montserrat (google-webfonts-helper build `montserrat-v25`,
weights 100/300/400/500/700/900). No proprietary font is loaded. We load the same family from
Google Fonts (300/400/500/700). Light (300) for body and display text is the defining choice;
bold is kept for short headlines and buttons.

## Colour

| Token | Hex | Use |
|---|---|---|
| `--red` | `#E7040B` | Primary: buttons, logo "CSL", underline bars |
| `--red-link` | `#EA002A` | Text links |
| `--red-bright` | `#FC1921` | Hover / highlights |
| `--ink` | `#29261E` | Primary text (warm near-black, never pure black) |
| `--ink-body` | `#343027` | Body copy |
| `--ink-soft` | `#3A372E` | Secondary dark |
| `--paper` | `#FFFFFF` | Page |
| `--paper-warm` | `#FCFCFA` | Boxes over images, header, cards |
| `--stone-100` | `#F1EFEA` | Section tint |
| `--stone-200` | `#ECEAE5` | |
| `--stone-300` | `#E2DFDD` | Rules, borders |
| `--stone-400` | `#CECCC9` | Dividers on tint |
| `--slate` | `#27455C` | Rare cool accent |

The palette is warm: greys lean beige, and "black" is `#29261E`. Red is used sparingly, as a single accent.

## The CSL angle

The defining device is a **shallow diagonal cut**, always on the bottom edge and always
falling from right to left (lower on the left):

- **Image bands / section rows:** `clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%)`
- **Boxes over images:** `clip-path: polygon(0 0, 100% 0, 120% 91%, 0 98%)`. The right point is pushed
  past the box so only a gentle slope shows (~2–3°).
- **Logo wedge:** the logo sits on a white tab with the same angled base.

Corners are **square** everywhere. The only rounded element is the pill button (radius 30px).

## Boxes over images

The signature layout pattern on both sites:

1. A full-bleed photo band (~600px tall on desktop).
2. A box in `--paper-warm`, max-width 550px, padding `40 40 25` (hero variant `30 30 44`),
   aligned to the content container's left edge.
3. The box sits in the lower half of the image and **overhangs the bottom edge** (≈ −48px), so it
   bridges the image and the content below.
4. The box holds a Light (300) 36px title, short Light body copy, then a red text link or pill button.
5. Then a centred Light 48px statement with centred body copy below.

## Components

- **Header:** white; logo ~130px wide on the left; a small utility row (14/400) above the
  primary nav (15/500); search icon on the right.
- **Primary button:** red pill, 15/700, padding 15×25, no shadow.
- **Text link:** red 15/500 with a 2px red bar underneath (`::after`).
- **Tabs:** small 500-weight labels in a row, active tab marked with a red underline.
- **Footer:** light, link columns (16/500 headings, 14/300 links), then a legal row.
- **Imagery:** documentary photography (people, labs, manufacturing), natural light, often slightly
  desaturated. Archive shots in black and white.

## Applied in this project

All tokens live at the top of `src/styles.css`. Until real poster stills are uploaded, the generated
thumbnail art uses warm stone grounds with angled red and ink planes. Replace it with documentary
stills (`poster_key` in D1) to get the full "box over photo" look.
