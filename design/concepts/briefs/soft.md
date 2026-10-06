# soft - Upholstered Monochrome

## 1. Concept and feeling

The interface is upholstered: every large surface is a cushion with concentric corners and a stitched inner welt, and it gives slightly when pressed. Type is one superfamily in two cuts, rounded Nunito outside and flat Nunito Sans as the frame, on paper, muslin and velvet, with real fabric shot in black-and-white macro as the only ornament. The home page states the method: “Suave por fuera. Serio por dentro.”

First five seconds: a grey cushion inflates into the hero frame and a sofa is simply there, lit like a studio still. Heavy round letters, a bouclé swatch you can order free, the price already visible. Calm, warm without beige, expensive without chrome: you want to touch it, and the next line says you can.

## 2. Apple among sofas, only cooler

Apple's soft-hardware pages (AirPods Max, HomePod, iMac) win with one object per screen on a seamless ground, continuous corners, materials in macro, colour as a chosen finish. We take that grammar literally: the cove is our seamless ground, corners are concentric squircles, bouclé is our mesh, the palettes are our finishes. Cooler, because Apple's softness is a skin over aluminium and ours is the subject: the page gives like a cushion, then a courier puts the fabric in your hands.

Vastness: one idea per viewport, cushions gutter to gutter at any width, display type to 190 px, a third of each screen left empty. Seriousness: accent ≤ 2 %, no bounce, no all-caps, a number in every claim. Minimalism: one family, one shadow, four radii, one palette.

## 3. divan.group: same family, tighter weave

Shared unchanged: tokens, type, the cove, pills, the press, cart drawer, member pill, palettes. What tightens:

- Radii one step down (hero 56 → 32 px at 1440, card 28 → 18); display capped at 120 px; Nunito only for H1, H2 and prices.
- Welt only on hero and drawer; no intro, no parallax (“Por dentro” becomes a static figure).
- Default palette Siesta (boutique: Madrugada): one family, two finishes.
- Mega menu: a cotton panel opened by click or Enter, four link columns and one cove tile.
- Filters: sticky rail from 1280 px, removable chips above the grid, bottom sheet on mobile, “Entrega en ≤ 7 días” as a filter.
- Grid 2/3/4/5/6/7 columns at 390/768/1280/1920/2560/3200 px, gaps 12–20 px. Card = cove, name, dimensions, price, member pill, five fabric dots; no border, no shadow.

## 4. Typography

**Nunito**, display (“upholstery”): variable 700–800, only at ≥ 28 px, tracking −0.035 em (Cyrillic −0.028 em), line-height 0.94 display / 1.02 headlines. **Nunito Sans**, text (“frame”): 400 body, 600 UI, 700 prices, line-height 1.55 (ru/uk 1.6). Both draw tabular figures by default (measured), so prices and dimensions align.

Verification: the literal `curl -A "Mozilla/5.0" … | grep -c cyrillic` prints **0** for both, and for Roboto too, because that user agent receives one unsubsetted TTF without subset comments. A current Chrome user agent gets **cyrillic 4, latin-ext 2** for each family, and a cmap read of the “Mozilla/5.0” TTF confirms full Spanish, Russian and Ukrainian sets (є і ї ґ ’) plus × € ₴ № « » – —. Arrows and U+202F are absent: arrows are SVG icons; prices use a no-break space.

Size in px, clamp() linear from 390 to 2560, then growing only to the 3440 cap:

| Role | 390 | 1440 | 2560 | 3440 |
|---|---|---|---|---|
| Display (hero h1) | 44 | 96 | 150 | 190 |
| Headline h2 | 32 | 56 | 84 | 100 |
| Title h3 | 22 | 28 | 36 | 40 |
| Lead | 19 | 22 | 26 | 28 |
| Body | 16 | 17 | 19 | 20 |
| UI | 14 | 15 | 16 | 17 |

Cyrillic keeps the same rounded terminals, so “Мягкий снаружи. Серьёзный внутри.” and “М’який зовні. Серйозний усередині.” feel as soft as the Spanish, but run about 20 % longer: hero budget 34 characters es, 40 ru/uk, `text-wrap: balance`, three lines at 1440 where Spanish takes two. No hyphenation in display, no all-caps anywhere: Cyrillic capitals become a fence of stems.

## 5. Colour

