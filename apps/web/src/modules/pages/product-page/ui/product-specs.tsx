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

    const filled = rows.filter(([, value]) => Boolean(value));
    if (!filled.length) return null;

    return (
        <dl className="divide-y divide-border rounded-xl border border-border">
            {filled.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 px-4 py-3 text-sm">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                </div>
            ))}
        </dl>
    );
};
