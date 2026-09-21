import { type Locale, ROUTES } from "@/modules/shared/config";
import type { Category, Page, Product } from "@/payload-types";

export type CmsLinkCollection = "pages" | "categories" | "products";

export interface CmsLinkTarget {
    type?: "custom" | "reference" | null;
    url?: string | null;
    reference?: {
        relationTo: CmsLinkCollection;
        value: Page | Category | Product | string | number;
    } | null;
}

export const hrefForDoc = (collection: CmsLinkCollection, slug: string, locale: Locale): string => {
    switch (collection) {
        case "products":
            return ROUTES.product(locale, slug);
        case "categories":
            return ROUTES.category(locale, slug);
        default:
            return ROUTES.page(locale, slug);
    }
};

export const resolveCmsHref = (target: CmsLinkTarget, locale: Locale): string | null => {
    if (target.type === "reference") {
        const value = target.reference?.value;
        if (target.reference && typeof value === "object" && value.slug) {
            return hrefForDoc(target.reference.relationTo, value.slug, locale);
        }
        return null;
    }
    return target.url || null;
};
