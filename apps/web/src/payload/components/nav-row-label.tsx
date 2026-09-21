"use client";

import { type RowLabelProps, useRowLabel } from "@payloadcms/ui";

import type { Header } from "@/payload-types";

type NavItem = NonNullable<Header["navItems"]>[number];

export const NavRowLabel: React.FC<RowLabelProps> = () => {
    const { data, rowNumber } = useRowLabel<NavItem>();
    const index = rowNumber !== undefined ? rowNumber + 1 : "";
    const label = data?.link?.label ? `Nav item ${index}: ${data.link.label}` : "Row";

    return <div>{label}</div>;
};
