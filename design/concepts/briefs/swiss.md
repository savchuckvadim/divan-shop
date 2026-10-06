# swiss - Sistema Métrico

## 1. Concept and feeling

Divan has no showroom, so the site must work as one: a system where every sofa is numbered, measured and photographed the same way, then set on one visible 24-column grid. Swiss International Style supplies the discipline (an oversized neo-grotesk set flush-left, tabular figures, objective plates); the business supplies the content (centimetres, door widths, delivery prices per town, six free samples). Where the page is empty, the grid shows; where the customer doubts, a number answers.

First five seconds: black shutters, one per column and numbered 01–24, lift left to right and leave the column hairlines behind. What remains is white: «Sofás a medida.» at poster scale, one sofa on a pale grey plate, and beside it in small tabular type ■ 01 · 168 × 92 × 84 cm · desde 1.290 €. The feeling: calm, exact, expensive. These people measure things, and they will measure my door.

## 2. Apple among sofas, only cooler

We take Apple's grammar whole: one object per screen on a neutral ground, the product name as headline, specs and comparison instead of adjectives. "Cooler" is what Apple never does: a grid that is shown, not hidden; Cyrillic set at poster scale with the same care as Latin; all twelve pieces lined up at true relative scale; colour panels switched like the panels of a USM Haller unit.

Vastness: no centred column; the grid runs to 3 840 px and display type to 320 px, so white space is ruled, never leftover. Seriousness: numbers over adjectives («asiento 58 cm», not «comodísimo»), no ornament. Minimalism: one typeface, two weights, zero radii, zero shadows, one colour field per page.

## 3. divan.group: same system, tighter

Stays: tokens, typeface, grid, index logic, photo standard, motion, components, palettes. Tightens:

- Display goes from wdth 125 to 100 and from 9.4vw to 4.5vw (max 160 px): the siblings are literally one variable font at two widths.
- Plates go from 4:3, four per row, to 1:1 at 4/6/8 per row (1024/1920/2560 px) inside 1 px hairline cells: USM compartments, not cards.
- Edition numbers 01–12 become article codes D-0412 behind the same square; both are language-neutral references for phone and WhatsApp.
- Header adds search and a click-opened mega menu: full-width panel, categories in four-column groups with tabular counts, one plate.
- Filter rail (3/12, 4/24 columns) with counts, including «Cabe por mi puerta: __ cm» (filters by package size).
- Accent only as marks and member price; spot fields only on campaign pages. No intro. Buttons 48 px, gutters ×0.75.

## 4. Typography

One family: **TikTok Sans** (Grilli Type, Lucerne, with Contrast Foundry and Type Network), variable opsz 12–36, wdth 75–150, wght 300–900, aliased in CSS as "Divan Grotesk".

Verification: the literal check with `-A "Mozilla/5.0"` returns **0**, as it does for every family (Golos Text too), because Google sends that agent one unsubsetted TTF without subset comments. The same URL with a current Chrome agent returns **cyrillic = 4, latin-ext = 2**. The font's cmap holds every ru/uk letter (ґ є і ї), ’, ×, €, but not № or U+02BC.

| Role | Setting | Size (390 / 1440 / 2560 / 3440) |
|---|---|---|
| Display | wdth 125 (Cyrillic 112), wght 540, tracking −0.035em (−0.03), lh 0.90 (0.92) | fit: 57–82 / 135 / 240 / 320 |
| Headline | wdth 112, 540, −0.025em, lh 0.98 | clamp(32px, 4vw, 136px) |
| Title | wdth 100, 560, lh 1.15 | clamp(22px, 1.6vw, 52px) |
| Lead | 400, lh 1.3 | clamp(19px, 0.9vw + 8px, 36px) |
| Body | 400, lh 1.5, opsz auto | clamp(16px, 0.3vw + 13px, 22px) |
| Label, data | 520 / 400, tabular-nums, sentence case | clamp(12px, 0.15vw + 11px, 16px) |

Fit-to-measure: display headings are stored as explicit lines per locale. At build, fontkit measures the longest line in em at that locale's width and weight, adds 2 % and writes `--fit`; CSS sets `font-size: min(var(--d-max), 100cqi / var(--fit))` in an inline-size container (`--d-max` 22vw below 1024 px, then min(9.4vw, 320px)). Lines are nowrap blocks, so a font swap cannot change the line count.

