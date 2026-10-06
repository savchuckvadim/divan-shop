/**
 * Theme vocabulary and storefront presets. A theme = direction (concept) + accent palette + mode +
 * shape; the CSS for each lives in `concepts/*.css` and `shape.css`, keyed by attributes on <html>.
 * Presets were approved by the owner on 2026-10-06 (ADR-0011).
 */

export const CONCEPTS = ["cinema", "atelier", "blueprint", "neon"] as const;
export type Concept = (typeof CONCEPTS)[number];

export const PALETTES = ["p1", "p2", "p3", "p4"] as const;
export type Palette = (typeof PALETTES)[number];

export const THEME_MODES = ["light", "dark", "auto"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const SHAPES = ["sharp", "round"] as const;
export type Shape = (typeof SHAPES)[number];

export interface ThemePreset {
    concept: Concept;
    palette: Palette;
    mode: ThemeMode;
    shape: Shape;
}

export const STOREFRONTS = ["group", "boutique", "youth"] as const;
export type Storefront = (typeof STOREFRONTS)[number];

export const STOREFRONT_PRESETS: Record<Storefront, ThemePreset> = {
    group: { concept: "atelier", palette: "p4", mode: "auto", shape: "round" },
    boutique: { concept: "cinema", palette: "p1", mode: "light", shape: "sharp" },
    youth: { concept: "neon", palette: "p2", mode: "dark", shape: "round" },
};

export const PALETTE_NAMES: Record<Concept, Record<Palette, string>> = {
    cinema: { p1: "Granate", p2: "Hora azul", p3: "Tungsteno", p4: "Pinar" },
    atelier: { p1: "Lacre", p2: "Tinta", p3: "Pátina", p4: "Esparto" },
    blueprint: { p1: "Latón", p2: "Cianotipo", p3: "Tablero", p4: "Lacre" },
    neon: { p1: "Chicle", p2: "Lima", p3: "Voltio", p4: "Ácido" },
};

export const isStorefront = (value: unknown): value is Storefront =>
    typeof value === "string" && (STOREFRONTS as readonly string[]).includes(value);

/** Attributes for <html>, rendered on the server so the theme is right on first paint. */
export const themeAttributes = (preset: ThemePreset): Record<string, string> => ({
    "data-concept": preset.concept,
    "data-palette": preset.palette,
    ...(preset.mode === "auto" ? {} : { "data-theme": preset.mode }),
    ...(preset.shape === "round" ? { "data-shape": "round" } : {}),
});
