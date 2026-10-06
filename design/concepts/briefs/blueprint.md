# blueprint - Cota Cero

## 1. Concept and feeling

Divan publishes every sofa the way an architect publishes a building: as a drawing set. Each page is a sheet with a hairline frame; the sofa stands on a ground line marked ±0,00, dimension lines give its width in millimetres, and a title block carries price, lead time and the delivery fee for your town. Photography is mounted on the sheet as plates: warm Costa Blanca light inside exact frames.

First five seconds: a dash-dot cutting line crosses white paper, the paper opens along it, and a velvet sofa appears under a dimension reading 2340. The headline sits on a heavy rule, like the title of a drawing. Feeling: these people measure everything, so I can buy without a showroom.

## 2. Apple among sofas, only cooler

Apple sells objects nobody has touched by documenting them: one product per screen, a vast white field, tech-spec pages with drawn views in millimetres. Cota Cero makes that drawing the hero instead of the footnote. Cooler: it shows the inside (a cushion section with foam densities), checks the sofa against your lift before you pay, and draws every model at one scale, so a two-seater looks smaller than a corner sofa while competitors write "pregúntanos".

Vastness: the sheet spans a 3440 px monitor, one product per viewport, 160–240 px between sections. Seriousness: the register of documentation (scales, references, revisions). Minimalism: two neutrals, one accent palette, one set of line weights; no shadows, gradients or rounded boxes.

## 3. One system, two storefronts

Shared: tokens, three typefaces, pen weights, the title block, the common-scale product frame with its 1 m scale bar, "round means reference", a drawing set for every product, and the wordmark: DIVAN in wide caps over a dimension line, "boutique" or "group" under it in mono.

divan.boutique: palette Latón by default, 3-up plates (4-up at 2560), visible frame and zone letters, a plate as hero, five links: Colecciones, Proyectos, Muestras, Entrega, Cesta.

divan.group tightens: palette Cianotipo; Plex at wdth 92 in cards, filters and menus; 4/6/8-up grids at 1440/2560/3440; sections 64–96 px apart; zone letters off; cards show width only. The mega menu is an "Índice de planos" (category columns with counts, opened by a button, links server-rendered). Filters form a schedule with three filters nobody else has: width in cm, "pasa por una puerta de __ cm" (diagonal depth), ships within.

## 4. Typography

- **IBM Plex Sans** (wdth 85–100, wght 300–600), everything you read: H1/H2 Light 300, tracking −0.028em/−0.02em; H3 and UI Medium 500; body 400; prices with tnum.
- **Martian Mono** (wdth 87.5, 300/500), only what a tape could measure: mm, kg/m³, days, scales, references. It lacks U+202F, U+2009, ≤, ≥ and ⌀: write 2340 unseparated (SI and RAE), NBSP before units, Ø for diameters.
- **Science Gothic** (wdth 150, 400, caps only, +0.08em), lettering: the Bank Gothic lineage of CAD title blocks, for labels of at most four words at 10.5–13 px.

Verification: the brief's command (UA "Mozilla/5.0") returns 0 for all three, Plex included, because Google then serves one unsubsetted TTF. With a current Chrome UA it returns cyrillic=4 and latin-ext=2 for each, and the TTF cmaps contain full Russian, Ґ Є І Ї, ñ ¿ ¡ and €.

Scale at 390/1440/2560/3440 px: H1 clamp(2.5rem, 1.25rem + 3.9vw, 9rem) = 40/76/120/144; H2 clamp(1.75rem, 1rem + 1.9vw, 4.5rem) = 28/43/65/72; H3 20/24/31/32; body clamp(1rem, .94rem + .18vw, 1.25rem) = 16/18/20/20; measurements 12/13/15/15. Prose never exceeds 68ch.

Cyrillic: "Диваны на заказ, выверенные до миллиметра." and "Дивани на замовлення, виміряні до міліметра." run 15–25% longer than "Sofás a medida, medidos al milímetro.", so headings use text-wrap: balance, no hyphenation, and under :lang(ru) and :lang(uk) tracking −0.02em and line-height 1.04 to clear Й and Ї. Plex's flat-topped д and л stay crisp in Light. Labels localise as drafting terms: Лист/Аркуш, М 1:20, Разрез/Розріз.

## 5. Colour

Neutrals are drafting-film white and graphite (hue 250–260, chroma under 0.01). Light/dark:

