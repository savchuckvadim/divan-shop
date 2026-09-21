# Automation: раннер задач, скиллы, скрипты, расписание, зеркало Bitrix24

Слои автоматизации — ADR-0008 (node / claude / b24 / ext). Реестр расписаний — [docs/ops/crons.md](../ops/crons.md). Процесс управления проектом — [docs/ops/project-management.md](../ops/project-management.md).

## Implemented (проверено по коду 2026-09-21)

### Очередь задач

- `tasks/TASKS.md` (Queue / In progress / Done), формат в `tasks/README.md`: `status` (draft / ready / blocked / in-progress / done), `priority`, `area`, `source`, `created`, `estimate` (S/M/L), `ice`, `idea`, описание, `Acceptance:`; L дробится на `T-NNNa/b`.
- Отчёты `tasks/reports/YYYY-MM-DD.md` (раннер) и `tasks/reports/checkin-YYYY-MM-DD.md` (check-in).

### Скиллы (`.claude/skills`, реестр в `.claude/skills/README.md`)

- `task-add` — блок из чата в очередь по приоритету, `ice`/`idea`, `--push` в Bitrix24, строка в Planned области.
- `task-run` — headless: первая `ready` → ветка `task/T-NNN-slug` → `pnpm format/typecheck/lint` (+ dev smoke при наличии БД) → ff-merge в `main` → Done с датой/коммитом → шаг 6 `docs-sync` → отчёт → шаг 8 `b24-tasks-sync --push` → Telegram. Не более одной задачи за запуск; никогда `git push`/`reset --hard`/правка `.env*`.
- `seo-research` — SERP-снимки, профили конкурентов, `keywords.md`, датированный отчёт, draft-задачи с `source: seo-research`.
- `idea` — структурированное обсуждение на базе `docs/features` + strategy + decisions + HISTORY → `docs/ideas/YYYY-MM-DD-slug.md` → задачи → зеркало; ADR при изменении URL/локали/схемы/канала.
- `docs-sync` — после done: Planned → Implemented в `docs/features/<area>.md` (дата + коммит), запись в `docs/HISTORY.md` при ловушке, указатели (`tasks/README.md`, `docs/README.md`, `CLAUDE.md`, `crons.md`, реестр скиллов), проверка ADR, список known drift.
- `project-checkin` — сверка git ↔ TASKS.md ↔ docs/features ↔ Bitrix24 ↔ ideas ↔ ADR ↔ crons, отчёт `checkin-*.md`, 2–3 следующие задачи с именами веток, draft-задачи на дрейф, Telegram; секция «Known drift» поддерживается в самом скилле.
- Headless-права: allowlist в `.claude/settings.json` (Read/Edit/Write/Glob/Grep/WebFetch/WebSearch, `pnpm`, `npx`, `node`, безопасный `git`; deny `git push`, `reset --hard`, `clean`, `rm -rf`, `docker`, чтение/правка `.env*`, `settings.json`, `scripts/*.ps1`).

### Скрипты (`scripts/`)

