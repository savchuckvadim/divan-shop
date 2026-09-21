import { Card } from "@workspace/ui/composites/card";
import { type KeyValueItem, KeyValueList } from "@workspace/ui/composites/key-value";

import type { ProductSpecs as ProductSpecsType } from "@/modules/entities";
import type { Locale } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";

interface ProductSpecsProps {
    specs: ProductSpecsType | null | undefined;
    locale: Locale;
}

export const ProductSpecs = ({ specs, locale }: ProductSpecsProps) => {
    if (!specs) return null;

    const { product } = getDictionary(locale);
    const cm = (value: number | null | undefined) =>
        typeof value === "number" ? `${value} ${product.cm}` : null;

    const rows: [string, string | null | undefined][] = [
        [product.specs.width, cm(specs.width)],
        [product.specs.depth, cm(specs.depth)],
        [product.specs.height, cm(specs.height)],
        [product.specs.sleepingWidth, cm(specs.sleepingWidth)],
        [product.specs.material, specs.material ? product.materials[specs.material] : null],
        [
            product.specs.mechanism,
            specs.mechanism && specs.mechanism !== "none"
                ? product.mechanisms[specs.mechanism]
                : null,
        ],
        [product.specs.color, specs.color],
    ];

    const items: KeyValueItem[] = rows
        .filter(([, value]) => Boolean(value))
        .map(([label, value]) => ({ key: label, label, value }));

    if (!items.length) return null;

    return (
        <Card padding="sm" eyebrow={product.specsTitle} className="bg-card/60">
            <KeyValueList items={items} bordered={false} />
        </Card>
    );
};
