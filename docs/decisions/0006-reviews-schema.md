# ADR-0006: Отзывы на сайте и разметка

**Статус:** accepted · 2026-09-21

## Context

Google не допускает self-serving `aggregateRating` для LocalBusiness/FurnitureStore; с 24.07.2026 требует раскрытия стимулов в разметке; Omnibus (Ley 11/2023) обязывает раскрывать, как проверяются отзывы. Стимулы за отзывы запрещены Google и RDL 24/2021.

## Decision

- Никаких стимулов за отзывы, никакого gating.
- На сайте только first-party отзывы по реальным заказам (коллекция `reviews`, привязка к сделке), пометка «reseñas verificadas de compradores», страница «Cómo verificamos las reseñas».
- Разметка `Review` + `aggregateRating` только на `Product` (минимум 3 отзыва), не на `FurnitureStore`.
- Google-отзывы показываются как виджет/цитаты без разметки.

## Consequences

- Коллекция `reviews`, форма после NPS, модерация человеком; JSON-LD Product расширяется при ≥3 отзывах.
