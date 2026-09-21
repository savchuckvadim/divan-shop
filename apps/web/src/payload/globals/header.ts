import type { GlobalConfig } from "payload";

import { link } from "../fields";
import { createRevalidateGlobalHook } from "../hooks";

export const Header: GlobalConfig = {
    slug: "header",
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
    ],
    hooks: { afterChange: [createRevalidateGlobalHook("global_header")] },
};
