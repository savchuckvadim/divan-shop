import type { Block } from "payload";

import { richTextEditor } from "../fields/default-lexical";

export const FormBlock: Block = {
    slug: "formBlock",
    interfaceName: "FormBlock",
    graphQL: { singularName: "FormBlock" },
    labels: { singular: "Form Block", plural: "Form Blocks" },
    fields: [
        {
            name: "form",
            type: "relationship",
            relationTo: "forms",
            required: true,
        },
        {
            name: "enableIntro",
            type: "checkbox",
            label: "Enable Intro Content",
        },
        {
            name: "introContent",
            type: "richText",
            label: "Intro Content",
            editor: richTextEditor(["h1", "h2", "h3", "h4"]),
            admin: { condition: (_, { enableIntro }) => Boolean(enableIntro) },
        },
    ],
};
