# Google-стек: подключение и автоматизация

Источник: `research/market/2026-09-21/google-stack.md`. Всё бесплатно. Три вещи блокируют остальное и требуют человека: домен и название, один Google Cloud проект с service account, сертифицированный CMP с Consent Mode v2.

## Шаги для человека (один раз)

1. **Бизнес-аккаунт Google** (не личный Gmail). На нём: GBP, Cloud-проект, Merchant Center, Ads, Sheets.
2. **Google Cloud проект** → включить API: `searchconsole`, `analyticsdata`, `chromeuxreport`, `pagespeedonline`, `merchantapi`, `businessprofileperformance`, `mybusinessbusinessinformation`, `googleads`, `sheets` → service account → JSON-ключ в `.env.automation` (`GOOGLE_APPLICATION_CREDENTIALS`) → API key для CrUX/PSI.
3. **GBP шоурума**: создать в день, когда есть вывеска с финальным названием (видеоверификация). Таймер 60 дней до заявки на Basic API Access. См. [local-seo.md](./local-seo.md).
4. **Search Console**: Domain property (DNS TXT), добавить email service account с правом Full. Одной property хватает, разрез по языкам — фильтр `page contains /es/`.
5. **GA4**: property, service account как Viewer; связать с GSC и Ads.
6. **GTM web-контейнер**: CMP (Cookiebot/CookieYes/Usercentrics) с `consent default denied` для ЕС, GA4, Clarity, Pixel. Проверить в Tag Assistant, что до согласия теги шлют только cookieless pings. Server-side GTM отложить до >100 лидов/мес.
7. **Merchant Center**: верификация магазина, настройки доставки и возврата (обязательны для Испании), привязка к GBP, источник данных — scheduled fetch фида `/api/feeds/products.xml`. Для мебели без GTIN — `identifier_exists=false`. Content API закрыт с 18.08.2026, статусы читаем через Merchant API v1.
8. **Google Ads** без кампаний → brand verification Cloud-проекта → Apply for Basic → Keyword Planner через API (developer token отменён с 09.2026). Без расходов объёмы приходят диапазонами.
9. **Bing Webmaster** (импорт из GSC в один клик) + API key; **Yandex Webmaster** для /ru/.
10. **Microsoft Clarity** через GTM; токен Data Export в `.env.automation`.
11. **Looker Studio**: читает Google Sheet, который заполняет скрипт из git-JSON (не подключать напрямую к GA4 — общая квота токенов).
12. **Trends**: заявка на alpha API; до одобрения ручной CSV раз в квартал по 10–15 seed-запросам с гео Comunidad Valenciana.

## События GA4 (спецификация → `docs/analytics-events.md`, задача)

| Событие                              | Триггер                                                                                       | Параметры                               | Key event |
| ------------------------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------- | --------- |
| `click_whatsapp`                     | клик по `wa.me` (GTM Click URL)                                                               | locale, page, product_slug, source_code | да        |
| `click_phone`                        | клик по `tel:`                                                                                | locale, page, product_slug              | да        |
| `generate_lead`                      | отправка формы (`form_submit` → переименовать)                                                | locale, lead_type, product_slug, value  | да        |
| `click_directions`                   | клик по ссылке на карту шоурума                                                               | locale, page                            | да        |
| `showroom_visit_request`             | запись на визит                                                                               | locale, product_slug                    | да        |
| `view_item`                          | карточка товара                                                                               | item_id = slug, category, price         | нет       |
| микроконверсии                       | просмотр галереи, клик по размерам/тканям, скролл до характеристик                            | locale, product_slug                    | нет       |
| `qualify_lead`, `close_convert_lead` | из CRM через Measurement Protocol (EU-эндпоинт region1, окно 72 ч, client_id сохранён в лиде) | value, product_slug                     | да        |

`dataLayer.push` в компонентах CTA (задача разработки), теги и триггеры в GTM.

## Лимиты, которые определяют кроны

| API                             | Лимит                                                                          | Следствие                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| GSC Search Analytics            | 25 000 строк/запрос, 50 000/день на тип поиска, лаг 2–3 дня, история 16 мес    | ежедневно один день T-3 в 3–4 срезах; свою историю храним в git                        |
| GSC URL Inspection              | 2 000/день                                                                     | еженедельно все целевые URL                                                            |
| GA4 Data API                    | 200 000 токенов/день, 40 000/час                                               | 3–4 `runReport` в день, логировать `propertyQuota`                                     |
| GBP Performance                 | квота 0 до одобрения; 300 QPM после; история 18 мес; поисковые слова помесячно | заявка на 60-й день; до этого ручной экспорт раз в неделю                              |
| CrUX API                        | 150/мин, окно 28 дней, лаг 2 дня; PSI 25 000/день                              | еженедельно origin + шаблонные URL × PHONE/DESKTOP; fallback PSI lab при малом трафике |
| Clarity Data Export             | 10 запросов/день, история 1–3 дня                                              | ежедневно 3 запроса, git — единственное долгосрочное хранилище                         |
| Merchant API                    | —                                                                              | статусы товаров ежедневно, фид по расписанию MC                                        |
| Keyword Planner (Ads API Basic) | 15 000 оп/день                                                                 | раз в месяц по всему портфелю                                                          |

## Хранение в репо

```
config/metrics/targets.json      { targetQueries:[{q,lang,country,pageSlug,goalPos}], targetProducts:[slug],
                                   templateUrls:[...], thresholds:{posDrop:3, clicksDrop:0.3, minImpr:50, leadDrop:0.25},
                                   goalUnits:{slug: n}, maxCAC:{slug: eur} }
data/metrics/<source>/daily|weekly|monthly/YYYY-MM-DD.json   { source, date, fetchedAt, params, rows }
data/metrics/_manifest.json      последняя дата на источник (gap-detection)
data/sales/YYYY-MM.json          продажи из фактурации/B24 (дата, SKU, сумма, город, источник, client_id)
data/ops/{costs,uptime,cron-health}/
reports/weekly/YYYY-Www.md, reports/monthly/YYYY-MM.md, reports/ads/, reports/leads/
docs/kpi/dashboard.md            генерируется weekly-growth-review
```

Недельный отчёт сравнивает окно 7 дней (T-3…T-9) с предыдущими 7 и с той же неделей 4 недели назад; флаги по `thresholds` автоматически становятся draft-задачами.

## Скрипты (задачи разработки)

`scripts/metrics/collect-all.mjs` (оркестратор) + `gsc-snapshot.mjs`, `ga4-snapshot.mjs`, `gbp-snapshot.mjs`, `cwv-snapshot.mjs`, `clarity-snapshot.mjs`, `merchant-status.mjs`, `bing-snapshot.mjs`, `index-check.mjs`, `keyword-metrics.mjs`, `offline-conversions.mjs`, `publish-sheets.mjs`. Все на `googleapis` npm, service account, read-only scopes.
