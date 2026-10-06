# cinema - Plano Secuencia

## 1. Concept and feeling

Divan is shot as one long take (*plano secuencia*): a single sofa on a seamless studio sweep, and scrolling is the camera that pushes in, tilts and pulls focus. Every sofa from every factory passes through the same studio, with the same sweep, five camera positions, light and scale, so the catalogue plays as one film. Type behaves like film titles: small, exact, in the title-safe corner. Only the numbers that decide a purchase (centimetres, weeks, euros) get to be huge.

First five seconds: black, a slit of light, then a letterbox opening onto a pale, vast, silent studio with one sofa low in the frame. The visitor feels the hush before a launch and the calm of a brand that has measured everything.

## 2. Apple among sofas, only cooler

From Apple: the object as hero; frameless photography (the sweep colour is the page colour, so the sofa stands on the page itself); keynote numerals; scenes staged by scroll. "Cooler" is the film grammar Apple never uses:

- **CinemaScope.** A 3440×1440 monitor is 2.39:1, the anamorphic ratio. Ultrawide viewports get a 2.39:1 hero crop that fills the owner's monitor edge to edge.
- **True scale.** Every sofa is shot at the same pixels per centimetre, so the collection itself answers "will it fit?". Size causes 58% of furniture returns.
- **Slates, rack focus and end credits** instead of badges.

How it honours the brief:
- **Vastness:** the frame never stops and the object never fills it.
- **Seriousness:** facts, and no promotions above the fold.
- **Minimalism:** one object, one sentence and one accent per scene.

## 3. Flexing into divan.group

**What stays:** tokens, the sweep frame and photo spec, the type family, slates, dialogs, motion curves and grades.

**What tightens:**

- **Type:** text uses the wdth 87.5 instance of the same family, and each domain downloads only its own width. Body is 16–18px; spacing base is 8px instead of 12.
- **Scenes:** no intro and no sticky scenes. The hero becomes a 2.39:1 strip, at most 560px tall.
- **Mega menu:** a full-width panel with 4–6 link columns and one featured frame. It opens on click or after 150ms of hover intent, and its links are always in the DOM.
- **Filters:** a GET `<form>` in a sticky rail (≥1024px) or a bottom-sheet `<dialog>`. Pagination uses real `?page=` links.
- **Grid:** 2/3/4/6/8 columns at 390/768/1440/2560/3440px, filled with 4:3 sweep frames at fit scale. An `aria-pressed` "Ver a escala real" toggle switches to true scale.

## 4. Typography

**Verification.** The literal `curl -A "Mozilla/5.0" … | grep -c cyrillic` prints **0** for every family, Roboto included, because Google Fonts answers a bare user-agent with one unsubsetted TTF. With a Chrome user-agent it prints **4** for cyrillic (cyrillic and cyrillic-ext, two weights each) and **2** for latin-ext, for both families. The cyrillic range includes U+0490–0491, so Ґ, Є, І and Ї are covered; I rendered them to confirm.

- **TikTok Sans** (Grilli Type; Cyrillic by Contrast Foundry; opsz/wdth/wght axes).
  - Text and display: wdth 100 (group 87.5), wght 300–700. Titles 500, body 400, labels 500.
  - **Cifra:** the same family pinned at wdth 75 / wght 300 and subset to digits, symbols and the wordmark (8.2KB). These are tall numerals, like lens markings.
- **Martian Mono** 400 for slates: uppercase, 12–13px, +0.04em.
- Rejected: Sofia Sans, because it uses Bulgarian Cyrillic letterforms by default.

**Scale** (fluid, stops growing at 2560px):
- Body: `clamp(1.0625rem,1rem+.15vw,1.25rem)`, 17→20px.
- Scene titles: `clamp(1.75rem,1.2rem+1.6vw,3.75rem)`.
- h1: `clamp(2.125rem,1.4rem+2.6vw,5.5rem)`, 34→88px, measure 12em.
- Cifra: `clamp(5.5rem,1.5rem+12vw,22rem)`, 88→352px.
- Leading: 1.55 body, 1.06 titles, 0.85 cifra. Figures are tabular lining.

