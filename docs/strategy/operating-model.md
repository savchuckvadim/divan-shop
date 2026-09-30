# Операционная модель: как мы растим магазин диванов

Версия 1 · 2026-09-21 · Источники: `research/market/2026-09-21/*` (7 тем + критик, ~300 источников).

> **Внимание, 2026-09-30.** Владелец отменил шоурум. Разделы 1, 2 и 5 этого документа описывают прежнюю модель «сайт + шоурум» и частично устарели. Актуальная рамка, North Star, ассортимент и модель продаж — в [business-model.md](./business-model.md) ([ADR-0009](../decisions/0009-online-only-no-showroom.md), [ADR-0010](../decisions/0010-payments-staged.md)). Разделы 3, 4, 6, 7 и 8 (ритм, обратная связь, инструменты, guardrails, docs-as-code) остаются в силе.

Это главный документ. Остальные раскрывают его части: [портфель запросов](../marketing/query-portfolio.md), [каналы](../marketing/channels.md), [Google-стек](../marketing/google-stack.md), [локальное SEO](../marketing/local-seo.md), [лиды и CRM](../marketing/leads-and-crm.md), [чеклист запуска](../marketing/launch-checklist.md), [реестр кронов](../ops/crons.md), [бюджет времени](../ops/capacity.md), [решения](../decisions/README.md).

## 1. Цель и рамка

**Бизнес:** шоурум диванов в Аликанте, доставка по Коста-Бланке. Рынок на 52% иностранный (Торревьеха: украинцы 9,6–10,8 тыс., россияне 5,9 тыс., британцы 4,7 тыс.; покупатели новостроек в провинции: голландцы 16,5%, немцы 10,6%, британцы 10,1%). Четыре локали оправданы, но **основной рынок и язык Google для региона — испанский**.

**Цель:** вывести 2–3 hero-модели на заданный уровень продаж. Цифры пока не заданы, шаблон в [targets.md](./targets.md). Пока их нет, KPI-дерево и приоритизация не калибруются, поэтому это задача №1 для владельца.

**North Star Metric:** квалифицированные обращения по hero-моделям в неделю (форма + WhatsApp + звонок + запись в шоурум, с городом и моделью). Контр-метрики: close rate шоурума и средний чек, чтобы не гнаться за мусорными лидами.

**KPI-дерево (омниканальное):**

```
Продажи hero-SKU (шт/мес, маржа)
├─ Онлайн-заказы (этап 2, после чекаута)
└─ Визиты шоурума × Close rate (бенчмарк walk-in 8–9%, обученный зал 15%+, по записи выше)
   └─ Лиды × Lead→Visit (ориентир ≥30% от квалифицированных)
      └─ Сессии × Contact rate (цель 2–3% на страницах товаров; мобайл отдельно)
         └─ Показы × CTR по кластерам запросов (GSC) + GBP-действия (маршруты, звонки, WhatsApp)
```

Каждая ветка имеет владельца: трафик и позиции — агент (SEO-петля), конверсия страниц — агент + человек (UX, обратная связь), лиды→визиты→продажи — человек (шоурум, WhatsApp), плюс роботы CRM.

## 2. Две петли роста вместо воронки

Думаем петлями (Reforge/Balfour): выход одного цикла — вход следующего.

**Петля 1. Контент-SEO.** Запросы и вопросы клиентов (GSC, WhatsApp, шоурум) → страницы категорий/городов/статьи → трафик → лиды → новые запросы и возражения → контент. Измеряем еженедельно: новые запросы в топ-20, striking-distance страницы (позиции 4–15), лиды с органики.

**Петля 2. Репутация.** Доставка → NPS через 3 дня → отзыв Google (QR/ссылка, без стимулов) → рейтинг и число отзывов GBP → Local Pack → визиты шоурума → доставки. Измеряем: отзывов/нед (цель 2–4), рейтинг ≥4,7, 100% ответов ≤48 ч, GBP-действия.

Третья петля (B2B-партнёры: агентства, управляющие, застройщики, furniture packs) запускается на 31–60 день и имеет самый большой средний чек.

## 3. Цикл: ритм и роли

Принцип: **агенты измеряют, анализируют и делают черновики; человек решает, публикует и общается с людьми.** Ничего клиентского не уходит без человека, кроме утверждённых шаблонов (GBP-посты, пины).

