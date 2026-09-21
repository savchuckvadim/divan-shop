# critic

## Summary

Семь тем хорошо закрывают каналы, Google-стек и юридику сайта, но как единый процесс не собираются: суммарно предложено ~70 кронов с 4–6 дублями на каждую функцию (отзывы, недельный отчёт, месячный ретро), часть с шагом 5–15 минут, при том что всё исполняется через `claude -p` на настольном Windows по Task Scheduler — это нереализуемо ни по надёжности (сон ПК), ни по стоимости/лимитам. Нужно разделить контур на детерминированные node-скрипты (сбор данных, ретраи, SLA-алерты — лучше на VPS/GitHub Actions или роботах Bitrix24) и 1 ежедневный + 1 недельный + 1 месячный запуск Claude, с единым реестром кронов и учётом стоимости. Полностью отсутствуют «бизнес-основы», без которых цикл «метрики → задачи» не замыкается на продажах: не заданы целевые цифры продаж по hero-SKU и юнит-экономика, не описаны поставщик/сроки/стоимость доставки по зонам (а городские страницы обещают 48–72 ч), не решено, есть ли онлайн-чекаут или сайт — только лидген, нет источника истины по офлайн-продажам. Юридика пропустила Verifactu: сертифицированное ПО выставления счетов обязательно с 01.01.2027 (SL) / 01.07.2027 (автономо) — это же и определяет, откуда брать данные продаж. Между темами есть прямые противоречия, требующие ADR: URL городских страниц, частота статей, источник истины по лидам (Payload vs B24), сроки старта рекламы. Название бренда — единственный критический путь (GBP + 60-дневный таймер API, домен/GSC, Merchant Center, Meta-верификация, ТЗ), но дедлайн не поставлен. Нет ни строчки про хостинг, бэкапы, аптайм, антиспам форм и доставляемость писем (SPF/DKIM), а также про бюджет человеческого времени: сумма предложенной ручной работы (FB-группы, WhatsApp SLA ≤15 мин, фото, соцсети, ревью черновиков, интервью, шоурум) многократно превышает одного человека. Спорные утверждения проверены: Q&A GBP закрыт (03.11/03.12.2025), Ads API без developer token с 10.09.2026, WhatsApp сервисные сообщения платные с 01.10.2026 (1000 бесплатных/номер/мес), Meta +3% в Испании с 01.07.2026, Feria Hábitat 28.09–01.10.2026, политика Google по стимулированным отзывам от 24.07.2026, Ley 10/2025 к мебельному магазину не применяется — всё подтвердилось; утверждение «на Free-тарифе Bitrix24 нет REST» официальной страницей не подтверждено и требует проверки на странице тарифов.

## Findings

- **[high]** Предложено ~70 кронов из 7 тем с массовыми дублями: отзывы (gbp-review-monitor, reviews-monitor, reviews-collector, nps-after-delivery, review-request-sender), недельная аналитика (wow-report, weekly-growth-report, weekly-pipeline-review, gsc-weekly, gbp-performance-pull, hero-sku-weekly), месячные (monthly-review, monthly-marketing-review, monthly-retro-pack, sales-feedback-monthly). Каждый запуск Claude — отдельная сессия с затратами и лимитами.
  - action: Создать docs/ops/crons.md как единственный реестр: колонки name | тип (node-script / claude-skill / b24-robot / human) | расписание | вход | выход | владелец. Схлопнуть до: ежедневно один node `collect-all` (GSC/GA4/GBP/Clarity/CWV/Merchant/B24 → data/metrics) + один Claude `/daily-ops` (лиды-черновики, отзывы, пост GBP, task-run); еженедельно `/weekly-growth-review` (все недельные отчёты в одном); ежемесячно `/monthly-retro`; квартально `/quarterly-strategy`. Правило: новый крон = строка в реестре + один скилл/скрипт, иначе не регистрируется.
  - evidence: https://code.claude.com/docs/en/costs
