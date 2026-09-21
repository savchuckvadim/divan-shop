import { cn } from "@workspace/ui/lib/utils";

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
            <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
                {emptyText ?? getDictionary(locale).catalog.empty}
            </p>
        );
    }

    return (
        <ul
            className={cn(
                "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                className
            )}
        >
            {products.map((product, index) => (
                <li key={product.id}>
                    <ProductCard product={product} currency={currency} priority={index < 4} />
                </li>
            ))}
        </ul>
    );
};
