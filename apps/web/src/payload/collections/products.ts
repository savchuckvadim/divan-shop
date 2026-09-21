import { type CollectionConfig, slugField } from "payload";

import { ROUTES } from "@/modules/shared/config";

import { authenticated, authenticatedOrPublished } from "../access";
import { richTextEditor, seoTab } from "../fields";
import { createRevalidateHooks, populatePublishedAt } from "../hooks";
import { generatePreviewPath } from "../lib/generate-preview-path";

export const PRODUCTS_CACHE_TAG = "products";

export const AVAILABILITY = ["inStock", "onRequest", "outOfStock"] as const;
export const MATERIALS = ["fabric", "leather", "ecoLeather", "velour"] as const;
export const MECHANISMS = ["none", "eurobook", "accordion", "dolphin", "clickClack"] as const;

const { afterChange, afterDelete } = createRevalidateHooks(ROUTES.product, PRODUCTS_CACHE_TAG);

export const Products: CollectionConfig<"products"> = {
    slug: "products",
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticatedOrPublished,
        update: authenticated,
    },
    defaultPopulate: {
        title: true,
        slug: true,
        price: true,
        oldPrice: true,
        availability: true,
        gallery: true,
        category: true,
    },
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "category", "price", "availability", "updatedAt"],
        livePreview: {
            url: ({ data, locale }) =>
                generatePreviewPath({ collection: "products", slug: data?.slug, locale }),
        },
        preview: (data, { locale }) =>
            generatePreviewPath({ collection: "products", slug: data?.slug as string, locale }),
    },
    fields: [
        { name: "title", type: "text", required: true, localized: true },
        {
            type: "tabs",
            tabs: [
                {
                    label: "Product",
                    fields: [
                        {
                            type: "row",
                            fields: [
                                {
                                    name: "category",
                                    type: "relationship",
                                    relationTo: "categories",
                                    required: true,
                                    admin: { width: "50%" },
                                },
                                {
                                    name: "availability",
                                    type: "select",
                                    required: true,
                                    defaultValue: "inStock",
                                    options: [
                                        { label: "In stock", value: "inStock" },
                                        { label: "On request", value: "onRequest" },
                                        { label: "Out of stock", value: "outOfStock" },
                                    ],
                                    admin: { width: "50%" },
                                },
                            ],
                        },
                        {
                            type: "row",
                            fields: [
                                {
                                    name: "price",
                                    type: "number",
                                    required: true,
                                    min: 0,
                                    admin: { width: "50%" },
                                },
                                {
                                    name: "oldPrice",
                                    type: "number",
                                    min: 0,
                                    admin: { width: "50%" },
                                },
                            ],
                        },
                        {
                            name: "gallery",
                            type: "array",
                            minRows: 1,
                            labels: { singular: "Image", plural: "Gallery" },
                            fields: [
                                {
                                    name: "image",
                                    type: "upload",
                                    relationTo: "media",
                                    required: true,
                                },
                            ],
                        },
                        {
                            name: "description",
                            type: "richText",
                            localized: true,
                            editor: richTextEditor(),
                        },
                    ],
                },
                {
                    label: "Specs",
                    name: "specs",
                    fields: [
                        {
                            type: "row",
                            fields: [
                                { name: "width", type: "number", min: 0, admin: { width: "33%" } },
                                { name: "depth", type: "number", min: 0, admin: { width: "33%" } },
                                { name: "height", type: "number", min: 0, admin: { width: "33%" } },
                            ],
                        },
                        {
                            name: "sleepingWidth",
                            type: "number",
                            min: 0,
                            admin: { description: "Sleeping area width in cm, if foldable" },
                        },
                        {
                            type: "row",
                            fields: [
                                {
                                    name: "material",
                                    type: "select",
                                    options: [
                                        { label: "Fabric", value: "fabric" },
                                        { label: "Leather", value: "leather" },
                                        { label: "Eco leather", value: "ecoLeather" },
                                        { label: "Velour", value: "velour" },
                                    ],
                                    admin: { width: "50%" },
                                },
                                {
                                    name: "mechanism",
                                    type: "select",
                                    defaultValue: "none",
                                    options: [
                                        { label: "No mechanism", value: "none" },
                                        { label: "Eurobook", value: "eurobook" },
                                        { label: "Accordion", value: "accordion" },
                                        { label: "Dolphin", value: "dolphin" },
                                        { label: "Click-clack", value: "clickClack" },
                                    ],
                                    admin: { width: "50%" },
                                },
                            ],
                        },
                        { name: "color", type: "text", localized: true },
                    ],
                },
                seoTab,
            ],
        },
        {
            name: "featured",
            type: "checkbox",
            defaultValue: false,
            admin: { position: "sidebar" },
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
        maxPerDoc: 20,
    },
};
