import type { ReactNode } from "react";

import { EmptyState } from "@workspace/ui/composites/empty-state";
import { cn } from "@workspace/ui/lib/utils";

import { type Product, ProductCard } from "@/modules/entities";
import type { Currency, Locale } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";

interface ProductGridProps {
    products: Product[];
    currency: Currency;
    locale: Locale;
    className?: string;
    /** h2 when the grid sits right under the page h1 (catalog), h3 inside a titled section. */
    titleAs?: "h2" | "h3";
    emptyText?: string;
    emptyDescription?: ReactNode;
    emptyAction?: ReactNode;
}

/** Columns and gaps come from the active theme (`product-grid` slot); the classes are a fallback. */
export const ProductGrid = ({
    products,
    currency,
    locale,
    className,
    titleAs,
    emptyText,
    emptyDescription,
    emptyAction,
}: ProductGridProps) => {
    if (!products.length) {
        return (
            <EmptyState
                as="p"
                className={className}
                title={emptyText ?? getDictionary(locale).catalog.empty}
                description={emptyDescription}
                action={emptyAction}
            />
        );
    }

    return (
        <ul
            data-slot="product-grid"
            className={cn(
                "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4",
                className
            )}
        >
            {products.map((product, index) => (
                <li key={product.id} className="min-w-0">
                    <ProductCard
                        product={product}
                        currency={currency}
                        priority={index < 4}
                        titleAs={titleAs}
                    />
                </li>
            ))}
        </ul>
    );
};
