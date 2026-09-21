#!/usr/bin/env node
/**
 * Mirrors tasks/TASKS.md into a Bitrix24 workgroup (tasks module, incoming webhook).
 *   node scripts/pm/b24-tasks-sync.mjs --status            table: T-ID / local / B24 / link
 *   node scripts/pm/b24-tasks-sync.mjs --push [--dry-run]  create missing tasks, sync status/priority
 *   node scripts/pm/b24-tasks-sync.mjs --close T-012 [--comment tasks/reports/2026-09-21.md]
 * Env (from process env or .env.automation in the repo root):
 *   B24_WEBHOOK_URL      incoming webhook base, e.g. https://portal.bitrix24.eu/rest/1/token/
 *   B24_TASKS_GROUP_ID   workgroup (project) id that holds the mirrored tasks
 *   B24_RESPONSIBLE_ID   user id assigned to created tasks
 * Without env the script prints "B24 not configured, skipping" and exits 0.
 * Mapping T-ID -> Bitrix task id lives in tasks/.b24-map.json (git-ignored) and is rebuilt from
 * the group by searching titles that start with "[T-NNN]".
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const TASKS_FILE = resolve(root, "tasks/TASKS.md");
const MAP_FILE = resolve(root, "tasks/.b24-map.json");
const REQUEST_GAP_MS = 550;

const B24_STATUS = { pending: 2, inProgress: 3, supposedlyCompleted: 4, completed: 5, deferred: 6 };
const B24_STATUS_LABEL = {
    1: "new",
    2: "pending",
    3: "in_progress",
    4: "supposedly_completed",
    5: "completed",
    6: "deferred",
    7: "declined",
};
const LOCAL_TO_B24_STATUS = {
    draft: B24_STATUS.pending,
    ready: B24_STATUS.pending,
    "in-progress": B24_STATUS.inProgress,
    blocked: B24_STATUS.deferred,
    done: B24_STATUS.completed,
};
const LOCAL_TO_B24_PRIORITY = { high: 2, medium: 1, low: 0 };

const loadEnvFile = (path) => {
    if (!existsSync(path)) return;
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (!match || line.trim().startsWith("#")) continue;
        const [, key, raw] = match;
        if (!process.env[key]) process.env[key] = raw.replace(/^["']|["']$/g, "");
    }
};

const parseArgs = (argv) => {
    const args = { dryRun: false };
    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        if (arg === "--push") args.command = "push";
        else if (arg === "--status") args.command = "status";
        else if (arg === "--close") {
            args.command = "close";
            args.taskId = argv[++i];
        } else if (arg === "--comment") args.comment = argv[++i];
        else if (arg === "--dry-run") args.dryRun = true;
        else if (arg === "--help" || arg === "-h") args.command = "help";
    }
    return args;
};

const usage = () => {
    console.log(
        [
            "Usage:",
            "  node scripts/pm/b24-tasks-sync.mjs --status",
            "  node scripts/pm/b24-tasks-sync.mjs --push [--dry-run]",
            "  node scripts/pm/b24-tasks-sync.mjs --close T-NNN [--comment <file>] [--dry-run]",
        ].join("\n")
    );
};

// ---------- tasks/TASKS.md ----------

const SECTION_BY_HEADING = {
    queue: "queue",
    "in progress": "in-progress",
    done: "done",
};

const normalizeStatus = (value) => {
    const status = (value ?? "").toLowerCase().replace(/\s+/g, "-");
    return status === "inprogress" ? "in-progress" : status;
};

export const parseTasks = (markdown) => {
    const tasks = [];
    let section = null;
    let current = null;

    const flush = () => {
        if (!current) return;
        const lines = current.lines;
        const fields = {};
        const body = [];
        let inFields = true;
        for (const line of lines) {
            const field = inFields && line.match(/^- ([a-zA-Z_]+):\s*(.*?)(?:\s+#.*)?$/);
            if (field) {
                fields[field[1]] = field[2].trim();
                continue;
            }
            if (line.trim() === "" && inFields && Object.keys(fields).length === 0) continue;
            if (line.trim() !== "" && !line.startsWith("- ")) inFields = false;
            if (!inFields || line.trim() !== "") body.push(line);
        }
        const bodyText = body.join("\n").trim();
        const acceptanceIndex = bodyText.search(/^Acceptance:\s*$/m);
        const description =
            acceptanceIndex === -1 ? bodyText : bodyText.slice(0, acceptanceIndex).trim();
        const acceptance =
            acceptanceIndex === -1
                ? []
                : bodyText
                      .slice(acceptanceIndex)
                      .split(/\r?\n/)
                      .slice(1)
                      .filter((line) => /^\s*- /.test(line))
                      .map((line) => line.replace(/^\s*- /, "").trim());

        tasks.push({
            id: current.id,
            title: current.title,
            section: current.section,
            status:
                normalizeStatus(fields.status) || (current.section === "done" ? "done" : "draft"),
            priority: (fields.priority ?? "medium").toLowerCase(),
            area: fields.area ?? "",
            estimate: fields.estimate ?? "",
            source: fields.source ?? "",
            created: fields.created ?? "",
            done: fields.done ?? "",
            commit: fields.commit ?? "",
            branch: fields.branch ?? "",
            blocked: fields.blocked ?? "",
            ice: fields.ice ?? "",
            description,
            acceptance,
            markdown: [`### ${current.id} · ${current.title}`, "", ...lines].join("\n").trim(),
        });
        current = null;
    };

    for (const rawLine of markdown.split(/\r?\n/)) {
        const line = rawLine.replace(/\s+$/, "");
        const heading = line.match(/^## (.+)$/);
        if (heading) {
            flush();
            section = SECTION_BY_HEADING[heading[1].trim().toLowerCase()] ?? null;
            continue;
        }
        const task = line.match(/^### (T-\d+[a-z]?)\s*[·\-—]\s*(.+)$/);
        if (task) {
            flush();
            current = { id: task[1], title: task[2].trim(), section, lines: [] };
            continue;
        }
        if (current) current.lines.push(line);
    }
    flush();
    return tasks;
};

const readTasks = () => {
    if (!existsSync(TASKS_FILE)) {
        throw new Error(`Not found: ${TASKS_FILE}`);
    }
    return parseTasks(readFileSync(TASKS_FILE, "utf8"));
};

// ---------- map file ----------

const readMap = () => {
    if (!existsSync(MAP_FILE)) return { version: 1, tasks: {} };
    try {
        const parsed = JSON.parse(readFileSync(MAP_FILE, "utf8"));
        return { version: 1, tasks: parsed.tasks ?? {} };
    } catch {
        return { version: 1, tasks: {} };
    }
};

const writeMap = (map) => {
    const sorted = Object.fromEntries(
        Object.entries(map.tasks).sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true }))
    );
    writeFileSync(MAP_FILE, `${JSON.stringify({ version: 1, tasks: sorted }, null, 4)}\n`);
};

// ---------- Bitrix24 REST ----------

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

const createClient = ({ webhookUrl, groupId, responsibleId }) => {
    const base = webhookUrl.endsWith("/") ? webhookUrl : `${webhookUrl}/`;
    const origin = new URL(base).origin;

    const call = async (method, params = {}) => {
        const response = await fetch(`${base}${method}.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || payload.error) {
            const detail = `${payload.error ?? response.status} ${payload.error_description ?? ""}`;
            throw new Error(`B24 ${method}: ${detail.trim()}`);
        }
        return payload;
    };

    const listGroupTasks = async () => {
        const items = [];
        let start = 0;
        for (;;) {
            const payload = await call("tasks.task.list", {
                filter: { GROUP_ID: groupId, "%TITLE": "[T-" },
                select: ["ID", "TITLE", "STATUS", "PRIORITY"],
                order: { ID: "ASC" },
                start,
            });
            items.push(...(payload.result?.tasks ?? []));
            if (payload.next === undefined || payload.next === null) break;
            start = payload.next;
            await sleep(REQUEST_GAP_MS);
        }
        return items.map((task) => ({
            id: Number(task.id),
            title: String(task.title ?? ""),
            status: Number(task.status),
            priority: Number(task.priority),
        }));
    };

    const addTask = async (fields) => {
        const payload = await call("tasks.task.add", {
            fields: { GROUP_ID: groupId, RESPONSIBLE_ID: responsibleId, ...fields },
        });
        return Number(payload.result?.task?.id);
    };

    const updateTask = (taskId, fields) => call("tasks.task.update", { taskId, fields });

    const completeTask = (taskId) => call("tasks.task.complete", { taskId });

    const renewTask = (taskId) => call("tasks.task.renew", { taskId });

    const addComment = (taskId, message) =>
        call("task.commentitem.add", { TASKID: taskId, FIELDS: { POST_MESSAGE: message } });

    const taskUrl = (taskId) => `${origin}/workgroups/group/${groupId}/tasks/task/view/${taskId}/`;

    return { listGroupTasks, addTask, updateTask, completeTask, renewTask, addComment, taskUrl };
};

const rebuildMap = async (client, map) => {
    const remote = await client.listGroupTasks();
    const byLocalId = new Map();
    for (const task of remote) {
        const match = task.title.match(/^\[(T-\d+[a-z]?)\]/);
        if (!match) continue;
        if (!byLocalId.has(match[1])) byLocalId.set(match[1], task);
    }
    for (const [localId, task] of byLocalId) map.tasks[localId] = task.id;
    return { remoteByLocalId: byLocalId, remoteById: new Map(remote.map((t) => [t.id, t])) };
};

// ---------- commands ----------

const b24Title = (task) => `[${task.id}] ${task.title}`;

const isRemoteDone = (status) =>
    status === B24_STATUS.completed || status === B24_STATUS.supposedlyCompleted;

const doneComment = (task) => {
    const parts = ["Закрыто из репозитория."];
    if (task.done) parts.push(`Отчёт: tasks/reports/${task.done}.md`);
    if (task.commit) parts.push(`Коммит: ${task.commit}`);
    if (task.branch) parts.push(`Ветка: ${task.branch}`);
    return parts.join("\n");
};

const statusCommand = async ({ client, tasks, map }) => {
    let remoteById = new Map();
    if (client) {
        const rebuilt = await rebuildMap(client, map);
        remoteById = rebuilt.remoteById;
        writeMap(map);
    }
    const rows = tasks.map((task) => {
        const b24Id = map.tasks[task.id];
        const remote = b24Id ? remoteById.get(b24Id) : undefined;
        const remoteLabel = remote
            ? (B24_STATUS_LABEL[remote.status] ?? String(remote.status))
            : "—";
        const expected = LOCAL_TO_B24_STATUS[task.status];
        const diff =
            client &&
            (!remote ||
                (expected !== undefined &&
                    remote.status !== expected &&
                    !(expected === B24_STATUS.completed && isRemoteDone(remote.status))));
        return {
            id: task.id,
            local: task.status,
            b24: remoteLabel,
            link: b24Id && client ? client.taskUrl(b24Id) : "—",
            diff: diff ? "!" : " ",
        };
    });
    const width = (key) => Math.max(key.length, ...rows.map((row) => String(row[key]).length));
    const line = (row) =>
        [
            row.diff,
            String(row.id).padEnd(width("id")),
            String(row.local).padEnd(width("local")),
            String(row.b24).padEnd(width("b24")),
            row.link,
        ].join("  ");
    console.log(line({ diff: " ", id: "T-ID", local: "local", b24: "B24", link: "link" }));
    for (const row of rows) console.log(line(row));
    const diffs = rows.filter((row) => row.diff === "!").length;
    console.log(`\n${rows.length} tasks, ${diffs} differ${client ? "" : " (B24 not configured)"}`);
};

const pushCommand = async ({ client, tasks, map, dryRun }) => {
    const remoteById = new Map();
    if (client) {
        const rebuilt = await rebuildMap(client, map);
        for (const [key, value] of rebuilt.remoteById) remoteById.set(key, value);
    }

    const actions = [];
    for (const task of tasks) {
        const b24Id = map.tasks[task.id];
        const remote = b24Id ? remoteById.get(b24Id) : undefined;
        const status = LOCAL_TO_B24_STATUS[task.status] ?? B24_STATUS.pending;
        const priority = LOCAL_TO_B24_PRIORITY[task.priority] ?? 1;

        if (!remote) {
            if (task.status === "done") {
                actions.push({ type: "skip", task, reason: "done locally, never mirrored" });
                continue;
            }
            actions.push({
                type: "create",
                task,
                fields: {
                    TITLE: b24Title(task),
                    DESCRIPTION: task.markdown,
                    PRIORITY: priority,
                    STATUS: status,
                },
            });
            continue;
        }

        if (task.status === "done") {
            if (!isRemoteDone(remote.status)) {
                actions.push({ type: "complete", task, b24Id, comment: doneComment(task) });
            }
            continue;
        }

        const fields = {};
        const needsRenew = isRemoteDone(remote.status);
        if (!needsRenew && remote.status !== status) fields.STATUS = status;
        if (remote.priority !== priority) fields.PRIORITY = priority;
        if (remote.title !== b24Title(task)) fields.TITLE = b24Title(task);
        if (needsRenew || Object.keys(fields).length > 0) {
            actions.push({
                type: "update",
                task,
                b24Id,
                renew: needsRenew,
                fields,
                comment:
                    fields.STATUS === B24_STATUS.deferred
                        ? `Заблокировано: ${task.blocked || "причина в tasks/TASKS.md"}`
                        : undefined,
            });
        }
    }

    if (actions.length === 0) {
        console.log("B24: nothing to push");
        return;
    }

    for (const action of actions) {
        const label = `${action.task.id} ${action.type}`;
        if (action.type === "skip") {
            console.log(`- ${label}: ${action.reason}`);
            continue;
        }
        if (dryRun) {
            const summary =
                action.type === "create" ? action.fields.TITLE : (action.fields ?? action.comment);
            console.log(`- ${label}: ${JSON.stringify(summary)}`);
            continue;
        }
        if (action.type === "create") {
            const id = await client.addTask(action.fields);
            map.tasks[action.task.id] = id;
            console.log(`- ${label}: ${client.taskUrl(id)}`);
        } else if (action.type === "update") {
            if (action.renew) {
                await client.renewTask(action.b24Id);
                await sleep(REQUEST_GAP_MS);
            }
            if (Object.keys(action.fields).length > 0) {
                await client.updateTask(action.b24Id, action.fields);
            }
            if (action.comment) {
                await sleep(REQUEST_GAP_MS);
                await client.addComment(action.b24Id, action.comment);
            }
            console.log(`- ${label}: ${JSON.stringify(action.fields)}`);
        } else if (action.type === "complete") {
            await client.completeTask(action.b24Id);
            await sleep(REQUEST_GAP_MS);
            await client.addComment(action.b24Id, action.comment);
            console.log(`- ${label}: completed`);
        }
        await sleep(REQUEST_GAP_MS);
    }

    if (!dryRun && client) writeMap(map);
    console.log(`B24: ${actions.length} action(s)${dryRun ? " (dry run)" : ""}`);
};

const closeCommand = async ({ client, tasks, map, taskId, commentFile, dryRun }) => {
    if (!taskId || !/^T-\d+[a-z]?$/.test(taskId)) {
        throw new Error("--close expects a task id like T-012");
    }
    const task = tasks.find((item) => item.id === taskId);
    if (!map.tasks[taskId]) await rebuildMap(client, map);
    const b24Id = map.tasks[taskId];
    if (!b24Id) {
        throw new Error(`${taskId} is not mirrored in B24 (run --push first)`);
    }
    const fallback = task ? doneComment(task) : "Закрыто из репозитория.";
    const comment = commentFile
        ? readFileSync(resolve(root, commentFile), "utf8").trim()
        : fallback;

    if (dryRun) {
        console.log(`- ${taskId} complete ${client.taskUrl(b24Id)} (dry run)`);
        console.log(comment);
        return;
    }
    await client.completeTask(b24Id);
    await sleep(REQUEST_GAP_MS);
    await client.addComment(b24Id, comment);
    writeMap(map);
    console.log(`- ${taskId} completed: ${client.taskUrl(b24Id)}`);
};

const main = async () => {
    loadEnvFile(resolve(root, ".env.automation"));
    const args = parseArgs(process.argv.slice(2));
    if (!args.command || args.command === "help") {
        usage();
        return;
    }

    const webhookUrl = process.env.B24_WEBHOOK_URL;
    const groupId = Number(process.env.B24_TASKS_GROUP_ID);
    const responsibleId = Number(process.env.B24_RESPONSIBLE_ID);
    const configured = Boolean(webhookUrl) && groupId > 0 && responsibleId > 0;

    const tasks = readTasks();
    const map = readMap();

    if (!configured) {
        if (args.command === "push" && args.dryRun) {
            await pushCommand({ client: null, tasks, map, dryRun: true });
        } else if (args.command === "status") {
            await statusCommand({ client: null, tasks, map });
        }
        console.log("B24 not configured, skipping");
        return;
    }

    const client = createClient({ webhookUrl, groupId, responsibleId });
    if (args.command === "status") await statusCommand({ client, tasks, map });
    if (args.command === "push") await pushCommand({ client, tasks, map, dryRun: args.dryRun });
    if (args.command === "close") {
        await closeCommand({
            client,
            tasks,
            map,
            taskId: args.taskId,
            commentFile: args.comment,
            dryRun: args.dryRun,
        });
    }
};

main().catch((error) => {
    console.error(error.message ?? error);
    process.exit(1);
});
