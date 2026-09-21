import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { Tab } from "payload";

export const seoTab: Tab = {
    name: "meta",
    label: "SEO",
    fields: [
        OverviewField({
            titlePath: "meta.title",
            descriptionPath: "meta.description",
            imagePath: "meta.image",
        }),
        MetaTitleField({ hasGenerateFn: true, overrides: { localized: true } }),
        MetaDescriptionField({ overrides: { localized: true } }),
        MetaImageField({ relationTo: "media" }),
        PreviewField({
            hasGenerateFn: true,
            titlePath: "meta.title",
            descriptionPath: "meta.description",
        }),
    ],
};
