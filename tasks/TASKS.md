# Task queue

Формат и правила: [README.md](./README.md). Раннер берёт первую задачу из **Queue** со `status: ready`. Контекст задач: [docs/strategy/operating-model.md](../docs/strategy/operating-model.md), решения в [docs/decisions](../docs/decisions/README.md).

Владельцу (не для раннера): заполнить `docs/strategy/targets.md`, `research/seo/competitors.md` (секция Market), запустить нейминг-спринт (T-010), завести бизнес-аккаунт Google и GBP сразу после выбора названия.

## Queue

### T-004 · Дефолтная локаль es (ADR-0001)

- status: ready
- priority: high
- area: seo
- source: chat
- created: 2026-09-21
- estimate: S

`DEFAULT_LOCALE = "es"`, порядок `LOCALES = ["es", "en", "ru", "uk"]`, x-default → es. Проверить `proxy.ts`, `alternates`, sitemap, Payload `localization.defaultLocale`, словари не трогать. Обновить CLAUDE.md и README (упоминания «ru (default)»).

Acceptance:

- `curl -I /` редиректит на `/es`; hreflang x-default указывает на `/es/...`
- `pnpm web generate`, typecheck, lint зелёные
- ADR-0001 остаётся accepted, в README decisions проставлена дата выполнения

### T-002 · Страница «Контакты» с формой заявки

- status: ready
- priority: high
- area: cms
- source: chat
- created: 2026-09-21
- estimate: M

CMS-страница `contacts` из блоков: hero (low impact) с адресом и телефоном из Site Settings, блок `formBlock` с формой «Заявка» (имя, телефон, WhatsApp-согласие, сообщение). Кнопка «Узнать цену и сроки» на товаре ведёт на `/{locale}/contacts#form`, `tel:` остаётся как второй CTA.

Acceptance:

- есть скрипт `pnpm web seed:contacts`, создающий форму и страницу на 4 локалях, либо инструкция в docs
- `ROUTES.contacts(locale)` добавлен и используется в product-page и header
- тексты формы во всех 4 локалях в словарях
- `pnpm typecheck && pnpm lint` зелёные

### T-005 · Коллекция leads: согласия, UTM, антиспам, авто-подтверждение (ADR-0004)

- status: ready
- priority: high
- area: cms
- source: seo-research
- created: 2026-09-21
- estimate: L

Разбить на: T-005a `formSubmissionOverrides` → коллекция `leads` с полями locale, channel, utm_*, gclid, product_slug, page_url, source_code, consentAt, consentText, consentEmail, consentWhatsApp, ip, ga_client_id, b24LeadId, syncStatus, syncError; hidden-поля на фронте из cookie первого визита. T-005b Cloudflare Turnstile + honeypot + rate limit по IP в форме и route. T-005c авто-подтверждение на языке лида через Resend/Brevo (шаблоны из `docs/marketing/leads-and-crm.md`) и Telegram-уведомление без ПД. T-005d хук `afterChange` → Bitrix24 `crm.item.add` с `originatorId='payload'` + `scripts/lead-sync-retry.mjs` (B24 webhook URL из `.env.automation`, работает только если задан).

Acceptance:

- отправка формы создаёт запись `leads` со всеми полями и согласиями; спам-запрос отклоняется
- письмо-подтверждение уходит ≤60 с на языке лида; в Telegram только id/имя/источник
- при заданном `B24_WEBHOOK_URL` лид появляется в B24, при ошибке `syncStatus=pending` и ретрай

### T-006 · Кнопка WhatsApp с кодом источника + события GA4

- status: ready
- priority: high
- area: ui
- source: seo-research
- created: 2026-09-21
- estimate: M

Компонент `WhatsAppButton` (features/whatsapp-contact): `wa.me/{phone}?text=` локализованная фраза + `[{locale}-{page}-{productSlug}]`; телефон из Site Settings. `dataLayer.push` для `click_whatsapp`, `click_phone`, `click_directions`, `showroom_visit_request`, `view_item` (спецификация `docs/analytics-events.md` создаётся в этой задаче). Кнопка на всех страницах (плавающая) и в карточке товара.

Acceptance:

- `docs/analytics-events.md` с таблицей событий и параметров
- события уходят в `window.dataLayer`, GTM-контейнер не встраивается (человек ставит через `NEXT_PUBLIC_GTM_ID`, опционально)
- тексты в словарях на 4 локалях