- **[high]** Все автоматизации привязаны к настольному Windows (scripts/daily-agent.ps1 → claude -p). Кроны с шагом 5–15 мин (lead-sync-retry, lead-triage, sla-watch) и ночные снимки не выполнятся при спящем/выключенном ПК; каждый `claude -p` съедает лимиты Pro/Max и деньги.
  - action: Разнести по слоям: (1) SLA-алерты, ретраи лидов, напоминания о визитах, NPS-триггеры — роботы/бизнес-процессы Bitrix24 (без Claude); (2) сбор метрик — node-скрипты на VPS (Hetzner ~4 €/мес) или GitHub Actions cron (бесплатно до 2000 мин/мес), результат коммитится в репо; (3) Claude — не более 1 ежедневного, 1 недельного, 1 месячного запуска с `--output-format json` для логирования total_cost_usd и `--bare` там, где скиллы не нужны. Добавить в scripts/install-schedule.ps1 запуск «при пробуждении» и проверку, что задача не пропущена >24 ч.
  - evidence: https://claudefa.st/blog/guide/development/scheduled-tasks
- **[high]** Тема legal не упоминает Verifactu: сертифицированное ПО выставления счетов (SIF) обязательно с 01.01.2027 для обществ (IS) и с 01.07.2027 для автономо (RDL 15/2025). Это же определяет источник данных по офлайн-продажам, на который опираются sales-feedback-monthly, hero-sku-weekly и offline-conversions.
  - action: Выбрать программу фактурации, совместимую с Verifactu и с API (Holded, Quipu, Sage, Contasimple) до запуска продаж; продажи фиксировать там или в B24-сделках с синком; в docs/legal/ добавить раздел Verifactu; задача T-«sales-source-of-truth» (одна таблица sales: дата, SKU, сумма, город, источник, client_id GA4).
  - evidence: https://noticias.juridicas.com/actualidad/noticias/20735-nueva-prorroga:-verifactu-no-sera-obligatorio-hasta-2027-para-sociedades-y-otros-contribuyentes/
- **[high]** Цель «вывести модели на определённый уровень продаж» нигде не оцифрована: нет units/мес по hero-SKU, маржи, потолка CAC, стоимости доставки по зонам, breakeven. Без этого OKR, targets.json и приоритизация ICE/RICE висят в воздухе.
  - action: docs/strategy/targets.md: по каждой из 2–3 hero-моделей — цена, себестоимость, валовая маржа, цель units/мес на 3/6/12 мес, допустимый CAC (= маржа × доля), требуемое число лидов при close rate 10–15 % шоурума. Значения — в config/metrics/targets.json (goalUnits, maxCAC), чтобы weekly/monthly-отчёты сравнивали факт с целью.
  - evidence: -
- **[high]** Полностью отсутствует продуктово-логистический контур: кто поставщик диванов (фабрика Валенсия/Мурсия? импорт?), сроки и MOQ, склад vs made-to-order, кто везёт и собирает (свой фургон/transportista), стоимость доставки по зонам, вывоз старого дивана (ecoparque). Городские страницы и УТП «entrega 48–72 h» это обещают, а данных нет.
  - action: docs/product/supply-and-delivery.md: поставщики, lead time по моделям, матрица доставки (зона → срок → цена → включена ли сборка/вывоз), ёмкость (сколько доставок/нед). Из матрицы генерируются блоки «Entrega en {ciudad}» на карточках и городских страницах, и она же — вход для Merchant Center shipping settings.
  - evidence: -