Neutrals sit at OKLCH hue 95, chroma ≤ 0.004: too grey for cream, warm enough not to feel blue. Light / dark:

- cotton, raised surfaces: #FDFDFC / #201F1D
- paper, page: #F5F5F3 / #161614
- muslin, the cove and wells: #E8E7E5 / #282825
- seam, hairlines and welt: #D7D7D4 / #3A3937
- felt, control borders: #81807D in both modes
- graphite, secondary text: #5B5B58 / #B5B4B2
- ink / bone, text: #151513 / #F1F1EF
- velvet, “the black” (primary pill, footer, night band): #1F1E1C / #0B0B0A
- error: #B02B27 / #F69B94

Ink on paper 16.8:1, graphite 6.2:1 (5.5:1 on muslin), felt 3.6:1; dark mode 16.0, 8.8 and 4.6:1; error 6.0 and 8.7:1.

Accent palettes are four finishes named after moments of a Spanish day on the sofa. Thread = accent ink, wash = tinted surface, piping = harmony partner (non-text only).

| Palette | Harmony rule | Thread | Wash | Piping | Dark thread / wash / piping |
|---|---|---|---|---|---|
| Siesta | monochromatic, hue 162, shutter green | #29694D | #E4F4EB | #388D68 | #8ECEAE / #1B2F25 / #4A9874 |
| Sobremesa | analogous, rosé 8 + mauve 342 | #9A4156 | #FCEBEE | #955C80 | #ECADB8 / #392327 / #C891B3 |
| Vermut | split-complementary, olive 112 + plum 322 | #5F6223 | #EFF1E0 | #73477A | #C5CA86 / #2A2C1A / #C39AC9 |
| Madrugada | complementary, indigo 266 + dawn straw 86 | #395498 | #EAEFFA | #DDB966, on velvet only | #AAC0F2 / #212A3E / #EAC673 |

Every thread reaches ≥ 5.2:1 on paper, cotton, muslin and its own wash; dark threads ≥ 7.8:1; ink on any wash ≥ 15.8:1, bone on dark washes ≥ 12.5:1; piping ≥ 3:1 on its ground.

Rules: one palette at a time, default per storefront in a Payload global, switchable by visitors in the footer (cookie, rendered on the server). Thread may colour link underlines, the member price, the sample counter, selected-swatch rings, active filters, carousel progress and the wordmark dot: together ≤ 2 % of a viewport. One wash surface per viewport, ≤ 12 %. Never on product coves or photos, body text, headlines, primary buttons, focus rings or errors.

## 6. Layout and grid

- Columns 4 / 8 / 12 / 16 below 640 / 640–1023 / 1024–2559 / from 2560 px. Gutter clamp(16px, 2.5vw, 88px), column gap clamp(12px, 1.25vw, 40px), section rhythm clamp(64px, 8vw, 240px).
- No page max-width. Measures: body 64 ch, lead 40 ch, hero copy ≤ 44 % of the hero. Text flush left, never centred.
- Inset-bleed: hero, bands and footer are cushions inset by the gutter and never touch the screen edge; only carousel tracks run edge to edge, so the next card peeks.
- From 2560: 16 columns, text held to columns 2–7, imagery takes the rest; body type stops growing, display continues; grids add columns rather than stretching cards past 640 px (boutique 4 at 2560, 5 at 3440); hero height min(100svh − header − gutter, 1500 px).
- From 3000 px (21:9) the hero splits into copy (columns 1–5), cove (6–13) and a vertical stack of the sofa's three fabric swatches (14–16): the extra width becomes product, not emptiness.

## 7. Signature moments

**Intro “Inflado”.** First child of body, `aria-hidden`: a fixed paper sheet with the inline-SVG wordmark and a muslin cushion sharing the hero frame's CSS variables, starting at scale(.18). Keyframes: 0–250 ms wordmark; 250–1000 ms the cushion inflates and lands exactly on the hero frame; 1000–1450 ms the sheet fades; the last keyframe sets visibility hidden and pointer-events none (fill forwards). Opaque ≤ 1.0 s, finished at 1.45 s without script. A head script skips it when sessionStorage holds `divan:intro` (try/catch), otherwise sets it; reduced motion hides it in CSS. Home pages only. No text or bitmap inside, so it can never be the LCP; the hero paints beneath from the first frame.