| Ритм                      | Что происходит                                                                                                                                                                  | Кто                  | Время человека             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | -------------------------- |
| Ежедневно 06:00           | `collect-all`: снимки GSC/GA4/GBP/Clarity/CWV/Merchant/B24 → `data/metrics/`                                                                                                    | node-скрипт          | 0                          |
| Ежедневно 09:00           | `/task-run`: одна ready-задача из очереди → код/контент → отчёт                                                                                                                 | Claude               | 0                          |
| Ежедневно 09:30           | `/daily-ops`: черновики ответов на лиды и отзывы, пост GBP, дайджест лидов                                                                                                      | Claude               | 10 мин: отправить/одобрить |
| Весь день                 | Ответ на лид ≤15 мин (10–20 пн–сб), лог шоурума (2 мин на посетителя)                                                                                                           | человек + роботы B24 | по факту                   |
| Пн 07:30                  | `/weekly-growth-review`: KPI-дерево за неделю vs 4 недели, striking distance, гипотезы с ICE → draft-задачи, обновление `docs/kpi/dashboard.md`                                 | Claude               | 0                          |
| Пн 09:00                  | **Weekly Growth Review** (45 мин): 15 мин KPI и фокус, 10 мин прошлая неделя, 15 мин уроки и обратная связь из шоурума, 5 мин выбор задач (draft→ready), 5 мин здоровье бэклога | человек              | 45 мин                     |
| Пн 08:00                  | `/seo-research`: выдача, конкуренты, gap → draft-задачи (первые 4 недели еженедельно, потом раз в 2 недели)                                                                     | Claude               | 0                          |
| Ср 08:00                  | `/content-brief-and-draft`: 1 статья/нед по content-plan → черновик в CMS                                                                                                       | Claude               | 30 мин ревью фактов        |
| Пт 08:00                  | `/social-pack` + `/publish-gate`: посты на неделю, список черновиков с возрастом                                                                                                | Claude               | 30 мин «publish slot»      |
| Вс 03:00                  | `tech-seo-audit`: hreflang/canonical/sitemap/JSON-LD/CWV/индексация/axe → задачи                                                                                                | node + Claude        | 0                          |
| 1-е число                 | `/monthly-retro`: месяц vs OKR, эксперименты, решения без ADR, capacity, что автоматизировать дальше                                                                            | Claude               | 2 ч ретро                  |
| Последняя неделя квартала | `/quarterly-strategy`: рынок, сезонность, каналы, персоны по интервью, RICE-роадмап, OKR                                                                                        | Claude               | полдня                     |

Правила приоритизации: недельные задачи — ICE (Impact/Confidence/Ease 1–10), квартальные инициативы — RICE в `docs/strategy/roadmap.md`. Черновик старше 14 дней либо публикуется, либо удаляется.

## 4. Системы обратной связи от людей

При <500 лидов/мес A/B-тесты не работают. Ставка на качественные сигналы, все в едином хранилище `research/feedback/` (формат: дата, источник, язык, сегмент, модель, тема: цена/срок/размер/ткань/доставка/язык/доверие, цитата).

- **Лог шоурума** (CRM или таблица): источник визита, модель интереса, возражение, исход. Топ-5 возражений месяца → FAQ, контент, цены, сроки.
- **NPS** через 3 дня после доставки (WhatsApp даёт 45–65% отклика): 9–10 → ссылка на отзыв Google, 0–6 → звонок владельца в течение часа. Второй опрос через 30 дней + просьба о фото в интерьере.
- **Отзывы Google** и ответы на них на языке автора.
- **Microsoft Clarity** (бесплатно, без лимитов): 15 мин/нед смотреть 10 сессий со страниц товаров и 5 сессий, закончившихся лидом; rage/dead clicks в недельном отчёте.
- **Юзабилити-тесты 5 человек** раз в 6 недель (3 испаноязычных + 2 экспата): найти диван-кровать до 1500 €, узнать доставку в Торревьеху, записаться в шоурум. Протокол в `docs/playbooks/usability-test.md` (задача).
- **JTBD-интервью** с 2 покупателями в месяц (20–30 мин, без стимулов) → персоны и формулировки для копирайта.
- **Опросы аудитории** (Instagram Stories, Telegram-чаты экспатов) по продуктовым гипотезам: ткань, ширина, механизм, срок.
- **WhatsApp-диалоги**: агент еженедельно вытаскивает повторяющиеся вопросы → FAQ и статьи.

