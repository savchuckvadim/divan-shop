import { Source_Sans_3, Source_Serif_4 } from "next/font/google";

// Only latin is preloaded; cyrillic files load on demand through unicode-range, so es/en pages
// don't pay for them.
const sans = Source_Sans_3({
    subsets: ["latin"],
    variable: "--font-source-sans",
    display: "swap",
});

const serif = Source_Serif_4({
    subsets: ["latin"],
    axes: ["opsz"],
    style: ["normal", "italic"],
    variable: "--font-source-serif",
    display: "swap",
});

export const fontVariables = `${sans.variable} ${serif.variable}`;
