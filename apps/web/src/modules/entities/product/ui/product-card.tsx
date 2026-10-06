"use client";

import Link from "next/link";

import { Badge } from "@workspace/ui/components/badge";
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
    titleAs?: "h2" | "h3";
}

/** Gallery card: the photo sits on the theme's stage; one stretched link keeps a single tab stop. */
export const ProductCard = ({
    product,
    currency,
    className,
    priority,
    titleAs: Title = "h3",
}: ProductCardProps) => {
    const { locale, dictionary } = useI18n();
    const cover = getProductCover(product);
    const category = getProductCategory(product);
    const discount = getDiscountPercent(product);

    return (
        <article
            data-slot="product-card"
            className={cn("group relative flex h-full flex-col", className)}
        >
            <div
                data-slot="stage"
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted"
            >
                {cover ? (
                    <Media
                        resource={cover}
                        fill
                        priority={priority}
                        sizes="(max-width: 768px) 50vw, (max-width: 1440px) 25vw, 18vw"
                        imgClassName="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
                    />
                ) : (
                    <span
                        aria-hidden
                        className="flex h-full items-center justify-center font-display text-5xl text-muted-foreground/40"
                    >
                        {product.title.charAt(0)}
                    </span>
                )}
                {discount && (
                    <Badge className="absolute left-3 top-3">
                        <span className="sr-only">{dictionary.product.discount} </span>−{discount}%
                    </Badge>
                )}
            </div>

            <div className="mt-3.5 flex flex-1 flex-col gap-1.5">
                {category && (
                    <Link
                        data-slot="kicker"
                        href={ROUTES.category(locale, category.slug ?? "")}
                        className="relative z-10 w-fit text-[0.6875rem] leading-none text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {category.title}
                    </Link>
                )}
                <Title
                    data-slot="product-title"
                    className="text-base leading-snug text-balance text-foreground md:text-[1.0625rem]"
                >
                    <Link
                        href={ROUTES.product(locale, product.slug ?? "")}
                        className="after:absolute after:inset-0"
                    >
                        {product.title}
                    </Link>
                </Title>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 pt-1.5">
                    <ProductPrice
                        price={product.price}
                        oldPrice={product.oldPrice}
                        currency={currency}
                    />
                    <ProductAvailabilityBadge availability={product.availability} />
                </div>
            </div>
        </article>
    );
};
