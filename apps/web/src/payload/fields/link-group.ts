import type { ArrayField, Field } from "payload";

import { link, type LinkAppearance } from "./link";

interface LinkGroupOptions {
    appearances?: LinkAppearance[] | false;
    overrides?: Partial<Omit<ArrayField, "fields" | "type">>;
}

export const linkGroup = ({ appearances, overrides = {} }: LinkGroupOptions = {}): Field => ({
    name: "links",
    type: "array",
    localized: true,
    admin: { initCollapsed: true },
    ...overrides,
    fields: [link({ appearances })],
});
