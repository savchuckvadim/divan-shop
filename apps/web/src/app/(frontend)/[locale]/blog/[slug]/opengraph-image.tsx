import { getArticleBySlug, getSiteSettings } from "@/modules/entities";
import { DEFAULT_LOCALE, isLocale, SITE } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { lexicalToPlainText } from "@/modules/shared/lib";
import {
    OG_CONTENT_TYPE,
    OG_SIZE,
    ogImageAlt,
    renderOgImage,
    siteOgCard,
} from "@/modules/shared/seo/og";

/** Rendered on demand: the Docker image is built without a database (see docs/HISTORY.md). */
export const dynamic = "force-dynamic";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const EXCERPT_LIMIT = 150;

interface OgRouteProps {
    params: Promise<{ locale: string; slug: string }>;
}

export const generateImageMetadata = async ({ params }: OgRouteProps) => {
    const { locale } = await params;
    const safeLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;

    return [{ id: "default", size, contentType, alt: ogImageAlt(safeLocale) }];
};

export default async function ArticleOgImage({ params }: OgRouteProps) {
    const { locale, slug } = await params;
    const safeLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;

    return renderOgImage(safeLocale, async () => {
        const [article, settings] = await Promise.all([
            getArticleBySlug(decodeURIComponent(slug), safeLocale),
            getSiteSettings(safeLocale),
        ]);

        if (!article) return siteOgCard(safeLocale);

        const { common, og } = getDictionary(safeLocale);
        const subtitle =
            article.excerpt ||
            article.meta?.description ||
            lexicalToPlainText(article.content).slice(0, EXCERPT_LIMIT);

        return {
            eyebrow: og.blogEyebrow,
            title: article.title,
            subtitle,
            brandName: settings.siteName || common.siteName || SITE.name,
            cityLine: common.cityLine,
        };
    });
}
