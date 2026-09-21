# Локальное SEO и Google Business Profile

Источник: `research/market/2026-09-21/local-seo.md` (Whitespark 2026, справка Google, политика отзывов). Для шоурума это половина трафика.

## Что решает ранжирование в Local Pack (Whitespark 2026)

Топ-10 факторов: 1) первичная категория GBP, 2) близость к точке поиска, 3) ключевые слова в названии, 4) адрес в городе поиска, 5) открыт в момент поиска, 6) рейтинг, 7) показ адреса, 8) доп. категории, 9) число отзывов с текстом, 10) правильный пин. Веса: GBP ~25%, отзывы ~20%, поведенческие ~18%, on-page ~15%, ссылки ~12%, цитирования ~7%.

Порядок вложения времени: категории/название/адрес/часы → поток отзывов → фото и посты → сайт (страница шоурума + городские) → ссылки → цитирования.

## Чеклист профиля

- **Название** = вывеска. Заложить слово «Sofás» в торговое имя («{Brand} Sofás»), город не добавлять. Вывеску повесить до создания профиля: видеоверификация требует один непрерывный дубль (улица и номер, вывеска, интерьер, доказательство контроля). С мая 2026 есть верификация звонком/SMS/WhatsApp.
- **Категории**: первичная «Tienda de sofás» (Sofa store), вторичные «Tienda de muebles», «Tienda de artículos para el hogar»; проверить точные названия в пикере ES.
- **Гибридный профиль**: адрес шоурума + до 20 зон обслуживания: Alicante, Sant Joan, El Campello, Mutxamel, San Vicente, Elche, Santa Pola, Guardamar, Torrevieja, Orihuela Costa, Pilar de la Horadada, Villajoyosa, Benidorm, Altea, Calpe, Alcoy, Murcia (≤2 ч езды). Те же города в `areaServed` JSON-LD.
- **Часы** и праздничные часы (календарь Comunidad Valenciana + местные), WhatsApp в разделе Chat (`wa.me/34...?text=[gbp]`), ссылка на сайт с `?utm_source=google&utm_medium=gbp` на `/es/`, ссылка на запись (booking link).
- **Описание** (750 знаков, ES) с ключевыми FAQ: доставка по Коста-Бланке, сроки, языки обслуживания, вывоз старого дивана.
- **Товары**: 10–20 hero-моделей руками сразу; затем Merchant Center free local listings (фактор #70 против #136 у ручных). Local Inventory App/Pointy в Испании недоступен.
- **Фото**: 30+ на старте, далее 3–5 в неделю (фасад с вывеской, зал, модели, доставки в конкретный город с согласия). С мая 2026 сортировка «сначала новые», окно свежести 30 дней.
- **Посты**: 1–2 в неделю (Update живёт 7 дней, Offer/Event до даты), чередовать es/en, ru/uk точечно; нативное планирование есть с апреля 2026. Ротация офферов раз в месяц.
- **Q&A закрыт** (03.12.2025), его заменил Gemini «Ask Maps», который читает сайт, отзывы и описание → FAQ живёт на сайте с FAQPage-схемой (T-003).

## Отзывы: только законно

- Запрещены любые стимулы, gating, квоты сотрудникам, просьбы упоминать имя сотрудника (Google с 17.04.2026), покупка отзывов (RDL 24/2021, до 4% оборота). Google с 24.07.2026 требует раскрытия стимулов и в разметке.
- Разрешено просить всех клиентов без стимулов: день 3 после доставки NPS → промоутерам ссылка/QR; карточка с QR в каждой доставке и на кассе; просьба о фото дивана в интерьере («отзывы с фото» фактор #43).
- Ответ на 100% отзывов ≤48 ч на языке автора (шаблоны es/en/ru/uk, вычитанные носителями; агент готовит черновик, человек публикует; с мая 2026 ответы модерируются).
- На сайте: только first-party отзывы по заказам с пометкой «reseñas verificadas de compradores» и страницей «cómo verificamos»; `aggregateRating` о самом магазине в FurnitureStore-схему не ставить (ADR-0006).
- Цели: 2–4 отзыва/нед, рейтинг ≥4,7, ≥70% с текстом, ≥25% с фото, конверсия запрос→отзыв ≥15%. Бенчмарк конкурента: sofasalicante.com — 547 отзывов.

## Сайт

- Страница шоурума (`/es/tienda-de-sofas-alicante` и зеркала) с JSON-LD `FurnitureStore`: `@id`, name, image, url, telephone, priceRange «€€», address, geo, openingHoursSpecification, areaServed, hasMap, sameAs (GBP, Instagram, Facebook). Одна сущность, одна `@id` на всех локалях. На товарах `Product` + `Offer` с `availableAtOrFrom` → `@id` магазина.
- **Городские страницы** (ADR-0002): 5–7 штук, не 50. Alicante (шоурум), Torrevieja, Orihuela Costa, Elche, Benidorm, Santa Pola/Guardamar. Каждая уникальна: сроки и цена доставки/подъёма, расстояние и маршрут от шоурума, отзывы и фото доставок из этого города, популярные модели у покупателей новостроек/арендодателей, FAQ, карта, ссылка из навигации. Шаблонные location pages попали под core update марта 2026. Для Torrevieja/Orihuela Costa приоритет en/ru/uk.
- Коллекция `Locations` в Payload: город, зона доставки, срок, стоимость, FAQ, ближайший шоурум, отзывы.

## Цитирования (разово, затем квартальный аудит)

25–35 листингов с идентичным NAP: Bing Places (импорт из GBP), Apple Business Connect, Páginas Amarillas, Cylex, Yelp.es, 11811, Opendi, HotFrog, Europages, Informa, Foursquare, Facebook, Habitissimo, Houzz.es, thinkSPAIN, Costa Blanca Forum, expat.com, britishbusinesspagesinspain.es, talkquesada.com, Cámara de Comercio Alicante. Реестр в `research/local/citations.md`.

## Гео-грид и метрики

Раз в 2 недели гео-грид 7×7 над Alicante и Torrevieja для 6–8 запросов (Whitespark geo-grid от $10, localseotool.io free, Local Falcon $25); результаты в `research/local/rank-grid/`. Цель: средняя позиция ≤3 в радиусе 10 км от шоурума.

GBP API (Reviews v4, LocalPosts v4, Performance v1): заявка Basic API Access на 60-й день после верификации, квота 300 QPM, бесплатно. До этого — нативный планировщик и ручной экспорт.
