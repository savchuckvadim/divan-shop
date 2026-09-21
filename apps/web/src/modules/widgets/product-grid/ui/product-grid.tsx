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
}

export const ProductGrid = ({
    products,
    currency,
    locale,
    className,
    emptyText,
}: ProductGridProps) => {
    if (!products.length) {
        return (
            <EmptyState
                className={className}
                title={emptyText ?? getDictionary(locale).catalog.empty}
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
