import { cache } from "react";

import type { PaginatedDocs } from "payload";

import { getPayloadClient } from "@/modules/shared/api";
import { DEFAULT_LOCALE, type Locale, SITE } from "@/modules/shared/config";

import type { Article, ArticleSlugEntry } from "../type/article.type";

export interface GetArticlesArgs {
    locale: Locale;
    page?: number;
    limit?: number;
    excludeIds?: (string | number)[];
}

export const getArticles = cache(
    async ({
        locale,
        page = 1,
        limit = SITE.blogPageSize,
        excludeIds,
    }: GetArticlesArgs): Promise<PaginatedDocs<Article>> => {
        const payload = await getPayloadClient();
        return payload.find({
            collection: "articles",
            locale,
            fallbackLocale: DEFAULT_LOCALE,
            depth: 1,
            limit,
            page,
            sort: "-publishedAt",
            where: excludeIds?.length ? { id: { not_in: excludeIds } } : undefined,
        });
    }
);

export const getArticleBySlug = cache(
    async (slug: string, locale: Locale, draft = false): Promise<Article | null> => {
        const payload = await getPayloadClient();
        const { docs } = await payload.find({
            collection: "articles",
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

export const getArticleSlugs = cache(async (): Promise<ArticleSlugEntry[]> => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
        collection: "articles",
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
