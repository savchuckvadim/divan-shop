import { cache } from "react";

import type { PaginatedDocs, Where } from "payload";

import { getPayloadClient } from "@/modules/shared/api";
import { DEFAULT_LOCALE, type Locale, SITE } from "@/modules/shared/config";

import type { Product, ProductSlugEntry } from "../type/product.type";

export interface GetProductsArgs {
    locale: Locale;
    categoryIds?: (string | number)[];
    featuredOnly?: boolean;
    limit?: number;
    page?: number;
    draft?: boolean;
}

export const getProducts = cache(
    async ({
        locale,
        categoryIds,
        featuredOnly,
        limit = SITE.catalogPageSize,
        page = 1,
        draft = false,
    }: GetProductsArgs): Promise<PaginatedDocs<Product>> => {
        const payload = await getPayloadClient();

        const where: Where = { and: [] };
        const conditions = where.and as Where[];
        if (categoryIds?.length) conditions.push({ category: { in: categoryIds } });
        if (featuredOnly) conditions.push({ featured: { equals: true } });

        return payload.find({
            collection: "products",
            locale,
            fallbackLocale: DEFAULT_LOCALE,
            draft,
            overrideAccess: draft,
            depth: 1,
            limit,
            page,
            sort: "-publishedAt",
            where: conditions.length ? where : undefined,
        });
    }
);

export const getProductsByIds = cache(
    async (ids: (string | number)[], locale: Locale): Promise<Product[]> => {
        if (!ids.length) return [];
        const payload = await getPayloadClient();
        const { docs } = await payload.find({
            collection: "products",
            locale,
            fallbackLocale: DEFAULT_LOCALE,
            depth: 1,
            limit: ids.length,
            pagination: false,
            where: { id: { in: ids } },
        });
        return ids
            .map((id) => docs.find((doc) => String(doc.id) === String(id)))
            .filter((doc): doc is Product => Boolean(doc));
    }
);

export const getProductBySlug = cache(
    async (slug: string, locale: Locale, draft = false): Promise<Product | null> => {
        const payload = await getPayloadClient();
        const { docs } = await payload.find({
            collection: "products",
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

export const getProductSlugs = cache(async (): Promise<ProductSlugEntry[]> => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
        collection: "products",
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
