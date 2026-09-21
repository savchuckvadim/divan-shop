import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@workspace/ui/components/container";
import { Heading } from "@workspace/ui/components/heading";
import { Text } from "@workspace/ui/components/text";

import { getArticles } from "@/modules/entities";
import { type Locale, ROUTES } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { generateMeta } from "@/modules/shared/seo";
import { ArticleList, Breadcrumbs, type Crumb } from "@/modules/widgets";

interface BlogPageProps {
    locale: Locale;
    page?: number;
}

const pageHref = (base: string, page: number): string => (page > 1 ? `${base}?page=${page}` : base);

export const BlogPage = async ({ locale, page = 1 }: BlogPageProps) => {
    const { common, blog } = getDictionary(locale);
    const articles = await getArticles({ locale, page });
    const basePath = ROUTES.blog(locale);

    const crumbs: Crumb[] = [
        { label: common.home, href: ROUTES.home(locale) },
        { label: blog.title, href: basePath },
    ];

    return (
        <Container className="py-10">
            <Breadcrumbs items={crumbs} />

            <div className="mt-6 flex flex-col gap-3">
                <Heading as="h1" size="xl">
                    {blog.title}
                </Heading>
                <Text muted className="max-w-[48rem]">
                    {blog.description}
                </Text>
            </div>

            <ArticleList className="mt-10" articles={articles.docs} locale={locale} />

            {articles.totalPages > 1 && (
                <nav
                    className="mt-12 flex items-center justify-center gap-3"
                    aria-label="Pagination"
                >
                    {articles.hasPrevPage && articles.prevPage && (
                        <Button asChild variant="outline">
                            <Link
                                href={pageHref(basePath, articles.prevPage)}
                                rel="prev"
                                aria-label={blog.previousPage}
                            >
                                ←
                            </Link>
                        </Button>
                    )}
                    <span className="text-sm text-muted-foreground">
                        {articles.page} / {articles.totalPages}
                    </span>
                    {articles.hasNextPage && articles.nextPage && (
                        <Button asChild variant="outline">
                            <Link
                                href={pageHref(basePath, articles.nextPage)}
                                rel="next"
                                aria-label={blog.nextPage}
                            >
                                →
                            </Link>
                        </Button>
                    )}
                </nav>
            )}
        </Container>
    );
};

export const generateBlogPageMetadata = async ({
    locale,
    page = 1,
}: BlogPageProps): Promise<Metadata> => {
    const { blog } = getDictionary(locale);
    const meta = generateMeta({
        locale,
        pathFor: (l) => ROUTES.blog(l),
        fallbackTitle: blog.title,
        fallbackDescription: blog.description,
    });
    return page > 1 ? { ...meta, robots: { index: false, follow: true } } : meta;
};
