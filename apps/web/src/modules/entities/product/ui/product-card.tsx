"use client";

import Link from "next/link";

import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

import { type Currency, ROUTES } from "@/modules/shared/config";
import { useI18n } from "@/modules/shared/i18n";
import { Media } from "@/modules/shared/ui";

import { getProductCategory, getProductCover } from "../lib/product-helpers";
import type { Product } from "../type/product.type";
import { ProductAvailabilityBadge } from "./product-availability-badge";
import { ProductPrice } from "./product-price";

interface ProductCardProps {
    product: Product;
    currency: Currency;
    className?: string;
    priority?: boolean;
}

export const ProductCard = ({ product, currency, className, priority }: ProductCardProps) => {
    const { locale } = useI18n();
    const cover = getProductCover(product);
    const category = getProductCategory(product);
    const href = ROUTES.product(locale, product.slug ?? "");

    return (
        <Card className={cn("group overflow-hidden p-0", className)}>
            <Link href={href} className="block" aria-label={product.title}>
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {cover && (
                        <Media
                            resource={cover}
                            fill
                            priority={priority}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                    )}
                </div>
            </Link>
            <CardContent className="flex flex-col gap-2 p-4">
                {category && (
                    <Link
                        href={ROUTES.category(locale, category.slug ?? "")}
                        className="text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground"
                    >
                        {category.title}
                    </Link>
                )}
                <h3 className="font-serif text-lg font-medium leading-snug">
                    <Link href={href} className="hover:underline">
                        {product.title}
                    </Link>
                </h3>
                <div className="mt-auto flex items-center justify-between gap-2">
                    <ProductPrice
                        price={product.price}
                        oldPrice={product.oldPrice}
                        currency={currency}
                    />
                    <ProductAvailabilityBadge availability={product.availability} />
                </div>
            </CardContent>
        </Card>
    );
};