**Russian and Ukrainian:** native letterforms with an even, low-ascender texture; words run 15–20% longer than Spanish.
- Cyrillic titles track −0.015em (Latin −0.025).
- Titles use `text-wrap: balance` and non-breaking hyphens (Коста‑Бланка).
- Title slots are sized for the Ukrainian string.

«Диваны из Йеклы со сборкой на Коста‑Бланке» sets in three balanced lines at 390px. Units (cm/см) use the text face, and prices use `Intl.NumberFormat`.

## 5. Colour

**Neutrals:** hue 95°, chroma ≤0.004. Light mode is the studio; dark mode is the screening room.

|token|light/dark|role|
|---|---|---|
|paper|#FDFCFC/#1C1C1B|dialogs, drawer, inputs|
|stage|#EEEEEC/#0F0F0E|page = product sweep|
|stage-2|#E4E4E2/#171716|panels, placeholders|
|hairline|#D3D2D0/#2E2E2C|decorative rules|
|edge|#81807D/#6F6F6D|control borders, 3.40/3.81:1|
|graphite|#61605E/#ABABA9|secondary text, 5.41/8.34:1|
|ink|#141412/#F0F0EF|text, primary buttons, focus, 15.9/16.8:1|

In dark mode, product frames keep the light sweep and read as lit screens in a dark room.

**Grades.** Each accent palette tints the light, never the product. Values are light/dark.

|grade|harmony|accent|wash|partner|night|
|---|---|---|---|---|---|
|**Granate** (boutique default)|split-complementary 18°→168°+228°|#98333D/#DC9693|#F6E9E9/#2A1A1B|#477765/#8CBEAA|#200E0F|
|**Hora azul** (group default)|monochromatic 255°|#215DA5/#88B4ED|#E7EDF6/#16202E|#193358/#C6D9F2|#0A1423|
|**Tungsteno**|complementary 62°↔245°, tungsten against daylight|#8B551C/#E8B36F|#F1ECE4/#271D14|#426786/#92B6D5|#1B1209|
|**Pinar**|analogous 158°+125°|#296948/#88C8A3|#E7F0E8/#15231B|#5E713C/#B2C78F|#08180F|

**Contrast, checked:**
- Accents are ≥4.83:1 on every light surface and ≥6.99:1 on every dark one.
- Ink on any wash is ≥15.5:1.
- Partners are ≥4.41:1.
- Light ink on any night tint is ≥16:1.

**Rules:**
- **Accent** appears only in: the member price, the selected swatch/variant/filter, the 2px progress line, link-hover underlines and the sample counter.
- **Wash:** at most one panel per page.
- **Partner:** secondary indicators only.
- **Night:** tints at most two dark scenes per page: the delivery keynote ("90 min de Yecla a tu salón · 3–4 semanas · 39 € Torrevieja") and the footer.
- **Share:** accent plus partner ≤2% of any viewport. Never on photos, headings, body text, icons or primary buttons.
- **Errors:** fixed #B3241F/#F2897C, always with an icon and text.

## 6. Layout and grid

There are two layers:
- **Frame:** full-bleed, with no max width, ever.
- **Grid:** 4/8/12 columns at 390/768/≥1024px. Margin `clamp(16px,3.6vw,128px)`, gutter `clamp(12px,1.25vw,40px)`.

Text anchors to the left title-safe edge. Columns it doesn't use become negative space; there is never a centred container. Body measure is 34em. Heights never use bare `vh`; scenes are `min(100svh - header, 90rem)`.

**At 2560px and above:**
- Type stops growing, and margins reach 92–124px. Frames keep scaling.
- Viewports at 2:1 or wider load the 2.39:1 hero crop.
- Boutique grids go from 3 to 4 columns; the group grid reaches 8 at 3200px.
- On the PDP, gallery and buy box go from 8:4 to 9:3 columns (buy box ≥560px, sticky).
- Beyond 3440px (32:9 monitors), grids cap at 3440px; frames never do.

## 7. Signature moments

