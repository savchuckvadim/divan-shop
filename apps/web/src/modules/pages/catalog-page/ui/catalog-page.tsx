import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

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

    const pageLabel = interpolate(common.pageOf, {
        page: products.page ?? page,
        total: products.totalPages,
    });

    return (
        <Container className="py-8 md:py-12">
            <Breadcrumbs items={crumbs} />

            <PageHeader
                className="mt-6"
                eyebrow={interpolate(catalog.productsCount, { count: products.totalDocs })}
                title={category?.title ?? catalog.title}
                description={category?.description || catalog.description}
            />

            <nav
                aria-label={catalog.categories}
                className="-mx-4 mt-8 flex snap-x gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
            >
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

            <ProductGrid
                className="mt-8 md:mt-12"
                titleAs="h2"
                products={products.docs}
                currency={getCurrency(settings)}
                locale={locale}
                emptyDescription={catalog.emptyHint}
                emptyAction={
                    category && (
                        <Button asChild variant="outline">
                            <Link href={ROUTES.catalog(locale)}>{catalog.allCategories}</Link>
                        </Button>
                    )
                }
            />

            {products.totalPages > 1 && (
                <nav
                    className="mt-12 flex items-center justify-center gap-3"
                    aria-label={pageLabel}
                >
                    {products.hasPrevPage && products.prevPage && (
                        <Button asChild variant="outline" size="icon">
                            <Link
                                href={pageHref(basePath, products.prevPage)}
                                rel="prev"
                                aria-label={common.previousPage}
                            >
                                <ChevronLeftIcon aria-hidden />
                            </Link>
                        </Button>
                    )}
                    <span className="text-sm tabular-nums text-muted-foreground">{pageLabel}</span>
                    {products.hasNextPage && products.nextPage && (
                        <Button asChild variant="outline" size="icon">
                            <Link
                                href={pageHref(basePath, products.nextPage)}
                                rel="next"
                                aria-label={common.nextPage}
                            >
                                <ChevronRightIcon aria-hidden />
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
