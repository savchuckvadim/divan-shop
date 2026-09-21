import type { Block } from "payload";

import { richTextEditor } from "../fields/default-lexical";

export const Faq: Block = {
    slug: "faq",
    interfaceName: "FaqBlock",
    labels: { singular: "FAQ", plural: "FAQs" },
    fields: [
        { name: "title", type: "text", localized: true },
        {
            name: "items",
            type: "array",
            required: true,
            minRows: 1,
            labels: { singular: "Question", plural: "Questions" },
            admin: { initCollapsed: true },
            fields: [
                { name: "question", type: "text", required: true, localized: true },
                {
                    name: "answer",
                    type: "richText",
                    required: true,
                    localized: true,
                    editor: richTextEditor(["h3", "h4"]),
                },
            ],
        },
    ],
};
