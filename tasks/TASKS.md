# Task queue

Формат и правила: [README.md](./README.md). Раннер берёт первую задачу из **Queue** со `status: ready`.

## Queue

### T-001 · Заполнить competitors.md для SEO-ресёрча

- status: draft
- priority: high
- area: seo
- source: chat
- created: 2026-09-21
- estimate: S

Человек указывает рынок, регионы, языки и 5–10 конкурентов в `research/seo/competitors.md`. Без этого `/seo-research` ищет конкурентов сам по seed-запросам, но точность ниже.

Acceptance:

- в `research/seo/competitors.md` заполнены секции Market и Competitors
- статус задачи переведён в done вручную

### T-002 · Страница «Контакты» с формой заявки

- status: ready
- priority: high
- area: cms
- source: chat
- created: 2026-09-21
- estimate: M

Нужна CMS-страница `contacts`, собранная из блоков: hero (low impact) с адресом и телефоном из Site Settings, блок `formBlock` с формой «Заявка» (имя, телефон, сообщение). Кнопка «Узнать цену и сроки» на странице товара должна вести на `/{locale}/contacts#form`, а не только на `tel:`.

Acceptance:

- в `payload/` есть seed или инструкция, как создать форму и страницу; либо страница создаётся скриптом `pnpm web seed:contacts`
- `ROUTES.contacts(locale)` добавлен и используется в product-page и header
- тексты формы во всех 4 локалях в словарях
- `pnpm typecheck && pnpm lint` зелёные

### T-003 · FAQ-блок для страниц (SEO: FAQPage schema)

- status: ready
- priority: medium
- area: seo
- source: chat
- created: 2026-09-21
- estimate: M

Добавить блок `faq` (массив вопрос/ответ, localized) в конструктор страниц и компонент, который рендерит `<details>` и JSON-LD `FAQPage`.

Acceptance:

- `payload/blocks/faq.ts` + `widgets/page-blocks/ui/faq-block.tsx`, зарегистрирован в `render-blocks.tsx` и в `pages` layout
- JSON-LD FAQPage валиден (проверить структуру по schema.org)
- `pnpm web generate` выполнен, типы обновлены

## In progress

## Done
