import { type CollectionConfig, slugField } from "payload";

import { ROUTES } from "@/modules/shared/config";

import { authenticated, authenticatedOrPublished } from "../access";
import { CallToAction, Content, Faq, FormBlock, MediaBlock, ProductArchive } from "../blocks";
import { hero, seoTab } from "../fields";
import { createRevalidateHooks, populatePublishedAt } from "../hooks";
import { generatePreviewPath } from "../lib/generate-preview-path";

export const PAGES_CACHE_TAG = "pages";

const { afterChange, afterDelete } = createRevalidateHooks(ROUTES.page, PAGES_CACHE_TAG);

export const Pages: CollectionConfig<"pages"> = {
    slug: "pages",
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticatedOrPublished,
        update: authenticated,
    },
    defaultPopulate: { title: true, slug: true },
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "slug", "updatedAt"],
        livePreview: {
            url: ({ data, locale }) =>
                generatePreviewPath({ collection: "pages", slug: data?.slug, locale }),
        },
        preview: (data, { locale }) =>
            generatePreviewPath({ collection: "pages", slug: data?.slug as string, locale }),
    },
    fields: [
        { name: "title", type: "text", required: true, localized: true },
        {
            type: "tabs",
            tabs: [
                { label: "Hero", fields: [hero] },
                {
                    label: "Content",
                    fields: [
                        {
                            name: "layout",
                            type: "blocks",
                            required: true,
                            localized: true,
                            blocks: [
                                CallToAction,
                                Content,
                                MediaBlock,
                                ProductArchive,
                                FormBlock,
                                Faq,
                            ],
                            admin: { initCollapsed: true },
                        },
                    ],
                },
                seoTab,
            ],
        },
        {
            name: "publishedAt",
            type: "date",
            admin: { position: "sidebar" },
        },
        slugField(),
    ],
    hooks: {
        afterChange: [afterChange],
        beforeChange: [populatePublishedAt],
        afterDelete: [afterDelete],
    },
    versions: {
        drafts: { autosave: { interval: 100 }, schedulePublish: true },
        maxPerDoc: 50,
    },
};
