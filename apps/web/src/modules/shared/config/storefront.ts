import { isStorefront, type Storefront, STOREFRONT_PRESETS } from "@workspace/themes/presets";

const fromEnv = process.env.NEXT_PUBLIC_STOREFRONT;

export const STOREFRONT: Storefront = isStorefront(fromEnv) ? fromEnv : "group";

export const STOREFRONT_PRESET = STOREFRONT_PRESETS[STOREFRONT];

/**
 * Only the main storefront is indexed until products get a main storefront (T-054): until then the
 * others show the same catalog and would compete with it as duplicates.
 */
export const STOREFRONT_INDEXED = STOREFRONT === "group";

const host = (() => {
    try {
        return new URL(process.env.NEXT_PUBLIC_SERVER_URL ?? "").hostname.replace(/^www\./, "");
    } catch {
        return "";
    }
})();

const dot = host.indexOf(".");

/** The domain is the wordmark: "divan.group" → divan + .group. Null on localhost or an IP. */
export const STOREFRONT_WORDMARK =
    dot > 0 && !/^[\d.]+$/.test(host) ? { name: host.slice(0, dot), tld: host.slice(dot) } : null;