Всё это питает `/weekly-growth-review` и `/content-brief`.

## 5. Фазы запуска

**Фаза 0 — фундамент (дни 0–30).** Критический путь: **название бренда** (нейминг-спринт 7 дней, см. [launch-checklist](../marketing/launch-checklist.md)) → домен, вывеска, GBP (запускает 60-дневный таймер доступа к API), GSC Domain property, Cloud-проект + service account, GA4/GTM + сертифицированный CMP с Consent Mode v2, WhatsApp Business, Meta Business, Clarity. На сайте: дефолт es, юр-страницы, коллекция leads с согласиями и антиспамом, кнопки WhatsApp с кодом источника, страница шоурума с FurnitureStore JSON-LD, страница контактов, FAQ-блок, коллекция Locations и городские страницы, фид товаров. Первые 30 фото и 5 рилсов. Hero-SKU и targets.md. Хостинг, бэкапы, аптайм.

**Фаза 1 — органика и партнёры (дни 31–60).** Контент 1 статья/нед, 3 поста/нед на 4 языках, 2 полезных поста/нед в FB-группах, объявления в Telegram-чатах каждые 3 дня, Wallapop 5–10 позиций, outreach 30 агентов/PM → 5 встреч, первые 20 отзывов GBP, Click-to-WhatsApp реклама 15–25 €/день только при наличии 20 отзывов и 30 фото (ADR-0005).

**Фаза 2 — масштаб (дни 61–90).** Узкий Google Search + PMax Store Goals 10–15 €/день, тест экспат-прессы, листовки 5 000 в 3–4 урбанизациях, первая email-рассылка, 5 активных партнёров, первый B2B-заказ «sofa module» для furniture pack, GBP API после 60-го дня, месячный marketing review с перераспределением бюджета.

**После 90 дней:** решение по WhatsApp API (>30 диалогов/день), nl/de-локалям, чекауту (после 50 продаж, ADR-0007), Semrush/Ahrefs, part-time community manager.

## 6. Знания и инструменты: что подключить и изучить

**Подключить (бесплатно):** Google Business Profile, Search Console (Domain property + API через service account), GA4 + GTM + Consent Mode v2, Merchant Center (free local listings, фид из Payload), CrUX/PSI API, Microsoft Clarity, Bing Webmaster + IndexNow, Google Ads-аккаунт без бюджета ради Keyword Planner (brand verification Cloud-проекта → Basic access), Looker Studio поверх Google Sheets, WhatsApp Business App, Meta Business Suite + Pixel/CAPI + Commerce Manager, Pinterest Business + API, Telegram-бот (есть), UptimeRobot, Cloudflare Turnstile, Resend/Brevo для транзакционных писем с SPF/DKIM/DMARC, Yandex Webmaster для /ru/.

**Подключить (платно, по мере надобности):** сертифицированный CMP (0–15 €/мес), Bitrix24 Basic (~49 €/мес, если REST не работает на Free — проверить), Zadarma номер Аликанте (1,7 €/мес), ПО фактурации с Verifactu и API (Holded/Quipu, 15–30 €/мес), VPS для node-кронов (Hetzner ~4 €/мес) или GitHub Actions (бесплатно), SeQura/Aplazame (комиссия), Semrush/Ahrefs (позже), WhatsApp Business API через BSP (позже), гео-грид трекер (0–25 €/мес).

**Изучить (владельцу, по приоритету):**

