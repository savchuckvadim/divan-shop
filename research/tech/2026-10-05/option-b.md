# Вариант B. Две витрины — два Next.js-приложения поверх общего пакета CMS

Дата: 2026-10-05 · Роль: защитник варианта B перед панелью · Статус: предложение, не решение (ADR не создан)

Требование: одна фирма, два публичных сайта с разным дизайном и разной широтой ассортимента (divan.group — широкий магазин «всё для дома»; бутик на домене .boutique — премиум, кураторский, «подкатегории, не больше»), по возможности один бэкенд, функции «пишем один раз — получают оба сайта», в будущем форки и скрипт-скелет. Ограничение номер один — SEO.

Условные обозначения: **(оценка)** — моя оценка, не измерение; **(не проверено)** — не смог подтвердить; **(источник старше 2024)** — первоисточник старый. Пути вида `apps/web/...` — код репозитория на 2026-10-05.

---

## 0. Коротко

- Каждый сайт — отдельное Next.js 16-приложение в том же монорепо: `apps/group` (divan.group) и `apps/boutique` (бутик). Оба встраивают Payload 3.90 и работают с **одной** базой PostgreSQL через Local API. Админка, миграции, фоновые задачи и платёжные вебхуки — только в `apps/group` (divan.group/admin).
- Схема CMS (коллекции, хуки, доступы, плагины, миграции, сгенерированные типы) уезжает в пакет `@workspace/cms`; FSD-слои shared и entities плюс фичи без привязки к «лицу» — в `@workspace/storefront`; чистые константы (локали, ключи и схемы URL витрин) — в `@workspace/core`. Лицо (layout, тема, виджеты, страницы, анимации) остаётся внутри приложения.
- Витрина — это **строка** коллекции `storefronts`, а не код. Товар попадает на сайт через `placements` (витрина + категория этой витрины). У товара ровно одна домашняя витрина, где его страница индексируется; премиум по умолчанию уходит в бутик.
- Главный SEO-аргумент: каждый хост — обычный односайтовый Next-проект, поэтому целый класс ошибок «хост отдаёт чужие данные» (canonical, hreflang, sitemap, OG, ключи кэша) исключён конструктивно, а бюджет JS и Core Web Vitals у каждого лица свой.
- Цена: два деплоя и две сборки, межпроцессная инвалидация кэша (Next инвалидирует только свой процесс), дисциплина «одна схема на два процесса» и миграции в стиле expand/contract.
- Первые четыре шага плана (миграции без промптов, ISR вместо `force-dynamic`, медиа в R2, ADR) полезны divan.group сразу, даже если бутик не запустится никогда.

---

## 1. Что я проверил, прежде чем проектировать

