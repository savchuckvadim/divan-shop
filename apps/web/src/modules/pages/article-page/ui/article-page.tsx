import type { Metadata } from "next";
import { draftMode } from "next/headers";

import { Container } from "@workspace/ui/components/container";
import { Heading } from "@workspace/ui/components/heading";

import {
    getArticleAuthorName,
    getArticleBySlug,
    getArticleCover,
    getArticles,
    getSiteSettings,
} from "@/modules/entities";
import { type Locale, LOCALE_INTL, ROUTES, SITE } from "@/modules/shared/config";
import { getDictionary, interpolate } from "@/modules/shared/i18n";
import { absoluteUrl, formatDate, lexicalToPlainText } from "@/modules/shared/lib";
import { articleJsonLd, generateMeta, getOgImageUrl, JsonLd } from "@/modules/shared/seo";
import { LivePreviewListener, Media, RichText } from "@/modules/shared/ui";
import { PayloadRedirects } from "@/modules/shared/ui/payload-redirects";
import { ArticleList, Breadcrumbs, type Crumb } from "@/modules/widgets";

interface ArticlePageProps {
    locale: Locale;
    slug: string;
}

const RELATED_LIMIT = 3;

export const ArticlePage = async ({ locale, slug }: ArticlePageProps) => {
    const { isEnabled: draft } = await draftMode();
    const [article, settings] = await Promise.all([
        getArticleBySlug(slug, locale, draft),
        getSiteSettings(locale),
    ]);
    const url = `/blog/${slug}`;

    if (!article) {
        return <PayloadRedirects url={url} locale={locale} />;
    }

    const { common, blog } = getDictionary(locale);
    const cover = getArticleCover(article);
    const authorName = getArticleAuthorName(article);
    const related = (await getArticles({ locale, limit: RELATED_LIMIT, excludeIds: [article.id] }))
        .docs;

    const crumbs: Crumb[] = [
        { label: common.home, href: ROUTES.home(locale) },
        { label: blog.title, href: ROUTES.blog(locale) },
        { label: article.title, href: ROUTES.article(locale, slug) },
    ];

    return (
        <Container className="py-10">
            <PayloadRedirects disableNotFound url={url} locale={locale} />
            {draft && <LivePreviewListener />}

            <JsonLd
                data={articleJsonLd({
                    headline: article.title,
                    description:
                        article.meta?.description ||
                        article.excerpt ||
                        lexicalToPlainText(article.content).slice(0, 160),
                    url: absoluteUrl(ROUTES.article(locale, slug)),
                    image: cover ? getOgImageUrl(cover) : undefined,
                    datePublished: article.publishedAt,
                    dateModified: article.updatedAt,
                    authorName,
                    publisherName: settings.siteName || SITE.name,
                    inLanguage: LOCALE_INTL[locale],
                })}
            />

            <Breadcrumbs items={crumbs} />

            <article className="mx-auto mt-8 max-w-[48rem]">
                <header className="flex flex-col gap-4">
                    <Heading as="h1" size="xl">
                        {article.title}
                    </Heading>
                    {(article.publishedAt || authorName) && (
                        <p className="text-sm text-muted-foreground">
                            {authorName && <span>{authorName}</span>}
                            {authorName && article.publishedAt && <span> · </span>}
                            {article.publishedAt && (
                                <time dateTime={article.publishedAt}>
                                    {interpolate(blog.publishedOn, {
                                        date: formatDate(article.publishedAt, locale),
                                    })}
                                </time>
                            )}
                        </p>
                    )}
                    {article.excerpt && (
                        <p className="text-lg text-muted-foreground">{article.excerpt}</p>
                    )}
                </header>

                {cover && (
                    <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
                        <Media
                            resource={cover}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 48rem"
                            imgClassName="object-cover"
                        />
                    </div>
                )}

                {article.content && (
                    <RichText className="mt-10" data={article.content} enableGutter={false} />
                )}
            </article>

            {related.length > 0 && (
                <section className="mt-20">
                    <Heading as="h2" size="md" className="mb-6">
                        {blog.related}
                    </Heading>
                    <ArticleList articles={related} locale={locale} />
                </section>
            )}
        </Container>
    );
};

export const generateArticlePageMetadata = async ({
    locale,
    slug,
}: ArticlePageProps): Promise<Metadata> => {
    const { isEnabled: draft } = await draftMode();
    const article = await getArticleBySlug(slug, locale, draft);
    const { seo } = getDictionary(locale);

    if (!article) {
        return { title: seo.defaultTitle };
    }

    return generateMeta({
        locale,
        pathFor: (l) => ROUTES.article(l, slug),
        meta: {
            title: article.meta?.title,
            description: article.meta?.description,
            image: article.meta?.image ?? article.cover,
        },
        fallbackTitle: article.title,
        fallbackDescription: article.excerpt || undefined,
    });
};
