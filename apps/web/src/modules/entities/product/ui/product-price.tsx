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
        <p className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1", className)}>
            <span
                data-slot={size === "lg" ? "cifra" : undefined}
                className={cn(
                    "tabular-nums tracking-tight",
                    size === "lg"
                        ? "font-display text-[clamp(2.25rem,1.6rem+1.6vw,4rem)] font-medium leading-none"
                        : "text-base font-medium"
                )}
            >
                <span className="sr-only">{dictionary.product.price}: </span>
                {formatPrice(price, currency, locale)}
            </span>
            {showOld && (
                <span
                    className={cn(
                        "tabular-nums text-muted-foreground line-through decoration-brand/60",
                        size === "lg" ? "text-lg" : "text-sm"
                    )}
                >
                    <span className="sr-only">{dictionary.product.oldPrice}: </span>
                    {formatPrice(oldPrice, currency, locale)}
                </span>
            )}
        </p>
    );
};