Cyrillic, measured: at equal width it runs 8–10 % wider than Latin and sits mostly at x-height, so it reads denser, more block-like. Hence wdth 112, slightly looser tracking for the extra vertical stems, lh 0.92 for the descenders of Д, Ц, Щ, р, у. «Диваны / на заказ.» then sets at 240 px on a 2560 screen exactly like «Sofás / a medida.»; Ukrainian «Дивани на / замовлення.» fits at 57 px on a 390 phone, against 75 px for Spanish. Always sentence case: all-caps Cyrillic becomes a wall of rectangles. A CMS hook turns the Ukrainian apostrophe into U+2019 (м’який); «№» is never typed, the index is a CSS square plus digits.

## 5. Colour

Neutrals have zero chroma, so fabric is judged against true grey.

| Token | Light | Dark | Use |
|---|---|---|---|
| paper | #FFFFFF | #0A0A0A | page |
| plate | #EEEEEE | #EEEEEE | photo backdrop; stays light in dark mode, text on it #111111 (16.3:1) |
| raised | #F5F5F5 | #161616 | drawer, menus, inputs |
| grid | #E6E6E6 | #1C1C1C | visible column lines |
| hairline | #DCDCDC | #2B2B2B | table rules, group cells |
| line | #858585 (3.7:1) | #707070 (4.0:1) | UI boundaries |
| ink-3 | #696969 (5.5:1; 4.7 on plate) | #949494 (6.5:1) | meta |
| ink-2 | #474747 (9.3:1) | #BDBDBD (10.5:1) | secondary |
| ink | #111111 (18.9:1) | #F2F2F2 (17.7:1) | text, buttons, borders |
| error | #B3261E (6.5:1) | #FF8A80 (8.7:1) | errors only |

Default is pure black and white. Four palettes, each a spot (fields, with its text colour) and a mark (small signals, ≥ 4.5:1 on paper):