- **[high]** Прямые противоречия между темами, не разрешённые ни одной: (a) URL городских страниц /{locale}/showroom-delivery/{city} (local-seo) vs /es/sofas-torrevieja (query-portfolio); (b) 2 статьи/нед (query-portfolio) vs 1/нед (operating-model); (c) источник истины по лидам Payload leads vs Bitrix24; (d) старт Meta Ads с 30-го дня vs Google с 60-го при отсутствии бюджета; (e) отзывы на сайте: Review-схема на Product допустима, aggregateRating на FurnitureStore — нет, «reseñas verificadas» требует раскрытия метода.
  - action: Завести docs/decisions/ и закрыть ADR-ами: 0001 default locale es; 0002 URL-схема городских страниц (рекомендация: /es/sofas-en-{city}, EN /en/sofas-{city}, тип страницы Locations в Payload); 0003 1 статья/нед до появления GSC-данных; 0004 лид = запись в Payload (source of truth, идемпотентность) → зеркалится в B24 (рабочее место продаж); 0005 реклама только после 20 отзывов GBP и 30 фото; 0006 схема отзывов: Product Review + раскрытие метода верификации, без self-serving aggregateRating.
  - evidence: https://searchengineland.com/google-says-dont-include-fake-or-undisclosed-incentivized-reviews-in-review-snippet-structured-data-483456
- **[high]** Название бренда — критический путь для всего: GBP (и 60-дневный таймер Basic API Access), домен и DNS-подтверждение GSC, Merchant Center, Meta Business verification, WhatsApp Business, заявка в OEPM, вывеска для видеоверификации. Ни в одной теме нет дедлайна и владельца.
  - action: Naming-спринт 7 дней: день 1–2 — скрипт генерации 50 кандидатов + check-name.mjs (RDAP .es/.com, хендлы, OEPM/EUIPO/TMview кл. 20+35); день 3–5 — опрос 10–15 человек из es/en/ru/uk-групп; день 6 — решение, покупка доменов финалистов; день 7 — заказ вывески. Сразу после: GBP → таймер 60 дней, Domain property GSC, Cloud-проект, Meta Business.
  - evidence: -
- **[high]** Не посчитан бюджет человеческого времени. Суммарно предложено: FB-группы 15 мин/день, ответ на WhatsApp ≤15 мин, 3–5 фото/нед, 3 поста/нед + Reels, ревью всех черновиков (статьи, посты, ответы на отзывы, задачи draft→ready), 45-мин growth review, 15 мин Clarity, 2 JTBD-интервью/мес, юзабилити-тест раз в 6 нед, встречи с агентами, работа в шоуруме, выставка. Это > 1 FTE при одном операторе.
  - action: docs/ops/capacity.md: фиксированный недельный бюджет (например 8–10 ч на маркетинг-операции) и ранжирование: обязательное (лиды/WhatsApp, отзывы, фото, публикация 1 статьи), желательное (соцсети 2 поста, FB-группы), отложенное (Pinterest, интервью до первых 20 продаж). Определить, кто стоит в шоуруме и на каких языках; рассмотреть part-time community manager (ru/uk/en) с 3-го месяца. Раз в месяц крон сверяет запрошенное кронами ручное время с бюджетом.
  - evidence: -
- **[high]** Ни одна тема не упоминает антиспам форм и доставляемость писем: без Turnstile/honeypot/rate-limit спам-заявки будут литься в B24 и Telegram и ломать SLA-метрики; без SPF/DKIM/DMARC и транзакционного провайдера авто-ответы (<60 сек) и подтверждения заказа уйдут в спам.
  - action: Задачи: T-form-antispam (Cloudflare Turnstile или hCaptcha на Payload-формах, honeypot, лимит по IP, отклонение при score), T-email-infra (Resend/Brevo SMTP, SPF/DKIM/DMARC на домене, отдельный поддомен mail., проверка через mail-tester). В leads-digest считать долю спама.
  - evidence: -
- **[high]** Нет ни слова о хостинге, бэкапах и безопасности: где живёт Next.js 16 + Payload 3 + БД + медиа, кто делает ночной бэкап, аптайм-мониторинг, 2FA на /admin, обновления зависимостей, срок домена/SSL. Падение сайта или потеря медиа обнулит все SEO-петли.
  - action: ADR по хостингу (Vercel + Neon/S3 или VPS + Docker Compose — docker-compose.yml уже есть), ночной дамп БД + синк медиа в S3/Backblaze с проверкой восстановления раз в квартал, UptimeRobot (бесплатно) на / и /admin, 2FA/allowlist IP на админку, Dependabot/renovate. Всё — в реестр кронов как node/внешние сервисы, не Claude.
  - evidence: -
