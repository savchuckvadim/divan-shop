import type { Metadata } from "next";
import { draftMode } from "next/headers";

import { Container } from "@workspace/ui/components/container";
import { Heading } from "@workspace/ui/components/heading";
import { Text } from "@workspace/ui/components/text";
import { Section } from "@workspace/ui/composites/section";

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
        <Container className="py-8 md:py-12">
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
                    image: getOgImageUrl(cover) ?? undefined,
                    datePublished: article.publishedAt,
                    dateModified: article.updatedAt,
                    authorName,
                    publisherName: settings.siteName || SITE.name,
                    inLanguage: LOCALE_INTL[locale],
                })}
            />

            <Breadcrumbs items={crumbs} />

            <article className="mt-8 md:mt-12">
                <header className="mx-auto flex max-w-[65ch] flex-col gap-5">
                    {(article.publishedAt || authorName) && (
                        <Text as="p" eyebrow className="text-primary">
                            {authorName && <span>{authorName}</span>}
                            {authorName && article.publishedAt && <span> · </span>}
                            {article.publishedAt && (
                                <time dateTime={article.publishedAt}>
                                    {interpolate(blog.publishedOn, {
                                        date: formatDate(article.publishedAt, locale),
                                    })}
                                </time>
                            )}
                        </Text>
                    )}
                    <Heading as="h1" size="xl">
                        {article.title}
                    </Heading>
                    {article.excerpt && (
                        <Text className="font-serif text-xl italic leading-relaxed text-muted-foreground md:text-2xl">
                            {article.excerpt}
                        </Text>
                    )}
                </header>

                {cover && (
                    <div className="relative mx-auto mt-10 aspect-[16/9] max-w-[64rem] overflow-hidden rounded-2xl bg-muted shadow-card md:mt-14">
                        <Media
                            resource={cover}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 64rem"
                            imgClassName="object-cover"
                        />
                    </div>
                )}

                {article.content && (
                    <RichText
                        className="mx-auto mt-10 max-w-[65ch] md:mt-14"
                        data={article.content}
                        enableGutter={false}
                    />
                )}
            </article>

            {related.length > 0 && (
                <Section
                    contained={false}
                    padding="md"
                    eyebrow={blog.title}
                    title={blog.related}
                    className="mt-12 border-t border-border/70"
                >
                    <ArticleList articles={related} locale={locale} />
                </Section>
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
        article: {
            publishedTime: article.publishedAt,
            modifiedTime: article.updatedAt,
            authors: [getArticleAuthorName(article)],
        },
    });
};
