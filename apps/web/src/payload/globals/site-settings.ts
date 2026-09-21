import type { GlobalConfig } from "payload";

import { CURRENCIES, DEFAULT_CURRENCY } from "@/modules/shared/config";

import { createRevalidateGlobalHook } from "../hooks";

export const SiteSettings: GlobalConfig = {
    slug: "site-settings",
    label: "Site Settings",
    access: { read: () => true },
    fields: [
        {
            type: "tabs",
            tabs: [
                {
                    label: "General",
                    fields: [
                        { name: "siteName", type: "text", localized: true },
                        {
                            name: "currency",
                            type: "select",
                            required: true,
                            defaultValue: DEFAULT_CURRENCY,
                            options: CURRENCIES.map((code) => ({ label: code, value: code })),
                        },
                        { name: "logo", type: "upload", relationTo: "media" },
                        { name: "defaultOgImage", type: "upload", relationTo: "media" },
                    ],
                },
                {
                    label: "Contacts",
                    name: "contacts",
                    fields: [
                        { name: "phone", type: "text" },
                        { name: "email", type: "text" },
                        { name: "address", type: "text", localized: true },
                        { name: "workingHours", type: "text", localized: true },
                        {
                            name: "socials",
                            type: "array",
                            fields: [
                                { name: "label", type: "text", required: true },
                                { name: "url", type: "text", required: true },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    hooks: { afterChange: [createRevalidateGlobalHook("global_site-settings")] },
};
