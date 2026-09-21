# Реестр фич

Что в проекте **есть** (проверено по коду) и что **запланировано** (со ссылками на задачи). Один файл на область. Это первый документ, который читает Claude перед тем, как предлагать работу, и последний, который обновляется после того, как задача сделана (`/docs-sync`).

## Файлы

| Область                                        | Что покрывает                                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------------- |
| [site-core.md](./site-core.md)                 | монорепо, FSD-слои, i18n, `proxy.ts`, SEO-пайплайн (meta, hreflang, JSON-LD, sitemap) |
| [catalog.md](./catalog.md)                     | коллекции `products` / `categories`, страницы каталога, категории, товара             |
| [cms-pages.md](./cms-pages.md)                 | коллекция `pages`, hero, блоки, формы (form-builder), редиректы, live preview         |
| [design-system.md](./design-system.md)         | `packages/ui`: токены, примитивы, композиты                                           |
| [leads-and-account.md](./leads-and-account.md) | лиды, формы заявок, WhatsApp/звонок, ЛК с кодом скидки, Bitrix24 CRM                  |
| [automation.md](./automation.md)               | раннер задач, скиллы, скрипты (`scripts/`), расписание, зеркало задач в Bitrix24      |
| [marketing-ops.md](./marketing-ops.md)         | документы `docs/marketing`, ресёрч, крон-реестр маркетинга, контент-операции          |

## Правила

1. **Структура файла** — две обязательные секции:
   - `## Implemented (проверено по коду YYYY-MM-DD)` — только то, что реально есть в репозитории, с путями к файлам. Дата = когда кто-то перечитал код области и подтвердил список. Обновляя список, обновляй дату; не подтвердил — не трогай дату.
   - `## Planned` — строки вида `- **T-NNN** · заголовок — что изменится в этой области`. Ссылка на задачу в `tasks/TASKS.md`. Работа, которая идёт вне очереди (параллельные пакеты), помечается `в работе, пакет X` и заменяется T-ID, когда попадает в очередь.
   - Опционально `## Договорённости` — правила области, которых нет в CLAUDE.md.
2. **Implemented выводится из кода, не из задачи.** Если acceptance обещает сид-скрипт, а в диффе его нет — в Implemented он не попадает.
3. **Переезд Planned → Implemented** делает `/docs-sync` после `done`: строка удаляется из Planned, в Implemented появляется буллет с `(T-NNN, <hash>)`.
4. **Тронул область — обнови файл** в той же ветке. Ревьюер (`/project-checkin`) сверяет Done-задачи с Planned-секциями и заводит `docs-sync`-задачи на расхождения.
5. **Никаких секретов и внешних ID**: имена env-ключей — да, значения — нет.
6. Если область разрослась и план стал больше справочника — вынести план в `<area>.tasks.md`, оставив в `<area>.md` только Implemented и ссылку.

## Карта путей → область

Используется `/docs-sync`, чтобы по `git diff --stat` понять, какие файлы реестра обновлять.

| Путь                                                                                                                                                                                                                                                                                                                                                                                                                  | Область           |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `apps/web/src/modules/shared/**`, `apps/web/src/proxy.ts`, `apps/web/src/app/sitemap.ts`, `robots.ts`, `apps/web/src/app/(frontend)/[locale]/layout.tsx`, `apps/web/next.config.ts`, `packages/{eslint,prettier,typescript}-config`, `turbo.json`, `pnpm-workspace.yaml`                                                                                                                                              | site-core         |
| `apps/web/src/payload/collections/{products,categories}.ts`, `apps/web/src/modules/entities/{product,category}/**`, `apps/web/src/modules/pages/{catalog-page,product-page}/**`, `apps/web/src/modules/widgets/{product-grid,breadcrumbs}/**`, `apps/web/src/app/(frontend)/[locale]/{catalog,product}/**`                                                                                                            | catalog           |
| `apps/web/src/payload/collections/{pages,media}.ts`, `apps/web/src/payload/{blocks,fields,globals}/**`, `apps/web/src/payload/plugins/**`, `apps/web/src/modules/entities/{page,site-settings}/**`, `apps/web/src/modules/pages/{cms-page,not-found-page}/**`, `apps/web/src/modules/widgets/{hero,page-blocks,header,footer}/**`, `apps/web/src/modules/features/cms-form/**`, `apps/web/src/app/(frontend)/next/**` | cms-pages         |
| `packages/ui/**`                                                                                                                                                                                                                                                                                                                                                                                                      | design-system     |
| будущие `apps/web/src/payload/collections/{leads,customers}.ts`, `apps/web/src/modules/features/{whatsapp-contact,lead-form,account}/**`, `apps/web/src/app/(frontend)/[locale]/account/**`                                                                                                                                                                                                                           | leads-and-account |
| `scripts/**`, `.claude/**`, `tasks/README.md`, `docs/ops/crons.md`, `docs/ops/project-management.md`, `docs/HISTORY.md`, `docs/ideas/**`                                                                                                                                                                                                                                                                              | automation        |
| `docs/marketing/**`, `docs/strategy/**`, `research/**`, `docs/content/**`, `content/**`                                                                                                                                                                                                                                                                                                                               | marketing-ops     |

Путь не подходит ни под одну строку → добавить строку сюда (и, если нужно, новый файл области).
