import { Martian_Mono, Onest, Unbounded } from "next/font/google";

// Only latin is preloaded; cyrillic files load on demand through unicode-range, so es/en pages
// don't pay for them.
const display = Unbounded({
    subsets: ["latin"],
    variable: "--font-unbounded",
    display: "swap",
});

const sans = Onest({
    subsets: ["latin"],
    variable: "--font-onest",
    display: "swap",
});

const mono = Martian_Mono({
    subsets: ["latin"],
    preload: false,
    variable: "--font-martian",
    display: "swap",
});

export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable}`;
