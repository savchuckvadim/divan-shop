# scripts/pm — зеркало задач в Bitrix24

`tasks/TASKS.md` остаётся источником истины. Скрипт `b24-tasks-sync.mjs` отражает очередь в проект (рабочую группу) Bitrix24, чтобы прогресс было видно на портале без чтения репозитория. Node 20+, без зависимостей.

## Настройка

Ключи только в `.env.automation` (git-ignored), пример в `.env.automation.example`:

| Ключ                 | Что это                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| `B24_WEBHOOK_URL`    | входящий вебхук с правом `task`, база вида `https://portal.bitrix24.eu/rest/1/xxxxxxxx/` (со слэшем в конце) |
| `B24_TASKS_GROUP_ID` | ID рабочей группы / проекта, куда складываются задачи                                                        |
| `B24_RESPONSIBLE_ID` | ID пользователя-ответственного для создаваемых задач                                                         |

Без любого из ключей скрипт печатает `B24 not configured, skipping` и завершается с кодом 0 — его можно вызывать из скиллов безусловно.

## Команды

```bash
node scripts/pm/b24-tasks-sync.mjs --status                  # таблица T-ID / local / B24 / link, "!" = расхождение
node scripts/pm/b24-tasks-sync.mjs --push [--dry-run]        # создать недостающие, подтянуть статус/приоритет/заголовок
node scripts/pm/b24-tasks-sync.mjs --close T-012 [--comment tasks/reports/2026-09-21.md]
```

## Как сопоставляются задачи

- Заголовок в Bitrix24: `[T-NNN] <title>`. Поиск по группе: `tasks.task.list` с `filter: { GROUP_ID, "%TITLE": "[T-" }` → карта `T-ID → id` пишется в `tasks/.b24-map.json` (git-ignored, восстанавливается при каждом запуске).
- Описание задачи = markdown-блок из `TASKS.md` целиком (поля, описание, Acceptance).
- Статусы: `draft` / `ready` → pending (2), `in-progress` → in progress (3), `blocked` → deferred (6) + комментарий с причиной из `- blocked:`, `done` → `tasks.task.complete` + комментарий с отчётом / коммитом / веткой.
- Приоритет: `high` → 2, `medium` → 1, `low` → 0.
- Задачи из секции **Done**, которых в Bitrix24 никогда не было, не создаются (печатается `skip`).

## REST-методы

Проверены по официальной документации (`b24-dev-mcp`): `tasks.task.list` (filter/select/order/start, ответ `result.tasks[]`, пагинация через `next`), `tasks.task.add` (`fields`, ответ `result.task.id`), `tasks.task.update` (`taskId`, `fields`), `tasks.task.complete` (`taskId`), `task.commentitem.add` (`TASKID`, `FIELDS.POST_MESSAGE`; метод помечен deprecated с tasks 25.700.0, но работает через вебхук — при отключении заменить на `tasks.task.comment.add` с той же сигнатурой в `createClient`).

Между запросами пауза 550 мс (лимит ~2 req/s на портал).

## Где вызывается

- `/task-add` — после вставки блока: `--push`.
- `/task-run` — шаг 8 «Mirror»: `--push` после переноса задачи в Done.
- `/project-checkin` — `--status` для сверки.
- Руками: `--close T-NNN --comment <файл>` если задачу закрыли вне раннера.