- **[high]** Сайт до сих пор без решения «есть чекаут или только лидген». От этого зависят: ст. 27–28 LSSI (подтверждение заказа), платёжный провайдер (Redsys/Stripe/Bizum), SeQura/Aplazame-интеграция, Merchant Center (link на карточку допустим и без чекаута), GA4-события purchase vs generate_lead, Verifactu.
  - action: Принять ADR 0007: этап 1 — лидген + бронирование визита + «reservar con señal» через ссылку на оплату (Stripe Payment Link / Bizum), этап 2 — чекаут после 50 продаж. Оформить в roadmap с RICE.
  - evidence: -
- **[medium]** AI-поиск почти не покрыт: Google AI Mode работает в Испании с 08.10.2025 и стал постоянной вкладкой; AI Overviews режут трафик информационных запросов до 8×; Ask Maps заменил Q&A. Упомянуто лишь в квартальном паке.
  - action: Применить скилл /ai-seo при построении контента: llms.txt, единая сущность бренда (sameAs, NAP), карточки с полными характеристиками/FAQ/first-party отзывами, «answer-first» абзацы в статьях. Ежемесячно проверять, что отвечают AI Mode/ChatGPT/Perplexity на «tienda de sofás en Alicante», «sofa shop Torrevieja» и фиксировать в research/seo/ai-visibility/.
  - evidence: https://marketing4ecommerce.net/modo-ia-google-espana/
- **[medium]** Meta Commerce Catalog (Instagram/Facebook Shop, каталог WhatsApp Business) не рассматривается, хотя тот же фид, что для Merchant Center, закрывает теги товаров в Reels/каруселях и каталог WhatsApp.
  - action: Один route /api/feeds/products.{xml,csv} с профилями google и meta; подключить в Commerce Manager (scheduled fetch), включить теги товаров в постах; ошибки диагностики каталога — в daily collect.
  - evidence: -
- **[medium]** Нет сезонного календаря, а спрос на Коста-Бланке резко сезонный: rebajas (январь, июль), Black Friday, подготовка аренды (апрель–июнь), приёмка новостроек (сентябрь–октябрь), Feria Hábitat València 28.09–01.10.2026 (подтверждено).
  - action: docs/marketing/calendar.md с событиями и окном подготовки (T-60/T-30/T-7); крон 15-го числа читает календарь и кладёт draft-задачи (офферы GBP, посты, статьи, Wallapop-outlet, e-mail).
  - evidence: https://www.feriavalencia.com/feria-habitat-valencia-convoca-su-proxima-edicion-del-28-de-septiembre-al-1-de-octubre-de-2026/
- **[medium]** Запись на визит в шоурум упоминается как КПД-метрика и CTA, но инструмент не выбран (Bitrix24 Booking, Google Calendar appointment schedule, кнопка «Reservar» в GBP).
  - action: Выбрать Bitrix24 Booking (в тарифе) или Google Calendar appointment (бесплатно); ссылку — в GBP (booking link), на сайт (CTA «Reservar visita»), в авто-ответы WhatsApp на 4 языках; событие GA4 showroom_visit_request как key event.
  - evidence: -
- **[medium]** Утверждение «на Free-тарифе Bitrix24 нет REST/вебхуков» официальной справкой не подтверждается (страница отсылает к тарифам), а часть источников утверждает, что REST на Free доступен. От этого зависит бюджет ~600 $/год.
  - action: Проверить на https://www.bitrix24.com/prices/ (строка «REST API / Webhooks» по тарифам) и на тестовом портале bitrix24.eu: создать входящий вебхук на Free. Если работает — стартовать на Free, Basic брать только ради открытых линий/телефонии.
  - evidence: https://helpdesk.bitrix24.com/open/21133100/