| Факт                                                                                                                                                                                                                                                                                          | Где проверено                                                                                                                                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Прод сейчас: `/` отвечает `307 → /ru` (T-004 не сделана), страницы отдаются с `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`, то есть рендерятся на каждый запрос                                                                                                   | `curl -I https://divan.group/` и `/es`, 2026-10-05                                                                                                                                                                                       |
| Причина — коммит `3758ead`: все контентные роуты `export const dynamic = "force-dynamic"`, `generateStaticParams` удалён, потому что Docker-образ собирается без БД. CLAUDE.md всё ещё обещает статическую генерацию — дрейф документации                                                     | `apps/web/src/app/(frontend)/[locale]/**/page.tsx`, `git show 3758ead`                                                                                                                                                                   |
| Payload прямо пишет про `force-dynamic`: «it will disable static optimization and your site will be slower»                                                                                                                                                                                   | [Payload: Building without a DB connection](https://payloadcms.com/docs/production/building-without-a-db-connection)                                                                                                                     |
| Next 16: такие страницы получают `Cache-Control: private, no-cache, no-store…`; кэш ISR по умолчанию лежит на диске каждого экземпляра; «calling `revalidateTag()` on one instance only invalidates the cache on that instance»                                                               | [Next.js: Self-hosting](https://nextjs.org/docs/app/guides/self-hosting) (версия доки 16.3.8, обновлена 2026-08-25)                                                                                                                      |
| `revalidateTag(tag, "max")` можно вызывать из Route Handler; одноаргументная форма устарела                                                                                                                                                                                                   | [Next.js: revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)                                                                                                                                              |
| Пустой `generateStaticParams` = страницы рендерятся при первом визите и живут как ISR                                                                                                                                                                                                         | [Next.js: generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)                                                                                                                              |
| Proxy (бывший middleware) в Next 16 работает на Node.js runtime; `matcher` должен быть константой, анализируется на сборке                                                                                                                                                                    | [Next.js: proxy.js](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)                                                                                                                                                    |
| divan.group → A `116.202.29.144`, это Hetzner Cloud FSN1; запись DNS-only (не через прокси Cloudflare)                                                                                                                                                                                        | DoH-запрос к `cloudflare-dns.com`; [RIPE RDAP](https://rdap.db.ripe.net/ip/116.202.29.144)                                                                                                                                               |
| **divan.boutique** зарегистрирован 2026-09-23 через Cloudflare, Inc., NS `dell/aarav.ns.cloudflare.com` — та же пара, что у divan.group; A-записи пока нет                                                                                                                                    | [RDAP .boutique](https://rdap.identitydigital.services/rdap/domain/divan.boutique), запрос 2026-10-05. Владельца RDAP скрывает: совпадение NS — косвенный признак, **не доказательство**. Имя считаю неподтверждённым до слова владельца |
| В репозитории нет ни одной миграции (`apps/web/src/migrations` отсутствует) → прод-схема создана push-режимом                                                                                                                                                                                 | файловая система репо                                                                                                                                                                                                                    |
| `@payloadcms/db-postgres` 3.90.1: push выполняется только при `NODE_ENV !== 'production'`. Совет из `docs/ops/deployment.md` «поставить `PAYLOAD_DB_PUSH=true` на первый запуск» в runner-образе (`NODE_ENV=production`) ничего не делает; в `tools`-образе (NODE_ENV не задан) — делает push | `node_modules/.../@payloadcms/db-postgres/dist/connect.js`                                                                                                                                                                               |
| `@payloadcms/drizzle` 3.90.1: push пишет в `payload_migrations` строку `batch = -1`; `migrate()` при её наличии задаёт интерактивный вопрос «It looks like you've run Payload in dev mode…»; `prodMigrations` вызывает тот же `migrate()`                                                     | `.../@payloadcms/drizzle/dist/utilities/pushDevSchema.js`, `dist/migrate.js`                                                                                                                                                             |
| drizzle-kit 0.31.7 спрашивает «created or renamed», только если в одной таблице одновременно есть новые и пропавшие колонки (так же для таблиц, enum, схем)                                                                                                                                   | `node_modules/.pnpm/drizzle-kit@0.31.7/.../api.js`, `promptColumnsConflicts`                                                                                                                                                             |
| `payload migrate:create` стартует Payload с `disableDBConnect`; флаг `--skip-empty` снимает вопрос о пустой миграции                                                                                                                                                                          | `payload/dist/bin/migrate.js`; [Payload: Migrations](https://payloadcms.com/docs/database/migrations)                                                                                                                                    |
| Путь компонента админки без `/` и `.` попадает в importMap как есть («Tsconfig alias or package import») → компоненты можно отдавать из пакета по имени                                                                                                                                       | `payload/dist/bin/generateImportMap/utilities/addPayloadComponentToImportMap.js`; [Payload: Custom Components](https://payloadcms.com/docs/custom-components/overview)                                                                   |
| `slugField()` по умолчанию `unique` (есть флаг `disableUnique`); составные уникальные индексы задаются `indexes` у коллекции                                                                                                                                                                  | `payload/dist/fields/baseFields/slug/index.js`; [Payload: Collections](https://payloadcms.com/docs/configuration/collections)                                                                                                            |
| Postgres-адаптер фильтрует по полям внутри массива (join `isOneToMany`)                                                                                                                                                                                                                       | `.../@payloadcms/drizzle/dist/queries/getTableColumnFromPath.js`                                                                                                                                                                         |
| Черновой cookie Next `__prerender_bypass` ставится как `SameSite=None; Secure`, без `Partitioned`                                                                                                                                                                                             | `next@16.3.3/.../dist/server/async-storage/draft-mode-provider.js`                                                                                                                                                                       |
| Провайдер `@payloadcms/plugin-ecommerce` ходит в REST API Payload (`apiRoute` по умолчанию `/api`, `serverURL`); плагин в бете                                                                                                                                                                | [Ecommerce Frontend](https://payloadcms.com/docs/ecommerce/frontend), [Ecommerce Overview](https://payloadcms.com/docs/ecommerce/overview)                                                                                               |

---

## 2. Дизайн

### 2.1 Раскладка репозитория

```
apps/
  group/                       бывший apps/web → divan.group: витрина + /admin + /api
    src/app/(frontend)/[locale]/**   тонкие роуты лица group (текущие URL сохраняются)
    src/app/(payload)/**             сгенерированные админка и REST — ТОЛЬКО здесь админка
    src/app/api/revalidate/route.ts  приём межпроцессной ревалидации (симметрично с бутиком)
    src/face/{widgets,pages}/**      верхние FSD-слои этого лица
    src/payload.config.ts            export { default } from "@workspace/cms/config"
    src/proxy.ts                     локаль + 301 на канонический хост (matcher-литерал)
    Dockerfile
  boutique/                    → divan.boutique: витрина + /api (REST для корзины/оплаты), БЕЗ админки
    src/app/(frontend)/[locale]/**   своя схема URL, мелкая навигация
    src/app/(payload)/api/[...slug]/route.ts   только REST, без admin-роутов
    src/app/api/revalidate/route.ts
    src/app/next/preview/route.ts    превью по подписанному токену
    src/face/**
    src/payload.config.ts            тот же реэкспорт
    Dockerfile
  _template/                   (позже) заготовка для scripts/new-storefront.mjs
packages/
  core/        @workspace/core — чистый TS: LOCALES, ключи витрин, схемы URL каждой витрины,
               url/price/interpolate. Не импортирует react, next, payload
  cms/         @workspace/cms — вся схема Payload: collections, globals, blocks, fields, access,
               hooks, plugins, seed, migrations/, payload-types.ts (генерируется сюда),
               buildDivanConfig(), admin-компоненты по подпути @workspace/cms/admin
  storefront/  @workspace/storefront — FSD shared + entities + фичи без лица:
               getPayloadClient (импорт конфига из @workspace/cms/config, не через алиас),
               запросы со скоупом витрины, SEO (meta, hreflang, JSON-LD, сборщики sitemap/robots,
               OG-рендерер с темой), базовые словари фич, auth, формы, позже корзина и чекаут,
               обработчики /api/revalidate и /next/preview
  ui/          @workspace/ui — токены и примитивы (как сейчас) + темы лиц
  eslint-config, prettier-config, typescript-config — без изменений
```

Правила границ (линт `no-restricted-imports`): `core` ни от кого не зависит; `cms` → только `core`; `storefront` → `core`, `cms` (конфиг и типы), `ui`; приложения → всё. **Внутри пакетов запрещён алиас `@/`**: при компиляции пакета приложением он резолвился бы по tsconfig приложения (не проверял, как именно ведёт себя Turbopack в этом случае, поэтому дизайн его просто не использует). Серверные модули пакетов — только по подпутям с `import "server-only"` (ловушка из `docs/HISTORY.md` про баррель, тянущий `payload.config` в клиент, на пакетах повторится шире).

Почему три пакета, а не пять (по одному на FSD-слой): каждый пакет — это `package.json`, `exports`, `tsconfig`, строка в `transpilePackages` и в Dockerfile. Для одного разработчика FSD-слои внутри `@workspace/storefront` с линт-правилом направления импортов дешевле, чем отдельные пакеты `shared`, `entities`, `features`.

### 2.2 Маршрутизация запросов по хосту

- Traefik (через Dokploy) разводит по `Host`: `divan.group` → сервис group:3000, бутик → сервис boutique:3000; `www.*` → 301 на apex средствами Dokploy/Traefik (сейчас то же делает Caddyfile из репо, но прод уже на Dokploy — `docs/ops/deployment.md` устарел).
- Внутри приложения **нет логики выбора хоста**. `proxy.ts` остаётся тем, что есть сейчас (локаль по cookie → Accept-Language → default), плюс одна проверка: запрос с чужим `Host` (голый IP, сгенерированный домен Dokploy) получает 301 на канонический origin из `NEXT_PUBLIC_SERVER_URL`, чтобы технические адреса не попали в индекс.
- Какая это витрина, приложение знает из серверной переменной `STOREFRONT=group|boutique`; по ключу один раз читает документ витрины (кэш с тегом `storefront:<key>`).
- «Статическая генерация по хосту» в варианте B тривиальна: один процесс обслуживает один хост, ключ ISR-кэша хоста не содержит, локально оба сайта поднимаются на разных портах без правки hosts-файла.

### 2.3 Модель данных: скоуп витрин

**Коллекция `storefronts`** (документ = сайт; новая витрина = новая строка, без миграции схемы):

| Поле                                                                  | Назначение                                                                                                          |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `key` (text, unique)                                                  | совпадает с `STOREFRONT` приложения: `group`, `boutique`                                                            |
| `domain`, `brandName` (localized)                                     | `https://divan.group` / «Divan»; бутик — своё имя                                                                   |
| `enabledLocales`, `defaultLocale`                                     | бутик может стартовать не со всеми четырьмя локалями                                                                |
| `currency`                                                            | EUR (сейчас в коде по умолчанию RUB — исправляется вместе с T-004)                                                  |
| `indexable`                                                           | `false` до запуска: robots `Disallow: /` + `noindex`                                                                |
| `maxCategoryDepth`                                                    | group 2–3, бутик 1 («подкатегории, не больше»)                                                                      |
| `seoDefaults`                                                         | шаблон title (localized, напр. `{title} \| Divan` и `{title} — Divan Boutique`), описание по умолчанию, OG-картинка |
| `organization`                                                        | логотип, `sameAs`, ссылка на родительскую витрину (для JSON-LD)                                                     |
| `contacts`, `navigation.header[]`, `navigation.footer[]`, `copyright` | то, что сейчас в глобалах `site-settings`, `header`, `footer`; ссылки меню фильтруются на документы той же витрины  |
| `features`                                                            | флаги включения фич по витрине: образцы, калькулятор доставки, чекаут                                               |
| `analytics`                                                           | ID потока GA4 (не секрет)                                                                                           |

**Глобал `business`** — то, что у фирмы одно: юрлицо (razón social, NIF), адрес, этап оплаты по ADR-0010, данные для юрстраниц обоих доменов (T-014, T-048). Глобалы `header`, `footer`, `site-settings` переезжают в `storefronts` и `business` (expand → перенос данных миграцией → contract следующим релизом).

**`products`** (общая коллекция, один товар — одна запись):

- `placements[]` — `{ storefront, category, featured, sort }`: где и как товар показывается; `category` фильтруется по `category.storefront = row.storefront`. Заменяет нынешние `category` и `featured`.
- `homeStorefront` — единственный домен, где страница товара индексируется (должен быть среди `placements`).
- `tier` — `standard | premium`; хук `beforeValidate` для `premium` по умолчанию ставит домашней витриной бутик и требует размещение в категории бутика. Так реализуется «премиум уходит туда».
- `mirrorPage` (по умолчанию выключен) — рендерить ли страницу и на недомашней витрине (с cross-domain canonical), см. 2.5.
- `storefrontSeo[]` — `{ storefront, title, description, image }`, localized; обязателен для недомашней витрины, если включён `mirrorPage`.
- Существующий таб `meta` (plugin-seo) остаётся базовым SEO домашней витрины; `generateTitle`/`generateURL` плагина становятся витрино-зависимыми (берут `homeStorefront`).

**`categories`** — отдельные деревья: `storefront` (обязателен) + `parent` (ссылка на категорию той же витрины). Хук не даст сделать глубину больше `maxCategoryDepth`: у бутика это плоский список подкатегорий, у group — дерево, которое вырастет в «всё для дома». Уникальность slug — составной индекс `(slug, storefront)` при `slugField({ disableUnique: true })`.

**`pages`, `articles`, будущие `locations` (T-011), `redirects` (плагин)** получают `storefront` и составной индекс `(slug, storefront)`; редиректы фильтруются приложением по своей витрине (путь «откуда» без хоста иначе конфликтовал бы). Юрстраницы — по документу на витрину, реквизиты подставляются из `business`.

**Источник обращения**: `form-submissions`/будущие `leads` (T-005, ADR-0004), `customers.registeredOn`, будущие `carts`/`orders` плагина ecommerce (через overrides) получают `storefront` — чтобы в Bitrix24 и отчётах было видно, какой бренд продал.

**Общие без скоупа**: `media` (папки по брендам — `folders: true` уже включён), `customers` (один аккаунт на оба бренда, скидки зарегистрированным — правило бизнеса), `users`, `fabrics` (T-045, с полем видимости по витринам), зоны доставки (T-046).

**Почему не `@payloadcms/plugin-multi-tenant`.** Его модель — изоляция: поле тенанта на документе, переключатель тенанта в админке, фильтрация списков и связей по выбранному тенанту, запрет писать в чужой тенант ([документация плагина](https://payloadcms.com/docs/plugins/multi-tenant)). У нас одна фирма и один редактор, которому нужен весь каталог сразу, а товар может стоять на двух витринах. В коде поля плагина `hasMany` поддерживается, но публичный тип переопределений построен на `SingleRelationshipField`, то есть в документированном API документ принадлежит одному тенанту ([types.d.ts 3.90.1](https://unpkg.com/@payloadcms/plugin-multi-tenant@3.90.1/dist/types.d.ts), [tenantField](https://unpkg.com/@payloadcms/plugin-multi-tenant@3.90.1/dist/fields/tenantField/index.js)). Берём из плагина только идею «глобал = один документ на тенанта» — это и есть коллекция `storefronts`.

Набросок поля размещения (сокращённо):

```ts
// packages/cms/src/fields/placements.ts
export const placements: Field = {
  name: "placements",
  type: "array",
  minRows: 1,
  fields: [
    {
      name: "storefront",
      type: "relationship",
      relationTo: "storefronts",
      required: true,
      index: true,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      index: true,
      filterOptions: ({ siblingData }) => ({ storefront: { equals: siblingData?.storefront } }),
    },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "sort", type: "number", defaultValue: 0 },
  ],
};
// витрина «бутик» читает: where: { "placements.storefront": { equals: boutiqueId } }
```

### 2.4 Два лица: как разделены и насколько могут разойтись

- Лицо = `layout.tsx` и шрифты, `globals.css` приложения (импорт `@workspace/ui/globals.css` + переопределение токенов, либо свой набор токенов под чёрно-белую базу с акцентными палитрами), верхние FSD-слои (widgets, pages), схема URL, словари тона бренда и зависимости анимаций. Всё это внутри своего приложения.
- Разойтись можно **полностью**: другие компоненты, другая типографика, параллакс и галереи с эффектами только у бутика, другой `next.config` (заголовки, картинки). Библиотеки эффектов бутика не попадают в граф зависимостей и бандл group. По замеру прошлого прогона в scratchpad (не перепроверял): у 94 компонентов React Bits медиана 28,6 КБ gzip, максимум 249,7 КБ, 38 тянут gsap, 15 — three; из 29 проверенных на SSR 15 кладут в HTML скрытые стили (`opacity:0`, blur), 10 рвут или прячут текст. Это аргумент держать эффекты за границей приложения и ставить для лица бутика SEO-гейт «текст и LCP-элемент видимы в SSR-HTML».
- Общее обязательно только одно: схема CMS и версии Next/Payload/React (один каталог версий pnpm, один lockfile). Функции из `@workspace/storefront` по умолчанию рисуются на токенах `@workspace/ui`, поэтому сами перекрашиваются темой лица; лицо может заменить UI фичи целиком, оставив её `api`/`model`.
- Словари остаются типизированными: базовые словари фич — в `@workspace/storefront/i18n`, словари тона бренда — в приложении; `getDictionary(locale)` приложения склеивает оба `Record<Locale, …>`, отсутствующий ключ — ошибка TS, как сейчас.
- group сохраняет текущие URL (`/es/catalog/<cat>`, `/es/product/<slug>`), чтобы не терять уже проиндексированное; у бутика своя схема (например `/es/<подкатегория>` и `/es/<подкатегория>/<товар>` — решается в ADR), записанная в `@workspace/core`.

### 2.5 SEO по хостам

- **sitemap и robots** — `app/sitemap.ts` и `app/robots.ts` в каждом приложении из сборщиков `@workspace/storefront/seo`. В sitemap попадают только документы своей витрины, товары — только те, у которых `homeStorefront` = эта витрина; `alternates.languages` — только по `enabledLocales`. robots: `Sitemap:` своего хоста, `Disallow` для `/admin`, `/api`, `/next`, кабинета; при `indexable = false` — `Disallow: /`.
- **canonical** — всегда абсолютный, от собственного origin (`metadataBase`). Исключение одно: зеркальная страница товара (`mirrorPage`) на недомашней витрине ставит canonical на **ту же локаль** домашней витрины — Google требует, чтобы при hreflang canonical был на странице того же языка ([Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), обновлено 2026-07-10). Canonical — подсказка, а не правило ([Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization), 2026-08-20). Поддержку cross-domain canonical Google объявлял в 2009 году ([блог](https://developers.google.com/search/blog/2009/12/handling-legitimate-cross-domain), **источник старше 2024**; сейчас на нём пометка, что для синдицированного контента canonical больше не рекомендуется). Поэтому по умолчанию я вообще не создаю дубль: на второй витрине товар — тизер со ссылкой на домашний домен, зеркало — только по явному решению владельца.
- **title и description** — шаблон бренда из `storefronts.seoDefaults` (суффиксы разные, значит title двух доменов не совпадают никогда) плюс `storefrontSeo`; хук публикации вычисляет итоговые пары title/description для всех витрин и локалей, где документ рендерится, и отклоняет публикацию при совпадении. Плюс еженедельная node-проверка дублей по обоим sitemap (слой node по ADR-0008, строка в `docs/ops/crons.md`).
- **hreflang** — только между локалями одной витрины; между брендами никогда (это разные сайты, а не переводы). Каждая версия перечисляет себя и остальные, URL полные; x-default → `es` по ADR-0001 после T-004 ([Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions), 2026-09-21).
- **OG-картинки** — существующий рендерер `shared/seo/og` переезжает в пакет и принимает тему лица (сейчас палитра group продублирована в sRGB в `og-theme.ts`, потому что Satori не понимает `oklch()`); у бутика своя тема.
- **JSON-LD**: на главной каждого домена `WebSite` со своим именем сайта — Google поддерживает одно site name на домен ([Site names](https://developers.google.com/search/docs/appearance/site-names), 2025-12-10) — и `OnlineStore` со своим `@id` (`https://<домен>/#organization`); Google рекомендует самый конкретный подтип Organization и размещение на главной или странице «о нас», не на каждой странице ([Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), 2026-09-08). Бутик указывает `parentOrganization` → `@id` group: это честная разметка одной фирмы, но использование этого свойства Google не документирует (**эффект не гарантирован**). `Product` — только на домашней витрине; `BreadcrumbList` — по дереву своей витрины.
- **Search Console** — два Domain-ресурса, подтверждение DNS-записью в Cloudflare ([Search Console Help](https://support.google.com/webmasters/answer/34592)). **GA4** — два потока одной property; cross-domain-измерение включить, если пользователи переходят с тизеров group в бутик ([Analytics Help](https://support.google.com/analytics/answer/10071811)).
- **Merchant Center** (T-009): «A single URL can only be claimed by one account» — второму домену нужен отдельный аккаунт или мульти-клиентская схема ([Merchant Center Help](https://support.google.com/merchants/answer/11586344)). Фиды строятся по витрине из товаров с `homeStorefront`.
- **Google Business Profile**: второй профиль под бутик не заводить — «Do not create more than one page for each location of your business, either in a single account or multiple accounts» ([GBP guidelines](https://support.google.com/business/answer/3038177)). У бутика нет отдельной точки, поэтому его поиск — бренд и премиум-запросы, не Local Pack.
- **Скорость**: переход с `force-dynamic` на ISR при первом визите (пустой `generateStaticParams`, сборка без БД сохраняется) даёт кэшируемый HTML; ревалидация — тегами плюс страховочный TTL.
- **Риск, который архитектура не снимает**: политика Google против дорвеев прямо называет «multiple websites with slight variations to the URL and home page to maximize their reach for any specific query» ([Spam policies](https://developers.google.com/search/docs/essentials/spam-policies), 2026-08-28). Бутик обязан отличаться ассортиментом и контентом, а не быть копией премиум-категории group. Это бизнес-правило, его не обеспечит ни один из вариантов.

### 2.6 Админка для одного редактора

- Одна админка: `https://divan.group/admin`. Навигация: «Витрины» (по документу на сайт: шапка, подвал, SEO по умолчанию, флаги), «Каталог» (товары, категории с фильтром по витрине, ткани), «Контент» (страницы и статьи с фильтром по витрине), «Фирма» (`business`, зоны доставки), «Клиенты и заявки».
- В товаре: блок «Где продаётся» (`placements`), «Домашняя витрина», вкладка «SEO по витринам»; небольшой компонент из `@workspace/cms/admin` показывает ссылки «открыть на divan.group / на бутике».
- **Live preview** открывает домашнюю витрину документа по абсолютному URL — это поддерживается функцией `admin.livePreview.url`, в том числе для фронтенда на другом домене ([Live Preview](https://payloadcms.com/docs/live-preview/overview)); `RefreshRouteOnSave` на бутике получает `serverURL` админки и проверяет источник сообщений ([Server-side Live Preview](https://payloadcms.com/docs/live-preview/server)).
- Две особенности чужого домена. Первая: нынешний `/next/preview` проверяет пользователя через `payload.auth` по cookie, а cookie админки домена divan.group на бутик не попадёт. Поэтому `livePreview.url` на сервере админки подписывает короткоживущий токен (HMAC от пути и срока, `PREVIEW_SECRET`), и превью-роут бутика проверяет токен, а не cookie. Вторая: черновой cookie Next внутри iframe чужого сайта — третья сторона. Chrome сторонние cookie оставил ([Privacy Sandbox, 22.04.2025](https://privacysandbox.google.com/blog/privacy-sandbox-next-steps)), Safari блокирует полностью ([WebKit, 2020](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/), **источник старше 2024**), поведение Firefox с партиционированием **не проверено**. Практически: в Safari превью бутика открывается кнопкой «в новом окне».
- Админка в group — не вечное решение: роуты админки — сгенерированные файлы, перенос их в третье приложение `apps/cms` позже — перемещение папки и домен `cms.divan.group`.

### 2.7 Медиа и инвалидация кэша между лицами

**Медиа.** Сейчас файлы лежат в volume контейнера (`public/media`) и отдаются через `/api/media/file/...` того же процесса. У бутика нет админки и общего диска, поэтому медиа переезжают в Cloudflare R2 через `@payloadcms/storage-s3` с публичным доменом бакета: `disablePayloadAccessControl: true` и `generateFileURL` отдают прямой URL (официальный рецепт: [Storage Adapters → R2 via S3 API](https://payloadcms.com/docs/upload/storage-adapters)). Оба приложения разрешают этот хост в `images.remotePatterns`. Цена: 10 ГБ-месяц хранения бесплатно, дальше $0,015 за ГБ-месяц, исходящий трафик бесплатный ([R2 pricing](https://developers.cloudflare.com/r2/pricing/)); оба домена уже на DNS Cloudflare. Ловушка для варианта B: пример из доки включает адаптер `enabled: Boolean(process.env.S3_BUCKET)`; схемо-влияющие плагины нельзя включать по env, иначе два процесса получат разную схему. Переменные R2 задаются обоим приложениям.

**Кэш страниц.** Каждое приложение — ISR со своим кэшем. Хуки CMS (`createRevalidateHooks` в `payload/hooks/revalidate.ts` сейчас зовёт `revalidatePath`/`revalidateTag` в своём процессе) становятся уведомителем:

```ts
// packages/cms/src/hooks/revalidate.ts — идея, не финальный код
const affected = union(storefrontsOf(previousDoc), storefrontsOf(doc)); // по placements / storefront
revalidateLocal(event); // текущий процесс: revalidateTag(tag, "max")
for (const key of affected.filter((k) => k !== CURRENT_STOREFRONT)) {
  // после коммита транзакции: after() из next/server либо задача Payload jobs с ретраями
  notify(key, { tags, refs: [{ collection, slug }] }); // POST {origin}/api/revalidate, Bearer REVALIDATE_SECRET
}
```

Получатель (`/api/revalidate` в каждом приложении) проверяет секрет, вызывает `revalidateTag(tag, "max")` и сам строит пути по **своей** схеме URL (отправитель не обязан знать, как бутик называет страницу товара). Уведомление симметрично: если запись сделал процесс бутика (регистрация клиента, заявка), он так же уведомляет group. Адрес получателя — внутреннее имя сервиса в сети Dokploy (`<app-name>:3000`, при режиме DNSRR — `tasks.<app-name>:3000`, см. [Dokploy Networking](https://docs.dokploy.com/docs/core/troubleshooting/networking)). Что **не проверено**: в какой момент относительно коммита транзакции срабатывает `afterChange` при вызове из REST — поэтому отправка вынесена в `after()`/задачу, а на страницах стоит страховочный `revalidate` (например, 1 час, оценка), чтобы потерянный вебхук не держал старую страницу вечно. Альтернатива — общий cache handler с `refreshTags()` в Redis ([Next.js: cacheHandlers](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers)); для двух процессов это лишний сервис, не беру.

**Фоновые задачи.** Публикация по расписанию (`schedulePublish` уже включён у pages/products/articles), будущая T-034, ретраи синка в Bitrix24 (ADR-0004), письма — выполняет только group: `jobs.autoRun` или эндпоинт `/api/payload-jobs/run` по крону ([Payload Jobs: Queues](https://payloadcms.com/docs/jobs-queue/queues)). Бутик только ставит задачи в очередь; секреты Bitrix24 и почты живут в одном контейнере.

### 2.8 Деплой двух доменов на одном VPS (Dokploy + Traefik)

- Два приложения Dokploy из одного GitHub-репозитория, тип сборки Dockerfile: путь `apps/group/Dockerfile` и `apps/boutique/Dockerfile`, контекст — корень, стадия `runner` (Dokploy даёт поля Dockerfile Path, Docker Context Path, Docker Build Stage, build args — [Build Type](https://docs.dokploy.com/docs/core/applications/build-type)). Dockerfile строится на `turbo prune <app> --docker`: только нужные пакеты и урезанный lockfile ([Turborepo prune](https://turborepo.dev/docs/reference/prune)); нынешний Dockerfile перечисляет пакеты вручную и на новых пакетах сломается.
- Watch paths: group — `apps/group/**`, `packages/**`, `pnpm-lock.yaml`; бутик — `apps/boutique/**`, `packages/**`, `pnpm-lock.yaml` (для GitHub работает без настройки — [Watch Paths](https://docs.dokploy.com/docs/core/watch-paths)). Правка лица бутика не пересобирает group.
- Домены: divan.group и бутик с `www`-редиректом, сертификаты Let's Encrypt через Traefik. Обновление без простоя — health check в Swarm-настройках приложения ([Zero Downtime](https://docs.dokploy.com/docs/core/applications/zero-downtime)).
- **Сборка — главный операционный риск варианта B.** Dokploy по умолчанию собирает одну сборку за раз на сервер ([Concurrent Builds](https://docs.dokploy.com/docs/core/concurrent-builds)) и сам предупреждает, что сборка на сервере может привести к «freezing your server and all your application will be down», рекомендуя собирать в CI ([Going Production](https://docs.dokploy.com/docs/core/applications/going-production)). Изменение в `packages/**` = две сборки подряд. Рекомендация: GitHub Actions собирает оба образа и пушит в GHCR, Dokploy только тянет образ. Сейчас в репо нет `.github/` — это новая работа.
- Память (оценка): Dokploy требует минимум 2 ГБ RAM ([Installation](https://docs.dokploy.com/docs/core/installation)); Postgres и два процесса Next+Payload по 300–600 МБ каждый (оценка, не измерено). Текущий тариф VPS мне неизвестен. При сборке в CI хватит 4 ГБ; при сборке на сервере нужен класс 4 vCPU / 8 ГБ (CX33). Цены после повышения 15.06.2026: CX23 €5,49, CX33 €8,49 в месяц без НДС — по вторичному источнику ([Northflank](https://northflank.com/blog/hetzner-cloud-server-price-increases)), в Hetzner Console не сверял.
- БД: одна база, но **две роли**. group — владелец схемы; бутик подключается ролью без права DDL (`REVOKE CREATE ON SCHEMA public`), чтобы случайный push или миграция из бутика упали громко, а не тихо изменили схему. Что Payload без расширений не пытается выполнить DDL при старте бутика, я вывел из `connect.js` (только `createExtensions`, а расширения не настроены), но **на стенде не проверял**.
- Бэкапы — `scripts/ops/backup.sh` уже есть; R2 и Backblaze поддерживаются Dokploy как цели бэкапа БД. Это область T-018, новую задачу не завожу.

### 2.9 Миграции, которые никогда не спрашивают в проде

Push в проде невозможен в принципе (`connect.js`: только при `NODE_ENV !== 'production'`). Интерактивные вопросы бывают ровно в трёх местах, и каждое закрыто правилом:

1. **Маркер dev-push (`batch = -1`) → вопрос в `payload migrate` и в `prodMigrations` при старте.** Миграций в репо нет, значит прод создан push-ом и маркер, скорее всего, есть (проверить SQL `select * from payload_migrations where batch = -1`; доступа к серверу у меня нет — **не проверено**). Разовая процедура: `pg_dump` → `payload migrate:create baseline` (без БД) → поднять пустую базу и прогнать baseline → сравнить `pg_dump --schema-only` с копией прода → если разницы нет, на проде в одной транзакции удалить строку `batch = -1` и вставить `('<baseline>', batch 1)`. Как в бутике держать при этом прод-код, решать не нужно: бутика ещё нет, шаг делается на текущем `apps/web`.
2. **drizzle «created or renamed».** Правило: в одной миграции нет одновременно добавленных и пропавших колонок или таблиц. Переименование = expand (новая колонка, перенос данных SQL-ом в `up`) → релиз обоих приложений → contract (удаление старой) отдельным релизом. Это же правило нужно варианту B само по себе: group применяет миграцию при старте, а бутик какое-то время работает со старым кодом на новой схеме.
3. **Пустая миграция.** `--skip-empty` в CI.

Кто применяет: только group через `prodMigrations` (миграции импортируются из `@workspace/cms/migrations`); у бутика `prodMigrations` нет и `push: false`. В dev push делает только group (`PAYLOAD_DEV_PUSH=true` в его `.env`), чтобы два dev-сервера не толкали схему наперегонки (и чтобы снова не зависнуть на вопросе, как в `docs/HISTORY.md`).

**Гейт дрейфа схемы в CI, без БД**: собрать конфиг для `STOREFRONT=group` и `STOREFRONT=boutique`, на каждый выполнить `payload migrate:create drift --skip-empty`; появился файл — схема в коде не совпадает с закоммиченными миграциями или различается между приложениями → красная сборка. В CLAUDE.md и скилл `task-run`: в автономном прогоне разрешены только аддитивные изменения схемы (в них drizzle не спрашивает), удаления и переименования — с человеком. Дока Payload сама предупреждает, что env-зависимая конфигурация даёт расхождения миграций между окружениями ([Migrations](https://payloadcms.com/docs/database/migrations)) — в варианте B это главный риск, поэтому `buildDivanConfig()` делит параметры на две группы:

```ts
// packages/cms/src/config.ts — идея
export default buildConfig({
  // СХЕМА: не зависит от env и одинакова в обоих приложениях
  collections,
  globals,
  localization,
  editor,
  plugins: schemaPlugins,
  // РАНТАЙМ: может отличаться по приложению
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  cors: STOREFRONT_ORIGINS,
  csrf: STOREFRONT_ORIGINS,
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    push: process.env.PAYLOAD_DEV_PUSH === "true",
    prodMigrations: process.env.PAYLOAD_ROLE === "admin" ? migrations : undefined,
  }),
  jobs: { tasks, autoRun: process.env.PAYLOAD_ROLE === "admin" ? autoRunRules : undefined },
});
```

### 2.10 Как фича, сделанная один раз, попадает на оба сайта

Три уровня, у каждого своё место:

1. **Схема и серверная логика** — `@workspace/cms` (коллекции, хуки, доступы, плагины). Пример оплаты: `@payloadcms/plugin-ecommerce` + адаптер Stripe, у `carts`/`orders` через overrides поле `storefront`. Плагин в бете ([Overview](https://payloadcms.com/docs/ecommerce/overview)), состыковку с нашими `products` разбирает T-049 — этот вариант добавляет в её вопросы скоуп витрины.
2. **Действия, модель, headless-хуки, UI по умолчанию** — `@workspace/storefront/features/<фича>` (корзина, чекаут, образцы тканей T-045, калькулятор доставки T-046, кабинет T-047). UI на токенах — перекрашивается темой лица; лицо может заменить разметку.
3. **Включение** — флаг в `storefronts.features`.

Существенная деталь: провайдер плагина ecommerce работает через REST API Payload (`apiRoute`, `serverURL` — [Ecommerce Frontend](https://payloadcms.com/docs/ecommerce/frontend)). Поэтому бутик монтирует REST-роут `/api` (без админки): корзина, вход клиента и инициация оплаты идут на собственный домен с первосторонними cookie. Вебхук Stripe один — на group: база общая, статус заказа виден обеим витринам. Клиентский аккаунт общий, но сессия у каждого домена своя (вход отдельно); письма о заказе и сброс пароля должны строить ссылку и подпись от витрины заказа, а не от `serverURL` группы. SPF/DKIM/DMARC для второго домена — расширение T-039.

Путь изменения: один PR в `packages/**` → watch paths пересобирают оба приложения → group применяет миграцию при старте → бутик обновляется следом. Если фича требует новой колонки — это expand-миграция, которую старый код бутика просто не читает.

### 2.11 Третий сайт, форк, скрипт-скелет

- **Третий сайт той же фирмы** (например, outdoor): `node scripts/new-storefront.mjs <key> <domain>` копирует `apps/_template` (тонкие роуты, каркас лица, Dockerfile, `next.config`, `proxy.ts`), добавляет схему URL в `@workspace/core`, сидит строку в `storefronts`, печатает чек-лист Dokploy (приложение, домен, env, watch paths) и SEO-запуска. Схема БД не меняется; всё, что уже есть в пакетах, достаётся новому сайту бесплатно. Оценка: S–M без дизайна лица.
- **Форк «с совсем другим лицом»** внутри монорепо — тот же сценарий: лицо целиком своё, пакеты общие, фичи продолжают приходить.
- **Внешний форк** (другой бизнес, своя база): пакеты становятся библиотекой — git-форк монорепо с удалением чужих `apps/*` или публикация пакетов в приватный реестр. После форка общая эволюция схемы заканчивается; вариант B этого не скрывает, но граница «схема и фичи в пакетах, лицо в приложении» делает скелет-скрипт почти механическим.

### 2.12 Сколько это стоит в сопровождении одному разработчику

- Постоянная надбавка (оценка): +1–2 часа в неделю против одного приложения — два контейнера, два набора env и логов, две сборки на изменения в `packages/**`, контроль вебхуков ревалидации, синхронные апгрейды Next/Payload с проверкой двух лиц.
- Разовая цена границ пакетов: `exports`, `transpilePackages`, линт границ, importMap только по именам пакетов, типы Payload, сгенерированные в пакет. Команда `pnpm web generate` превращается в `pnpm --filter group generate` (типы пишутся в `packages/cms`), правятся CLAUDE.md и гейты `task-run`.
- Агентам проще, чем кажется: граница «лицо vs пакеты» совпадает с границей задач (дизайн-проход T-044 трогает только `apps/group`), а гейт дрейфа схемы ловит то, что агент мог бы сломать молча.

---

## 3. План миграции

Порядок построен так, чтобы ничего не мешало первым продажам: шаги 1–4 полезны divan.group независимо от бутика; шаги 5–9 можно отложить до момента, когда для бутика будут премиум-товары и съёмка (T-042, T-044).

| #   | Шаг                                                                                                                                                                                                                                                                                       | Объём | Связь с очередью                           |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------ |
| 1   | ADR-0011 «Две витрины: вариант B», подтверждение домена бутика владельцем, правило «премиум → бутик», схема URL бутика                                                                                                                                                                    | S     | —                                          |
| 2   | Миграции без промптов: бэкап, baseline, сверка схемы на копии прода, замена строки `batch = -1`, `prodMigrations`, CI-гейт дрейфа (`migrate:create --skip-empty`), правило «только аддитивно» в CLAUDE.md и `task-run`                                                                    | M     | смежно с T-018 (бэкапы)                    |
| 3   | ISR вместо `force-dynamic`: пустой `generateStaticParams`, страховочный TTL, проверка `Cache-Control` на проде, sitemap/robots с `revalidate`                                                                                                                                             | S     | новый шаг (в очереди нет)                  |
| 4   | Медиа в Cloudflare R2 через `storage-s3` + публичный домен, перенос файлов, `remotePatterns`                                                                                                                                                                                              | S     | смежно с T-018                             |
| 5   | Пакеты `@workspace/core` и `@workspace/cms`: перенос `apps/web/src/payload/**`, замена 24 импортов `@/…` (15 — `shared/config`, 7 — `payload-types`, 2 — `shared/lib`), типы в пакет, admin-компоненты по подпути, `buildDivanConfig()`                                                   | L     | —                                          |
| 6   | Пакет `@workspace/storefront`: shared + entities + фичи без лица, подпути `server-only`, базовые словари                                                                                                                                                                                  | M     | —                                          |
| 7   | Схема витрин: `storefronts`, `business`, `placements`/`homeStorefront`/`tier`/`storefrontSeo`, `storefront` у pages/categories/articles/redirects/заявок, составные индексы; expand-миграция с переносом `header`/`footer`/`site-settings`; сид двух витрин; contract — следующим релизом | M     | учесть в T-005, T-008, T-011, T-045, T-046 |
| 8   | `apps/web` → `apps/group`: запросы, meta, sitemap, robots с фильтром по витрине; уведомитель ревалидации + `/api/revalidate`; подписанное превью                                                                                                                                          | M     | —                                          |
| 9   | `apps/boutique`: каркас из шаблона, своя схема URL, REST без админки, тема-заглушка, `indexable = false`                                                                                                                                                                                  | M     | —                                          |
| 10  | Лицо бутика по выбранному дизайн-направлению (прототипы делаются отдельно)                                                                                                                                                                                                                | L     | по аналогии с T-044 для group              |
| 11  | Dokploy: второе приложение, домены и `www`, watch paths; GitHub Actions → GHCR (или VPS 8 ГБ); роль БД без DDL для бутика; health checks                                                                                                                                                  | M     | смежно с T-018                             |
| 12  | Запуск бутика в поиске: GSC Domain-ресурс, поток GA4, JSON-LD, sitemap, проверка дублей title/description, включение `indexable`                                                                                                                                                          | S     | расширяет T-009, T-017                     |
| 13  | Документация: CLAUDE.md, `docs/features/*`, `docs/ops/deployment.md` (Dokploy вместо Caddy), `docs/HISTORY.md` (ловушки миграций), гейты скиллов                                                                                                                                          | S     | —                                          |

**Итог трудоёмкости (оценка):** платформа (шаги 1–9, 11–13) — 11–19 рабочих дней одного разработчика с агентами, из них шаги 1–4 — около 3–4 дней; лицо бутика (шаг 10) — ещё 5–10 дней в зависимости от выбранного направления. Календарно 4–6 недель, если параллельно идут продажи и контент. Кодовая база маленькая (~9 тыс. строк: `payload/` 2,6 тыс., `modules/shared` 2,4 тыс., `entities` 0,7 тыс. — подсчёт `wc -l`), поэтому перенос — механика; основное время уйдёт на стыковку Payload, Turbopack и пакетов и на ops.

---

## 4. Слабые места (честно)

1. **Две сборки и двойная память.** Изменение в пакетах пересобирает оба приложения; Dokploy собирает по одной сборке и сам называет сборку на сервере риском зависания. Без CI-сборки в GHCR или VPS на 8 ГБ вариант B хрупок в эксплуатации.
2. **Межпроцессная ревалидация — самописная.** Next инвалидирует только свой экземпляр; вебхуки, ретраи и TTL-страховка — наш код. Сбой означает устаревшую витрину до истечения TTL. В варианте «одно приложение» этой проблемы нет.
3. **Одна схема — два процесса.** Любая env-зависимость схемы (как `enabled: Boolean(process.env.S3_BUCKET)` из примера доки Payload) рассинхронизирует приложения. Защита — гейт дрейфа в CI и роль БД без DDL у бутика, но это дисциплина, которую надо держать всегда.
4. **Окно раскатки.** group мигрирует схему при старте, бутик в это время на старом коде. Только expand/contract; переименование поля — два релиза вместо одного.
5. **Админка на чужом домене.** Превью бутика требует подписанного токена; iframe-превью в Safari не работает из-за блокировки сторонних cookie; кнопка «в новом окне» — обходной путь.
6. **Клиент логинится на каждом домене отдельно.** Аккаунт общий, сессии разные; письма и ссылки должны знать витрину. Общей корзины между брендами нет.
7. **Предоплата сложности.** 2–4 недели платформы (оценка) до того, как бутик продаст первую вещь, при цели «первые продажи, хоть в минус». Смягчение — порядок шагов: первые четыре окупаются сразу на divan.group.
8. **Код лиц дублируется.** Два layout, два набора виджетов: баг в общем куске чинится в пакете один раз, баг в лице — у каждого лица свой.
9. **Синхронные апгрейды.** Next/Payload/React обновляются сразу в двух приложениях; плагин ecommerce в бете — каждое обновление проверяется на обоих лицах.
10. **Пакетная граница с подвохами.** Без `@/` в пакетах, importMap только по именам пакетов, типы Payload в пакете, `server-only`-подпути; ловушка из HISTORY про баррель с серверным кодом становится шире.
11. **SEO-ограничения уровня бизнеса не снимаются.** Дорвей-риск при похожем ассортименте, нельзя второй профиль GBP, второму домену нужен свой Merchant Center, отдельная работа по ссылкам и бренду для нового домена.
12. **Не всё проверено на стенде:** реальная RAM двух контейнеров; старт Payload под ролью без DDL; момент коммита транзакции относительно вебхука; iframe-превью в Firefox; поведение алиасов tsconfig в пакетах под Turbopack (дизайн их обходит).

## 5. Когда вариант B — неправильный выбор

- Если бутик в ближайшие 3–6 месяцев остаётся «лендингом на 10 товаров» с тем же визуальным языком — выгоднее одно приложение с маршрутизацией по хосту, а схему витрин (шаг 7) всё равно заложить сейчас, пока база почти пустая.
- Если сборка останется на VPS с 4 ГБ без CI — два Next-приложения будут регулярно мешать друг другу.
- Если владелец решит, что один и тот же товар должен индексироваться на обоих доменах с почти одинаковым текстом, — проблема в SEO-модели, а не в архитектуре, и B её не спасёт.

## 6. Вопросы владельцу

1. Домен бутика — точно `divan.boutique`? RDAP показывает регистрацию 2026-09-23 через Cloudflare с той же парой NS, что у divan.group; подтвердите, что это ваш.
2. Премиум-товар показываем на divan.group тизером со ссылкой в бутик (рекомендую) или нужна покупка в корзине group (тогда зеркальная страница с canonical и отдельным описанием)?
3. Бутик стартует со всеми четырьмя локалями или с es/ru/en?
4. Какой сейчас тариф VPS, и готовы ли собирать образы в GitHub Actions (бесплатный лимит минут для приватного репо — проверить), чтобы сервер не собирал два приложения?

---

## Источники

Код и замеры (2026-10-05): `apps/web/src/proxy.ts`, `apps/web/src/payload.config.ts`, `apps/web/src/payload/**`, `apps/web/src/app/(frontend)/**`, `apps/web/src/app/{sitemap,robots}.ts`, `apps/web/next.config.ts`, `apps/web/Dockerfile`, `docker-compose.prod.yml`, `docs/ops/deployment.md`, `docs/HISTORY.md`, коммит `3758ead`; `node_modules`: `@payloadcms/db-postgres@3.90.1/dist/connect.js`, `@payloadcms/drizzle@3.90.1/dist/{migrate.js,utilities/pushDevSchema.js,utilities/buildCreateMigration.js,queries/getTableColumnFromPath.js}`, `payload@3.90.1/dist/bin/{migrate.js,generateImportMap/utilities/addPayloadComponentToImportMap.js}`, `payload@3.90.1/dist/fields/baseFields/slug/index.js`, `drizzle-kit@0.31.7/api.js`, `next@16.3.3/dist/server/async-storage/draft-mode-provider.js`; `curl -I https://divan.group/`; DoH `cloudflare-dns.com`; замеры React Bits — лаборатория прошлого прогона в scratchpad (не перепроверял).

Внешние:

- Next.js: [Self-hosting](https://nextjs.org/docs/app/guides/self-hosting), [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag), [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params), [proxy.js](https://nextjs.org/docs/app/api-reference/file-conventions/proxy), [cacheHandlers](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers)
- Payload: [Migrations](https://payloadcms.com/docs/database/migrations), [Building without a DB connection](https://payloadcms.com/docs/production/building-without-a-db-connection), [Custom Components](https://payloadcms.com/docs/custom-components/overview), [Collections](https://payloadcms.com/docs/configuration/collections), [Storage Adapters](https://payloadcms.com/docs/upload/storage-adapters), [Multi-Tenant Plugin](https://payloadcms.com/docs/plugins/multi-tenant), [Live Preview](https://payloadcms.com/docs/live-preview/overview), [Server-side Live Preview](https://payloadcms.com/docs/live-preview/server), [Jobs: Queues](https://payloadcms.com/docs/jobs-queue/queues), [Ecommerce Overview](https://payloadcms.com/docs/ecommerce/overview), [Ecommerce Frontend](https://payloadcms.com/docs/ecommerce/frontend), [Using Payload outside Next.js](https://payloadcms.com/docs/local-api/outside-nextjs); исходники плагина multi-tenant 3.90.1 на [unpkg](https://unpkg.com/@payloadcms/plugin-multi-tenant@3.90.1/dist/types.d.ts)
- Dokploy: [Build Type](https://docs.dokploy.com/docs/core/applications/build-type), [Watch Paths](https://docs.dokploy.com/docs/core/watch-paths), [Concurrent Builds](https://docs.dokploy.com/docs/core/concurrent-builds), [Going Production](https://docs.dokploy.com/docs/core/applications/going-production), [Zero Downtime](https://docs.dokploy.com/docs/core/applications/zero-downtime), [Installation](https://docs.dokploy.com/docs/core/installation), [Networking](https://docs.dokploy.com/docs/core/troubleshooting/networking)
- Turborepo: [prune](https://turborepo.dev/docs/reference/prune)
- Cloudflare: [R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- Hetzner: [Cost-optimized plans](https://www.hetzner.com/cloud/cost-optimized/) (цены на странице рендерятся скриптом, не считал), цены — [Northflank](https://northflank.com/blog/hetzner-cloud-server-price-increases) (вторичный источник)
- Google Search: [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization), [Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions), [Site names](https://developers.google.com/search/docs/appearance/site-names), [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies), [Cross-domain canonical, 2009](https://developers.google.com/search/blog/2009/12/handling-legitimate-cross-domain) (старше 2024), [Search Console: свойства](https://support.google.com/webmasters/answer/34592), [GA4 cross-domain](https://support.google.com/analytics/answer/10071811), [Merchant Center: URL claim](https://support.google.com/merchants/answer/11586344), [GBP guidelines](https://support.google.com/business/answer/3038177)
- Браузеры: [Privacy Sandbox next steps, 2025-04-22](https://privacysandbox.google.com/blog/privacy-sandbox-next-steps), [WebKit full third-party cookie blocking, 2020](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/) (старше 2024)
- Домены: [RDAP divan.boutique](https://rdap.identitydigital.services/rdap/domain/divan.boutique), [RIPE RDAP 116.202.29.144](https://rdap.db.ripe.net/ip/116.202.29.144)
