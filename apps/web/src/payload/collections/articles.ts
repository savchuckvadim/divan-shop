import { revalidatePath } from "next/cache";

import { type CollectionAfterChangeHook, type CollectionConfig, slugField } from "payload";

import { LOCALES, ROUTES } from "@/modules/shared/config";
import type { Article } from "@/payload-types";

import { authenticated, authenticatedOrPublished } from "../access";
import { richTextEditor, seoTab } from "../fields";
import { createRevalidateHooks, populatePublishedAt } from "../hooks";
import { generatePreviewPath } from "../lib/generate-preview-path";

export const ARTICLES_CACHE_TAG = "articles";

const { afterChange, afterDelete } = createRevalidateHooks(ROUTES.article, ARTICLES_CACHE_TAG);

const revalidateBlogIndex: CollectionAfterChangeHook<Article> = ({ doc, req }) => {
    if (!req.context.disableRevalidate) {
        for (const locale of LOCALES) {
            revalidatePath(ROUTES.blog(locale));
        }
    }
    return doc;
};

export const Articles: CollectionConfig<"articles"> = {
    slug: "articles",
    labels: { singular: "Article", plural: "Articles" },
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticatedOrPublished,
        update: authenticated,
    },
    defaultPopulate: { title: true, slug: true, excerpt: true, cover: true, publishedAt: true },
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "slug", "publishedAt", "updatedAt"],
        livePreview: {
            url: ({ data, locale }) =>
                generatePreviewPath({ collection: "articles", slug: data?.slug, locale }),
        },
        preview: (data, { locale }) =>
            generatePreviewPath({ collection: "articles", slug: data?.slug as string, locale }),
    },
    fields: [
        { name: "title", type: "text", required: true, localized: true },
        {
            type: "tabs",
            tabs: [
                {
                    label: "Content",
                    fields: [
                        { name: "excerpt", type: "textarea", localized: true },
                        { name: "cover", type: "upload", relationTo: "media" },
                        {
                            name: "content",
                            type: "richText",
                            localized: true,
                            editor: richTextEditor(["h2", "h3", "h4"]),
                        },
                    ],
                },
                seoTab,
            ],
        },
        {
            name: "author",
            type: "relationship",
            relationTo: "users",
            admin: { position: "sidebar" },
        },
        {
            name: "publishedAt",
            type: "date",
            admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
        },
        slugField(),
    ],
    hooks: {
        afterChange: [afterChange, revalidateBlogIndex],
        beforeChange: [populatePublishedAt],
        afterDelete: [afterDelete],
    },
    versions: {
        drafts: { autosave: { interval: 100 }, schedulePublish: true },
        maxPerDoc: 50,
    },
};
