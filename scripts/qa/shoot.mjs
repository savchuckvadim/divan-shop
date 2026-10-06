#!/usr/bin/env node
/**
 * Screenshot + audit tool for design prototypes and the live site.
 *
 *   node shoot.mjs --url <http(s) url | path to .html> --out <dir> [--name prefix]
 *        [--widths 390,1440,2560] [--max 12] [--wait 2600] [--lang ru]
 *        [--scheme light|dark] [--reduced] [--nojs] [--loader] [--audit] [--full]
 *        [--click "<css selector>"]   click an element after load (e.g. open cart drawer / lightbox)
 *        [--attr "name=value,..."]    set attributes on <html> before first paint (e.g. data-accent=ink)
 *
 * Output: <out>/<name>-w<width>-NN.jpg viewport slices (scrolled top to bottom),
 *         <out>/<name>-w<width>-sheet[-N].jpg contact sheets, and a JSON summary on stdout.
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, fallback) => {
    const index = argv.indexOf(`--${name}`);
    return index >= 0 && argv[index + 1] && !argv[index + 1].startsWith("--")
        ? argv[index + 1]
        : fallback;
};

const rawUrl = opt("url");
if (!rawUrl) {
    console.error("--url is required");
    process.exit(2);
}
const url = /^(https?|file):/i.test(rawUrl) ? rawUrl : pathToFileURL(path.resolve(rawUrl)).href;
const outDir = path.resolve(opt("out", "./shots"));
const name = opt("name", "shot");
const widths = opt("widths", "390,1440,2560").split(",").map(Number).filter(Boolean);
const maxSlices = Number(opt("max", "12"));
const settle = Number(opt("wait", "2600"));
const lang = opt("lang", "");
const scheme = opt("scheme", "light");
const clickSelector = opt("click", "");
const htmlAttrs = opt("attr", "")
    .split(",")
    .map((pair) => pair.split("="))
    .filter((pair) => pair.length === 2 && pair[0]);
const HEIGHTS = {
    360: 760,
    390: 844,
    430: 932,
    768: 1024,
    1024: 768,
    1280: 800,
    1440: 900,
    1728: 1117,
    1920: 1080,
    2560: 1440,
    3440: 1440,
    3840: 2160,
};

const CHROME = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((candidate) => fs.existsSync(candidate));
if (!CHROME) {
    console.error("No Chrome/Edge found");
    process.exit(3);
}

let sharp = null;
try {
    const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
    sharp = createRequire(path.join(repoRoot, "apps/web/package.json"))("sharp");
} catch {
    sharp = null;
}

fs.mkdirSync(outDir, { recursive: true });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeSheets = async (files, width, tag) => {
    if (!sharp || files.length === 0) return [];
    const mobile = width < 700;
    const columns = mobile ? 5 : width >= 2200 ? 2 : 3;
    const tileWidth = mobile ? 300 : width >= 2200 ? 1000 : 660;
    const perSheet = mobile ? 10 : 6;
    const sheets = [];
    for (let start = 0; start < files.length; start += perSheet) {
        const chunk = files.slice(start, start + perSheet);
        const tiles = [];
        for (const file of chunk) {
            const buffer = await sharp(file)
                .resize({ width: tileWidth })
                .jpeg({ quality: 80 })
                .toBuffer();
            const meta = await sharp(buffer).metadata();
            tiles.push({ buffer, height: meta.height });
        }
        const gap = 12;
        const rows = Math.ceil(tiles.length / columns);
        const rowHeights = Array.from({ length: rows }, (_, row) =>
            Math.max(
                ...tiles.slice(row * columns, row * columns + columns).map((tile) => tile.height)
            )
        );
        const sheetWidth = columns * tileWidth + (columns + 1) * gap;
        const sheetHeight = rowHeights.reduce((sum, height) => sum + height, 0) + (rows + 1) * gap;
        const composites = tiles.map((tile, index) => {
            const row = Math.floor(index / columns);
            const column = index % columns;
            const top =
                gap + rowHeights.slice(0, row).reduce((sum, height) => sum + height + gap, 0);
            return { input: tile.buffer, left: gap + column * (tileWidth + gap), top };
        });
        const sheetFile = path.join(
            outDir,
            `${name}-w${width}${tag}-sheet${files.length > perSheet ? `-${sheets.length + 1}` : ""}.jpg`
        );
        await sharp({
            create: { width: sheetWidth, height: sheetHeight, channels: 3, background: "#7a7a7a" },
        })
            .composite(composites)
            .jpeg({ quality: 82 })
            .toFile(sheetFile);
        sheets.push(sheetFile);
    }
    return sheets;
};

const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--hide-scrollbars", "--force-color-profile=srgb", "--allow-file-access-from-files"],
});

const summary = { url, chrome: path.basename(CHROME), runs: [] };

for (const width of widths) {
    const height = HEIGHTS[width] ?? Math.round(width * 0.5625);
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.setJavaScriptEnabled(!flag("nojs"));
    await page.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: flag("reduced") ? "reduce" : "no-preference" },
        { name: "prefers-color-scheme", value: scheme },
    ]);
    if (lang) {
        await page.setExtraHTTPHeaders({ "Accept-Language": lang });
        await page.evaluateOnNewDocument((value) => {
            Object.defineProperty(navigator, "language", { get: () => value });
            Object.defineProperty(navigator, "languages", { get: () => [value] });
        }, lang);
    }
    if (htmlAttrs.length > 0) {
        await page.evaluateOnNewDocument((pairs) => {
            const apply = () => {
                if (!document.documentElement) return;
                for (const [key, value] of pairs) document.documentElement.setAttribute(key, value);
            };
            apply();
            new MutationObserver((records, observer) => {
                if (document.documentElement) {
                    apply();
                    observer.disconnect();
                }
            }).observe(document, { childList: true });
            document.addEventListener("DOMContentLoaded", apply);
        }, htmlAttrs);
    }
    await page.evaluateOnNewDocument(() => {
        window.__vitals = { lcp: 0, lcpTag: "", cls: 0, longTasks: 0 };
        try {
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    window.__vitals.lcp = Math.round(entry.startTime);
                    const element = entry.element;
                    const cls =
                        element && typeof element.className === "string" && element.className
                            ? "." + element.className.split(" ").slice(0, 2).join(".")
                            : "";
                    window.__vitals.lcpTag = element ? element.tagName.toLowerCase() + cls : "";
                }
            }).observe({ type: "largest-contentful-paint", buffered: true });
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) window.__vitals.cls += entry.value;
                }
            }).observe({ type: "layout-shift", buffered: true });
            new PerformanceObserver((list) => {
                window.__vitals.longTasks += list.getEntries().length;
            }).observe({ type: "longtask", buffered: true });
        } catch {
            /* observers unsupported */
        }
    });

    const consoleErrors = [];
    const failed = [];
    let bytes = 0;
    page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text().slice(0, 240));
    });
    page.on("pageerror", (error) =>
        consoleErrors.push(`pageerror: ${String(error.message).slice(0, 240)}`)
    );
    page.on("requestfailed", (request) =>
        failed.push(`${request.failure()?.errorText ?? "failed"} ${request.url().slice(0, 160)}`)
    );
    page.on("response", async (response) => {
        if (response.status() >= 400)
            failed.push(`${response.status()} ${response.url().slice(0, 160)}`);
        try {
            const length = Number(response.headers()["content-length"] ?? 0);
            bytes += length || (await response.buffer()).length;
        } catch {
            /* body unavailable */
        }
    });

    const tag = `${flag("nojs") ? "-nojs" : ""}${flag("reduced") ? "-reduced" : ""}${scheme === "dark" ? "-dark" : ""}`;
    const run = { width, height, files: [], sheets: [] };

    try {
        if (flag("loader")) {
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
            let previous = 0;
            for (const at of [150, 600, 1100, 1900]) {
                await sleep(at - previous);
                previous = at;
                const loaderFile = path.join(outDir, `${name}-w${width}${tag}-loader-${at}.jpg`);
                await page.screenshot({ path: loaderFile, type: "jpeg", quality: 82 });
                run.files.push(loaderFile);
            }
            await page.waitForNetworkIdle({ idleTime: 500, timeout: 30000 }).catch(() => {});
        } else {
            await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
        }
        await sleep(settle);

        run.vitalsAtLoad = await page
            .evaluate(() => (window.__vitals ? { ...window.__vitals } : null))
            .catch(() => null);
        if (run.vitalsAtLoad) run.vitalsAtLoad.cls = Number(run.vitalsAtLoad.cls.toFixed(4));

        if (clickSelector) {
            await page.click(clickSelector).catch((error) => {
                run.clickError = String(error.message).slice(0, 200);
            });
            await sleep(900);
        }

        const metrics = await page.evaluate(() => ({
            pageHeight: Math.max(
                document.documentElement.scrollHeight,
                document.body ? document.body.scrollHeight : 0
            ),
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
        }));
        run.pageHeight = metrics.pageHeight;
        run.overflowX =
            metrics.scrollWidth > metrics.clientWidth + 1
                ? metrics.scrollWidth - metrics.clientWidth
                : 0;

        const step = Math.floor(height * 0.92);
        let positions = [];
        const lastStart = Math.max(1, metrics.pageHeight - Math.floor(height * 0.25));
        for (let y = 0; y < lastStart; y += step) positions.push(y);
        if (clickSelector) positions = [positions[0]];
        if (positions.length > maxSlices) {
            const picked = [];
            for (let index = 0; index < maxSlices; index += 1) {
                picked.push(
                    positions[Math.round((index * (positions.length - 1)) / (maxSlices - 1))]
                );
            }
            run.truncated = `${positions.length} viewports sampled down to ${maxSlices}`;
            positions = [...new Set(picked)];
        }

        const sliceFiles = [];
        for (const [index, y] of positions.entries()) {
            if (!clickSelector) {
                await page.evaluate(
                    (top) => window.scrollTo({ top, left: 0, behavior: "instant" }),
                    y
                );
                await sleep(index === 0 ? 200 : 950);
            }
            const file = path.join(
                outDir,
                `${name}-w${width}${tag}-${String(index + 1).padStart(2, "0")}.jpg`
            );
            await page.screenshot({ path: file, type: "jpeg", quality: 84 });
            sliceFiles.push(file);
        }
        run.files.push(...sliceFiles);
        run.sheets = await makeSheets(sliceFiles, width, tag);

        if (flag("full")) {
            await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
            await sleep(400);
            const fullFile = path.join(outDir, `${name}-w${width}${tag}-full.jpg`);
            await page.screenshot({ path: fullFile, type: "jpeg", quality: 70, fullPage: true });
            run.full = fullFile;
        }

        if (flag("audit")) {
            run.audit = await page.evaluate(() => {
                const visibleText = (element) => (element.innerText || "").trim();
                const hidden = [];
                let hiddenChars = 0;
                const skip =
                    'dialog, [hidden], template, script, style, noscript, [aria-hidden="true"], details:not([open])';
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
                while (walker.nextNode()) {
                    const element = walker.currentNode;
                    if (element.closest(skip)) continue;
                    const own = [...element.childNodes]
                        .filter((node) => node.nodeType === 3)
                        .map((node) => node.textContent.trim())
                        .join(" ")
                        .trim();
                    if (own.length < 3) continue;
                    const style = getComputedStyle(element);
                    let effectiveOpacity = 1;
                    for (
                        let current = element;
                        current && current !== document.documentElement;
                        current = current.parentElement
                    ) {
                        effectiveOpacity *= Number(getComputedStyle(current).opacity);
                    }
                    const clipped =
                        style.clipPath &&
                        style.clipPath !== "none" &&
                        /inset\((100%|50% 50%)/.test(style.clipPath);
                    if (effectiveOpacity < 0.1 || style.visibility === "hidden" || clipped) {
                        hiddenChars += own.length;
                        if (hidden.length < 12)
                            hidden.push(`${element.tagName.toLowerCase()}: ${own.slice(0, 60)}`);
                    }
                }
                const images = [...document.images];
                const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map(
                    (heading) =>
                        `${heading.tagName} ${visibleText(heading).replace(/\s+/g, " ").slice(0, 70)}`
                );
                const description = document.querySelector('meta[name="description"]');
                return {
                    title: document.title,
                    lang: document.documentElement.lang,
                    metaDescription: description ? description.content.slice(0, 160) : null,
                    h1Count: document.querySelectorAll("h1").length,
                    headings: headings.slice(0, 40),
                    landmarks: {
                        header: document.querySelectorAll("header").length,
                        nav: document.querySelectorAll("nav").length,
                        main: document.querySelectorAll("main").length,
                        footer: document.querySelectorAll("footer").length,
                    },
                    links: document.querySelectorAll("a[href]").length,
                    emptyLinks: [...document.querySelectorAll("a")].filter(
                        (a) => !a.getAttribute("href") || a.getAttribute("href") === "#"
                    ).length,
                    images: images.length,
                    imagesNoAlt: images.filter((image) => !image.hasAttribute("alt")).length,
                    imagesNoSize: images.filter(
                        (image) => !image.getAttribute("width") || !image.getAttribute("height")
                    ).length,
                    imagesLazy: images.filter((image) => image.loading === "lazy").length,
                    brokenImages: images
                        .filter((image) => image.complete && image.naturalWidth === 0)
                        .map((image) => image.getAttribute("src"))
                        .slice(0, 10),
                    jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
                    domNodes: document.querySelectorAll("*").length,
                    textChars: visibleText(document.body).length,
                    hiddenTextChars: hiddenChars,
                    hiddenSamples: hidden,
                    externalHosts: [
                        ...new Set(
                            [
                                ...document.querySelectorAll(
                                    "script[src], link[href], img[src], source[src], video[src], iframe[src]"
                                ),
                            ]
                                .map((element) => element.src || element.href)
                                .filter((value) => /^https?:/.test(value))
                                .map((value) => new URL(value).host)
                        ),
                    ],
                };
            });
        }
        run.vitals = await page.evaluate(() => window.__vitals ?? null).catch(() => null);
        if (run.vitals) run.vitals.cls = Number(run.vitals.cls.toFixed(4));
    } catch (error) {
        run.error = String(error && error.message ? error.message : error).slice(0, 300);
    }

    run.transferKb = Math.round(bytes / 1024);
    run.consoleErrors = [...new Set(consoleErrors)].slice(0, 12);
    run.failedRequests = [...new Set(failed)].slice(0, 12);
    summary.runs.push(run);
    await page.close();
}

await browser.close();
console.log(JSON.stringify(summary, null, 2));
