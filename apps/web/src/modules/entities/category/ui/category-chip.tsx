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
            "rounded-full border px-4 py-1.5 text-sm transition-colors",
            active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-secondary"
        )}
    >
        {label}
    </Link>
);
