# Leads and account: лиды, формы, WhatsApp, ЛК с кодом скидки, CRM

Модель продаж — ADR-0007 (без оплаты на сайте: «связаться с менеджером» + «посмотреть в шоуруме и получить код на скидку» через ЛК). Лид — запись в Payload, зеркалится в Bitrix24 (ADR-0004). Подробности процесса: [docs/marketing/leads-and-crm.md](../marketing/leads-and-crm.md).

## Implemented (проверено по коду 2026-09-21)

- Каналы контакта на странице товара (T-023/T-024, 2026-09-21, COMMIT_PLACEHOLDER): основной CTA «Связаться с менеджером» (`product.contactManager`) → `ROUTES.contacts(locale, slug)` = `/{locale}/contacts?product={slug}#form`; второй CTA «Посмотреть в шоуруме и получить код на скидку» (`product.showroomCode`) → `ROUTES.register(locale, "product-{slug}")`; телефон текстовой ссылкой `tel:`. Телефон в шапке, соцсети и контакты в футере. Страница `contacts` создаётся seed'ом с формой `contact-manager` (блок `formBlock` имеет `id="form"`).
- **Личный кабинет с кодом скидки** (T-024, ADR-0007): `collections/customers.ts` — auth-коллекция (verify off, 5 попыток + блокировка 10 мин, JWT 7 дней, cookie `payload-token` Lax/secure по https), поля `name`, `phone`, `locale`, `discountCode` (`SHOW-XXXX`, генерируется в beforeChange с проверкой уникальности; field-access create/update только админ), `discountPercent` (из Site Settings `showroomDiscountPercent`, field-access админ), `consentPrivacyAt` (update админ), `consentMarketing`, `source`; доступ: create anyone, read/update своя запись или админ, delete админ. `collections/showroom-visits.ts` — `customer`, `preferredDate`, `preferredTime` (`VISIT_TIMES` из `shared/config/showroom.ts`), `note`, `product`, `status` (админ), `code` копируется из клиента; клиент создаёт только свои. `payload/access`: `authenticated` = только `users`, `isAdminUser`/`isCustomerUser`; `jobs.access.run` только для `users`.
- Роуты ЛК: `/{locale}/account` (редирект на login без сессии), `/account/login`, `/account/register?from=` — все noindex, `robots.txt` disallow `/*/account`. `features/auth`: server actions `register`/`login`/`logout` (Local API, httpOnly cookie; если вход после регистрации не удался — редирект на login), формы на `useActionState`, `AccountLink` в шапке (desktop + mobile), `LogoutButton`; `features/showroom-visit`: action `requestVisit` + форма; `entities/customer` (`getCurrentCustomer` через `payload.auth`, `server-only`); `pages/account-page` (код скидки, процент, список визитов, форма записи), `login-page`, `register-page`; словарь `account`. README: `modules/features/auth/README.md`. Писем нет (T-028).
- Формы: плагин `@payloadcms/plugin-form-builder` (`payload/plugins/index.ts`) — коллекции `forms` и `form-submissions` создаются плагином; блок `formBlock` на CMS-страницах и клиентская форма `features/cms-form` (POST `/api/form-submissions`, подтверждение message/redirect, словарь `form` на 4 локалях: `submit`, `submitting`, `error`, `required`, …). Спам-защиты, согласий, UTM-полей нет.
- Данные для CRM в Site Settings: `contacts.phone`, `contacts.email`, `contacts.address` (localized), `contacts.workingHours` (localized), `contacts.socials[]`.
- Пользователи: только коллекция `users` для админки (`auth: true`, доступ authenticated). Клиентского ЛК, регистрации, кодов скидки нет.
- Интеграции с Bitrix24 CRM в коде нет; в env-контракте зарезервировано имя `B24_WEBHOOK_URL` (используется зеркалом задач, см. [automation.md](./automation.md)).

## Planned

- **T-005** (L → a/b/c/d) · коллекция `leads` через `formSubmissionOverrides`: `locale`, `channel`, `utm_*`, `gclid`, `product_slug`, `page_url`, `source_code`, `consentAt/Text/Email/WhatsApp`, `ip`, `ga_client_id`, `b24LeadId`, `syncStatus`, `syncError`; hidden-поля из cookie первого визита (a); Turnstile + honeypot + rate limit (b); авто-подтверждение на языке лида (Resend/Brevo) + Telegram без ПД (c); хук `afterChange` → Bitrix24 `crm.item.add` с `originatorId='payload'` + `scripts/lead-sync-retry.mjs`, ключи только в `.env.automation` (d).
- **T-006** · `features/whatsapp-contact`: `WhatsAppButton` (`wa.me/{phone}?text=` локализованная фраза + код `[{locale}-{page}-{productSlug}]`), плавающая на всех страницах и в карточке товара; события `click_whatsapp`, `click_phone`, `click_directions`, `showroom_visit_request`, `view_item` в `dataLayer`; `docs/analytics-events.md`.
- **T-028** · email-адаптер (Resend/nodemailer): код скидки после регистрации, подтверждение визита, авто-ответ лиду; верификация email и сброс пароля.
- **T-030** · события `sign_up`, `showroom_visit_request`, `contact_manager_click` в `dataLayer`.
- Форма контактов не читает `?product=` (только ссылка) — вместе с T-005a.
- **T-007** · CTA «маршрут» / запись на визит на странице шоурума.
- **T-015** · `/daily-ops`: черновики ответов на лиды и отзывы на языке автора (draft, ждёт T-005 и решения по тарифу Bitrix24).
- **T-021** · поле `referrer` в `leads`, коллекция `partners` с промокодами (draft).
- Запись на визит (Bitrix24 Booking или Google Calendar) — по `leads-and-crm.md`, задачи нет.

## Договорённости

- Источник истины по лиду — Payload; Bitrix24 — рабочее место продаж (ADR-0004). Метрики воронки берутся из B24, метрики лидов и согласий — из Payload.
- Персональные данные не попадают в Telegram-уведомления и в репозиторий (отчёты, идеи, HISTORY).
- Любой новый канал контакта = событие в `docs/analytics-events.md` + строка в словарях на 4 локалях.
