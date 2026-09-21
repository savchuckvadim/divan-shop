# ADR-0005: Ворота для платной рекламы

**Статус:** accepted · 2026-09-21

## Context

Мебель — самый дорогой лид в Google Ads (CPL ~121 USD) и один из худших CTR в Meta. Реклама на профиль без отзывов и фото сжигает бюджет. Предложения по старту расходились (30-й vs 60-й день).

## Decision

Meta Click-to-WhatsApp + Reels (15–25 €/день, радиус 30 км) включается только при: ≥20 отзывов GBP, ≥30 фото и 5 рилсов, WhatsApp Business с шаблонами на 4 языках, GA4 key events и Consent Mode проверены. Google Search узкий (бренд + «sofá cama Torrevieja / sofa shop Alicante») + PMax Store Goals (10–15 €/день) — не раньше 60-го дня и после Meta. Изменение бюджета >20% — только с одобрения владельца.

## Consequences

- `ads-report` включается вместе с рекламой; CAC по каналу сравнивается с `maxCAC` из targets.json.
