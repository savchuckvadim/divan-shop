# CMS pages: страницы, hero, блоки, формы, глобалы

## Implemented (проверено по коду 2026-09-21)

### Коллекции и глобалы (`apps/web/src/payload`)

- `collections/pages.ts` (slug `pages`): `title` (localized), `slug`, поле `hero` (`fields/hero.ts`: `type` = `none` / `highImpact` / `mediumImpact` / `lowImpact`, `richText`, `links[]` через `fields/link-group.ts`, `media`), вкладка Content `layout` (blocks: `cta`, `content`, `mediaBlock`, `productArchive`, `formBlock`), SEO-таб, `publishedAt`, drafts + autosave + `schedulePublish`, live preview (`admin.livePreview.url`, брейкпоинты mobile/tablet/desktop в `payload.config.ts`), ревалидация `ROUTES.page`; slug `home` (`SITE.homeSlug`) = главная.
- `collections/media.ts`: `alt` (localized), `caption`; upload в `public/media`; размеры `thumbnail` 300, `square` 500×500, `small` 600, `medium` 900, `large` 1400, `xlarge` 1920, `og` 1200×630 crop center.
- `collections/users.ts`: `auth: true`, доступ только authenticated (`payload/access/index.ts`: `anyone`, `authenticated`, `authenticatedOrPublished`).
- Глобалы: `header.ts` (`navItems[]` link), `footer.ts` (`navItems[]`, `copyright` localized), `site-settings.ts` (`siteName` localized, `currency`, `logo`, `defaultOgImage`; группа `contacts`: `phone`, `email`, `address` localized, `workingHours` localized, `socials[] {label, url}`); ревалидация тегом `global_<slug>`.
- Блоки (`payload/blocks`): `content.ts` (колонки с richText + link), `call-to-action.ts` (richText + links), `media-block.ts`, `product-archive.ts` (`populateBy` collection/selection, `categories`, `limit`, `selectedDocs`), `form-block.ts` (`form` relationship → `forms`, `enableIntro`, `introContent`).
- Поля: `fields/link.ts` (`type` reference/custom, `newTab`, `appearance`), `link-group.ts`, `default-lexical.ts` (`defaultLexical`, `richTextEditor(headings)`), `seo-tab.ts`.
- Плагины (`payload/plugins/index.ts`): `redirects` (для `pages`, `products`; afterChange → `revalidateRedirects`), `seo`, `form-builder` (без payment/country/state; `confirmationMessage` с редактором h1–h4).
- Preview: `app/(frontend)/next/preview/route.ts` (проверка `PREVIEW_SECRET` + авторизации Payload, `draftMode().enable()`, safe redirect), `next/exit-preview/route.ts`.

### Рендер (`apps/web/src/modules`)

- `pages/cms-page/ui/cms-page.tsx`: `/{locale}/{slug}` (`app/(frontend)/[locale]/[slug]/page.tsx`, `generateStaticParams` по `getPageSlugs`) и `/{locale}` (`[locale]/page.tsx`); `getPageBySlug` (draft-aware), `PayloadRedirects`, `RenderHero`, `RenderBlocks`, `LivePreviewListener`; без страницы `home` — `HomeFallback`; `generateCmsPageMetadata`.
- `widgets/hero`: `render-hero.tsx` → `HighImpactHero` (фон `Media` + richText + `CmsLink size="lg"`), `MediumImpactHero`, `LowImpactHero`.
- `widgets/page-blocks/ui/render-blocks.tsx`: switch по `blockType` → `ContentBlock`, `CallToActionBlock`, `MediaBlock`, `ProductArchiveBlock` (серверный, `getProducts`/`getProductsByIds` + `ProductGrid`), `FormBlock` (→ `features/cms-form`); каждый блок в `<section class="my-16">`.
- `features/cms-form/ui/cms-form.tsx` (client): `react-hook-form`, поля `fields/{Text,Textarea,Email,Number,Select,Checkbox,Message,Error,Width}`, POST `${getClientSideURL()}/api/form-submissions` (`{ form: id, submissionData }`), подтверждение `message` (RichText) или `redirect`, ошибки/кнопки из словаря `form`.
- `widgets/header` (server `Header` → client `HeaderClient`: логотип, `navItems` через `CmsLink`, ссылка в каталог, телефон из Site Settings, `LocaleSwitcher`, мобильное меню), `widgets/footer` (nav, соцсети, copyright).
- `shared/ui`: `Media` (`ImageMedia` с `next/image` + `sizes`, `VideoMedia`), `RichText` (Lexical → React, `enableGutter`, prose-классы), `CmsLink` (`appearance` inline / button variants, `newTab`, `hrefForDoc` для reference-ссылок), `AdminBar` (`@payloadcms/admin-bar`, только в preview), `LivePreviewListener` (`@payloadcms/live-preview-react`).
- `pages/not-found-page`: 404 из словаря `not-found`.

## Planned

- **T-002** · страница «Контакты» (`contacts`): hero low impact с адресом/телефоном из Site Settings + `formBlock` «Заявка»; `ROUTES.contacts`; CTA товара → `/{locale}/contacts#form`; `pnpm web seed:contacts`.
- **T-003** · блок `faq` (вопрос/ответ, localized) + `faq-block.tsx` с `<details>` и JSON-LD `FAQPage` — в работе, пакет B.
- **T-007** · страница шоурума `/{locale}/showroom` (slug по локали из `ROUTES`), расширение Site Settings (адрес структурно, geo, openingHours, mapsUrl, sameAs[]), JSON-LD `FurnitureStore` с `@id` и `areaServed`, ссылка в header/footer.
- **T-011** · городские страницы из коллекции `locations` (ADR-0002) — см. также [catalog.md](./catalog.md).
- **T-014a** · юридические страницы (Aviso legal, Privacidad, Cookies, Envíos/devoluciones/garantía, Condiciones) как seed на 4 локалях, реквизиты из Site Settings (`razón social`, `NIF`, `Registro Mercantil`), ссылки в футере.
- **T-016** · коллекция `articles` или pages с тегом blog, `/{locale}/blog`, `/{locale}/blog/{slug}`, sitemap; ADR-0009 — в работе, пакет B (articles/blog/seed).
- Сид базовых страниц («О нас», главная `home`, «Статьи») с блоками на 4 локалях — в работе, пакет B; после — T-ID здесь.
- **T-021** · партнёрская страница `/en/partners-real-estate` + коллекция `partners` (draft, ждёт решения о комиссии).

## Договорённости

- Новый блок = конфиг в `payload/blocks/*` + React в `widgets/page-blocks/ui/*` + регистрация в `render-blocks.tsx` и в `pages.layout.blocks` + `pnpm web generate`.
- `app/(payload)/**` и `payload-types.ts` не редактируются руками.
