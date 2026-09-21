import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@workspace/ui/components/container";

import {
    getCurrency,
    getProducts,
    getProductsByIds,
    getSiteSettings,
    type Product,
} from "@/modules/entities";
import { type Locale, ROUTES } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { relationId } from "@/modules/shared/lib";
import { RichText } from "@/modules/shared/ui";
import { ProductGrid } from "@/modules/widgets/product-grid";
import type { ProductArchiveBlock as ProductArchiveBlockProps } from "@/payload-types";

export const ProductArchiveBlock = async ({
    id,
    locale,
    introContent,
    populateBy,
    categories,
    featuredOnly,
    limit,
    selectedDocs,
    showViewAll,
}: ProductArchiveBlockProps & { id?: string; locale: Locale }) => {
    const settings = await getSiteSettings(locale);
    const { common } = getDictionary(locale);

    let products: Product[] = [];

    if (populateBy === "selection") {
        const ids = (selectedDocs ?? [])
            .map((doc) => relationId(doc))
            .filter((value): value is string | number => value !== undefined);
        products = await getProductsByIds(ids, locale);
    } else {
        const categoryIds = (categories ?? [])
            .map((category) => relationId(category))
            .filter((value): value is string | number => value !== undefined);
        const result = await getProducts({
            locale,
            categoryIds,
            featuredOnly: Boolean(featuredOnly),
            limit: limit || 8,
        });
        products = result.docs;
    }

    return (
        <Container id={id ? `block-${id}` : undefined}>
            {introContent && (
                <RichText
                    className="mb-10 max-w-[48rem]"
                    data={introContent}
                    enableGutter={false}
                />
            )}
            <ProductGrid products={products} currency={getCurrency(settings)} locale={locale} />
            {showViewAll && (
                <div className="mt-10 flex justify-center">
                    <Button asChild variant="outline" size="lg">
                        <Link href={ROUTES.catalog(locale)}>{common.viewAll}</Link>
                    </Button>
                </div>
            )}
        </Container>
    );
};
