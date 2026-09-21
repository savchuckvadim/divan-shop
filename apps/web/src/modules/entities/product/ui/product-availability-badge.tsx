"use client";

import { Badge } from "@workspace/ui/components/badge";

import { useI18n } from "@/modules/shared/i18n";

import { AVAILABILITY_BADGE } from "../lib/product-helpers";
import type { ProductAvailability } from "../type/product.type";

export const ProductAvailabilityBadge = ({
    availability,
}: {
    availability: ProductAvailability;
}) => {
    const { dictionary } = useI18n();
    return (
        <Badge variant={AVAILABILITY_BADGE[availability]}>
            {dictionary.product.availability[availability]}
        </Badge>
    );
};
