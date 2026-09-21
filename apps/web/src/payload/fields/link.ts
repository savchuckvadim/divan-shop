import type { Field, GroupField } from "payload";

export type LinkAppearance = "default" | "outline";

const appearanceOptions: Record<LinkAppearance, { label: string; value: LinkAppearance }> = {
    default: { label: "Default", value: "default" },
    outline: { label: "Outline", value: "outline" },
};

interface LinkOptions {
    appearances?: LinkAppearance[] | false;
    disableLabel?: boolean;
    overrides?: Partial<Omit<GroupField, "fields" | "type">>;
}

export const LINK_COLLECTIONS = ["pages", "categories", "products", "articles"] as const;

export const link = ({
    appearances,
    disableLabel = false,
    overrides = {},
}: LinkOptions = {}): Field => {
    const targetFields = (width?: string): Field[] => [
        {
            name: "reference",
            type: "relationship",
            relationTo: [...LINK_COLLECTIONS],
            required: true,
            label: "Document to link to",
            admin: { width, condition: (_, siblingData) => siblingData?.type === "reference" },
        },
        {
            name: "url",
            type: "text",
            required: true,
            label: "Custom URL",
            admin: { width, condition: (_, siblingData) => siblingData?.type === "custom" },
        },
    ];

    const fields: Field[] = [
        {
            type: "row",
            fields: [
                {
                    name: "type",
                    type: "radio",
                    defaultValue: "reference",
                    admin: { layout: "horizontal", width: "50%" },
                    options: [
                        { label: "Internal link", value: "reference" },
                        { label: "Custom URL", value: "custom" },
                    ],
                },
                {
                    name: "newTab",
                    type: "checkbox",
                    label: "Open in new tab",
                    admin: { style: { alignSelf: "flex-end" }, width: "50%" },
                },
            ],
        },
    ];

    if (disableLabel) {
        fields.push(...targetFields());
    } else {
        fields.push({
            type: "row",
            fields: [
                ...targetFields("50%"),
                {
                    name: "label",
                    type: "text",
                    label: "Label",
                    required: true,
                    localized: true,
                    admin: { width: "50%" },
                },
            ],
        });
    }

    if (appearances !== false) {
        const options = (appearances ?? ["default", "outline"]).map(
            (appearance) => appearanceOptions[appearance]
        );
        fields.push({
            name: "appearance",
            type: "select",
            defaultValue: "default",
            options,
            admin: { description: "Choose how the link should be rendered." },
        });
    }

    return {
        name: "link",
        type: "group",
        admin: { hideGutter: true },
        ...overrides,
        fields,
    };
};
