#!/usr/bin/env node
/**
 * Rebuilds the prototype photo library from originals.
 *   node design/concepts/tools/build-assets.mjs
 * Input:  design/concepts/assets/_orig/<id>.jpg (git-ignored originals), tools/sources.json (ids, credits)
 *         design/concepts/tools/descriptions.json (curated descriptions, optional)
 * Output: assets/<id>.webp (long side <= 2560), assets/<id>-sm.webp (long side 1100),
 *         assets/manifest.json, assets/CREDITS.md, assets/_sheet-*.jpg (labelled contact sheets)
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "..", "..", "..");
const assets = path.resolve(here, "..", "assets");
const orig = path.join(assets, "_orig");
const sharp = createRequire(path.join(repo, "apps/web/package.json"))("sharp");

const sources = JSON.parse(fs.readFileSync(path.join(here, "sources.json"), "utf8"));
const descriptionsFile = path.join(here, "descriptions.json");
const descriptions = fs.existsSync(descriptionsFile)
    ? JSON.parse(fs.readFileSync(descriptionsFile, "utf8"))
    : {};

const toHex = (r, g, b) =>
    "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

/** Average colour of the outer 5% frame: tells whether a product sits on white, light, dark or a scene. */
const borderColor = async (file) => {
    const { data, info } = await sharp(file)
        .resize(120, 120, { fit: "fill" })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
    const band = Math.max(2, Math.round(info.width * 0.05));
    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    for (let y = 0; y < info.height; y += 1) {
        for (let x = 0; x < info.width; x += 1) {
            if (x >= band && x < info.width - band && y >= band && y < info.height - band) continue;
            const i = (y * info.width + x) * 3;
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            n += 1;
        }
    }
    r /= n;
    g /= n;
    b /= n;
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    const kind =
        luminance > 0.9 && spread < 18
            ? "white"
            : luminance > 0.74
              ? "light"
              : luminance < 0.3
                ? "dark"
                : "scene";
    return { hex: toHex(r, g, b), kind };
};

/** Three representative colours from a coarse 4x4x4 histogram of a thumbnail. */
const dominantColors = async (file) => {
    const { data } = await sharp(file)
        .resize(64, 64, { fit: "inside" })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
    const bins = new Map();
    for (let i = 0; i < data.length; i += 3) {
        const key = `${data[i] >> 6}-${data[i + 1] >> 6}-${data[i + 2] >> 6}`;
        const bin = bins.get(key) ?? { r: 0, g: 0, b: 0, n: 0 };
        bin.r += data[i];
        bin.g += data[i + 1];
        bin.b += data[i + 2];
        bin.n += 1;
        bins.set(key, bin);
    }
    return [...bins.values()]
        .sort((a, b) => b.n - a.n)
        .slice(0, 3)
        .map((bin) => toHex(bin.r / bin.n, bin.g / bin.n, bin.b / bin.n));
};

const encode = async (input, output, longSide, quality) => {
    const meta = await sharp(input).rotate().metadata();
    const width = meta.autoOrient?.width ?? meta.width;
    const height = meta.autoOrient?.height ?? meta.height;
    const scale = Math.min(1, longSide / Math.max(width, height));
    const info = await sharp(input)
        .rotate()
        .resize({ width: Math.round(width * scale), height: Math.round(height * scale) })
        .webp({ quality, effort: 5 })
        .toFile(output);
    return { width: info.width, height: info.height, bytes: info.size };
};

const escapeXml = (text) =>
    text.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]);

const sheet = async (items, file) => {
    const tile = 420;
    const label = 34;
    const gap = 10;
    const columns = 4;
    const rows = Math.ceil(items.length / columns);
    const composites = [];
    for (const [index, item] of items.entries()) {
        const left = gap + (index % columns) * (tile + gap);
        const top = gap + Math.floor(index / columns) * (tile + label + gap);
        const image = await sharp(path.join(assets, item.fileSm))
            .resize(tile, tile, { fit: "contain", background: "#2a2a2a" })
            .toBuffer();
        const caption = Buffer.from(
            `<svg width="${tile}" height="${label}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111"/><text x="8" y="23" font-family="Arial, sans-serif" font-size="17" fill="#fff">${escapeXml(`${item.id} · ${item.background ?? item.orientation} · ${item.width}×${item.height}`)}</text></svg>`
        );
        composites.push({ input: image, left, top }, { input: caption, left, top: top + tile });
    }
    await sharp({
        create: {
            width: columns * tile + (columns + 1) * gap,
            height: rows * (tile + label + gap) + gap,
            channels: 3,
            background: "#555",
        },
    })
        .composite(composites)
        .jpeg({ quality: 80 })
        .toFile(path.join(assets, file));
};

const manifest = [];
let totalBytes = 0;
for (const source of sources) {
    const input = path.join(orig, `${source.id}.jpg`);
    if (!fs.existsSync(input)) {
        console.warn(`missing original: ${source.id}`);
        continue;
    }
    const large = await encode(input, path.join(assets, `${source.id}.webp`), 2560, 78);
    const small = await encode(input, path.join(assets, `${source.id}-sm.webp`), 1100, 74);
    totalBytes += large.bytes + small.bytes;
    const border = source.category === "product" ? await borderColor(input) : null;
    const curated = descriptions[source.id] ?? {};
    manifest.push({
        id: source.id,
        file: `${source.id}.webp`,
        fileSm: `${source.id}-sm.webp`,
        width: large.width,
        height: large.height,
        widthSm: small.width,
        heightSm: small.height,
        category: source.category,
        orientation:
            large.width > large.height * 1.08
                ? "landscape"
                : large.height > large.width * 1.08
                  ? "portrait"
                  : "square",
        description: curated.description ?? source.alt ?? "",
        background: border?.kind ?? curated.background ?? "scene",
        borderColor: border?.hex ?? null,
        dominantColors: await dominantColors(input),
        heroSuitable: curated.heroSuitable ?? false,
        credit: { author: source.author, source: source.source, pageUrl: source.pageUrl },
        license: source.license,
    });
}

fs.writeFileSync(path.join(assets, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

const credits = [
    "# Photo credits",
    "",
    "Prototype imagery only. Free licences: [Unsplash License](https://unsplash.com/license), [Pexels License](https://www.pexels.com/license/). Not for production product pages: real products need the factory's own photographs.",
    "",
    "| id | author | source |",
    "| --- | --- | --- |",
    ...manifest.map(
        (item) => `| ${item.id} | ${item.credit.author} | [${item.credit.source}](${item.credit.pageUrl}) |`
    ),
    "",
];
fs.writeFileSync(path.join(assets, "CREDITS.md"), credits.join("\n"));

const byCategory = (categories) => manifest.filter((item) => categories.includes(item.category));
await sheet(byCategory(["product"]), "_sheet-products.jpg");
await sheet(byCategory(["interior"]), "_sheet-interiors.jpg");
await sheet(byCategory(["detail", "craft", "place"]), "_sheet-details-craft-place.jpg");

console.log(`${manifest.length} images, ${(totalBytes / 1024 / 1024).toFixed(1)} MB of webp`);