1. Whitespark Local Search Ranking Factors 2026 и справка GBP (категории, зоны, видеоверификация, политика отзывов).
2. Google Skillshop: GA4, Merchant Center, Ads Search.
3. Guía de cookies AEPD + Consent Mode v2; LSSI ст. 10/27/28; TRLGDCU (desistimiento, гарантия 3 года); правило «precio anterior 30 дней»; Verifactu (AEAT).
4. Baymard: furniture product page UX.
5. Reforge/Balfour growth loops и growth process; Sean Ellis high-tempo testing.
6. JTBD switch-интервью (Moesta/Klement); NN/g тесты с 5 пользователями.
7. Payload 3: hooks, form-builder overrides, localization, jobs; Next 16 metadata/sitemap.
8. Bitrix24: роботы, открытые линии, Booking, входящие/исходящие вебхуки (у тебя есть экспертиза, здесь она главный актив).
9. Meta Business Suite, Commerce Manager, Click-to-WhatsApp.
10. AI-поиск: Google AI Mode в Испании, llms.txt, «answer-first» контент (скилл `/ai-seo`).

**Проектные скиллы, которые появятся (реестр в `.claude/skills/README.md`):** `/weekly-growth-review`, `/daily-ops`, `/content-brief`, `/article-draft`, `/social-pack`, `/gbp-post`, `/review-reply`, `/lead-triage`, `/monthly-retro`, `/quarterly-strategy`, `/naming`, `/usability-test`, `/jtbd-interview`. Каждый — markdown-протокол + node-скрипты в `scripts/`.

## 7. Guardrails для автономной работы

- Deny-first allowlist в `.claude/settings.json`; Google-токены только read-only scope; секреты в `.env.automation`, недоступном агенту (скрипты читают сами).
- Агент публикует автоматически только GBP-посты и пины по утверждённым шаблонам. Статьи, ответы клиентам, цены, структура URL — через человека.
- Изменения структуры URL, локалей, схемы данных, канала — только с ADR в `docs/decisions/`.
- Каждый запуск: отчёт + список изменённых файлов + `total_cost_usd` в `data/ops/costs/`.
- Kill switch: `pwsh scripts/install-schedule.ps1 -Remove`.
- В Telegram не отправляются телефоны и email клиентов.

## 8. Что должно существовать в репо (docs-as-code)

| Файл                                                                                 | Назначение                                        | Статус                             |
| ------------------------------------------------------------------------------------ | ------------------------------------------------- | ---------------------------------- |
| `docs/strategy/operating-model.md`                                                   | этот документ                                     | есть                               |
| `docs/strategy/targets.md`                                                           | hero-SKU, юнит-экономика, цели продаж             | шаблон, заполнить                  |
| `docs/strategy/okr-2026-Q4.md`                                                       | 1 Objective, 3 KR                                 | черновик                           |
| `docs/strategy/roadmap.md`                                                           | квартальные инициативы с RICE                     | задача                             |
| `docs/marketing/audience.md`                                                         | сегменты и персоны                                | есть                               |
| `docs/marketing/query-portfolio.md`                                                  | кластеры запросов → URL                           | есть                               |
| `docs/marketing/channels.md`                                                         | каналы и 90-дневный план                          | есть                               |
| `docs/marketing/calendar.md`                                                         | сезонный календарь                                | есть                               |
| `docs/marketing/local-seo.md`                                                        | GBP-плейбук                                       | есть                               |
| `docs/marketing/google-stack.md`                                                     | подключение и автоматизация Google                | есть                               |
| `docs/marketing/leads-and-crm.md`                                                    | лиды, SLA, воронка, B24                           | есть                               |
| `docs/marketing/launch-checklist.md`                                                 | юридика, нейминг, продукт                         | есть                               |
| `docs/product/supply-and-delivery.md`                                                | поставщики, матрица доставки                      | задача (нужны данные)              |
| `docs/content/content-plan.md`, `editorial-policy.md`, `content/briefs/_template.md` | контент-операции                                  | задача                             |
| `docs/kpi/dashboard.md`                                                              | генерируется агентом из `data/metrics`            | появится с `/weekly-growth-review` |
| `docs/experiments/log.md`                                                            | гипотеза, метрика, ICE, результат                 | задача                             |
| `docs/ops/crons.md`, `capacity.md`                                                   | реестр кронов, бюджет времени                     | есть                               |
| `docs/decisions/`                                                                    | ADR                                               | есть (7 решений)                   |
| `docs/playbooks/*`                                                                   | weekly review, usability test, JTBD, review reply | задача                             |
| `research/feedback/`                                                                 | голос клиента, единый формат                      | задача                             |
| `config/metrics/targets.json`                                                        | целевые запросы, модели, пороги                   | задача                             |
