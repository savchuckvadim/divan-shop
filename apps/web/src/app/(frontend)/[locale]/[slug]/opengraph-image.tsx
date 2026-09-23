import { getPageBySlug, getSiteSettings } from "@/modules/entities";
import { DEFAULT_LOCALE, isLocale, SITE } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
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

interface OgRouteProps {
    params: Promise<{ locale: string; slug: string }>;
}

export const generateImageMetadata = async ({ params }: OgRouteProps) => {
    const { locale } = await params;
    const safeLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;

    return [{ id: "default", size, contentType, alt: ogImageAlt(safeLocale) }];
};

export default async function CmsPageOgImage({ params }: OgRouteProps) {
    const { locale, slug } = await params;
    const safeLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;

    return renderOgImage(safeLocale, async () => {
        const [page, settings] = await Promise.all([
            getPageBySlug(decodeURIComponent(slug), safeLocale),
            getSiteSettings(safeLocale),
        ]);

        if (!page) return siteOgCard(safeLocale);

        const { common } = getDictionary(safeLocale);

        return {
            eyebrow: common.cityLine,
            title: page.meta?.title || page.title,
            subtitle: page.meta?.description || common.tagline,
            brandName: settings.siteName || common.siteName || SITE.name,
            cityLine: common.cityLine,
        };
    });
}