- **[low]** Ley 11/2023 (EAA) с 28.06.2025 распространяется на интернет-магазины; микропредприятия (<10 сотрудников и ≤2 млн €) освобождены от требований к услугам, но освобождение надо уметь доказать.
  - action: Зафиксировать статус микропредприятия в docs/legal/; тем не менее выдерживать базовый WCAG 2.1 AA (контраст, alt, клавиатура, формы) — это же улучшает CWV/SEO; добавить в tech-seo-audit проверку axe-core.
  - evidence: https://inforges.es/blog/accesibilidad-ecommerce-obligaciones-legales-espana
- **[low]** Ley 10/2025 (atención a la clientela) вступила в силу 28.12.2025, но обязывает только базовые услуги (вода, газ, электро, транспорт, финансы, телеком, почта) — тема legal это указала верно.
  - action: Никаких действий; убрать из legal-watch как нерелевантное.
  - evidence: https://www.boe.es/buscar/act.php?id=BOE-A-2025-26698
- **[low]** Content API for Shopping отключён 18.08.2026 — дата уже в прошлом, а сводка описывает её как будущую. Файл/SFTP/Sheets/scheduled fetch продолжают работать.
  - action: Стартовать с scheduled fetch фида (без API); merchant-status.mjs писать сразу на Merchant API v1; Content API не трогать.
  - evidence: https://www.productsup.com/blog/google-merchant-api-migration-what-changes-before-the-august-2026-deadline-and-how-to-prepare/
- **[low]** Google Ads API: developer token отменён 10.09.2026, доступ определяет Cloud-проект; все ожидавшие заявки на Basic закрыты — подавать заново после brand verification. Подтверждено.
  - action: В google-stack оставить как есть; в чеклист Cloud-проекта добавить brand verification до заявки на Basic.
  - evidence: https://ads-developers.googleblog.com/2026/02/an-update-on-google-ads-api-developer.html
- **[low]** WhatsApp: с 01.10.2026 сервисные сообщения платные после 1000 бесплатных/номер/мес, utility всегда платные, 72-часовое окно после Click-to-WhatsApp бесплатно; приложение WhatsApp Business не затронуто. Подтверждено.
  - action: Этап 1 — WhatsApp Business App; API только при >30 диалогов/день. Заложить в cost ledger.
  - evidence: https://respond.io/blog/whatsapp-pricing-change-2026
- **[low]** Meta с 01.07.2026 добавляет 3 % location fee для показов в Испании (плюс IVA). Подтверждено.
  - action: Учесть в бюджете рекламы (+3 % + 21 % IVA).
  - evidence: https://almcorp.com/blog/meta-location-fees-2026-ad-price-increase-six-countries/
- **[low]** Google удалил Q&A из GBP (API 03.11.2025, публично с 03.12.2025), заменив на Gemini-ответы из сайта/отзывов/профиля. Подтверждено.
  - action: FAQ переносить на сайт (T-003 FAQPage уже в очереди) и в описание профиля.
  - evidence: https://developers.google.com/my-business/content/qanda/change-log
- **[medium]** Нет плана по визуальной идентичности и фотосъёмке: логотип/brandbook, профессиональная съёмка hero-SKU в 3–5 тканях, lifestyle-фото в реальных апартаментах — без этого не работают карточки (Baymard), соцсети, Pinterest, Merchant Center и GBP.
  - action: После нейминга: логотип + 2-страничный brandbook (цвет, шрифт, тон на 4 языках), фотосессия hero-моделей (продукт/интерьер/схема размеров) с правами на использование; медиатека в Payload с тегами модель/ткань/тип, из которой берут все кроны контента.
  - evidence: -
- **[medium]** Обратная связь от людей распределена по 4 темам (NPS, JTBD, юзабилити, лог шоурума, Clarity, FB-группы), но нет единого хранилища «голоса клиента» с таксономией, поэтому месячные отчёты не смогут её агрегировать.
  - action: research/feedback/ с единым форматом записи (дата, источник, язык, сегмент, модель, тема: цена/срок/размер/ткань/доставка/язык/доверие, цитата) и один крон feedback-digest (оставить из operating-model), который питает content-plan, FAQ и product-backlog.
  - evidence: -
