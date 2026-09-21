# ADR-0004: Источник истины по лидам

**Статус:** accepted · 2026-09-21

## Context

Варианты: Bitrix24 как единственная база; только коллекция Payload; обе. На Free-тарифе B24 REST может быть недоступен; согласия по RGPD нужно хранить и доказывать; идемпотентность и ретраи проще на своей стороне.

## Decision

Лид = запись в коллекции Payload `leads` (через `formSubmissionOverrides` плюс WhatsApp/звонки, заведённые вручную или через вебхуки). Там же согласия (consentAt, consentText, каналы, IP), UTM/gclid, `ga_client_id`, source_code, статус синка. Хук `afterChange` зеркалит лид в Bitrix24 (`crm.item.add`, `originatorId='payload'`), `lead-sync-retry` дожимает. Bitrix24 — рабочее место продаж: стадии, роботы, задачи, NPS. Исходящие вебхуки B24 пишутся в `crm_events` в Payload.

## Consequences

- Метрики воронки берутся из B24, метрики лидов и согласий — из Payload; `collect-all` читает оба.
- Анонимизация по retention выполняется в обеих системах.