**Hero.** Muslin cushion with welt; cove photo of the flagship sofa on the right 60 %. One h1: the display line plus a lead-size span with the keywords (“Sofás a medida hechos en Yecla, con entrega, subida y montaje en Alicante, Torrevieja y Orihuela Costa”). Pills “Ver los sofás” and “Pide 6 muestras gratis”; bottom-left a floating bouclé swatch chip; bottom-right a cotton pill “Sofá Duna · 1 990 € · Socio 1 790 €”. Mobile: copy first, 4:5 art-directed crop below.

**Parallax “Por dentro”.** Five rounded slabs, black-and-white macros of the real layers (bouclé, fibre wrap, HR foam 35 kg/m³, pocket springs, beech frame), each labelled. The default state, kept for no-JS, reduced motion and browsers without scroll timelines, is the exploded stack. Under `@supports (animation-timeline: view())` the slabs start compressed and separate by 0/40/80/120/160 px as the section crosses the viewport. Transform only; labels never hide.

**Carousel “Tejidos”.** Native scroller, `scroll-snap-type: x mandatory`, scroll-padding = gutter. Cards 4:5, 78 vw on mobile, clamp(320px, 22vw, 560px) on desktop: true-colour macro, name, composition, Martindale rubs, link “Sofás en este tejido”, button “Añadir a mi caja” (max 6, counted in the header). A 4 px seam shows progress (scroll-driven scaleX); prev/next pills appear only with JS. Focusable track with aria-label; every card is a real link.

**Gallery and lightbox.** A pillow wall: one large cove view plus four tiles (three-quarter, side, macro, in a room); snap scroller on mobile. Tiles are links to the large file; JS opens a `<dialog>` and morphs the image with a View Transition (radius 28 → 16 px, plain fade where unsupported). Muslin backdrop, not black; arrows, Escape, swipe; click toggles 2× zoom at the pointer.

**Projects “Casas”.** Index alternates wide (8/12) and tall (4/12) cushions, each with place and one fact (“Torrevieja · 3.º sin ascensor · Duna 3 plazas”). Project page: shop-the-room pills (name + price, CMS-positioned links; a list under the photo below 1024 px), the problem solved linked to the fit check, the fabrics used.

**Technical drawing “Medidas”.** Front, side and top views as muslin silhouettes with a 2 px ink outline and rounded joins; round-capped dimension lines with pill labels (“218 cm”); a fourth view of the packed block. “¿Pasa por tu puerta?” is a GET form (door, lift, stair turn) the server can answer; the verdict is a sentence (“Pasa de canto por 80 cm: holgura 9 cm”) while the block slides once through a door outline. Inline SVG with real text, numbers repeated in an HTML table.

**The cove.** Every product, from any factory, arrives as an alpha cut-out with a baked contact shadow (black ≤ 35 %), three-quarter view from the left at 30°, camera at 90 cm, key light top left, composited on a CSS cove: wall #E8E7E5 to floor #E0E0DD at 64 % height (dark #282825 / #21201E), baseline at 80 %, width ≤ 82 %, frame 4:3 everywhere. Toggle “Escala real” scales each sofa by width ÷ widest width (transform, bottom-centre origin): a two-seater looks smaller than a corner sofa, honest size against the first cause of returns.

**Cart drawer.** A `<dialog>` from the “Cesta” pill, itself a plain link to the cart page. A floating cushion inset by the gutter, width min(520 px, 100 % − 2 gutters), cotton, welt, the float shadow, velvet backdrop at 40 %. Lines with a thumbnail in the chosen fabric, fabric chip, dimensions, stepper, price and member pill; “Tu caja de muestras” on a wash (6 chips, free, 48–72 h); delivery by town (“Torrevieja · 39 € · subida y montaje incluidos”); tabular totals; the payment line of the current ADR-0010 stage; “Tramitar pedido”.

**Member price.** Beside the ink public price, a wash pill in thread colour with a small round button: “Socio 1 790 €”, linking guests on (“Únete gratis”); for members the server swaps the order (“Tu precio 1 790 €”, public price in graphite). No strikethrough: it is not a sale.

## 8. Motion language