1. **Apertura (intro).** The first child of `<body>`: two ink half-screen bars and a small wordmark, `aria-hidden` and `pointer-events:none` throughout.
   - 0–250ms: the wordmark fades in.
   - 250–950ms: the bars part from the centre line, so the screen is fully opaque for about 400ms.
   - The hero settles from scale 1.04 over 1.2s.
   - The overlay ends at 1.45s (`forwards`, `visibility:hidden`).
   - A sessionStorage flag (try/catch) adds `.intro-seen`. The intro is also removed under reduced motion and in `<noscript>`. Boutique home and collection pages only.
2. **Plano general (hero).** One `<picture>` with 2.39:1, 16:9 and 4:5 crops of one master, selected by aspect-ratio media queries. Eager, `fetchpriority="high"`, AVIF ≤250KB at 3440px; the flat sweep compresses well.
   - The sofa sits on a horizon at 62% of frame height.
   - Slate, h1, "desde 1490 €" and two links sit bottom-left. They need no scrim, because the sweep is uniform.
   - On exit, the camera dollies in to scale 1.1.
3. **Inclinación (parallax).** A project photo 150% the height of its 2.39:1 window translates 0→−33%. The camera tilts from the window light down to the sofa.
4. **Alineación (carousel).** All sofas stand on one sweep at true scale (width = cm × px/cm from the manifest), sharing one floor line.
   - A native `overflow-x` scroller with `scroll-snap-align:center`.
   - Each sofa is an `<a>` with name, width and price.
   - Prev/next `<button>`s call `scrollBy`.
   - Progress uses `animation-timeline: scroll(inline)`.
5. **Tomas (gallery and lightbox).** Fixed take order: 3/4, front, side, back, macro, in situ. Each `<a href="large.avif">` upgrades to a `<dialog>` on #0F0F0E with a "03/07" slate, arrow keys, Escape, focus restore and tap-to-zoom 2× at the pointer.
6. **Localizaciones (projects).** 2.39:1 frames with a location slate (TORREVIEJA · PISO 74 M² · 2026). Each project opens with the tilt and closes with **Reparto**, end-credit rows such as "Sofá — Brisa 3 plazas, Lino Arena — 1490 €". Every row is a link, followed by the room total and "Añadir el salón a la cesta".
7. **Ficha (technical drawing).** A sticky stage over a three-frame track.
   - The long-lens front photo dissolves into an inline SVG elevation at identical scale: 1.5px lines, dimensions as real text.
   - Numeral rows (ancho 228, fondo 96, alto 82, asiento 45) share rack focus: the active row is at opacity 1, the others at 0.62. That keeps contrast at 4.88:1 in light mode and 6.89:1 in dark, never below AA.
   - The scene ends at "¿Pasa por tu puerta?": three inputs, with the answer in `aria-live`.
8. **El plató (uniform frame).**
   - Sweep exactly #EEEEEC (sRGB); horizon at 62%.
   - Key light from 45° upper-left, fill 2 stops under, one contact-shadow preset, camera at 70cm.
   - Five takes; masters at 10px/cm.
   - Factory photos are cut out, re-lit to a grey card and composited. Upholstery is never AI-altered and must match the physical sample within ΔE ≤3.
