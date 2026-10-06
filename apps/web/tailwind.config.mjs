/** @type {import('tailwindcss').Config} */
const config = {
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: [
                        {
                            "--tw-prose-body": "var(--foreground)",
                            "--tw-prose-headings": "var(--foreground)",
                            "--tw-prose-lead": "var(--muted-foreground)",
                            "--tw-prose-links": "var(--foreground)",
                            "--tw-prose-bold": "var(--foreground)",
                            "--tw-prose-counters": "var(--muted-foreground)",
                            "--tw-prose-bullets": "var(--border)",
                            "--tw-prose-hr": "var(--border)",
                            "--tw-prose-quotes": "var(--foreground)",
                            "--tw-prose-quote-borders": "var(--brand)",
                            "--tw-prose-captions": "var(--muted-foreground)",
                            "--tw-prose-code": "var(--foreground)",
                            "--tw-prose-th-borders": "var(--border)",
                            "--tw-prose-td-borders": "var(--border)",
                            "--tw-prose-invert-body": "var(--foreground)",
                            "--tw-prose-invert-headings": "var(--foreground)",
                            "--tw-prose-invert-lead": "var(--muted-foreground)",
                            "--tw-prose-invert-links": "var(--foreground)",
                            "--tw-prose-invert-bold": "var(--foreground)",
                            "--tw-prose-invert-counters": "var(--muted-foreground)",
                            "--tw-prose-invert-bullets": "var(--border)",
                            "--tw-prose-invert-hr": "var(--border)",
                            "--tw-prose-invert-quotes": "var(--foreground)",
                            "--tw-prose-invert-quote-borders": "var(--brand)",
                            "--tw-prose-invert-captions": "var(--muted-foreground)",
                            "--tw-prose-invert-code": "var(--foreground)",
                            "--tw-prose-invert-th-borders": "var(--border)",
                            "--tw-prose-invert-td-borders": "var(--border)",
                            h1: {
                                fontWeight: "normal",
                                marginBottom: "0.25em",
                            },
                        },
                    ],
                },
                base: {
                    css: [
                        {
                            h1: {
                                fontSize: "2.5rem",
                            },
                            h2: {
                                fontSize: "1.25rem",
                                fontWeight: 600,
                            },
                        },
                    ],
                },
                md: {
                    css: [
                        {
                            h1: {
                                fontSize: "3.5rem",
                            },
                            h2: {
                                fontSize: "1.5rem",
                            },
                        },
                    ],
                },
            },
        },
    },
};

export default config;
