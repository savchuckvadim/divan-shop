import { cache } from "react";

import { getPayloadClient } from "@/modules/shared/api";
import { DEFAULT_LOCALE, type Locale } from "@/modules/shared/config";
import type { Category } from "@/payload-types";

export const getCategories = cache(async (locale: Locale): Promise<Category[]> => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
        collection: "categories",
        locale,
        fallbackLocale: DEFAULT_LOCALE,
        depth: 1,
        limit: 100,
        pagination: false,
        sort: "order",
    });
    return docs;
});

export const getCategoryBySlug = cache(
    async (slug: string, locale: Locale): Promise<Category | null> => {
        const payload = await getPayloadClient();
        const { docs } = await payload.find({
            collection: "categories",
            locale,
            fallbackLocale: DEFAULT_LOCALE,
            depth: 1,
            limit: 1,
            pagination: false,
            where: { slug: { equals: slug } },
        });
        return docs[0] ?? null;
    }
);

export const getCategorySlugs = cache(async (): Promise<{ slug: string; updatedAt: string }[]> => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
        collection: "categories",
        depth: 0,
        limit: 100,
        pagination: false,
        select: { slug: true, updatedAt: true },
    });
    return docs
        .filter((doc): doc is typeof doc & { slug: string } => Boolean(doc.slug))
        .map(({ slug, updatedAt }) => ({ slug, updatedAt }));
});
