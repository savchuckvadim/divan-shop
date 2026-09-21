import { cache } from "react";

import { getPayloadClient } from "@/modules/shared/api";
import { DEFAULT_LOCALE, type Locale, SITE } from "@/modules/shared/config";
import type { Page } from "@/payload-types";

export const getPageBySlug = cache(
    async (slug: string, locale: Locale, draft = false): Promise<Page | null> => {
        const payload = await getPayloadClient();
        const { docs } = await payload.find({
            collection: "pages",
            locale,
            fallbackLocale: DEFAULT_LOCALE,
            draft,
            overrideAccess: draft,
            depth: 2,
            limit: 1,
            pagination: false,
            where: { slug: { equals: slug } },
        });
        return docs[0] ?? null;
    }
);

export const getPageSlugs = cache(async (): Promise<{ slug: string; updatedAt: string }[]> => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
        collection: "pages",
        draft: false,
        overrideAccess: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        select: { slug: true, updatedAt: true },
    });
    return docs
        .filter((doc): doc is typeof doc & { slug: string } => Boolean(doc.slug))
        .map(({ slug, updatedAt }) => ({ slug, updatedAt }));
});

export const isHomeSlug = (slug: string): boolean => slug === SITE.homeSlug;
