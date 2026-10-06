#!/usr/bin/env node
/**
 * WCAG contrast check for every direction × palette × mode in src/concepts/*.css.
 * Reads the token blocks, resolves var() chains and checks text, button, accent and input pairs.
 * Exit code 1 when a pair is below its minimum. Usage: node scripts/check-contrast.mjs [--all]
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/concepts");
const showAll = process.argv.includes("--all");
const say = (line) =>
    process.stdout.write(`${line}
`);

const PALETTES = ["p1", "p2", "p3", "p4"];

/** [label, foreground token, background token, minimum ratio] */
const PAIRS = [
    ["text", "--foreground", "--background", 4.5],
    ["muted text", "--muted-foreground", "--background", 4.5],
    ["card text", "--card-foreground", "--card", 4.5],
    ["muted on card", "--muted-foreground", "--card", 4.5],
    ["button", "--primary-foreground", "--primary", 4.5],
    ["accent fill", "--brand-foreground", "--brand", 4.5],
    ["accent text", "--brand", "--background", 4.5],
    ["input border", "--input", "--background", 3],
];

/** Neon wears its accent as fills and display type only, so large-text AA (3:1) applies. */
const EXCEPTIONS = { neon: { "accent text": 3 } };

const blocksOf = (css) => {
    const blocks = [];
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const re = /([^{}]+)\{([^{}]*)\}/g;
    let match;
    while ((match = re.exec(clean))) {
        const selector = match[1].trim().replace(/^@media[^{]*$/, "");
        const decls = {};
        for (const line of match[2].split(";")) {
            const at = line.indexOf(":");
            if (at < 0) continue;
            const name = line.slice(0, at).trim();
            if (name.startsWith("--")) decls[name] = line.slice(at + 1).trim();
        }
        blocks.push({ selector, decls });
    }
    return blocks;
};

const resolve = (vars, value, depth = 0) => {
    if (depth > 20) return null;
    const ref = value.match(/^var\((--[\w-]+)(?:,\s*(.+))?\)$/);
    if (!ref) return value;
    const next = vars[ref[1]] ?? ref[2];
    return next === undefined ? null : resolve(vars, next.trim(), depth + 1);
};

const luminance = (hex) => {
    const full = hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join("")}` : hex;
    const [r, g, b] = [1, 3, 5].map((i) => {
        const c = parseInt(full.slice(i, i + 2), 16) / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
};

const isHex = (value) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value ?? "");

let failures = 0;
let checked = 0;

for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".css"))) {
    const concept = file.replace(/\.css$/, "");
    const blocks = blocksOf(fs.readFileSync(path.join(dir, file), "utf8"));
    const root = `:root[data-concept="${concept}"]`;
    const pick = (test) =>
        blocks
            .filter(({ selector }) => selector.split(",").some((part) => test(part.trim())))
            .reduce((acc, { decls }) => ({ ...acc, ...decls }), {});

    const base = pick((s) => s === root);
    const dark = pick((s) => s === `${root}[data-theme="dark"]`);
    const light = pick((s) => s === `${root}[data-theme="light"]`);
    const darkFirst = Object.keys(dark).length === 0;

    for (const palette of PALETTES) {
        const paletteVars = pick((s) => s === `${root}[data-palette="${palette}"]`);
        const modes = darkFirst ? { dark: {}, light } : { light: {}, dark };

        for (const [mode, overrides] of Object.entries(modes)) {
            if (darkFirst && mode === "light" && Object.keys(light).length === 0) continue;
            const vars = { ...base, ...paletteVars, ...overrides };
            for (const [label, fgToken, bgToken, min] of PAIRS) {
                const fg = resolve(vars, vars[fgToken] ?? "");
                const bg = resolve(vars, vars[bgToken] ?? "");
                if (!isHex(fg) || !isHex(bg)) continue;
                const need = EXCEPTIONS[concept]?.[label] ?? min;
                const value = ratio(fg, bg);
                checked += 1;
                const ok = value >= need;
                if (!ok) failures += 1;
                if (!ok || showAll) {
                    say(
                        `${ok ? "ok  " : "FAIL"} ${concept} ${palette} ${mode.padEnd(5)} ${label.padEnd(14)} ${value.toFixed(2)} (min ${need}) ${fg} on ${bg}`
                    );
                }
            }
        }
    }
}

say(`${checked} pairs checked, ${failures} below minimum`);
process.exit(failures ? 1 : 0);
