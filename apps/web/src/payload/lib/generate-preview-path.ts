import { DEFAULT_LOCALE, isLocale, type Locale, ROUTES } from "@/modules/shared/config";

export type PreviewCollection = "pages" | "products" | "categories" | "articles";

export interface PreviewSearchParams {
    path: string;
    previewSecret: string;
}

interface GeneratePreviewPathArgs {
    collection: PreviewCollection;
    slug?: string | null;
    locale?: unknown;
}

const resolveLocale = (locale: unknown): Locale => {
    if (isLocale(locale)) return locale;
    if (typeof locale === "object" && locale && "code" in locale && isLocale(locale.code)) {
        return locale.code;
    }
    return DEFAULT_LOCALE;
};

const pathFor = (collection: PreviewCollection, locale: Locale, slug: string): string => {
    switch (collection) {
        case "products":
            return ROUTES.product(locale, slug);
        case "categories":
            return ROUTES.category(locale, slug);
        case "articles":
            return ROUTES.article(locale, slug);
        default:
            return ROUTES.page(locale, slug);
    }
};

export const generatePreviewPath = ({
    collection,
    slug,
    locale,
}: GeneratePreviewPathArgs): string | null => {
    if (!slug) return null;

    const params = new URLSearchParams({
        path: pathFor(collection, resolveLocale(locale), encodeURIComponent(slug)),
        previewSecret: process.env.PREVIEW_SECRET || "",
    } satisfies PreviewSearchParams);

    return `/next/preview?${params.toString()}`;
};
