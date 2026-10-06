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
- **Статьи** (T-023, 2026-09-21, 1a02a01): `collections/articles.ts` (slug `articles`; `title`/`excerpt`/`content` localized, `cover`, `author` → users, `publishedAt`, SEO-таб, drafts + autosave + live preview, ревалидация `ROUTES.article` + индекса блога только при публичных изменениях); `articles` добавлены в `LINK_COLLECTIONS`, redirects, seo `generateURL`, `hrefForDoc`, preview paths.
- **FAQ-блок** (T-003 через T-023): `blocks/faq.ts` (`title`, `items[] {question, answer richText}`, localized) в `pages.layout`; рендер `widgets/page-blocks/ui/faq-block.tsx` (`<details>`) + JSON-LD `FAQPage` (`faqJsonLd`, `lexicalToPlainText` в `shared/lib`).
- **Seed** (`pnpm web seed` → `payload run src/payload/seed/run.ts`, идемпотентно по slug/title, пишет default-локаль и затем остальные): Site Settings, форма `contact-manager` (имя, телефон, email, сообщение, согласие), 9 категорий кластера B, страницы `home` (hero + productArchive + faq + cta), `about`, `contacts` (hero + formBlock), навигация header/footer, 2 статьи на es. Плагин form-builder: `fields`, `submitButtonLabel`, `confirmationMessage` localized. Локальную БД при смене схемы сбрасывает `scripts/ops/reset-dev-db.mjs`.
- Preview: `app/(frontend)/next/preview/route.ts` (проверка `PREVIEW_SECRET` + авторизации Payload, `draftMode().enable()`, safe redirect), `next/exit-preview/route.ts`.

### Рендер (`apps/web/src/modules`)

- `pages/cms-page/ui/cms-page.tsx`: `/{locale}/{slug}` (`app/(frontend)/[locale]/[slug]/page.tsx`, `generateStaticParams` по `getPageSlugs`) и `/{locale}` (`[locale]/page.tsx`); `getPageBySlug` (draft-aware), `PayloadRedirects`, `RenderHero`, `RenderBlocks`, `LivePreviewListener`; без страницы `home` — `HomeFallback`; `generateCmsPageMetadata`.
- `widgets/hero`: `render-hero.tsx` → `HighImpactHero` (фон `Media` + richText + `CmsLink size="lg"`), `MediumImpactHero`, `LowImpactHero`.
- `widgets/page-blocks/ui/render-blocks.tsx`: switch по `blockType` → `ContentBlock`, `CallToActionBlock`, `MediaBlock`, `ProductArchiveBlock` (серверный, `getProducts`/`getProductsByIds` + `ProductGrid`), `FormBlock` (→ `features/cms-form`); каждый блок в `<section class="my-16">`.
- `features/cms-form/ui/cms-form.tsx` (client): `react-hook-form`, поля `fields/{Text,Textarea,Email,Number,Select,Checkbox,Message,Error,Width}`, POST `${getClientSideURL()}/api/form-submissions` (`{ form: id, submissionData }`), подтверждение `message` (RichText) или `redirect`, ошибки/кнопки из словаря `form`.
- `widgets/header` (server `Header` → client `HeaderClient`: логотип, `navItems` через `CmsLink`, ссылка в каталог, телефон из Site Settings, `LocaleSwitcher`, мобильное меню), `widgets/footer` (nav, соцсети, copyright).
- `shared/ui`: `Media` (`ImageMedia` с `next/image` + `sizes`, `VideoMedia`), `RichText` (Lexical → React, `enableGutter`, prose-классы), `CmsLink` (`appearance` inline / button variants, `newTab`, `hrefForDoc` для reference-ссылок), `AdminBar` (`@payloadcms/admin-bar`, только в preview), `LivePreviewListener` (`@payloadcms/live-preview-react`).
- `pages/not-found-page`: 404 из словаря `not-found`.
- **Блог** (T-023): `entities/article` (`getArticles` с `draft`/`overrideAccess`, `getArticleBySlug`, `getArticleSlugs`, `ArticleCard`), `widgets/article-list`, `pages/blog-page` (пагинация, noindex для page>1) и `pages/article-page` (обложка, автор/дата, RichText, JSON-LD `Article`, 3 связанных), роуты `/[locale]/blog` и `/[locale]/blog/[slug]`, sitemap; словарь `blog`; ссылки «Блог», «Контакты» в header/footer из словаря `common`; `ROUTES.blog/article/about/contacts(locale, productSlug?)`.
- `generateStaticParams` всех динамических роутов обёрнуты в `safeStaticParams` (`shared/lib/static-params.ts`): без БД (Docker build) возвращают `[]`.

- **Витрины и демо-контент** (2026-10-06, ветка `feature/storefronts-themes`). Коллекция `storefronts` (`payload/collections/storefronts.ts`): документ на витрину сборки (`key` = `NEXT_PUBLIC_STOREFRONT`, уникальный), `domain`, localized `slogan`, вкладка Hero (`heading`, `text` localized; `slides` — массив картинок, первая грузится с приоритетом; `cta` — каталог или контакты), вкладка Contacts (`phone`, `email` — пусто = Site Settings). Чтение публичное, правка — админы; после изменения `revalidateTag("storefronts")` и главные всех локалей. Фронт: `entities/storefront` (`getStorefrontContent` через `unstable_cache`, тег + 5 минут; `resolveContacts`), `widgets/storefront-hero` (текст в HTML, затем лента фото на `scroll-snap` без скрипта). Главная показывает героя витрины, если у неё есть `heading`, иначе hero страницы `home`; шапка, подвал, JSON-LD Organization и страница товара берут контакты витрины. Seed дополнен: 12 демо-товаров по категориям кластера с фото из `design/concepts/assets` (Unsplash, `CREDITS.md`), описания и цвета на 4 локалях; 3 документа витрин со слайдами; обложки двух статей; картинки грузятся один раз (по имени файла) с localized `alt`. В Docker tools-образ попадают только `design/concepts/assets/*.webp` и `manifest.json` (исключение в `.dockerignore`).

## Planned

- **T-057** · коллекция `projects`: интерьеры с вещами и ценами, страницы `/projects`, JSON-LD ItemList, sitemap
- **T-007** · страница шоурума `/{locale}/showroom` (slug по локали из `ROUTES`), расширение Site Settings (адрес структурно, geo, openingHours, mapsUrl, sameAs[]), JSON-LD `FurnitureStore` с `@id` и `areaServed`, ссылка в header/footer.
- **T-011** · городские страницы из коллекции `locations` (ADR-0002) — см. также [catalog.md](./catalog.md).
- **T-014a** · юридические страницы (Aviso legal, Privacidad, Cookies, Envíos/devoluciones/garantía, Condiciones) как seed на 4 локалях, реквизиты из Site Settings (`razón social`, `NIF`, `Registro Mercantil`), ссылки в футере.
- **T-016** · контент-операции поверх готового блога: `docs/content/content-plan.md`, `editorial-policy.md`, шаблон брифа, скилл `/content-brief`, `llms.txt`.
- Демо-фото в seed — стоковые (Unsplash) и не являются товарами фабрик: до запуска продаж заменить своими съёмками по единому стилю (T-056).
- **T-021** · партнёрская страница `/en/partners-real-estate` + коллекция `partners` (draft, ждёт решения о комиссии).

## Договорённости

- Новый блок = конфиг в `payload/blocks/*` + React в `widgets/page-blocks/ui/*` + регистрация в `render-blocks.tsx` и в `pages.layout.blocks` + `pnpm web generate`.
- `app/(payload)/**` и `payload-types.ts` не редактируются руками.
