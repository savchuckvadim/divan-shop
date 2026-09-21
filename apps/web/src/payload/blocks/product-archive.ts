import type { Block } from "payload";

import { richTextEditor } from "../fields/default-lexical";

export const ProductArchive: Block = {
    slug: "productArchive",
    interfaceName: "ProductArchiveBlock",
    labels: { singular: "Product Archive", plural: "Product Archives" },
    fields: [
        {
            name: "introContent",
            type: "richText",
            label: "Intro Content",
            editor: richTextEditor(["h1", "h2", "h3", "h4"]),
        },
        {
            name: "populateBy",
            type: "select",
            defaultValue: "collection",
            options: [
                { label: "Collection", value: "collection" },
                { label: "Individual Selection", value: "selection" },
            ],
        },
        {
            name: "categories",
            type: "relationship",
            relationTo: "categories",
            hasMany: true,
            label: "Categories To Show",
            admin: { condition: (_, siblingData) => siblingData.populateBy === "collection" },
        },
        {
            name: "featuredOnly",
            type: "checkbox",
            label: "Only featured products",
            admin: { condition: (_, siblingData) => siblingData.populateBy === "collection" },
        },
        {
            name: "limit",
            type: "number",
            defaultValue: 8,
            label: "Limit",
            admin: {
                step: 1,
                condition: (_, siblingData) => siblingData.populateBy === "collection",
            },
        },
        {
            name: "selectedDocs",
            type: "relationship",
            relationTo: "products",
            hasMany: true,
            label: "Selection",
            admin: { condition: (_, siblingData) => siblingData.populateBy === "selection" },
        },
        {
            name: "showViewAll",
            type: "checkbox",
            defaultValue: true,
            label: "Show 'View all' link to catalog",
        },
    ],
};
