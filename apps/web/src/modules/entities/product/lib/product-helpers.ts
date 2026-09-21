import type { BadgeProps } from "@workspace/ui/components/badge";

import { isPopulated } from "@/modules/shared/lib";
import type { Media } from "@/payload-types";

import type { Product, ProductAvailability } from "../type/product.type";

export const AVAILABILITY_BADGE: Record<ProductAvailability, NonNullable<BadgeProps["variant"]>> = {
    inStock: "success",
    onRequest: "secondary",
    outOfStock: "outline",
};

export const getProductImages = (product: Product): Media[] =>
    (product.gallery ?? [])
        .map((item) => item.image)
        .filter((image): image is Media => isPopulated(image));

export const getProductCover = (product: Product): Media | undefined =>
    getProductImages(product)[0];

export const getProductCategory = (product: Product) =>
    isPopulated(product.category) ? product.category : null;

export const hasDiscount = (product: Product): boolean =>
    typeof product.oldPrice === "number" && product.oldPrice > product.price;

export const getDiscountPercent = (product: Product): number | null => {
    if (!hasDiscount(product) || !product.oldPrice) return null;
    const percent = Math.round((1 - product.price / product.oldPrice) * 100);
    return percent > 0 ? percent : null;
};
