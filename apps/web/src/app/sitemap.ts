import type { MetadataRoute } from "next";

import { getCategorySlugs, getPageSlugs, getProductSlugs, isHomeSlug } from "@/modules/entities";
import { type Locale, LOCALES, ROUTES } from "@/modules/shared/config";
import { absoluteUrl } from "@/modules/shared/lib";

type PathBuilder = (locale: Locale) => string;

const entry = (
    pathFor: PathBuilder,
    lastModified: string | Date,
    priority: number
): MetadataRoute.Sitemap =>
    LOCALES.map((locale) => ({
        url: absoluteUrl(pathFor(locale)),
        lastModified,
        priority,
        alternates: {
            languages: Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(pathFor(l))])),
        },
    }));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [pages, categories, products] = await Promise.all([
        getPageSlugs(),
        getCategorySlugs(),
        getProductSlugs(),
    ]);
    const now = new Date();

    return [
        ...entry((l) => ROUTES.home(l), now, 1),
        ...entry((l) => ROUTES.catalog(l), now, 0.9),
        ...pages
            .filter(({ slug }) => !isHomeSlug(slug))
            .flatMap(({ slug, updatedAt }) => entry((l) => ROUTES.page(l, slug), updatedAt, 0.6)),
        ...categories.flatMap(({ slug, updatedAt }) =>
            entry((l) => ROUTES.category(l, slug), updatedAt, 0.8)
        ),
        ...products.flatMap(({ slug, updatedAt }) =>
            entry((l) => ROUTES.product(l, slug), updatedAt, 0.7)
        ),
    ];
}