- paper #F9FAFB/#0D0E11 (oklch .985 .002 250 / .165 .006 260); plate #F1F3F4/#15171A; sunk #E5E7EA/#1E2124
- line-faint #D7D9DC/#2A2D31 (decorative only); line #BBBEC1/#3D4044; line-strong #7E8084/#76797E (UI borders, ≥3.2:1)
- ink-3 #626569/#989CA0 (≥4.7:1); ink-2 #424549/#BBBEC1; ink #131519/#EEF0F3 (17.5:1 and 16.9:1)

Accent palettes are drafting-table media. Each has an ink (text-capable lines), a mark (chip fill, always with ink text) and a wash (ground of drawing plates), given as ink/mark/wash:

- **Cianotipo**, monochromatic H 250–262: light #254C96/#AFCEF1/#E9F2FC, dark #9CC0F5/#9CC0F5/#172135.
- **Latón**, analogous H 80–92, bronze to brass: light #6A5022/#DFBD69/#F7F2E4, dark #E0C071/#DFBD69/#2A2012.
- **Tablero**, complementary, board green H 163 with eraser rose H 8: light #176145/#EEB6BF/#E8F5EE, dark #8DCEAF/#EDB2BB/#10271D.
- **Lacre**, split-complementary, oxblood H 22 with sage H 172 and cool grey H 232: light #912D31/#AAD6C7/#EAF3F8, dark #EFA4A1/#A0D0C0/#18232A.

Checked: accent ink on paper, plate and wash ≥6.5:1 light and ≥8:1 dark; paper on accent ink ≥6.9:1; ink on mark ≥10:1.

Rules: accent lives only in lines and small marks (the live dimension, cutting lines, selected swatch or filter, current sheet, member chip, primary-button hover, delivery route, revision delta). Ink plus mark stay under 5% of any viewport; wash only grounds a drawing plate, one in view at a time, never behind photos, prose or forms. Never in headings, never a gradient. No palette pairs blue with yellow or red with blue: in Torrevieja both read as flags. Status is never colour alone: "Pasa ✓ / No pasa ✕" plus hatching.

## 6. Layout and grid

- Columns 4/6/12 (under 600, to 1023, from 1024); gutter and sheet margin 16/20/24/32/40 px from 390/600/1024/1440/2560.
- From 1024, a 1 px ink frame sits at the margin, topped by a 22 px strip of zone letters A–L marking the twelve columns. Under 600 there is no frame and plates bleed to the viewport edge; otherwise nothing crosses the frame.
- Anchored, never centred: titles left, title blocks right, drawings in the wider half.
- From 2560: margin and gutter 40 px, and a 440 px title strip opens on the right behind a 2 px rule. It is sticky and holds the page's title block (product: buy box; home: sheet index, samples CTA, delivery quote; catalogue: filter schedule). The field keeps 12 columns of 150–200 px; prose stays at 68ch while plates take 7–12 columns. Above 3440 the sheet stops growing and centres on a sunk-grey body: a sheet on a drafting table.

## 7. Signature moments

- **Intro "Corte A–A".** Aria-hidden overlay of two paper halves. From 0.15 to 0.70 s a dash-dot cutting line in accent ink draws across mid-height (scaleX) and section heads "A" fade in; from 0.90 to 1.30 s the halves translate apart; at 1.35 s visibility:hidden (forwards fill). Pointer-events none throughout; a head script adds .intro-seen after the first view (sessionStorage, try/catch); display:none under reduced motion.
- **Hero "Alzado 01".** Frontal photo (camera 90 cm, 85 mm lens) on a plate inset by the margins, height clamp(360px, 100svh − 340px, 1080px). Dimension 2340 and level marks ▽ ±0,00 / +0,45 / +0,82 are placed from per-image anchors stored in Payload; lines over photos are cased, values sit on paper knock-outs. The H1 is a drawing title: view bubble 01/A-101, 3 px rule, "ESCALA 1:20 · FABRICADO BAJO PEDIDO EN YECLA" beneath. The title block docks bottom-right.
- **Parallax "Sección explosionada".** Cushion section in five SVG layers (beech frame, webbing, HR 35 foam, fibre, fabric) with hatched poché and HTML labels. The static state is exploded; with animation-timeline: view() and motion allowed, layers travel from assembled to exploded (translateY).
- **Carousel "Alzado de la colección".** Native scroll-snap row of links: every model on one continuous ground line at one scale (width = mm × --k, 0.11–0.30 px/mm), dimensioned above. Arrow buttons stay hidden until script runs.
- **Gallery.** Photos as numbered plates with crop marks; the lightbox <dialog> adds a key plan, the sofa footprint with a camera cone at the shot's stored angle.
- **Projects.** Photo plate beside the room plan: sofa in poché, carry-in route dashed from the front door, and a schedule of town, floor, lift, door width, model, fabric and delivery days.
- **Drawing set.** Elevation, plan and side view in first-angle projection; callout bubbles link to details; mm/cm/in switch; PDF. "¿Cabe?" takes door, stair and lift sizes (presets: CTE lift 1000×1300, older 800×1000) and redraws the package through the opening; the minimum door width is printed in HTML.
- **Uniform product frame.** A 3:2 plate equals 3600×2400 mm (armchairs at double scale); alpha cut-out at width W/3600; ground line at 82%; one CSS contact shadow; light from upper left at 45°, the draughtsman's convention; D50 grade; 1 m scale bar.
- **Samples box.** Exploded axonometric with balloons and a parts list (six 10×10 cm fabrics, foam cut, leg finishes, tape measure, return envelope) beside a documentary photo of the courier at a door.
- **Cart drawer.** Right-hand modal <dialog>, translateX in 280 ms: parts-list rows with scale thumbnails in the chosen fabric, "Muestras 0/6 gratis", totals as a title block with your town's delivery. The CTA follows ADR-0010: "Enviar pedido", later "Pagar con tarjeta o Bizum".
- **Member price.** PVP, the saving written as a tolerance (1790 € −140) and a mark chip "SOCIO 1650 €"; logged out, the chip links to sign-up.

