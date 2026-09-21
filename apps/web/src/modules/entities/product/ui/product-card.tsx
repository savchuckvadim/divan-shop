"use client";

import Link from "next/link";

import { Card } from "@workspace/ui/composites/card";

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
        <Card
            interactive
            padding="sm"
            className={className}
            media={
                <Link
                    href={href}
                    className="relative block aspect-[4/3]"
                    aria-label={product.title}
                >
                    {cover && (
                        <Media
                            resource={cover}
                            fill
                            priority={priority}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                    )}
                </Link>
            }
            eyebrow={
                category && (
                    <Link
                        href={ROUTES.category(locale, category.slug ?? "")}
                        className="hover:text-foreground"
                    >
                        {category.title}
                    </Link>
                )
            }
            title={
                <Link href={href} className="hover:underline">
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
