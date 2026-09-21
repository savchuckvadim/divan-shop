---
name: docs-sync
description: Bring documentation in line with code after a task is done — move items from Planned to Implemented in docs/features, log traps in docs/HISTORY.md, fix pointers in tasks/README/CLAUDE.md, and check the known-drift list. Run by /task-run (step 6), by /project-checkin when drift is found, or manually via /docs-sync [T-NNN | area].
---

# /docs-sync

Docs are the source of truth for "what exists" (`docs/features`) and "what we learned" (`docs/HISTORY.md`). This protocol keeps them true after code changes. It edits docs only; never code.

## Inputs

- What changed: the task block (`tasks/TASKS.md`, Done section, with `commit:`), `git show --stat <commit>` or `git diff main...<branch> --stat`, the report in `tasks/reports/`.
- `docs/features/README.md` — which area owns which paths (Folder → area table).
- `docs/HISTORY.md` — existing entries (do not duplicate a trap).

## Procedure

1. **Map paths → areas.** From the diff stat, list touched paths and resolve each to an area via the table in `docs/features/README.md`. Unmapped path → add a row to that table (and mention it in the summary).

2. **Update `docs/features/<area>.md` for each touched area.**
   - In **Planned**: find the line(s) with this T-ID. Remove them, or, if only part is done, rewrite the line to what remains.
   - In **Implemented**: add a bullet describing what now exists, with file paths as they are in the repo (collections, ROUTES keys, dictionary keys, components, scripts). Bullet ends with `(T-NNN, <short hash>)`.
   - Change the heading date: `## Implemented (проверено по коду YYYY-MM-DD)` → today. The date is a claim: you re-read the area's code paths listed in the file and they still match. If you did not verify a bullet, do not touch the date.
   - If the task changed a public interface named in another area's doc (a `ROUTES` key, a dictionary, a global), update that doc too.

3. **HISTORY entry if a trap was hit.** A trap = something that cost more than 15 minutes because of a non-obvious cause (build/runtime error, framework gotcha, data shape, tool behaviour). Prepend to `docs/HISTORY.md` in the format symptom → cause → fix → "Ловушка на будущее", dated today, with the commit hash. No entry for routine work.

4. **Structure pointers.** If the task added/moved a folder, script, skill or doc section, update the pointers: `tasks/README.md` (queue format, commands), `docs/README.md` (section table), `CLAUDE.md` (repository structure block, commands, "Task workflow & automation"), `.claude/skills/README.md` (skills registry), `docs/ops/crons.md` (if a schedule was added — that registry is the only place). Keep CLAUDE.md compact: one line per fact.

5. **ADR check.** If the change touched URL scheme, locales, data schema or a customer channel and there is no ADR — write one (`docs/decisions/NNNN-<slug>.md` + README row) or add a `draft` task `docs: ADR for …` with `source: docs-sync`.

6. **Known drift list.** Open `.claude/skills/project-checkin/SKILL.md` § "Known drift". For each item: if this task fixed it, delete the line; if it still stands, leave it. If you discovered a new persistent mismatch you are not fixing now, add a line there (one sentence, with the path).

7. **Commit** with the task ID: `docs(features): sync <area> after T-NNN`. If run from `/task-run`, this goes into the same branch before merge; if run manually, commit on `main` (docs only).

## Output

A ≤10-line summary: areas updated, Planned → Implemented moves, HISTORY entry yes/no, pointer files touched, drift list changes. In `/task-run` this summary goes into the report under "## Docs".

## Rules

- Implemented is derived from code, not from the task text: if the acceptance says "seed script exists" but the diff has no script, do not write it.
- Never remove a Planned line for a task that is `blocked`; annotate it instead: `(blocked: reason)`.
- Never write portal IDs, URLs or tokens (Bitrix24, Notion, Telegram) into docs.
- Do not edit `tasks/TASKS.md` here except for adding `draft` follow-up tasks with `source: docs-sync`.
