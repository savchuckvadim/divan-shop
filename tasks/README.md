# Работа по задачам

Очередь живёт в [TASKS.md](./TASKS.md). Задачи формулируем в чате с Claude (`/task-add …`) или руками по формату ниже. Раз в день по расписанию запускается `scripts/daily-agent.ps1`: Claude Code в headless-режиме берёт **одну** верхнюю задачу со статусом `ready`, делает её в отдельной ветке, гоняет проверки, вливает в `main` при зелёных проверках, пишет отчёт в `tasks/reports/` и шлёт сводку в Telegram.

## Формат задачи

```md
### T-012 · Короткий заголовок

- status: ready # draft | ready | blocked | in-progress | done
- priority: high # high | medium | low
- area: seo # seo | cms | ui | content | infra | dx
- source: chat # chat | seo-research | task-run | project-checkin | docs-sync
- created: 2026-09-21
- estimate: S # S (< 1 ч) | M (1-3 ч) | L (нужно дробить)
- ice: 8/6/7 = 21 # Impact / Confidence / Ease по 1–10, score = сумма; опционально для ready из чата, обязательно для draft из ревью
- idea: docs/ideas/2026-09-21-slug.md # опционально: откуда пришла задача

Что нужно сделать и зачем. Ссылки на файлы, страницы, конкурентов.

Acceptance:

- проверяемый критерий 1
- проверяемый критерий 2
```

Правила:

- `ready` берётся в работу, `draft` ждёт уточнения человеком, `blocked` содержит строку `- blocked: причина`.
- Порядок в секции **Queue** = приоритет. Раннер берёт первую `ready`.
- Задача размера `L` не берётся: раннер сначала дробит её на `S/M` подзадачи (`T-012a`, `T-012b`) и берёт первую.
- Всё, что агент сделал, лежит в ветке `task/T-012-slug` и слито в `main` fast-forward. Откатить = `git revert`.
- Отчёты: `tasks/reports/YYYY-MM-DD.md`, один файл на запуск; `tasks/reports/checkin-YYYY-MM-DD.md` — еженедельная сверка `/project-checkin`.
- После `done` раннер выполняет `/docs-sync`: задача переезжает из **Planned** в **Implemented** в `docs/features/<area>.md`; ловушки — в `docs/HISTORY.md`.

## Секции TASKS.md

- **Queue** — ожидают.
- **In progress** — одна задача во время запуска раннера.
- **Done** — с датой и хешем коммита, новые сверху.

## Зеркало в Bitrix24

Очередь отражается в проект Bitrix24 скриптом `scripts/pm/b24-tasks-sync.mjs` (описание в [scripts/pm/README.md](../scripts/pm/README.md)): задача → `[T-NNN] Заголовок`, статусы `ready/draft` → ожидает, `in-progress` → выполняется, `blocked` → отложена, `done` → завершена с комментарием. Источник истины — этот файл; на портале смотрят прогресс, но не редактируют. Соответствие `T-ID → id задачи` лежит в `tasks/.b24-map.json` (git-ignored, пересобирается из портала по префиксу заголовка). Доступы только в `.env.automation` (`B24_WEBHOOK_URL`, `B24_TASKS_GROUP_ID`, `B24_RESPONSIBLE_ID`); без них скрипт молча пропускает синк.

## Запуск руками

```powershell
pwsh scripts/daily-agent.ps1            # то же, что делает планировщик
claude /task-run                         # интерактивно, с вопросами
claude /seo-research                     # ресёрч конкурентов + задачи в очередь
claude /project-checkin                  # сверка git + очередь + доки + Bitrix24, что делать дальше
node scripts/pm/b24-tasks-sync.mjs --status   # таблица расхождений с Bitrix24
```
