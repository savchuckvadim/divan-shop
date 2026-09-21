#!/usr/bin/env node
/**
 * Drops and recreates the `public` schema of the LOCAL dev database so Payload's
 * push mode can rebuild it from scratch (use after schema changes that make
 * drizzle ask "created or renamed?"). Refuses to run against non-local hosts.
 *   node scripts/ops/reset-dev-db.mjs
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const envFile = resolve(root, "apps/web/.env");
if (!existsSync(envFile)) {
    console.error("apps/web/.env not found");
    process.exit(2);
}
const url = readFileSync(envFile, "utf8")
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*DATABASE_URL\s*=\s*(.+)\s*$/))
    .find(Boolean)?.[1]
    ?.replace(/^["']|["']$/g, "");
if (!url) {
    console.error("DATABASE_URL missing in apps/web/.env");
    process.exit(2);
}
const host = new URL(url).hostname;
if (!["localhost", "127.0.0.1"].includes(host)) {
    console.error(`Refusing to reset a non-local database (${host})`);
    process.exit(3);
}

const dbAdapterDir = realpathSync(resolve(root, "apps/web/node_modules/@payloadcms/db-postgres"));
const require = createRequire(resolve(dbAdapterDir, "package.json"));
const { Client } = require("pg");
const client = new Client({ connectionString: url });
await client.connect();
await client.query("DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;");
await client.end();
console.log(`dev database at ${host} reset: schema public recreated`);
