# atelier - Sala Blanca

## 1. Concept and feeling

Divan has no showroom, so the website becomes one: a white exhibition room, a *sala*, the Spanish word (like everyday Russian *зал*) for both the gallery room and the living room. Every sofa hangs as a numbered exhibit with an exact wall label, and the free sample box is our handling collection, the part of a museum you are allowed to touch, delivered to your door. The Costa Blanca already built the white cube: whitewashed walls and hard light, which is where we photograph.

First five seconds: a blank white wall; one hairline is drawn across it at eye level; one sofa appears hung large and off-centre, its label beside it: number, fabric, centimetres, workshop, weeks, price. Nothing shouts, everything is stated. Visitors slow down and read.

## 2. Why this is "Apple among sofas, only cooler"

Apple puts one product on an empty field and lets the specification speak. We do the same, but our field is a gallery wall, and a gallery outranks a store: its objects are chosen, not stocked. That is the "cooler". Vastness is literal: one exhibit per wall, margins that grow with the screen. Seriousness is the label grammar: the same facts in the same order on every piece, no adjectives, badges or exclamation marks. Minimalism is subtraction: no shadows, no radii, no cards, one accent used as a dot.

## 3. How the same system flexes into divan.group

Same museum, another room. The boutique is the exhibition; divan.group is the open depot, visible storage in the spirit of Depot Boijmans. The metaphor stays internal: customer copy never says "almacén" or "stock" (business-model §2).

Identical: tokens, typefaces, the wall-label component, the dot, plinth photography, palettes, buttons, focus, footer.

Tightens: hanging templates become an even rack of 4/5/6/7 columns at 1280/1920/2560/3200 px; wall margin capped at 72 px; H1 at most 72 px; serif only for H1, H2 and work titles; grid labels shrink to three lines (title, key fact, price). Navigation becomes a two-row header with a mega menu (a directory board: text columns plus one plate) and visible search; a filter index sits left with tabular counts, including lead time, fabric type and "pasa por una puerta de 80 cm". No intro, parallax or grid reveals. Boutique pieces shown in the depot say "También en divan.boutique" and canonicalise there.

## 4. Typography

**Source Serif 4** names things: a transitional serif in Fournier's lineage, the century of the Paris Salon livrets, the catalogues visitors carried through the rooms. Two static instances: Display Light (opsz 60, wght 300) for H1/H2, Caption Italic (opsz 20, wght 400) for work titles. **Source Sans 3** (variable 400–600) measures things: UI, body, data, prices, tabular figures by default; it descends from the American gothics behind MoMA's label face.

Verification: the literal `curl -s -A "Mozilla/5.0" … | grep -c cyrillic` prints 0 for every family, Cyrillic or not, because that user agent receives one unsubsetted TTF. With a current Chrome user agent it prints 4 (and latin-ext 2) for both families, and both TTF cmaps contain ґ є і ї ё ñ ¿ ¡ ł ő ř № × € « » „ “. Rendered with `lang="uk"` and rejected: Sofia Sans (swaps in Bulgarian letterforms), Cormorant (its Λ-shaped л reads archaic), Golos (commissioned for Russian state-service sites, the wrong signal for a Ukrainian-majority market).

Scale, 390 → 1440 → 2560 → 3440 px:

- hero `clamp(2.75rem, 1.4rem + 5.2vw, 12.5rem)`: 44 → 97 → 156 → 200
- h1 `clamp(2.25rem, 1.3rem + 3.3vw, 8rem)`: 36 → 68 → 105 → 128
- h2 `clamp(1.875rem, 1.2rem + 2.4vw, 5.5rem)`: 30 → 54 → 81 → 88
- work title (italic) 20 → 23 → 27 → 28; body 16 → 18 → 20; data 14 → 15 → 17; meta 12–13 uppercase, +0.06em

Display line-height 1.0, tracking −0.02em Latin, −0.012em Cyrillic. Cyrillic lowercase is mostly x-height, so Russian and Ukrainian headlines read as one calm, even band; the light weight keeps them from going grey, and line-height 1.0 leaves room for Ї, Й and Á. Italic Cyrillic uses true cursive forms (т like m, д like g), so RU/UK labels look hand-inked. Lines run up to 20% longer: `text-wrap: balance`, measures in ch, a per-locale short title in the CMS, no hyphenation in display lines.

## 5. Colour

Neutrals, light / dark: wall `#F6F6F4` / `#181716`; raised `#FDFDFC` / `#21201F`; niche `#EBEAE8` in both modes (the photo backdrop, so in dark mode plates become lit vitrines); hairline `#D4D3D1` / `#363533`; frame `#878683` / `#797976` (inputs, 3.4:1 / 4.1:1); ink-2 `#5E5E5B` / `#B0AFAD` (6.0 / 8.2:1); ink `#151513` / `#EAE9E7` (16.9 / 14.8:1). Text never sits on the niche.

Four palettes, pigments from a curator's desk. Each sets accent (dot, links), deep (painted room), wash (selected), partner (dots inside the painted room), light | dark:

- **Tinta**, monochromatic, hue 264 (iron-gall ink): `#2C4E9E` | `#96B6F0`, `#152347` | `#1D2945`, `#EAEFF9` | `#1E2534`, `#6586C3` | `#6F92D3`
- **Pátina**, analogous 172° + 210° (bronze verdigris, sea glass): `#1B6854` | `#7CC9B1`, `#04322C` | `#12332E`, `#E6F4EF` | `#142A24`, `#4A939F` | `#69B2BF`
- **Lacre**, complementary 28° ↔ 207° (sealing wax, the gallery's red dot): `#AF3029` | `#F18D7D`, `#4D1517` | `#4A1C1C`, `#FAEDEC` | `#341E1D`, `#4C96A0` | `#6CB5C0`
- **Esparto**, split-complementary 82° with 232° and 292° (Murcia's esparto craft): `#805E16` | `#DDB96B`, `#352D14` | `#352D17`, `#F4F1E8` | `#2A2515`, partners `#558EAC` + `#877FAD` | `#77ADC9` + `#A59ECB`

Measured minimums: accent as text 5.5:1 light, 7.5:1 dark; text on deep 11.2:1; ink on wash 12.5:1; partner dots 3.1:1 on wall, 3.7:1 on deep.

Rules: accent appears only as (1) the dot, the system's only circle, meaning "yours" or "selected"; (2) link underlines, accent text on hover; (3) wash behind a selected chip; (4) one painted room per page, a full-bleed band where the wall is repainted deep and text turns wall-white. Never on buttons, prices, images, header, footer, cart, checkout or errors. Outside the painted room at most 2% of any viewport; the painted room at most 20% of page height (8% on divan.group), never next to the hero. The palette is set per storefront in site-settings and rendered as `data-palette` on the server; a footer switch lets visitors repaint, applied by the head script before first paint.

## 6. Layout and grid

4 / 8 / 12 columns below 640, to 1023, from 1024 px. Gutter `clamp(1rem, 0.6rem + 0.9vw, 2.5rem)`; wall margin `clamp(1rem, 4.2vw - 0.2rem, 9rem)` (16 → 57 → 104 → 141 px). No container: the grid is the wall minus margins; only text has a measure (body 66ch, labels 34ch). Section spacing `clamp(6rem, 8vw, 15rem)`.

The hanging line: plates of different sizes on one wall are centred on a shared horizontal axis (`align-items: center`), never top-aligned; each label hangs 16 px below its plate, and the wall reserves a fixed label band, so nothing shifts. Templates: one exhibit (plate cols 2–8, label cols 9–11), two (1–5, 7–10), three (1–4, 6–8, 10–12).

Full-bleed is for windows (interior photographs) and the painted room only; product plates never touch the edge; one full-bleed element per viewport height; carousels may bleed off the right edge.

From 2560 px: margins 104–144 px; the hero plate reaches about 2100 px from the large variant; listing walls hang four exhibits; the product page becomes a diptych (exhibit 7 columns, drawing 5); the divan.group rack shows 6 columns, 7 from 3200. Beyond 3440 the grid caps at 3200 px and the wall absorbs the rest.

## 7. Signature moments

1. **Intro, the blank wall.** First child of body, `aria-hidden`, `pointer-events: none`: a wall-coloured cover, a small wordmark, a 1 px ink line drawn at 46% height (scaleX 0→1, 120–700 ms); the cover fades 900–1500 ms (`forwards`, ending `visibility: hidden`). The head script adds `intro-seen` from sessionStorage (try/catch); reduced motion gets `display: none`. Boutique home only.
2. **Hero, the title wall.** Kicker and H1 at cols 1–4; one interior photograph at cols 5–12 on the hanging line (eager, `fetchpriority="high"`, srcset sm/large, `sizes="(min-width: 1024px) 62vw, 100vw"`), min-height 88svh; its label at cols 1–3 level with the photo's bottom edge; "Ver la colección" and "Pedir muestras gratis".
3. **Parallax, the window.** One full-bleed interior in a 75svh frame; the image is 118% tall and moves −9% → 9% via `animation-timeline: view()`, transform only; static without support or with reduced motion. Walking past a window is real parallax.
4. **Carousel, the corridor.** A `<ul>` scroller with `scroll-snap-type: x mandatory` and `scroll-padding-inline` equal to the margin; plates in three widths centred on the hanging line, labels below, every slide an `<a>`; previous/next buttons and "4 / 12" (aria-live polite); no autoplay, no loop.
5. **Gallery and lightbox, the study room.** Product images hang by template; each figure links to its large file (works without JS) and, with JS, opens a full-screen `<dialog>` on a wall background, not black: image contained, label in the margin, "Fig. 3 de 7", arrows, Escape, focus restored. A same-document View Transition morphs the plate in 420 ms; "Ver el tejido de cerca" opens a natively scrollable 2× view.
6. **Projects, real rooms.** Each project is a window plus a room label (town, m², floor, lift, light, year) and "En esta sala": the labels of every piece shown, with prices. Delivery is the credit line, for example "4.º sin ascensor: subido por la escalera".
7. **Technical drawing, the lámina.** Inline SVG on raised paper with a column of wall around it: elevation, section, plan at 1:20, 0.75 px non-scaling strokes, dimensions in tabular sans, label "Lámina · Salina · 1:20 · cm". Beside it, "¿Cabe?": door, lift width × depth, stair landing; a GET form that works without JS; the answer appears in an `<output>`, and the decisive dimension gets the dot.
8. **Uniform product frame, the plinth.** Every factory's photos are reshot or processed to one spec: 5:4, backdrop exactly `#EBEAE8`, three-quarter view from the left at 30°, camera height 95 cm, key light upper left, contact shadow only, baseline at 80%, one scale per category (sofas: frame = 320 cm; armchairs: 140 cm) so sizes compare truthfully. No radius, border or shadow.
9. **Cart drawer.** A `<dialog>` from the right, 480 px (full width on mobile), raised background, hairline edge, backdrop of wall at 72%. Lines are small labels; then the sample box, six pinked-edge slots, "Gratis, hasta 6 telas"; delivery and assembly for the chosen town; the member line; tabular total; "Tramitar pedido"; returns and payment notes.
10. **Member price.** Museum friends' pricing: every label shows "1.890 €" and "○ Amigos 1.701 €". The dot is hollow when signed out (with "Entra para pagar este precio") and filled when signed in. No strike-through, percentages or red.

## 8. Motion language

Durations: 160 ms state changes, 240 ms hover crossfade, 420 ms dialogs and drawer, 600 ms reveals and line draws, 1.5 s intro. Enter `cubic-bezier(0.2, 0, 0, 1)`; exit `cubic-bezier(0.4, 0, 1, 1)` at 70% of the enter time. Labels rise 8 px and fade, section lines draw, 60 ms stagger, all scoped under `.js-anim`, which the head script sets only when motion is allowed and removes if the reveal script is not ready within 3 s. Never moves: plates (except a hover crossfade to the front view), prices, body text, forms, header, the hero. No smooth-scroll library; visitors walk at their own pace. Reduced motion: no intro, parallax or reveals; dialogs fade 120 ms; carousel and anchor jumps are instant; View Transitions off.

## 9. Component vocabulary

Radius 0 everywhere; the only circle is the dot (8 px, 10 px from 1440). No shadows: depth is tone, wall → raised → niche. Borders: 1 px hairline separators, 1 px frame on inputs, 1 px ink on secondary buttons. Buttons: 48 px high (52 from 1440), sans 500 at 15 px; primary is an ink fill that inverts on hover, secondary an outline that fills, the text button is underlined at a 5 px offset. Focus: 2 px ink outline, 3 px offset, never accent. Tags are uppercase meta text joined by middle dots, never pills; filter chips are 36 px hairline rectangles, selected = wash, accent border, dot. No cards: plate plus label. Inputs: 52 px, label above, helper in ink-2, errors as icon plus text plus a 2 px ink border. Boutique header: 72 px, wordmark, four links, ES RU EN UK as real links, account, "Cesta (2)". Footer, the colophon: four link columns (delivery towns included), legal, languages, palette switch; no giant wordmark.

## 10. SEO and performance consequences

Labels are `<figcaption>`s: materials, dimensions and price as text beside every image, which helps image and product understanding. URLs, navigation and H1s use search words (sofás, sofás cama, диваны), never the gallery metaphor. Fonts self-hosted through `next/font/local` (static instances cut with fonttools): ~68 KB for Latin pages, ~112 KB with Cyrillic, `swap` with size-adjusted fallbacks. Own JS ~4 KB, third-party 0 KB. LCP: the hero photo is in the HTML, eager, high priority, AVIF under 350 KB; the intro is CSS over content that has already painted. CLS ≈ 0: aspect-ratio on every plate, width/height attributes, reserved label bands, theme and palette applied before paint. INP: native dialogs, no scroll handlers, CSS scroll timelines. The store page carries Product JSON-LD (sku = DV code, offers, `priceSpecification` with `validForMemberTier` for the friends' price) plus BreadcrumbList; hreflang for four locales.

## 11. How this direction could fail, and how to prevent it

- Vast becomes vacant: a dozen sofas on white walls look unfinished. Keep a price or an action in every viewport, at least two exhibits per listing wall, windows between walls.
- The museum reads as "do not touch, not for you". Plain UI words, prices on every label, samples and WhatsApp video on every product, the friends' price.
- Mixed factory photos break the plinth. Written spec, processing pipeline, a CI check of corner pixels (`#EBEAE8` ±2) and baseline; no conforming plate, no publish.
- Hairlines vanish on cheap screens; Cyrillic wraps badly. Serif never below 30 px at weight 300, RU/UK screenshots at 390/1440/2560 at DPR 1, CMS short titles.
- Accent and metaphor creep. Accent tokens are exported only to Dot, PaintedRoom and Link; a review checklist keeps salas and exhibits out of button labels.
