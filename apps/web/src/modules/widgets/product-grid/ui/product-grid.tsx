import type { ReactNode } from "react";

import { CardGrid } from "@workspace/ui/composites/card";
import { EmptyState } from "@workspace/ui/composites/empty-state";

import { type Product, ProductCard } from "@/modules/entities";
import type { Currency, Locale } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";

interface ProductGridProps {
    products: Product[];
    currency: Currency;
    locale: Locale;
    className?: string;
    emptyText?: string;
    emptyDescription?: ReactNode;
    emptyAction?: ReactNode;
}

export const ProductGrid = ({
    products,
    currency,
    locale,
    className,
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
        <CardGrid as="ul" cols={4} className={className}>
            {products.map((product, index) => (
                <li key={product.id}>
                    <ProductCard product={product} currency={currency} priority={index < 4} />
                </li>
            ))}
        </CardGrid>
    );
};
