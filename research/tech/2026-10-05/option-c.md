# Вариант C: отдельные репозитории — «ядро + витрины»

Ресёрч для панели архитектуры, 2026-10-05. Защищаю вариант C в его сильнейшей форме и честно описываю слабые места. Оценки трудоёмкости, памяти и времени помечены «оценка». Источники старше 2024 года помечены «(старше 2024)». Что проверить не удалось — в §9.

Требование: один бизнес, два публичных сайта с разным дизайном и разной широтой ассортимента (divan.group — широкий магазин, бутик на `.boutique` — премиум, кураторский, неглубокая навигация), по возможности один бэкенд; позже — новые сайты форком или генерацией из этой базы, возможно с совсем другим лицом; фичи, сделанные один раз (например, оплата), должны доходить до всех сайтов. SEO прежде всего.

## 0. Коротко

1. **Что предлагаю.** Не «форк на каждый сайт со своей базой», а его лучшую версию — **C★ «ядро + витрины» (hub & spoke)**:
   - текущий репозиторий `divan-shop` становится **ядром**: один Payload, одна PostgreSQL, одна админка, один API, одна цепочка миграций; divan.group остаётся внутри ядра и читает данные через Local API, как сейчас;
   - **бутик** — отдельный репозиторий: безголовый (headless) Next 16 со своим лицом, ходит в ядро по REST с API-ключом своей витрины;
   - общий код доезжает до витрин **версионированными пакетами** из ядра (`@divan/contracts`, `@divan/storefront-kit`), а не мёрджами апстрима;
   - скелет новых сайтов — `templates/storefront` внутри ядра, позже — скрипт `scripts/new-site.mjs`.
2. **SEO-безопасность держится на модели данных**, а не на числе репозиториев: у каждого товара, проекта и статьи ровно один канонический домен, два сайта никогда не публикуют один документ как две индексируемые страницы. Отдельные репозитории добавляют «правильный хост по построению»: у каждого приложения ровно один origin, поэтому canonical, sitemap, robots, OG и Organization физически не могут утечь на чужой домен.
3. **Цена честно.** Самый дорогой старт из трёх вариантов: ≈20–25 человеко-дней накладных именно варианта C поверх работы, нужной в любом варианте, и +3–6 ч/мес поддержки на каждую дополнительную витрину (оценка). Окупается, если сайтов станет три и больше или лица действительно разойдутся «полностью». Не окупается, если бутик — это «тот же магазин в другой палитре».

## 1. Что проверено

### 1.1 В коде (C:/Projects/Sites/divan-shop, HEAD 7009c6d)

