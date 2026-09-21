/** Brand name: CMS Site Settings → NEXT_PUBLIC_BRAND_NAME → placeholder. Rename = change the env, rebuild. */
export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "Divan Shop";

export const SITE = {
    name: BRAND_NAME,
    defaultOgImage: "/og-default.webp",
    twitterHandle: "",
    homeSlug: "home",
    catalogPageSize: 24,
    blogPageSize: 12,
    showroomDiscountPercent: 5,
} as const;

export const CURRENCIES = ["RUB", "USD", "EUR", "UAH"] as const;

export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "RUB";