| Palette | Harmony | Light spot / text | Light mark | Dark spot / text | Dark mark |
|---|---|---|---|---|---|
| Ultramar | monochromatic 264° | #073CDD / #FFF 7.8:1 | #0A2A81 12.6:1 | #154DE9 / #FFF 6.4:1 | #9FBDFC 10.5:1 |
| Laguna (Torrevieja's pink salt lake) | complementary 6° ↔ 196° | #F0A6B5 / #111 9.7:1 | #006869 6.6:1 | #F0A6B5 / #111 | #77CFD0 11.0:1 |
| Limón (Vega Baja groves) | analogous 103° → 146° | #FAE942 / #111 15.1:1 | #23682D 6.8:1 | #FAE942 / #111 | #85DC8C 11.9:1 |
| Monastrell (Yecla's grape) | square 358° + 88° | #711E42 / #FFF 10.7:1 | #816512 5.5:1 | #8E2A55 / #FFF 8.0:1 | #E2C479 11.7:1 |

Rules: spot appears only as one field per page (≤ 12 % of page area; on group, campaign pages only) and as the intro shutters. Mark appears only as the index square, selected-state squares and the member price. Never on plates, swatches or photos (no tints, no duotones), body text, links, buttons or status. 44 % of furniture returns are about colour or material; accent never sits beside the fabric being judged.

## 6. Layout and grid

Columns 4 / 8 / 12 / 24 from 0 / 640 / 1024 / 1920 px; margin clamp(16px, 3.125vw, 120px); gutter clamp(12px, 1.25vw, 48px); 8 px baseline; section spacing clamp(64px, 8vw, 288px). No container max-width: the grid stretches to 3 840 px, then the body centres. Text always starts on a column line, flush-left ragged-right, measure ≤ 34em. Image ratios are module multiples: 1:1, 4:5, 4:3, 2:1. Only photographs and spot fields go full-bleed.

Visible column lines (grid token, 1 px, behind content) appear in three places: home hero, collection index, footer. Text blocks knock them out with a paper background; none below 1024 px.

At 2560: 24 columns of ~69 px, 32 px gutters, 80 px margins. Hero h1 in cols 1–16, plate in cols 9–24 (~1 590 px); header nav starts on col 9, aligned with the plate. Boutique lists 4 per row, group 8. Product page: gallery cols 1–16, sticky purchase column 18–24. At 3440 × 1440: ~93 px columns; the hero plate is capped at 100svh minus header and first display line and switches to a 2:1 crop via `<picture media="(min-aspect-ratio: 2/1)">`; sections pair side by side instead of stacking.

## 7. Signature moments

1. **Persiana intro.** `<div class="intro" aria-hidden="true">`: one ink panel per column, numbered in 12 px, edges on the column lines (outer panels take the margins), so the panels leave the hero hairlines behind. CSS only: full cover 0–300 ms; each panel `translateY(-101%)` in 420 ms, cubic-bezier(.7,0,.2,1), staggered across 420 ms; gone by 1.12 s, `visibility: hidden` at 1.2 s (forwards); pointer-events none throughout. With a palette active, panels take the spot. A head script adds `html.intro-off` when the sessionStorage flag exists (try/catch); reduced motion hides it. Nothing inside is large enough to become LCP; the hero paints underneath from the first frame.
2. **Hero.** Two explicit h1 lines; plate (3/4 photo, eager, fetchpriority="high", srcset 640–3440) whose top edge meets the baseline of line 1, so line 2 overlaps the plate's guaranteed-clear top zone. Caption top-right in tabular labels. Lead and «Pedir muestras gratis» / «Ver las 12 piezas» in cols 1–7. Phone: h1, full-bleed 4:5 plate, caption, lead, stacked buttons.
3. **Parallax: number bands.** Featured pieces get a band: the index numeral at clamp(160px, 38vw, 1300px), wdth 150, wght 300, aria-hidden, behind a plate in cols 9–24. `animation-timeline: view()` moves the numeral 10vh → −10vh while the plate stays; inside `@supports` and no-preference only.
4. **Carousel: la alineación.** The twelve front-view drawings at one shared scale (`--cm: clamp(1.1px, 0.12vw, 4px)`, width = cm × `--cm`) standing on one 1 px ink floor line; each is an `<a>` with index, name, width, price. Native scroller, `scroll-snap-type: x proximity`, scroll-padding = margin; prev/next buttons only with JS. A two-seater visibly measures half a corner sofa.
5. **Gallery and lightbox.** Mosaic: 2:1 interior, two 4:5, four 1:1 details (seam, weave, leg, mechanism). Each image is an `<a href>` to the large file; JS opens a `<dialog>` holding a scroll-snap strip of all images, caption «■ 07.3 · Costura doble · 3 / 9», arrow keys, Esc, focus restored. Reveal: a plate-coloured cover lifts off each image while it settles from scale 1.04.
6. **Projects.** Each project is a full-bleed 2:1 photo plus a caption that is a table row on fixed column starts: Torrevieja · 3.º sin ascensor · puerta 78 cm · ■ 07 Lena · marzo 2026. Scrolling, the captions align into one table. The project page draws the passage: door opening and package section at scale, margin in cm.
7. **Medidas.** Front, side and top views as inline SVG, 1.5 px non-scaling stroke, no fills, at the shared scale so models compare (cols 1–16); dimension table in cols 18–24. No dimension chains, title blocks or blueprint paper: numbers live in the type system. A server-rendered sentence states the threshold («Cabe por puertas de 80 cm y ascensores de 110 cm de fondo»); JS adds door and lift inputs answering in display type: «Cabe. Margen: 6 cm.» Payload refuses to publish a model without drawings.
8. **Uniform product frame.** Backdrop lit to #EEEEEE ±2; 3/4 view at 30°, camera 70 cm high, 85 mm equivalent, 5 000 K soft key from the left; product 80 % of frame width, feet on the 78 % line, top 30 % clear; plus front, side, four details. Factory photos are re-shot or re-plated (backdrop replaced, shadow normalised, fabric never graded). Frame: plate, index top-left, view label top-right, no border, radius or shadow; caption as a two-column table. Feet on one line make a row of products stand on one floor.
9. **Cart drawer.** `<dialog>` from the right (6/24 columns; full sheet on phones). Rows: 1:1 thumbnail in the chosen fabric, code, name, fabric, quantity, price right-aligned. Then «Entrega y montaje en Torrevieja · 39 €» with a town select, the sample box as six square cells («2 de 6»), member saving, «Continuar con el pedido». Without JS the cart link opens /es/cesta.
10. **Member price.** Two-row table: «PVP 1.290 €» / «■ Socio 1.161 € −10 %», socio row in mark colour, linked to sign-up when logged out. Sales: old price in `<s>`, «−12 %» as an inverted ink label, never red.

## 8. Motion language

Everything moves like shutters and drawers, on vertical or horizontal rails. Durations: 120 ms hover and press, 240 ms menus and crossfades, 420 ms shutters and drawer, 600 ms reveals. Easing: enter cubic-bezier(.2,0,0,1), exit cubic-bezier(.4,0,1,1), shutters cubic-bezier(.7,0,.2,1), scroll-linked linear. Only transform and opacity; no blur, rotation, overshoot or scale above 1.04.

Never moves: text, prices, buttons, header, tables, product photos (hover crossfades to the front view: information, not zoom). No smooth-scroll library.

Reveals: an inline head script adds `js-anim` when motion is allowed; hidden states exist only under `.js-anim`; a 3 s timeout removes it unless the 1 KB reveal script has set `window.__reveal`. Reduced motion: no intro, reveals or parallax; dialogs open instantly; carousel buttons scroll with `behavior: auto`.

## 9. Component vocabulary

Radius 0 everywhere; no shadows (dialog scrim: ink at 48 %). Two rule weights: 1 px hairline in tables, 2 px ink bar opening a section. Buttons: 56 px (group 48), label flush-left, arrow flush-right, full column width; primary ink fill, secondary 1 px ink outline, tertiary underlined text; hover slides the arrow 4 px. Tags: 1 px ink rectangles, «En stock» inverted. Cards do not exist: plate plus caption table. Inputs: 56 px, 1 px ink border, label above, hint in ink-3, errors in error red with text. Swatches: squares, 2 px ink frame when selected. Focus: 2 px outline in ink (on-spot colour on fields) with 2 px paper offset. Header: 64 px, 1 px ink rule, wordmark «divan», five text links, ES RU EN UK as hreflang links, current one squared; phone menu is a full-screen dialog with headline-size links. Footer: inverted ink block with link index, delivery prices by town, video-consultation hours, legal row.

## 10. SEO and performance

- Every word and number is server-rendered Spanish text; drawing numbers repeat in the table; the threshold sentence answers «¿cabe por una puerta de 70 cm?» for search and AI.
- Line-up items, project rows, gallery thumbnails and language links are real `<a href>`.
- No third-party JavaScript: ~1 KB reveal plus ~6 KB for dialogs, fit check and carousel buttons, deferred. Intro and parallax are CSS.
- One variable font, self-hosted and preloaded: latin 112 KB, cyrillic 53 KB woff2; Arial fallback with size-adjust; nowrap display lines keep the swap shift-free.
- LCP: hero AVIF ≤ 250 KB at 2560, eager, preloaded. CLS: dimensions on every image, fixed header, tabular cart count, nothing injected. INP: no scroll listeners, native dialogs, filters as GET links.
- JSON-LD: Product (Offer, member tier via validForMemberTier, width/depth/height) and BreadcrumbList on product pages; Organization site-wide.

## 11. How it could fail

1. **Clinical, a spreadsheet not a home.** Photography fills ≥ 40 % of the home page, interiors in Costa Blanca light, warm plain copy.
2. **Generic Swiss template.** Hairlines only in tables and group cells, poster-scale type, no newspaper columns.
3. **Factories ignore the photo standard.** Payload requires a view tag; CI checks backdrop corners within ΔE 2 of #EEEEEE; failures fall back to contain-on-plate.
4. **Cyrillic overflow.** Fit-to-measure, wdth 112, line fields with counters, screenshot QA at 390 and 2560 in ru and uk.
5. **Accent sprawl.** Spot only through a `<SpotField>` component; a dev check fails on a second one.
6. **Grid as noise.** Three places only, #E6E6E6, knocked out behind text, off below 1024 px.
7. **Missing drawings stall launch.** Redraw every model from factory CAD into one template before launch; "no drawing, no publish" is deliberate.
8. **The font's name.** It is a Grilli Type grotesk aliased as Divan Grotesk; if the owner objects, Roboto Flex (same axes, cyrillic = 4, has №) drops in.
