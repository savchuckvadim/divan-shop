import type { Block } from "payload";

import { richTextEditor } from "../fields/default-lexical";
import { linkGroup } from "../fields/link-group";

export const CallToAction: Block = {
    slug: "cta",
    interfaceName: "CallToActionBlock",
    labels: { singular: "Call to Action", plural: "Calls to Action" },
    fields: [
        {
            name: "richText",
            type: "richText",
            label: false,
            editor: richTextEditor(["h1", "h2", "h3", "h4"]),
        },
        linkGroup({
            appearances: ["default", "outline"],
            overrides: { maxRows: 2, localized: false },
        }),
    ],
};
