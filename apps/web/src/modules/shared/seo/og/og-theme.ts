/**
 * ImageResponse (Satori) cannot read Tailwind or resolve `oklch()` / `color-mix()`,
 * so the light-theme tokens from packages/ui/src/styles/globals.css are mirrored here
 * as sRGB hex. Keep in sync when the palette changes.
 */
export const OG_COLORS = {
    background: "#faf7f0",
    card: "#fefcf9",
    foreground: "#261d17",
    mutedForeground: "#66574d",
    primary: "#903f21",
    primaryGlow: "#c66843",
    primaryForeground: "#fdfaf4",
    secondary: "#f1e5d0",
    accent: "#cfdbbe",
    border: "#e1dacf",
    gold: "#c79d59",
} as const;

export const OG_SIZE = { width: 1200, height: 630 } as const;

export const OG_CONTENT_TYPE = "image/png";

/** No runtime font fetching: Satori falls back to the embedded sans face for these stacks. */
export const OG_FONT_SERIF = "Georgia, 'Times New Roman', Times, serif";
export const OG_FONT_SANS = "'Segoe UI', Helvetica, Arial, sans-serif";

/** Late-afternoon glow over linen, mirroring the `bg-hero` utility. */
export const OG_SURFACE =
    `radial-gradient(1100px 760px at 92% 118%, ${OG_COLORS.primaryGlow}80, transparent 64%),` +
    ` radial-gradient(900px 560px at 4% -20%, ${OG_COLORS.secondary}ff, transparent 62%),` +
    ` linear-gradient(160deg, ${OG_COLORS.card} 0%, ${OG_COLORS.background} 100%)`;