### T-007 · Страница шоурума + JSON-LD FurnitureStore + areaServed

- status: ready
- priority: high
- area: seo
- source: seo-research
- created: 2026-09-21
- estimate: M

Site Settings расширить: адрес (street, postalCode, city), geo (lat/lng), openingHours, mapsUrl, sameAs[]. Страница `/{locale}/showroom` (slug по локали из ROUTES: es `tienda-de-sofas-alicante`, en `sofa-shop-alicante`, ru `showroom-alikante`, uk `showroom-alikante`) с картой (ссылка/iframe без cookie до согласия), часами, фото, FAQ-блоком, CTA WhatsApp/маршрут. JSON-LD `FurnitureStore` с `@id`, areaServed (список городов из `docs/marketing/local-seo.md`), hasMap, sameAs; на товарах `Offer.availableAtOrFrom` → `@id`.

Acceptance:

- Rich Results Test валиден для FurnitureStore и Product
- одна `@id` на всех локалях, hreflang на страницу
- ссылка на шоурум в header/footer

### T-003 · FAQ-блок для страниц (SEO: FAQPage schema)

- status: ready
- priority: high
- area: seo
- source: chat
- created: 2026-09-21
- estimate: M

Блок `faq` (массив вопрос/ответ, localized) в конструкторе страниц и компонент с `<details>` и JSON-LD `FAQPage`. GBP Q&A закрыт, Ask Maps читает сайт, поэтому FAQ на сайте — замена.

Acceptance:

- `payload/blocks/faq.ts` + `widgets/page-blocks/ui/faq-block.tsx`, зарегистрирован в `render-blocks.tsx` и в `pages` layout
- JSON-LD FAQPage валиден
- `pnpm web generate` выполнен

### T-008 · Категории кластера B и поля товара для фильтров и Merchant

- status: ready
- priority: high
- area: cms
- source: seo-research
- created: 2026-09-21
- estimate: M

Products: добавить `plazas` (число мест), `sku`, `condition` (new/outlet), `brand`, `gtin` (опц.), `leadTimeDays`, `fabrics[]` (свотчи: название, image, aquaclean bool), `dimensionsImage`. Categories: поле `synonyms` (localized текст для описания: cheslong/cheslón/chaiselongue) и `metaTemplate`. Seed категорий из `docs/marketing/query-portfolio.md` (chaise-longue, rinconeras, sofa-cama, sofas-relax, modulares, sofas-piel, sofas-3-plazas, sofas-2-plazas, sillones-relax) с локализованными title/description и slug по локали? Нет: slug общий (ADR: slugs не локализуются), заголовки локализованы.

Acceptance:

- `pnpm web seed:categories` создаёт 9 категорий на 4 локалях
- карточка товара показывает размеры, места, ткани, срок поставки
- JSON-LD Product содержит sku, brand, itemCondition, offers.availability

### T-009 · Фид товаров для Merchant Center и Meta Commerce

- status: ready
- priority: high
- area: seo
- source: seo-research
- created: 2026-09-21
- estimate: M

Route `/api/feeds/products.xml?locale=es&profile=google` и `.csv?profile=meta` из Products: id, title, description, link (ROUTES.product), image_link + additional_image_link, price с IVA «EUR», availability, condition, brand, identifier_exists=false при отсутствии gtin, product_type (категория), custom_label_0 = hero. Кэш 1 ч, ревалидация хуком.

Acceptance:

- фид валиден по спецификации Merchant (проверить XML-схему RSS 2.0 + g:), пример в docs
- 4 локали × 2 профиля
- документ `docs/marketing/google-stack.md` дополнен URL фида

### T-010 · Нейминг-спринт: генерация кандидатов и скрипт проверки

- status: ready
- priority: high
- area: content
- source: seo-research
- created: 2026-09-21
- estimate: M

Скилл `.claude/skills/naming/SKILL.md` по `docs/marketing/launch-checklist.md` §1 и скрипт `scripts/check-name.mjs` (RDAP .es/.com/.eu, HTTP-проверка хендлов instagram/tiktok/youtube/facebook, ссылки для ручной проверки OEPM/EUIPO/TMview кл. 20/35, попытка TMview API). Прогнать: 50 кандидатов по 4 стратегиям → матрица → шортлист 5 в `research/naming/candidates.md` с обоснованием произносимости на es/en/ru/uk.

