import type { Storefront } from "@workspace/themes/presets";

import { STOREFRONT } from "@/modules/shared/config";

interface OgPalette {
    background: string;
    foreground: string;
    mutedForeground: string;
    border: string;
    /** Accent: eyebrow and the domain ending of the wordmark. */
    brand: string;
    /** Price pill. */
    primary: string;
    primaryForeground: string;
    /** The rule above the footer line, a CSS background value. */
    rule: string;
}

/**
 * ImageResponse (Satori) cannot read CSS variables, so each storefront's preset from
 * packages/themes (direction, palette and mode in STOREFRONT_PRESETS) is mirrored here as sRGB hex.
 * Keep in sync with src/concepts/*.css.
 */
const PALETTES: Record<Storefront, OgPalette> = {
    // Galería · Esparto, light
    group: {
        background: "#f6f6f4",
        foreground: "#151513",
        mutedForeground: "#5e5e5b",
        border: "#d4d3d1",
        brand: "#805e16",
        primary: "#151513",
        primaryForeground: "#f6f6f4",
        rule: "#d4d3d1",
    },
    // Cine · Granate, light
    boutique: {
        background: "#eeeeec",
        foreground: "#141412",
        mutedForeground: "#61605e",
        border: "#d3d2d0",
        brand: "#98333d",
        primary: "#141412",
        primaryForeground: "#eeeeec",
        rule: "#d3d2d0",
    },
    // Neón · Lima, dark
    youth: {
        background: "#0b0b0c",
        foreground: "#f6f6f1",
        mutedForeground: "#b4b4bc",
        border: "#2c2c30",
        brand: "#c6ff3d",
        primary: "#ff3d8b",
        primaryForeground: "#0b0b0c",
        rule: "linear-gradient(90deg, #c6ff3d, #ff3d8b)",
    },
};

export const OG_COLORS = PALETTES[STOREFRONT];

/** Pills only where the storefront itself is round. */
export const OG_PILL_RADIUS = STOREFRONT === "boutique" ? 2 : 999;

export const OG_SIZE = { width: 1200, height: 630 } as const;

export const OG_CONTENT_TYPE = "image/png";

/** No runtime font fetching: Satori falls back to the embedded sans face for these stacks. */
export const OG_FONT_SERIF = "Georgia, 'Times New Roman', Times, serif";
export const OG_FONT_SANS = "'Segoe UI', Helvetica, Arial, sans-serif";
