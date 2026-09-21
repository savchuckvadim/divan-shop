import {
    BoldFeature,
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    ItalicFeature,
    lexicalEditor,
    LinkFeature,
    type LinkFields,
    ParagraphFeature,
    UnderlineFeature,
} from "@payloadcms/richtext-lexical";
import type { TextFieldSingleValidation } from "payload";

import { LINK_COLLECTIONS } from "./link";

export const defaultLexical = lexicalEditor({
    features: [
        ParagraphFeature(),
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        LinkFeature({
            enabledCollections: [...LINK_COLLECTIONS],
            fields: ({ defaultFields }) => [
                ...defaultFields.filter((field) => !("name" in field && field.name === "url")),
                {
                    name: "url",
                    type: "text",
                    required: true,
                    label: ({ t }) => t("fields:enterURL"),
                    admin: {
                        condition: (_data, siblingData) => siblingData?.linkType !== "internal",
                    },
                    validate: ((value, options) => {
                        if ((options?.siblingData as LinkFields)?.linkType === "internal") {
                            return true;
                        }
                        return value ? true : "URL is required";
                    }) as TextFieldSingleValidation,
                },
            ],
        }),
    ],
});

type HeadingSize = "h1" | "h2" | "h3" | "h4";

export const richTextEditor = (headings: HeadingSize[] = ["h2", "h3", "h4"]) =>
    lexicalEditor({
        features: ({ rootFeatures }) => [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: headings }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
        ],
    });
