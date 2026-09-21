---
name: task-add
description: Add a task to tasks/TASKS.md from a chat description. Use when the user says "добавь задачу", "запиши в очередь", "надо сделать …" in the context of the task queue, or invokes /task-add.
---

# /task-add

Turn what the user described into a task block in `tasks/TASKS.md`.

1. Read `tasks/README.md` (format) and `tasks/TASKS.md` (existing IDs, ordering).
2. Next ID = max existing `T-NNN` + 1.
3. Draft the block: title, `priority`, `area`, `estimate`, `ice` (Impact/Confidence/Ease 1–10 → `ice: 8/6/7 = 21`), description with _why_, and 2–4 **verifiable** acceptance criteria. Reuse names from CLAUDE.md and `docs/features/<area>.md` (layers, ROUTES, dictionaries, collections) so the runner has no ambiguity. If the task comes from a discussion, add `- idea: docs/ideas/YYYY-MM-DD-<slug>.md`.
4. If the request is unclear (no way to write a verifiable acceptance) set `status: draft` and list the open questions in the block under `Questions:`; otherwise `status: ready`.
5. If `estimate: L`, split into `T-NNNa`, `T-NNNb`… right away.
6. Insert into **Queue** according to priority (high above medium above low; among equals append at the end of its priority group).
7. Mirror to Bitrix24 (no-op without `B24_*` in `.env.automation`; never write portal IDs or URLs into the repo):
   ```
   node scripts/pm/b24-tasks-sync.mjs --push
   ```
8. Add a line under **Planned** in the affected `docs/features/<area>.md` linking the new T-ID.
9. Show the user the final block and where it landed. Do not start the work unless asked.
