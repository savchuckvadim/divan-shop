# Site core: монорепо, FSD, i18n, роутинг, SEO-пайплайн

Справочник по фундаменту сайта. План — в секции Planned, ловушки — в [docs/HISTORY.md](../HISTORY.md).

## Implemented (проверено по коду 2026-09-23)

### Монорепо

- pnpm 10 + Turborepo (`turbo.json`: `dev`, `build`, `lint`, `typecheck`); workspace `apps/*`, `packages/*` (`pnpm-workspace.yaml`).
- `apps/web` — Next 16.3 (App Router) + Payload 3.90 в одном приложении: сайт на `/`, админка `/admin`, REST `/api`, GraphQL `/api/graphql` (`apps/web/src/app/(payload)/**` — сгенерировано, не редактируется).
- Пакеты: `@workspace/ui` (дизайн-система, см. [design-system.md](./design-system.md)), `@workspace/eslint-config` (`./base`, `./next-js`), `@workspace/prettier-config` (4 пробела, двойные кавычки, width 100, sorted imports через `@trivago/prettier-plugin-sort-imports`), `@workspace/typescript-config` (`base`, `nextjs`, `react-library`).
- Корневые скрипты: `pnpm dev`, `build`, `lint`, `typecheck`, `format`, `format:check`, `web` (фильтр), `db:up` / `db:down` (`docker-compose.yml`: PostgreSQL 16).
- Env приложения: `apps/web/.env.example` — `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `CRON_SECRET`, `PREVIEW_SECRET`, `PAYLOAD_DB_PUSH` (только прод, первый деплой без миграций), `NEXT_PUBLIC_BRAND_NAME` (имя бренда до/после нейминга: `BRAND_NAME` в `shared/config/site.ts`, словари `common.siteName`/`seo.*` и seed берут его; в рантайме приоритет у Site Settings → `siteName`); типы в `apps/web/src/environment.d.ts`.

### FSD-слои (`apps/web/src/modules`)

- Направление импортов `app → pages → widgets → features → entities → shared`; `payload/` импортирует только из `modules/shared`. Каждый слой с публичным `index.ts`.
- `shared/config`: `locales.ts` (`LOCALES`, `DEFAULT_LOCALE`, `LOCALE_COOKIE = NEXT_LOCALE`, `LOCALE_HEADER = x-locale`, `isLocale`, `LOCALE_LABELS/OG/INTL`), `routes.ts` (`ROUTES.home/page/catalog/category/product`, `stripLocale`, `withLocale`), `site.ts` (`SITE.name/twitterHandle/homeSlug/catalogPageSize=24`, `CURRENCIES`, `DEFAULT_CURRENCY`).
- `shared/api` (server-only): `payload-client.ts` (`getPayloadClient()` с `import "server-only"`), `globals.api.ts` (`getCachedGlobal(slug, locale)` через `unstable_cache` с тегом `global_<slug>`), `redirects.api.ts` (`getCachedRedirects`, тег `redirects`).
- `shared/lib`: `url.ts` (`getServerSideURL`, `getClientSideURL`, `absoluteUrl`, `canUseDOM`), `cms-href.ts` (`hrefForDoc`, `resolveCmsHref`), `format-price.ts`, `media-url.ts`, `relation.ts` (`isPopulated`, `relationId`).
- `shared/ui`: `Media` (image/video), `RichText` (Lexical), `CmsLink`, `Logo`, `AdminBar`, `LivePreviewListener`; `PayloadRedirects` — только по подпути `@/modules/shared/ui/payload-redirects` (не в барреле, см. HISTORY).
- `shared/seo`: см. ниже.

### i18n

- Локали `ru` (default), `en`, `es`, `uk` — единственный источник `shared/config/locales.ts`; Payload `localization` (`payload/localization.ts`) читает тот же кортеж, `fallback: true`.
- UI-строки: типизированные словари `shared/i18n/dictionaries/{common,catalog,product,form,seo,og,not-found,blog,account,home}.ts`, каждый `Record<Locale, XDictionary>` — только строки; плейсхолдеры `{name}` + `interpolate()` (`shared/i18n/interpolate.ts`). `getDictionary(locale)` на сервере, `I18nProvider` + `useI18n()` на клиенте (`shared/i18n/i18n-provider.tsx`).
- Роутинг: все URL `/{locale}/…` (`app/(frontend)/[locale]/**`); `proxy.ts` (Next 16 middleware) редиректит пути без локали по cookie → `Accept-Language` → default и ставит заголовок `x-locale`; matcher исключает `/admin`, `/api`, `/next`, `/_next`, `/media`, sitemap/robots и файлы с расширением.
- Переключатель: `features/locale-switcher` (ставит cookie, строит href через `stripLocale`/`withLocale`).
- Catch-all `app/(frontend)/[locale]/[...rest]/page.tsx` → `notFound()`; `not-found.tsx` рендерит `pages/not-found-page`.

### SEO-пайплайн

- `shared/seo/generate-meta.ts`: `generateMeta({ locale, pathFor, meta, fallbackTitle, article, product, … })` — title по шаблону `seo.titleTemplate`, description, `alternates` (canonical + `languages` для 4 локалей + `x-default` → `DEFAULT_LOCALE`, `shared/seo/alternates.ts`), OpenGraph (`merge-open-graph.ts`), Twitter-карточка.
- **Превью ссылок (2026-09-23).** `og:image` — генерируемые `next/og` картинки 1200×630, без новых зависимостей и без статических файлов; `SITE.defaultOgImage` (битый `/og-default.webp`) удалён.
  - Общая часть: `shared/seo/og/` — `og-theme.ts` (палитра `packages/ui/src/styles/globals.css`, переведённая в sRGB hex: Satori не понимает `oklch()`/Tailwind; размер, content-type, шрифтовые стеки без рантайм-загрузки), `og-card.tsx` (eyebrow → крупный заголовок → подзаголовок → пилюля цены, внизу CSS-локап `LogoMark` + имя бренда и город; размер заголовка подбирается по длине), `render-og-image.tsx` (`renderOgImage` оборачивает сборку карточки в try/catch и падает на site-level дизайн, если документа нет или БД недоступна; `siteOgCard`, `ogImageAlt`). Импортируется только по подпути `@/modules/shared/seo/og` — не в барреле `shared/seo`, чтобы `next/og` не попадал в клиентские бандлы.
  - Роуты `opengraph-image.tsx`: `[locale]` (site-level: бренд, `common.tagline`, город), `[locale]/[slug]` (CMS-страница), `[locale]/catalog`, `[locale]/catalog/[category]`, `[locale]/blog`, `[locale]/blog/[slug]`, `[locale]/product/[slug]` (цена через `formatPrice` + валюта из Site Settings). Все — `export const dynamic = "force-dynamic"` (образ собирается без БД), `size`/`contentType` из `og-theme`, локализованный `alt` через `generateImageMetadata` и словарь `og`.
  - URL картинки Next хеширует на сборке (`/ru/opengraph-image-<hash>/…`), поэтому вручную он не строится: `generateMeta` оставляет `openGraph.images` пустым и Next подставляет картинку роута сам. Явный `images` выставляется только когда редактор загрузил своё изображение (`Media.sizes.og`) — оно перекрывает генерируемое.
  - Полнота метаданных: `siteName`, `images` с `width`/`height`/`alt`, `og:type` (`article` для статей — с `publishedTime`, `modifiedTime`, `authors`; `website` для остального), `product:price:amount` / `product:price:currency` / `product:availability` через `other` на карточке товара, `twitter` (`summary_large_image`; `site`/`creator` — только если `SITE.twitterHandle` непустой). `alternates`/hreflang не изменились.
  - Иконка: `app/(frontend)/[locale]/icon.svg` (арка бренда в `--primary`) по файловой конвенции Next вместо ручных `<link rel="icon">` в layout; `metadataBase` по-прежнему из `getServerSideURL()`.
- JSON-LD (`shared/seo/json-ld.tsx`): `JsonLd`, `organizationJsonLd` (в `[locale]/layout.tsx` из Site Settings: name, url, phone, email, sameAs), `breadcrumbsJsonLd`, `productJsonLd` (Product + Brand + Offer).
- `app/sitemap.ts`: home, catalog, pages (кроме home), categories, products × 4 локали с `alternates.languages`; `app/robots.ts`: disallow `/admin`, `/api`, `/next`.
- Payload `plugin-seo` (`payload/plugins/index.ts`): `generateTitle` = `<title> | SITE.name`, `generateURL` через `ROUTES`.
- Статическая генерация: `generateStaticParams` в layout (локали) и на страницах; ревалидация хуками `payload/hooks/revalidate.ts` (`createRevalidateHooks` — `revalidatePath` для всех локалей + `revalidateTag`; `createRevalidateGlobalHook`; `revalidateRedirects`), выключается через `req.context.disableRevalidate`.
- Шрифты `next/font` Inter + Playfair Display (`--font-inter`, `--font-playfair`) в `[locale]/layout.tsx`.

## Planned

- **T-004** · дефолтная локаль `es`, порядок `["es","en","ru","uk"]`, x-default → es (ADR-0001); обновить упоминания «ru (default)» в CLAUDE.md/README.
- **T-017** · IndexNow-хук при публикации products/pages/locations (ключ из env, файл ключа в `public/`).
- **T-014b** · слот CMP через `NEXT_PUBLIC_CMP_*`, Consent Mode v2 default denied, аналитика только после согласия.
- **T-018** · ADR-0010 хостинг (Vercel+Neon vs VPS), бэкапы `pg_dump` + медиа, UptimeRobot, 2FA на `/admin`, renovate.
- **T-006** · `dataLayer` события (`docs/analytics-events.md`) — общий слой аналитики; GTM только через `NEXT_PUBLIC_GTM_ID`.
- **T-016** · `public/llms.txt` (часть контент-операций).
- Валюта по умолчанию `RUB` в `shared/config/site.ts` и `CURRENCIES` без приоритета `EUR` — привести к рынку (EUR, IVA incluido, T-014c) вместе с T-004.

## Договорённости

- Клиентские компоненты не импортируют баррели с серверным кодом (`modules/shared/api`, `payload-redirects`) — только подпути; серверные модули помечены `server-only`.
- Словари — только строки; `interpolate()` для подстановок.
- URL строятся только через `ROUTES` / `hrefForDoc`.
