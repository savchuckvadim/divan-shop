# ADR-0007: Модель продаж на старте

**Статус:** proposed · 2026-09-21 · нужно решение владельца

## Context

От наличия чекаута зависят: LSSI ст. 27–28 (подтверждение заказа), платёжный провайдер (Redsys/Stripe/Bizum), интеграция SeQura/Aplazame, события GA4 (`purchase` vs `generate_lead`), Verifactu, обратная логистика возвратов. Онлайн-конверсия мебели 1,2–1,65%, шоурум закрывает 8–15%+.

## Decision (предложение)

Этап 1: сайт — лидогенерация и запись в шоурум; резерв модели через «reservar con señal» ссылкой на оплату (Stripe Payment Link / Bizum) без полноценного чекаута. Этап 2: чекаут после 50 продаж или по решению на quarterly-strategy.

## Consequences

- North Star = квалифицированные обращения; `generate_lead`/`showroom_visit_request` — key events.
- Merchant Center free listings работают и без чекаута (ссылка на карточку).
- Юр-страницы «Condiciones de compra» пишутся под этап 1, расширяются на этапе 2.
