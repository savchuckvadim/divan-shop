---
name: idea
description: Structured discussion of an idea against the project's documented state, written to docs/ideas/, then turned into tasks and mirrored to Bitrix24. Use when the owner brainstorms, asks "а что если…", "давай обсудим", "есть идея", or invokes /idea.
---

# /idea

Goal: no idea from chat is lost, and every accepted idea becomes tasks that fit the documented architecture. Output is a file in `docs/ideas/`, then task blocks in `tasks/TASKS.md`. Chat is for clarifying, files are for remembering.

## 0. Load context (always, before answering)

- `docs/features/README.md` and the `docs/features/<area>.md` files the idea touches — what is **Implemented** and what is already **Planned** (do not propose what is already queued; link the T-ID instead).
- `docs/strategy/operating-model.md` §1–3 and `docs/strategy/targets.md` — does the idea move the sales hypothesis (leads → visits → sales)?
- `docs/decisions/README.md` — does an ADR already settle this? Respect accepted ADRs; propose a superseding ADR instead of silently contradicting one.
- `tasks/TASKS.md` — existing IDs, what is blocked and why.
- `docs/HISTORY.md` — traps in the same area.

## 1. Clarify with the owner

Ask at most 3 questions, only those that change the decision (who is it for, what is the measurable outcome, which constraint is hard). If the owner has answered these in the same message, do not ask again. Write a one-paragraph restatement of the problem and get a nod before drafting options.

## 2. Write `docs/ideas/YYYY-MM-DD-<slug>.md`

Copy `docs/ideas/_template.md`. Fill:

- **Проблема** with evidence (numbers from `data/`, quotes, report links) or an explicit "гипотеза без данных".
- **Контекст**: concrete file paths from `docs/features` (collections, ROUTES, dictionaries, blocks) so the options are grounded in what exists.
- **Варианты**: 2–3, each with S/M/L and what it changes (URL scheme, locales, schema, channel → ADR required).
- **Решение**: leave empty until the owner decides. Status `discussed`.

Commit: `docs(ideas): <slug>`.

## 3. Decide

Present the options in chat in ≤15 lines with your recommendation. When the owner says yes/no:

- yes → `status: accepted`, fill **Решение** and **Влияние** (which `docs/features/<area>.md` sections move from Planned to Implemented once done).
- no → `status: rejected` with the reason and "вернуться, если …".
- if the decision changes URL structure, locales, data schema or a customer channel → create `docs/decisions/NNNN-<slug>.md` (Context / Decision / Consequences, status `accepted`) and add the row to `docs/decisions/README.md`; reference it in the idea's `adr:` field.

## 4. Generate tasks (accepted only)

Follow `.claude/skills/task-add/SKILL.md` for each task: verifiable acceptance, `source: chat`, `- idea: docs/ideas/YYYY-MM-DD-<slug>.md`, `ice:` scored (Impact/Confidence/Ease 1–10 → sum). Split L into `T-NNNa/b/c`. Insert by priority. Then:

```
node scripts/pm/b24-tasks-sync.mjs --push
```

(no-op without env). Set the idea to `status: converted`, list the T-IDs under **Задачи**. Add a line to **Planned** in each affected `docs/features/<area>.md` linking the new T-IDs.

Commit: `docs(ideas): <slug> → T-NNN..T-NNN`.

## 5. Report

Show the owner: idea path, status, task IDs and where they landed in the queue, ADR if any. Do not start implementation unless asked — that is `/task-run`.

## Rules

- Never write Bitrix24 / Notion IDs, URLs or tokens into any file; the sync script reads them from `.env.automation`.
- Never mark an idea `accepted` on your own judgement — only on an explicit owner decision in chat.
- One idea per file; a second discussion of the same idea appends a dated section instead of a new file.