- `daily-agent.ps1 [-Skill task-run|seo-research] [-MaxTurns 200]` — грузит `.env.automation` в process env, запускает `claude -p "/<skill>" --permission-mode acceptEdits`, лог в `logs/<skill>-<stamp>.log`, при ненулевом выходе шлёт Telegram.
- `install-schedule.ps1 [-DailyAt "09:00"] [-Remove]` — регистрирует Windows Scheduled Tasks «DivanShop Daily Agent» (ежедневно 09:00, task-run), «DivanShop SEO Research» (пн 08:00) и «DivanShop Project Checkin» (пт 08:00); `daily-agent.ps1` принимает `-Skill task-run|seo-research|project-checkin` (2026-09-21).
- `ops/reset-dev-db.mjs` — сброс схемы `public` ЛОКАЛЬНОЙ базы (отказ для нелокальных хостов), когда drizzle push задаёт интерактивный вопрос «create or rename». `ops/backup.sh` — ночной дамп БД + медиа для прод-сервера.
- Деплой (2026-09-21): `apps/web/Dockerfile` (multi-stage, `output: "standalone"`, target `tools` для миграций/seed), `docker-compose.prod.yml` (postgres + web + caddy), `deploy/Caddyfile`, `docs/ops/deployment.md`; `PAYLOAD_DB_PUSH` переключает push-режим в проде.
- `telegram-notify.mjs --text | --file` — Bot API `sendMessage`, обрезка до 3900 символов; `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` из env или `.env.automation`; без токена exit 2.
- `pm/b24-tasks-sync.mjs --status | --push [--dry-run] | --close T-NNN [--comment file]` — парсит `TASKS.md` (id, title, section, status, priority, area, estimate, description, acceptance, markdown), карта `tasks/.b24-map.json` (git-ignored) пересобирается через `tasks.task.list` (`GROUP_ID` + `%TITLE` = `[T-`), создаёт `tasks.task.add` `[T-NNN] title` с описанием-блоком, синхронизирует `STATUS` (draft/ready → 2, in-progress → 3, blocked → 6 + комментарий, done → `tasks.task.complete` + комментарий с отчётом/коммитом) и `PRIORITY` (high → 2); комментарии `task.commentitem.add`; пауза 550 мс между вызовами; без `B24_WEBHOOK_URL` / `B24_TASKS_GROUP_ID` / `B24_RESPONSIBLE_ID` печатает `B24 not configured, skipping`, exit 0. Документация `scripts/pm/README.md`.
- Env-контракт: `.env.automation.example` (Telegram + B24), реальный `.env.automation` git-ignored.

### Payload jobs

- `payload.config.ts` → `jobs.access.run`: залогиненный пользователь или `Authorization: Bearer ${CRON_SECRET}`; `tasks: []` — очередь Payload-джобов пока пустая.

## Planned

- **T-012** (L → a–e) · `scripts/metrics/collect-all.mjs` + `config/metrics/targets.json`, снимки GSC / GA4 / CWV / Clarity / index-check в `data/metrics/`, `_manifest.json`, `metrics-healthcheck`; регистрация 06:00 в `install-schedule.ps1` и `crons.md`.
- **T-013** · скилл `/weekly-growth-review` (пн 07:30): `reports/weekly/`, `docs/kpi/dashboard.md`, 3–5 draft-задач с ICE.
- **T-015** · скилл `/daily-ops` (draft).
- **T-010** · скилл `/naming` + `scripts/check-name.mjs` (RDAP, хендлы, TMview).
- **T-016** · скилл `/content-brief`.
- **T-020** · `/social-pack` + `scripts/pinterest-publish.mjs` (draft, фаза 1).
- **T-017** · IndexNow-хук (см. site-core).
- **T-027** · проект в Bitrix24 и первый `--push` (владелец даёт `B24_*` в `.env.automation`).
- **T-029** · веб-версия базы знаний (рекомендация A из `project-management.md`).
- `cron-registry-lint` (вс 04:00) — сверка `crons.md` с планировщиком; скрипта нет.
- Перенос node-кронов с Windows Task Scheduler на VPS/GitHub Actions (ADR-0008) — после T-018.
- Лиды → Bitrix24 (`crm.item.add`, ретраи) — T-005d, см. [leads-and-account.md](./leads-and-account.md).

## Договорённости

- Новый крон = строка в `docs/ops/crons.md` до кода. Claude-запусков не больше лимита ADR-0008.
- Скрипты `scripts/*.mjs` — Node 20+, без зависимостей, читают `.env.automation` через общий паттерн `loadEnvFile` (как в `telegram-notify.mjs`), без ключей завершаются с понятным сообщением и exit 0 (кроме `telegram-notify`, у которого exit 2 — исторически).
- Внешние ID/URL/токены только в env; отчёты и доки упоминают ключи по имени.
