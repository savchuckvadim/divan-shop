# ADR-0002: Городские страницы

**Статус:** accepted · 2026-09-21

## Context

Два исследования предложили разные URL: `/{locale}/showroom-delivery/{city}` и `/es/sofas-torrevieja`. Конкуренты ранжируются с URL вида `/sofas-alicante/`, `/tiendas-de-sofas/torrevieja/`. Шаблонные location pages попали под core update марта 2026; «выделенная страница под услугу» — фактор #1 локальной органики.

## Decision

Коллекция `locations` в Payload (город, slug по локали, зона и сроки/стоимость доставки, FAQ, отзывы и фото из города, популярные модели, ближайший шоурум, JSON-LD). URL: `/es/sofas-en-{city}`, `/en/sofas-{city}`, `/ru/divany-{city}`, `/uk/dyvany-{city}`; страница шоурума `/es/tienda-de-sofas-alicante`. Не более 5–7 городов: Alicante (шоурум), Torrevieja, Orihuela Costa, Elche, Benidorm, Santa Pola/Guardamar. Никаких страниц по урбанизациям. Запросы «тип + город» закрываются блоками на городской странице со ссылками на категории, а не отдельными URL.

## Consequences

- Добавляется `ROUTES.location(locale, slug)`, sitemap и hreflang для коллекции, генерация статических путей, ревалидация.
- Каждая страница требует уникальных данных (доставки, отзывы, фото города) — без них не публикуется.
