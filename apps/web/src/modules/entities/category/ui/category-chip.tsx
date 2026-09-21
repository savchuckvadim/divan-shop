import Link from "next/link";

import { cn } from "@workspace/ui/lib/utils";

interface CategoryChipProps {
    href: string;
    label: string;
    active?: boolean;
}

export const CategoryChip = ({ href, label, active }: CategoryChipProps) => (
    <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
            "inline-flex shrink-0 snap-start items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-200",
            active
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-background text-foreground/80 hover:border-foreground/30 hover:bg-secondary/60 hover:text-foreground"
        )}
    >
        {label}
    </Link>
);