- **[medium]** Guardrails: агент публикует контент только как draft, но нет процесса, кто и когда переводит draft→published и draft-задачи→ready; очередь черновиков станет узким местом.
  - action: Еженедельный «publish slot» (пятница 30 мин): крон готовит список черновиков с возрастом и ICE; правило — черновик старше 14 дней либо публикуется, либо удаляется. Разрешить агенту автопубликацию только для GBP-постов и пинов по утверждённым шаблонам.
  - evidence: -
- **[medium]** Знания и скиллы, которых не хватает владельцу для этого процесса, не перечислены системно.
  - action: Изучить: Google Skillshop (GA4, Ads Search, Merchant Center), справка GBP + Whitespark Local Ranking Factors 2026, документация GSC API/GA4 Data API, Consent Mode v2 + Guía de cookies AEPD, Baymard (product page/furniture), Reforge/Balfour growth loops, JTBD (Klement/Moesta), Payload 3 docs (hooks, form-builder, localization), Bitrix24 роботы/открытые линии/Booking, Meta Business Suite + Commerce Manager, Verifactu (AEAT). Локально в репо: скиллы /weekly-growth-review, /content-brief, /article-draft, /social-drafts, /gbp-post, /review-reply, /lead-triage, /monthly-retro, /naming + реестр .claude/skills/README.md.
  - evidence: -
- **[low]** Русскоязычная аудитория частично пользуется Yandex; IndexNow пингует Yandex, но Yandex Webmaster/Метрика не упомянуты.
  - action: Низкий приоритет: подтвердить сайт в Yandex Webmaster (бесплатно) для /ru/, без Метрики (лишний трекер под согласие).
  - evidence: -

## Tools

- **Cloudflare Turnstile** — Антиспам на Payload-формах без капчи для пользователя. cost: 0 €. automation: Серверная проверка токена в afterChange/route; бесплатно, без лимитов для сайтов
- **Resend или Brevo (SMTP/API)** — Транзакционные письма (авто-ответ лиду, подтверждение заказа, NPS) с SPF/DKIM/DMARC. cost: Resend 0 € до 3000 писем/мес; Brevo Free/Starter от 7 €. automation: API из Payload-хуков; webhooks по bounce/complaint → крон deliverability
- **UptimeRobot** — Аптайм-мониторинг сайта и админки, SSL/домен. cost: 0 €. automation: 50 мониторов бесплатно, интервал 5 мин, алерты в Telegram через webhook
- **Hetzner VPS или GitHub Actions cron** — Запуск детерминированных node-скриптов (сбор метрик, ретраи, фиды) независимо от настольного ПК. cost: VPS ~4 €/мес; GitHub Actions 0 € до 2000 мин/мес. automation: cron/systemd timers или schedule: в workflow; секреты в GitHub Secrets; коммит снимков в репо
- **ПО фактурации Verifactu (Holded / Quipu / Contasimple)** — Сертифицированные счета с 2027, источник истины по продажам. cost: ~15–30 €/мес. automation: REST API у Holded/Quipu для импорта продаж в data/sales и B24
- **Bitrix24 Booking / Google Calendar appointment schedule** — Онлайн-запись на визит в шоурум для сайта, GBP и WhatsApp. cost: в тарифе B24 / 0 €. automation: B24 — событие в CRM и робот-напоминание; Google — бесплатно, ссылка в GBP booking
- **Meta Commerce Manager** — Каталог товаров для Instagram/Facebook Shop и WhatsApp Business. cost: 0 €. automation: Scheduled fetch того же фида, что для Merchant Center; Graph API для диагностики
- **Backblaze B2 / S3 + pg_dump** — Ночные бэкапы БД Payload и медиа. cost: ~1–3 €/мес. automation: cron на VPS/хостинге, проверка timestamp кроном uptime-backup-check
- **axe-core (в tech-seo-audit)** — Базовая проверка доступности WCAG 2.1 AA (Ley 11/2023). cost: 0 €. automation: npm-пакет в headless-краулере, отчёт в data/metrics/a11y
- **Yandex Webmaster** — Индексация /ru/ для русскоязычных экспатов, IndexNow-паритет. cost: 0 €. automation: Подтверждение сайта, API для ошибок индексации

