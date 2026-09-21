import type { CollectionConfig } from "payload";

import { authenticated } from "../access";

export const Users: CollectionConfig = {
    slug: "users",
    auth: true,
    timestamps: true,
    access: {
        admin: authenticated,
        create: authenticated,
        delete: authenticated,
        read: authenticated,
        update: authenticated,
    },
    admin: {
        defaultColumns: ["name", "email"],
        useAsTitle: "name",
    },
    fields: [{ name: "name", type: "text" }],
};
