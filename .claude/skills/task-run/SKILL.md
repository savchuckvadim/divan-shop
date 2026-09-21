---
name: task-run
description: Daily autonomous runner. Takes the first ready task from tasks/TASKS.md, implements it on a branch, runs gates, merges, writes a report and sends it to Telegram. Invoked by scripts/daily-agent.ps1 or manually via /task-run.
---

# /task-run

You run unattended. Nobody answers questions. Prefer finishing something small and verified over starting something big.

## 0. Preconditions

- `git status` must be clean and the branch must be `main`. If not: do not touch the working tree, write the situation to the report, notify Telegram, stop.
- Today's date `YYYY-MM-DD` → report path `tasks/reports/YYYY-MM-DD.md`. If the report already exists, append a `## Run 2` section instead of overwriting.

## 1. Pick a task

- Read `tasks/README.md` and `tasks/TASKS.md`.
- Take the first block in **Queue** with `status: ready`. Skip `draft` and `blocked`.
- If none → report "Очередь пуста" + list of drafts/blocked with their reasons, notify Telegram, stop.
- If `estimate: L` → split it into `S/M` sub-tasks (`T-NNNa`, `T-NNNb`, …) with their own acceptance, replace the block, commit `chore(tasks): split T-NNN`, then take the first sub-task.

## 2. Start

- Move the block to **In progress**, set `status: in-progress`, add `- started: YYYY-MM-DD`.
- `git switch -c task/T-NNN-<kebab-slug>`.
- Commit the queue change: `chore(tasks): start T-NNN`.

## 3. Implement

- Follow `CLAUDE.md` strictly (FSD layers, dictionaries for every UI string in all locales, `ROUTES`, no barrel leaks of server code into client components).
- After any change under `apps/web/src/payload/` run `pnpm web generate`.
- Keep the change focused on the task's acceptance criteria. Anything extra you notice goes into **Queue** as a new `draft` task with `source: task-run`, not into this branch.
- Budget: if after a reasonable effort the acceptance cannot be met, stop implementing, go to step 5 with `blocked`.

## 4. Gates

```
pnpm format
pnpm typecheck
pnpm lint
```

All must pass. If `apps/web/.env` exists and Postgres answers, additionally start `pnpm web dev` in the background, `curl` the pages touched by the task (expect 200), then stop it. Record what was verified and what was not.

## 5. Finish

- Green: commit with a conventional message that mentions the ID (`feat(seo): FAQ block (T-003)`), `git switch main`, `git merge --ff-only task/T-NNN-…`. If ff-only fails, rebase the branch on main and retry once; otherwise leave the branch unmerged and mark the task `blocked` with the reason.
- Move the block to **Done** (top), `status: done`, add `- done: YYYY-MM-DD`, `- commit: <short hash>`, `- branch: task/T-NNN-…`.
- Not green / blocked: commit whatever is safe on the branch, `git switch main`, return the block to the top of **Queue** with `status: blocked` and `- blocked: <one-line reason + what a human should decide>`.

## 6. Docs sync

Run the protocol in `.claude/skills/docs-sync/SKILL.md` for every area the diff touched (path → area map in `docs/features/README.md`): move the T-ID from **Planned** to **Implemented** in `docs/features/<area>.md` with today's date and the commit hash, prepend a `docs/HISTORY.md` entry if a trap cost you time, fix pointers (`tasks/README.md`, `docs/README.md`, `CLAUDE.md`, `docs/ops/crons.md`) if structure changed, and reconcile the "Known drift" list in `.claude/skills/project-checkin/SKILL.md`. Do it on the task branch before the merge when the task is green (then merge); on `main` as a docs-only commit when the task ended `blocked` but shipped something. Commit: `docs(features): sync <area> after T-NNN`. Put the ≤10-line summary into the report under `## Docs`.

## 7. Report

Write `tasks/reports/YYYY-MM-DD.md`:

```md
# Отчёт YYYY-MM-DD

**Задача:** T-NNN · Заголовок — done | blocked
**Ветка/коммит:** task/T-NNN-slug · abc1234

## Что сделано

- …

## Проверки

- typecheck ✓ · lint ✓ · format ✓ · dev smoke: /ru/contacts 200

## Docs

- docs/features/cms-pages.md: T-NNN → Implemented · HISTORY: нет · drift: —

## Не сделано / вопросы к человеку

- …

## Очередь

- следующая: T-004 · …
- draft/blocked: T-001 (нужен competitors.md)
```

Commit: `chore(tasks): report YYYY-MM-DD (T-NNN)`.

## 8. Mirror

```
node scripts/pm/b24-tasks-sync.mjs --push
```

Pushes the task's new status (done → completed with a comment linking the report and commit; blocked → deferred with the reason) to the Bitrix24 project. It is a no-op without `B24_*` in `.env.automation`; never edit that file. If it fails, mention it in the final output and move on.

## 9. Notify

```
node scripts/telegram-notify.mjs --file tasks/reports/YYYY-MM-DD.md
```

If the script fails (no token), say so in the final output; do not retry more than once.

## Never

- Never run `git push`, `git reset --hard`, `git clean`, or delete branches.
- Never edit `.env*`, `.claude/settings.json`, or the scheduled task scripts.
- Never do more than one task per run.
