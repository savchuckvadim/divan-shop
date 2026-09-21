# Leads and account: лиды, формы, WhatsApp, ЛК с кодом скидки, CRM

Модель продаж — ADR-0007 (без оплаты на сайте: «связаться с менеджером» + «посмотреть в шоуруме и получить код на скидку» через ЛК). Лид — запись в Payload, зеркалится в Bitrix24 (ADR-0004). Подробности процесса: [docs/marketing/leads-and-crm.md](../marketing/leads-and-crm.md).

## Implemented (проверено по коду 2026-09-21)

- Каналы контакта сейчас: кнопка `tel:` на странице товара (`modules/pages/product-page`, телефон из Site Settings `contacts.phone`, подпись `product.requestQuote`), телефон в шапке (`widgets/header/ui/header-client.tsx`), соцсети и контакты в футере (`widgets/footer`).
- Формы: плагин `@payloadcms/plugin-form-builder` (`payload/plugins/index.ts`) — коллекции `forms` и `form-submissions` создаются плагином; блок `formBlock` на CMS-страницах и клиентская форма `features/cms-form` (POST `/api/form-submissions`, подтверждение message/redirect, словарь `form` на 4 локалях: `submit`, `submitting`, `error`, `required`, …). Спам-защиты, согласий, UTM-полей нет.
- Данные для CRM в Site Settings: `contacts.phone`, `contacts.email`, `contacts.address` (localized), `contacts.workingHours` (localized), `contacts.socials[]`.
- Пользователи: только коллекция `users` для админки (`auth: true`, доступ authenticated). Клиентского ЛК, регистрации, кодов скидки нет.
- Интеграции с Bitrix24 CRM в коде нет; в env-контракте зарезервировано имя `B24_WEBHOOK_URL` (используется зеркалом задач, см. [automation.md](./automation.md)).

## Planned

- **T-002** · страница «Контакты» с формой «Заявка» (имя, телефон, согласие WhatsApp, сообщение); CTA товара «Узнать цену и сроки» → `/{locale}/contacts#form`, `tel:` вторым CTA.
- **T-005** (L → a/b/c/d) · коллекция `leads` через `formSubmissionOverrides`: `locale`, `channel`, `utm_*`, `gclid`, `product_slug`, `page_url`, `source_code`, `consentAt/Text/Email/WhatsApp`, `ip`, `ga_client_id`, `b24LeadId`, `syncStatus`, `syncError`; hidden-поля из cookie первого визита (a); Turnstile + honeypot + rate limit (b); авто-подтверждение на языке лида (Resend/Brevo) + Telegram без ПД (c); хук `afterChange` → Bitrix24 `crm.item.add` с `originatorId='payload'` + `scripts/lead-sync-retry.mjs`, ключи только в `.env.automation` (d).
- **T-006** · `features/whatsapp-contact`: `WhatsAppButton` (`wa.me/{phone}?text=` локализованная фраза + код `[{locale}-{page}-{productSlug}]`), плавающая на всех страницах и в карточке товара; события `click_whatsapp`, `click_phone`, `click_directions`, `showroom_visit_request`, `view_item` в `dataLayer`; `docs/analytics-events.md`.
- **Личный кабинет с кодом скидки** (ADR-0007): коллекция `customers` (auth, отдельно от `users`), регистрация/вход на `/{locale}/account`, персональный код для шоурума, статус визита; продажа фиксируется в Bitrix24 по коду — **в работе, пакет C**. После — T-ID здесь.
- **T-007** · CTA «маршрут» / запись на визит на странице шоурума.
- **T-015** · `/daily-ops`: черновики ответов на лиды и отзывы на языке автора (draft, ждёт T-005 и решения по тарифу Bitrix24).
- **T-021** · поле `referrer` в `leads`, коллекция `partners` с промокодами (draft).
- Запись на визит (Bitrix24 Booking или Google Calendar) — по `leads-and-crm.md`, задачи нет.

## Договорённости

- Источник истины по лиду — Payload; Bitrix24 — рабочее место продаж (ADR-0004). Метрики воронки берутся из B24, метрики лидов и согласий — из Payload.
- Персональные данные не попадают в Telegram-уведомления и в репозиторий (отчёты, идеи, HISTORY).
- Любой новый канал контакта = событие в `docs/analytics-events.md` + строка в словарях на 4 локалях.
