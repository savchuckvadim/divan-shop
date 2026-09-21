# Catalog: товары, категории, страницы каталога и товара

## Implemented (проверено по коду 2026-09-21)

### Коллекции (`apps/web/src/payload/collections`)

- `products.ts` (slug `products`): `title` (localized, required), `slug`; вкладка Content: `category` (relationship → `categories`, required), `availability` (select `inStock` / `onRequest` / `outOfStock`, default `inStock`), `price` (number, required), `oldPrice`, `gallery[]` (`image` upload → `media`), `description` (richText, localized); вкладка Specs: `width` / `depth` / `height` (см), `sleepingWidth`, `material` (select `fabric` / `leather` / `ecoLeather` / `velour`), `mechanism` (select `none` / `eurobook` / `accordion` / `dolphin` / `clickClack`), `color` (text, localized); SEO-таб (`payload/fields/seo-tab.ts`); sidebar `featured` (checkbox), `publishedAt` (хук `populate-published-at.ts`); `versions.drafts` с autosave 100 мс и `schedulePublish`; live preview + preview через `payload/lib/generate-preview-path.ts`; ревалидация `ROUTES.product` по всем локалям.
- `categories.ts` (slug `categories`): `title` (localized), `slug`, `description` (textarea, localized), `image`, `order` (number, сортировка), группа `meta` (`title`, `description`, localized); `defaultPopulate: { title, slug }`.
- Slug не локализуется — один URL на документ в каждой локали (ADR: slugs shared).

### Entities (`apps/web/src/modules/entities`)

- `product/api/product.api.ts`: `getProducts({ locale, categoryId?, featured?, page, limit, excludeId? })` (draft-aware, `fallbackLocale`), `getProductsByIds`, `getProductBySlug`, `getProductSlugs` (для sitemap); всё через `react.cache`.
- `product/lib/product-helpers.ts`: `AVAILABILITY_BADGE` (variant бейджа по availability), `getProductImages`, `getProductCover`, `getProductCategory`, `hasDiscount`.
- `product/type/product.type.ts`: `Product`, `ProductAvailability`, `ProductSpecs`, `ProductMaterial`, `ProductMechanism`, `ProductSlugEntry`.
- `product/ui`: `ProductCard` (Card из `@workspace/ui`, cover через `Media`, `ProductPrice`, `ProductAvailabilityBadge`, ссылка `ROUTES.product`), `ProductPrice` (цена + зачёркнутая `oldPrice`, `formatPrice` по локали и валюте), `ProductAvailabilityBadge` (подписи из словаря `product`).
- `category/api/category.api.ts`: `getCategories(locale)` (sort `order`), `getCategoryBySlug`, `getCategorySlugs`; `category/ui/category-chip.tsx`.
- `site-settings/api`: `getSiteSettings(locale)` (через `getCachedGlobal`), `getCurrency(settings)` → `Currency` с фолбэком `DEFAULT_CURRENCY`.

### Страницы и виджеты

- `pages/catalog-page/ui/catalog-page.tsx`: `/{locale}/catalog` и `/{locale}/catalog/{category}` (`app/(frontend)/[locale]/catalog/**`, `?page=` парсится в роуте); хлебные крошки (`widgets/breadcrumbs` + `breadcrumbsJsonLd`), чипы категорий, `ProductGrid` с пагинацией (`SITE.catalogPageSize = 24`, `@workspace/ui/components/pagination`), пустое состояние из словаря `catalog.empty`; `generateCatalogPageMetadata` (canonical/hreflang на категорию или каталог).
- `pages/product-page/ui/product-page.tsx`: `/{locale}/product/{slug}`; галерея (главное фото + миниатюры), бейдж наличия, `Heading h1`, `ProductPrice size="lg"`, CTA `tel:` из Site Settings (`dictionary.product.requestQuote`), `ProductSpecs` (размеры, спальное место, материал, механизм, цвет — подписи из словаря `product`), описание `RichText`, похожие товары той же категории (`getProducts({ categoryId, excludeId, limit })`), `productJsonLd` + `breadcrumbsJsonLd`, `PayloadRedirects` для несуществующего slug, `LivePreviewListener` в draft mode; `generateProductPageMetadata` из SEO-таба.
- `widgets/product-grid`: сетка `ProductCard` с `priority` для первых 4 изображений; `widgets/breadcrumbs`.
- Главная без CMS-страницы `home`: `pages/cms-page/ui/home-fallback.tsx` — заголовок, кнопка в каталог, `featured` товары.
- Словари: `catalog.ts` (`title`, `description`, `allCategories`, `empty`, `productsCount {count}`, `categories`, `featured`), `product.ts` (наличие, характеристики, `requestQuote`, `related`, …) — 4 локали.

## Planned

- **T-008** · поля товара для фильтров и Merchant: `plazas`, `sku`, `condition`, `brand`, `gtin`, `leadTimeDays`, `fabrics[]` (свотчи), `dimensionsImage`; категории: `synonyms`, `metaTemplate`; `pnpm web seed:categories` (9 категорий кластера B на 4 локалях); JSON-LD Product с sku/brand/itemCondition/availability.
- **T-009** · фиды `/api/feeds/products.xml|csv?locale=&profile=google|meta` из Products, кэш 1 ч + ревалидация.
- **T-011** · коллекция `locations` и городские страницы `/es/sofas-en-{city}` (ADR-0002): `ROUTES.location`, sitemap, hreflang, JSON-LD FurnitureStore areaServed, seed 6 городов draft.
- **T-006** · `view_item` в `dataLayer` на странице товара; кнопка WhatsApp с кодом `[{locale}-{page}-{productSlug}]` в карточке.
- **T-014c** · «IVA incluido» рядом с ценой, коллекция `price_history` + хук, зачёркнутая цена только при `oldPrice ≥ min(30 дней)`.
- **T-007** · `Offer.availableAtOrFrom` → `@id` FurnitureStore на товарах (после страницы шоурума).
- Фильтры каталога (места, механизм, материал, цена) как индексируемые страницы — идея, задачи нет; появится после T-008 через `/idea`.
- Отзывы first-party `Review` на Product (ADR-0006) — задачи нет, после первых доставок.

## Договорённости

- Данные только через Payload Local API на сервере с `locale` + `fallbackLocale`; клиентских запросов к каталогу нет.
- Новое поле товара = поле в `products.ts` → `pnpm web generate` → подпись в словаре `product.ts` на 4 локалях → `ProductSpecs`/JSON-LD.
