import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getArticleSlugs } from "@/modules/entities";
import { ArticlePage, generateArticlePageMetadata } from "@/modules/pages";
import { isLocale, LOCALES } from "@/modules/shared/config";

interface ArticleRouteProps {
    params: Promise<{ locale: string; slug: string }>;
}

export const generateStaticParams = async () => {
    const slugs = await getArticleSlugs();
    return LOCALES.flatMap((locale) => slugs.map(({ slug }) => ({ locale, slug })));
};

export default async function ArticleRoute({ params }: ArticleRouteProps) {
    const { locale, slug } = await params;
    if (!isLocale(locale)) notFound();

    return <ArticlePage locale={locale} slug={decodeURIComponent(slug)} />;
}

export const generateMetadata = async ({ params }: ArticleRouteProps): Promise<Metadata> => {
    const { locale, slug } = await params;
    if (!isLocale(locale)) return {};

    return generateArticlePageMetadata({ locale, slug: decodeURIComponent(slug) });
};