Plump, press, settle: things inflate into place, give under a finger and come to rest without overshoot. Easings: `--ease-plump: cubic-bezier(.2,.8,.2,1)` for entrances, drawer and intro; `--ease-settle: cubic-bezier(.3,0,.2,1)` for state changes. Durations: press 90 ms in / 240 ms out (`scale(.97)`, cards `.99`); hover 180 ms; reveals 520 ms, rise 16 px, stagger 60 ms, at most four items; drawer 420 / 260 ms; lightbox 320 ms; scale toggle 400 ms. Pre-reveal states live only under `html.js-anim`, added in head when motion is allowed and removed by a failsafe if the reveal module has not flagged ready within 3 s. Never moving: the h1, prices, body copy, header, form fields. Scrolling stays native. Reduced motion: no intro or reveals, static exploded stack, no View Transitions, press becomes a tone change.

## 9. Component vocabulary

- Radii, four tokens, always concentric (inner = outer − inset): cushion clamp(28px, 2.6vw, 80px) for hero, bands, drawer, footer; card clamp(20px, 1.4vw, 40px) for coves, tiles, swatches; field 14 px; pill 999 px. Under `@supports (corner-shape: squircle)` every radius ×1.6: same silhouette, continuous curvature.
- Buttons: pills 52 / 56 / 64 px tall (mobile / desktop / 2560+), Nunito Sans 600, sentence case. Primary velvet with paper text (dark: bone with velvet text); secondary cotton with 1.5 px felt border; tertiary text with 2 px thread underline; icon buttons are 48 px circles, tufting buttons. No shadows.
- Tags: 32 px pills on muslin (“3 plazas”, “Desenfundable”); wash only for member price and “en tu caja”; selected filters velvet.
- Cards: not boxes but a cove with a label beneath; one link per card; hover reveals the welt and scales the image 1.02.
- Inputs: 52 px, cotton, 1.5 px felt border, label above. Focus everywhere: 2 px ink (dark: bone) outline, 2 px offset.
- Navigation: sticky paper header 64 / 72 / 88 px; lowercase wordmark “divan” in Nunito 800 with a round dot in thread colour, the header's only colour; four links; language pill of real hreflang links, samples counter, account, cart. A seam fades in on scroll. Mobile menu is a full-height dialog with 32 px links.
- Footer: velvet cushion, paper text, four link columns, the “Tono” switcher (four round buttons, aria-pressed).
- One shadow, `0 1px 2px rgb(0 0 0/.06), 0 24px 60px -24px rgb(0 0 0/.3)`, only on floating things; elsewhere depth is tone (cotton raised, muslin recessed). Icons: 1.75 px stroke, round caps; no emoji.

## 10. SEO and performance consequences

- Every word is server HTML, Spanish by default; locales are real URLs with hreflang. Palette (cookie) and dark mode resolve on the server or in a pre-paint head script, never by post-render swaps.
- LCP is the hero cove photo: `<picture>` AVIF/WebP at 828/1600/2560/3440 w, ≤ 380 KB at 3440 and ≤ 120 KB for the mobile crop, eager, `fetchpriority="high"`, preloaded with imagesrcset. The h1 never animates; the intro holds no candidate.
- Fonts: self-hosted via next/font, swap with metric-matched fallbacks. es/en pages load 68 KB (latin Nunito 38 + Nunito Sans 30); ru/uk add 36 KB of cyrillic; only the display subset of the page's language is preloaded.
- CLS ≈ 0: dimensions on every image, fixed 4:3 coves, overlays as fixed layers or dialogs, member versus guest price rendered on the server.
- INP: no animation library. CSS scroll timelines, a 1 KB observer, native dialogs and scroll-snap: under 10 KB of enhancement JavaScript against a 120 KB budget. No WebGL, no autoplay video.
- Textures ≤ 90 KB, lazy; placeholders are a CSS weave. JSON-LD: Product with Offer (member price as priceSpecification with validForMemberTier), BreadcrumbList.

## 11. How this could fail

- Cute instead of premium: rounded type, pastel washes and pills slide into a children's app. Nunito stays ≥ 28 px, 700–800, ink only; no illustrations or mascots; accent caps enforced; photography carries the gravity.
- Grey mush: paper against muslin is only 1.13:1 and vanishes on bright cheap screens. Keep a velvet anchor in every viewport and check on an uncalibrated laptop.
- Broken cove: mismatched factory backdrops show rectangles (our own test mock did). Cut-outs on the CSS cove only, with a photo spec per factory.
- Drift to cream or radius soup: tokens locked in globals.css, lint for neutral chroma > 0.006 and raw border-radius values.
