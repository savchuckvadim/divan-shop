import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@workspace/ui/components/container";
import { PageHeader } from "@workspace/ui/composites/page-header";

import {
    CategoryChip,
    getCategories,
    getCategoryBySlug,
    getCurrency,
    getProducts,
    getSiteSettings,
} from "@/modules/entities";
import { type Locale, ROUTES } from "@/modules/shared/config";
import { getDictionary, interpolate } from "@/modules/shared/i18n";
import { generateMeta } from "@/modules/shared/seo";
import { Breadcrumbs, type Crumb, ProductGrid } from "@/modules/widgets";

interface CatalogPageProps {
    locale: Locale;
    categorySlug?: string;
    page?: number;
}

const pageHref = (base: string, page: number): string => (page > 1 ? `${base}?page=${page}` : base);

export const CatalogPage = async ({ locale, categorySlug, page = 1 }: CatalogPageProps) => {
    const { common, catalog } = getDictionary(locale);

    const [categories, settings, category] = await Promise.all([
        getCategories(locale),
        getSiteSettings(locale),
        categorySlug ? getCategoryBySlug(categorySlug, locale) : Promise.resolve(null),
    ]);

    if (categorySlug && !category) notFound();

    const products = await getProducts({
        locale,
        categoryIds: category ? [category.id] : undefined,
        page,
    });

    const basePath = category
        ? ROUTES.category(locale, category.slug ?? "")
        : ROUTES.catalog(locale);

    const crumbs: Crumb[] = [
        { label: common.home, href: ROUTES.home(locale) },
        { label: common.catalog, href: ROUTES.catalog(locale) },
        ...(category ? [{ label: category.title, href: basePath }] : []),
    ];

    return (
        <Container className="py-10">
            <Breadcrumbs items={crumbs} />

            <PageHeader
                className="mt-6"
                title={category?.title ?? catalog.title}
                description={category?.description || catalog.description}
            />

            <nav aria-label={catalog.categories} className="mt-8 flex flex-wrap gap-2">
                <CategoryChip
                    href={ROUTES.catalog(locale)}
                    label={catalog.allCategories}
                    active={!category}
                />
                {categories.map((item) => (
                    <CategoryChip
                        key={item.id}
                        href={ROUTES.category(locale, item.slug ?? "")}
                        label={item.title}
                        active={category?.id === item.id}
                    />
                ))}
            </nav>

            <p className="mt-8 text-sm text-muted-foreground">
                {interpolate(catalog.productsCount, { count: products.totalDocs })}
            </p>

            <ProductGrid
                className="mt-4"
                products={products.docs}
                currency={getCurrency(settings)}
                locale={locale}
            />

            {products.totalPages > 1 && (
                <nav
                    className="mt-12 flex items-center justify-center gap-3"
                    aria-label="Pagination"
                >
                    {products.hasPrevPage && products.prevPage && (
                        <Button asChild variant="outline">
                            <Link href={pageHref(basePath, products.prevPage)} rel="prev">
                                ←
                            </Link>
                        </Button>
                    )}
                    <span className="text-sm text-muted-foreground">
                        {products.page} / {products.totalPages}
                    </span>
                    {products.hasNextPage && products.nextPage && (
                        <Button asChild variant="outline">
                            <Link href={pageHref(basePath, products.nextPage)} rel="next">
                                →
                            </Link>
                        </Button>
                    )}
                </nav>
            )}
        </Container>
    );
};

export const generateCatalogPageMetadata = async ({
    locale,
    categorySlug,
    page = 1,
}: CatalogPageProps): Promise<Metadata> => {
    const { seo } = getDictionary(locale);
    const category = categorySlug ? await getCategoryBySlug(categorySlug, locale) : null;

    if (categorySlug && !category) {
        return { title: seo.defaultTitle };
    }

    const meta = category
        ? generateMeta({
              locale,
              pathFor: (l) => ROUTES.category(l, categorySlug ?? ""),
              meta: {
                  title: category.meta?.title,
                  description: category.meta?.description,
                  image: category.image,
              },
              fallbackTitle: interpolate(seo.categoryTitle, { title: category.title }),
              fallbackDescription: category.description || seo.catalogDescription,
          })
        : generateMeta({
              locale,
              pathFor: (l) => ROUTES.catalog(l),
              fallbackTitle: seo.catalogTitle,
              fallbackDescription: seo.catalogDescription,
          });

    return page > 1 ? { ...meta, robots: { index: false, follow: true } } : meta;
};