## 8. Motion language

Lines draw like a pen plotter; everything else is instant. Easing: plot cubic-bezier(.65,0,.35,1), UI cubic-bezier(.2,0,0,1). Durations: underline 160 ms, line 480 ms (60 ms stagger, six at most), panel 280 ms, crossfade 200 ms, intro 1.35 s. Only transform and opacity animate. Never moving: text, prices, buttons, photographs (no zoom, no parallax), header, layout. The js-anim class hides line work only, never text. Reduced motion: no intro, static lines, static exploded section, dialogs without translate, scroll-behavior auto.

## 9. Component vocabulary

- Radius 0. A circle always means a reference (view and callout bubbles, cart count); native radios excepted. No shadows: depth is pen weight and paper tone.
- Pens: 0.13 = 0.5 px, 0.25 = 1 px, 0.35 = 1.5 px (ticks, icons), 0.50 = 2 px (focus), 0.70 = 3 px (title rule, active nav, cutting line).
- Buttons 48/52/56 px, label left, arrow right. Primary ink, accent ink on hover; secondary 1 px ink outline; links underlined. Focus: 2 px ink outline, 2 px offset.
- Tags: 1 px line-strong box in Science Gothic; "△ NUEVO"; "ESCENA ILUSTRATIVA" on AI scenes.
- Cards: borderless plate, name Plex 500, dims in Martian, price; hover draws the width line.
- Inputs: 48 px, square, 1 px line-strong, title-block label, unit suffix in Martian, 16 px value, errors as text with ✕.
- Swatches: 40 px squares, like the 10 cm samples.
- Header: a title strip, active link on a 3 px rule. Footer: the sheet's title block (contact and video call, delivery schedule, 14-day returns, payment, 3-year guarantee, languages, palette, sheet reference).

## 10. SEO and performance consequences

- Everything is server-rendered in Spanish. Drawings are inline SVG generated from CMS numbers and repeated in an HTML spec table; labels are HTML; one h1; sheet codes sit outside headings.
- LCP: the hero plate image is eager, fetchpriority high, srcset -sm/large. Inset and shorter than the viewport, it is never discarded by Chromium as a full-viewport background. Nothing above the fold starts at opacity 0; the intro holds no image.
- CLS ≈ 0: aspect-ratio plates, SVG viewBox with width/height, next/font metric fallbacks, title strip by media query.
- INP: about 10 KB of vanilla modules, no animation or smooth-scroll library, zero third-party JS at launch.
- Fonts: es page 79 KB (Plex 44.6, Martian 23.1, Science Gothic caps subset 11.1); ru/uk add 39 KB.
- JSON-LD: Product width/depth/height (unitCode MMT); Offer with a member priceSpecification (validForMemberTier, Organization.hasMemberProgram), shippingDetails, 14-day return policy; BreadcrumbList.

## 11. How this direction could fail

- Mismatched factory photos: the common-scale lineup exposes them. A normalised elevation with anchors is a required Payload field: no image, no publish.
- Cold CAD: alternate photo plates and drawings, at least one photograph per drawing, at most three annotations per viewport outside the drawing set.
- Fake precision: numbers only from CMS fields checked against the factory ficha, printed with "±2 cm, hecho a mano".
- Science Gothic enlarged reads sci-fi, or Soviet in Cyrillic caps: never above 13 px.
- Precision invites over-claiming: "fabricado en Yecla", never "nuestra fábrica".
