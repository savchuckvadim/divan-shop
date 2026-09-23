import type { MetadataRoute } from "next";

import {
    getArticleSlugs,
    getCategorySlugs,
    getPageSlugs,
    getProductSlugs,
    isHomeSlug,
} from "@/modules/entities";
import { type Locale, LOCALES, ROUTES } from "@/modules/shared/config";
import { absoluteUrl } from "@/modules/shared/lib";

/** Built from CMS data, so it is generated per request (no database during docker build). */
export const dynamic = "force-dynamic";

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
    const [pages, categories, products, articles] = await Promise.all([
        getPageSlugs(),
        getCategorySlugs(),
        getProductSlugs(),
        getArticleSlugs(),
    ]);
    const now = new Date();

    return [
        ...entry((l) => ROUTES.home(l), now, 1),
        ...entry((l) => ROUTES.catalog(l), now, 0.9),
        ...entry((l) => ROUTES.blog(l), now, 0.6),
        ...pages
            .filter(({ slug }) => !isHomeSlug(slug))
            .flatMap(({ slug, updatedAt }) => entry((l) => ROUTES.page(l, slug), updatedAt, 0.6)),
        ...categories.flatMap(({ slug, updatedAt }) =>
            entry((l) => ROUTES.category(l, slug), updatedAt, 0.8)
        ),
        ...products.flatMap(({ slug, updatedAt }) =>
            entry((l) => ROUTES.product(l, slug), updatedAt, 0.7)
        ),
        ...articles.flatMap(({ slug, updatedAt }) =>
            entry((l) => ROUTES.article(l, slug), updatedAt, 0.5)
        ),
    ];
}