| Факт                                                                                                                                                                                                              | Где                                                                  | Следствие для C                                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next 16.3.3 + Payload 3.90.1 в одном приложении: сайт на `/`, админка `/admin`, REST `/api`                                                                                                                       | `apps/web/package.json`, `apps/web/src/payload.config.ts`            | ядро уже умеет отдавать REST/GraphQL; витрине бэкенд писать не нужно                                                                                                                          |
| `proxy.ts` знает только локали (cookie → Accept-Language → default `ru`), хост не видит                                                                                                                           | `apps/web/src/proxy.ts`, `modules/shared/config/locales.ts`          | в C хост-логика внутри Next не нужна: хост = отдельный контейнер                                                                                                                              |
| Глобалы `header`, `footer`, `site-settings` — по одному на всю инсталляцию                                                                                                                                        | `payload/globals/*`                                                  | переезжают в документ витрины                                                                                                                                                                 |
| `plugin-seo`: `generateURL` строит URL от `getServerSideURL()`, `generateTitle` = `title \| SITE.name`                                                                                                            | `payload/plugins/index.ts`                                           | превью сниппета для товара бутика покажет чужой домен и чужой бренд; брать домен и шаблон из документа витрины                                                                                |
| `slugField()` в Payload по умолчанию `unique: true`                                                                                                                                                               | `apps/web/node_modules/payload/dist/fields/baseFields/slug/index.js` | слаги «на витрину» = `slugField({ disableUnique: true })` + составной индекс                                                                                                                  |
| Составные индексы поддержаны: `indexes: [{ fields: string[], unique?: boolean }]`                                                                                                                                 | `payload/dist/collections/config/types.d.ts`                         | уникальность `(storefront, slug)` делается штатно                                                                                                                                             |
| Хуки ревалидации вызывают `revalidatePath` / `revalidateTag(tag, "max")` в своём процессе                                                                                                                         | `payload/hooks/revalidate.ts`                                        | до контейнера бутика не дойдут — нужен вебхук                                                                                                                                                 |
| Все контентные роуты и OG-картинки `force-dynamic` (образ собирается без БД, коммит 3758ead); живой `https://divan.group/es` отдаёт `Cache-Control: private, no-cache, no-store`, TTFB ≈0,19 с (curl, 2026-10-05) | `app/(frontend)/[locale]/**`                                         | `docs/features/site-core.md` всё ещё описывает `generateStaticParams` — дрейф документации; шаблон витрины сразу с кэшем                                                                      |
| Медиа — локальный том `public/media`; `serverURL` в конфиге не задан, URL файлов относительные `/api/media/file/...`                                                                                              | `payload/collections/media.ts`, `next.config.ts` (`localPatterns`)   | витрине нужен публичный URL картинок или внешнее хранилище                                                                                                                                    |
| Sitemap на 68 URL; у home/catalog/blog `lastmod` = время запроса                                                                                                                                                  | `app/sitemap.ts`, `curl /sitemap.xml`                                | Google берёт `lastmod`, только если он «consistently and verifiably accurate» ([Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)); в kit исправить |
| `organizationJsonLd` выводится на каждой странице через layout                                                                                                                                                    | `app/(frontend)/[locale]/layout.tsx`                                 | Google: достаточно домашней или страницы «о компании» ([Google](https://developers.google.com/search/docs/appearance/structured-data/organization))                                           |
| Jobs Payload настроены (`jobs.access`, `tasks: []`), есть опция `jobs.autoRun` (cron внутри процесса)                                                                                                             | `payload.config.ts`, `payload/dist/queues/config/types/index.d.ts`   | ретраи вебхуков ревалидации — штатными джобами                                                                                                                                                |
| `docs/ops/deployment.md` описывает compose + Caddy; прод по брифу — Dokploy + Traefik; в ответах divan.group нет заголовка `Server: Caddy`                                                                        | `docs/ops/deployment.md`, curl                                       | документ деплоя устарел при любом варианте                                                                                                                                                    |
| Репозиторий на GitHub (`savchuckvadim/divan-shop`), CI нет (папки `.github` нет)                                                                                                                                  | `git remote -v`                                                      | пайплайн сборки строим с нуля                                                                                                                                                                 |

### 1.2 В сети (2026-10-05)

| Факт                                                                                                                                                                                                                | Источник                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| divan.group зарегистрирован 2026-09-22, divan.boutique — 2026-09-23; оба у Cloudflare Registrar с одной парой NS `dell`/`aarav.ns.cloudflare.com`; у divan.boutique пока нет A-записи, divan.group → 116.202.29.144 | RDAP [divan.boutique](https://rdap.identitydigital.services/rdap/domain/divan.boutique), [divan.group](https://rdap.identitydigital.services/rdap/domain/divan.group), nslookup через 1.1.1.1                                |
| Cloudflare назначает NS, «favor consistent nameserver names across all zones within an account» → домены почти наверняка в одном аккаунте владельца. Владелец в RDAP скрыт — это вывод, не факт                     | [Cloudflare](https://developers.cloudflare.com/dns/zone-setups/reference/nameserver-assignment/)                                                                                                                             |
| На npm: `payload` 3.90.2, `next` 16.3.8, `@payloadcms/sdk` 3.90.2, Payload 4.0 в canary (`4.0.0-canary.37`)                                                                                                         | [registry.npmjs.org/payload](https://registry.npmjs.org/payload), [next](https://registry.npmjs.org/next), [@payloadcms/sdk](https://registry.npmjs.org/@payloadcms/sdk)                                                     |
| 2026-09-18 Payload выпустил пакет исправлений безопасности для всей ветки 3.x, исправлено в 3.90.0 (проект уже на 3.90.1)                                                                                           | [Payload](https://payloadcms.com/posts/blog/payload-security-update-available-for-3x-and-40)                                                                                                                                 |
| React2Shell, CVE-2025-55182, CVSS 10, раскрыт 2025-12-03, массово эксплуатировался; исправлено в Next 16.0.7+                                                                                                       | [Google Cloud TI](https://cloud.google.com/blog/topics/threat-intelligence/threat-actors-exploit-react2shell-cve-2025-55182), [Tenable](https://www.tenable.com/blog/react2shell-cve-2025-55182-react-server-components-rce) |

Остальные внешние факты — по месту, со ссылками.

### 1.3 Чего в исходных данных нет

Точное имя бутика («divan.boutique — или как там пишется») владелец не подтвердил; домен `divan.boutique` существует и, судя по регистратору и NS, принадлежит ему, но это вывод. Формулировка «Подкатегории, не больше» допускает два прочтения (плоский список категорий или «только подкатегории без родителей»); ниже я принимаю «один уровень», это вопрос владельцу (§8).

## 2. Какую версию C защищаю и почему

### 2.1 Три способа «развести сайты по репозиториям»

| Подвариант                                                                                            | Бэкенд | Как доезжает общий код    | Вердикт                                        |
| ----------------------------------------------------------------------------------------------------- | ------ | ------------------------- | ---------------------------------------------- |
| **C1.** Форк репозитория на каждый сайт, у каждого свой Payload и своя база                           | N      | `git merge upstream/main` | отвергаю                                       |
| **C2.** Все витрины безголовые в своих репозиториях, ядро — только админка и API (`cms.divan.group`)  | 1      | пакеты                    | целевое состояние «потом», по триггеру (§3.11) |
| **C★.** Ядро = админка + API + divan.group; бутик и будущие сайты — безголовые репозитории из шаблона | 1      | пакеты + API              | **предлагаю сейчас**                           |

### 2.2 Почему не «форк + мёрджи апстрима»

Это первая картинка владельца, и для **первой копии** она работает. Дальше — нет:

- Лицо бутика по определению переписывает `packages/ui`, `modules/widgets/*`, layout и страницы. Каждый апстрим-коммит в эти места — конфликт. Через месяц мёрдж апстрима превращается в ручной перенос.
- Если у форка свой Payload, у него своя цепочка миграций. Payload генерирует миграцию сравнением со снимком схемы последней миграции; чужие миграции, вмёрдженные в другую цепочку, ломают это сравнение. В issue #14941 ровно этот эффект: миграции без своих снимков заставляют следующий `migrate:create` повторять уже сделанные операции и задавать интерактивные вопросы ([payload#14941](https://github.com/payloadcms/payload/issues/14941)).

Поэтому «форк» в C★ значит **«сгенерировать один раз, дальше потреблять пакеты и API»**.

### 2.3 Почему не «у каждого сайта свой Payload и база» (C1)

- **Ломает «бэкенд может быть один».** Диваны одни и те же (одни фабрики Yecla, «единый дизайн»): товар пришлось бы заводить дважды или синхронизировать.
- **Клиенты раздваиваются.** «Скидки зарегистрированным» и личный кабинет (T-047) работают только при одной базе клиентов.
- **Заказы и оплата пишутся N раз** или синхронизируются — ровно то, что требование запрещает.
- **N обновлений Payload.** 2026-09-18 вышел пакет исправлений безопасности для всей ветки 3.x ([Payload](https://payloadcms.com/posts/blog/payload-security-update-available-for-3x-and-40)); Payload 4.0 уже в canary ([npm](https://registry.npmjs.org/payload)). При C1 каждое такое событие — N обновлений и N цепочек миграций.

C1 остаётся только как **выход**: если бренд когда-нибудь продают или отдают партнёру, ядро форкается один раз вместе с выгрузкой данных этой витрины.

### 2.4 Почему divan.group пока остаётся внутри ядра

- divan.group уже живой, цель — первые продажи. Переписывать его фронт в безголовый сейчас — риск без выгоды.
- Внутри ядра divan.group читает данные через Local API — без сетевого прыжка, это лучшее для TTFB главного сайта.
- Вынос divan.group в отдельный репозиторий становится механическим, как только бутик докажет шаблон и kit (§3.11). Триггер — третий сайт или полная смена лица divan.group.

## 3. Архитектура C★

### 3.1 Раскладка репозиториев

```
divan-shop  (ядро, текущий репозиторий)
  apps/web/                          Next 16 + Payload 3: divan.group + /admin + /api
    src/payload/collections/         + storefronts.ts, storefront-clients.ts, projects.ts
    src/payload/endpoints/sf/        /api/v1/sf/*: заявки, образцы, курьер, расчёт доставки; позже checkout
    src/payload/jobs/                revalidate-storefront (вебхук с HMAC и ретраями)
    src/migrations/                  единственная цепочка миграций во всей системе
    src/modules/**                   FSD divan.group (как сейчас), SEO-слой берётся из kit
  packages/ui/                       дизайн-система только divan.group
  packages/contracts/                @divan/contracts: типы из payload-types.ts, zod-схемы /api/v1/sf/*,
                                     LOCALES, слаги витрин. Только TS, без React
  packages/storefront-kit/           @divan/storefront-kit: клиент ядра (поверх @payloadcms/sdk или fetch),
                                     загрузчики с cache-тегами, SEO (meta, canonical, hreflang, sitemap,
                                     robots, JSON-LD), фабрики роутов /api/revalidate и /next/preview,
                                     словари общего смысла (юр., корзина, ошибки), контракт dataLayer
  templates/storefront/              скелет безголовой витрины; собирается в CI ядра против локального kit
  scripts/new-site.mjs               генератор сайта (позже, §3.11)

divan-boutique  (новый репозиторий, создан из templates/storefront)
  src/app/[locale]/**                свои маршруты и своя URL-схема
  src/ui/ (или packages/ui)          своя дизайн-система, шрифты, анимации
  src/i18n/dictionaries/*            строки лица, typed Record<Locale, …>, без next-intl
  Dockerfile, .github/workflows/     сборка → GHCR → деплой в Dokploy
  CLAUDE.md                          короткий, со ссылкой на docs ядра
```

Документация, ADR, очередь задач и реестр кронов остаются **в ядре** — единственный источник истины, как сейчас.

### 3.2 Маршрутизация запросов по хосту

- **Снаружи.** Traefik (через Dokploy) направляет `Host(divan.group)` в контейнер ядра, `Host(divan.boutique)` — в контейнер бутика; `www` → apex редиректом. Хост-логики внутри Next нет: каждое приложение знает ровно один свой origin.
- **Внутри приложений** `proxy.ts` занимается только локалями, как сейчас (Next 16 переименовал middleware в `proxy.ts` — [Next.js 16](https://nextjs.org/blog/next-16)). Редирект на локаль сохраняет query-строку, поэтому параметр `_gl` кросс-доменной аналитики не теряется.
- **Бутик → ядро** — по внутренней сети Dokploy. Все приложения и базы сейчас в одной общей сети `dokploy-network` ([Dokploy #4637](https://github.com/Dokploy/dokploy/issues/4637), issue открыт, июнь 2026), запросы идут на внутренний адрес ядра без Traefik; запасной путь — `https://divan.group/api`.
- **Браузер бутика никогда не ходит в ядро напрямую** (паттерн Backend-for-Frontend): все вызовы идут из server components, route handlers и server actions бутика. Нет CORS, нет кросс-сайтовых cookie, ключ витрины не попадает в браузер.
- **Аутентификация витрины.** Auth-коллекция `storefront-clients` с `useAPIKey: true` и `disableLocalStrategy: true`, заголовок `storefront-clients API-Key <key>`; документ ключа попадает в `req.user` и проходит обычный access control ([Payload API keys](https://payloadcms.com/docs/authentication/api-keys)). Access-функции режут выдачу по витрине ключа и по `_status`.
- **Покупатели: «один аккаунт, две двери».** Логин на бутике проксируется сервером бутика в `/api/customers/login` ядра, бутик кладёт JWT в свою httpOnly cookie и дальше шлёт `Authorization: JWT <token>` ([Payload REST](https://payloadcms.com/docs/rest-api/overview)). Тот же email и пароль работают на обоих сайтах; общего SSO между доменами нет (это осознанное упрощение).

### 3.3 Модель данных: скоупинг витрин

Всё живёт в ядре. Для переключателя сайта в админке берём `@payloadcms/plugin-multi-tenant` с `tenantsSlug: "storefronts"`: он добавляет поле витрины, селектор в админке, фильтрацию списков и связей, «глобал на витрину» (`isGlobal`) ([Payload multi-tenant](https://payloadcms.com/docs/plugins/multi-tenant)). Нюансы проверены в коде пакета 3.90.2: `hasMany` для поля витрины поддержан в рантайме (`dist/fields/tenantField/index.js` читает его из overrides), но в документации не описан; баг bulk-edit с `hasMany` закрыт в 3.70+ ([payload#15145](https://github.com/payloadcms/payload/issues/15145)). По умолчанию плагин удаляет документы при удалении витрины — выключаем `cleanupAfterTenantDelete: false`.

**Новые коллекции**

- `storefronts` (документ на сайт):
  - `slug` (`group`, `boutique`; уникальный, не меняется), `name` (localized: имя бренда; имя бутика не подтверждено), `serverUrl`, `locales` (подмножество `LOCALES`), `defaultLocale` (es после T-004);
  - `urlPatterns` — шаблоны путей (`/{locale}/product/{slug}` и т. п.) для товара, категории, страницы, статьи, проекта. Единственный источник путей для ядра: SEO-превью, письма, фиды, `canonicalUrl`. Лица реализуют те же пути, CI витрины проверяет совпадение;
  - `seo`: `titleTemplate` (localized: «{title} | Divan» / «{title} — Divan Boutique»), `defaultDescription`, `ogImage`, `allowIndexing` (false до запуска);
  - `organization`: тип `OnlineStore`, `legalName`, `vatId` (после autónomo), контакты, `sameAs[]`, `logo`, `parent` → другая витрина (для `parentOrganization`);
  - `navigation` (header/footer), `contacts` — вместо глобалов `header`, `footer`, `site-settings`;
  - `catalog.maxCategoryDepth` (group: 3, boutique: 1), валюта EUR;
  - `integration.revalidateUrl` / `previewUrl` (пусто у ядра). Секреты — только env (`REVALIDATE_SECRET_<SLUG>`), не в базе и не в репозитории.
- `storefront-clients` — API-ключи витрин: `storefront`, `scope` (`published` / `preview`).
- `projects` — «интерьеры с нашими диванами»: `storefronts`, `canonicalStorefront`, галерея, `products` (связь), город, localized-история, SEO. Для бутика это главный SEO- и вкусовой актив (лукбук).

**Изменения существующих коллекций**

- `products`:
  - `storefronts` (поле витрины плагина, `hasMany`) — где товар появляется в листингах;
  - `canonicalStorefront` (обязательное, валидация «входит в `storefronts`») — **единственный домен, где живёт индексируемая страница товара**. «Премиум уходит в бутик» = `tier: premium` по умолчанию ставит канонической витриной бутик;
  - `tier`: `core` / `premium`;
  - `crossListing`: `card` (по умолчанию: на второй витрине только карточка со ссылкой на канонический URL) или `mirror` (страница-зеркало с cross-domain `rel=canonical`, вне sitemap, без hreflang);
  - `category` → `categories` (`hasMany`, `filterOptions`: только категории витрин товара) — через expand/contract (§3.9);
  - `canonicalUrl` — виртуальное поле (localized) = `serverUrl` + `urlPatterns.product` канонической витрины; им пользуются оба лица для перекрёстных ссылок;
  - SEO-таб `meta` — один, для канонической витрины;
  - под пожелания владельца: `drawings` (технические чертежи, upload PDF/SVG с габаритами), `factory` (поставщик, видим только админу) — для приведения диванов разных фабрик к «единому дизайну»; поля T-008 (sku, leadTimeDays, fabrics) идут как в очереди.
- `categories`: `storefront` (одна витрина), `parent` (та же витрина, глубина ≤ `maxCategoryDepth`; у бутика 1 = плоские подкатегории без вложенности), `slugField({ disableUnique: true })` + `indexes: [{ fields: ["storefront", "slug"], unique: true }]`, SEO-группа как сейчас. Деревья у сайтов разные и не связаны.
- `pages`, `articles`: `storefront` (одна витрина) + составной уникальный слаг. Юридические страницы — на каждой витрине свои (одно юрлицо, разные бренды).
- `customers`: общие для всех витрин, + `registeredVia`; правило скидки зарегистрированным — в ядре (T-047).
- `orders` и корзины (по решению T-049): `storefront`, где оформлен заказ, — для брендирования писем и отчётов.
- Лиды и отправки форм (T-005, ADR-0004): `storefront` — источник бренда в зеркале Bitrix24.
- `redirects` (плагин): `storefront` — редиректы живут по хосту.
- `media`: общая библиотека, папки по витринам (`folders: true` уже включено). `forms` — общие.
- Глобалы `header`, `footer`, `site-settings` удаляются отдельной contract-миграцией после переноса данных.

**Стражи (в коде ядра, не в головах)**

- Хук `ensureUniqueSeo` (beforeValidate) на products, categories, pages, articles, projects: для каждой сохраняемой локали ищет такой же `meta.title` или `meta.description` на любой витрине → ошибка валидации. Вместе с разными `titleTemplate` это гарантирует, что два сайта не опубликуют одинаковые title и description.
- Валидации `canonicalStorefront ∈ storefronts` и глубины дерева категорий.
- Интеграционный тест: в sitemap витрины нет документов с чужой `canonicalStorefront`.

### 3.4 Два лица: разделение и предел расхождения

**Может разойтись полностью:** дизайн-система, токены, шрифты, библиотеки анимации (GSAP, Motion, компоненты в духе React Bits), сетка, глубина навигации, URL-схема, стратегия рендеринга (бутик почти статичный, магазин с фильтрами), подмножество локалей. Обновление тяжёлой библиотеки на бутике не может сломать сборку магазина: у репозиториев разные графы зависимостей и разные деплои. Справедливости ради, размер JS-бандла по маршрутам Next делит и внутри одного приложения — уникальное преимущество C не в килобайтах, а в независимости сборки, релизов и зависимостей.

**Не расходится (инварианты в kit и contracts):** правила canonical, hreflang, sitemap, robots, JSON-LD; контракт API; смысл юридических и платёжных строк; имена событий `dataLayer` (T-006); поведение согласия на cookies (T-014b); базовая доступность (reduced motion, focus). У каждого лица свой бюджет Core Web Vitals в CI.

Теоретически лицо можно сделать даже не на Next (контракт — HTTP + TS), но kit привязан к Next; уход с Next означает переписать адаптеры kit. Не рекомендую.

### 3.5 SEO на каждом хосте

- **Дубли.** Одна индексируемая страница на документ. На второй витрине — карточка со ссылкой на канонический URL. Режим `mirror` опирается на cross-domain `rel=canonical`, а Google считает canonical подсказкой, а не командой ([Google, 2009 (старше 2024)](https://developers.google.com/search/blog/2009/12/handling-legitimate-cross-domain); актуальные правила — [canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization), [consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)). Поэтому `mirror` — исключение, не правило.
- **Doorway.** Политика Google прямо называет «multiple websites with slight variations to the URL and home page to maximize their reach» и «multiple domain names … targeted at specific regions or cities» злоупотреблением ([Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies)). Отсюда правила: городские страницы (ADR-0002, T-011) живут только на divan.group; у бутика нет гео-страниц; каждый кластер запросов из `docs/marketing/query-portfolio.md` закреплён за одной витриной; тексты бутика пишутся отдельно, не переводятся с магазина.
- **Sitemap** на каждом приложении: только документы своей канонической витрины, честный `lastmod` (максимум `updatedAt` содержимого), `alternates` по локалям. Google игнорирует `priority` и `changefreq` ([Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)).
- **robots**: на каждом приложении свой. Пока `allowIndexing=false` — `Disallow: /` и `X-Robots-Tag: noindex`; стейджинг и превью закрыты всегда. Бутик не должен попасть в индекс скелетом.
- **canonical и hreflang** — абсолютные, от своего `serverUrl`; hreflang только внутри домена (es/ru/en/uk + `x-default` → es после T-004). Между доменами hreflang не ставим: сайты не являются языковыми версиями друг друга ([Google hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)).
- **OG-картинки** — свои `opengraph-image.tsx` в каждом лице (бренд и палитра лица), данные и fallback-логика из kit; шаблон title — из документа витрины.
- **JSON-LD.** На домашней странице каждого сайта `OnlineStore` (Google рекомендует этот подтип для e-commerce — [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization)) со своим `@id` и `WebSite` для имени сайта. Имена сайтов Google поддерживает на уровне домена, не подкаталога ([site names](https://developers.google.com/search/docs/appearance/site-names)) — у бутика будет своё имя в выдаче. У бутика `parentOrganization` → `https://divan.group/#organization`, одно юрлицо (`legalName`, `vatID`) на обоих. `Product` и `BreadcrumbList` — только на канонических страницах. Замечу: T-007 в очереди всё ещё про шоурум и `FurnitureStore`, после ADR-0009 это расходится.
- **Search Console**: Domain property на каждый домен через DNS TXT ([Google](https://support.google.com/webmasters/answer/34592)); оба домена в одном Cloudflare — это минуты. Снимки T-012 тянут два свойства.
- **GA4**: один веб-поток с обоими доменами в cross-domain настройке — Google требует одинаковый ID тега из одного потока ([GA4](https://support.google.com/analytics/answer/10071811)); пользовательское измерение `storefront`.
- **Merchant Center** (T-009): «Separate domains … require a separate merchant account for each domain» ([Google, 2024-09-03](https://developers.google.com/merchant/storebuilder/online/sections/1_20_merchant_center_account)) → два аккаунта или advanced-аккаунт с субаккаунтами; фид у каждой витрины свой, только канонические ссылки.
- **Перекрёстные ссылки** — контекстные (премиум-карточки, ссылка на бутик в подвале). Политика Google запрещает «excessive link exchanges … for the sake of cross-linking» ([spam policies](https://developers.google.com/search/docs/essentials/spam-policies)).
- **`.boutique`** — gTLD; Google обращается с новыми gTLD как с `.com`, ключевое слово в зоне не даёт ни бонуса, ни штрафа ([Google, 2015 (старше 2024)](https://developers.google.com/search/blog/2015/07/googles-handling-of-new-top-level)).
- **Скорость.** Страницы бутика кэшируются (Cache Components: `'use cache'` + `cacheTag`, инвалидация `revalidateTag(tag, "max")` — [Next.js 16](https://nextjs.org/blog/next-16)), после деплоя — прогрев по sitemap. Хабу тоже стоит вернуться от `force-dynamic` к кэшу — это нужно при любом варианте.
- **IndexNow** (T-017) — ключ на каждый домен.
- **Ссылочный вес.** Оба домена зарегистрированы две недели назад — переносить и делить пока нечего. Цена второго домена — в будущем линкбилдинге на два адреса, а не в потерях; это свойство решения «два домена», а не варианта C.

### 3.6 Админка для одного редактора

- Один вход: `divan.group/admin` (2FA — в T-018). Переключатель сайта от плагина: страницы, категории, статьи, проекты, редиректы и настройки витрины видны по выбранному сайту; товары видны всегда, с бейджами витрин.
- Карточка товара: галочки «где показывать», выбор «канонический сайт», флаг «премиум», режим второго сайта (карточка или зеркало). SEO-таб показывает домен и шаблон title канонической витрины.
- Live preview: `admin.livePreview.url` может вернуть абсолютный URL другого домена, Payload это поддерживает ([Payload live preview](https://payloadcms.com/docs/live-preview/overview)). Бутик открывает превью по подписанному короткоживущему токену из URL, а не по cookie админки: cookie `divan.group` на `divan.boutique` не уходят. Safari блокирует сторонние cookie в iframe ([WebKit, 2020 (старше 2024)](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)), поэтому cookie draft mode внутри iframe админки может не держаться — запасной путь «открыть превью в новой вкладке». Бутик разрешает фрейминг только для `divan.group` (CSP `frame-ancestors`).
- Ревалидация видна в админке как джобы (`payload-jobs`) со статусом и ошибкой.
- Медиатека общая, с папками по сайтам.

### 3.7 Медиа и ревалидация кэша между процессами

**Медиа.**

- Цель — Cloudflare R2 через `@payloadcms/storage-s3`: R2 совместим с S3, бакет приватный по умолчанию, раздача через свой домен ([Payload storage adapters](https://payloadcms.com/docs/upload/storage-adapters)); 10 ГБ в месяц бесплатно, исходящий трафик бесплатный ([R2 pricing](https://developers.cloudflare.com/r2/pricing/)). Домен `media.divan.group`, оба лица берут картинки через `next/image` с `remotePatterns` на этот хост; пользователь и Google видят `/_next/image` на своём домене.
- До переезда бутик берёт картинки по **публичному** URL ядра `https://divan.group/api/media/file/**`. С внутреннего адреса нельзя: Next 16 по умолчанию запрещает оптимизацию картинок с локальных IP (`images.dangerouslyAllowLocalIP`, «set to true for private networks only» — [Next.js 16](https://nextjs.org/blog/next-16)).
- Относительные URL медиа из API ядра kit превращает в абсолютные.

**Ревалидация.**

- Теги вместо путей, чтобы ядро не знало URL-схему лиц: `sf:<slug>` (настройки и навигация), `product:<id>`, `products:<sf>`, `category:<id>`, `page:<id>`, `article:<id>`, `project:<id>`, `redirects:<sf>`.
- Хук ядра считает затронутые витрины как **объединение старых и новых** `storefronts`: если товар сняли с бутика, бутик тоже должен сбросить кэш. Хаб получает `revalidateTag` в своём процессе, витрины — джоб `revalidate-storefront`: POST на `revalidateUrl` с HMAC тела и меткой времени, три ретрая с паузой, `jobs.autoRun` по cron внутри процесса ядра.
- Next сам не синхронизирует кэш между процессами: `revalidateTag()` на одном инстансе инвалидирует только его кэш ([Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting)). У нас один контейнер на приложение, поэтому достаточно вебхука; общий cache handler понадобится только при нескольких репликах.
- Страховка: время жизни кэша данных товара не больше часа (потерянный вебхук лечится сам), прогрев по sitemap после деплоя.
- Цена и наличие в кэше могут отставать на секунды; правду проверяет ядро на чекауте, поэтому устаревшая цифра на странице не превращается в неверное списание.

### 3.8 Деплой двух доменов на одном VPS (Dokploy + Traefik)

- Проект Dokploy `divan`: приложение `core` (домены divan.group и www → apex), приложение `boutique` (divan.boutique и www → apex), существующий PostgreSQL. Traefik-роутеры по `Host()`, сертификаты Let's Encrypt — штатно через Dokploy.
- DNS: в Cloudflare A-записи `divan.boutique` и `www` на тот же IP, что у divan.group (116.202.29.144).
- **Сборки уходят с VPS.** По умолчанию у сервера Dokploy очередь сборок с concurrency 1 ([Dokploy](https://docs.dokploy.com/docs/core/concurrent-builds)), а сборка, упёршаяся в память, может намертво занять очередь ([Dokploy #4461](https://github.com/Dokploy/dokploy/issues/4461)). Две сборки Next подряд на небольшом VPS — реальный риск. Поэтому: GitHub Actions (2 000 бесплатных минут в месяц на приватные репозитории — [GitHub](https://docs.github.com/en/billing/concepts/product-billing/github-actions)) → образ в GHCR (хранение образов «currently free» — [GitHub](https://docs.github.com/en/billing/concepts/product-billing/github-packages)) → деплой через API Dokploy (`application.deploy`, ключ в `x-api-key` — [Dokploy API](https://docs.dokploy.com/docs/api/reference-application)) или webhook.
- Заодно снимается ловушка из HISTORY «образ собирается без БД»: витрине база не нужна вообще, а ядро и так собирается без неё.
- Env бутика: `NEXT_PUBLIC_SERVER_URL=https://divan.boutique`, `STOREFRONT=boutique`, `CORE_API_URL` (внутренний), `CORE_PUBLIC_URL=https://divan.group`, `STOREFRONT_API_KEY`, `REVALIDATE_SECRET`, `PREVIEW_SECRET`; токен чтения GitHub Packages — только в секретах Actions.
- Ресурсы: второй Node-процесс ≈150–350 МБ RSS, ядро ≈400–700 МБ (оценка, не измерено). На VPS 4 ГБ при сборках вне сервера хватает с запасом (оценка).
- Бэкапы (T-018) не меняются: база одна; медиа после переезда в R2 — отдельная политика.
- `docs/ops/deployment.md` переписать под Dokploy + Traefik и два приложения.

### 3.9 Миграции без интерактивных промптов

- **Одна цепочка миграций во всей системе** — в ядре. У витрин нет базы, значит нет и миграций. Это главное преимущество C★ перед C1.
- **Прод:** `postgresAdapter({ prodMigrations: migrations })` — Payload сам применяет недостающие миграции при инициализации в production ([Payload migrations](https://payloadcms.com/docs/database/migrations)). Отдельный шаг с контейнером `tools` больше не нужен. `PAYLOAD_DB_PUSH` в проде не ставим никогда; push и миграции на одной базе не смешиваем — Payload сам об этом предупреждает (там же).
- **Где живут промпты.** Интерактивные вопросы «create or rename?» задаёт `migrate:create`, когда в одной области что-то удалено и что-то создано ([payload#14941](https://github.com/payloadcms/payload/issues/14941), закрыт без неинтерактивного режима). Отсюда правило **expand/contract**: (1) добавить новое поле или таблицу; (2) перенести данные SQL-ом в `up()` той же миграции; (3) переключить код; (4) удалить старое **отдельной** миграцией. Чистое добавление и чистое удаление вопросов не вызывают. Переименование «в один шаг» запрещено. Безголовый `/task-run` создаёт только аддитивные миграции, удаления делает человек.
- **CI-страж:** Postgres-сервис → `payload migrate` → `payload migrate:create --skip-empty` (флаг снимает вопрос про пустую миграцию — там же) не должен создать файл → `payload migrate:status`. На джобе таймаут 5 минут: если всплыл вопрос о переименовании, джоб падает, а не висит.
- **Dev:** как только в локальной базе появляются ценные данные — тоже миграции; приём из HISTORY «сбросить локальную базу» остаётся для одноразовых баз.

### 3.10 Как фича, сделанная один раз, доходит до обоих сайтов

Принцип: **логика, данные, API, SEO и аналитика — один раз в ядре и kit; визуальный слой — в каждом лице, сознательно.** Пример — онлайн-оплата (ADR-0010, этап 2):

1. **Ядро:** заказы по решению T-049 (плагин целиком, частично или свои), Stripe PaymentIntent с `metadata.storefront`, один эндпоинт вебхука Stripe на все витрины, расчёт доставки по зонам T-046, скидка зарегистрированным (T-047), письма с брендом витрины (T-039).
2. **API:** `POST /api/v1/sf/checkout`, `GET /api/v1/sf/delivery-quote` — версионированные, zod-схемы в `@divan/contracts`.
3. **Kit:** серверные хелперы и безголовые хуки (`useCart`, `useCheckout`, обёртка Payment Element с `appearance` от лица).
4. **Лицо:** только вёрстка и стили страницы оплаты.
5. **Stripe:** один аккаунт; каждый домен с Payment Element регистрируется для Apple Pay, Google Pay и Link («register every web domain» — [Stripe](https://docs.stripe.com/payments/payment-methods/pmd-registration)).
6. **Выкатка:** ядро с обратно-совместимым API → минорная версия kit → PR Dependabot в бутике ([GitHub](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/configuring-access-to-private-registries-for-dependabot)) → деплой бутика.

Так же доезжают образцы тканей (T-045), курьер с демо-материалами (тип заявки рядом с образцами), чертежи (поле товара + компонент лица), проекты, скидки, корзина и возвраты (T-048).

Чего «один раз» **не** покрывает: экран каждой фичи в каждом лице. Оценка — +30–50% трудоёмкости фичи на каждое дополнительное лицо.

**MVP бутика без корзины.** Премиум под заказ продаётся через консультацию, а этап оплаты всё равно ждёт юридической готовности (ADR-0010). Поэтому бутик стартует как лукбук + проекты + заявки, образцы и курьер; корзина приходит в kit вместе с этапом оплаты, а не дублируется раньше времени.

### 3.11 Третий сайт, форк, скрипт-скелет

- **Скрипт** `node scripts/new-site.mjs --slug <s> --domain <d> --brand <b> --locales es,en`:
  1. создаёт документ витрины и API-ключ в ядре через `payload run`;
  2. создаёт приватный репозиторий из `templates/storefront` (`gh repo create`), заполняет `.env.example`;
  3. создаёт приложение и домен в Dokploy через API (`application.create`, `domain.create` — [Dokploy API](https://docs.dokploy.com/docs/api/reference-application));
  4. печатает ручной чеклист: A-запись в Cloudflare, TXT для Search Console, домен в Stripe, домен в GA4, ключ IndexNow.
- **Тот же лицом, другой бренд** — не новый репозиторий, а второй деплой существующего репозитория витрины с другим `STOREFRONT`.
- **Полная независимость** (продажа, партнёр) — разовый форк ядра + выгрузка данных витрины (C1 как выход, а не как образ жизни).
- **Вынос divan.group из ядра:** `apps/web` делится на `apps/cms` (админка + API, хост `cms.divan.group`) и репозиторий `divan-group` из шаблона. Механически, потому что kit уже обкатан бутиком. Триггер — третий сайт или новое лицо divan.group.
- **Чтобы шаблон не сгнил,** CI ядра на каждом PR собирает `templates/storefront` против локального kit.

### 3.12 Стоимость поддержки для соло-разработчика

| Статья                                                                                 | Сколько (оценка)                 |
| -------------------------------------------------------------------------------------- | -------------------------------- |
| PR Dependabot (Next, React, kit) в каждом репозитории витрины: ревью, мёрдж, деплой    | 1–2 ч/мес на витрину             |
| Срочные патчи уровня React2Shell (CVSS 10) — в тот же день в каждом приложении на Next | ≈1 ч на приложение за инцидент   |
| Релиз kit на каждую фичу, затрагивающую оба лица                                       | +0,5–1 ч на фичу                 |
| Контрактные тесты, CI, шаблон                                                          | ≈1–2 ч/мес                       |
| Обновления Payload (включая будущий 4.0)                                               | только в ядре — как сейчас       |
| **Итого сверх одного приложения**                                                      | **+3–6 ч/мес на каждую витрину** |

Для масштаба: бюджет человеческого времени на маркет-операции в `docs/ops/capacity.md` — 8–10 ч/нед. Ещё одна витрина съедает 10–15% такого месяца (оценка).

## 4. План перехода

Шкала: **S** ≤ 1 дня, **M** 2–4 дня, **L** 5–10 дней (оценка, соло-разработчик с агентами). T-ID — уже стоящие в очереди задачи, их не дублирую.

| #   | Шаг                                                                                                                                                                                                                                    | Усилие | Связь                             |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------------------------- |
| 1   | ADR-0011 «Две витрины: ядро + витрины в отдельных репозиториях» + ответы владельца (§8)                                                                                                                                                | S      | после T-004 (es по умолчанию)     |
| 2   | Модель витрин в ядре, expand-миграция: `storefronts` + seed `group`/`boutique`; поля витрин в products/categories/pages/articles/redirects/лидах; составные индексы слагов; бэкфилл всего существующего в `group` SQL-ом внутри `up()` | M      | согласовать с T-008, T-005        |
| 3   | Глобалы header/footer/site-settings → документ витрины (копия в миграции, удаление отдельной миграцией); `generateTitle`/`generateURL` plugin-seo от витрины; переключатель сайта (plugin-multi-tenant)                                | M      |                                   |
| 4   | Скоупинг хаба: все запросы divan.group с фильтром `storefront=group` (entities, sitemap, OG, будущий фид) + интеграционный тест «нет чужих канонических документов в sitemap»                                                          | M      | T-009                             |
| 5   | SEO-страж: хук уникальности meta; `scripts/seo/cross-site-audit.mjs` (сначала строка в `docs/ops/crons.md`); закрепление кластеров query-portfolio за витринами                                                                        | S      | ADR-0008                          |
| 6   | Миграции без промптов: `prodMigrations`, CI-страж миграций, правило expand/contract в CLAUDE.md и HISTORY                                                                                                                              | S      |                                   |
| 7   | API ядра для витрин: `storefront-clients` (API-ключи), access по витрине и `_status`, `/api/v1/sf/*` (заявки, образцы, курьер), джоб `revalidate-storefront` с HMAC и ретраями                                                         | M      | поверх T-005, T-045, T-034 (jobs) |
| 8   | Пакеты `@divan/contracts` и `@divan/storefront-kit`: SEO-модуль переезжает из `modules/shared/seo`, хаб сам их потребляет; публикация в GitHub Packages из Actions по тегу                                                             | L      |                                   |
| 9   | `templates/storefront`: безголовый Next 16 (Cache Components, proxy локалей, sitemap/robots/OG через kit, `/api/revalidate`, `/next/preview`, Dockerfile, CI, CLAUDE.md), сборка в CI ядра                                             | M      |                                   |
| 10  | CI/CD: Actions → GHCR → деплой Dokploy по API для ядра и витрин; переписать `docs/ops/deployment.md`                                                                                                                                   | M      | T-018                             |
| 11  | Медиа в R2 через `@payloadcms/storage-s3`, домен `media.divan.group`, перенос файлов из тома                                                                                                                                           | M      | T-018 (бэкапы медиа)              |
| 12  | Репозиторий бутика из шаблона + его дизайн-система по выбранному направлению; главная, плоские категории, товар, проекты/лукбук, о бренде, юр., контакты; `allowIndexing=false` до готовности                                          | L      | T-048 (юр.), T-045                |
| 13  | Превью через домены: подписанный токен, `livePreview.url` канонической витрины, CSP `frame-ancestors`, запасной путь «новая вкладка»                                                                                                   | M      |                                   |
| 14  | Запуск бутика: приложение и домен в Dokploy, A-запись, Domain property в GSC + sitemap, GA4 cross-domain + измерение `storefront`, ключ IndexNow, открыть индексацию                                                                   | S      | T-012, T-017, T-006               |
| 15  | Агентный процесс на нескольких репозиториях: поле `repo:` в задачах, `/task-run` переключается в нужный репозиторий, CLAUDE.md витрины; Dependabot-бампы kit                                                                           | M      | T-018 (renovate)                  |
| 16  | Позже, по триггеру: `scripts/new-site.mjs` и вынос divan.group в витрину (`apps/web` → `apps/cms`)                                                                                                                                     | L      |                                   |

**Итого до запуска бутика (шаги 1–15):** ≈45–50 человеко-дней (оценка). Из них:

- шаги 1–6, 11, 12, 14 (≈25 дней) нужны при любом варианте: модель витрин, SEO-стражи, миграции, само лицо бутика, запуск;
- ≈20–25 дней — накладные именно варианта C: API для витрин, kit и публикация, шаблон, превью через домены, мультирепо-процесс, часть CI/CD.

**Минимальный путь** (без R2 — картинки по публичному URL ядра, мультирепо-раннер вручную, kit без коммерции, бутик = лукбук + заявки): ≈30–35 дней (оценка).

## 5. Слабые места (честно)

1. **Самый дорогой старт.** ≈20–25 человеко-дней накладных до первого запуска бутика (оценка) — время, которое не идёт в первые продажи.
2. **«Один раз» — только для логики.** Каждый экран каждой фичи (корзина, оплата, образцы, кабинет) верстается в каждом лице: +30–50% трудоёмкости фичи на лицо (оценка).
3. **Рассинхрон версий.** Ядро, `contracts` и kit живут в разных темпах; ломающее изменение API требует версионирования (`/v1/`) и скоординированных релизов.
4. **N приложений на Next — N срочных патчей.** React2Shell (CVSS 10, декабрь 2025) потребовал патча в тот же день в каждом приложении ([Google Cloud TI](https://cloud.google.com/blog/topics/threat-intelligence/threat-actors-exploit-react2shell-cve-2025-55182)). Payload, правда, только в ядре.
5. **Сетевой прыжок и кэш.** Холодный кэш бутика — это запросы в ядро и хуже TTFB; вебхуки ревалидации могут теряться (лечится ретраями, TTL и прогревом, но это движущиеся части). Если ядро лежит, бутик отдаёт только закэшированное.
6. **Превью через домены хрупкое.** Сторонние cookie в Safari блокируются, превью в iframe может не держать draft mode; запасной путь — новая вкладка.
7. **Разработка неудобнее.** Чтобы работать над бутиком, локально нужно поднятое ядро (или стейджинг). Задача, затрагивающая ядро и витрину, — это две ветки и два PR.
8. **Агентный процесс фрагментируется.** `/task-run`, `docs/features`, HISTORY рассчитаны на один репозиторий; нужна доработка (поле `repo:`), иначе знание о витринах начнёт дрейфовать.
9. **Мечта «форк + мёрджи апстрима» не сбывается** после первой копии — владельцу придётся принять «сгенерировать один раз, дальше пакеты».
10. **Дубли и doorway C не решает сам по себе.** Их решают модель данных, стражи и аудит — то же самое нужно в любом варианте.
11. **Приватные пакеты = секреты в сборке.** Токен GitHub Packages нужен в Actions и Docker build; бесплатно 500 МБ хранения и 1 ГБ трафика в месяц на приватные пакеты ([GitHub](https://docs.github.com/en/billing/concepts/product-billing/github-packages)). Альтернатива — публиковать kit публично (в нём нет секретов и бизнес-логики).
12. **Два процесса Node на одном VPS** и зависимость от общей сети Dokploy, которую в будущем могут изолировать по проектам ([Dokploy #4637](https://github.com/Dokploy/dokploy/issues/4637)) — тогда внутренний адрес ядра придётся явно подключать к сети бутика.
13. **plugin-multi-tenant с `hasMany`** работает в рантайме, но не описан в документации; при обновлении плагина возможны сюрпризы (уже был баг bulk-edit, [payload#15145](https://github.com/payloadcms/payload/issues/15145)). Запасной вариант — своё поле `storefronts` и фильтры списков без плагина.
14. **`@payloadcms/sdk` в бете** («may be subject to change in minor versions» — [Payload](https://payloadcms.com/docs/rest-api/overview)); kit изолирует его за своим интерфейсом, чтобы при необходимости заменить тонким fetch-клиентом.

## 6. Когда C — правильный выбор, а когда нет

**Выбирать C★, если:**

- лицо бутика действительно другое: другая навигация, другая URL-схема, тяжёлые анимации, другой ритм релизов;
- в горизонте года реальны третий и четвёртый сайт (владелец говорит о скрипте-скелете);
- важна изоляция отказов: эксперимент на бутике не должен уронить магазин;
- допустимо, что бутик выйдет через ≈1,5–2,5 месяца работы, а не раньше (оценка).

**Не выбирать C, если:**

- бутик — это «тот же магазин в чёрно-белой палитре с меньшим каталогом»: тогда это тема и набор маршрутов в одном приложении, а C — переплата;
- соло-разработчику важнее всего скорость до первой продажи на divan.group в ближайшие 4–8 недель.

Компромисс, который сохраняет путь C: шаги 1–6 (модель витрин, SEO-стражи, миграции) нужны при любом варианте и делаются в ядре сейчас. Решение «отдельный репозиторий или нет» можно принять в момент, когда дизайн-направление бутика выбрано и видно, насколько оно расходится с магазином.

## 7. Связь с очередью задач

Не дублирую, а опираюсь:

- **T-004** — es по умолчанию до запуска бутика (`defaultLocale` витрины, `x-default`).
- **T-005** — лиды получают `storefront`.
- **T-006** — контракт `dataLayer` переезжает в kit.
- **T-008** — новые поля товара идут как в очереди, плюс поля витрин.
- **T-009** — фид на каждую витрину, отдельные аккаунты Merchant Center.
- **T-011** — городские страницы только на divan.group.
- **T-012** — снимки по двум свойствам GSC.
- **T-014** — юрстраницы на каждой витрине.
- **T-017** — IndexNow-ключ на домен.
- **T-018** — бэкапы, аптайм, renovate распространяются на второе приложение.
- **T-034** — инфраструктура jobs, которую использует ревалидация.
- **T-039** — SPF/DKIM и шаблоны писем для домена бутика.
- **T-044** — лицо магазина.
- **T-045 / T-046 / T-047** — образцы, доставка и кабинет живут в ядре и доезжают до обоих лиц.
- **T-048** — юридический контур для обоих доменов.
- **T-049** — решение по заказам в ядре.
- **T-050** — комплекты на divan.group.
- **T-051** — AR-кандидаты среди флагманов бутика.

## 8. Вопросы владельцу

1. Точное имя и домен бутика: `divan.boutique` (зарегистрирован 2026-09-23 в том же Cloudflare, судя по NS) — это он? Как называется бренд?
2. «Подкатегории, не больше» — это плоский список категорий (один уровень) у бутика?
3. Премиум продаётся только в бутике или и на divan.group тоже (тогда режим «карточка» или «зеркало»)?
4. Бутику нужна корзина с первого дня или старт как лукбук + заявки + образцы + курьер?
5. Бутик на всех четырёх языках сразу или es + ru + en, а uk позже?

## 9. Что не удалось проверить

- Принадлежность `divan.boutique` владельцу: RDAP скрывает регистранта; вывод сделан по регистратору, дате и паре NS.
- Как Payload live preview в iframe ведёт себя в Safari именно в нашей связке (cookie draft mode на другом сайте) — не тестировал; вывод по общей политике WebKit (2020).
- Точное имя внутреннего хоста приложения в сети Dokploy (по `appName`) — документацию по адресации не нашёл; общая сеть подтверждена issue #4637.
- Позволяет ли `@payloadcms/sdk` передавать опции fetch для тегов кэша Next — не проверял; в дизайне вызовы оборачиваются `'use cache'` + `cacheTag` на уровне функций kit.
- Типы `hasMany` в plugin-multi-tenant: рантайм поддерживает, TS-типы `SingleRelationshipField`, вероятно, потребуют приведения — не собирал.
- Потребление памяти двумя процессами и размер VPS — не измерял (оценка). Размер текущего VPS в репозитории не записан.
- Стоимость Dependabot и Renovate для приватных репозиториев отдельно не проверял; конфигурация реестра GitHub Packages для Dependabot подтверждена документацией.
- Прод на Dokploy + Traefik — со слов брифа; снаружи косвенно (нет `Server: Caddy`), в репозитории это не задокументировано.

## 10. Источники

Код и данные проекта: `apps/web/src/proxy.ts`, `apps/web/src/payload.config.ts`, `apps/web/src/payload/**`, `apps/web/src/app/**`, `apps/web/next.config.ts`, `apps/web/Dockerfile`, `docker-compose.prod.yml`, `docs/ops/deployment.md`, `docs/HISTORY.md`, `docs/features/*`, `docs/decisions/*`, `tasks/TASKS.md`, `docs/strategy/business-model.md`, `docs/product/supply-and-delivery.md`, `research/market/2026-09-30/*`; curl/nslookup/RDAP 2026-10-05.

**Next.js**

- [Next.js 16](https://nextjs.org/blog/next-16) — 2025-10-21.
- [Self-hosting](https://nextjs.org/docs/app/guides/self-hosting).
- [Multi-tenant guide](https://nextjs.org/docs/app/guides/multi-tenant).

**Payload**

- [Migrations](https://payloadcms.com/docs/database/migrations).
- [API keys](https://payloadcms.com/docs/authentication/api-keys).
- [REST API и SDK](https://payloadcms.com/docs/rest-api/overview).
- [Multi-tenant plugin](https://payloadcms.com/docs/plugins/multi-tenant).
- [Storage adapters](https://payloadcms.com/docs/upload/storage-adapters).
- [Live preview](https://payloadcms.com/docs/live-preview/overview).
- [Security update 2026-09-18](https://payloadcms.com/posts/blog/payload-security-update-available-for-3x-and-40).
- [Issue #14941](https://github.com/payloadcms/payload/issues/14941).
- [Issue #15145](https://github.com/payloadcms/payload/issues/15145).

**Google**

- [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies).
- [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization).
- [Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- [Cross-domain duplication, 2009 (старше 2024)](https://developers.google.com/search/blog/2009/12/handling-legitimate-cross-domain).
- [New gTLDs, 2015 (старше 2024)](https://developers.google.com/search/blog/2015/07/googles-handling-of-new-top-level).
- [Site names](https://developers.google.com/search/docs/appearance/site-names).
- [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization).
- [hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions).
- [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- [Search Console: добавить свойство](https://support.google.com/webmasters/answer/34592).
- [GA4 cross-domain](https://support.google.com/analytics/answer/10071811).
- [Merchant Center: структура аккаунтов](https://developers.google.com/merchant/storebuilder/online/sections/1_20_merchant_center_account).

**Инфраструктура**

- [Dokploy concurrent builds](https://docs.dokploy.com/docs/core/concurrent-builds).
- [Dokploy API](https://docs.dokploy.com/docs/api/reference-application).
- [Dokploy #4637](https://github.com/Dokploy/dokploy/issues/4637).
- [Dokploy #4461](https://github.com/Dokploy/dokploy/issues/4461).
- [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
- [GitHub Packages billing](https://docs.github.com/en/billing/concepts/product-billing/github-packages).
- [Dependabot private registries](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/configuring-access-to-private-registries-for-dependabot).
- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/).
- [Cloudflare nameserver assignment](https://developers.cloudflare.com/dns/zone-setups/reference/nameserver-assignment/).
- [Stripe payment method domains](https://docs.stripe.com/payments/payment-methods/pmd-registration).

**Безопасность**

- [Google Cloud TI: React2Shell](https://cloud.google.com/blog/topics/threat-intelligence/threat-actors-exploit-react2shell-cve-2025-55182).
- [Tenable FAQ](https://www.tenable.com/blog/react2shell-cve-2025-55182-react-server-components-rce).
- [WebKit: full third-party cookie blocking, 2020 (старше 2024)](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/).
