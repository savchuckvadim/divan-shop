import type { Field } from "payload";

import { richTextEditor } from "./default-lexical";
import { linkGroup } from "./link-group";

export const HERO_TYPES = ["none", "highImpact", "mediumImpact", "lowImpact"] as const;

export type HeroType = (typeof HERO_TYPES)[number];

export const hero: Field = {
    name: "hero",
    type: "group",
    label: false,
    fields: [
        {
            name: "type",
            type: "select",
            label: "Type",
            required: true,
            defaultValue: "lowImpact",
            options: [
                { label: "None", value: "none" },
                { label: "High Impact", value: "highImpact" },
                { label: "Medium Impact", value: "mediumImpact" },
                { label: "Low Impact", value: "lowImpact" },
            ],
        },
        {
            name: "richText",
            type: "richText",
            label: false,
            localized: true,
            editor: richTextEditor(["h1", "h2", "h3", "h4"]),
        },
        linkGroup({ overrides: { maxRows: 2 } }),
        {
            name: "media",
            type: "upload",
            relationTo: "media",
            required: true,
            admin: {
                condition: (_, { type } = {}) => ["highImpact", "mediumImpact"].includes(type),
            },
        },
    ],
};
