export const SITE = {
    name: "Divan Shop",
    defaultOgImage: "/og-default.webp",
    twitterHandle: "",
    homeSlug: "home",
    catalogPageSize: 24,
} as const;

export const CURRENCIES = ["RUB", "USD", "EUR", "UAH"] as const;

export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "RUB";
