import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticlePage, generateArticlePageMetadata } from "@/modules/pages";
import { isLocale } from "@/modules/shared/config";

/**
 * Rendered on demand and cached: the Docker image is built without a database
 * (see docs/HISTORY.md). Payload hooks call revalidatePath on publish.
 */
export const dynamic = "force-dynamic";

interface ArticleRouteProps {
    params: Promise<{ locale: string; slug: string }>;
}

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
