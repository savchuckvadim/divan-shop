"use client";

import { cn } from "@workspace/ui/lib/utils";

import type { Currency } from "@/modules/shared/config";
import { useI18n } from "@/modules/shared/i18n";
import { formatPrice } from "@/modules/shared/lib";

interface ProductPriceProps {
    price: number;
    oldPrice?: number | null;
    currency: Currency;
    className?: string;
    size?: "md" | "lg";
}

export const ProductPrice = ({
    price,
    oldPrice,
    currency,
    className,
    size = "md",
}: ProductPriceProps) => {
    const { locale, dictionary } = useI18n();
    const showOld = typeof oldPrice === "number" && oldPrice > price;

    return (
        <p className={cn("flex flex-wrap items-baseline gap-x-3", className)}>
            <span className={cn("font-semibold", size === "lg" ? "text-3xl" : "text-lg")}>
                <span className="sr-only">{dictionary.product.price}: </span>
                {formatPrice(price, currency, locale)}
            </span>
            {showOld && (
                <span className="text-muted-foreground line-through">
                    <span className="sr-only">{dictionary.product.oldPrice}: </span>
                    {formatPrice(oldPrice, currency, locale)}
                </span>
            )}
        </p>
    );
};
