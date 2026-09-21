import { type CollectionConfig, slugField } from "payload";

import { ROUTES } from "@/modules/shared/config";

import { anyone, authenticated } from "../access";
import { createRevalidateHooks } from "../hooks";

export const CATEGORIES_CACHE_TAG = "categories";

const { afterChange, afterDelete } = createRevalidateHooks(ROUTES.category, CATEGORIES_CACHE_TAG);

export const Categories: CollectionConfig<"categories"> = {
    slug: "categories",
    access: {
        create: authenticated,
        delete: authenticated,
        read: anyone,
        update: authenticated,
    },
    defaultPopulate: { title: true, slug: true },
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "slug", "updatedAt"],
    },
    fields: [
        { name: "title", type: "text", required: true, localized: true },
        slugField({ position: undefined }),
        { name: "description", type: "textarea", localized: true },
        { name: "image", type: "upload", relationTo: "media" },
        {
            name: "order",
            type: "number",
            defaultValue: 0,
            admin: { position: "sidebar", description: "Lower comes first" },
        },
        {
            name: "meta",
            type: "group",
            label: "SEO",
            fields: [
                { name: "title", type: "text", localized: true },
                { name: "description", type: "textarea", localized: true },
            ],
        },
    ],
    hooks: { afterChange: [afterChange], afterDelete: [afterDelete] },
};