9. **Cesta (drawer).** The header link to `/es/cesta` upgrades to a button that opens a right-hand modal `<dialog>` (`min(480px,100vw)`, translateX over 280ms). It holds:
   - Thumbnails that show the chosen fabric.
   - The sample box, "3 de 6 · gratis" (this page's wash panel).
   - Delivery: "Torrevieja · entrega y montaje 39 € · 3–4 semanas".
   - The total, set in cifra.
   - A "Tramitar pedido" link.
   - A slate: "14 días de desistimiento · garantía 3 años".

   The courier's demo box also gets a home scene, **En la caja**: a top-down still of six swatches and a tape measure, like Apple's "in the box".
10. **Precio socio (member price).** The public price is in ink. Below it, "Precio socio 1340 €" appears in accent with an accent-outlined SOCIO slate. Logged-out visitors also see "Hazte socio gratis". Both prices are in the HTML.

## 8. Motion language

Only images move, like a camera: dolly (scale ≤1.1), tilt (translateY), dissolve and rack focus (opacity).

- **Engine:** scrubbed scenes use CSS scroll-driven animations on the compositor. One-shot image reveals (opacity 0→1, scale 1.04→1) use IntersectionObserver, scoped under `.js-anim` with the 3-second failsafe.
- **Durations:** 120ms hover, 280ms dialogs, 700ms reveals, 1.2s hero settle.
- **Easings:** dolly `cubic-bezier(.65,0,.35,1)`, cut `cubic-bezier(.2,0,0,1)`, reveal `cubic-bezier(.16,1,.3,1)`.
- **Never moves:** body text, prices, buttons, inputs, header, buy box. Text never starts hidden; titles may rise 12px.
- **Reduced motion:** no intro; sticky tracks become stacked stills; no scrub or zoom; dissolves become cuts; dialogs fade in over 120ms.
- **No `animation-timeline` support:** browsers get the same stills.

## 9. Component vocabulary

- **Radii:** 0 on frames, images, cards, dialogs and the drawer. A 2px machined edge on buttons, inputs, chips and slates. Circles only for swatches and the cart count.
- **Shadows:** none, except `0 24px 80px rgb(0 0 0/.18)` on dialogs. Photos carry their own contact shadow.
- **Buttons:** primary is an ink fill with paper text, 48px tall (boutique 52px), 16px/500, sentence case. Secondary is a 1px edge outline.
- **Links:** ink, with an underline that turns accent on hover.
- **Focus:** 2px ink outline at 3px offset.
- **Slates:** Martian Mono in a 1px hairline box, e.g. "BAJO PEDIDO · 3–4 SEMANAS".
- **Cards:** no container. Frame, slate, name, price, member price and up to 5 swatches. On hover, a 1.03 dolly and a dissolve to the side take.
- **Inputs:** 48px, paper fill, 1px edge border, label above.
- **Navigation:** a 64px solid header with no blur and no hide-on-scroll.
  - The wordmark is set in the cifra cut.
  - Language links ES·RU·EN·UK carry `hreflang`.
  - Below 1024px, the menu moves into a full-screen `<dialog>`.
- **Footer "Créditos":** the night tint, then credit rows (e.g. Fabricación — talleres de Yecla), then link columns: collections, service, cities (ADR-0002), language.

## 10. SEO and performance consequences

- **Nothing is injected, and text never hides.** Rack focus only dims; the stills are the content.
- **The hero `<img>` is in the HTML, and the intro only overlays it.** In the lab, the overlay intro kept LCP at about 300ms; a loader that gated visibility pushed it to 1,808ms.
- **Heights are capped and reveals apply to images only.** In the lab, observer reveals inside vh-sized sections stayed hidden in a 412×12,140 crawler viewport.
- **No animation library, no Lenis, native scroll.** About 2KB of our own script, and no scroll listeners.
- **Fonts** (measured woff2, self-hosted):
  - Spanish pages: 62KB (text 43.7 + cifra 8.2 + mono 10.1).
  - Russian and Ukrainian pages: 88KB.
  - Preload only the locale's text subset. `swap` plus size-adjusted fallbacks keep CLS ≈0.
- **Images:** AVIF/WebP `srcset` with -sm and large variants, width/height from the manifest, lazy and async below the fold.
- **JSON-LD:** Product with an Offer whose `UnitPriceSpecification.validForMemberTier` carries the member price, plus BreadcrumbList. `MemberProgram` sits under Organization on the policies page.
- **Group facets:** curated categories are indexable; other filter URLs are `noindex,follow`.

## 11. How it could fail, and prevention

- **Inconsistent photography breaks the illusion.**
  - Enforce El plató through Payload media fields (take, px/cm, sweep check).
  - Launch fewer SKUs, all fully shot.
  - Unshot products show their SVG elevation instead.
- **It reads as an Apple pastiche.** Keep the film grammar, studio grey rather than white, and Granate rather than Apple blue.
- **Scroll theatre hides the shop.**
  - At most 3 sticky tracks on home, 1 on the PDP, 0 on listings.
  - Add a "Saltar al catálogo" link.
  - Keep the buy box in the first viewport.
- **Grey reads dull.** Body ≥17px, graphite ≥5.4:1; test on cheap panels and in sunlight.
- **Accent creep.** A stylelint allowlist limits accent tokens to six components.
- **Cyrillic overflow.** Write the Ukrainian strings first; no fixed-height text boxes.
