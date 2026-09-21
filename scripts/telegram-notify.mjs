#!/usr/bin/env node
/**
 * Sends a message to Telegram via Bot API.
 *   node scripts/telegram-notify.mjs --text "hello"
 *   node scripts/telegram-notify.mjs --file tasks/reports/2026-09-21.md
 * Reads TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID from env or from .env.automation in the repo root.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_LENGTH = 3900;

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
    const args = {};
    for (let i = 0; i < argv.length; i += 1) {
        if (argv[i] === "--text") args.text = argv[++i];
        if (argv[i] === "--file") args.file = argv[++i];
    }
    return args;
};

const main = async () => {
    loadEnvFile(resolve(root, ".env.automation"));

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
        console.error(
            "TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not set (see .env.automation.example)"
        );
        process.exit(2);
    }

    const args = parseArgs(process.argv.slice(2));
    let text = args.text ?? "";
    if (args.file) {
        text = readFileSync(resolve(root, args.file), "utf8");
    }
    if (!text.trim()) {
        console.error("Nothing to send: pass --text or --file");
        process.exit(2);
    }
    if (text.length > MAX_LENGTH) {
        text = `${text.slice(0, MAX_LENGTH)}\n…(обрезано, полный текст в репозитории)`;
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });

    if (!response.ok) {
        console.error(`Telegram API error ${response.status}: ${await response.text()}`);
        process.exit(1);
    }
    console.log("Telegram: sent");
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
