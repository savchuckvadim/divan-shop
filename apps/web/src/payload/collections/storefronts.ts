import { revalidatePath, revalidateTag } from "next/cache";

import type { CollectionAfterChangeHook, CollectionConfig } from "payload";

import { LOCALES, ROUTES, STOREFRONTS, STOREFRONTS_CACHE_TAG } from "@/modules/shared/config";

import { anyone, authenticated } from "../access";

const revalidateStorefront: CollectionAfterChangeHook = ({ doc, req }) => {
    if (req.context.disableRevalidate) return doc;
    revalidateTag(STOREFRONTS_CACHE_TAG, "max");
    for (const locale of LOCALES) revalidatePath(ROUTES.home(locale));
    return doc;
};

/**
 * One document per storefront build (NEXT_PUBLIC_STOREFRONT): what differs between the domains on the
 * shared database — home hero, slogan, contact overrides. Theme and fonts stay in code (ADR-0011).
 */
export const Storefronts: CollectionConfig<"storefronts"> = {
    slug: "storefronts",
    access: {
        create: authenticated,
        delete: authenticated,
        read: anyone,
        update: authenticated,
    },
    admin: {
        useAsTitle: "domain",
        defaultColumns: ["domain", "key", "updatedAt"],
        description:
            "Home hero, slogan and contacts of each storefront. Empty contacts fall back to Site Settings.",
    },
    fields: [
        {
            type: "row",
            fields: [
                {
                    name: "key",
                    type: "select",
                    required: true,
                    unique: true,
                    options: STOREFRONTS.map((value) => ({ label: value, value })),
                    admin: {
                        width: "50%",
                        description: "Matches NEXT_PUBLIC_STOREFRONT of the build",
                    },
                },
                {
                    name: "domain",
                    type: "text",
                    required: true,
                    admin: { width: "50%", description: "e.g. divan.group" },
                },
            ],
        },
        { name: "slogan", type: "text", localized: true },
        {
            type: "tabs",
            tabs: [
                {
                    label: "Hero",
                    name: "hero",
                    fields: [
                        { name: "heading", type: "text", localized: true },
                        { name: "text", type: "textarea", localized: true },
                        {
                            name: "slides",
                            type: "array",
                            labels: { singular: "Slide", plural: "Slides" },
                            admin: {
                                description:
                                    "Carousel images. The first one loads with priority (LCP): keep it the best and lightest.",
                            },
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
                            name: "cta",
                            type: "select",
                            defaultValue: "catalog",
                            options: [
                                { label: "Catalog", value: "catalog" },
                                { label: "Contacts", value: "contacts" },
                            ],
                        },
                    ],
                },
                {
                    label: "Contacts",
                    name: "contacts",
                    fields: [
                        {
                            type: "row",
                            fields: [
                                { name: "phone", type: "text", admin: { width: "50%" } },
                                { name: "email", type: "email", admin: { width: "50%" } },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    hooks: {
        afterChange: [revalidateStorefront],
    },
};
