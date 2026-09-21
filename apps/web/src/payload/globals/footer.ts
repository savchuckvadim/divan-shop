import type { GlobalConfig } from "payload";

import { link } from "../fields";
import { createRevalidateGlobalHook } from "../hooks";

export const Footer: GlobalConfig = {
    slug: "footer",
    access: { read: () => true },
    fields: [
        {
            name: "navItems",
            type: "array",
            maxRows: 8,
            fields: [link({ appearances: false })],
            admin: {
                initCollapsed: true,
                components: { RowLabel: "@/payload/components/nav-row-label#NavRowLabel" },
            },
        },
        { name: "copyright", type: "text", localized: true },
    ],
    hooks: { afterChange: [createRevalidateGlobalHook("global_footer")] },
};
