---
name: task-add
description: Add a task to tasks/TASKS.md from a chat description. Use when the user says "добавь задачу", "запиши в очередь", "надо сделать …" in the context of the task queue, or invokes /task-add.
---

# /task-add

Turn what the user described into a task block in `tasks/TASKS.md`.

1. Read `tasks/README.md` (format) and `tasks/TASKS.md` (existing IDs, ordering).
2. Next ID = max existing `T-NNN` + 1.
3. Draft the block: title, `priority`, `area`, `estimate`, description with _why_, and 2–4 **verifiable** acceptance criteria. Reuse names from CLAUDE.md (layers, ROUTES, dictionaries) so the runner has no ambiguity.
4. If the request is unclear (no way to write a verifiable acceptance) set `status: draft` and list the open questions in the block under `Questions:`; otherwise `status: ready`.
5. If `estimate: L`, split into `T-NNNa`, `T-NNNb`… right away.
6. Insert into **Queue** according to priority (high above medium above low; among equals append at the end of its priority group).
7. Show the user the final block and where it landed. Do not start the work unless asked.