## Crons

- **cron-registry-lint** (еженедельно, воскресенье 04:00 (node)): Сверяет реестр docs/ops/crons.md с задачами Task Scheduler/VPS/GitHub Actions/роботами B24: каждая запись имеет один скрипт или скилл, последний запуск успешен, нет дублей по функции, пропуски >24 ч → Telegram. in: docs/ops/crons.md, logs/, data/metrics/_manifest.json; out: data/ops/cron-health/YYYY-MM-DD.json, алерт; human: нет
- **ops-cost-ledger** (ежедневно 23:50 (node)): Собирает total_cost_usd из json-вывода всех `claude -p` запусков, квоты Google API, расходы WhatsApp/Meta/Ads, подписки; сравнивает с месячным бюджетом. in: logs/*.json, .env.automation, Ads/Meta API; out: data/ops/costs/YYYY-MM.json, свод в monthly-retro; human: при превышении бюджета — Telegram
- **uptime-backup-check** (ежедневно 05:00 (node/VPS) + UptimeRobot каждые 5 мин): HTTP-проба / и /admin на 4 локалях, срок SSL и домена, timestamp последнего дампа БД и синка медиа, тестовое восстановление раз в квартал. in: хостинг, S3/Backblaze; out: data/ops/uptime/, алерт в Telegram; human: только при сбое
- **form-spam-and-deliverability** (еженедельно, понедельник 06:30 (node)): Доля спам-заявок (Turnstile fail/honeypot), bounce/spam-complaint rate транзакционных писем, статус SPF/DKIM/DMARC. in: Payload leads, Resend/Brevo API, DNS; out: строка в weekly-growth-review; human: нет
- **seasonal-calendar-planner** (ежемесячно, 15-е число (claude)): Читает docs/marketing/calendar.md на 60 дней вперёд (rebajas, Black Friday, сезон аренды, приёмка новостроек, ярмарки) и кладёт draft-задачи: офферы GBP, посты, статьи, outlet-объявления, e-mail. in: calendar.md, hero-SKU, остатки; out: tasks/TASKS.md draft, content/social/queue; human: перевод draft→ready
- **ai-visibility-monthly** (ежемесячно, 5-е число (claude)): Проверяет ответы Google AI Mode/AI Overviews, ChatGPT, Perplexity на 10 запросов портфеля (es/en/ru): упоминается ли бренд/конкуренты, какие источники цитируются; свежесть llms.txt и sameAs. in: config/metrics/targets.json; out: research/seo/ai-visibility/YYYY-MM.md, задачи draft; human: нет
- **meta-catalog-sync** (ежедневно 04:30 (node)): Проверяет статус фида в Meta Commerce Manager (те же товары, что в Merchant Center), ошибки диагностики, покрытие тегами товаров в постах. in: /api/feeds/products.csv, Graph API; out: data/metrics/meta-catalog/daily/; human: нет
- **publish-gate-digest** (еженедельно, пятница 09:00 (claude)): Список всех draft-сущностей (статьи Payload, соц-посты, задачи draft, ответы на отзывы) с возрастом и ICE; предлагает опубликовать/удалить; напоминает о еженедельном publish-slot. in: Payload API, tasks/TASKS.md, content/; out: Telegram-дайджест, reports/weekly/publish-YYYY-Www.md; human: 30-мин слот публикации
- **human-capacity-review** (ежемесячно, 1-е число (claude, часть monthly-retro)): Суммирует ручные запросы, сгенерированные кронами за месяц (фото, посты, ревью, интервью), против бюджета часов в docs/ops/capacity.md; предлагает, что отключить или автоматизировать. in: logs, capacity.md; out: раздел в monthly-retro; human: решение о сокращениях
- **verifactu-readiness** (ежеквартально до 2027-01-01, затем выкл. (claude)): Проверяет статус выбранного ПО фактурации на соответствие Verifactu, изменения дат AEAT, готовность связки продажи→факт→B24→GA4 offline conversions. in: docs/legal/verifactu.md, WebSearch AEAT/BOE; out: задача draft при изменениях; human: выбор ПО, договор с gestoría
- **sales-ledger-import** (ежедневно 21:00 (node)): Импортирует продажи из программы фактурации/B24 в data/sales/YYYY-MM.json (дата, SKU, сумма, город, источник, client_id) — единый источник для hero-sku, monthly-retro, offline-conversions. in: Holded/Quipu API или B24 crm.item.list; out: data/sales/, отправка close_convert_lead в GA4 MP; human: нет

## KPIs

- North Star: квалифицированные обращения по hero-моделям в неделю (форма + WhatsApp + звонок + запись), с городом и моделью
- Продажи hero-SKU: units/мес и валовая маржа против цели в docs/strategy/targets.md
- CAC по каналам (расходы вкл. стоимость Claude-запусков и подписок / продажи) ≤ допустимого CAC из юнит-экономики
- Визиты шоурума/нед и close rate (walk-in vs по записи)
- Медиана времени первого ответа на лид и доля ответов ≤15 мин в рабочее время
- Отзывы GBP: +4–6/мес, рейтинг ≥4.7, 100 % ответов ≤48 ч
- Позиции целевых запросов (формы «en Alicante», «tienda de sofás Torrevieja», «диваны в Аликанте») и доля запросов в топ-10 по локалям
- GSC клики/показы по кластерам A–F и по локалям; страницы в striking distance (поз. 4–15)
- Contact rate на страницах товаров (2–3 % сессий), доля мобайла и его contact rate
- CWV pass (LCP ≤2.5 с, INP ≤200 мс, CLS ≤0.1) по шаблонам на 4 локалях
- Аптайм ≥99.9 %, возраст последнего бэкапа ≤24 ч, доля спам-заявок <10 %
- Стоимость автоматизации: $/мес на Claude-запуски и API; число ручных часов, запрошенных кронами, ≤ бюджета capacity.md
- NPS через 3 дня после доставки ≥50; топ-3 возражения месяца закрыты задачами

## Open questions

- Какой целевой объём продаж: сколько диванов в месяц и по каким 2–3 hero-моделям, какая валовая маржа и допустимый CAC?
- Кто поставщик (фабрика/импорт), сроки поставки, склад или под заказ, кто доставляет и собирает, стоимость доставки по зонам (Alicante / Torrevieja / Orihuela Costa / остальная Коста-Бланка)?
- Юрлицо: SL или autónomo (влияет на дату Verifactu 01.01 vs 01.07.2027), есть ли gestoría, какое ПО фактурации?
- Сайт на старте — лидген + запись в шоурум или полноценный чекаут с оплатой (Redsys/Stripe/Bizum)?
- Дедлайн выбора названия и кто принимает решение? Есть ли уже вывеска/адрес шоурума, часы работы?
- Кто работает в шоуруме и отвечает на WhatsApp, на каких языках (es/en/ru/uk), в какие часы? Сколько часов в неделю владелец готов тратить на маркетинг-операции?
- Бюджет на 90 дней: подписки (Bitrix24 Basic ~49–69 $/мес, CMP, Zadarma, Brevo), реклама (500–1500 €/мес), стоимость Claude-запусков — сколько допустимо?
- Где хостится сайт и БД, есть ли бэкапы; можно ли вынести node-кроны на VPS/GitHub Actions, чтобы не зависеть от настольного ПК?
- Тариф Bitrix24: проверить на тестовом портале, работает ли REST/вебхук на Free; нужны ли открытые линии и телефония сразу?
- Есть ли уже продажи/клиенты/отзывы (офлайн) — откуда взять первые 10–20 отзывов и фото доставок для городских страниц?
- Планируется ли линейка outdoor/terraza и nl/de-локали (голландцы/немцы — лидеры среди покупателей жилья) — в каком квартале?
- Согласен ли владелец с правилом: агент публикует автоматически только GBP-посты и пины, всё остальное — через еженедельный publish-slot?
