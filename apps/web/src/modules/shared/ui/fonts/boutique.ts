import { Martian_Mono, TikTok_Sans } from "next/font/google";

// Only latin is preloaded; cyrillic files load on demand through unicode-range, so es/en pages
// don't pay for them.
const sans = TikTok_Sans({
    subsets: ["latin"],
    axes: ["opsz", "wdth"],
    variable: "--font-tiktok",
    display: "swap",
});

const mono = Martian_Mono({
    subsets: ["latin"],
    preload: false,
    variable: "--font-martian",
    display: "swap",
});

export const fontVariables = `${sans.variable} ${mono.variable}`;