Acceptance:

- `node scripts/check-name.mjs <name>` печатает таблицу доступности
- `research/naming/candidates.md` с 50 кандидатами, оценками и шортлистом 5
- Telegram-сводка владельцу для опроса

### T-011 · Коллекция Locations и городские страницы (ADR-0002)

- status: ready
- priority: high
- area: seo
- source: seo-research
- created: 2026-09-21
- estimate: L

Разбить: T-011a коллекция `locations` (city, slugs по локали через поле slug localized? нет — 4 поля slugEs/slugEn/slugRu/slugUk, deliveryDays, deliveryPrice, assemblyIncluded, distanceKm, faq[], gallery[], featuredProducts[], reviews[] позже), `ROUTES.location`, страница, sitemap, hreflang, JSON-LD (FurnitureStore areaServed + BreadcrumbList). T-011b seed 6 городов с плейсхолдерами данных доставки и пометкой «не публиковать без уникального контента» (draft).

Acceptance:

- `/es/sofas-en-torrevieja`, `/en/sofas-torrevieja`, `/ru/divany-torrevieha`, `/uk/dyvany-torrevieha` рендерятся из одной записи
- блоки «тип + город» ссылаются на категории
- страницы в статусе draft не попадают в sitemap

### T-012 · Скрипт сбора метрик collect-all + targets.json

- status: ready
- priority: high
- area: infra
- source: seo-research
- created: 2026-09-21
- estimate: L

Разбить: T-012a `config/metrics/targets.json` из `docs/marketing/query-portfolio.md` (ядро запросов) + `scripts/metrics/collect-all.mjs` оркестратор с `_manifest.json` и graceful skip источников без ключей. T-012b `gsc-snapshot.mjs` (день T-3, 3 среза, пагинация). T-012c `ga4-snapshot.mjs`. T-012d `cwv-snapshot.mjs` (CrUX + PSI fallback). T-012e `clarity-snapshot.mjs`, `index-check.mjs`. Все через `googleapis`, service account из `.env.automation`, read-only scopes. Регистрация в `install-schedule.ps1` (06:00) и строка в `docs/ops/crons.md`.

Acceptance:

- без ключей скрипт завершается с понятным сообщением и exit 0, с ключами пишет JSON в `data/metrics/<source>/daily/`
- `_manifest.json` обновляется; `metrics-healthcheck` в том же скрипте шлёт Telegram при пропуске >2 дней

### T-013 · Скилл /weekly-growth-review

- status: ready
- priority: high
- area: dx
- source: seo-research
- created: 2026-09-21
- estimate: M

`.claude/skills/weekly-growth-review/SKILL.md` по `docs/ops/crons.md`: читает `data/metrics/*`, `targets.json`, `research/feedback/`, `tasks/reports/`; пишет `reports/weekly/YYYY-Www.md`, обновляет `docs/kpi/dashboard.md`, кладёт 3–5 draft-задач с ICE (добавить поле `ice:` в формат задачи в tasks/README.md), Telegram-свод. Регистрация пн 07:30.

Acceptance:

- прогон на пустых данных даёт корректный отчёт «данных нет, что подключить»
- формат задачи в README расширен полем ICE

### T-014 · Юридические страницы и CMP-интеграция

- status: ready
- priority: high
- area: cms
- source: seo-research
- created: 2026-09-21
- estimate: L

Разбить: T-014a страницы Aviso legal, Política de privacidad, Política de cookies, Envíos/devoluciones/garantía, Condiciones (этап 1 — лидген) как CMS-страницы seed на 4 локалях с плейсхолдерами реквизитов из Site Settings (razón social, NIF, Registro Mercantil — добавить поля) и оговоркой «prevalece la versión en español»; ссылки в футере. T-014b CMP: слот для сертифицированного CMP через `NEXT_PUBLIC_CMP_*` (Cookiebot/CookieYes), Consent Mode v2 default denied, GA4/Clarity/Pixel только после согласия; ссылка «Cookies» в футере. T-014c «IVA incluido» рядом с ценой, `price_history` коллекция + хук + `scripts/price-anterior-guard.mjs`.

Acceptance:

- 5 юр-страниц на 4 локалях доступны из футера
- до согласия ни один аналитический тег не грузится (проверка в headless)
- зачёркнутая цена показывается только при `oldPrice ≥ min(price за 30 дней)`

