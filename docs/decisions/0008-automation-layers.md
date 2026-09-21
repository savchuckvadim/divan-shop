# ADR-0008: Слои автоматизации

**Статус:** accepted · 2026-09-21

## Context

Ресёрч предложил ~70 кронов, часть с шагом 5–15 минут, все через `claude -p` на настольном Windows. Это нереализуемо по надёжности (сон ПК) и стоимости (каждый запуск — отдельная сессия с лимитами).

## Decision

- **node** — сбор данных, ретраи, фиды, проверки; целевое место VPS или GitHub Actions cron; результаты коммитятся в репо.
- **claude** — не более: `task-run` (ежедневно), `daily-ops` (ежедневно), `weekly-growth-review` (пн), `seo-research` (пн, потом раз в 2 недели), `content-brief-and-draft` (ср), `social-pack` (пт), `monthly-retro` (1-е), `quarterly-strategy`. Запуск с `--output-format json` для учёта `total_cost_usd`.
- **b24** — SLA-алерты, напоминания о визитах, NPS-триггеры, stale-deals — роботы Bitrix24.
- **ext** — UptimeRobot, Merchant Center scheduled fetch.
- Реестр `docs/ops/crons.md` — единственный источник истины; `cron-registry-lint` еженедельно.

## Consequences

- `scripts/install-schedule.ps1` регистрирует только claude-запуски и, временно, node-кроны до переезда на VPS.
- Стоимость автоматизации входит в CAC.
