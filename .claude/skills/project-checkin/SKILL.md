---
name: project-checkin
description: Reconcile git, tasks/TASKS.md, docs/features and the Bitrix24 mirror; summarise where the project stands and propose the next 2–3 tasks. Scheduled (weekly) or manual via /project-checkin. Read-only except for docs-sync follow-up tasks it may add as drafts.
---

# /project-checkin

You produce a short, honest state-of-the-project note and a proposal for what to do next. You do not implement anything. Output: `tasks/reports/checkin-YYYY-MM-DD.md` + Telegram summary.

## 1. Collect

```
git status --short
git log --oneline -30
git branch --list "task/*"
git log main..<branch> --oneline        # for every unmerged task/* branch
node scripts/pm/b24-tasks-sync.mjs --status
```

Read: `tasks/TASKS.md` (Queue / In progress / Done), the last 3 files in `tasks/reports/`, `docs/features/README.md` and each area file's Planned section, `docs/ideas/*.md` statuses, `docs/decisions/README.md`.

## 2. Reconcile (drift detection)

Check each pair and note every mismatch:

| Pair                      | Mismatch to flag                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| TASKS.md ↔ git            | Done task without `commit:`; commit hash not on `main`; `task/*` branch with commits but task not Done/blocked |
| TASKS.md ↔ docs/features  | Done task whose T-ID still sits in a Planned section; Implemented bullet whose paths no longer exist           |
| TASKS.md ↔ Bitrix24       | rows marked `!` in `--status`; tasks in B24 group with `[T-…]` titles that are not in TASKS.md                 |
| docs/ideas ↔ TASKS.md     | `accepted` idea older than 7 days without tasks; `converted` idea whose T-IDs are missing                      |
| docs/decisions ↔ TASKS.md | ADR marked "accepted, until T-NNN is done" whose task is Done but the ADR row still says so                    |
| docs/ops/crons.md ↔ repo  | cron `on` whose script/skill file does not exist; script under `scripts/` not in the registry                  |
| Known drift (below)       | still true? — remove entries that have been fixed                                                              |

Every mismatch that needs a docs edit becomes a `draft` task `docs-sync: <what>` with `source: project-checkin`, `area: dx`, `estimate: S`, or is fixed right away if it is a one-line change in docs (not in code, not in TASKS.md statuses).

## 3. Propose next 2–3 tasks

Pick from **Queue** (`ready`, top by priority) unless drift or a blocked task makes another order smarter. For each: T-ID, title, why now (link to `docs/strategy/targets.md` level or `operating-model.md` loop it serves), estimate, and the branch name the runner will create: `task/T-NNN-<kebab-slug>`. If the queue is empty or all `draft` → say what the owner must decide to unblock (questions listed in the blocks).

## 4. Write the report

`tasks/reports/checkin-YYYY-MM-DD.md`:

```md
# Check-in YYYY-MM-DD

## Состояние

- main: <hash> · <n> коммитов за 7 дней · ветки task/*: …
- очередь: <n> ready / <n> draft / <n> blocked · done за неделю: T-…, T-…
- Bitrix24: <n> задач в зеркале, <n> расхождений (или "не настроен")

## Дрейф

- … (или "не найден")

## Следующие задачи

1. T-NNN · … — branch `task/T-NNN-…` — почему сейчас
2. …

## Вопросы владельцу

- …
```

Commit: `chore(tasks): check-in YYYY-MM-DD`. Then:

```
node scripts/telegram-notify.mjs --file tasks/reports/checkin-YYYY-MM-DD.md
```

## Known drift

Persistent mismatches we know about and accept for now. `/docs-sync` removes a line when it is fixed; add a line when you find a new one you are not fixing.

- `CLAUDE.md` and `README.md` say default locale `ru`; ADR-0001 says `es` — until T-004 is done.
- `docs/strategy/targets.md` hero-model table and `research/seo/competitors.md` Market section are empty — owner input (T-001).
- `docs/ops/crons.md` lists many crons with status `phase0/1/2` whose scripts/skills do not exist yet; only `task-run` and `seo-research` are registered in `scripts/install-schedule.ps1`.
- `.env.automation.example` is matched by `.gitignore` (`.env.*`) — it is tracked only because of the explicit `!.env.automation.example` exception; keep the exception when editing `.gitignore`.
- `docs/features/*.md` Planned sections mention "пакет A/B/C" for work in flight outside the task queue; replace with T-IDs when those packages land.

## Rules

- Read-only for code. Never switch branches, never merge, never `git push`.
- Do not change task statuses in `tasks/TASKS.md` (that is the runner's or the owner's job); only add `draft` tasks.
- Never write portal IDs, URLs or tokens into the report.