### T-015 · Скилл /daily-ops и шаблоны ответов

- status: draft
- priority: medium
- area: dx
- source: seo-research
- created: 2026-09-21
- estimate: M

Черновики ответов на новые лиды/отзывы на языке автора, пост GBP по расписанию, дайджест SLA. Ждёт T-005 и решения по Bitrix24 (Free vs Basic, REST).

Questions:

- есть ли партнёрский NFR-портал Bitrix24; работает ли REST на Free (проверить на тестовом портале bitrix24.eu)

### T-016 · Контент-операции: content-plan, editorial-policy, бриф, скилл /content-brief

- status: ready
- priority: medium
- area: content
- source: seo-research
- created: 2026-09-21
- estimate: M

`docs/content/content-plan.md` (очередь тем кластера F из query-portfolio, 12 недель), `docs/content/editorial-policy.md` (E-E-A-T: автор-владелец, свои фото, «как мы проверяем», answer-first абзацы, llms.txt), `content/briefs/_template.md`, скилл `.claude/skills/content-brief/SKILL.md` (бриф → черновик CMS-страницы draft в блоке content + faq). Коллекция `posts`/раздел `/{locale}/blog` — если нужен отдельный тип, добавить `articles` с полями author, publishedAt, category, hero image, layout; иначе использовать pages с тегом blog. Решение зафиксировать ADR-0009.

Acceptance:

- первая статья «cómo elegir sofá» создана как draft на es
- `/es/blog` список и `/es/blog/{slug}` рендерятся, sitemap включает
- `public/llms.txt` сгенерирован

### T-017 · IndexNow-хук и Bing/Yandex

- status: ready
- priority: low
- area: seo
- source: seo-research
- created: 2026-09-21
- estimate: S

Хук afterChange для products/pages/locations: пинг IndexNow (ключ из env) при публикации; файл ключа в public. Документация подключения Bing Webmaster и Yandex Webmaster в google-stack.md.

Acceptance:

- публикация товара шлёт IndexNow при заданном `INDEXNOW_KEY`, молча пропускает без ключа

### T-018 · Инфраструктура: хостинг ADR, бэкапы, аптайм, антиспам-домен

- status: draft
- priority: high
- area: infra
- source: seo-research
- created: 2026-09-21
- estimate: M

ADR-0010 хостинг (Vercel+Neon/S3 vs VPS+Docker), скрипт ночного `pg_dump` + синк `public/media` в B2/S3, UptimeRobot, 2FA на /admin, renovate. Нужны решения владельца.

Questions:

- где хостим; есть ли S3/B2; домен

### T-019 · Feedback-хранилище и плейбуки

- status: ready
- priority: medium
- area: content
- source: seo-research
- created: 2026-09-21
- estimate: S

`research/feedback/README.md` с форматом записи (дата, источник, язык, сегмент, модель, тема, цитата), `docs/playbooks/weekly-growth-review.md` (повестка 45 мин), `usability-test.md` (5 человек, 3 сценария), `jtbd-interview.md` (switch-интервью), `review-reply.md` (шаблоны ответов на отзывы es/en/ru/uk), `docs/experiments/log.md`.

Acceptance:

- файлы существуют, ссылки из operating-model.md работают

### T-020 · Скилл /social-pack и Pinterest-публикатор

- status: draft
- priority: medium
- area: content
- source: seo-research
- created: 2026-09-21
- estimate: M

Ждёт фото/бренд. `scripts/pinterest-publish.mjs` через Pinterest API, `content/social/` формат, скилл. Включается в фазе 1.

### T-021 · Партнёрская страница и коллекция partners

- status: draft
- priority: medium
- area: cms
- source: seo-research
- created: 2026-09-21
- estimate: M

`/en/partners-real-estate` + es, коллекция `partners` (тип, контакт, промокод, статус), поле `referrer` в leads. Ждёт решения о комиссии (5–8% или купон) и юр. оформления.

### T-001 · Заполнить competitors.md и targets.md (владелец)

- status: draft
- priority: high
- area: seo
- source: chat
- created: 2026-09-21
- estimate: S

Конкуренты предзаполнены из ресёрча; владелец уточняет рынок, сегмент, hero-модели и цели в `docs/strategy/targets.md`.

Acceptance:

- секции Market в competitors.md и таблица hero-моделей в targets.md заполнены
- статус переведён в done вручную

## In progress

## Done
