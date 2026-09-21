"use client";

import Link from "next/link";

import { Badge } from "@workspace/ui/components/badge";
import { Card } from "@workspace/ui/composites/card";
import { cn } from "@workspace/ui/lib/utils";

import { type Currency, ROUTES } from "@/modules/shared/config";
import { useI18n } from "@/modules/shared/i18n";
import { Media } from "@/modules/shared/ui";

import { getDiscountPercent, getProductCategory, getProductCover } from "../lib/product-helpers";
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
    const { locale, dictionary } = useI18n();
    const cover = getProductCover(product);
    const category = getProductCategory(product);
    const discount = getDiscountPercent(product);
    const href = ROUTES.product(locale, product.slug ?? "");

    return (
        <Card
            interactive
            padding="sm"
            className={cn("h-full", className)}
            media={
                <Link
                    href={href}
                    className="relative block aspect-[4/3]"
                    aria-label={product.title}
                    tabIndex={-1}
                >
                    {cover ? (
                        <Media
                            resource={cover}
                            fill
                            priority={priority}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            imgClassName="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
                        />
                    ) : (
                        <span
                            aria-hidden
                            className="flex h-full items-center justify-center bg-hero font-serif text-5xl italic text-primary/40"
                        >
                            {product.title.charAt(0)}
                        </span>
                    )}
                    {discount && (
                        <Badge className="absolute left-3 top-3 shadow-sm">
                            <span className="sr-only">{dictionary.product.discount} </span>−
                            {discount}%
                        </Badge>
                    )}
                </Link>
            }
            eyebrow={
                category && (
                    <Link
                        href={ROUTES.category(locale, category.slug ?? "")}
                        className="transition-colors hover:text-primary"
                    >
                        {category.title}
                    </Link>
                )
            }
            title={
                <Link href={href} className="transition-colors hover:text-primary">
                    {product.title}
                </Link>
            }
            footer={
                <>
                    <ProductPrice
                        price={product.price}
                        oldPrice={product.oldPrice}
                        currency={currency}
                    />
                    <ProductAvailabilityBadge availability={product.availability} />
                </>
            }
        />
    );
};
