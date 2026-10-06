import { cn } from "@workspace/ui/lib/utils";

import { SITE, STOREFRONT_WORDMARK } from "@/modules/shared/config";

interface LogoProps {
    className?: string;
    name?: string | null;
    size?: "md" | "lg";
}

/** Each storefront signs with its own domain; without one (local dev) the site name stands in. */
export const Logo = ({ className, name, size = "md" }: LogoProps) => (
    <span
        data-slot="logo"
        className={cn("inline-flex items-baseline whitespace-nowrap leading-none", className)}
    >
        <span
            data-slot="wordmark"
            className={cn(
                "font-display tracking-[-0.02em] text-foreground",
                size === "lg" ? "text-[1.75rem]" : "text-[1.375rem]"
            )}
        >
            {STOREFRONT_WORDMARK?.name ?? (name || SITE.name)}
        </span>
        {STOREFRONT_WORDMARK && (
            <span className="font-label text-xs text-muted-foreground max-sm:hidden">
                {STOREFRONT_WORDMARK.tld}
            </span>
        )}
    </span>
);
